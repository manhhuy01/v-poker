const { normalizeData } = require('./normalizeGame')

const mockGameData = {
  data: {
    setting: { smallBlind: 1 },
    dealer: 'nhat',
    players: [
      { userName: 'nhat', startBalance: 100, accBalance: 99 },
      { userName: 'cuongvu', startBalance: 80, accBalance: 60 },
      { userName: 'dealerfromhell2', startBalance: 44, accBalance: 14 },
      { userName: 'daodaobao', startBalance: 50, accBalance: 50 },
      { userName: 'viet', startBalance: 52, accBalance: 22 },
      { userName: 'mytrang', startBalance: 50, accBalance: 50 },
    ],
    table: {
      flop: ['As', '9d', '4c'],
      turn: '7h',
      river: '2s',
      finish: true,
      actions: [
        { user: 'dealerfromhell2', action: 'call', amount: 2 },
        { user: 'daodaobao', action: 'fold' },
        { user: 'viet', action: 'raise', amount: 4 },
        { user: 'mytrang', action: 'fold' },
        { user: 'nhat', action: 'fold' },
        { user: 'cuongvu', action: 'call', amount: 2 },
        { user: 'dealerfromhell2', action: 'call', amount: 2 },
        { user: 'cuongvu', action: 'check' },
        { user: 'dealerfromhell2', action: 'bet', amount: 6 },
        { user: 'viet', action: 'call', amount: 6 },
        { user: 'cuongvu', action: 'call', amount: 6 },
        { user: 'cuongvu', action: 'check' },
        { user: 'dealerfromhell2', action: 'check' },
        { user: 'viet', action: 'bet', amount: 8 },
        { user: 'cuongvu', action: 'call', amount: 8 },
        { user: 'dealerfromhell2', action: 'call', amount: 8 },
        { user: 'cuongvu', action: 'check' },
        { user: 'dealerfromhell2', action: 'check' },
        { user: 'viet', action: 'bet', amount: 12 },
        { user: 'cuongvu', action: 'fold' },
        { user: 'dealerfromhell2', action: 'call', amount: 12 },
      ],
    },
    position: {
      1: {
        user: { userName: 'nhat', startBalance: 100, accBalance: 99 },
        betBalance: 1, namePos: 'SB', isPlaying: true,
        cards: ['Kh', 'Qh'],
      },
      2: {
        user: { userName: 'cuongvu', startBalance: 80, accBalance: 60 },
        betBalance: 2, namePos: 'BB', isPlaying: true,
        cards: ['Jd', 'Td'],
      },
      3: {
        user: { userName: 'dealerfromhell2', startBalance: 44, accBalance: 14 },
        betBalance: 0, namePos: '', isPlaying: true,
        cards: ['9s', '8s'],
      },
      4: {
        user: { userName: 'daodaobao', startBalance: 50, accBalance: 50 },
        betBalance: 0, namePos: '', isPlaying: true,
        cards: ['5c', '4d'],
      },
      5: {
        user: { userName: 'viet', startBalance: 52, accBalance: 22 },
        betBalance: 0, namePos: '', isPlaying: true,
        cards: ['Ah', 'Ac'],
      },
      9: {
        user: { userName: 'mytrang', startBalance: 50, accBalance: 50 },
        betBalance: 0, namePos: 'D', isPlaying: true,
        cards: ['7c', '6c'],
      },
    },
  },
}

let passed = 0
let failed = 0

function assert(condition, message) {
  if (condition) {
    passed++
  } else {
    failed++
    console.error(`FAIL: ${message}`)
  }
}

function assertEqual(actual, expected, message) {
  if (actual === expected) {
    passed++
  } else {
    failed++
    console.error(`FAIL: ${message} — expected "${expected}", got "${actual}"`)
  }
}

function assertPos(step, pos, field, expected, steps) {
  const s = steps[step]
  if (!s) {
    failed++
    console.error(`FAIL: Step ${step} does not exist`)
    return
  }
  const actual = s.positions[pos]?.[field]
  const expStr = JSON.stringify(expected)
  const actStr = JSON.stringify(actual)
  if (expStr === actStr) {
    passed++
  } else {
    failed++
    console.error(`FAIL: Step ${step} pos ${pos} ${field} — expected ${expStr}, got ${actStr}`)
  }
}

function assertTable(step, field, expected, steps) {
  const s = steps[step]
  if (!s) {
    failed++
    console.error(`FAIL: Step ${step} does not exist`)
    return
  }
  const actual = s.table?.[field]
  const expStr = JSON.stringify(expected)
  const actStr = JSON.stringify(actual)
  if (expStr === actStr) {
    passed++
  } else {
    failed++
    console.error(`FAIL: Step ${step} table.${field} — expected ${expStr}, got ${actStr}`)
  }
}

