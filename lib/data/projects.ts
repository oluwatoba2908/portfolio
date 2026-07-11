/**
 * Project data — source: docs/webflow/homepage.md + Figma design.
 * Text and images captured VERBATIM from tobadesigner.com. Do not paraphrase.
 */

export type Project = {
  /** URL-safe slug used for internal case-study routes. */
  slug: string;
  title: string;
  description?: string;
  tags?: readonly string[];
  imageSrc: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
  external?: boolean;
};

const CDN =
  "https://cdn.prod.website-files.com/67bcf543dcefdae851c539cd";

/**
 * Homepage "Selected Projects" grid — 4 curated case studies matching the
 * Figma design. Each links to a dedicated /projects/[slug] case study page.
 */
export const HOMEPAGE_PROJECTS: readonly Project[] = [
  {
    slug: "givn",
    title: "Givn",
    imageSrc: `${CDN}/696419408ae9c71635102bb8_Frame%20(3).png`,
    imageAlt: "Givn project card",
    ctaLabel: "View project",
    ctaHref: "/projects/givn"
  },
  {
    slug: "wise-young-explorer",
    title: "Wise-Young Explorer",
    imageSrc: `${CDN}/696814aed97d34d6fb202662_Frame%203.png`,
    imageAlt: "Wise-Young Explorer project card",
    ctaLabel: "View project",
    ctaHref: "/projects/wise-young-explorer"
  },
  {
    slug: "dexla-design-system",
    title: "Dexla Design System",
    imageSrc: `${CDN}/696c0b57a4fd13b0c8e26b52_dexla_case%20study%20(5).png`,
    imageAlt: "Dexla Design System project card",
    ctaLabel: "View project",
    ctaHref: "/projects/dexla-design-system"
  },
  {
    slug: "dexla-case-study",
    title: "Dexla Case Study",
    imageSrc: `${CDN}/67c20c0e879a5292bc19afd3_Dexla%20Mockup%20(1).png`,
    imageAlt: "Dexla Case Study project card",
    ctaLabel: "View project",
    ctaHref: "/projects/dexla-case-study"
  }
] as const;

/**
 * External/experience projects — kept out of the homepage grid per the
 * Figma design. Available for a future /work page if you want the full
 * archive discoverable.
 */
export const EXTERNAL_PROJECTS: readonly Project[] = [
  {
    slug: "infragen-console",
    title: "Infragen — Console Dashboard",
    tags: ["UX/UI Design", "Webflow", "Front-end dev"],
    description:
      "I designed the console dashboard for Infragen, making AI agent systems easier to understand through research and teamwork. Using my knowledge of HTML, CSS, and JavaScript, I ensured my designs were both user-friendly and technically feasible. This project improved my problem-solving skills and deepened my understanding of AI-driven workflows.",
    imageSrc: `${CDN}/67c0d42bab19bad0f331d021_infragen-desktop-image%20(1).png`,
    imageAlt: "Infragen console dashboard",
    ctaLabel: "View site",
    ctaHref: "https://console.infragen.ai/",
    external: true
  },
  {
    slug: "infragen-website",
    title: "Infragen — Website",
    tags: ["UX/UI Design", "Webflow"],
    description:
      "Building the company's website was another exciting project. I began by designing the layout in Figma, keeping it simple, clean, and easy to navigate. Once the design was ready, I transitioned to Webflow to bring it to life. I incorporated smooth interactions, hover effects, and ensured everything functioned well on various screen sizes.",
    imageSrc: `${CDN}/67c0db0c2cd376b1a9984a9a_infragen_webflow-mockup.png`,
    imageAlt: "Infragen website mockup",
    ctaLabel: "View site",
    ctaHref: "https://www.infragen.ai/",
    external: true
  },
  {
    slug: "infragen-docs",
    title: "Infragen — Documentation",
    description:
      "I built the company's documentation site using MDX to help developers understand API endpoints. I organized the information clearly so they could find what they needed easily. This improved my technical skills and ability to simplify complex information.",
    imageSrc: `${CDN}/67c0dba3478a697cc3f78454_Infragen_docs-mockup.png`,
    imageAlt: "Infragen documentation site",
    ctaLabel: "View site",
    ctaHref: "https://docs.infragen.ai/",
    external: true
  },
  {
    slug: "dexla-app-builder",
    title: "Dexla — AI App Builder",
    tags: ["UX/UI Design", "Webflow"],
    description:
      "Dexla is an AI app builder that makes entrepreneurship accessible to anyone with an idea. As a no-code developer and UX/UI designer, I redesigned the platform, created a design system, and improved usability for non-technical users. By integrating AI and simplifying workflows, we helped business owners build web apps faster and focus on their businesses.",
    imageSrc: `${CDN}/67c21d929b576ed266c3a362_dexla%20desktop%20(1).png`,
    imageAlt: "Dexla AI app builder",
    ctaLabel: "View case study",
    ctaHref:
      "https://healthy-virgo-ef0.notion.site/Dexla-case-study-19018935188380cfb98fc3e6b2c504df",
    external: true
  },
  {
    slug: "dexla-website",
    title: "Dexla — Website",
    description:
      "This AI app builder helps business owners create web apps without coding. I designed a clear, user-friendly website that improved Dexla's digital presence. This led to more potential clients and a growing waitlist.",
    imageSrc: `${CDN}/67c21dd126f722d69160b1c0_dexla%20laptop.png`,
    imageAlt: "Dexla website",
    ctaLabel: "View site",
    ctaHref: "https://www.dexla.ai/",
    external: true
  },
  {
    slug: "flexpay",
    title: "FlexPay",
    tags: ["UX/UI Design"],
    description:
      "FlexPay provides a secure and accessible platform for saving, sending, and receiving money across borders, with a standout virtual card feature. I designed intuitive interfaces to streamline transactions, enhancing usability and visual appeal.",
    imageSrc: `${CDN}/67c37f13aae04b2cda2a3ad4_Hand%20holding%20iPhone%2016%20Pro%20mockup%20natural%20titanium.png`,
    imageAlt: "FlexPay iPhone mockup",
    ctaLabel: "View case study",
    ctaHref: "https://www.behance.net/gallery/186621611/FlexPay",
    external: true
  }
] as const;

/** The 4 case studies with dedicated internal routes. */
export const INTERNAL_CASE_STUDY_SLUGS = [
  "givn",
  "wise-young-explorer",
  "dexla-design-system",
  "dexla-case-study"
] as const;
