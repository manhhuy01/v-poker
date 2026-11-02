// Small inline icon set used by the table UI only.
// All icons inherit currentColor so they can be themed per button.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  'aria-hidden': 'true',
}

export function IconFold({ className = '' }) {
  return (
    <svg {...base} className={className}>
      <path d="M5 19h14" />
      <path d="M12 4v10" />
      <path d="M8 10l4 4 4-4" />
    </svg>
  )
}

export function IconCheck({ className = '' }) {
  return (
    <svg {...base} className={className}>
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  )
}

export function IconCall({ className = '' }) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7h12" />
      <path d="M13 4l3 3-3 3" />
      <path d="M4 12h16" />
      <path d="M4 17h9" />
    </svg>
  )
}

export function IconBet({ className = '' }) {
  return (
    <svg {...base} className={className}>
      <ellipse cx="12" cy="6" rx="6" ry="2.6" />
      <path d="M6 6v4c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6V6" />
      <path d="M6 10v4c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-4" />
      <path d="M6 14v4c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-4" />
    </svg>
  )
}

export function IconShow({ className = '' }) {
  return (
    <svg {...base} className={className}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  )
}

export function IconCards({ className = '' }) {
  return (
    <svg {...base} className={className}>
      <rect x="8" y="3.5" width="11" height="15" rx="2" transform="rotate(9 13.5 11)" />
      <path d="M6 6.5L5 7.5a2 2 0 00-.6 1.5v9.5a2 2 0 002 2h8.6a2 2 0 001.5-.6" />
    </svg>
  )
}

export function IconShuffle({ className = '' }) {
  return (
    <svg {...base} className={className}>
      <path d="M3 6h3.2c1.2 0 2.3.6 3 1.6l5.6 8.8c.7 1 1.8 1.6 3 1.6H21" />
      <path d="M18 4l3 2-3 2" />
      <path d="M3 18h3.2c1.2 0 2.3-.6 3-1.6l1-1.6" />
      <path d="M14.6 9.2l.6-1c.7-1 1.8-1.6 3-1.6H21" />
      <path d="M18 14l3 2-3 2" />
    </svg>
  )
}

export function IconBroom({ className = '' }) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7h16" />
      <path d="M9 7V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V7" />
      <path d="M6 7l1 12.2A1.8 1.8 0 008.8 21h6.4a1.8 1.8 0 001.8-1.8L18 7" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  )
}

export function IconPlay({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5.2c0-.9 1-1.4 1.7-.9l9 6.1c.7.4.7 1.4 0 1.8l-9 6.1c-.7.5-1.7 0-1.7-.9V5.2z" />
    </svg>
  )
}

export function IconPause({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <rect x="6" y="4.5" width="4" height="15" rx="1.4" />
      <rect x="14" y="4.5" width="4" height="15" rx="1.4" />
    </svg>
  )
}

export function IconExpand({ className = '' }) {
  return (
    <svg {...base} className={className}>
      <path d="M4 9V5.5A1.5 1.5 0 015.5 4H9" />
      <path d="M15 4h3.5A1.5 1.5 0 0120 5.5V9" />
      <path d="M20 15v3.5a1.5 1.5 0 01-1.5 1.5H15" />
      <path d="M9 20H5.5A1.5 1.5 0 014 18.5V15" />
    </svg>
  )
}

export function IconCollapse({ className = '' }) {
  return (
    <svg {...base} className={className}>
      <path d="M9 4v3.5A1.5 1.5 0 017.5 9H4" />
      <path d="M15 4v3.5A1.5 1.5 0 0016.5 9H20" />
      <path d="M20 15h-3.5a1.5 1.5 0 00-1.5 1.5V20" />
      <path d="M4 15h3.5A1.5 1.5 0 019 16.5V20" />
    </svg>
  )
}

export function IconEye({ className = '' }) {
  return (
    <svg {...base} className={className}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  )
}

export function IconEyeOff({ className = '' }) {
  return (
    <svg {...base} className={className}>
      <path d="M4 4l16 16" />
      <path d="M9.6 5.9A10.9 10.9 0 0112 5.5c6 0 9.5 6.5 9.5 6.5a17.7 17.7 0 01-2.9 3.7" />
      <path d="M6.1 8.2A17.3 17.3 0 002.5 12S6 18.5 12 18.5c1.3 0 2.5-.3 3.6-.8" />
      <path d="M9.8 9.8a3 3 0 004.4 4.4" />
    </svg>
  )
}

export function IconChevronLeft({ className = '' }) {
  return (
    <svg {...base} className={className}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  )
}

export function IconChevronRight({ className = '' }) {
  return (
    <svg {...base} className={className}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}

export function IconBack({ className = '' }) {
  return (
    <svg {...base} className={className}>
      <path d="M10 19l-7-7 7-7" />
      <path d="M3 12h18" />
    </svg>
  )
}

export function IconSend({ className = '' }) {
  return (
    <svg {...base} className={className}>
      <path d="M21 3L10.5 13.5" />
      <path d="M21 3l-6.8 18-3.7-7.5L3 9.8 21 3z" />
    </svg>
  )
}

export function IconTip({ className = '' }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3v18" />
      <path d="M17 7.5c0-1.9-2.2-3.5-5-3.5s-5 1.6-5 3.5S9.2 11 12 11s5 1.6 5 3.5S14.8 18 12 18s-5-1.6-5-3.5" />
    </svg>
  )
}

export function IconPlus({ className = '' }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}
