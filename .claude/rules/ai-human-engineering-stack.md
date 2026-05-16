---
paths:
  - "**/agents/**/*.md"
  - "**/agents/**/*.ts"
  - "**/*agent*.ts"
  - "**/*agent*.md"
  - "**/pipelines/**/*.ts"
  - "**/agent-orchestration/**/*.ts"
  - ".claude/agents/**/*.md"
---

# AI-Human Engineering Stack — Mandatory Design Checklist

Reference: `.claude/assets/ai-human-engineering-stack.jpeg`

Before building or modifying any agent, evaluate all six layers of the AI-Human Engineering Stack (Sanchez & Mill, 2026). Each layer depends on all layers beneath it. An agent missing a layer will produce brittle, unreliable output.

---

## The Six Layers (Bottom to Top)

### 1. Prompt Engineering — "What to do"

The base instruction set. What does the agent do when invoked?

- Clear task definition with positive directives
- Structured output schemas (Zod)
- Tool definitions and usage patterns
- Few-shot examples where appropriate (behind tools, not inlined — see deck-agent-prompt-v2 rule)

### 2. Context Engineering — "What to know while doing"

What information does the agent need access to while executing?

- What data is injected into the prompt (brand config, deck state, prior outputs)?
- What tools provide on-demand context (RAG, document retrieval, pattern libraries)?
- What is the agent's context window budget and how is it managed?
- Is context fresh, or could it be stale? How is staleness handled?

### 3. Intent Engineering — "What to want while doing"

What is the agent optimizing for? What does "good" look like?

- Define the success criteria explicitly (not just "make a good slide")
- Quality rubrics and self-check checklists
- Priority ordering when goals conflict (e.g., brand compliance vs. visual impact)
- Skill routing — which capabilities activate for which intents?

### 4. Judgment Engineering — "What to doubt while doing"

Where should the agent be uncertain, and how should it handle uncertainty?

- Escalation rules — when does the agent ask for human input vs. proceed autonomously?
- Confidence thresholds for autonomous action vs. checkpointing
- Error recovery — what does the agent do when a tool call fails or output is malformed?
- Interrogation points — where does a utility agent review output quality?

### 5. Coherence Engineering — "What to become while doing"

How does the agent maintain consistent identity and behavior across turns?

- Agent identity and persona (company-first, not platform-first)
- Behavioral consistency across long conversations
- Memory and state management between invocations
- How does the agent avoid drift from its design intent over many turns?

### 6. Evaluation Engineering — "How to know while doing" (The Loop)

How do we measure whether the agent is working? Each layer is evaluated in a loop, autonomously.

- What evals exist for this agent? (Braintrust experiments, unit tests on pure prompt builders)
- How do we detect regression? (Test names as architectural invariants)
- What metrics indicate the agent is performing well or poorly?
- How does eval feedback flow back into prompt/context/intent improvements?

---

## Harness Engineering — "Where and how to do"

The infrastructure that sets up and runs the agent. The user configures this initially and adjusts as needed.

- Orchestrator wiring (pipeline config, execution plan, failure policy)
- Model selection and fallback strategy
- Rate limiting, timeout, and retry configuration
- Deployment and monitoring (Inngest functions, Vercel runtime)

---

## How to Apply This

When creating a new agent or significantly modifying an existing one:

1. **Document each layer** in the agent's design (PRD, ADD, or inline comments)
2. **Identify gaps** — a missing layer is a conscious decision, not an oversight. If a layer is intentionally skipped, note why.
3. **Build bottom-up** — Prompt and Context first, then Intent and Judgment, then Coherence and Eval
4. **Eval closes the loop** — every agent should have at least one eval that validates its output quality

This checklist is a design tool, not a bureaucratic gate. A simple single-turn agent may intentionally skip Coherence. A complex multi-step pipeline needs all six. The point is to make the decision consciously.
