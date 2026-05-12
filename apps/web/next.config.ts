import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@maestro/ui",
    "@maestro/domain",
    "@maestro/application",
    "@maestro/infrastructure",
  ],
  reactCompiler: true,
};

export default nextConfig;
