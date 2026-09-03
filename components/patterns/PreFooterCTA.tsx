/**
 * Ported from PreFooterCTA.dc.html. Drop at components/patterns/PreFooterCTA.tsx.
 * Shared "If you scrolled this far..." CTA mounted just before <Footer /> on
 * every page (home, about, contact, project template, playground).
 */

import NextLink from "next/link";

const FLOAT_ICONS = [
  { src: "/logos/figma.png", alt: "Figma", style: { top: "10%", left: "8%" } },
  { src: "/logos/vscode.png", alt: "VS Code", style: { top: "18%", right: "10%" } },
  { src: "/logos/claude.png", alt: "Claude", style: { bottom: "14%", left: "12%" } },
];

export function PreFooterCTA() {
  return (
    <section style={{ position: "relative", padding: "clamp(64px, 10vw, 140px) 20px", overflow: "hidden" }}>
      {FLOAT_ICONS.map((icon) => (
        <img
          key={icon.alt}
          src={icon.src}
          alt={icon.alt}
          style={{ position: "absolute", width: 48, height: 48, opacity: 0.9, ...icon.style }}
        />
      ))}

      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 700,
            letterSpacing: 0,
            margin: 0,
            color: "#191919",
          }}
        >
          If you scrolled this far, let&apos;s talk.
        </h2>
        <p style={{ marginTop: 16, fontSize: 18, color: "#6b6b6b" }}>
          Open to new roles and collaborations.
        </p>
        <NextLink
          href="/contact"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginTop: 32,
            padding: "14px 28px",
            borderRadius: 999,
            background: "#191919",
            color: "#ffffff",
            textDecoration: "none",
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          Contact me
        </NextLink>
      </div>
    </section>
  );
}