function assertPot(step, expectedBalance, steps) {
  const s = steps[step]
  if (!s) {
    failed++
    console.error(`FAIL: Step ${step} does not exist`)
    return
  }
  const actual = s.pot?.[0]?.balance ?? 0
  if (actual === expectedBalance) {
    passed++
  } else {
    failed++
    console.error(`FAIL: Step ${step} pot.balance — expected ${expectedBalance}, got ${actual}`)
  }
}

function assertEmptyPot(step, steps) {
  const s = steps[step]
  if (!s) {
    failed++
    console.error(`FAIL: Step ${step} does not exist`)
    return
  }
  if (s.pot.length === 0) {
    passed++
  } else {
    failed++
    console.error(`FAIL: Step ${step} pot — expected empty, got ${JSON.stringify(s.pot)}`)
  }
}

// Run normalizeData
const result = normalizeData(mockGameData)
const steps = result.steps

console.log(`Total steps: ${steps.length}`)
console.log('Step labels:')
steps.forEach((s, i) => console.log(`  ${i}: ${s.label}`))
console.log('')

// ============================================================
// BASIC STRUCTURE
// ============================================================
assertEqual(steps.length, 27, 'Total steps = 27')

// Step 0: Bắt đầu
assertEqual(steps[0].label, 'Bắt đầu', 'Step 0 label')
assertPos(0, 1, 'chips', 99, steps)      // nhat after SB
assertPos(0, 2, 'chips', 78, steps)      // cuongvu after BB
assertPos(0, 1, 'betBalance', 1, steps)  // nhat SB=1
assertPos(0, 2, 'betBalance', 2, steps)  // cuongvu BB=2
assertPos(0, 9, 'namePos', 'D', steps)   // dealer mytrang

// Step 1: Pre-flop
assertEqual(steps[1].label, 'Pre-flop', 'Step 1 label')

// ============================================================
// PREFLOP ACTIONS
// ============================================================

// Step 2: dealerfromhell2 call
assertEqual(steps[2].label, 'dealerfromhell2 call', 'Step 2 label')
assertPos(2, 3, 'betBalance', 2, steps)
assertPos(2, 3, 'chips', 42, steps)

// Step 3: daodaobao fold
assertEqual(steps[3].label, 'daodaobao fold', 'Step 3 label')
assertPos(3, 4, 'isFold', true, steps)
assertPos(3, 4, 'cards', ['5c', '4d'], steps) // cards shown on fold step

// Step 4: viet raise to 4
assertEqual(steps[4].label, 'viet raise to 4', 'Step 4 label')
assertPos(4, 5, 'betBalance', 4, steps)
assertPos(4, 5, 'chips', 48, steps)
assertTable(4, 'currentBet', 4, steps)

// Step 5: mytrang fold
assertEqual(steps[5].label, 'mytrang fold', 'Step 5 label')
assertPos(5, 9, 'isFold', true, steps)

// Step 6: nhat fold
assertEqual(steps[6].label, 'nhat fold', 'Step 6 label')
assertPos(6, 1, 'isFold', true, steps)

// Step 7: cuongvu call
assertEqual(steps[7].label, 'cuongvu call', 'Step 7 label')
assertPos(7, 2, 'betBalance', 4, steps)
assertPos(7, 2, 'chips', 76, steps)

// Step 8: dealerfromhell2 call
assertEqual(steps[8].label, 'dealerfromhell2 call', 'Step 8 label')
assertPos(8, 3, 'betBalance', 4, steps)
assertPos(8, 3, 'chips', 40, steps)

// ============================================================
// FLOP REVEAL (step 9)
// ============================================================
assertEqual(steps[9].label, 'Flop - As 9d 4c', 'Step 9 label = Flop')
assertTable(9, 'flop', ['As', '9d', '4c'], steps)
assertPot(9, 13, steps) // pot collected: 1+2+2+4+4=13

// ============================================================
// FLOP ACTIONS
// ============================================================

// Step 10: cuongvu check
assertEqual(steps[10].label, 'cuongvu check', 'Step 10 label')
assertPos(10, 2, 'action', 'check', steps)

// Step 11: dealerfromhell2 bet
assertEqual(steps[11].label, 'dealerfromhell2 bet', 'Step 11 label')
assertPos(11, 3, 'betBalance', 6, steps)
assertPos(11, 3, 'chips', 34, steps)
assertTable(11, 'currentBet', 6, steps)

// Step 12: viet call
assertEqual(steps[12].label, 'viet call', 'Step 12 label')
assertPos(12, 5, 'betBalance', 6, steps)
assertPos(12, 5, 'chips', 42, steps)

