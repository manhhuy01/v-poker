import { useState, useRef } from 'react'
import { updateSetting } from '../api/poker'
import { useToasts } from 'react-toast-notifications'
import Spin from './spin'

export default function setting({ data }) {
  const [isOpen, setOpen] = useState(false);
  const sbInput = useRef(null);
  const [loading, setLoading] = useState(false)
  const { addToast } = useToasts()

  const confirm = async () => {
    setLoading(true)
    let sbVal = sbInput.current.value;
    if (!+sbVal) {
      addToast('sb input phải là số', { appearance: 'error' })
      return setLoading(false)
    }
    try {
      await updateSetting({ smallBlind: +sbVal });
      addToast('Cập nhật thành công', { appearance: 'success' })
      setOpen(false)
    } catch (err) {
      addToast('update setting fail', { appearance: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors flex items-center space-x-3 text-white">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.717 1.717 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.717 1.717 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.717 1.717 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.717 1.717 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.717 1.717 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.717 1.717 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.717 1.717 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Cài đặt ván</span>
      </button>

      {isOpen && (
        <div className="fixed z-[60] inset-0 overflow-y-auto px-4 py-6 sm:px-0 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)}></div>
          
          <div className="relative bg-gray-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden backdrop-blur-xl transform transition-all">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">
                Cài đặt ván đấu
              </h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-8 py-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">
                  Small Blind (SB)
                </label>
                <div className="relative group">
                  <input 
                    type="number" 
                    ref={sbInput} 
                    defaultValue={data?.smallBlind} 
                    className="w-full bg-gray-800 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all hover:bg-gray-700 hover:border-white/20"
                    placeholder="Nhập giá trị SB..."
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                    CHIPS
                  </div>
                </div>
              </div>

              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                <p className="text-xs text-indigo-300 font-medium leading-relaxed">
                  Giá trị Big Blind (BB) sẽ tự động gấp đôi Small Blind.
                </p>
              </div>
            </div>

            <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex space-x-3">
              <button 
                onClick={() => setOpen(false)}
                className="flex-1 px-6 py-3.5 rounded-2xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={confirm}
                disabled={loading}
                className="flex-[2] px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-900/40 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                <Spin loading={loading} />
                <span>Lưu thay đổi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}