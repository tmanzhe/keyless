import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  /* config options here */
};

export default nextConfig;
