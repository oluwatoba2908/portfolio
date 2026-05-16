---
name: rca
description: Root Cause Analysis (RCA) from ClickUp Ticket

---

# Root Cause Analysis (RCA) from ClickUp Ticket

Generate a Root Cause Analysis document for a bug/issue reported in a ClickUp ticket.

## Input

- `{{ticket_id}}` - The ClickUp task ID (e.g., `86c7dk6uy`) or custom ID (e.g., `DEV-1234`). Leave blank to be prompted.

## Prerequisites

- Working in a local Git repository
- ClickUp MCP integration available
- Bug/issue ticket exists in ClickUp

## Steps

### 1. Validate Ticket ID

**AI Task:** Check if a ticket ID was provided:

1. **If `{{ticket_id}}` is empty or blank:**
   - Ask the user: "Please provide a ClickUp ticket ID for the bug/issue (e.g., `86c7dk6uy` or custom ID like `DEV-1234`)"
   - Wait for their response before proceeding
   - Do NOT continue until a valid ticket ID is provided

2. **If ticket ID is provided:**
   - Proceed to Step 2

### 2. Fetch ClickUp Ticket Details

**AI Task:** Retrieve the full ticket details:

1. Use `clickup_get_task` with the provided ticket ID
2. Include subtasks if available (`subtasks: true`)
3. Extract all relevant fields:
   - Name/Title
   - Description (markdown)
   - Status
   - Priority
   - Tags
   - Custom fields
   - Comments (for reproduction steps, additional context)

4. **Verify this is a bug/issue:**
   - Check if it's tagged as "bug" or similar
   - If unclear, ask user to confirm this is a bug/issue ticket

### 3. Analyze the Issue

**AI Task:** Understand the problem:

1. **Extract from ticket:**
   - What is the expected behavior?
   - What is the actual (broken) behavior?
   - Steps to reproduce (if provided)
   - Error messages or logs (if provided)
   - Affected users/roles
   - Severity/Impact

2. **Identify affected area:**
   - Which module/component is affected?
   - What user flows are impacted?

### 4. Search Codebase for Root Cause

**AI Task:** Investigate the codebase:

1. **Search for related code:**
   - Use `codebase_search` to find the affected functionality
   - Search for error messages mentioned in the ticket
   - Find the specific component/service/handler

2. **Trace the code path:**
   - Identify the entry point (API route, component, event handler)
   - Follow the execution flow
   - Find where the issue occurs

3. **Identify the root cause:**
   - What is the actual bug/defect?
   - Why does it behave incorrectly?
   - What conditions trigger the bug?

4. **Check for related issues:**
   - Are there similar patterns elsewhere that might have the same bug?
   - Is this a regression from a recent change?

### 5. Determine Fix Strategy

**AI Task:** Plan the fix:

1. **Identify the fix approach:**
   - What needs to change to fix the issue?
   - Are there multiple ways to fix it?
   - What is the safest/cleanest approach?

2. **Identify files to modify:**
   - List all files that need changes
   - Note the specific functions/components to update

3. **Consider edge cases:**
   - What edge cases does the fix need to handle?
   - Are there related scenarios that might be affected?

4. **Assess risk:**
   - What could go wrong with the fix?
   - What are the testing requirements?

### 6. Generate RCA Document

**AI Task:** Create a comprehensive RCA document:

```markdown
# RCA: {{ticket_id}} - [Issue Title]

**ClickUp Ticket:** {{ticket_id}}
**Date:** [today's date]
**Severity:** [Critical/High/Medium/Low]
**Status:** Analysis Complete - Ready for Implementation

---

## Summary

[2-3 sentence summary of the issue and its impact]

## Issue Details

### Expected Behavior

[What should happen]

### Actual Behavior

[What actually happens - the bug]

### Reproduction Steps

1. [Step 1]
2. [Step 2]
3. [Step 3]

### Error Messages/Logs
```

[Any relevant error messages or logs]

