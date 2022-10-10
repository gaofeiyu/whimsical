import { defineConfig, createServer } from 'vite';
import path from 'path';
import base from './vite.base.config';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const baseConfig = base();
  let serverConfig = {};
  let build = {};
  if (command === 'build' && mode === 'component-dev') {
    build = {
      sourcemap: true,
    };
    serverConfig = {
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

  return {
    ...baseConfig,
    build: {
      ...baseConfig.build,
      build,
    },
  };
});
