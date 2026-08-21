import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useToasts } from 'react-toast-notifications'
import * as api from '../../../api/poker'
import Position from '../../../components/materials/position'
import Pot from '../../../components/materials/pot'

const emptyPosition = () => ({
  user: undefined,
  betBalance: 0,
  isFold: false,
  namePos: '',
  cards: [],
  isThinking: false,
  isPlaying: false,
  winBalance: 0,
  showCard: false,
  action: '',
})

const initTable = () => ({
  start: false,
  preFlop: '',
  flop: '',
  turn: '',
  river: '',
  finish: false,
  firstActionPlayer: undefined,
  pot: [{ users: [], balance: 0, isHavePlayerAllIn: false }],
  currentBet: 0,
  isShowDown: false,
  showDownAt: undefined,
  actions: [],
})

const initReplay = () => ({
  dealer: undefined,
  setting: { smallBlind: 1 },
  players: [],
  position: {
    1: emptyPosition(),
    2: emptyPosition(),
    3: emptyPosition(),
    4: emptyPosition(),
    5: emptyPosition(),
    6: emptyPosition(),
    7: emptyPosition(),
    8: emptyPosition(),
    9: emptyPosition(),
  },
  table: initTable(),
  cards: [],
})

export async function getServerSideProps(context) {
  const { token } = context.req.cookies;
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}

const clone = (value) => value === undefined ? undefined : JSON.parse(JSON.stringify(value))

const getPlayerPosition = (state, userName) => Object.keys(state.position).find((p) => state.position[p].user?.userName === userName)

const getPlayingPositions = (state) => Object.keys(state.position)
  .filter((p) => state.position[p].user && state.position[p].isPlaying)

const findNextPosition = (state, position) => {
  const positions = Object.keys(state.position)
  let next = +position
  let guard = 0
  do {
    next += 1
    if (next > positions.length) next = 1
    guard += 1
    if (state.position[next]?.isPlaying) return `${next}`
  } while (guard <= positions.length)
  return `${position}`
}

const resetLatestActions = (state) => {
  Object.keys(state.position).forEach((p) => {
    if (state.position[p].user) {
      state.position[p].action = ''
    }
  })
}

const setupBlinds = (state) => {
  const dealerPosition = Object.keys(state.position).find((p) => state.position[p].namePos === 'D')
  if (!dealerPosition) return
  const smallBlind = Number(state.setting?.smallBlind || 0)
  const smallBlindPosition = findNextPosition(state, dealerPosition)
  const bigBlindPosition = findNextPosition(state, smallBlindPosition)

  const applyBlind = (position, amount) => {
    const pos = state.position[position]
    if (!pos?.user || !amount) return
    const spend = Math.min(amount, Number(pos.user.accBalance || 0))
    pos.betBalance = spend
    pos.user.accBalance = Math.max(Number(pos.user.accBalance || 0) - spend, 0)
  }

  applyBlind(smallBlindPosition, smallBlind)
  applyBlind(bigBlindPosition, smallBlind * 2)
  state.table.currentBet = smallBlind * 2
}

const collectRoundPot = (state) => {
  const positions = getPlayingPositions(state)
  const roundTotal = positions.reduce((sum, p) => sum + Number(state.position[p].betBalance || 0), 0)
  if (roundTotal) {
    state.table.pot = [{ users: [], balance: (state.table.pot?.[0]?.balance || 0) + roundTotal, isHavePlayerAllIn: false }]
  }
  positions.forEach((p) => {
    state.position[p].betBalance = 0
  })
  state.table.currentBet = 0
  resetLatestActions(state)
}

const revealNextStreet = (state, result) => {
  if (!state.table.flop && result?.table?.flop) {
    state.table.flop = clone(result.table.flop)
    return
  }
  if (!state.table.turn && result?.table?.turn) {
    state.table.turn = result.table.turn
    return
  }
  if (!state.table.river && result?.table?.river) {
    state.table.river = result.table.river
  }
}

const settleAfterAction = (state, action, result) => {
  const next = clone(state)
  const canStillAct = getPlayingPositions(next).some((p) => {
    const player = next.position[p]
    return !player.isFold
      && Number(player.user?.accBalance || 0) > 0
      && (!player.action || Number(player.betBalance || 0) < Number(next.table.currentBet || 0))
  })

  const isActionEndingRound = !canStillAct

  if (isActionEndingRound) {
    collectRoundPot(next)
    revealNextStreet(next, result)
  }

  return next
}

const isRoundComplete = (state) => {
  const canStillAct = getPlayingPositions(state).some((p) => {
    const pos = state.position[p]
    return !pos.isFold
      && Number(pos.user?.accBalance || 0) > 0
      && (!pos.action || Number(pos.betBalance || 0) < Number(state.table.currentBet || 0))
  })
  return !canStillAct
}

