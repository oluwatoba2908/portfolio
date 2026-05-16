# Code Quality: How to Write Testable, Well-Structured Code

These principles apply to ALL code. They produce clean, testable, maintainable code that can be unit tested without infrastructure.

---

## 1. Separate Business Logic from Infrastructure

There are two patterns in this codebase. Use the right one for the right context.

### Module Services (the 80% case)

Module services extend `BaseService`, use repository singletons, and emit events via `inngest.send()`. The `BaseRepository` → `TenantAwareRepository` hierarchy provides the abstraction boundary — Mongoose is hidden inside `infrastructure/`.

```typescript
// The established pattern — follow it exactly
export class TasksService extends BaseService<
  TaskDocument,
  CreateTaskInput,
  UpdateTaskInput,
  TaskResponse
> {
  constructor() {
    super(taskRepository); // singleton from infrastructure/
  }

  protected mapEntityToResponse(entity: TaskDocument): TaskResponse {
    return TaskResponse.fromEntity(entity);
  }

  protected prepareEntityForCreate(
    request: CreateTaskInput,
    userId: string,
    orgId: PropelAuthOrgId
  ): Partial<TaskDocument> {
    return taskFactory.createFromRequest(request, userId, orgId);
  }

  protected prepareEntityForUpdate(
    request: UpdateTaskInput,
    userId: string
  ): Partial<TaskDocument> {
    return taskFactory.updateFromRequest(request, userId);
  }
}

// Singleton export at bottom of file
export const tasksService = new TasksService();
```

```typescript
// WRONG — calling Mongoose directly in service
const order = await OrderModel.findById(orderId);

// WRONG — importing another module directly
import { partnerService } from "@/modules/partners/server";

// RIGHT — use repository (Mongoose hidden in infrastructure/)
const order = await this.repository.findById(orderId);

// RIGHT — shared code goes in @/shared, or use service registry
import { ServiceRegistry } from "@/shared/service-registry/registry";
```

### Coordination Code (handlers, orchestrators, complex features)

When building coordination logic that touches multiple concerns, use **handler classes with constructor injection**. This is the established pattern from `CampaignAdminHandler`:

```typescript
// The handler receives its dependencies — fully testable without infrastructure
export class CampaignAdminHandler {
  constructor(
    private repository: CampaignRepository,
    private mapEntityToResponse: (entity: CampaignDocument) => CampaignResponse,
    private findById: (id: string) => Promise<CampaignResponse | null>,
    private emitPausedEvent: (...args: any[]) => Promise<void>,
    private emitResumedEvent: (...args: any[]) => Promise<void>
  ) {}

  async pauseCampaign(id: string, orgId: PropelAuthOrgId, userId: string, reason?: string) {
    const campaign = await this.findById(id);
    if (!campaign) throw new NotFoundError(`Campaign ${id} not found`);
    await this.repository.updateById(id, { status: "paused", paused_at: new Date() });
    await this.emitPausedEvent(id, orgId, userId, new Date(), reason);
    return campaign;
  }
}
```

The parent service wires the handler in its constructor — the handler never creates its own dependencies:

```typescript
export class CampaignService extends BaseService<...> {
  private adminHandler: CampaignAdminHandler;

  constructor() {
    super(campaignRepository);
    this.adminHandler = new CampaignAdminHandler(
      campaignRepository,
      this.mapEntityToResponse.bind(this),
      this.findById.bind(this),
      this.emitCampaignPausedEvent.bind(this),
      this.emitCampaignResumedEvent.bind(this)
    );
  }
}
```

**Use this pattern when:** A service method grows beyond 3 concerns, or when you need unit tests that run without `jest.mock()`. If you're just building a standard CRUD service, use `BaseService` above.

---

## 2. Pure Functions for Testable Logic

Any logic that doesn't need I/O should be a pure function — no side effects, no dependencies, no I/O. Pure functions are tested with direct input/output assertions: no setup, no teardown, no mocking.

