---
name: architect
description: Generate an Architecture Decision Document (ADD) from an existing PRD. Explores multiple approaches, recommends optimal design with extractability in mind.
argument-hint: "[path-to-prd]"

---

# Architect: Design Architecture from PRD

Generate an Architecture Decision Document (ADD) that complements an existing PRD. Analyzes requirements, explores multiple architectural approaches, and recommends the optimal design with extractability and modularity in mind.

**Design Philosophy:** All architectures must be designed for extraction - generic interfaces, minimal project coupling, potentially packageable as standalone libraries.

**Input:** $ARGUMENTS — Path to the PRD file (e.g., `docs/prds/01-02-26/feature-name.md`)

## Steps

### 1. Validate PRD

1. If $ARGUMENTS is provided, read the PRD file
2. If not provided, list recent PRDs in `docs/prds/` and ask user to select
3. If PRD is incomplete, warn and ask whether to continue

### 2. Parse PRD Content

Extract: core requirements, constraints (ESLint, module boundaries), scale indicators, technology requirements.

### 3. Architectural Discovery (Conversational)

1. Summarize the feature and its core technical challenge
2. Ask 4-5 targeted questions about: extraction/reusability, boundaries/interfaces, state/data, integration points, complexity trade-offs, pattern preferences
3. Wait for user responses, follow up if needed
4. Confirm understanding before designing

### 4. Analyze Codebase Context

1. Search for similar patterns in existing code
2. Analyze reference modules mentioned in PRD
3. Check `shared/` for reusable utilities and base classes
4. Verify ESLint constraints from `eslint.config.mjs`

### 5. Generate 2-4 Architectural Options

For each option provide:
- Name, core concept, ASCII architecture diagram
- Key abstractions and module structure
- Extraction potential (npm package / internal library / project-specific)
- Trade-offs table (simplicity, flexibility, extractability, time to MVP, maintenance, testing)
- Risks

### 6. Present Options with Recommendation

Show comparison table and recommend an option. Wait for user selection.

### 7. Deep Dive Selected Option

Elaborate: detailed component design, data flow, integration spec, extraction roadmap, file-by-file implementation guide.

### 8. Save ADD

- Same folder as PRD with `add-` prefix: `docs/prds/[DD-MM-YY]/add-[feature-slug].md`
- Include: Context, Decision Drivers, Options Considered, Decision, Architecture Overview, Core Abstractions, Module Structure, Integration Points, Extraction Plan, Implementation Sequence, Consequences, Review Checklist

### 9. Output Confirmation

```
## Architecture Decision Document Created

**ADD:** `[path]`
**PRD:** `[prd_path]`
**Decision:** Option [X] - [Name]
**Extraction Potential:** [High/Medium/Low]

**Next Steps:**
1. Review ADD with team
2. Run `/taskgen [prd_path]` to generate task list
3. Run `/execute` to begin implementation
```
