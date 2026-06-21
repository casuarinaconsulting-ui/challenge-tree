export default function Wordmark({ size = 30, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <span>
      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, fontSize: size, color: dark ? '#fff' : 'var(--green-deep)' }}>
        Challenge Tre
      </span>
      <span style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 600, fontSize: Math.round(size * 1.1), color: '#c8952a', verticalAlign: '-0.04em' }}>
        3
      </span>
    </span>
  )
}
