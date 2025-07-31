import withPWA from 'next-pwa'
import type { NextConfig } from 'next'

const pwaConfig = {
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pwa: pwaConfig,
  // …other settings…
}

export default withPWA(nextConfig)