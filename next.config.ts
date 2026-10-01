import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory otherwise makes Turbopack guess the wrong root.
  turbopack: { root: __dirname },
};

export default nextConfig;
