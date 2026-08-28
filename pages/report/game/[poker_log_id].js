import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useToasts } from 'react-toast-notifications'
import * as api from '../../../api/poker'
import Position from '../../../components/materials/position'
import Pot from '../../../components/materials/pot'

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

const normalizeData = (payload) => {
  const result = payload?.data || payload || {}
  if (!result?.table) return { steps: [], setting: { smallBlind: 1 }, dealer: undefined, players: [] }

  const actions = result.table.actions || []
  const setting = result.setting || { smallBlind: 1 }
  const dealer = result.dealer

  const players = (result.players || []).map((p) => ({
    userName: p.userName,
    startBalance: p.startBalance ?? p.accBalance ?? 0,
    finalBalance: p.accBalance ?? 0,
  }))

  const buildStepPositions = (posState) => {
    const out = {}
    for (let i = 1; i <= 9; i++) {
      const s = posState[i]
      if (!s) {
        out[i] = {
          user: undefined, betBalance: 0, chips: 0, isFold: false,
          namePos: '', cards: [], isPlaying: false, winBalance: 0,
          action: '', resultCard: null,
        }
        continue
      }
      const shouldHideCards = s.isFold && s.action !== 'fold'
      out[i] = {
        user: s.user ? { userName: s.user.userName } : undefined,
        betBalance: s.betBalance || 0,
        chips: s.chips ?? 0,
        isFold: s.isFold || false,
        namePos: s.namePos || '',
        cards: shouldHideCards ? [] : (s.cards || []),
        isPlaying: s.isPlaying || false,
        winBalance: s.winBalance || 0,
        action: s.action || '',
        resultCard: s.resultCard || null,
      }
    }
    return out
  }

  const buildStepTable = (flop, turn, river, currentBet) => ({
    flop: flop || null,
    turn: turn || null,
    river: river || null,
    currentBet: currentBet || 0,
  })

  const isRoundComplete = (posState, currentBet, actedThisRound) => {
    const active = Object.keys(posState).filter((p) => posState[p].user && posState[p].isPlaying)
    const nonFolded = active.filter((p) => !posState[p].isFold)
    if (nonFolded.length === 0) return false
    if (nonFolded.some((p) => !actedThisRound.has(p))) return false
    return nonFolded.every((p) => {
      const pos = posState[p]
      return pos.chips === 0 || pos.betBalance >= currentBet
    })
  }

  const collectBets = (posState, pot) => {
    const active = Object.keys(posState).filter((p) => posState[p].user && posState[p].isPlaying)
    const total = active.reduce((sum, p) => sum + (posState[p].betBalance || 0), 0)
    if (total > 0) {
      pot.balance += total
    }
    active.forEach((p) => {
      posState[p].betBalance = 0
      posState[p].action = ''
    })
  }

  const posState = {}
  for (let i = 1; i <= 9; i++) {
    const src = result.position?.[i]
    if (src?.user) {
      posState[i] = {
        user: { userName: src.user.userName },
        chips: src.user.startBalance ?? src.user.accBalance ?? 0,
        betBalance: src.betBalance || 0,
        isFold: false,
        namePos: src.namePos || '',
        cards: clone(src.cards || []),
        isPlaying: src.isPlaying || false,
        winBalance: 0,
        action: '',
        resultCard: null,
      }
    } else {
      posState[i] = {
        user: undefined, chips: 0, betBalance: 0, isFold: false,
        namePos: '', cards: [], isPlaying: false, winBalance: 0,
        action: '', resultCard: null,
      }
    }
  }

  const pot = { balance: 0 }
  let currentBet = 0

  const dealerPosition = Object.keys(posState).find((p) => posState[p].namePos === 'D')
  if (dealerPosition) {
    let sbPos = +dealerPosition
    for (let g = 0; g < 9; g++) { sbPos = sbPos >= 9 ? 1 : sbPos + 1; if (posState[sbPos]?.isPlaying) break }
    let bbPos = sbPos
    for (let g = 0; g < 9; g++) { bbPos = bbPos >= 9 ? 1 : bbPos + 1; if (posState[bbPos]?.isPlaying) break }

    const sb = Math.min(Number(setting.smallBlind || 0), posState[sbPos]?.chips || 0)
    posState[sbPos].betBalance = sb
    posState[sbPos].chips -= sb

    const bb = Math.min(Number(setting.smallBlind || 0) * 2, posState[bbPos]?.chips || 0)
    posState[bbPos].betBalance = bb
    posState[bbPos].chips -= bb

    currentBet = bb
  }

  const communityCards = { flop: null, turn: null, river: null }
  const steps = []

  const addStep = (label, isFinal = false) => {
    steps.push({
      label,
      positions: buildStepPositions(posState),
      table: buildStepTable(communityCards.flop, communityCards.turn, communityCards.river, currentBet),
      pot: pot.balance > 0 ? [{ users: [], balance: pot.balance, isHavePlayerAllIn: false }] : [],
      isFinal,
    })
  }

  addStep('Bắt đầu')
  addStep('Pre-flop')

  const doReveal = () => {
    if (!pendingReveal) return
    addStep(pendingReveal.label)
    pendingReveal = null
  }

  let pendingReveal = null
  let actedThisRound = new Set()

  actions.forEach((action) => {
    const position = getPlayerPosition({ position: posState }, action.user)
    if (position) {
      const pos = posState[position]
      pos.action = action.action
      actedThisRound.add(position)

      if (action.action === 'fold') {
        pos.isFold = true
      } else if (action.action === 'check') {
        // no chip change
      } else if (action.action === 'call') {
        const spend = Math.min(Number(action.amount || 0), pos.chips)
        pos.chips -= spend
        pos.betBalance += spend
      } else if (action.action === 'bet' || action.action === 'raise' || action.action === 'all-in') {
        const amount = Number(action.amount || 0)
        const spend = Math.min(amount - pos.betBalance, pos.chips)
        pos.chips -= spend
        pos.betBalance = amount
        if (pos.betBalance > currentBet) currentBet = pos.betBalance
      }

    }

    const label = action.action === 'raise'
      ? `${action.user} raise to ${posState[position]?.betBalance || 0}`
      : `${action.user} ${action.action}`

    addStep(label)

    if (action.action === 'fold' && position) {
      posState[position].action = ''
    }

    if (isRoundComplete(posState, currentBet, actedThisRound)) {
      const totalBets = Object.keys(posState)
        .filter((p) => posState[p].user && posState[p].isPlaying)
        .reduce((sum, p) => sum + (posState[p].betBalance || 0), 0)

      if (totalBets > 0) {
        collectBets(posState, pot)
        currentBet = 0

        if (!communityCards.flop && result.table.flop) {
          communityCards.flop = clone(result.table.flop)
          pendingReveal = { label: `Flop - ${(result.table.flop || []).join(' ')}` }
        } else if (!communityCards.turn && result.table.turn) {
          communityCards.turn = result.table.turn
          pendingReveal = { label: `Turn - ${result.table.turn}` }
        } else if (!communityCards.river && result.table.river) {
          communityCards.river = result.table.river
          pendingReveal = { label: `River - ${result.table.river}` }
        }
      }

      actedThisRound = new Set()
      doReveal()
    }
  })

  doReveal()

  if (result.table.finish) {
    for (let i = 1; i <= 9; i++) {
      const src = result.position?.[i]
      if (src?.user && posState[i]) {
        posState[i].winBalance = src.winBalance || 0
        posState[i].resultCard = src.resultCard || null
      }
    }
    addStep('Kết thúc', true)
  }

  return { setting, dealer: dealerPosition, players, steps }
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

  const normalized = useMemo(() => normalizeData(gameLog), [gameLog])
  const steps = normalized.steps
  const currentStep = steps[step]
  const canGoPrev = step > 0
  const canGoNext = step < steps.length - 1
  const prevButtonClassName = canGoPrev
    ? 'bg-white text-black'
    : 'bg-slate-200 text-slate-400 md:bg-white/10 md:text-white/30'
  const nextButtonClassName = canGoNext
    ? 'bg-white text-black'
    : 'bg-slate-200 text-slate-400 md:bg-white/10 md:text-white/30'

  const currentPositions = currentStep?.positions || {}
  const currentTable = currentStep?.table || {}
  const currentPot = currentStep?.pot || []
  const currentCards = [
    ...(currentTable.flop || []),
    currentTable.turn,
    currentTable.river,
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
                {Object.keys(currentPositions).map((position) => (
                  <Position
                    key={position}
                    pos={position}
                    namePos={currentPositions[position].namePos}
                    userName={currentPositions[position]?.user?.userName}
                    balance={currentPositions[position]?.chips}
                    bet={currentPositions[position]?.betBalance}
                    cards={currentPositions[position]?.cards}
                    isThinking={false}
                    isFold={currentPositions[position]?.isFold}
                    isPlaying={currentPositions[position]?.isPlaying}
                    winBalance={currentPositions[position]?.winBalance}
                    start={true}
                    isHiddenCard={false}
                    result={currentPositions[position]?.resultCard?.name}
                    action={currentStep?.isFinal ? '' : currentPositions[position]?.action}
                    onEditClick={() => {}}
                    onAddClick={() => {}}
                    hideCard={() => {}}
                  />
                ))}

                <div className="absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2">
                  <Pot
                    pot={currentPot}
                    cards={currentCards}
                    start={true}
                    finish={currentStep?.isFinal}
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
            <span>{step}/{Math.max(steps.length - 1, 0)}</span>
            <span>{steps[step]?.label}</span>
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
              {steps.map((item, index) => (
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
              onClick={() => setStep((value) => Math.min(value + 1, steps.length - 1))}
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