const applyAction = (state, action) => {
  const next = clone(state)
  const position = getPlayerPosition(next, action.user)
  if (!position) return next

  const pos = next.position[position]
  const amount = Number(action.amount || 0)
  const kind = action.action

  pos.action = kind
  pos.isThinking = false

  if (kind === 'fold') {
    pos.isFold = true
    return next
  }

  if (kind === 'check') {
    return next
  }

  if (kind === 'call' || kind === 'bet' || kind === 'raise' || kind === 'all-in') {
    const spend = Math.min(amount, Number(pos.user.accBalance || 0))
    pos.user.accBalance = Math.max(Number(pos.user.accBalance || 0) - spend, 0)
    if (kind === 'raise') {
      pos.betBalance = Number(next.table.currentBet || 0) + spend
    } else {
      pos.betBalance = Number(pos.betBalance || 0) + spend
    }
    if (pos.betBalance > next.table.currentBet) {
      next.table.currentBet = pos.betBalance
    }
    return next
  }

  return next
}

const getTimelineActionLabel = (state, action, index) => {
  if (action.action === 'raise') {
    return `${index + 1}. ${action.user} raise ${Number(state.table.currentBet || 0) + Number(action.amount || 0)}`
  }
  return `${index + 1}. ${action.user} ${action.action}`
}

const applyResult = (state, result) => {
  const next = clone(state)
  next.dealer = result.dealer
  next.setting = result.setting || next.setting
  next.players = result.players || next.players
  next.cards = result.cards || []
  next.table = clone(result.table || next.table)
  Object.keys(next.position).forEach((p) => {
    next.position[p] = clone(result.position?.[p] || next.position[p] || emptyPosition())
  })
  return next
}

const buildInitialState = (result) => {
  const state = initReplay()
  state.dealer = result?.dealer
  state.setting = result?.setting || state.setting
  state.players = clone(result?.players || [])
  state.cards = clone(result?.cards || [])
  state.table.start = !!result?.table?.start
  state.table.preFlop = !!result?.table?.preFlop
  state.table.finish = false
  state.table.firstActionPlayer = result?.table?.firstActionPlayer
  state.table.currentBet = 0
  state.table.pot = [{ users: [], balance: 0, isHavePlayerAllIn: false }]
  state.table.actions = []

  Object.keys(state.position).forEach((pos) => {
    const source = result?.position?.[pos]
    if (source?.user) {
      state.position[pos] = {
        ...emptyPosition(),
        user: {
          ...clone(source.user),
          accBalance: source.user.startBalance ?? source.user.accBalance ?? 0,
        },
        namePos: source.namePos,
        cards: clone(source.cards || []),
        isPlaying: source.isPlaying,
      }
    }
  })
  setupBlinds(state)

  return state
}

const buildTimeline = (payload) => {
  const result = payload?.data || payload || {}
  const actions = result?.table?.actions || []
  const base = buildInitialState(result)
  const steps = [{ label: 'Bắt đầu', state: base, isFinal: false }]
  let current = clone(base)

  actions.forEach((action, index) => {
    const prev = clone(current)
    current = applyAction(current, action)
    steps.push({
      label: getTimelineActionLabel(prev, action, index),
      state: clone(current),
      isFinal: false,
    })

    const settled = settleAfterAction(current, action, result)
    const changed = JSON.stringify(settled) !== JSON.stringify(current)
    if (changed) {
      current = settled
      if (result?.table?.finish && index === actions.length - 1) {
        steps.push({
          label: 'Sau all-in',
          state: clone(current),
          isFinal: false,
        })
      }
    }
  })

  if (result?.table?.finish) {
    const finished = applyResult(current, result)
    steps.push({ label: 'Kết thúc', state: finished, isFinal: true })
  }

  return steps
}

