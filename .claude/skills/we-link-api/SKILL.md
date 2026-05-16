---
name: we-link-api
description: WeLink LinkedIn automation API reference. Use when integrating with WeLink API, implementing LinkedIn automation, handling WeLink webhooks, sending connection requests, sending messages, or debugging WeLink API issues.
---

# WeLink API Reference

Complete API documentation for WeLink LinkedIn automation integration.

## Quick Reference

**Base URL:** `https://api.we-link.ai/api/v1`

### Authentication Headers

```json
{
  "x-api-key": "YOUR_API_KEY",
  "x-api-secret": "YOUR_API_SECRET",
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

### Rate Limits

| Type            | Limit             | Window           |
| --------------- | ----------------- | ---------------- |
| Global          | 100 requests/hour | 60-minute window |
| Message Syncing | 150 requests/hour | 60-minute window |

## CRITICAL: ALL Endpoints are ASYNC

**Every WeLink API endpoint** (except `/me` and `/get_response`) is **ASYNCHRONOUS**.

When you call any endpoint:
1. The API returns immediately with a `requestID` and status `"QUEUED"` or `"PROCESSING"`
2. The actual result is delivered later via **webhook callback**
3. You can also poll status using `/get_response` with the requestID

**This means:** Never update database statuses immediately after calling a WeLink API.
Instead, store the `request_id` and wait for the webhook to confirm the result.

### Async Endpoints (ALL return requestID, deliver via webhook)

| Endpoint                       | Webhook event_type                     | Purpose                    |
| ------------------------------ | -------------------------------------- | -------------------------- |
| `/login_v2`                    | `/api/v1/login_v2`                     | Login to LinkedIn          |
| `/get_profile_details`         | `/api/v1/get_profile_details`          | Get profile by URL         |
| `/get_profile_contact_details` | `/api/v1/get_profile_contact_details`  | Get contact info           |
| `/connect`                     | `/api/v1/connect`                      | Send connection request    |
| `/get_connection_status`       | `/api/v1/get_connection_status`        | Check connection status    |
| `/withdraw_invite`             | `/api/v1/withdraw_invite`              | Withdraw pending invite    |
| `/send_message_to_profile_id`  | `/api/v1/send_message_to_profile_id`   | Send DM                    |
| `/send_inmail_message`         | `/api/v1/send_inmail_message`          | Send InMail (premium)      |
| `/personal_message_threads`    | `/api/v1/personal_message_threads`     | List message threads       |
| `/personal_messages`           | `/api/v1/personal_messages`            | Get thread messages        |

### Sync Endpoints (immediate response, no webhook)

| Endpoint         | Purpose                   |
| ---------------- | ------------------------- |
| `/me`            | Get own profile           |
| `/get_response`  | Poll async request status |

## Endpoint Quick Reference

| Category        | Endpoint                       | Purpose                    |
| --------------- | ------------------------------ | -------------------------- |
| **Auth**        | `/login_v2`                    | Login to LinkedIn          |
|                 | `/login_code`                  | Submit OTP code            |
|                 | `/me`                          | Get own profile            |
| **Profiles**    | `/get_profile_details`         | Get profile by URL         |
|                 | `/get_profile_contact_details` | Get contact info           |
| **Connections** | `/connect`                     | Send connection request    |
|                 | `/get_connection_status`       | Check connection status    |
|                 | `/connections`                 | List all connections       |
|                 | `/pending_invites`             | List pending invites       |
|                 | `/withdraw_invite`             | Withdraw invite            |
| **Messaging**   | `/send_message_to_profile_id`  | Send DM (connections only) |
|                 | `/send_inmail_message`         | Send InMail (premium)      |
|                 | `/personal_message_threads`    | List message threads       |
|                 | `/personal_messages`           | Get thread messages        |

## Common Patterns

### Two-Handler Pattern (Request + Webhook Result)

Every WeLink operation in this project follows a **two-handler pattern** via Inngest:

```
Request Handler → WeLink API → [async] → Webhook → Dispatcher → Result Handler
```

1. **Request Handler** (`*.request.handler.ts` or `*.handler.ts`):
   - Calls the WeLink API
   - Stores `request_id` via `campaignContactService.appendWeLinkRequestByExternalIds()`
   - Does NOT update any statuses — just fires the API call and stores the tracking ID

2. **Webhook Dispatcher** (`welink.webhook.dispatcher.function.ts`):
   - Receives ALL webhooks from WeLink
   - Routes by `event_type` to the appropriate Inngest event
   - Event type in webhook payload matches the API path (e.g., `/api/v1/withdraw_invite`)

3. **Result Handler** (`*.sent.handler.ts`, `*.received.handler.ts`, `*.withdrawn.handler.ts`):
   - Correlates by `request_id` (primary) or `profile_id` (fallback)
   - Updates database statuses (message status, connection_status, etc.)
   - Publishes real-time updates for UI cache invalidation

### Example: Connection Request Flow

```
connection.request.handler.ts
  → calls weLinkService.sendConnectionRequest()
  → stores request_id for correlation
  → returns (no status changes!)

[WeLink processes request asynchronously]

Webhook arrives at /api/webhooks/we-link/route.ts
  → emitted as WELINK_WEBHOOK_RECEIVED event

welink.webhook.dispatcher.function.ts
  → event_type is "/api/v1/connect"
  → dispatches WELINK_CONNECTION_REQUEST_SENT event

connection.sent.handler.ts
  → finds contact by request_id
  → updates message status to "sent" or "failed"
  → updates connection_status
  → publishes real-time UI update
```

### Request ID Extraction

WeLink returns request IDs in multiple formats - always check all:

```typescript
const requestId =
  response.requestId ??
  response.requestID ??
  response.request_id ??
  response.data?.request_id;
