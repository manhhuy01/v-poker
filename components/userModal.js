import { useRef, useState } from 'react'
import { useToasts } from 'react-toast-notifications'

import { updateProfile, removeFromTable, transferDealerRole, setDealerPosition, forceFold } from '../api/poker'
import Modal from './modal'

export default function userModel({ profile: { userName, accBalance }, isOpen, onClose, loading, onChose }) {
  const { addToast } = useToasts()
  const balanceInput = useRef(null)
  const [loadingBalance, setLoadingBalance] = useState(false)
  const updateBalance = async () => {
    let balanceVal = balanceInput.current.value;
    if (+balanceVal == "NaN" || +balanceVal < 0) {
      return addToast('Số dư bị sai', { appearance: 'error'})
    }
    setLoadingBalance(true)
    try {
      await updateProfile({ userName, accBalance: +balanceVal });
    } catch (err) {
      addToast('update balance error', { appearance: 'error'})
    }
    setLoadingBalance(false)
    onClose();
  }

  const onRemove = async () => {
    try {
      await removeFromTable({ userName });
    } catch (err) {
      if (err?.response?.data?.error) {
        addToast(err?.response?.data?.error, { appearance: 'error'})
      }
    }
    onClose();
  }

  const onTransfer = async () => {
    try {
      await transferDealerRole({ userName });
    } catch (err) {
      console.log(err)
      if (err?.response?.data?.error) {
        addToast(err?.response?.data?.error, { appearance: 'error'})
      }
    }
    onClose();
  }


  const onSetDealer = async () => {
    try {
      await setDealerPosition({ userName });
    } catch (err) {
      console.log(err)
      if (err?.response?.data?.error) {
        addToast(err?.response?.data?.error, { appearance: 'error'})
      }
    }
    onClose();
  }

  const onFold = async () => {
    try {
      await forceFold({ userName });
    } catch (err) {
      console.log(err)
      if (err?.response?.data?.error) {
        addToast(err?.response?.data?.error, { appearance: 'error'})
      }
    }
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      loading={loading}
      noConfirm={true}
    >
      <div className="w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-black text-2xl shadow-xl shadow-indigo-900/40 mx-auto mb-4 text-white">
            {userName?.[0]?.toUpperCase()}
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight text-white">{userName}</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Quản lý người chơi</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Số dư hiện tại</label>
            <div className="flex space-x-2">
              <div className="relative group flex-1">
                <input 
                  ref={balanceInput} 
                  defaultValue={accBalance} 
                  className="w-full bg-gray-800 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all hover:bg-gray-750"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">CHIPS</div>
              </div>
              <button 
                onClick={updateBalance} 
                disabled={loadingBalance}
                className="px-6 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-900/40 hover:bg-emerald-500 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {loadingBalance && <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                <span>Lưu</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={onSetDealer} 
              className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-sm hover:bg-indigo-500/20 transition-all group"
            >
              <span>Đặt làm Dealer (Vị trí)</span>
              <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>

            <button 
              onClick={onTransfer} 
              className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm hover:bg-emerald-500/20 transition-all group"
            >
              <span>Chuyển quyền Chủ phòng</span>
              <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={onFold} 
                className="flex items-center justify-center space-x-2 px-4 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-xs hover:bg-rose-500/20 transition-all group"
              >
                <span>Úp bài ép</span>
              </button>
              <button 
                onClick={onRemove} 
                className="flex items-center justify-center space-x-2 px-4 py-4 rounded-2xl bg-rose-600/20 border border-rose-600/30 text-rose-500 font-bold text-xs hover:bg-rose-600/30 transition-all"
              >
                <span>Mời ra khỏi bàn</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}