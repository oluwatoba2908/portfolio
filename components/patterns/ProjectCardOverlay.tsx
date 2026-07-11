import Image from "next/image";
import NextLink from "next/link";
import { GlassPill } from "@/components/ui/GlassPill";
import type { Project } from "@/lib/data/projects";

export type ProjectCardOverlayProps = {
  project: Project;
};

/**
 * Full-bleed image project card with a frosted glass pill at the bottom.
 * The whole card is a link (matches Figma's `Link` group). Used in the
 * dark Selected Projects grid on the homepage.
 */
export function ProjectCardOverlay({ project }: ProjectCardOverlayProps) {
  const inner = (
    <div className="relative w-full h-full">
      <Image
        src={project.imageSrc}
        alt={project.imageAlt}
        fill
        sizes="(min-width: 1024px) 572px, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-[var(--duration-normal)] ease-[var(--ease-standard)] group-hover:scale-[1.02]"
      />
      <div className="absolute bottom-5 left-5 right-5">
        <GlassPill className="pl-6 pr-2 py-2">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl md:text-2xl font-bold text-fg truncate">
              {project.title}
            </h3>
            <span
              className={
                "shrink-0 inline-flex items-center justify-center " +
                "rounded-[var(--radius-pill)] bg-fg text-bg text-base " +
                "px-5 py-[17px] shadow-[var(--shadow-button-heavy)]"
              }
            >
              {project.ctaLabel}
            </span>
          </div>
        </GlassPill>
      </div>
    </div>
  );

  const shellClasses =
    "group relative block overflow-hidden rounded-[var(--radius-2xl)] " +
    "aspect-[572/560] bg-bg-inset";

  if (project.external) {
    return (
      <a
        href={project.ctaHref}
        target="_blank"
        rel="noreferrer noopener"
        className={shellClasses}
      >
        {inner}
      </a>
    );
  }
  return (
    <NextLink href={project.ctaHref} className={shellClasses}>
      {inner}
    </NextLink>
  );
}
