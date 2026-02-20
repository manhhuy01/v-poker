import { useState, useEffect, useRef } from 'react'
import Modal from './modal'

export default function BetModal({ isOpen, onClose, onConfirm, loading, data }) {
  const [betValue, setBetValue] = useState(0)
  const [sliderIndex, setSliderIndex] = useState(0)
  const betInputRef = useRef(null)

  const bb = (data?.setting?.smallBlind || 0) * 2
  const minBet = Math.max(bb, (data?.table?.currentBet || 0) - (data?.user?.position?.betBalance || 0))
  const maxBalance = data?.user?.accBalance || 0

  const milestones = [
    { label: '1x BB', value: bb * 1 },
    { label: '2x BB', value: bb * 2 },
    { label: '4x BB', value: bb * 4 },
    { label: '6x BB', value: bb * 6 },
    { label: '8x BB', value: bb * 8 },
    { label: '10x BB', value: bb * 10 },
    { label: 'ALL-IN', value: maxBalance, isAllIn: true }
  ].filter(m => m.value <= maxBalance && m.value >= minBet)

  // Ensure there's always at least one milestone or a default range
  const finalMilestones = milestones.length > 0 ? milestones : [{ label: 'MIN', value: minBet }, { label: 'ALL-IN', value: maxBalance, isAllIn: true }]

  useEffect(() => {
    if (isOpen) {
      setBetValue(minBet)
      setSliderIndex(0)
    }
  }, [isOpen, minBet])

  const handleSliderChange = (e) => {
    const index = parseInt(e.target.value)
    setSliderIndex(index)
    const val = finalMilestones[index].value
    setBetValue(val)
    if (betInputRef.current) {
      betInputRef.current.value = finalMilestones[index].isAllIn ? 'all-in' : val
    }
  }

  const handleInputChange = (e) => {
    const val = e.target.value
    if (val === 'all-in') {
      setBetValue(maxBalance)
    } else {
      setBetValue(parseInt(val) || 0)
    }
  }

  const handleConfirm = () => {
    const finalVal = betInputRef.current?.value || betValue
    onConfirm(finalVal)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      loading={loading}
      onCancel={onClose}
      onConfirm={handleConfirm}
      position="top"
    >
      <div className="flex flex-col w-full max-h-[45dvh] overflow-y-auto no-scrollbar space-y-4 py-2">
        <div className="text-center">
          <h3 className="text-base font-black uppercase tracking-tight text-white">Đưa ra mức cược</h3>
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
            Min: <span className="text-white">{minBet.toLocaleString()}</span> • 
            Max: <span className="text-emerald-400">{(maxBalance).toLocaleString()}</span>
          </p>
        </div>

        <div className="space-y-6 px-2">
          {/* Slider Container */}
          <div className="relative pt-6 pb-2">
            <input
              type="range"
              min="0"
              max={finalMilestones.length - 1}
              step="1"
              value={sliderIndex}
              onChange={handleSliderChange}
              className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between mt-4">
              {finalMilestones.map((m, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col items-center cursor-pointer transition-all ${i === sliderIndex ? 'scale-110' : 'opacity-40'}`}
                  onClick={() => handleSliderChange({ target: { value: i }})}
                >
                  <span className={`text-[8px] font-black uppercase mb-1 ${m.isAllIn ? 'text-rose-500' : 'text-indigo-400'}`}>
                    {m.label}
                  </span>
                  <span className="text-[10px] font-bold text-white whitespace-nowrap">
                    {m.isAllIn ? '∞' : m.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
            <input
              ref={betInputRef}
              type="text"
              autoFocus={false}
              defaultValue={minBet}
              onChange={handleInputChange}
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white font-black text-xl text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-500 tracking-widest">CHIPS</div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
