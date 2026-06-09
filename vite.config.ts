import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Dev: /api se proxea a gtc-ibr.local/wp-json — evita CORS y mantiene URLs relativas.
// El backend ya emite Access-Control-Allow-Origin:* en REST; el proxy es por prolijidad.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://gtc-ibr.local',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/wp-json'),
      },
    },
  },
})
