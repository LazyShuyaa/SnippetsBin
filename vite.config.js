import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // Accept proxied/preview hosts (e.g. *.e2b.app) instead of returning 403.
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
  build: {
    // react-syntax-highlighter ships every registered language in one chunk.
    chunkSizeWarningLimit: 1500,
  },
});
