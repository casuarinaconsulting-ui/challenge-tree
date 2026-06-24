// The Challenge Tre3 tree mark: a rounded leafy canopy with a gold "3",
// matching the brand logo. Sized by height (px).
export default function TreeMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      height={size}
      width={size * (100 / 110)}
      viewBox="0 0 100 110"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <rect x="45.5" y="64" width="9" height="40" rx="3" fill="#c8952a" />
      <circle cx="50" cy="44" r="30" fill="#2d6a4f" />
      <circle cx="31" cy="50" r="18" fill="#3a8f63" />
      <circle cx="69" cy="50" r="18" fill="#3a8f63" />
      <circle cx="50" cy="27" r="21" fill="#52b788" />
      <circle cx="40" cy="33" r="10" fill="#95d5b2" />
      <text
        x="50" y="44"
        textAnchor="middle" dominantBaseline="central"
        fontFamily="'EB Garamond', Georgia, serif" fontWeight={600} fontSize={38}
        fill="#f0c96e"
      >3</text>
    </svg>
  )
}
