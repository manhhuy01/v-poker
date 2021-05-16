import { useRef, useState } from 'react'
import { updateProfile } from '../api/poker'
import Modal from './modal'

export default function addModal({ waitingPlayers, isOpen, onClose, loading, onChose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      loading={loading}
      noConfirm={true}
    >
      <div className="w-full">
        <p className="text-lg text-center">Add player</p>
        <div className="mb-4 mt-4">
          <ul>
            <li className="w-full">
              {waitingPlayers.map((userName, i) => (
                <button onClick={()=> onChose(userName)} className="w-full bg-green-500 text-white p-2 m-2 rounded" key={i}>{userName}</button>

              ))}
            </li>
          </ul>
        </div>

      </div>

    </Modal>
  )
}