```typescript
// WRONG — logic buried inside a service method that also does I/O
class PricingService extends BaseService<...> {
  async calculateDiscount(userId: string, orgId: PropelAuthOrgId) {
    const user = await this.repository.findByIdInOrg(userId, orgId); // I/O
    const tier = user.spend > 1000 ? "gold" : "silver";              // Logic
    const discount = tier === "gold" ? 0.2 : 0.1;                    // Logic
    await this.repository.updateById(userId, { discount });           // I/O
    return discount;
  }
}

// RIGHT — extract the logic as a pure function
export function calculateDiscount(spend: number): { tier: string; discount: number } {
  const tier = spend > 1000 ? "gold" : "silver";
  return { tier, discount: tier === "gold" ? 0.2 : 0.1 };
}

// The service does only I/O + calls the pure function
class PricingService extends BaseService<...> {
  async applyDiscount(userId: string, orgId: PropelAuthOrgId) {
    const user = await this.repository.findByIdInOrg(userId, orgId);
    const result = calculateDiscount(user.spend); // pure, testable
    await this.repository.updateById(userId, { discount: result.discount });
    return result;
  }
}
```

**Rule of thumb:** If you can test it without async/await, it should be a pure function. Factories (`campaignFactory.createFromRequest`) are a good example of this — pure data transformation, no I/O.

---

## 3. Fakes Over Mocks

Use real stateful implementations (fakes) for test dependencies, not `jest.fn()` or `toHaveBeenCalledWith` mocks. Fakes survive refactors, catch real bugs, and are reusable across test files.

```typescript
// WRONG — brittle mock that breaks when implementation changes
const mockRepo = { findByIdInOrg: jest.fn().mockResolvedValue({ id: "1", name: "test" }) };
// ...
expect(mockRepo.findByIdInOrg).toHaveBeenCalledWith("1", orgId); // Breaks if arg order changes

// RIGHT — stateful fake that behaves like the real thing
class FakeCampaignRepository {
  private store = new Map<string, CampaignDocument>();
  public failOnUpdate = false;

  async findByIdInOrg(id: string, orgId: PropelAuthOrgId) {
    const doc = this.store.get(id);
    if (!doc || doc.organization_id !== orgId) return null;
    return doc;
  }

  async updateById(id: string, update: Partial<CampaignDocument>) {
    if (this.failOnUpdate) throw new Error("simulated failure");
    const existing = this.store.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...update };
    this.store.set(id, updated);
    return updated;
  }

  // Test helper — not on the real repository, only on the fake
  seed(doc: CampaignDocument) {
    this.store.set(doc.id, doc);
  }
}
```

**Why fakes are better:**
- They store real state (you can assert on what was stored, not just what was called)
- They support failure simulation (`failOnUpdate = true`)
- They're reusable across test files
- They don't break when method signatures change slightly

**When `jest.mock()` is acceptable:** For deeply nested infrastructure boundaries (Inngest client, external APIs) where building a fake is impractical. Keep these mocks at the module boundary, not inside individual tests.

---

## 4. Test Names Are Architectural Invariants

Name tests after the rule they enforce, not the behavior they observe:

```typescript
// WRONG — describes what happens (not useful when it fails)
it("should return an error", ...)
it("should call the repository", ...)
it("handles the edge case", ...)

// RIGHT — states the invariant being enforced
it("rejects campaigns without an organization_id", ...)
it("continues processing when event emission fails", ...)
it("never exposes cross-tenant campaign data", ...)
it("applies voice profile defaults before message generation", ...)
```

When a test fails, the name should tell someone *what architectural rule was broken*, not just that something didn't work.

---

## 5. Concern Isolation

Independent concerns must be independently fallible. If failure in A should not affect B, they must be in separate try/catch blocks:

