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

// /mock?demo=chips loops a scripted hand so the chip animations can be checked:
// blinds → bets/raise → collect to pot → bet/all-in → collect → winner paid.
function buildChipDemo(base) {
  const frame = (patch) => {
    const d = JSON.parse(JSON.stringify(base))
    // Fill the two empty seats so every seat of a full table gets a bet.
    ;[[5, '91', 'dealerfromhell', 88], [6, '92', 'tuannguyen', 145]].forEach(([pos, userId, userName, accBalance]) => {
      Object.assign(d.position[pos], {
        user: { userId, userName, accBalance, startBalance: accBalance },
        cards: ['u', 'u'],
        isPlaying: true,
      })
      if (!d.players.some((p) => p.userName === userName)) {
        d.players.push({ userId, userName, accBalance, startBalance: accBalance })
      }
    })
    d.table = { ...d.table, start: true, finish: false, isShowDown: false, pot: [{ users: [], balance: 0, isHavePlayerAllIn: false }] }
    Object.values(d.position).forEach((p) => {
      Object.assign(p, { betBalance: 0, winBalance: 0, isFold: false, action: '', isThinking: false })
    })
    patch(d)
    return JSON.stringify(d)
  }
  const bets = (d, map) => Object.entries(map).forEach(([pos, [bet, action]]) => {
    d.position[pos].betBalance = bet
    d.position[pos].action = action || ''
  })
  const pot = (d, balance) => { d.table.pot = [{ users: [], balance, isHavePlayerAllIn: false }] }

  const preflop = { 2: [1], 3: [2] }
  const call6 = (pos) => [6, pos === 7 ? 'raise' : 'call']
  return [
    frame(() => {}),
    // Pre-flop: blinds, calls round the table, a raise, then everyone calls it.
    frame((d) => bets(d, preflop)),
    frame((d) => bets(d, { ...preflop, 4: [2, 'call'] })),
    frame((d) => bets(d, { ...preflop, 4: [2, 'call'], 5: [2, 'call'] })),
    frame((d) => bets(d, { ...preflop, 4: [2, 'call'], 5: [2, 'call'], 6: [2, 'call'] })),
    frame((d) => bets(d, { ...preflop, 4: [2, 'call'], 5: [2, 'call'], 6: [2, 'call'], 7: [6, 'raise'] })),
    frame((d) => bets(d, { ...preflop, 4: [2, 'call'], 5: [2, 'call'], 6: [2, 'call'], 7: [6, 'raise'], 8: [6, 'call'], 9: [6, 'call'], 1: [6, 'call'] })),
    frame((d) => bets(d, Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8, 9].map((p) => [p, call6(p)])))),
    frame((d) => pot(d, 54)),
    // Flop: bet, calls, an all-in, then the callers match it.
    frame((d) => { pot(d, 54); bets(d, { 3: [10, 'bet'] }) }),
    frame((d) => { pot(d, 54); bets(d, { 3: [10, 'bet'], 5: [10, 'call'], 6: [10, 'call'] }) }),
    frame((d) => { pot(d, 54); bets(d, { 3: [10, 'bet'], 5: [10, 'call'], 6: [10, 'call'], 7: [40, 'all-in'], 1: [40, 'call'] }) }),
    frame((d) => { pot(d, 54); bets(d, { 3: [40, 'call'], 5: [40, 'call'], 6: [40, 'call'], 7: [40, 'all-in'], 1: [40, 'call'] }) }),
    // Finish: like the server, the last bets are swept and the pot paid out in
    // one snapshot (here a split pot). Held for a few ticks so the winnings can be seen.
    ...Array(3).fill(frame((d) => {
      d.table.finish = true
      d.position[7].winBalance = 127
      d.position[1].winBalance = 127
    })),
  ]
}

function MockContent() {
  const router = useRouter()
  const [mode, setMode] = useState('playing')
  const [json, setJson] = useState(() => JSON.stringify(rawData, null, 2))
  const [error, setError] = useState('')
  const { version, ready, setVersion } = useUiVersion()

  useEffect(() => {
    if (router.query?.demo !== 'chips') return undefined
    const frames = buildChipDemo(rawData)
    let i = 0
    setJson(frames[0])
    const id = setInterval(() => {
      i = (i + 1) % frames.length
      setJson(frames[i])
    }, 1400)
    return () => clearInterval(id)
  }, [router.query?.demo])

  // Dev convenience: /mock?ui=v2 previews a table version without touching the menu.
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

