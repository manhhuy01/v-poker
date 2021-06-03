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
      <div className="w-full">
        <p className="text-lg text-center">{userName}</p>
        <div className="mb-4 mt-4 flex items-center">
          <label>Balance</label>
          <input ref={balanceInput} className="m-2 border-2 rounded" type="input" defaultValue={accBalance} />
          <button onClick={updateBalance} className="p-1 flex flex-row rounded bg-blue-500 text-white pr-2 pl-2 focus:outline-none hover:bg-blue-800" >
            {
              loadingBalance && (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>)
            }
            Save

          </button>
        </div>
        <div className="mb-4 mt-4">
          <button onClick={onSetDealer} className="w-full rounded bg-blue-500 text-white p-2 focus:outline-none hover:bg-blue-800" type="button">Set Dealer Position</button>
        </div>
        <div className="mb-4 mt-4">
          <button onClick={onFold} className="w-full rounded bg-red-500 text-white p-2 focus:outline-none hover:bg-red-800" type="button">Force Fold</button>
        </div>
        <div className="mb-4 mt-6">
          <button onClick={onTransfer} className="w-full rounded bg-green-500 text-white p-2 focus:outline-none hover:bg-green-800" type="button">Transfer Dealer Role</button>
        </div>
        <div className="mb-4 mt-4">
          <button onClick={onRemove} className="w-full rounded bg-red-500 text-white p-2 focus:outline-none hover:bg-red-800" type="button">Remove from table</button>
        </div>
      </div>

    </Modal>
  )
}