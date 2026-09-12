import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is fully static: no server actions, no route handlers, no runtime
  // data. `export` emits a plain `out/` folder that any static host can serve.
  output: "export",

  // Static export has no image optimiser, so next/image serves the files in
  // `public/` as-is. Keep gallery images pre-compressed (they already are).
  images: { unoptimized: true },

  // Emit `/schedule/index.html` instead of `/schedule.html`, which is what
  // Cloudflare Pages, Netlify and GitHub Pages all resolve cleanly.
  trailingSlash: true,

  // A build that type-errors should fail, not ship. (Linting is a separate
  // `npm run lint` step in CI; Next 16 no longer runs it during `next build`.)
  typescript: { ignoreBuildErrors: false },

  poweredByHeader: false,
};

export default nextConfig;
