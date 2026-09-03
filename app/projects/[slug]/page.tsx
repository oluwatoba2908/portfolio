/**
 * Ported from project.dc.html. Drop at app/projects/[slug]/page.tsx.
 * Renders any case study from lib/data/case-studies-full.ts by slug.
 */

import { notFound } from "next/navigation";
import Image from "next/image";
import NextLink from "next/link";
import { CASE_STUDIES, allCaseStudySlugs, type ContentBlock } from "@/lib/data/case-studies-full";
import { Nav } from "@/components/patterns/Nav";
import { Footer } from "@/components/patterns/Footer";
import { PreFooterCTA } from "@/components/patterns/PreFooterCTA";
import { GalleryItem } from "@/components/patterns/GalleryItem";

export function generateStaticParams() {
  return allCaseStudySlugs().map((slug) => ({ slug }));
}

function renderBlock(block: ContentBlock, i: number) {
  if (block.type === "paragraph") {
    return (
      <p key={i} style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#191919", margin: "0 0 16px" }} dangerouslySetInnerHTML={{ __html: boldify(block.text) }} />
    );
  }
  if (block.type === "list") {
    return (
      <ul key={i} style={{ margin: "0 0 16px", paddingLeft: 20, fontSize: "0.875rem", lineHeight: 1.7, color: "#191919" }}>
        {block.items.map((it, j) => (
          <li key={j} dangerouslySetInnerHTML={{ __html: boldify(it) }} />
        ))}
      </ul>
    );
  }
  return (
    <h3 key={i} style={{ fontSize: 18, fontWeight: 600, margin: "24px 0 12px" }}>
      {block.text}
    </h3>
  );
}

// **bold** -> <strong>; keep in sync with content that uses markdown-style emphasis
function boldify(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

export default async function ProjectPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = CASE_STUDIES[slug];
  if (!cs) return notFound();

  const related = allCaseStudySlugs().filter((s) => s !== cs.slug).slice(0, 3);

  return (
    <div style={{ position: "relative", background: "#efefef" }}>
      <Nav />

      <section style={{ padding: "clamp(48px, 6vw, 80px) 20px", maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9a9a9a", margin: "0 0 24px" }}>
          {cs.meta.map((m) => `${m.label}: ${m.value}`).join(" · ")}
        </p>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, letterSpacing: 0, margin: 0 }}>{cs.title}</h1>
        <p style={{ marginTop: 16, fontSize: 18, color: "#6b6b6b", maxWidth: "60ch" }}>{cs.tagline}</p>
      </section>

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px 64px" }}>
        <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: 24, overflow: "hidden" }}>
          <Image src={cs.hero.src} alt={cs.hero.alt} fill style={{ objectFit: "cover" }} priority />
        </div>
      </section>

      {cs.sections.map((section, si) => (
        <section key={si} style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px" }}>
          {section.eyebrow && (
            <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9a9a9a", margin: "0 0 12px" }}>
              {section.eyebrow}
            </p>
          )}
          <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, letterSpacing: 0, margin: "0 0 24px" }}>{section.heading}</h2>

          {section.content && <div>{section.content.map((b, i) => renderBlock(b, i))}</div>}

          {section.gallery && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: section.galleryColumns === 3 ? "repeat(3, 1fr)" : section.gallery.length > 1 ? "repeat(2, 1fr)" : "1fr",
                gap: 16,
                marginTop: section.content ? 24 : 0,
              }}
            >
              {section.gallery.map((g, i) => (
                <GalleryItem key={i} item={g} />
              ))}
            </div>
          )}
        </section>
      ))}

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px 96px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 24px" }}>More projects</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="related-grid">
          {related.map((slug) => {
            const rel = CASE_STUDIES[slug];
            return (
              <NextLink key={slug} href={`/projects/${slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ position: "relative", aspectRatio: "4/3", borderRadius: 16, overflow: "hidden" }}>
                  <Image src={rel.hero.src} alt={rel.hero.alt} fill style={{ objectFit: "cover" }} />
                </div>
                <p style={{ marginTop: 12, fontWeight: 600 }}>{rel.title}</p>
              </NextLink>
            );
          })}
        </div>
      </section>

      <PreFooterCTA />
      <Footer />

      <style>{`
        @media (max-width: 767px) {
          .related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
