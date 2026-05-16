# Production Quality Gate — Bullet-Proof Testing Required Before Every PR

**CRITICAL CONTEXT:** Code merged to `main` is deployed directly to production with no manual QA gate. There is no human safety net between PR merge and real users hitting the change. Every implementation, every PR, every autonomous-orchestration sprint must be production-quality before it ships.

This rule applies to ALL contributors: human engineers, execution agents, PL agents, refactor agents, and the autonomous PM → CTO → PL orchestration pipeline.

---

## Pre-PR Checklist (Mandatory)

Before declaring any implementation complete or opening any PR, ALL items below must be verified. A PR opened without these checks completed is considered broken.

### 1. Build & Static Analysis
- [ ] `yarn typecheck` passes with **zero errors** (run `yarn install` first if lockfile changed)
- [ ] `yarn eslint . --quiet` passes with **zero errors**
- [ ] No `// @ts-ignore`, `// @ts-expect-error`, or `eslint-disable` added without an inline reason comment

### 2. Unit Tests
- [ ] Every new pure function has direct input/output unit tests
- [ ] Every new service method or handler has tests using **fakes with real state** (per `.claude/rules/code-quality.md`) — NOT `jest.fn()` mocks of internal code
- [ ] Test names state the **invariant being enforced**, not the behavior being observed (e.g. `"rejects campaigns without an organization_id"`, not `"returns an error"`)
- [ ] Existing tests in touched modules reviewed for breakage; signatures updated where needed
- [ ] No skipped tests (`it.skip`, `describe.skip`, `xit`) added — if a test must be skipped, justify in PR description

### 3. Edge Cases Enumerated
For every change, explicitly think through and handle:
- [ ] `null` / `undefined` / empty inputs (empty arrays, empty strings, missing fields)
- [ ] Concurrent updates / race conditions on shared resources
- [ ] Missing or invalid `organization_id` / `user_id`
- [ ] Missing or expired auth context
- [ ] Inngest handler **idempotency** — replays must not double-write or double-emit
- [ ] Webhook **duplicate delivery** — same `request_id` arriving twice must be safe
- [ ] External API failures (timeout, 429, 5xx, malformed payload) — caught and surfaced, not silently swallowed
- [ ] DB failures (connection drop, write conflict, validation error) — caught and surfaced

### 4. Multi-Tenant Safety
- [ ] Every DB query goes through `TenantAwareRepository` OR explicitly scopes by `organization_id`
- [ ] Cross-org data leakage impossible — verified by reading the query, not just trusting route auth
- [ ] `PropelAuthOrgId` vs `DatabaseOrgId` resolved correctly (use `getMongoOrgIdByPropelAuthId`)
- [ ] No raw Mongoose calls outside `infrastructure/`

### 5. Concern Isolation
- [ ] Independent failures (event emission, realtime publish, analytics, notifications) wrapped in their **own** try/catch — never block the main flow
- [ ] DB write success returns to caller even if downstream Inngest emit fails (logged, not thrown)
- [ ] No silent catches — every catch logs with enough context to debug

### 6. Auth & Security
- [ ] All new API routes use `withAuth` HOF with explicit `requiredPermissions`
- [ ] No manual role checks bypassing the HOF
- [ ] No secrets, API keys, or PII logged
- [ ] User input validated through Zod at the route boundary BEFORE reaching service layer
- [ ] For auth/data-access/integration changes: invoke the `security-auditor` agent and address every critical/high finding

### 7. Reliability Audit (Non-Trivial Changes)
For any feature touching 3+ files OR crossing module boundaries:
- [ ] Invoke `reliability-auditor` agent before declaring done
- [ ] Address every critical/high finding before opening the PR

### 8. Code Review (Mandatory for Every PR)
- [ ] Invoke `code-review` agent on the diff before opening the PR
- [ ] Address every critical/high finding
- [ ] Document any deferred medium/low findings in the PR description

### 9. UI Changes
- [ ] If you cannot verify the change in a real browser, **say so explicitly** in the PR description — never claim UI works because types compile
- [ ] Cross-device interactions verified (per `.claude/rules/cross-device-interactions.md`)
- [ ] Light AND dark mode verified (per `.claude/rules/design-tokens.md`)
- [ ] i18n keys added to **both** `messages/en.json` and `messages/de.json`

### 10. PR Description
Every PR must include:
- [ ] **Summary** — what changed and why (the value, not the mechanics)
- [ ] **Test Plan** — explicit checklist of what was tested, including edge cases considered
- [ ] **Audit results** — confirmation that reliability + security + code-review audits ran and passed (or list deferred findings)
- [ ] **Risk assessment** — what could break in production, and what is the rollback plan

A PR with an empty or generic test plan is incomplete. Do not merge.

---

## For Autonomous Orchestration (PM → CTO → PL Pipeline)

The PL agent and refactor-agent must complete **all** post-audit phases (reliability + security + code-review) BEFORE the PR is opened, **not after**.

- A failing audit blocks the PR — do not ship with known critical findings
- The orchestrator must surface audit failures as `---ORCHESTRATOR_SIGNAL---` blocks, not bury them in agent logs
- Retro must record any production incidents traced back to the sprint, so the next cycle's PM and CTO can adjust scope

---

## When in Doubt

Err on the side of **more testing, more audits, more explicit verification**. The cost of a slow PR is hours; the cost of a production bug is user trust. There is no reverse gear once the merge button is pressed.

If a change feels risky and you cannot fully verify it, **say so in the PR description**. A flagged risky merge that the user explicitly approves is acceptable. A silent risky merge that breaks production is not.
