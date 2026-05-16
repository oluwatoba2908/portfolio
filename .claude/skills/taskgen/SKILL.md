---
name: taskgen
description: Generate a structured XML task list from a PRD (and optional Architecture Decision Document). Tasks are organized into waves by module layer with complexity ratings for model selection.
argument-hint: "[prd-path] [optional-add-path]"

---

# TaskGen: Generate Task List from PRD

Convert a PRD (and optional Architecture Decision Document) into a structured XML task list for `/execute`. Tasks are organized into waves by module layer order with complexity ratings that drive model selection.

**Input:** $ARGUMENTS — Path to PRD file, optionally followed by ADD path and/or UX spec path

**Usage:**
- `/taskgen docs/prds/14-02-26/feature-name.md` — Generate from PRD only
- `/taskgen docs/prds/14-02-26/feature-name.md docs/prds/14-02-26/add-feature-name.md` — Generate from PRD + ADD pair
- `/taskgen docs/prds/14-02-26/feature-name.md docs/prds/14-02-26/add-feature-name.md .ai/ux/feature-name.md` — Generate from PRD + ADD + UX spec

## Steps

### 1. Parse Documents

Read the PRD at the first path in $ARGUMENTS. If a second path is provided, read the ADD. If a third path is provided (or a path ending in `.ai/ux/*.md`), read the UX spec.

Extract:
- **From PRD:** Functional requirements, technical approach, affected modules, implementation phases, acceptance criteria
- **From ADD (if provided):** Implementation sequence, file list, module structure, integration points
- **From UX spec (if provided):** Visual Design Context section (token reconciliation table, component mappings), page layouts, data flow patterns

### 2. Load Architecture Context

Read these files for pattern awareness:
- `AGENTS.md` — Architecture rules
- `.ai/CONTEXT.md` — Module overview
- `docs/MODULE_ARCHITECTURE_STANDARD.md` — Layer structure (first 100 lines)

### 3. Decompose into Tasks

Break requirements into implementation tasks. Follow the module layer order:

1. **Domain layer** (complexity 1-2): Zod schemas, types, enums
2. **Infrastructure layer** (complexity 2-3): Mongoose schemas, repository, factory
3. **Application layer** (complexity 3-4): Services, agents, business logic
4. **API layer** (complexity 2-3): Route handlers, validation schemas, response DTOs, React Query hooks
5. **Inngest layer** (complexity 2-3): Event handlers, step functions
6. **UI layer** (complexity 2-4): Components, pages, layouts

**When a UX spec with "Visual Design Context" section is available:**
- UI-layer tasks (`.tsx` files) MUST include design references in their description
- Reference specific theme tokens: "Use `primary.5` for CTA buttons. Use `Stack gap='lg'` for section spacing."
- Reference component mappings: "Figma 'Feature Card' maps to `modules/[name]/components/FeatureCard.tsx`"
- Never use generic "style appropriately" — always cite specific tokens from the UX spec

For each task, specify:
- **id**: Hierarchical identifier (e.g., `1.1`, `1.2`, `2.1`)
- **complexity**: 1-5 rating (drives model selection in `/execute`)
- **file**: Target file path
- **action**: `create` or `modify`
- **description**: What to implement (specific, not vague)
- **verify**: Verification command (typically `yarn typecheck`)

### 4. Build Waves

Group tasks into waves based on file conflicts and dependencies:
- Tasks in the same wave can run in parallel (different files)
- Tasks that depend on earlier tasks go in later waves
- Wave ordering follows module layer order

### 5. Add Mandatory Final Tasks

Every task list MUST include code review and final validation tasks as the last wave.

### 6. Generate XML Output

```xml
<?xml version="1.0" encoding="UTF-8"?>
<execution_plan feature="[feature-name]" prd="[prd-path]" generated="[ISO-date]">
  <wave number="1" description="Domain: Schemas and types">
    <task id="1.1" complexity="2" status="pending"
          file="modules/[name]/domain/schema.definition.ts" action="create">
      <description>Define Zod schemas for [entity] extending baseEntitySchema</description>
      <verify>yarn typecheck</verify>
    </task>
  </wave>
  <!-- More waves... -->
</execution_plan>
```

### 7. Save Task File

Save to: `docs/prds/[DD-MM-YY]/tasks-[feature-slug].xml` (same directory as the PRD)

### 8. Output Summary

```
## Task List Generated

**File:** `docs/prds/[path]/tasks-[feature-slug].xml`
**Total Tasks:** [count]
**Waves:** [count]

**Next Step:**
Run `/execute docs/prds/[path]/tasks-[feature-slug].xml` to begin orchestrated implementation.
```

## Complexity Calibration

| Rating | Description | Model |
|--------|-------------|-------|
| 1 | Simple type export, config file, enum | haiku |
| 2 | Schema definition, basic component, repository query | haiku |
| 3 | Service method, API route, event handler | sonnet |
| 4 | Multi-file integration, complex business logic | opus |
| 5 | System-wide change, new module, architecture migration | opus |
