---
name: execute
description: Orchestrate task execution via fresh-context execution agents with wave-based parallelism, cross-task learning, and post-execution quality gates.
argument-hint: "[path-to-task-file]"

---

# Execute: Orchestrated Task Implementation

Orchestrate task execution by spawning fresh-context execution agents per parent task, with wave-based parallelism, cross-task learning, and post-execution quality gates.

**Input:** $ARGUMENTS — Path to XML task file OR implementation plan file

---

## CRITICAL: You Are an ORCHESTRATOR, Not an EXECUTOR

**READ THIS FIRST — DO NOT SKIP**

You are a **lightweight orchestrator**. Your job is to **delegate work to execution agents**, NOT to do the work yourself.

### What You MUST NOT Do

- **DO NOT** read source code files (`.ts`, `.tsx`, `.py`, `.js`, etc.)
- **DO NOT** use the Edit tool to modify code
- **DO NOT** use the Write tool to create code files
- **DO NOT** run build/test commands directly (except final verification)
- **DO NOT** make implementation decisions at the code level — delegate ALL coding to execution agents
- **DO NOT** skip post-execution steps (code review, verification)

### What You MUST Do

- **Parse** the task file to understand the work
- **Build waves** based on file conflicts
- **Spawn execution-agent** per parent task using the Task tool
- **Collect results** from agents (commit SHAs, learnings)
- **Update STATE.md** with cross-task learnings
- **Run quality gates** after all tasks complete

### Self-Check Before Proceeding

- [ ] I will NOT edit any code myself
- [ ] I will use the Task tool to delegate EVERY task to execution-agent
- [ ] If I catch myself reading source files, I will STOP and delegate instead
- [ ] After ALL tasks complete, I will run code review

---

## Step 0: Branch Setup (MANDATORY — Do This Before Any Commits)

**NEVER commit to `main`. Always work on a feature branch.**

### 0a. Check Current Branch

```bash
git branch --show-current
```

- If already on a feature branch (not `main`/`master`/`production`) → proceed to Step 1
- If on `main`/`master`/`production` → create a branch now (see 0b)

### 0b. Create Feature Branch

Derive the branch name from the task file path or feature name:

```bash
# Examples:
git checkout -b feat/[feature-name]
git checkout -b feat/oversubscribed-company-research
git checkout -b fix/auth-flow-pre-auth
```

Branch naming conventions:
- `feat/[feature-name]` — new features
- `fix/[description]` — bug fixes
- `chore/[description]` — refactors, tooling, cleanup

### 0c. Confirm Branch

```bash
git branch --show-current
# Must NOT output: main, master, or production
```

If this outputs `main`, `master`, or `production` — **STOP and fix this before proceeding**.

---

## Step 1: Parse Task File

Read the file at `$ARGUMENTS`.

### If XML Format (from /taskgen)

Parse the XML structure:

```xml
<execution_plan feature="[name]">
  <wave number="1" description="...">
    <task id="1.1" complexity="2" status="pending" file="..." action="create">
      <description>...</description>
      <verify>yarn typecheck</verify>
    </task>
  </wave>
</execution_plan>
```

- Extract all waves and tasks
- Skip tasks where `status="completed"` (enables resume)
- Note complexity ratings for model selection

### If Plain Text Format (legacy implementation plan)

Parse the plan into tasks. Group into waves yourself:
- Tasks modifying different files → same wave (parallel)
- Tasks modifying the same file → different waves (sequential)
- Order by dependency (domain → infrastructure → application → api → inngest)

### Initialize STATE.md

Create `STATE.md` next to the task file (or in the same directory):

```markdown
# Execution State: [feature-name]
## Started: [timestamp]
## Cross-Task Learnings
(populated as tasks complete)
```

---

## Step 2: Build Waves

Group tasks into waves based on file conflicts:

1. **Conflict detection:** Two tasks conflict if they touch ANY of the same files
2. **Wave building:** Non-conflicting tasks go in the same wave
3. **Wave ordering:** Respect dependencies — domain before infrastructure before application before api

Display the wave plan:

