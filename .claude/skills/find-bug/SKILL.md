---
name: find-bug
description: Find Bug Workflow

---

# Find Bug Workflow

Systematic bug investigation workflow that triages, investigates, and proposes fixes.

## Input

- `{{bug_description}}` - Description of the bug or unexpected behavior
- `{{urls}}` - (Optional) URLs to navigate to for client-side bugs

## Phase 1: Triage

**AI Task:** Determine the bug classification before investigation.

### 1.1 Validate Input

1. **If `{{bug_description}}` is empty:**
   - Ask: "Please describe the bug or unexpected behavior you're seeing"
   - Wait for response before proceeding

### 1.2 Classify Bug Type

Based on the bug description, classify as one of:

| Type            | Indicators                                                                                                                            | Investigation Path |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| **Client-Side** | UI rendering issues, component behavior, state management, visual glitches, browser console errors, user interaction problems         | → Phase 2A         |
| **Server-Side** | API errors (4xx/5xx), data not persisting, background job failures, webhook issues, database inconsistencies, incorrect API responses | → Phase 2B         |
| **Full-Stack**  | Data shows correctly in DB but wrong in UI, API returns correct data but UI misrenders, data correct in UI but wrong in DB            | → Phase 2A + 2B    |

### 1.3 Confirm Classification

**AI Task:** State your classification and reasoning:

```
Bug Classification: [Client-Side | Server-Side | Full-Stack]

Reasoning:
- [Key indicator 1 from description]
- [Key indicator 2 from description]

Investigation Path: Phase 2[A|B]
```

If uncertain, ask the user:

- "Does this bug involve the UI/browser behavior, or is it about data/API/backend processing?"

---

## Phase 2A: Client-Side Investigation

**Prerequisites:**

- Local dev server running (`yarn dev`)
- Browser MCP available (`cursor-ide-browser`)
- URLs provided or identifiable from bug description

### 2A.1 Gather URLs

1. **If `{{urls}}` provided:** Parse into array (split by comma, trim whitespace)
2. **If `{{urls}}` empty:** Ask: "Please provide the URL(s) to investigate (comma-separated if multiple)"

### 2A.2 Navigate and Capture State

**AI Task:** For each URL:

1. **Navigate:**
   - Use `browser_navigate` with `position: "side"`
   - Wait for page to fully load (use incremental waits with snapshots)

2. **Capture evidence:**
   - `browser_snapshot` - accessibility tree for element structure
   - `browser_console_messages` - errors/warnings
   - `browser_network_requests` - failed or unusual API calls
   - `browser_take_screenshot` - if visual context needed

3. **Document observations:**
   - Data displayed on page
   - Console errors (with stack traces)
   - Failed network requests (status codes, payloads)
   - Visual anomalies

### 2A.3 Reproduce the Bug

**AI Task:** If bug requires interaction:

1. Use `browser_snapshot` to identify interactive elements
2. Perform the actions that trigger the bug
3. Capture state after each action
4. Document the exact reproduction steps

### 2A.4 Identify the Discrepancy

**AI Task:** Compare observed vs expected:

1. **Extract key data points:**
   - IDs, names, values displayed
   - State indicators
   - Data relationships

2. **Cross-reference (if multiple URLs):**
   - Compare data across pages
   - Look for inconsistencies

3. **Document:**
   - Expected behavior
   - Actual behavior
   - Specific wrong values

---

## Phase 2B: Server-Side Investigation

**Prerequisites:**

- Local dev server running (`yarn dev`)
- MongoDB MCP available (`project-0-web-app-mongodb`)
- Terminal access for log observation

### 2B.1 Gather Context

**AI Task:** Collect information needed for investigation:

1. **If API endpoint involved:**
   - Ask: "What API endpoint is affected? (e.g., `/api/partners`, `POST /api/campaigns`)"
   - Ask: "What request payload triggers the bug?" (if applicable)

2. **If background job involved:**
   - Ask: "Which Inngest function is failing?" (check `lib/inngest/functions/`)
   - Ask: "What event triggers the failure?"

3. **If data inconsistency:**
   - Ask: "What entity/collection is affected?" (e.g., partners, campaigns, organizations)
   - Ask: "What specific document ID(s) show the problem?"

