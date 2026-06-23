import { useNavigate, useLocation } from 'react-router-dom'

const TABS = [
  { path: '/',        icon: '🏠', label: 'Home'   },
  { path: '/impact',  icon: '🌍', label: 'Impact'  },
  { path: '/profile', icon: '👤', label: 'Profile' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="glass" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start',
      borderTop: '0.5px solid rgba(255,255,255,0.9)',
      boxShadow: '0 -8px 32px rgba(0,0,0,0.08), 0 -1px 0 rgba(0,0,0,0.04)',
      paddingBottom: 20,
      zIndex: 100,
    }}>
      {TABS.map(({ path, icon, label }) => {
        const active = pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 2, background: 'none', border: 'none', cursor: 'pointer',
              paddingTop: 0, paddingBottom: 0,
            }}
          >
            {/* Active pill, slides in at top edge */}
            <div style={{
              width: active ? 32 : 0,
              height: 3,
              borderRadius: '0 0 4px 4px',
              background: '#1b4332',
              transition: 'width 0.22s ease',
              marginBottom: 7,
            }} />
            <span style={{ fontSize: 22, lineHeight: 1 }}>{icon}</span>
            <span style={{
              fontSize: 10, marginTop: 3,
              fontFamily: "'Oswald', sans-serif",
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: active ? '#1b4332' : '#bbb',
              fontWeight: active ? 600 : 400,
              transition: 'color 0.2s',
            }}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
