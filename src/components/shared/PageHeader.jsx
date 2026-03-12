export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="px-4 lg:px-6 pt-6 lg:pt-8 pb-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-[var(--color-text)]">{title}</h1>
        {subtitle && <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{subtitle}</p>}
      </div>
      {action && action}
    </div>
  )
}