### 2B.2 Check Server Logs

**AI Task:** Examine terminal output for errors:

1. **Read the dev server terminal:**
   - Check terminal files in the terminals folder
   - Look for recent errors, stack traces, warnings
   - Note correlation IDs if present (format: `[correlation_id: xxx]`)

2. **Look for these patterns:**
   - `Error:` or `TypeError:` - Runtime errors
   - `ValidationError:` - Zod validation failures
   - `MongoError:` or `MongooseError:` - Database issues
   - `401/403` - Auth/permission failures
   - `404` - Resource not found
   - `500` - Unhandled server errors

3. **Document findings:**
   - Error message and stack trace
   - Timestamp of occurrence
   - Any correlation ID for tracing

### 2B.3 Trace the API Route

**AI Task:** Follow the request through the stack:

1. **Find the API route:**
   - Use `Glob` to find: `app/api/**/route.ts` matching the endpoint
   - Read the route file to understand the handler

2. **Identify the HOF chain:**

   ```
   withAuth → withDB → withValidation → handler
   ```

   - Check what validation schema is used
   - Check what permissions are required
   - Identify which service method is called

3. **Trace to service layer:**
   - Find the service in `modules/*/application/*.service.ts`
   - Read the specific method being called
   - Note any repository calls or external service calls

4. **Trace to repository (if applicable):**
   - Find repository in `modules/*/infrastructure/*.repository.ts`
   - Check the database query being executed
   - Look for query filters, projections, aggregations

### 2B.4 Query Database State

**AI Task:** Use MongoDB MCP to verify data state:

1. **Identify the collection:**
   - Map entity to collection name (e.g., `Partner` → `partners`)

2. **Query relevant documents:**

   ```
   Use MongoDB MCP tools:
   - find: Query documents matching criteria
   - aggregate: For complex data analysis
   ```

3. **Verify data integrity:**
   - Does the document exist?
   - Are required fields populated?
   - Are references (IDs) valid?
   - Is the data in expected state?

4. **Check related documents:**
   - Follow foreign key references
   - Verify parent/child relationships
   - Check for orphaned references

### 2B.5 Investigate Inngest Functions (if applicable)

**AI Task:** For background job failures:

1. **Find the function:**
   - Search in `lib/inngest/functions/`
   - Read the function definition

2. **Check idempotency:**
   - Is the function safe to retry?
   - Does it handle duplicate events?

3. **Trace step execution:**
   - Identify `step.run()` calls
   - Check what each step does
   - Look for step dependencies

4. **Check event payload:**
   - What data is passed in the event?
   - Is required data present?
   - Are IDs/references valid?

### 2B.6 Identify the Server-Side Discrepancy

**AI Task:** Summarize findings:

1. **Data state analysis:**
   - What is stored in the database?
   - What should be stored?
   - What is returned by the API?

2. **Request flow analysis:**
   - Where in the stack does the bug manifest?
   - What transformation causes the issue?
   - What condition triggers the bug?

3. **Document:**
   - Expected server behavior
   - Actual server behavior
   - Specific values/state that are wrong

### 2B.7 Common Server-Side Bug Patterns

| Pattern              | What to Look For                                        |
| -------------------- | ------------------------------------------------------- |
| Missing auth check   | Route missing `withAuth` or wrong `requiredPermissions` |
| Validation bypass    | Schema doesn't match expected input                     |
| Query filter missing | Not filtering by `organization_id` (multi-tenancy leak) |
| Race condition       | Read-then-write instead of atomic operations            |
| N+1 query            | Loop with individual DB calls instead of batch          |
| Unhandled rejection  | Missing try/catch or error propagation                  |
| Stale reference      | Using old ID after entity was updated/deleted           |
| Type coercion        | ObjectId vs string comparison                           |
| Missing await        | Async operation not awaited                             |
| Transaction missing  | Multi-document update without transaction               |

---

## Phase 3: Code Tracing

**AI Task:** Trace from symptom to source based on bug type.

### 3.1 Identify Affected Components

**For Client-Side bugs:**

