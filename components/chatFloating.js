import { useState, useRef, useEffect } from 'react'
import * as socket from '../api/socket'


export default function ChatFloating({ user, onChatOpen, messages = [], count }) {
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  }, [count]);

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
      // Reset timer when sending message
    }
  };

  return (
    <div className='chat-floating flex flex-col items-center gap-2'>
      <div className={`flex flex-col items-center space-y-1.5 pointer-events-auto transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {messages.length > 0 && messages.slice(-1).map((msg, i) => (
          <div
            key={i}
            onClick={onChatOpen}
            className="bg-black/60 backdrop-blur-md px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/10 text-[10px] md:text-[11px] font-bold text-white shadow-lg animate-fade-in-up cursor-pointer hover:bg-black/80 transition-all"
          >
            <span className="text-indigo-400 mr-1.5 tracking-tighter">{msg.userName}:</span>
            <span className="opacity-90">{msg.message}</span>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center pointer-events-auto w-48 md:w-64 relative group"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Chat nhanh..."
          className="w-full bg-gray-800 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-2.5 text-[10px] md:text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all hover:bg-gray-800"
        />
        <button
          type="submit"
          className="absolute right-2 text-indigo-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}
