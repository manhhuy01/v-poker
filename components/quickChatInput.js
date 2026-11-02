import { useRef } from 'react'
import * as socket from '../api/socket'
import { IconSend } from './poker/icons'
import styles from './poker/quickChat.module.css'

export default function QuickChatInput({ user }) {
  const inputRef = useRef(null);

  const onSendMessage = (message) => {
    if (message.trim()) {
      socket.sendMessage({ message: message.trim(), userName: user.userName });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = inputRef.current.value.trim();
    if (msg) {
      onSendMessage(msg);
      inputRef.current.value = '';
    }
  };

  return (
    <div className={styles.wrap}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Nhắn nhanh..."
            aria-label="Nhắn nhanh"
            className={styles.input}
          />
          <button type="submit" className={styles.send} aria-label="Gửi tin nhắn">
            <IconSend />
          </button>
        </div>
      </form>
    </div>
  );
}
