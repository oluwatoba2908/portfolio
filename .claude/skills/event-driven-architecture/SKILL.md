---
name: event-driven-architecture
description: Expert guidance for building event-driven systems with Inngest. Use when creating background jobs, webhook handlers, async workflows, campaign flows, or refactoring monolithic functions into lightweight event-driven handlers.
---

# Event-Driven Architecture with Inngest

Expert skill for designing and implementing event-driven systems using Inngest. Focuses on lightweight handlers, webhook-driven chains, and the events-vs-commands pattern.

## Core Philosophy

**Every webhook is an event. Every async call is a command. Never mix the two.**

The mental model:

```
COMMAND → call async API → WEBHOOK arrives → HANDLER processes → emit next COMMAND
```

## Lightweight Handler Rule

**Each handler does ONE job with 2-3 steps maximum.**

```typescript
// ✅ GOOD: Single responsibility (~40 lines)
export const profileDetailsRequestHandler = inngest.createFunction(
  { id: "welink-profile-details-request-handler", retries: 2 },
  { event: EventNameEnum.WELINK_PROFILE_DETAILS_REQUESTED },
  async ({ event, step }) => {
    const { user_id, org_id, contact_id, linkedin_url } = event.data;

    // Step 1: Call async API
    const result = await step.run("call-welink-api", async () => {
      return await weLinkService.getProfileDetailsAsync(
        user_id,
        org_id,
        contact_id,
        linkedin_url
      );
    });

    // Done. Webhook will arrive at PROFILE_DETAILS_RECEIVED
    return {
      success: true,
      request_id: result.request_id,
      awaiting_webhook: true,
    };
  }
);

// ❌ BAD: 990+ lines doing profile resolution + connection + message + status updates
```

## Event Taxonomy

### Naming Convention

Events represent **facts that happened**:

```
[integration].[entity].[action]/[qualifier]
```

| Pattern                    | Example                            | Type                         |
| -------------------------- | ---------------------------------- | ---------------------------- |
| Command (internal trigger) | `welink.profile.details/requested` | We're asking for something   |
| Event (webhook result)     | `welink.profile.details/received`  | Something happened           |
| Event (external action)    | `welink.connection/accepted`       | External actor did something |

### Event Types Example (WeLink Flow)

```typescript
enum EventNameEnum {
  // Commands (internal triggers)
  WELINK_PROFILE_DETAILS_REQUESTED = "welink.profile.details/requested",
  WELINK_CONNECTION_REQUEST_REQUESTED = "welink.connection.request/requested",
  WELINK_MESSAGE_REQUESTED = "welink.message/requested",

  // Events (webhook results)
  WELINK_PROFILE_DETAILS_RECEIVED = "welink.profile.details/received",
  WELINK_CONNECTION_REQUEST_SENT = "welink.connection.request/sent",
  WELINK_MESSAGE_SENT = "welink.message/sent",

  // Events (external actions)
  WELINK_CONNECTION_ACCEPTED = "welink.connection/accepted",
  WELINK_MESSAGE_REPLY_RECEIVED = "welink.message.reply/received",
}
```

## Handler Types

### 1. Command Handler (Triggers API Call)

```typescript
// Trigger: Internal command event
// Output: API call (async), then waits for webhook
export const connectionRequestHandler = inngest.createFunction(
  {
    id: "connection-request-handler",
    retries: 2,
    concurrency: { limit: 5, key: "event.data.org_id" },
  },
  { event: EventNameEnum.CONNECTION_REQUEST_REQUESTED },
  async ({ event, step }) => {
    const { profile_id, contact_id, user_id, org_id } = event.data;

    // Step 1: Update status to "sending"
    await step.run("mark-sending", async () => {
      await repository.updateStatus(contact_id, "sending");
    });

    // Step 2: Call async API
    const result = await step.run("call-api", async () => {
      return await externalService.sendConnectionRequest(profile_id);
    });

    // Done. Webhook will trigger CONNECTION_SENT handler
    return {
      success: true,
      request_id: result.request_id,
      awaiting_webhook: true,
    };
  }
);
```

### 2. Webhook Result Handler (Processes Webhook)

```typescript
// Trigger: Webhook event (via dispatcher)
// Output: Updates state, may emit next command
export const profileDetailsReceivedHandler = inngest.createFunction(
  {
    id: "profile-details-received-handler",
    retries: 2,
    idempotency: "event.data.request_id", // Critical: prevent duplicate processing
  },
  { event: EventNameEnum.PROFILE_DETAILS_RECEIVED },
  async ({ event, step }) => {
    const {
      status,
      profile_id,
      contact_id,
      campaign_id,
      retry_count = 0,
    } = event.data;

    // Handle failure with retry
    if (status === "failed") {
      if (retry_count < 3) {
        await step.sendEvent("retry", {
          name: EventNameEnum.PROFILE_DETAILS_REQUESTED,
          data: { ...event.data, retry_count: retry_count + 1 },
        });
        return { success: false, action: "retry_requested" };
      }
      return { success: false, action: "max_retries_exceeded" };
    }

    // Step 1: Save result
    await step.run("save-profile-id", async () => {
      await repository.saveProfileId(contact_id, profile_id);
    });

    // Step 2: Chain to next command
    await step.sendEvent("emit-next", {
      name: EventNameEnum.CONNECTION_REQUEST_REQUESTED,
      data: { profile_id, contact_id, campaign_id },
    });

    return { success: true, chained_to: "connection_request" };
  }
);
```

