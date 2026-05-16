---
name: prd
description: Create a comprehensive Product Requirements Document from direct input. Includes discovery questions, codebase analysis, ESLint constraints, and enterprise readiness criteria.
argument-hint: "[feature description]"

---

# Create PRD

Generate a comprehensive Product Requirements Document (PRD) enriched with codebase context.

**Enterprise-First Mindset:** All features must be designed with enterprise scalability in mind - code should be ready for a 10-engineer team to maintain, extend, and onboard onto.

**First-Use Mindset:** Imagine you are a dumb human in 2026 trying to do this task for the first time. They have never seen this product, do not know our jargon, and will not read documentation. Every requirement, flow, and acceptance criterion must hold up under that lens — if a first-time user cannot succeed without help, the PRD is incomplete.

**Input:** $ARGUMENTS — A feature description, or leave blank to be prompted.

## Steps

### 1. Determine Input Source

1. **If a feature description is provided in $ARGUMENTS:**
   - Use the provided text as the feature source

2. **If $ARGUMENTS is empty:**
   - Ask: "Please describe the feature you'd like to build."

### 2. Requirements Discovery (Conversational)

Before generating the PRD, engage in discovery. This is NOT optional.

1. **Summarize understanding** (1-2 sentences)
2. **Ask 4-5 targeted questions** from these categories:
   - Problem & Context (what pain point, current workarounds)
   - Users & Scope (who uses it, segments, frequency)
   - Requirements (success criteria, must-haves vs nice-to-haves)
   - Technical (integrations, performance considerations)
   - UX & Design (UI placement, reference implementations, design input needed)
   - Figma Design: "Do you have a Figma design for this feature? Provide the URL (figma.com/design/...) or say 'none'."
3. **Wait for responses** before proceeding
4. **Auto-populate from OUTCOMES.md:** If `figma_url` exists on the relevant outcome in `../airstride/OUTCOMES.md`, use it automatically and confirm with the user.
5. **Confirm understanding** with a brief summary, get user approval

### 3. Search Codebase Context

1. Search for related code — existing implementations, affected modules, patterns to follow
2. Check `docs/` for relevant architecture docs
3. Read `eslint.config.mjs` to extract module boundary rules, layer restrictions, client/server boundaries

### 4. Generate PRD

Create PRD with these sections:

**Frontmatter** — Include at the top of every PRD:
```markdown
**Date:** [date]
**Status:** Draft
**Type:** [Feature / Infrastructure / Refactor]
**Priority:** [P0-P3]
**ui_heavy:** [true/false]
**Figma Design:** [URL or N/A]
```

**Enforcement:** When `ui_heavy: true` and `Figma Design` is `N/A` or missing, emit a warning in the PRD:
> ⚠️ UI-heavy PRD without Figma reference. Design accuracy cannot be guaranteed during autonomous execution.

**Sections:**
- Executive Summary, Problem Statement, Target Users
- Goals & Success Metrics, Scope (In/Out), User Stories
- Functional Requirements (P0/P1/P2)
- Technical Approach (affected modules, architecture patterns, ESLint constraints, DB changes, API changes)
- Security & Configuration, Design Input
- Enterprise Readiness (10-engineer collaboration requirements)
- Implementation Phases (Foundation → Core → Polish)
- Dependencies & Risks, Future Considerations, Open Questions
- Human Acceptance Test, Acceptance Criteria (Functional + Quality + Enterprise + UX)

### 5. Save PRD

1. **Check for existing PRDs** in `docs/prds/` with similar names first
2. Save to: `docs/prds/[DD-MM-YY]/[feature-slug].md`
3. Use kebab-case, create directory if needed

### 6. Output Confirmation

```
## PRD Created

**File:** `docs/prds/[path]`
**Feature:** [Name]
**Key Requirements (P0):** [top 3]
**Design Required:** [Yes/No/Partial]
**Open Questions:** [count]

**Next Steps:**
1. Review PRD for accuracy
2. Answer open questions
3. Run `/architect [prd-path]` to design architecture
4. Run `/taskgen [prd-path] [add-path]` to generate task list
```
