---
name: framer-to-code
description: Convert a live website (usually airstride.ai/) to code. Captures the page HTML via browser, saves it under docs/framer/, verifies completeness section-by-section, then implements under app/website/ using Mantine v8 and the marketing theme. Use when the user says "framer to code", "convert website", "implement page from framer", "website to code", or provides an airstride.ai URL to implement.
argument-hint: "<website-url> [optional: page-name-override]"
allowed-tools: Bash(agent-browser:*), Bash(yarn:*), Read, Write, Edit, Glob, Grep, Agent
---

# Framer-to-Code: Website URL to Mantine Implementation

Convert a live website page into a fully implemented Mantine v8 component under `app/website/`. The pipeline captures the page, verifies nothing is missed, and implements using the marketing design system.

## Input

- `$ARGUMENTS` — One or two arguments:
  1. **Website URL** (required): The page to convert (e.g., `https://airstride.ai/pricing`)
  2. **Page name override** (optional): Override the auto-derived filename/route (e.g., `pricing`)

## Architecture Context

Before starting, understand the existing patterns:

- **Theme:** `app/website/theme.ts` — self-contained marketing theme with `mktg-blue`, `mktg-pink`, `mktg-green`, `mktg-orange` color families, Plus Jakarta Sans (headings), DM Sans (body), Fragment Mono (badges)
- **Layout:** `app/website/layout.tsx` — wraps all marketing pages with font CSS variables and `WebsiteProviders`
- **Page pattern:** `app/website/[route]/page.tsx` — server component with metadata, renders a `[Route]Content.tsx` client component
- **Shared components:** `app/website/_components/` — reusable components across marketing pages
- **Reference files:** `docs/framer/` — captured HTML from source websites

## Pipeline Overview

```
Phase 1: Capture        → Browser visits URL, extracts full-page HTML, saves to docs/framer/
Phase 2: Inventory      → Parse HTML into section manifest (ordered list of every section/component)
Phase 3: Verify HTML    → Screenshot comparison to confirm HTML captured everything
Phase 4: Implement      → Convert HTML sections to Mantine v8 components using theme.ts
Phase 5: Verify Code    → Screenshot comparison of implementation vs reference
```

Each phase has an explicit verification gate. **No phase proceeds until its gate passes.**

---

## Phase 1: Capture the Website

**Goal:** Get the complete rendered HTML of the target page.

### 1.1 Parse the URL

**AI Task:** Extract the page path from the URL to derive filenames.

- `https://airstride.ai/pricing` → page name: `pricing`
- `https://airstride.ai/` or `https://airstride.ai` → page name: `homepage`
- `https://airstride.ai/use-cases/channel-partners` → page name: `use-cases-channel-partners`
- If a page name override was provided as second argument, use that instead.

If `$ARGUMENTS` is empty, ask:
> "Please provide the website URL to convert. Example: `https://airstride.ai/pricing`"

### 1.2 Capture full-page screenshots at all viewports

Take reference screenshots FIRST (before HTML extraction) — these are the ground truth.

```bash
# Desktop (1440px)
agent-browser set viewport 1440 900
agent-browser open [URL]
agent-browser wait --load networkidle
agent-browser screenshot ./framer-ref-desktop.png --full

# Tablet (768px)
agent-browser set viewport 768 1024
agent-browser reload
agent-browser wait --load networkidle
agent-browser screenshot ./framer-ref-tablet.png --full

# Mobile (375px)
agent-browser set viewport 375 812
agent-browser reload
agent-browser wait --load networkidle
agent-browser screenshot ./framer-ref-mobile.png --full
```

### 1.2.5 Scroll the full page to trigger lazy-loaded content

Before extracting HTML, scroll the entire page top-to-bottom so all lazy-loaded images, scroll-triggered animations, and deferred sections are rendered into the DOM. Then scroll back to the top before extraction.

