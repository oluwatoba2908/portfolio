import { describe, expect, it } from "vitest";

import { parseCaseStudySummaries } from "./case-studies";

const SOURCE = [
  "const GIVN = {",
  '  slug: "givn",',
  '  title: "Givn",',
  "  tagline:",
  '    "A community application for sustainable reuse.",',
  "  meta: [],",
  "};",
  "const AIRSTRIDE = {",
  '  slug: "airstride",',
  '  title: "Airstride",',
  "  meta: [],",
  "};"
].join("\n");

describe("parseCaseStudySummaries", () => {
  it("finds every case study defined in the module", () => {
    expect(parseCaseStudySummaries(SOURCE).map((cs) => cs.slug)).toEqual([
      "givn",
      "airstride"
    ]);
  });

  it("reads the title used for page metadata", () => {
    expect(parseCaseStudySummaries(SOURCE)[0].title).toBe("Givn");
  });

  it("reads a tagline written on its own line", () => {
    expect(parseCaseStudySummaries(SOURCE)[0].tagline).toBe(
      "A community application for sustainable reuse."
    );
  });

  it("omits the tagline when a case study has none", () => {
    expect(parseCaseStudySummaries(SOURCE)[1].tagline).toBeUndefined();
  });

  it("returns nothing for a module with no case studies", () => {
    expect(parseCaseStudySummaries("export const CASE_STUDIES = {};")).toEqual(
      []
    );
  });
});
