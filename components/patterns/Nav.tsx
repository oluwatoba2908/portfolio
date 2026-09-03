"use client";

/**
 * Ported from Nav.dc.html. Drop at components/patterns/Nav.tsx, replacing the
 * existing Nav.tsx. Needs: framer-motion (npm i framer-motion) for the mobile
 * drawer transition; everything else is plain React/Next.
 *
 * Assets referenced (place under public/):
 *   /logo.png              — GT wordmark
 *   /bat-halloween.lottie  — optional seasonal accent (safe to omit; guarded below)
 */

import NextLink from "next/link";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/data/nav";
import { BatLottie } from "@/components/ui/BatLottie";

const MENU_ITEMS = [
  { label: "Home page", href: "/" },
  ...NAV_LINKS,
  { label: "Playground", href: "/playground" },
];

export function Nav({ background = "rgba(245,245,245,0.9)" }: { background?: string }) {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState("/");

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px clamp(20px, 3vw, 40px)",
        background,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <NextLink href="/" aria-label="Home" style={{ display: "flex", alignItems: "center" }}>
        <Image src="/logo.png" alt="Toba Ofomiyonwon" width={96} height={28} priority style={{ height: 28, width: "auto" }} />
      </NextLink>

      {/* centered seasonal accent */}
      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }}>
        <BatLottie size={40} />
      </div>

      {/* desktop links */}
      <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="nav-links-desktop">
        {NAV_LINKS.map((l) => (
          <NextLink
            key={l.href}
            href={l.href}
            target={l.external ? "_blank" : undefined}
            rel={l.external ? "noreferrer noopener" : undefined}
            style={{ fontSize: 15, fontWeight: 500, color: "#191919", textDecoration: "none" }}
          >
            {l.label}
          </NextLink>
        ))}
        <NextLink
          href="/playground"
          style={{ fontSize: 15, fontWeight: 500, color: "#191919", textDecoration: "none" }}
        >
          Playground
        </NextLink>
      </div>

      {/* hamburger — visible below 1024px via the CSS below */}
      <button
        onClick={toggle}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="nav-hamburger"
        style={{
          display: "none",
          width: 40,
          height: 40,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          position: "relative",
          zIndex: 60,
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 8,
            right: 8,
            top: open ? 19 : 14,
            height: 2,
            background: "#191919",
            transition: "all 0.3s cubic-bezier(0.65,0,0.35,1)",
            transform: open ? "rotate(45deg)" : "none",
          }}
        />
        <span
          style={{
            position: "absolute",
            left: 8,
            right: 8,
            top: open ? 19 : 26,
            height: 2,
            background: "#191919",
            transition: "all 0.3s cubic-bezier(0.65,0,0.35,1)",
            transform: open ? "rotate(-45deg)" : "none",
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              background: "#e8e8e8",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {MENU_ITEMS.map((item) => {
              const active = path === item.href;
              return (
                <NextLink
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    padding: "12px 24px",
                    borderRadius: 12,
                    color: "#191919",
                    textDecoration: "none",
                    background: active ? "#ffffff" : "transparent",
                    boxShadow: active ? "0 8px 24px rgba(0,0,0,0.08)" : "none",
                    position: "relative",
                  }}
                  className="nav-drawer-link"
                >
                  {item.label}
                </NextLink>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .nav-drawer-link::after {
          content: "";
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 6px;
          height: 1px;
          width: 0;
          background: #10d48e;
          transition: width 0.35s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        .nav-drawer-link:hover::after {
          width: calc(100% - 48px);
        }
        @media (max-width: 1024px) {
          .nav-links-desktop {
            display: none !important;
          }
          .nav-hamburger {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
