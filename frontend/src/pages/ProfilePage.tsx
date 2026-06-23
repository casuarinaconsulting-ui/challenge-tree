import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../utils/api'
import BottomNav from '../components/BottomNav'
import { getEcosystem } from '../utils/ecosystems'

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

  const ecosystem = getEcosystem(
    (profile?.preferences as any)?.ecosystem,
    profile?.id ?? profile?.email
  )

  return (
    <div className="min-h-screen pb-32" style={{
      background: `
        radial-gradient(ellipse at 15% 0%, rgba(82,183,136,0.10) 0%, transparent 55%),
        radial-gradient(ellipse at 85% 100%, rgba(200,149,42,0.07) 0%, transparent 55%),
        #f5efe6
      `,
    }}>

      {/* ── Header ── */}
      <div className="px-6 pt-14 pb-8" style={{ background: 'var(--green-deep)', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: -30, right: -20, width: 160, height: 160, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(82,183,136,0.2) 0%, transparent 70%)',
          animation: 'orbDrift 8s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: -20, width: 100, height: 100, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,149,42,0.14) 0%, transparent 70%)',
          animation: 'orbDrift 11s ease-in-out infinite reverse', pointerEvents: 'none',
        }} />
        <div className="flex items-center gap-4" style={{ position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: -3, borderRadius: '50%',
              background: 'conic-gradient(#c8952a, #52b788, #c8952a)',
              animation: 'floatSlow 4s ease-in-out infinite',
            }} />
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ background: 'var(--green-mid)', position: 'relative' }}>
              {isLoading ? '…' : ecosystem.emoji}
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{isLoading ? '…' : profile?.name}</h1>
            <p className="text-sm" style={{ color: '#95d5b2' }}>{profile?.email}</p>
            {!isLoading && (
              <p style={{
                fontSize: 10.5, color: 'rgba(149,213,178,0.65)',
                fontFamily: "'Oswald', sans-serif", letterSpacing: '0.12em',
                textTransform: 'uppercase', marginTop: 3,
              }}>
                {ecosystem.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">

        {/* Streak card */}
        <div className="card-3d animate-slide-up rounded-2xl p-5 mb-4" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: '20%', right: '20%', height: 3, borderRadius: '0 0 4px 4px',
            background: 'linear-gradient(90deg, #52b788, #c8952a)', opacity: 0.7,
          }} />
          <h2 className="font-semibold mb-3" style={{ color: 'var(--green-deep)', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12 }}>Streak</h2>
          <div className="flex gap-6">
            <div>
              <p className="text-3xl font-bold" style={{ color: 'var(--green-mid)', fontFamily: "'Oswald', sans-serif" }}>{profile?.streakCount ?? 0}</p>
              <p className="text-xs" style={{ color: '#6b7280' }}>Current 🔥</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: 'var(--green-mid)', fontFamily: "'Oswald', sans-serif" }}>{profile?.longestStreak ?? 0}</p>
              <p className="text-xs" style={{ color: '#6b7280' }}>Best 🏆</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        {badges?.length > 0 && (
          <div className="card-3d animate-slide-up rounded-2xl p-5 mb-4" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.05)', animationDelay: '0.07s' }}>
            <h2 className="font-semibold mb-3" style={{ color: 'var(--green-deep)', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12 }}>Badges</h2>
            <div className="flex flex-wrap gap-2">
              {badges.map((ub: any) => (
                <span key={ub.badge.id} className="text-2xl" title={ub.badge.name}>{ub.badge.icon}</span>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => { logout(); navigate('/login') }}
          className="w-full py-3 rounded-xl text-sm font-semibold mt-2"
          style={{
            background: 'linear-gradient(135deg, #fee2e2, #fecaca)', color: '#dc2626',
            border: '1px solid #fca5a5',
            boxShadow: '0 4px 14px rgba(220,38,38,0.12)',
          }}>
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
