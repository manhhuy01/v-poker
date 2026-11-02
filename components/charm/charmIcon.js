import styles from './charm.module.css'

// Bát nhang with three sticks; smoke wisps rise from the glowing tips.
function Incense() {
  return (
    <svg viewBox="0 0 40 64" className={styles.svg} aria-hidden="true">
      <g className={styles.smoke}>
        <path className={styles.wisp} d="M14 22 C10 16 18 12 14 6 C11 2 15 -2 13 -6" />
        <path className={styles.wisp} d="M20 18 C16 12 24 8 20 2 C17 -2 21 -6 19 -10" />
        <path className={styles.wisp} d="M26 22 C22 16 30 12 26 6 C23 2 27 -2 25 -6" />
      </g>
      <g stroke="#7c2d12" strokeWidth="1.6" strokeLinecap="round">
        <line x1="14" y1="23" x2="17" y2="48" />
        <line x1="20" y1="19" x2="20" y2="48" />
        <line x1="26" y1="23" x2="23" y2="48" />
      </g>
      <g className={styles.ember}>
        <circle cx="14" cy="23" r="1.6" />
        <circle cx="20" cy="19" r="1.6" />
        <circle cx="26" cy="23" r="1.6" />
      </g>
      <path d="M6 46 H34 L31 58 C30 61 28 62 25 62 H15 C12 62 10 61 9 58 Z" fill="url(#charm-bowl)" />
      <rect x="5" y="44" width="30" height="4" rx="2" fill="#fbbf24" />
      <text x="20" y="57.5" textAnchor="middle" fontSize="7" fontWeight="900" fill="#7c2d12">福</text>
      <defs>
        <linearGradient id="charm-bowl" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Four-leaf clover swaying on its stem.
function Clover() {
  const leaf = 'M20 24 C14 18 11 12 15 9 C18 7 20 10 20 12 C20 10 22 7 25 9 C29 12 26 18 20 24 Z'
  return (
    <svg viewBox="0 0 40 64" className={styles.svg} aria-hidden="true">
      <g className={styles.sway}>
        <path d="M20 26 C21 36 18 46 22 60" stroke="#15803d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <g transform="translate(0 2)">
          {[0, 90, 180, 270].map((deg) => (
            <path
              key={deg}
              d={leaf}
              transform={`rotate(${deg} 20 24)`}
              fill={deg % 180 ? '#22c55e' : '#16a34a'}
              stroke="#14532d"
              strokeWidth="0.8"
            />
          ))}
          <circle cx="20" cy="24" r="1.8" fill="#bbf7d0" />
        </g>
        <path className={styles.sparkle} d="M33 10 L34 13 L37 14 L34 15 L33 18 L32 15 L29 14 L32 13 Z" fill="#fde68a" />
      </g>
    </svg>
  )
}

// Millennium Puzzle style golden pyramid with the Eye of Wdjat that blinks.
function MillenniumEye() {
  return (
    <svg viewBox="0 0 40 64" className={styles.svg} aria-hidden="true">
      <g className={styles.aura}>
        <path d="M3 14 H37 L20 50 Z" fill="url(#charm-gold)" stroke="#78350f" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M9 18 H31 L20 41 Z" fill="none" stroke="#92400e" strokeWidth="0.6" opacity="0.6" />
      </g>
      <g className={styles.eye}>
        <path d="M10 25 Q20 16 30 25 Q20 32 10 25 Z" fill="#fffbeb" stroke="#451a03" strokeWidth="1.4" />
        <circle cx="20" cy="25" r="3.6" fill="#451a03" />
        <circle cx="21.2" cy="23.8" r="1" fill="#fef3c7" />
      </g>
      <path d="M17 29.5 L16 35 Q15 37 13 36" fill="none" stroke="#451a03" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M22 29.5 Q25 33 28 31" fill="none" stroke="#451a03" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M9 21 Q20 13 31 21" fill="none" stroke="#451a03" strokeWidth="1.6" strokeLinecap="round" />
      <defs>
        <linearGradient id="charm-gold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="0.5" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const ICONS = {
  incense: Incense,
  clover: Clover,
  'millennium-eye': MillenniumEye,
}

export default function CharmIcon({ type }) {
  const Icon = ICONS[type]
  return Icon ? <Icon /> : null
}
