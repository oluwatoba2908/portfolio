/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.prod.website-files.com" }
    ]
  },
  async rewrites() {
    return [
      { source: "/", destination: "/site/Homepage.dc.html" },
      { source: "/about-toba", destination: "/site/about.dc.html" },
      { source: "/contact", destination: "/site/contact.dc.html" },
      { source: "/playground", destination: "/site/playground.dc.html" }
    ];
  },
  async redirects() {
    return [
      {
        source: "/projects/:slug",
        destination: "/site/project.dc.html?slug=:slug",
        permanent: false
      }
    ];
  }
};

export default nextConfig;
