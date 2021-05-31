import { useState, useEffect } from 'react'
const REGEX = /(.*)(s|h|c|d)/

export default function card({ data = 'u', isFold, isHidden }) {
  const [hide, setHide] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      if (!isHidden) {
        setHide(false)
      }
    }, 500);
  }, [])

  useEffect(() => {
    setHide(isHidden)
  }, [isHidden])

  if (data == 'u') {
    if (isFold) {
      return null;
    }
    return (
      <div className={`border-black bg-white shadow rounded w-8 h-10 md:w-10 md:h-14 font-bold p-1 ml-1 mr-1 bg-card bg-card-up bg-size-card`}>
      </div>
    )
  }

  const matchArr = data.match(REGEX);
  const num = matchArr[1]
  const color = matchArr[2]
  let symbol = ''
  let colorClass = ''

  switch (color) {
    case 's':
      symbol = '♠';
      colorClass = 'text-spade'
      break;
    case 'd':
      symbol = '♦';
      colorClass = 'text-diamond'
      break;
    case 'h':
      symbol = '♥';
      colorClass = 'text-heart'
      break;
    case 'c':
      symbol = '♣'
      colorClass = 'text-club'
      break;
    default:
      break;
  }
  return (
    <div className={` ${hide ? '' : ''} delay-300 transition-transform transform-3d relative transform-gpu w-8 h-10 md:w-10 md:h-14 ml-1 mr-1`}>
      <div className={` ${colorClass} ${isFold ? 'bg-opacity-50' : ''} w-full h-full absolute border-black bg-white shadow rounded  font-bold p-1 `}>
        <div className="leading-4 md:text-xl">{num}</div>
        <div className="text-lg md:text-2xl leading-4 md:leading-4 text-right ">{symbol}</div>
      </div>
      {/* { !isFold && <div className={` absolute w-full h-full border-black bg-white shadow rounded font-bold bg-card bg-card-up bg-size-card`}>
      </div>} */}
    </div>

  )
}