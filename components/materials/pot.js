import Card from './card'
import { IconTip } from '../poker/icons'
import styles from '../poker/table.module.css'

const formatMoney = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toLocaleString('en-US')
  }
  return value
}

export default function Pot({ cards = [], pot, start, onClickTipDealer, finish, hideTipDealer }) {
  const visiblePots = (pot || []).filter((p) => p && p.balance)

  return (
    <div className={styles.centerCol}>
      {visiblePots.length > 0 && (
        <div className={styles.potStack}>
          {visiblePots.map((p, i) => (
            <div className={styles.potPill} key={i}>
              <span className={styles.potChip} aria-hidden="true" />
              <span className={styles.potLabel}>
                {i === 0 ? 'Pot' : `Side ${i}`}
              </span>
              <span className={styles.potValue}>{formatMoney(p.balance)}</span>
            </div>
          ))}
        </div>
      )}

      {!!start && (
        <div className={styles.board}>
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
