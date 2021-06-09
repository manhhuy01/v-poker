import { useState, useRef, useEffect } from 'react'
import { useToasts } from 'react-toast-notifications'

import useSound from 'use-sound';

import Position from '../components/materials/position'
import Pot from './materials/pot'
import {
  startGame, shuffleCards, preFlop, playerAction, reset,
  showAllCards, playerTipDealer,
} from '../api/poker'
import Modal from './modal'
import Spin from './spin'

export default function game({ data, onEditClick, onAddClick }) {
  const [playDingSound] = useSound('/ding.mp3');
  const [isFullScreen, setFullScreen] = useState(false)
  const [isLoadingDealerAction, setLoadingDealerAction] = useState(false)

  const [loadingPlayerAction, setLoadingPlayerAction] = useState(false)
  const [isOpenModalBet, setOpenModalBet] = useState(false);
  const [isOpenModalTip, setOpenModalTip] = useState(false);
  const [isHiddenCard, setHiddenCard] = useState(false)
  const betInput = useRef(null);
  const tipInput = useRef(null);
  const { addToast } = useToasts()

  useEffect(() => {
    if (data?.user?.position?.isThinking) {
      playDingSound();
    }
  }, [data?.user?.position?.isThinking])

  const onStart = async () => {
    setLoadingDealerAction(true)
    try {
      await startGame();
    } catch (err) {
      if (err?.response?.data?.error) {
        addToast(err?.response?.data?.error, {
          appearance: 'error',
        })
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
        addToast(err?.response?.data?.error, {
          appearance: 'error',
        })
      }
    }
    setLoadingDealerAction(false)
  }

  const onPreFlop = async () => {
    setLoadingDealerAction(true)
    try {
      await preFlop();
    } catch (err) {
      if (err?.response?.data?.error) {
        addToast(err?.response?.data?.error, {
          appearance: 'error',
        })
      }
    }
    setLoadingDealerAction(false)
  }

  const onReset = async () => {
    if ((!data.table.finish && window.confirm('Chắc chưa bạn')) || data.table.finish) {
      setLoadingDealerAction(true)
      try {
        await reset();
      } catch (err) {
        if (err?.response?.data?.error) {
          addToast(err?.response?.data?.error, {
            appearance: 'error',
          })
        }
      }
      setLoadingDealerAction(false)
    }
  }

  const onActionCall = async () => {
    setLoadingPlayerAction(true)
    try {
      await playerAction({ type: 'CALL' })
    } catch (err) {
      if (err?.response?.data?.error) {
        addToast(err?.response?.data?.error, {
          appearance: 'error',
        })
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
        addToast(err?.response?.data?.error, {
          appearance: 'error',
        })
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
        addToast(err?.response?.data?.error, {
          appearance: 'error',
        })
      }
    }
    setLoadingPlayerAction(false)
  }

  const onActionShow = async () => {
    setLoadingPlayerAction(true)
    try {
      await playerAction({ type: 'SHOW' })
    } catch (err) {
      if (err?.response?.data?.error) {
        addToast(err?.response?.data?.error, {
          appearance: 'error',
        })
      }
    }
    setLoadingPlayerAction(false)
  }

  const onActionBet = async () => {
    setLoadingPlayerAction(true)
    let betBalance = betInput.current.value;
    if (+betBalance == 'NaN') {
      return addToast('Bet sai định dạng', {
        appearance: 'error',
      })
    }
    setOpenModalBet(false)
    try {
      await playerAction({ type: 'BET', userName: data?.user?.userName, betBalance: +betBalance })
    } catch (err) {
      if (err?.response?.data?.error) {
        addToast(err?.response?.data?.error, {
          appearance: 'error',
        })
      }
    }
    setLoadingPlayerAction(false)
  }

  const onActionTip = async () => {
    setLoadingPlayerAction(true)
    let tip = tipInput.current.value;
    if (+tip == 'NaN') {
      return addToast('Tip sai định dạng số', {
        appearance: 'error',
      })
    }
    setOpenModalTip(false)
    try {
      await playerTipDealer({ tip })
      // return addToast('Tip thành công', {
      //   appearance: 'success',
      // })
    } catch (err) {
      if (err?.response?.data?.error) {
        addToast(err?.response?.data?.error, {
          appearance: 'error',
        })
      }
    }
    setLoadingPlayerAction(false)
  }

  const onActionAllIn = async () => {
    if (window.confirm('Chắc không bạn?')) {
      setLoadingPlayerAction(true)
      setOpenModalBet(false)
      try {
        await playerAction({ type: 'BET', userName: data?.user?.userName, isAllIn: true })
      } catch (err) {
        if (err?.response?.data?.error) {
          addToast(err?.response?.data?.error, {
            appearance: 'error',
          })
        }
      }
      setLoadingPlayerAction(false)
    }
  }

  const onShowAllCards = async () => {
    setLoadingDealerAction(true)
    try {
      await showAllCards();
    } catch (err) {
      if (err?.response?.data?.error) {
        addToast(err?.response?.data?.error, {
          appearance: 'error',
        })
      }
    }
    setLoadingDealerAction(false)
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

  const hideCard = () => setHiddenCard(!isHiddenCard);
  const isFinish = data?.table?.finish;
  const isPlaying = data?.user?.position?.isPlaying || false;
  const isPreFlop = !!data?.table?.preFlop
  const isFold = data?.user?.position?.isFold || false;
  const isThinking = data?.user?.position?.isThinking || false;
  const isAllIn = data?.user?.position?.user?.accBalance == 0
    && isPlaying && !isFold
  const isCanCheck = data?.user?.position?.betBalance == data?.table?.currentBet && !isFinish
    && isPlaying && !isFold && !isAllIn && isPreFlop
  const isCanCall = !isAllIn && isPreFlop && !isCanCheck && !isFinish
  const isCanFold = !isAllIn && isPreFlop && !isFold && !isFinish
  const isCanShowCard = isFinish && !isFold && !data?.table?.isShowDown
  const isCanBet = !isAllIn && !isFinish
  return (
    <div className="relative w-full h-screen bg-gray-800 overflow-hidden">
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
                isUserPlaying={data?.user?.position?.user?.userName == data?.position[position]?.user?.userName}
                isHiddenCard={isHiddenCard}
                hideCard={hideCard}
                result={data?.position[position]?.resultCard?.name}
              />
            ))
          }
          <Pot
            pot={data?.table?.pot}
            cards={[...(data?.table?.flop || []), data?.table?.turn, data?.table?.river].filter(Boolean)}
            start={data?.table?.start}
            onClickTipDealer={() => setOpenModalTip(true)}
            finish={data?.table?.finish}
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
                  <Spin loading={isLoadingDealerAction} />
                Chia bài
                </button>
              }
              {
                !data?.table?.start && <button onClick={onStart} className="text-white bg-red-500 p-2 pl-3 pr-3 rounded w-fit focus:outline-none flex items-center justify-center" type="button">
                  <Spin loading={isLoadingDealerAction} />
                Vào ván
                </button>
              }
              {
                isFinish && !data?.table?.river && <button onClick={onShowAllCards} className="text-white bg-purple-500 p-2 pl-3 pr-3 rounded w-fit focus:outline-none flex items-center justify-center" type="button">
                  <Spin loading={isLoadingDealerAction} />
                  Chia Hết
                </button>
              }
              {
                <button onClick={onReset} className="text-white bg-yellow-500 p-2 pl-3 pr-3 rounded w-fit focus:outline-none flex items-center justify-center" type="button">
                  <Spin loading={isLoadingDealerAction} />
                  Thu dọn
                </button>
              }
              {
                data?.table?.start && !data?.table?.preFlop && <button onClick={onShuffle} className="text-white bg-blue-500 p-2 rounded pl-3 pr-3 w-fit focus:outline-none flex items-center justify-center" type="button">
                  <Spin loading={isLoadingDealerAction} />
                Xào bài
                </button>
              }
            </div>
          )
        }
        {
          (!data?.table?.preFlop || isThinking || data?.table?.finish) && data?.user?.position && (
            <div className="flex w-full justify-evenly sm:w-1/2">
              {
                isCanFold && <button onClick={onActionFold} disabled={loadingPlayerAction} className="flex items-center justify-center text-white bg-red-500 p-2 rounded w-20 focus:outline-none flex items-center justify-center" type="button">
                  <Spin loading={loadingPlayerAction} />
                Fold
                </button>
              }
              {
                isCanCheck && <button onClick={onActionCheck} disabled={loadingPlayerAction} className="flex items-center justify-center text-white bg-red-500 p-2 rounded w-20 focus:outline-none flex items-center justify-center" type="button">
                  <Spin loading={loadingPlayerAction} />
                Check
                </button>
              }
              {
                isCanCall && (
                  <button onClick={onActionCall} disabled={loadingPlayerAction} className="flex items-center justify-center text-white bg-yellow-500 p-2 rounded w-20 focus:outline-none" type="button">
                    <Spin loading={loadingPlayerAction} />
                  Call
                  </button>
                )
              }

              {
                isCanBet && data?.table?.start && (
                  <button onClick={() => setOpenModalBet(true)} className="flex items-center justify-center text-white bg-blue-500 p-2 rounded w-20 focus:outline-none" type="button">Bet</button>
                )
              }

              {
                isCanBet && data?.table?.start && (
                  <button onClick={onActionAllIn} className="w-max pl-4 pr-4 bg-red-500 rounded text-white" type="button">
                    <Spin loading={loadingPlayerAction} />
                  All IN
                  </button>
                )
              }

              {
                isCanShowCard && (
                  <button onClick={onActionShow} disabled={loadingPlayerAction} className="flex items-center justify-center text-white bg-green-500 p-2 rounded w-20 focus:outline-none" type="button">
                    <Spin loading={loadingPlayerAction} />
                  Show
                  </button>
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
            </div>
          </Modal>
        )
      }
      {
        isOpenModalTip && (
          <Modal
            isOpen={isOpenModalTip}
            onClose={() => setOpenModalTip(false)}
            loading={false}
            onCancel={() => setOpenModalTip(false)}
            onConfirm={() => onActionTip()}
          >
            <div className="flex flex-col items-center justify-center w-full">
              <input className="border-2 rounded mb-4" type="input" ref={tipInput} defaultValue={0} />
            </div>
          </Modal>
        )
      }
    </div>
  )
}