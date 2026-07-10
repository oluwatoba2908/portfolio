import Image from "next/image";
import NextLink from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { RelatedProject } from "@/lib/data/case-studies/types";

export type MoreProjectsProps = {
  projects: readonly RelatedProject[];
  title?: string;
};

/**
 * MoreProjects — server pattern. A lighter-weight related-project grid
 * used at the bottom of case study pages. Simpler than ProjectCard —
 * just image + title + link, no tags or descriptions.
 */
export function MoreProjects({
  projects,
  title = "More projects"
}: MoreProjectsProps) {
  return (
    <Section spacing="lg" as="section">
      <Container>
        <div className="border-t border-border pt-8 mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <RelatedCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function RelatedCard({ project }: { project: RelatedProject }) {
  const inner = (
    <>
      <div className="relative aspect-[4/3] bg-bg-inset overflow-hidden">
        <Image
          src={project.imageSrc}
          alt={project.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-[var(--duration-normal)] ease-[var(--ease-standard)] group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-3 text-sm text-fg-muted">View project →</p>
      </div>
    </>
  );

  const shellClasses =
    "group block rounded-lg border border-border overflow-hidden hover:border-border-strong transition-colors";

  if (project.external) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noreferrer noopener"
        className={shellClasses}
      >
        {inner}
      </a>
    );
  }
  return (
    <NextLink href={project.href} className={shellClasses}>
      {inner}
    </NextLink>
  );
}
