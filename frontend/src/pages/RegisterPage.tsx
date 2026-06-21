import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../utils/api'
import Wordmark from '../components/Wordmark'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', country: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore(s => s.setAuth)
  const navigate = useNavigate()

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/register', form)
      setAuth(data.user, data.token)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'var(--cream)' }}>
      <div className="w-full max-w-sm">
        <h1 className="mb-1" style={{ color: 'var(--green-deep)', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, fontSize: 30 }}>Join <Wordmark size={30} /></h1>
        <p className="text-sm mb-8" style={{ color: 'var(--green-mid)' }}>Start your daily sustainability journey.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {(['name', 'email', 'password', 'country'] as const).map(field => (
            <input
              key={field}
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={update(field)}
              required={field !== 'country'}
              className="w-full px-4 py-3 rounded-xl border text-base outline-none"
              style={{ borderColor: '#d1d5db', background: '#fff' }}
            />
          ))}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-base"
            style={{ background: loading ? '#52b788' : 'var(--green-mid)' }}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center" style={{ color: '#6b7280' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-medium" style={{ color: 'var(--green-mid)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
