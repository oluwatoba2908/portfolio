import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export type BioSectionProps = {
  eyebrow?: string;
  title: string;
  paragraphs: readonly string[];
};

/**
 * BioSection — reusable long-form prose block. Server component.
 * Takes an array of paragraphs and renders each with vertical rhythm.
 */
export function BioSection({ eyebrow, title, paragraphs }: BioSectionProps) {
  return (
    <Section spacing="md" as="section">
      <Container size="md">
        <div className="border-t border-border pt-8">
          {eyebrow ? (
            <p className="text-xs uppercase tracking-wide text-fg-muted font-medium mb-3">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {title}
          </h2>
          <div className="mt-8 space-y-6 text-base md:text-lg text-fg-secondary leading-relaxed">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
