import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // eslint config removed (deprecated in Next.js 16)
  // Use: npx next lint instead
};

export default nextConfig;
