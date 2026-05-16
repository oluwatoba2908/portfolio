# Composable Design — Airstride Codebase Reference Patterns

These are the concrete patterns from the Airstride codebase that the composable-design skill builds upon. Read these when you need to understand how a specific pattern is implemented, not just what it looks like in the abstract.

---

## Pattern 1: Domain-Layer Interface (Port)

**Source**: `modules/campaigns/domain/campaign.repository.interface.ts`

The `ICampaignRepository<TDocument>` interface lives in the **domain layer**, not infrastructure. Handlers depend on this interface, never on Mongoose directly:

```typescript
export interface ICampaignRepository<TDocument> {
  findById(id: string): Promise<TDocument | null>;
  findByIdIncludingDeleted(id: string): Promise<{ exists: boolean; is_deleted?: boolean; organization_id?: string }>;
  atomicUpdate(id: string, update: Record<string, unknown>): Promise<TDocument | null>;
  find(filter: Record<string, unknown>, options?: { limit?: number; skip?: number }): Promise<[TDocument[], number]>;
}
```

Key insight: The interface is generic over `TDocument` — the domain defines the contract shape, infrastructure provides the concrete Mongoose document type. This is the pattern to follow for new port interfaces. For optional ports, define a **Noop implementation** next to the interface — it's a production artifact, not test code.

```
1. Define the interface in domain/ (what the orchestrator needs)
2. Provide a Noop (zero overhead when feature is off)
3. Orchestrator constructor picks Noop or real based on config
4. Adapter provides the real implementation in production
5. Fake provides a testable implementation in tests
```

---

## Pattern 2: Constructor Injection Handler

**Source**: `modules/campaigns/application/handlers/campaign.admin.handler.ts`

The `CampaignAdminHandler` receives all dependencies via constructor — repository, response mapper, finder, and event emitters:

```typescript
export class CampaignAdminHandler {
  constructor(
    private repository: ICampaignRepository<CampaignDocument>,
    private mapEntityToResponse: (entity: CampaignDocument) => CampaignResponse,
    private findById: (id: string) => Promise<CampaignResponse | null>,
    private emitCampaignPausedEvent: (...args) => Promise<void>,
    private emitCampaignResumedEvent: (...args) => Promise<void>
  ) {}
}
```

One constructor, all dependencies visible. No hidden `new Service()` calls inside methods. The handler never creates its own dependencies — the parent service wires everything at construction time.

---

## Pattern 3: Service Composing Multiple Handlers

**Source**: `modules/campaigns/application/campaign.service.ts`

The `CampaignService` extends `BaseService` and composes three independent handlers:

```typescript
export class CampaignService extends BaseService<...> {
  private adminHandler: CampaignAdminHandler;
  private memberHandler: CampaignMemberHandler;
  private scheduleHandler: CampaignScheduleHandler;

  constructor() {
    super(campaignRepository);
    this.adminHandler = new CampaignAdminHandler(
      campaignRepository,
      this.mapEntityToResponse.bind(this),
      this.findById.bind(this),
      this.emitCampaignPausedEvent.bind(this),
      this.emitCampaignResumedEvent.bind(this)
    );
    // ... similar for memberHandler, scheduleHandler
  }
}
```

Each handler is independently testable via constructor injection. The service delegates to the appropriate handler per operation. This is the recommended approach when a service grows beyond 3 concerns.

---

## Pattern 4: Pure Functions with Discriminated Unions

**Source**: `modules/campaigns/domain/message-delivery-guard.ts`

The message delivery guard is the gold standard for pure domain logic. Six functions, zero I/O — every function takes plain data and returns a typed verdict:

```typescript
export type DeliveryVerdict =
  | { allowed: true }
  | { allowed: false; reason: DeliveryBlockReason };

export function canDeliverMessage(
  message: GuardMessageInput,
  contact: GuardContactInput
): DeliveryVerdict { ... }

export function resolveConnectionAccepted(
  messages: ConnectionResolvedMessage[],
  autoSendEnabled: boolean
): ConnectionResolvedVerdict[] { ... }
```

Key patterns:
- **Input types are minimal** — `GuardMessageInput` has only the fields the guard needs, not the full document
- **Verdict types force exhaustive handling** — callers must check `allowed` before proceeding
- **Multiple verdict types** for different decisions (`DeliveryVerdict`, `ScheduleVerdict`, `UnblockVerdict`, `ConnectionResolvedVerdict`)
- **Valid state transitions** defined as `ReadonlyMap<MessageStatus, ReadonlySet<MessageStatus>>` — pure data, no logic

Testing is trivial — direct assertions, no setup:

```typescript
it("rejects messages in terminal status", () => {
  const verdict = canDeliverMessage(
    { status: "sent", step_number: 1, type: "linkedin_message", depends_on_connection: false },
    { connection_status: "connected" }
  );
  expect(verdict).toEqual({ allowed: false, reason: "terminal_status" });
});
```

---

## Pattern 5: Pure Data Transformation Bridge

**Source**: `modules/campaigns/application/voice/voice.profile.bridge.ts`

`voiceProfileToGenerationParams()` converts a `VoiceProfileResponse` + optional campaign overrides into `VoiceGenerationParams`. It's a pure bridge — no I/O, no side effects:

```typescript
export function voiceProfileToGenerationParams(
  profile: VoiceProfileResponse,
  campaignMessagingStyle?: CampaignMessagingStyle
): VoiceGenerationParams {
  const constructedInstructions = buildInstructions(profile, campaignMessagingStyle);
  const instructions = mergeInstructions(profile.instructions, constructedInstructions);
  return {
    writing_dna: resolveWritingDna(profile, campaignMessagingStyle),
    follow_up_style: resolveFollowUpStyle(profile, campaignMessagingStyle),
    instructions,
    confidence: calculateBridgeConfidence(profile),
    voice_guide: profile.voice_guide ?? DEFAULT_VOICE_GUIDE,
  };
}
```

