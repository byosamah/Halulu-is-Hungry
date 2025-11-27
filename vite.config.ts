import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      // ⚠️ SECURITY WARNING:
      // This configuration exposes the API key in the client-side JavaScript bundle
      // The key will be visible to anyone who inspects the deployed website
      //
      // For production, consider:
      // 1. Using a backend proxy to hide the API key
      // 2. Adding HTTP referrer restrictions to the API key
      // 3. Using environment-specific keys (dev vs. production)
      define: {
        // Only API_KEY is used in the codebase
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
