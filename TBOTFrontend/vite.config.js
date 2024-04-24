import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      server: { https: true },
      watch: {
        usePolling: true,
      },
      host: true, 
      proxy: {
        '/auth': {
          target: env.BACKEND_URL || 'http://localhost:5263/',
          changeOrigin: true,
          credentials: true,
        },
        '/users': {
          target: env.BACKEND_URL || 'http://localhost:5263/',
          changeOrigin: true,
          credentials: true,
        },
        '/balance': {
          target: env.BACKEND_URL || 'http://localhost:5263/',
          changeOrigin: true,
          credentials: true,
        },
        '/expense': {
          target: env.BACKEND_URL || 'http://localhost:5263/',
          changeOrigin: true,
          credentials: true,
        },
        '/friendship': {
          target: env.BACKEND_URL || 'http://localhost:5263/',
          changeOrigin: true,
          credentials: true,
        },
      },
    },
  };
});
