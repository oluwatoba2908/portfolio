---
name: review-and-plan
description: Review Yesterday & Plan Today

---

# Review Yesterday & Plan Today

Review completed work from yesterday, mark tasks as done in TODO.md, sync ClickUp automatically, and create today's planned tasks.

## Steps

### 1. Read TODO.md

Read the `TODO.md` file from the project root.

### 2. Review Yesterday's Work

**AI Task:** Analyze the TODO.md to identify work completed yesterday:

1. **Identify Completed Work:**
   - Look for tasks that appear to be done but may not be marked `[x]`
   - Check git history (`git log --oneline -20`) for recent commits
   - Cross-reference commits with TODO items

2. **Mark Completed Tasks:**
   - Update `[ ]` to `[x]` for any tasks that were completed
   - Only change checkboxes, do not modify task descriptions
   - Be conservative - only mark tasks that are definitively complete

### 3. Sync ClickUp (Automatic)

**AI Task:** Keep ClickUp in sync with TODO.md automatically:

1. **For each numbered section in TODO.md (e.g., "## 1. Feature Name"):**
   - Extract the section name/keywords
   - Search ClickUp using `clickup_search` with those keywords
   - Look for tasks with matching `[P#]` prefix patterns in Carmen Campaigns list

2. **Determine section completion status:**
   - Count `[x]` (done) vs `[ ]` (pending) sub-tasks in the section
   - **ALL done** → section is `COMPLETED`
   - **SOME done** → section is `Active`
   - **NONE done** → section is `Not Started`

3. **Update ClickUp task status if different:**
   - Use `clickup_update_task` with task_id and new status
   - Only update if the status has actually changed
   - ClickUp statuses (case-sensitive): `Not Started`, `Active`, `COMPLETED`

4. **Set next priority to Active:**
   - Find the first section that is NOT `COMPLETED`
   - If its ClickUp task is `Not Started`, update to `Active`

### 4. Plan Today's Tasks

**AI Task:** Based on the current state of TODO.md after marking completions:

1. **Identify Next Priority:**
   - Find the first incomplete section (has `[ ]` sub-tasks)
   - This becomes the focus for today

2. **Add New Tasks (if needed):**
   - If the user provides new tasks to add, insert them in the appropriate section
   - Follow the existing TODO.md format and numbering

### 5. Update TODO.md

Apply all changes to the `TODO.md` file:

- Mark completed tasks as `[x]`
- Do NOT remove or reorder existing content
- Maintain the existing structure and formatting

### 6. Output Summary

Return a brief summary:

```
## Review & Plan Complete

**Marked as Done:**
- <Task 1 that was marked complete>
- <Task 2 that was marked complete>

**ClickUp Synced:**
- <Task name>: <old status> → <new status>

**Today's Focus:**
- <Current priority task with progress indicator>

**Up Next:**
- <Next priority items>
```

Done.
