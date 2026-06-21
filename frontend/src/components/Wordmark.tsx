export default function Wordmark({ size = 30, dark = false }: { size?: number; dark?: boolean }) {
  const textColor = dark ? '#fff' : 'var(--green-deep)'
  const creditColor = dark ? 'rgba(255,255,255,0.5)' : 'rgba(26,51,40,0.45)'
  return (
    <span style={{ display: 'inline-block' }}>
      <span style={{ display: 'block' }}>
        <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: size, color: textColor, letterSpacing: '0.02em' }}>
          Challenge Tre
        </span>
        <span style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 600, fontSize: Math.round(size * 1.1), color: '#c8952a', verticalAlign: '-0.04em' }}>
          3
        </span>
      </span>
      <span style={{ display: 'block', fontFamily: "'Oswald', sans-serif", fontWeight: 300, fontSize: 11, color: creditColor, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>
        by Casuarina Consulting
      </span>
    </span>
  )
}
