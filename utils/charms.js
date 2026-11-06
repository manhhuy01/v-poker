// Spiritual "lucky charms" a player can show on their seat. Types must match
// CHARM_TYPES in v-poker-api/charm.js.
export const CHARMS = [
  { type: 'incense', label: 'Thắp nhang' },
  { type: 'clover', label: 'Cỏ may mắn' },
  { type: 'millennium-eye', label: 'Con mắt ngàn năm' },
  { type: 'money', label: 'Tiền về' },
  { type: 'angry', label: 'Tức giận' },
  { type: 'dice', label: 'Xúc xắc' },
]

// The dice is rolled on the sender's client and sent along, so every seat
// shows the same result.
export const rollDice = () => 1 + Math.floor(Math.random() * 6)

export const CHARM_TYPES = CHARMS.map((c) => c.type)

// How long a charm stays on the seat once it is sent.
export const CHARM_DURATION_MS = 8000
