export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-[3px] border-[var(--color-border)] border-t-primary rounded-full animate-spin" />
    </div>
  )
}
