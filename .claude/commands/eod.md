# End of Day Summary

Generate a *tight* End of Day summary: only the 3 most important things from today, **max 500 characters total**. Respect the reader's time ruthlessly — this is a glance, not a report.

## Steps

### 1. Get today's commits

```
git log --since="midnight" --author="$(git config user.name)" --pretty=format:"%h|%s|%D" --reverse
```

Also capture branch context (needed for outcome mapping of unmerged work):

```
git branch --show-current
git log --since="midnight" --author="$(git config user.name)" --pretty=format:"%h %s" --all
```

### 2. Map commits to outcomes

Each commit belongs to an outcome (e.g. `O139`, `O139b`). Resolve the outcome in this order:

1. **Branch name** — `sprint/O###-S#-...` or `feat/...-O###-...` embeds the outcome ID
2. **PR merge commits** — `Merge pull request #X from airstride/sprint/O###-S#-...`
3. **Commit scope** — e.g. `feat(infra):` is ambiguous; fall back to branch/PR context

Look up the outcome title from `../airstride/OUTCOMES.md` (grep `^## O###`). Strip the `O###` prefix — the reader only cares about the human title. If the outcome isn't in OUTCOMES.md, derive a short human title from the branch/PR context.

### 3. Pick the 3 things that matter

From everything today, select **at most 3 points** — the things a teammate would regret not knowing tomorrow. Priority order:

1. **Shipped / merged** user-facing or substantive work
2. **Risk / gotcha / heads-up** — unmerged work, production behavior change, something that would surprise someone on-call
3. **Substantial unmerged work** in progress

Everything else — docs, retros, test hardening, renames, chores, polish — is **dropped entirely**. Do not mention it. If there are genuinely fewer than 3 things worth saying, say fewer. Never pad to hit 3.

### 4. Output format (Slack-friendly, ≤500 chars)

The summary is copy-pasted straight into Slack. Use Slack `mrkdwn`, **not** GitHub markdown:

- `*bold*` — single asterisks
- `• ` bullets (not `- `)
- No `#`/`##` headings
- Plain text links only

Each bullet: **hard cap 12 words**, lead with an active verb (Shipped, Merged, Fixed, Added). Prefix outcome context only if it disambiguates. State the change, not the motivation.

The **entire content inside the fence must be ≤500 characters** (count it before emitting). Wrap in a ` ```text ... ``` ` code fence so the user can triple-click to copy.

Template:

```text
*End of Day*
• <most important thing>
• <second thing>
• <third thing — flag if it's a heads-up>
```

### 5. Self-review before output

Before emitting, verify all of these — re-edit until every answer is yes:

1. Is the content inside the fence **≤500 characters**? (Count it.)
2. Are there **at most 3 bullets**?
3. Would a teammate regret missing each bullet? (If any bullet is "ok and?", cut it.)
4. Is every bullet ≤12 words with no filler ("now", "in order to", "so users can")?
5. No AI agents / orchestrators / internal tooling mentioned?

Only emit once all five are yes.

Done.
