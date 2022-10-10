import { defineConfig, UserConfig } from 'vite';
import base from './vite.base.config';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const config: UserConfig = base('production');
  return config;
});
