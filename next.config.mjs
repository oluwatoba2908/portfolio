/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.prod.website-files.com" }
    ]
  },
};

// The static DC build is still served verbatim from /site/*.dc.html, but it no
// longer backs the public routes — every route below is now a real App Router
// page. The old rewrites were dead once those pages existed (rewrites resolve
// after filesystem routes), and the /projects/:slug redirect actively shadowed
// the new case-study route, so both were removed.

export default nextConfig;
