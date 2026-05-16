---
name: outcomes
description: Interactive project setup to discover outcomes, create state files, and enable autonomous orchestration via /orchestrate.
argument-hint: "[optional outcome description]"

---

# Outcomes: Define Project Deliverables

Interactive project setup — discover outcomes, create state files, and enable autonomous orchestration via `/orchestrate`.

**Input:** $ARGUMENTS — Optional outcome description to seed the conversation

## Steps

### 1. Idempotency Gate

Check if `../airstride/OUTCOMES.md` exists (parent dir, shared across worktrees):
- **If exists:** Offer to review/update, start fresh, or cancel
- **If missing:** Proceed to discovery

### 2. Interactive Discovery

**Round 1:** One open question — describe the project, who it's for, what success looks like.

**Round 2:** Extract deliverables, propose as outcomes with success criteria. Max 3 questions.

**Round 3: Design References**
Ask: "Do you have Figma designs for any of these outcomes? Provide the Figma URL(s) (figma.com/design/...) for each outcome that has one, or say 'none'."
- Validate URL format: must match `figma.com/design/:fileKey/...` or `figma.com/make/:fileKey/...`
- If no URL provided, store `figma_url: none` on the outcome
- If URL provided, store `figma_url: <url>` on the outcome

**Round 4+:** Refinement only if contradictions, vague criteria, or unclear dependencies.

**Stop when:** Each outcome is one sentence, has measurable criteria, no contradictions, dependencies documented.

### 3. Confirmation

Present outcome table and wait for explicit user confirmation.

### 4. Create State Files

- Create/overwrite `../airstride/OUTCOMES.md` with outcomes, criteria, constraints, non-goals
- Include `figma_url: <url>` (or `figma_url: none`) as metadata on each outcome that has a design reference
- Create `../shared/ROADMAP.md` only if missing

### 5. Completion Summary

Report files created. Offer to run `/orchestrate`.
