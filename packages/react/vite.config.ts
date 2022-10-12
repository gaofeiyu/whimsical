import { createServer, defineConfig, InlineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = JSON.stringify(process.env.NODE_ENV || 'production');
  let entryPath = 'src/index.tsx';
  let libName = 'WReact';

  if (command === 'build' && mode === 'dev') {
    const serverConfig: InlineConfig = {
      configFile: false,
      root: path.resolve(__dirname, 'dist'),
      server: {
        port: 8070,
      },
    };
    (async () => {
      const server = await createServer(serverConfig);
      await server.listen();

      server.printUrls();
    })();
  }

  if (command === 'build' && mode === 'editor') {
    entryPath = 'src/editor.tsx';
    libName = 'WReactEditor';
  }

  if (command === 'build' && mode === 'engine') {
    entryPath = 'src/engine.tsx';
    libName = 'WReactEngine';
  }

  return {
    define: {
      'process.env.NODE_ENV': env,
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
        name: 'WReact',
        formats: ['umd', 'es'],
        fileName: (format) => {
          return `${libName}.${format}.js`;
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
      sourcemap: env !== 'production',
    },
  };
});
