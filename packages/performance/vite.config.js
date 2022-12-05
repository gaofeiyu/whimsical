import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  console.log(mode)
  const root = mode === 'jsx' ? 'JSXEntry' :  'DSLEntry';
  return {
    root: `./${root}`,
    plugins: [react()],
    build: {
      outDir: `../dist/${root}`,
      emptyOutDir: true
    },

  }
})
