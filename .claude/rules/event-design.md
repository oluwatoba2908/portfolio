# Event Design

## Prefer Finely Grained Events

When creating Inngest events, each event must represent **one discrete thing that happened** and trigger **one unit of work**. This makes handlers independently testable and composable.

```typescript
// BAD - One coarse event that does multiple things
"welink.contact/processed" // handler resolves profile, sends connection, updates status, notifies user

// GOOD - Fine-grained events, each does one thing
"welink.profile.details/requested"    // triggers API call for profile
"welink.profile.details/received"     // saves profile data, chains to next step
"welink.connection.request/requested" // triggers connection request API call
"welink.connection.request/sent"      // updates status after webhook confirms
```

### Why This Matters

- **Testable**: Each handler has 2-3 steps with clear inputs/outputs — easy to unit test in isolation
- **Debuggable**: When something fails, the event name tells you exactly what broke
- **Composable**: Other modules can subscribe to fine-grained events without understanding the full flow
- **Replayable**: You can re-emit a single event to retry one step, not an entire pipeline

### Rule of Thumb

If a handler needs more than 3 `step.run()` calls, it is doing too much — split it into separate events.
