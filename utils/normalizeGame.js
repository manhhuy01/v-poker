const clone = (value) => value === undefined ? undefined : JSON.parse(JSON.stringify(value))

const getPlayerPosition = (state, userName) => Object.keys(state.position).find((p) => state.position[p].user?.userName === userName)

const normalizeData = (payload) => {
  const result = payload?.data || payload || {}
  if (!result?.table) return { steps: [], setting: { smallBlind: 1 }, dealer: undefined, players: [] }

  const actions = result.table.actions || []
  const setting = result.setting || { smallBlind: 1 }

  const players = (result.players || []).map((p) => ({
    userName: p.userName,
    startBalance: p.startBalance ?? p.accBalance ?? 0,
    finalBalance: p.accBalance ?? 0,
  }))

  const buildStepPositions = (posState) => {
    const out = {}
    for (let i = 1; i <= 9; i++) {
      const s = posState[i]
      if (!s) {
        out[i] = {
          user: undefined, betBalance: 0, chips: 0, isFold: false,
          namePos: '', cards: [], isPlaying: false, winBalance: 0,
          action: '', resultCard: null,
        }
        continue
      }
      const shouldHideCards = s.isFold && s.action !== 'fold'
      out[i] = {
        user: s.user ? { userName: s.user.userName } : undefined,
        betBalance: s.betBalance || 0,
        chips: s.chips ?? 0,
        isFold: s.isFold || false,
        namePos: s.namePos || '',
        cards: shouldHideCards ? [] : (s.cards || []),
        isPlaying: s.isPlaying || false,
        winBalance: s.winBalance || 0,
        action: s.action || '',
        resultCard: s.resultCard || null,
      }
    }
    return out
  }

  const buildStepTable = (flop, turn, river, currentBet) => ({
    flop: flop || null,
    turn: turn || null,
    river: river || null,
    currentBet: currentBet || 0,
  })

  const isRoundComplete = (posState, currentBet, actedThisRound) => {
    const active = Object.keys(posState).filter((p) => posState[p].user && posState[p].isPlaying)
    const nonFolded = active.filter((p) => !posState[p].isFold)
    if (nonFolded.length === 0) return false
    if (nonFolded.some((p) => !actedThisRound.has(p))) return false
    return nonFolded.every((p) => {
      const pos = posState[p]
      return pos.chips === 0 || pos.betBalance >= currentBet
    })
  }

  const collectBets = (posState, pot) => {
    const active = Object.keys(posState).filter((p) => posState[p].user && posState[p].isPlaying)
    const total = active.reduce((sum, p) => sum + (posState[p].betBalance || 0), 0)
    if (total > 0) {
      pot.balance += total
    }
    active.forEach((p) => {
      posState[p].betBalance = 0
      posState[p].action = ''
    })
  }

  const posState = {}
  for (let i = 1; i <= 9; i++) {
    const src = result.position?.[i]
    if (src?.user) {
      posState[i] = {
        user: { userName: src.user.userName },
        chips: src.user.startBalance ?? src.user.accBalance ?? 0,
        betBalance: src.betBalance || 0,
        isFold: false,
        namePos: src.namePos || '',
        cards: clone(src.cards || []),
        isPlaying: src.isPlaying || false,
        winBalance: 0,
        action: '',
        resultCard: null,
      }
    } else {
      posState[i] = {
        user: undefined, chips: 0, betBalance: 0, isFold: false,
        namePos: '', cards: [], isPlaying: false, winBalance: 0,
        action: '', resultCard: null,
      }
    }
  }

  const pot = { balance: 0 }
  let currentBet = 0

  const dealerPosition = Object.keys(posState).find((p) => posState[p].namePos === 'D')
  if (dealerPosition) {
    let sbPos = +dealerPosition
    for (let g = 0; g < 9; g++) { sbPos = sbPos >= 9 ? 1 : sbPos + 1; if (posState[sbPos]?.isPlaying) break }
    let bbPos = sbPos
    for (let g = 0; g < 9; g++) { bbPos = bbPos >= 9 ? 1 : bbPos + 1; if (posState[bbPos]?.isPlaying) break }

    const sb = Math.min(Number(setting.smallBlind || 0), posState[sbPos]?.chips || 0)
    posState[sbPos].betBalance = sb
    posState[sbPos].chips -= sb

    const bb = Math.min(Number(setting.smallBlind || 0) * 2, posState[bbPos]?.chips || 0)
    posState[bbPos].betBalance = bb
    posState[bbPos].chips -= bb

    currentBet = bb
  }

  const communityCards = { flop: null, turn: null, river: null }
  const steps = []

  const addStep = (label, isFinal = false) => {
    steps.push({
      label,
      positions: buildStepPositions(posState),
      table: buildStepTable(communityCards.flop, communityCards.turn, communityCards.river, currentBet),
      pot: pot.balance > 0 ? [{ users: [], balance: pot.balance, isHavePlayerAllIn: false }] : [],
      isFinal,
    })
  }

  addStep('Bắt đầu')
  addStep('Pre-flop')

  const doReveal = () => {
    if (!pendingReveal) return
    addStep(pendingReveal.label)
    pendingReveal = null
  }

  let pendingReveal = null
  let actedThisRound = new Set()

  actions.forEach((action) => {
    const position = getPlayerPosition({ position: posState }, action.user)
    if (position) {
      const pos = posState[position]
      pos.action = action.action
      actedThisRound.add(position)

      if (action.action === 'fold') {
        pos.isFold = true
      } else if (action.action === 'check') {
        // no chip change
      } else if (action.action === 'call') {
        const spend = Math.min(Number(action.amount || 0), pos.chips)
        pos.chips -= spend
        pos.betBalance += spend
      } else if (action.action === 'bet' || action.action === 'raise' || action.action === 'all-in') {
        const amount = Number(action.amount || 0)
        const spend = Math.min(amount - pos.betBalance, pos.chips)
        pos.chips -= spend
        pos.betBalance = amount
        if (pos.betBalance > currentBet) currentBet = pos.betBalance
      }

    }

    const label = action.action === 'raise'
      ? `${action.user} raise to ${posState[position]?.betBalance || 0}`
      : `${action.user} ${action.action}`

    addStep(label)

    if (action.action === 'fold' && position) {
      posState[position].action = ''
    }

    if (isRoundComplete(posState, currentBet, actedThisRound)) {
      const totalBets = Object.keys(posState)
        .filter((p) => posState[p].user && posState[p].isPlaying)
        .reduce((sum, p) => sum + (posState[p].betBalance || 0), 0)

      if (totalBets > 0) {
        collectBets(posState, pot)
        currentBet = 0

        if (!communityCards.flop && result.table.flop) {
          communityCards.flop = clone(result.table.flop)
          pendingReveal = { label: `Flop - ${(result.table.flop || []).join(' ')}` }
        } else if (!communityCards.turn && result.table.turn) {
          communityCards.turn = result.table.turn
          pendingReveal = { label: `Turn - ${result.table.turn}` }
        } else if (!communityCards.river && result.table.river) {
          communityCards.river = result.table.river
          pendingReveal = { label: `River - ${result.table.river}` }
        }
      }

      actedThisRound = new Set()
      doReveal()
    }
  })

  doReveal()

  if (result.table.finish) {
    for (let i = 1; i <= 9; i++) {
      const src = result.position?.[i]
      if (src?.user && posState[i]) {
        posState[i].winBalance = src.winBalance || 0
        posState[i].resultCard = src.resultCard || null
      }
    }
    addStep('Kết thúc', true)
  }

  return { setting, dealer: dealerPosition, players, steps }
}

module.exports = { normalizeData }
