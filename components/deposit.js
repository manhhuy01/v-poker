import { useState, useRef } from 'react'
import { useToasts } from 'react-toast-notifications'
import { updateProfile } from '../api/poker'
import Spin from './spin'

export default function Deposit({ user, onAccountUpdate, variant = 'button' }) {
  const [isOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();
  const amountRef = useRef();

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amount = parseInt(amountRef.current.value);
    if (isNaN(amount) || amount <= 0) {
      return addToast('Số tiền không hợp lệ', { appearance: 'error' });
    }

    setLoading(true);
    try {
      const newBalance = (user.accBalance || 0) + amount;
      await updateProfile({ userName: user.userName, accBalance: newBalance });
      setOpen(false);
      if (onAccountUpdate) onAccountUpdate();
    } catch (err) {
      addToast(err?.response?.data?.error || 'Nạp tiền thất bại', { appearance: 'error' });
    }
    setLoading(false);
  };

  const renderTrigger = () => {
    if (variant === 'menuItem') {
      return (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors text-left"
        >
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Nạp tiền</span>
        </button>
      );
    }

    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-bold bg-emerald-500/20 text-emerald-400 transition-all hover:bg-emerald-500/30 active:scale-95 border border-emerald-500/20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Nạp tiền</span>
      </button>
    );
  };

  return (
    <>
      {renderTrigger()}

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}></div>
          <div className="relative bg-gray-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white">Nạp tiền</h3>
                <p className="text-xs text-gray-400 mt-1 font-medium tracking-wide">Số dư hiện tại: <span className="text-emerald-400">{(user.accBalance || 0).toLocaleString()}</span></p>
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleDeposit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Số tiền muốn nạp</label>
                <div className="relative group">
                  <input
                    ref={amountRef}
                    autoFocus
                    placeholder="Ví dụ: 10"
                    className="w-full bg-gray-800 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all hover:bg-gray-750"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-emerald-900/40 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
              >
                <Spin loading={loading} />
                <span>Xác nhận nạp</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
