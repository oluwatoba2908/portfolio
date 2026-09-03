"use client";

/**
 * Ported from playground.dc.html. Drop at app/playground/page.tsx.
 *
 * The carousel keeps the DC behaviour: a 5-slot stage where only the active card
 * is full-size, navigation is HORIZONTAL-ONLY (wheel with dominant deltaX, or a
 * horizontally-dominant touch swipe) so vertical scrolling still moves the page,
 * and the active card is inset from the stage height so its drop shadow is not
 * clipped.
 *
 * Assets: place the mockups under public/playground/ and list them below.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Nav } from "@/components/patterns/Nav";
import { Footer } from "@/components/patterns/Footer";
import { PreFooterCTA } from "@/components/patterns/PreFooterCTA";

const MOCKUPS = [
  { src: "/playground/mockup-0.png", label: "UX DESIGN" },
  { src: "/playground/mockup-1.png", label: "UX DESIGN" },
  { src: "/playground/mockup-2.png", label: "UX DESIGN" },
  { src: "/playground/mockup-3.png", label: "UX DESIGN" },
  { src: "/playground/mockup-4.png", label: "UX DESIGN" },
];

const WHEEL_LOCK_MS = 420;

export default function PlaygroundPage() {
  const [index, setIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback((dir: number) => {
    setIndex((i) => (i + dir + MOCKUPS.length) % MOCKUPS.length);
  }, []);

  const guard = useCallback(
    (dir: number) => {
      if (lockRef.current) return;
      lockRef.current = true;
      go(dir);
      window.setTimeout(() => {
        lockRef.current = false;
      }, WHEEL_LOCK_MS);
    },
    [go]
  );

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    // horizontal-only: let vertical wheel/swipe fall through to page scroll
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      guard(e.deltaX > 0 ? 1 : -1);
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchRef.current = { x: t.clientX, y: t.clientY };
    };

    const onTouchMove = (e: TouchEvent) => {
      const start = touchRef.current;
      if (!start) return;
      const t = e.touches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
      e.preventDefault();
      touchRef.current = null;
      guard(dx < 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") guard(1);
      if (e.key === "ArrowLeft") guard(-1);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [guard]);

  return (
    <div style={{ position: "relative", background: "#efefef", zIndex: 1 }}>
      <Nav />

      <main style={{ position: "relative", display: "flex", flexDirection: "column", minHeight: "calc(100vh - 130px)", padding: "16px clamp(20px, 3vw, 40px) 64px", boxSizing: "border-box" }}>
        <div style={{ position: "relative", zIndex: 20, maxWidth: 320, marginTop: "clamp(48px, 8vw, 96px)", display: "flex", flexDirection: "column", gap: 32 }}>
          <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, letterSpacing: "0.08em", margin: 0, color: "#9a9a9a" }}>
            PLAYGROUND
          </p>
          <div>
            <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, letterSpacing: "0.08em", margin: 0, color: "#111" }}>
              {MOCKUPS[index].label} {String(index + 1).padStart(2, "0")} / {String(MOCKUPS.length).padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* stage */}
        <div
          ref={stageRef}
          style={{
            position: "relative",
            flex: 1,
            marginTop: "clamp(6px, 1vh, 14px)",
            marginBottom: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflowX: "clip",
            touchAction: "pan-y",
          }}
        >
          {MOCKUPS.map((m, i) => {
            const offset = i - index;
            const isActive = offset === 0;
            return (
              <div
                key={m.src}
                aria-hidden={!isActive}
                style={{
                  position: "absolute",
                  height: "min(calc(100% - 80px), 56vw)",
                  maxHeight: 860,
                  width: "auto",
                  aspectRatio: "2243 / 2240",
                  borderRadius: 20,
                  overflow: "hidden",
                  transform: `translateX(${offset * 108}%) scale(${isActive ? 1 : 0.82})`,
                  opacity: Math.abs(offset) > 2 ? 0 : isActive ? 1 : 0.45,
                  filter: isActive ? "none" : "grayscale(0.2) brightness(1.02)",
                  boxShadow: isActive ? "0 22px 48px rgba(0,0,0,0.18)" : "none",
                  transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.6s cubic-bezier(0.22,1,0.36,1)",
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <img src={m.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            );
          })}
        </div>

        {/* bottom bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0", background: "#e8e8e8", borderTop: "1px solid rgba(25,25,25,0.08)" }}>
          <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: "0.08em", color: "#6b6b6b" }}>
            MORE MOCKUPS COMING SOON
          </span>
        </div>
      </main>

      <PreFooterCTA />
      <Footer />
    </div>
  );
}
