import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Moon, Droplets, Trash2, Apple, Info, ChevronDown, RotateCcw, Globe } from 'lucide-react'
import { useDaily } from '../hooks/useDaily'
import { useDarkMode } from '../hooks/useDarkMode'
import { useNotifications } from '../hooks/useNotifications'
import { useOnboarding } from '../hooks/useOnboarding'
import { useTranslation } from '../hooks/useTranslation'
import ReminderSettings from '../components/settings/ReminderSettings'
import DarkModeToggle from '../components/settings/DarkModeToggle'
import NotificationPermission from '../components/settings/NotificationPermission'
import ConfirmDialog from '../components/shared/ConfirmDialog'
import PageHeader from '../components/shared/PageHeader'

const LANGUAGES = [
  { code: 'uz', label: "O'zbekcha" },
  { code: 'ru', label: 'Русский' },
]

export default function Settings() {
  const { todayData, updateTodayData } = useDaily()
  const { mode, setDarkMode } = useDarkMode()
  const { permission, isSupported, reminders, requestPermission, updateReminder } = useNotifications()
  const { resetOnboarding } = useOnboarding()
  const { t, lang, setLang } = useTranslation()
  const navigate = useNavigate()
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
    localStorage.removeItem('healthtracker_onboarding')
    localStorage.removeItem('healthtracker_profile')
    window.location.reload()
  }

  return (
    <div>
      <PageHeader title={t('settings.title')} />

      <div className="px-4 lg:px-6 space-y-3 pb-8">
        {/* Language */}
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <Globe size={18} className="text-primary" />
            </div>
            <span className="text-sm font-semibold flex-1">{t('settings.language')}</span>
            <div className="flex rounded-xl overflow-hidden border border-[var(--color-divider)]">
              {LANGUAGES.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    lang === code
                      ? 'bg-primary text-white'
                      : 'bg-[var(--color-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-divider)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-5">
          <button
            onClick={() => setShowReminders(!showReminders)}
            className="w-full flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-warning-light)] flex items-center justify-center flex-shrink-0">
              <Bell size={18} className="text-[var(--color-warning)]" />
            </div>
            <span className="text-sm font-semibold flex-1 text-left">{t('settings.notifications')}</span>
            <ChevronDown size={14} className={`text-[var(--color-text-tertiary)] transition-transform duration-200 ${showReminders ? 'rotate-180' : ''}`} />
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
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-water-light)] flex items-center justify-center flex-shrink-0">
              <Droplets size={18} className="text-[var(--color-water)]" />
            </div>
            <span className="text-sm font-semibold flex-1">{t('settings.water_goal')}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => adjustWaterTarget(-1)}
                className="w-9 h-9 rounded-xl bg-[var(--color-divider)] flex items-center justify-center text-lg font-bold cursor-pointer active:scale-95 transition-transform"
              >
                −
              </button>
              <span className="text-lg font-bold w-6 text-center">{waterTarget}</span>
              <button
                onClick={() => adjustWaterTarget(1)}
                className="w-9 h-9 rounded-xl bg-[var(--color-divider)] flex items-center justify-center text-lg font-bold cursor-pointer active:scale-95 transition-transform"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Dark mode */}
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-water-light)] flex items-center justify-center flex-shrink-0">
              <Moon size={18} className="text-[var(--color-water)]" />
            </div>
            <span className="text-sm font-semibold flex-1">{t('settings.dark_mode')}</span>
          </div>
          <DarkModeToggle mode={mode} onChange={setDarkMode} />
        </div>

        {/* Food guide link */}
        <Link
          to="/food-guide"
          className="card card-hover p-5 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-[var(--color-success-light)] flex items-center justify-center flex-shrink-0">
            <Apple size={18} className="text-[var(--color-success)]" />
          </div>
          <span className="text-sm font-semibold flex-1">{t('settings.food_list')}</span>
          <span className="text-xs text-[var(--color-text-tertiary)]">→</span>
        </Link>

        {/* Restart onboarding */}
        <button
          onClick={() => { resetOnboarding(); navigate('/onboarding') }}
          className="w-full card card-hover p-5 flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-[var(--color-divider)] flex items-center justify-center flex-shrink-0">
            <RotateCcw size={18} className="text-[var(--color-text-secondary)]" />
          </div>
          <span className="text-sm font-semibold">{t('settings.re_onboarding')}</span>
        </button>

        {/* Clear data */}
        <button
          onClick={() => setShowClearConfirm(true)}
          className="w-full card p-5 flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-[var(--color-danger-light)] flex items-center justify-center flex-shrink-0">
            <Trash2 size={18} className="text-[var(--color-danger)]" />
          </div>
          <span className="text-sm font-semibold text-[var(--color-danger)]">{t('settings.clear_data')}</span>
        </button>

        {/* Disclaimer - hidden on desktop since it's in sidebar */}
        <div className="card p-5 lg:hidden">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-divider)] flex items-center justify-center flex-shrink-0">
              <Info size={16} className="text-[var(--color-text-tertiary)]" />
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              {t('settings.disclaimer')}
            </p>
          </div>
        </div>
      </div>

      {showClearConfirm && (
        <ConfirmDialog
          title={t('settings.clear_data_confirm_title')}
          message={t('settings.clear_data_confirm_msg')}
          onConfirm={clearAllData}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </div>
  )
}
