# Airstride Project Instructions

⚠️ **CRITICAL**: Follow ALL instructions in `/AGENTS.md`

This is the Airstride web application. All technical guidelines, architecture patterns, validation rules, and coding conventions are documented in `/AGENTS.md`. Read and follow that file for detailed instructions.

## Quick Reference

- **Package Manager**: yarn
- **Dev Server**: `yarn dev`
- **Tech Stack**: Next.js 16, React 19, Mantine v8, MongoDB, PropelAuth, Inngest
- **Module Standard**: `/docs/MODULE_ARCHITECTURE_STANDARD.md`

## Agent Capabilities

**agentCanUpdateSnapshot**: `true`

The AI agent is allowed to update snapshot files during testing when necessary (Jest snapshots, visual regression snapshots, component snapshot tests).

## Architecture Map

At the start of every conversation, read these files to understand the project:
1. `.ai/architecture-map.yaml` — Project structure, modules, API routes, Inngest handlers
2. `.ai/type-index.yaml` — Type system overview, enums, interfaces, Zod schemas
3. `.ai/decisions.md` — Why things are built the way they are (manually curated)

On-demand (read when working on cross-module changes):
4. `.ai/dependency-graph.yaml` — Module dependency map, centrality analysis

Regenerate with: `yarn architecture-map`

## Internationalization (i18n)

All user-facing text must use the translation system (`messages/` locale files). Never hardcode static strings in components.

- **Supported locales**: `en`, `de`
- When adding or changing any user-facing text, update **all** locale files (`messages/en.json` and `messages/de.json`)
- Use `useTranslations()` in components to reference translation keys — never inline raw strings
- When modifying an existing translation key's value, update it in every locale file

## Git Workflow

**NEVER commit or push directly to `main`.** All changes must go through a feature branch and PR. Before any git operations:

1. Check current branch with `git branch --show-current`
2. If on `main`, create a new branch first (`git checkout -b <type>/<description>`)
3. Stage, commit, push, and create a PR — or use `/ship`

This applies to ALL changes, no matter how small. No exceptions.

## Production Quality Gate (CRITICAL)

⚠️ **Code merged to `main` deploys directly to production with NO manual QA gate.** Every implementation and every PR must be bullet-proof tested before being declared done. See [`.claude/rules/production-quality-gate.md`](.claude/rules/production-quality-gate.md) for the full pre-PR checklist:

- `yarn typecheck` and `yarn eslint . --quiet` must pass with zero errors
- Unit tests required for all new business logic (use fakes, not mocks)
- Edge cases (null/empty, concurrency, idempotency, webhook duplicates) explicitly handled
- Multi-tenant safety verified (`organization_id` scoping on every query)
- `reliability-auditor`, `security-auditor`, and `code-review` agents invoked before opening PR — every critical/high finding addressed
- PR description must include explicit Test Plan + Risk assessment

This applies to autonomous orchestration too: PL agent and refactor agent run all post-audits BEFORE opening the PR, never after.

## Additional Rules

See `.claude/rules/` for specific coding patterns.
