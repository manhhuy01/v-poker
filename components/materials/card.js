const REGEX = /(.*)(s|h|c|d)/

export default function card({ data = 'u', isFold }) {


  if (data == 'u') {
    if(isFold){
      return null;
    }
    return (
      <div className={`border-black bg-white shadow rounded w-8 h-10 font-bold p-1 ml-1 mr-1 bg-card bg-card-up bg-size-card`}>
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
    <div className={`${colorClass} ${isFold ? 'opacity-50' : ''} border-black bg-white shadow rounded w-8 h-10 font-bold p-1 ml-1 mr-1`}>
      <div className="leading-4">{num}</div>
      <div className="text-lg leading-4 text-right ">{symbol}</div>
    </div>
  )
}