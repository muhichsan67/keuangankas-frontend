import axios from 'axios'
import router from '../router'

/**
 * Axios instance configured for Laravel Sanctum Bearer Token auth.
 * - Base URL dibaca dari VITE_API_BASE_URL di file .env
 * - Auto-injects Authorization header from localStorage.
 * - Handles 401/403 globally → clears session and redirects to Login.
 */

// Baca dari .env → VITE_API_BASE_URL (wajib diawali VITE_ agar diekspos Vite)
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

// ── Request Interceptor ─────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response Interceptor ────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    // Unauthorized or Forbidden → force logout
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      router.push({ name: 'Login' })
    }

    return Promise.reject(error)
  },
)

export default api
