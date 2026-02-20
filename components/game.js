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
import BetModal from './betModal'
import Spin from './spin'
import ChatFloating from './chatFloating'
import QuickChatInput from './quickChatInput'

export default function Game({ data, onEditClick, onAddClick, onChatOpen, messages, countChat }) {
  const [playDingSound] = useSound('/ding.mp3');
  const [isFullScreen, setFullScreen] = useState(false)
  const [isLoadingDealerAction, setLoadingDealerAction] = useState(false)

  const [loadingPlayerAction, setLoadingPlayerAction] = useState(false)
  const [isOpenModalBet, setOpenModalBet] = useState(false);
  const [isOpenModalTip, setOpenModalTip] = useState(false);
  const [isHiddenCard, setHiddenCard] = useState(false)
  const tipInput = useRef(null);
  const [autoAction, setAutoAction] = useState(null); // 'FOLD', 'CALL_CHECK'
  const [autoActionBetValue, setAutoActionBetValue] = useState(0);
  const { addToast } = useToasts()

  useEffect(() => {
    if (data?.user?.position?.isThinking) {
      playDingSound();

      // Execute auto action
      if (autoAction === 'FOLD' && isCanFold) {
        onActionFold();
      } else if (autoAction === 'CALL_CHECK') {
        if (isCanCheck) {
          onActionCheck();
        } else if (isCanCall && autoActionBetValue == data?.table?.currentBet) {
          onActionCall();
        }
      }
      setAutoAction(null);
      setAutoActionBetValue(0);
    }
  }, [data?.user?.position?.isThinking, autoAction, autoActionBetValue])

  // Reset auto call/check if somebody raises
  useEffect(() => {
    if (autoAction === 'CALL_CHECK' && data?.table?.currentBet > autoActionBetValue) {
      setAutoAction(null);
      setAutoActionBetValue(0);
    }
  }, [data?.table?.currentBet, autoAction, autoActionBetValue])

  useEffect(() => {
    if (!data?.table?.start) {
      setAutoAction(null);
      setAutoActionBetValue(0);
    }
  }, [data?.table?.start])

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

  const onActionBet = async (betBalance) => {
    setLoadingPlayerAction(true)
    if (+betBalance == 'NaN' && betBalance != 'all-in') {
      setLoadingPlayerAction(false)
      return addToast('Bet sai định dạng', {
        appearance: 'error',
      })
    }
    setOpenModalBet(false)
    try {
      if (betBalance == 'all-in') {
        await playerAction({ type: 'BET', userName: data?.user?.userName, isAllIn: true })
      } else {
        await playerAction({ type: 'BET', userName: data?.user?.userName, betBalance: +betBalance })
      }
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
    <div className="game-container relative w-full h-dvh bg-gray-800 overflow-hidden">
      <div className="game-layout pt-16 pb-40 w-full h-dvh flex items-center justify-center">
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

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 flex flex-col items-center pointer-events-none gap-8">
            <ChatFloating
              user={data?.user}
              onChatOpen={onChatOpen}
              messages={messages}
              count={countChat}
            />
            <Pot
              pot={data?.table?.pot}
              cards={[...(data?.table?.flop || []), data?.table?.turn, data?.table?.river].filter(Boolean)}
              start={data?.table?.start}
              onClickTipDealer={() => setOpenModalTip(true)}
              finish={data?.table?.finish}
            />

          </div>
        </div>
      </div>
      <div onClick={onFullScreen} className="absolute top-24 left-1/2 z-10 cursor-pointer text-2xl text-white transform -translate-x-2/4 hover:scale-125 transition-all bg-black/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">&#x26F6;</div>
      <div className="absolute bottom-16 sm:bottom-24 left-0 w-full flex justify-center z-20 pointer-events-none">
        <div className="w-full max-w-md pointer-events-auto">
          <QuickChatInput user={data?.user} />
        </div>
      </div>
      <div className="sticky game-action bottom-0 left-0 flex flex-row items-center p-2 sm:p-6 justify-center gap-2 sm:gap-8 bg-black/90 backdrop-blur-3xl border-t border-white/10 w-full overflow-x-auto no-scrollbar">
        {
          data?.user?.isDealer && (
            <div className="flex flex-row items-center gap-4 sm:gap-4 shrink-0">
              {
                data?.table?.start && !data?.table?.preFlop && <button onClick={onPreFlop} className="flex-none flex flex-col items-center justify-center text-white bg-gradient-to-r from-emerald-400 to-green-600 px-3 py-3 sm:px-6 sm:py-3 rounded sm:rounded-2xl font-black text-[10px] sm:text-xs shadow-lg shadow-emerald-900/40 hover:scale-105 transition-all focus:outline-none border border-emerald-400/50" type="button">
                  <Spin loading={isLoadingDealerAction} />
                  <span className="uppercase tracking-tighter whitespace-nowrap px-0.5">Chia bài</span>
                </button>
              }
              {
                !data?.table?.start && <button onClick={onStart} className="flex-none flex flex-col items-center justify-center text-white bg-gradient-to-r from-pink-500 to-rose-600 px-3 py-3 sm:px-6 sm:py-3 rounded sm:rounded-2xl font-black text-[10px] sm:text-xs shadow-lg shadow-pink-900/40 hover:scale-105 transition-all focus:outline-none border border-pink-400/50" type="button">
                  <Spin loading={isLoadingDealerAction} />
                  <span className="uppercase tracking-tighter whitespace-nowrap px-0.5">Vào ván</span>
                </button>
              }
              {
                isFinish && !data?.table?.river && <button onClick={onShowAllCards} className="flex-none flex flex-col items-center justify-center text-white bg-gradient-to-r from-violet-500 to-purple-700 px-3 py-3 sm:px-6 sm:py-3 rounded sm:rounded-2xl font-black text-[10px] sm:text-xs shadow-lg shadow-violet-900/40 hover:scale-105 transition-all focus:outline-none border border-violet-400/50" type="button">
                  <Spin loading={isLoadingDealerAction} />
                  <span className="uppercase tracking-tighter whitespace-nowrap px-0.5">Chia Hết</span>
                </button>
              }
              {
                <button onClick={onReset} className="flex-none flex flex-col items-center justify-center text-white bg-gradient-to-r from-slate-500 to-slate-700 px-3 py-3 sm:px-6 sm:py-3 rounded sm:rounded-2xl font-black text-[10px] sm:text-xs shadow-lg shadow-slate-900/40 hover:scale-105 transition-all focus:outline-none border border-slate-400/50" type="button">
                  <Spin loading={isLoadingDealerAction} />
                  <span className="uppercase tracking-tighter whitespace-nowrap px-0.5">Thu dọn</span>
                </button>
              }
              {
                !data?.table?.start && <button onClick={onShuffle} className="flex-none flex flex-col items-center justify-center text-white bg-gradient-to-r from-indigo-500 to-blue-700 px-3 py-3 sm:px-6 sm:py-3 rounded sm:rounded-2xl font-black text-[10px] sm:text-xs shadow-lg shadow-indigo-900/40 hover:scale-105 transition-all focus:outline-none border border-indigo-400/50" type="button">
                  <Spin loading={isLoadingDealerAction} />
                  <span className="uppercase tracking-tighter whitespace-nowrap px-0.5">Xào bài</span>
                </button>
              }
            </div>
          )
        }
        {
          (!data?.table?.preFlop || isThinking || data?.table?.finish) && data?.user?.position && (
            <div className="flex flex-row items-center gap-4 sm:gap-4 shrink-0 ml-1">
              {
                isCanFold && <button onClick={onActionFold} disabled={loadingPlayerAction} className="flex-none flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-900 to-black border border-rose-950/50 px-5 py-3 sm:px-8 sm:py-3 rounded sm:rounded-2xl font-bold text-[10px] sm:text-sm shadow-xl shadow-black/80 hover:bg-zinc-900 transition-all focus:outline-none" type="button">
                  <Spin loading={loadingPlayerAction} />
                  <span className="uppercase tracking-tighter whitespace-nowrap px-0.5">Fold</span>
                </button>
              }
              {
                isCanCheck && <button onClick={onActionCheck} disabled={loadingPlayerAction} className="flex-none flex flex-col items-center justify-center text-white bg-gradient-to-br from-cyan-600 to-cyan-800 border border-cyan-500/40 px-5 py-3 sm:px-8 sm:py-3 rounded sm:rounded-2xl font-bold text-[10px] sm:text-sm hover:scale-105 shadow-lg shadow-cyan-900/40 transition-all focus:outline-none" type="button">
                  <Spin loading={loadingPlayerAction} />
                  <span className="uppercase tracking-tighter whitespace-nowrap px-0.5">Check</span>
                </button>
              }
              {
                isCanCall && (
                  <button onClick={onActionCall} disabled={loadingPlayerAction} className="flex-none flex flex-col items-center justify-center text-white bg-gradient-to-br from-amber-400 to-orange-600 border border-amber-400/40 px-5 py-3 sm:px-8 sm:py-3 rounded sm:rounded-2xl font-bold text-[10px] sm:text-sm shadow-xl shadow-amber-900/40 hover:scale-105 transition-all focus:outline-none" type="button">
                    <Spin loading={loadingPlayerAction} />
                    <span className="uppercase tracking-tighter whitespace-nowrap px-0.5">Call</span>
                  </button>
                )
              }

              {
                isCanBet && data?.table?.start && (
                  <button onClick={() => setOpenModalBet(true)} className="flex-none flex flex-col items-center justify-center text-white bg-gradient-to-br from-blue-500 to-indigo-700 border border-blue-400/40 px-5 py-3 sm:px-8 sm:py-3 rounded sm:rounded-2xl font-bold text-[10px] sm:text-sm shadow-xl shadow-blue-900/40 hover:scale-105 transition-all focus:outline-none" type="button">
                    <span className="uppercase tracking-tighter whitespace-nowrap px-0.5">Bet</span>
                  </button>
                )
              }

              {
                isCanShowCard && (
                  <button onClick={onActionShow} disabled={loadingPlayerAction} className="flex-none flex flex-col items-center justify-center text-white bg-gradient-to-br from-emerald-500 to-teal-700 border border-emerald-400/40 px-5 py-3 sm:px-8 sm:py-3 rounded sm:rounded-2xl font-bold text-[10px] sm:text-sm shadow-xl shadow-emerald-900/40 hover:scale-105 transition-all focus:outline-none" type="button">
                    <Spin loading={loadingPlayerAction} />
                    <span className="uppercase tracking-tighter whitespace-nowrap px-0.5">Show</span>
                  </button>
                )
              }
            </div>
          )
        }
        {
          !isThinking && isPlaying && !isFold && isPreFlop && !isFinish && (
            <div className="flex flex-row items-center gap-2 sm:gap-4 shrink-0 px-2">
              <button 
                onClick={() => setAutoAction(autoAction === 'FOLD' ? null : 'FOLD')}
                className={`flex-none flex items-center justify-center px-4 py-3 rounded-xl font-bold text-[10px] sm:text-xs transition-all border ${autoAction === 'FOLD' ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-900/50 scale-105' : 'bg-gray-900/50 text-gray-400 border-white/5 hover:bg-white/5'}`}
              >
                AUTO FOLD
              </button>
              <button 
                onClick={() => {
                  if (autoAction === 'CALL_CHECK') {
                    setAutoAction(null);
                  } else {
                    setAutoAction('CALL_CHECK');
                    setAutoActionBetValue(data?.table?.currentBet || 0);
                  }
                }}
                className={`flex-none flex items-center justify-center px-4 py-3 rounded-xl font-bold text-[10px] sm:text-xs transition-all border ${autoAction === 'CALL_CHECK' ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-900/50 scale-105' : 'bg-gray-900/50 text-gray-400 border-white/5 hover:bg-white/5'}`}
              >
                AUTO CALL/CHECK
              </button>
            </div>
          )
        }
      </div>
      <BetModal
        isOpen={isOpenModalBet}
        onClose={() => setOpenModalBet(false)}
        loading={loadingPlayerAction}
        onConfirm={onActionBet}
        data={data}
      />
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