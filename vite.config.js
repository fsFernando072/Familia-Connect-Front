import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/grafana": {
        target: process.env.GRAFANA_DEV_URL || "http://localhost:80",
        changeOrigin: true,
      },
    },
  },
})
