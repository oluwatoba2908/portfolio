import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DcPage } from "@/components/dc/DcPage";
import {
  findCaseStudySummary,
  readCaseStudySummaries
} from "@/lib/dc/case-studies";
import { DC_PROJECT_DOCUMENT } from "@/lib/dc/routes";
import { renderDcPage } from "@/lib/dc/document";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const summaries = await readCaseStudySummaries();
  return summaries.map((summary) => ({ slug: summary.slug }));
}

export async function generateMetadata({
  params
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const summary = await findCaseStudySummary(slug);
  if (!summary) return {};

  return {
    title: summary.title,
    ...(summary.tagline ? { description: summary.tagline } : {})
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  if (!(await findCaseStudySummary(slug))) notFound();

  // The document reads its case study from `?slug=`; the route supplies it.
  const html = await renderDcPage(DC_PROJECT_DOCUMENT, {
    search: `?slug=${slug}`
  });

  return <DcPage html={html} />;
}
