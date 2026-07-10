import Image from "next/image";
import NextLink from "next/link";
import { Tag } from "@/components/ui/Tag";
import { Card } from "@/components/ui/Card";
import type { Project } from "@/lib/data/projects";

export type ProjectCardProps = {
  project: Project;
};

/**
 * ProjectCard — server component. Renders a single project row with image,
 * title, tags, description, and CTA. Whether the CTA is external is
 * pre-computed on the project object (matches the Webflow source's
 * mixed internal/external routing).
 */
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card variant="outlined" padding="none" className="overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="relative aspect-[4/3] md:aspect-auto bg-bg-inset">
          <Image
            src={project.imageSrc}
            alt={project.imageAlt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="p-6 md:p-8 flex flex-col justify-between gap-6">
          <div>
            {project.tags && project.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            ) : null}
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {project.title}
            </h3>
            {project.description ? (
              <p className="mt-4 text-base text-fg-secondary leading-relaxed">
                {project.description}
              </p>
            ) : null}
          </div>
          <div>
            <ProjectCta
              href={project.ctaHref}
              label={project.ctaLabel}
              external={project.external}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

function ProjectCta({
  href,
  label,
  external
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const arrow = external ? "↗" : "→";
  const className =
    "inline-flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors";
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={className}
      >
        {label} <span aria-hidden>{arrow}</span>
      </a>
    );
  }
  return (
    <NextLink href={href} className={className}>
      {label} <span aria-hidden>{arrow}</span>
    </NextLink>
  );
}
