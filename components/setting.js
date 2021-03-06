import { useState, useRef } from 'react'
import { updateSetting } from '../api/poker'
import { useToasts } from 'react-toast-notifications'

import Modal from './modal'
export default function setting({ data }) {
  const [isOpen, setOpen] = useState(false);
  const sbInput = useRef(null);
  const [loading, setLoading] = useState(false)
  const { addToast } = useToasts()

  const confirm = async () => {
    setLoading(true)
    let sbVal = sbInput.current.value;
    if (!+sbVal) {
      addToast('sb input phải là số', { appearance: 'error'})
      return setLoading(false)
    }
    try {
      await updateSetting({ smallBlind: +sbVal });
    } catch (err) {
      addToast('update setting fail', { appearance: 'error'})
    } finally {
      setLoading(false)

    }
    setOpen(false)
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="absolute z-10 top-0 right-0 w-10 h-10 bg-white p-1 focus:outline-none">
        <img src="/settings.svg" alt='setting' />
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => { setOpen(false) }}
        onConfirm={confirm}
        onCancel={() => { setOpen(false) }}
        loading={loading}
      >
        <div className="mt-3 text-left sm:mt-0 sm:ml-4 sm:text-left">
          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
            Game setting
          </h3>
          <div className="mt-2">
            <label className="mr-2">Small Blind</label>
            <input type="input" className="border-2" ref={sbInput} defaultValue={data?.smallBlind} />
          </div>
        </div>

      </Modal>
    </>
  )
}