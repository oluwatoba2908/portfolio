// Auto-generated from Portfolio/lib/data/case-studies/*.ts — content VERBATIM.

/**
 * Givn case study — source: docs/webflow/projects/givn.md.
 * Text VERBATIM. Do not paraphrase.
 */


const CDN =
  "https://cdn.prod.website-files.com/67bcf543dcefdae851c539cd";

const GIVN = {
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
          src: "assets/givn-bg-1.png",
          alt: "SDG Goal 10",
          caption:
            "Ryder reduced inequality by making transport access more affordable for both low- and high-income users through prepaid plans."
        },
        {
          src: "assets/givn-bg-2.png",
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
          caption: "Testing layout and flows early for browsing, viewing items, and seeing impact.",
          span: true
        },
        {
          src: `${CDN}/6968088fe105d327aab724a5_Frame%202147226764.png`,
          alt: "Refined components",
          span: true,
          caption:
            "Shows refined components and variants which made iterations easier across all created screens."
        },
        {
          src: `${CDN}/6968088f2d585d3bd7d77d8d_Frame%202147226765.png`,
          alt: "Design system in progress",
          span: true,
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
        },
        {
          src: "assets/givn-exp-logo-gradient.png",
          alt: "Green gradient G logo",
          caption:
            "The use of a green gradient reinforces the sustainability theme of the project."
        },
        {
          src: "assets/givn-exp-highfi.png",
          alt: "High-fidelity iterations",
          span: true,
          caption:
            "Shows high-fidelity iterations that revealed complex and unfeasible flows during prototype testing, leading to further refinements and iteration."
        },
        {
          src: "assets/givn-exp-presentation.png",
          alt: "Presentation photos",
          span: true,
          caption:
            "Shows images during presentation. The feedback from the presentation revealed usability gaps and helped refine flows and improve readability."
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


/**
 * Wise — Young Explorer case study. Source: tobadesigner.com/wise-young-explorer.
 * Text VERBATIM.
 */


/* CDN reused */

const WISE_YOUNG_EXPLORER = {
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
        },
        {
          src: "assets/wise-outcome-rome.png",
          alt: "Rome school tour trip insights",
          caption: "A real school trip showed parents following spend as reassurance, not surveillance."
        }
      ],
      galleryColumns: 3
    }
  ]
};


/**
 * Dexla (AI app builder) case study. Source: tobadesigner.com/dexla-case-study.
 * Text VERBATIM.
 */


/* CDN reused */

const DEXLA_CASE_STUDY = {
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
          alt: "Dexla mockup background",
          caption: "An AI builder aimed at founders, not developers, which set the whole design constraint."
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
          alt: "Challenges visual 1",
          caption: "Developer-style layout controls asked non-technical founders to think in code concepts."
        },
        {
          src: `${CDN}/68b7782046f7f8ac749f7707_Challenges%202.png`,
          alt: "Challenges visual 2",
          caption: "Every unexplained property was another place a first-time builder could stall."
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
          caption: "Rivals served technical users well, leaving non-technical founders as the open opportunity."
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
          alt: "Flex solution 1",
          caption: "Flex mirrored how developers reason, which is precisely the wrong mental model here."
        },
        {
          src: `${CDN}/68b77b984675730fe408bfb8_dexla%20gaps.png`,
          alt: "Dexla spacing gaps",
          caption: "Spacing behaved unpredictably, so users fought the canvas instead of building pages."
        },
        {
          src: `${CDN}/68b77b97f743eb95ebb78d51_button%20modifier.png`,
          alt: "Button modifier",
          caption: "Exposing modifier settings shifted effort onto the user rather than the system."
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
          alt: "Grid approach 1",
          caption: "A 96-column grid did the reasoning invisibly, so components simply snapped into place."
        },
        {
          src: `${CDN}/68b77c3b41cd240bccaf8f7b_Grid%20approach%202.png`,
          alt: "Grid approach 2",
          caption: "Testing proved it: a full page built from scratch in under fifteen minutes."
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
          text: "Oh, and I also designed and built **Dexla's marketing site** in Webflow. You can check it out [here](https://dexla-ai.webflow.io/)."
        }
      ]
    }
  ]
};


/**
 * Dexla Design System case study. Source: tobadesigner.com/dexla-design-system-case-study.
 * Text VERBATIM.
 */


/* CDN reused */

