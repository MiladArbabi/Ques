declare module 'next-pwa' {
  import { NextConfig } from 'next';
  interface PWAConfig {
    dest: string;
    disable?: boolean;
    // (you can add other props you need)
  }
  function withPWA(config: NextConfig & { pwa?: PWAConfig }): NextConfig;
  export default withPWA;
}
