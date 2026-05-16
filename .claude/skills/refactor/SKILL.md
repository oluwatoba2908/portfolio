---
name: refactor
description: Refactor Code

---

code and perform structured refactoring while maintaining functionality and improving quality.

## Input

- `{{target}}` - File path, function name, or component to refactor. Leave blank to be prompted.
- `{{refactor_type}}` - Type of refactoring (optional): `extract`, `rename`, `restructure`, `dry`, `pattern`, `move`, `simplify`, or blank for analysis.

## Prerequisites

- Working in the web-app repository
- Code to refactor exists and is functional
- Git working tree is clean (recommended)

## Steps

### 1. Validate Inputs

**AI Task:** Check inputs are provided:

1. **If `{{target}}` is empty:**
   - Ask: "What would you like to refactor? Please provide a file path, function name, or component name."
   - Wait for response before proceeding

2. **If `{{refactor_type}}` is empty:**
   - Proceed with analysis mode (Step 2) to suggest refactoring opportunities
   - Otherwise, proceed to Step 3 with the specified type

### 2. Analyze Code for Refactoring Opportunities

**AI Task:** Read and analyze the target code:

1. **Locate the code:**
   - Use `Glob` to find files matching the target
   - Use `Grep` to find functions/components by name
   - Use `SemanticSearch` if target is conceptual (e.g., "authentication logic")

2. **Read the code:**
   - Read the full file(s) containing the target
   - Understand the current implementation
   - Note dependencies and consumers

3. **Identify refactoring opportunities:**

   | Type            | Indicators                                                        |
   | --------------- | ----------------------------------------------------------------- |
   | **Extract**     | Long functions (>50 lines), repeated code blocks, mixed concerns  |
   | **Rename**      | Unclear names, misleading names, inconsistent naming conventions  |
   | **Restructure** | Deep nesting, complex conditionals, unclear data flow             |
   | **DRY**         | Duplicated logic across files, copy-pasted patterns               |
   | **Pattern**     | Missing abstractions, opportunities for design patterns           |
   | **Move**        | Code in wrong module/layer, tight coupling, circular dependencies |
   | **Simplify**    | Over-engineered solutions, unnecessary complexity, dead code      |

4. **Generate analysis report:**

```markdown
## Refactoring Analysis: [target]

### Current State

- **Location:** `path/to/file.ts`
- **Lines:** X-Y (Z lines total)
- **Dependencies:** [list imports/consumers]
- **Complexity:** [low/medium/high]

### Identified Opportunities

| Priority | Type   | Description   | Impact   |
| -------- | ------ | ------------- | -------- |
| 1        | [type] | [description] | [impact] |

### Recommended Approach

[Description of suggested refactoring strategy]

Proceed with refactoring? (specify type or number from table)
```

### 3. Plan the Refactoring

**AI Task:** Based on `{{refactor_type}}`, create a detailed plan:

#### For `extract`:

- Identify code blocks to extract
- Determine extraction target (function, hook, component, service method)
- Plan parameter passing and return values
- Identify shared state/dependencies

#### For `rename`:

- List all instances of the name across codebase
- Determine new name following conventions:
  - TSX files: PascalCase
  - TS files: dot.notation.ts
  - Functions/variables: camelCase
  - API/DB fields: snake_case
- Plan for updating imports and references

#### For `restructure`:

- Map current code flow
- Design improved structure
- Plan intermediate refactoring steps
- Identify breaking points

#### For `dry`:

- Identify all duplicated code locations
- Design shared abstraction
- Determine appropriate location (utils, shared, module-specific)
- Plan migration strategy

#### For `pattern`:

- Identify applicable design pattern
- Map current code to pattern structure
- Plan implementation following Module Architecture Standard
- Ensure alignment with existing patterns (BaseService, BaseRepository, etc.)

#### For `move`:

- Identify target location
- Check for circular dependency risks
- Plan client/server separation compliance
- Update all import paths

#### For `simplify`:

- Identify unnecessary complexity
- Plan removal/simplification steps
- Verify no functionality loss
- Check for hidden side effects

### 4. Pre-Refactoring Checklist

**AI Task:** Verify safety before making changes:

1. **Check git status:**

   ```bash
   git status --porcelain
   ```

   - Warn if uncommitted changes exist
   - Recommend committing or stashing first

