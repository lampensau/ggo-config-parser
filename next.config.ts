/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/ggo-config-parser',
  assetPrefix: '/ggo-config-parser/',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
