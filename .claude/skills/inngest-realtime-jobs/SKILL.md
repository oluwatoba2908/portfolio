---
name: inngest-realtime-jobs
description: Expert guidance for Inngest Realtime subscriptions and job tracking. Use when creating real-time topics, publishing from Inngest functions, consuming with React hooks, or debugging WebSocket delivery issues.
---

# Inngest Realtime Job Tracking

Expert skill for implementing real-time server-to-client communication using Inngest Realtime channels, topics, and the unified `RealtimeProvider` architecture.

## Architecture Overview

```
┌───────────────────────────────────────────────┐
│  RealtimeProvider (1 WebSocket per user)       │
│    └─ useRealtimeTopic<T>("pipeline")          │  ← Multi-step workflow progress
│    └─ useRealtimeTopic<T>("campaign")          │  ← Campaign domain events
│    └─ useRealtimeTopic<T>("welink")            │  ← LinkedIn integration events
│    └─ useRealtimeTopic<T>("credit")            │  ← Credit balance updates
│    └─ useRealtimeTopic<T>("vendorSignup")      │  ← Vendor signup completion
│    └─ useRealtimeTopic<T>("notification")      │  ← General notifications
└───────────────────────────────────────────────┘
```

**Single WebSocket Rule**: There is exactly ONE `useInngestSubscription()` call per user, inside `RealtimeProvider`. Never add a second subscription — it causes WebSocket eviction.

## Key Files

| File | Purpose |
|------|---------|
| `shared/inngest/channels/user.channel.ts` | Channel definition, topic schemas, `REALTIME_TOPICS`, `ALL_TOPICS` |
| `shared/inngest/tokens/user.token.ts` | Server-side subscription token |
| `components/providers/RealtimeProvider.tsx` | Single WebSocket provider |
| `shared/inngest/hooks/useRealtimeTopic.ts` | Generic topic filtering hook |
| `shared/inngest/hooks/useInngestJob.tsx` | Job tracking (progress, completion) |
| `shared/inngest/hooks/useMutationWithJobTracking.tsx` | Mutation + job tracking combined |
| `lib/inngest/utils/progress.publisher.ts` | Server-side progress publishing utility |

## Consuming Topics (Client-Side)

### useRealtimeTopic<T>(topicName)

The universal hook for reading from any topic. It filters the raw WebSocket stream by topic name and returns typed payloads.

```typescript
import { useRealtimeTopic } from "@/shared/inngest/hooks/useRealtimeTopic";
import { REALTIME_TOPICS, type PipelineMessage } from "@/shared/inngest/channels/user.channel";

function MyComponent() {
  const { latestMessage, error, state } = useRealtimeTopic<PipelineMessage>(
    REALTIME_TOPICS.PIPELINE
  );

  // latestMessage is PipelineMessage | null
  // It persists across non-matching messages (cached via ref)
}
```

### Multi-topic filtering

```typescript
const JOB_TOPICS = ["pipeline", "onboarding"] as const;
const { latestMessage } = useRealtimeTopic<InngestJobMessage>(JOB_TOPICS);
```

### Processing messages with useEffect

```typescript
useEffect(() => {
  if (!latestMessage) return;
  if (latestMessage.campaign_id !== campaignId) return;

  // Process the message...
}, [latestMessage, campaignId]);
```

### Deduplication pattern

```typescript
const lastProcessedRef = useRef<string | null>(null);

useEffect(() => {
  if (!latestMessage) return;

  const key = `${latestMessage.job_id}-${latestMessage.status}`;
  if (lastProcessedRef.current === key) return;
  lastProcessedRef.current = key;

  // Process...
}, [latestMessage]);
```

## Publishing to Topics (Server-Side)

### From Inngest functions

```typescript
import { userChannel } from "@/shared/inngest/channels/user.channel";

// Inside an Inngest function with publish parameter:
async ({ event, step, publish }) => {
  // Pipeline topic
  await publish(
    userChannel(userId).pipeline({
      job_id: jobId,
      pipeline_type: "campaign_build",
      status: "in_progress",
      step_name: "partners_scoring",
      message: "Scoring partners...",
      progress_percent: 45,
      campaign_id: campaignId,
    })
  );

  // Campaign topic (discriminated union — event_type is the discriminant)
  await publish(
    userChannel(userId).campaign({
      campaign_id: campaignId,
      event_type: "message_update",      // "status_change" | "enrichment_activity" | "message_update"
      timestamp: new Date().toISOString(),
      partner_id: "...",
      contact_id: "...",
      step_number: 1,
      message_status: "generating",
    })
  );

  // Credit topic
  await publish(
    userChannel(userId).credit({
      balance: 150,
      lifetime_used: 50,
      amount_deducted: 5,
      operation_type: "partner_discovered",
      is_low: false,
      is_critical: false,
      is_depleted: false,
      is_blocked: false,
      timestamp: new Date().toISOString(),
    })
  );
}
```