Key patterns:
- **Helper functions are private (module-scoped)** — `resolveWritingDna`, `resolveFollowUpStyle`, `calculateBridgeConfidence`
- **One public entry point** — callers use `voiceProfileToGenerationParams()`, internals are hidden
- **Confidence scoring** is a pure calculation based on profile completeness
- **Merging with priority** — native instructions take precedence over bridge-constructed ones

---

## Pattern 6: Stateless Delegation

**Source**: `modules/campaigns/application/campaign.message.generator.ts`

`CampaignMessageGenerator` owns AI message generation logic. It's a class (groups related methods), but stateless — no constructor dependencies:

```typescript
export class CampaignMessageGenerator {
  async generateContactMessages(
    contact: CampaignContactInput,
    partner: CampaignPartnerInput,
    context: CampaignMessageContext,
    options?: { previewOnly?: boolean }
  ): Promise<GeneratedContactMessages> { ... }
}
```

The `CampaignMessageService` delegates here for content creation while retaining ownership of CRUD, scheduling, status transitions, and events. This separation means the generator can be tested with mock AI responses without touching the database.

---

## Pattern 7: Abstract Processor Base

**Source**: `lib/inngest/base/csv.master.processor.base.ts`

`CsvMasterProcessorBase` extracts reusable CSV processing logic into an abstract base class. Subclasses implement only the domain-specific parts:

```typescript
export abstract class CsvMasterProcessorBase<TValidated = unknown> {
  constructor(jobId, userId, blobUrl, jobType, enabled, config, orgId) { ... }

  // Concrete: shared logic
  async downloadCsvContent(): Promise<string> { ... }
  async detectDuplicatesAndUpdate(parseResult): Promise<CsvProcessingResultWithDuplicates> { ... }
  prepareChunksForFanOut(validData, eventName): ChunkPreparationResult { ... }

  // Abstract: subclass-specific
  protected abstract parseCsvContent(csvContent: string): Promise<CsvParseResult<any>>;
  abstract getFanOutEventName(): keyof Events;
  abstract getCompletionEventName(): keyof Events;
}
```

Key patterns:
- **Config as a data object** — `CsvProcessingConfig` is pure data with defaults
- **Result types** are well-defined interfaces (`CsvProcessingResult`, `ChunkPreparationResult`)
- **No Inngest dependency** — the base class is framework-agnostic, usable from API routes and tests

---

## Pattern 8: Clean Domain Types

**Source**: `modules/execution-planning/domain/types.ts`

Domain types are pure TypeScript constructs inferred from Zod schemas. They stay database-agnostic:

```typescript
// Architectural rules enforced in this file:
// ✅ May import domain schemas and shared types
// ❌ Must not import infrastructure (mongoose) or application layers

export const ExecutionPlanStatusValues = ["draft", "awaiting_approval", ...] as const;
export type ExecutionPlanStatus = (typeof ExecutionPlanStatusValues)[number];
```

Key patterns:
- **`Values` arrays + type inference** — single source of truth for enum values
- **Schema-derived types** — `z.infer<typeof Schema>` for complex types
- **Import boundary comments** — explicit documentation of what can be imported

---

## Pattern 9: BaseService + Repository (Module Pattern)

**Source**: `modules/campaigns/application/campaign.service.ts`, `modules/training/application/training.module.service.ts`

For standard domain modules (not coordination code), the simpler pattern:

```typescript
export class CampaignService extends BaseService<CampaignDocument, CreateCampaignInput, UpdateCampaignInput, CampaignResponse> {
  constructor() {
    super(campaignRepository);
  }

  protected mapEntityToResponse(entity: CampaignDocument): CampaignResponse { ... }
  protected prepareEntityForCreate(request, userId, orgId): Partial<CampaignDocument> { ... }
  protected prepareEntityForUpdate(request, userId): Partial<CampaignDocument> { ... }
}

export const campaignService = new CampaignService();
```

Repository hides Mongoose. Singleton export ensures one instance. Other services imported as singletons at the top of the file. Events via `inngest.send()` wrapped in try/catch.

This is the right pattern for 80% of modules. Reserve port-based orchestration for the 20% that coordinate multiple external systems.

---

## Pattern 10: `createFakeDeps()` with Intersection Typing (Aspirational)

This pattern is not yet widely used in the codebase but is the recommended approach for new port-based orchestrators:

```typescript
export function createFakeDeps(): OrchestratorDeps & {
  persistence: FakePersistence;  // exposes test-only helpers (.wasStored, .getById)
  stepRunner: FakeStepRunner;    // exposes .executedSteps
} {
  return {
    persistence: new FakePersistence(),
    stepRunner: new FakeStepRunner(),
    lifecycleEmitter: new FakeLifecycleEmitter(),
  };
}
```

The intersection type is the key insight: the return type satisfies `OrchestratorDeps` (so it can be passed to the orchestrator) **and** exposes the concrete fake types (so tests can call `.wasStored`, `.executedSteps`, etc.). Without the intersection, tests would need to cast.

Fakes should support failure simulation:

```typescript
export class FakePersistence implements IPersistence {
  failOnStore = false;

  async store(params: StoreParams) {
    if (this.failOnStore) throw new Error("configured to fail");
    this.storedItems.push(params);
    return `fake-id-${this.nextId++}`;
  }
}
```

Tests flip `deps.persistence.failOnStore = true` to verify graceful error handling — no need for `jest.spyOn().mockRejectedValue()`.
