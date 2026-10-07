import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory otherwise makes Turbopack guess the wrong root.
  turbopack: { root: __dirname },
  // Two root layouts (site, studio) leave no single layout for an app-wide 404.
  experimental: { globalNotFound: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/**`,
      },
    ],
  },
};

export default nextConfig;