const DEXLA_DESIGN_SYSTEM = {
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
          alt: "Dexla product on MacBook Pro",
          caption: "A fast-growing product shipping inconsistent interfaces needed one shared visual language."
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
          src: `${CDN}/68b824efafbc46b07346c6d2_Dexla%20Logo%20-%20black.png`,
          alt: "Dexla logo black",
          caption: "Without a system, each feature reinvented components and drifted further apart."
        },
        {
          src: `${CDN}/68b824effe1f7be18370b5ea_Dexla%20logo%20-%20white.png`,
          alt: "Dexla logo white",
          caption: "Inconsistency slowed delivery and made the product feel unfinished to users."
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
          caption: "Auditing existing screens exposed duplicated patterns and the gaps worth systemising first."
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
          src: "assets/dexla-foundation.png",
          alt: "Design system foundation: style guide, typography, colours, buttons, atomic components",
          caption: "Typography, colour, and atomic components gave every later screen a dependable base."
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
          src: "assets/dexla-documenting.png",
          alt: "Component documentation: alerts, avatars, accordions, search & input fields, modals",
          caption: "Documented usage rules meant developers could implement components without guessing intent."
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
          alt: "Team testimonials 1",
          caption: "Designers and developers shipped faster because decisions were already made in the system."
        },
        {
          src: `${CDN}/696a41d9b285e556298e9860_Team%20Testimonials.png`,
          alt: "Team testimonials 2",
          caption: "Consistency stopped being a review comment and became the product's default state."
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



/* Airstride platform case study (founding designer). Verified metrics only. */
const AIRSTRIDE = {
  slug: "airstride",
  title: "Airstride",
  tagline: "Rebuilding the partner platform so it stopped losing deals and started winning them.",
  meta: [
    { label: "Role", value: "Founding Designer" },
    { label: "Since", value: "May 2025" },
    { label: "Type", value: "B2B SaaS partner platform" }
  ],
  hero: {
    src: "assets/airstride-cover.png",
    alt: "Airstride platform overview dashboard"
  },
  sections: [
    {
      heading: "Overview",
      content: [
        { type: "paragraph", text: "Airstride helps companies find, manage, and grow their business partners. As the founding designer, I led a **screen-by-screen redesign across 6 major areas of the platform**. It was not a fresh coat of paint. The old interface was costing the business real deals, so I rebuilt the core experience around **clarity, trust, and a build that matched the design**." }
      ]
    },
    {
      heading: "The problem",
      content: [
        { type: "paragraph", text: "**The product was creating friction for users and undermining confidence in Airstride.** 2 connected problems stood out." },
        { type: "paragraph", text: "**First, users were struggling to reach value.** New users landed on empty screens with no guidance, dense layouts made important information difficult to find, and key actions were buried or unclear." },
        { type: "paragraph", text: "**Second, the shipped product often did not match the design.** Finished screens cycled back for changes as decisions reversed, while implementation drifted from what had been designed." },
        { type: "paragraph", text: "The business impact was already visible. **In sales calls, prospects named the interface as a reason they chose a competitor.**" },
        { type: "paragraph", text: "Fixing the screens alone would have failed. I needed to address the user experience, the way design decisions were made, and the gap between design and implementation." }
      ],
      gallery: [
        { src: "assets/m-as-problem.png", span: true, alt: "Content library empty state offering three ways to start, beside a long sidebar", caption: "A long, flat sidebar and an empty library gave users no obvious first move, so the empty state had to carry the decision." }
      ]
    },
    {
      heading: "My approach",
      content: [
        { type: "paragraph", text: "The first iteration had been shaped primarily by stakeholder discovery. For the redesign, I balanced **user needs, business goals, and technical feasibility**." },
        { type: "paragraph", text: "I used **product analytics and Hotjar** to identify where users dropped off and which screens they avoided, reviewed bug reports to find where the product was breaking trust, ran **recorded usability testing** to watch users complete real tasks, and conducted a **heuristic audit** screen by screen." },
        { type: "paragraph", text: "4 major areas consistently surfaced as affecting Airstride's business goals." },
        { type: "list", items: ["**Empty states:** users did not know what to do next. New users landed on empty screens with no guidance and dropped off before reaching value.","**Hierarchy:** dense pages made important information difficult to find.","**Data:** users could see numbers but struggled to understand what they meant.","**Implementation:** the final product did not consistently match the design."] }
      ],
      gallery: [
        { src: "assets/m-as-approach-1.png", alt: "Airstride primary logo lockup" },
        { src: "assets/m-as-approach-2.png", alt: "Airstride mark in navy" }
      ]
    },
    {
      heading: "Overview",
      content: [
        { type: "paragraph", text: "Brand-new users landed on an empty home screen with no guidance." },
        { type: "paragraph", text: "My responsibility was to give them a clear path to set up their partner programme and show the value of the populated dashboard before they had their own data." },
        { type: "paragraph", text: "I built a **guided setup checklist** covering CRM connection, team invites, ICP definition, and the knowledge bank, with progress towards going live. Once setup was complete, I added a clearly labelled **sample-data preview** showing the scorecard, daily briefing, and deals pipeline with example data. For active users, the same screen became a live dashboard of their own data." },
        { type: "paragraph", text: "The home page stopped being a dead end and became **the place users started their day**, with a clear path from landing to a live partner programme." }
      ],
      gallery: [
        { src: "compare:as-home", seed: { "new-0": "assets/m-as-home-new-0.png", "new-1": "assets/m-as-home-new-1.png", "new-2": "assets/m-as-home-new-2.png", "old-0": "assets/m-as-home-old-0.png", "old-1": "assets/m-as-home-old-1.png", "old-2": "assets/m-as-home-old-2.png" }, count: 3, newHint: "Redesigned home: setup checklist, sample-data preview, live dashboard", oldHint: "The old empty home screen", alt: "Home: new UI compared with the old UI" }
      ]
    },
    {
      heading: "Deals Management",
      content: [
        { type: "paragraph", text: "Deals was the flagship feature and the one most tied to lost deals. The old design was flat and dense, with buried deal stages, hard-to-find actions, and a long registration form." },
        { type: "paragraph", text: "My responsibility was to turn the pipeline into something a sales team could read and act on quickly, while creating **1 build that worked safely for both companies and partners**." },
        { type: "paragraph", text: "I rebuilt it into **3 views of the same work: Kanban, Forecast, and List**. The detail page prioritised the stage, key facts, and actions. The forecast surfaced deals at risk. Partners saw only relevant information, with internal forecasting and other partners' identities hidden." },
        { type: "paragraph", text: "Stage, history, and next action became **visible at a glance**. Approving or rejecting a deal took a couple of clicks, while registration moved to a stepped flow that could pull details from a connected CRM." }
      ],
      gallery: [
        { src: "compare:as-deals", count: 6, seed: { "new-0": "assets/m-as-deals-new-0.png", "new-1": "assets/m-as-deals-new-1.png", "new-2": "assets/m-as-deals-new-2.png", "new-3": "assets/m-as-deals-new-3.png", "new-4": "assets/m-as-deals-new-4.png", "new-5": "assets/m-as-deals-new-5.png", "old-0": "assets/m-as-deals-old-0.png", "old-1": "assets/m-as-deals-old-1.png", "old-2": "assets/m-as-deals-old-2.png" }, newHint: "Redesigned deals: Kanban, Forecast, List, detail page", oldHint: "The old flat, dense deals table", alt: "Deals Management: new UI compared with the old UI" }
      ]
    },
    {
      heading: "Account Mapping",
      content: [
        { type: "paragraph", text: "CRM connection lived separately from account mapping, with technical permissions, schema selection, and sync settings spread across disconnected screens." },
        { type: "paragraph", text: "My responsibility was to make getting account data in fast and low-effort, so users could reach the overlap and whitespace driving joint deals." },
        { type: "paragraph", text: "I redesigned it to **assign the partner, add your data, confirm the fields**. CRM connection and CSV/XLS upload sat in 1 step. Technical permissions became plain-English authorisation, with a privacy message explaining that lists stayed private and only overlapping accounts were revealed. Following the **Doherty threshold** principle, progress was shown while the system read accounts, detected columns, and prepared the review." },
        { type: "paragraph", text: "A technical admin task became **1 guided session** that made the system feel like it was doing the work." }
      ],
      gallery: [
        { src: "compare:as-map", count: 10, seed: { "new-0": "assets/m-as-map-new-0.png", "new-1": "assets/m-as-map-new-1.png", "new-2": "assets/m-as-map-new-2.png", "new-3": "assets/m-as-map-new-3.png", "new-4": "assets/m-as-map-new-4.png", "new-5": "assets/m-as-map-new-5.png", "new-6": "assets/m-as-map-new-6.png", "new-7": "assets/m-as-map-new-7.png", "new-8": "assets/m-as-map-new-8.png", "new-9": "assets/m-as-map-new-9.png", "old-0": "assets/m-as-map-old-0.png", "old-1": "assets/m-as-map-old-1.png", "old-2": "assets/m-as-map-old-2.png", "old-3": "assets/m-as-map-old-3.png", "old-4": "assets/m-as-map-old-4.png", "old-5": "assets/m-as-map-old-5.png", "old-6": "assets/m-as-map-old-6.png", "old-7": "assets/m-as-map-old-7.png" }, newHint: "Redesigned flow: assign partner, add data, confirm fields", oldHint: "The old disconnected CRM and mapping screens", alt: "Account Mapping: new UI compared with the old UI" }
      ]
    },
    {
      heading: "Analytics",
      content: [
        { type: "paragraph", text: "Analytics showed plenty of data but no judgement. Metrics lacked direction, charts used different time ranges, and conversion data did not show where deals were leaking." },
        { type: "paragraph", text: "My responsibility was to answer 3 questions at a glance: are we closing more deals, raising more revenue, and where are we falling behind?" },
        { type: "paragraph", text: "I interviewed users, then worked with the engineering team to understand which data existed and what needed to be captured or recalculated. I introduced movement, targets, pacing, benchmarks, and diagnostic drop-offs. **“73% achieved”** became **“73% of the plan with 24% of the quarter left.”** Conversion showed stage-to-stage rates against benchmarks and the biggest drop-off. I also added a new pipeline, richer conversion rates, median time in stage, and revenue by region, with shared partner, region, and time filters." },
        { type: "paragraph", text: "The page became a narrative: **are we on pace, what is coming in, what is in motion, where is it stuck, and where is it coming from?**" }
      ],
      gallery: [
        { src: "compare:as-analytics", count: 2, seed: { "new-0": "assets/m-as-analytics-new-0.png", "new-1": "assets/m-as-analytics-new-1.png", "old-0": "assets/m-as-analytics-old-0.png" }, newHint: "Redesigned analytics with pacing, benchmarks and drop-offs", oldHint: "The old metrics without direction", alt: "Analytics: new UI compared with the old UI" }
      ]
    },
    {
      heading: "Partner Training",
      content: [
        { type: "paragraph", text: "I redesigned the module detail page from a record of lessons and learners into something a manager could act on." },
        { type: "paragraph", text: "I surfaced completion, pace, reach, learner drop-off, and per-question results. Partner progress gained progress bars, status, filtering, bulk actions, and nudge flows. Header cards showed context such as **“Certified 3/6”** rather than raw counts. Certificates, access controls, reminders, and manager nudges helped keep partners engaged." },
        { type: "paragraph", text: "The result was a training view that showed **whether learning was landing, where users struggled, and who needed attention**." }
      ],
      gallery: [
        { src: "compare:as-training", count: 8, seed: { "new-0": "assets/m-as-training-new-0.png", "new-1": "assets/m-as-training-new-1.png", "new-2": "assets/m-as-training-new-2.png", "new-3": "assets/m-as-training-new-3.png", "new-4": "assets/m-as-training-new-4.png", "new-5": "assets/m-as-training-new-5.png", "new-6": "assets/m-as-training-new-6.png", "new-7": "assets/m-as-training-new-7.png", "old-0": "assets/m-as-training-old-0.png", "old-1": "assets/m-as-training-old-1.png", "old-2": "assets/m-as-training-old-2.png", "old-3": "assets/m-as-training-old-3.png", "old-4": "assets/m-as-training-old-4.png" }, newHint: "Redesigned module detail with learner journey and nudges", oldHint: "The old record of lessons and learners", alt: "Partner Training: new UI compared with the old UI" }
      ]
    },
    {
      heading: "Content Library",
      content: [
        { type: "paragraph", text: "The old Collaboration Hub was a manual, file-by-file document manager, with permissions set during upload and frequent upload failures." },
        { type: "paragraph", text: "My responsibility was to make access simple to reason about and filling the library easier." },
        { type: "paragraph", text: "I moved permissions **from files to folders**, creating 1 source of truth. I then introduced 3 ways to populate the library: **start with a folder, mirror an existing source, or let Carmen organise a drop of files**. I also added grid and list views, bulk actions, access management, and role-based partner views." },
        { type: "paragraph", text: "Vendors could answer “who can see this?” in **1 lookup**, while partners saw only what had been shared with them." }
      ],
      gallery: [
        { src: "tour:", frames: ["assets/m-cl01.png","assets/m-cl02.png","assets/m-cl03.png","assets/m-cl04.png","assets/m-cl05.png","assets/m-cl06.png","assets/m-cl07.png","assets/m-cl08.png","assets/m-cl09.png","assets/m-cl10.png","assets/m-cl11.png","assets/m-cl12.png","assets/m-cl13.png"], labels: ["Your library starts here","New folder: name it, decide who sees it","Or share with specific partners","Select the partners","Folder created","A folder with rules, waiting for files","Add files to the folder","Files in, permissions inherited","File preview and access","Or drop files, Carmen finds the home","Carmen proposes folder, partners and permission","The library, at a glance","Grid or list, your call"], cursors: [[0.493,0.92],[0.665,0.571],[0.59,0.61],[0.704,0.771],[0.7355,0.771],[0.26,0.455],[0.704,0.667],[0.31,0.331],[0.716,0.768],[0.704,0.667],[0.698,0.733],[0.9645,0.179],null], bar: "app.airstride.ai/content-library", aspect: "4320/3303", alt: "Content library flow, from empty state to a shared library" , caption: "Findable, co-branded assets mean partners actually use the content teams already produced." },
        { src: "compare:as-library", count: 3, seed: { "new-0": "assets/m-as-library-new-0.png", "new-1": "assets/m-as-library-new-1.png", "new-2": "assets/m-as-library-new-2.png", "old-0": "assets/m-as-library-old-0.png", "old-1": "assets/m-as-library-old-1.png", "old-2": "assets/m-as-library-old-2.png" }, newHint: "Redesigned library: folder permissions, grid and list views", oldHint: "The old file-by-file Collaboration Hub", alt: "Content Library: new UI compared with the old UI" }
      ]
    },
    {
      heading: "Design to code",
      content: [
        { type: "paragraph", text: "I collaborated with engineering throughout implementation to improve accuracy rather than treating handoff as the end of design. I also used **Claude Code in Visual Studio Code with Figma MCP** to implement frontend designs directly in the codebase, creating a tighter loop between design and production." },
        { type: "paragraph", text: "The same instinct extended beyond the product: I built Airstride’s marketing website in Framer, then **migrated it to code**, cutting hosting costs and improving live-site performance." }
      ],
      gallery: [
        { src: "assets/m-as-gap.png", span: true, alt: "Vibe coding with Claude Code in Antigravity, Figma link and screenshot attempts", caption: "Figma links were not readable and screenshots were not pixel perfect, so I worked in the codebase with Claude Code and Figma MCP to close the gap myself." }
      ]
    },
    {
      heading: "Impact",
      content: [
        { type: "paragraph", text: "Paying customers who saw the redesigned experience **preferred the new designs**, validating the direction around clarity, hierarchy, and ease of use." },
        { type: "paragraph", text: "Workflows were made **80% simpler**, resulting in a reduction in support requests and bugs raised by users. Design implementation accuracy improved by **75%**." }
      ],
      gallery: [
        { src: "marquee:", frames: ["assets/gl-cosell1.png","assets/gl-map1.png","assets/gl-logo-blue.png","assets/gl-cosell4.png","assets/gl-map2.png","assets/gl-cosell5.png","assets/gl-map3.png","assets/gl-logo-navy.png"], speed: 38, alt: "Airstride screens drifting across an angled marquee" }
      ]
    },
    {
      heading: "Reflection",
      content: [
        { type: "paragraph", text: "The first iteration relied mainly on stakeholder discovery, which made the process narrow and business-led. For the redesign, I used user research to challenge those assumptions while balancing user needs, business goals, and technical feasibility with the engineering team." },
        { type: "paragraph", text: "The biggest lesson was that user-centred design is not about optimising for users in isolation. The strongest solutions came from balancing **what users need, what the business needs, and what the team can realistically build**." },
        { type: "paragraph", text: "If I did this again, I would introduce **generative user research during the initial discovery phase**, before stakeholder assumptions shaped the problem space." }
      ]
    }
  ]
};

/* Carmen AI case study (founding designer). Verified metrics only. */
const CARMEN_AI = {
  slug: "carmen-ai",
  title: "Carmen AI",
  tagline: "Designing an AI agent from an unclear vision into a working product.",
  meta: [
    { label: "Role", value: "Founding Product Designer" },
    { label: "Year", value: "2026" },
    { label: "Type", value: "AI agent, B2B SaaS" }
  ],
  hero: {
    src: "assets/carmen-cover-m.png",
    alt: "Carmen AI"
  },
  sections: [
    {
      heading: "Overview",
      content: [
        { type: "paragraph", text: "As the founding designer at Airstride, I created the designs for Carmen, an AI agent that helps sales teams find and reach out to partners. Carmen searches a database of **over 85,000 organisations**, scores them on how well they fit, contacts them over LinkedIn and email, and helps turn them into partner-sourced revenue." },
        { type: "paragraph", text: "I designed it from the first idea through to launch and beyond." }
      ],
      gallery: [ { src: "assets/carmen-context.png", alt: "Cold outreach versus channel sales" , caption: "Customers ignore strangers, so partner introductions became the route worth designing for." }, { src: "assets/carmen-whois.png", alt: "Who is Carmen: find, score, engage, revenue" , caption: "Four jobs: find 85,000 organisations, score fit, engage them, convert to revenue." } ]
    },
    {
      heading: "My role",
      content: [
        { type: "paragraph", text: "I owned the design process end to end. That meant **gathering the requirements, doing the research, shaping the flows, building the design system, working with developers on the build, and then improving the product once real people were using it**." }
      ],
      gallery: [ { src: "assets/carmen-role.png", alt: "The founding designer turning a vision into something tangible" , caption: "As founding designer, I turned a one-line vision into flows, a system, and shipped screens." } ]
    },
    {
      heading: "The challenge: starting with no map",
      content: [
        { type: "paragraph", text: "The hardest part was that I had very little to work from. There were **no existing users to research**. There were **no direct competitors to compare against**. And there was **no product requirements document** to tell me what to build." },
        { type: "paragraph", text: "I was starting with an idea and not much else, so my first job was to turn that uncertainty into a clear direction." }
      ]
    },
    {
      heading: "Finding the requirements",
      content: [
        { type: "paragraph", text: "I started by meeting the founders and stakeholders. Because they had a lot of sales experience, **I used them as proxy users**, which was the closest thing I had to real users at that stage. I recorded the calls so I could stay focused and ask good questions in the moment, then went back through the transcripts myself to pull out what the product actually needed to do." },
        { type: "paragraph", text: "I was clear with myself that this was a starting point, not proven fact. These were **informed assumptions I would need to test with real users later**. Working with the product manager, I turned everything into a product requirements document, adding user stories, edge cases, and a clear definition of done. That document became the **single source of truth** for the project." }
      ],
      gallery: [ { src: "assets/carmen-research.png", alt: "Stakeholders as proxy users, no requirements document" , caption: "No brief, no users, no competitors, so experienced stakeholders became my proxies." }, { src: "assets/carmen-workflow.png", alt: "End-to-end project workflow from stakeholder calls to design reviews" , caption: "One connected loop kept research, design, and stakeholder feedback from drifting apart." } ]
    },
    {
      heading: "Turning research into designs",
      content: [
        { type: "paragraph", text: "I brought all the research into FigJam and used **affinity mapping and journey mapping** to group the problems and decide what mattered most for the first launch. Then I moved into Figma and worked structure first, polish second. I started with low-fidelity flows, then built a component library using **atomic design**, and used that same system to create the high-fidelity screens and prototypes." },
        { type: "paragraph", text: "Because every screen came from one system, the product stayed consistent as it grew, and I could make changes quickly without the design falling apart. I also designed to **WCAG accessibility standards** so that accessibility was built into the system from the start, not added at the end." },
        { type: "paragraph", text: "The main flow I designed lets a user turn a simple request into real outreach. Carmen reads the team's ideal customer profile, finds the right partners, suggests a list, drafts messages in the team's voice, and **asks for one clear approval before anything is sent**. Keeping the plan visible and the approval clear meant users stayed in control the whole way through." }
      ],
      gallery: [         {
          src: "assets/carmen-affinity.png",
          span: true,
          alt: "Affinity mapping in FigJam",
          caption: "Grouping stakeholder notes surfaced four themes: cold outreach failing, manual research, the need for human oversight, and missing partner ROI. Those themes set the build order."
        },
        {
          src: "assets/carmen-components1.png",
          span: true,
          alt: "Atomic component library",
          caption: "Buttons, inputs, switches, and text areas built as variants first, so every state existed before a screen needed it and nothing was drawn twice."
        },
        {
          src: "assets/carmen-components2.png",
          span: true,
          alt: "Screens assembled from the system",
          caption: "Chatbox, campaign creation, and training flows composed from those components, which is why dozens of screens stayed consistent as scope grew."
        },
        {
          src: "pair:",
          wire: "assets/carmen-wf1.png",
          hifi: "assets/carmen-chat-hi1.png",
          alt: "Carmen onboarding: plain-language intent",
          caption: "One question at a time: intent stays conversational, so nothing feels like a form."
        },
        {
          src: "pair:",
          wire: "assets/carmen-wf2.png",
          hifi: "assets/carmen-chat-hi2.png",
          alt: "Training Carmen on the team voice",
          caption: "Pasting past messages teaches tone, so drafts sound like the team, not the machine."
        },
        {
          src: "pair:",
          wire: "assets/carmen-wf3.png",
          hifi: "assets/carmen-chat-hi3.png",
          alt: "Weekly plan awaiting one approval",
          caption: "Segments, volumes, and strategy shown upfront, so one approval carries real understanding."
        },
        {
          src: "pair:",
          wire: "assets/carmen-wf4.png",
          hifi: "assets/carmen-chat-hi4.png",
          alt: "Campaign live with progress disclosed",
          caption: "Naming each running step answers what is happening, keeping long automated work legible."
        },
        {
          src: "pair:",
          wire: "assets/carmen-camp-lo.png",
          hifi: "assets/carmen-camp-hi.png",
          alt: "Campaigns index, wireframe beside the shipped screen",
          caption: "The wireframe fixed the shell, metric row and card structure first; the shipped screen filled that same skeleton with live response rates, invitations and owners."
        },
        {
          src: "pair:",
          wire: "assets/carmen-detail-lo.png",
          hifi: "assets/carmen-detail-hi.png",
          alt: "Campaign detail, wireframe beside the shipped screen",
          caption: "Grey blocks reserved space for Carmen's recommendation, the metric row, the weekly plan and a calendar; shipped, those became a real insight with an apply action, live send progress and day-by-day status."
        },
        {
          src: "pair:",
          wire: "assets/carmen-recip-lo.png",
          hifi: "assets/carmen-recip-hi.png",
          alt: "Recipient outreach, wireframe beside the shipped screen",
          caption: "The wireframe's flat recipient table became a list plus message preview, so users read the exact draft, see when it sends, and accept Carmen's personalisation before approving."
        },
        ]
    },
    {
      heading: "Launching and learning from real users",
      content: [
        { type: "paragraph", text: "We launched in **February 2026**, and this was the point of shipping early: to replace my assumptions with real evidence. Before I tested anything, I set clear success metrics so I would know what good looked like. My main measures were **onboarding time, task completion, and where users dropped off**." },
        { type: "paragraph", text: "I started with quantitative research, using Hotjar as my main diagnostic tool. Session recordings, heatmaps, and funnels showed me where people were getting stuck and which parts of the product they struggled with. That told me what was happening. To understand why, I moved to qualitative research, running **usability testing sessions and interviews** where I watched people use the product and asked them about their experience." },
        { type: "paragraph", text: "Three things stood out. Onboarding **took around 20 minutes across six steps**, which frustrated new users. **45% of people dropped off at the point where they had to connect a third-party CRM**. That single step was pulling down the overall task completion rate." }
      ],
      gallery: [ {
          src: "vig:carmen-funnel",
          span: true,
          alt: "Onboarding drop-off funnel",
          caption: "Session recordings and funnels located the failure precisely: users completed profile and voice training, then 45% abandoned at the CRM connection."
        } ]
    },
    {
      heading: "Major outcomes",
      content: [
        { type: "paragraph", text: "I streamlined the onboarding process and **removed steps that were not needed**, so people could get started faster. I **simplified the CRM connection step**, which was the biggest drop-off point, so it was easier to get through." },
        { type: "paragraph", text: "I made these changes within the existing design system, so the product stayed consistent as it improved." }
      ],
      gallery: [ {
          src: "vig:carmen-beforeafter",
          span: true,
          alt: "Onboarding before and after",
          caption: "Cutting unnecessary steps and simplifying the CRM connection took onboarding from 20 minutes to under 10, which lifted task completion."
        },
        {
          src: "tour:",
          frames: ["assets/onb1.png","assets/onb2.png","assets/onb3.png","assets/onb4.png","assets/onb5.png","assets/onb6.png","assets/onb7.png","assets/onb8.png","assets/onb9.png"],
          labels: ["Pick the experience that fits how you work","Create your organisation in two fields","Setting up while research runs","Research summarised, ready to confirm","Scanning 85,000+ partners against your profile","Each match explains why it fits","Approve or reject to teach preferences","Saving so Carmen learns your ideal partner","All set, ready to find partners"],
          cursors: [[0.31,0.83],[0.68,0.485],null,[0.81,0.70],null,[0.80,0.76],[0.89,0.79],null,null],
          holds: [0,0,1600,0,3200,0,0,1800,0],
          bar: "app.airstride.agent/onboarding",
          aspect: "2880/2312",
          alt: "Carmen onboarding flow, end to end",
          caption: "Guided onboarding turns first sign-in into matched partners fast."
        },
        {
          src: "tour:",
          frames: ["assets/li-n1.png","assets/li-n2.png","assets/li-n3.png","assets/li-n4.png","assets/li-n5.png"],
          labels: ["Step 1: credentials, with what you will need","Step 2: 2FA, guided by visual steps","Verifying, with an honest wait time","Connected, and pointed at the next action","Settings show the connection and how to undo it"],
          cursors: [[0.428,0.671],[0.428,0.687],null,[0.0625,0.5],[0.356,0.517]],
          bar: "app.airstride.agent/linkedIn",
          aspect: "4320/3105",
          alt: "LinkedIn connection flow, end to end",
          caption: "The step that lost 45% of users, rebuilt: three numbered steps and a plain-English list of what you need."
        } ]
    },
    {
      heading: "Impact",
      content: [
        { type: "paragraph", text: "The unclear brief became a clear, structured product that shipped and worked. After the changes, **onboarding dropped to under 10 minutes**, task completion improved, and the overall flow became **about 80% simpler for users**." },
        { type: "paragraph", text: "Commercially, Carmen **contributed to the company's annual recurring revenue**, with active clients across the UK and the US." }
      ]
    },
    {
      heading: "What this shows",
      content: [
        { type: "paragraph", text: "This project brought together the full range of how I work: **leading research under real constraints, building a scalable design system, designing for accessibility, working closely with a product manager and developers, and using real user data to keep improving after launch**. It is the kind of end to end ownership I bring to a team." }
      ],
      gallery: [, { src: "assets/carmen-ship2.png", alt: "Campaign Creator chat proposing targeting criteria", caption: "Carmen turns a plain-language brief into structured targeting: goal, region, industry, company size, revenue and job roles." }, { src: "assets/carmen-ship3.png", alt: "Campaigns dashboard with weekly progress", caption: "One board carries the whole programme: invitations, acceptance and reply rates, plus weekly progress per campaign." }, { span: true, src: "assets/carmen-ship4.png", alt: "Live campaign detail with timeline and What’s happening", caption: "A campaign details page providing context for sales professionals on how well their campaign is doing." }, { src: "assets/carmen-ship1.png", alt: "Recipient outreach sequence across LinkedIn and email", caption: "Per recipient, the full four-step sequence is visible and editable, so users approve the exact message and send date." }, { src: "assets/carmen-code1.png", alt: "Vibe coding with Claude Code in Antigravity, and the route to pixel-accurate builds", caption: "Claude could not open Figma links and screenshots alone were not pixel accurate, so I connected Figma through MCP and built in code myself." } ]
    },
    {
      heading: "Reflection",
      content: [
        { type: "paragraph", text: "The biggest lesson was that **shipping early to learn beats waiting for certainty that was never going to come**. My proxy research was a useful starting point, but the product only really improved once real users were in front of it." },
        { type: "paragraph", text: "If I did this again, I would push to get a rough version in front of real users even sooner, so I could replace assumptions with evidence earlier in the process." }
      ],
      gallery: [, { src: "assets/carmen-reflections.png", alt: "Three lessons: structured research, empty states first, peer reviews", caption: "Three lessons I carry forward: research real users directly, design the empty state first, and review with peers early." } ]
    }
  ]
};

export const CASE_STUDIES = { [AIRSTRIDE.slug]: AIRSTRIDE, [CARMEN_AI.slug]: CARMEN_AI, [GIVN.slug]: GIVN, [WISE_YOUNG_EXPLORER.slug]: WISE_YOUNG_EXPLORER, [DEXLA_DESIGN_SYSTEM.slug]: DEXLA_DESIGN_SYSTEM, [DEXLA_CASE_STUDY.slug]: DEXLA_CASE_STUDY };
