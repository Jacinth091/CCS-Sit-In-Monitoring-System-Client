import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const rawApiUrl = String(env.VITE_API_URL || '').trim().replace(/^['"]|['"]$/g, '')

  let target = 'http://localhost'
  let apiBasePath = '/sitIn/api'

  if (rawApiUrl) {
    try {
      const url = new URL(rawApiUrl)
      target = url.origin
      apiBasePath = url.pathname.replace(/\/$/, '') || apiBasePath
    } catch {
      // Fallback to defaults if URL parsing fails
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          secure: false,
          cookiePathRewrite: {
            [apiBasePath]: '/api',
          },
          cookieDomainRewrite: '',
          rewrite: (path) => path.replace(/^\/api/, apiBasePath),
        },
      },
    },
  }
})
