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
      <div className="ace-chart-panel">
        <h3 className="ace-chart-panel__title">{title}</h3>
        <p className="ace-body-text">{emptyMessage ?? 'Start a study session to see your activity here.'}</p>
      </div>
    )
  }

  return (
    <div className="ace-chart-panel">
      <h3 className="ace-chart-panel__title">{title}</h3>
      <div className="ace-bar-chart">
        {items.map((item) => (
          <div key={item.label} className="ace-bar-chart__row">
            <div className="ace-bar-chart__meta">
              <span className="ace-bar-chart__label">{item.label}</span>
              {item.sublabel && <span className="ace-bar-chart__sublabel">{item.sublabel}</span>}
            </div>
            <div className="ace-bar-chart__track" aria-hidden="true">
              <div
                className="ace-bar-chart__fill"
                style={{ width: `${Math.max(4, (item.value / max) * 100)}%` }}
              />
            </div>
            <span className="ace-bar-chart__value">{valueFormatter(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
