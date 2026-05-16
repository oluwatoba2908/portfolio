---
name: composable-design
description: Design composable, testable code structures before implementation. Trigger for new modules, orchestrators, pipelines, coordinators, processors, complex features, or when the user says "composable", "testable design", "design this", "scaffold", or "how should I structure this".
---

# Composable Design — Structure Before Implementation

Analyze what the user is building and produce a composable architecture scaffold — ports, pure functions, fakes, and adapters — before any implementation begins. The output is a structural blueprint that makes the code unit-testable, independently deployable, and easy to extend.

## When to Use

- Starting a new module, orchestrator, pipeline, or shared utility
- Refactoring a monolithic service into composable parts
- Adding coordination logic that touches multiple external systems
- Any time the user wants to understand "how should I structure this"

## Core Workflow

### Phase 1: Understand the Feature

Read the PRD, ticket, or user description. Identify:

1. **What are the external systems?** (database, event bus, realtime, LLM, third-party APIs)
2. **What is the core logic?** (the business rules that don't need I/O)
3. **What are the failure modes?** (which operations are critical vs fire-and-forget)
4. **What needs to be independently testable?** (anything with branching logic)

### Phase 2: Classify the Pattern

Based on the analysis, recommend the right structural pattern:

| Signal | Pattern | Airstride Example |
|--------|---------|-------------------|
| 3+ external concerns to coordinate | Port-based orchestrator | `CampaignEnrichmentCoordinatorFunction`, `CsvMasterProcessorBase` |
| Standard CRUD + business rules | BaseService + repository factory | `CampaignService`, `TasksService`, `TrainingModuleService` |
| Stateless transformation or decision | Pure function | `canDeliverMessage()`, `voiceProfileToGenerationParams()`, `resolveMessageRole()` |
| Wiring an external system to a port | Thin adapter | Inngest function wiring ports to real implementations |

Most features are a **mix** — an orchestrator that calls pure functions internally and is wired by a thin adapter externally.

### Phase 3: Design the Decomposition

For each feature, produce this structural breakdown:

#### 1. Port Interfaces

Identify every external dependency and define a TypeScript interface for it. Each port should:
- Accept plain objects (no framework types, no Mongoose documents)
- Return plain objects or primitives
- Have a corresponding Noop implementation for optional features
- Be named with an `I` prefix (`IPersistence`, `IEventEmitter`, `IStepRunner`)

Follow the pattern established in `modules/campaigns/domain/campaign.repository.interface.ts` — interfaces live in the domain layer.

#### 2. Pure Functions

Extract every piece of logic that doesn't need I/O:
- Decision logic → pure function with discriminated union return (see `message-delivery-guard.ts`)
- Data transformation → pure function (see `voice.profile.bridge.ts`)
- Validation beyond Zod → pure function returning `{ valid: true } | { valid: false; reason: string }`
- Ordering/sorting/filtering → pure function

#### 3. Orchestrator or Service

The coordination layer that wires ports and pure functions together:
- **Port-based orchestrator**: Constructor takes `(config, deps)`. Config is pure data. Deps is an interface of all ports.
- **BaseService**: Constructor takes `(repository)` via `super()`. Handlers composed as private members (see `CampaignService` composing `CampaignAdminHandler`, `CampaignMemberHandler`, `CampaignScheduleHandler`).

#### 4. Fakes and Test Strategy

For port-based code, design the fakes:
- Each fake implements its port interface with in-memory state (Map, array)
- Each fake exposes test-only helpers (`.getById()`, `.wasStored`, `.recordedEvents`)
- Each fake supports failure simulation (`failOnStore = true`)
- A `createFakeDeps()` factory returns all fakes with intersection typing

For pure functions, no fakes needed — direct input/output assertions.

#### 5. Adapter

The thin production wiring:
- Creates real port implementations from infrastructure (Inngest step, Mongoose repos, etc.)
- Passes them to the orchestrator constructor
- Contains zero business logic

### Phase 4: Output the Blueprint

Present the decomposition as a clear file tree with key interfaces/signatures. Format:

```
feature-name/
├── domain/
│   ├── types.ts           # IFeatureConfig, IFeatureResult, discriminated unions
│   └── ports.ts           # IPortA, IPortB, NoopPortA, NoopPortB
├── application/
│   ├── feature.orchestrator.ts   # FeatureOrchestrator(config, deps)
│   ├── helper-a.ts               # Pure: helperA(input) → output
│   └── helper-b.ts               # Pure: helperB(input) → output
├── infrastructure/
│   └── inngest.adapter.ts        # Thin: wires real ports → orchestrator
└── __tests__/
    ├── test-fakes.ts              # FakePortA, FakePortB, createFakeDeps()
    ├── feature.orchestrator.test.ts
    ├── helper-a.test.ts
    └── helper-b.test.ts
```

This follows the existing `domain/` → `application/` → `infrastructure/` layering used in `modules/execution-planning/`, `modules/campaigns/`, and `shared/credits/`.

For each key file, show the interface signature (not the full implementation):

```typescript
// domain/ports.ts
export interface IPortA {
  store(params: StoreParams): Promise<string>;
}
export const NoopPortA: IPortA = { async store() { return "noop"; } };

// application/feature.orchestrator.ts
export interface FeatureDeps { portA: IPortA; portB: IPortB; }
export class FeatureOrchestrator {
  constructor(config: IFeatureConfig, deps: FeatureDeps) {}
  async run(context: RunContext): Promise<IFeatureResult> {}
}

// application/helper-a.ts
export function computeOrder(items: Item[]): OrderedItem[] {}
```

### Phase 5: Validate Against Checklist

Before presenting, verify:

- [ ] Every external dependency behind a port interface
- [ ] Complex stateless logic extracted as pure functions
- [ ] Discriminated unions for expected failure paths
- [ ] Non-critical side effects identified (will use emitSafe or independent try/catch)
- [ ] Fakes designed with real state, not jest.fn()
- [ ] Noop implementations for optional ports
- [ ] Adapter is thin — zero business logic
- [ ] Configuration is pure data
- [ ] Each function/method does one thing at one level of abstraction
- [ ] File tree follows existing module/shared conventions

## Key Principles

### Composition over configuration
Build features from small, focused pieces that snap together. The `CampaignService` composing `CampaignAdminHandler`, `CampaignMemberHandler`, and `CampaignScheduleHandler` is the canonical example. Each handler is independently testable via constructor injection.

### Ports are the boundary
The port interface is the most important design artifact. `ICampaignRepository` in `modules/campaigns/domain/` demonstrates this — the domain layer defines the contract, infrastructure implements it. Get the port right and the orchestrator, fakes, and adapter all follow naturally.

### Pure functions are free testability
Every pure function extracted is a unit test that needs zero setup, zero teardown, and zero mocking. `message-delivery-guard.ts` demonstrates this at scale — six pure guard functions, all tested with direct input/output assertions.

### Noop by default, real by injection
Optional features (interrogation gates, lifecycle events, analytics) use Noop implementations by default. Real implementations are injected only when explicitly enabled. This means features work correctly with zero configuration and the happy path has zero overhead from unused features.

### Discriminated unions force correctness
Return `{ allowed: true } | { allowed: false; reason }` from functions that can fail in expected ways. The TypeScript compiler then forces callers to handle both paths — no forgotten error handling. See `DeliveryVerdict`, `ScheduleVerdict`, and `ConnectionResolvedVerdict` in `message-delivery-guard.ts`.

## Reference Implementations

When designing, always read these as the gold standard:

| File | What it demonstrates |
|------|---------------------|
| `modules/campaigns/domain/message-delivery-guard.ts` | Pure functions with discriminated unions, zero I/O |
| `modules/campaigns/domain/campaign.repository.interface.ts` | Domain-layer port interface |
| `modules/campaigns/application/handlers/campaign.admin.handler.ts` | Constructor injection, testable handler |
| `modules/campaigns/application/voice/voice.profile.bridge.ts` | Pure data transformation, bridge pattern |
| `modules/campaigns/application/campaign.message.generator.ts` | Stateless delegation from service |
| `modules/campaigns/application/campaign.service.ts` | Composing multiple handlers via constructor |
| `lib/inngest/base/csv.master.processor.base.ts` | Abstract processor with config, no Inngest dependency |
| `modules/execution-planning/domain/types.ts` | Clean domain types, schema-derived, no infrastructure |

Read 2-3 of these before producing a blueprint for any new feature.

## Common Pitfalls

- **Putting logic in the adapter**: If the adapter has an `if` statement, the logic belongs in the orchestrator.
- **Ports that accept framework types**: Ports should accept plain objects. If a port method takes an Inngest `step` or Mongoose `Document`, the abstraction is leaking.
- **Skipping Noop implementations**: Without Noops, optional features require conditional checks scattered through the orchestrator. With Noops, the constructor picks Noop or real once, and the orchestrator code is clean.
- **Using jest.fn() instead of fakes**: Mocks test that code was called. Fakes test that code worked. Fakes survive refactors; mocks break on implementation changes.
- **God functions**: If a method has more than ~30 lines, extract the pure logic into a helper. The orchestrator should read like a sequence of high-level steps.