````

### Affected Users

- [User type/role affected]
- [Percentage or scope of impact]

## Root Cause Analysis

### Investigation Summary

[Description of how the root cause was identified]

### Root Cause

**Location:** `path/to/file.ts` (lines X-Y)

**The Problem:**
[Clear explanation of what is wrong in the code]

**Why It Happens:**
[Explanation of the conditions that trigger the bug]

### Code Analysis

```typescript
// Current code (problematic)
[Show the problematic code snippet]
````

**Issue:** [Explain what's wrong with this code]

## Proposed Fix

### Fix Strategy

[High-level description of how to fix the issue]

### Files to Modify

| File               | Change Required         |
| ------------------ | ----------------------- |
| `path/to/file.ts`  | [Description of change] |
| `path/to/other.ts` | [Description of change] |

### Proposed Code Changes

**File:** `path/to/file.ts`

```typescript
// Before (current code)
[problematic code]

// After (fixed code)
[corrected code]
```

### Edge Cases to Handle

- [ ] [Edge case 1]
- [ ] [Edge case 2]

## Testing Requirements

### Unit Tests

- [ ] Test that [specific scenario] works correctly
- [ ] Test edge case: [description]
- [ ] Test error handling: [description]

### Integration Tests

- [ ] Verify [end-to-end flow] works
- [ ] Test [related functionality] not regressed

### Manual Verification

1. [Step to manually verify the fix]
2. [Step to verify edge cases]

## Validation Commands

```bash
# Type checking
yarn typecheck

# Linting
yarn lint

# Run tests
yarn test --passWithNoTests
```

## Risk Assessment

| Risk               | Likelihood   | Impact       | Mitigation        |
| ------------------ | ------------ | ------------ | ----------------- |
| [Potential risk 1] | Low/Med/High | Low/Med/High | [How to mitigate] |

## Timeline

- **RCA Created:** [today's date]
- **Ready for Implementation:** Yes

## References

- ClickUp Ticket: {{ticket_id}}
- Related Tickets: [if any]
- Related Documentation: [if any]

---

**Next Step:** Run `/implement-fix {{ticket_id}}` to implement this fix.

````

### 7. Create RCA File

**AI Task:** Save the RCA document:

1. Ensure `docs/rca/` directory exists (create if needed)
2. Create file at `docs/rca/{{ticket_id}}.md`

### 8. Update ClickUp Ticket

**AI Task:** Add RCA as a comment to the ticket:

1. Use `clickup_create_task_comment` to add:
   - Summary of root cause found
   - Link/reference to the RCA document
   - Recommended next steps

**Comment format:**

```markdown
## Root Cause Analysis Complete 🔍

**Root Cause:** [One-line summary]

**Location:** `path/to/affected/file.ts`

**Proposed Fix:** [Brief description of fix strategy]

**RCA Document:** `docs/rca/{{ticket_id}}.md`

**Files to Modify:**
- `path/to/file.ts`
- `path/to/other.ts`

**Next Step:** Run `/implement-fix {{ticket_id}}` to implement the fix.
````

## Output Summary

Return a final summary:

```
## RCA Complete ✅

**ClickUp Ticket:** {{ticket_id}} - [Title]
**RCA Document:** `docs/rca/{{ticket_id}}.md`

### Root Cause Summary

**The Problem:** [One-line description]
**Location:** `path/to/file.ts`
**Severity:** [Critical/High/Medium/Low]

### Proposed Fix

[Brief description of fix strategy]

**Files to Modify:**
- `path/to/file.ts` - [change description]
- `path/to/other.ts` - [change description]

### Testing Required

- [X] unit tests
- [X] integration tests (if applicable)

### ClickUp Updated

- ✅ RCA comment added to ticket

### Next Steps

1. Review the RCA document at `docs/rca/{{ticket_id}}.md`
2. Run `/implement-fix {{ticket_id}}` to implement the fix
```

Done.
