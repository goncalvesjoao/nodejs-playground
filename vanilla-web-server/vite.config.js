import { defineConfig } from 'vite';
import path from 'node:path';
import { env } from './config/env';
import { SRC_DIR_NAME, VITE_ENTRY, PUBLIC_DIR_NAME, VITE_MANIFEST_FILE_NAME } from './config/constants';

// https://vite.dev/config/
export default defineConfig(async () => {
  env.load();

  return {
    resolve: {
      tsconfigPaths: true,
      alias: {
        '@/assets': path.resolve(__dirname, SRC_DIR_NAME, 'assets'),
      },
    },
    server: {
      cors: true,
      origin: env.viteDevServerOrigin,
    },
    root: SRC_DIR_NAME,
    build: {
      outDir: path.resolve(__dirname, 'dist', PUBLIC_DIR_NAME),
      sourcemap: true,
      emptyOutDir: true,
      manifest: VITE_MANIFEST_FILE_NAME,
      rollupOptions: {
        input: path.resolve(__dirname, SRC_DIR_NAME, VITE_ENTRY),
      },
    },
  };
});
