import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

const CATEGORY_EMOJI: Record<string, string> = {
  ENERGY: '⚡', WATER: '💧', WASTE: '♻️', TRANSPORT: '🚲',
  FOOD: '🥦', CONSUMPTION: '🛍️', BIODIVERSITY: '🌿', COMMUNITY: '🤝',
  SOCIAL_EQUITY: '⚖️', CIRCULAR_ECONOMY: '🔄', CLIMATE_ADVOCACY: '📢', WELLBEING: '🌱',
}

const DEMO_CHALLENGES = [
  {
    id: 'demo-1', isCompleted: false,
    challenge: {
      id: 'demo-1', title: '5-minute shower', category: 'WATER',
      description: 'Cut your shower to 5 minutes today and save up to 50 litres of water.',
      timeEstimate: 5, costLevel: 'free', difficulty: 1,
    },
  },
  {
    id: 'demo-2', isCompleted: false,
    challenge: {
      id: 'demo-2', title: 'Plant-based meal', category: 'FOOD',
      description: 'Cook one fully plant-based meal — no meat, no dairy.',
      timeEstimate: 30, costLevel: 'low', difficulty: 2,
    },
  },
  {
    id: 'demo-3', isCompleted: false,
    challenge: {
      id: 'demo-3', title: 'Walk or cycle one trip', category: 'TRANSPORT',
      description: 'Skip motorised transport for one journey today, no matter how short.',
      timeEstimate: 20, costLevel: 'free', difficulty: 1,
    },
  },
]

export default function HomePage() {
  const user     = useAuthStore(s => s.user)
  const logout   = useAuthStore(s => s.logout)
  const navigate = useNavigate()
  const qc       = useQueryClient()

  const { data: challenges, isLoading } = useQuery({
    queryKey: ['daily-challenges'],
    queryFn: () => api.get('/challenges/daily').then(r => r.data).catch(() => null),
  })

  const displayChallenges = challenges ?? DEMO_CHALLENGES

  const [demoCompleted, setDemoCompleted] = useState<Set<string>>(new Set())

  const completeMutation = useMutation({
    mutationFn: (challengeId: string) => {
      if (challengeId.startsWith('demo-')) {
        setDemoCompleted(prev => new Set(prev).add(challengeId))
        return Promise.resolve(null as any)
      }
      return api.post(`/challenges/${challengeId}/complete`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['daily-challenges'] }),
  })

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-6" style={{ background: 'var(--green-deep)' }}>
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-white">Challenge Tree</h1>
          <button onClick={() => { logout(); navigate('/login') }}
            className="text-sm px-3 py-1 rounded-lg text-white" style={{ background: 'rgba(255,255,255,0.15)' }}>
            Sign out
          </button>
        </div>
        <p className="text-sm" style={{ color: '#95d5b2' }}>
          Good {getTimeOfDay()}, {user?.name?.split(' ')[0]}
        </p>
      </div>

      <div className="px-6 mt-6">
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--green-deep)' }}>Today's Challenges</h2>
        <p className="text-sm mb-5" style={{ color: '#6b7280' }}>Complete all 3 to keep your streak alive 🔥</p>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-36 rounded-2xl animate-pulse" style={{ background: '#e5e7eb' }} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {displayChallenges?.map((uc: any) => {
              const c = uc.challenge
              const isCompleted = uc.isCompleted || demoCompleted.has(uc.id)
              return (
                <div key={uc.id} className="rounded-2xl p-5"
                  style={{ background: '#fff', border: isCompleted ? '2px solid var(--green-light)' : '1px solid #e5e7eb' }}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl">{CATEGORY_EMOJI[c.category] ?? '🌍'}</span>
                    {isCompleted && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={{ background: '#d8f3dc', color: 'var(--green-deep)' }}>Done ✓</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--green-deep)' }}>{c.title}</h3>
                  <p className="text-sm mb-3" style={{ color: '#6b7280' }}>{c.description}</p>
                  <div className="flex gap-3 text-xs mb-4" style={{ color: '#9ca3af' }}>
                    <span>⏱ {c.timeEstimate} min</span>
                    <span>💰 {c.costLevel}</span>
                    <span>🎯 Level {c.difficulty}</span>
                  </div>
                  {!isCompleted && (
                    <button
                      onClick={() => completeMutation.mutate(c.id)}
                      disabled={completeMutation.isPending}
                      className="w-full py-2.5 rounded-xl text-white text-sm font-semibold"
                      style={{ background: 'var(--green-mid)' }}>
                      Mark complete
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around py-4 px-6"
        style={{ background: '#fff', borderTop: '1px solid #e5e7eb' }}>
        <NavBtn icon="🏠" label="Home"    onClick={() => navigate('/')} />
        <NavBtn icon="🌍" label="Impact"  onClick={() => navigate('/impact')} />
        <NavBtn icon="👤" label="Profile" onClick={() => navigate('/profile')} />
      </nav>
    </div>
  )
}

function NavBtn({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1">
      <span className="text-xl">{icon}</span>
      <span className="text-xs" style={{ color: '#6b7280' }}>{label}</span>
    </button>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
}