```bash
# Return to desktop viewport
agent-browser set viewport 1440 900
agent-browser reload
agent-browser wait --load networkidle

# Scroll down in steps to trigger lazy rendering
agent-browser scroll down 1000
agent-browser scroll down 1000
agent-browser scroll down 1000
agent-browser scroll down 1000
agent-browser scroll down 1000
agent-browser scroll down 1000
agent-browser scroll down 1000
agent-browser scroll down 1000
agent-browser scroll down 1000
agent-browser scroll down 1000
# Continue until bottom of page is reached

# Scroll back to top and wait for any deferred loads to settle
agent-browser scroll top
agent-browser wait --load networkidle
```

This ensures the DOM snapshot in the next step contains all content that would otherwise be missing from sections that only render when scrolled into view.

### 1.3 Extract the full page HTML

At desktop viewport (1440px), extract the complete rendered HTML:

```bash
agent-browser set viewport 1440 900
agent-browser reload
agent-browser wait --load networkidle
```

Use the browser to extract the full `document.documentElement.outerHTML`. The goal is to capture the **rendered DOM** — not the source HTML — so all JS-injected content is included.

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

### 1.4 Save the HTML

Write the captured HTML to `docs/framer/[page-name].html`.

**Critical: The saved HTML must be properly indented and human-readable — never a single-line blob or JSON-escaped string.**

`agent-browser execute "document.documentElement.outerHTML"` returns a JSON-escaped string (wrapped in quotes, with `\"` and `\n` literals). After saving the file, run these two steps:

```bash
# Step 1: Unescape JSON string to raw HTML (the browser wraps outerHTML in JSON quotes)
node -e "const fs=require('fs'); const f='docs/framer/[page-name].html'; const raw=fs.readFileSync(f,'utf8'); try { const html=JSON.parse(raw); fs.writeFileSync(f,html,'utf8'); console.log('Unescaped'); } catch(e) { console.log('Already raw HTML, skipping unescape'); }"

# Step 2: Prettify with proper indentation
npx prettier --parser html --write docs/framer/[page-name].html
```

Both steps are required. Step 1 handles the JSON escaping from the browser. Step 2 formats with proper indentation. If prettier fails, use `npx js-beautify -f docs/framer/[page-name].html -r --type html` as a fallback.

**Critical rules for the HTML file:**
- Include ALL rendered content — every section, every element
- Preserve the structure hierarchy (nav, hero, sections, footer)
- Include inline styles that were computed from JS/CSS
- Strip external script tags (analytics, tracking, Framer runtime) — keep only structure and styles
- Strip cookie banners, overlay widgets, and third-party embeds
- **Properly formatted with indentation** — not minified or single-line

### 1.5 Extract layout reference values

Before closing the browser, extract the computed CSS values that won't survive in static HTML. These become the authoritative source of truth for section styling during implementation — **do not estimate these values from screenshots**.

```bash
# Get full page structure including section containers
agent-browser snapshot --compact --depth 4
```

For each section-level container visible in the screenshots, extract its computed styles and bounding box:

```bash
agent-browser get styles @eN   # focus on: background-color, background-image, padding, max-width, gap, display, flex-direction, border-radius
agent-browser get box @eN      # bounding box: x, y, width, height
```

Repeat for:
1. Every top-level page section container
2. Every CTA button on the page
3. Every image container (wrapper `<div>` around images, not the `<img>` itself)

Save to `docs/framer/[page-name]-layout.md` with this structure:

