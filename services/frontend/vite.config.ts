import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, path.resolve(__dirname, '../..'), '');
    const apiProxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8000';
    return {
      envDir: path.resolve(__dirname, '../..'),
      publicDir: path.resolve(__dirname, '../../public'),
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: apiProxyTarget,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          }
        }
      },
      preview: {
        port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      // API keys handled server-side only
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
        }
      }
    };
});
