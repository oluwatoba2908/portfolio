/**
 * About page content. Source: docs/webflow/about-toba.md.
 * All copy VERBATIM — do not paraphrase.
 */

const CDN =
  "https://cdn.prod.website-files.com/67bcf543dcefdae851c539cd";

export const ABOUT = {
  hero: {
    eyebrow: "About me",
    title: "UX Designer & No-code Developer.",
    subtitle: "creating digital designs that people enjoy using and remember."
  },
  intro: {
    body: [
      "I can solve a Rubik's cube in 1:15, but that's just one way I keep my hands busy. When I'm off work, I sketch portraits with charcoal on alabaster paper, and recently dove into canvas painting.",
      "My path to UI/UX design started with a mathematical mix-up – I thought it was related to dy/dx calculus. That confusion led to a two-year journey of crafting digital spaces people love to use"
    ],
    portrait: {
      src: `${CDN}/67c84aba50ba34e9c9a1c59b_tobas%27s%20image-hero.png`,
      alt: "Toba portrait"
    }
  },
  myStory: {
    eyebrow: "About me · 1 of 2",
    title: "My story",
    body: [
      "Hey, I'm Toba! My full name is Oluwatoba Ofomiyonwon, but most people just call me Toba. I'm currently based in Farnham, Surrey, in the UK, where I'm studying for my Master's in UX Design at the University for the Creative Arts. It's been a great experience so far, allowing me to deepen my understanding of human-centered design and apply it to real-world projects.",
      "Before this, I studied Surveying and Geoinformatics at Obafemi Awolowo University (O.A.U) in Nigeria. That gave me a solid foundation in problem-solving and spatial thinking, but my real passion has always been in design, technology, and building digital experiences. Outside of work and school, I enjoy pushing myself in different ways.",
      "I hit the gym three times a week, deepen my knowledge in front-end technologies, HTML, CSS & JavaScript, and spend time on charcoal drawing and painting as a creative outlet. I'm also still trying to beat my 1:15 Rubik's Cube record (not there yet!)."
    ]
  },
  gallery: {
    title: "Life beyond design screens",
    items: [
      {
        src: `${CDN}/67e1cf6cbdda114c3251cc7f_RUNTOWN.png`,
        alt: "Ryder project preview",
        caption:
          "Ryder reduced inequality by making transport access more affordable for both low- and high-income users through prepaid plans."
      },
      {
        src: `${CDN}/67e1cf518d057855d8ac9c79_671bc76c47c709bd6ff7f113_IMG_4821%201.png`,
        alt: "Givn project preview",
        caption:
          "In accordance with SDG 12, Givn focuses on reducing waste through donation and reuse."
      },
      {
        src: `${CDN}/696a57b1eb8c82d7f972bf4d_IMG_1411.JPG`,
        alt: "Givn field research",
        caption:
          "In accordance with SDG 12, Givn focuses on reducing waste through donation and reuse."
      },
      {
        src: `${CDN}/696a55edfffd11082ac29c52_IMG_9604.jpg`,
        alt: "Givn workshop",
        caption:
          "In accordance with SDG 12, Givn focuses on reducing waste through donation and reuse."
      }
    ]
  },
  experience: {
    eyebrow: "About me · 2 of 2",
    title: "Experience",
    body: [
      "Currently, I work as a UX Designer at Airstride, a VC-backed startup helping companies scale their sales through automated partner channels. The product uses AI to help businesses build and manage distribution partnerships more efficiently. At Airstride, I focus on improving the user experience across the platform by conducting research, mapping user journeys, testing prototypes, and designing clear interfaces that support real user needs. It's a fast-paced, global team, and I enjoy shaping a product that enables growth in a meaningful way.",
      "Across my experience, I've worked closely with founders, engineers, and product teams to turn complex problems into simple, usable solutions. I enjoy working end to end, from understanding users and defining problems to designing systems, flows, and interfaces that scale. I care deeply about clarity, consistency, and building products that feel intuitive, useful, and well considered."
    ]
  },
  workHistory: {
    title: "Work experience",
    roles: [
      {
        role: "UX designer",
        company: "Airstride",
        dates: "May, 2025 — present"
      },
      {
        role: "UX designer | no code developer",
        company: "Dexla",
        dates: "November, 2023 — May, 2025"
      },
      {
        role: "UI designer intern",
        company: "LetsRemotify",
        dates: "August — November, 2023"
      },
      {
        role: "Product designer",
        company: "Zummit Africa",
        dates: "December, 2023 — April, 2023"
      },
      {
        role: "UX/UI Designer intern",
        company: "Zuri",
        dates: "September, 2022 — February, 2023"
      }
    ]
  },
  cta: {
    title: "If you scrolled this far, let's talk",
    body:
      "If you're building something impactful and need a designer focused on clarity and results, let's connect.",
    action: {
      label: "Contact me",
      href: "https://calendly.com/tofomiyonwon/30min"
    }
  }
} as const;
