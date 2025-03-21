import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
  },
  images: {
    domains: ['upload.wikimedia.org'], // Add the domain here
  },
};



export default nextConfig;
