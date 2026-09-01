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

const mockGameDataCase2 = {
  data: {
    cards: [
      'Jh', '7c', '7s', '3s', '9d', '10s', '10c', '4c', '6c', '2d', '10d',
      '8d', 'Kc', 'Js', 'Ad', '6s', '6d', '7h', '7d', '3c', 'As', '9c', '4d',
      '2c', 'Ac', 'Kd', '4s', '8h', '3h', 'Qs', 'Kh', 'Qd', '10h',
    ],
    table: {
      pot: [{ users: [], balance: 0, isHavePlayerAllIn: false }],
      flop: ['5c', 'Qc', '5d'],
      turn: '2h',
      river: 'Ks',
      start: true,
      finish: true,
      actions: [
        { user: 'tuan', action: 'call', amount: 2 },
        { user: 'haha', action: 'call', amount: 2 },
        { user: 'cuongvu', action: 'fold', amount: 0 },
        { user: 'manhhuy01', action: 'call', amount: 2 },
        { user: 'nhat', action: 'call', amount: 2 },
        { user: 'daodaobao', action: 'fold', amount: 0 },
        { user: 'lycuong99', action: 'check', amount: 0 },
        { user: 'lycuong99', action: 'check', amount: 0 },
        { user: 'tuan', action: 'check', amount: 0 },
        { user: 'haha', action: 'check', amount: 0 },
        { user: 'manhhuy01', action: 'bet', amount: 4 },
        { user: 'nhat', action: 'raise', amount: 8 },
        { user: 'lycuong99', action: 'fold', amount: 0 },
        { user: 'tuan', action: 'call', amount: 8 },
        { user: 'haha', action: 'call', amount: 8 },
        { user: 'manhhuy01', action: 'raise', amount: 16 },
        { user: 'nhat', action: 'all-in', amount: 6 },
        { user: 'tuan', action: 'call', amount: 8 },
        { user: 'haha', action: 'fold', amount: 0 },
        { user: 'tuan', action: 'check', amount: 0 },
        { user: 'manhhuy01', action: 'bet', amount: 8 },
        { user: 'tuan', action: 'call', amount: 8 },
        { user: 'tuan', action: 'check', amount: 0 },
        { user: 'manhhuy01', action: 'bet', amount: 20 },
        { user: 'tuan', action: 'call', amount: 20 },
      ],
      preFlop: true,
      currentBet: 0,
      isShowDown: true,
      firstActionPlayer: 2,
    },
    dealer: 'nhat',
    players: [
      { userId: '7', userName: 'nhat', accBalance: 0, startBalance: 16 },
      { userId: '31', userName: 'nhat2', accBalance: 18, startBalance: 18 },
      { userId: '32', userName: 'nhat3', accBalance: 20, startBalance: 20 },
      { userId: '28', userName: 'cuongvu', accBalance: 127, startBalance: 127 },
      { userId: '3', userName: 'lycuong99', accBalance: 74, startBalance: 76 },
      { userId: '10', userName: 'daodaobao', accBalance: 33, startBalance: 34 },
      { userId: '1', userName: 'manhhuy01', accBalance: 63, startBalance: 109 },
      { userId: '2', userName: 'tuan', accBalance: 66, startBalance: 112 },
      { userId: '24', userName: 'haha', accBalance: 116, startBalance: 126 },
      { userId: '19', userName: 'jemp', accBalance: 0 },
      { userId: '22', userName: 'dealerfromhell2', accBalance: 0 },
    ],
    setting: { smallBlind: 1 },
    position: {
      1: {
        user: { userId: '28', userName: 'cuongvu', accBalance: 127, startBalance: 127 },
        cards: ['6h', '9h'],
        action: '',
        isFold: true,
        namePos: '',
        showCard: false,
        isPlaying: true,
        betBalance: 0,
        isThinking: false,
      },
      2: {
        user: { userId: '1', userName: 'manhhuy01', accBalance: 63, startBalance: 109 },
        cards: ['4h', '5h'],
        action: '',
        isFold: false,
        namePos: '',
        showCard: false,
        isPlaying: true,
        betBalance: 0,
        isThinking: false,
      },
      3: {
        user: { userId: '7', userName: 'nhat', accBalance: 0, startBalance: 16 },
        cards: ['5s', 'Jd'],
        action: '',
        isFold: false,
        namePos: 'D',
        showCard: false,
        isPlaying: true,
        betBalance: 0,
        isThinking: false,
      },
      4: {
        user: { userId: '10', userName: 'daodaobao', accBalance: 33, startBalance: 34 },
        cards: ['2s', '8s'],
        action: '',
        isFold: true,
        namePos: '',
        showCard: false,
        isPlaying: true,
        betBalance: 0,
        isThinking: false,
      },
      5: {
        user: { userId: '3', userName: 'lycuong99', accBalance: 74, startBalance: 76 },
        cards: ['9s', '8c'],
        action: '',
        isFold: true,
        namePos: '',
        showCard: false,
        isPlaying: true,
        betBalance: 0,
        isThinking: false,
      },
      6: {
        cards: [],
        action: '',
        isFold: false,
        namePos: '',
        showCard: false,
        isPlaying: false,
        betBalance: 0,
        isThinking: false,
        winBalance: 0,
      },
      7: {
        user: { userId: '2', userName: 'tuan', accBalance: 66, startBalance: 112 },
        cards: ['Qh', 'Jc'],
        action: '',
        isFold: false,
        namePos: '',
        showCard: false,
        isPlaying: true,
        betBalance: 0,
        isThinking: false,
      },
      8: {
        user: { userId: '24', userName: 'haha', accBalance: 116, startBalance: 126 },
        cards: ['Ah', '3d'],
        action: '',
        isFold: true,
        namePos: '',
        showCard: false,
        isPlaying: true,
        betBalance: 0,
        isThinking: false,
      },
      9: {
        user: { userId: '22', userName: 'dealerfromhell2', accBalance: 0 },
        cards: [],
        action: '',
        isFold: false,
        namePos: '',
        showCard: false,
        isPlaying: false,
        betBalance: 0,
        isThinking: false,
        winBalance: 0,
      },
    },
  },
}

