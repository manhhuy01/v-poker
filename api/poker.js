const API = process.env.NEXT_PUBLIC_API


import cookie from 'cookie-cutter'
import axios from 'axios'
axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: API,
  withCredentials: true,
});

instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  if(typeof window !== 'undefined'){
    config.headers['token'] = cookie.get('token')
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


export const register = ({ userName, password }) => instance.post(`/register`, {
  userName,
  password
})


export const getInfo = (token) => instance.get(`/acc/info?token=${token}`);

export const login = ({ userName, password }) => instance.post(`/login`, {
  userName,
  password
})

export const updateSetting = (setting) => instance.post('/game/updateSetting', setting)

export const updateProfile = ({ userName, accBalance }) => instance.post('/game/updateProfile', { userName, accBalance })
export const joinTable = ({ userName, position }) => axios.post(`/game/joinTable`, { userName, position })
export const removeFromTable = ({ userName }) => instance.post('/game/removeFromTable', { userName })
export const transferDealerRole = ({ userName }) => instance.post('/game/transferDealerRole', { userName })
export const setDealerPosition = ({ userName }) => instance.post('/game/setDealerPosition', { userName })



