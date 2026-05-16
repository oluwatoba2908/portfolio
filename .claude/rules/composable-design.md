# Composable Design — Writing Code That Composes, Tests, and Extends

---
paths:
  - "shared/**/application/**/*.ts"
  - "shared/**/domain/**/*.ts"
  - "modules/**/application/**/*.ts"
  - "modules/**/domain/**/*.ts"
  - "**/*orchestrator*.ts"
  - "**/*pipeline*.ts"
  - "**/*coordinator*.ts"
  - "**/*processor*.ts"
---

This rule enforces composable design principles. The existing `code-quality.md` rule covers general quality (fakes over mocks, pure functions, concern isolation). This rule covers **structural decisions** — how to decompose a feature into parts that snap together like building blocks.

The goal: every unit does one thing, accepts explicit inputs, returns explicit outputs, and can be tested/replaced/reused independently.

---

## Decision: Which Pattern to Use

**Before writing any class or function**, determine the right structural pattern:

| Signal | Pattern | Example |
|--------|---------|---------|
| Coordinates 3+ external concerns (persistence, events, realtime, gates) | **Port-based orchestrator** | `CampaignEnrichmentCoordinator`, `CsvMasterProcessorBase` |
| Standard CRUD + business rules on a single domain entity | **BaseService + repository factory** | `CampaignService`, `TasksService`, `TrainingModuleService` |
| Stateless transformation, calculation, or decision logic | **Pure function** | `buildExecutionPlan()`, `voiceProfileToGenerationParams()`, `resolveMessageRole()` |
| Adapts an external system to a port interface | **Thin adapter** | Inngest function wiring ports to real implementations |

If you're unsure, default to pure function. Promote to a class only when you need constructor-injected state.

---

## Port-Based Orchestrator Pattern

Use when coordinating multiple external systems. This extends the handler pattern from `CampaignAdminHandler` to full port-based composition:

### Structure

```
feature/
├── domain/
│   ├── types.ts           # Data types (interfaces, discriminated unions)
│   └── ports.ts           # Port interfaces + Noop implementations
├── application/
│   ├── orchestrator.ts    # Business logic, depends ONLY on ports
│   └── pure-helpers.ts    # Pure functions extracted from orchestrator
├── infrastructure/
│   └── adapter.ts         # Thin adapter wiring real implementations to ports
└── __tests__/
    ├── test-fakes.ts      # Stateful fakes for every port
    ├── orchestrator.test.ts
    └── pure-helpers.test.ts
```

This follows the same `domain/` → `application/` → `infrastructure/` layering used in `modules/execution-planning/` and `modules/campaigns/`.

### Port Design Rules

1. **One `*Deps` interface** bundles all ports for the orchestrator constructor
2. **Every port has a Noop implementation** in `ports.ts` for optional features (zero overhead when unused)
3. **Ports are interfaces, never concrete classes** — the orchestrator never imports infrastructure
4. **Port methods accept plain objects** (not Mongoose documents, not framework types)
5. **Optional ports use Noop defaults** in the constructor — not conditional logic scattered through methods

```typescript
// domain/ports.ts — define the boundary
export interface IStepRunner {
  run<T>(stepId: string, fn: () => Promise<T>): Promise<T>;
}

export interface ILifecycleEmitter {
  emitStarted(params: StartedParams): Promise<void>;
  emitCompleted(params: CompletedParams): Promise<void>;
}

export const NoopLifecycleEmitter: ILifecycleEmitter = {
  async emitStarted() {},
  async emitCompleted() {},
};

// application/orchestrator.ts — depend only on ports
export interface OrchestratorDeps {
  stepRunner: IStepRunner;
  lifecycleEmitter: ILifecycleEmitter;
  persistence: IPersistence;
}

export class Orchestrator {
  constructor(
    private readonly config: IConfig,
    private readonly deps: OrchestratorDeps
  ) {}
}
```

### Fake Design Rules

Follow the same fake pattern established in `code-quality.md`, but scoped to ports:

1. **Fakes implement the port interface** and store real state (Maps, arrays)
2. **Fakes expose test-only helpers** not on the interface (`.getForAgent()`, `.wasStored`)
3. **Fakes support failure simulation** via `failOnX = true` flags
4. **A `createFakeDeps()` factory** returns all fakes with intersection typing:

```typescript
export function createFakeDeps(): OrchestratorDeps & {
  persistence: FakePersistence;  // exposes test-only helpers
  stepRunner: FakeStepRunner;
} {
  return {
    persistence: new FakePersistence(),
    stepRunner: new FakeStepRunner(),
    lifecycleEmitter: new FakeLifecycleEmitter(),
  };
}
```

