import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: `
        radial-gradient(ellipse at 20% 20%, rgba(82,183,136,0.12) 0%, transparent 55%),
        radial-gradient(ellipse at 80% 80%, rgba(200,149,42,0.08) 0%, transparent 55%),
        #f5efe6
      `,
      padding: '0 24px',
    }}>
      <div className="card-3d animate-slide-up" style={{
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)',
        borderRadius: 24, padding: '48px 36px', textAlign: 'center',
        maxWidth: 360, width: '100%', position: 'relative', overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.95)',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: 3,
          borderRadius: '0 0 4px 4px',
          background: 'linear-gradient(90deg, #1b4332, #52b788, #c8952a)', opacity: 0.7,
        }} />
        <div style={{ fontSize: 56, marginBottom: 8 }}>🌿</div>
        <h1 style={{
          fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 28,
          color: '#1b4332', margin: '0 0 8px',
        }}>Page not found</h1>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, margin: '0 0 28px' }}>
          Looks like this path doesn't exist yet. Let's get you back on track.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%', padding: '14px 0', borderRadius: 14, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #2d6a4f, #1b4332)',
            color: '#fff', fontFamily: "'Oswald', sans-serif",
            fontWeight: 500, fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase',
            boxShadow: '0 4px 16px rgba(27,67,50,0.35)',
          }}
        >
          Go home
        </button>
      </div>
    </div>
  )
}
