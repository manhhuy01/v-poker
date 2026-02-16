import { useState, useRef, useEffect } from 'react'
import * as socket from '../api/socket'


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
    </div>
  );
}
