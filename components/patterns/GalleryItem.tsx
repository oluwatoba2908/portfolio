"use client";

/**
 * Renders one GalleryItem from case-studies-full.ts. Handles plain images and
 * wireframe/hifi pairs directly. The four interactive gallery types (tour,
 * compare, marquee, vig) are stubbed here as TODOs — they were bespoke custom
 * elements (airstride-tour.js, ui-compare.js, screen-marquee.js, carmen-funnel.js
 * / carmen-beforeafter.js) with scroll-gating, cursor choreography, and
 * crossfade timing that don't have a drop-in React equivalent. Port each as a
 * small client component using its .js source as the spec; this file is where
 * you wire them in once built.
 */

import Image from "next/image";
import type {
  GalleryItem as GalleryItemType,
  GalleryImage,
  GalleryPair,
  GalleryTour,
  GalleryCompare,
  GalleryMarquee,
  GalleryVignette
} from "@/lib/data/case-studies-full";

/**
 * A plain image's `src` is typed as `string`, so it overlaps every sentinel
 * variant and TypeScript can't discriminate the union on `src` by itself.
 * These guards encode the runtime contract instead: a `src` carrying a sentinel
 * prefix is always one of the special types, never a plain image path.
 */
type GalleryInteractive =
  | GalleryTour
  | GalleryCompare
  | GalleryMarquee
  | GalleryVignette;

const isPair = (i: GalleryItemType): i is GalleryPair => i.src === "pair:";

const isInteractive = (i: GalleryItemType): i is GalleryInteractive =>
  i.src === "tour:" ||
  i.src.startsWith("compare:") ||
  i.src === "marquee:" ||
  i.src.startsWith("vig:");

export function GalleryItem({ item }: { item: GalleryItemType }) {
  if (isPair(item)) {
    return (
      <figure style={{ margin: 0, gridColumn: "span 2" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="pair-wrap">
          <div style={{ position: "relative", aspectRatio: "4/3", border: "2px solid #111", borderRadius: 8, overflow: "hidden" }}>
            <span style={tagStyle("left")}>Low fidelity</span>
            <Image src={item.wire} alt={`${item.alt} — wireframe`} fill style={{ objectFit: "cover" }} />
          </div>
          <div style={{ position: "relative", aspectRatio: "4/3", border: "2px solid #111", borderRadius: 8, overflow: "hidden" }}>
            <span style={tagStyle("right")}>High fidelity</span>
            <Image src={item.hifi} alt={`${item.alt} — shipped`} fill style={{ objectFit: "cover" }} />
          </div>
        </div>
        {item.caption && <figcaption style={captionStyle}>{item.caption}</figcaption>}
        <style jsx>{`
          @media (max-width: 767px) {
            .pair-wrap {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </figure>
    );
  }

  if (isInteractive(item)) {
    return (
      <figure style={{ margin: 0, gridColumn: item.src === "marquee:" || item.src.startsWith("vig:") ? "1 / -1" : undefined, border: "1px dashed #c9c9c9", borderRadius: 12, padding: 24, background: "#fafafa" }}>
        <p style={{ margin: 0, fontSize: 13, color: "#9a9a9a" }}>
          TODO: port <code>{item.src}</code> interactive component — {item.alt}
        </p>
      </figure>
    );
  }

  const image: GalleryImage = item;

  return (
    <figure style={{ margin: 0, gridColumn: image.span ? "span 2" : undefined }}>
      <div style={{ position: "relative", aspectRatio: "4/3", borderRadius: 12, overflow: "hidden" }}>
        <Image src={image.src} alt={image.alt} fill style={{ objectFit: "cover" }} />
      </div>
      {image.caption && <figcaption style={captionStyle}>{image.caption}</figcaption>}
    </figure>
  );
}

function tagStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    top: 8,
    [side]: 8,
    zIndex: 1,
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    padding: "4px 8px",
    borderRadius: 4,
    background: "#111",
    color: "#fff",
  };
}

const captionStyle: React.CSSProperties = {
  margin: "12px 0 0",
  fontSize: "0.875rem",
  color: "#6b6b6b",
  lineHeight: 1.5,
};