describe('normalizeData - Case 1', () => {
  const { steps } = normalizeData(mockGameData)

  it('Step 0: Bắt đầu', () => {
    expect(steps[0].label).toBe('Bắt đầu')
    expect(steps[0].positions[1].chips).toBe(99)
    expect(steps[0].positions[2].chips).toBe(78)
    expect(steps[0].positions[1].betBalance).toBe(1)
    expect(steps[0].positions[2].betBalance).toBe(2)
    expect(steps[0].positions[9].namePos).toBe('D')
  })

  it('Step 1: Pre-flop', () => {
    expect(steps[1].label).toBe('Pre-flop')
  })

  it('Step 2: dealerfromhell2 call', () => {
    expect(steps[2].label).toBe('dealerfromhell2 call')
    expect(steps[2].positions[3].betBalance).toBe(2)
    expect(steps[2].positions[3].chips).toBe(42)
  })

  it('Step 3: daodaobao fold', () => {
    expect(steps[3].label).toBe('daodaobao fold')
    expect(steps[3].positions[4].isFold).toBe(true)
    expect(steps[3].positions[4].cards).toEqual(['5c', '4d'])
  })

  it('Step 4: viet raise to 4', () => {
    expect(steps[4].label).toBe('viet raise to 4')
    expect(steps[4].positions[5].betBalance).toBe(4)
    expect(steps[4].positions[5].chips).toBe(48)
    expect(steps[4].table.currentBet).toBe(4)
  })

  it('Step 5: mytrang fold', () => {
    expect(steps[5].label).toBe('mytrang fold')
    expect(steps[5].positions[9].isFold).toBe(true)
  })

  it('Step 6: nhat fold', () => {
    expect(steps[6].label).toBe('nhat fold')
    expect(steps[6].positions[1].isFold).toBe(true)
  })

  it('Step 7: cuongvu call', () => {
    expect(steps[7].label).toBe('cuongvu call')
    expect(steps[7].positions[2].betBalance).toBe(4)
    expect(steps[7].positions[2].chips).toBe(76)
  })

  it('Step 8: dealerfromhell2 call', () => {
    expect(steps[8].label).toBe('dealerfromhell2 call')
    expect(steps[8].positions[3].betBalance).toBe(4)
    expect(steps[8].positions[3].chips).toBe(40)
  })

  it('Step 9: Flop - As 9d 4c', () => {
    expect(steps[9].label).toBe('Flop - As 9d 4c')
    expect(steps[9].table.flop).toEqual(['As', '9d', '4c'])
    expect(steps[9].pot[0].balance).toBe(13)
  })

  it('Step 10: cuongvu check', () => {
    expect(steps[10].label).toBe('cuongvu check')
    expect(steps[10].positions[2].action).toBe('check')
  })

  it('Step 11: dealerfromhell2 bet', () => {
    expect(steps[11].label).toBe('dealerfromhell2 bet')
    expect(steps[11].positions[3].betBalance).toBe(6)
    expect(steps[11].positions[3].chips).toBe(34)
    expect(steps[11].table.currentBet).toBe(6)
  })

  it('Step 12: viet call', () => {
    expect(steps[12].label).toBe('viet call')
    expect(steps[12].positions[5].betBalance).toBe(6)
    expect(steps[12].positions[5].chips).toBe(42)
  })

  it('Step 13: cuongvu call', () => {
    expect(steps[13].label).toBe('cuongvu call')
    expect(steps[13].positions[2].betBalance).toBe(6)
    expect(steps[13].positions[2].chips).toBe(70)
  })

  it('Step 14: Turn - 7h', () => {
    expect(steps[14].label).toBe('Turn - 7h')
    expect(steps[14].table.turn).toBe('7h')
    expect(steps[14].pot[0].balance).toBe(31)
  })

  it('Step 15: cuongvu check', () => {
    expect(steps[15].label).toBe('cuongvu check')
  })

  it('Step 16: dealerfromhell2 check', () => {
    expect(steps[16].label).toBe('dealerfromhell2 check')
  })

  it('Step 17: viet bet', () => {
    expect(steps[17].label).toBe('viet bet')
    expect(steps[17].positions[5].betBalance).toBe(8)
    expect(steps[17].positions[5].chips).toBe(34)
    expect(steps[17].table.currentBet).toBe(8)
  })

  it('Step 18: cuongvu call', () => {
    expect(steps[18].label).toBe('cuongvu call')
    expect(steps[18].positions[2].betBalance).toBe(8)
    expect(steps[18].positions[2].chips).toBe(62)
  })

  it('Step 19: dealerfromhell2 call', () => {
    expect(steps[19].label).toBe('dealerfromhell2 call')
    expect(steps[19].positions[3].betBalance).toBe(8)
    expect(steps[19].positions[3].chips).toBe(26)
  })

  it('Step 20: River - 2s', () => {
    expect(steps[20].label).toBe('River - 2s')
    expect(steps[20].table.river).toBe('2s')
    expect(steps[20].pot[0].balance).toBe(55)
  })

  it('Step 21: cuongvu check', () => {
    expect(steps[21].label).toBe('cuongvu check')
  })

  it('Step 22: dealerfromhell2 check', () => {
    expect(steps[22].label).toBe('dealerfromhell2 check')
  })

  it('Step 23: viet bet', () => {
    expect(steps[23].label).toBe('viet bet')
    expect(steps[23].positions[5].betBalance).toBe(12)
    expect(steps[23].positions[5].chips).toBe(22)
    expect(steps[23].table.currentBet).toBe(12)
  })

  it('Step 24: cuongvu fold', () => {
    expect(steps[24].label).toBe('cuongvu fold')
    expect(steps[24].positions[2].isFold).toBe(true)
    expect(steps[24].positions[2].cards).toEqual(['Jd', 'Td'])
  })

  it('Step 25: dealerfromhell2 call', () => {
    expect(steps[25].label).toBe('dealerfromhell2 call')
    expect(steps[25].positions[3].betBalance).toBe(12)
    expect(steps[25].positions[3].chips).toBe(14)
    expect(steps[25].pot[0].balance).toBe(55)
  })

  it('Step 26: Kết thúc', () => {
    expect(steps[26].label).toBe('Kết thúc')
    expect(steps[26].isFinal).toBe(true)
    expect(steps[26].pot[0].balance).toBe(79)
  })

  it('fold cards should be hidden', () => {
    expect(steps[4].positions[4].cards).toEqual([])
    expect(steps[7].positions[1].cards).toEqual([])
    expect(steps[25].positions[2].cards).toEqual([])
  })

  it('final chip counts', () => {
    expect(steps[26].positions[1].chips).toBe(99)
    expect(steps[26].positions[2].chips).toBe(62)
    expect(steps[26].positions[3].chips).toBe(14)
    expect(steps[26].positions[4].chips).toBe(50)
    expect(steps[26].positions[5].chips).toBe(22)
    expect(steps[26].positions[9].chips).toBe(50)
  })
})

