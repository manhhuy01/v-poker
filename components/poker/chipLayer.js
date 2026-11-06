import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import styles from './chipLayer.module.css'

// Chip motion on the felt for the v2 table.
//
// The server only sends snapshots, so every animation is derived from the
// difference between the previous and the current `positions`:
//   • betBalance goes up          → chips jump from the player onto the felt
//   • betBalance drops to 0       → the bet stack slides into the pot
//   • winBalance appears / grows  → chips pour from the pot into three stacks
//                                   in front of the winner
//
// Bets and winnings are drawn on the felt (between the seat and the pot)
// instead of in the seat's status pills, so chips have somewhere to land.

const BET_DURATION = 420
const COLLECT_DURATION = 460
const WIN_DURATION = 720
const WIN_STAGGER = 60
const WIN_PILES = 3
const WIN_CHIPS = 9
const CHIP_COLORS = ['gold', 'red', 'blue', 'green', 'black']

const formatMoney = (value) => (
  typeof value === 'number' && Number.isFinite(value) ? value.toLocaleString('en-US') : value
)

// A few chips for small bets, a taller pile for big ones (log scale keeps it readable).
const pileSize = (amount) => Math.max(1, Math.min(5, Math.ceil(Math.log10(Math.max(1, amount)) * 1.6) + 1))

const prefersReducedMotion = () => (
  typeof window !== 'undefined'
  && window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches
)

const centerOf = (rect, base) => ({
  x: rect.left - base.left + rect.width / 2,
  y: rect.top - base.top + rect.height / 2,
})

// Half the size of a bet stack (pile + amount) — the gap it needs around it.
const STACK_HALF_W = 32
const STACK_HALF_H = 16
// Half the size of the winnings: three piles side by side, amount underneath.
const WIN_HALF_W = 42
const WIN_HALF_H = 36

// Three piles for the winnings, the middle one tallest, all growing with the amount.
const winPiles = (amount) => {
  const n = pileSize(amount)
  return [Math.max(1, n - 1), Math.min(6, n + 1), n]
}

const rectIn = (el, base) => {
  const r = el.getBoundingClientRect()
  return { left: r.left - base.left, right: r.right - base.left, top: r.top - base.top, bottom: r.bottom - base.top }
}

const grow = (box, w, h) => ({ left: box.left - w, right: box.right + w, top: box.top - h, bottom: box.bottom + h })

const contains = (box, p) => p.x > box.left && p.x < box.right && p.y > box.top && p.y < box.bottom

// Distance along `dir` from `from` (inside `box`) to the point where it leaves the box.
const exitDistance = (box, from, dir) => {
  const tx = dir.x ? ((dir.x > 0 ? box.right : box.left) - from.x) / dir.x : Infinity
  const ty = dir.y ? ((dir.y > 0 ? box.bottom : box.top) - from.y) / dir.y : Infinity
  return Math.max(0, Math.min(tx, ty))
}

