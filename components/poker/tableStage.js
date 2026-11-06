import { useRef } from 'react'

import Position from '../materials/position'
import ChipLayer from './chipLayer'
import styles from './table.module.css'

// Seat index → visual slot. The CSS grid decides where each slot sits;
// the order around the table stays 1 (hero, bottom) → 9 clockwise.
const POSITIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export default function TableStage({
  positions,
  center,
  start,
  userName,
  isHiddenCard = false,
  showdown = false,
  onEditClick = () => {},
  onAddClick = () => {},
  showEmptySeats = true,
  charms = {},
  className = '',
  animateChips = false,
}) {
  const stageRef = useRef(null)
  const hasSeat = (pos) => {
    const data = positions?.[pos]
    if (!data) return false
    if (!showEmptySeats && !data?.user?.userName) return false
    return true
  }

  const renderSeat = (pos) => {
    const seat = positions[pos]
    const userNameOnSeat = seat?.user?.userName

    return (
      <div className={styles.slot} data-pos={pos} data-chip-seat={pos} key={pos}>
        <Position
          pos={pos}
          namePos={seat?.namePos}
          isThinking={seat?.isThinking}
          userName={userNameOnSeat}
          balance={seat?.user?.accBalance ?? seat?.chips ?? 0}
          rawPosition={seat?.rawPosition}
          bet={seat?.betBalance}
          action={seat?.action}
          cards={seat?.cards}
          isFold={seat?.isFold}
          onEditClick={onEditClick}
          onAddClick={onAddClick}
          isPlaying={seat?.isPlaying}
          winBalance={seat?.winBalance}
          start={start}
          isUserPlaying={!!userName && userNameOnSeat === userName}
          isHiddenCard={isHiddenCard}
          showdown={showdown}
          result={seat?.resultCard?.name}
          charm={userNameOnSeat ? charms[userNameOnSeat] : undefined}
          showBet={!animateChips}
          showWin={!animateChips}
        />
      </div>
    )
  }

  return (
    <div className={`${styles.root} ${className}`}>
      <div className={styles.frame}>
        <div className={styles.stage} ref={stageRef}>
          <div className={styles.felt} aria-hidden="true">
            <div className={styles.feltInner}>
              <div className={styles.feltGlow} />
              <div className={styles.feltLogo}>
                V<span>-</span>POKER
              </div>
            </div>
          </div>

          <div className={styles.center}>{center}</div>

          {animateChips && <ChipLayer stageRef={stageRef} positions={positions} start={start} />}

          {POSITIONS.map((pos) => (hasSeat(pos) ? renderSeat(pos) : null))}
        </div>
      </div>
    </div>
  )
}
