# Event-Driven Architecture Patterns

Detailed implementation patterns for building event-driven systems with Inngest.

## Pattern 1: Webhook-Driven Chain

The core pattern where each webhook triggers the next step:

```
COMMAND → API call → WEBHOOK → HANDLER → emit COMMAND → API call → WEBHOOK → ...
```

### Implementation

```typescript
// Step 1: Initial trigger (from campaign activation)
await inngest.send({
  name: EventNameEnum.PROFILE_DETAILS_REQUESTED,
  data: { contact_id, linkedin_url, campaign_id, user_id, org_id },
});

// Step 2: Command handler calls async API
// profile.details.request.handler.ts
async ({ event, step }) => {
  const result = await step.run("call-api", () =>
    weLinkService.getProfileDetailsAsync(event.data)
  );
  return { awaiting_webhook: true, request_id: result.request_id };
};

// Step 3: Webhook arrives, dispatcher emits typed event
// webhook.dispatcher.ts
await step.sendEvent("dispatch", {
  name: EventNameEnum.PROFILE_DETAILS_RECEIVED,
  data: { profile_id, status, request_id, ...context },
});

// Step 4: Webhook handler processes and chains to next command
// profile.details.received.handler.ts
async ({ event, step }) => {
  await step.run("save", () => repository.saveProfileId(profile_id));
  await step.sendEvent("next", {
    name: EventNameEnum.CONNECTION_REQUEST_REQUESTED,
    data: { profile_id, contact_id },
  });
};
```

## Pattern 2: Idempotent Webhook Handlers

**Critical:** Webhook handlers MUST be idempotent to handle retries and duplicates.

### Using Inngest Idempotency Key

```typescript
export const messageSentHandler = inngest.createFunction(
  {
    id: "message-sent-handler",
    retries: 2,
    // Prevent duplicate processing of same webhook
    idempotency: "event.data.request_id",
  },
  { event: EventNameEnum.MESSAGE_SENT },
  async ({ event, step }) => {
    // This will only run once per request_id, even if event is emitted multiple times
    await step.run("update-status", async () => {
      await campaignRepository.updateByIdWithArrayFilters(
        campaign_id,
        { $set: { "...messages.$[msg].status": "sent" } },
        [{ "msg.step_number": step_number }]
      );
    });
  }
);
```

### Composite Idempotency Key

```typescript
{
  // For events without unique request_id
  idempotency: "event.data.profile_id + '-' + event.data.accepted_at",
}
```

### Check-Before-Update (Additional Safety)

```typescript
await step.run("update-if-not-processed", async () => {
  const result = await repository.updateOne(
    { _id: id, status: { $ne: "sent" } }, // Only update if not already sent
    { $set: { status: "sent" } }
  );
  return result.modifiedCount > 0;
});
```

## Pattern 3: Webhook-Driven Retry

Retries happen in the webhook result handler, NOT the command handler.

```typescript
// profile.details.received.handler.ts
const MAX_RETRIES = 3;

async ({ event, step }) => {
  const { status, error_message, retry_count = 0 } = event.data;

  if (status === "failed") {
    if (retry_count < MAX_RETRIES) {
      // Re-emit the COMMAND with incremented retry count
      await step.sendEvent("retry", {
        name: EventNameEnum.PROFILE_DETAILS_REQUESTED,
        version: "1.0.0",
        data: {
          ...event.data,
          retry_count: retry_count + 1,
        },
      });
      return { action: "retry_requested", retry_count: retry_count + 1 };
    }

    // Max retries exceeded - mark as permanently failed
    await step.run("mark-failed", async () => {
      await repository.updateStatus(contact_id, "failed", {
        error_message: `Failed after ${MAX_RETRIES} retries: ${error_message}`,
      });
    });
    return { action: "marked_failed", error_message };
  }

  // Success path...
};
```

## Pattern 4: Correlation by Profile ID

When webhooks don't include tracking data, correlate via result.profile_id.

```typescript
// webhook.dispatcher.ts
async ({ event, step }) => {
  const { result, event_type } = event.data;
  const profileId = result?.profile_id;

  if (!profileId) {
    return { dispatched: false, reason: "no_profile_id" };
  }

  // Look up contact by profile_id to get context
  const context = await step.run("correlate", async () => {
    const contacts =
      await partnerContactService.findByWeLinkProfileIdGlobal(profileId);
    if (contacts.length === 0) return null;

    const contact = contacts[0]; // profile_id unique per person
    return {
      partner_contact_id: contact.id,
      linkedin_url: contact.linkedin_url,
      user_id: contact.user_id,
      org_id: contact.org_id,
    };
  });

  if (!context) {
    return { dispatched: false, reason: "contact_not_found" };
  }

  // Dispatch with correlated context
  await step.sendEvent("dispatch", {
    name: EventNameEnum.PROFILE_DETAILS_RECEIVED,
    data: { ...result, ...context },
  });
};
```

