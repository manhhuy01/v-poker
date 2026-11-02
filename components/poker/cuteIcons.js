/* Cute, rounded action icons for the V3 skin. Same 24×24 stroke style as the
   shared icon set, just softer shapes (hearts, sparkles, a chip). */
const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
}

export function CuteFold(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20.2c-4.2-2.6-7.3-5-7.3-8.3A4.2 4.2 0 0 1 12 9a4.2 4.2 0 0 1 7.3 2.9c0 3.3-3.1 5.7-7.3 8.3Z" />
      <path d="M12 9l1.5 2.9-2.5 1.7 1.9 3.2" />
    </svg>
  )
}

export function CuteCall(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9.4 19.6c-3.4-2.2-5.9-4.2-5.9-6.9a3.4 3.4 0 0 1 5.9-2.2 3.4 3.4 0 0 1 5.9 2.2c0 1.4-.7 2.6-1.7 3.8" />
      <path d="M18.6 10.6c1.1 1 1.8 2.1 1.8 3.3" />
      <path d="M20.4 8.2c1.1.9 1.9 1.9 2.1 3.1" />
    </svg>
  )
}

export function CuteCheck(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M8.4 12.3l2.4 2.4 4.8-5" />
      <path d="M18.9 4.6l.5-1.5M21.3 7l1.4-.6" strokeWidth="1.6" />
    </svg>
  )
}

export function CuteBet(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="12" cy="12" r="5.2" strokeDasharray="2.2 2.4" strokeWidth="1.4" />
      <path d="M12 14.6c-1.9-1.1-3.2-2.2-3.2-3.5a1.8 1.8 0 0 1 3.2-1 1.8 1.8 0 0 1 3.2 1c0 1.3-1.3 2.4-3.2 3.5Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function CuteShow(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2.8 12s3.4-5.5 9.2-5.5S21.2 12 21.2 12s-3.4 5.5-9.2 5.5S2.8 12 2.8 12Z" />
      <path d="M12 14.4c-1.4-.8-2.3-1.6-2.3-2.5a1.3 1.3 0 0 1 2.3-.7 1.3 1.3 0 0 1 2.3.7c0 .9-.9 1.7-2.3 2.5Z" fill="currentColor" stroke="none" />
      <path d="M19.4 5.1l.4-1.3M21.6 7.3l1.2-.4" strokeWidth="1.5" />
    </svg>
  )
}
