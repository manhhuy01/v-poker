import Card from './card'

const Pot = ({ balance }) => (
  <div className="flex items-center justify-center pl-2 pr-2 pb-1">
    <img className="w-4 h-4 md:w-8 md:h-8 max-w-none mr-1" src="/pot.svg" alt="chip" />
    <span className="font-bold text-white">{balance}</span>
  </div>
)

export default function pot({ cards, pot, start, onClickTipDealer, finish }) {
  return (
    <div className="w-full md:w-1/2 flex flex-col items-center">
      {!(start && !finish) && <button onClick={onClickTipDealer} className="italic bg-white p-1 pl-2 pr-2 rounded mb-4 focus:outline-none" type="button">Tip Dealer</button>}
      <div className="flex justify-around w-3/4 mb-4 sm:mb-0 flex-wrap md:mb-10">
        {
          !!pot && pot.map((p, i) => !!p.balance && <Pot key={i} balance={p.balance} />)
        }
      </div>
      <div className="flex justify-center w-full ">
        {
          start && [0, 1, 2, 3, 4].map((i) => <Card key={i} data={cards[i] || 'u'} />)
        }
      </div>
    </div>
  )
}