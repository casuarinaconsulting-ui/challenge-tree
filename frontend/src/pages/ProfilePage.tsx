import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../utils/api'
import BottomNav from '../components/BottomNav'

export default function ProfilePage() {
  const navigate = useNavigate()
  const logout   = useAuthStore(s => s.logout)

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/user/profile').then(r => r.data),
  })

  const { data: badges } = useQuery({
    queryKey: ['badges'],
    queryFn: () => api.get('/badges').then(r => r.data),
  })

  return (
    <div className="min-h-screen pb-32" style={{ background: 'var(--cream)' }}>

      {/* ── Header ── */}
      <div className="px-6 pt-14 pb-8" style={{ background: 'var(--green-deep)' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
            style={{ background: 'var(--green-mid)' }}>
            {profile?.name?.[0] ?? '?'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{isLoading ? '…' : profile?.name}</h1>
            <p className="text-sm" style={{ color: '#95d5b2' }}>{profile?.email}</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">

        {/* Streak card */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
          <h2 className="font-semibold mb-3" style={{ color: 'var(--green-deep)' }}>Streak</h2>
          <div className="flex gap-6">
            <div>
              <p className="text-3xl font-bold" style={{ color: 'var(--green-mid)' }}>{profile?.streakCount ?? 0}</p>
              <p className="text-xs" style={{ color: '#6b7280' }}>Current streak 🔥</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: 'var(--green-mid)' }}>{profile?.longestStreak ?? 0}</p>
              <p className="text-xs" style={{ color: '#6b7280' }}>Best streak 🏆</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        {badges?.length > 0 && (
          <div className="rounded-2xl p-5 mb-4" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
            <h2 className="font-semibold mb-3" style={{ color: 'var(--green-deep)' }}>Badges</h2>
            <div className="flex flex-wrap gap-2">
              {badges.map((ub: any) => (
                <span key={ub.badge.id} className="text-2xl" title={ub.badge.name}>{ub.badge.icon}</span>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => { logout(); navigate('/login') }}
          className="w-full py-3 rounded-xl text-sm font-semibold mt-2"
          style={{ background: '#fee2e2', color: '#dc2626' }}>
          Sign out
        </button>

        <div style={{
          textAlign: 'center', padding: '24px 0 8px',
          fontFamily: "'Oswald', sans-serif", fontSize: 10,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(26,51,40,0.28)',
        }}>
          Casuarina Consulting
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
