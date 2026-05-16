# WeLink Architecture — Fire-and-Forget / Receive-Webhook Pattern

---
paths:
  - "lib/inngest/functions/welink/**/*.ts"
  - "lib/we-link/**/*.ts"
  - "app/api/webhooks/we-link/**/*.ts"
  - "lib/inngest/functions/welink.webhook.dispatcher.function.ts"
---

WeLink is an async LinkedIn automation API. **Every API call queues work and returns a `requestId`. Results always arrive via webhook — never synchronously.** This is the single most important thing to understand when working with WeLink code.

---

## The Two-Phase Pattern

Every WeLink operation is split across two completely separate Inngest functions:

```
Phase 1 — Request Handler
  Inngest event fires
    → handler calls WeLink API
    → extracts request_id from response
    → stores request_id on the contact (welink_requests array) for webhook correlation
    → handler exits immediately

  WeLink processes the request asynchronously (seconds to minutes later)

Phase 2 — Webhook Handler
  WeLink POSTs result to /api/webhooks/we-link
    → webhook route validates and emits WELINK_WEBHOOK_RECEIVED
    → welink.webhook.dispatcher.function.ts routes to the correct typed Inngest event
    → a separate handler picks up that event and does the actual work
```

**There is no `step.waitForEvent()` in this codebase.** The two phases are entirely disconnected. Do not attempt to couple them.

---

## Request ID Tracking

All WeLink results are correlated to campaign contacts via `request_id`. When a request handler calls the WeLink API:

1. The API response contains a `request_id` (may be `requestId`, `requestID`, or `request_id` — use `extractWeLinkRequestId(response)`)
2. The handler appends it to `contact.welink_requests[]` via `campaignContactService.appendWeLinkRequestByExternalIds()`
3. When the webhook arrives, the dispatcher emits a typed event containing the `request_id`
4. The webhook handler finds the contact via `campaignContactService.findByWeLinkRequestId(request_id)`

**Primary lookup always uses `request_id`.** Profile-ID-based fallback exists for legacy contacts only.

---

## Inngest Event Map

### Request Events (Phase 1 triggers)

| Inngest Event | File | What it does |
|---|---|---|
| `welink.connection.request/requested` | `connection.request.handler.ts` | Calls `/connect` API, marks message "sending", stores request_id |
| `welink.connection.status.check/requested` | `connection.status.check.handler.ts` | Calls `/get_connection_status` API, stores request_id |
| `welink.message/requested` | (message request handler) | Calls `/send_message_to_profile_id` API, marks message "sending", stores request_id |
| `welink.connection.poll/requested` | `connection.status.poll.handler.ts` | Fan-out: emits `welink.connection.status.check/requested` per pending contact |

### Cron Events (Schedulers)

| Inngest Function | Schedule | What it does |
|---|---|---|
| `connection.status.poll.function.ts` | `0 7,19 * * *` (07:00 and 19:00 UTC) | Finds all `connection_status: "pending"` contacts, emits per-user poll events |

### Webhook Events (Phase 2 triggers — emitted by dispatcher)

| Inngest Event | File | Trigger |
|---|---|---|
| `welink.connection.request/sent` | `connection.sent.handler.ts` | WeLink confirms `/connect` webhook |
| `welink.connection.status/received` | `connection.status.received.handler.ts` | WeLink confirms `/get_connection_status` webhook |
| `welink.connection/accepted` | `connection.accepted.handler.ts` | WeLink pushes connection accepted webhook |
| `welink.message/sent` | (message sent handler) | WeLink confirms `/send_message_to_profile_id` webhook |
| `welink.message/received` | (message received handler) | WeLink pushes inbound reply webhook |

### Dispatcher

`lib/inngest/functions/welink.webhook.dispatcher.function.ts` — receives all WeLink webhooks, routes by `event_type` (the WeLink API path) to typed Inngest events.

---

## Status Lifecycle

### connection_status (on campaign_contacts document)

