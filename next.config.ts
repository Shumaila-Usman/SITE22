import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // Tell webpack these Node.js-only packages must never be bundled for the browser
  serverExternalPackages: ["mongoose", "mongodb"],
  images: {
    // Allow Next.js <Image> to serve local /uploads/ files without a hostname restriction
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
