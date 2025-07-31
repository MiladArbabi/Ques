// web-app/next.config.ts
import type { NextConfig } from 'next';
import createPWAPlugin from 'next-pwa';

const pwaOptions = {
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
};

// 1) Create the wrapper with your PWA options
const withPWA = createPWAPlugin(pwaOptions);

// 2) Your Next.js config
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // …any other Next.js settings…
};

// 3) Export the wrapped config
export default withPWA(nextConfig);
