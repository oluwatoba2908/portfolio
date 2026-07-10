import NextLink from "next/link";
import type { NavLink } from "@/lib/data/nav";

export type FooterLinkGroup = {
  heading: string;
  links: readonly NavLink[];
};

export type FooterProps = {
  logoMark: string;
  groups: readonly FooterLinkGroup[];
  copyright: string;
};

export function Footer({ logoMark, groups, copyright }: FooterProps) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-2">
            <NextLink
              href="/"
              className="text-xl font-semibold tracking-tight hover:text-accent transition-colors"
            >
              {logoMark}
            </NextLink>
            <p className="mt-3 text-sm text-fg-muted max-w-xs">
              Product designer helping software teams ship things people love
              to use.
            </p>
          </div>
          {groups.map((group) => (
            <div key={group.heading}>
              <p className="text-xs uppercase tracking-wide text-fg-muted font-medium">
                {group.heading}
              </p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm hover:text-accent transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <NextLink
                        href={link.href}
                        className="text-sm hover:text-accent transition-colors"
                      >
                        {link.label}
                      </NextLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-16 text-xs text-fg-muted">{copyright}</p>
      </div>
    </footer>
  );
}
