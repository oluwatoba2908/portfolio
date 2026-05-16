---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "modules/**"
  - "app/**"
  - "components/**"
  - "shared/**"
---

# Values: Discovery & Reuse

## ⚠️ MANDATORY: Read Reference Code FIRST

**STOP before writing ANY code. Read reference implementations FIRST.**

This is **NOT optional**. Every line of code you write must match existing patterns in the codebase. If you write code that looks different from reference implementations, you're introducing inconsistency and creating technical debt.

## Core Principle: Reuse Before Create

**Always prioritize discovering and reusing existing patterns, components, and solutions before creating new ones.**

**The discovery process is MANDATORY:**
1. **READ THE PRD/REQUIREMENTS FIRST** - Understand functional requirements (auth vs no-auth, etc.)
2. Identify what you're building (API route, service, component, etc.)
3. Find 2-3 reference implementations of the same type
4. READ the reference code in full
5. Copy the structure and patterns exactly
6. Only adapt the business logic specific to your feature

**CRITICAL:** If you skip step 1 (reading PRD), you will violate functional requirements. If you skip steps 3-5 (reading reference code), you will violate architectural patterns. Both are equally important.

### Decision Hierarchy

1. **Discover**: Search for existing implementations in the codebase
   - Look for similar features in reference modules (`modules/research/`, `modules/tasks/`, `modules/integrations/`, `modules/onboarding/`)
   - Check for reusable components, services, or patterns
   - Review established conventions in `AGENTS.md` and architecture docs

2. **Reuse**: Leverage what already exists
   - Use existing components as-is when they fit the requirements
   - Follow established patterns (BaseService, BaseRepository, etc.)
   - Copy and adapt from reference implementations

3. **Improve**: Enhance existing code only when necessary
   - Refactor only if there's a clear gap or limitation
   - Extend existing patterns rather than creating parallel ones
   - Document improvements for future reference

4. **Create**: Build new solutions only when there's a clear gap
   - Verify no existing solution can be adapted
   - Ensure new code follows established patterns
   - Design for reusability by future work

### Why This Matters

- **Consistency**: Reusing patterns maintains architectural coherence
- **Velocity**: Leveraging existing work accelerates development
- **Maintenance**: Fewer unique implementations means easier codebase navigation
- **Quality**: Battle-tested code is more reliable than new code

### Critical Pattern: API Routes MUST Use Singleton Services

**❌ NEVER DO THIS (Wrong Pattern):**
```typescript
// BAD: Creating repositories and instantiating service in API route
const repos = createOversubscribedRepositories();
const service = new OversubscribedService(
  repos.sessionRepo,
  repos.diagnosisRepo,
  // ... manual dependency injection
);
await service.generateDiagnosis(...);
```

**✅ ALWAYS DO THIS (Correct Pattern):**
```typescript
// GOOD: Import singleton service from module barrel export
import { researchService } from "@/modules/research";
import { tasksService } from "@/modules/tasks";

// Use service directly - no instantiation, no repository creation
await researchService.createResearch(...);
await tasksService.create(...);
```

**Why This Matters:**
- **Consistency**: Every module in the codebase uses singleton services
- **No DI in Routes**: API routes NEVER create repos or instantiate services
- **Module Exports**: Services are exported from `modules/[name]/index.ts`
- **Barrel Exports**: Always import through module barrel, never internal paths

**Before Writing ANY API Route:**
1. **READ THE PRD/REQUIREMENTS FIRST** - Does this route require auth or is it public/pre-auth?
2. Check `app/api/research/route.ts` or `app/api/tasks/route.ts` as reference for **auth-required routes**
3. Check `app/api/slack/` or public API examples for **pre-auth/public routes**
4. Import the singleton service: `import { moduleService } from "@/modules/[name]"`
5. Use appropriate HOFs:
   - **Auth-required**: `withAuth`, `withDb`, `withValidation`, `withOrgFilter`
   - **Pre-auth/Public**: `withDb`, `withValidation` (NO `withAuth`)
6. Call service methods directly - NO `new Service()`, NO `createRepositories()`

### Examples

