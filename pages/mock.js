import { useMemo, useState } from 'react'
import Head from 'next/head'

import MenuSide from '../components/menuSide'
import Game from '../components/game'
import TopMenu from '../components/topMenu'
import normalFull2Data from '../mocks/normalFull2Data.json'
import { transformPosition } from '../utils'

const rawData = normalFull2Data

export default function MockPage() {
  const [mode, setMode] = useState('playing')
  const [json, setJson] = useState(() => JSON.stringify(rawData, null, 2))
  const [error, setError] = useState('')
  const user = {
    userName: 'manhhuy01',
    accBalance: 50,
  }
  const data = useMemo(() => {
    try {
      setError('')
      const raw = JSON.parse(json)
      const user = raw.players?.[0] || {}
      const position = transformPosition(user.userName, raw.position)
      const players = (raw.players || []).map((player) => ({ ...player, isDealer: player.userName === raw.dealer }))
      const key = Object.keys(position || {}).find((p) => position[p].user?.userName === user.userName)
      return { ...raw, players, position, user: { ...user, ...position[key]?.user, isDealer: user.userName === raw.dealer, position: position[key] } }
    } catch (err) { setError(err.message); return rawData }
  }, [json, mode])
  const noop = () => {}
  return (
   <div>
      <Head>
        <title>V-Poker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative">
        <MenuSide
          data={data}
          onEditClick={noop}
          isOpen={false}
          onClose={noop}
        />

        <div className="flex w-screen h-dvh">
          <div className="relative w-full h-dvh">
            <TopMenu
              data={data}
              user={user}
              onLobbyClick={noop}
              onChatOpen={noop}
            />
            <Game
              data={data}
              user={user}
              onEditClick={noop}
              onAddClick={noop}
              onChatOpen={noop}
              messages={[]}
              countChat={0}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

