import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output (.next/standalone/server.js) for self-hosting — production
  // builds only. Enabling it in `next dev` breaks API routes under Turbopack.
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,
};

export default nextConfig;
