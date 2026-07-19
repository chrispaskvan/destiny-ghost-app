import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindVite from '@tailwindcss/vite';

// Get ngrok URL from environment variable if available
const ngrokUrl = globalThis.process?.env?.NGROK_URL || '';
const ngrokHost = ngrokUrl ? new globalThis.URL(ngrokUrl).hostname : '';

// When running behind the Caddy HTTPS proxy, HMR must connect through it
const useProxy = globalThis.process?.env?.USE_PROXY === 'true';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: node({ mode: 'middleware' }),
  integrations: [react()],
  vite: {
    // Astro only exposes PUBLIC_-prefixed vars to client code by default;
    // this app's env contract (.env.example) uses the VITE_ prefix.
    envPrefix: ['VITE_', 'PUBLIC_'],
    plugins: [tailwindVite()],
    server: {
      host: '0.0.0.0',
      port: 1101,
      proxy: {
        '/api': {
          target: 'https://api2.destiny-ghost.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      ...(useProxy && {
        hmr: {
          protocol: 'wss',
          host: 'app2.destiny-ghost.com',
          clientPort: 8443,
        },
      }),
      allowedHosts: [
        'app2.destiny-ghost.com',
        '27c4-2604-2d80-7201-9c00-b0f5-d746-4522-f1d0.ngrok-free.app',
        ngrokHost,
        '.ngrok.io',
        '.ngrok-free.app',
        'localhost',
        '127.0.0.1'
      ].filter(Boolean),
    },
  },
});
