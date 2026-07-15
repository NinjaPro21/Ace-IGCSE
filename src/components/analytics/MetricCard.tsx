export function MetricCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string
  value: string
  hint?: string
  accent?: 'gold' | 'mint' | 'default'
}) {
  return (
    <div className={`ace-metric-card ace-metric-card--${accent ?? 'default'}`}>
      <span className="ace-metric-card__label">{label}</span>
      <span className="ace-metric-card__value">{value}</span>
      {hint && <span className="ace-metric-card__hint">{hint}</span>}
    </div>
  )
}
