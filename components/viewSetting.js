import { useState } from 'react'
import { useToasts } from 'react-toast-notifications'

import Modal from './modal'
import { useUiVersion } from './uiVersion'
import { UI_VERSIONS } from '../utils/uiVersion'

const OPTIONS = [
  {
    value: UI_VERSIONS.V1,
    label: 'V1 · Cổ điển',
    description: 'Bàn chơi cơ bản, quen thuộc và ổn định.',
    swatch: 'from-emerald-600 to-emerald-900',
  },
  {
    value: UI_VERSIONS.V2,
    label: 'V2 · Hiện đại',
    description: 'Bố cục mới, cảm giác chuyên nghiệp như sòng bài thật.',
    swatch: 'from-slate-700 via-slate-900 to-emerald-900',
  },
  {
    value: UI_VERSIONS.V3,
    label: 'V3 · Ngọt ngào',
    description: 'Tông sáng pastel, icon dễ thương, hợp gu nữ tính và em bé.',
    swatch: 'from-pink-200 via-rose-200 to-amber-100',
  },
]

const TOASTS = {
  [UI_VERSIONS.V1]: 'Đã chuyển về giao diện V1',
  [UI_VERSIONS.V2]: 'Đã chuyển sang giao diện V2',
  [UI_VERSIONS.V3]: 'Đã chuyển sang giao diện V3 ngọt ngào',
}

export default function ViewSetting({ onCloseMenu }) {
  const [isOpen, setOpen] = useState(false)
  const { version, setVersion } = useUiVersion()
  const { addToast } = useToasts()

  const chooseVersion = (nextVersion) => {
    setVersion(nextVersion)
    setOpen(false)
    if (onCloseMenu) onCloseMenu()
    addToast(TOASTS[nextVersion] || TOASTS[UI_VERSIONS.V1], { appearance: 'success' })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors flex items-center space-x-3"
      >
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 7a1 1 0 011-1h6a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1v-7zm10 0a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
        </svg>
        <span>Giao diện bàn chơi</span>
        <span className="ml-auto rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-indigo-300">
          {version}
        </span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        noConfirm={true}
        position="center"
      >
        <div className="w-full space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white">
                Giao diện bàn chơi
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Chọn giao diện bạn muốn dùng. Có thể đổi bất kỳ lúc nào.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Đóng"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3" role="radiogroup" aria-label="Chọn giao diện bàn chơi">
            {OPTIONS.map((option) => {
              const isActive = option.value === version

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => chooseVersion(option.value)}
                  className={`w-full text-left rounded-2xl border p-4 transition-all active:scale-[0.99] ${
                    isActive
                      ? 'border-emerald-400/60 bg-emerald-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${option.swatch} border border-white/20 shadow-inner`}
                      />
                      <div>
                        <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-white">
                          {option.label}
                          {option.value === UI_VERSIONS.V3 && (
                            <span className="rounded-full bg-pink-400/20 px-2 py-0.5 text-[9px] font-black tracking-widest text-pink-200">
                              NEW
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-gray-400">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        isActive
                          ? 'border-emerald-400 bg-emerald-400 text-gray-900'
                          : 'border-white/20 text-transparent'
                      }`}
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-xs leading-relaxed text-indigo-200">
              Lựa chọn chỉ được lưu trên trình duyệt này, không gửi lên server và không ảnh hưởng tới người chơi khác.
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}
