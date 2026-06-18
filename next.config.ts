import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  serverExternalPackages: ['@napi-rs/canvas'],
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

export default nextConfig;
