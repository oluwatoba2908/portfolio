/**
 * Wise — Young Explorer case study. Source: tobadesigner.com/wise-young-explorer.
 * Text VERBATIM.
 */

import type { CaseStudy } from "./types";

const CDN =
  "https://cdn.prod.website-files.com/67bcf543dcefdae851c539cd";

export const WISE_YOUNG_EXPLORER: CaseStudy = {
  slug: "wise-young-explorer",
  title: "Wise — Young Explorer",
  tagline:
    "With the Young Explorer card, each spend becomes a postcard, turning teen spending into meaningful moments for parents.",
  meta: [
    { label: "Client", value: "Wise" },
    { label: "Disciplines", value: "UX research, UI design" },
    { label: "Brief", value: "D&AD" },
    { label: "Year", value: "2025" }
  ],
  hero: {
    src: `${CDN}/6968f88518fbd41c1451ca76_Frame%203%20(2).png`,
    alt: "Wise Young Explorer hero mockup"
  },
  sections: [
    {
      heading: "Context",
      content: [
        {
          type: "paragraph",
          text: "Parents often struggle with a dilemma when their teenagers travel abroad. They want their children to be independent and explore the world, but they also need reassurance that they are safe and managing money responsibly. This creates tension because constant check-in messages feel intrusive to teens, while silence leaves parents anxious."
        },
        {
          type: "paragraph",
          text: "Current solutions, such as location tracking apps, often feel like surveillance, and traditional banking apps typically only display transaction data without providing context. Also, they reduce reassurance to raw data, limiting trust and emotional connection. This gap between parental peace of mind and teenage independence needed a design-led solution."
        },
        {
          type: "paragraph",
          text: "The D&AD brief from Wise asked: How can Young Explorer become the go-to product for parents, and how can we build loyalty that lasts beyond age 18? Money Postcards answers both questions by turning spending data into shareable stories."
        }
      ],
      gallery: [
        {
          src: `${CDN}/6968f9787b3a550f051441b4_Frame%202147226766.png`,
          alt: "Parent at home",
          caption:
            "A parent at home worried. This depict the concern and emotional tension felt by parents due to the distance."
        },
        {
          src: `${CDN}/6968f978f3ea88ff746c3840_Frame%202147226765.png`,
          alt: "Teenager at an airport",
          caption: "A teenager at an airport experiencing independence."
        }
      ]
    },
    {
      eyebrow: "Documentation 1 of 6",
      heading: "Background",
      gallery: [
        {
          src: `${CDN}/6968f9787b3a550f051441b4_Frame%202147226766.png`,
          alt: "Parent worry"
        },
        {
          src: `${CDN}/6968f978f3ea88ff746c3840_Frame%202147226765.png`,
          alt: "Teenager travelling"
        }
      ]
    },
    {
      eyebrow: "Documentation 2 of 6",
      heading: "Research",
      content: [
        {
          type: "paragraph",
          text: "Learning through real-world spending helps children develop practical money skills. However, research shows a major financial education gap, with three-quarters of children not receiving this education at home, while those who do are more confident managing money (MaPS, 2024)."
        },
        {
          type: "paragraph",
          text: "In response to this insight and the Wise Young Explorer brief, the card allows teenagers to spend independently while parents set daily or monthly limits. This supports budgeting through real experiences. While parents are encouraged to give teens independence, anxiety often remains when children travel alone. Young Explorer Money Postcards addresses this by showing parents how their teenager is managing spending during their trip, offering reassurance while supporting financial confidence."
        },
        {
          type: "paragraph",
          text: "Parental influence is also significant in long-term banking behaviour, with 39% of adults using banks chosen by their parents (TSB, 2018). This reinforces parents as the primary audience."
        },
        {
          type: "paragraph",
          text: "After analysing competitors like Revolut Junior and Greenlight, I found that most teen banking apps focus on control and tracking, offering little emotional connection. In contrast, Money Postcards reframes spending as storytelling. By turning transactions into digital postcards, it recreates the emotional value of physical postcards and keeps families connected across distance."
        }
      ],
      gallery: [
        {
          src: `${CDN}/6968fbd7aded13f7369b45b0_Frame%202147226657.png`,
          alt: "Independent banking research",
          caption:
            "This image reflects early exposure to independent banking, highlighting parental influence on long-term financial habits."
        },
        {
          src: `${CDN}/6968fbd618b3ce1d17d13567_Frame%202147226684.png`,
          alt: "Emotional growth journey",
          caption:
            "Clear, logical journey showing emotional growth and trust building over time."
        },
        {
          src: `${CDN}/6968fb920edc4416e846b4fe_Frame%202147226665.png`,
          alt: "Competitor comparison table",
          caption:
            "shows competitor comparison table evaluating Revolut Junior and Greenlight across five UX criteria with numerical ratings."
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
          text: "Since the brief mentioned advertising to parents, I explored different AI generative tools to create campaign visuals for the Young Explorer card feature."
        }
      ],
      gallery: [
        {
          src: `${CDN}/6968febba8685a0b9cd576a1_Frame%202147226770.png`,
          alt: "Shared tracking experience",
          caption:
            "Reframes tracking as a shared, reassuring experience. Created using Unicorn Studio"
        },
        {
          src: `${CDN}/6968fe19439ee897c31e233f_Frame%202147226768.png`,
          alt: "Postcard-style typography",
          caption:
            "Hand-stamped postcard-style typography shows authenticity. Created using space type generator"
        },
        {
          src: `${CDN}/6968fe18e33b759b2ccf062d_Frame%202147226767.png`,
          alt: "Modern take on money management",
          caption:
            "Shows a modern, playful, premium take on money management, created with Unicorn Studio."
        },
        {
          src: `${CDN}/6968febc6dd5b1b380927e5c_Frame%202147226769.png`,
          alt: "Independence and reassurance",
          caption:
            "Balances teen independence with parent reassurance. Created using Unicorn Studio"
        }
      ]
    },
    {
      eyebrow: "Documentation 4 of 6",
      heading: "Experimentation",
      content: [
        {
          type: "paragraph",
          text: "Alongside this, I created early sketches for key screens needed for the Money Postcards flow. These sketches helped shape the user journey before moving into high-fidelity designs, while keeping the feature aligned with Wise's existing mobile application."
        },
        {
          type: "paragraph",
          text: "To stay consistent with Wise, I worked within their existing design system rather than creating a new visual language. I studied Wise's brand guidelines, colour palette (Wise green #9FE870), and component patterns, and used them as a foundation for experimentation. I created some dark-themed components and variants for repeated layouts across the application."
        },
        {
          type: "paragraph",
          text: "which I presented my idea and I got some constructive feedback and this prompted me to create a special Wise card design for the young explorer feature. Also, there was a need to specify that it is a new feature.I was able to make the necessary adjustments after my presentation."
        }
      ],
      gallery: [
        {
          src: `${CDN}/69690258d90fcb55d9c17aba_Frame%202147226420.png`,
          alt: "Money Postcards sketches",
          caption:
            "Shows sketches mapping Money Postcards screens to clarify the structure for 3D postcard flips, trip insights, and spending categories in the summary view."
        },
        {
          src: `${CDN}/69690258439ee897c31f9162_Frame%202147226419.png`,
          alt: "Sketch iterations",
          caption:
            "Shows sketches mapping Money Postcards screens to clarify the structure for 3D postcard flips, trip insights, and spending categories in the summary view."
        },
        {
          src: `${CDN}/69690258d90fcb55d9c17ab7_Frame%202147226663.png`,
          alt: "Wise reusable components",
          caption:
            "A few reusable Wise components and variants were created to ensure consistency across Young Explorer and Money Postcards flows."
        },
        {
          src: `${CDN}/6969029bb3baa4b3860badd6_Frame%202147226667.png`,
          alt: "Class presentation",
          caption:
            "Shows my presentation to the class during week 12 of the module."
        },
        {
          src: `${CDN}/696903d1129cab35ee5a3375_Frame%202147226692.png`,
          alt: "Feedback incorporation",
          caption:
            'Shows how I incorporated the feedback from my presentation. I added "new" badges to indicate new features.'
        },
        {
          src: `${CDN}/69690471b97507e05ec96f50_card%20-%20visa%20(2).png`,
          alt: "Card visual exploration",
          caption:
            "Card visual exploration using Wise's colour palette, testing brand consistency."
        }
      ],
      galleryColumns: 3
    },
    {
      heading: "Innovation",
      content: [
        {
          type: "paragraph",
          text: "The innovation in Money Postcards is turning everyday spending into a shared family experience. Instead of acting like a typical teen banking app focused on control, Money Postcards reframes spending as storytelling."
        },
        {
          type: "paragraph",
          text: "First, updates are created automatically. Parents receive daily postcards without teens needing to check in or explain themselves. This keeps the experience easy and natural."
        },
        {
          type: "paragraph",
          text: 'Second, spending is shown emotionally, not numerically. Rather than seeing a transaction like "£42 spent," parents see a day in Rome, with places visited and a short message.'
        },
        {
          type: "paragraph",
          text: "Third, the feature benefits both sides. Teens learn responsibility and independence, while parents gain reassurance."
        },
        {
          type: "paragraph",
          text: "Over time, these postcards become a growing record of the teen's journey. By the time they turn 18, they hold hundreds of memories tied to Wise."
        }
      ],
      gallery: [
        {
          src: `${CDN}/69690657f5bbeba5eeb5b9ec_Frame%202147226663%20(1).png`,
          alt: "Refined screens",
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
          text: "For parents, Young Explorer Money Postcards offers daily postcards, spending shown in context, and reassurance without intrusion."
        },
        {
          type: "paragraph",
          text: "For Wise, this idea builds long-term loyalty through emotional attachment and uses parent influence to support retention."
        },
        {
          type: "paragraph",
          text: "The interface evolved from initial sketches and iterative feedback, ensuring it remains clear, emotional, and consistent with Wise's design system. Money Postcards shows that banking can build trust, not just track money."
        },
        {
          type: "paragraph",
          text: "This shifts teen banking from control to connection. It supports financial learning through real experiences, while giving parents confidence without constant oversight. This balance between independence and reassurance positions Young Explorer as more than a card, but as a tool that grows with families over time."
        }
      ],
      gallery: [
        {
          src: `${CDN}/696907f49734e6ebd6a6fe5a_Free%20Transparent%20iPhone%20Air%20Mockup%20(Mockuuups%20Studio)-6.png`,
          alt: "Young Explorer mockup 1"
        },
        {
          src: `${CDN}/696907f45331a76b4d3308d3_Free%20Transparent%20iPhone%20Air%20Mockup%20(Mockuuups%20Studio)-4.png`,
          alt: "Young Explorer mockup 2"
        },
        {
          src: `${CDN}/696907f2707ee50d847bb818_Free%20Transparent%20iPhone%20Air%20Mockup%20(Mockuuups%20Studio)-3.png`,
          alt: "Young Explorer mockup 3"
        },
        {
          src: `${CDN}/696907f470046f54ec2e12eb_Free%20Transparent%20iPhone%20Air%20Mockup%20(Mockuuups%20Studio)-1.png`,
          alt: "Young Explorer mockup 4"
        },
        {
          src: `${CDN}/696907f4b9d2464e3ee9030f_Free%20Transparent%20iPhone%20Air%20Mockup%20(Mockuuups%20Studio).png`,
          alt: "Young Explorer mockup 5"
        }
      ],
      galleryColumns: 3
    }
  ]
};