function measure(stage) {
  const base = stage.getBoundingClientRect()
  const anchor = (name) => {
    const el = stage.querySelector(`[data-chip-anchor="${name}"]`)
    return el ? centerOf(el.getBoundingClientRect(), base) : null
  }
  // `table` is the centre column (stable); `pot` is the pot pill, which only
  // exists while there is money in the middle.
  const table = anchor('table') || { x: base.width / 2, y: base.height / 2 }
  const pot = anchor('pot') || table

  // What chips must never cover in the middle of the table: the board and the pot.
  const middle = ['board', 'pot']
    .map((name) => stage.querySelector(`[data-chip-anchor="${name}"]`))
    .filter(Boolean)
    .map((el) => rectIn(el, base))

  const seats = {}
  stage.querySelectorAll('[data-chip-seat]').forEach((slot) => {
    const pos = slot.getAttribute('data-chip-seat')
    const avatarEl = slot.querySelector('[data-chip-anchor="avatar"]') || slot
    const podEl = slot.querySelector('[data-chip-anchor="pod"]') || slot
    const avatar = centerOf(avatarEl.getBoundingClientRect(), base)
    const pod = centerOf(podEl.getBoundingClientRect(), base)

    // Everything the seat draws: pod, status pills and the cards that stick out above it.
    const seatBox = ['seat', 'cards'].reduce((acc, name) => {
      const el = slot.querySelector(`[data-chip-anchor="${name}"]`)
      if (!el) return acc
      const r = rectIn(el, base)
      return {
        left: Math.min(acc.left, r.left),
        right: Math.max(acc.right, r.right),
        top: Math.min(acc.top, r.top),
        bottom: Math.max(acc.bottom, r.bottom),
      }
    }, { left: pod.x, right: pod.x, top: pod.y, bottom: pod.y })

    // Where a block of chips of the given half-size sits in front of the seat.
    // Its centre must stay outside the seat and the middle grown by that
    // half-size, so no part of it touches them. Prefer the line towards the
    // table centre; when the board or pot is in the way (side seats level with
    // the board on tall screens), try straight up/down, then straight across.
    const spotFor = (halfW, halfH) => {
      const around = grow(seatBox, halfW, halfH)
      const obstacles = middle.map((box) => grow(box, halfW + 2, halfH + 2))
      // Keep the block on the table; nudged in from the edge rather than dropped.
      const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), Math.max(lo, hi))
      const inside = (p) => ({ x: clamp(p.x, halfW, base.width - halfW), y: clamp(p.y, halfH, base.height - halfH) })
      const dx = table.x - pod.x
      const dy = table.y - pod.y
      const dist = Math.hypot(dx, dy) || 1
      const candidates = [
        { x: dx / dist, y: dy / dist, cap: dist * 0.75 },
        { x: 0, y: Math.sign(dy) || 1, cap: Infinity },
        { x: Math.sign(dx) || 1, y: 0, cap: Infinity },
        { x: 0, y: -(Math.sign(dy) || 1), cap: Infinity },
      ].map((dir) => {
        const reach = Math.min(exitDistance(around, pod, dir) + 3, dir.cap)
        return inside({ x: pod.x + dir.x * reach, y: pod.y + dir.y * reach })
      })
      return candidates.find((p) => !contains(around, p) && !obstacles.some((box) => contains(box, p))) || candidates[0]
    }

    seats[pos] = {
      avatar,
      bet: spotFor(STACK_HALF_W, STACK_HALF_H),
      win: spotFor(WIN_HALF_W, WIN_HALF_H),
    }
  })

  return { pot, seats, width: base.width, height: base.height }
}

let flightSeq = 0
const nextId = () => {
  flightSeq += 1
  return flightSeq
}

const sameSeat = (a, b) => !!b?.user?.userName && a?.user?.userName === b.user.userName

// Bets swept into the pot between two snapshots; the winnings wait for them.
const collectCount = (prev, next) => {
  let count = 0
  for (let pos = 1; pos <= 9; pos++) {
    const a = prev?.[pos]
    const b = next?.[pos]
    if (sameSeat(a, b) && (a.betBalance || 0) > 0 && (b.betBalance || 0) < a.betBalance) count += 1
  }
  return count
}
const winStartDelay = (collected) => (collected ? COLLECT_DURATION + collected * 45 + 120 : 0)

// Diff two snapshots into the flights to play.
function diffFlights(prev, next, { start, prevStart, layout }) {
  const flights = []
  // A reset (or the hand ending without a winner) refunds bets — no table motion then.
  if (!layout || !prevStart || !start) return flights

  let collecting = false
  let collectIndex = 0
  for (let pos = 1; pos <= 9; pos++) {
    const a = prev?.[pos]
    const b = next?.[pos]
    const seat = layout.seats[pos]
    if (!a || !b || !seat) continue
    const name = b.user?.userName
    if (!name || a.user?.userName !== name) continue

    const prevBet = a.betBalance || 0
    const bet = b.betBalance || 0

    if (bet > prevBet) {
      flights.push({
        id: nextId(),
        kind: 'bet',
        pos,
        from: seat.avatar,
        to: seat.bet,
        // One stack tossed onto the felt, already as tall as the bet it becomes.
        chips: 1,
        pile: pileSize(bet),
        delay: 0,
      })
    } else if (prevBet > 0 && bet < prevBet) {
      collecting = true
      flights.push({
        id: nextId(),
        kind: 'collect',
        from: seat.bet,
        to: layout.pot,
        chips: pileSize(prevBet),
        delay: collectIndex * 45,
      })
      collectIndex += 1
    }
  }

  const winDelay = collecting ? winStartDelay(collectIndex) : 0
  for (let pos = 1; pos <= 9; pos++) {
    const a = prev?.[pos]
    const b = next?.[pos]
    const seat = layout.seats[pos]
    if (!a || !b || !seat) continue
    const name = b.user?.userName
    if (!name || a.user?.userName !== name) continue

    if ((b.winBalance || 0) > (a.winBalance || 0)) {
      flights.push({
        id: nextId(),
        kind: 'win',
        pos,
        from: layout.pot,
        // Chips take turns landing on the three piles (aimed at each pile once mounted).
        to: seat.win,
        targets: null,
        chips: WIN_CHIPS,
        delay: winDelay,
      })
    }
  }

  return flights
}

