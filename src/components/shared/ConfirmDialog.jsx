export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="card p-6 max-w-sm w-full animate-scale-in" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-medium hover:bg-[var(--color-divider)] transition-colors cursor-pointer"
          >
            Bekor qilish
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-danger text-white text-sm font-semibold hover:bg-[var(--color-danger-dark)] transition-colors cursor-pointer"
          >
            Tasdiqlash
          </button>
        </div>
      </div>
    </div>
  )
}
