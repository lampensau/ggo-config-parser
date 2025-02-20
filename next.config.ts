import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/ggo-config-parser' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ggo-config-parser/' : '',
  trailingSlash: process.env.NODE_ENV === 'production',
  compress: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-tooltip',
      'clsx',
      'tailwind-merge'
    ]
  },
};

export default nextConfig;
