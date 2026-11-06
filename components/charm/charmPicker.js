import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import * as socket from '../../api/socket'
import CharmIcon from './charmIcon'
import { CHARMS, rollDice } from '../../utils/charms'
import styles from './charm.module.css'

// Lives inside the action bar. The menu is portalled to <body> and placed above
// the trigger: the bars use backdrop-filter / overflow, which would otherwise
// trap or clip a fixed-position child.
export default function CharmPicker({ onPick: onPickProp = socket.sendCharm, className = '' }) {
  const [menuStyle, setMenuStyle] = useState(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const open = !!menuStyle

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (triggerRef.current?.contains(e.target) || menuRef.current?.contains(e.target)) return
      setMenuStyle(null)
    }
    const close = () => setMenuStyle(null)
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [open])

  const toggle = () => {
    if (open) return setMenuStyle(null)
    const rect = triggerRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const bottom = window.innerHeight - rect.top + 8
    // Open towards the side of the screen with more room.
    setMenuStyle(rect.left + rect.width / 2 > vw / 2
      ? { bottom, right: Math.max(8, vw - rect.right) }
      : { bottom, left: Math.max(8, rect.left) })
  }

  const onPick = (type) => {
    onPickProp(type === 'dice' ? { type, value: rollDice() } : { type })
    setMenuStyle(null)
  }

  return (
    <div className={`${styles.picker} ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        data-open={open ? 'true' : 'false'}
        onClick={toggle}
        aria-label="Cầu may"
        aria-expanded={open}
        title="Cầu may"
      >
        🙏
      </button>
      {open && createPortal(
        <div className={styles.menu} style={menuStyle} role="menu" ref={menuRef}>
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
        </div>,
        document.body,
      )}
    </div>
  )
}
