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
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
