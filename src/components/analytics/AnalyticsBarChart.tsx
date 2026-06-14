export interface BarChartItem {
  label: string
  value: number
  sublabel?: string
}

export function AnalyticsBarChart({
  title,
  items,
  valueFormatter,
  emptyMessage,
}: {
  title: string
  items: BarChartItem[]
  valueFormatter: (n: number) => string
  emptyMessage?: string
}) {
  const max = Math.max(...items.map((i) => i.value), 1)

  if (items.length === 0) {
    return (
      <div className="enlight-chart-panel">
        <h3 className="enlight-chart-panel__title">{title}</h3>
        <p className="enlight-body-text">{emptyMessage ?? 'No data yet.'}</p>
      </div>
    )
  }

  return (
    <div className="enlight-chart-panel">
      <h3 className="enlight-chart-panel__title">{title}</h3>
      <div className="enlight-bar-chart">
        {items.map((item) => (
          <div key={item.label} className="enlight-bar-chart__row">
            <div className="enlight-bar-chart__meta">
              <span className="enlight-bar-chart__label">{item.label}</span>
              {item.sublabel && <span className="enlight-bar-chart__sublabel">{item.sublabel}</span>}
            </div>
            <div className="enlight-bar-chart__track" aria-hidden="true">
              <div
                className="enlight-bar-chart__fill"
                style={{ width: `${Math.max(4, (item.value / max) * 100)}%` }}
              />
            </div>
            <span className="enlight-bar-chart__value">{valueFormatter(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
