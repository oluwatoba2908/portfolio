---
name: investigate
description: Pre-implementation feasibility research - explores codebase and web to assess technical viability
argument-hint: "[technical idea or feature concept]"

---

# Investigation Command

Explore feasibility and options for a technical idea through systematic research **without automatically proceeding to implementation**.

**Input:** $ARGUMENTS — The technical idea, feature concept, or problem to investigate

---

## Core Purpose

Investigation is about **understanding before committing**. This command:
- Explores what's already in the codebase
- Researches external solutions and best practices
- Assesses technical feasibility and architectural fit
- Provides honest recommendations
- **Stops at findings** rather than automatically generating tasks or requirements

---

## Key Distinction

| Command | When to Use | Output |
|---------|------------|--------|
| `/investigate` | "I'm curious if X is possible" | Findings + recommendations |
| `/feature` | "I want to build X" (requirements clear) | Tasks or implementation |
| `/prd` | "I need X" (complex, needs full requirements) | PRD document |

**Investigation ≠ Implementation Planning**

Investigation answers: "What would this look like? Should we do it?"
Implementation planning answers: "How do we build it? What are the steps?"

---

## Five-Phase Process

### Phase 0: Project Context Scan (MANDATORY FIRST STEP)

**Before asking ANY clarifying questions**, scan the project memory files to understand context.

Use Task tool with `subagent_type=general-purpose` and `model="haiku"`:

```
Scan project memory files and return ONLY the structured context below. Do NOT answer the investigation question yet.

Read these files:
1. `.ai/BUSINESS.json` — Product, users, features, metrics
2. `.ai/QUICK.md` — File locations, commands, debugging
3. `.ai/ARCHITECTURE.json` — Patterns, component relationships
4. `.ai/PATTERNS.md` — Implementation templates

Return this EXACT format (max 300 words):

**Product Context:**
- What: [product description]
- Users: [target users]
- Key Features: [3-5 main features]

**Tech Stack:**
- [Languages, frameworks, tools]

**Architectural Patterns:**
- [Key patterns in use]

**Performance Targets:**
- [Any metrics or constraints]

**File Structure:**
- [Key directories and their purposes]

STOP HERE. Do not investigate the question yet.
```

**After the agent returns context:**
1. Review the context to understand what the project already has
2. Use this context to inform Phase 1 clarification questions
3. Avoid asking questions that memory files already answer

**Why Phase 0 matters:**
- Prevents asking "What tech stack do you use?" when ARCHITECTURE.json says it
- Prevents asking "Where are your API routes?" when QUICK.md documents it
- Focuses clarification on gaps NOT covered by memory

---

### Phase 1: Scope Clarification

**Only ask questions if critical context is missing.**

Now that you have project context from Phase 0, ask 1-2 **specific** questions (not generic ones):

**Good questions (informed by project context):**
- "Should this integrate with [existing feature from BUSINESS.json]?"
- "Any performance constraints beyond [target from BUSINESS.json]?"
- "Would this replace [similar feature you discovered in Phase 0]?"

**Bad questions (Phase 0 should have answered these):**
- "What tech stack are you using?" → ARCHITECTURE.json has this
- "Where is your codebase structured?" → QUICK.md has this
- "What features does your app have?" → BUSINESS.json has this

**Stopping Criteria:** Stop when you have enough context to:
1. Understand what they want to explore
2. Know which part of the system it relates to
3. Assess whether similar solutions exist

If Phase 0 gave you enough context, **skip clarification entirely** and proceed to Phase 2.

---

### Phase 2: Codebase & Memory Analysis

Delegate deep codebase exploration to an Explore agent for context efficiency.

Use Task tool with `subagent_type=Explore`:

```
Investigate technical feasibility for: [INVESTIGATION_TOPIC]

THOROUGHNESS: very thorough

## Investigation Goals
1. **Find Similar Features:** Search for existing functionality that does something similar
2. **Map Integration Points:** Which components/services would be involved?
3. **Identify Constraints:** Performance targets, architectural constraints, security requirements
4. **Assess Patterns:** What patterns exist that could be leveraged or extended?
5. **Find Red Flags:** Technical blockers, architectural mismatches, breaking changes required

## Return Format (max 600 words)
**Similar Existing Functionality:**
- Feature: [name]
- Location: [file:line]
- How it works: [brief description]
- Reusability: [Can we extend this? Copy the pattern?]

**Integration Analysis:**
- Components involved: [list with file references]
- Data flow: [how data would move through the system]
- State management: [where state lives, how it's updated]

**Architectural Fit:**
- Fits existing patterns: [Yes/No — which patterns?]
- Breaking changes required: [Yes/No — what breaks?]
- New patterns needed: [Yes/No — describe]

**Constraints & Red Flags:**
- Performance: [impact on metrics from BUSINESS.json]
- Security: [auth, data access, multi-tenancy concerns]
- Dependencies: [new packages needed? Breaking changes?]
- Technical debt: [does this increase or decrease debt?]

**Feasibility Assessment:**
- Technical Feasibility: [High/Medium/Low]
- Architectural Fit: [Good/Moderate/Poor]
- Effort Estimate: [Small/Medium/Large — hours/days]
- Risk Level: [Low/Medium/High]
```