2. **Identify all affected files:**
   - Use `Grep` to find all usages of code being refactored
   - List files that will need updates

3. **Check for tests:**
   - Find existing tests for the code
   - Note test coverage gaps

4. **Verify understanding:**
   - Summarize what the code currently does
   - Confirm with user if complex or unclear

### 5. Execute Refactoring

**AI Task:** Implement changes systematically:

#### 5.1 Create New Abstractions (if applicable)

- Create new files/functions/components
- Follow project conventions:
  - Extend `BaseService` for business logic
  - Extend `BaseRepository` for data access
  - Use Zod v4 schemas as single source of truth
  - Use BrandedZodTypes for API inputs
  - Follow Module Architecture Standard

#### 5.2 Migrate Code

- Move code to new locations
- Update signatures and interfaces
- Maintain functionality at each step

#### 5.3 Update Consumers

- Update all import statements
- Update function calls/component usage
- Ensure type safety throughout

#### 5.4 Clean Up

- Remove old/dead code
- Remove unused imports
- Update barrel exports (index.ts, server.ts)
- Maintain client/server separation

### 6. Validate Changes

**AI Task:** Run validation commands:

```bash
# TypeScript type checking
yarn typecheck

# Linting
yarn eslint . --quiet
```

**If validation fails:**

- Identify the issue
- Fix without compromising the refactoring goals
- Re-run validation
- Do NOT proceed until all pass

### 7. Verify Functionality

**AI Task:** Ensure refactoring didn't break anything:

1. **Structural verification:**
   - All imports resolve correctly
   - No circular dependencies introduced
   - Client/server separation maintained

2. **Behavioral verification:**
   - Logic is functionally equivalent
   - No unintended side effects
   - Edge cases still handled

3. **Pattern compliance:**
   - Follows Module Architecture Standard
   - Uses correct HOFs (withAuth, withDB, withValidation)
   - Proper permission handling (requiredPermissions)

### 8. Update Documentation

**AI Task:** Update related documentation:

1. **If new patterns introduced:**
   - Update relevant docs in `/docs/`
   - Add JSDoc comments to new abstractions

2. **If module structure changed:**
   - Update module's index.ts exports
   - Update server.ts for server-only exports

### 9. Generate Refactoring Report

**AI Task:** Produce summary:

```markdown
## Refactoring Complete ✅

**Target:** {{target}}
**Type:** {{refactor_type}}

### Changes Summary

| File              | Change        | Lines |
| ----------------- | ------------- | ----- |
| `path/to/file.ts` | [description] | +X/-Y |

**Total:** X files modified, Y lines added, Z lines removed

### Before/After Comparison

**Before:**

- [Description of original state]
- [Key metrics: lines, complexity, duplication]

**After:**

- [Description of new state]
- [Improved metrics]

### Quality Improvements

- ✅ [Specific improvement 1]
- ✅ [Specific improvement 2]
- ✅ [Specific improvement 3]

### Validation Results

- ✅ `yarn typecheck` - passed
- ✅ `yarn eslint . --quiet` - passed

### Suggested Commit Message
```

refactor([module]): [brief description]

[Detailed explanation of what was refactored and why]

- [Change 1]
- [Change 2]

```

### Next Steps

1. Review the changes
2. Run `/code-quality-review` to verify quality
3. Test affected functionality manually
4. Commit changes
```

## Refactoring Type Reference

| Type          | Use When                                | Example                                            |
| ------------- | --------------------------------------- | -------------------------------------------------- |
| `extract`     | Code is doing too much, repeated blocks | Extract `validatePartner()` from 200-line function |
| `rename`      | Names don't reflect purpose             | Rename `data` to `partnerResponse`                 |
| `restructure` | Hard to follow logic flow               | Flatten nested conditionals                        |
| `dry`         | Same logic in multiple places           | Create shared `formatCurrency()` util              |
| `pattern`     | Missing abstraction opportunities       | Apply Repository pattern to data access            |
| `move`        | Code in wrong location                  | Move service logic from API route to service layer |
| `simplify`    | Over-engineered or complex              | Remove unused abstraction layers                   |

## Output

Return the refactoring report and ask if user wants to commit the changes.

Done.
