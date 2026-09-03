import { describe, expect, it } from "vitest";

import {
  buildDcBootstrapScript,
  buildDcFragmentMarkup,
  buildDcPageMarkup,
  extractDcBody,
  rewriteDcAssetUrls,
  rewriteDcLinks,
  rewriteDcSearchAccess
} from "./document";

const DOCUMENT = [
  "<!DOCTYPE html>",
  "<html>",
  '<head><base href="/site/"><script src="./support.js"></script></head>',
  "<body>",
  "<x-dc>",
  "<helmet>",
  '  <script src="scroll-in.js"></script>',
  "</helmet>",
  '<a href="/site/">Toba</a>',
  '<a href="about.dc.html">About me</a>',
  '<img src="assets/portrait.png">',
  "</x-dc>",
  '<script type="text/x-dc" data-dc-script>',
  "class Component extends DCLogic {",
  "  componentDidMount() {",
  "    import('./case-studies.js').then(() => {});",
  "    const slug = new URLSearchParams(window.location.search).get('slug');",
  '    this.setState({ href: `project.dc.html?slug=${slug}` });',
  "  }",
  "}",
  "</script>",
  "</body>",
  "</html>"
].join("\n");

describe("extractDcBody", () => {
  it("drops the document shell so the layout owns <html> and <head>", () => {
    const body = extractDcBody(DOCUMENT);

    expect(body).not.toContain("<head>");
    expect(body).not.toContain('<base href="/site/">');
    expect(body.startsWith("<x-dc>")).toBe(true);
    expect(body.endsWith("</script>")).toBe(true);
  });

  it("returns the input unchanged when there is no body element", () => {
    expect(extractDcBody("<x-dc>bare</x-dc>")).toBe("<x-dc>bare</x-dc>");
  });
});

describe("rewriteDcLinks", () => {
  it("never leaves a .html URL in a link between pages", () => {
    const out = rewriteDcLinks(extractDcBody(DOCUMENT));

    expect(out).not.toContain(".dc.html");
    expect(out).toContain('<a href="/about-toba">About me</a>');
  });

  it("maps case-study links to their slug route", () => {
    expect(rewriteDcLinks('href="project.dc.html?slug=givn"')).toBe(
      'href="/projects/givn"'
    );
  });

  it("keeps templated case-study links intact", () => {
    expect(rewriteDcLinks("`project.dc.html?slug=${c.slug}`")).toBe(
      "`/projects/${c.slug}`"
    );
  });

  it("points the logo at the site root rather than the old folder", () => {
    expect(rewriteDcLinks('<a href="/site/">Toba</a>')).toBe(
      '<a href="/">Toba</a>'
    );
  });
});

describe("rewriteDcAssetUrls", () => {
  it("resolves folder-relative images against the asset folder", () => {
    expect(rewriteDcAssetUrls('<img src="assets/portrait.png">')).toBe(
      '<img src="/site/assets/portrait.png">'
    );
  });

  it("resolves relative asset URLs used inside stylesheets", () => {
    expect(rewriteDcAssetUrls("background: url(assets/grain.png);")).toBe(
      "background: url(/site/assets/grain.png);"
    );
  });

  it("resolves page scripts, including dynamic imports", () => {
    const out = rewriteDcAssetUrls(
      "<script src=\"scroll-in.js\"></script>import('./case-studies.js')"
    );

    expect(out).toContain('<script src="/site/scroll-in.js"></script>');
    expect(out).toContain("import('/site/case-studies.js')");
  });

  it("leaves already-absolute and remote URLs alone", () => {
    const untouched =
      '<img src="https://cdn.example.com/assets/a.png"><script src="/site/vw.js"></script>';

    expect(rewriteDcAssetUrls(untouched)).toBe(untouched);
  });

  it("does not rewrite image filenames used in CSS selectors", () => {
    const selector = 'img[src$="as-impact-globe.png"] { border-radius: 0; }';

    expect(rewriteDcAssetUrls(selector)).toBe(selector);
  });
});

describe("rewriteDcSearchAccess", () => {
  it("prefers the injected query string over the browser URL", () => {
    expect(
      rewriteDcSearchAccess("new URLSearchParams(window.location.search)")
    ).toBe(
      "new URLSearchParams((window.__dcSearch||window.location.search))"
    );
  });
});

describe("buildDcBootstrapScript", () => {
  it("redirects sibling document lookups to the fragment route", () => {
    const script = buildDcBootstrapScript();

    expect(script).toContain('"./Nav.dc.html":"/dc/Nav"');
    expect(script).toContain('"./Footer.dc.html":"/dc/Footer"');
    expect(script).toContain('"./PreFooterCTA.dc.html":"/dc/PreFooterCTA"');
  });

  it("omits the query string when the page does not need one", () => {
    expect(buildDcBootstrapScript()).not.toContain("__dcSearch");
  });

  it("escapes markup so an injected value cannot close the script tag", () => {
    const script = buildDcBootstrapScript({ search: "?slug=</script>" });

    expect(script).not.toContain("</script>");
    expect(script).toContain("__dcSearch");
  });
});

describe("buildDcPageMarkup", () => {
  it("loads the runtime after the markup it boots", () => {
    const markup = buildDcPageMarkup(DOCUMENT);

    expect(markup.indexOf("<x-dc>")).toBeLessThan(
      markup.indexOf('<script src="/site/support.js"></script>')
    );
  });

  it("declares the fragment map before the runtime runs", () => {
    const markup = buildDcPageMarkup(DOCUMENT);

    expect(markup.indexOf("window.__resources")).toBeLessThan(
      markup.indexOf('<script src="/site/support.js"></script>')
    );
  });

  it("only injects a query string when one is supplied", () => {
    expect(buildDcPageMarkup(DOCUMENT)).not.toContain("__dcSearch");
    expect(buildDcPageMarkup(DOCUMENT, { search: "?slug=givn" })).toContain(
      'window.__dcSearch="?slug=givn"'
    );
  });
});

describe("buildDcFragmentMarkup", () => {
  it("keeps the document shell the runtime parses", () => {
    const fragment = buildDcFragmentMarkup(DOCUMENT);

    expect(fragment).toContain("<x-dc>");
    expect(fragment).toContain("<html>");
  });

  it("rewrites nav links so imported chrome links to routes", () => {
    expect(buildDcFragmentMarkup(DOCUMENT)).toContain('href="/about-toba"');
  });
});
