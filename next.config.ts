import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
  },
};

module.exports = {
  experimental: {
    turbopack: false,
  },
};

module.exports = {
  experimental: {
    appDir: true,
    esmExternals: 'loose',  // This ensures compatibility with ESM and CommonJS
  },
  reactStrictMode: true,
};

export default nextConfig;
