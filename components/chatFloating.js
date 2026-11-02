import { useState, useRef, useEffect } from 'react'
import styles from './poker/chatFloating.module.css'

export default function ChatFloating({ user, onChatOpen, messages = [], count }) {
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef(null);
  useEffect(() => {
    setIsVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  }, [count]);

  return (
    <div className={styles.wrap}>
      <div className={`${styles.row} ${isVisible ? '' : styles.hidden}`}>
        {messages.length > 0 && messages.slice(-1).map((msg, i) => (
          <button
            key={i}
            type="button"
            onClick={onChatOpen}
            className={styles.toast}
          >
            <span className={styles.avatar}>{(msg.userName || '?').slice(0, 1)}</span>
            <span className={styles.body}>
              <span className={styles.user}>{msg.userName}:</span>
              <span className={styles.text}>{msg.message}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
