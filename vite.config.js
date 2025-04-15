import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Separate configs for popup and background
export default defineConfig(({ command, mode }) => {
  const isBackground = process.env.BUILD_TARGET === 'background';

  return {
    plugins: isBackground ? [] : [react()],
    build: {
      rollupOptions: {
        input: isBackground
          ? { background: resolve(__dirname, 'src/storage.js') }
          : { popup: resolve(__dirname, 'index.html') },
        output: {
          entryFileNames: '[name].js',
        },
      },
      emptyOutDir: false, // avoid clearing dist when running both builds
    },
  };
});
