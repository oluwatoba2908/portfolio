---
paths:
  - "app/api/**/*.ts"
---

# API Route Conventions

## Mandatory Pattern

### 1. Import Singleton Services
**ALWAYS** import singleton services from module server barrel exports:

```typescript
import { campaignService } from "@/modules/campaigns/server";
```

**NEVER** instantiate services or create repositories in API routes:

```typescript
// ❌ WRONG
const repos = createModuleRepositories();
const service = new ModuleService(repos.someRepo);

// ❌ WRONG - importing from module root (client-safe barrel)
import { campaignService } from "@/modules/campaigns";

// ✅ CORRECT - import from /server barrel
import { campaignService } from "@/modules/campaigns/server";
```

### 2. Use Higher-Order Functions (HOFs)

HOFs compose as nested wrappers. The handler always receives 3 arguments: `(req, context, props)` where `props` is accumulated by each HOF in the chain.

**Core HOFs:**
- `withAuth` — Requires authenticated user, provides `WithAuthProps` (from `@/hooks/withAuth`)
- `withNoAuth` — Public routes, no auth required (from `@/hooks/withNoAuth`)
- `withDB` — Connects to MongoDB (from `@/hooks/withDB`)

**Validation HOFs** (from `@/lib/zod/validation`):
- `withValidation(schema, handler)` — Validates request body, adds `body` to props
- `withPatchValidation(schema, handler)` — Validates PATCH requests (supports JSON Patch RFC 6902)

**Resource Validation HOFs** (from `@/hooks/with*.ts`):
- `withOrgValidation` — Extracts and validates `orgId` from route params
- `withOrgUserValidation` — Validates user belongs to org
- `withConnectorAuth` — Connector-specific authentication
- `withSubscription` — Subscription tier checks
- `withPartnerValidation`, `withListValidation`, `withConnectorValidation`, etc.

**Auth-Required Route:**
```typescript
import { campaignService, TriggerCampaignSchema, TriggerCampaignInput } from "@/modules/campaigns/server";

export const POST = withAuth(
  withDB(
    withValidation(
      TriggerCampaignSchema,
      async (_req, {}, { user, activeOrgId, body }) => {
        const input = body as TriggerCampaignInput;
        const result = await campaignService.triggerCampaign(input, user.userId, activeOrgId);
        return NextResponse.json(result);
      }
    )
  ),
  { requiredPermissions: [Permissions.MUTATE_CAMPAIGN] }
);
```

**Public/Webhook Route** (no auth required):
```typescript
export const POST = withNoAuth(
  withDB(
    withValidation(
      WebhookEventSchema,
      async (_req, _params, { body }: { body: WebhookEvent }) => {
        // Process webhook
        return NextResponse.json({ message: "webhook_processed_successfully" });
      }
    )
  )
);
```

**GET with Query Params:**
```typescript
export const GET = withAuth(
  withDB(async (req: NextRequest, {}, { user, activeOrgId }) => {
    const { searchParams } = new URL(req.url);
    const result = await campaignService.getCampaigns(searchParams, activeOrgId, user.userId);
    return NextResponse.json(result);
  })
);
```

**PATCH with JSON Patch Support:**
```typescript
export const PATCH = withAuth(
  withDB(
    withOrgValidation(
      withPatchValidation(
        UpdateOrganisationZodSchema,
        async (_req, _params, { user, body, orgId, activeOrgId }) => {
          const dbResult = await organisationService.update(orgId, activeOrgId, user.userId, body);
          if (!dbResult) throw new NotFoundError("Organisation not found");
          return NextResponse.json(dbResult);
        }
      )
    )
  ),
  { anyPermissions: [Permissions.MUTATE_ORGANISATIONS, Permissions.MUTATE_ONBOARDING] }
);
```

### 3. Permission Configuration

`withAuth` accepts a second argument for permission/role checks:

