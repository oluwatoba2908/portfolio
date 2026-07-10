/**
 * Dexla Design System case study. Source: tobadesigner.com/dexla-design-system-case-study.
 * Text VERBATIM.
 */

import type { CaseStudy } from "./types";

const CDN =
  "https://cdn.prod.website-files.com/67bcf543dcefdae851c539cd";

export const DEXLA_DESIGN_SYSTEM: CaseStudy = {
  slug: "dexla-design-system",
  title: "Dexla's design system",
  tagline: "A scalable design system for an AI-driven builder.",
  meta: [
    { label: "Client", value: "Dexla" },
    { label: "Disciplines", value: "UX research, UI design" },
    { label: "Year", value: "2023" }
  ],
  hero: {
    src: `${CDN}/696c090751dd36aa7af6f362_dexla_case%20study%20(4).png`,
    alt: "Dexla design system hero"
  },
  sections: [
    {
      eyebrow: "Documentation 1 of 7",
      heading: "Context",
      content: [
        {
          type: "paragraph",
          text: "When I joined Dexla, things were moving fast. The company was scaling. New features were launching. Teams were growing. But the product? It was starting to feel messy. Buttons didn't match. Colours changed from page to page. And everyone, from stakeholders to developers, had their own version of what 'on brand' meant. To be honest, the only consistent thing I found when I arrived... was the logo. That's when it became clear, we needed a design system. Not just a set of pretty components, but a structure that could bring clarity to the team and help the product scale without falling apart."
        }
      ]
    },
    {
      heading: "Background",
      gallery: [
        {
          src: `${CDN}/696a2c3b592becd11f535d0b_MacBook%20Pro%2016-inch%20Space%20Black%20Front%20(3).png`,
          alt: "Dexla product on MacBook Pro"
        }
      ]
    },
    {
      eyebrow: "Documentation 2 of 7",
      heading: "Challenges",
      content: [
        {
          type: "list",
          items: [
            "The product felt inconsistent across features",
            "We couldn't move fast if every team had to re-invent the basics",
            "Developers and designers weren't speaking the same language",
            "We wasted time fixing the same visual and UX issues in every sprint"
          ]
        },
        { type: "subheading", text: "What exactly did we struggle with?" },
        {
          type: "paragraph",
          text: "We were building a comprehensive system while the product was being built, with tight deadlines, a growing team, and no brand design foundation to start from. Some challenges we ran into:"
        },
        {
          type: "list",
          items: [
            "No brand guidelines to reference",
            "Ongoing feature work that pulled attention in multiple directions",
            "Tight deadlines"
          ]
        },
        {
          type: "paragraph",
          text: "We had to rethink the experience from the ground up, not just to make it easier, but to make it comprehensive for the team and scalable for the future"
        }
      ],
      gallery: [
        {
          src: `${CDN}/69681bda939c4ffd6e46df59_Frame%202147226764.png`,
          alt: "Challenges visualisation"
        }
      ]
    },
    {
      heading: "Challenges",
      gallery: [
        {
          src: `${CDN}/68b824efafbc46b07346c6d2_Dexla%20Logo%20-%20black.png`,
          alt: "Dexla logo black"
        },
        {
          src: `${CDN}/68b824effe1f7be18370b5ea_Dexla%20logo%20-%20white.png`,
          alt: "Dexla logo white"
        }
      ]
    },
    {
      eyebrow: "Documentation 3 of 7",
      heading: "Research",
      content: [
        {
          type: "paragraph",
          text: "Before designing anything, we studied existing design systems from Google, Atlassian, and Wise. I wasn't just looking at their components; I wanted to understand their thinking, their structure, and what they might have done differently starting from zero. Most systems don't show you how they got there. That insight shaped how I approached Dexla's"
        }
      ],
      gallery: [
        {
          src: `${CDN}/68b825e3085768317d255ec0_Reseach%20image.jpeg`,
          alt: "Research image",
          caption:
            "Shows low-fidelity wireframes. I used it to experiment with layout and flows for how users browse, view"
        }
      ]
    },
    {
      eyebrow: "Documentation 4 of 7",
      heading: "Defined a clear foundation",
      content: [
        {
          type: "paragraph",
          text: "I introduced Atomic Design to help the team break down the UI into reusable pieces. We started by setting simple style rules: colour, spacing, typography, and iconography. This became our shared language. From there, I designed the core building blocks: buttons, form fields, nav bars, cards, and modals. These weren't just styles, they were flexible, with different sizes and states, so teams could actually use them across the product without needing to tweak or re-do them. Dexla's main product is a no-code app builder, so we also needed reusable UI components within the tool itself — for users, not just the internal team. I designed drag-and-drop elements that looked and felt consistent with our design language, while still being flexible for non-technical users to build their apps."
        }
      ],
      gallery: [
        {
          src: `${CDN}/68b832ad23ba0b21a95786d7_1927.png`,
          alt: "Foundation components 1"
        },
        {
          src: `${CDN}/68b8305bf7a9917b0bbdc0a0_1926%20(1).png`,
          alt: "Foundation components 2",
          caption:
            "Shows low-fidelity wireframes. I used it to experiment with layout and flows for how users browse, view"
        }
      ]
    },
    {
      eyebrow: "Documentation 6 of 7",
      heading: "Documenting the components",
      content: [
        {
          type: "paragraph",
          text: "Each component was documented with clear usage guidelines, best practices, and examples to ensure easy adoption by the entire team. This will help designers and developers implement components without ambiguity."
        }
      ],
      gallery: [
        {
          src: `${CDN}/68b82df948f9a4b6ff0e2bf5_1928.png`,
          alt: "Component documentation 1"
        },
        {
          src: `${CDN}/68b8294d3b3c779addc43137_Documentation.png`,
          alt: "Component documentation 2",
          caption:
            "Shows low-fidelity wireframes. I used it to experiment with layout and flows for how users browse, view"
        }
      ]
    },
    {
      eyebrow: "Documentation 7 of 7",
      heading: "The result",
      content: [
        {
          type: "paragraph",
          text: "The implementation of Dexla's design system brought about transformative changes:"
        },
        {
          type: "list",
          items: [
            "The team could now move faster, using shared, flexible components",
            "Developers didn't need to ask for specs or rebuild from scratch",
            "Designers had a clear system to plug into — no more guessing",
            "The product started to feel like one thing again, not five different versions"
          ]
        }
      ],
      gallery: [
        {
          src: `${CDN}/696a41d936c151197e319a12_Team%20Testimonials-1.png`,
          alt: "Team testimonials 1"
        },
        {
          src: `${CDN}/696a41d9b285e556298e9860_Team%20Testimonials.png`,
          alt: "Team testimonials 2"
        }
      ]
    },
    {
      heading: "Key takeaways",
      content: [
        {
          type: "paragraph",
          text: "This project taught me how to design for scale — not just for users, but for teams. I learned:"
        },
        {
          type: "list",
          items: [
            "How to work from zero — no Figma file, no design system, no guide",
            "How to bring designers together and keep things simple",
            "How to balance structure with flexibility, so the system grows with the team",
            "And how good documentation can save you hours of back-and-forth later"
          ]
        }
      ]
    }
  ]
};
