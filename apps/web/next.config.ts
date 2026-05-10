import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@maestro/ui", "@maestro/core", "@maestro/database"],
    reactCompiler: true,
};

export default nextConfig;