| From | To | When | Handler |
|---|---|---|---|
| any | `"pending"` | WeLink confirms connection request was sent (webhook) | `connection.sent.handler.ts` — `step.run("mark-connection-pending")` |
| any | `"pending"` | Status check returns PENDING | `connection.status.received.handler.ts` — `updateConnectionStatus()` |
| any | `"connected"` | WeLink confirms already connected on send attempt | `connection.sent.handler.ts` — `update-already-connected-status` step |
| any | `"connected"` | Connection accepted webhook arrives | `connection.accepted.handler.ts` |
| any | `"connected"` | Status check returns ALREADY_CONNECTED | `connection.status.received.handler.ts` |
| any | `"withdrawn"` | Status check returns NOT_CONNECTED / DECLINED | `connection.status.received.handler.ts` |
| any | `"unresponsive"` | Status check returns UNRESPONSIVE | `connection.status.received.handler.ts` |

**Status mapper:** `lib/inngest/utils/welink.status.mapper.ts` → `mapWeLinkConnectionStatus()`
- `ALREADY_CONNECTED` / `CONNECTED` / `ACCEPTED` → `"connected"`
- `PENDING` → `"pending"`
- `NOT_CONNECTED` / `DECLINED` → `"withdrawn"`
- `UNRESPONSIVE` → `"unresponsive"`
- anything else → `"none"`

### message status (on campaign_messages document)

| From | To | When | Where |
|---|---|---|---|
| `"pending_schedule"` | `"sending"` | Connection request Inngest handler fires | `connection.request.handler.ts` step `mark-sending` |
| `"sending"` | `"sent"` | WeLink confirms request was sent (webhook) | `connection.sent.handler.ts` via `messageTransitionService` |
| `"sending"` | `"failed"` | WeLink webhook returns failure | `connection.sent.handler.ts` via `messageTransitionService` |
| `"failed"` | `"sent"` | Status check reveals connection was actually sent | `connection.status.received.handler.ts` step `clear-failed-connection` |

### UI display mapping (campaign.recipients.helper.ts)

| `connection_status` | UI label |
|---|---|
| `"pending"` | **Awaiting Acceptance** |
| `"connected"` | **Connected** |
| `"withdrawn"` | **Invite Withdrawn** |
| `"unresponsive"` | **No Response** |
| `"none"` / undefined | Falls through to message status — shows "Pending Schedule", "Sending", etc. |

---

## Key Design Rules

**DO:**
- Each handler does exactly one unit of work (fire-and-forget)
- Always store `request_id` before exiting Phase 1 (webhook won't correlate otherwise)
- Update `connection_status` and message status as independent `step.run()` calls — they can fail independently
- Use `mapWeLinkConnectionStatus()` as the single source of truth for status mapping
- Use `extractWeLinkRequestId(response)` — WeLink returns request_id in multiple formats

**DON'T:**
- Never read `response.data?.status` from the initial API response as a connection status — that's the request queue status, not the LinkedIn connection status
- Never use `step.waitForEvent()` for WeLink flows — the phases are disconnected by design
- Never poll `/get_response` — webhook delivery is the standard; polling is a manual fallback only
- Never update `connection_status` as a side effect of message status transition — they are independent concerns

---

## File Locations

```
lib/inngest/functions/welink/
  connection.request.handler.ts       # Phase 1: sends connection request
  connection.sent.handler.ts          # Phase 2: processes connection sent webhook
  connection.accepted.handler.ts      # Phase 2: processes connection accepted webhook
  connection.status.check.handler.ts  # Phase 1: triggers status check
  connection.status.received.handler.ts # Phase 2: processes status check webhook
  connection.status.poll.handler.ts   # Cron fan-out: emits check events per contact
  connection.status.poll.function.ts  # Cron scheduler (07:00 and 19:00 UTC)

lib/inngest/functions/welink.webhook.dispatcher.function.ts  # Routes all webhooks

lib/inngest/utils/welink.status.mapper.ts  # mapWeLinkConnectionStatus()
lib/we-link/types.ts                       # extractWeLinkRequestId(), response types
lib/we-link/services/we-link.service.ts    # weLinkService — all API calls
lib/we-link/webhook.schemas.ts             # WE_LINK_EVENTS constants, Zod schemas

app/api/webhooks/we-link/route.ts          # Webhook entry point
```
