import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@batisseur/core'],
    reactCompiler: true,
};

export default nextConfig;
