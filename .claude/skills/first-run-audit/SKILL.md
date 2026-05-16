---
name: first-run-audit
description: Simulate a first-time user experience — identify friction, confusion, and competitive gaps against Gamma/Beautiful.ai
argument-hint: "[persona: 'startup-founder' | 'sales-rep' | 'marketer' | 'board-reporter' | 'general'] or empty for all personas"

---

# First-Run Audit: New User Experience Simulator

Simulate a first-time user arriving at Dev Decks. Walk through every touchpoint they'd encounter — from landing page to first completed deck — and evaluate the experience through the lens of someone who has never seen the product before.

**Input:** $ARGUMENTS — Optional persona to simulate. If empty, runs the general persona first, then offers to run additional personas.

**Goal:** Identify what's unclear, what's missing, what's friction, and whether someone would actually switch from Gamma/Beautiful.ai to use Dev Decks.

---

## Personas

| Persona | Context | Key Questions |
|---------|---------|---------------|
| `general` | Someone who googled "AI presentation maker" | Is it obvious what this does? Can I make a deck in <2 min? |
| `startup-founder` | Needs a pitch deck for investors, time-poor | Can I get a fundable-looking deck fast? Is it better than Gamma? |
| `sales-rep` | Needs prospect-specific decks at scale | Can I personalize decks per prospect? Is the workflow faster than slides? |
| `marketer` | Needs branded, polished content decks | Does it respect my brand? Are the designs good enough to ship? |
| `board-reporter` | Needs data-driven board updates quarterly | Can I pull in metrics? Does it look executive-grade? |

---

## Phase 1: Landing Page First Impressions (30 seconds)

**Simulate:** User lands on `/` for the first time. They have 30 seconds of attention.

Use Agent tool with `subagent_type="Explore"`:

```
Read the homepage implementation thoroughly:
1. Read `app/(marketing)/page.tsx` or `app/page.tsx` — the root landing page
2. Read ALL components referenced by the homepage (Hero, Features, HowItWorks, UseCases, CTA, etc.)
3. Read any marketing copy, headlines, subheadlines
4. Check the navigation/header component for menu items
5. Check the footer for links

For each element, note:
- What text does the user actually see?
- What is the primary CTA? Is it clear?
- Is the value proposition obvious within 5 seconds?
- What questions would a new user have after reading this?
```

**Evaluate against the 5-Second Test:**

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| **What does this product do?** | | Can you explain it in one sentence from the homepage alone? |
| **Who is it for?** | | Is the target audience clear? |
| **Why should I care?** | | Is there a compelling reason to try it vs. what I already use? |
| **What do I do next?** | | Is the primary CTA obvious and compelling? |
| **Social proof** | | Are there testimonials, logos, numbers, or gallery examples? |

---

## Phase 2: Try-Before-Signup Flow

**Simulate:** User clicks the primary CTA or navigates to `/try`.

Use Agent tool with `subagent_type="Explore"`:

```
Read the guest/try flow:
1. Read `app/try/page.tsx` and all components it renders
2. Read the guest session initialization logic (`guest-sessions` API/service)
3. Read the "new deck" creation flow — what happens when a guest clicks "Create"?
4. Read any onboarding tooltips, empty states, or guided experiences
5. Check what features are available vs. gated for guests

Map the complete guest journey:
- Landing → /try → Create first deck → Edit → Share/Export
- At each step: what does the user see? What can they do? What's confusing?
```

**Evaluate:**

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| **Zero-friction start** | | Can I create a deck without signing up? |
| **Time to first wow** | | How many clicks/seconds until I see something impressive? |
| **Guided experience** | | Am I told what to do, or dropped into a blank canvas? |
| **Feature discovery** | | Can I find key features (AI generation, themes, sharing)? |
| **Upgrade motivation** | | Is there a clear reason to create an account? |

---

## Phase 3: Deck Creation & Editor Experience

**Simulate:** User creates their first deck (either as guest or after signup).

Use Agent tool with `subagent_type="Explore"`:

```
Read the deck workspace/editor:
1. Read `app/decks/[deck_id]/page.tsx` and its main content component
2. Read the slide editor components — how do users edit slides?
3. Read the AI generation flow — how does a user generate a deck from a prompt?
4. Read theme/styling options available to users
5. Read the slide panel/navigation component
6. Check for keyboard shortcuts, undo/redo, autosave indicators
7. Read any empty state or first-deck-specific UI

Focus on:
- What does a brand new deck look like? Is there placeholder content?
- How does AI generation work? What inputs are needed?
- How do you add/remove/reorder slides?
- How do you customize the design?
- What's the export/share flow?
```

**Evaluate:**

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| **Editor clarity** | | Is it obvious how to edit content? |
| **AI generation UX** | | Is the AI prompt flow intuitive? Are results good? |
| **Design quality** | | Do generated decks look professional out of the box? |
| **Customization** | | Can I tweak things without breaking the design? |
| **Progress feedback** | | Do I know when things are loading/saving/generating? |
| **Error recovery** | | What happens when AI generation fails or is slow? |

---

## Phase 4: Signup & Onboarding

**Simulate:** User decides to sign up after trying the product.

Use Agent tool with `subagent_type="Explore"`:

