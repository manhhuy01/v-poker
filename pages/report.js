import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useToasts } from 'react-toast-notifications'
import * as api from '../api/poker'
import Loading from '../components/loading'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine
} from 'recharts';

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
  const [limit, setLimit] = useState(100)

  const [summaryLoaded, setSummaryLoaded] = useState(false)
  const [logsCache, setLogsCache] = useState({})
  const [viewingUser, setViewingUser] = useState(user.userName)
  const [chartData, setChartData] = useState([])
  const [rangeStart, setRangeStart] = useState(0)
  const [rangeEnd, setRangeEnd] = useState(0)
  const [selectionPhase, setSelectionPhase] = useState('none') // none, start, both

  useEffect(() => {
    if (activeTab === 'summary') {
      if (!summaryLoaded) fetchSummary()
    } else {
      const cacheKey = `${viewingUser}-${days}-${page}-${limit}`
      if (logsCache[cacheKey]) {
        setGameLogs(logsCache[cacheKey])
        updateChartData(logsCache[cacheKey])
      } else {
        fetchGameLogs(cacheKey)
      }
    }
  }, [activeTab, days, page, viewingUser, limit])

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

  const updateChartData = (data) => {
    let cumulative = 0;
    const processed = [...data].reverse().map((log, index) => {
      const amount = Number(log.amount || 0);
      if (log.type === 'win') cumulative += amount;
      else if (log.type === 'lose') cumulative -= amount;
      return {
        ...log,
        game: index + 1,
        profit: cumulative,
        time: new Date(log.created_at).toLocaleTimeString()
      }
    });
    const finalData = [{ game: 0, profit: 0, time: '', id: 0 }, ...processed];
    setChartData(finalData);
    setRangeStart(0);
    setRangeEnd(finalData[finalData.length - 1].id);
    setSelectionPhase('none');
  }

  const fetchGameLogs = async (cacheKey) => {
    setLoading(true)
    try {
      const res = await api.getGameLogs(viewingUser, { days, page, limit })
      const data = res.data.data || []
      setGameLogs(data)
      setLogsCache(prev => ({ ...prev, [cacheKey]: data }))
      updateChartData(data)
    } catch (err) {
      addToast('Không thể tải lịch sử chơi', { appearance: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const onResetBalanceAll = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn reset số dư của TẤT CẢ người chơi về 0?')) return
    setLoading(true)
    try {
      await api.resetBalanceAllPlayers()
      addToast('Reset số dư thành công', { appearance: 'success' })
      fetchSummary()
    } catch (err) {
      addToast(err?.response?.data?.error || 'Reset số dư thất bại', { appearance: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const copyReport = () => {
    if (summaryData.length === 0) return
    const reportText = summaryData.map(item => {
      const profit = Number(item.currentBalance || 0) + Number(item.totalWithdraw || 0) - Number(item.totalDeposit || 0);
      return `${item.username}: ${profit}`;
    }).join('\n');
    
    navigator.clipboard.writeText(reportText).then(() => {
      addToast('Đã copy báo cáo vào clipboard', { appearance: 'success' });
    }).catch(err => {
      addToast('Không thể copy báo cáo', { appearance: 'error' });
    });
  }

  const totalPL = summaryData.reduce((acc, item) => acc + (Number(item.currentBalance || 0) + Number(item.totalWithdraw || 0) - Number(item.totalDeposit || 0)), 0);
  const totalDeposit = summaryData.reduce((acc, item) => acc + Number(item.totalDeposit || 0), 0);
  const totalWithdraw = summaryData.reduce((acc, item) => acc + Number(item.totalWithdraw || 0), 0);
  const totalBalance = summaryData.reduce((acc, item) => acc + Number(item.currentBalance || 0), 0);
  const totalGames = summaryData.reduce((acc, item) => acc + Number(item.totalGame || 0), 0);

  // Calculate display chart data based on selected range
  const sIdx = chartData.findIndex(d => d.id === rangeStart);
  const eIdx = chartData.findIndex(d => d.id === rangeEnd);
  const start = sIdx === -1 ? 0 : Math.min(sIdx, eIdx);
  const end = eIdx === -1 ? (chartData.length > 0 ? chartData.length - 1 : 0) : Math.max(sIdx, eIdx);
  const displayChartData = chartData.length > 0 ? chartData.slice(start, end + 1).map((d, i, arr) => ({
    ...d,
    profit: d.profit - arr[0].profit, // Re-base to 0 for the selected segment
    displayGame: i
  })) : [];

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
          <TabButton active={activeTab === 'logs'} onClick={() => { setViewingUser(user.userName); setPage(1); setActiveTab('logs'); }}>
            Lịch sử của tôi
          </TabButton>
        </div>

        {activeTab === 'summary' ? (
          <div className="space-y-6">
            <div className="flex justify-end space-x-3">
              <button 
                onClick={copyReport}
                className="flex items-center space-x-2 px-5 py-2.5 bg-white text-gray-700 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all border border-gray-100 shadow-sm transition-all active:scale-95"
              >
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>Copy Report</span>
              </button>
              <button 
                onClick={onResetBalanceAll}
                className="flex items-center space-x-2 px-5 py-2.5 bg-rose-50 text-rose-600 rounded-2xl font-bold text-sm hover:bg-rose-100 transition-all border border-rose-100 shadow-sm transition-all active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset Balance</span>
              </button>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/50">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-6">Thành viên</th>
                      <th className="px-6 py-6 text-center">Lợi nhuận (P/L)</th>
                      <th className="px-6 py-6 text-center">Nạp tiền</th>
                      <th className="px-6 py-6 text-center">Rút tiền</th>
                      <th className="px-6 py-6 text-center">Số dư</th>
                      <th className="px-6 py-6 text-right pr-10">Hoạt động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/50">
                    {summaryData.map((item, idx) => {
                      const profit = Number(item.currentBalance || 0) + Number(item.totalWithdraw || 0) - Number(item.totalDeposit || 0);
                      return (
                        <tr key={idx} className="hover:bg-indigo-50/20 transition-all duration-300 group">
                          <td className="px-8 py-6">
                            <div
                              className="flex items-center space-x-3 cursor-pointer group/name"
                              onClick={() => { setViewingUser(item.username); setPage(1); setActiveTab('logs'); }}
                            >
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-200 uppercase group-hover/name:scale-110 transition-transform">
                                {item.username.substring(0, 2)}
                              </div>
                              <span className="font-bold text-gray-700 group-hover/name:text-indigo-600 transition-colors tracking-tight border-b border-transparent group-hover/name:border-indigo-400">
                                {item.username}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-center">
                            <div className={`inline-flex items-center px-6 py-2.5 rounded-2xl text-sm font-black shadow-lg transition-all duration-300 group-hover:shadow-indigo-200/50 ${profit > 0 ? 'text-green-500' : 'text-rose-500'}`}>
                              {profit > 0 ? '+' : ''}{profit.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-6 text-center">
                            <span className="inline-flex px-4 py-2 rounded-2xl text-sm font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                              {Number(item.totalDeposit).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-6 text-center">
                            <span className="inline-flex px-4 py-2 rounded-2xl text-sm font-bold bg-rose-50 text-rose-600 border border-rose-100/50">
                              {Number(item.totalWithdraw).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-6 text-center">
                            <span className="inline-flex px-4 py-2 rounded-2xl text-sm font-black bg-gray-900 text-white shadow-lg shadow-gray-300">
                              {Number(item.currentBalance).toLocaleString()}
                            </span>
                          </td>

                          <td className="px-6 py-6 text-right pr-10">
                            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                              {item.totalGame} ván
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {summaryData.length > 0 && (
                      <tr className="bg-gray-900 text-white font-black uppercase">
                        <td className="px-8 py-6 text-xs tracking-widest italic">TỔNG CỘNG</td>
                        <td className="px-6 py-6 text-center">
                          <div className={`inline-flex items-center px-6 py-2.5 rounded-2xl text-sm font-black shadow-lg ${totalPL >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                            {totalPL > 0 ? '+' : ''}{totalPL.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center text-emerald-400 text-sm">
                          {totalDeposit.toLocaleString()}
                        </td>
                        <td className="px-6 py-6 text-center text-rose-400 text-sm">
                          {totalWithdraw.toLocaleString()}
                        </td>
                        <td className="px-6 py-6 text-center text-indigo-400 text-sm">
                          {totalBalance.toLocaleString()}
                        </td>
                        <td className="px-6 py-6 text-right pr-10">
                          <span className="text-[10px] opacity-60">
                            {totalGames} ván
                          </span>
                        </td>
                      </tr>
                    )}
                    {summaryData.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-8 py-20 text-center text-gray-400 font-medium">
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
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center space-x-4">
                {viewingUser !== user.userName && (
                  <button
                    onClick={() => { setViewingUser(user.userName); setPage(1); }}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors border border-indigo-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Lịch sử của tôi</span>
                  </button>
                )}
                <div className="bg-white px-5 py-2.5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-[10px] uppercase">
                    {viewingUser.substring(0, 2)}
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-tight block leading-none mb-1">Đang xem lịch sử của</span>
                    <span className="text-sm font-black text-gray-900 leading-none">{viewingUser}</span>
                  </div>
                </div>
              </div>

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
                <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                   <span className="text-[10px] font-black text-gray-400 uppercase">Giới hạn:</span>
                   <select 
                    value={limit}
                    onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                    className="bg-transparent text-sm font-bold text-gray-700 outline-none"
                   >
                     <option value={100}>100</option>
                     <option value={500}>500</option>
                   </select>
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
            </div>

            {/* Chart Section */}
            {chartData.length > 1 && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Biểu đồ lợi nhuận</h3>
                    <p className="text-[10px] text-gray-500 font-bold">Thống kê biến động số dư theo ván đấu</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Phạm vi:</span>
                        <span className="text-xs font-bold text-gray-700">
                          {selectionPhase === 'none' ? 'Toàn bộ' : selectionPhase === 'start' ? `Từ #${rangeStart}...` : `Từ #${rangeStart} đến #${rangeEnd}`}
                        </span>
                      </div>
                    </div>
                    {selectionPhase !== 'none' && (
                      <button 
                        onClick={() => {
                          setRangeStart(chartData[0].id);
                          setRangeEnd(chartData[chartData.length - 1].id);
                          setSelectionPhase('none');
                        }}
                        className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors border border-rose-100 shadow-sm group"
                        title="Reset phạm vi"
                      >
                        <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={displayChartData}>
                      <defs>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis 
                        dataKey="game" 
                        stroke="#94a3b8" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        label={{ value: 'Ván đấu', position: 'insideBottomRight', offset: -5, fontSize: 10, fontWeight: 'bold' }}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => value.toLocaleString()}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#111827', 
                          border: 'none', 
                          borderRadius: '12px', 
                          color: '#fff',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value) => [value.toLocaleString() + ' CHIPS', 'Lợi nhuận']}
                      />
                      <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="3 3" />
                      <Area 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#6366f1" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorProfit)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

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
                    {gameLogs.map((log) => {
                      const startIdx = chartData.findIndex(d => d.id === rangeStart);
                      const endIdx = chartData.findIndex(d => d.id === rangeEnd);
                      const currentIdx = chartData.findIndex(d => d.id === log.id);
                      const isSelected = selectionPhase !== 'none' && currentIdx >= Math.min(startIdx, endIdx) && currentIdx <= Math.max(startIdx, endIdx);
                      const isBoundary = log.id === rangeStart || log.id === rangeEnd;

                      const onRowClick = () => {
                        if (selectionPhase === 'none' || selectionPhase === 'both') {
                          setRangeStart(log.id);
                          setRangeEnd(log.id);
                          setSelectionPhase('start');
                        } else if (selectionPhase === 'start') {
                          if (currentIdx < startIdx) {
                            // Selected a point before the start, make it the new start
                            setRangeStart(log.id);
                            setRangeEnd(log.id);
                          } else {
                            setRangeEnd(log.id);
                            setSelectionPhase('both');
                          }
                        }
                      };

                      return (
                        <tr 
                          key={log.id} 
                          onClick={onRowClick}
                          className={`hover:bg-blue-50/50 transition-all cursor-pointer group relative ${
                            isSelected ? 'bg-indigo-50/40 text-indigo-900 font-bold' : ''
                          } ${isBoundary ? 'ring-2 ring-inset ring-indigo-500/30' : ''}`}
                        >
                          <td className="px-8 py-5 relative">
                            {isBoundary && (
                              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${log.id === rangeStart ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
                            )}
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
                            {log.type === 'win' ? '+' : '-'}{log.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right font-mono font-bold text-gray-900 relative">
                          <div className="absolute inset-0 bg-gray-50/50 -z-10 group-hover:bg-blue-50/50 transition-colors"></div>
                          {log.balance_after.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                    {gameLogs.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-8 py-20 text-center text-gray-400 font-medium">
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
