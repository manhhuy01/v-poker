import Head from 'next/head'
import { useRef, useState } from 'react'
import { useToasts } from 'react-toast-notifications'

import * as api from '../api/poker'
import cookie from 'cookie-cutter'


export default function Login() {
  const { addToast } = useToasts()

  const userEl = useRef(null);
  const passwordEl = useRef(null);

  const [loading, setLoading] = useState(false)
  const login = async (e) => {
    e.preventDefault();

    const userName = userEl.current.value.trim().toLowerCase();
    const password = passwordEl.current.value.trim();
    
    if (!userName || !password) {
      return addToast('Coi kĩ lại bạn ơi', { appearance: 'info'})
    }

    if(!/^([0-9,a-z])*$/.test(userName)){
      return addToast('user name có kí tự đặc biệt', { appearance: 'error'})
    }

    setLoading(true)
    try {
      let { data } = await api.login({ userName, password });
      setLoading(false)
      if (data.error) {
        addToast(data.error, { appearance: 'error'})
      } else {
        let now = new Date();
        cookie.set('token', data.token, { expires: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) })
        window.location.href = '/'
      }
    } catch (err) {
      addToast(err.response.data.error, { appearance: 'error'})
      console.log(err)
    } finally {
      setLoading(false)
    }


  }
  return (
    <>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-full md:w-1/2 p-4 flex flex-col mb-4 mt-4">
          <p className="block text-center text-2xl font-semibold m-2">Login</p>
          <form name="login" onSubmit={login}>
            <div className="mb-2 mt-2">
              <input className="lowercase block w-full rounded-xl p-2 bg-blue-200 focus:outline-none outline-none" id="username" type="text" placeholder="Username" ref={userEl} />
            </div>
            <div className="mb-2 mt-2">
              <input className="block w-full rounded-xl p-2 bg-blue-200 focus:outline-none outline-none" id="password" type="password" placeholder="Password" ref={passwordEl} />
            </div>
            <div>
              <button
                className="
                w-full bg-blue-500 rounded-xl hover:bg-blue-800 p-2 mt-4 mb-4 text-white font-bold outline-none border-none focus:outline-none
                flex flex-row justify-center
                "
                type="submit"
                onClick={login}
              >
                {
                  loading && (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>)
                }

              Login

            </button>
            </div>
          </form>

          <a href="/register" className="block text-center m-2 italic text-blue-400">Register</a>
        </div>
      </div>
    </>

  )
}