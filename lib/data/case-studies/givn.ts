/**
 * Givn case study — source: docs/webflow/projects/givn.md.
 * Text VERBATIM. Do not paraphrase.
 */

import type { CaseStudy } from "./types";

const CDN =
  "https://cdn.prod.website-files.com/67bcf543dcefdae851c539cd";

export const GIVN: CaseStudy = {
  slug: "givn",
  title: "Givn",
  tagline:
    "A community application for sustainable reuse through reuse and donations.",
  meta: [
    { label: "Disciplines", value: "UX research, UI design" },
    { label: "Year", value: "2025" }
  ],
  hero: {
    src: `${CDN}/6967f457606b6c17873c2beb_Frame%202147226746%20(1).png`,
    alt: "Givn hero mockup"
  },
  sections: [
    {
      eyebrow: "Documentation 1 of 6",
      heading: "Context",
      content: [
        {
          type: "paragraph",
          text: "People often hold onto items they no longer need until clutter becomes uncomfortable, leading many usable items to be thrown away. This contributes to growing landfill waste and increased carbon emissions. Givn was created in response to this problem as a community-based platform that encourages local donation and reuse."
        },
        {
          type: "paragraph",
          text: "The project grew out of earlier work on Ryderr, which focused on social impact through affordability but ultimately addressed a business challenge rather than a design-led one. This shift led to Givn, a solution aligned with SDG 12, aiming to reduce waste, promote reuse, and strengthen community-driven sustainability."
        }
      ]
    },
    {
      heading: "Background",
      gallery: [
        {
          src: `${CDN}/6967fbd2114b916c488d2520_Frame%202147226650%20(1).png`,
          alt: "Background research diagram"
        },
        {
          src: `${CDN}/6967fbd2313af8ad6a2c34e1_sdg_icons_color_goal_10.png`,
          alt: "SDG Goal 10",
          caption:
            "Ryder reduced inequality by making transport access more affordable for both low- and high-income users through prepaid plans."
        },
        {
          src: `${CDN}/6968c4d0a7162f691705d49e_Desktop%20-%205%20(1).png`,
          alt: "Desktop background research"
        },
        {
          src: `${CDN}/6967fbd29ac8a610021093d9_sdg_icons_color_goal_12%20(1).png`,
          alt: "SDG Goal 12",
          caption:
            "In accordance with SDG 12, Givn focuses on reducing waste through donation and reuse."
        }
      ]
    },
    {
      eyebrow: "Documentation 2 of 6",
      heading: "Research",
      content: [
        {
          type: "paragraph",
          text: "To understand the problem Givn addresses, I explored both the scale of global waste and the behaviours driving it. Research shows that over two billion tonnes of waste are generated globally each year globally, closely linked to human development (Statista, n.d.)."
        },
        {
          type: "paragraph",
          text: "To complement this, I conducted a user survey to understand everyday disposal habits. Insights from the Organisation for Economic Co-operation and Development (OECD) revealed that while people are aware of sustainable behaviours, they only adopt them when they are convenient, affordable, and accessible."
        },
        {
          type: "paragraph",
          text: "This was reflected in my survey, where most participants aged 19–45+ showed strong interest in reuse. As ideas began to feel broad and overwhelming, I narrowed my focus to key user types and their pain points. Through empathy mapping and journey mapping, I gained clarity on user expectations and frustrations. I then reviewed existing platforms and identified clear gaps, particularly in areas such as impact transparency, community engagement, and motivation. These insights shaped Givn's direction, positioning it as a rewarding, impact-driven alternative to traditional marketplaces."
        }
      ],
      gallery: [
        {
          src: `${CDN}/696801cd830003a2ecfeae54_Frame%202147226649%20(1).png`,
          alt: "Landfill cycle diagram",
          caption:
            "Human development continues, but Givn focuses on breaking the landfill cycle through reuse and donation."
        },
        {
          src: `${CDN}/696801aa5a7ae2cad8324bd9_Frame%202147226418.png`,
          alt: "OECD survey findings",
          caption:
            "The OECD finding aligns with my survey results, where 55.6% of participants do not use reuse platforms, highlighting accessibility and convenience as key barriers that informed Givn's simplified reuse flow."
        },
        {
          src: `${CDN}/696801abd1d521d29e9e31d6_Frame%202147226764.png`,
          alt: "Reuse behaviour chart",
          caption:
            "Shows that users choose the most convenient option, such as giving items to friends or family (77.8%). For items that could not be passed on to close contacts, 55.6% of respondents stated that they usually bin them."
        },
        {
          src: `${CDN}/696801abbc1afa512ac00188_Frame%202147226765.png`,
          alt: "Gamified sustainability data",
          caption:
            "Figure 1.2.4 shows that 66.7% of participants strongly preferred gamified sustainable behaviours. This insight aligns with Jo Tyndall's emphasis on incentives. This justified including rewards and points in my design."
        },
        {
          src: `${CDN}/696801ac17958186a3e6c712_Frame%202147226751.png`,
          alt: "Empathy map",
          caption:
            "This empathy map shows that users want to act sustainably, but often choose the easiest option instead. It clearly exposes a gap between what users feel and what they actually do, showing why simpler, more convenient, impact transparent solutions are needed to support better behaviour."
        },
        {
          src: `${CDN}/696801abad90a505bdd59f05_Frame%202147226750.png`,
          alt: "Journey map",
          caption: "Shows a detailed journey map"
        }
      ],
      galleryColumns: 3
    },
    {
      eyebrow: "Documentation 3 of 6",
      heading: "Workshop",
      content: [
        {
          type: "paragraph",
          text: "I explored three core functions: swapping, requesting, and donating items. While these ideas were useful, I decided to focus only on donations to reduce complexity and cognitive overload. This helped create a clearer mental model and simpler user flows that better support the SDG goal of reducing waste. This decision influenced several early UI sketches."
        },
        {
          type: "paragraph",
          text: "This shift also led to a simpler navigation bar with four main tabs, including Activity. The Activity tab supports the in-person pickup flow by tracking walking distance and showing users the environmental impact of their actions."
        }
      ],
      gallery: [
        {
          src: `${CDN}/6968056325f52f4b2704dcd5_Frame%202147226419-1.png`,
          alt: "Early working title exploration",
          caption:
            "Explores an early working title and logo for the project. At this stage, I did not realise they were too generic."
        },
        {
          src: `${CDN}/6968056490ba2268404be00b_Frame%202147226419.png`,
          alt: "Swipe gestures exploration",
          caption:
            "Figure 1.3.2 explores swipe gestures. These were removed to align with Jakob's Law and match common two-column marketplace browsing layout."
        },
        {
          src: `${CDN}/6968056414940201f0f15aac_Frame%202147226419-3.png`,
          alt: "Environmental impact tracking sketch",
          caption:
            "Explores making environmental impact visible through real-time walking and pickup tracking to encourage sustainable behaviour."
        },
        {
          src: `${CDN}/6968056468c449d5e317ff27_Frame%202147226419-2.png`,
          alt: "Core functionalities sketch",
          caption:
            "Shows multiple core functionalities. Once I decided to focus on simplicity, I removed the urgent requests and quick actions sections."
        }
      ]
    },
    {
      eyebrow: "Documentation 4 of 6",
      heading: "Experimentation",
      content: [
        {
          type: "paragraph",
          text: "At this stage, I had a clearer direction and began creating low-fidelity designs for key screens such as the dashboard, browse, item details, and impact overview. To maintain consistency, I introduced reusable components and layout variants, which later evolved into a design system. Defining typography, colours, and button styles early helped speed up iteration and reduce visual inconsistencies."
        },
        {
          type: "paragraph",
          text: "The project was renamed from ReUseIt to Givn to create a simpler and more memorable identity. I then moved into high-fidelity designs, iterating based on research insights, usability considerations, and feedback."
        },
        {
          type: "paragraph",
          text: "Many designs changed significantly from early sketches, revealing unnecessary complexity. Presenting these iterations highlighted key improvements, including simplifying pickup tracking, refining the dashboard, improving impact visibility, and increasing text size for accessibility, helping shape a clearer and more usable final experience."
        }
      ],
      gallery: [
        {
          src: `${CDN}/6968088e17958186a3e888c9_Frame%202147226668.png`,
          alt: "Low-fidelity wireframes",
          caption:
            "Shows low-fidelity wireframes. I used it to experiment with layout and flows for how users browse, view"
        },
        {
          src: `${CDN}/6968088fe105d327aab724a5_Frame%202147226764.png`,
          alt: "Refined components",
          caption:
            "Shows refined components and variants which made iterations easier across all created screens."
        },
        {
          src: `${CDN}/6968088f2d585d3bd7d77d8d_Frame%202147226765.png`,
          alt: "Design system in progress",
          caption:
            "This design system supported faster iteration, visual consistency, and clearer usability decisions across all high-fidelity screens."
        },
        {
          src: `${CDN}/6968088dca6bd1b8ca646ab4_Frame%202147226419.png`,
          alt: "Altron A typeface exploration",
          caption:
            'The Altron "A" typeface provided a strong geometric base but needed refinement to read as a "G."'
        },
        {
          src: `${CDN}/6968088d1607aa49892c8bd9_Frame%202147226419-1.png`,
          alt: "Letter rotation exploration",
          caption:
            "This led to experimentation by rotating the letter 90° to the left, revealing a new form of shape."
        },
        {
          src: `${CDN}/6968088e37525d40de87f376_Frame%202147226419-3.png`,
          alt: "Logo tracing in Figma",
          caption:
            'Tracing the letter on figma helping the logo read as a "G" while retaining a minimal and abstract feel.'
        }
      ],
      galleryColumns: 3
    },
    {
      eyebrow: "Documentation 5 of 6",
      heading: "Innovation",
      content: [
        {
          type: "paragraph",
          text: "The innovation in Givn lies in turning everyday donation into a visible, rewarding action. Rather than functioning as a traditional marketplace, Givn focuses on making environmental impact transparent through real-time metrics, walking-based pickup tracking, points and rewards progression."
        },
        {
          type: "paragraph",
          text: "By combining impact tracking, local community engagement, and gentle gamification, Givn encourages users to build sustainable habits without added effort. This approach reframes reuse as a positive, trackable action, making climate-conscious behaviour feel achievable, personal, and motivating."
        }
      ],
      gallery: [
        {
          src: `${CDN}/69690dd1944b909aab8c8e77_Frame%202147226663.png`,
          alt: "Refined screens after iteration",
          caption:
            "Highlights refined screens after iteration, showing clearer flows, reduced complexity, and stronger alignment with core goals."
        }
      ]
    },
    {
      eyebrow: "Documentation 6 of 6",
      heading: "Outcome",
      content: [
        {
          type: "paragraph",
          text: "The outcomes of Givn bring together research, iteration, and refinement into a clear, usable solution. The app successfully translates everyday donations into a structured flow that highlights impact, rewards, and community involvement."
        },
        {
          type: "paragraph",
          text: "Through multiple design iterations, the interface evolved to prioritise clarity, reduce cognitive load, and provide visible environmental value."
        },
        {
          type: "paragraph",
          text: "Together, these outcomes show how Givn moves beyond a traditional online markeplace platform by making sustainable behaviour visible, rewarding, and easy to maintain over time."
        }
      ],
      gallery: [
        {
          src: `${CDN}/69680d7768f56c5c78c97231_Free%20Transparent%20iPhone%20Air%20Mockup%20(Mockuuups%20Studio).png`,
          alt: "Givn iPhone mockup 1"
        },
        {
          src: `${CDN}/69680d77bf9403c5381c2282_Free%20Transparent%20iPhone%20Air%20Mockup%20(Mockuuups%20Studio)-1.png`,
          alt: "Givn iPhone mockup 2"
        },
        {
          src: `${CDN}/69680d77a9d884fd446efa5f_Free%20Transparent%20iPhone%20Air%20Mockup%20(Mockuuups%20Studio)-2.png`,
          alt: "Givn iPhone mockup 3"
        },
        {
          src: `${CDN}/69680d76cb07e0647af39aa7_Free%20Transparent%20iPhone%20Air%20Mockup%20(Mockuuups%20Studio)-3.png`,
          alt: "Givn iPhone mockup 4"
        },
        {
          src: `${CDN}/696811e453730f7a8fe634c8_Free%20Transparent%20iPhone%2017%20Mockup%20(Mockuuups%20Studio).png`,
          alt: "Givn iPhone 17 mockup"
        },
        {
          src: `${CDN}/69680d76f88f69435b868d39_Free%20Transparent%20iPhone%20Air%20Mockup%20(Mockuuups%20Studio)-4.png`,
          alt: "Givn iPhone mockup 5"
        }
      ],
      galleryColumns: 3
    }
  ]
};
