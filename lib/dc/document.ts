import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  DC_ASSET_BASE,
  DC_FRAGMENT_RESOURCES,
  DC_LINK_MAP,
  DC_PROJECT_DOCUMENT,
  DC_PROJECT_ROUTE,
  isDcFragment
} from "./routes";

/**
 * Loads a design-canvas document and prepares it to be rendered inside a
 * Next.js page.
 *
 * The documents are authored as standalone HTML files that assume they are
 * served from `/site/` with a `<base>` tag — every internal link, script and
 * image is written relative to that folder. Serving them as pages means:
 *
 *  1. dropping the `<html>`/`<head>` shell, since the Next.js layout owns it,
 *  2. rewriting internal links to their public route (`about.dc.html` →
 *     `/about-toba`), so navigation never exposes a `.html` URL,
 *  3. absolutising asset and script URLs to `/site/…`, since there is no
 *     `<base>` tag left to resolve them against,
 *  4. pointing the runtime's sibling-document lookups at the `/dc/*` route.
 *
 * Every step is a pure string transform so it can be unit tested without
 * touching the filesystem.
 */

const DC_DIRECTORY = path.join(process.cwd(), "content", "site");

export type DcRenderOptions = {
  /**
   * Query string the document should read instead of `window.location.search`.
   * `project.dc.html` picks its case study from `?slug=`; the public route is
   * `/projects/[slug]`, so the slug is handed to it explicitly.
   */
  search?: string;
};

/** Returns everything between `<body>` and `</body>`. */
export function extractDcBody(html: string): string {
  const open = /<body[^>]*>/i.exec(html);
  if (!open) return html.trim();

  const start = open.index + open[0].length;
  const end = html.toLowerCase().lastIndexOf("</body>");
  return (end === -1 ? html.slice(start) : html.slice(start, end)).trim();
}

/** Rewrites links between documents to the routes that serve them. */
export function rewriteDcLinks(html: string): string {
  let out = html.replaceAll(`${DC_PROJECT_DOCUMENT}?slug=`, DC_PROJECT_ROUTE);

  for (const [file, route] of Object.entries(DC_LINK_MAP)) {
    out = out.replaceAll(file, route);
  }

  // The logo links to the folder the documents used to be served from.
  return out.replace(/(["'])\/site\/\1/g, "$1/$1");
}

/**
 * Absolutises the folder-relative URLs the documents and their scripts use —
 * `assets/x.png`, `scroll-in.js` — to `/site/…`.
 */
export function rewriteDcAssetUrls(html: string): string {
  return html
    .replace(/(["'(])(?:\.\/)?assets\//g, `$1${DC_ASSET_BASE}assets/`)
    .replace(
      /(["'])(?:\.\/)?([A-Za-z0-9._-]+\.js)\1/g,
      `$1${DC_ASSET_BASE}$2$1`
    );
}

/** Routes `window.location.search` reads through an injected query string. */
export function rewriteDcSearchAccess(html: string): string {
  return html.replaceAll(
    "window.location.search",
    "(window.__dcSearch||window.location.search)"
  );
}

/** Serialises a value for embedding in an inline `<script>`. */
function toScriptLiteral(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/**
 * Inline script that runs before the runtime: it points sibling-document
 * lookups at `/dc/*` and, for case studies, supplies the query string the
 * document expects.
 */
export function buildDcBootstrapScript(options: DcRenderOptions = {}): string {
  const lines = [
    `window.__resources=Object.assign(window.__resources||{},${toScriptLiteral(
      DC_FRAGMENT_RESOURCES
    )});`
  ];

  if (options.search) {
    lines.push(`window.__dcSearch=${toScriptLiteral(options.search)};`);
  }

  return lines.join("");
}

/** Turns a full document into the markup a Next.js page renders. */
export function buildDcPageMarkup(
  html: string,
  options: DcRenderOptions = {}
): string {
  let body = rewriteDcAssetUrls(rewriteDcLinks(extractDcBody(html)));
  if (options.search) body = rewriteDcSearchAccess(body);

  return [
    `<script>${buildDcBootstrapScript(options)}</script>`,
    body,
    `<script src="${DC_ASSET_BASE}support.js"></script>`
  ].join("\n");
}

/**
 * Turns a fragment document into the text the runtime fetches. Fragments keep
 * their document shell — the runtime parses `<x-dc>` out of the raw text — but
 * still need their links and assets rewritten.
 */
export function buildDcFragmentMarkup(html: string): string {
  return rewriteDcAssetUrls(rewriteDcLinks(html));
}

async function readDcDocument(fileName: string): Promise<string> {
  return readFile(path.join(DC_DIRECTORY, fileName), "utf8");
}

/** Reads a page document and returns the markup for its route. */
export async function renderDcPage(
  fileName: string,
  options: DcRenderOptions = {}
): Promise<string> {
  return buildDcPageMarkup(await readDcDocument(fileName), options);
}

/** Reads a fragment document and returns the text served at `/dc/[name]`. */
export async function renderDcFragment(name: string): Promise<string> {
  if (!isDcFragment(name)) {
    throw new Error(`Unknown design-canvas fragment: ${name}`);
  }

  return buildDcFragmentMarkup(await readDcDocument(`${name}.dc.html`));
}
