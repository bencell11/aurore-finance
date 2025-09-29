import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignore TypeScript errors during development
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