## Pattern 5: Connection Acceptance Polling (No Native Webhook)

When external service doesn't provide webhooks for certain events, use polling.

```typescript
// connection.status.poll.function.ts
export const connectionStatusPollFunction = inngest.createFunction(
  {
    id: "connection-status-poll",
    name: "Connection Status Poll (Daily)",
  },
  { cron: "0 0 * * *" }, // Daily at midnight
  async ({ step }) => {
    // Step 1: Find pending connections
    const pendingConnections = await step.run("find-pending", async () => {
      return await repository.findPendingConnections({
        maxAge: 30, // days
        limit: 50, // Rate limit protection
      });
    });

    // Step 2: Check each connection
    const results = { checked: 0, accepted: 0, declined: 0 };

    for (const connection of pendingConnections) {
      const status = await step.run(`check-${connection.id}`, async () => {
        // Add delay for rate limiting
        await sleep(2000);
        return await externalService.getConnectionStatus(
          connection.profile_url
        );
      });

      results.checked++;

      if (status === "connected") {
        // Emit event for downstream handlers
        await step.sendEvent(`accept-${connection.id}`, {
          name: EventNameEnum.CONNECTION_ACCEPTED,
          data: {
            profile_id: connection.profile_id,
            linkedin_url: connection.linkedin_url,
            user_id: connection.user_id,
            org_id: connection.org_id,
            accepted_at: new Date().toISOString(),
          },
        });
        results.accepted++;
      } else if (status === "not_connected") {
        await step.run(`decline-${connection.id}`, async () => {
          await repository.updateStatus(connection.id, "declined");
        });
        results.declined++;
      }
    }

    return results;
  }
);
```

## Pattern 6: Fan-Out from Acceptance Event

When connection is accepted, trigger all pending follow-up messages.

```typescript
// connection.accepted.handler.ts
async ({ event, step }) => {
  const { profile_id, org_id } = event.data;

  // Step 1: Update connection status
  await step.run("update-status", async () => {
    await repository.updateContactConnectionStatus(profile_id, "connected");
  });

  // Step 2: Find pending Step 2+ messages
  const pendingMessages = await step.run("find-pending", async () => {
    const campaigns = await campaignRepository.findWithProfileId(
      org_id,
      profile_id,
      ["active"]
    );
    const messages = [];

    for (const campaign of campaigns) {
      for (const partner of campaign.campaign_partners || []) {
        for (const contact of partner.contacts || []) {
          if (contact.welink_profile_id !== profile_id) continue;

          for (const message of contact.messages || []) {
            const isStep2Plus = (message.step_number || 1) > 1;
            const isPending = message.status === "awaiting_connection";
            const isLinkedIn = message.type === "linkedin_message";

            if (isStep2Plus && isPending && isLinkedIn) {
              messages.push({
                campaign_id: campaign._id.toString(),
                partner_id: partner.partner_id,
                contact_id: contact.contact_id,
                step_number: message.step_number,
                message_content: message.content,
                profile_id,
              });
            }
          }
        }
      }
    }
    return messages;
  });

  // Step 3: Emit message requests (fan-out)
  if (pendingMessages.length > 0) {
    await step.run("emit-messages", async () => {
      for (const msg of pendingMessages) {
        await inngest.send({
          name: EventNameEnum.MESSAGE_REQUESTED,
          data: msg,
        });
      }
    });
  }

  return { accepted: true, messages_queued: pendingMessages.length };
};
```

## Pattern 7: Thin Webhook Route

The webhook HTTP route should be minimal - just emit an event.

```typescript
// app/api/webhooks/integration/route.ts
export const POST = withNoAuth(
  withDB(async (req: NextRequest) => {
    const body = await req.json();

    // Validate webhook payload
    const parseResult = safeParseWebhookPayload(body);
    if (!parseResult.success) {
      console.error("Invalid webhook payload");
      return NextResponse.json({ success: true }, { status: 200 }); // Always 200 for webhooks
    }

    // Emit event - ALL business logic happens in Inngest
    await inngest.send({
      name: EventNameEnum.WEBHOOK_RECEIVED,
      data: {
        request_id: extractRequestId(parseResult.data),
        event_type: parseResult.data.event,
        status: normalizeStatus(parseResult.data.status),
        result: parseResult.data.result,
        received_at: new Date().toISOString(),
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  })
);
```