### 3. Webhook Dispatcher (Thin Translation Layer)

```typescript
// Receives raw webhook → validates → emits typed event
// NO business logic, just translation
export const webhookDispatcher = inngest.createFunction(
  {
    id: "webhook-dispatcher",
    retries: 3,
    idempotency: "event.data.request_id",
  },
  { event: EventNameEnum.WEBHOOK_RECEIVED },
  async ({ event, step }) => {
    const { event_type, status, result, request_id } = event.data;

    // Correlate: Find context from profile_id or request_id
    const context = await step.run("correlate", async () => {
      return await correlationService.findByProfileId(result.profile_id);
    });

    // Dispatch to appropriate handler
    switch (event_type) {
      case "PROFILE_DETAILS":
        await step.sendEvent("dispatch", {
          name: EventNameEnum.PROFILE_DETAILS_RECEIVED,
          data: { ...result, ...context, status, request_id },
        });
        break;
      // ... other event types
    }

    return { dispatched: true, event_type };
  }
);
```

## Key Patterns

### Idempotency (CRITICAL)

```typescript
{
  // Use request_id for webhook handlers
  idempotency: "event.data.request_id",

  // Or composite key for unique operations
  idempotency: "event.data.profile_id + '-' + event.data.accepted_at",
}
```

### Concurrency Control

```typescript
{
  concurrency: {
    limit: 5,
    key: "event.data.org_id", // Per-organization limit
  },
}
```

### Webhook-Driven Retry

```typescript
// In webhook result handler (NOT in command handler)
if (status === "failed" && retry_count < MAX_RETRIES) {
  await step.sendEvent("retry", {
    name: EventNameEnum.ORIGINAL_COMMAND,
    data: { ...originalData, retry_count: retry_count + 1 },
  });
  return { action: "retry_requested" };
}
```

### Correlation Strategy

```typescript
// For webhooks without request tracking:
// 1. Include profile_id in all webhook payloads
// 2. Look up contact by profile_id to get org/user context
const context = await step.run("correlate", async () => {
  const contacts = await service.findByProfileId(profileId);
  return contacts[0]; // profile_id should be unique per person
});
```

## File Structure

```
lib/inngest/functions/[integration]/
├── profile.details.request.handler.ts    # Command: triggers API
├── profile.details.received.handler.ts   # Event: processes webhook
├── connection.request.handler.ts         # Command: triggers API
├── connection.sent.handler.ts            # Event: processes webhook
├── connection.accepted.handler.ts        # Event: external action
├── message.request.handler.ts            # Command: triggers API
├── message.sent.handler.ts               # Event: processes webhook
├── message.reply.received.handler.ts     # Event: external action
├── connection.status.poll.function.ts    # Cron: polling fallback
└── index.ts                              # Exports all handlers
```

## Anti-Patterns to Avoid

| Anti-Pattern                    | Problem                         | Solution                                 |
| ------------------------------- | ------------------------------- | ---------------------------------------- |
| Monolithic handlers             | Hard to test, maintain, debug   | Split into 2-3 step handlers             |
| Throttle queues in chain        | Actions queue behind each other | Webhook-driven chain, no shared throttle |
| Business logic in webhook route | Not replayable                  | Emit event, handle in Inngest            |
| Read-then-write for status      | Race conditions                 | Atomic MongoDB updates                   |
| Retries in command handler      | Retries wrong step              | Retry in webhook result handler          |

## Flow Diagram Example

```
┌─────────────────────────────────────────────────────────────────┐
│  Campaign starts → emit PROFILE_DETAILS_REQUESTED               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  profile.details.request.handler                                │
│  • Call WeLink API async                                        │
│  • Done (awaiting webhook)                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (webhook arrives)
┌─────────────────────────────────────────────────────────────────┐
│  WEBHOOK_RECEIVED → dispatcher → PROFILE_DETAILS_RECEIVED       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  profile.details.received.handler                               │
│  • Save profile_id                                              │
│  • Emit CONNECTION_REQUEST_REQUESTED                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (chain continues...)
```

## Checklist for New Event-Driven Flow

- [ ] Define events (commands + webhook results) in `event.types.ts`
- [ ] Create command handlers (≤50 lines each)
- [ ] Create webhook result handlers with idempotency keys
- [ ] Update webhook dispatcher for new event types
- [ ] Add correlation strategy (profile_id or request tracking)
- [ ] Implement retry logic in webhook handlers (not command handlers)
- [ ] Add concurrency limits per org/user
- [ ] Write unit tests for each handler

## Additional Resources

- [PATTERNS.md](PATTERNS.md) - Detailed implementation patterns
- [docs/INNGEST.md](../../../docs/INNGEST.md) - Full Inngest guide
- [WeLink Event Architecture PRD](../../../docs/prds/02-02-26/welink-event-driven-architecture.md)
