import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TestimonialCard } from "@/components/patterns/TestimonialCard";
import type { Testimonial } from "@/lib/data/testimonials";

export type ReviewsSectionProps = {
  eyebrow?: string;
  title?: string;
  testimonials: readonly Testimonial[];
  id?: string;
};

export function ReviewsSection({
  eyebrow = "Reviews",
  title = "Take their words for it.",
  testimonials,
  id
}: ReviewsSectionProps) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