**After Explore returns:**
Store findings as `CODEBASE_CONTEXT` for use in synthesis.

---

### Phase 3: Web Research

Delegate external research to a research agent for parallel investigation.

Use Task tool with `subagent_type=research-agent`:

```
Research best practices and existing solutions for: [INVESTIGATION_TOPIC]

## Research Goals
1. **Find Real-World Examples:** How do other projects solve this?
2. **Identify Libraries/Frameworks:** What tools exist for this problem?
3. **Discover Patterns:** What are the common approaches?
4. **Surface Gotchas:** What are the known pitfalls or anti-patterns?

## Search Strategy
- Look for: "[TOPIC] best practices [CURRENT_YEAR]"
- Look for: "[TOPIC] implementation examples [TECH_STACK]"
- Look for: "how to [GOAL] in [FRAMEWORK]"
- Look for library documentation for candidate solutions

## Return Format (max 600 words)
**Common Approaches:**
1. [Approach Name]
   - How it works: [description]
   - Pros: [benefits]
   - Cons: [drawbacks]
   - Examples: [links to examples]

**Candidate Libraries:**
1. [Library Name] ([npm/github link])
   - Purpose: [what it does]
   - Adoption: [github stars, npm downloads]
   - Fit: [Good/Moderate/Poor fit for our use case]
   - Trade-offs: [bundle size, learning curve, maintenance]

**Known Gotchas:**
- [Gotcha 1]: [description and how to avoid]
- [Gotcha 2]: [description and how to avoid]

**Best Practices:**
- [Practice 1]
- [Practice 2]
```

---

### Phase 3b: Library Documentation (Optional)

If Phase 3 identified 2-3 candidate libraries, optionally query their current documentation using Context7.

**Only do this if:**
1. Phase 3 identified specific libraries worth considering
2. You need to verify API compatibility or feature coverage
3. The library docs are available via Context7

```
Query Context7 for [LIBRARY_NAME] documentation:
- Does it support [SPECIFIC_FEATURE]?
- What's the API for [SPECIFIC_USE_CASE]?
- Any compatibility issues with [TECH_STACK]?
- What's the bundle size impact?
```

---

### Phase 4: Synthesis & Feasibility Assessment

Combine all findings into a coherent assessment.

```markdown
# Investigation Report: [TOPIC]

**Generated:** [timestamp]

---

## Summary

[2-3 sentences: What we investigated, what we found, high-level recommendation]

---

## Feasibility Assessment

| Dimension | Rating | Reasoning |
|-----------|--------|-----------|
| **Technical Feasibility** | High/Medium/Low | [Why this rating?] |
| **Architectural Fit** | Good/Moderate/Poor | [How well does it align?] |
| **Effort Estimate** | Small/Medium/Large | [Hours or days estimate] |
| **Risk Level** | Low/Medium/High | [What could go wrong?] |

---

## Codebase Analysis

**Similar Existing Functionality:**
- [Feature]: [file:line] — [How it works, reusability potential]

**Integration Points:**
- Components: [list with file references]
- Data Flow: [how data moves through the system]
- State Management: [where state lives]

**Architectural Fit:**
- ✅ Fits existing patterns: [which patterns?]
- ⚠️ Breaking changes required: [what breaks?]
- 🆕 New patterns needed: [describe]

---

## External Research

**Common Approaches:**

### Option 1: [Approach Name]
- **How it works:** [description]
- **Pros:** [benefits]
- **Cons:** [drawbacks]
- **Examples:** [links]

### Option 2: [Approach Name]
- **How it works:** [description]
- **Pros:** [benefits]
- **Cons:** [drawbacks]
- **Examples:** [links]

**Candidate Libraries:**

1. **[Library Name]** ([link])
   - Purpose: [what it does]
   - Adoption: [stars/downloads]
   - Bundle Size: [size impact]
   - Fit: Good/Moderate/Poor
   - Trade-offs: [learning curve, maintenance, etc.]

**Known Gotchas:**
- [Gotcha 1 and how to avoid]
- [Gotcha 2 and how to avoid]

---

## Constraints & Red Flags

**Performance:**
- [Impact on metrics from BUSINESS.json]

**Security:**
- [Auth, data access, multi-tenancy concerns]

**Dependencies:**
- New packages: [list with sizes]
- Breaking changes: [Yes/No — what breaks?]

**Technical Debt:**
- [Does this increase or decrease debt?]

---

## Recommendation

**Overall:** [Proceed / Proceed with Caution / Do Not Proceed]

**Rationale:**
[2-3 sentences explaining the recommendation based on feasibility, fit, effort, and risk]

**If Proceeding:**
- Recommended approach: [which option?]
- Suggested first step: [what to do next]
- Key decisions needed: [what user needs to decide]

**If Not Proceeding:**
- Why not: [honest assessment]
- Alternative ideas: [if any]

---

## Next Steps

**If you want to proceed:**
1. [First concrete action]
2. [Second concrete action]

**If you want more detail:**
- Run `/feature [topic]` to get implementation tasks (if feasible + good fit)
- Run `/prd [topic]` to generate full PRD (if complex or needs stakeholder buy-in)

```

