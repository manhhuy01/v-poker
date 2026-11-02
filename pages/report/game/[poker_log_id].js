import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useToasts } from 'react-toast-notifications'
import * as api from '../../../api/poker'
import ReplayView from '../../../components/poker/replayView'

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

  useEffect(() => {
    if (!poker_log_id) return
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await api.getPokerLog(poker_log_id)
        setGameLog(res.data.data)
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

  return (
    <>
      <Head>
        <title>Game detail - V-Poker</title>
      </Head>
      <ReplayView
        gameLog={gameLog}
        loading={loading}
        id={poker_log_id}
        returnTo={returnTo}
      />
    </>
  )
}
