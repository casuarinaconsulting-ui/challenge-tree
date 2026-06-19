import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function ImpactPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['impact'],
    queryFn: () => api.get('/impact').then(r => r.data),
  })

  const stats = [
    { icon: '🌬️', label: 'CO₂ saved',       value: `${(data?.co2Saved ?? 0).toFixed(1)} kg` },
    { icon: '💧', label: 'Water saved',      value: `${(data?.waterSaved ?? 0).toFixed(0)} L` },
    { icon: '♻️', label: 'Waste diverted',   value: `${(data?.wasteDiverted ?? 0).toFixed(1)} kg` },
    { icon: '🌳', label: 'Trees equivalent', value: `${(data?.treesEquiv ?? 0).toFixed(2)}` },
    { icon: '✅', label: 'Total actions',    value: `${data?.totalActions ?? 0}` },
  ]

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--cream)' }}>
      <div className="px-6 pt-12 pb-6" style={{ background: 'var(--green-deep)' }}>
        <button onClick={() => navigate('/')} className="text-white text-sm mb-4 opacity-70">← Back</button>
        <h1 className="text-2xl font-bold text-white">Your Impact</h1>
        <p className="text-sm mt-1" style={{ color: '#95d5b2' }}>Every action adds up</p>
      </div>

      <div className="px-6 mt-6 grid grid-cols-2 gap-4">
        {isLoading
          ? [1,2,3,4,5].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: '#e5e7eb' }} />)
          : stats.map(s => (
              <div key={s.label} className="rounded-2xl p-4 flex flex-col gap-1"
                style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xl font-bold" style={{ color: 'var(--green-deep)' }}>{s.value}</span>
                <span className="text-xs" style={{ color: '#6b7280' }}>{s.label}</span>
              </div>
            ))
        }
      </div>
    </div>
  )
}
