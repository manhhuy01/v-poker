import { useEffect, useState } from 'react'
import Head from 'next/head'
import * as api from '../api/poker'
import * as socket from '../api/socket'

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

export default function Home({ user }) {
  const [data, setData] = useState({});
  useEffect(() => {
    if (user) {
      socket.initiateSocket({ user });
    }
    socket.subscribeToGetData((err, roomInfo) => {
      if (err) {
        alert(err)
      }
      setData(roomInfo);
    })


    return () => {
      socket.disconnectSocket();
    }
  }, [user]);
  console.log(data)
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>Hello</div>
        {!!user && user.userName}
        {data?.players?.length}
      </main>
    </div>
  )
}
