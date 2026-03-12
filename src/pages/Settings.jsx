import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Moon, Droplets, Trash2, Apple, Info, ChevronDown } from 'lucide-react'
import { useDaily } from '../hooks/useDaily'
import { useDarkMode } from '../hooks/useDarkMode'
import { useNotifications } from '../hooks/useNotifications'
import ReminderSettings from '../components/settings/ReminderSettings'
import DarkModeToggle from '../components/settings/DarkModeToggle'
import NotificationPermission from '../components/settings/NotificationPermission'
import ConfirmDialog from '../components/shared/ConfirmDialog'
import PageHeader from '../components/shared/PageHeader'

export default function Settings() {
  const { todayData, updateTodayData } = useDaily()
  const { mode, setDarkMode } = useDarkMode()
  const { permission, isSupported, reminders, requestPermission, updateReminder } = useNotifications()
  const [showReminders, setShowReminders] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const waterTarget = todayData.water?.target || 10

  const adjustWaterTarget = (delta) => {
    const newTarget = Math.max(5, Math.min(20, waterTarget + delta))
    updateTodayData({ water: { ...todayData.water, target: newTarget } })
  }

  const clearAllData = () => {
    localStorage.removeItem('healthtracker_daily')
    localStorage.removeItem('healthtracker_settings')
    localStorage.removeItem('healthtracker_reminders')
    localStorage.removeItem('healthtracker_darkmode')
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <PageHeader title="Sozlamalar" />

      <div className="px-4 lg:px-6 space-y-4 pb-8">
        {/* Notifications */}
        <div className="card p-4">
          <button
            onClick={() => setShowReminders(!showReminders)}
            className="w-full flex items-center gap-3"
          >
            <Bell size={20} className="text-[var(--color-warning)]" />
            <span className="text-sm font-semibold flex-1 text-left">Bildirishnomalar</span>
            <ChevronDown size={14} className={`text-[var(--color-text-tertiary)] transition-transform ${showReminders ? 'rotate-180' : ''}`} />
          </button>

          {showReminders && (
            <div className="mt-4 space-y-3">
              <NotificationPermission
                permission={permission}
                isSupported={isSupported}
                onRequest={requestPermission}
              />
              <ReminderSettings
                reminders={reminders}
                onUpdate={updateReminder}
              />
            </div>
          )}
        </div>

        {/* Water target */}
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <Droplets size={20} className="text-[var(--color-water)]" />
            <span className="text-sm font-semibold flex-1">Suv maqsadi</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => adjustWaterTarget(-1)}
                className="w-8 h-8 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center text-lg font-bold"
              >
                −
              </button>
              <span className="text-lg font-bold w-6 text-center">{waterTarget}</span>
              <button
                onClick={() => adjustWaterTarget(1)}
                className="w-8 h-8 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center text-lg font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Dark mode */}
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <Moon size={20} className="text-[var(--color-water)]" />
            <span className="text-sm font-semibold flex-1">Qorong'i rejim</span>
          </div>
          <DarkModeToggle mode={mode} onChange={setDarkMode} />
        </div>

        {/* Food guide link */}
        <Link
          to="/food-guide"
          className="card p-4 flex items-center gap-3"
        >
          <Apple size={20} className="text-[var(--color-success)]" />
          <span className="text-sm font-semibold flex-1">Foydali mahsulotlar ro'yxati</span>
          <span className="text-xs">→</span>
        </Link>

        {/* Clear data */}
        <button
          onClick={() => setShowClearConfirm(true)}
          className="w-full card p-4 flex items-center gap-3"
        >
          <Trash2 size={20} className="text-[var(--color-danger)]" />
          <span className="text-sm font-semibold text-[var(--color-danger)]">Ma'lumotlarni tozalash</span>
        </button>

        {/* Disclaimer - hidden on desktop since it's in sidebar */}
        <div className="card p-4 lg:hidden">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-[var(--color-text-secondary)] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--color-text-secondary)]">
              Bu ilova tibbiy maslahat bermaydi. Faqat kundalik odatlarni kuzatish uchun mo'ljallangan.
              Muammo davom etsa, shifokorga murojaat qiling.
              Barcha ma'lumot faqat telefoningizda saqlanadi — maxfiylik to'liq ta'minlanadi.
            </p>
          </div>
        </div>
      </div>

      {showClearConfirm && (
        <ConfirmDialog
          title="Ma'lumotlarni tozalash"
          message="Barcha saqlangan ma'lumotlar o'chiriladi. Bu amalni qaytarib bo'lmaydi."
          onConfirm={clearAllData}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </div>
  )
}
