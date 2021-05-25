import Card from './card'

const Pot = ({ balance }) => (
  <div className="flex items-center justify-center pl-2 pr-2 pb-1">
    <img className="w-4 h-4 md:w-8 md:h-8 max-w-none mr-1" src="/pot.svg" alt="chip" />
    <span className="font-bold text-white">{balance}</span>
  </div>
)

export default function pot({ cards, pot }) {
  return (
    <div className="w-3/4 md:w-1/2 absolute top-1/2 left-1/2 transform -translate-x-2/4 -translate-y-2/4 flex flex-col items-center">
      <div className="flex justify-around w-3/4 mb-20 sm:mb-0 flex-wrap md:mb-10">
      {
        !!pot && pot.map((p,i) => !!p.balance && <Pot key={i} balance={p.balance}/>)
      }
      </div>
      <div className="flex justify-center w-full ">
        {
          !!cards && cards.map((c,i) => c && <Card key={i} data={c} />)
        }
      </div>
    </div>
  )
}