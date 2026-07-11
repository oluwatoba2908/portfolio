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
  centered?: boolean;
};

/**
 * Hero pattern. Server component. Matches the Figma spec: warm off-white
 * background, centered massive H1 in Geist ExtraBold, muted subtitle,
 * dark pill CTA with heavy shadow.
 *
 * `centered` prop toggles between the homepage centered layout and the
 * left-aligned layout used on About / case studies.
 */
export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  centered = false
}: HeroProps) {
  return (
    <Section spacing="lg" as="section" className="bg-bg-warm">
      <Container>
        <div className={centered ? "text-center mx-auto max-w-5xl" : "max-w-4xl"}>
          {eyebrow ? (
            <p className={
              "text-xs uppercase tracking-wide text-fg-muted font-medium mb-6"
            }>
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={
              "font-extrabold tracking-tight leading-[1.1] text-fg-heading " +
              "text-5xl md:text-7xl lg:text-[90px] lg:leading-[120px]"
            }
          >
            {title}
          </h1>
          {subtitle ? (
            <p
              className={
                "mt-6 text-lg md:text-xl text-fg-muted leading-[30px] " +
                (centered ? "max-w-2xl mx-auto" : "max-w-2xl")
              }
            >
              {subtitle}
            </p>
          ) : null}
          {primaryCta || secondaryCta ? (
            <div
              className={
                "mt-10 flex flex-wrap items-center gap-3 " +
                (centered ? "justify-center" : "")
              }
            >
              {primaryCta ? (
                <Button href={primaryCta.href} variant="pill" size="lg">
                  {primaryCta.label}
                </Button>
              ) : null}
              {secondaryCta ? (
                <Button href={secondaryCta.href} variant="secondary" size="lg">
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
