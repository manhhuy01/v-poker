import { useEffect, useState } from 'react'
import Head from 'next/head'
import * as api from '../api/poker'
import * as socket from '../api/socket'
import MenuSide from '../components/menuSide'
import Game from '../components/game'

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
    const user = await (await api.getInfo(token)).json();
    return {
      props: { user, token },
    }
  } catch {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }


}

export default function Home({ user, token }) {
  const [data, setData] = useState({});
  useEffect(() => {
    if (user) {
      socket.initiateSocket({ token });
    }
    socket.subscribeToGetData((err, roomInfo) => {
      if (err) {
        alert(err)
      }

      let normalizeData = {
        ...roomInfo,
        players: roomInfo.players.map((userName) => ({
          userName,
          isDealer: userName === roomInfo.dealer,
        }))
      }
      setData(normalizeData);
    })


    return () => {
      // socket.disconnectSocket();
    }
  }, [user]);
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <MenuSide
          data={data}
          user={user}
        />
        <Game
          data={data}
          user={user}
        />
      </main>
    </div>
  )
}