// Step 13: cuongvu call
assertEqual(steps[13].label, 'cuongvu call', 'Step 13 label')
assertPos(13, 2, 'betBalance', 6, steps)
assertPos(13, 2, 'chips', 70, steps)

// ============================================================
// TURN REVEAL (step 14)
// ============================================================
assertEqual(steps[14].label, 'Turn - 7h', 'Step 14 label = Turn')
assertTable(14, 'turn', '7h', steps)
assertPot(14, 31, steps) // pot: 13 + 18(6*3) = 31

// ============================================================
// TURN ACTIONS
// ============================================================

// Step 15: cuongvu check
assertEqual(steps[15].label, 'cuongvu check', 'Step 15 label')

// Step 16: dealerfromhell2 check
assertEqual(steps[16].label, 'dealerfromhell2 check', 'Step 16 label')

// Step 17: viet bet
assertEqual(steps[17].label, 'viet bet', 'Step 17 label')
assertPos(17, 5, 'betBalance', 8, steps)
assertPos(17, 5, 'chips', 34, steps)
assertTable(17, 'currentBet', 8, steps)

// Step 18: cuongvu call
assertEqual(steps[18].label, 'cuongvu call', 'Step 18 label')
assertPos(18, 2, 'betBalance', 8, steps)
assertPos(18, 2, 'chips', 62, steps)

// Step 19: dealerfromhell2 call
assertEqual(steps[19].label, 'dealerfromhell2 call', 'Step 19 label')
assertPos(19, 3, 'betBalance', 8, steps)
assertPos(19, 3, 'chips', 26, steps)

// ============================================================
// RIVER REVEAL (step 20)
// ============================================================
assertEqual(steps[20].label, 'River - 2s', 'Step 20 label = River')
assertTable(20, 'river', '2s', steps)
assertPot(20, 55, steps) // pot: 31 + 24(8*3) = 55

// ============================================================
// RIVER ACTIONS
// ============================================================

// Step 21: cuongvu check
assertEqual(steps[21].label, 'cuongvu check', 'Step 21 label')

// Step 22: dealerfromhell2 check
assertEqual(steps[22].label, 'dealerfromhell2 check', 'Step 22 label')

// Step 23: viet bet
assertEqual(steps[23].label, 'viet bet', 'Step 23 label')
assertPos(23, 5, 'betBalance', 12, steps)
assertPos(23, 5, 'chips', 22, steps)
assertTable(23, 'currentBet', 12, steps)

// Step 24: cuongvu fold
assertEqual(steps[24].label, 'cuongvu fold', 'Step 24 label')
assertPos(24, 2, 'isFold', true, steps)
assertPos(24, 2, 'cards', ['Jd', 'Td'], steps) // cards shown on fold step

// Step 25: dealerfromhell2 call
assertEqual(steps[25].label, 'dealerfromhell2 call', 'Step 25 label')
assertPos(25, 3, 'betBalance', 12, steps)
assertPos(25, 3, 'chips', 14, steps)
assertPot(25, 55, steps) // pot before river collect: 55

// ============================================================
// FINAL STEP (step 26)
// ============================================================
assertEqual(steps[26].label, 'Kết thúc', 'Step 26 label = Kết thúc')
assertEqual(steps[26].isFinal, true, 'Step 26 isFinal = true')
assertPot(26, 79, steps) // pot after river collect: 55 + 24(12*2) = 79

// ============================================================
// FOLD CARD HIDING: After fold step, cards should be hidden
// ============================================================
// After daodaobao fold (step3), on step4 daodaobao cards should be hidden
assertPos(4, 4, 'cards', [], steps) // daodaobao cards hidden after fold step

// After cuongvu fold (step24), on step25 cuongvu cards should be hidden
assertPos(25, 2, 'cards', [], steps) // cuongvu cards hidden after fold step

// After nhat fold (step6), on step7 nhat cards should be hidden
assertPos(7, 1, 'cards', [], steps) // nhat cards hidden after fold step

// ============================================================
// FINAL CHIP COUNTS
// ============================================================
assertPos(26, 1, 'chips', 99, steps)   // nhat: 100-1=99
assertPos(26, 2, 'chips', 62, steps)   // cuongvu: 80-2-2-6-8=62
assertPos(26, 3, 'chips', 14, steps)   // dealerfromhell2: 44-30=14
assertPos(26, 4, 'chips', 50, steps)   // daodaobao: 50 (folded, no spend)
assertPos(26, 5, 'chips', 22, steps)   // viet: 52-30=22
assertPos(26, 9, 'chips', 50, steps)   // mytrang: 50 (folded, no spend)

// ============================================================
// SUMMARY
// ============================================================
console.log('')
console.log(`Results: ${passed} passed, ${failed} failed`)
if (failed > 0) {
  process.exit(1)
} else {
  console.log('All tests passed!')
}
