import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../utils/api'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const setAuth = useAuthStore(s => s.setAuth)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setAuth(data.user, data.token)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'var(--cream)' }}>
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--green-deep)', fontFamily: 'system-ui' }}>
          Challenge Tree
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--green-mid)' }}>Small actions. Global impact. Every day.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl border text-base outline-none"
            style={{ borderColor: '#d1d5db', background: '#fff' }}
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl border text-base outline-none"
            style={{ borderColor: '#d1d5db', background: '#fff' }}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-base"
            style={{ background: loading ? '#52b788' : 'var(--green-mid)' }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center" style={{ color: '#6b7280' }}>
          No account?{' '}
          <Link to="/register" className="font-medium" style={{ color: 'var(--green-mid)' }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}
