import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a minimal standalone server (.next/standalone/server.js) for self-hosting.
  output: "standalone",
};

export default nextConfig;