### Using ProgressPublisher utility

```typescript
import { ProgressPublisher } from "@/lib/inngest/utils/progress.publisher";

const publisher = new ProgressPublisher(publish, userId, jobId, jobType, {
  progressRange: { start: 10, end: 90 },
});

await publisher.publishProgress(JobStatus.IN_PROGRESS, "Step 1/3...", 25);
```

### Quick one-off publish

```typescript
await ProgressPublisher.publishQuick(publish, {
  userId,
  jobId,
  status: JobStatus.COMPLETED,
  jobType: JobType.CAMPAIGN_BUILD,
  message: "Done!",
  progress: 100,
});
```

## Adding a New Topic

1. **Define the schema** in `shared/inngest/channels/user.channel.ts`:

```typescript
export const MyNewSchema = z.object({
  some_field: z.string(),
  timestamp: z.string(),
});

export type MyNewMessage = z.infer<typeof MyNewSchema>;
```

2. **Add to REALTIME_TOPICS and ALL_TOPICS**:

```typescript
export const REALTIME_TOPICS = {
  // ... existing
  MY_NEW: "myNew",
} as const;

export const ALL_TOPICS = [
  // ... existing
  "myNew",
] as const;
```

3. **Register on the channel**:

```typescript
export const userChannel = channel((userId: string) => `user:${userId}`)
  // ... existing topics
  .addTopic(topic("myNew").schema(MyNewSchema));
```

4. **Consume** — no other wiring needed:

```typescript
const { latestMessage } = useRealtimeTopic<MyNewMessage>(REALTIME_TOPICS.MY_NEW);
```

The subscription token automatically picks up all topics from `ALL_TOPICS`.

## Job Tracking Hooks

### useInngestJob — Track a single background job

```typescript
const { status, message, progress } = useInngestJob({
  jobId: "abc-123",
  onComplete: (msg) => { /* ... */ },
  onFailed: (msg) => { /* ... */ },
});
```

### useMutationWithJobTracking — Mutation + deferred cache invalidation

```typescript
const { mutate, isLoading, isJobPending } = useMutationWithJobTracking({
  mutationFn: async (input) => post(`/api/campaigns/${input.id}/activate`, input),
  invalidateOnSuccess: (vars) => [["campaigns", vars.id]],
  showToast: true,
  toastTitle: "Activating campaign...",
  onJobSuccess: (msg) => { /* ... */ },
});
```

## Common Patterns

### Campaign topic discriminated union

The campaign topic uses `event_type` as a discriminant:

```typescript
const { latestMessage } = useRealtimeTopic<CampaignTopicMessage>(REALTIME_TOPICS.CAMPAIGN);

useEffect(() => {
  if (!latestMessage) return;

  switch (latestMessage.event_type) {
    case "status_change":
      // latestMessage is CampaignStatusChangeMessage
      break;
    case "enrichment_activity":
      // latestMessage is CampaignEnrichmentActivityMessage
      break;
    case "message_update":
      // latestMessage is CampaignMessageUpdateMessage
      break;
  }
}, [latestMessage]);
```

### Supplementary publish (non-critical)

When a publish is supplementary (not the primary function outcome), wrap it in try-catch:

```typescript
try {
  await publish(userChannel(userId).campaign({ ... }));
} catch (publishError) {
  console.warn("[MyFunction] Non-critical: campaign publish failed", publishError);
}
```

## Anti-Patterns

| Anti-Pattern | Problem | Solution |
|---|---|---|
| Multiple `useInngestSubscription()` calls | WebSocket eviction, messages lost | Single `RealtimeProvider`, use `useRealtimeTopic` |
| Defining a second `channel()` for same user | Competing subscriptions | Use `userChannel` from `user.channel.ts` |
| `onPipelineMessage` callback subscription | Old pattern, stale closures | Use `useRealtimeTopic` + `useEffect` |
| Raw `latestData` topic checking | No type safety, verbose | Use `useRealtimeTopic<T>(topicName)` |
| Publishing without `try-catch` for supplementary updates | Function crashes on WebSocket error | Wrap non-critical publishes |
| Importing from `lib/inngest/realtime/channels.ts` | Legacy channel system | Use `shared/inngest/channels/user.channel.ts` |

## Checklist for New Realtime Feature

- [ ] Define Zod schema for the topic payload in `user.channel.ts`
- [ ] Add topic name to `REALTIME_TOPICS` and `ALL_TOPICS`
- [ ] Register topic on `userChannel` with `.addTopic(topic("name").schema(Schema))`
- [ ] Publish from Inngest function: `await publish(userChannel(userId).topicName({ ... }))`
- [ ] Consume in React: `useRealtimeTopic<MyType>(REALTIME_TOPICS.MY_TOPIC)`
- [ ] Add deduplication if processing has side effects
- [ ] Wrap supplementary publishes in try-catch
