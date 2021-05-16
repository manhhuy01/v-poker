import Position from '../components/materials/position'
import Pot from './materials/pot'
export default function game({ data, onEditClick, onAddClick }) {
  return (
    <div className="w-screen h-screen bg-gray-800 overflow-hidden">
      <div className="pb-20 w-full h-full flex items-center justify-center">
        <div className="w-10/12 h-5/6 relative border-8 border-black rounded-large bg-green-700">
          {
            Object.keys(data?.position || {}).map((position)=> (
              <Position 
                key={position}
                namePos={data?.position[position].namePos}
                data={data?.position[position]}
                isThinking={data?.position[position]?.isThinking}
                pos={position}
                userName={data?.position[position]?.user?.userName}
                balance={data?.position[position]?.user?.accBalance}
                rawPosition={data?.position[position]?.rawPosition}
                onEditClick={onEditClick}
                onAddClick={onAddClick}
              />
            ))
          }
        </div>
      </div>
      <div>
        action
      </div>
    </div>
  )
}