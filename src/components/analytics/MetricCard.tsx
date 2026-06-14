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
    <div className={`enlight-metric-card enlight-metric-card--${accent ?? 'default'}`}>
      <span className="enlight-metric-card__label">{label}</span>
      <span className="enlight-metric-card__value">{value}</span>
      {hint && <span className="enlight-metric-card__hint">{hint}</span>}
    </div>
  )
}
