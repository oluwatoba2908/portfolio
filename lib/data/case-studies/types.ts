/**
 * Case study content types. `content` is a discriminated union so each
 * section can freely mix paragraphs, subheadings, and bullet lists in
 * whatever order the source uses.
 */

export type CaseStudyContent =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: readonly string[] };

export type CaseStudyGalleryItem = {
  src: string;
  alt: string;
  caption?: string;
};

export type CaseStudySection = {
  /** Doc label like "Documentation 1 of 6" — optional, verbatim from source. */
  eyebrow?: string;
  heading: string;
  /** Ordered body content. Paragraphs / subheadings / bullet lists mixed. */
  content?: readonly CaseStudyContent[];
  /** Images with optional captions. */
  gallery?: readonly CaseStudyGalleryItem[];
  /** Grid density for the gallery. Defaults to 2. */
  galleryColumns?: 2 | 3 | 4;
};

export type CaseStudyMeta = {
  label: string;
  value: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  meta: readonly CaseStudyMeta[];
  hero: {
    src: string;
    alt: string;
  };
  sections: readonly CaseStudySection[];
};

/** Used by the "more projects" grid at the bottom of case study pages. */
export type RelatedProject = {
  slug: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
  external?: boolean;
};
