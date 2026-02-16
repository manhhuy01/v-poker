import Head from 'next/head'
import { useRef, useState, useEffect } from 'react'
import { useToasts } from 'react-toast-notifications'

import * as api from '../api/poker'
import cookie from 'cookie-cutter'



export default function Login() {
  const { addToast } = useToasts()

  const userEl = useRef(null);
  const passwordEl = useRef(null);

  const [loading, setLoading] = useState(false)

  const login = async (e) => {
    e.preventDefault();

    const userName = userEl.current.value.trim().toLowerCase();
    const password = passwordEl.current.value.trim();
    
    if (!userName || !password) {
      return addToast('Coi kĩ lại bạn ơi', { appearance: 'info'})
    }

    if(!/^([0-9,a-z])*$/.test(userName)){
      return addToast('user name có kí tự đặc biệt', { appearance: 'error'})
    }

    setLoading(true)
    try {
      let { data } = await api.login({ userName, password });
      setLoading(false)
      if (data.error) {
        addToast(data.error, { appearance: 'error'})
      } else {
        let now = new Date();
        cookie.set('token', data.token, { expires: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) })
        window.location.href = '/'
      }
    } catch (err) {
      addToast(err.response.data.error, { appearance: 'error'})
      console.log(err)
    } finally {
      setLoading(false)
    }


  }
  return (
    <>
      <Head>
        <title>Đăng nhập | V-POKER</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-950 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black p-4 overflow-hidden relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="w-full max-w-md animate-fade-in-up relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-black italic tracking-tighter text-white mb-2 drop-shadow-2xl">V-POKER</h1>
            <p className="text-gray-400 font-medium tracking-widest uppercase text-[10px]">Trải nghiệm Poker đẳng cấp</p>
          </div>

          <div className="bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 sm:p-10">
            <h2 className="text-2xl font-black text-white mb-8 text-center uppercase tracking-tight">Đăng nhập</h2>
            
            <form onSubmit={login} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Tài khoản</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500 transition-colors group-focus-within:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input 
                    ref={userEl}
                    type="text" 
                    placeholder="Tên dăng nhập..."
                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all hover:bg-black/60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Mật khẩu</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500 transition-colors group-focus-within:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    ref={passwordEl}
                    type="password" 
                    placeholder="Mật khẩu của bạn..."
                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all hover:bg-black/60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-indigo-900/40 hover:bg-indigo-500 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-50 border border-white/10"
              >
                {loading && <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                <span>Bắt đầu chơi ngay</span>
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-white/5 space-y-4">
              <p className="text-gray-500 text-xs font-semibold">Chưa có tài khoản?</p>
              <a href="/register" className="inline-block px-8 py-3 rounded-xl bg-white/5 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">
                Đăng ký thành viên
              </a>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-[9px] font-bold uppercase tracking-[0.2em]">© 2026 V-POKER • THE FUTURE OF GAME</p>
          </div>
        </div>
      </div>
    </>

  )
}