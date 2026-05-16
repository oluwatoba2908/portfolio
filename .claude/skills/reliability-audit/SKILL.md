---
name: reliability-audit
description: Identify likely failures, gaps, and missing unit tests for an outcome or module. Produces a prioritized test plan to connect the dots before shipping.
argument-hint: "[outcome-id | module-name | 'all']"

---

# Reliability Audit: Failure Analysis & Test Gap Discovery

Analyze an outcome, module, or the full project for likely failures, implementation gaps, and missing unit tests. Produces a prioritized, actionable test plan.

**Input:** $ARGUMENTS — Target scope: an outcome ID (e.g., `O-42`), a module name (e.g., `growth-brain`), or `all` for project-wide analysis.

---

## Step 1: Determine Scope

Parse `$ARGUMENTS`:

- **Outcome ID** (e.g., `O-42`) — Read the outcome from `C:/Users/tjmcd/Projects/airstride/OUTCOMES.md`, find related modules and spec docs
- **Module name** (e.g., `growth-brain`) — Audit that specific module
- **`all`** — Project-wide: audit all active outcomes from `C:/Users/tjmcd/Projects/airstride/OUTCOMES.md`
- **Empty** — Ask the user what to audit

If scope is `all`, process each active outcome sequentially (do NOT spawn parallel agents for `all` — context is important between outcomes).

---

## Step 2: Gather Context

Before spawning the auditor, gather the relevant context:

1. Read `C:/Users/tjmcd/Projects/airstride/OUTCOMES.md` to find the outcome's spec, status, and deliverables
2. If a spec/PRD exists, read it
3. List all files in the target module(s) using Glob
4. List existing test files in the target area
5. Check for reference transformed/fixture data

Build a context summary:

```
SCOPE: [outcome/module]
SPEC: [path to architecture spec or PRD, or "none"]
MODULE PATH: [path to module directory]
FILES: [count of source files]
EXISTING TESTS: [count and paths]
FIXTURE DATA: [paths to any test fixtures or reference data]
STATUS: [Not started / Partial / Complete]
```

---

## Step 3: Run Reliability Audit

Spawn the reliability-auditor agent with full context:

```
Task(
  description: "Reliability audit for [target]",
  subagent_type: "reliability-auditor",
  model: "sonnet",
  prompt: "
    Run a full reliability audit for [target].

    CONTEXT:
    [paste context summary from Step 2]

    INSTRUCTIONS:
    1. Read all source files in the target area
    2. Read the spec/PRD to understand expected behavior
    3. Read existing tests to understand current coverage
    4. Apply all 5 failure lenses (contracts, state/concurrency, edge cases, integration, test coverage)
    5. Produce the full audit report with prioritized test specifications

    Focus especially on:
    - What will actually break in production (P0)
    - What's missing between spec and implementation
    - What tests would catch regressions if someone changes this code later
  "
)
```

---

## Step 4: Review & Enrich Results

After the agent completes:

1. **Validate P0 items** — Confirm these are genuinely production-breaking, not theoretical
2. **Check for duplicates** — Ensure recommended tests don't already exist
3. **Add fixture references** — Link test specs to existing fixture data where available
4. **Estimate effort** — Add rough size (S/M/L) to each test spec based on complexity

---

## Step 5: Save Report

Save the audit report to `.ai/audits/`:

```
.ai/audits/reliability-audit-[target]-[date].md
```

Example: `.ai/audits/reliability-audit-O-42-2026-02-17.md`

---

## Step 6: Present Summary & Next Steps

Present to the user:

```markdown
# Reliability Audit Complete: [Target]

## Risk Summary
- **P0 (Will break):** [count] items
- **P1 (Likely to break):** [count] items
- **P2 (Edge cases):** [count] items
- **P3 (Hardening):** [count] items

## Top 3 Risks
1. [Most critical failure mode]
2. [Second most critical]
3. [Third most critical]

## Test Plan
- **Tests to write:** [count]
- **Estimated effort:** [S/M/L]
- **Recommended order:** [first test to write]

## Gaps Found
- **Missing code:** [count of unimplemented items from spec]
- **Missing tests:** [count of untested critical paths]
- **Contract mismatches:** [count of schema/type drift issues]

Report saved to: `.ai/audits/reliability-audit-[target]-[date].md`
```

Then ask:

"Would you like me to:
1. **Start writing the P0 tests** — Implement the highest-priority tests now
2. **Create GitHub issues** — File issues for each gap
3. **Audit another outcome** — Run on a different target
4. **Implement missing code** — Build the gaps identified in the audit"

---

## Usage Examples

### Audit a specific outcome
```
/reliability-audit O-42
```

### Audit a module
```
/reliability-audit growth-brain
```

### Audit all active outcomes
```
/reliability-audit all
```

---

## When to Use

- **Before starting implementation** — Know what tests to write first (test-driven)
- **After completing an outcome** — Verify nothing was missed before shipping
- **Before a PR** — Final reliability check
- **When inheriting code** — Understand what's tested and what isn't
- **Sprint planning** — Size the testing effort for upcoming work

---

## Critical Rules

- **REPORT FIRST** — Never start writing tests or code without showing the audit to the user
- **CONCRETE** — Every test spec must have real input data and assertions
- **PRIORITIZED** — P0 means "will actually break", not "would be nice to test"
- **PATTERN-AWARE** — Recommend tests using existing codebase patterns (fakes, constructor DI, fixture-based)
- **SAVE THE REPORT** — Always persist to `.ai/audits/` for future reference