## Pattern 8: Dev Mode Mocking

Support development without hitting real APIs.

```typescript
async ({ event, step }) => {
  const result = await step.run("call-api", async () => {
    if (!isRealMode()) {
      console.log(`[DEV MODE] Mocking API call for ${linkedin_url}`);
      return {
        request_id: `mock-request-${Date.now()}`,
        mock: true,
      };
    }

    return await realService.callApi(params);
  });
};
```

## Pattern 9: Atomic Status Updates

Never use read-then-write for shared state.

```typescript
// ✅ GOOD: Atomic update with array filters
await campaignRepository.updateByIdWithArrayFilters(
  campaign_id,
  {
    $set: {
      "campaign_partners.$[partner].contacts.$[contact].messages.$[msg].status":
        "sent",
      "campaign_partners.$[partner].contacts.$[contact].messages.$[msg].sent_at":
        new Date(),
    },
  },
  [
    { "partner.partner_id": partner_id },
    { "contact.contact_id": contact_id },
    { "msg.step_number": step_number },
  ]
);

// ❌ BAD: Read-then-write (race condition)
const campaign = await campaignRepository.findById(campaign_id);
campaign.messages[0].status = "sent";
await campaign.save();
```

## Pattern 10: Toast Notifications

Notify user of real-time events.

```typescript
import { userChannel } from "@/shared/inngest/channels/user.channel";

async ({ event, step, publish }) => {
  // ... handler logic ...

  // Step: Publish toast
  await step.run("publish-notification", async () => {
    await publish(
      userChannel(user_id).toast({
        id: `connection-accepted-${profile_id}-${Date.now()}`,
        title: "Connection Accepted",
        message: `${first_name} accepted your LinkedIn connection request`,
        color: "green",
        autoClose: 5000,
      })
    );
  });
};
```

## Testing Patterns

### Unit Test Structure

```typescript
describe("profile.details.received.handler", () => {
  const mockStep = {
    run: jest.fn().mockImplementation((name, fn) => fn()),
    sendEvent: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should save profile_id and emit connection request on success", async () => {
    const event = {
      data: {
        status: "success",
        profile_id: "ACoAAAEBlL0B...",
        contact_id: "contact-123",
        campaign_id: "campaign-456",
      },
    };

    await handler({ event, step: mockStep });

    expect(mockStep.run).toHaveBeenCalledWith(
      "save-profile-id",
      expect.any(Function)
    );
    expect(mockStep.sendEvent).toHaveBeenCalledWith("emit-connection-request", {
      name: EventNameEnum.CONNECTION_REQUEST_REQUESTED,
      version: "1.0.0",
      data: expect.objectContaining({ profile_id: "ACoAAAEBlL0B..." }),
    });
  });

  it("should retry on failure when retry_count < 3", async () => {
    const event = {
      data: {
        status: "failed",
        error_message: "API error",
        retry_count: 1,
      },
    };

    const result = await handler({ event, step: mockStep });

    expect(mockStep.sendEvent).toHaveBeenCalledWith("retry-profile-request", {
      name: EventNameEnum.PROFILE_DETAILS_REQUESTED,
      version: "1.0.0",
      data: expect.objectContaining({ retry_count: 2 }),
    });
    expect(result.action).toBe("retry_requested");
  });

  it("should mark as failed when retry_count >= 3", async () => {
    const event = {
      data: {
        status: "failed",
        retry_count: 3,
      },
    };

    const result = await handler({ event, step: mockStep });

    expect(mockStep.run).toHaveBeenCalledWith(
      "mark-message-failed",
      expect.any(Function)
    );
    expect(result.action).toBe("marked_failed");
  });
});
```

## Composability: Building Blocks

The power of this architecture: handlers become building blocks.

```
┌───────────────────────────────────────────────────────────────┐
│ AIRSTRIDE EVENT FABRIC                                        │
│                                                               │
│ Subscribe to:                                                 │
│ • welink.profile.details/received                             │
│ • welink.connection/accepted                                  │
│ • welink.message/sent                                         │
│                                                               │
│ Without knowing ANYTHING about WeLink's quirks.               │
│ WeLink becomes just another sensor in the system.             │
└───────────────────────────────────────────────────────────────┘

// Future: CRM integration
onEvent(EventNameEnum.WELINK_CONNECTION_ACCEPTED, async (event) => {
  await crmService.logActivity(event.data.profile_id, "linkedin_connected");
});

// Future: Analytics
onEvent(EventNameEnum.WELINK_MESSAGE_SENT, async (event) => {
  await analyticsService.trackOutreach(event.data);
});
```

This is how you turn integrations into infrastructure.
