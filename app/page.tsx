import { Hero } from "@/components/patterns/Hero";
import { PortraitCard } from "@/components/patterns/PortraitCard";
import { SelectedProjects } from "@/components/patterns/SelectedProjects";
import { StackingTestimonials } from "@/components/patterns/StackingTestimonials";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/data/site";
import { HOMEPAGE_PROJECTS } from "@/lib/data/projects";
import { TESTIMONIALS } from "@/lib/data/testimonials";

/**
 * Homepage — pure server component. Composes patterns; owns no state.
 * Layout matches the Figma design (node 1607:20192):
 *   Hero → PortraitCard → dark Selected Projects → sticky-stack Reviews → Footer (via layout).
 */
export default function HomePage() {
  return (
    <main className="bg-bg-warm">
      <Hero
        title={SITE.tagline}
        subtitle={SITE.description}
        primaryCta={{ label: "View projects", href: "#projects" }}
        centered
      />

      <section className="pb-16 md:pb-24">
        <Container>
          <PortraitCard
            portraitSrc={SITE.homepagePortrait.src}
            portraitAlt={SITE.homepagePortrait.alt}
            firstName={SITE.firstName}
            fullName={SITE.name}
            chipDefaultText="Hover to know my name"
            cta={{ label: "More about me", href: "/about" }}
          />
        </Container>
      </section>

      <SelectedProjects projects={HOMEPAGE_PROJECTS} id="projects" />

      <StackingTestimonials testimonials={TESTIMONIALS} id="reviews" />
    </main>
  );
}