---

### Phase 5: Offer to Save Report (Optional)

After presenting the report:

```
Would you like me to save this investigation report?

If yes, I'll save to: `/tasks/investigations/[date]-[topic].md`

This preserves the findings for future reference and decision-making.
```

---

## Feasibility Rating Guide

### Technical Feasibility

| Rating | Criteria |
|--------|----------|
| **High** | Tech stack supports it, no major unknowns, clear implementation path |
| **Medium** | Doable but requires learning new patterns, some unknowns, moderate complexity |
| **Low** | Major technical barriers, fundamental incompatibilities, or requires significant rework |

### Architectural Fit

| Rating | Criteria |
|--------|----------|
| **Good** | Aligns with existing patterns, minimal breaking changes, natural extension |
| **Moderate** | Some pattern mismatches, requires new patterns but not breaking, moderate integration work |
| **Poor** | Conflicts with architecture, requires major refactoring, breaks existing assumptions |

### Effort Estimate

| Rating | Hours | Criteria |
|--------|-------|----------|
| **Small** | <8 hours | Single component, straightforward implementation |
| **Medium** | 8-40 hours | Multiple components, moderate complexity |
| **Large** | >40 hours | System-wide changes, novel architecture, high complexity |

### Risk Level

| Rating | Criteria |
|--------|----------|
| **Low** | Low impact on existing features, easy to rollback, well-understood approach |
| **Medium** | Moderate impact, some unknowns, established but not trivial approach |
| **High** | High impact on core features, many unknowns, novel approach, hard to rollback |

---

## Honest Assessment Principles

**Be direct:**
- If something is a bad idea, say so: "This would require a major overhaul of [X] with minimal benefit."
- If there are better alternatives: "Instead of [X], consider [Y] because [Z]."
- If the effort isn't worth it: "This is feasible, but given [constraints], probably not worth the effort."

**Avoid sugarcoating:**
- Don't artificially inflate feasibility to please the user
- Don't hide risks or unknowns
- Don't oversimplify complexity

**Recommend proceeding when:**
- Technical feasibility is Medium or higher
- Architectural fit is Good or Moderate
- Benefits justify the effort and risk

**Recommend NOT proceeding when:**
- Technical feasibility is Low
- Architectural fit is Poor
- Better alternatives exist
- Effort/risk outweighs benefits

---

## Critical Anti-Patterns

**DON'T:**
- ❌ Skip Phase 0 context scan
- ❌ Ask basic questions that memory files already answer
- ❌ Automatically generate tasks after investigation (investigation stops at findings)
- ❌ Oversimplify the feasibility assessment
- ❌ Hide risks or unknowns to make findings look better
- ❌ Proceed directly to implementation (that's `/feature` or `/prd`)

**DO:**
- ✅ Scan memory files BEFORE asking clarifying questions
- ✅ Ask specific questions informed by project context
- ✅ Delegate exploration to specialized agents (Explore, research-agent)
- ✅ Provide honest, direct assessments
- ✅ Offer to save the report for future reference
- ✅ Recommend next steps (feature, prd, or alternative ideas)

---

## Example Investigation Flow

**User:** `/investigate "Add real-time collaboration editing"`

**Your Process:**

1. **Phase 0:** Scan `.ai/` files (using haiku agent)
   - Product: Airstride SaaS, team collaboration features
   - Stack: Next.js, React, MongoDB, PropelAuth
   - Patterns: Service pattern, event-driven, Inngest for async
   - No existing WebSocket infrastructure

2. **Phase 1:** Clarify (1 question)
   - "Should this support concurrent editing conflicts or last-write-wins?"

3. **Phase 2:** Codebase analysis (Explore agent)
   - No similar features (no WebSocket, no real-time sync)
   - Integration: Would need WebSocket server, state sync service, conflict resolution
   - Architectural fit: Moderate (new pattern, but aligns with event-driven approach)
   - Complexity: High (7-8/10)

4. **Phase 3:** Web research (research-agent)
   - Common approaches: OT (Operational Transform), CRDT (Conflict-Free Replicated Data Types)
   - Libraries: Yjs (CRDT), ShareDB (OT), Socket.io (WebSocket)
   - Gotchas: State sync complexity, network latency, scaling WebSocket connections

5. **Phase 4:** Synthesis
   - **Feasibility:** Medium (doable but complex)
   - **Fit:** Moderate (new pattern but not breaking)
   - **Effort:** Large (40+ hours)
   - **Risk:** High (new infrastructure, scaling unknowns)
   - **Recommendation:** Proceed with caution — start with a spike/prototype

6. **Phase 5:** Offer to save report → User confirms → Save to `/tasks/investigations/2026-02-15-realtime-collaboration.md`

**Result:** User has comprehensive findings to decide whether to proceed, and if so, whether to start with `/prd` (given complexity) or `/feature` (for a simpler version).

---

**Remember:** Investigation explores options and assesses feasibility. It does NOT automatically proceed to implementation. Stop at findings and recommendations, then let the user decide next steps.
