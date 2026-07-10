import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/patterns/ProjectCard";
import type { Project } from "@/lib/data/projects";

export type SelectedProjectsProps = {
  eyebrow?: string;
  title?: string;
  projects: readonly Project[];
  id?: string;
};

/**
 * SelectedProjects — server pattern. Single-column grid of ProjectCards.
 * Shared across homepage, about, contact.
 */
export function SelectedProjects({
  eyebrow = "Selected work",
  title = "Selected projects",
  projects,
  id = "projects"
}: SelectedProjectsProps) {
  return (
    <Section spacing="lg" as="section" id={id}>
      <Container>
        <div className="border-t border-border pt-8 mb-12">
          <p className="text-xs uppercase tracking-wide text-fg-muted font-medium">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
            {title}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