### Adapter Rules

The adapter is **deliberately thin** — it wires port implementations and calls the orchestrator. If the adapter contains business logic, it belongs in the orchestrator. This is the same principle behind `CampaignMessageGenerator` delegating AI calls while `CampaignMessageService` owns CRUD and events.

```typescript
// infrastructure/adapter.ts — THIN, no business logic
export function createInngestHandler(step: InngestStep) {
  const deps: OrchestratorDeps = {
    stepRunner: { run: (id, fn) => step.run(id, fn) },
    lifecycleEmitter: new InngestLifecycleEmitter(step),
    persistence: new MongoPersistence(),
  };
  const orchestrator = new Orchestrator(config, deps);
  return orchestrator.run(context);
}
```

---

## Pure Function Extraction

Any logic that doesn't need I/O must be extracted as a pure function. This is the single highest-leverage composability technique.

The codebase already has good examples: `voiceProfileToGenerationParams()` in `voice.profile.bridge.ts`, `resolveMessageRole()` in `channel.utils.ts`, and `detectDuplicates()` in `duplicate.detector.ts`.

### When to Extract

- Topological sorts, graph traversal, ordering logic
- Validation beyond Zod schema parsing
- Data transformation, mapping, filtering (e.g., `partner.transformer.ts`, normalizers in `embeddings/application/normalizers/`)
- Decision logic (routing, policy application, scoring)
- Formatting, serialization, deserialization

### Shape

```typescript
// Pure: explicit inputs, explicit output, no side effects
export function buildExecutionPlan(
  agents: Array<{ id: string; depends_on: string[] }>
): IExecutionPlan {
  // ... topological sort
}

// Pure: discriminated union return for caller to handle
export function resolveRoutedAgents(
  routerOutput: unknown,
  config: IDynamicRoutingConfig
): IRoutingResult {
  // ... routing decision
}
```

### Testing

Pure functions need the simplest tests in the codebase — direct assertions, no setup:

```typescript
it("sorts agents into dependency phases", () => {
  const plan = buildExecutionPlan([
    { id: "a", depends_on: [] },
    { id: "b", depends_on: ["a"] },
  ]);
  expect(plan.phases).toHaveLength(2);
  expect(plan.phases[0].agent_ids).toEqual(["a"]);
});
```

---

## Discriminated Unions for Error Handling

Return discriminated unions from functions that can fail in expected ways. This forces callers to handle both paths explicitly at compile time. Use alongside the typed errors (`NotFoundError`, `ValidationError`) already established in the codebase.

```typescript
// Return type forces exhaustive handling
type AgentOutcome =
  | { ok: true; result: IAgentResult }
  | { ok: false; error: IPipelineError };

private async executeAgent(...): Promise<AgentOutcome> {
  try {
    const output = await entry.execute(input, outputs);
    return { ok: true, result: { agent_id: entry.id, output, duration_ms } };
  } catch (err) {
    return { ok: false, error: { agent_id: entry.id, error, phase } };
  }
}

// Caller — compiler ensures both branches handled
const outcome = await this.executeAgent(entry, context, outputs, phase);
if (outcome.ok) {
  outputs.set(agentId, outcome.result);
} else {
  errors.push(outcome.error);
}
```

---

## Fire-and-Forget Wrapper for Non-Critical Operations

Side effects (lifecycle events, analytics, realtime updates) should never kill the main flow. This extends the concern isolation principle from `code-quality.md` into a reusable pattern — especially relevant for `publishJobUpdate()` calls in coordinator functions.

```typescript
private async emitSafe(fn: () => Promise<unknown>): Promise<void> {
  try {
    await fn();
  } catch {
    // Non-critical operation failed. Main flow continues.
  }
}

// Usage — lifecycle emission never kills the pipeline
await this.emitSafe(() =>
  this.deps.lifecycleEmitter.emitCompleted({ ... })
);
```

---

## Composability Checklist

Before finishing any new module, orchestrator, or shared utility:

- [ ] Every external dependency accessed through a port interface or repository factory
- [ ] Complex logic without I/O extracted as pure functions
- [ ] Discriminated unions used for expected failure paths
- [ ] Non-critical side effects wrapped in `emitSafe` or independent try/catch
- [ ] `createFakeDeps()` factory exists for port-based code
- [ ] Noop implementations exist for optional ports
- [ ] Adapter is thin — contains zero business logic
- [ ] Configuration is pure data (no functions, no class references)
- [ ] Each function/method does one thing at one level of abstraction
