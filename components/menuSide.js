import Link from 'next/link'
import Profile from './profile'
import Modal from './modal'

export default function menuSide({ data, onEditClick, isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      noConfirm={true}
    >
      <div className="w-full">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">
            Phòng chờ (Lobby)
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3">Người chơi trong phòng ({data?.players?.length || 0})</p>
            <div className="grid grid-cols-1 gap-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {
                data?.players && data.players.map((player, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between p-3 rounded-2xl border border-gray-50 hover:bg-indigo-50/50 hover:border-indigo-100 transition-all cursor-pointer group"
                    onClick={() => onEditClick(player.userName)}
                  >
                    <Profile user={player} />
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}