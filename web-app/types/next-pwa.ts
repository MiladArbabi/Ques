import type { NextConfig } from 'next';

export interface PWAConfig {
  dest: string;
  disable?: boolean;
  // add more options as you need them
}

/**
 * A no-op stub PWA plugin for development/testing, returns the config unmodified.
 * In production, real next-pwa will replace this.
 */
export default function createPWAPlugin(
  _options: PWAConfig
): (config: NextConfig) => NextConfig {
  // prevent unused var lint error
  void _options;
  return (nextConfig: NextConfig) => nextConfig;
}
