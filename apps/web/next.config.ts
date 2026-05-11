import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@maestro/ui", "@maestro/core"],
  reactCompiler: true,
};

export default nextConfig;
