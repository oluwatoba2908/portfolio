---
name: webflow-to-code
description: Convert a live Webflow portfolio site to code. Captures the page HTML via browser, saves it under docs/webflow/, verifies completeness section-by-section, then implements as a Next.js 15 + Tailwind CSS v4 project using the portfolio design system. Use when the user says "webflow to code", "convert webflow", "migrate webflow", "rebuild my portfolio", or provides a Webflow URL (*.webflow.io or a custom domain hosting a Webflow site) to implement.
argument-hint: "<webflow-url> [optional: page-name-override]"
allowed-tools: Bash(agent-browser:*), Bash(yarn:*), Bash(npx:*), Bash(node:*), Read, Write, Edit, Glob, Grep, Agent
---

# Webflow-to-Code: Webflow URL to Next.js Implementation

Convert a live Webflow page (portfolio, case study, or any static Webflow page) into a fully implemented Next.js 15 + Tailwind CSS v4 route. The pipeline captures the page, verifies nothing is missed, and implements using the portfolio design system.

## Input

- `$ARGUMENTS` — One or two arguments:
  1. **Webflow URL** (required): The page to convert (e.g., `https://tobiomiyonwo.webflow.io/`, `https://tobiomiyonwo.webflow.io/projects/nova-bank`, `https://portfolio.tobi.dev/about`)
  2. **Page name override** (optional): Override the auto-derived filename/route (e.g., `about`)

## Architecture Context

Before starting, understand the target project:

- **Stack:** Next.js 15 (App Router) + React 19 + Tailwind CSS v4 + TypeScript
- **Design system location:** `styles/tokens.css` (CSS custom properties — colors, type scale, spacing, radii, shadows, motion)
- **Live design system route:** `app/design-system/page.tsx` — renders every token and primitive; use as visual reference for what's available
- **Primitives:** `components/ui/` — `Button`, `Link`, `Card`, `Tag`, `Input`, `Section` (import these instead of building bespoke)
- **Patterns:** `components/patterns/` — `Hero`, `ProjectCard`, `SectionHeader`, `Nav`, `Footer` (reuse across pages)
- **Reference files:** `docs/webflow/` — captured HTML from the source Webflow site
- **Voice guide:** `docs/DESIGN_SYSTEM.md` — tone and copy conventions (do not deviate)

### Webflow-specific facts to know

Webflow's exported/rendered DOM has predictable patterns you MUST recognise during capture and mapping:

- **Utility classes:** `.w-container`, `.w-row`, `.w-col`, `.w-nav`, `.w-nav-brand`, `.w-nav-menu`, `.w-nav-link`, `.w-button`, `.w-embed`, `.w-form`, `.w-inline-block`, `.w-richtext` — these are Webflow's layout primitives. Map them to semantic Tailwind equivalents, do not port the classes.
- **Custom classes:** Every element you built in the Designer gets a class like `hero-heading`, `project-card_image`, `nav_link`. These carry the styling intent — capture them with computed styles.
- **`data-w-id` attributes:** Identify elements that have IX2 interactions/animations attached. Note them for reimplementation with Motion / Framer Motion / CSS.
- **`data-w-tab` / `data-w-tab-content`:** Webflow's tab component — the inactive tab panels ARE in the DOM but hidden. Extract them all.
- **`data-collection` / `data-cms-item`:** CMS-driven content (projects, blog posts). Each item is a discrete node in the rendered DOM.
- **`.w-lazy` / `data-w-src`:** Lazy-loaded images. Scroll the page fully before extraction so `src` is populated.
- **Preloader / page-load animations:** Webflow often injects a preloader with `data-w-id`. Wait for it to complete (via `networkidle` + a small delay) before screenshotting.
- **Webflow badge:** The "Made in Webflow" badge in the corner — strip it, never carry it into the code implementation.
- **Global scripts:** `webflow.js`, jQuery, IX2 runtime — strip all of these from the saved HTML. They exist to power the live site, not to be studied.

## Pipeline Overview

```
Phase 1: Capture        → Browser visits URL, extracts full-page HTML, saves to docs/webflow/
Phase 2: Inventory      → Parse HTML into section manifest (ordered list of every section/component)
Phase 3: Plan           → Map every section to design-system primitives and patterns
Phase 4: Implement      → Convert HTML sections to Next.js + Tailwind components using tokens.css
Phase 5: Verify Code    → Screenshot comparison of implementation vs reference
```

Each phase has an explicit verification gate. **No phase proceeds until its gate passes.**

---

## Phase 1: Capture the Webflow Page

**Goal:** Get the complete rendered HTML of the target page, plus reference screenshots, plus layout values that don't survive in static HTML.

### 1.1 Parse the URL

**AI Task:** Extract the page path from the URL to derive filenames.

- `https://tobiomiyonwo.webflow.io/` or `https://tobiomiyonwo.webflow.io` → page name: `homepage`
- `https://tobiomiyonwo.webflow.io/about` → page name: `about`
- `https://tobiomiyonwo.webflow.io/projects/nova-bank` → page name: `projects-nova-bank`
- `https://portfolio.tobi.dev/case-studies/acme-redesign` → page name: `case-studies-acme-redesign`
- If a page name override was provided as second argument, use that instead.

