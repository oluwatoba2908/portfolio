/**
 * Design-canvas (`.dc.html`) documents and the public routes that serve them.
 *
 * The documents live in `content/site/` — outside `public/` — so the only way
 * to reach a page is through its Next.js route. Nothing is served from a
 * `.html` URL any more.
 *
 * Their runtime (`support.js`), page scripts and image assets stay in
 * `public/site/` because the browser fetches those directly.
 */

/** Full-page documents, keyed by the route that renders them. */
export const DC_PAGES = {
  "/": "Homepage.dc.html",
  "/about-toba": "about.dc.html",
  "/contact": "contact.dc.html",
  "/playground": "playground.dc.html"
} as const;

/** Case-study document — rendered by `/projects/[slug]`. */
export const DC_PROJECT_DOCUMENT = "project.dc.html";

/**
 * Partial documents pulled in by `<dc-import name="...">`. The runtime fetches
 * them as `./<name>.dc.html`; `DC_FRAGMENT_RESOURCES` remaps those requests to
 * the route handler that serves them.
 */
export const DC_FRAGMENTS = ["Nav", "Footer", "PreFooterCTA"] as const;
export type DcFragment = (typeof DC_FRAGMENTS)[number];

export function isDcFragment(name: string): name is DcFragment {
  return (DC_FRAGMENTS as readonly string[]).includes(name);
}

/** Route prefix for a single case study. */
export const DC_PROJECT_ROUTE = "/projects/";

/** Route prefix for fragment documents. */
export const DC_FRAGMENT_ROUTE = "/dc/";

/** Where the runtime, page scripts and assets are served from. */
export const DC_ASSET_BASE = "/site/";

/** `.dc.html` filename → public route, used when rewriting internal links. */
export const DC_LINK_MAP: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(DC_PAGES).map(([route, file]) => [file, route])
);

/** Sibling document lookups the runtime makes, mapped to their route. */
export const DC_FRAGMENT_RESOURCES: Readonly<Record<string, string>> =
  Object.fromEntries(
    DC_FRAGMENTS.map((name) => [
      `./${name}.dc.html`,
      `${DC_FRAGMENT_ROUTE}${name}`
    ])
  );
