import Spin from '../spin'
import {
  IconBet,
  IconBroom,
  IconCall,
  IconCards,
  IconCheck,
  IconFold,
  IconPlay,
  IconShow,
  IconShuffle,
} from './icons'
import { CuteBet, CuteCall, CuteCheck, CuteFold, CuteShow } from './cuteIcons'
import styles from './actionDock.module.css'

const Leading = ({ loading, children }) => (
  loading
    ? (
      <span className={styles.btnSpinner}>
        <Spin loading />
      </span>
    )
    : children
)

const DealerButton = ({ loading, onClick, icon, label }) => (
  <button
    type="button"
    className={`${styles.btn} ${styles.btnDealer}`}
    onClick={onClick}
    disabled={loading}
    title={label}
    aria-label={label}
  >
    <Leading loading={loading}>{icon}</Leading>
    <span className={styles.btnLabel}>{label}</span>
  </button>
)

export default function ActionDock({
  dealerActions = {},
  showActions = false,
  canFold = false,
  canCheck = false,
  canCall = false,
  canBet = false,
  canShow = false,
  showAuto = false,
  autoAction = null,
  onToggleAutoFold,
  onToggleAutoCall,
  onPreFlop,
  onStart,
  onShowAllCards,
  onReset,
  onShuffle,
  onFold,
  onCheck,
  onCall,
  onBet,
  onShow,
  loadingDealer = false,
  loadingPlayer = false,
  hint = '',
  quickChat = null,
  charm = null,
  cute = false,
}) {
  const actionIcons = cute
    ? { fold: <CuteFold />, check: <CuteCheck />, call: <CuteCall />, bet: <CuteBet />, show: <CuteShow /> }
    : { fold: <IconFold />, check: <IconCheck />, call: <IconCall />, bet: <IconBet />, show: <IconShow /> }
  const hasDealerActions = dealerActions.preFlop || dealerActions.start || dealerActions.showAll
    || dealerActions.reset || dealerActions.shuffle

  return (
    <div className={styles.dock}>
      <div className={styles.inner}>
        {(!!quickChat || !!charm) && (
          <div className={styles.topBar}>
            <div className={styles.chatSlot}>{quickChat}</div>
            {charm}
          </div>
        )}

        <div className={styles.controls}>
          {hasDealerActions && (
            <div className={`${styles.group} ${styles.groupDealer}`}>
              {dealerActions.preFlop && (
                <DealerButton loading={loadingDealer} onClick={onPreFlop} icon={<IconCards />} label="Chia bài" />
              )}
              {dealerActions.start && (
                <DealerButton loading={loadingDealer} onClick={onStart} icon={<IconPlay />} label="Vào ván" />
              )}
              {dealerActions.showAll && (
                <DealerButton loading={loadingDealer} onClick={onShowAllCards} icon={<IconShow />} label="Chia hết" />
              )}
              {dealerActions.reset && (
                <DealerButton loading={loadingDealer} onClick={onReset} icon={<IconBroom />} label="Thu dọn" />
              )}
              {dealerActions.shuffle && (
                <DealerButton loading={loadingDealer} onClick={onShuffle} icon={<IconShuffle />} label="Xào bài" />
              )}
            </div>
          )}

          {showActions && (
            <div className={`${styles.group} ${styles.groupActions}`}>
              {canFold && (
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnFold}`}
                  onClick={onFold}
                  disabled={loadingPlayer}
                >
                  <Leading loading={loadingPlayer}>{actionIcons.fold}</Leading>
                  <span className={styles.btnLabel}>Fold</span>
                </button>
              )}
              {canCheck && (
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnCheck}`}
                  onClick={onCheck}
                  disabled={loadingPlayer}
                >
                  <Leading loading={loadingPlayer}>{actionIcons.check}</Leading>
                  <span className={styles.btnLabel}>Check</span>
                </button>
              )}
              {canCall && (
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnCall}`}
                  onClick={onCall}
                  disabled={loadingPlayer}
                >
                  <Leading loading={loadingPlayer}>{actionIcons.call}</Leading>
                  <span className={styles.btnLabel}>Call</span>
                </button>
              )}
              {canBet && (
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnBet}`}
                  onClick={onBet}
                >
                  {actionIcons.bet}
                  <span className={styles.btnLabel}>Bet</span>
                </button>
              )}
              {canShow && (
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnShow}`}
                  onClick={onShow}
                  disabled={loadingPlayer}
                >
                  <Leading loading={loadingPlayer}>{actionIcons.show}</Leading>
                  <span className={styles.btnLabel}>Show</span>
                </button>
              )}
            </div>
          )}

          {showAuto && (
            <div className={`${styles.group} ${styles.groupAuto}`}>
              <button
                type="button"
                className={styles.autoBtn}
                data-tone="fold"
                data-active={autoAction === 'FOLD'}
                onClick={onToggleAutoFold}
                aria-pressed={autoAction === 'FOLD'}
              >
                <span className={styles.autoDot} />
                Tự động fold
              </button>
              <button
                type="button"
                className={styles.autoBtn}
                data-tone="call"
                data-active={autoAction === 'CALL_CHECK'}
                onClick={onToggleAutoCall}
                aria-pressed={autoAction === 'CALL_CHECK'}
              >
                <span className={styles.autoDot} />
                Tự động call/check
              </button>
            </div>
          )}

          {!!charm && (
            <div className={`${styles.group} ${styles.groupCharm}`}>{charm}</div>
          )}
        </div>

        {!!hint && (
          <div className={styles.hint}>
            <span className={styles.hintDot} />
            <span>{hint}</span>
          </div>
        )}
      </div>
    </div>
  )
}
