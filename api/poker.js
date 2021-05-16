const API = process.env.NEXT_PUBLIC_API

import axios from 'axios'

const instance = axios.create({
  baseURL: API,
  withCredentials: true,
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
export const joinTable = ({ userName, position }) => instance.post('/game/joinTable', { userName, position })
export const removeFromTable = ({ userName }) => instance.post('/game/removeFromTable', { userName })
export const transferDealerRole = ({ userName }) => instance.post('/game/transferDealerRole', { userName })
export const setDealerPosition = ({ userName }) => instance.post('/game/setDealerPosition', { userName })