// Points along a quadratic curve that bows upward, so chips are tossed rather than slid.
function arcKeyframes(from, to, { lift, startScale, endScale, endOpacity }) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const cx = dx / 2
  const cy = dy / 2 - lift
  const steps = 8
  const frames = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = 2 * (1 - t) * t * cx + t * t * dx
    const y = 2 * (1 - t) * t * cy + t * t * dy
    const scale = startScale + (endScale - startScale) * t + Math.sin(Math.PI * t) * 0.18
    let opacity = 1
    if (t === 0) opacity = 0
    if (t === 1) opacity = endOpacity
    frames.push({
      offset: t,
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
      opacity,
    })
  }
  return frames
}

function FlightChip({ flight, index, onDone }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof el.animate !== 'function') {
      onDone()
      return undefined
    }

    const { kind, from } = flight
    const to = flight.targets ? flight.targets[index % flight.targets.length] : flight.to
    const dist = Math.hypot(to.x - from.x, to.y - from.y)
    // Fan chips a little so a handful of them don't overlap into one.
    const spread = { win: 4, collect: 6 }[kind] || 0
    const jitter = (seed) => (((Math.sin((flight.id + 1) * 12.9898 + seed * 78.233) * 43758.5453) % 1) - 0.5) * spread
    const target = { x: to.x + jitter(index), y: to.y + jitter(index + 7) }

    let duration = BET_DURATION
    let stagger = 55
    let options = { lift: Math.min(70, dist * 0.35), startScale: 0.7, endScale: 1, endOpacity: 1 }
    let easing = 'cubic-bezier(0.25, 0.7, 0.35, 1)'
    if (kind === 'collect') {
      duration = COLLECT_DURATION
      stagger = 28
      options = { lift: Math.min(28, dist * 0.12), startScale: 1, endScale: 0.8, endOpacity: 0 }
      easing = 'cubic-bezier(0.55, 0.05, 0.4, 1)'
    } else if (kind === 'win') {
      duration = WIN_DURATION
      stagger = WIN_STAGGER
      // Each chip melts into the pile it lands on, which grows into view.
      options = { lift: Math.min(90, dist * 0.4), startScale: 0.75, endScale: 0.85, endOpacity: 0 }
      easing = 'cubic-bezier(0.3, 0.6, 0.3, 1)'
    }

    const anim = el.animate(arcKeyframes(from, target, options), {
      duration,
      delay: flight.delay + index * stagger,
      easing,
      fill: 'both',
    })
    anim.onfinish = onDone
    return () => {
      anim.onfinish = null
      anim.cancel()
    }
    // A flight never changes after it is created.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (flight.pile) {
    return (
      <span ref={ref} className={styles.flyPile} style={{ left: flight.from.x, top: flight.from.y }}>
        <span className={styles.pile} style={{ '--pile': flight.pile }}>
          {Array.from({ length: flight.pile }, (_, i) => (
            <span
              key={i}
              className={styles.pileChip}
              data-color={CHIP_COLORS[(flight.pos + i) % CHIP_COLORS.length]}
              style={{ '--i': i }}
            />
          ))}
        </span>
      </span>
    )
  }

  return (
    <span
      ref={ref}
      className={styles.flyChip}
      data-color={CHIP_COLORS[(flight.id + index) % CHIP_COLORS.length]}
      style={{ left: flight.from.x, top: flight.from.y }}
    />
  )
}