```markdown
# [Page Name] Layout Reference

> Source: [URL]
> Captured: [date]

## Sections

| Section | Background | Padding | Max-Width | Gap | Direction | Border-Radius |
|---|---|---|---|---|---|---|
| Hero | #0a0a0a | 120px 0 | 1200px | 32px | column | 0 |
| Features | #ffffff | 80px 0 | 1200px | 48px | column | 0 |
| ... | ... | ... | ... | ... | ... | ... |

## CTA Buttons

| Label | Section | Background | Padding | Border-Radius | Font-Size | Font-Weight | Shadow | Border |
|---|---|---|---|---|---|---|---|---|
| Book a Demo | Hero | linear-gradient(...) | 14px 28px | 8px | 16px | 600 | 0 4px 24px rgba(...) | none |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

## Image Containers

| Description | Section | Width | Height | Border-Radius | Object-Fit | Overflow |
|---|---|---|---|---|---|---|
| Hero screenshot | Hero | 640px | 400px | 16px | cover | hidden |
| ... | ... | ... | ... | ... | ... | ... |
```

**This file is referenced during Phase 3 implementation. Rules 13 and 14 in the Implementation Rules require consulting it before styling each section.**

### 1.6 Extract hidden interactive content

For every accordion, tab panel, dropdown, or expandable element visible in the screenshots, click each toggle to reveal its hidden content and record it. This is the only way to capture content that isn't in the initial DOM.

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

Save all revealed content to `docs/framer/[page-name]-interactive.md`:

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

## Dropdowns / Expandables

### [Trigger label]
[Revealed items or content]
- [Item 1]
- [Item 2]

## Notes

- [Element name]: Toggle clicked but content was not extractable (e.g., video, dynamic widget). Implement in default closed state with TODO comment.
```

**If a toggle cannot be opened or its content cannot be extracted, note it and implement the element in its default closed state with a `// TODO: content not captured — needs manual entry` comment.**

### 1.7 Close browser (for now)

```bash
agent-browser close
```

### Gate 1: HTML Completeness Verification

**AI Task:** This gate ensures the saved HTML didn't lose any sections.

1. Read the saved HTML file: `docs/framer/[page-name].html`
2. Read the desktop screenshot: `./framer-ref-desktop.png`
3. Build a **Section Manifest** — an ordered list of every distinct visual section visible in the screenshot:

```markdown
## Section Manifest

| # | Section Name | Description | Present in HTML? |
|---|---|---|---|
| 1 | Navigation | Top nav bar with logo, links, CTA button | ✅ / ❌ |
| 2 | Hero | Main hero with headline, subtext, CTA | ✅ / ❌ |
| 3 | Social Proof | Logos bar or testimonial strip | ✅ / ❌ |
| ... | ... | ... | ... |
| N | Footer | Footer with links, copyright | ✅ / ❌ |
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

## Phase 2: Analyze and Plan the Implementation

**Goal:** Map every HTML section to Mantine v8 components and the marketing theme.

### 2.1 Read the marketing theme

Read `app/website/theme.ts` to understand available:
- Color families and shades (`mktg-blue`, `mktg-pink`, `mktg-green`, `mktg-orange`)
- `theme.other` values (cream, bgDark, textDark, textGrey, gradients)
- Component defaults (Button radius, Card padding, Container size)
- Font scale and spacing scale

### 2.2 Read existing shared components

Check `app/website/_components/` for reusable components that match sections in the target page (e.g., Navbar, Footer, CTASection). **Reuse these instead of recreating.**

### 2.3 Read existing route files

Check if `app/website/[route]/` already exists. If it does, read the existing files to understand what's already implemented vs what needs to be created or updated.

### 2.4 Build the Implementation Plan

For each section in the manifest, determine:

```markdown
## Implementation Plan

