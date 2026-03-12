import { Bell, BellOff } from 'lucide-react'

export default function NotificationPermission({ permission, isSupported, onRequest }) {
  if (!isSupported) {
    return (
      <div className="bg-[var(--color-warning-light)] rounded-xl p-3 text-xs text-[var(--color-warning)] flex items-center gap-2">
        <BellOff size={14} className="flex-shrink-0" />
        Bu brauzer bildirishnomalarni qo'llab-quvvatlamaydi. Eslatmalar faqat ilova ochiq bo'lganda ishlaydi.
      </div>
    )
  }

  if (permission === 'granted') {
    return (
      <div className="bg-[var(--color-success-light)] rounded-xl p-3 text-xs text-[var(--color-success)] flex items-center gap-2">
        <Bell size={14} />
        Bildirishnomalar yoqilgan
      </div>
    )
  }

  if (permission === 'denied') {
    return (
      <div className="bg-[var(--color-danger-light)] rounded-xl p-3 text-xs text-[var(--color-danger)] flex items-center gap-2">
        <BellOff size={14} className="flex-shrink-0" />
        Bildirishnomalar bloklangan. Brauzer sozlamalaridan ruxsat bering.
      </div>
    )
  }

  return (
    <button
      onClick={onRequest}
      className="w-full py-2.5 rounded-xl bg-[var(--color-warning)] text-white text-sm font-medium flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
    >
      <Bell size={16} />
      Bildirishnomalarni yoqish
    </button>
  )
}
