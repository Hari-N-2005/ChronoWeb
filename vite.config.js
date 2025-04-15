import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),       // your main React app
        background: resolve(__dirname, 'src/storage.js') // background script
      },
      output: {
        entryFileNames: 'background.js', // name files as popup.js, background.js etc
      }
    }
  }
})