1. Use `SemanticSearch`: "Where is the component that renders [page path]?"
2. Find the page component in `app/` directory
3. Identify child components involved
4. Find hooks and state management

**For Server-Side bugs:**

1. Use `Glob` to find API route: `app/api/**/route.ts`
2. Use `SemanticSearch`: "Where is the service that handles [operation]?"
3. Find the service in `modules/*/application/`
4. Find the repository in `modules/*/infrastructure/`
5. Check Inngest functions in `lib/inngest/functions/`

### 3.2 Trace Data Flow

**Client-Side Flow:**

```
TanStack Query / useAuthenticatedQuery
    ↓
API Response (via api.ts)
    ↓
Component State / Props
    ↓
Rendered Output
```

**Server-Side Flow:**

```
API Route (app/api/**/route.ts)
    ↓
HOFs: withAuth → withDB → withValidation
    ↓
Service Layer (modules/*/application/*.service.ts)
    ↓
Repository Layer (modules/*/infrastructure/*.repository.ts)
    ↓
MongoDB (via Mongoose)
```

**Event-Driven Flow (Inngest):**

```
Event Trigger (API/webhook/scheduled)
    ↓
Inngest Function (lib/inngest/functions/)
    ↓
step.run() blocks (retryable units)
    ↓
Service Layer calls
    ↓
Database updates
```

- Use `Grep` to find specific values/IDs/function names
- Look for transformation points where data could be corrupted

### 3.3 Check Common Bug Patterns

**Client-Side Patterns:**

| Pattern             | What to Look For                          |
| ------------------- | ----------------------------------------- |
| Stale closure       | Missing deps in `useEffect`/`useCallback` |
| Race condition      | Async operations without proper guards    |
| Incorrect reference | Wrong ID/key being used                   |
| State mutation      | Direct mutation instead of spread         |
| Missing null check  | Accessing properties on undefined         |
| Caching issue       | Stale TanStack Query data                 |
| Prop drilling error | Wrong prop passed through layers          |

**Server-Side Patterns:**

| Pattern                 | What to Look For                                     |
| ----------------------- | ---------------------------------------------------- |
| Multi-tenancy leak      | Missing `organization_id` filter                     |
| Auth bypass             | Missing `withAuth` or wrong permissions              |
| Validation gap          | Schema doesn't cover edge case                       |
| Read-then-write race    | Should use atomic `$set`, `$inc`, `findOneAndUpdate` |
| ObjectId mismatch       | String vs ObjectId comparison                        |
| Missing await           | Unhandled promise in async function                  |
| N+1 query               | Loop with individual DB calls                        |
| Transaction missing     | Multi-document update needs atomicity                |
| Error swallowing        | Catch block without proper handling                  |
| Stale service reference | Calling old/renamed method                           |

---

## Phase 4: Root Cause Analysis

**AI Task:** Determine the definitive cause.

### 4.1 Identify Root Cause

Answer these questions:

1. **What exact line(s) cause the issue?**
   - File path and line numbers
   - The problematic code snippet

2. **Why does this produce incorrect behavior?**
   - The logical flaw or missing handling
   - The conditions that trigger it

3. **When does this occur?**
   - Always, or under specific conditions?
   - What state/data triggers it?

### 4.2 Assess Brittleness

1. **Severity:** How bad is the impact?
2. **Fragility:** Is this code prone to similar bugs?
3. **Related patterns:** Are there similar patterns elsewhere at risk?

### 4.3 Determine Scope

1. **Affected features:** What else might be impacted?
2. **Regression check:** Was this caused by a recent change?

### 4.4 PRD Assessment

**AI Task:** Determine if a PRD is needed before proceeding to fix.

**A PRD is needed when:**

| Indicator                        | Explanation                                                |
| -------------------------------- | ---------------------------------------------------------- |
| **Architectural change**         | Fix requires refactoring multiple services or data flow    |
| **New feature disguised as bug** | "Bug" is actually missing functionality                    |
| **Multiple modules affected**    | Fix touches 3+ modules or requires cross-team coordination |
| **Data model changes**           | New fields, schema changes, or migrations required         |
| **Design decisions needed**      | Multiple valid solutions with significant trade-offs       |
| **User-facing behavior change**  | Fix changes expected UX or introduces new patterns         |
| **Infrastructure scope**         | Inngest functions, API contracts, or event types affected  |
| **Estimate > 4 hours**           | Complexity suggests formal planning                        |

