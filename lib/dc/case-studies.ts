import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Case-study metadata for the `/projects/[slug]` route.
 *
 * `public/site/case-studies.js` holds the data the case-study document renders
 * from — the browser loads it as a module. Reading the slugs and titles back
 * out of it keeps the routes and their page metadata in sync with that one
 * source of truth instead of duplicating the list here.
 */

const CASE_STUDIES_FILE = path.join(
  process.cwd(),
  "public",
  "site",
  "case-studies.js"
);

const SUMMARY_PATTERN =
  /slug:\s*"([a-z0-9-]+)",\s*title:\s*"([^"]*)"(?:,\s*tagline:\s*"([^"]*)")?/g;

export type DcCaseStudySummary = {
  slug: string;
  title: string;
  tagline?: string;
};

/** Extracts each case study's slug, title and tagline from the module source. */
export function parseCaseStudySummaries(source: string): DcCaseStudySummary[] {
  return [...source.matchAll(SUMMARY_PATTERN)].map((match) => ({
    slug: match[1],
    title: match[2],
    ...(match[3] ? { tagline: match[3] } : {})
  }));
}

export async function readCaseStudySummaries(): Promise<DcCaseStudySummary[]> {
  return parseCaseStudySummaries(await readFile(CASE_STUDIES_FILE, "utf8"));
}

export async function findCaseStudySummary(
  slug: string
): Promise<DcCaseStudySummary | undefined> {
  return (await readCaseStudySummaries()).find(
    (summary) => summary.slug === slug
  );
}
