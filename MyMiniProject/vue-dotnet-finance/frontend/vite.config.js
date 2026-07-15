import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5221,
    proxy: {
      '/api': 'http://localhost:5220',
      '/uploads': 'http://localhost:5220',
    },
  },
})
