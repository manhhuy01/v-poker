import { useState } from 'react'
import Profile from './profile'

export default function menuSide({ data, onEditClick }) {
  const [isOpen, setOpen] = useState(false)
  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-60'} z-20 flex flex-col w-60 h-screen fixed bg-white shadow-inner transition delay-150 duration-300 ease-in-out transform `}>
      <div className="w-full flex justify-between shadow pl-3 items-center">
        <p>Info</p>
        <button className="shadow text-gray-500 w-10 h-10 relative focus:outline-none bg-white self-end transform translate-x-10" onClick={() => setOpen(!isOpen)}>
          <div className="block w-5 absolute left-1/2 top-1/2   transform  -translate-x-1/2 -translate-y-1/2">
            <span aria-hidden="true" className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${isOpen ? 'rotate-45' : '-translate-y-1.5'}`}></span>
            <span aria-hidden="true" className={`block absolute  h-0.5 w-5 bg-current   transform transition duration-500 ease-in-out ${isOpen ? 'opacity-0' : ''} `}></span>
            <span aria-hidden="true" className={`block absolute  h-0.5 w-5 bg-current transform  transition duration-500 ease-in-out ${isOpen ? '-rotate-45' : 'translate-y-1.5'}`}></span>
          </div>
        </button>
      </div>
      <div className="h-full overflow-auto">
        <p className="m-4">Players in room</p>
        <ul>
          {
            data?.players && data.players.map((player, i) => (
              <li className="ml-5" key={i} onClick={()=> onEditClick(player.userName)}>
                <Profile user={player} />
              </li>
            ))
          }
        </ul>
      </div>

      <div className="h-16 p-4 border">
        <button className="w-full bg-gray-300 focus:outline-none rounded">Leave Room</button>
      </div>
    </div>
  )
}