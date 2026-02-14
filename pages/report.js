import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useToasts } from 'react-toast-notifications'
import * as api from '../api/poker'
import Loading from '../components/loading'

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
  try {
    const res = await api.getInfo(token);
    return {
      props: { user: res.data, token },
    }
  } catch (err) {
    console.log(err)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
}

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${active
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
      : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 border border-gray-200'
      }`}
  >
    {children}
  </button>
)

export default function Report({ user }) {
  const { addToast } = useToasts()
  const [activeTab, setActiveTab] = useState('summary')
  const [summaryData, setSummaryData] = useState([])
  const [gameLogs, setGameLogs] = useState([])
  const [loading, setLoading] = useState(false)

  // Game logs filters
  const [days, setDays] = useState(7)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  const [summaryLoaded, setSummaryLoaded] = useState(false)
  const [logsCache, setLogsCache] = useState({})

  useEffect(() => {
    if (activeTab === 'summary') {
      if (!summaryLoaded) fetchSummary()
    } else {
      const cacheKey = `${days}-${page}`
      if (logsCache[cacheKey]) {
        setGameLogs(logsCache[cacheKey])
      } else {
        fetchGameLogs(cacheKey)
      }
    }
  }, [activeTab, days, page])

  const fetchSummary = async () => {
    setLoading(true)
    try {
      const res = await api.getReportSummary()
      setSummaryData(res.data.data || [])
      setSummaryLoaded(true)
    } catch (err) {
      addToast('Không thể tải báo cáo tổng hợp', { appearance: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const fetchGameLogs = async (cacheKey) => {
    setLoading(true)
    try {
      const res = await api.getGameLogs(user.userName, { days, page, limit })
      const data = res.data.data || []
      setGameLogs(data)
      setLogsCache(prev => ({ ...prev, [cacheKey]: data }))
    } catch (err) {
      addToast('Không thể tải lịch sử chơi', { appearance: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <Head>
        <title>Report - V-Poker</title>
      </Head>

      {loading && <Loading />}

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-6">
            <Link href="/" className="p-3 bg-white text-gray-600 hover:text-blue-600 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Báo cáo game
              </h1>
              <p className="text-gray-500 text-sm mt-1">Xem thống kê và lịch sử giao dịch</p>
            </div>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Người chơi</p>
            <p className="font-bold text-gray-900">{user.userName}</p>
          </div>
        </div>

        <div className="flex space-x-4 mb-8">
          <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')}>
            Tổng hợp
          </TabButton>
          <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')}>
            Lịch sử của tôi
          </TabButton>
        </div>

        {activeTab === 'summary' ? (
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-6">Thành viên</th>
                    <th className="px-6 py-6 text-center">Nạp tiền</th>
                    <th className="px-6 py-6 text-center">Rút tiền</th>
                    <th className="px-6 py-6 text-center">Số dư</th>
                    <th className="px-6 py-6 text-center">Lợi nhuận (P/L)</th>
                    <th className="px-6 py-6 text-right pr-10">Hoạt động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/50">
                  {summaryData.map((item, idx) => {
                    const profit = Number(item.currentBalance || 0) + Number(item.totalWithdraw || 0) - Number(item.totalDeposit || 0);
                    return (
                      <tr key={idx} className="hover:bg-indigo-50/20 transition-all duration-300 group">
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-200 uppercase">
                              {item.username.substring(0, 2)}
                            </div>
                            <span className="font-bold text-gray-700 group-hover:text-indigo-600 transition-colors tracking-tight">
                              {item.username}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <span className="inline-flex px-4 py-2 rounded-2xl text-sm font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                            {item.totalDeposit}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <span className="inline-flex px-4 py-2 rounded-2xl text-sm font-bold bg-rose-50 text-rose-600 border border-rose-100/50">
                            {item.totalWithdraw}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <span className="inline-flex px-4 py-2 rounded-2xl text-sm font-black bg-gray-900 text-white shadow-lg shadow-gray-300">
                            {item.currentBalance}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <div className={`inline-flex items-center px-6 py-2.5 rounded-2xl text-sm font-black shadow-lg transition-all duration-300 group-hover:shadow-indigo-200/50 ${profit > 0 ? 'text-green-500' : 'text-rose-500'}`}>
                            {profit > 0 ? '+' : ''}{profit}
                          </div>
                        </td>
                        <td className="px-6 py-6 text-right pr-10">
                          <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            {item.totalGame} ván
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {summaryData.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-medium">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Chưa có dữ liệu báo cáo
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex bg-white rounded-xl p-1.5 border border-gray-100 shadow-sm">
                {[
                  { label: '7 ngày', value: 7 },
                  { label: '30 ngày', value: 30 },
                  { label: '1 năm', value: 365 },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setDays(opt.value); setPage(1); }}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${days === opt.value
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'text-gray-500 hover:text-gray-900'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2.5 bg-white text-gray-400 border border-gray-100 rounded-xl shadow-sm disabled:opacity-30 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="px-5 py-2.5 bg-white rounded-xl border border-gray-100 font-bold text-gray-700 shadow-sm">
                  {page}
                </span>
                <button
                  disabled={gameLogs.length < limit}
                  onClick={() => setPage(page + 1)}
                  className="p-2.5 bg-white text-gray-400 border border-gray-100 rounded-xl shadow-sm disabled:opacity-30 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/50">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/80 text-gray-500 uppercase text-xs font-bold tracking-widest border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-5">Mã giao dịch</th>
                      <th className="px-6 py-5">Thời gian</th>
                      <th className="px-6 py-5 text-center">Loại</th>
                      <th className="px-6 py-5 text-right">Số lượng</th>
                      <th className="px-8 py-5 text-right">Số dư sau</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {gameLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-8 py-5">
                          <span className="font-mono text-xs font-bold text-gray-400 group-hover:text-blue-500 transition-colors">
                            #{log.id}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-gray-600 font-medium whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString('vi-VN')}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${log.type === 'win'
                            ? 'text-green-500'
                            : 'text-rose-500'
                            }`}>
                            {log.type}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className={`text-2xl font-black italic tracking-tighter ${log.type === 'win' ? 'text-emerald-500' : 'text-rose-500'
                            }`}>
                            {log.type === 'win' ? '+' : '-'}{log.amount}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right font-mono font-bold text-gray-900 relative">
                          <div className="absolute inset-0 bg-gray-50/50 -z-10 group-hover:bg-blue-50/50 transition-colors"></div>
                          {log.balance_after}
                        </td>
                      </tr>
                    ))}
                    {gameLogs.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-medium">
                          <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Không tìm thấy lịch sử giao dịch
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .shadow-xl {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
        }
      `}</style>
    </div>
  )
}
