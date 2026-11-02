import { useEffect, useRef, useState } from 'react'

import * as socket from '../../api/socket'
import CharmIcon from './charmIcon'
import { CHARMS } from '../../utils/charms'
import styles from './charm.module.css'

export default function CharmPicker({ onPick: onPickProp = socket.sendCharm }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onClick)
    return () => document.removeEventListener('pointerdown', onClick)
  }, [open])

  const onPick = (type) => {
    onPickProp({ type })
    setOpen(false)
  }

  return (
    <div className={styles.picker} ref={rootRef}>
      {open && (
        <div className={styles.menu} role="menu">
          {CHARMS.map((c) => (
            <button
              key={c.type}
              type="button"
              role="menuitem"
              className={styles.option}
              onClick={() => onPick(c.type)}
              title={c.label}
            >
              <span className={styles.optionIcon} data-type={c.type}>
                <CharmIcon type={c.type} />
              </span>
              <span className={styles.optionLabel}>{c.label}</span>
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        className={styles.trigger}
        data-open={open ? 'true' : 'false'}
        onClick={() => setOpen(!open)}
        aria-label="Cầu may"
        aria-expanded={open}
        title="Cầu may"
      >
        🙏
      </button>
    </div>
  )
}
