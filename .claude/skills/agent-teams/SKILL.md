---
name: agent-teams
description: Explain and guide creation of Claude Code agent teams — coordinated multi-session agents with shared task lists and inter-agent messaging. Trigger for agent teams, TeamCreate, teammates, team lead, parallel agents, subagents vs agent teams, or CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS.
---

# Agent Teams — Coordinated Multi-Session Claude Code Agents

Agent teams let you coordinate multiple Claude Code instances working together. One session acts as the **team lead**, coordinating work, assigning tasks, and synthesizing results. **Teammates** work independently, each in its own context window, and communicate directly with each other.

## When to Use (and When Not To)

**Use agent teams when:**
- Research/review needs parallel exploration from different angles
- New modules or features can be built independently by separate agents
- Debugging benefits from competing hypotheses tested simultaneously
- Cross-layer changes span frontend, backend, and tests

**Use subagents instead when:**
- Tasks are sequential or touch the same files
- Workers only need to report results back (no inter-agent discussion)
- Token cost matters more than collaboration depth
- The task is focused and doesn't need coordination

### Subagents vs Agent Teams

| | Subagents | Agent Teams |
|---|---|---|
| **Context** | Own window; results return to caller | Own window; fully independent |
| **Communication** | Report back to main agent only | Teammates message each other directly |
| **Coordination** | Main agent manages all work | Shared task list with self-coordination |
| **Best for** | Focused tasks where only result matters | Complex work requiring discussion |
| **Token cost** | Lower | Higher (each teammate = separate instance) |

## Prerequisites

Agent teams are experimental. Enable them in `.claude/settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

## How to Create a Team

Tell Claude in natural language what team you want. Claude creates the team, spawns teammates, and coordinates work.

**Example prompts:**

```
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

```
I'm designing a CLI tool for tracking TODOs. Create an agent team:
one teammate on UX, one on technical architecture, one playing devil's advocate.
```

```
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

## Architecture

| Component | Role |
|---|---|
| **Team lead** | Main session that creates team, spawns teammates, coordinates work |
| **Teammates** | Separate Claude Code instances working on assigned tasks |
| **Task list** | Shared work items teammates claim and complete |
| **Mailbox** | Messaging system for inter-agent communication |

**Storage locations:**
- Team config: `~/.claude/teams/{team-name}/config.json`
- Task list: `~/.claude/tasks/{team-name}/`

The team config contains a `members` array with each teammate's `name`, `agentId`, and `agentType`. Teammates read this file to discover each other.

## Controlling Your Team

### Display Modes

- **In-process** (default): All teammates in your main terminal. Use `Shift+Down` to cycle through them. Works anywhere.
- **Split panes**: Each teammate in its own pane. Requires tmux or iTerm2.

Configure in settings.json:
```json
{ "teammateMode": "in-process" }
```

Or per-session: `claude --teammate-mode in-process`

### Navigating Teammates (In-Process Mode)

- `Shift+Down` — cycle through teammates
- `Enter` — view a teammate's session
- `Escape` — interrupt their current turn
- `Ctrl+T` — toggle the task list

### Task Management

Tasks have three states: **pending**, **in progress**, **completed**. Tasks can depend on other tasks — blocked tasks unlock automatically when dependencies complete.

- **Lead assigns**: tell the lead which task to give to which teammate
- **Self-claim**: teammates pick up the next unassigned, unblocked task automatically

Task claiming uses file locking to prevent race conditions.

### Require Plan Approval

For risky tasks, require teammates to plan before implementing:

```
Spawn an architect teammate to refactor the auth module.
Require plan approval before they make any changes.
```

The teammate works in read-only plan mode until the lead approves. Rejected plans get feedback and the teammate revises.

### Shutting Down

Shut down individual teammates:
```
Ask the researcher teammate to shut down
```

Clean up the whole team (shut down all teammates first):
```
Clean up the team
```

Only the lead should run cleanup.

## Best Practices

### Give teammates enough context
Teammates load CLAUDE.md and project context but NOT the lead's conversation history. Include task-specific details in spawn prompts.

### Right-size the team
Start with **3-5 teammates**. Aim for **5-6 tasks per teammate**. Three focused teammates often outperform five scattered ones.

### Size tasks appropriately
- Too small = coordination overhead exceeds benefit
- Too large = teammates work too long without check-ins
- Right = self-contained units that produce a clear deliverable

### Avoid file conflicts
Break work so each teammate owns different files. Two teammates editing the same file leads to overwrites.

### Keep the lead coordinating, not implementing
If the lead starts doing work itself:
```
Wait for your teammates to complete their tasks before proceeding
```

## Quality Gates with Hooks

Use hooks to enforce rules:
- **`TeammateIdle`**: runs when a teammate goes idle. Exit code 2 sends feedback and keeps them working.
- **`TaskCompleted`**: runs when a task is marked complete. Exit code 2 prevents completion with feedback.

## Known Limitations

- **No session resumption**: `/resume` and `/rewind` don't restore in-process teammates
- **Task status can lag**: teammates sometimes fail to mark tasks completed — nudge manually
- **One team per session**: clean up before starting a new team
- **No nested teams**: teammates cannot spawn their own teams
- **Lead is fixed**: can't promote a teammate or transfer leadership
- **Permissions set at spawn**: all teammates inherit the lead's permission mode
- **Split panes**: not supported in VS Code terminal, Windows Terminal, or Ghostty

## Troubleshooting

| Issue | Fix |
|---|---|
| Teammates not appearing | Press `Shift+Down` to cycle; check task complexity warrants a team |
| Too many permission prompts | Pre-approve common operations in permission settings before spawning |
| Teammates stopping on errors | Message them directly with additional instructions, or spawn a replacement |
| Lead finishes too early | Tell it to wait for teammates before proceeding |
| Orphaned tmux sessions | `tmux ls` then `tmux kill-session -t <name>` |