```typescript
// Require ALL listed permissions
{ requiredPermissions: [Permissions.READ_CAMPAIGN] }

// Require ANY ONE of the listed permissions
{ anyPermissions: [Permissions.MUTATE_ORGANISATIONS, Permissions.MUTATE_ONBOARDING] }

// Require ALL of the listed permissions
{ allPermissions: [Permissions.READ_CAMPAIGN, Permissions.MUTATE_CAMPAIGN] }

// Require specific roles
{ requiredRoles: ["VENDOR_ADMIN"] }
{ anyRoles: ["VENDOR_ADMIN", "AIRSTRIDE_ADMIN"] }

// Custom permission check
{ customCheck: (permissions) => permissions.hasPermission("CUSTOM") }
```

### 4. Handler Signature

All handlers receive 3 arguments — never destructure auth props from the 2nd arg:

```typescript
// ❌ WRONG - auth props in 2nd arg
async (req, { user, activeOrgId }) => { ... }

// ✅ CORRECT - auth props in 3rd arg (props)
async (req, {}, { user, activeOrgId }) => { ... }

// ✅ CORRECT - with route params from 2nd arg
async (req, { params }, { user, activeOrgId }) => {
  const { id } = await params;  // Next.js 15+: params is a Promise
}
```

`WithAuthProps` provides: `user`, `activeOrgId`, `activeOrgName`, `role`, `userType`, `permissions`, `name`

### 5. Error Handling

Throw custom error classes — `withAuth` catches them and returns JSON responses:

```typescript
import { NotFoundError, BadRequestError, ForbiddenError } from "@/types/errors";
import { createErrorResponse } from "@/utils/error.response.builders";

// Throwing (preferred — caught by HOF wrapper)
throw new NotFoundError("Campaign not found");
throw new BadRequestError("Invalid campaign status");
throw new ForbiddenError("Not authorized to access this campaign");

// Manual error response (use in try-catch blocks)
return createErrorResponse(error);
```

### 6. Never in API Routes
- ❌ No `new Service()` instantiation
- ❌ No `createRepositories()` calls
- ❌ No manual dependency injection
- ❌ No Mongoose models or queries
- ❌ No event emission (emit from services only)
- ❌ No `withValidation(schema)(handler)` curried form — use `withValidation(schema, handler)`

### 7. Validation Schemas

Schemas live in `app/api/_validations/` organized by domain:

```typescript
import { CreateCheckoutSessionZodSchema, CreateCheckoutSessionRequest } from "@/app/api/_validations/billing/billing.validation";
```

## Before Writing ANY API Route

1. **READ THE PRD/REQUIREMENTS FIRST** — Understand if route requires auth or is public
2. Check reference implementations below
3. Import singleton service from module `/server` barrel
4. Use appropriate HOFs based on auth requirements:
   - **Public/Webhook**: `withNoAuth(withDB(withValidation(...)))`
   - **Auth-Required**: `withAuth(withDB(withValidation(...)))`
   - **With Org Param**: Add `withOrgValidation` after `withDB`
   - **PATCH**: Use `withPatchValidation` instead of `withValidation`
5. Add permission config to `withAuth` as second argument
6. Call service methods directly

## Reference Implementations

**Auth-Required + Validation:**
- [app/api/campaigns/route.ts](../../app/api/campaigns/route.ts) — GET (query params) + POST (validation + permissions)
- [app/api/billing/checkout/route.ts](../../app/api/billing/checkout/route.ts) — POST with role-based auth

**Auth-Required + Route Params:**
- [app/api/campaigns/[id]/contacts/route.ts](../../app/api/campaigns/[id]/contacts/route.ts) — GET with `await params`

**PATCH + Org Validation:**
- [app/api/auth/orgs/[id]/route.ts](../../app/api/auth/orgs/[id]/route.ts) — GET/PATCH/DELETE with `withOrgValidation` + `withPatchValidation`

**Public/Webhook:**
- [app/api/webhooks/route.ts](../../app/api/webhooks/route.ts) — `withNoAuth` + discriminated union validation