If `$ARGUMENTS` is empty, ask:
> "Please provide the Webflow URL to convert. Example: `https://tobiomiyonwo.webflow.io/projects/nova-bank`"

### 1.2 Capture full-page reference screenshots at all viewports

Take reference screenshots FIRST (before HTML extraction) — these are the visual ground truth for Phase 5 verification.

```bash
# Desktop (1440px)
agent-browser set viewport 1440 900
agent-browser open [URL]
agent-browser wait --load networkidle
# Wait extra for Webflow preloader / IX2 first-frame animations to settle
agent-browser wait 1500
agent-browser screenshot ./webflow-ref-desktop.png --full

# Tablet (768px)
agent-browser set viewport 768 1024
agent-browser reload
agent-browser wait --load networkidle
agent-browser wait 1500
agent-browser screenshot ./webflow-ref-tablet.png --full

# Mobile (375px)
agent-browser set viewport 375 812
agent-browser reload
agent-browser wait --load networkidle
agent-browser wait 1500
agent-browser screenshot ./webflow-ref-mobile.png --full
```

### 1.3 Scroll the full page to trigger lazy loading and IX2 scroll animations

Before extracting HTML, scroll the entire page top-to-bottom so all lazy-loaded images (`data-w-src` → `src`), scroll-triggered IX2 animations, and CMS collection items are rendered into the DOM. Then scroll back to the top before extraction.

```bash
# Return to desktop viewport
agent-browser set viewport 1440 900
agent-browser reload
agent-browser wait --load networkidle
agent-browser wait 1500

# Scroll down in steps to trigger lazy rendering and reveal animations
agent-browser scroll down 800
agent-browser wait 300
agent-browser scroll down 800
agent-browser wait 300
agent-browser scroll down 800
agent-browser wait 300
agent-browser scroll down 800
agent-browser wait 300
agent-browser scroll down 800
agent-browser wait 300
agent-browser scroll down 800
agent-browser wait 300
agent-browser scroll down 800
agent-browser wait 300
agent-browser scroll down 800
agent-browser wait 300
# Continue until bottom of page is reached — Webflow pages can be very long

# Scroll back to top and wait for any deferred loads to settle
agent-browser scroll top
agent-browser wait --load networkidle
agent-browser wait 800
```

This ensures the DOM snapshot in the next step contains all content that would otherwise be missing from sections that only render (or only reveal their final styling) when scrolled into view.

### 1.4 Extract the full page HTML

At desktop viewport (1440px), extract the complete rendered HTML:

```bash
agent-browser execute "document.documentElement.outerHTML"
```

If the page is too large for a single extraction, extract section by section:

```bash
agent-browser snapshot -i
```

Then for each major section element:

```bash
agent-browser get html @eN
agent-browser get text @eN
agent-browser get styles @eN
```

### 1.5 Save the HTML

Write the captured HTML to `docs/webflow/[page-name].html`.

**Critical: The saved HTML must be properly indented and human-readable — never a single-line blob or JSON-escaped string.**

`agent-browser execute "document.documentElement.outerHTML"` returns a JSON-escaped string (wrapped in quotes, with `\"` and `\n` literals). After saving the file, run these two steps:

```bash
# Step 1: Unescape JSON string to raw HTML (the browser wraps outerHTML in JSON quotes)
node -e "const fs=require('fs'); const f='docs/webflow/[page-name].html'; const raw=fs.readFileSync(f,'utf8'); try { const html=JSON.parse(raw); fs.writeFileSync(f,html,'utf8'); console.log('Unescaped'); } catch(e) { console.log('Already raw HTML, skipping unescape'); }"

# Step 2: Prettify with proper indentation
npx prettier --parser html --write docs/webflow/[page-name].html
```

Both steps are required. Step 1 handles the JSON escaping from the browser. Step 2 formats with proper indentation. If prettier fails, use `npx js-beautify -f docs/webflow/[page-name].html -r --type html` as a fallback.

**Critical rules for the HTML file:**
- Include ALL rendered content — every section, every element
- Preserve the structure hierarchy (nav, hero, sections, footer)
- Include inline styles that were computed from JS/CSS (Webflow interactions often inject inline `transform`, `opacity`, `will-change` styles — keep these for reference but note they are animation states, not final styles)
- **Strip Webflow runtime scripts** — remove `<script src="...webflow.js">`, `<script src="...jquery...">`, IX2 runtime, and any analytics/tracking (Google Analytics, Hotjar, Segment)
- Strip the "Made in Webflow" badge
- Strip cookie banners, chat widgets (Intercom, Crisp), and third-party embeds unless the user intends to re-implement them
- **Preserve `data-w-id`, `data-w-tab`, `data-collection` attributes on the elements themselves** — these are your reference for identifying which nodes had interactions or came from a CMS collection during implementation planning
- **Properly formatted with indentation** — not minified or single-line

### 1.6 Extract layout reference values

Before closing the browser, extract the computed CSS values that won't survive in static HTML. These become the authoritative source of truth for section styling during implementation — **do not estimate these values from screenshots**.

