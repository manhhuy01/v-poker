import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import TableStage from './tableStage'
import Pot from '../materials/pot'
import { normalizeData } from '../../utils/normalizeGame'
import { IconBack, IconChevronLeft, IconChevronRight, IconPause, IconPlay } from './icons'
import styles from './replay.module.css'

export default function ReplayView({ gameLog, loading, id, returnTo = '/report' }) {
  const normalized = useMemo(() => normalizeData(gameLog), [gameLog])
  const steps = normalized.steps || []
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const chipRef = useRef(null)

  const lastStep = Math.max(steps.length - 1, 0)
  const safeStep = Math.min(step, lastStep)

  useEffect(() => {
    setStep(0)
    setPlaying(false)
  }, [gameLog])

  useEffect(() => {
    if (!playing) return undefined
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev >= steps.length - 1) {
          setPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 900)
    return () => clearInterval(timer)
  }, [playing, steps.length])

  useEffect(() => {
    if (chipRef.current) {
      chipRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [safeStep])

  const currentStep = steps[safeStep]
  const positions = currentStep?.positions || {}
  const table = currentStep?.table || {}
  const pot = currentStep?.pot || []
  const cards = [
    ...(table.flop || []),
    table.turn,
    table.river,
  ].filter(Boolean)

  const canPrev = safeStep > 0
  const canNext = safeStep < lastStep

  const goPrev = () => {
    setPlaying(false)
    setStep((value) => Math.max(value - 1, 0))
  }

  const goNext = () => {
    setPlaying(false)
    setStep((value) => Math.min(value + 1, lastStep))
  }

  const togglePlay = () => {
    if (!playing && safeStep >= lastStep) {
      setStep(0)
      setPlaying(true)
      return
    }
    setPlaying((value) => !value)
  }

  const jumpTo = (index) => {
    setPlaying(false)
    setStep(index)
  }

  const dateLabel = gameLog?.created_at
    ? new Date(gameLog.created_at).toLocaleString('vi-VN')
    : ''

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href={returnTo} className={styles.back}>
          <IconBack />
          <span>Quay lại</span>
        </Link>
        <div className={styles.titles}>
          <h1 className={styles.title}>Ván #{id}</h1>
          <span className={styles.sub}>{dateLabel}</span>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Replay
        </div>
      </header>

      <main className={styles.main}>
        {loading && (
          <div className={styles.state}>
            <span className={styles.spinner} />
            <p className={styles.stateTitle}>Đang tải ván chơi...</p>
            <p className={styles.stateText}>Dữ liệu lịch sử sẽ hiện ra ngay khi tải xong.</p>
          </div>
        )}

        {!loading && !gameLog && (
          <div className={styles.state}>
            <p className={styles.stateTitle}>Không tìm thấy dữ liệu ván</p>
            <p className={styles.stateText}>Ván chơi có thể chưa được mở xem hoặc không còn tồn tại.</p>
          </div>
        )}

        {!loading && gameLog && (
          <TableStage
            positions={positions}
            start
            isHiddenCard={false}
            showEmptySeats={false}
            center={(
              <>
                {steps.length === 0 && (
                  <div className={styles.emptyCenter}>
                    Chưa có hành động nào
                  </div>
                )}
                <Pot
                  pot={pot}
                  cards={cards}
                  start
                  finish={currentStep?.isFinal}
                  hideTipDealer
                />
              </>
            )}
          />
        )}
      </main>

      {!loading && gameLog && steps.length > 0 && (
        <footer className={styles.timeline}>
          <div className={styles.timelineInner}>
            <div className={styles.controls}>
              <button
                type="button"
                className={styles.ctrlBtn}
                onClick={goPrev}
                disabled={!canPrev}
                aria-label="Bước trước"
              >
                <IconChevronLeft />
              </button>

              <button
                type="button"
                className={`${styles.ctrlBtn} ${styles.playBtn}`}
                onClick={togglePlay}
                aria-label={playing ? 'Tạm dừng' : 'Phát lại'}
              >
                {playing ? <IconPause /> : <IconPlay />}
              </button>

              <button
                type="button"
                className={styles.ctrlBtn}
                onClick={goNext}
                disabled={!canNext}
                aria-label="Bước tiếp theo"
              >
                <IconChevronRight />
              </button>

              <div className={styles.stepInfo}>
                <span className={styles.stepLabel}>{currentStep?.label || 'Bắt đầu'}</span>
                <span className={styles.stepCount}>
                  BƯỚC {safeStep + 1}/{steps.length}
                </span>
              </div>
            </div>

            <input
              type="range"
              className={styles.range}
              min={0}
              max={lastStep}
              step={1}
              value={safeStep}
              onChange={(event) => jumpTo(Number(event.target.value))}
              aria-label="Tua lại ván chơi"
            />

            <div className={styles.chips}>
              {steps.map((item, index) => (
                <button
                  key={`${item.label}-${index}`}
                  ref={index === safeStep ? chipRef : null}
                  type="button"
                  className={`${styles.chip} ${index === safeStep ? styles.chipActive : ''}`}
                  onClick={() => jumpTo(index)}
                  title={item.label}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
