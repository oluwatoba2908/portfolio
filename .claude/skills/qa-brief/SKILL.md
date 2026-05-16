---
name: qa-brief
description: Generate a focused, time-boxed QA testing brief from recent code changes. Use when the user says "qa brief", "what should QA test", "testing brief", "what to test today", "QA plan", or wants to know what a tester should focus on. Also use proactively after shipping a feature or fix if the user asks what to verify. Always invoke this skill — never write a testing brief manually from scratch.
argument-hint: "[testing-time] [git-window] [focus area] — e.g. '45m', '1h last 24h', 'last week exclusion list', 'campaign send flow'"
---

# QA Brief: Time-Boxed Testing Guide

Generate a decisive, time-boxed testing brief from recent git changes. The goal is to tell a QA tester **exactly** what to test in the available time — not a laundry list of everything that could be tested.

## Input

- `$ARGUMENTS` — Optional. Can include any combination of:
  - A **testing time budget** — how long the tester has. Patterns: `30m`, `45m`, `1h`, `2h`. Default: **30 minutes**.
  - A **git history window** — how far back to look for changes. Patterns: `last 24h`, `last 24 hours`, `last week`, `last 2 days`, `since Monday`. Default: look at last 5 commits + any uncommitted changes.
  - A **focus area** — a feature or page name like `exclusion list`, `campaign send flow`.

Parse `$ARGUMENTS` before proceeding:
1. Extract the **testing time budget** (number + `m`/`min`/`h`/`hr` standing alone, e.g. `30m`, `1h`). Store as `$TIME_BUDGET`. Default: `30 minutes`.
2. Extract the **git history window** (phrases like `last 24h`, `last 24 hours`, `last week`, `last N days`, `since [day]`). Store as `$GIT_WINDOW`. Default: `HEAD~5..HEAD` (last 5 commits).
3. Everything remaining is the **focus area**. Default: derive from git changes.

Examples:
- `"45m"` → TIME_BUDGET=45min, GIT_WINDOW=default, focus=from git
- `"last 24 hours"` → TIME_BUDGET=30min, GIT_WINDOW=24h, focus=from git
- `"1h last week exclusion list"` → TIME_BUDGET=1h, GIT_WINDOW=1 week, focus=exclusion list
- `"campaign send"` → TIME_BUDGET=30min, GIT_WINDOW=default, focus=campaign send

## Steps

### 1. Understand What Changed

Use `$GIT_WINDOW` to scope the history lookup:
- If `$GIT_WINDOW` is a time phrase (e.g. "last 24 hours", "last week"), use `--since="..."` with git log
- If `$GIT_WINDOW` is default, use `HEAD~5..HEAD`

```bash
# If $GIT_WINDOW is a time phrase:
git log --oneline --since="$GIT_WINDOW"
git diff --stat $(git log --since="$GIT_WINDOW" --format="%H" | tail -1)..HEAD
git diff $(git log --since="$GIT_WINDOW" --format="%H" | tail -1)..HEAD -- "*.ts" "*.tsx" | head -300

# If $GIT_WINDOW is default:
git diff --stat HEAD~5..HEAD
git log --oneline -10
git diff HEAD~3..HEAD -- "*.ts" "*.tsx" | head -300
```

Always check for uncommitted work regardless of window:
```bash
git diff --stat
git status
```

Look for:
- Which modules/features were touched
- Whether it's a bug fix, new feature, or refactor
- API routes changed (affects integration test surface)
- UI components changed (affects what a tester can see)

### 2. Deep-Read the Key Changed Files

Use the Explore agent to read the most impactful changed files. Focus on:
- What the feature actually does (not just what lines changed)
- What data flows through the changed paths
- What the UI shows the user
- What validations or edge cases the code handles
- What other areas the change touches (side effects)

Specifically look for:
- Any permission checks (`withAuth`, `requiredPermissions`) — these gate access and are easy to miss
- Any new API endpoints — needs happy path + auth test
- State changes (what gets written to DB, what gets shown in UI after the action)
- Error paths that could silently fail

### 3. Identify Risk Areas and Rank Priority

Before writing the brief, rank what to test using this two-step approach:

**Step A — Score each change by blast radius:**

| Signal | Risk |
|--------|------|
| Changed shared utility or service | Cross-module regression risk |
| Changed API route handler | Auth, validation, error response risk |
| Changed UI component used in multiple places | Visual regression in unexpected pages |
| DB schema / field change | Data integrity, migration, existing record display |
| New translation key added | Missing key shows raw key string in UI |
| Changed Inngest handler | Async job may silently fail |
| Changed export/CSV logic | Encoding, empty state, large dataset edge cases |

**Step B — Apply business impact tiebreaker. Always rank in this order:**

1. **Regressions on core revenue/conversion flows** — anything that could break a flow users pay for or that directly drives conversion (e.g. campaign send, partner add, billing, auth). A bug here is a P0 incident.
2. **New features on high-traffic pages** — pages users visit daily (campaign list, partner list, dashboard). Broken new features here are immediately visible.
3. **New features on lower-traffic pages** — settings pages, import/export, edge-case flows. Important but less likely to block users immediately.
4. **Cosmetic or non-critical changes** — label changes, copy tweaks, minor UI adjustments on rarely-visited pages.