```typescript
// WRONG — event emission failure prevents response
try {
  await this.repository.updateById(id, update);
  await inngest.send({ name: EventNameEnum.CAMPAIGN_PAUSED, data: { ... } });
  return this.mapEntityToResponse(entity); // never runs if event fails
} catch (err) { ... }

// RIGHT — each concern independent
const entity = await this.repository.updateById(id, update);

try {
  await inngest.send({ name: EventNameEnum.CAMPAIGN_PAUSED, data: { ... } });
} catch (err) {
  logger.error("[CampaignService] Event emission failed:", err);
}

return this.mapEntityToResponse(entity);
```

**If you find yourself asking "should this failing break that?", the answer is almost always no.** Wrap them independently. This applies especially to event emission — a failed Inngest send should never block a successful DB write from returning.

### Pattern: `withProgress` for start → terminal activity emissions

When a tool or service emits a "started" event around its work, every path out of the work — success AND failure — must emit a paired terminal event. Manually pairing `start()` / `complete()` / `fail()` across many call sites WILL drift, and a missed `fail()` produces stuck "running" rows the user sees forever.

Use a helper that owns the pairing:

```typescript
// lib/ai-sdk/tools/cross-module/campaign.activity.emitter.ts
export async function withProgress<T>(
  progress: CampaignActivityEmitter | null,
  args: {
    total: number;
    subtitle?: string;
    summary: (result: T) => string;
    finalTotal?: (result: T) => number;
  },
  work: (progress: CampaignActivityEmitter | null) => Promise<T>
): Promise<T> {
  progress?.start(args.total, args.subtitle);
  try {
    const result = await work(progress);
    const completionTotal = args.finalTotal
      ? args.finalTotal(result)
      : args.total;
    progress?.complete(completionTotal, args.summary(result));
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    progress?.fail(message);
    throw err; // caller's withErrorBoundary still converts to tool error
  }
}
```

Callers stay declarative — no manual `try/catch/finally`:

```typescript
const progress = CampaignActivityEmitter.forCampaign(
  args.campaign_id,
  userId,
  organizationId,
  { activityType: "adding_contacts", title: "Adding contacts", notificationType: "contacts_added" }
);
const result = await withProgress(
  progress,
  {
    total: args.contacts.length,
    subtitle: `Adding ${args.contacts.length} contact(s)`,
    summary: (r) => `${r.contacts_added} contact(s) added`,
    finalTotal: (r) => r.contacts_added,
  },
  () => service.addContactsForTool(args, userId, organizationId)
);
```

Why this is concern isolation:
- The original service error STILL reaches `withErrorBoundary` — the helper re-throws after emitting `fail`.
- The Inngest send is fire-and-forget (`void inngest.send`) so an Inngest outage never replaces a real service error.
- One place to change emit behaviour for 14+ tools — manual sites drift; the helper cannot.

When `forCampaign` returns `null` (no `campaign_id`), `withProgress` is a transparent passthrough — no row, no error, no work-callback surprise.

---

## 6. Composition Over Inheritance

One level of inheritance (e.g., `extends BaseService`, `extends TenantAwareRepository`) is the established pattern — follow it. Deep hierarchies are not.

```typescript
// WRONG — deep inheritance
class SpecialCampaignService extends AdvancedCampaignService extends CampaignService { ... }

// RIGHT — composition via handlers
class CampaignService extends BaseService<...> {
  private adminHandler: CampaignAdminHandler;
  private memberHandler: CampaignMemberHandler;
  private scheduleHandler: CampaignScheduleHandler;

  constructor() {
    super(campaignRepository);
    this.adminHandler = new CampaignAdminHandler(/* injected deps */);
    this.memberHandler = new CampaignMemberHandler(/* injected deps */);
    this.scheduleHandler = new CampaignScheduleHandler(/* injected deps */);
  }
}
```

Break growing services into handler classes with constructor injection. Each handler is independently testable.

---

## 7. Pure Data Over Classes With Behavior

Configuration objects should be plain data — no functions, no class references, no registry lookups:

