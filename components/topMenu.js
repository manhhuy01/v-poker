import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Setting from './setting';
import Deposit from './deposit';

export default function TopMenu({ data, user, onLobbyClick, chatCount, onChatOpen }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentUser = data?.user || user;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onLeaveRoom = () => {
    if (window.confirm('Bạn có chắc muốn rời phòng?')) {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = '/login';
    }
  }

  return (
    <nav className="absolute top-0 left-0 w-full z-30 bg-gray-900/40 backdrop-blur-md border-b border-white/5 text-white px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-3 md:space-x-4">
        <div className="text-xl font-black italic tracking-tighter text-white shrink-0">V-POKER</div>
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          <button 
            onClick={onLobbyClick}
            className="px-3 py-2 rounded-lg text-[13px] font-bold bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95 whitespace-nowrap"
          >
            Phòng chờ
          </button>
          
          <button 
            onClick={onChatOpen}
            className="relative px-3 py-2 rounded-lg text-[13px] font-bold bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95 flex items-center space-x-2 whitespace-nowrap"
          >
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="hidden sm:inline-block">Trò chuyện</span>
          </button>

        </div>
      </div>

      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        <button 
          onClick={() => setProfileOpen(!profileOpen)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all ${profileOpen ? 'bg-white/10' : 'hover:bg-white/10'}`}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs shadow-lg">
            {currentUser?.userName?.[0]?.toUpperCase()}
          </div>
          <div className="flex flex-col items-start leading-tight hidden sm:flex">
            <span className="text-sm font-bold tracking-tight">{currentUser?.userName}</span>
            <span className="text-[10px] font-bold text-emerald-400">{(currentUser?.accBalance || 0).toLocaleString()}</span>
          </div>
          <svg className={`w-4 h-4 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {profileOpen && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 backdrop-blur-xl">
            <div className="px-4 py-2 border-b border-white/5 mb-2">
              <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">Người chơi</p>
              <p className="text-sm font-bold truncate leading-none">{currentUser?.userName}</p>
              <p className="text-[11px] font-bold text-emerald-400 mt-1">{(currentUser?.accBalance || 0).toLocaleString()}</p>
            </div>
            
            <Deposit user={currentUser} variant="menuItem" />

            <Link href="/report" className="flex items-center space-x-3 px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Thống kê (Report)</span>
            </Link>

            {data?.user?.isDealer && (
              <Setting data={data?.setting} />
            )}
            
            <div className="border-t border-white/5 mt-2 pt-1">
              <button 
                onClick={onLeaveRoom}
                className="w-full text-left px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center space-x-3"
              >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Rời phòng</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
