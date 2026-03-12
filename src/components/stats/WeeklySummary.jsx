export default function WeeklySummary({ summary }) {
  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold mb-3">Haftalik xulosa</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[var(--color-success-light)] rounded-xl p-3 text-center">
          <p className="text-2xl font-extrabold text-[var(--color-success)]">{summary.avgScore}%</p>
          <p className="text-[10px] text-[var(--color-text-secondary)]">O'rtacha ball</p>
        </div>
        <div className="bg-[var(--color-water-light)] rounded-xl p-3 text-center">
          <p className="text-2xl font-extrabold text-[var(--color-water)]">{summary.totalWater}</p>
          <p className="text-[10px] text-[var(--color-text-secondary)]">Jami suv (stakan)</p>
        </div>
        <div className="bg-[var(--color-warning-light)] rounded-xl p-3 text-center">
          <p className="text-2xl font-extrabold text-[var(--color-warning)]">{summary.bowelDays}/7</p>
          <p className="text-[10px] text-[var(--color-text-secondary)]">Ich kelish kunlari</p>
        </div>
        <div className="bg-[var(--color-accent-light)] rounded-xl p-3 text-center">
          <p className="text-2xl font-extrabold text-[var(--color-accent)]">{summary.completedTasks}</p>
          <p className="text-[10px] text-[var(--color-text-secondary)]">Bajarilgan vazifalar</p>
        </div>
      </div>
    </div>
  )
}
