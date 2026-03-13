export default function PageHeader({ title, subtitle, action, eyebrow = "Sog'liq kuzatuvi" }) {
  return (
    <div className="px-1 pt-4 lg:pt-6 pb-4">
      <div className="card relative overflow-hidden px-5 py-5 lg:px-6 lg:py-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="section-kicker">{eyebrow}</span>
            <h1 className="mt-3 text-2xl lg:text-[2rem] font-extrabold tracking-[-0.03em] text-[var(--color-text)]">{title}</h1>
            {subtitle && <p className="text-sm lg:text-[15px] text-[var(--color-text-secondary)] mt-1.5 max-w-2xl">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
    </div>
  )
}
