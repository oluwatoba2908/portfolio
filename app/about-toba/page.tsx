"use client";

/**
 * Ported from about.dc.html. Drop at app/about/page.tsx (route: /about-toba via
 * a redirect or renamed folder — match your existing routing).
 * Needs: framer-motion, an autoplaying muted looping video at /about-hero.mp4,
 * a bat Lottie/GIF asset for "Why the Bat?", and floating figma/vscode/claude
 * logos (reused from the homepage).
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Nav } from "@/components/patterns/Nav";
import { Footer } from "@/components/patterns/Footer";
import { PreFooterCTA } from "@/components/patterns/PreFooterCTA";
import { BatLottie } from "@/components/ui/BatLottie";
import { ABOUT } from "@/lib/data/about";

// Full work history lives in lib/data/about.ts, transcribed verbatim from the
// source doc — use it rather than restating an abbreviated copy here.
const EXPERIENCES = ABOUT.workHistory.roles;

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && (setVisible(true), obs.disconnect()), { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div style={{ position: "relative", background: "#efefef" }}>
      <Nav />

      {/* Dark hero panel with looping muted video */}
      <section style={{ margin: "20px", borderRadius: 40, background: "#1f1f1f", color: "#ffffff", overflow: "hidden", position: "relative" }}>
        <video autoPlay loop muted playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}>
          <source src="/about-hero.mp4" type="video/mp4" />
        </video>
        <div style={{ position: "relative", padding: "clamp(64px, 10vw, 140px) 20px", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, letterSpacing: 0, margin: 0 }}>Meet Toba</h1>
          <p style={{ marginTop: 16, fontSize: 18, color: "rgba(255,255,255,0.7)", maxWidth: "50ch", margin: "16px auto 0" }}>
            Product designer, based in London, focused on clarity over decoration.
          </p>
          <a
            href="#experience"
            style={{
              display: "inline-flex",
              marginTop: 32,
              padding: "14px 28px",
              borderRadius: 999,
              background: "#ffffff",
              color: "#191919",
              textDecoration: "none",
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            View experiences
          </a>
        </div>
      </section>

      {/* Experiences — right-aligned on desktop, left on mobile */}
      <section id="experience" style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(64px, 8vw, 120px) 20px" }}>
        {EXPERIENCES.map((exp, i) => (
          <Reveal key={exp.company} delay={i * 90}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right", marginBottom: 32 }} className="exp-row">
              <p style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{exp.role}</p>
              <p style={{ margin: "4px 0 0", color: "#6b6b6b" }}>
                {exp.company} · {exp.dates}
              </p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Why the Bat? */}
      <section style={{ maxWidth: 700, margin: "0 auto", padding: "clamp(48px, 6vw, 96px) 20px", textAlign: "center" }}>
        <Reveal>
          <div style={{ width: 96, margin: "0 auto 16px" }}>
            <BatLottie size={96} />
          </div>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, letterSpacing: 0, margin: "0 0 16px" }}>Why the Bat?</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#191919" }}>
            Apart from black being my favourite colour, here is the real reason for the metaphor. A bat navigates
            places it cannot see. It sends out a signal, listens for what comes back, and adjusts. That is design
            research: sending out a question, listening for the real answer, and adjusting the shape of the thing
            you are building.
          </p>
        </Reveal>
      </section>

      <PreFooterCTA />
      <Footer />

      <style jsx global>{`
        @media (max-width: 767px) {
          .exp-row {
            align-items: flex-start !important;
            text-align: left !important;
          }
        }
      `}</style>
    </div>
  );
}
