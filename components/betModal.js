import { useState, useEffect, useRef } from 'react'
import Modal from './modal'
import styles from './poker/betModal.module.css'

export default function BetModal({ isOpen, onClose, onConfirm, loading, data, theme }) {
  const [betValue, setBetValue] = useState(0)
  const [sliderIndex, setSliderIndex] = useState(0)
  const betInputRef = useRef(null)

  const bb = (data?.setting?.smallBlind || 0) * 2
  const minBet = Math.max(bb, (data?.table?.currentBet || 0) - (data?.user?.position?.betBalance || 0))
  const maxBalance = data?.user?.accBalance || 0

  const milestones = [
    { label: '1x BB', value: bb * 1 },
    { label: '2x BB', value: bb * 2 },
    { label: '4x BB', value: bb * 4 },
    { label: '6x BB', value: bb * 6 },
    { label: '8x BB', value: bb * 8 },
    { label: '10x BB', value: bb * 10 },
    { label: 'ALL-IN', value: maxBalance, isAllIn: true }
  ].filter(m => m.value <= maxBalance && m.value >= minBet)

  // Ensure there's always at least one milestone or a default range
  const finalMilestones = milestones.length > 0 ? milestones : [{ label: 'MIN', value: minBet }, { label: 'ALL-IN', value: maxBalance, isAllIn: true }]

  useEffect(() => {
    if (isOpen) {
      setBetValue(minBet)
      setSliderIndex(0)
    }
  }, [isOpen, minBet])

  const handleSliderChange = (e) => {
    const index = parseInt(e.target.value)
    setSliderIndex(index)
    const val = finalMilestones[index].value
    setBetValue(val)
    if (betInputRef.current) {
      betInputRef.current.value = finalMilestones[index].isAllIn ? 'all-in' : val
    }
  }

  const handleInputChange = (e) => {
    const val = e.target.value
    if (val === 'all-in') {
      setBetValue(maxBalance)
    } else {
      setBetValue(parseInt(val) || 0)
    }
  }

  const handleConfirm = () => {
    const finalVal = betInputRef.current?.value || betValue
    onConfirm(finalVal)
  }

  const showAllIn = Number(betValue) > 0 && Number(betValue) >= Number(maxBalance)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      loading={loading}
      onCancel={onClose}
      onConfirm={handleConfirm}
      position="top"
      theme={theme}
    >
      <div className={styles.body}>
        <div className={styles.head}>
          <span className={styles.kicker}>Hành động của bạn</span>
          <h3 className={styles.title}>Chọn mức cược</h3>
          <div className={styles.ranges}>
            <span className={styles.rangePill}>
              Min
              <strong>{minBet.toLocaleString('en-US')}</strong>
            </span>
            <span className={`${styles.rangePill} ${styles.rangePillAccent}`}>
              Max
              <strong>{maxBalance.toLocaleString('en-US')}</strong>
            </span>
          </div>
        </div>

        <div className={styles.amountCard}>
          <span className={styles.amountLabel}>Số chip đặt</span>
          <div className={styles.amountRow}>
            <span className={styles.amountChip} aria-hidden="true" />
            <input
              ref={betInputRef}
              type="text"
              autoComplete="off"
              spellCheck={false}
              defaultValue={minBet}
              onChange={handleInputChange}
              className={styles.amountInput}
              aria-label="Số chip đặt cược"
            />
            {showAllIn && <span className={styles.allInTag}>ALL-IN</span>}
          </div>
        </div>

        <div className={styles.sliderWrap}>
          <input
            type="range"
            min="0"
            max={finalMilestones.length - 1}
            step="1"
            value={sliderIndex}
            onChange={handleSliderChange}
            className={styles.slider}
            aria-label="Chọn nhanh mức cược"
          />
        </div>

        <div className={styles.milestones}>
          {finalMilestones.map((m, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.milestone} ${m.isAllIn ? styles.milestoneAllIn : ''}`}
              data-active={i === sliderIndex}
              onClick={() => handleSliderChange({ target: { value: i } })}
            >
              <span className={styles.milestoneLabel}>{m.label}</span>
              <span className={styles.milestoneValue}>
                {m.isAllIn ? 'Tất tay' : m.value.toLocaleString('en-US')}
              </span>
            </button>
          ))}
        </div>

        <p className={styles.hint}>
          Kéo thanh trượt hoặc chọn một mốc cược, sau đó bấm xác nhận.
        </p>
      </div>
    </Modal>
  )
}
