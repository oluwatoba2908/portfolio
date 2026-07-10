import Image from "next/image";
import { Card } from "@/components/ui/Card";
import type { Testimonial } from "@/lib/data/testimonials";

export type TestimonialCardProps = {
  testimonial: Testimonial;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card variant="outlined" padding="lg" className="h-full flex flex-col">
      <blockquote className="text-base text-fg-secondary leading-relaxed flex-1">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="mt-6 flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-bg-inset shrink-0">
          <Image
            src={testimonial.avatarSrc}
            alt={testimonial.avatarAlt}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{testimonial.name}</p>
          <p className="text-xs text-fg-muted truncate">
            {testimonial.role}
            {testimonial.company ? ` · ${testimonial.company}` : ""}
          </p>
        </div>
      </div>
    </Card>
  );
}
