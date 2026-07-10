import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export type HeroCta = {
  label: string;
  href: string;
};

export type HeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
};

/**
 * Hero pattern. Pure server component — props in, JSX out. Reusable across
 * homepage, about, contact, case-study intro.
 */
export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta
}: HeroProps) {
  return (
    <Section spacing="lg" as="section">
      <Container>
        <div className="max-w-4xl">
          {eyebrow ? (
            <p className="text-xs uppercase tracking-wide text-fg-muted font-medium mb-6">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-6 text-lg md:text-xl text-fg-secondary max-w-2xl leading-normal">
              {subtitle}
            </p>
          ) : null}
          {primaryCta || secondaryCta ? (
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {primaryCta ? (
                <Button href={primaryCta.href}>{primaryCta.label}</Button>
              ) : null}
              {secondaryCta ? (
                <Button href={secondaryCta.href} variant="secondary">
                  {secondaryCta.label}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