```bash
# Get full page structure including section containers
agent-browser snapshot --compact --depth 4
```

For each section-level container visible in the screenshots, extract its computed styles and bounding box:

```bash
agent-browser get styles @eN   # focus on: background-color, background-image, padding, max-width, gap, display, flex-direction, border-radius, box-shadow, backdrop-filter
agent-browser get box @eN      # bounding box: x, y, width, height
```

Repeat for:
1. Every top-level page section container
2. Every CTA button on the page
3. Every image container (wrapper `<div>` around images, not the `<img>` itself)
4. Every card in a projects grid or CMS collection (extract ONE representative card's full computed styles)
5. Any element with `data-w-id` — record the styles at rest so you know the animation's end state

Save to `docs/webflow/[page-name]-layout.md` with this structure:

```markdown
# [Page Name] Layout Reference

> Source: [URL]
> Captured: [date]

## Sections

| Section | Background | Padding | Max-Width | Gap | Direction | Border-Radius |
|---|---|---|---|---|---|---|
| Nav | rgba(10,10,10,0.6) + backdrop-blur | 16px 32px | 100% | 24px | row | 0 |
| Hero | #0a0a0a | 120px 0 | 1200px | 32px | column | 0 |
| Projects Grid | #ffffff | 80px 0 | 1200px | 32px (grid) | column | 0 |
| ... | ... | ... | ... | ... | ... | ... |

## CTA Buttons

| Label | Section | Background | Padding | Border-Radius | Font-Size | Font-Weight | Shadow | Border |
|---|---|---|---|---|---|---|---|---|
| View project | Project card | #0a0a0a | 12px 20px | 999px | 14px | 500 | none | 1px solid rgba(255,255,255,0.1) |
| Get in touch | Hero | #ffffff | 14px 28px | 8px | 16px | 600 | 0 4px 24px rgba(0,0,0,0.15) | none |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

## Image Containers

| Description | Section | Width | Height | Border-Radius | Object-Fit | Overflow |
|---|---|---|---|---|---|---|
| Project card thumb | Projects grid | 100% | 320px | 12px | cover | hidden |
| About headshot | About section | 240px | 240px | 999px | cover | hidden |
| ... | ... | ... | ... | ... | ... | ... |

## Interactive Elements (data-w-id)

| Element | data-w-id | At-rest styles | Suspected interaction | Priority |
|---|---|---|---|---|
| Hero heading | 3f2a...b1c | opacity 1, translate(0,0) | Fade+rise on page load | Nice-to-have |
| Project card | 7e8d...a9f | transform: none | Hover: lift + shadow | Must-have |
| Nav on scroll | 1a2b...c3d | bg blur off | Sticky + blur after 100px scroll | Must-have |

## Typography Sample (per section)

| Section | Element | Font-Family | Font-Size | Font-Weight | Line-Height | Letter-Spacing | Color |
|---|---|---|---|---|---|---|---|
| Hero | h1 | "Neue Machina", sans-serif | 88px | 700 | 0.95 | -0.03em | #f4f4f4 |
| Hero | subhead | "Inter", sans-serif | 20px | 400 | 1.5 | 0 | rgba(244,244,244,0.7) |
| Projects | card title | "Neue Machina", sans-serif | 24px | 600 | 1.2 | -0.01em | #0a0a0a |
| ... | ... | ... | ... | ... | ... | ... | ... |
```

**This file is referenced during Phase 4 implementation. Rules 13, 14, and 15 in the Implementation Rules require consulting it before styling each section.**

### 1.7 Extract hidden interactive content

For every accordion, tab panel, dropdown, mobile nav overlay, or expandable element visible in the screenshots, click each toggle to reveal its hidden content and record it. Webflow's tab panels are usually already in the DOM (just hidden), but modal/lightbox contents often are not.

```bash
# Get interactive element map
agent-browser snapshot -i
```

For each accordion item, tab, or expandable toggle found:

```bash
# Click the toggle to reveal content
agent-browser click @eN

# Wait for animation
agent-browser wait 500

# Extract revealed content
agent-browser get text @eN   # the expanded panel content
```

Save all revealed content to `docs/webflow/[page-name]-interactive.md`:

```markdown
# [Page Name] Interactive Content

> Source: [URL]
> Captured: [date]

## Accordions / FAQs

### [Trigger label / question]
[Revealed content / answer — exact text as captured]

### [Next trigger label]
[Revealed content]

## Tabs

### Tab: [Tab label]
[Tab panel content]

### Tab: [Next label]
[Tab panel content]

## Mobile Nav Overlay

[Every link and section shown when the mobile hamburger is tapped]

## Modals / Lightboxes

### [Trigger label]
[Modal content]

## Dropdowns / Expandables

### [Trigger label]
[Revealed items or content]
- [Item 1]
- [Item 2]

## Notes

- [Element name]: Toggle clicked but content was not extractable (e.g., video embed, dynamic widget). Implement in default closed state with TODO comment.
```

**If a toggle cannot be opened or its content cannot be extracted, note it and implement the element in its default closed state with a `// TODO: content not captured — needs manual entry` comment.**

### 1.8 Download referenced assets

Webflow serves assets from `uploads-ssl.webflow.com` or `assets.website-files.com`. These URLs will die if the Webflow project is ever deleted or reorganised — download every image, video, and font referenced by the page.

For each unique image `src` in the captured HTML:

```bash
# Create local asset directory
mkdir -p public/webflow-assets/[page-name]

# Download using curl (agent-browser can be used if curl not available)
curl -o public/webflow-assets/[page-name]/[filename] "[webflow-asset-url]"
```

Also inspect the page for custom `<link rel="stylesheet">` or `@font-face` declarations pointing at Webflow-hosted fonts. Record the font family names and where they were referenced — Phase 3 will decide whether to self-host them under `public/fonts/` or swap for Google Fonts / next/font equivalents.

Save an asset manifest to `docs/webflow/[page-name]-assets.md`:

```markdown
# [Page Name] Asset Manifest

| Original URL | Local Path | Type | Used In |
|---|---|---|---|
| https://uploads-ssl.webflow.com/.../hero-bg.jpg | public/webflow-assets/homepage/hero-bg.jpg | image | Hero background |
| https://uploads-ssl.webflow.com/.../project-1.webp | public/webflow-assets/homepage/project-1.webp | image | Project card 1 |
| ... | ... | ... | ... |

## Fonts

| Family | Weights | Format | Source | Recommendation |
|---|---|---|---|---|
| Neue Machina | 400, 500, 700 | woff2 | Webflow-hosted | Self-host under public/fonts/ |
| Inter | 400, 500, 600, 700 | woff2 | Google Fonts CDN | Swap to next/font/google |
```

### 1.9 Close browser (for now)

```bash
agent-browser close
```

### Gate 1: HTML Completeness Verification

**AI Task:** This gate ensures the saved HTML didn't lose any sections.

1. Read the saved HTML file: `docs/webflow/[page-name].html`
2. Read the desktop screenshot: `./webflow-ref-desktop.png`
3. Build a **Section Manifest** — an ordered list of every distinct visual section visible in the screenshot:

```markdown
## Section Manifest

| # | Section Name | Description | Present in HTML? |
|---|---|---|---|
| 1 | Navigation | Top nav bar with logo, links, CTA button | ✅ / ❌ |
| 2 | Hero | Main hero with headline, subtext, CTA | ✅ / ❌ |
| 3 | Selected Work | Grid of project cards | ✅ / ❌ |
| 4 | About Snippet | Short intro paragraph with headshot | ✅ / ❌ |
| 5 | Testimonials | Client quote strip | ✅ / ❌ |
| 6 | Contact CTA | Get-in-touch panel with email | ✅ / ❌ |
| ... | ... | ... | ... |
| N | Footer | Footer with links, social, copyright | ✅ / ❌ |
```

4. For each section, verify its content exists in the HTML by searching for key text strings, images, or structural patterns.
5. **If any section is marked ❌:**
   - Re-open the browser
   - Navigate to the missing section
   - Extract its HTML specifically
   - Append to the saved file
   - Re-verify

**Gate passes when: ALL sections are ✅.** Present the manifest to the user and continue.

---

## Phase 2: Analyze the Design System

**Goal:** Understand what primitives, patterns, and tokens already exist in the target project before mapping.

### 2.1 Read the design tokens

Read `styles/tokens.css` to understand available:
- Color palette (semantic names — `--color-bg`, `--color-fg`, `--color-accent`, plus scale)
- Typography scale (`--font-display`, `--font-body`, `--font-mono` + `--text-xs` through `--text-6xl`)
- Spacing scale (`--space-1` through `--space-24`)
- Radii (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`)
- Shadows (`--shadow-sm`, `--shadow-md`, `--shadow-lg`)
- Motion (`--ease-standard`, `--duration-fast`, `--duration-slow`)
- Breakpoints (matches Tailwind defaults unless overridden)

### 2.2 Read the existing primitives

Check `components/ui/` for reusable primitives:
- `Button` — variants, sizes, loading/disabled states
- `Link` — internal (Next.js `Link`) vs external
- `Card` — padding, elevation options
- `Tag` — for skills, tech stack chips
- `Input` / `Textarea` — for contact forms
- `Section` — page-width container with vertical rhythm

### 2.3 Read the existing patterns

Check `components/patterns/` for composed pieces:
- `Nav` — desktop + mobile drawer variants
- `Footer` — link columns + social
- `Hero` — variants (centered, left-aligned, with media)
- `ProjectCard` — grid item
- `SectionHeader` — eyebrow + title + description
- `CtaPanel` — bottom-of-page contact prompt

**Reuse these instead of recreating.** If a pattern is close but not quite right, extend it with a variant prop — do not fork.

### 2.4 Read existing route files

Check if `app/[route]/` already exists. If it does, read the existing files to understand what's already implemented vs what needs to be created or updated. A partial implementation may already have the page shell.

### 2.5 Read the voice guide

Read `docs/DESIGN_SYSTEM.md` for tone and copy conventions. All content will be lifted verbatim from Webflow (per Rule 0), but headings, alt text, and metadata must respect the voice guide.

---

## Phase 3: Plan the Implementation

**Goal:** Map every HTML section to design-system components and tokens.

### 3.1 Build the Implementation Plan

For each section in the manifest, determine:

```markdown
## Implementation Plan

| # | Section | Component Strategy | Design Tokens | Notes |
|---|---|---|---|---|
| 1 | Navigation | Reuse Nav pattern | `--color-bg`, `--space-4` | Confirm mobile drawer links match |
| 2 | Hero | Reuse Hero pattern (centered variant) | `--font-display`, `--text-6xl`, `--color-accent` | Custom fade-in on load |
| 3 | Selected Work | New: SelectedWork section + reuse ProjectCard | Card default, `--space-8` grid gap | 2-col md, 1-col base |
| 4 | About Snippet | Inline in [Route]Page.tsx | `--font-body`, `--text-lg` | Round headshot 240px |
| ... | ... | ... | ... | ... |
| N | Footer | Reuse Footer pattern | — | Confirm socials match |
```

**Key mapping rules:**
- Webflow hex colors → nearest `--color-*` token in `tokens.css`. If no token matches within a reasonable delta, DO NOT hardcode — add a new token to `tokens.css` first.
- Webflow font sizes → nearest `--text-*` token. If a heading uses a wildly one-off size, use an explicit `clamp()` in Tailwind arbitrary syntax rather than fabricating a token.
- Webflow spacing (px values in the layout reference) → `--space-*` token. Webflow's `.w-container` default max-width is 940px; the design system uses `--container-max` — match the value, not the class name.
- Webflow border radius → `--radius-*` token.
- Webflow gradients → CSS custom properties in `tokens.css` (`--gradient-hero`, etc.) or inline for one-off cases.
- Webflow's `.w-*` layout classes → Tailwind Flexbox / Grid utilities. NEVER copy `.w-*` classes into the code — they exist for the Webflow runtime, not for us.
- `data-w-id` interactions → decide per row of the Interactive Elements table:
  - **Must-have** (hover states, sticky nav, mobile menu toggle) → implement with Tailwind + a small amount of React state, or a lightweight motion library
  - **Nice-to-have** (page-load fades, subtle scroll parallax) → implement only if trivial; otherwise flag as follow-up

### 3.2 Present the plan

Present the Implementation Plan to the user. Wait for approval before proceeding.

### 3.3 Content and Link Audit

**Before any implementation begins**, build three content inventories from the captured HTML (`docs/webflow/[page-name].html`) and present them to the user for approval. Implementation must reproduce these tables exactly — no additions, no omissions, no reordering.

#### Inventory A: Navigation

Parse every nav link from the `<nav>` (or `.w-nav`) element in the captured HTML:

| Position | Text | Type | href | Dropdown Sub-items |
|---|---|---|---|---|
| 1 | Work | direct link | /work | — |
| 2 | About | direct link | /about | — |
| 3 | Journal | direct link | /journal | — |
| 4 | Contact | direct link | mailto:hi@tobi.dev | — |
| ... | ... | ... | ... | ... |

- **Type**: `direct link` or `dropdown`
- **href**: convert `https://[webflow-domain]/[path]` → `/[path]`. Keep external URLs (email, LinkedIn, Twitter, external case study hosts) as-is.
- **Dropdown sub-items**: list every item in the dropdown, in order, with its href
- **Do not add items not in the source**
- **Do not flatten dropdowns** — if it's a dropdown in the source, implement it as a dropdown

#### Inventory B: CTAs

Every button and call-to-action across the entire page:

| Section | Button Text | href | Notes |
|---|---|---|---|
| Hero | See selected work | #selected-work | anchor scroll |
| Hero | Get in touch | mailto:hi@tobi.dev | external |
| Project card | View case study | /projects/nova-bank | internal |
| Contact CTA | Say hello | mailto:hi@tobi.dev | external |
| ... | ... | ... | ... |

- **Button text is sacred.** Never change wording. "Get in touch" stays "Get in touch" — not "Contact me", not "Reach out".
- External social/email links stay as-is
- Anchor links (`#selected-work`) become smooth-scroll targets to matching `id` attributes

#### Inventory C: Footer

Every footer column with every link, in order:

| Column | Item Text | href |
|---|---|---|
| Sitemap | Work | /work |
| Sitemap | About | /about |
| Elsewhere | LinkedIn | https://linkedin.com/in/... |
| Elsewhere | GitHub | https://github.com/... |
| Elsewhere | X | https://x.com/... |
| Legal | Colophon | /colophon |
| ... | ... | ... |

- Same columns, same items, same order as the source
- No additions
- Convert Webflow-domain paths to relative Next.js routes; keep external URLs as-is
- Never rewrite links to point at a deployment or preview URL

**Present all three inventories to the user and wait for confirmation before implementing Phase 4.**

**STOP HERE. Do not proceed to Phase 4 until the user confirms all three inventories are correct.**

---

## Phase 4: Implement

**Goal:** Convert each section into Next.js + Tailwind CSS v4 code under `app/`.

### 4.1 File Structure

Create/update these files:

```
app/[route]/
├── page.tsx              # Server component with metadata + renders sections
├── page.module.css       # (optional) CSS module for custom styles that resist Tailwind
└── _components/          # Route-specific sub-components (if page is large)
    ├── HeroSection.tsx
    ├── SelectedWork.tsx
    └── ...
```

For the homepage, use `app/page.tsx` directly.

**Decision: inline vs sub-components:**
- If the page has **6 or fewer sections** → keep everything inline in `page.tsx`
- If the page has **7+ sections** → extract each section into `_components/[SectionName].tsx`
- Sections used across multiple pages → move to `components/patterns/`

### 4.2 page.tsx Template

```tsx
import type { Metadata } from "next";
import HeroSection from "./_components/HeroSection";
import SelectedWork from "./_components/SelectedWork";
// ...

export const metadata: Metadata = {
  title: "[Page Title]",
  description: "[Page description from the source]",
  openGraph: {
    title: "[Page Title]",
    description: "[Description]",
    type: "website",
    url: "https://[your-domain]/[route]",
    images: [{ url: "/og/[page-name].png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "[Page Title]",
    description: "[Description]",
    images: ["/og/[page-name].png"],
  },
};

export default function [Route]Page() {
  return (
    <>
      <HeroSection />
      <SelectedWork />
      {/* ... */}
    </>
  );
}
```

### 4.3 Implementation Rules

**MUST follow these rules during implementation:**

1. **Use design tokens — never hardcode.** Map every color, size, radius, and shadow to a token from `styles/tokens.css`. Use them via:
   - Tailwind theme references: `bg-bg`, `text-fg`, `text-accent`
   - CSS variable syntax where Tailwind arbitrary values are needed: `bg-[var(--color-bg)]`
   - Never write `bg-[#0a0a0a]` — if that color is used, add it to `tokens.css` as `--color-bg` first.

2. **Use design-system primitives — not raw HTML for interactive elements:**
   - `<Button>` from `components/ui/Button` — not `<button>` unless truly one-off
   - `<Link>` from `components/ui/Link` — routes internal via Next.js `Link`, external with `target="_blank" rel="noreferrer"`
   - `<Card>` from `components/ui/Card` — for project cards, testimonial cards
   - `<Tag>` for skill/tech chips
   - `<Section>` for page-width containers with vertical rhythm

3. **Use design-system patterns for repeated structures:**
   - `<Nav />`, `<Footer />`, `<Hero />`, `<ProjectCard />`, `<SectionHeader />`, `<CtaPanel />`
   - If a pattern doesn't exist yet but appears on multiple pages, create it in `components/patterns/` before using inline

4. **Responsive design** — mobile-first with Tailwind's `sm:` `md:` `lg:` `xl:` prefixes:
   ```tsx
   <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
   <h1 className="text-4xl md:text-6xl lg:text-7xl">
   <section className="py-16 md:py-24 lg:py-32">
   ```

5. **CSS modules for one-off custom styles** — complex gradients, keyframe animations, or clip-paths go in `page.module.css`, not inline. Prefer Tailwind arbitrary values (e.g. `bg-[url(/images/hero.jpg)]`) for the simple cases.

6. **Fonts via next/font:**
   ```tsx
   // app/layout.tsx
   import localFont from "next/font/local";
   import { Inter } from "next/font/google";

   const displayFont = localFont({
     src: "../public/fonts/NeueMachina-Bold.woff2",
     variable: "--font-display",
   });

   const bodyFont = Inter({
     subsets: ["latin"],
     variable: "--font-body",
   });
   ```
   Then reference in `tokens.css` via the CSS variables.

7. **Images:**
   - Move downloaded assets from `public/webflow-assets/[page-name]/` to their final home (usually `public/images/[route]/` or `public/projects/[slug]/`)
   - Use `next/image` with explicit `width` and `height` (or `fill` for cover images)
   - Every image needs a meaningful `alt` — do not copy Webflow's empty alts blindly

8. **Links:**
   - Internal links: use `next/link`
   - External links: `<a href="..." target="_blank" rel="noreferrer">` or the `Link` primitive with `external` prop
   - Email: `mailto:` — never wrap in Next.js Link
   - Anchor links: match to an `id` attribute on the target `<section>`

9. **No Webflow classes.** Every `.w-container`, `.w-row`, `.w-col`, `.w-nav-link` in the source HTML must be replaced with Tailwind utilities or a design-system component. If you see a `.w-*` class in the implementation, that is a bug.

10. **No inline `style` attributes for animation state.** Webflow injects `style="opacity:0; transform: translate3d(...)"` on elements with `data-w-id`. These are frozen animation frames — do not copy them. Implement the final at-rest state, then layer the animation separately.

11. **Section-by-section implementation:**
    - Implement ONE section at a time
    - After each section, check it off in the Section Manifest
    - Never skip a section — the manifest is the source of truth

12. **Nav and footer must be exact replicas** of the Content and Link Audit tables from step 3.3. Do not add, remove, reorder, or rename any item.

13. **CTA text is sacred.** Never change button or link text from what appears in the source. Reproduce every label character-for-character including casing and punctuation.

14. **No content generation.** Every piece of visible text in the implementation must be traceable to the captured HTML (`docs/webflow/[page-name].html`), the interactive content file (`docs/webflow/[page-name]-interactive.md`), or the layout reference. If a string cannot be found in any of these sources, delete it — it is fabricated. Do not invent project descriptions, testimonial quotes, about-me copy, or any body text.

15. **Use layout reference values for section styling.** Before implementing each section, consult `docs/webflow/[page-name]-layout.md` for the exact background color, padding, max-width, gap, flex direction, and border-radius. Map these values to the nearest design token. Do not estimate from screenshots.

16. **Use the CTA button table for button styling.** Webflow buttons frequently use custom padding, pill radii, and non-standard shadows that don't match a single Button variant. Use the extracted values from the CTA Buttons table in `docs/webflow/[page-name]-layout.md`. When a button's style cannot be achieved with an existing Button variant, add a new variant to the Button primitive rather than overriding at the call site.

17. **Interactions from the Interactive Elements table:**
    - Must-have interactions get implemented as part of the section
    - Nice-to-have interactions get added AFTER Gate 4 passes — do not let animation polish block visual verification of the static layout

### 4.4 Post-Section Content Check

After implementing each section, before moving to the next one, perform this content audit:

1. List every user-visible text string in the just-implemented section (headings, subheadings, body copy, button labels, badge text, placeholder text, captions, links, image alt text)
2. For each string, locate it in one of these sources:
   - `docs/webflow/[page-name].html` (primary source)
   - `docs/webflow/[page-name]-interactive.md` (accordion/tab content)
   - `docs/webflow/[page-name]-layout.md` (button labels captured during extraction)
3. **Remove any string not found in any source** — it is fabricated content that must not ship
4. **Add any string present in the source for this section that is missing from the implementation**
5. Flag any content that could not be extracted (hidden behind interaction, dynamic, etc.) with a `// TODO: content not captured — needs manual entry` comment

This check runs after every single section, not just at the end.

### 4.5 Track Progress

As each section is implemented, update the manifest:

```markdown
| # | Section | Status | Notes |
|---|---|---|---|
| 1 | Navigation | ✅ Implemented | Reused Nav pattern |
| 2 | Hero | ✅ Implemented | Custom clamp() font-size for headline |
| 3 | Selected Work | 🔄 In Progress | — |
| 4 | About Snippet | ⬜ Pending | — |
```

### Gate 4: Implementation Completeness

Before proceeding to verification:

1. **Every section in the manifest must be ✅ Implemented**
2. Run linting:
   ```bash
   yarn eslint app/[route] --quiet
   ```
3. Run typecheck:
   ```bash
   yarn typecheck
   ```
4. Fix any errors before proceeding.

**Gate passes when: All sections implemented + zero lint/type errors.**

---

## Phase 5: Visual Verification

**Goal:** Compare the implementation against the reference screenshots.

### 5.1 Start dev server and capture implementation screenshots

Ensure the dev server is running at `http://localhost:3000`, then:

```bash
# Desktop
agent-browser set viewport 1440 900
agent-browser open http://localhost:3000/[route]
agent-browser wait --load networkidle
agent-browser wait 1000
agent-browser screenshot ./webflow-impl-desktop.png --full

# Tablet
agent-browser set viewport 768 1024
agent-browser reload
agent-browser wait --load networkidle
agent-browser wait 1000
agent-browser screenshot ./webflow-impl-tablet.png --full

# Mobile
agent-browser set viewport 375 812
agent-browser reload
agent-browser wait --load networkidle
agent-browser wait 1000
agent-browser screenshot ./webflow-impl-mobile.png --full
```

### 5.2 Section-by-section comparison

**AI Task:** Compare each section between reference and implementation screenshots.

For each section in the manifest, check:

- [ ] **Structure** — same layout, same element count, same hierarchy
- [ ] **Content** — same text, headings, labels, CTAs (character-for-character)
- [ ] **Colors** — backgrounds, text colors, accents match (mapped to tokens)
- [ ] **Typography** — font families, sizes, weights, and letter-spacing match
- [ ] **Spacing** — section padding, element gaps are proportionally correct
- [ ] **Images/Icons** — present, correctly sized, correctly cropped
- [ ] **Responsive** — tablet and mobile layouts match reference behavior
- [ ] **Must-have interactions** — hover states, sticky nav, mobile drawer work

### 5.3 Generate Discrepancy Report

```markdown
## Verification Report

| # | Section | Match | Discrepancies |
|---|---|---|---|
| 1 | Navigation | ✅ Match | — |
| 2 | Hero | ⚠️ Minor | Headline font-size 4px larger than reference, subhead line-height off |
| 3 | Selected Work | ❌ Issue | Missing hover-lift on cards, tablet shows 3 cols but reference shows 2 |
```

### 5.4 Fix discrepancies

For any section marked ⚠️ or ❌:
1. Fix the code
2. Re-run lint + typecheck
3. Re-screenshot and re-compare

**Iterate until all sections are ✅ Match or the user accepts the remaining minor differences.**

### 5.5 Close browser

```bash
agent-browser close
```

---

## Phase 6: Final Cleanup

### 6.1 Clean up temporary files

Remove temporary screenshots from the project root:

```bash
rm -f ./webflow-ref-desktop.png ./webflow-ref-tablet.png ./webflow-ref-mobile.png
rm -f ./webflow-impl-desktop.png ./webflow-impl-tablet.png ./webflow-impl-mobile.png
```

### 6.2 Present final summary

```markdown
## Webflow-to-Code Complete

**Source:** [URL]
**HTML reference:** docs/webflow/[page-name].html
**Layout reference:** docs/webflow/[page-name]-layout.md
**Interactive content:** docs/webflow/[page-name]-interactive.md
**Assets:** public/webflow-assets/[page-name]/ → public/images/[route]/
**Implementation:** app/[route]/

### Files Created/Modified
- `app/[route]/page.tsx` — Server component with metadata
- `app/[route]/_components/...` — Sub-components
- `docs/webflow/[page-name].*` — Captured references
- `styles/tokens.css` — [any new tokens added]
- `components/ui/...` — [any primitive variants added]
- `components/patterns/...` — [any new patterns extracted]

### Section Manifest (Final)
| # | Section | HTML | Code | Verified |
|---|---|---|---|---|
| 1 | Navigation | ✅ | ✅ | ✅ |
| 2 | Hero | ✅ | ✅ | ✅ |
| ... | ... | ... | ... | ... |

### Design Tokens Used
- Colors: [list which --color-* tokens were used]
- Typography: [which --text-*, --font-* tokens]
- Spacing: [which --space-* tokens]

### Deferred / Follow-up
- [Any nice-to-have IX2 interactions not yet implemented]
- [Any content flagged as TODO for manual entry]
```

Ask:
> Would you like me to commit these changes on a new branch?

---

## Important Rules

0. **NEVER invent, assume, or generate text content.** This is the single most critical rule. Every piece of visible text in the implementation must exist verbatim in one of: the captured HTML (`docs/webflow/[page-name].html`), the interactive content file (`docs/webflow/[page-name]-interactive.md`), or the layout reference (`docs/webflow/[page-name]-layout.md`). This means:
   - No making up project descriptions, testimonial quotes, about-me copy, FAQ answers, or any body text that isn't in the source
   - No placeholder copy that sounds plausible but isn't from the source
   - If accordion/modal/tab content wasn't captured, implement the shell in its default closed state with a `// TODO: content not captured — needs manual entry` comment
   - All un-extractable content gaps must be flagged to the user in a summary at the end of each phase
   - **A faithful skeleton with TODO comments is always better than a polished page with made-up copy.** The user can fill in real content. Fabricated content shipped to production is a defect.

1. **The Section Manifest is the source of truth.** Every section must be tracked from HTML capture through implementation through verification. If a section appears in the screenshot but not the manifest, the manifest is wrong — update it.

2. **Never skip Phase verification gates.** If HTML is incomplete, fix it before implementing. If implementation has lint errors, fix them before visual verification.

3. **Use the design system exclusively.** Map every visual property to `styles/tokens.css`. The only exceptions are truly unique values not in the system — these get added to `tokens.css` as new tokens BEFORE being used, never inlined as arbitrary values.

4. **Reuse existing primitives and patterns.** Always check `components/ui/` and `components/patterns/` before creating anything new. If a `Nav` or `Footer` already exists, reuse it. If a `ProjectCard` needs a new variant, add a variant prop rather than forking.

5. **Mobile-first responsive.** All layout must work at 375px (mobile), 768px (tablet), and 1440px (desktop). Start with base (mobile) classes, layer `sm:` `md:` `lg:` on top.

6. **No functionality guessing.** If the reference page has interactive elements (toggles, tabs, accordions, modals), implement them with React state + accessible primitives. If behavior is unclear from the static capture, implement the most standard behavior and flag it for the user.

7. **Preserve SEO.** Always include proper `metadata` export in `page.tsx` with title, description, OpenGraph, and Twitter card. Generate a basic OG image or reuse a shared one at `/og/[page-name].png`.

8. **Assets go under `public/`.** Download referenced Webflow assets in Phase 1.8, then during implementation move them to their final path (`public/images/[route]/` or `public/projects/[slug]/`). Never reference `uploads-ssl.webflow.com` URLs directly in the code — they will die.

9. **Never carry Webflow classes into the code.** `.w-container`, `.w-row`, `.w-nav-link`, `.w-button` are Webflow runtime hooks. The code must be idiomatic Tailwind + React — a reader shouldn't be able to tell the source was Webflow.

10. **Strip the Webflow runtime.** No `webflow.js`, no jQuery, no IX2 runtime script tags in the implementation. Interactions that must survive get reimplemented in React.

11. **Follow existing code patterns.** The implementation should look like it belongs next to other pages in `app/` — same import style, same component structure, same naming conventions, same file organisation.

12. **Never commit directly to `main`.** Follow the project git workflow — create a feature branch (`git checkout -b webflow-to-code/[page-name]`) before any commit.
