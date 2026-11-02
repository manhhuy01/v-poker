import { useState, useEffect } from 'react'
import styles from '../poker/card.module.css'

const REGEX = /(.*)(s|h|c|d)/

const SUITS = {
  s: { symbol: '♠', tone: 'black' },
  c: { symbol: '♣', tone: 'black' },
  h: { symbol: '♥', tone: 'red' },
  d: { symbol: '♦', tone: 'red' },
}

export default function Card({ data = 'u', isFold, isHidden }) {
  const [hide, setHide] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isHidden) {
        setHide(false)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setHide(isHidden)
  }, [isHidden])

  // Unknown card (not dealt / face down).
  if (data === 'u' || !data) {
    if (isFold) return null
    return (
      <div className={styles.card} aria-hidden="true">
        <div className={styles.inner}>
          <div className={styles.face} />
          <div className={styles.back} />
        </div>
      </div>
    )
  }

  const match = data.match(REGEX)
  if (!match) return null

  const num = match[1]
  const suit = SUITS[match[2]] || SUITS.s
  const toneClass = suit.tone === 'red' ? styles.faceRed : styles.faceBlack
  const faceClass = [styles.face, toneClass].join(' ')

  return (
    <div className={`${styles.card} ${isFold ? styles.folded : ''}`}>
      <div className={`${styles.inner} ${hide ? '' : styles.revealed}`}>
        <div className={faceClass}>
          <span className={num.length > 1 ? `${styles.rank} ${styles.rankSmall}` : styles.rank}>{num}</span>
          <span className={styles.suitCorner}>{suit.symbol}</span>
          <span className={styles.suit}>{suit.symbol}</span>
        </div>
        <div className={styles.back} />
      </div>
    </div>
  )
}
