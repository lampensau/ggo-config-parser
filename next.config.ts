import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/ggo-config-parser' : '',
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
