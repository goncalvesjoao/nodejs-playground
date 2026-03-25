import { defineConfig, loadEnv } from 'vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const outDir = env.VITE_OUT_DIR_PATH || path.resolve(__dirname, 'dist/public');
  const devServerOrigin =
    env.VITE_DEV_SERVER_ORIGIN || 'http://localhost:5173';
  const browserEntry = path.resolve(__dirname, 'src/assets/main.ts');

  return {
    resolve: {
      alias: {
        '@/assets': path.resolve(__dirname, 'src/assets'),
      },
    },
    server: {
      cors: true,
      // Defines the origin of the generated asset URLs during development.
      origin: devServerOrigin,
    },
    root: './src',
    build: {
      outDir,
      sourcemap: true,
      emptyOutDir: true,
      manifest: 'manifest.json',

      rollupOptions: {
        input: browserEntry,
      },
    },
  };
});
