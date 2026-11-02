/* Decorative layer for the V3 "sweet" table: hearts, sparkles, clouds and a
   little bunny peeking over the rail. Purely visual, never interactive. */
export default function CuteDecor() {
  return (
    <div className="pk-decor" aria-hidden="true">
      <span className="pk-decor-item pk-decor-cloud">
        <svg viewBox="0 0 72 40" fill="none">
          <path
            d="M14 34h42a9 9 0 0 0 1.4-17.9A13.5 13.5 0 0 0 31.6 13 9.6 9.6 0 0 0 14 34Z"
            fill="#ffffff"
            stroke="#ffd3e6"
            strokeWidth="2"
          />
          <circle cx="24" cy="27" r="1.6" fill="#ffb3d1" />
          <circle cx="40" cy="27" r="1.6" fill="#ffb3d1" />
          <path d="M30 31c2.6 2 5.6 2 8 0" stroke="#ff9ec4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>

      <span className="pk-decor-item pk-decor-rainbow">
        <svg viewBox="0 0 64 44" fill="none">
          <path d="M6 38a26 26 0 0 1 52 0" stroke="#ffb3d1" strokeWidth="6" strokeLinecap="round" />
          <path d="M13 38a19 19 0 0 1 38 0" stroke="#ffe08a" strokeWidth="5" strokeLinecap="round" />
          <path d="M20 38a12 12 0 0 1 24 0" stroke="#a7ebcd" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="7" cy="37" r="4.5" fill="#fff" stroke="#ffd3e6" strokeWidth="2" />
          <circle cx="57" cy="37" r="4.5" fill="#fff" stroke="#ffd3e6" strokeWidth="2" />
        </svg>
      </span>

      <span className="pk-decor-item pk-decor-heart pk-decor-heart-a">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21s-7.4-4.5-9.3-8.9A5.3 5.3 0 0 1 12 6.5a5.3 5.3 0 0 1 9.3 5.6C19.4 16.5 12 21 12 21Z" />
        </svg>
      </span>
      <span className="pk-decor-item pk-decor-heart pk-decor-heart-b">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21s-7.4-4.5-9.3-8.9A5.3 5.3 0 0 1 12 6.5a5.3 5.3 0 0 1 9.3 5.6C19.4 16.5 12 21 12 21Z" />
        </svg>
      </span>
      <span className="pk-decor-item pk-decor-heart pk-decor-heart-c">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21s-7.4-4.5-9.3-8.9A5.3 5.3 0 0 1 12 6.5a5.3 5.3 0 0 1 9.3 5.6C19.4 16.5 12 21 12 21Z" />
        </svg>
      </span>

      <span className="pk-decor-item pk-decor-star pk-decor-star-a">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.6l2.2 7.2L21.4 12l-7.2 2.2L12 21.4l-2.2-7.2L2.6 12l7.2-2.2L12 2.6Z" />
        </svg>
      </span>
      <span className="pk-decor-item pk-decor-star pk-decor-star-b">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.6l2.2 7.2L21.4 12l-7.2 2.2L12 21.4l-2.2-7.2L2.6 12l7.2-2.2L12 2.6Z" />
        </svg>
      </span>
      <span className="pk-decor-item pk-decor-star pk-decor-star-c">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.6l2.2 7.2L21.4 12l-7.2 2.2L12 21.4l-2.2-7.2L2.6 12l7.2-2.2L12 2.6Z" />
        </svg>
      </span>

      <span className="pk-decor-item pk-decor-bunny">
        <svg viewBox="0 0 96 96" fill="none">
          <g strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="33" cy="26" rx="8.5" ry="19" transform="rotate(-12 33 26)" fill="#fff" stroke="#ffc2da" strokeWidth="3" />
            <ellipse cx="33" cy="27" rx="4" ry="12" transform="rotate(-12 33 27)" fill="#ffd6e8" />
            <ellipse cx="63" cy="26" rx="8.5" ry="19" transform="rotate(12 63 26)" fill="#fff" stroke="#ffc2da" strokeWidth="3" />
            <ellipse cx="63" cy="27" rx="4" ry="12" transform="rotate(12 63 27)" fill="#ffd6e8" />
            <ellipse cx="48" cy="60" rx="25" ry="22" fill="#fff" stroke="#ffc2da" strokeWidth="3" />
            <path d="M39 56c1.6 2 4 2 5.6 0" stroke="#9a6b83" strokeWidth="2.8" />
            <path d="M51.4 56c1.6 2 4 2 5.6 0" stroke="#9a6b83" strokeWidth="2.8" />
            <ellipse cx="33" cy="65" rx="4.6" ry="2.8" fill="#ffb3d1" opacity=".85" />
            <ellipse cx="63" cy="65" rx="4.6" ry="2.8" fill="#ffb3d1" opacity=".85" />
            <path d="M48 63.5c-1.5 0-2.6 1-2.6 2.1 0 1.1 1.1 2 2.6 2s2.6-.9 2.6-2c0-1.1-1.1-2.1-2.6-2.1Z" fill="#ff8fbe" />
            <path d="M44.4 70c1 1.3 2.2 1.9 3.6 1.9s2.6-.6 3.6-1.9" stroke="#ff8fbe" strokeWidth="2.2" />
            <path d="M70 40c2.6-4.4 8.6-3.6 9.6.4 1-4 7-4.8 9.6-.4-2.6 4.4-9.6 8.6-9.6 8.6S72.6 44.4 70 40Z" fill="#ff9ecb" stroke="#ffd6e8" strokeWidth="2" />
            <circle cx="79.6" cy="42" r="2.2" fill="#fff" />
          </g>
        </svg>
      </span>
    </div>
  )
}