**Good**: "I need a Zod schema for user data → use BaseFactory pattern from modules/research/"

**Bad**: "I need a Zod schema for user data → create a custom validation approach"

**Good**: "This component is 80% what I need → extend it with new props"

**Bad**: "This component is 80% what I need → build a new one from scratch"

**Good**: "Writing API route → READ PRD FIRST → check if auth required → import singleton service → use appropriate HOFs → call methods"

**Bad**: "Writing API route → assume withAuth always needed → create repositories → instantiate service → manual DI"

**Good**: "Pre-auth route (per PRD) → use `withDb`, `withValidation` (NO `withAuth`)"

**Bad**: "Pre-auth route (per PRD) → use `withAuth` anyway (violates requirements)"

### Mandatory Discovery Process

**BEFORE writing any code, ALWAYS:**

1. **Read Reference Implementations**
   - API routes? Read `app/api/research/route.ts` and `app/api/tasks/route.ts`
   - New module? Read `modules/research/index.ts` and `modules/tasks/index.ts`
   - Service? Read `modules/research/application/service.ts`
   - Repository? Read `modules/research/infrastructure/repository.ts`
   - Component? Search `components/` for similar patterns

2. **Check Module Exports**
   - Read `modules/[name]/index.ts` to see what's exported
   - Look for singleton service instances (e.g., `researchService`)
   - Never import from internal paths - use barrel exports only

3. **Verify Architectural Patterns**
   - Check `AGENTS.md` for conventions
   - Review `docs/MODULE_ARCHITECTURE_STANDARD.md`
   - Ensure your implementation matches established patterns

4. **Compare Your Code to References**
   - Does it look structurally identical to the reference?
   - Are you using the same HOFs, patterns, and conventions?
   - If it looks different, you're probably doing it wrong

### Questions to Ask Before Creating

1. Does this already exist in the codebase?
2. Can I adapt an existing pattern to fit this need?
3. Have I READ a reference implementation first?
4. Does my code look structurally identical to the reference?
5. If I build this, will it be reusable for future features?
6. Am I introducing a new pattern when an established one exists?

---

## Real Example: What Happens When You Skip Discovery

**Case Study: Oversubscribed Module APIs (February 2026)**

The oversubscribed module APIs were implemented **without reading reference implementations AND without reading the PRD**. Result:

❌ **Violation #1: Manual Service Instantiation**
- Manual repository creation in every API route: `const repos = createOversubscribedRepositories()`
- Service instantiation with manual DI: `new OversubscribedService(...)`
- No singleton service exported from module
- Completely different structure from rest of codebase

❌ **Violation #2: Wrong Auth Pattern**
- PRD explicitly stated: "Pre-auth routes: No auth required (interrogation, diagnosis view)"
- APIs used `withAuth` on pre-auth routes (diagnose, vision, battle-plan)
- User cannot access diagnosis/vision BEFORE signing up (violates conversion funnel)
- Requirements not read before implementation

✅ **What Should Have Been Done:**
1. **Read the PRD FIRST** - Understand pre-auth vs post-auth requirements
2. **Read reference implementations:**
   - Auth-required: `app/api/research/route.ts` (has `withAuth`)
   - Pre-auth: `app/api/slack/` (NO `withAuth`)
3. **Copy the appropriate pattern:**
   - Export singleton: `export { oversubscribedService } from "./application/service"`
   - Pre-auth routes: `withDb`, `withValidation` (NO `withAuth`)
   - Post-auth routes: `withAuth`, `withDb`, `withValidation`
4. **Use singleton in all routes:** `import { oversubscribedService } from "@/modules/oversubscribed"`

**Impact of Skipping Discovery:**
- Code review required (wasted time)
- Complete rework needed (wasted effort)
- Functional requirements violated (user can't access pre-auth flow)
- Inconsistency introduced (technical debt)
- Pattern violation (architectural drift)
- Conversion funnel broken (business impact)

**Lesson:** 10 minutes reading PRD + reference code saves hours of rework and prevents functional bugs.

---

**Remember**: The best code is the code you don't have to write. The second-best code is code that looks identical to existing patterns. Discover, reuse, then improve or create only when justified.
