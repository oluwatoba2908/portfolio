import { Hero } from "@/components/patterns/Hero";
import { SelectedProjects } from "@/components/patterns/SelectedProjects";
import { ReviewsSection } from "@/components/patterns/ReviewsSection";
import { CtaPanel } from "@/components/patterns/CtaPanel";
import { SITE } from "@/lib/data/site";
import { HOMEPAGE_PROJECTS } from "@/lib/data/projects";
import { TESTIMONIALS } from "@/lib/data/testimonials";

/**
 * Homepage — pure server component. Composes patterns; owns no state.
 * All content is imported from lib/data/ and traces back verbatim to
 * docs/webflow/homepage.md (the captured content bible).
 */
export default function HomePage() {
  return (
    <main>
      <Hero
        title={SITE.tagline}
        subtitle={SITE.description}
        primaryCta={{ label: "View projects", href: "#projects" }}
      />

      <SelectedProjects
        projects={HOMEPAGE_PROJECTS}
        eyebrow="Selected work"
        title="Selected projects"
        id="projects"
      />

      <ReviewsSection testimonials={TESTIMONIALS} id="reviews" />

      <CtaPanel
        title="Let's work together"
        actions={[
          { label: "Behance", href: SITE.socials.behance },
          {
            label: "LinkedIn",
            href: SITE.socials.linkedin,
            variant: "secondary"
          }
        ]}
      />
    </main>
  );
}
