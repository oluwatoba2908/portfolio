"use client";

import NextLink from "next/link";
import { useState, useCallback, useEffect } from "react";
import { clsx } from "clsx";
import type { NavLink } from "@/lib/data/nav";

export type NavProps = {
  logoMark: string;
  links: readonly NavLink[];
};

/**
 * Site navigation. Sticky top bar with warm off-white background matching
 * the Figma spec (`rgba(245,245,245,0.9)` + subtle shadow). Client
 * component because it owns mobile drawer open state — desktop layout
 * has no client state.
 */
export function Nav({ logoMark, links }: NavProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-40",
        "bg-[rgba(245,245,245,0.9)] backdrop-blur-md",
        "shadow-[var(--shadow-nav)]"
      )}
    >
      <div className="mx-auto flex h-[86px] items-center justify-between px-6 md:px-16">
        <NextLink
          href="/"
          className="text-2xl font-extrabold tracking-tight text-fg hover:opacity-80 transition-opacity"
          onClick={close}
        >
          {logoMark}
        </NextLink>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <NavItem link={link} onNavigate={close} />
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-border hover:bg-bg-inset transition-colors"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={toggle}
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={clsx(
          "md:hidden fixed inset-x-0 top-[86px] bottom-0 z-30 bg-bg-warm transition-opacity duration-[var(--duration-normal)] ease-[var(--ease-standard)]",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <ul className="flex flex-col p-6 gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <NavItem link={link} onNavigate={close} mobile />
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

function NavItem({
  link,
  onNavigate,
  mobile
}: {
  link: NavLink;
  onNavigate: () => void;
  mobile?: boolean;
}) {
  const classes = clsx(
    "hover:text-accent transition-colors text-fg",
    mobile
      ? "block py-4 text-2xl font-medium border-b border-border"
      : "text-base font-normal px-5 py-2"
  );

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noreferrer noopener"
        className={classes}
        onClick={onNavigate}
      >
        {link.label}
      </a>
    );
  }
  return (
    <NextLink href={link.href} className={classes} onClick={onNavigate}>
      {link.label}
    </NextLink>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {open ? (
        <>
          <line x1="4" y1="4" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="14" y1="4" x2="4" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1="2" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
