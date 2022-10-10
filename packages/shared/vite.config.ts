import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: path.resolve(__dirname, './src/index.ts'),
        name: 'WShared',
        formats: ['umd', 'es'],
        fileName: (format) => `index.${format}.js`,
      },
      emptyOutDir: false,
    },
  };
});
