import react from '@vitejs/plugin-react';
import path from 'path';
import { UserConfig } from 'vite';

export default (packageType?: string): UserConfig => {
  const entryPath = packageType ? 'packages/src/engine.tsx' : 'packages/src/index.tsx';
  const libName = packageType ? 'WReactEngine' : 'WReact';
  return {
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
    resolve: {
      alias: {
        packages: path.resolve(__dirname, 'packages'),
      },
    },
    plugins: [react()],
    build: {
      lib: {
        entry: path.resolve(__dirname, entryPath),
        name: libName,
        formats: ['umd', 'es'],
        fileName: (format) => {
          return packageType ? `CReact.${packageType}.${format}.js` : `CReact.${format}.js`;
        },
      },
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
      emptyOutDir: false,
    },
  };
};
