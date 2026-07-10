/**
 * Testimonial data — source: docs/webflow/homepage.md.
 * Quotes VERBATIM including any typos/quirks in the original. Do not "clean up".
 */

export type Testimonial = {
  name: string;
  role: string;
  company?: string;
  avatarSrc: string;
  avatarAlt: string;
  quote: string;
};

const CDN =
  "https://cdn.prod.website-files.com/67bcf543dcefdae851c539cd";

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    name: "Ali Ashfaq",
    role: "Senior UX/UI designer",
    avatarSrc: `${CDN}/67c49d4538c39d6a755e0e10_ALI%20ASHFAQ.jpeg`,
    avatarAlt: "Ali Ashfaq",
    quote:
      "I am delighted to provide a recommendation for Toba, with whom I had the privilege of collaborating closely during his tenure at letsremotify. Throughout this period, I had the chance to observe his extraordinary talents and unwavering commitment. Toba is an exceptional UI/UX professional, possessing remarkable problem-solving abilities, leadership skills, and technical expertise. He consistently exhibited a deep understanding of the remote work environment."
  },
  {
    name: "Victor Emokpare",
    role: "Product designer",
    company: "Zummit Africa",
    avatarSrc: `${CDN}/67c490f99a93e78ca667e694_victor%20zummit.jpeg`,
    avatarAlt: "Victor Emokpare",
    quote:
      "I had the pleasure of working alongside Toba during our tenure at Zummit Africa. Toba is an innovative designer, consistently introducing fresh ideas to our projects. His dedication to learning and exceptional listening skills set him apart, and he consistently pushed boundaries to ensure the best possible outcomes. I wholeheartedly recommend Toba for any endeavor he takes on"
  },
  {
    name: "Onyeka Kingsley",
    role: "No code developer",
    avatarSrc: `${CDN}/67c49d5d9a93e78ca6716466_Onyeka%20Kingsley.jpeg`,
    avatarAlt: "Onyeka Kingsley",
    quote:
      "Great to work with and very quick to implement changes at any time. Top mentality and a great fit for any company."
  },
  {
    name: "Mehria Akhtar",
    role: "Senior growth executive",
    company: "letsremotify",
    avatarSrc: `${CDN}/67c49d7095569284b6b59e29_Mehria.jpeg`,
    avatarAlt: "Mehria Akhtar",
    quote:
      "I am pleased to write a recommendation for Toba, whom I had the pleasure of working closely with at letsremotify. , I had the opportunity to witness his exceptional skills and dedication firsthand. Toba is an outstanding UI/UX with a remarkable ability to problem-solving, leadership, technical proficiency. He consistently demonstrated a keen understanding of the remote work landscape."
  },
  {
    name: "Williams Balogun",
    role: "Full stack engineer",
    company: "Dexla Inc",
    avatarSrc: `${CDN}/67dd91f0bf2521db0a3021ef_Ellipse%20670.png`,
    avatarAlt: "Williams Balogun",
    quote:
      "Working with Toba at Dexla Inc was a pleasure. As a Product Designer and No-Code Developer, he brought a rare balance of creativity and practicality to every project. His designs weren't just visually polished—they were thoughtful, prioritizing user needs while staying aligned with technical constraints. Toba's no-code expertise streamlined workflows for our team, and his willingness to bridge design and development made him a trusted partner for engineers and PMs alike. If you value designers who care as much about functionality as aesthetics, Toba is a perfect fit."
  }
];
