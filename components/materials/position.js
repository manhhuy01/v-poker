import Card from './card'

const MAP_RS = {
  'highHand': 'Bluff',
  'onePair': '1 đôi',
  'twoPair': '2 đôi',
  'totk': 'Sám cô',
  'fullHouse': 'Cù lũ',
  'quad': 'Tứ Quý',
  'straight': 'Sảnh',
  'flush': 'Thùng',
  'straightFlush': 'Thùng fá Sảnh'
}

export default function position({
  pos = 0,
  namePos = '',
  userName = '',
  cards,
  balance = 0,
  bet,
  isThinking = false,
  onEditClick,
  onAddClick,
  rawPosition,
  isFold,
  isPlaying,
  winBalance,
  start,
  isUserPlaying,
  isHiddenCard = true,
  hideCard,
  result
}) {
  let className;
  let chipClassName;
  switch (+pos) {
    case 1:
      className = 'bottom-0 left-1/2'
      chipClassName = '-top-20 md:-top-24';
      break;
    case 2:
      className = 'left-0 bottom-1/5 sm:bottom-0 sm:left-1/4'
      chipClassName = '-top-8 left-16 sm:-top-20 sm:left-0 md:-top-24';
      break;
    case 3:
      className = 'bottom-1/2 left-0 sm:bottom-1/4'
      chipClassName = '-right-24 sm:-top-8';
      break;
    case 4:
      className = 'left-0 top-1/5 sm:top-1/4 sm:left-0';
      chipClassName = 'top-16'
      chipClassName = '-right-20 top-8';
      break;
    case 5:
      className = 'top-0 left-1/4 sm:top-3 sm:left-1/3'
      chipClassName = 'left-4 top-16 sm:left-0';
      break;
    case 6:
      className = 'top-0 left-3/4 sm:top-3 sm:left-2/3'
      chipClassName = 'top-16 -left-12 sm:left-0';
      break;
    case 7:
      className = 'right-0 top-1/5 sm:top-1/4 sm:right-0'
      chipClassName = '-left-20 top-8';
      break;
    case 8:
      className = 'bottom-1/2 right-0 sm:bottom-1/4'
      chipClassName = '-left-24 sm:-top-8';
      break;
    case 9:
      className = 'right-0 bottom-1/5 sm:bottom-0 sm:right-1/4'
      chipClassName = '-top-8 right-16 sm:-top-20 sm:right-0 md:-top-24';

      break;

    default:
      break;
  }

  let posClassName
  switch (namePos) {
    case 'D':
      posClassName = 'bg-yellow-300 text-yellow-700'
      break;
    case 'SB':
      posClassName = 'bg-blue-300 text-blue-700'
      break;
    case 'BB':
      posClassName = 'bg-red-300 text-red-700'
      break
    default:
      break;

  }
  return (
    <div className={`items-center flex flex-col absolute w-0 h-0 ${className}`}>
      <div className={`${isThinking ? 'border-gray-700 animate-pulse bg-yellow-500' : 'border-gray-700 bg-gray-600'} rounded-full w-20 h-20  -top-8 absolute  border-4`} />
      {
        !userName && (
          <div onClick={() => onAddClick(rawPosition || pos)} className=" absolute z-10 text-white w-max -top-6 text-base p-5 cursor-pointer">+</div>
        )
      }
      {
        !!userName && (
          <>

            <div className="z-10 absolute -top-11 md:-top-14 flex">
              {
                cards && cards.map((c, i) => {
                  return <Card data={c} key={i} isFold={isFold} isHidden={isHiddenCard && isUserPlaying} />
                })
              }
            </div>
            {
              !!result && !isFold && <span className="whitespace-nowrap z-20 rounded pl-1 pr-1 absolute -top-6 bg-blue-900 text-white bg-opacity-70 font-bold">{MAP_RS[result]}</span>
            }
            <div onClick={() => onEditClick(userName)} className="text-white pr-1 pl-1 rounded border-yellow-600 border bg-gray-900 text-xs z-10 cursor-pointer">{userName}</div>
            {
              !!namePos && <div className={`${posClassName} absolute font-extrabold text-xs z-10 pl-1 pr-1 rounded -bottom-12`} >{namePos}</div>
            }
            <div className="bg-gray-900 text-blue-400 pr-2 pl-2 rounded z-10 text-xs w-max">${isPlaying && !balance && start ? 'ALL IN' : balance}</div>
            { isUserPlaying && <div onClick={hideCard} className={`${isHiddenCard ? 'text-red-500' : 'text-white'} absolute left-16 top-50 text-xl text-white cursor-pointer`}>Θ</div>}
            {
              !!bet && (
                <div className={`${chipClassName} absolute flex items-center justify-center text-xs font-bold text-white`}>
                  <img className="w-4 h-4 max-w-none mr-1" src="/chip.svg" alt="chip" />
                  <span>{bet}</span>
                </div>
              )
            }
            {
              !!winBalance && (
                <div className={`${chipClassName} w-max absolute flex items-center justify-center text-xs font-bold text-white`}>
                  <span> {`+ ${winBalance}`}</span>
                  <img className="ml-1 w-4 h-4 max-w-none mr-1" src="/chip.svg" alt="chip" />
                </div>
              )
            }

          </>
        )
      }

    </div>
  )
}