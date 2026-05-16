---
name: implement-fix
description: Implement Fix from RCA Document

---

# Implement Fix from RCA Document

Implement a fix for a ClickUp ticket based on an existing Root Cause Analysis (RCA) document.

## Input

- `{{ticket_id}}` - The ClickUp task ID (e.g., `86c7dk6uy`) or custom ID (e.g., `DEV-1234`). Leave blank to be prompted.

## Prerequisites

**This command implements fixes for ClickUp tickets based on RCA documents:**

- Working in a local Git repository
- RCA document exists at `docs/rca/{{ticket_id}}.md`
- ClickUp MCP integration available for status updates

## Steps

### 1. Validate Ticket ID

**AI Task:** Check if a ticket ID was provided:

1. **If `{{ticket_id}}` is empty or blank:**
   - Ask the user: "Please provide a ClickUp ticket ID (e.g., `86c7dk6uy` or custom ID like `DEV-1234`)"
   - Wait for their response before proceeding
   - Do NOT continue until a valid ticket ID is provided

2. **If ticket ID is provided:**
   - Proceed to Step 2

### 2. Verify RCA Document Exists

**AI Task:** Check for the RCA document:

1. Look for the RCA document at `docs/rca/{{ticket_id}}.md`
2. **If RCA document does NOT exist:**
   - Inform the user: "No RCA document found at `docs/rca/{{ticket_id}}.md`. Please create an RCA first using `/rca {{ticket_id}}`"
   - STOP - do not proceed without an RCA document

3. **If RCA document exists:**
   - Read the ENTIRE RCA document thoroughly
   - Proceed to Step 3

### 3. Fetch ClickUp Ticket Context

**AI Task:** Get additional context from ClickUp:

1. Use `clickup_get_task` with the provided ticket ID
2. Include subtasks if available (`subtasks: true`)
3. Extract relevant context:
   - Name/Title
   - Description
   - Status
   - Priority
   - Assignees
   - Comments (for additional context)

4. **Update ticket status to Active:**
   - Use `clickup_update_task` to set status to `Active`

### 4. Analyze RCA Document

**AI Task:** Extract implementation details from the RCA:

1. **Understand the Root Cause:**
   - What exactly is broken and why
   - What component/module is affected

2. **Review the Proposed Fix:**
   - What changes are recommended
   - Which files need to be modified
   - What is the fix strategy

3. **Note Testing Requirements:**
   - What tests should be added/modified
   - What validation is needed

4. **Check Affected Files:**
   - List all files mentioned in the RCA
   - Verify they still exist and haven't been significantly modified

### 5. Verify Current State

**AI Task:** Before making changes:

1. **Confirm the issue still exists:**
   - Review the code mentioned in the RCA
   - Verify the problem is still present

2. **Check current state of affected files:**
   - Read each file that will be modified
   - Look for any recent changes that might affect the fix

3. **Identify any conflicts:**
   - Has the code changed since the RCA was written?
   - Are there new patterns or dependencies to consider?

### 6. Implement the Fix

**AI Task:** Following the "Proposed Fix" section of the RCA:

**For each file to modify:**

#### a. Read the existing file

- Understand current implementation
- Locate the specific code mentioned in RCA

#### b. Make the fix

- Implement the change as described in RCA
- Follow project conventions:
  - Use Zod v4 (NEVER v3)
  - Use `z.enum()` with values array (NEVER `nativeEnum`)
  - Follow Module Architecture Standard
  - Extend `BaseService` for business logic
  - Use HOFs (`withAuth`, `withDB`, `withValidation`) in API routes
  - Use `requiredPermissions` (NEVER `anyRoles`)
- Maintain code style and conventions
- Add comments if the fix is non-obvious

#### c. Handle related changes

- Update any related code affected by the fix
- Ensure consistency across the codebase
- Update imports if needed
- Follow client/server separation rules

### 7. Add/Update Tests

**AI Task:** Following the "Testing Requirements" from RCA:

**Create test cases for:**

