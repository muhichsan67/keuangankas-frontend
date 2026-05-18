import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// Gunakan loadEnv agar proxy target ikut membaca VITE_API_BASE_URL dari .env
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_API_BASE_URL || 'http://localhost:8000'

  return {
    plugins: [vue()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        },
        '/sanctum': {
          target: backendUrl,
          changeOrigin: true,
        },
        '/storage': {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
  }
})
