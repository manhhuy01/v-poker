import Card from './card'
import { IconTip } from '../poker/icons'
import styles from '../poker/table.module.css'

// Three little piles, the middle one tallest — same look as the winnings on the felt.
const POT_ICON_PILES = [
  { size: 2, colors: ['red', 'gold'] },
  { size: 3, colors: ['blue', 'gold', 'green'] },
  { size: 2, colors: ['gold', 'red'] },
]

const formatMoney = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toLocaleString('en-US')
  }
  return value
}

export default function Pot({ cards = [], pot, start, onClickTipDealer, finish, hideTipDealer }) {
  const visiblePots = (pot || []).filter((p) => p && p.balance)

  return (
    <div className={styles.centerCol} data-chip-anchor="table">
      {visiblePots.length > 0 && (
        <div className={styles.potStack} data-chip-anchor="pot">
          {visiblePots.map((p, i) => (
            <div className={styles.potPill} key={i}>
              <span className={styles.potIcon} aria-hidden="true">
                {POT_ICON_PILES.map(({ size, colors }, k) => (
                  <span key={k} className={styles.potPile} style={{ '--n': size }}>
                    {colors.map((color, i) => (
                      <span key={i} className={styles.potIconChip} data-color={color} style={{ '--i': i }} />
                    ))}
                  </span>
                ))}
              </span>
              <span className={styles.potLabel}>
                {i === 0 ? 'Pot' : `Side ${i}`}
              </span>
              <span className={styles.potValue}>{formatMoney(p.balance)}</span>
            </div>
          ))}
        </div>
      )}

      {!!start && (
        <div className={styles.board} data-chip-anchor="board">
          <div className={styles.boardGroup}>
            {[0, 1, 2].map((i) => (
              <Card key={i} data={cards[i] || 'u'} />
            ))}
          </div>
          <div className={styles.boardGroup}>
            {[3, 4].map((i) => (
              <Card key={i} data={cards[i] || 'u'} />
            ))}
          </div>
        </div>
      )}

      {!(start && !finish) && !hideTipDealer && (
        <button type="button" className={styles.tipBtn} onClick={onClickTipDealer}>
          <IconTip />
          Tip dealer
        </button>
      )}
    </div>
  )
}
