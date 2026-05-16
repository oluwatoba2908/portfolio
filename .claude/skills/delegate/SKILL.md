---
name: delegate
description: Delegate the current task to a fresh-context agent to avoid context window exhaustion. Use when chat gets long or you hit "Prompt is too long".
argument-hint: "[task description or 'continue']"
---

# Delegate: Fresh-Context Task Handoff

Delegate work to a fresh-context execution agent, preventing "Prompt is too long" errors during long chat sessions.

**Input:** $ARGUMENTS — Task description, or "continue" to hand off remaining work from current conversation

---

## Why This Exists

In orchestrated workflows (`/execute`, `/orchestrate`), context never exhausts because:
- Each task spawns a **fresh agent** via the Task tool
- Agents receive only a **compact handoff** (~1-5KB), not the full conversation
- Cross-task communication uses **learnings only**, not full execution logs

In direct chat, everything accumulates in one context window until it overflows. This command bridges the gap by letting you delegate work to fresh agents mid-conversation.

---

## Process

### Step 1: Understand the Task

**If $ARGUMENTS contains a specific task description:**
- Use it directly as the task for the fresh agent

**If $ARGUMENTS is "continue" or empty:**
- Analyze the conversation to understand:
  - What was the user's original goal?
  - What has been completed so far?
  - What remains to be done?
  - What key decisions or discoveries were made?

### Step 2: Build the Handoff Packet

Create a compact context packet (target: under 3KB) containing:

```yaml
## Task
[Clear description of what needs to be done]

## Context
[2-3 sentences about the project context relevant to this task]

## Completed So Far
[Bullet list of what's already done, with file paths and commit SHAs if available]

## Key Decisions
[Any architectural or implementation decisions already made]

## Files to Work With
[List of specific files the agent should read/modify]

## Verification
[How to verify the task is complete - e.g., yarn typecheck, specific behavior to test]
```

### Step 3: Assess Complexity & Select Agent Type

| Complexity | Agent Type | Model | When |
|-----------|------------|-------|------|
| Research/exploration | `Explore` | (default) | "Find X", "Understand Y", read-only tasks |
| Simple code change (1-2 files) | `execution-agent` | haiku | Typo fix, small feature, config change |
| Moderate code change (3-5 files) | `execution-agent` | sonnet | Feature implementation, refactor |
| Complex code change (6+ files) | `execution-agent` | opus | Large feature, cross-module changes |
| Code review / quality check | `code-review` | sonnet | Review changes for issues |
| Build/type verification | `build-validator` | haiku | Verify build passes |

### Step 4: Spawn the Agent

Use the Task tool to spawn a fresh-context agent with the handoff packet:

```
Task(
  description: "[3-5 word summary]",
  subagent_type: "[selected agent type]",
  model: "[selected model]",
  prompt: "[handoff packet from Step 2]"
)
```

**For multi-step tasks:** Break into independent subtasks and spawn agents in parallel where possible. This is how `/execute` achieves both context isolation AND speed.

### Step 5: Report Results

After the agent completes:

1. **Summarize what was done** — Files changed, key decisions, commit SHA if applicable
2. **Note any issues** — Errors, warnings, things that need follow-up
3. **Suggest next steps** — What the user should do next (verify, test, commit)

If there's more work remaining, offer to delegate the next piece:

```
Task complete. [Summary of what was done]

Remaining work:
- [Task 2 description]
- [Task 3 description]

Want me to delegate the next task? Just say "continue" or "/delegate continue"
```

---

## Usage Patterns

### Pattern 1: Hand Off Mid-Conversation

When you've been chatting and context is getting large:

```
You: /delegate continue
```

The agent summarizes the conversation, identifies remaining work, and spawns a fresh agent.

### Pattern 2: Explicit Task Delegation

When you know exactly what you want done:

```
You: /delegate Add a loading skeleton to the dashboard page following the pattern in modules/research/components/
```

### Pattern 3: Parallel Delegation

When you have multiple independent tasks:

```
You: /delegate "Fix the type error in service.ts AND add the missing index to schema.ts"
```

The agent detects independent tasks and spawns multiple agents in parallel.

### Pattern 4: Research Delegation

When you need exploration without burning context:

```
You: /delegate "Find all places where we handle session expiry and document the patterns"
```

Uses Explore agent (read-only, returns structured findings).

---

## Multi-Task Splitting

If the task contains multiple independent pieces of work, **split and parallelize**:

1. Identify independent subtasks (no file conflicts)
2. Spawn one agent per subtask using parallel Task tool calls
3. Collect results from all agents
4. Report combined results

**File conflict detection:** If two subtasks modify the same file, they MUST be sequential (same wave). Otherwise, parallelize.

---

## Anti-Patterns

**DON'T:**
- Include the full conversation history in the handoff (defeats the purpose)
- Delegate trivial one-line changes (just do them inline)
- Spawn agents without clear task descriptions (vague prompts waste context)
- Forget to include verification steps (agent should validate its own work)
- Skip reporting results back to the user

**DO:**
- Keep handoff packets compact (~1-3KB)
- Include specific file paths the agent needs
- Include verification commands (yarn typecheck, etc.)
- Split independent tasks for parallel execution
- Report results clearly with next steps

---

## Examples

### Example 1: Continue After Long Conversation

**Conversation so far:** Discussed architecture for new caching layer, decided on Redis with TTL-based invalidation, identified 4 files to modify.

```
User: /delegate continue
```

**Agent creates handoff:**
```yaml
## Task
Implement Redis caching layer for Company Seed module

## Context
Airstride uses Upstash Redis for caching foundation modules. See docs/engineering/conventions-caching.md.

## Completed So Far
- Architectural decision: TTL-based invalidation with event-driven cache clearing
- Cache key pattern: org:{org_id}:company-seed

## Key Decisions
- TTL: 7 days for company seed
- Use readFoundationData() utility for read path
- Emit company/seed_updated event on writes

## Files to Work With
- modules/company-seed/application/service.ts (add cache read/write)
- modules/company-seed/inngest/handlers.ts (add invalidation handler)
- infrastructure/redis.ts (may need to add utility)
- shared/events/schemas/company-seed.events.ts (add event schema)

## Verification
- yarn typecheck passes
- yarn eslint . --quiet passes
```

**Spawns:** execution-agent (sonnet) with this packet.

### Example 2: Explicit Code Task

```
User: /delegate "The proof-trust agent is picking up the wrong company - it should use the organization_id from the session, not hardcoded. Fix it in modules/oversubscribed/application/agents/proof-trust.agent.ts"
```

**Spawns:** execution-agent (haiku) with focused task description.

---

## Integration with Other Commands

- After `/delegate`, use `/commit` to commit the changes
- If delegation reveals high complexity, suggest `/feature` or `/prd` instead
- For verification after delegation, suggest `/validate`

---

**Remember:** This command exists because fresh-context agents are the secret weapon against context exhaustion. Every orchestrated workflow uses this pattern. Now your direct chat sessions can too.
