# Homepage — Content Bible

> **Source:** https://www.tobadesigner.com/
> **Captured:** 2026-07-10
> **Method:** WebFetch (markdown extraction — no computed CSS or screenshots)
> **Reliability:** Content = high; layout/styles = manual visual reference against the live site

---

## ⚠ Notes from capture — verify with the user before implementing

1. **Duplicate-looking project section.** The report lists 10 projects in the primary "Selected Projects" area (Givn, Wise-Young Explorer, Dexla Design System, Dexla Case Study, Infragen ×3, Dexla ×2, FlexPay) AND a shorter Additional Projects Listed block (Dexla Design System, Dexla Case Study, FlexPay, Airstride). This may be one CMS collection rendered twice, or a draft section. Confirm on the live site.
2. **Two "about-me" hrefs exist**: `/about-toba` (for "More about me" CTA) and `/about` (for "Read more" CTA). One of these is likely a broken/legacy link. Confirm which is canonical.
3. **Alternate hero heading** was extracted: "A product designer crafting thoughtful experiences for modern software teams." plus "Hi, I'm **Toba**. I have spent the last 3 years helping startups design and build better products. Here's some of my work." This may be from a hidden alt hero, an A/B variant, or a draft. Confirm.
4. **SEO metadata not captured** (title / description / og:image / favicon). Will need manual entry or a follow-up capture that reads `<head>`.

---

## Navigation

| Position | Link Text | href | New tab |
|---|---|---|---|
| 1 | About me | /about-toba | No |
| 2 | Contact | /contact-me | No |

*(Home is implicit — logo click.)*

---

## Hero Section

**Headline (verbatim):**
> Intuitive product design for software teams.

**Subheadline (verbatim):**
> Helping startups design products and build websites for over 3 years.

**Primary CTA:**
- Label: `View projects`
- href: `#Selected-projects-section`

**Hero visuals:**
- Toba portrait with caption "Hover to know my name" → `IMG_9214.JPG`
- Tool logos beside/around portrait: Figma, Adobe XD (or similar), VS Code

---

## About Section ("Hi, I am Toba")

**Heading (verbatim):**
> Hi, I am Toba

**Paragraph (verbatim):**
> I can solve a Rubik's cube in 1:15, but that's just one way I keep my hands busy. When I'm off work, I sketch portraits with charcoal on alabaster paper, and recently dove into canvas painting. My path to UI/UX design started with a mathematical mix-up – I thought it was related to dy/dx calculus. That confusion led to a two-year journey of crafting digital spaces people love to use

**CTAs:**
- Label: `More about me` → `/about-toba`
- Label: `Read more` → `/about` ⚠ verify canonical

**Images:**
- `tobas's image-hero.png` — primary portrait
- `IMG_7233 1.png` — secondary image

---

## Selected Projects Section

*Every project has: title, optional tags, optional description, CTA label, CTA href, and image URL. Descriptions below are VERBATIM.*

### 1. Givn
- CTA: `View project` → `/givn-copy-2`
- Image: `Frame (3).png`

### 2. Wise-Young Explorer
- CTA: `View project` → `/wise-young-explorer`
- Image: `Frame 3.png`

### 3. Dexla Design System
- CTA: `View project` → `/dexla-design-system-case-study`
- Image: `dexla_case study (5).png`

### 4. Dexla Case Study
- CTA: `View project` → `/dexla-case-study`
- Image: `Dexla Mockup (1).png`

### 5. Infragen — Console Dashboard
- Tags: `UX/UI Design`, `Webflow`, `Front-end dev`
- Description: *"I designed the console dashboard for Infragen, making AI agent systems easier to understand through research and teamwork. Using my knowledge of HTML, CSS, and JavaScript, I ensured my designs were both user-friendly and technically feasible. This project improved my problem-solving skills and deepened my understanding of AI-driven workflows."*
- CTA: `View site` → https://console.infragen.ai/
- Image: `infragen-desktop-image (1).png`

### 6. Infragen — Website
- Tags: `UX/UI Design`, `Webflow`
- Description: *"Building the company's website was another exciting project. I began by designing the layout in Figma, keeping it simple, clean, and easy to navigate. Once the design was ready, I transitioned to Webflow to bring it to life. I incorporated smooth interactions, hover effects, and ensured everything functioned well on various screen sizes."*
- CTA: `View site` → https://www.infragen.ai/
- Image: `infragen_webflow-mockup.png`

### 7. Infragen — Documentation
- Description: *"I built the company's documentation site using MDX to help developers understand API endpoints. I organized the information clearly so they could find what they needed easily. This improved my technical skills and ability to simplify complex information."*
- CTA: `View site` → https://docs.infragen.ai/
- Image: `Infragen_docs-mockup.png`

### 8. Dexla — AI App Builder
- Tags: `UX/UI Design`, `Webflow`
- Description: *"Dexla is an AI app builder that makes entrepreneurship accessible to anyone with an idea. As a no-code developer and UX/UI designer, I redesigned the platform, created a design system, and improved usability for non-technical users. By integrating AI and simplifying workflows, we helped business owners build web apps faster and focus on their businesses."*
- CTA: `View case study` → https://healthy-virgo-ef0.notion.site/Dexla-case-study-19018935188380cfb98fc3e6b2c504df
- Image: `dexla desktop (1).png`

