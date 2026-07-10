import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { CaseStudyMeta } from "@/lib/data/case-studies/types";

export type CaseStudyHeroProps = {
  title: string;
  tagline: string;
  meta: readonly CaseStudyMeta[];
  hero: { src: string; alt: string };
};

export function CaseStudyHero({
  title,
  tagline,
  meta,
  hero
}: CaseStudyHeroProps) {
  return (
    <Section spacing="lg" as="section" id="Project-Hero-section">
      <Container>
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            {title}
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-fg-secondary leading-normal">
            {tagline}
          </p>
        </div>
        {meta.length > 0 ? (
          <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-border pt-8">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="text-xs uppercase tracking-wide text-fg-muted font-medium">
                  {m.label}
                </dt>
                <dd className="mt-2 text-base font-medium">{m.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <div className="relative mt-16 aspect-[16/10] rounded-xl overflow-hidden bg-bg-inset border border-border">
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </Container>
    </Section>
  );
}
