import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  // Send the client's timezone offset so daily challenges reset at the user's
  // local midnight rather than the server's UTC midnight.
  config.params = { ...config.params, tz: new Date().getTimezoneOffset() }
  return config
})

export default api
