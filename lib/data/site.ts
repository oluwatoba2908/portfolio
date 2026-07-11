/**
 * Site-wide metadata. Single source of truth — never hardcode in components.
 */
export const SITE = {
  name: "Toba Ofomiyonwon",
  firstName: "Toba",
  role: "Product Designer",
  tagline: "Intuitive product design for software teams.",
  description:
    "Helping startups design products and build websites for over 3 years.",
  logoMark: "Toba",
  calendlyUrl: "https://calendly.com/tofomiyonwon/30min",
  socials: {
    behance: "https://www.behance.net/tofomiyonwon",
    linkedin: "https://www.linkedin.com/in/tobao77/"
  },
  copyright: "© 2026 Toba Ofomiyonwon. All rights reserved",
  homepagePortrait: {
    src: "https://cdn.prod.website-files.com/67bcf543dcefdae851c539cd/696445226dd56111ebf8ceb2_IMG_9214.JPG",
    alt: "Portrait of Toba Ofomiyonwon"
  }
} as const;
