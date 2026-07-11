import { TestimonialCard, type TestimonialShade } from "@/components/patterns/TestimonialCard";
import type { Testimonial } from "@/lib/data/testimonials";

export type StackingTestimonialsProps = {
  title?: string;
  testimonials: readonly Testimonial[];
  id?: string;
};

/**
 * Sticky-stack testimonials from the Figma design. Each card uses
 * `position: sticky` with an increasing `top` offset, so cards pin as
 * they enter the viewport then get covered by the next one. Pure CSS,
 * no client JS. Cards darken as the stack grows (`#242222` → `#141414`).
 */
export function StackingTestimonials({
  title = "Take their words for it.",
  testimonials,
  id
}: StackingTestimonialsProps) {
  return (
    <section
      id={id}
      className="mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6 py-24 md:py-32"
    >
      <div className="mb-16 md:mb-20 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-h2 font-bold tracking-wide">
          {title}
        </h2>
      </div>

      <div className="mx-auto max-w-[850px] flex flex-col gap-8">
        {testimonials.map((testimonial, i) => {
          const shade = (Math.min(i + 1, 5) as TestimonialShade);
          const topOffset = 24 + i * 32; // increasing offset per card
          return (
            <div
              key={testimonial.name}
              className="sticky"
              style={{ top: `${topOffset}px` }}
            >
              <TestimonialCard
                testimonial={testimonial}
                shade={shade}
                isFirst={i === 0}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
