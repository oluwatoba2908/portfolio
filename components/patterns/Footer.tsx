"use client";

/**
 * Ported from Footer.dc.html. Drop at components/patterns/Footer.tsx, replacing
 * the existing Footer.tsx. Full-width dark panel that grows from 92%->100% width
 * as it scrolls into view (ease-in-out, completing at 32% of viewport height into
 * the reveal), matching the divider line to the same progress.
 */

import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/lib/data/nav";

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/tobao77/" },
  { label: "Dribbble", href: "https://dribbble.com/Tobs007" },
];

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function Footer() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [widthPct, setWidthPct] = useState(92);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = panelRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const target = vh * 0.32;
        const start = vh;
        const raw = (start - rect.top) / (start - target);
        const t = Math.min(1, Math.max(0, raw));
        setWidthPct(92 + 8 * easeInOutCubic(t));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <footer style={{ position: "relative", zIndex: 1, background: "#efefef", padding: "0 20px 40px" }}>
      <div
        ref={panelRef}
        style={{
          width: `${widthPct}%`,
          margin: "0 auto",
          background: "#1f1f1f",
          color: "#ffffff",
          borderRadius: 40,
          padding: "clamp(40px, 6vw, 80px) clamp(24px, 5vw, 64px)",
          transition: "none",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr",
            gap: "48px",
          }}
          className="footer-grid"
        >
          <div>
            <p style={{ fontSize: 28, fontWeight: 600, margin: 0, letterSpacing: 0 }}>Let&apos;s work together</p>
            <p style={{ marginTop: 16, color: "rgba(255,255,255,0.6)", maxWidth: "40ch" }}>
              Tofomiyonwon@gmail.com
            </p>
          </div>

          <div>
            <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9a9a9a", margin: "0 0 16px" }}>
              Pages
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {NAV_LINKS.map((l) => (
                <NextLink key={l.href} href={l.href} className="foot-link" style={{ color: "#ffffff", textDecoration: "none", fontSize: 15, position: "relative", width: "fit-content" }}>
                  {l.label}
                </NextLink>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9a9a9a", margin: "0 0 16px" }}>
              Socials
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="foot-link"
                  style={{ color: "#ffffff", textDecoration: "none", fontSize: 15, position: "relative", width: "fit-content" }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.12)",
            width: `${widthPct}%`,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </div>

      <style jsx global>{`
        .foot-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -3px;
          height: 1px;
          width: 0;
          background: #10d48e;
          transition: width 0.35s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        .foot-link:hover::after {
          width: 100%;
        }
        @media (max-width: 767px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </footer>
  );
}