function Flight({ flight, onFinish }) {
  const remaining = useRef(flight.chips)
  const done = useCallback(() => {
    remaining.current -= 1
    if (remaining.current <= 0) onFinish(flight.id)
  }, [flight.id, onFinish])

  return Array.from({ length: flight.chips }, (_, i) => (
    <FlightChip key={i} flight={flight} index={i} onDone={done} />
  ))
}

// `delay` is read once per mount so later re-renders (e.g. a flight finishing)
// can't cut short the wait for the chips that are still in the air.
function Amount({ amount, delay }) {
  const [wait] = useState(delay)
  return (
    <span className={styles.amount} data-bump={wait ? 'true' : 'false'} style={{ '--land-delay': `${wait}ms` }}>
      {formatMoney(amount)}
    </span>
  )
}

function BetStack({ amount, at, seatIndex, delay }) {
  const [wait] = useState(delay)
  const size = pileSize(amount)
  return (
    <div
      className={styles.betStack}
      data-landing={wait ? 'true' : 'false'}
      style={{ left: at.x, top: at.y, '--land-delay': `${wait}ms` }}
    >
      <span className={styles.pile} style={{ '--pile': size }} data-chip-pile={seatIndex}>
        {Array.from({ length: size }, (_, i) => (
          <span
            key={i}
            className={styles.pileChip}
            data-color={CHIP_COLORS[(seatIndex + i) % CHIP_COLORS.length]}
            style={{ '--i': i }}
          />
        ))}
      </span>
      <Amount key={amount} amount={amount} delay={delay} />
    </div>
  )
}

// The winnings in front of the winner: three piles, then the amount.
function WinStack({ amount, at, seatIndex, delay }) {
  const [wait] = useState(delay)
  const piles = winPiles(amount)
  // Pile k shows when the first chip aimed at it lands; the amount once the last pile is in.
  const pileDelay = (k) => (wait ? wait + k * WIN_STAGGER : 0)
  return (
    <div
      className={styles.winStack}
      data-win-stack=""
      data-landing={wait ? 'true' : 'false'}
      style={{ left: at.x, top: at.y }}
    >
      <span className={styles.winPiles}>
        {piles.map((size, k) => (
          <span
            key={k}
            className={styles.pile}
            style={{ '--pile': size, '--land-delay': `${pileDelay(k)}ms` }}
            data-chip-win-pile={`${seatIndex}-${k}`}
          >
            {Array.from({ length: size }, (_, i) => (
              <span
                key={i}
                className={styles.pileChip}
                data-color={CHIP_COLORS[(seatIndex + k * 2 + i) % CHIP_COLORS.length]}
                style={{ '--i': i }}
              />
            ))}
          </span>
        ))}
      </span>
      <span
        className={`${styles.amount} ${styles.winAmount}`}
        style={{ '--land-delay': `${wait ? pileDelay(WIN_PILES - 1) + 80 : 0}ms` }}
      >
        {formatMoney(amount)}
      </span>
    </div>
  )
}

