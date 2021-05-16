import { useState, useRef } from 'react'
import { updateSetting } from '../api/poker'
import Modal from './modal'
export default function setting({ data }) {
  const [isOpen, setOpen] = useState(false);
  const sbInput = useRef(null);
  const dealerAlsoPlayerInput = useRef(null);
  const [loading, setLoading] = useState(false)
  const confirm = async () => {
    setLoading(true)
    let sbVal = sbInput.current.value;
    let dealerVal = dealerAlsoPlayerInput.current.checked;
    console.log(dealerVal)
    if (!+sbVal) {
      alert('sb input phải là số')
      return setLoading(false)
    }
    try {
      await updateSetting({ smallBlind: +sbVal, dealerAlsoPlayer: dealerVal });
    } catch (err) {
      console.log('update setting error', err)
      alert('update setting fail')
    } finally {
      setLoading(false)

    }
    setOpen(false)
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="absolute top-0 right-0 w-10 h-10 bg-white p-1 focus:outline-none">
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
          <div className="mt-2">
            <input ref={dealerAlsoPlayerInput} type="checkbox" className="mr-2 checked:bg-blue-600 checked:border-transparent" defaultChecked={!!data?.dealerAlsoPlayer}/>
            <span>Dealer also player</span>
          </div>
        </div>

      </Modal>
    </>
  )
}