**AI Task:** If ANY indicators apply, ask the user:

> "Based on the root cause analysis, this appears to require [specific indicator]. Would you like me to create a PRD before implementing the fix?"
>
> Options:
>
> 1. Yes, create a PRD (→ Phase 4B)
> 2. No, proceed with fix (→ Phase 5)

---

## Phase 4B: Create Bug-Triggered PRD

**Prerequisites:** Phase 4 complete, user opted for PRD creation

### 4B.1 Gather PRD Context

**AI Task:** Collect additional context from bug findings:

1. **From investigation:**
   - Root cause summary
   - Affected modules/layers
   - Data flow insights
   - Related code patterns

2. **Ask user (if not evident):**
   - "What is the expected behavior once fixed?"
   - "Are there related improvements we should bundle?"
   - "Who are the primary users affected?"

### 4B.2 Generate PRD

**AI Task:** Create PRD using the bug findings as input.

**File naming:** `docs/prds/[date]/[feature-slug].md`

- Use today's date folder (format: `DD-MM-YY`)
- Slug from the fix description (e.g., `partner-sync-race-condition.md`)

**PRD Template (Bug-Triggered):**

````markdown
# PRD: [Fix Title - Derived from Bug]

**ClickUp Ticket:** [If known] | **Status:** Draft | **Priority:** [From severity]
**Author:** AI-Generated | **Date:** [Today]
**Type:** Bug Fix / Refactor
**Triggered By:** Bug Investigation

---

## Executive Summary

[2-3 sentences: What bug was discovered, why it matters, what the fix entails]

## Problem Statement

### Original Bug Report

- **Description:** [From {{bug_description}}]
- **Reproduction Steps:** [From Phase 2]
- **Observed Behavior:** [From investigation]
- **Expected Behavior:** [Corrected state]

### Root Cause Analysis

- **Location:** `[file:line]` (from Phase 4)
- **Layer:** [Route | HOF | Service | Repository | Inngest | Schema]
- **Problem:** [Why it breaks - from Phase 4]
- **Code:**

  ```typescript
  // Problematic code from investigation
  ```

### Why a PRD?

[Explain which indicators triggered PRD creation]

## Target Users

| Persona     | Impact                     |
| ----------- | -------------------------- |
| [User type] | [How the bug affects them] |

## Goals & Success Metrics

- **Primary Goal:** [What "fixed" looks like]
- **Success Metrics:**
  - [ ] [Measurable outcome 1]
  - [ ] [Measurable outcome 2]

## Scope

### ✅ In Scope (MVP)

- [ ] [Core fix requirement 1]
- [ ] [Core fix requirement 2]

### ❌ Out of Scope

- [ ] [Related but deferred improvement]

## Technical Approach

### Affected Modules

| Module         | Changes            | Impact         |
| -------------- | ------------------ | -------------- |
| [From Phase 3] | [Required changes] | [High/Med/Low] |

### Architecture & Patterns

**Design Patterns:**

- [Relevant patterns for fix]

**Key Principles:**

- Follow Module Architecture Standard
- [Other relevant principles]

### Data Flow

[Diagram if helpful - copy from Phase 3 trace]

### ESLint Compliance

**Module Boundaries:**

| Module Needed | Owns Functionality | Cross-Module Strategy |
| ------------- | ------------------ | --------------------- |
| [Module]      | [What it owns]     | [Strategy]            |

**Layer Restrictions:**

- [x] No cross-module imports in domain/application
- [x] Mongoose only in infrastructure
- [x] No `_id` outside infrastructure

### Database Changes

**Schema Updates:** [If any]
**Migrations Required:** [Yes/No]

### API Changes

**Modified Endpoints:** [If any]
**New Events:** [If any]

## Implementation Phases

### Phase 1: [First deliverable]

- [ ] [Task 1]
- [ ] [Task 2]

**Validation:** [How to verify]

### Phase 2: [Second deliverable]