export default function ChipLayer({ stageRef, positions, start }) {
  const [layout, setLayout] = useState(null)
  const [flights, setFlights] = useState([])
  const prevRef = useRef({ positions: null, start: false })

  const remeasure = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return null
    const next = measure(stage)
    setLayout(next)
    return next
  }, [stageRef])

  // Keep anchors in sync with the responsive layout.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(() => remeasure())
    observer.observe(stage)
    return () => observer.disconnect()
  }, [stageRef, remeasure])

  // Diff each snapshot against the last one before the browser paints, so the
  // flights start on the same frame the new numbers appear.
  useLayoutEffect(() => {
    const current = remeasure()
    const prev = prevRef.current
    prevRef.current = { positions: JSON.parse(JSON.stringify(positions || {})), start: !!start }

    if (!prev.positions || prefersReducedMotion()) return

    const created = diffFlights(prev.positions, positions, {
      start: !!start,
      prevStart: prev.start,
      layout: current,
    })
    if (!created.length) return

    // Land each tossed stack exactly on its pile. The stack on the felt is
    // already mounted (hidden until the flight arrives) but may still be at its
    // old spot, so take the pile's offset inside the stack and apply it to the
    // spot just measured.
    const stage = stageRef.current
    // Same for the winnings: aim the chips at the three piles.
    created.forEach((flight) => {
      if (flight.kind !== 'win') return
      const stackEl = stage.querySelector(`[data-chip-win-pile="${flight.pos}-0"]`)?.closest('[data-win-stack]')
      if (!stackEl) return
      const stack = stackEl.getBoundingClientRect()
      const cx = stack.left + stack.width / 2
      const cy = stack.top + stack.height / 2
      flight.targets = Array.from({ length: WIN_PILES }, (_, k) => {
        const pile = stage.querySelector(`[data-chip-win-pile="${flight.pos}-${k}"]`).getBoundingClientRect()
        return {
          x: flight.to.x + (pile.left + pile.width / 2) - cx,
          // Land on the top of the pile rather than its middle.
          y: flight.to.y + (pile.top + Math.min(pile.height / 2, pile.width / 2)) - cy,
        }
      })
    })
    created.forEach((flight) => {
      if (flight.kind !== 'bet') return
      const pileEl = stage.querySelector(`[data-chip-pile="${flight.pos}"]`)
      const stackEl = pileEl?.parentElement
      if (!stackEl) return
      const pile = pileEl.getBoundingClientRect()
      const stack = stackEl.getBoundingClientRect()
      flight.to = {
        x: flight.to.x + (pile.left + pile.width / 2) - (stack.left + stack.width / 2),
        y: flight.to.y + (pile.top + pile.height / 2) - (stack.top + stack.height / 2),
      }
    })

    setFlights((list) => [...list, ...created])
  }, [positions, start, remeasure, stageRef])

  const finishFlight = useCallback((id) => {
    setFlights((list) => list.filter((f) => f.id !== id))
  }, [])

  // During the render that introduces a bigger bet, prevRef still holds the
  // previous snapshot: use it to hold the stack back until its chips land.
  const prevSnap = prevRef.current
  const canAnimate = !!prevSnap.positions && prevSnap.start && !!start && !prefersReducedMotion()
  const landDelay = (pos, seat, amount) => {
    const before = prevSnap.positions?.[pos]
    if (!canAnimate || !before || before.user?.userName !== seat.user.userName) return 0
    return amount > (before.betBalance || 0) ? BET_DURATION - 16 : 0
  }
  const winLandDelay = (pos, seat, amount) => {
    const before = prevSnap.positions?.[pos]
    if (!canAnimate || !sameSeat(before, seat) || amount <= (before.winBalance || 0)) return 0
    return winStartDelay(collectCount(prevSnap.positions, positions)) + WIN_DURATION - 16
  }

  return (
    <>
      <div className={styles.stacks} aria-hidden="true">
        {!!layout && Object.keys(positions || {}).map((pos) => {
          const seat = positions[pos]
          const amount = seat?.betBalance || 0
          const at = layout.seats[pos]?.bet
          if (!seat?.user?.userName || !amount || !at) return null
          return (
            <BetStack
              key={`${pos}-${seat.user.userName}`}
              amount={amount}
              at={at}
              seatIndex={+pos}
              delay={landDelay(pos, seat, amount)}
            />
          )
        })}
        {!!layout && Object.keys(positions || {}).map((pos) => {
          const seat = positions[pos]
          const amount = seat?.winBalance || 0
          const at = layout.seats[pos]?.win
          if (!seat?.user?.userName || !amount || !at) return null
          return (
            <WinStack
              key={`win-${pos}-${seat.user.userName}`}
              amount={amount}
              at={at}
              seatIndex={+pos}
              delay={winLandDelay(pos, seat, amount)}
            />
          )
        })}
      </div>

      <div className={styles.flights} aria-hidden="true">
        {flights.map((flight) => (
          <Flight key={flight.id} flight={flight} onFinish={finishFlight} />
        ))}
      </div>
    </>
  )
}
