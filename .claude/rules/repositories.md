---
paths:
  - "modules/**/infrastructure/**/*repository.ts"
  - "modules/**/lib/**/repository.ts"
  - "lib/db/mongoose/services/*.ts"
  - "shared/db/schema.builder.ts"
---

# Repository Layer Conventions

## Class Hierarchy

Repositories follow a three-level class hierarchy:

```
BaseRepository<TEntity>
  └── TenantAwareRepository<TEntity>
        └── ConcreteModuleRepository
```

- `BaseRepository` — `lib/db/mongoose/services/base.repository.ts`
- `TenantAwareRepository` — `lib/db/mongoose/services/tenant.aware.repository.ts`
- `IMongoose` / `IEntity` — `shared/repositories/types.ts`

## Creating a Repository

Most repositories extend `TenantAwareRepository` for org-scoped data access:

```typescript
import { TenantAwareRepository } from '@/lib/db/mongoose/services/tenant.aware.repository';
import { ModuleModel, ModuleDocument } from './module.schema';

export class ModuleRepository extends TenantAwareRepository<ModuleDocument> {
  constructor() {
    super(ModuleModel);
  }

  // Custom query methods here
}

// Always export a singleton instance
export const moduleRepository = new ModuleRepository();
```

The `TEntity` generic must satisfy `IMongoose<Types.ObjectId>`:

```typescript
interface IEntity<TId = any> {
  _id: TId;
}

interface IMongoose<TId = any> extends IEntity<TId> {
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
  is_deleted?: boolean;
}
```

Use `BaseRepository` directly only when org-scoping is not needed (rare).

## Repository Responsibilities

### Repositories Should:
1. **Encapsulate data access** — All Mongoose operations happen here
2. **Provide domain-specific queries** — `findByStatus()`, `findActive()`, etc.
3. **Handle database operations** — CRUD, atomic updates, aggregation pipelines
4. **Always filter by tenant** — Use `TenantAwareRepository` methods with `PropelAuthOrgId`

### Repositories Should NOT:
1. Contain business logic — That's the service's job
2. Emit events — That's the service's job
3. Call other repositories — Coordinate in service layer
4. Be imported cross-module — Access through the module's service instead

## Mongoose Isolation

**Critical Rule: Mongoose ONLY in infrastructure layer**

```typescript
// CORRECT — Mongoose in repository
export class ModuleRepository extends TenantAwareRepository<ModuleDocument> {
  async findByStatus(orgId: PropelAuthOrgId, status: string) {
    return this.findByTenant(orgId, { status });
  }
}

// WRONG — Mongoose in service
export class ModuleService extends BaseService {
  async getByStatus(status: string) {
    return ModuleModel.find({ status }); // Mongoose leaking into service!
  }
}
```

## Multi-Tenancy (Critical!)

Use `TenantAwareRepository` methods with the `PropelAuthOrgId` branded type. This provides compile-time safety — passing a plain `string` causes a TypeScript error.

```typescript
// CORRECT — use tenant-aware methods
async findActiveForOrg(orgId: PropelAuthOrgId) {
  return this.findByTenant(orgId, { status: 'active' });
}

// CORRECT — tenant-aware update
async updateForOrg(orgId: PropelAuthOrgId, id: string, update: UpdateQuery<ModuleDocument>) {
  return this.updateByIdForTenant(orgId, id, update);
}

// WRONG — missing org scope (security vulnerability!)
async findByStatus(status: string) {
  return this.find({ status }); // Returns data from ALL orgs
}
```

**TenantAwareRepository methods:** `findByTenant`, `findOneByTenant`, `countByTenant`, `updateByIdForTenant`, `deleteByIdForTenant`

The tenant field is `created_by_propel_auth_org_id`, applied automatically by `withTenant()`.

## Soft Delete (Automatic)

`BaseRepository` automatically applies `{ is_deleted: false }` to all queries via `withNotDeleted()`. The `deleteById` method sets `is_deleted: true` rather than physically removing documents.

```typescript
// No need to manually filter — soft delete is automatic
async findActive(orgId: PropelAuthOrgId) {
  return this.findByTenant(orgId, { status: 'active' });
  // Internally becomes: { status: 'active', created_by_propel_auth_org_id: orgId, is_deleted: false }
}

// To query deleted records explicitly
async findDeleted(filter: FilterQuery<ModuleDocument>) {
  return this.findDeleted(filter); // Only returns is_deleted: true
}
```

## Key BaseRepository Methods

| Method | Return Type | Notes |
|--------|-------------|-------|
| `create(doc)` | `Promise<TEntity>` | Validates `_id` present |
| `insertMany(docs, opts?)` | `Promise<TEntity[]>` | `ordered: false` default |
| `find(filter, options?)` | `Promise<[TEntity[], number]>` | Returns **tuple** of docs + total count |
| `findOne(filter)` | `Promise<TEntity \| null>` | |
| `findById(id)` | `Promise<TEntity \| null>` | Validates ObjectId |
| `atomicUpdate(id, updates)` | `Promise<TEntity \| null>` | Pure `$set` operations |
| `findOneAndUpdate(filter, updates)` | `Promise<TEntity \| null>` | Arbitrary update operators |
| `updateById(id, update)` | `Promise<TEntity \| null>` | |
| `updateByIdWithArrayFilters(id, update, arrayFilters?)` | `Promise<TEntity \| null>` | Disables auto-timestamps |
| `updateOne(filter, update)` | `Promise<number>` | Returns modifiedCount |
| `updateMany(filter, update)` | `Promise<number>` | Returns modifiedCount |
| `deleteById(id)` | `Promise<TEntity \| null>` | Soft delete |
| `count(filter?)` | `Promise<number>` | |
| `aggregate<TResult>(pipeline)` | `Promise<TResult[]>` | Auto-prepends `is_deleted: false` |
| `bulkWrite(docs, matchField, opts?)` | `Promise<BulkWriteResult<TEntity>>` | |
| `upsert(doc)` | `Promise<TEntity>` | Handles `_id` presence |

