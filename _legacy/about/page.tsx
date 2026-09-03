import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BioSection } from "@/components/patterns/BioSection";
import { ExperienceTable } from "@/components/patterns/ExperienceTable";
import { CaptionedGallery } from "@/components/patterns/CaptionedGallery";
import { CtaPanel } from "@/components/patterns/CtaPanel";
import { SelectedProjects } from "@/components/patterns/SelectedProjects";
import { ReviewsSection } from "@/components/patterns/ReviewsSection";
import { ABOUT } from "@/lib/data/about";
import { HOMEPAGE_PROJECTS } from "@/lib/data/projects";
import { TESTIMONIALS } from "@/lib/data/testimonials";

export const metadata: Metadata = {
  title: "About me",
  description: `${ABOUT.hero.title} ${ABOUT.hero.subtitle}`
};

/**
 * About page — pure server component. Composes patterns; no state.
 * Content lives in lib/data/about.ts (VERBATIM from Webflow source).
 */
export default function AboutPage() {
  return (
    <main>
      {/* About hero — custom layout with portrait */}
      <Section spacing="lg" as="section">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-wide text-fg-muted font-medium mb-6">
                {ABOUT.hero.eyebrow}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                {ABOUT.hero.title}
              </h1>
              <p className="mt-6 text-lg md:text-xl text-fg-secondary max-w-2xl leading-normal">
                {ABOUT.hero.subtitle}
              </p>
              <div className="mt-10 space-y-6 text-base md:text-lg text-fg-secondary leading-relaxed">
                {ABOUT.intro.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-bg-inset border border-border">
              <Image
                src={ABOUT.intro.portrait.src}
                alt={ABOUT.intro.portrait.alt}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>

      <BioSection
        eyebrow={ABOUT.myStory.eyebrow}
        title={ABOUT.myStory.title}
        paragraphs={ABOUT.myStory.body}
      />

      <CaptionedGallery
        title={ABOUT.gallery.title}
        items={ABOUT.gallery.items}
        columns={2}
      />

      <BioSection
        eyebrow={ABOUT.experience.eyebrow}
        title={ABOUT.experience.title}
        paragraphs={ABOUT.experience.body}
      />

      <ExperienceTable
        title={ABOUT.workHistory.title}
        roles={ABOUT.workHistory.roles}
      />

      <CtaPanel
        title={ABOUT.cta.title}
        body={ABOUT.cta.body}
        actions={[ABOUT.cta.action]}
      />

      <SelectedProjects
        projects={HOMEPAGE_PROJECTS}
        eyebrow="Selected work"
        title="Selected projects"
      />

      <ReviewsSection testimonials={TESTIMONIALS} />
    </main>
  );
}
