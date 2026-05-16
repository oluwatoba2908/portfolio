---
name: test-feature
description: Test Feature via Browser Automation

---

---

description: Test a feature implementation using browser automation
skills: [agent-browser]

---

# Test Feature via Browser Automation

Test a feature implementation by analyzing branch changes, understanding the task requirements, and running automated browser tests.

## Input

- `{{task_id_or_description}}` - Either a ClickUp task ID (e.g., `86c7dk6uy` or custom ID like `DEV-1234`) OR a plain text description of what to test

## Prerequisites

- Local dev server running (`yarn dev` on `http://localhost:3000`)
- `agent-browser` CLI available (installed globally or via npx)
- Working in a feature branch with changes
- ClickUp MCP configured (for task ID lookups)

## Steps

### 1. Validate Input

**AI Task:** Check if input was provided:

1. **If `{{task_id_or_description}}` is empty or blank:**
   - Ask the user: "Please provide a ClickUp task ID (e.g., `86c7dk6uy`) or describe what feature you want to test"
   - Wait for response before proceeding

2. **If input is provided:**
   - Proceed to Step 2

### 2. Determine Context Source

**AI Task:** Identify whether input is a ClickUp ID or a description:

1. **Check if input looks like a ClickUp ID:**
   - Pattern: Alphanumeric, 7-12 characters (e.g., `86c7dk6uy`)
   - Or custom ID format like `DEV-1234`, `TASK-567`

2. **If it's a ClickUp ID:**
   - Use `clickup_get_task` MCP tool to fetch task details:
     ```
     Tool: clickup_get_task
     Arguments: { "task_id": "{{task_id_or_description}}", "detail_level": "detailed" }
     ```
   - Extract from response:
     - Task name/title
     - Description (contains requirements/acceptance criteria)
     - Status
   - If task not found, treat the input as a plain description instead

3. **If it's a plain text description:**
   - Use the input directly as the test context
   - Proceed with this description

4. **Store the test context:**
   - `task_name`: Name of the task or "Manual Test"
   - `task_id`: ClickUp ID or "N/A"
   - `requirements`: Description/acceptance criteria to verify

### 3. Analyze Branch Changes

**AI Task:** Understand what changed in the current branch:

1. **Get current branch name:**

   ```bash
   git branch --show-current
   ```

2. **Verify we're on a feature branch (not main/master):**
   - If on main/master, warn: "You're on the main branch. Switch to a feature branch to test specific changes."

3. **Get list of changed files:**

   ```bash
   git diff main...HEAD --name-only
   ```

4. **Get change statistics:**

   ```bash
   git diff main...HEAD --stat
   ```

5. **Categorize the changes:**
   - **Page components:** Files in `app/(root)/` or `app/api/`
   - **Module components:** Files in `modules/*/components/`
   - **Services:** Files in `modules/*/application/`
   - **API routes:** Files in `app/api/`

6. **Document findings:**
   - List all modified files
   - Identify affected routes/pages
   - Note what functionality was likely changed

### 4. Correlate Changes with Test Targets

**AI Task:** Determine what to test based on changes and requirements:

1. **Map file changes to URLs:**
   - `app/(root)/(authenticated)/[path]/page.tsx` → `http://localhost:3000/[path]`
   - `modules/[name]/components/` → Find which pages use these components

2. **Use SemanticSearch if needed:**
   - Search: "Where is [component-name] used in page components?"
   - Search: "What pages render [feature-name]?"

3. **Define test scenarios based on:**
   - Task requirements/description
   - Changed functionality
   - Expected user flows

4. **Create test plan:**

   ```
   Test Scenario 1: [Description based on requirements]
   - URL: http://localhost:3000/[path]
   - Actions: [What to do]
   - Expected: [What should happen]

   Test Scenario 2: ...
   ```

### 5. Verify Dev Server is Running

**AI Task:** Check if the development server is accessible:

1. **Test server connectivity:**

   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "FAILED"
   ```

2. **If server is not running (non-200 response or FAILED):**
   - Inform user: "The dev server doesn't appear to be running at http://localhost:3000"
   - Ask: "Please start the dev server with `yarn dev` and let me know when it's ready"
   - Wait for confirmation before proceeding

3. **If server is running:**
   - Proceed to browser testing

### 6. Execute Browser Tests

**AI Task:** Run automated browser tests using agent-browser CLI:

**For each test scenario:**

#### a. Navigate to the page

```bash
agent-browser open http://localhost:3000/[target-path]
```

#### b. Wait for page to load

```bash
agent-browser wait --load networkidle
```

#### c. Capture initial state

```bash
agent-browser snapshot -i
```

- Document interactive elements available (buttons, inputs, links)
- Note the page structure and current state

#### d. Execute test actions

Based on the test scenario, interact with the page:

```bash
# Fill form fields (use refs from snapshot)
agent-browser fill @e1 "test value"

