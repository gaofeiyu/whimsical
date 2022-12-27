import { createServer, defineConfig, InlineConfig, LibraryOptions } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import genEntries from './scripts/getEntries';

const libInput = genEntries('src/**/*.{tsx,ts}');

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = JSON.stringify(process.env.NODE_ENV || 'production');
  const rollupOptions: any = {
    input: {},
    output: {
      dir: 'dist',
    },
  };
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
    entryPath = 'src/engine/index.tsx';
    libName = 'WReactEngine';
  }

  const lib: LibraryOptions = {
    entry: path.resolve(__dirname, entryPath),
    formats: ['umd', 'es'],
    name: libName,
    fileName: (format) => {
      return `${libName}.${format}.js`;
    },
  };

  if (command === 'build' && mode === 'production') {
    rollupOptions.input = libInput;
    rollupOptions.output = {
      dir: 'dist/packages',
    };
    lib.entry = libInput;
    lib.formats = ['es', 'cjs'];
    lib.fileName = (format, entryName) => {
      return `${format}/${entryName}.js`;
    };
    delete lib.name;
  }
  return {
    define: {
      __NODE_ENV__: env,
    },
    plugins: [react()],
    build: {
      lib,
      rollupOptions: {
        // 确保外部化处理那些您不想打包进库的依赖
        external: ['react', 'react-dom'],
        output: {
          ...rollupOptions.output,
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
