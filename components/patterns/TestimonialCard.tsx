import { Avatar } from "@/components/ui/Avatar";
import { clsx } from "clsx";
import type { Testimonial } from "@/lib/data/testimonials";

export type TestimonialShade = 1 | 2 | 3 | 4 | 5;

export type TestimonialCardProps = {
  testimonial: Testimonial;
  /** 1 (lightest) through 5 (darkest) — matches the stacking scale. */
  shade?: TestimonialShade;
  /** First card has a subtle inner-glow; others have a top-glow. */
  isFirst?: boolean;
  className?: string;
};

const shadeClasses: Record<TestimonialShade, string> = {
  1: "bg-testimonial-1",
  2: "bg-testimonial-2 border border-border-olive",
  3: "bg-testimonial-3 border border-border-olive",
  4: "bg-testimonial-4 border border-border-olive",
  5: "bg-testimonial-5 border border-border-olive"
};

export function TestimonialCard({
  testimonial,
  shade = 1,
  isFirst = false,
  className
}: TestimonialCardProps) {
  return (
    <div
      className={clsx(
        "rounded-[30px] md:rounded-[18px] p-8 md:p-10 flex flex-col gap-8",
        shadeClasses[shade],
        isFirst
          ? "shadow-[var(--shadow-testimonial-first)]"
          : "shadow-[var(--shadow-testimonial-top)]",
        className
      )}
    >
      <p className="text-lg md:text-xl text-fg-on-dark leading-relaxed">
        {testimonial.quote}
      </p>
      <div className="flex items-center gap-5">
        <Avatar
          src={testimonial.avatarSrc}
          alt={testimonial.avatarAlt}
          size={shade === 1 ? "md" : "lg"}
        />
        <div className="min-w-0">
          <p className="text-2xl md:text-3xl font-bold text-fg-on-dark tracking-wide">
            {testimonial.name}
          </p>
          <p className="text-base text-fg-on-dark-muted tracking-wide truncate">
            {testimonial.role}
            {testimonial.company ? ` · ${testimonial.company}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