```
Wave 1 (parallel, 3 tasks): Domain schemas and types
  - Task 1.1: schema.definition.ts [complexity: 2]
  - Task 1.2: types.ts [complexity: 1]
  - Task 1.3: enums.ts [complexity: 1]

Wave 2 (parallel, 2 tasks): Infrastructure
  - Task 2.1: repository.ts [complexity: 3]
  - Task 2.2: factory.ts [complexity: 2]

Wave 3 (sequential, 1 task): Service layer
  - Task 3.1: service.ts [complexity: 4]
```

---

## Step 3: Execute Waves

For EACH wave:

### 3a. Spawn Execution Agents

For each task in the wave, spawn an `execution-agent` via the Task tool:

```
Task(
  description: "Execute task [id]: [title]",
  subagent_type: "execution-agent",
  model: [select by complexity],
  prompt: "
---
parent_task:
  id: '[task.id]'
  title: '[task.title]'
  complexity: [task.complexity]
  verify: '[task.verify]'
subtasks:
  - id: '[subtask.id]'
    description: '[subtask.description]'
    files:
      - path: '[file.path]'
        action: '[file.action]'
state_md: |
  [contents of STATE.md]
explore_context: |
  [contents of explore-context if available]
feature_name: '[feature-name]'
design_context: |
  [ONLY for .tsx tasks when UX spec has Visual Design Context section]
  ## Token Mapping
  - CTA buttons: color="primary", variant="filled"
  - Section spacing: Stack gap="lg" (24px)
  - Card padding: p="lg"
  - Heading: fz h2 (30px), fw 700
  ## Component Mapping
  - "Feature Card" (Figma) -> modules/[name]/components/FeatureCard.tsx
  - "CTA Button" (Figma) -> components/ui/Button.tsx
  ## Constraints
  - Always use utils/theme.ts tokens — never raw hex values
  - See .claude/rules/design-tokens.md for token usage rules
---
Execute this task. Read AGENTS.md first (especially 'Reuse Before Create' section). Before writing ANY code, search for existing implementations of similar features and read 2-3 reference files. Copy patterns exactly — only adapt business logic. Create atomic commit when complete.
"
)
```

**Design context for UI tasks:**
- For tasks targeting `.tsx` files: check if a UX spec with a "Visual Design Context" section exists (passed via the task file or STATE.md)
- If yes: extract the relevant token mappings and component mappings for the files this task touches, and include them in the `design_context` field
- If no UX spec or the task is not a `.tsx` file: omit the `design_context` field entirely

**Model selection by complexity:**

| Complexity | Model Parameter |
|---|---|
| 1-2 | `model: "haiku"` |
| 3 | `model: "sonnet"` |
| 4-5 | `model: "opus"` |

**Parallel dispatch:** For tasks in the same wave, launch ALL Task tool calls in a single message (parallel execution).

### 3b. Collect Results

After all tasks in the wave complete:
- Check each agent's output for SUCCESS/FAILURE
- Extract commit SHAs
- Extract cross-task learnings

### 3c. Update STATE.md

Append learnings from completed tasks to STATE.md:

```markdown
## Task [id]: [title] — COMPLETED
- Commit: [SHA]
- Learnings:
  - [Pattern discovered]
  - [Gotcha encountered]
```

### 3d. Per-Wave Validation

Run validation after each wave:

```bash
yarn typecheck
yarn eslint . --quiet
```

If validation fails:
1. Identify which task's changes caused the failure
2. Spawn a fix agent (execution-agent) with the error context
3. Re-run validation
4. If still failing after 2 fix attempts, report the failure and continue to next wave

### 3e. Update Task Status

Mark completed tasks as `status="completed"` in the XML (if XML format). This enables resume on re-run.

---

## Step 4: Post-Execution Quality Gates

After ALL waves complete, run these steps in order:

### 4a. Code Review

Spawn the `code-review` agent to review all changes:

```
Task(
  description: "Code review all changes",
  subagent_type: "code-review",
  model: "inherit",
  prompt: "Review all uncommitted and recently committed changes for this feature. Check architecture compliance, quality, and Airstride conventions. Flag any new implementations that duplicate existing patterns — check if similar components, services, or utilities already exist in the codebase that should have been reused or extended instead."
)
```

