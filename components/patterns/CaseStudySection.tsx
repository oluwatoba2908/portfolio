import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CaptionedGallery } from "@/components/patterns/CaptionedGallery";
import { renderInline } from "@/lib/utils/render-inline";
import type {
  CaseStudySection as CaseStudySectionData,
  CaseStudyContent
} from "@/lib/data/case-studies/types";

export type CaseStudySectionProps = {
  section: CaseStudySectionData;
};

/**
 * CaseStudySection — server pattern. Renders an optional prose block
 * and/or an optional gallery. Prose supports paragraphs, subheadings,
 * and bullet lists mixed in any order.
 */
export function CaseStudySection({ section }: CaseStudySectionProps) {
  const hasProse = (section.content?.length ?? 0) > 0;
  const hasGallery = (section.gallery?.length ?? 0) > 0;

  return (
    <>
      {hasProse ? (
        <Section spacing="md" as="section">
          <Container size="md">
            <div className="border-t border-border pt-8">
              {section.eyebrow ? (
                <p className="text-xs uppercase tracking-wide text-fg-muted font-medium mb-3">
                  {section.eyebrow}
                </p>
              ) : null}
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                {section.heading}
              </h2>
              <div className="mt-8 space-y-6 text-base md:text-lg text-fg-secondary leading-relaxed">
                {section.content!.map((block, i) => (
                  <ContentBlock key={i} block={block} />
                ))}
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      {hasGallery ? (
        <CaptionedGallery
          eyebrow={hasProse ? undefined : section.eyebrow}
          title={hasProse ? undefined : section.heading}
          items={section.gallery!}
          columns={section.galleryColumns ?? 2}
        />
      ) : null}
    </>
  );
}

function ContentBlock({ block }: { block: CaseStudyContent }) {
  switch (block.type) {
    case "paragraph":
      return <p>{renderInline(block.text)}</p>;
    case "subheading":
      return (
        <h3 className="text-xl md:text-2xl font-semibold text-fg mt-4">
          {renderInline(block.text)}
        </h3>
      );
    case "list":
      return (
        <ul className="list-disc pl-6 space-y-2 marker:text-fg-muted">
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );
  }
}