```

Or use the helper: `extractWeLinkRequestId(response)` from `lib/we-link/types.ts`.

### Request ID Correlation Pattern

All async handlers follow this correlation pattern:

```typescript
// Request handler: store request_id after API call
await campaignContactService.appendWeLinkRequestByExternalIds(
  campaign_id, contact_id,
  { request_id, event_type: WE_LINK_EVENTS.CONNECT, status: "pending", created_at: new Date() }
);

// Result handler: find contact by request_id from webhook
const contact = await campaignContactService.findByWeLinkRequestId(request_id);

// Update request tracking status
await campaignContactService.updateWeLinkRequestStatus(
  contact.id, request_id, "completed", new Date()
);
```

### Webhook Payload Structure

```json
{
  "event_type": "/api/v1/connect",
  "status": "SUCCESS",
  "requestID": "abc123",
  "result": { /* endpoint-specific data */ },
  "error_message": null
}
```

### Webhook Status Values

| Status       | Meaning             |
| ------------ | ------------------- |
| `SUCCESS`    | Operation completed |
| `FAILED`     | Operation failed    |
| `PROCESSING` | Still in progress   |
| `COMPLETED`  | Operation completed |

## Error Codes

| Code | Description             |
| ---- | ----------------------- |
| 400  | Invalid parameters      |
| 401  | Invalid API credentials |
| 403  | Access denied           |
| 404  | Resource not found      |
| 429  | Rate limit exceeded     |
| 431  | Request header too large (see fetch cache note below) |
| 500  | Internal server error   |

### Next.js Fetch Cache Gotcha

When calling WeLink API from Inngest handlers (server-side), Next.js patched `fetch()` can add extra caching headers that cause HTTP 431 errors. The fix is in `postWeLink()` which uses `cache: "no-store"` to prevent this.

## Project Integration

### Key Files

| File | Purpose |
|------|---------|
| `app/api/webhooks/we-link/route.ts` | Webhook endpoint (receives ALL WeLink callbacks) |
| `lib/we-link/webhook.schemas.ts` | `WE_LINK_EVENTS` constants for event_type matching |
| `lib/we-link/api/client.ts` | Low-level HTTP client (`postWeLink`, `getWeLink`) |
| `lib/we-link/services/we-link.service.ts` | Service layer wrapping client with business logic |
| `lib/we-link/types.ts` | Response types with `IWeLinkRequestId` interface |
| `lib/inngest/functions/welink.webhook.dispatcher.function.ts` | Routes webhooks to events |
| `lib/inngest/functions/welink/` | All Inngest event handlers |

### Handler Registry

| Handler | Trigger Event | Purpose |
|---------|--------------|---------|
| `profile.details.request.handler` | `WELINK_PROFILE_DETAILS_REQUESTED` | Calls get_profile_details API |
| `profile.details.received.handler` | `WELINK_PROFILE_DETAILS_RECEIVED` | Saves profile data |
| `connection.request.handler` | `WELINK_CONNECTION_REQUEST_REQUESTED` | Calls connect API |
| `connection.sent.handler` | `WELINK_CONNECTION_REQUEST_SENT` | Updates message status after webhook |
| `connection.accepted.handler` | `WELINK_CONNECTION_ACCEPTED` | Processes acceptance webhook |
| `connection.status.check.handler` | `WELINK_CONNECTION_STATUS_CHECK_REQUESTED` | Calls get_connection_status API |
| `connection.status.received.handler` | `WELINK_CONNECTION_STATUS_RECEIVED` | Processes status webhook |
| `connection.invite.withdraw.handler` | `WELINK_CONNECTION_INVITE_WITHDRAW_REQUESTED` | Calls withdraw_invite API |
| `connection.invite.withdrawn.handler` | `WELINK_CONNECTION_INVITE_WITHDRAWN` | Processes withdrawal webhook |
| `message.request.handler` | `WELINK_MESSAGE_REQUESTED` | Calls send_message API |
| `message.sent.handler` | `WELINK_MESSAGE_SENT` | Updates message status after webhook |
| `message.reply.received.handler` | `WELINK_MESSAGE_RECEIVED` | Processes inbound message webhook |

### Webhook Dispatcher Event Mapping

```typescript
// lib/we-link/webhook.schemas.ts — WE_LINK_EVENTS
"/api/v1/login_v2"                    → WELINK_LOGIN_COMPLETED
"/api/v1/get_profile_details"         → WELINK_PROFILE_DETAILS_RECEIVED
"/api/v1/connect"                     → WELINK_CONNECTION_REQUEST_SENT
"/api/v1/get_connection_status"       → WELINK_CONNECTION_STATUS_RECEIVED
"/api/v1/withdraw_invite"             → WELINK_CONNECTION_INVITE_WITHDRAWN
"/api/v1/send_message_to_profile_id"  → WELINK_MESSAGE_SENT
"/api/v1/send_inmail_message"         → WELINK_MESSAGE_SENT
"/api/v1/connection_accepted"         → WELINK_CONNECTION_ACCEPTED
"/api/v1/message_received"            → WELINK_MESSAGE_RECEIVED
"/api/v1/personal_message_threads"    → WELINK_MESSAGE_THREADS_RECEIVED
"/api/v1/personal_messages"           → WELINK_THREAD_MESSAGES_RECEIVED
```

## Full API Documentation

For complete endpoint details including:

- All request/response fields
- Webhook payload structures
- Experience and connection object schemas
- Proxy configuration options

**See:** [lib/we-link/we-link-api-reference.md](../../../lib/we-link/we-link-api-reference.md)