- [ ] [Task 1]
- [ ] [Task 2]

**Validation:** [How to verify]

## Dependencies & Risks

| Risk                      | Impact   | Likelihood   | Mitigation   |
| ------------------------- | -------- | ------------ | ------------ |
| [Risk from investigation] | [Impact] | [Likelihood] | [Mitigation] |

## Acceptance Criteria

### Functional Criteria

- [ ] Bug no longer reproducible
- [ ] [Additional criteria]

### Quality Criteria

- [ ] `yarn typecheck` passes
- [ ] `yarn eslint . --quiet` passes
- [ ] Module boundaries respected
- [ ] Inngest functions are idempotent (if applicable)

---

_Generated from bug investigation on [date]_
````

### 4B.3 Save and Confirm

**AI Task:**

1. Create the date folder if it doesn't exist
2. Save the PRD file
3. Confirm with user:

> "PRD created at `docs/prds/[date]/[slug].md`"
>
> Would you like me to:
>
> 1. Review and refine the PRD
> 2. Proceed to implement Phase 1
> 3. Create a ClickUp ticket from this PRD

---

## Phase 5: Propose Fix

**AI Task:** Design a robust solution.

### 5.1 Immediate Fix

- Specific code changes to fix the bug
- Before/after code snippets
- Files to modify

### 5.2 Robustness Improvements

- Validation/guards to prevent recurrence
- Type safety improvements
- Error handling additions

### 5.3 Testing Strategy

- Manual verification steps
- Edge cases to test
- Potential automated tests

---

## Phase 6: Generate Bug Report

**AI Task:** Create comprehensive report based on bug type:

````markdown
## Bug Report: [Brief Title]

### Classification

- **Type:** [Client-Side | Server-Side | Full-Stack]
- **Severity:** [Critical | High | Medium | Low]
- **Affected Layer:** [UI | API | Service | Repository | Inngest | Database]

### Problem Summary

- **Description:** [What's wrong]
- **Expected:** [What should happen]
- **Actual:** [What happens instead]
- **Reproduction Steps:** [1, 2, 3...]

### Investigation Findings

**Client-Side (if applicable):**

- **Page Observations:** [Data, values, state]
- **Console Errors:** [If any]
- **Network Requests:** [Failed or unusual requests]

**Server-Side (if applicable):**

- **Server Logs:** [Errors, stack traces, correlation IDs]
- **API Response:** [Status code, error message, payload]
- **Database State:** [Document values, missing data, incorrect references]
- **Inngest Status:** [Function state, step failures, event data]

### Root Cause

- **Location:** `[file:line]`
- **Layer:** [Route | HOF | Service | Repository | Inngest | Schema]
- **Problem:** [Why it breaks]
- **Code:**
  ```typescript
  // Problematic code
  ```
````

### Proposed Fix

- **Strategy:** [Approach]
- **Files to Modify:**
  | File | Layer | Change |
  |------|-------|--------|
  | ... | ... | ... |

- **Before/After:**
  ```typescript
  // Before
  ```
  ```typescript
  // After
  ```

### Validation

**Code Quality:**

- [ ] `yarn typecheck`
- [ ] `yarn eslint . --quiet`

**Client-Side Verification (if applicable):**

- [ ] Page renders correctly
- [ ] Console free of errors
- [ ] Network requests succeed

**Server-Side Verification (if applicable):**

- [ ] API returns correct response
- [ ] Database state is correct (verify via MongoDB MCP)
- [ ] Server logs show no errors
- [ ] Inngest function completes (if applicable)

### Next Steps

1. [ ] Implement fix
2. [ ] Run validation commands
3. [ ] Verify fix (browser and/or API)
4. [ ] Check for related patterns that need similar fixes

```

---

## Output

Return the bug report and ask based on PRD assessment:

**If PRD was created:**

> "I've completed the investigation and created a PRD at `[path]`. Would you like me to:
>
> 1. Implement Phase 1 of the PRD
> 2. Review/refine the PRD first
> 3. Create a ClickUp ticket from this PRD"

**If no PRD needed:**

> "I've completed the investigation. Would you like me to implement the fix?"

Done.
```
