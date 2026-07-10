export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

/** Top-nav links. Source: tobadesigner.com nav. Canonical /about. */
export const NAV_LINKS: readonly NavLink[] = [
  { label: "About me", href: "/about" },
  { label: "Contact", href: "/contact" }
];

/** Footer link groups. Source: tobadesigner.com footer. */
export const FOOTER_LINK_GROUPS = [
  {
    heading: "Sitemap",
    links: [
      { label: "Home", href: "/" },
      { label: "About me", href: "/about" },
      { label: "Contact", href: "/contact" }
    ]
  },
  {
    heading: "Elsewhere",
    links: [
      {
        label: "Behance",
        href: "https://www.behance.net/tofomiyonwon",
        external: true
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/tobao77/",
        external: true
      }
    ]
  }
] as const satisfies readonly {
  heading: string;
  links: readonly NavLink[];
}[];
