import { useRef } from 'react'
import * as socket from '../api/socket'

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
    <div className="md:hidden w-full px-4 pb-2 z-20">
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full relative group"
      >
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            placeholder="Chat nhanh..."
            className="w-full bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-2xl"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
