---
name: orchestrate
description: Launch the autonomous PM to PL cycle to deliver project outcomes. PM agent plans sprints, PL agent executes them, orchestrator manages branches and merges.
argument-hint: "[--max-cycles N] [--dry-run] [--outcome N]"

---

# Orchestrate: Autonomous PM→PL Cycle

Launch the autonomous orchestrator that drives PM→PL cycles to deliver project outcomes.

**Input:** $ARGUMENTS — Optional: `--max-cycles N` (default: 10), `--dry-run` (plan only), `--outcome N` (target specific outcome)

## Operating Principles

- Delegate through the full chain for every sprint. The chain produces the audit trail and artifact set.
- Run PL agents in the foreground so progress is visible. If a PL hasn't committed within ~15 minutes, check `git log` — it likely stalled; intervene.
- Chunk large sprints: one wave per `/execute` spawn (3–5 tasks max). Spawn a fresh `/execute` in the main conversation — never `SendMessage` a PL that returned without executing.

## Pre-flight

1. Git repo present; if dirty, commit to `save/pre-orchestrate-*` and continue.
2. `../airstride/OUTCOMES.md`, `../airstride/ROADMAP.md`, `.claude/VALUES.md` present (run `/outcomes` first if missing).
3. No existing orchestrator session is running.

## Launch

```bash
npx tsx scripts/orchestrator.ts                    # all outcomes
npx tsx scripts/orchestrator.ts --dry-run          # plan only
npx tsx scripts/orchestrator.ts --max-cycles 5
npx tsx scripts/orchestrator.ts --outcome 150      # single outcome
```

Invoke via the Bash tool with `run_in_background` unset/false so stdout streams into the conversation. If the user explicitly asks for a detached run, confirm once and proceed.

## Cycle Loop

1. **PM agent** reads `../airstride/OUTCOMES.md` + `../airstride/ROADMAP.md` + `.ai/retros/` → plans sprints → writes PRD (with `ui_heavy` flag) → outputs signal
2. Parse PM signal: complete/blocked/error/next_task
3. **CTO agent** reads PRD + recent `.ai/audits/` + recent `.ai/retros/` → makes architecture decisions grounded in past outcomes → writes ADD
4. **UX Design** (UI-heavy sprints only): detected via `ui_heavy: true` in PRD → runs `/ux-design [prd-path]` → writes UX spec to `.ai/ux/[feature-slug].md`
5. **Pre-implementation reliability audit**: runs `/reliability-audit` against the sprint's target module/outcome → identifies likely failures, gaps, and test specs BEFORE coding begins. Report saved to `.ai/audits/`. Test specs feed into TaskGen.
6. **PL agent** per sprint:
   - Branch pre-flight: `yarn typecheck && yarn eslint . --quiet` on existing branch before touching any files
   - Reads PRD + ADD + UX spec (if exists) + reliability audit
   - TaskGen → Execute → commit on branch
   - Writes sprint retrospective to `.ai/retros/[sprint].md`
7. **Post-sprint reliability audit**: runs `/reliability-audit` against the implemented code → verifies test coverage, catches missed edge cases, validates contracts. If P0 gaps found, PM creates a fix sprint.
8. **Post-sprint security audit**: runs `security-auditor` agent against the implemented code → checks auth, multi-tenancy, input validation, data exposure. If CRITICAL findings, PM creates a fix sprint.
9. **Create a PR** for the sprint branch (only if post-sprint audit has no P0 gaps AND security audit has no CRITICAL findings). Use `gh pr create` with a summary of changes. Do NOT merge directly to main — always create a PR and let the user review/merge.
10. Feed results (including retro path) to PM for next cycle
11. **Convergence-based stuck detection**: if the same sprint appears in multiple consecutive cycles AND audit finding count is not decreasing between attempts → halt. Simple oscillation (e.g. "almost done → audit failure → retry") without convergence triggers the halt.
12. **Complexity budget**: track cumulative task complexity scores per run (1=haiku task, 3=sonnet, 5=opus). Use `--budget N` to set a hard limit. Warn at 80%, halt at 100%.

