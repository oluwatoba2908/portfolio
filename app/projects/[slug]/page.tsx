import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyHero } from "@/components/patterns/CaseStudyHero";
import { CaseStudySection } from "@/components/patterns/CaseStudySection";
import { MoreProjects } from "@/components/patterns/MoreProjects";
import {
  CASE_STUDY_SLUGS,
  getCaseStudy,
  getRelatedCaseStudies
} from "@/lib/data/case-studies";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Prerender every case study at build time. */
export function generateStaticParams() {
  return CASE_STUDY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return {
    title: cs.title,
    description: cs.tagline
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const related = getRelatedCaseStudies(slug);

  return (
    <main>
      <CaseStudyHero
        title={cs.title}
        tagline={cs.tagline}
        meta={cs.meta}
        hero={cs.hero}
      />

      {cs.sections.map((section, i) => (
        <CaseStudySection key={`${section.heading}-${i}`} section={section} />
      ))}

      {related.length > 0 ? <MoreProjects projects={related} /> : null}
    </main>
  );
}
