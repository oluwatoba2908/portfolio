# Portfolio

Rebuild of [tobadesigner.com](https://www.tobadesigner.com/) in Next.js.

## Stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS v4 (tokens live in `styles/tokens.css` as a `@theme` block)
- TypeScript
- Vitest + Testing Library for unit tests

## Getting started

```bash
yarn install
yarn dev              # http://localhost:3000
# then open http://localhost:3000/design-system for the token gallery
```

## Architecture rules

- Every `app/**/page.tsx` and `layout.tsx` is a **server component**. No `"use client"` at the page level.
- Interactive UI lives in dedicated `"use client"` components under `components/`.
- Every component is unit-testable — props in, JSX out. Data fetching happens in server component parents.

## Directory layout

```
app/
  layout.tsx           server component; loads Inter Tight via next/font
  page.tsx             homepage (placeholder for now)
  design-system/       live token + primitive gallery — visit /design-system
  globals.css          @import "tailwindcss" + tokens
components/
  ui/                  primitives: Button, Link, Card, Tag, Section, Container, Eyebrow
  patterns/            composed pieces (Nav, Footer, Hero, ProjectCard, ...) — coming next
styles/
  tokens.css           canonical design tokens (@theme block for Tailwind v4)
docs/webflow/          content bible captured from the live Webflow site
```

## Scripts

| Command | What it does |
|---|---|
| `yarn dev` | Start dev server |
| `yarn build` | Production build |
| `yarn start` | Serve production build |
| `yarn lint` | ESLint via next lint |
| `yarn typecheck` | tsc --noEmit |
| `yarn test` | Run unit tests once |
| `yarn test:watch` | Watch mode |

## Source of truth

- **Design tokens** — `styles/tokens.css` (`@theme` block)
- **Content** — `docs/webflow/` (verbatim captures from the live Webflow site)
- **Skill for migration** — `.claude/skills/webflow-to-code/SKILL.md`
