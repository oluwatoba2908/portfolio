---
name: batch-prd
description: Batch PRD Generator

---

# Batch PRD Generator

Generate separate Product Requirements Documents (PRDs) for multiple features/tasks. Each PRD is created independently with a fresh context. Questions are captured as Open Questions within each PRD rather than asked in chat.

## Input

- `{{tasks}}` - Array of task descriptions (e.g., `["Add user notifications", "Implement search filters", "Create dashboard analytics"]`)
- `{{depth}}` - PRD detail level: `quick` | `standard` (default) | `comprehensive`

## How This Works

1. For each task in `{{tasks}}`, a separate PRD is generated
2. Discovery questions are added to the **Open Questions** section (not asked in chat)
3. After completing each PRD, **clear context and start fresh** for the next one
4. Each PRD is self-contained and can be reviewed/refined independently

## Steps

### 1. Parse and Validate Tasks

**AI Task:** Parse the `{{tasks}}` input:

1. **Validate input:**
   - Ensure `{{tasks}}` is an array of strings
   - Each task should be a brief description (1-3 sentences)
   - Minimum 1 task required

2. **Display task list:**

   ```
   ## Batch PRD Generation

   I'll create separate PRDs for the following tasks:

   1. [Task 1 description]
   2. [Task 2 description]
   3. [Task 3 description]
   ...

   **Depth:** {{depth}}

   Starting with Task 1...
   ```

3. **Proceed to Step 2 for the first task**

### 2. Analyze Single Task

**AI Task:** For the current task, analyze and gather context:

1. **Identify the feature type:**
   - New feature / Enhancement / Bug fix / Refactor / Infrastructure

2. **Search for related code:**
   - Use `codebase_search` to find existing implementations
   - Identify affected modules, services, and components
   - Note any existing patterns to follow

3. **Check documentation:**
   - Search `docs/` for relevant architecture or patterns
   - Review module READMEs if applicable

4. **Read ESLint config:**
   - Open `eslint.config.mjs` at the project root
   - Extract constraints for module boundaries and layer restrictions

5. **Generate discovery questions** (do NOT ask in chat - these go to Open Questions):
   - Based on information gaps, generate 3-6 questions
   - Categorize them by: Problem & Context, Users & Scope, Requirements, Technical, UX & Design

### 3. Generate PRD for Current Task

**AI Task:** Create the PRD. Adapt section depth based on `{{depth}}`:

- **quick**: Overview, Problem, Requirements, Acceptance Criteria, Open Questions only
- **standard**: All sections, moderate detail
- **comprehensive**: All sections with extensive detail, examples, and edge cases

````markdown
# PRD: [Feature Name]

