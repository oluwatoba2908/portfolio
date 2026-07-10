import { GIVN } from "./givn";
import { WISE_YOUNG_EXPLORER } from "./wise-young-explorer";
import { DEXLA_DESIGN_SYSTEM } from "./dexla-design-system";
import { DEXLA_CASE_STUDY } from "./dexla-case-study";
import type { CaseStudy, RelatedProject } from "./types";

/**
 * Case study registry. Add a new case study by importing it above and
 * registering it here — the dynamic route + more-projects derivation
 * pick it up automatically.
 */
export const CASE_STUDIES: Record<string, CaseStudy> = {
  [GIVN.slug]: GIVN,
  [WISE_YOUNG_EXPLORER.slug]: WISE_YOUNG_EXPLORER,
  [DEXLA_DESIGN_SYSTEM.slug]: DEXLA_DESIGN_SYSTEM,
  [DEXLA_CASE_STUDY.slug]: DEXLA_CASE_STUDY
};

export const CASE_STUDY_SLUGS = Object.keys(CASE_STUDIES);

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES[slug];
}

/**
 * Related projects for the "More projects" grid at the bottom of a
 * case study — all other case studies except the current one, in
 * registry order.
 */
export function getRelatedCaseStudies(currentSlug: string): RelatedProject[] {
  return Object.values(CASE_STUDIES)
    .filter((cs) => cs.slug !== currentSlug)
    .map((cs) => ({
      slug: cs.slug,
      title: cs.title,
      imageSrc: cs.hero.src,
      imageAlt: cs.hero.alt,
      href: `/projects/${cs.slug}`
    }));
}