```typescript
// WRONG — config with embedded behavior
const config = {
  id: "pricing",
  agents: ["a", "b"],
  onComplete: async (result) => { ... },
  getRegistry: () => ServiceRegistry.get(),
};

// RIGHT — pure data
const config = {
  id: "pricing",
  agents: ["a", "b"],
  failurePolicy: "best-effort",
  timeout_ms: 180_000,
};
```

---

## 8. Visible Dependencies

Dependencies should be visible at the class level, not created inline inside methods:

```typescript
// WRONG — hidden dependency created inside a method
class OrderService extends BaseService<...> {
  async complete(orderId: string, orgId: PropelAuthOrgId) {
    const emailService = new EmailService(); // hidden, untraceable, untestable
    await emailService.send(...);
  }
}

// RIGHT for module services — repository via constructor, other services as singleton imports
import { notificationService } from "@/shared/notifications/server";

class OrderService extends BaseService<...> {
  constructor() {
    super(orderRepository); // repository wired once
  }

  async complete(orderId: string, orgId: PropelAuthOrgId) {
    const order = await this.repository.findByIdInOrg(orderId, orgId);
    await notificationService.send(order); // visible at top of file
  }
}

// RIGHT for handlers — full constructor injection
class CampaignScheduleHandler {
  constructor(
    private repository: CampaignRepository,
    private findById: (id: string) => Promise<CampaignResponse | null>
  ) {}
}
```

For module services: repository through `super()`, other services as singleton imports.
For handlers/orchestrators: all dependencies via constructor injection.

---

## 9. Inngest Handlers Are Thin

Inngest functions should orchestrate `step.run()` calls — not contain business logic. Keep each step small, and delegate to services:

```typescript
// WRONG — business logic inside the Inngest function
export const campaignPausedFunction = inngest.createFunction(
  { id: "campaign-paused" },
  { event: EventNameEnum.CAMPAIGN_PAUSED },
  async ({ event, step }) => {
    await step.run("pause-campaign", async () => {
      const campaign = await CampaignModel.findById(event.data.campaign_id); // DB in handler
      if (campaign.status === "paused") return;                               // Logic in handler
      campaign.status = "paused";                                             // Mutation in handler
      await campaign.save();
    });
  }
);

// RIGHT — handler delegates to service, each step is one unit of work
export const campaignPausedFunction = inngest.createFunction(
  { id: "campaign-paused", retries: 2 },
  { event: EventNameEnum.CAMPAIGN_PAUSED },
  async ({ event, step }) => {
    const { campaign_id, organization_id } = event.data;

    const campaign = await step.run("get-campaign", async () => {
      return campaignService.findById(campaign_id);
    });

    await step.run("cancel-scheduled-messages", async () => {
      return campaignContactService.cancelAllCampaignMessages(campaign_id);
    });
  }
);
```

**Rule of thumb:** If a `step.run()` callback is longer than 5 lines, the logic should be in a service method.

---

## Summary: The Quality Checklist

Before finishing any feature, verify:

- [ ] Mongoose never called outside `infrastructure/` — use `BaseRepository` / `TenantAwareRepository`
- [ ] Module boundaries respected — no cross-module imports (use `@/shared/` or service registry)
- [ ] Complex logic without I/O is extracted as pure functions
- [ ] For coordination code: dependencies via constructor injection, testable with fakes
- [ ] Tests use fakes with real state for close dependencies, `jest.mock()` only at infrastructure boundaries
- [ ] Test names state the invariant being enforced
- [ ] Independent concerns have independent error handling (especially event emission)
- [ ] Configuration is pure data (no functions or class references)
- [ ] Dependencies visible at class level — repository via `super()`, services as singleton imports
- [ ] Inngest handlers are thin — delegate to services, each step is one unit of work
- [ ] Error handling uses typed errors (`NotFoundError`, `BadRequestError`) and typed catches