export default function GameHistoryDetailPage() {
  const router = useRouter()
  const { poker_log_id } = router.query
  const { addToast } = useToasts()
  const [loading, setLoading] = useState(true)
  const [gameLog, setGameLog] = useState(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!poker_log_id) return
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await api.getPokerLog(poker_log_id)
        setGameLog(res.data.data)
        setStep(0)
      } catch (err) {
        addToast(err?.response?.data?.error || 'Không tải được game detail', { appearance: 'error' })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [poker_log_id])

  const timeline = useMemo(() => buildTimeline(gameLog), [gameLog])
  const currentStep = timeline[step]
  const current = currentStep?.state || initReplay()
  const canGoPrev = step > 0
  const canGoNext = step < timeline.length - 1
  const prevButtonClassName = canGoPrev
    ? 'bg-white text-black'
    : 'bg-slate-200 text-slate-400 md:bg-white/10 md:text-white/30'
  const nextButtonClassName = canGoNext
    ? 'bg-white text-black'
    : 'bg-slate-200 text-slate-400 md:bg-white/10 md:text-white/30'

  const currentCards = [
    ...(current.table.flop || []),
    current.table.turn,
    current.table.river,
  ].filter(Boolean)

  return (
    <div className="bg-[#c8d3c8] text-white md:min-h-screen md:bg-green-900/90">
      <Head>
        <title>Game detail - V-Poker</title>
      </Head>

      <div className="mx-auto flex w-full max-w-7xl flex-col px-3 py-3 sm:px-4 md:min-h-screen">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Link href="/report" className="rounded-xl bg-green-900/10 px-4 py-2 text-sm font-semibold text-green-950 md:bg-white/10 md:text-white">
            Quay lại
          </Link>
          <div className="text-right">
            <div className="text-lg font-black text-green-950 md:text-white">Chi tiết game #{poker_log_id}</div>
            <div className="text-xs text-green-900/70 md:text-white/70">{gameLog?.created_at || ''}</div>
          </div>
        </div>

        {loading && (
          <div className="mx-auto w-full max-w-[1400px] rounded-2xl border border-white/20 bg-white/55 p-8 text-center text-slate-700 backdrop-blur-sm md:border-white/10 md:bg-black/30 md:text-white/70">
            Đang tải game...
          </div>
        )}

        {!loading && !gameLog && (
          <div className="mx-auto w-full max-w-[1400px] rounded-2xl border border-white/20 bg-white/55 p-8 text-center text-slate-700 backdrop-blur-sm md:border-white/10 md:bg-black/30 md:text-white/70">
            Không tìm thấy dữ liệu game
          </div>
        )}

        {!!gameLog && (
        <div className="relative mx-auto w-full max-w-[1400px] flex-none overflow-hidden rounded-3xl border border-white/20 bg-white/55 shadow-2xl shadow-black/10 backdrop-blur-sm md:bg-green-950/40">
          <div className="relative aspect-[1/1.55] w-full overflow-hidden rounded-3xl bg-green-700 sm:aspect-[1.35/1] md:aspect-[2/1] xl:aspect-[2.15/1]">
            <div className="absolute inset-x-12 bottom-24 top-24 overflow-visible rounded-[2rem] border-2 border-emerald-500/30 bg-green-700 sm:inset-x-14 sm:bottom-16 sm:top-16 md:inset-x-12 md:bottom-10 md:top-10 lg:inset-x-16 lg:bottom-14 lg:top-14">
              <div className="absolute inset-0 overflow-visible">
                {Object.keys(current.position || {}).map((position) => (
                  <Position
                    key={position}
                    pos={position}
                    namePos={current.position[position].namePos}
                    userName={current.position[position]?.user?.userName}
                    balance={current.position[position]?.user?.accBalance}
                    bet={current.position[position]?.betBalance}
                    cards={current.position[position]?.cards}
                    isThinking={current.position[position]?.isThinking}
                    isFold={current.position[position]?.isFold}
                    isPlaying={current.position[position]?.isPlaying}
                    winBalance={current.position[position]?.winBalance}
                    start={current.table.start}
                    isHiddenCard={false}
                    result={current.position[position]?.resultCard?.name}
                    action={currentStep?.isFinal ? '' : current.position[position]?.action}
                    onEditClick={() => {}}
                    onAddClick={() => {}}
                    hideCard={() => {}}
                  />
                ))}

                <div className="absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2">
                  <Pot
                    pot={current.table.pot}
                    cards={currentCards}
                    start={current.table.start}
                    finish={current.table.finish}
                    hideTipDealer
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {!!gameLog && (
        <div className="mx-auto mt-4 w-full max-w-[1400px] rounded-2xl border border-white/20 bg-white/80 p-3 text-slate-900 backdrop-blur-sm md:border-white/10 md:bg-black/30 md:text-white">
          <div className="mb-3 flex items-center justify-between text-sm text-slate-600 md:text-white/70">
            <span>{step}/{Math.max(timeline.length - 1, 0)}</span>
            <span>{timeline[step]?.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canGoPrev}
              onClick={() => setStep((value) => Math.max(value - 1, 0))}
              className={`h-10 min-w-10 rounded-xl text-lg font-black ${prevButtonClassName}`}
            >
              {'<'}
            </button>
            <div className="flex flex-1 gap-2 overflow-x-auto">
              {timeline.map((item, index) => (
                <button
                  key={`${item.label}-${index}`}
                  onClick={() => setStep(index)}
                  className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs font-bold ${index === step ? 'bg-white text-black' : 'bg-slate-200 text-slate-700 md:bg-white/10 md:text-white/80'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => setStep((value) => Math.min(value + 1, timeline.length - 1))}
              className={`h-10 min-w-10 rounded-xl text-lg font-black ${nextButtonClassName}`}
            >
              {'>'}
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