describe('case-2-normalizeData', () => {
  const { steps } = normalizeData(mockGameDataCase2)

  it('should have 31 steps', () => {
    expect(steps.length).toBe(31)
  })

  it('Step 0-8: Pre-flop', () => {
    expect(steps[0].label).toBe('Bắt đầu')
    expect(steps[1].label).toBe('Pre-flop')
    expect(steps[2].label).toBe('tuan call')
    expect(steps[3].label).toBe('haha call')
    expect(steps[4].label).toBe('cuongvu fold')
    expect(steps[4].positions[1].cards).toEqual(['6h', '9h'])
    expect(steps[5].label).toBe('manhhuy01 call')
    expect(steps[6].label).toBe('nhat call')
    expect(steps[7].label).toBe('daodaobao fold')
    expect(steps[7].positions[4].cards).toEqual(['2s', '8s'])
    expect(steps[8].label).toBe('lycuong99 check')
  })

  it('Step 9: Flop - 5c Qc 5d', () => {
    expect(steps[9].label).toBe('Flop - 5c Qc 5d')
    expect(steps[9].table.flop).toEqual(['5c', 'Qc', '5d'])
  })

  it('Step 10-19: Flop actions', () => {
    expect(steps[10].label).toBe('lycuong99 check')
    expect(steps[11].label).toBe('tuan check')
    expect(steps[12].label).toBe('haha check')
    expect(steps[13].label).toBe('manhhuy01 bet')
    expect(steps[14].label).toBe('nhat raise to 8')
    expect(steps[15].label).toBe('lycuong99 fold')
    expect(steps[15].positions[5].cards).toEqual(['9s', '8c'])
    expect(steps[16].label).toBe('tuan call')
    expect(steps[17].label).toBe('haha call')
    expect(steps[18].label).toBe('manhhuy01 raise to 16')
    expect(steps[19].label).toBe('nhat all-in')
    expect(steps[20].label).toBe('tuan call')
    expect(steps[21].label).toBe('haha fold')
  })

  it('Step 22: Turn - 2h', () => {
    expect(steps[22].label).toBe('Turn - 2h')
    expect(steps[22].table.turn).toBe('2h')
  })

  it('Step 23-28: Turn actions', () => {
    expect(steps[23].label).toBe('tuan check')
    expect(steps[24].label).toBe('manhhuy01 bet')
    expect(steps[25].label).toBe('tuan call')
  })

  it('Step 26-28: River - Ks', () => {
    expect(steps[26].label).toBe('River - Ks')
    expect(steps[26].table.river).toBe('Ks')
    expect(steps[27].label).toBe('tuan check')
    expect(steps[28].label).toBe('manhhuy01 bet')
    expect(steps[29].label).toBe('tuan call')
  })

  it('Step 30: Kết thúc', () => {
    expect(steps[30].label).toBe('Kết thúc')
    expect(steps[30].isFinal).toBe(true)
    expect(steps[30].positions[2].chips).toBe(63)
    expect(steps[30].positions[3].chips).toBe(0)
    expect(steps[30].positions[7].chips).toBe(66)
    expect(steps[30].positions[8].chips).toBe(116)
  })
})
