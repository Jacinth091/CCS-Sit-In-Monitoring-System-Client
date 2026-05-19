import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
        cookiePathRewrite: {
          '/sitIn/api': '/api',
        },
        cookieDomainRewrite: '',
        rewrite: (path) => path.replace(/^\/api/, '/sitIn/api'),
      },
    },
  },
})