| # | Section | Component Strategy | Theme Tokens | Notes |
|---|---|---|---|---|
| 1 | Navigation | Reuse existing Navbar from _components | — | Check if links differ |
| 2 | Hero | New: inline in [Route]Content.tsx | mktg-blue.5, bgDark, h1 | Gradient text effect |
| 3 | Features Grid | New: inline in [Route]Content.tsx | Card defaults, mktg-green | 3-col SimpleGrid |
| ... | ... | ... | ... | ... |
| N | Footer | Reuse existing Footer from _components | — | Check if links differ |
```

**Key mapping rules:**
- Framer hex colors → nearest `mktg-*` shade or `theme.other` value
- Framer font sizes → theme heading sizes (h1-h6) or body sizes (xs, sm, md, lg, xl)
- Framer spacing → theme spacing tokens (xs, sm, md, lg, xl) or explicit px for non-standard values
- Framer border radius → theme `defaultRadius` or explicit values
- Framer gradients → `theme.other.gradientPink` / `theme.other.gradientLavender` or custom
- Tailwind classes in Framer JSX → Mantine equivalent props

**Present the plan to the user.** Wait for approval before proceeding to implementation.

### 2.5 Content and Link Audit

**Before any implementation begins**, build three content inventories from the captured HTML (`docs/framer/[page-name].html`) and present them to the user for approval. Implementation must reproduce these tables exactly — no additions, no omissions, no reordering.

#### Inventory A: Navigation

Parse every nav link from the `<nav>` element in the captured HTML:

| Position | Text | Type | href | Dropdown Sub-items |
|---|---|---|---|---|
| 1 | Features | direct link | /website/features | — |
| 2 | Solutions | dropdown | — | Use Cases, Channel Partners, ... |
| 3 | Pricing | direct link | /website/pricing | — |
| ... | ... | ... | ... | ... |

- **Type**: `direct link` or `dropdown`
- **href**: convert `https://airstride.ai/[path]` → `/website/[path]`. Keep external URLs (auth, HubSpot, mailto) as-is.
- **Dropdown sub-items**: list every item in the dropdown, in order, with its href
- **Do not add items not in the source** (e.g., do not add "Blog" or "Updates" if they aren't in the original nav)
- **Do not flatten dropdowns** — if it's a dropdown in the source, implement it as a dropdown

#### Inventory B: CTAs

Every button and call-to-action across the entire page:

| Section | Button Text | href | Notes |
|---|---|---|---|
| Hero | Book a Demo | https://meetings.hubspot.com/... | external, opens HubSpot |
| Hero | See how it works | /website/how-it-works | internal |
| Pricing | Get Started | /website/signup | internal |
| ... | ... | ... | ... |

- **Button text is sacred.** Never change wording. "Book a Demo" stays "Book a Demo" — not "Get Started", not "Request Demo".
- External auth URLs and HubSpot links stay as-is
- `mailto:` links stay as-is

#### Inventory C: Footer

Every footer column with every link, in order:

| Column | Item Text | href |
|---|---|---|
| Product | Features | /website/features |
| Product | Pricing | /website/pricing |
| Company | About | /website/about |
| Company | Blog | https://blog.airstride.ai |
| Legal | Privacy Policy | /website/privacy |
| ... | ... | ... |

- Same columns, same items, same order as the source
- No additions
- Convert `airstride.ai` paths to relative Next.js routes; keep external URLs as-is
- Never rewrite links to point at a deployment or preview URL

**Present all three inventories to the user and wait for confirmation before implementing Phase 3.**

**STOP HERE. Do not proceed to Phase 3 until the user confirms all three inventories are correct.**

---

## Phase 3: Implement

**Goal:** Convert each section into Mantine v8 code under `app/website/`.

### 3.1 File Structure

Create/update these files:

```
app/website/[route]/
├── page.tsx              # Server component with metadata + renders Content
├── [Route]Content.tsx    # "use client" — main content component
├── [Route].module.css    # CSS module for custom styles (gradients, animations, etc.)
└── _components/          # Route-specific sub-components (if page is large)
    ├── HeroSection.tsx
    ├── FeaturesGrid.tsx
    └── ...
```

**Decision: inline vs sub-components:**
- If the page has **6 or fewer sections** → keep everything in `[Route]Content.tsx`
- If the page has **7+ sections** → extract each section into `_components/[SectionName].tsx`
- Sections used across multiple pages → move to `app/website/_components/`

### 3.2 page.tsx Template

```typescript
import type { Metadata } from "next";
import [Route]Content from "./[Route]Content";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "[Page Title]",
    description: "[Page description from the website]",
    openGraph: {
      title: "[Page Title] | Airstride",
      description: "[Description]",
      type: "website",
      url: "https://airstride.ai/[route]",
      images: [{ url: "/marketing/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "[Page Title] | Airstride",
      description: "[Description]",
      images: ["/marketing/og-image.png"],
    },
  };
}

export default function [Route]Page() {
  return <[Route]Content />;
}
```

### 3.3 Implementation Rules

**MUST follow these rules during implementation:**

1. **Use marketing theme tokens** — never hardcode hex colors. Map every color to:
   - `mktg-blue.[0-9]`, `mktg-pink.[0-9]`, `mktg-green.[0-9]`, `mktg-orange.[0-9]`
   - `theme.other.cream`, `theme.other.bgDark`, `theme.other.textDark`, `theme.other.textGrey`
   - Or CSS variables: `var(--mantine-color-mktg-blue-5)`

2. **Use Mantine components** — not raw HTML:
   - `<Container>` for page-width containers
   - `<Stack>`, `<Group>`, `<SimpleGrid>`, `<Grid>` for layout
   - `<Title>` for headings (h1-h6)
   - `<Text>` for body copy
   - `<Button>` for CTAs
   - `<Card>` / `<Paper>` for card elements
   - `<Image>` from `next/image` for images (with Mantine wrapper if needed)

3. **Responsive design** — mobile-first with Mantine breakpoint props:
   ```typescript
   <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
   <Title fz={{ base: "h3", md: "h1" }}>
   <Container py={{ base: "xl", md: 80 }}>
   ```

4. **CSS modules for custom styles** — gradients, animations, and complex hover effects go in `[Route].module.css`, not inline styles.

5. **Font families via CSS variables:**
   - Headings: `var(--font-heading)` (Plus Jakarta Sans)
   - Body: `var(--font-body)` (DM Sans)
   - Badges/labels: `var(--font-mono)` (Fragment Mono)

6. **Images:**
   - Download/reference images from `public/marketing/` directory
   - Use `next/image` with proper width/height/alt
   - For decorative SVGs, inline them or use `@tabler/icons-react`

7. **Links:**
   - Internal links: use Next.js `Link` component
   - External links: use Mantine `Anchor` with `target="_blank"`
   - CTA buttons linking to app: use `Link` wrapping `Button`

8. **No Tailwind** — this project uses Mantine. Convert all Tailwind classes to Mantine equivalents.

9. **Section-by-section implementation:**
   - Implement ONE section at a time
   - After each section, check it off in the Section Manifest
   - Never skip a section — the manifest is the source of truth

10. **Nav and footer must be exact replicas** of the Content and Link Audit tables from step 2.5. Do not add, remove, reorder, or rename any item. If the source has dropdown menus, implement them as dropdowns with every sub-item exactly as listed.

11. **CTA text is sacred.** Never change button or link text from what appears in the source. "Book a Demo" is "Book a Demo" — not "Get Started", not "Request Demo", not "Try Free". Reproduce every label character-for-character including casing.

12. **No content generation.** Every piece of visible text in the implementation must be traceable to the captured HTML (`docs/framer/[page-name].html`), the interactive content file (`docs/framer/[page-name]-interactive.md`), or the layout reference. If a string cannot be found in any of these sources, delete it — it is fabricated. Do not invent FAQ answers, feature descriptions, testimonial quotes, pricing plan descriptions, or any body copy.

13. **Use layout reference values for section styling.** Before implementing each section, consult `docs/framer/[page-name]-layout.md` for the exact background color, padding, max-width, gap, flex direction, and border-radius. Map these values to the nearest Mantine theme token. Do not estimate from screenshots.

14. **Use the CTA button table for button styling.** Framer buttons frequently use gradient backgrounds, custom padding, and non-standard shadows that don't match Mantine's built-in `Button` variants. Use the extracted values from the CTA Buttons table in `docs/framer/[page-name]-layout.md`. When a button's style cannot be achieved with a Mantine variant prop, use a CSS module override rather than forcing a wrong variant.

### 3.4 Post-Section Content Check

After implementing each section, before moving to the next one, perform this content audit:

1. List every user-visible text string in the just-implemented section (headings, subheadings, body copy, button labels, badge text, placeholder text, captions, links)
2. For each string, locate it in one of these sources:
   - `docs/framer/[page-name].html` (primary source)
   - `docs/framer/[page-name]-interactive.md` (accordion/tab content)
   - `docs/framer/[page-name]-layout.md` (button labels captured during extraction)
3. **Remove any string not found in any source** — it is fabricated content that must not ship
4. **Add any string present in the source for this section that is missing from the implementation**
5. Flag any content that could not be extracted (hidden behind interaction, dynamic, etc.) with a `// TODO: content not captured — needs manual entry` comment

This check runs after every single section, not just at the end.

### 3.5 Track Progress

As each section is implemented, update the manifest:

```markdown
| # | Section | Status | Notes |
|---|---|---|---|
| 1 | Navigation | ✅ Implemented | Reused existing Navbar |
| 2 | Hero | ✅ Implemented | Custom gradient in CSS module |
| 3 | Features | 🔄 In Progress | — |
| 4 | Pricing Cards | ⬜ Pending | — |
```

### Gate 3: Implementation Completeness

Before proceeding to verification:

1. **Every section in the manifest must be ✅ Implemented**
2. Run linting:
   ```bash
   yarn eslint app/website/[route] --quiet
   ```
3. Run typecheck:
   ```bash
   yarn typecheck
   ```
4. Fix any errors before proceeding.

**Gate passes when: All sections implemented + zero lint/type errors.**

---

## Phase 4: Visual Verification

**Goal:** Compare the implementation against the reference screenshots.

### 4.1 Capture implementation screenshots

Ensure the dev server is running at `http://localhost:3000`, then:

```bash
# Desktop
agent-browser set viewport 1440 900
agent-browser open http://localhost:3000/[route]
agent-browser wait --load networkidle
agent-browser screenshot ./framer-impl-desktop.png --full

# Tablet
agent-browser set viewport 768 1024
agent-browser reload
agent-browser wait --load networkidle
agent-browser screenshot ./framer-impl-tablet.png --full

# Mobile
agent-browser set viewport 375 812
agent-browser reload
agent-browser wait --load networkidle
agent-browser screenshot ./framer-impl-mobile.png --full
```

### 4.2 Section-by-section comparison

**AI Task:** Compare each section between reference and implementation screenshots.

For each section in the manifest, check:

- [ ] **Structure** — same layout, same element count, same hierarchy
- [ ] **Content** — same text, headings, labels, CTAs
- [ ] **Colors** — backgrounds, text colors, accents match (mapped to theme tokens)
- [ ] **Typography** — font sizes, weights, and spacing are proportionally correct
- [ ] **Spacing** — section padding, element gaps are proportionally correct
- [ ] **Images/Icons** — present and correctly sized
- [ ] **Responsive** — tablet and mobile layouts match reference behavior

### 4.3 Generate Discrepancy Report

```markdown
## Verification Report

| # | Section | Match | Discrepancies |
|---|---|---|---|
| 1 | Navigation | ✅ Match | — |
| 2 | Hero | ⚠️ Minor | Font size slightly larger, gradient angle different |
| 3 | Features | ❌ Issue | Missing icon in card 3, wrong column count on tablet |
```

### 4.4 Fix discrepancies

For any section marked ⚠️ or ❌:
1. Fix the code
2. Re-run lint + typecheck
3. Re-screenshot and re-compare

**Iterate until all sections are ✅ Match or the user accepts the remaining minor differences.**

### 4.5 Close browser

```bash
agent-browser close
```

---

## Phase 5: Final Cleanup

### 5.1 Clean up temporary files

Remove temporary screenshots from the project root:

```bash
rm -f ./framer-ref-desktop.png ./framer-ref-tablet.png ./framer-ref-mobile.png
rm -f ./framer-impl-desktop.png ./framer-impl-tablet.png ./framer-impl-mobile.png
```

### 5.2 Present final summary

```markdown
## Framer-to-Code Complete

**Source:** [URL]
**HTML reference:** docs/framer/[page-name].html
**Implementation:** app/website/[route]/

### Files Created/Modified
- `app/website/[route]/page.tsx` — Server component with metadata
- `app/website/[route]/[Route]Content.tsx` — Main content component
- `app/website/[route]/[Route].module.css` — Custom styles
- `app/website/[route]/_components/...` — Sub-components (if applicable)
- `docs/framer/[page-name].html` — Captured reference HTML

### Section Manifest (Final)
| # | Section | HTML | Code | Verified |
|---|---|---|---|---|
| 1 | Navigation | ✅ | ✅ | ✅ |
| 2 | Hero | ✅ | ✅ | ✅ |
| ... | ... | ... | ... | ... |

### Theme Tokens Used
- Colors: [list which mktg-* families were used]
- Typography: [which heading/body sizes]
- Spacing: [which tokens]
```

Ask:
> Would you like me to commit these changes?

---

## Important Rules

0. **NEVER invent, assume, or generate text content.** This is the single most critical rule. Every piece of visible text in the implementation must exist verbatim in one of: the captured HTML (`docs/framer/[page-name].html`), the interactive content file (`docs/framer/[page-name]-interactive.md`), or the layout reference (`docs/framer/[page-name]-layout.md`). This means:
   - No making up FAQ answers — if the accordion content wasn't captured, implement the accordion in its default closed state with a `// TODO: content not captured — needs manual entry` comment
   - No generating feature descriptions, testimonial quotes, pricing plan copy, or any body text that isn't in the source
   - No placeholder copy that sounds plausible but isn't from the source
   - All un-extractable content gaps must be flagged to the user in a summary at the end of each phase
   - **A faithful skeleton with TODO comments is always better than a polished page with made-up copy.** The user can fill in real content. Fabricated content shipped to production is a defect.

1. **The Section Manifest is the source of truth.** Every section must be tracked from HTML capture through implementation through verification. If a section appears in the screenshot but not the manifest, the manifest is wrong — update it.

2. **Never skip Phase verification gates.** If HTML is incomplete, fix it before implementing. If implementation has lint errors, fix them before visual verification.

3. **Use the marketing theme exclusively.** Map every visual property to `app/website/theme.ts` tokens. The only exceptions are truly unique values not in the theme (e.g., a one-off gradient angle) — these go in CSS modules.

4. **Reuse existing components.** Always check `app/website/_components/` before creating new components. If a Navbar or Footer already exists, reuse it.

5. **Mobile-first responsive.** All layout must work at 375px (mobile), 768px (tablet), and 1440px (desktop). Use Mantine's responsive props with `base` as the mobile default.

6. **No functionality guessing.** If the reference page has interactive elements (toggles, tabs, accordions), implement them with Mantine components. If behavior is unclear from the static capture, implement the most standard behavior and flag it for the user.

7. **Preserve SEO.** Always include proper `generateMetadata()` in `page.tsx` with title, description, OpenGraph, and Twitter card metadata.

8. **Images go in `public/marketing/`.** Download referenced images or create appropriate placeholders. Never use external image URLs in the implementation.

9. **Follow existing code patterns.** The implementation should look like it belongs next to `HomeContent.tsx` and `PricingContent.tsx` — same import style, same component structure, same naming conventions.