**Critical:** The CTO architecture phase ensures strong technical decisions before implementation begins. The dual reliability audits (pre + post) ensure reliable code with test coverage.

### UX Design Phase (Step 4)

The UX design phase runs **after CTO** and **before PL** for sprints that involve user-facing UI. Skip this phase for backend-only or infrastructure sprints.

**Trigger criteria — explicit flag (primary):**
- PRD contains `ui_heavy: true` — this is set by prd-writer and is the canonical trigger
- The orchestrator script reads this flag directly; no prose parsing needed

**Trigger criteria — fallback heuristic (if flag missing):**
- PRD mentions pages, views, flows, or UI components (≥3 keyword hits)
- Sprint involves new routes in `app/`
- Sprint involves `components/` or module `components/` directories
- PM signal includes UI-related goals

**How to run:**
```
Skill(skill: "ux-design", args: "[prd-path]")
```

The UX spec at `.ai/ux/[feature-slug].md` provides the PL agent with layout structure, data flow, user flows, and interaction patterns to guide TaskGen.

### Pre-Implementation Reliability Audit (Step 5)

Runs **after CTO + UX** and **before PL** on every sprint. Analyzes the architecture spec and target module to identify likely failures and generate test specifications upfront.

**How to run:**
```
Skill(skill: "reliability-audit", args: "[outcome-id or module-name]")
```

The audit report at `.ai/audits/reliability-audit-[target]-[date].md` provides:
- **Failure risk map** — P0-P3 prioritized failure modes
- **Test specifications** — Concrete test specs with inputs, assertions, and fixture references
- **Gap matrix** — What's coded vs missing vs wrong

**Feed into TaskGen:** Include the audit report path in the PL agent's input so TaskGen can generate test tasks alongside implementation tasks. Test tasks should be in the earliest wave possible.

### Post-Sprint Reliability Audit (Step 7)

Runs **after PL completes** and **before merge**. Verifies the implementation against the pre-audit expectations and catches anything missed.

**How to run:**
```
Skill(skill: "reliability-audit", args: "[module-name]")
```

**Merge gate logic:**
- **No P0 gaps** → Proceed to security audit
- **P0 gaps found** → Do NOT create PR. Feed the audit report back to PM. PM creates a targeted fix sprint addressing only the P0 items. The fix sprint follows the same cycle (PM → PL → post-audit).
- **P1 gaps only** → Proceed to security audit, but PM includes P1 items in the next sprint's scope

### Post-Sprint Security Audit (Step 8)

Runs **after reliability audit** and **before merge**. Can run in parallel with the reliability audit since both are read-only.

**How to run:**
```
Task(
  description: "Security audit post-sprint",
  subagent_type: "security-auditor",
  prompt: "Review all code changes on this branch for security vulnerabilities. Check: authentication (withAuth on all routes), authorization (requiredPermissions), multi-tenancy isolation (organization_id filtering), input validation (Zod schemas), data exposure (no _id leaking, no PII in logs), and OWASP Top 10. Report findings with severity."
)
```

**Merge gate logic:**
- **No CRITICAL findings** → Proceed to create PR (never merge directly — always create a PR via `gh pr create`)
- **CRITICAL findings** → Do NOT create PR. Feed findings back to PM. PM creates a security fix sprint.
- **HIGH findings only** → Create PR, but PM includes HIGH items in the next sprint's scope

**Run in parallel:** The security audit and post-sprint reliability audit are both read-only and independent. Spawn them simultaneously for speed.

## Safety

- Max cycles prevents infinite loops
- All work on sprint branches — merges to main go through PRs only
- After audits pass, create a PR via `gh pr create` — let the user review and merge
- Graceful shutdown preserves state
