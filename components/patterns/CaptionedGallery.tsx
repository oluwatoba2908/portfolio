import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export type GalleryItem = {
  src: string;
  alt: string;
  caption?: string;
};

export type CaptionedGalleryProps = {
  title?: string;
  eyebrow?: string;
  items: readonly GalleryItem[];
  columns?: 2 | 3 | 4;
};

const columnClasses: Record<NonNullable<CaptionedGalleryProps["columns"]>, string> = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
};

/**
 * Image gallery with optional captions. Server pattern. Used on About
 * ("Life beyond design screens") and case studies (research/workshop galleries).
 */
export function CaptionedGallery({
  title,
  eyebrow,
  items,
  columns = 2
}: CaptionedGalleryProps) {
  return (
    <Section spacing="md" as="section">
      <Container>
        {eyebrow || title ? (
          <div className="border-t border-border pt-8 mb-10">
            {eyebrow ? (
              <p className="text-xs uppercase tracking-wide text-fg-muted font-medium">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
                {title}
              </h2>
            ) : null}
          </div>
        ) : null}
        <div className={`grid ${columnClasses[columns]} gap-6`}>
          {items.map((item, i) => (
            <figure key={i} className="flex flex-col gap-3">
              <div className="relative aspect-[4/3] bg-bg-inset rounded-lg overflow-hidden border border-border">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              {item.caption ? (
                <figcaption className="text-sm text-fg-muted leading-relaxed">
                  {item.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}
