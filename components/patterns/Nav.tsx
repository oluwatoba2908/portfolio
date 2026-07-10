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
 * Site navigation. Client component because it owns mobile drawer open state.
 * Server parents pass `logoMark` and `links` as plain data — the client
 * boundary stays tight around this component only.
 */
export function Nav({ logoMark, links }: NavProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto flex h-16 max-w-[var(--container-max)] items-center justify-between px-6 md:px-8">
        <NextLink
          href="/"
          className="text-lg font-semibold tracking-tight hover:text-accent transition-colors"
          onClick={close}
        >
          {logoMark}
        </NextLink>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
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
          "md:hidden fixed inset-x-0 top-16 bottom-0 z-30 bg-bg transition-opacity duration-[var(--duration-normal)] ease-[var(--ease-standard)]",
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
    "hover:text-accent transition-colors",
    mobile ? "block py-4 text-2xl font-medium border-b border-border" : "text-sm font-medium"
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