### 4b. Reliability Audit + Security Audit (parallel)

Spawn both agents **in a single message** so they run in parallel (both are read-only):

```
Task(
  description: "Reliability audit post-execution",
  subagent_type: "reliability-auditor",
  model: "sonnet",
  prompt: "Run a post-implementation reliability audit on the code just written for [feature-name]. Focus on: 1) Do the tests written actually cover the critical paths? 2) Are there contract mismatches between modules? 3) Any race conditions or atomicity issues? 4) Missing edge case handling? Check all files modified in recent commits on this branch."
)

Task(
  description: "Security audit post-execution",
  subagent_type: "security-auditor",
  model: "inherit",
  prompt: "Review all code changes on this branch for security vulnerabilities. Check: authentication (withAuth on all routes), authorization (requiredPermissions), multi-tenancy isolation (organization_id filtering), input validation (Zod schemas), data exposure (no _id leaking, no PII in logs), and OWASP Top 10."
)
```

### 4c. CTO Triage

Review code-review, reliability-audit, AND security-audit findings:
- **CRITICAL/HIGH code-review findings:** Spawn fix agents (execution-agent) to address
- **CRITICAL security findings:** Spawn fix agents to remediate — these block merge
- **P0 reliability gaps:** Spawn fix agents to write missing tests or fix identified failure modes
- **HIGH security findings:** Note for follow-up or include if scope allows
- **P1 reliability gaps:** Note for follow-up or include if scope allows
- **MEDIUM/LOW findings:** Note for follow-up
- **P2/P3 gaps:** Skip

### 4d. Final Validation

```bash
yarn typecheck
yarn eslint . --quiet
```

Both MUST pass before reporting completion.

---

## Step 5: Output Report

```markdown
## Execution Complete: [feature-name]

### Waves Executed
- Wave 1: [n tasks] — [PASS/FAIL]
- Wave 2: [n tasks] — [PASS/FAIL]

### Tasks Completed
| ID | Title | Complexity | Model | Status | Commit |
|---|---|---|---|---|---|
| 1.1 | [title] | 2 | haiku | PASS | [SHA] |

### Code Review
- Verdict: [PASS / PASS WITH NOTES / NEEDS REVISION]
- CRITICAL findings: [count]
- HIGH findings: [count]

### Reliability Audit
- P0 gaps: [count] (must be 0 to merge)
- P1 gaps: [count]
- Tests written: [count of test files created]
- Tests passing: [count] / [total]

### Security Audit
- Risk level: [LOW / MEDIUM / HIGH / CRITICAL]
- CRITICAL findings: [count] (must be 0 to merge)
- HIGH findings: [count]

### Validation
- TypeScript: PASS/FAIL
- ESLint: PASS/FAIL

### Cross-Task Learnings
[Summary of key learnings from STATE.md]

### Ready for Commit
[Yes — all tasks complete and validated / No — issues remain]
```

---

## Step 6: Push Branch and Create PR

Only do this **after** the Output Report shows all waves passed and validation is green.

### 6a. Final Check

```bash
git branch --show-current   # Confirm NOT on main
git log --oneline -10       # Review commits made during execution
```

### 6b. Push Branch

```bash
git push -u origin [branch-name]
```

### 6c. Create Pull Request

```bash
gh pr create \
  --title "feat([feature-name]): [short description]" \
  --body "$(cat <<'EOF'
## Summary
- [What was implemented — bullet points]

## Tasks Completed
[n/total tasks]

## Validation
- TypeScript: PASS
- ESLint: PASS

## Test plan
- [ ] [Key thing to test manually]
- [ ] [Another thing to verify]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)" \
  --base main \
  --draft
```

Output the PR URL so the user can review it.

**NEVER push to `main` directly. The PR is how the work lands on main.**

---

## Error Recovery

If execution is interrupted:
1. Re-run `/execute` with the same task file
2. Tasks with `status="completed"` are automatically skipped
3. STATE.md preserves cross-task learnings
4. Execution resumes from the first incomplete wave