# Click buttons/links
agent-browser click @e2

# Wait for navigation or updates
agent-browser wait --load networkidle

# Or wait for specific text to appear
agent-browser wait --text "Success"
```

#### e. Capture result state

```bash
agent-browser snapshot -i
```

#### f. Check for errors

```bash
# Get console messages (look for errors)
agent-browser console

# Get network requests (look for failed calls)
agent-browser network requests
```

#### g. Take screenshot for evidence

```bash
agent-browser screenshot ./test-results/scenario-[N].png
```

#### h. Document results

- Did the expected outcome occur?
- Were there any console errors?
- Were there any failed network requests?
- Compare actual vs expected behavior

### 7. Close Browser Session

**AI Task:** Clean up after testing:

```bash
agent-browser close
```

### 8. Evaluate Test Results

**AI Task:** Analyze the test outcomes:

1. **For each scenario, determine:**
   - **PASS:** Expected behavior matched actual behavior, no errors
   - **FAIL:** Expected behavior did not match, or errors occurred
   - **BLOCKED:** Could not complete the test (page not found, element missing, etc.)

2. **Compile issues found:**
   - List any console errors
   - List any failed network requests
   - List any unexpected behaviors

3. **Assess overall feature readiness:**
   - All scenarios pass → Feature ready for review
   - Some scenarios fail → List specific issues to fix
   - Critical failures → Feature needs rework

### 9. Generate Test Report

**AI Task:** Create a comprehensive test report:

```markdown
## Feature Test Results

**Task:** [Task ID] - [Task Name]
**Branch:** [branch-name]
**Tested:** [current date/time]
**Base URL:** http://localhost:3000

---

### Task Requirements

[Summary of what was supposed to be implemented, from ClickUp or description]

---

### Changes Analyzed

| File               | Change Type |
| ------------------ | ----------- |
| `path/to/file.tsx` | Modified    |
| `path/to/other.ts` | Added       |

**Affected Areas:**

- [List modules/features affected]

---

### Test Scenarios

#### Scenario 1: [Description]

- **URL:** http://localhost:3000/[path]
- **Actions Performed:**
  1. [Action 1]
  2. [Action 2]
- **Expected Result:** [What should happen]
- **Actual Result:** [What actually happened]
- **Status:** ✅ PASS / ❌ FAIL / ⚠️ BLOCKED

[Screenshot: scenario-1.png]

---

#### Scenario 2: [Description]

[Same format as above]

---

### Console Errors

- ✅ No console errors detected

OR

- ❌ Console errors found:
  - `[error message 1]`
  - `[error message 2]`

---

### Network Issues

- ✅ All network requests successful

OR

- ❌ Failed requests:
  - `POST /api/endpoint` - 500 Internal Server Error
  - `GET /api/data` - 404 Not Found

---

### Summary

| Metric          | Count |
| --------------- | ----- |
| Total Scenarios | X     |
| Passed          | Y     |
| Failed          | Z     |
| Blocked         | W     |

**Overall Status:** ✅ READY FOR REVIEW / ❌ NEEDS FIXES / ⚠️ PARTIALLY WORKING

---

### Issues to Address

[If any failures occurred, list specific issues:]

1. **Issue:** [Description]
   - **Scenario:** [Which test failed]
   - **Expected:** [What should happen]
   - **Actual:** [What happened]
   - **Suggested Fix:** [If obvious]

---

### Next Steps

- [ ] Fix identified issues (if any)
- [ ] Re-run tests after fixes
- [ ] Create PR for review
- [ ] Update ClickUp task status
```

### 10. Update ClickUp (Optional)

**AI Task:** If a ClickUp task ID was provided:

1. **Add test results as a comment:**
   - Use `clickup_create_task_comment` MCP tool
   - Include summary of test results
   - Note any issues found

2. **Comment format:**

   ```markdown
   ## Browser Test Results 🧪

   **Branch:** [branch-name]
   **Tested:** [date/time]

   ### Results Summary

   - Total Scenarios: X
   - ✅ Passed: Y
   - ❌ Failed: Z

   ### Issues Found

   [List any issues or "No issues found"]

   ### Next Steps

   [Ready for review / Needs fixes]
   ```

## Output Summary

Return the test report directly to the user and ask:

1. If all tests passed: "All tests passed! Would you like me to help create a PR?"
2. If some tests failed: "Some tests failed. Would you like me to help investigate and fix the issues?"
3. If blocked: "Some tests couldn't be completed. Would you like me to help resolve the blockers?"

Done.