```
Read the auth and onboarding flow:
1. Read `app/(auth)/signup/page.tsx` and its components
2. Read `app/(auth)/login/page.tsx`
3. Read `app/(auth)/create-org/page.tsx`
4. Read what happens AFTER signup — where do they land?
5. Check for any onboarding wizard, welcome modal, or getting-started flow
6. Read the main `/decks` dashboard page — what does a new user with 0 decks see?
7. Check for any email verification, welcome email triggers
8. Look for any "import from Gamma/PowerPoint" features
```

**Evaluate:**

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| **Signup friction** | | How many fields/steps to create an account? |
| **Post-signup clarity** | | Do I know what to do after signing up? |
| **Empty state** | | What does the dashboard look like with 0 decks? |
| **Onboarding guidance** | | Is there a walkthrough or getting-started checklist? |
| **Import path** | | Can I bring existing decks from other tools? |
| **Guest-to-auth continuity** | | Does my guest work carry over after signup? |

---

## Phase 5: Competitive Gap Analysis

**Do NOT use web search.** Instead, evaluate Dev Decks against what users EXPECT from leading tools based on common knowledge:

### Gamma Comparison

| Feature | Gamma (Expected) | Dev Decks (Actual) | Gap? |
|---------|-------------------|-------------------|------|
| AI deck generation from prompt | Yes | ? | |
| Real-time collaboration | Yes | ? | |
| Branded templates | Yes | ? | |
| Export to PDF/PPTX | Yes | ? | |
| Custom domains for sharing | Yes | ? | |
| Analytics on shared decks | Yes | ? | |
| Mobile-responsive viewer | Yes | ? | |
| Free tier generosity | Very generous | ? | |
| Import from PPT/Google Slides | Yes | ? | |
| Presentation mode | Yes | ? | |

### What Would Make Someone Switch?

Based on the codebase analysis, identify Dev Decks' **unique differentiators**:
- What does Dev Decks do that Gamma doesn't?
- Is the JSX custom slides feature visible and compelling to new users?
- Are there features that are built but not surfaced well?

---

## Phase 6: Friction Log & Recommendations

Compile all findings into a structured report.

### Friction Log Format

For each friction point found:

```markdown
### [F-XX] [Short description]
- **Phase:** [1-5]
- **Severity:** P0 (blocker) | P1 (significant) | P2 (annoyance) | P3 (nice-to-have)
- **User impact:** [What the user experiences]
- **Expected:** [What they expected to happen]
- **Actual:** [What actually happens]
- **Recommendation:** [Specific fix]
- **Competitive pressure:** [Does Gamma/etc. handle this better?]
```

### Report Structure

Save the report to `.ai/audits/first-run-audit-{persona}-{date}.md`:

```markdown
# First-Run Audit: {Persona} — {Date}

## Executive Summary
- **Overall Score:** X/50 (sum of all phase scores)
- **Would a {persona} switch from Gamma?** Yes/No/Maybe — [why]
- **Time to first wow:** [estimated clicks/seconds]
- **Top 3 wins:** [things that already work well]
- **Top 3 blockers:** [things that would stop adoption]

## Phase Scores
| Phase | Score | Key Issue |
|-------|-------|-----------|
| Landing Page | /25 | |
| Try Flow | /25 | |
| Editor | /30 | |
| Onboarding | /30 | |
| Competitive | N/A | |

## Detailed Friction Log
[All F-XX items, sorted by severity]

## Competitive Position
[Gap analysis summary]

## Recommended Actions
### Quick Wins (< 1 day each)
1. ...

### Medium Effort (1-3 days)
1. ...

### Strategic (requires planning)
1. ...

## What's Actually Great
[Don't forget to highlight what works — these are the foundation to build on]
```

---

## Phase 7: Present & Next Steps

Present the report summary to the user and offer:

1. **Run another persona** — Simulate a different user type
2. **Deep-dive a specific phase** — Focus on one area (e.g., just the editor UX)
3. **Generate a PRD** — Turn top recommendations into a PRD via `/prd`
4. **Create tasks** — Turn quick wins into immediate tasks via `/feature`
5. **Compare live** — If the user has a Gamma account, do a side-by-side comparison

---

## Critical Rules

- **Be brutally honest** — Sugarcoating defeats the purpose. If the landing page is confusing, say so.
- **Think like a real user, not a developer** — Users don't read code. They see buttons, text, and outcomes.
- **Every criticism needs a recommendation** — Don't just identify problems, propose solutions.
- **Acknowledge what works** — The audit should also highlight strengths. Teams need morale.
- **Compare fairly** — Gamma has years of head start and $40M+ funding. Frame gaps realistically.
- **Focus on switchability** — The core question is: "Would I use this instead of what I already have?"
- **Read the actual UI text** — Don't infer from component names. Read the actual copy users see.
- **Check mobile responsiveness** — Look at responsive styles/breakpoints in components.

---

## Usage Examples

```
/first-run-audit                        # General persona (default)
/first-run-audit startup-founder        # Startup founder trying to make a pitch deck
/first-run-audit sales-rep              # Sales rep who needs personalized decks
/first-run-audit marketer               # Marketer who needs branded content decks
/first-run-audit board-reporter         # Executive who needs quarterly board decks
```

---

## When to Use

- **Before a launch or major release** — Sanity-check the new user experience
- **After significant UI changes** — Verify nothing broke in the user journey
- **When conversion is low** — Diagnose where users are dropping off
- **When planning the roadmap** — Understand competitive gaps to prioritize features
- **Monthly cadence** — Run regularly to catch UX drift as features are added
