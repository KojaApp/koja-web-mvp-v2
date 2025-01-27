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

export default nextConfig;
