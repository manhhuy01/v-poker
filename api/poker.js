const API = process.env.NEXT_PUBLIC_API
export const register = ({ userName, password }) => fetch(`${API}/register`, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  },
  body: JSON.stringify({
    userName,
    password
  })
})

export const getInfo = (token) => fetch(`${API}/acc/info?token=${token}`);

export const login = ({ userName, password }) => fetch(`${API}/login`, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  },
  body: JSON.stringify({
    userName,
    password
  })
})
