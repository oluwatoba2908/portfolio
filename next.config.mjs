/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.prod.website-files.com" }
    ]
  },
  /*
   * The design-canvas pages are served by Next.js routes (see lib/dc/), but
   * their scripts still ask for images with folder-relative URLs like
   * "assets/x.png". Those resolve against the page URL, so map both the
   * top-level and nested forms back to the real asset folder.
   */
  async rewrites() {
    return [
      { source: "/assets/:path*", destination: "/site/assets/:path*" },
      { source: "/:segment*/assets/:path*", destination: "/site/assets/:path*" }
    ];
  },
  /* Old file URLs from the static build now point at the routes. */
  async redirects() {
    return [
      { source: "/site", destination: "/", permanent: false },
      { source: "/site/Homepage.dc.html", destination: "/", permanent: false },
      {
        source: "/site/about.dc.html",
        destination: "/about-toba",
        permanent: false
      },
      { source: "/about", destination: "/about-toba", permanent: false },
      {
        source: "/site/contact.dc.html",
        destination: "/contact",
        permanent: false
      },
      {
        source: "/site/playground.dc.html",
        destination: "/playground",
        permanent: false
      },
      {
        source: "/site/project.dc.html",
        destination: "/projects/:slug",
        permanent: false,
        has: [{ type: "query", key: "slug" }]
      },
      { source: "/site/project.dc.html", destination: "/", permanent: false }
    ];
  }
};

export default nextConfig;
