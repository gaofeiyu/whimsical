import { createServer, defineConfig, InlineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build' && mode === 'dev') {
    const serverConfig: InlineConfig = {
      configFile: false,
      root: path.resolve(__dirname, 'dist'),
      server: {
        port: 8010,
      },
    };
    (async () => {
      const server = await createServer(serverConfig);
      await server.listen();

      server.printUrls();
    })();
  }

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
