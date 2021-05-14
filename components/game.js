import Position from '../components/materials/position'
import Pot from './materials/pot'
export default function game({ }) {
  return (
    <div className="w-screen h-screen bg-gray-800 overflow-hidden">
      <div className="pb-10 w-full h-full flex items-center justify-center">
        <div className="w-10/12 h-5/6 relative border-8 border-black rounded-large bg-green-700">

          <Position
            pos={1}
          />
          <Position
            pos={2}
          />
          <Position
            pos={3}
          />
          <Position
            pos={4}
            namePos='D'
          />
          <Position
            pos={5}
            namePos='SB'
          />
          <Position
            pos={6}
            namePos='BB'
          />
          <Position
            pos={7}
            isThinking={true}
          />
          <Position
            pos={8}
          />
          <Position
            pos={9}
          />
          <Pot />
        </div>
      </div>
      <div>
        action
      </div>
    </div>
  )
}