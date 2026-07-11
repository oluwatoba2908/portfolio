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

/**
 * Dark inset footer matching the Figma spec. Sits inside a `#f5f5f5`
 * page background, contains a `#202020` panel with a huge "Let's work
 * together" heading and two link columns (Socials + Pages).
 */
export function Footer({ groups, copyright }: FooterProps) {
  return (
    <footer className="bg-bg-page py-0">
      <div className="mx-auto max-w-[var(--container-max)]">
        <div className="bg-bg-footer text-fg-on-dark px-8 md:px-20 pt-20 pb-10 min-h-[720px]">
          <div className="mx-auto max-w-[1251px] flex flex-col items-center">
            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
              <h2 className="text-5xl md:text-6xl lg:text-h1 font-bold tracking-tight text-fg-heading leading-[1.05]">
                Let&rsquo;s work together
              </h2>
              <div className="flex gap-16 shrink-0">
                {groups.map((group) => (
                  <div key={group.heading}>
                    <p className="text-base text-fg-footer-label leading-[32px]">
                      {group.heading}
                    </p>
                    <ul className="mt-2 space-y-0">
                      {group.links.map((link) => (
                        <li key={link.href} className="h-[50px] pt-5">
                          {link.external ? (
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="text-lg text-fg-on-dark hover:text-accent transition-colors"
                            >
                              {link.label}
                            </a>
                          ) : (
                            <NextLink
                              href={link.href}
                              className="text-lg text-fg-on-dark hover:text-accent transition-colors"
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
            </div>

            <div className="my-10 h-px w-64 bg-border-divider" />

            <p className="text-xl font-light text-fg-footer-copy">{copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
