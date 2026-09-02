import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useToasts } from 'react-toast-notifications'
import * as api from '../../../api/poker'
import Position from '../../../components/materials/position'
import Pot from '../../../components/materials/pot'
import { normalizeData } from '../../../utils/normalizeGame'

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

export default function GameHistoryDetailPage() {
  const router = useRouter()
  const { poker_log_id } = router.query
  const returnTo = typeof router.query.returnTo === 'string' ? router.query.returnTo : '/report'
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
        if (err?.response?.data?.code === 'POKER_LOG_NOT_AVAILABLE_YET') {
          addToast('Game này chưa mở xem được. Vui lòng quay lại sau 1 giờ kể từ lúc tạo.', { appearance: 'warning' })
        } else {
          addToast(err?.response?.data?.error || 'Không tải được game detail', { appearance: 'error' })
        }
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
          <Link href={returnTo} className="rounded-xl bg-green-900/10 px-4 py-2 text-sm font-semibold text-green-950 md:bg-white/10 md:text-white">
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

                <div className="flex justify-center absolute left-1/2 top-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 md:w-2/3">
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
