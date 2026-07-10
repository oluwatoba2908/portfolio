/**
 * Dexla (AI app builder) case study. Source: tobadesigner.com/dexla-case-study.
 * Text VERBATIM.
 */

import type { CaseStudy } from "./types";

const CDN =
  "https://cdn.prod.website-files.com/67bcf543dcefdae851c539cd";

export const DEXLA_CASE_STUDY: CaseStudy = {
  slug: "dexla-case-study",
  title: "Dexla",
  tagline:
    "An AI app builder that lets business founders build dynamic apps from an idea",
  meta: [
    { label: "Client", value: "Dexla" },
    { label: "Role", value: "UX/UI Designer, No-code Developer" },
    { label: "Disciplines", value: "UX research, UI design, Webflow development" },
    { label: "Year", value: "2024" }
  ],
  hero: {
    src: `${CDN}/67c20c0e879a5292bc19afd3_Dexla%20Mockup%20(1).png`,
    alt: "Dexla case study hero"
  },
  sections: [
    {
      eyebrow: "Documentation 1 of 6",
      heading: "Context",
      content: [
        {
          type: "paragraph",
          text: '"Making entrepreneurship accessible to anyone with an idea." That summarises what Dexla, an AI app builder, is all about.'
        },
        {
          type: "paragraph",
          text: "Building your own app sounds exciting, until you sit down and try to do it. That is what Dexla wanted to fix. They were building an AI-powered app builder aimed at everyday business owners, not tech-savvy devs."
        },
        {
          type: "paragraph",
          text: "When I joined Dexla as a UX/UI designer and no-code developer, most of the platform was still geared toward users with low-code skills. It was not friendly for people without a technical background. So I was brought on to help redesign the platform with a team of designers."
        },
        {
          type: "paragraph",
          text: "The goal? Make building a web app feel way less confusing, and way more doable, especially for small business owners who just want to get online and get moving."
        }
      ],
      gallery: [
        {
          src: `${CDN}/68b7773017222393023a5fa8_dexla%20mockup.png`,
          alt: "Dexla mockup background"
        }
      ]
    },
    {
      eyebrow: "Documentation 2 of 6",
      heading: "Challenges",
      content: [
        {
          type: "paragraph",
          text: "Simplifying technical processes was daunting. Even with my technical stack, there was only so much I could simplify"
        },
        {
          type: "paragraph",
          text: "I struggled to balance generalising certain technical terminologies while preserving their meaning and essence."
        },
        {
          type: "paragraph",
          text: "Lastly, Dexla's platform had visual inconsistencies because it did not have a company design system. This made the redesigning process more tedious."
        },
        {
          type: "paragraph",
          text: "What exactly are users struggling with? Let's be honest, simplifying tech-related terminologies and processes is hard, even when you _do_ understand the tech. I have some background in HTML, CSS, and JavaScript, so I knew what needed simplifying. But turning all that into something a non-technical user could understand? That was a different challenge."
        },
        {
          type: "paragraph",
          text: "On top of that, the platform didn't have a **design system**, so everything looked a little off. The **terminologies** were still very developer-focused. And the actual process of positioning elements on the canvas was… confusing, and anything but user-friendly. We had to rethink the experience from the ground up — not just to make it easier, but to make it feel easier too."
        }
      ],
      gallery: [
        {
          src: `${CDN}/68b777d99219f149a5b17574_green%20BG.png`,
          alt: "Challenges visual 1"
        },
        {
          src: `${CDN}/68b7782046f7f8ac749f7707_Challenges%202.png`,
          alt: "Challenges visual 2"
        }
      ]
    },
    {
      eyebrow: "Documentation 3 of 6",
      heading: "Dexla's edge",
      content: [
        {
          type: "paragraph",
          text: "Researching Dexla's competitors revealed key gaps in existing no-code platforms, shaping my approach to designing a more intuitive and accessible interface. Many competitors, like **Retool and Flutterflow**, required technical knowledge, while others, like **Unstack and Adalo**, restricted customisation to side panels."
        },
        {
          type: "paragraph",
          text: "I saw an opportunity to simplify web app development by integrating **direct canvas editing, AI-assisted onboarding, and a structured 96-column grid system**, allowing users to build with precision while keeping the experience fluid and beginner-friendly."
        },
        {
          type: "paragraph",
          text: "A major takeaway from platforms like **Webwave and Jetadmin** was the importance of **alignment tools and spacing indicators**. Inspired by their use of **cross-hairs, rulers, and snap-to-grid mechanics**, I designed Dexla's drag-and-drop system to offer clear visual feedback, reducing frustration when positioning components. Unlike tools that required separate panels for fine-tuning, I ensured users could **adjust layout, spacing, and resizing directly on the canvas**—enhancing both speed and usability."
        },
        {
          type: "paragraph",
          text: "This research-driven approach led to a **faster, more intuitive Dexla experience** that empowers non-technical users to build apps effortlessly. By eliminating common pain points, complex terminology, rigid drag-and-drop mechanics, and hidden customisation settings, I crafted an interface that prioritises clarity, flexibility, and efficiency."
        },
        {
          type: "paragraph",
          text: "**The result?** A platform that helps entrepreneurs focus on their ideas rather than the technicalities of app building."
        }
      ],
      gallery: [
        {
          src: `${CDN}/68b779d660c908758f31d83e_Dexla%27s%20competitors.png`,
          alt: "Dexla competitors comparison",
          caption:
            "Shows low-fidelity wireframes. I used it to experiment with layout and flows for how users browse, view"
        }
      ]
    },
    {
      eyebrow: "Documentation 4 of 6",
      heading: "Proposed solutions",
      content: [
        {
          type: "paragraph",
          text: "We solved the terminology simplification by consulting with stakeholders and developers to agree on certain terms."
        },
        {
          type: "paragraph",
          text: "I led the creation of a well-structured [design system](/projects/dexla-design-system). This served as a foundation that fostered collaboration and reduced inconsistencies. Before diving into redesigning, we were torn between using either Grid or Flex to simplify positioning components onto the canvas through the drag-and-drop process."
        },
        {
          type: "paragraph",
          text: "While each approach had its advantages and drawbacks, we had to choose the solution that would best meet our target audience's needs. The team couldn't decide on either approach."
        },
        {
          type: "paragraph",
          text: "Therefore, we decided to compare both approaches by implementing each one separately. Below, I will walk you through our thought process for each solution."
        }
      ]
    },
    {
      heading: "Flex proposed solution",
      content: [
        {
          type: "paragraph",
          text: "We thought maybe a simplified version of Flexbox could work. I knew the ins and outs of flex layouts, so I figured I could hide the complexity and make it user-friendly. I designed:"
        },
        {
          type: "list",
          items: [
            "Interactive alignment lines (like crosshairs) to guide placement",
            "Tags like S, M, L, XL instead of pixel values",
            "Automatic spacing indicators between elements"
          ]
        },
        {
          type: "paragraph",
          text: "It worked… sort of. It looked great, but testing showed that performance started to dip with too many flex containers. And from a dev perspective, it would have taken months longer to go live. Not worth it. So we moved on."
        }
      ],
      gallery: [
        {
          src: `${CDN}/68b77b2e8e9f4ce591a79623_flex%20solution%202.png`,
          alt: "Flex solution 1"
        },
        {
          src: `${CDN}/68b77b984675730fe408bfb8_dexla%20gaps.png`,
          alt: "Dexla spacing gaps"
        },
        {
          src: `${CDN}/68b77b97f743eb95ebb78d51_button%20modifier.png`,
          alt: "Button modifier",
          caption:
            "Shows low-fidelity wireframes. I used it to experiment with layout and flows for how users browse, view"
        }
      ],
      galleryColumns: 3
    },
    {
      eyebrow: "Documentation 6 of 6",
      heading: "Grid proposed solution",
      content: [
        {
          type: "paragraph",
          text: "This approach used a 96-column layout behind the scenes. Components would snap into place on the canvas, stretch across columns, and scale responsively. We added:"
        },
        {
          type: "list",
          items: [
            "Hover nodes for resizing",
            "Snap-to-column logic for faster alignment",
            "No need to understand any code-like properties"
          ]
        },
        {
          type: "paragraph",
          text: "It worked. Really well. We tested it by building a full web page from scratch, and it took less than 15 minutes. And the experience felt simple, visual, and fast. Way more suited to our audience."
        },
        {
          type: "paragraph",
          text: 'Business owners could now focus on their ideas, not on fiddling with weird layout settings or wondering what "flex-direction" meant. The final version of Dexla was:'
        },
        {
          type: "list",
          items: [
            "Faster to build with",
            "Easier for non-technical users",
            "More scalable for future updates"
          ]
        }
      ],
      gallery: [
        {
          src: `${CDN}/68b77c3b5dd9878b458a6475_Grid%20approach%201.png`,
          alt: "Grid approach 1"
        },
        {
          src: `${CDN}/68b77c3b41cd240bccaf8f7b_Grid%20approach%202.png`,
          alt: "Grid approach 2",
          caption:
            "Shows low-fidelity wireframes. I used it to experiment with layout and flows for how users browse, view"
        }
      ]
    },
    {
      heading: "Key takeaways",
      content: [
        {
          type: "paragraph",
          text: "This project reminded me that simplicity is really hard to design for, but so worth it. This project taught me the importance of:"
        },
        {
          type: "list",
          items: [
            "Balancing technical feasibility with aesthetics",
            "collaborating closely with stakeholders and developers",
            "Iterating based on performance testing and real-world use cases"
          ]
        },
        {
          type: "paragraph",
          text: "Oh, and I also designed and built **Dexla's marketing site** in Webflow. You can check that out [here](https://dexla-ai.webflow.io/)"
        }
      ]
    }
  ]
};
