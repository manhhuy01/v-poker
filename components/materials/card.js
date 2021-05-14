export default function card({ num = '10', color = 's' }){
  let symbol = ''
  let colorClass = ''
  switch(color){
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
    <div className={`${colorClass} border-black bg-white shadow rounded w-8 h-10 font-bold p-1 ml-1 mr-1`}>
      <div className="leading-4">{num}</div>
      <div className="text-2xl leading-4 text-right ">{symbol}</div>
    </div>
  )
}