## Lean Queries

For read-heavy paths, define typed lean interfaces and use `.lean<T>()`:

```typescript
export type LeanModule = {
  _id: Types.ObjectId;
  name: string;
  status: string;
  // ... only the fields you need
};

export class ModuleRepository extends TenantAwareRepository<ModuleDocument> {
  async findByIdLean(id: string): Promise<LeanModule | null> {
    return this.model
      .findOne({ _id: new Types.ObjectId(id), is_deleted: false })
      .lean<LeanModule>();
  }
}
```

## Atomic Operations

**Never** use read-then-write patterns. Use atomic MongoDB operations:

```typescript
// WRONG — read-then-write (race condition)
async incrementCount(id: string) {
  const doc = await this.findById(id);
  doc.count += 1;
  return this.atomicUpdate(id, { count: doc.count });
}

// CORRECT — atomic $inc
async incrementCount(orgId: PropelAuthOrgId, id: string) {
  return this.findOneAndUpdate(
    { _id: new Types.ObjectId(id), created_by_propel_auth_org_id: orgId },
    { $inc: { count: 1 } }
  );
}

// CORRECT — atomic array push
async addItem(orgId: PropelAuthOrgId, id: string, item: Item) {
  return this.updateById(id, { $push: { items: item } });
}
```

## Schema & Model Pattern

### Schema Definition (Zod-to-Mongoose)

Domain types are defined once in Zod. Use `mergeWithBaseFields()` to convert to a Mongoose schema definition:

```typescript
// infrastructure/module.schema.ts
import { mergeWithBaseFields } from '@/shared/db/schema.builder';
import { baseUserEntityDefinition } from '@/lib/db/mongoose/schemas/base.schema';

const moduleDefinition = mergeWithBaseFields(
  ModuleFieldsSchema.omit({ /* fields to exclude */ }),
  baseUserEntityDefinition
);

const ModuleSchema = new Schema(moduleDefinition, createSchemaOptions(MODULE_MODEL_NAME));

export type ModuleDocument = InferSchemaType<typeof ModuleSchema> & IMongoose<Types.ObjectId>;
```

### Model Registration (HMR-safe)

Use `registerModel()` to prevent duplicate model errors during hot reload:

```typescript
import { registerModel } from '@/lib/db/mongoose/services/registry';

// Collection names use dot-notation namespacing
const MODULE_MODEL_NAME = 'module.items';

export const ModuleModel = registerModel<ModuleDocument>(
  MODULE_MODEL_NAME,
  () => ModuleSchema
);
```

### Index Definitions

Declare indexes on the schema before registration:

```typescript
ModuleSchema.index({ organization_id: 1, status: 1 });
ModuleSchema.index(
  { created_by_propel_auth_org_id: 1, is_deleted: 1, status: 1 },
  { name: 'idx_tenant_deleted_status' }
);
ModuleSchema.index({ external_id: 1 }, { unique: true, sparse: true });
```

## Singleton Export & Registration

Repositories are always exported as singletons. Services import the singleton directly:

```typescript
// infrastructure/index.ts — barrel export
export { ModuleModel, type ModuleDocument } from './module.schema';
export { moduleRepository } from './module.repository';

// application/module.service.ts — service imports singleton
import { moduleRepository } from '../infrastructure';

export class ModuleService extends BaseService<...> {
  constructor() {
    super(moduleRepository);
  }
}
export const moduleService = new ModuleService();
```

Cross-module access goes through the `ServiceRegistry` — never import another module's repository directly.

## Aggregation Pipelines

Complex cross-collection queries live in the repository. Define typed result interfaces locally:

```typescript
interface ModuleMetrics {
  total: number;
  byStatus: { status: string; count: number }[];
}

export class ModuleRepository extends TenantAwareRepository<ModuleDocument> {
  async aggregateMetrics(orgId: PropelAuthOrgId): Promise<ModuleMetrics[]> {
    return this.aggregate<ModuleMetrics>([
      { $match: { created_by_propel_auth_org_id: orgId } },
      { $facet: {
        total: [{ $count: 'count' }],
        byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
      }},
    ]);
  }
}
```

Note: `aggregate()` auto-prepends `{ $match: { is_deleted: false } }`.

## Reference Implementations

- [modules/campaigns/infrastructure/campaign.repository.ts](../../modules/campaigns/infrastructure/campaign.repository.ts) — `TenantAwareRepository` with lean queries and aggregation
- [modules/campaigns/infrastructure/campaign.contact.repository.ts](../../modules/campaigns/infrastructure/campaign.contact.repository.ts) — complex aggregation pipelines and array filters
- [modules/whitelabel/infrastructure/whitelabel.repository.ts](../../modules/whitelabel/infrastructure/whitelabel.repository.ts) — upsert and atomic array push patterns

## See Also
- @docs/MODULE_ARCHITECTURE_STANDARD.md
- @AGENTS.md
