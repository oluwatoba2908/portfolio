# Authority Routing

Where to find the truth for each concern. When sources conflict, higher-numbered tiers override lower.

## Document Priority (highest → lowest)

| Tier | Source | Scope |
|------|--------|-------|
| 1 | `CLAUDE.md` + `AGENTS.md` | Critical rules, architecture boundaries, naming |
| 2 | `.claude/rules/*.md` | Path-triggered conventions (auto-loaded per file type) |
| 3 | `docs/MODULE_ARCHITECTURE_STANDARD.md` | Module structure, layer responsibilities |
| 4 | `docs/REPOSITORY_PATTERN.md`, `docs/ATOMICITY_STANDARD.md` | Data access, concurrency |
| 5 | `docs/engineering/conventions-*.md` | Deep reference per topic |

## Where to Find Patterns

| Building... | Read these references first |
|-------------|----------------------------|
| Module (new) | `modules/companies/` or `modules/tasks/` — full layered examples |
| Zod schema | `modules/companies/domain/` or `modules/tasks/domain/` |
| Repository | `modules/companies/infrastructure/` |
| Service | `modules/companies/application/` or `modules/tasks/application/` |
| API route | `modules/companies/api/` + `docs/engineering/conventions-api.md` |
| Inngest handler | `modules/tasks/inngest/` |
| React component | `modules/agents/components/` or `modules/tasks/components/` |
| Integration | `modules/integrations/` |
| AI agent | `modules/agents/` + `.claude/rules/domain-ai-agents.md` |
| Caching | `.claude/rules/caching.md` + `docs/engineering/conventions-caching.md` |
| Embeddings | `.claude/rules/vector-embeddings.md` + `docs/engineering/conventions-vector-embeddings.md` |

## Auto-Loaded Rules (by file path)

These load automatically when editing matching files — no manual reads needed:

| Glob | Rule file | Covers |
|------|-----------|--------|
| `**/*.tsx` | `components.md` | React 19.2, Mantine v8, cross-device |
| `app/api/**` | `api-routes.md` | HOFs, auth, validation |
| `modules/**` | `modules.md` | Module architecture |
| `**/infrastructure/**` | `domain-infrastructure.md`, `repositories.md` | Mongoose, repos |
| `**/application/**` | `services.md` | Services, events |
| `**/domain/**` | `domain-schemas.md` | Zod v4, types |
| `**/inngest/**` | `domain-events.md` | Idempotency, events |
| `**/agents/**` | `domain-ai-agents.md` | AI SDK, BaseAgent |

## Key Architectural Rules (Quick Reference)

- No Mongoose outside `infrastructure/`
- No `_id` outside repositories — use `getIdValue()`
- Zod v4 only — never v3, never `nativeEnum`
- Atomic operations — never read-then-write
- Events from services only — never API routes
- Client imports: `@/modules/[name]/client`
- Server imports: `@/modules/[name]` or `@/modules/[name]/server`
- Singleton services — `import { service } from "@/modules/[name]"`
