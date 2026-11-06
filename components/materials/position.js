import Card from './card'
import CharmBadge from '../charm/charmBadge'
import { IconPlus } from '../poker/icons'
import { positionName } from '../../utils/positions'
import styles from '../poker/seat.module.css'

const MAP_RS = {
  'highHand': 'Bluff',
  'onePair': '1 đôi',
  'twoPair': '2 đôi',
  'totk': 'Sám cô',
  'fullHouse': 'Cù lũ',
  'quad': 'Tứ Quý',
  'straight': 'Sảnh',
  'flush': 'Thùng',
  'straightFlush': 'Thùng phá sảnh'
}

const formatMoney = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toLocaleString('en-US')
  }
  return value
}

const hueFromName = (name = '?') => {
  let total = 0
  for (let i = 0; i < name.length; i++) total += name.charCodeAt(i)
  return total % 360
}

export default function Position({
  pos = 0,
  namePos = '',
  userName = '',
  cards,
  balance = 0,
  bet,
  isThinking = false,
  onEditClick,
  onAddClick,
  rawPosition,
  action,
  isFold,
  isPlaying,
  winBalance,
  start,
  isUserPlaying,
  isHiddenCard = true,
  showdown = false,
  result,
  charm,
  showBet = true,
  showWin = true,
  heroAction = null,
}) {
  if (!userName) {
    return (
      <div className={styles.seat} data-empty="true">
        <button
          type="button"
          className={styles.empty}
          onClick={() => onAddClick(rawPosition || pos)}
          aria-label="Thêm người chơi vào vị trí trống"
        >
          <span className={styles.emptyCircle}>
            <IconPlus className={styles.emptyIcon} />
          </span>
          <span className={styles.emptyLabel}>Trống</span>
        </button>
      </div>
    )
  }

  const visibleAction = action && action !== 'fold' ? action : ''
  const isAllIn = isPlaying && !balance && start
  const resultLabel = !!result && !isFold && !isHiddenCard ? MAP_RS[result] : ''
  // The hand is only known to the owner while the hand is running; only at the
  // end of the hand should it replace the betting action.
  const isShowdown = !!showdown && !!resultLabel
  const hasStatus = isShowdown || visibleAction || (showBet && bet) || (showWin && winBalance) || resultLabel || isThinking
  const hue = hueFromName(userName)

  return (
    <div
      className={styles.seat}
      data-chip-anchor="seat"
      data-hero={isUserPlaying ? 'true' : 'false'}
      data-thinking={isThinking ? 'true' : 'false'}
      data-fold={isFold ? 'true' : 'false'}
    >
      <div className={styles.podWrap}>
        {!!cards?.length && (
          <div className={styles.cards} data-chip-anchor="cards">
            {cards.map((c, i) => (
              <Card key={i} data={c} isFold={isFold} isHidden={isHiddenCard && isUserPlaying} />
            ))}
          </div>
        )}

        <div className={styles.pod} data-chip-anchor="pod">
          <div className={styles.avatarWrap} data-chip-anchor="avatar">
            <div className={styles.avatar} style={{ '--hue': hue }}>
              {userName.slice(0, 1)}
            </div>
          </div>

          <div className={styles.info}>
            <div className={styles.nameRow}>
              <button
                type="button"
                className={styles.name}
                onClick={() => onEditClick(userName)}
                title={userName}
              >
                {userName}
              </button>
              {isUserPlaying && <span className={styles.youTag}>BẠN</span>}
            </div>

            <div className={styles.stackRow}>
              <span className={isAllIn ? `${styles.stack} ${styles.stackAllIn}` : styles.stack}>
                {isAllIn ? 'ALL IN' : `$${formatMoney(balance)}`}
              </span>
              {!!namePos && (
                <span
                  className={styles.pos}
                  data-pos={namePos}
                  title={positionName(namePos) || undefined}
                >
                  {namePos}
                </span>
              )}
            </div>
          </div>
        </div>

        {!!heroAction && <div className={styles.heroAction}>{heroAction}</div>}

        {!!charm && <CharmBadge key={charm.id} type={charm.type} value={charm.value} className={styles.charm} />}
      </div>

      {!!hasStatus && (
        <div className={styles.status}>
          {!isShowdown && !!visibleAction && (
            <span className={styles.action} data-action={visibleAction}>
              {visibleAction}
            </span>
          )}
          {!isShowdown && showBet && !!bet && (
            <span className={styles.bet}>
              <span className={styles.chip} />
              {formatMoney(bet)}
            </span>
          )}
          {!isShowdown && showWin && !!winBalance && <span className={styles.win}>+{formatMoney(winBalance)}</span>}
          {!!resultLabel && (isShowdown ? (
            <span className={winBalance ? styles.showdownWin : styles.hand}>
              {showWin && !!winBalance && (
                <span className={styles.showdownAmount}>+{formatMoney(winBalance)}</span>
              )}
              <span>{resultLabel}</span>
            </span>
          ) : (
            <span className={styles.hand}>{resultLabel}</span>
          ))}
          {!!isThinking && (
            <span className={styles.thinking} aria-label="Đang suy nghĩ">
              <i />
              <i />
              <i />
            </span>
          )}
        </div>
      )}
    </div>
  )
}
