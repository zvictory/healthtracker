export default function ReminderSettings({ reminders, onUpdate }) {
  return (
    <div className="space-y-2">
      {reminders.map(reminder => (
        <div key={reminder.id} className="flex items-center gap-3 py-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={reminder.enabled}
              onChange={e => onUpdate(reminder.id, { enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[var(--color-border)] peer-checked:bg-primary rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
          </label>
          <div className="flex-1 min-w-0">
            <p className="text-xs truncate">{reminder.message}</p>
          </div>
          <input
            type="time"
            value={reminder.time}
            onChange={e => onUpdate(reminder.id, { time: e.target.value })}
            className="text-xs bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-2 py-1 w-20"
          />
        </div>
      ))}
    </div>
  )
}