The test scenarios must be ordered to match this ranking — P1 scenarios first, P2 only if time allows. A tester who runs out of time should have already covered the highest-risk items.

### 4. Write the Brief

**AI Task:** Produce a focused QA brief using this exact format:

---

## QA Brief — [date]

### Today's Focus
[1-2 sentences: what changed and why it matters to test now. Be direct — "We shipped X. The risk is Y."]

### Test Areas

| Area | Time | Priority |
|------|------|----------|
| [Specific feature/flow] | [X min] | P1 — Test First |
| [Related area that could regress] | [X min] | P2 — If Time Allows |
| [Edge case or error path] | [X min] | P2 — If Time Allows |

*Total: ~`$TIME_BUDGET`*

### Test Scenarios

**[Area Name]**

1. [Exact action: Go to X page > click Y > enter Z > verify outcome]
2. [Next scenario — same level of specificity]
3. [Error path: Try X with invalid/missing data > verify error message appears]

**[Second Area]**

4. [Continue numbering across areas]
5. ...

### Watch Out For

- **[Specific risk]:** [What to check and why it might be broken]
- **[Regression risk]:** [What nearby feature could have been accidentally affected]
- **[Edge case]:** [Specific data condition or user action that's easy to miss]

### Out of Scope Today

- [Area that was NOT changed — explicitly excluded to save tester's time]
- [Area that was changed but is covered by automated tests]
- [Lower-risk area to defer to next session]

---

**Rules for writing the brief:**

- **Be specific about UI location.** "Go to Settings > Exclusion List" not "navigate to the feature".
- **Name the exact fields, buttons, and labels** the tester should interact with. Vague steps waste time.
- **Every test scenario must have a clear pass/fail outcome.** "Verify the entry appears in the table" not "check it worked".
- **Total time must be ≤ `$TIME_BUDGET`.** Cut P2 items before going over. A tester who finishes early is better than one who rushes. With more time (e.g. 1h), expand into more P2 scenarios and deeper edge cases — don't just repeat the same 30-min brief with extra whitespace.
- **Watch Out For must be concrete.** "Check that existing exclusion list entries are still visible after import" not "check for regressions".
- **Out of Scope must be explicit.** Naming what NOT to test saves the tester from wasted effort as much as naming what to test.
- **If `$ARGUMENTS` specifies a focus area**, prioritize scenarios in that area even if other things changed. Acknowledge the other changes but scope them to P2 or Out of Scope.

### 5. Present the Brief

Output the brief directly. Do not add preamble like "Here is your QA brief:". Just output the brief starting with the `## QA Brief` heading.

After the brief, add one line:
> *Generated from: [list the key files/commits that informed this brief]*

This lets the tester or engineer verify the brief reflects the right changes.

### 6. Production Readiness Verdict

After presenting the brief, **always** append a production readiness assessment. Review every bug, risk, and issue identified in the brief and classify each by severity:

| Severity | Definition | Example |
|----------|-----------|---------|
| **Critical** | Data loss, security hole, auth bypass, broken core revenue flow (billing, campaign send, partner onboarding) | Missing auth check on API route, DB writes silently failing |
| **High** | Core feature broken or unusable for a segment of users, silent data corruption, cross-tenant data leak | Campaign list crashes for orgs with 100+ campaigns, wrong org's data shown |
| **Medium** | Feature partially broken but has workaround, non-blocking UX issue, edge case failure | CSV export fails on empty dataset but manual export works, toast doesn't dismiss |
| **Low** | Cosmetic issue, copy typo, minor UI inconsistency on low-traffic page | Button label misaligned, wrong shade of gray on settings page |

**Output this section at the very end of the brief:**

---

### Production Readiness

**Verdict: [SAFE TO PUSH / DO NOT PUSH]**

[If SAFE TO PUSH:]
> No critical or high severity bugs were identified. The changes are safe to deploy to production. [List any low/medium issues as known caveats.]

[If DO NOT PUSH:]
> **🚨 Blocking issues found — do not push to production until resolved:**
>
> | # | Issue | Severity | Why it blocks |
> |---|-------|----------|---------------|
> | 1 | [Specific bug description] | Critical/High | [What breaks for users] |
> | 2 | ... | ... | ... |
>
> **Fix these before deploying.** Low/medium issues listed in the brief can ship as-is.

---

**Rules for the verdict:**

- **Critical or High severity bugs → DO NOT PUSH.** No exceptions. These must be fixed before the changes reach production users.
- **Only Medium and Low severity bugs (or no bugs) → SAFE TO PUSH.** Medium/low issues can be tracked and fixed in a follow-up.
- **Be decisive.** The verdict is binary — SAFE or NOT SAFE. Don't hedge with "probably safe" or "use your judgment".
- **Reference specific test scenarios.** If a blocking bug was found in scenario #3, say so — the engineer needs to know exactly what to fix.
- **If no bugs were found at all**, still output the verdict section with: `**Verdict: SAFE TO PUSH** — No bugs identified. All test scenarios passed.`