1. Verify the fix resolves the issue
2. Test edge cases related to the bug
3. Ensure no regression in related functionality
4. Test any new code paths introduced

**Test file location:**

- Follow project's test structure (`tests/unit/` or `tests/integration/`)
- Mirror the source file location
- Use descriptive test names

**Test implementation:**

```typescript
describe("Issue {{ticket_id}} Fix", () => {
  it("should resolve the reported issue", () => {
    // Arrange - set up the scenario that caused the bug
    // Act - execute the code that previously failed
    // Assert - verify it now works correctly
  });

  it("should handle edge cases", () => {
    // Test edge case scenarios
  });
});
```

### 8. Run Validation

**AI Task:** Execute validation commands:

```bash
# Run TypeScript type checking
yarn typecheck

# Run linter
yarn lint

# Run tests (if applicable)
yarn test --passWithNoTests
```

**If validation fails:**

- Fix the issues
- Re-run validation
- Don't proceed until all pass

### 9. Verify Fix

**AI Task:** Verify the fix works:

1. **Follow reproduction steps from RCA:**
   - Execute the steps that previously caused the issue
   - Confirm issue no longer occurs

2. **Test edge cases:**
   - Test boundary conditions
   - Test error scenarios

3. **Check for unintended side effects:**
   - Verify related functionality still works
   - Ensure no new errors introduced

### 10. Update RCA Document

**AI Task:** Update the RCA document with implementation details:

Add an "Implementation" section at the end of the RCA:

```markdown
## Implementation

**Date:** [today's date]
**Implementer:** AI Agent

### Changes Made

| File              | Change                  | Lines        |
| ----------------- | ----------------------- | ------------ |
| `path/to/file.ts` | [Description of change] | [line range] |

### Tests Added

- `tests/unit/test-file.ts` - [Description of tests]

### Validation

- ✅ TypeScript type checking passed
- ✅ Linter passed
- ✅ Tests passed

### Verification

- ✅ Issue no longer reproducible
- ✅ Edge cases handled
- ✅ No regressions detected
```

### 11. Update ClickUp Ticket

**AI Task:** Add implementation summary as a comment:

1. Use `clickup_create_task_comment` to add a comment with:
   - Summary of changes made
   - Files modified
   - Tests added
   - Verification status

**Comment format:**

```markdown
## Fix Implemented ✅

**Root Cause:** [One-line summary from RCA]

**Changes Made:**

- `path/to/file.ts` - [change description]
- `path/to/other.ts` - [change description]

**Tests Added:**

- [Test file and description]

**Validation:**

- ✅ TypeScript types pass
- ✅ Linter passes
- ✅ Tests pass
- ✅ Issue verified resolved

**Ready for review and merge.**
```

2. Update ticket status to `Ready for Review` (if that status exists) or keep as `Active`

## Output Summary

Return a final summary:

```
## Fix Implementation Complete ✅

**ClickUp Ticket:** {{ticket_id}} - [Title]
**RCA Document:** `docs/rca/{{ticket_id}}.md`

**Root Cause:**
[One-line summary from RCA]

### Changes Made

| File | Change |
|------|--------|
| `path/to/file.ts` | [Description] |
| `path/to/file.ts` | [Description] |

**Total:** X files modified, Y lines added, Z lines removed

### Tests Added

| Test File | Tests |
|-----------|-------|
| `tests/unit/test.ts` | [Test names] |

### Validation Results

- ✅ `yarn typecheck` - passed
- ✅ `yarn lint` - passed
- ✅ Tests - passed

### Verification

- ✅ Issue no longer reproducible
- ✅ Edge cases handled
- ✅ No regressions detected

### ClickUp Updated

- ✅ Implementation comment added
- ✅ Status: Active

### Ready for Commit

**Suggested commit message:**
```

fix([module]): resolve ClickUp ticket {{ticket_id}} - [brief description]

[Summary of what was fixed and how]

Resolves: {{ticket_id}}

```

**Next Steps:**
1. Review changes in the modified files
2. Run `/commit` to commit the changes
3. Create PR for review
```

Done.
