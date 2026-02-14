import { useState, useEffect, useRef } from 'react'

const ChatElement = ({ userName, message, isYour }) => {
  return (
    <div className={`w-full flex mb-3 ${isYour ? 'justify-end pl-10' : 'justify-start pr-10'}`}>
      <div className={`max-w-full flex flex-col ${isYour ? 'items-end' : 'items-start'}`}>
        {!isYour && !!userName && <div className="text-[10px] font-black tracking-widest text-gray-500 mb-1 ml-1">{userName}</div>}
        <div className={`px-4 py-2 rounded-2xl text-sm font-medium shadow-sm transition-all duration-300 ${isYour 
          ? 'bg-indigo-600 text-white rounded-br-none' 
          : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
          {message}
        </div>
      </div>
    </div>
  )
}

export default function chat({ user, isOpen, onClose, data, onSendMessage }) {
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const objDiv = document.getElementById("chat-body");
        if (objDiv) objDiv.scrollTop = objDiv.scrollHeight;
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  }, [isOpen, data?.messages?.length]);

  const handleSend = (e) => {
    e.preventDefault();
    const message = inputRef.current.value.trim();
    if (message) {
      onSendMessage(message);
      inputRef.current.value = '';
    }
  }

  return (
    <div className={`${isOpen ? 'md:w-96 w-full translate-x-0 z-50' : 'w-0 translate-x-full md:translate-x-0 md:w-0 overflow-hidden'} absolute md:relative right-0 transition-all duration-500 h-full top-0 z-[50] flex flex-col bg-white border-l border-gray-100 shadow-2xl overflow-hidden`}>
      <div className="w-full h-16 bg-gray-900 flex justify-between items-center px-6 text-white shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-black uppercase tracking-tighter italic">Phòng Chat</span>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div id='chat-body' className="flex-1 p-6 overflow-y-auto scroll-smooth custom-scrollbar">
        {
          data?.messages && data.messages.map((chat, i) => (
            <ChatElement
              key={i}
              userName={(chat.owner || chat.hiddenUserName) ? '' : chat.userName}
              isYour={chat.owner}
              message={chat.message}
            />
          ))
        }
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <form className="flex items-center space-x-2" onSubmit={handleSend}>
          <input 
            ref={inputRef} 
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
            placeholder="Nhập tin nhắn..."
            type="text" 
          />
          <button 
            onClick={handleSend} 
            className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all focus:outline-none"
            type="submit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}