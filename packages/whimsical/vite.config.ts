import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~antd': path.resolve(__dirname, './node_modules/antd'),
      src: path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
        additionalData: '@root-entry-name: default; @import "~antd/lib/style/themes/index.less";',
      },
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/pages/playground/index.tsx'),
      name: 'Whimsical',
      formats: ['umd', 'es'],
      fileName: (format) => `index.${format}.js`,
    },
    emptyOutDir: false,
    outDir: 'dist',
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
