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
  layout.tsx           server component; document shell only (fonts + metadata)
  page.tsx             homepage — renders content/site/Homepage.dc.html
  about-toba/          /about-toba
  contact/             /contact
  playground/          /playground
  projects/[slug]/     case studies, one route per case study
  dc/[component]/      serves the Nav/Footer/PreFooterCTA partials to the runtime
  design-system/       live token + primitive gallery — visit /design-system
  globals.css          @import "tailwindcss" + tokens
components/
  dc/DcPage.tsx        renders a prepared design-canvas document inside a route
  ui/                  primitives: Button, Link, Card, Tag, Section, Container, Eyebrow
  patterns/            composed pieces (Nav, Footer, Hero, ProjectCard, ...)
content/site/          design-canvas documents (.dc.html) — the live site pages
lib/dc/                loads those documents and rewrites their links + asset URLs
public/site/           their runtime (support.js), page scripts and image assets
styles/
  tokens.css           canonical design tokens (@theme block for Tailwind v4)
docs/webflow/          content bible captured from the live Webflow site
```

## How the site pages are served

The live pages are design-canvas documents. They live in `content/site/` —
outside `public/`, so they are only reachable through a Next.js route and no
`.html` URL is ever exposed. `lib/dc/document.ts` strips the document shell,
rewrites links between documents to their route (`about.dc.html` →
`/about-toba`), and absolutises asset URLs to `/site/…`.

Re-exporting a document from the canvas means dropping the `.dc.html` file back
into `content/site/` — no other change is needed. A new page needs a route in
`app/` and an entry in `lib/dc/routes.ts`.

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
