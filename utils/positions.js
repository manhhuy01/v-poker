// Tên đầy đủ của các ký hiệu vị trí do server gửi xuống (field namePos).
// Ký hiệu hiển thị trên ghế vẫn là chữ viết tắt, tên đầy đủ chỉ dùng cho tooltip.
export const POSITION_NAMES = {
  D: 'Dealer',
  SB: 'Small blind',
  BB: 'Big blind',
  CO: 'Cut-off',
  UTG: 'Under the gun',
  HJ: 'High jack',
  LJ: 'Low jack',
  'UTG+1': 'Under the gun + 1',
  'UTG+2': 'Under the gun + 2',
}

export const positionName = (namePos) => POSITION_NAMES[namePos] || ''
