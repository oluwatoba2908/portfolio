import { ScrollIndicator } from "@/components/patterns/ScrollIndicator";
import { ProjectCardOverlay } from "@/components/patterns/ProjectCardOverlay";
import { DarkSection } from "@/components/patterns/DarkSection";
import type { Project } from "@/lib/data/projects";

export type SelectedProjectsProps = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  projects: readonly Project[];
  id?: string;
};

/**
 * Dark-panel Selected Projects section. Matches the Figma design:
 * `#191919` rounded panel, green pulsing scroll indicator, Neue Montreal
 * H2, one-paragraph intro, then a 2×N grid of overlay cards.
 */
export function SelectedProjects({
  eyebrow = "Scroll to see projects",
  title = "Selected Projects",
  intro = "Quick note, these case studies include visuals and content that show how I think through problems, backed by real research. I hope you find something useful.",
  projects,
  id = "projects"
}: SelectedProjectsProps) {
  return (
    <div className="mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6">
      <DarkSection id={id}>
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-8">
          <ScrollIndicator label={eyebrow} />
          <h2 className="text-4xl md:text-5xl lg:text-h2 font-bold tracking-wide leading-tight">
            {title}
          </h2>
          {intro ? (
            <p className="text-lg md:text-xl text-fg-on-dark leading-normal">
              {intro}
            </p>
          ) : null}
        </div>

        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {projects.map((project) => (
            <ProjectCardOverlay key={project.slug} project={project} />
          ))}
        </div>
      </DarkSection>
    </div>
  );
}