**Task:** [Original task description from input]
**Author:** AI-Generated | **Date:** [today's date]
**Type:** [New Feature / Enhancement / Bug Fix / Refactor / Infrastructure]
**Depth:** [quick/standard/comprehensive]

---

## Executive Summary

[2-3 paragraph summary covering:]

- What this feature does and why it matters
- Core value proposition
- MVP goal statement

## Problem Statement

[What problem are we solving? What pain point exists today?]

**Current State:** [How things work now - inferred from codebase]
**Desired State:** [How things should work after implementation]

## Target Users

| Persona                 | Description         | Key Needs             |
| ----------------------- | ------------------- | --------------------- |
| [e.g., Vendor Admin]    | [Brief description] | [Primary pain points] |
| [e.g., Partner Manager] | [Brief description] | [Primary pain points] |

**Technical Comfort Level:** [Low / Medium / High]

## Goals & Success Metrics

- **Primary Goal:** [What we're trying to achieve]
- **Success Metrics:**
  - [ ] [Measurable outcome 1]
  - [ ] [Measurable outcome 2]
  - [ ] [Measurable outcome 3]

## Scope

### ✅ In Scope (MVP)

**Core Functionality:**

- [ ] [Requirement 1]
- [ ] [Requirement 2]

**Technical:**

- [ ] [Technical requirement 1]
- [ ] [Technical requirement 2]

### ❌ Out of Scope

- [ ] [Explicitly excluded feature 1]
- [ ] [Explicitly excluded feature 2]
- [ ] [Future enhancement deferred]

## User Stories

### Primary Stories

1. **As a** [user type], **I want to** [action], **so that** [benefit]
   - _Example:_ [Concrete scenario]

2. **As a** [user type], **I want to** [action], **so that** [benefit]
   - _Example:_ [Concrete scenario]

### Edge Cases

- **As a** [user type], **when** [edge condition], **I expect** [behavior]

## Functional Requirements

### Must Have (P0)

- [ ] [Requirement 1]
- [ ] [Requirement 2]

### Should Have (P1)

- [ ] [Secondary requirement]
- [ ] [Secondary requirement]

### Nice to Have (P2)

- [ ] [Optional enhancement]

## Technical Approach

### Affected Modules

| Module            | Changes        | Impact         |
| ----------------- | -------------- | -------------- |
| `modules/[name]`  | [what changes] | [High/Med/Low] |
| `app/api/[route]` | [what changes] | [High/Med/Low] |

### Architecture & Patterns

[Based on codebase search - patterns to follow, services to use]

**Design Patterns:**

- [Pattern 1 from existing codebase]
- [Pattern 2 to follow]

**Key Principles:**

- Follow Module Architecture Standard
- Use BrandedZodTypes for API inputs
- Extend BaseService for business logic
- Code new features for extraction: generic interfaces, minimal project coupling

### ESLint Compliance

**Module Boundaries:**

| Module Needed    | Owns Functionality | Cross-Module Strategy    |
| ---------------- | ------------------ | ------------------------ |
| `modules/[name]` | [what it owns]     | [how to share if needed] |

**Layer Restrictions:**

| File Location       | Prohibited Imports          | Compliance Strategy |
| ------------------- | --------------------------- | ------------------- |
| `domain/**`         | mongoose, other modules     | [how to comply]     |
| `application/**`    | mongoose, other modules     | [how to comply]     |
| `api/**`            | mongoose, other modules     | [how to comply]     |
| `infrastructure/**` | other modules (mongoose OK) | [how to comply]     |

**Syntax Restrictions:**

- [ ] **No dynamic imports:** All imports are static at file top
- [ ] **No `_id` access:** Use `getIdValue(entity)` from `@/shared/types` in non-infra code
- [ ] **Shared code patterns:** Cross-module types/utilities in `@/shared`

### Database Changes

**Schema Updates:**

```typescript
// Example schema changes
{
  field_name: { type: String, required: true }
}
```

**New Collections:** [List any new collections]
**Field Additions:** [List fields added to existing collections]
**Migrations Required:** [Yes/No - describe if yes]

### API Changes

**New Endpoints:**

| Method | Endpoint          | Description   |
| ------ | ----------------- | ------------- |
| POST   | `/api/[resource]` | [Description] |
| GET    | `/api/[resource]` | [Description] |

**Request/Response Example:**

```json
// POST /api/example
{
  "field": "value"
}
```

### Technology Stack

| Layer      | Technology       | Notes                       |
| ---------- | ---------------- | --------------------------- |
| Framework  | Next.js 16       | App Router                  |
| UI         | Mantine v8       | [specific components]       |
| Database   | MongoDB/Mongoose | [collections affected]      |
| Validation | Zod v4           | BrandedZodTypes             |
| Events     | Inngest          | [if async workflows needed] |

## Security & Configuration

### Authorization

- **Required Permissions:** `[Permissions.X]`
- **User Roles Affected:** [Vendor Admin, Partner, etc.]
- **Multi-tenancy:** Filter by `organization_id`

### Configuration

| Variable    | Purpose   | Required |
| ----------- | --------- | -------- |
| `[ENV_VAR]` | [Purpose] | Yes/No   |

### Security Considerations

- [ ] Input validation via Zod schemas
- [ ] Permission checks via `withAuth` HOF
- [ ] No sensitive data in client bundles

## Design Input

> **For Designers:** This section captures design requirements and considerations. Please review and provide input before engineering implementation begins.

### Design Required?

- **Requires Design Work:** [Yes / No / Partial]
- **Design Type:** [New UI / UI Enhancement / No UI Changes / Backend Only]

### Visual & Interaction Design

**UI Components Affected:**

- [ ] [Component/Screen 1]
- [ ] [Component/Screen 2]

**Design Considerations:**

- [ ] [Consideration 1 - e.g., "How should empty states be handled?"]
- [ ] [Consideration 2 - e.g., "Mobile responsiveness requirements"]
- [ ] [Consideration 3 - e.g., "Accessibility needs"]

**Reference Designs:**

- [Link to Figma / existing patterns / competitor examples]

### User Experience

**User Flow:**

1. [Step 1 of the user journey]
2. [Step 2 of the user journey]
3. [Step 3 of the user journey]

**Edge Cases to Design For:**

- [ ] [Edge case 1 - e.g., "What if user has no data?"]
- [ ] [Edge case 2 - e.g., "What if action fails?"]
- [ ] [Edge case 3 - e.g., "What if data is loading?"]

### Design Questions

> **Designers:** Please answer these questions and add any additional considerations.

- [ ] [Design question 1]
- [ ] [Design question 2]
- [ ] [Design question 3]

### Design Sign-off

- **Designer:** [Name or "Not Assigned"]
- **Design Status:** [ ] Not Started | [ ] In Progress | [ ] Ready for Review | [ ] Approved
- **Design Artifacts:** [Links to Figma files, mockups, prototypes]

## Implementation Phases

### Phase 1: Foundation

**Goal:** [What this phase achieves]
**Deliverables:**

- [ ] [Deliverable 1]
- [ ] [Deliverable 2]

**Validation:** [How to verify completion]

### Phase 2: Core Features

**Goal:** [What this phase achieves]
**Deliverables:**

- [ ] [Deliverable 1]
- [ ] [Deliverable 2]

**Validation:** [How to verify completion]

### Phase 3: Polish & Integration

**Goal:** [What this phase achieves]
**Deliverables:**

- [ ] [Deliverable 1]
- [ ] [Deliverable 2]

**Validation:** [How to verify completion]

## Dependencies & Risks

### Dependencies

| Dependency     | Type              | Owner         | Status          |
| -------------- | ----------------- | ------------- | --------------- |
| [Dependency 1] | External/Internal | [Team/Person] | [Ready/Blocked] |

### Risks & Mitigations

| Risk     | Impact       | Likelihood   | Mitigation       |
| -------- | ------------ | ------------ | ---------------- |
| [Risk 1] | High/Med/Low | High/Med/Low | [How to address] |
| [Risk 2] | High/Med/Low | High/Med/Low | [How to address] |

## Future Considerations

[Post-MVP enhancements and integration opportunities]

- [ ] [Future feature 1]
- [ ] [Future feature 2]
- [ ] [Integration opportunity]

## Open Questions

> **Important:** These questions were identified during PRD generation and should be answered before implementation begins. Review and answer each question, then update the relevant sections of this PRD.

### Problem & Context

- [ ] [Question about the specific problem or pain point]
- [ ] [Question about current workarounds]
- [ ] [Question about what triggered this need]

### Users & Scope

- [ ] [Question about primary users]
- [ ] [Question about user segments or frequency]

### Requirements

- [ ] [Question about success criteria]
- [ ] [Question about must-haves vs nice-to-haves]
- [ ] [Question about explicit exclusions]

### Technical

- [ ] [Question about integrations with existing features]
- [ ] [Question about performance or scale considerations]

### UX & Design

- [ ] [Question about UI placement]
- [ ] [Question about reference implementations or patterns]
- [ ] [Question about design input needs before engineering]
- [ ] [Question about existing mockups or Figma designs]

---

**Questions Answered:** [ ] / [total]  
**Ready for Implementation:** ❌ (Answer open questions first)

## Acceptance Criteria

[Must be testable - refine after answering Open Questions]

### Functional Criteria

- [ ] [Criterion 1 - specific, measurable]
- [ ] [Criterion 2 - specific, measurable]
- [ ] [Criterion 3 - specific, measurable]

### Quality Criteria

- [ ] No TypeScript errors (`yarn typecheck` passes)
- [ ] No ESLint errors (`yarn eslint . --quiet` passes)
- [ ] Module boundaries respected (no cross-module imports)
- [ ] Layer restrictions followed (mongoose only in infrastructure)
- [ ] No `_id` usage outside infrastructure (use `getIdValue()`)
- [ ] No dynamic imports (`await import()` prohibited)
- [ ] Follows project conventions and patterns
- [ ] API routes use HOFs (withAuth, withDB, withValidation)

### UX Criteria

- [ ] [UX requirement 1]
- [ ] [UX requirement 2]

---

_Generated via Batch PRD on [date] | Task [N] of [total]_
````

### 4. Save PRD File

**AI Task:** Save the PRD:

1. Generate a slug from the task description (kebab-case, max 50 chars)
2. Create file at `docs/prds/batch-[date]-[task-slug].md`
3. Ensure `docs/prds/` directory exists (create if needed)

**Example:** Task "Add user notifications" → `docs/prds/batch-2026-01-29-add-user-notifications.md`

### 5. Output Task Completion

**AI Task:** After saving the PRD, output:

```
## PRD Created ✓ (Task [N] of [total])

**File:** `docs/prds/batch-[date]-[task-slug].md`
**Task:** [Task description]
**Depth:** [quick/standard/comprehensive]

**Key Requirements (P0):**
- [Top 3 must-have requirements]

**Open Questions:** [count] items need answering before implementation

---

⚠️ **CLEAR CONTEXT NOW** before proceeding to the next task.

**Next:** Task [N+1]: "[Next task description]"

Say "continue" after clearing context to generate the next PRD.
```

### 6. Handle Remaining Tasks

**AI Task:** After context is cleared and user says "continue":

1. **Acknowledge fresh context:**

   ```
   Starting fresh with Task [N+1] of [total]:
   "[Task description]"
   ```

2. **Repeat Steps 2-5** for the next task

3. **Continue until all tasks are complete**

### 7. Final Summary (After All Tasks)

**AI Task:** When all PRDs are generated, output:

```
## Batch PRD Generation Complete ✓

**Total PRDs Created:** [count]
**Depth:** [quick/standard/comprehensive]

| # | Task | File | Open Questions |
|---|------|------|----------------|
| 1 | [Task 1] | `docs/prds/[file1].md` | [count] |
| 2 | [Task 2] | `docs/prds/[file2].md` | [count] |
| 3 | [Task 3] | `docs/prds/[file3].md` | [count] |

**Next Steps:**
1. Review each PRD for accuracy
2. Answer Open Questions in each document
3. Mark "Ready for Implementation: ✅" when questions are answered
4. Prioritize implementation order

**Tip:** Use the standard `prd` command with a ClickUp ticket ID if you want conversational discovery for any specific feature.
```

Done.

## Question Generation Guidelines

When generating Open Questions for each PRD, follow these rules:

### Question Categories

**Problem & Context (always include 1-2):**

- "What specific problem or pain point does this solve?"
- "What's the current workaround users have to do today?"
- "What triggered the need for this feature now?"

**Users & Scope (always include 1-2):**

- "Who are the primary users of this feature?"
- "Is this for all users or a specific segment?"
- "What's the expected usage frequency?"

**Requirements (include based on gaps):**

- "What does success look like for this feature?"
- "Are there any must-have requirements vs nice-to-haves?"
- "Are there any explicit things this should NOT do?"

**Technical (include if technical ambiguity):**

- "Does this need to integrate with any existing features?"
- "Are there any performance or scale considerations?"

**UX & Design (include for user-facing features):**

- "Do you have any preferences for where this lives in the UI?"
- "Are there similar features in other products we should reference?"
- "Does this feature need design input before engineering starts?"
- "Are there existing Figma designs or mockups for this?"

### Question Selection Rules

- **Minimum 3 questions, maximum 8** per PRD
- **Always include** at least 1 Problem & Context + 1 Users & Scope question
- **For vague tasks:** More Problem & Context questions
- **For technical tasks:** More Technical questions
- **For UI features:** More UX & Design questions
- **Never ask questions** that can be answered from codebase analysis
- **Be specific** - tailor questions to the actual task

## Example Usage

**Input:**

```
{{tasks}}: ["Add email notifications for campaign updates", "Implement partner search filters", "Create analytics dashboard for vendors"]
{{depth}}: standard
```

**Output:** Three separate PRDs in `docs/prds/`:

1. `batch-2026-01-29-add-email-notifications-for-campaign-updates.md`
2. `batch-2026-01-29-implement-partner-search-filters.md`
3. `batch-2026-01-29-create-analytics-dashboard-for-vendors.md`

Each PRD contains Open Questions specific to that feature, ready for review.
