// Spiritual "lucky charms" a player can show on their seat. Types must match
// CHARM_TYPES in v-poker-api/charm.js.
export const CHARMS = [
  { type: 'incense', label: 'Thắp nhang' },
  { type: 'clover', label: 'Cỏ may mắn' },
  { type: 'millennium-eye', label: 'Con mắt ngàn năm' },
]

export const CHARM_TYPES = CHARMS.map((c) => c.type)

// How long a charm stays on the seat once it is sent.
export const CHARM_DURATION_MS = 8000
