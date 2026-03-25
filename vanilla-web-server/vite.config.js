import { defineConfig, loadEnv } from 'vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const backendBaseUrl = env.BACKEND_URL || `http://localhost:3000`;
  const outDir = env.VITE_OUT_DIR_PATH || path.resolve(__dirname, 'dist/public');

  return {
    resolve: {
      alias: {
        '@/assets': path.resolve(__dirname, 'src/assets'),
      },
    },
    server: {
      // Defines the origin of the generated asset URLs during development.
      origin: backendBaseUrl,
    },
    // Project root directory (where index.html is located). Can be an absolute path, or a path relative to the current working directory.
    root: './src/assets',
    // Base public path when served in development or production. Valid values include:
    // base: '/spa/',
    build: {
      outDir,
      sourcemap: true,
      emptyOutDir: true,

      // Build as a library. entry is required since the library cannot use HTML as entry.
      // name is the exposed global variable and is required when formats includes 'umd' or 'iife'.
      // Default formats are ['es', 'umd'], or ['es', 'cjs'], if multiple entries are used.
      lib: {
        entry: ['main.ts'],
        name: 'App',
        fileName: (format, entryName) => `${entryName}.${format}.js`,
        cssFileName: 'styles',
      },
      // rolldownOptions: {
      //   input: path.resolve(__dirname, 'src/assets/main.ts'),
      // },
    },
  };
});
