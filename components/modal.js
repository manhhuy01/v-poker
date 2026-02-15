export default function modal({
  children,
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  loading,
  noConfirm,
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>
        <div className="inline-block align-bottom bg-gray-900 border border-white/10 rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full backdrop-blur-xl">
          <div className="px-8 py-8">
            <div className="flex flex-col">
              {children}
            </div>
          </div>
          {
            !noConfirm && (
              <div className="bg-white/5 px-8 py-6 border-t border-white/5 sm:flex sm:flex-row-reverse sm:gap-3">
                <button 
                  onClick={onConfirm} 
                  type="button" 
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center py-4 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-900/40 hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98] transition-all sm:w-auto sm:px-10 sm:text-sm disabled:opacity-50"
                >
                  {
                    loading && (<svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>)
                  }
                  Xác nhận
                </button>
                <button 
                  onClick={onCancel} 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center items-center py-4 bg-white/5 text-gray-400 font-bold uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all sm:mt-0 sm:w-auto sm:px-10 sm:text-sm"
                >
                  Hủy bỏ
                </button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}