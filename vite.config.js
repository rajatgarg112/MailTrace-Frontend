import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const appMode = process.env.VITE_APP_MODE || env.VITE_APP_MODE || mode;
  const isSecurity = appMode === 'security';
  const port = isSecurity ? 5174 : 5173;

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_APP_MODE': JSON.stringify(isSecurity ? 'security' : 'user'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port,
      strictPort: true,
      open: false,
    },
  };
});
