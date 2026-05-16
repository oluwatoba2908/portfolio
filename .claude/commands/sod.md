# Start of Day Briefing

Quick forward-looking briefing: what needs attention, what's the plan for today, and where to start.

## Steps

### 1. Read TODO.md

Read the `TODO.md` file from the project root to understand current priorities.

### 2. Check Open PRs

Run: `gh pr list --author="@me" --state=open --json number,title,reviewDecision,statusCheckRollup --limit 10`

Also check PRs requesting your review:
Run: `gh pr list --search "review-requested:@me" --state=open --json number,title,author --limit 10`

### 3. Check Current Branch State

Run: `git status --short`
Run: `git stash list`

### 4. Generate Morning Briefing

**AI Task:** Synthesize the above into a concise, forward-looking briefing:

1. **PRs Needing Attention:** Your open PRs awaiting review or with requested changes, plus PRs where your review is requested
2. **Uncommitted Work:** Flag any uncommitted changes or stashes that might be forgotten WIP
3. **Today's Plan:** List the incomplete sections from TODO.md in priority order, with progress indicators
4. **Start Here:** The specific first task to work on right now

### 5. Output Format

Return the briefing in this exact format:

```
## Start of Day

**PRs:**
- #<number> <title> — <status: awaiting review / changes requested / checks failing>
- Review requested: #<number> <title> by <author>

**Uncommitted Work:**
- <branch: description of changes> (or "Clean working tree")

**Today's Plan:**
1. <Priority task 1> (X/Y subtasks done)
2. <Priority task 2> (X/Y subtasks done)
3. <Priority task 3> (not started)

**Start Here:**
→ <Specific first task to work on>
```

If any section has no items, omit it entirely to keep the briefing short.

Done.
