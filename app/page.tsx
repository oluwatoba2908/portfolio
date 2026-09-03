"use client";

/**
 * Ported from Homepage.dc.html. Drop at app/page.tsx.
 * Needs: framer-motion (scroll-reveal), lib/data/case-studies-full.ts (Selected
 * Projects tabs), components/patterns/{Nav,Footer,PreFooterCTA}.tsx.
 */

import Image from "next/image";
import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Nav } from "@/components/patterns/Nav";
import { Footer } from "@/components/patterns/Footer";
import { PreFooterCTA } from "@/components/patterns/PreFooterCTA";
import { CASE_STUDIES } from "@/lib/data/case-studies-full";
import { TESTIMONIALS } from "@/lib/data/testimonials";

const PERSONAL_SLUGS = ["givn", "wise-young-explorer"];
const ENTERPRISE_SLUGS = ["carmen-ai", "airstride", "dexla-design-system", "dexla-case-study"];


const FLOATING_LOGOS = [
  { src: "/logos/figma.png", alt: "Figma", minPct: 5 },
  { src: "/logos/lovable.png", alt: "Lovable", minPct: 5 },
  { src: "/logos/vscode.png", alt: "VS Code", minPct: 5 },
  { src: "/logos/claude.png", alt: "Claude", minPct: 5 },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function GridGuides() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {[25, 50, 75].map((pct) => (
        <div key={pct} style={{ position: "absolute", left: `${pct}%`, top: 0, bottom: 0, width: 1, borderLeft: "1px dashed rgba(25,25,25,0.12)" }} />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, borderTop: "1px dashed rgba(25,25,25,0.12)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, borderBottom: "1px dashed rgba(25,25,25,0.12)" }} />
    </div>
  );
}

export default function HomePage() {
  const [tab, setTab] = useState<"personal" | "enterprise">("personal");
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, -56]);
  const y2 = useTransform(scrollY, [0, 600], [0, 77]);
  const y3 = useTransform(scrollY, [0, 600], [0, -45]);
  const y4 = useTransform(scrollY, [0, 600], [0, 63]);

  const slugs = tab === "personal" ? PERSONAL_SLUGS : ENTERPRISE_SLUGS;

  return (
    <div style={{ position: "relative", background: "#efefef" }}>
      <Nav />

      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", padding: "clamp(80px, 10vw, 160px) 20px clamp(64px, 8vw, 96px)", overflow: "hidden" }}>
        <GridGuides />
        <motion.img src={FLOATING_LOGOS[0].src} alt={FLOATING_LOGOS[0].alt} style={{ y: y1, position: "absolute", top: "18%", left: "10%", width: "clamp(5%, 6vw, 90px)" }} />
        <motion.img src={FLOATING_LOGOS[1].src} alt={FLOATING_LOGOS[1].alt} style={{ y: y2, position: "absolute", top: "60%", left: "6%", width: "clamp(5%, 6vw, 90px)" }} />
        <motion.img src={FLOATING_LOGOS[2].src} alt={FLOATING_LOGOS[2].alt} style={{ y: y3, position: "absolute", top: "16%", right: "8%", width: "clamp(5%, 6vw, 90px)" }} />
        <motion.img src={FLOATING_LOGOS[3].src} alt={FLOATING_LOGOS[3].alt} style={{ y: y4, position: "absolute", top: "62%", right: "10%", width: "clamp(5%, 6vw, 90px)" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 700, letterSpacing: 0, margin: 0, lineHeight: 1.05 }}>
            Intuitive product design
            <span className="hero-break" style={{ display: "block" }}>
              for software teams.
            </span>
          </h1>
          <p style={{ marginTop: 24, fontSize: "clamp(16px, 1.8vw, 20px)", color: "#6b6b6b", maxWidth: "62ch", marginLeft: "auto", marginRight: "auto" }}>
            I&apos;m Toba, a product designer who partners with founders and engineering teams to ship clear,
            considered software.
          </p>
          <NextLink
            href="#projects"
            style={{
              display: "inline-flex",
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
            View projects
          </NextLink>
        </div>
      </section>

      {/* SELECTED PROJECTS */}
      <section id="projects" style={{ position: "relative", background: "#191919", color: "#ffffff", margin: "0 20px", borderRadius: 40, padding: "clamp(48px, 6vw, 96px) clamp(24px, 4vw, 56px)" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 40 }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, letterSpacing: 0, margin: 0 }}>Selected Projects</h2>
            <div style={{ display: "inline-flex", gap: 4, padding: 4, borderRadius: 999, background: "rgba(255,255,255,0.08)" }}>
              {(["personal", "enterprise"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 500,
                    background: tab === t ? "#ffffff" : "transparent",
                    color: tab === t ? "#191919" : "#ffffff",
                    textTransform: "capitalize",
                  }}
                >
                  {t === "enterprise" ? "Enterprise" : "Personal"}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }} className="projects-grid">
          {slugs.map((slug, i) => {
            const cs = CASE_STUDIES[slug];
            if (!cs) return null;
            return (
              <Reveal key={slug} delay={i * 90}>
                <NextLink href={`/projects/${slug}`} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                  <div className="project-card" style={{ position: "relative", borderRadius: 24, overflow: "hidden", aspectRatio: "4 / 3" }}>
                    <Image src={cs.hero.src} alt={cs.hero.alt} fill style={{ objectFit: "cover" }} />
                    <div
                      className="project-card-pill"
                      style={{
                        position: "absolute",
                        left: 16,
                        right: 16,
                        bottom: -164,
                        borderRadius: 20,
                        padding: "20px 24px",
                        background: "rgba(255,255,255,0.16)",
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        transition: "bottom 0.5s cubic-bezier(0.22,1,0.36,1)",
                      }}
                    >
                      <p style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#ffffff" }}>{cs.title}</p>
                      <p style={{ margin: "4px 0 0", fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{cs.tagline}</p>
                    </div>
                  </div>
                </NextLink>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS — sticky stack, first card pinned at 12rem */}
      <section style={{ position: "relative", padding: "clamp(64px, 8vw, 120px) 20px" }}>
        <Reveal>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, letterSpacing: 0, textAlign: "center", margin: "0 0 48px" }}>
            Take their words for it.
          </h2>
        </Reveal>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              style={{
                position: "sticky",
                top: `calc(12rem + ${i * 32}px)`,
                background: "#ffffff",
                borderRadius: 24,
                padding: 32,
                marginBottom: 24,
                boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
              }}
            >
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "#191919" }}>
                {t.quote}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
                <Image
                  src={t.avatarSrc}
                  alt={t.avatarAlt}
                  width={40}
                  height={40}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>{t.name}</p>
                  <p style={{ margin: 0, fontSize: 14, color: "#6b6b6b" }}>
                    {t.company ? `${t.role} · ${t.company}` : t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <PreFooterCTA />
      <Footer />

      <style jsx global>{`
        @media (max-width: 767px) {
          .projects-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-break {
            display: inline !important;
          }
        }
        .project-card:hover .project-card-pill {
          bottom: 16px !important;
        }
      `}</style>
    </div>
  );
}
