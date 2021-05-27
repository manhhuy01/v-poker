import { useState, useRef } from 'react'
import Position from '../components/materials/position'
import Pot from './materials/pot'
import {
  startGame, shuffleCards, preFlop, playerAction, reset
} from '../api/poker'
import Modal from './modal'

export default function game({ data, onEditClick, onAddClick }) {
  const [isFullScreen, setFullScreen] = useState(false)
  const [isLoadingDealerAction, setLoadingDealerAction] = useState(false)

  const [loadingPlayerAction, setLoadingPlayerAction] = useState(false)
  const [isOpenModalBet, setOpenModalBet] = useState(false);
  const betInput = useRef(null);
  const onStart = async () => {
    setLoadingDealerAction(true)
    try {
      await startGame();
    } catch (err) {
      if (err?.response?.data?.error) {
        alert(err?.response?.data?.error)
      }
    }
    setLoadingDealerAction(false)

  }

  const onShuffle = async () => {
    setLoadingDealerAction(true)
    try {
      await shuffleCards();
    } catch (err) {
      if (err?.response?.data?.error) {
        alert(err?.response?.data?.error)
      }
    }
    setLoadingDealerAction(false)
  }

  const onPreFlop = async () => {
    console.log('vo')
    setLoadingDealerAction(true)
    try {
      await preFlop();
    } catch (err) {
      if (err?.response?.data?.error) {
        alert(err?.response?.data?.error)
      }
    }
    setLoadingDealerAction(false)
  }

  const onReset = async () => {
    setLoadingDealerAction(true)
    try {
      await reset();
    } catch (err) {
      if (err?.response?.data?.error) {
        alert(err?.response?.data?.error)
      }
    }
    setLoadingDealerAction(false)
  }

  const onActionCall = async () => {
    setLoadingPlayerAction(true)
    try {
      await playerAction({ type: 'CALL' })
    } catch (err) {
      if (err?.response?.data?.error) {
        alert(err?.response?.data?.error)
      }
    }
    setLoadingPlayerAction(false)
  }

  const onActionFold = async () => {
    setLoadingPlayerAction(true)
    try {
      await playerAction({ type: 'FOLD' })
    } catch (err) {
      if (err?.response?.data?.error) {
        alert(err?.response?.data?.error)
      }
    }
    setLoadingPlayerAction(false)
  }

  const onActionCheck = async () => {
    setLoadingPlayerAction(true)
    try {
      await playerAction({ type: 'CHECK' })
    } catch (err) {
      if (err?.response?.data?.error) {
        alert(err?.response?.data?.error)
      }
    }
    setLoadingPlayerAction(false)
  }

  const onActionBet = async () => {
    setLoadingPlayerAction(true)
    let betBalance = betInput.current.value;
    if (+betBalance == 'NaN') {
      return alert('Bet sai định dạng')
    }
    setOpenModalBet(false)
    try {
      await playerAction({ type: 'BET', userName: data?.user?.userName, betBalance: +betBalance })
    } catch (err) {
      console.log('vo', err)

      if (err?.response?.data?.error) {
        alert(err?.response?.data?.error)
      }
    }
    setLoadingPlayerAction(false)
  }

  const onActionAllIn = async () => {
    setLoadingPlayerAction(true)
    setOpenModalBet(false)
    try {
      await playerAction({ type: 'BET', userName: data?.user?.userName, isAllIn: true })
    } catch (err) {
      console.log('vo', err)
      if (err?.response?.data?.error) {
        alert(err?.response?.data?.error)
      }
    }
    setLoadingPlayerAction(false)
  }

  const onFullScreen = () => {
    var elem = document.documentElement;
    /* View in fullscreen */
    function openFullscreen() {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
    }
    function closeFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }
    if (!isFullScreen) {
      openFullscreen();
      setFullScreen(true)
    } else {
      closeFullscreen();
      setFullScreen(false)
    }

  }

  const isPlaying = data?.user?.position?.isPlaying || false;
  const isPreFlop = !!data?.table?.preFlop
  const isFold = data?.user?.position?.isFold || false;
  const isThinking = data?.user?.position?.isThinking || false;
  const isAllIn = data?.user?.position?.user?.accBalance == 0
    && isPlaying && !isFold
  const isCanCheck = data?.user?.position?.betBalance == data?.table?.currentBet
    && isPlaying && !isFold && !isAllIn && isPreFlop
  const isCanCall = !isAllIn && isPreFlop && !isCanCheck
  const isCanFold = !isAllIn && isPreFlop && !isFold
  const isCanReset = data?.table?.start && data?.table?.finish

  return (
    <div className="w-screen h-screen bg-gray-800 overflow-hidden">
      <div className="pb-20 w-full h-full flex items-center justify-center">
        <div className="w-10/12 h-5/6 relative border-8 border-black rounded-large bg-green-700">
          {
            Object.keys(data?.position || {}).map((position) => (
              <Position
                key={position}
                namePos={data?.position[position].namePos}
                data={data?.position[position]}
                isThinking={data?.position[position]?.isThinking}
                pos={position}
                userName={data?.position[position]?.user?.userName}
                balance={data?.position[position]?.user?.accBalance}
                rawPosition={data?.position[position]?.rawPosition}
                bet={data?.position[position]?.betBalance}
                cards={data?.position[position]?.cards}
                isFold={data?.position[position]?.isFold}
                onEditClick={onEditClick}
                onAddClick={onAddClick}
                isPlaying={data?.position[position]?.isPlaying}
                winBalance={data?.position[position]?.winBalance}
                start={data?.table?.start}
              />
            ))
          }
          <Pot
            pot={data?.table?.pot}
            cards={[...(data?.table?.flop || []), data?.table?.turn, data?.table?.river]}
          />

        </div>
      </div>
      <div onClick={onFullScreen} className="absolute top-0 left-1/2 cursor-pointer text-2xl text-white transform -translate-x-2/4 ">&#x26F6;</div>
      <div className="sticky bottom-0 left-0 flex flex-row flex-wrap p-3 justify-center">
        {
          data?.user?.isDealer && (
            <div className="flex w-full justify-evenly border border-white mb-2 sm:w-1/2 sm:mb-0">

              {
                data?.table?.start && !data?.table?.preFlop && <button onClick={onPreFlop} className="text-white bg-green-500 p-2 pl-3 pr-3 rounded w-fit focus:outline-none flex items-center justify-center" type="button">
                  {
                    isLoadingDealerAction && (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>)
                  }
                Chia bài
                </button>
              }
              {
                !data?.table?.start && <button onClick={onStart} className="text-white bg-yellow-500 p-2 pl-3 pr-3 rounded w-fit focus:outline-none flex items-center justify-center" type="button">
                  {
                    isLoadingDealerAction && (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>)
                  }
                Vào ván
                </button>
              }

              {
                <button onClick={onReset} className="text-white bg-yellow-500 p-2 pl-3 pr-3 rounded w-fit focus:outline-none flex items-center justify-center" type="button">
                  {
                    isLoadingDealerAction && (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>)
                  }
                  Thu dọn
                </button>
              }
              {
                data?.table?.start && !data?.table?.preFlop && <button onClick={onShuffle} className="text-white bg-blue-500 p-2 rounded pl-3 pr-3 w-fit focus:outline-none flex items-center justify-center" type="button">
                  {
                    isLoadingDealerAction && (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>)
                  }
                Xào bài
                </button>
              }
            </div>
          )
        }
        {
          (!data?.table?.preFlop || isThinking) && data?.user?.position && (
            <div className="flex w-full justify-evenly sm:w-1/2">
              {
                isCanFold && <button onClick={onActionFold} disabled={loadingPlayerAction} className="flex items-center justify-center text-white bg-red-500 p-2 rounded w-20 focus:outline-none flex items-center justify-center" type="button">
                  {
                    loadingPlayerAction && (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>)
                  }
                Fold
                </button>
              }
              {
                isCanCheck && <button onClick={onActionCheck} disabled={loadingPlayerAction} className="flex items-center justify-center text-white bg-red-500 p-2 rounded w-20 focus:outline-none flex items-center justify-center" type="button">
                  {
                    loadingPlayerAction && (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>)
                  }
                Check
                </button>
              }
              {
                isCanCall && (
                  <button onClick={onActionCall} disabled={loadingPlayerAction} className="flex items-center justify-center text-white bg-yellow-500 p-2 rounded w-20 focus:outline-none" type="button">
                    {
                      loadingPlayerAction && (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>)
                    }
                  Call
                  </button>
                )
              }
              {
                !isAllIn && data?.table?.start && (
                  <button onClick={() => setOpenModalBet(true)} className="flex items-center justify-center text-white bg-blue-500 p-2 rounded w-20 focus:outline-none" type="button">Bet</button>
                )
              }

            </div>
          )
        }

      </div>
      {
        isOpenModalBet && (
          <Modal
            isOpen={isOpenModalBet}
            onClose={() => setOpenModalBet(false)}
            loading={false}
            onCancel={() => setOpenModalBet(false)}
            onConfirm={() => onActionBet()}
          >
            <div className="flex flex-col items-center justify-center w-full">
              <input className="border-2 rounded mb-4" type="input" ref={betInput} defaultValue={data?.user?.position?.betBalance || 0} />
              <button onClick={onActionAllIn} className="w-max pl-4 pr-4 bg-red-500 rounded text-white" type="button">All IN</button>
            </div>
          </Modal>
        )
      }
    </div>
  )
}