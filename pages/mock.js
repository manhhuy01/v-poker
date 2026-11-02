import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import MenuSide from '../components/menuSide'
import GameV1 from '../components/game-v1/game'
import GameV2 from '../components/game'
import TopMenu from '../components/topMenu'
import normalFull2Data from '../mocks/normalFull2Data.json'
import { transformPosition } from '../utils'
import { UI_VERSIONS, UI_VERSION_VALUES } from '../utils/uiVersion'
import { UiVersionProvider, useUiVersion } from '../components/uiVersion'
import { CHARM_TYPES, CHARM_DURATION_MS } from '../utils/charms'

const rawData = normalFull2Data
const MOCK_USER_NAME = 'manhhuy01'

function MockContent() {
  const router = useRouter()
  const [mode, setMode] = useState('playing')
  const [json, setJson] = useState(() => JSON.stringify(rawData, null, 2))
  const [error, setError] = useState('')
  const { version, ready, setVersion } = useUiVersion()

  // Dev convenience: /mock?ui=v3 previews a skin without touching the menu.
  useEffect(() => {
    const fromQuery = router.query?.ui
    if (typeof fromQuery === 'string' && UI_VERSION_VALUES.includes(fromQuery)) {
      setVersion(fromQuery)
    }
  }, [router.query?.ui, setVersion])

  const user = {
    userName: MOCK_USER_NAME,
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

  // Preview every charm on the seated players, re-sent each cycle.
  const [charms, setCharms] = useState({})
  const [charmCycle, setCharmCycle] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setCharmCycle((c) => c + 1), CHARM_DURATION_MS + 1000)
    return () => clearInterval(id)
  }, [])
  useEffect(() => {
    const seated = Object.values(data?.position || {}).map((p) => p?.user?.userName).filter(Boolean)
    setCharms(Object.fromEntries(seated.map((userName, i) => [
      userName,
      { id: `${charmCycle}-${i}`, type: CHARM_TYPES[i % CHARM_TYPES.length] },
    ])))
  }, [data, charmCycle])
  const onPickCharm = ({ type }) => {
    setCharms((prev) => ({ ...prev, [data?.user?.userName]: { id: Date.now(), type } }))
  }
  const GameView = version === UI_VERSIONS.V1 ? GameV1 : GameV2
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
            {ready && (
              <GameView
                key={version}
                uiVersion={version}
                data={data}
                user={user}
                onEditClick={noop}
                onAddClick={noop}
                onChatOpen={noop}
                messages={[]}
                countChat={0}
                charms={charms}
                onPickCharm={onPickCharm}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function MockPage() {
  return (
    <UiVersionProvider userName={MOCK_USER_NAME}>
      <MockContent />
    </UiVersionProvider>
  )
}

