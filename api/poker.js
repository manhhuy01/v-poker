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



