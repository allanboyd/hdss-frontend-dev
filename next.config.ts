import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Suppress hydration warnings caused by browser extensions
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Handle browser extension modifications
  experimental: {
    // This helps with hydration mismatches from browser extensions
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
