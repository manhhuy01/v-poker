import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import { useToasts } from 'react-toast-notifications'

import useSound from 'use-sound';

import TableStage from '../components/poker/tableStage'
import Pot from './materials/pot'
import CuteDecor from './poker/cuteDecor'
import { UI_VERSIONS } from '../utils/uiVersion'
import {
  startGame, shuffleCards, preFlop, playerAction, reset,
  showAllCards, playerTipDealer,
} from '../api/poker'
import Modal from './modal'
import BetModal from './betModal'
import ChatFloating from './chatFloating'
import QuickChatInput from './quickChatInput'
import ActionDock from './poker/actionDock'
import CharmPicker from './charm/charmPicker'
import { IconCollapse, IconExpand, IconEye, IconEyeOff } from './poker/icons'
import styles from './poker/game.module.css'

const TIP_PRESETS = [1, 5, 10, 20, 50]

export default function Game({ data, onEditClick, onAddClick, onChatOpen, messages, countChat, uiVersion, charms, onPickCharm }) {
  const isCute = uiVersion === UI_VERSIONS.V3
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
  const setTipPreset = (value) => {
    if (tipInput.current) tipInput.current.value = value
  }

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

  const showActions = (!isPreFlop || isThinking || isFinish) && !!data?.user?.position
  const showAuto = !isThinking && isPlaying && !isFold && isPreFlop && !isFinish
  const isUserPlaying = !!data?.user?.position

  const dealerActions = {
    preFlop: !!(data?.user?.isDealer && data?.table?.start && !data?.table?.preFlop),
    start: !!(data?.user?.isDealer && !data?.table?.start),
    showAll: !!(data?.user?.isDealer && isFinish && !data?.table?.river),
    reset: !!(data?.user?.isDealer),
    shuffle: !!(data?.user?.isDealer && !data?.table?.start),
  }

  let hint = ''
  if (!showActions) {
    if (!isUserPlaying) hint = 'Bạn đang xem bàn chơi'
    else if (isFold) hint = 'Bạn đã bỏ bài ở ván này'
    else if (isFinish) hint = 'Ván đã kết thúc'
    else if (isThinking) hint = 'Đang tới lượt bạn'
    else if (isPreFlop) hint = 'Đang chờ người chơi khác hành động'
  }

  return (
    <div className={styles.shell} data-ui-version={uiVersion || 'v2'}>
      {isCute && (
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@600;700;800;900&display=swap"
            rel="stylesheet"
          />
        </Head>
      )}
      <div className={styles.navSpace} />

      <div className={styles.tableArea}>
        {isCute && <CuteDecor />}
        <TableStage
          positions={data?.position}
          start={data?.table?.start}
          userName={data?.user?.userName}
          isHiddenCard={isHiddenCard}
          showdown={!!data?.table?.finish}
          onEditClick={onEditClick}
          onAddClick={onAddClick}
          charms={charms}
          center={(
            <>
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
            </>
          )}
        />

        <div className={styles.utils}>
          {isUserPlaying && (
            <button
              type="button"
              className={styles.utilBtn}
              data-active={!isHiddenCard}
              onClick={hideCard}
              title={isHiddenCard ? 'Hiện bài của tôi' : 'Ẩn bài của tôi'}
              aria-label={isHiddenCard ? 'Hiện bài của tôi' : 'Ẩn bài của tôi'}
            >
              {isHiddenCard ? <IconEyeOff /> : <IconEye />}
            </button>
          )}
          <button
            type="button"
            className={styles.utilBtn}
            onClick={onFullScreen}
            title={isFullScreen ? 'Thu nhỏ màn hình' : 'Toàn màn hình'}
            aria-label={isFullScreen ? 'Thu nhỏ màn hình' : 'Toàn màn hình'}
          >
            {isFullScreen ? <IconCollapse /> : <IconExpand />}
          </button>
        </div>
      </div>

      <ActionDock
        dealerActions={dealerActions}
        showActions={showActions}
        canFold={isCanFold}
        canCheck={isCanCheck}
        canCall={isCanCall}
        canBet={isCanBet && !!data?.table?.start}
        canShow={isCanShowCard}
        showAuto={showAuto}
        autoAction={autoAction}
        onToggleAutoFold={() => setAutoAction(autoAction === 'FOLD' ? null : 'FOLD')}
        onToggleAutoCall={() => {
          if (autoAction === 'CALL_CHECK') {
            setAutoAction(null);
          } else {
            setAutoAction('CALL_CHECK');
            setAutoActionBetValue(data?.table?.currentBet || 0);
          }
        }}
        onPreFlop={onPreFlop}
        onStart={onStart}
        onShowAllCards={onShowAllCards}
        onReset={onReset}
        onShuffle={onShuffle}
        onFold={onActionFold}
        onCheck={onActionCheck}
        onCall={onActionCall}
        onBet={() => setOpenModalBet(true)}
        onShow={onActionShow}
        loadingDealer={isLoadingDealerAction}
        loadingPlayer={loadingPlayerAction}
        hint={hint}
        quickChat={<QuickChatInput user={data?.user} />}
        charm={data?.user?.position?.user ? <CharmPicker onPick={onPickCharm} /> : null}
        cute={isCute}
      />

      <BetModal
        isOpen={isOpenModalBet}
        onClose={() => setOpenModalBet(false)}
        loading={loadingPlayerAction}
        onConfirm={onActionBet}
        data={data}
        theme={isCute ? 'sweet' : undefined}
      />
      {
        isOpenModalTip && (
          <Modal
            isOpen={isOpenModalTip}
            onClose={() => setOpenModalTip(false)}
            loading={false}
            onCancel={() => setOpenModalTip(false)}
            onConfirm={() => onActionTip()}
            theme={isCute ? 'sweet' : undefined}
          >
            <div className={styles.tipBody}>
              <h3 className={styles.tipTitle}>Tip cho dealer</h3>
              <p className={styles.tipSub}>
                Gửi một chút cảm ơn tới người chia bài. Số dư sẽ được trừ ngay khi xác nhận.
              </p>
              <div className={styles.tipPresets}>
                {TIP_PRESETS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={styles.tipPreset}
                    onClick={() => setTipPreset(value)}
                  >
                    ${value}
                  </button>
                ))}
              </div>
              <div className={styles.tipField}>
                <span className={styles.tipCurrency}>$</span>
                <input
                  className={styles.tipInput}
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  ref={tipInput}
                  defaultValue={0}
                  aria-label="Số tiền tip"
                />
              </div>
            </div>
          </Modal>
        )
      }
    </div>
  )
}
