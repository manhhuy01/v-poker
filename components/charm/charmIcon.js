import { useEffect, useState } from 'react'

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

// One banknote, drawn at the origin (30 x 12).
function Bill({ x = 0, y = 0, tilt = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt} 15 6)`}>
      <rect width="30" height="12" rx="1.5" fill="#22c55e" stroke="#14532d" strokeWidth="0.9" />
      <rect x="2" y="2" width="26" height="8" rx="1" fill="none" stroke="#bbf7d0" strokeWidth="0.6" />
      <circle cx="15" cy="6" r="3.6" fill="#15803d" stroke="#bbf7d0" strokeWidth="0.5" />
      <text x="15" y="8.3" textAnchor="middle" fontSize="6" fontWeight="900" fill="#f0fdf4">$</text>
    </g>
  )
}

// "Tiền về": dollar bills keep raining down onto a growing pile.
function Money() {
  return (
    <svg viewBox="0 0 40 64" className={styles.svg} aria-hidden="true">
      <g className={styles.moneyGlow}>
        <ellipse cx="20" cy="60" rx="17" ry="3" fill="rgba(34, 197, 94, 0.35)" />
      </g>
      <Bill x={6} y={49} tilt={-3} />
      <Bill x={4} y={44} tilt={4} />
      <Bill x={6} y={39} tilt={-2} />
      {[{ x: 5, tilt: 8 }, { x: 7, tilt: -6 }, { x: 4, tilt: 3 }].map((b, i) => (
        <g key={i} className={styles.bill} style={{ animationDelay: `${i * 0.55}s` }}>
          <Bill x={b.x} y={30} tilt={b.tilt} />
        </g>
      ))}
      <path className={styles.sparkle} d="M34 20 L35 23 L38 24 L35 25 L34 28 L33 25 L30 24 L33 23 Z" fill="#fde68a" />
      <path className={styles.sparkle} d="M5 14 L5.8 16 L8 16.8 L5.8 17.6 L5 20 L4.2 17.6 L2 16.8 L4.2 16 Z" fill="#bbf7d0" />
    </svg>
  )
}

// "Tức giận": a red, shaking face with steam out of its ears and an anger mark.
function Angry() {
  return (
    <svg viewBox="0 0 40 64" className={styles.svg} aria-hidden="true">
      <g className={styles.steam}>
        <circle cx="5" cy="30" r="3" />
        <circle cx="35" cy="30" r="3" />
      </g>
      <g className={styles.steam} style={{ animationDelay: '0.45s' }}>
        <circle cx="4" cy="27" r="2.4" />
        <circle cx="36" cy="27" r="2.4" />
      </g>
      <g className={styles.rage}>
        <circle cx="20" cy="40" r="15" fill="url(#charm-angry)" stroke="#7f1d1d" strokeWidth="1.2" />
        {/* furrowed brows */}
        <path d="M10 33 L18 36.5" stroke="#450a0a" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M30 33 L22 36.5" stroke="#450a0a" strokeWidth="2.4" strokeLinecap="round" />
        {/* glaring eyes */}
        <path d="M11.5 38 Q14.5 36.6 17.5 39 Q14.5 41.6 11.5 38 Z" fill="#fff7ed" />
        <path d="M28.5 38 Q25.5 36.6 22.5 39 Q25.5 41.6 28.5 38 Z" fill="#fff7ed" />
        <circle cx="15.2" cy="39" r="1.3" fill="#1c0606" />
        <circle cx="24.8" cy="39" r="1.3" fill="#1c0606" />
        {/* gritted teeth */}
        <rect x="12.5" y="44.5" width="15" height="6" rx="2" fill="#fff7ed" stroke="#450a0a" strokeWidth="1.1" />
        <path d="M12.5 47.5 H27.5 M16.25 44.5 V50.5 M20 44.5 V50.5 M23.75 44.5 V50.5" stroke="#450a0a" strokeWidth="0.8" />
      </g>
      {/* 💢 anger mark */}
      <g className={styles.vein} transform="translate(32 20)">
        {[0, 90, 180, 270].map((deg) => (
          <path
            key={deg}
            d="M1.6 -6 Q1.6 -1.6 6 -1.6"
            transform={`rotate(${deg})`}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        ))}
      </g>
      <defs>
        <radialGradient id="charm-angry" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#fca5a5" />
          <stop offset="0.45" stopColor="#ef4444" />
          <stop offset="1" stopColor="#991b1b" />
        </radialGradient>
      </defs>
    </svg>
  )
}

// Pip layout on a 3 x 3 grid (0..2), per face.
const PIPS = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [2, 0], [0, 2], [2, 2]],
  5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]],
  6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
}
const ROLL_MS = 1300

// "Xúc xắc": the sender's client rolled `value`; every seat tumbles the die and
// lands on that same face. Without `roll` it just shows the face (menu icon).
function Dice({ value = 6, roll = false }) {
  const [face, setFace] = useState(() => (roll ? 1 + Math.floor(Math.random() * 6) : value))
  const [settled, setSettled] = useState(!roll)

  useEffect(() => {
    if (!roll) {
      setFace(value)
      setSettled(true)
      return undefined
    }
    setSettled(false)
    // Flicker through random faces while it tumbles, then settle on the roll.
    const started = Date.now()
    const id = setInterval(() => {
      if (Date.now() - started >= ROLL_MS - 120) {
        clearInterval(id)
        setFace(value)
        setSettled(true)
        return
      }
      // Any face but the current one, so it visibly keeps changing.
      setFace((prev) => ((prev + Math.floor(Math.random() * 5)) % 6) + 1)
    }, 90)
    return () => clearInterval(id)
  }, [roll, value])

  return (
    <svg viewBox="0 0 40 64" className={styles.svg} aria-hidden="true">
      <ellipse className={styles.diceShadow} cx="20" cy="58" rx="12" ry="2.6" fill="rgba(0, 0, 0, 0.45)" />
      <g className={roll ? styles.diceRoll : undefined}>
        <rect x="7" y="31" width="26" height="26" rx="6" fill="url(#charm-dice)" stroke="#78716c" strokeWidth="1" />
        <rect x="9" y="33" width="22" height="22" rx="4.5" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="0.8" />
        {(PIPS[face] || PIPS[6]).map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={13 + cx * 7}
            cy={37 + cy * 7}
            r={face === 1 ? 3.4 : 2.3}
            fill={face === 1 ? '#dc2626' : '#1c1917'}
          />
        ))}
      </g>
      {roll && settled && (
        <g className={styles.diceResult}>
          <circle cx="20" cy="17" r="8.5" fill="#fbbf24" stroke="#78350f" strokeWidth="1.2" />
          <text x="20" y="21.2" textAnchor="middle" fontSize="12" fontWeight="900" fill="#451a03">{value}</text>
        </g>
      )}
      <defs>
        <linearGradient id="charm-dice" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e7e5e4" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const ICONS = {
  incense: Incense,
  clover: Clover,
  'millennium-eye': MillenniumEye,
  money: Money,
  angry: Angry,
  dice: Dice,
}

// `value` / `roll` only matter for the dice.
export default function CharmIcon({ type, value, roll = false }) {
  const Icon = ICONS[type]
  return Icon ? <Icon value={value} roll={roll} /> : null
}