### 9. Dexla — Website
- Description: *"This AI app builder helps business owners create web apps without coding. I designed a clear, user-friendly website that improved Dexla's digital presence. This led to more potential clients and a growing waitlist."*
- CTA: `View site` → https://www.dexla.ai/
- Image: `dexla laptop.png`

### 10. FlexPay
- Tags: `UX/UI Design`
- Description: *"FlexPay provides a secure and accessible platform for saving, sending, and receiving money across borders, with a standout virtual card feature. I designed intuitive interfaces to streamline transactions, enhancing usability and visual appeal."*
- CTA: `View case study` → https://www.behance.net/gallery/186621611/FlexPay
- Image: `Hand holding iPhone 16 Pro mockup natural titanium.png`

### ⚠ Additional Projects block (may be duplicate)

- **Dexla Design System** → `/dexla-design-system` — image: `Dexla Case Study image.png`
- **Dexla Case Study** — snippet: *"An AI app builder that allows business owners to build dynamic apps from an idea..."* → `/dexla` — image: `Dexla Mockup (1).png`
- **FlexPay** — snippet: *"A mobile app blending tech and finance for smarter money management"* → `/flexpay-project` — image: `FlexPay Case Study image.png`
- **Airstride** — snippet: *"The product uses AI to help businesses build and manage distribution partnerships more efficiently."* → `#` (dead link) — image: `Card (3).png`

---

## Testimonials Section

**Section heading (verbatim):**
> Take their words for it.

### 1. Ali Ashfaq
- Role: Senior UX/UI designer
- Company: [not captured]
- Avatar: `ALI ASHFAQ.jpeg`
- Quote: *"I am delighted to provide a recommendation for Toba, with whom I had the privilege of collaborating closely during his tenure at letsremotify. Throughout this period, I had the chance to observe his extraordinary talents and unwavering commitment. Toba is an exceptional UI/UX professional, possessing remarkable problem-solving abilities, leadership skills, and technical expertise. He consistently exhibited a deep understanding of the remote work environment."*

### 2. Victor Emokpare
- Role: Product designer
- Company: Zummit Africa
- Avatar: `victor zummit.jpeg`
- Quote: *"I had the pleasure of working alongside Toba during our tenure at Zummit Africa. Toba is an innovative designer, consistently introducing fresh ideas to our projects. His dedication to learning and exceptional listening skills set him apart, and he consistently pushed boundaries to ensure the best possible outcomes. I wholeheartedly recommend Toba for any endeavor he takes on"*

### 3. Onyeka Kingsley
- Role: No code developer
- Company: [not captured]
- Avatar: `Onyeka Kingsley.jpeg`
- Quote: *"Great to work with and very quick to implement changes at any time. Top mentality and a great fit for any company."*

### 4. Mehria Akhtar
- Role: Senior growth executive
- Company: letsremotify
- Avatar: `Mehria.jpeg`
- Quote: *"I am pleased to write a recommendation for Toba, whom I had the pleasure of working closely with at letsremotify. , I had the opportunity to witness his exceptional skills and dedication firsthand. Toba is an outstanding UI/UX with a remarkable ability to problem-solving, leadership, technical proficiency. He consistently demonstrated a keen understanding of the remote work landscape."*

### 5. Williams Balogun
- Role: Full stack engineer
- Company: Dexla Inc
- Avatar: `Ellipse 670.png`
- Quote: *"Working with Toba at Dexla Inc was a pleasure. As a Product Designer and No-Code Developer, he brought a rare balance of creativity and practicality to every project. His designs weren't just visually polished—they were thoughtful, prioritizing user needs while staying aligned with technical constraints. Toba's no-code expertise streamlined workflows for our team, and his willingness to bridge design and development made him a trusted partner for engineers and PMs alike. If you value designers who care as much about functionality as aesthetics, Toba is a perfect fit."*

---

## Call-to-Action Section

**Heading (verbatim):**
> Let's work together

**Body:** [Not captured — verify live site]

**CTAs:**
- `Behance` → https://www.behance.net/tofomiyonwon (new tab)
- `LinkedIn` → https://www.linkedin.com/in/tobao77/ (new tab)

---

## Footer

**Copyright (verbatim):**
> © 2026 Toba Ofomiyonwon. All rights reserved

**Column: Brand**
- Logo → `/`

**Column: Socials**
- Behance → https://www.behance.net/tofomiyonwon
- LinkedIn → https://www.linkedin.com/in/tobao77/

**Column: Pages**
- Home → `/`
- About me → `/about-toba`
- Contact → `/contact-me`

**⚠ Alternate footer link set** (may be duplicate rendering):
- Projects → `#projects`
- About → `/about`
- Contact → https://calendly.com/tofomiyonwon/30min

---

## SEO Metadata

- Page title: [not captured — needs `<head>` inspection]
- Meta description: [not captured]
- OG image: [not captured]
- Favicon: [not captured]
