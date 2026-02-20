const API = process.env.NEXT_PUBLIC_API


import cookie from 'cookie-cutter'
import axios from 'axios'
axios.defaults.withCredentials = true;

axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  if (typeof window !== 'undefined') {
    config.headers['token'] = cookie.get('token')
  }
  config.baseURL = API;
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


export const register = ({ userName, password }) => axios.post(`/register`, {
  userName,
  password
})


export const getInfo = (token) => axios.get(`/acc/info?token=${token}`);

export const login = ({ userName, password }) => axios.post(`/login`, {
  userName,
  password
})

export const updateSetting = (setting) => axios.post('/game/updateSetting', setting)

export const updateProfile = ({ userName, accBalance }) => axios.post('/game/updateProfile', { userName, accBalance })
export const joinTable = ({ userName, position }) => axios.post(`/game/joinTable`, { userName, position })
export const removeFromTable = ({ userName }) => axios.post('/game/removeFromTable', { userName })
export const transferDealerRole = ({ userName }) => axios.post('/game/transferDealerRole', { userName })
export const setDealerPosition = ({ userName }) => axios.post('/game/setDealerPosition', { userName })
export const forceFold = ({ userName }) => axios.post('/game/fold', { userName })
export const startGame = () => axios.post('/game/start');
export const shuffleCards = () => axios.post('/game/shuffleCards');
export const preFlop = () => axios.post('/game/preFlop');
export const reset = () => axios.post('/game/reset');
export const showAllCards = () => axios.post('/game/showAllCards');
export const resetBalanceAllPlayers = () => axios.post('/game/resetBalanceAllPlayers');
export const playerAction = ({ type, betBalance, isAllIn }) => axios.post('/player/action', { type, betBalance, isAllIn})
export const playerTipDealer = ({ tip }) => axios.post('/player/tip', { tip })

export const getReportSummary = () => axios.get('/report/summary')
export const getGameLogs = (userName, { days, page, limit }) => axios.get(`/report/game-logs/${userName}?days=${days}&page=${page}&limit=${limit}`)



