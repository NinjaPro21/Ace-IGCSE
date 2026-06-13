import { useMemo, useState } from 'react'
import { GRAPH } from './graphTheme'

type TrigFn = 'sin' | 'cos' | 'tan'

function degToRad(d: number): number {
  return (d * Math.PI) / 180
}

function evaluate(fn: TrigFn, xDeg: number, a: number, b: number, c: number, d: number): number {
  const x = degToRad(b * xDeg + c)
  if (fn === 'sin') return a * Math.sin(x) + d
  if (fn === 'cos') return a * Math.cos(x) + d
  const v = a * Math.tan(x) + d
  if (!Number.isFinite(v)) return NaN
  return Math.max(-4, Math.min(4, v))
}

export function TrigGraphExplorer() {
  const [fn, setFn] = useState<TrigFn>('sin')
  const [a, setA] = useState(1)
  const [b, setB] = useState(1)
  const [c, setC] = useState(0)
  const [d, setD] = useState(0)

  const period = fn === 'tan' ? 180 / Math.abs(b || 1) : 360 / Math.abs(b || 1)
  const amplitude = fn === 'tan' ? '∞' : String(Math.abs(a))
  const maxVal = fn === 'tan' ? '∞' : (a + d).toFixed(2)
  const minVal = fn === 'tan' ? '∞' : (-a + d).toFixed(2)

  const equation =
    fn === 'sin'
      ? `y = ${a}·sin(${b}x + ${c}°) + ${d}`
      : fn === 'cos'
        ? `y = ${a}·cos(${b}x + ${c}°) + ${d}`
        : `y = ${a}·tan(${b}x + ${c}°) + ${d}`

  const width = 560
  const height = 220
  const points = useMemo(() => {
    const pts: string[] = []
    for (let xDeg = 0; xDeg <= 360; xDeg += 2) {
      const y = evaluate(fn, xDeg, a, b, c, d)
      if (Number.isNaN(y)) continue
      const px = (xDeg / 360) * width
      const py = height / 2 - (y / 4) * (height / 2 - 10)
      pts.push(`${px},${py}`)
    }
    return pts.join(' ')
  }, [fn, a, b, c, d])

  const sliders = [
    { key: 'a', label: 'a — amplitude', value: a, set: setA, min: 0.5, max: 3, step: 0.1, color: '#e67e22' },
    { key: 'b', label: 'b — frequency', value: b, set: setB, min: 0.5, max: 3, step: 0.1, color: '#27ae60' },
    { key: 'c', label: 'c — phase (°)', value: c, set: setC, min: -180, max: 180, step: 5, color: '#3498db' },
    { key: 'd', label: 'd — vertical shift', value: d, set: setD, min: -2, max: 2, step: 0.1, color: '#9b59b6' },
  ] as const

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--enlight-font-serif)', margin: '0 0 8px' }}>Interactive Graph Explorer</h3>
          <p style={{ fontFamily: 'var(--enlight-font-mono)', fontSize: '0.85rem', margin: 0 }}>
            y = a · f(bx + c°) + d
          </p>
        </div>
        <span className="enlight-badge enlight-badge--mint">FREE PREVIEW</span>
      </div>

      <div className="enlight-trig-tabs">
        {(['sin', 'cos', 'tan'] as TrigFn[]).map((f) => (
          <button
            key={f}
            type="button"
            className={`enlight-trig-tabs__btn${fn === f ? ' enlight-trig-tabs__btn--active' : ''}`}
            onClick={() => setFn(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="enlight-trig-equation">{equation}</div>

      <svg className="enlight-graph-canvas" viewBox={`0 0 ${width} ${height}`} style={{ minHeight: 220 }}>
        {[0, 90, 180, 270, 360].map((deg) => (
          <g key={deg}>
            <line
              x1={(deg / 360) * width}
              y1={0}
              x2={(deg / 360) * width}
              y2={height}
              stroke="#2a3348"
              strokeWidth={1}
            />
            <text
              x={(deg / 360) * width}
              y={height - 4}
              fill={GRAPH.muted}
              fontSize={10}
              textAnchor="middle"
            >
              {deg}°
            </text>
          </g>
        ))}
        <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke={GRAPH.axis} />
        <polyline points={points} fill="none" stroke="#5b8def" strokeWidth={2.5} />
      </svg>

      <div className="enlight-trig-stats">
        <div className="enlight-trig-stat">
          <div className="enlight-trig-stat__label">Amplitude</div>
          <div className="enlight-trig-stat__value" style={{ color: '#e67e22' }}>{amplitude}</div>
        </div>
        <div className="enlight-trig-stat">
          <div className="enlight-trig-stat__label">Period</div>
          <div className="enlight-trig-stat__value" style={{ color: '#27ae60' }}>{period.toFixed(0)}°</div>
        </div>
        <div className="enlight-trig-stat">
          <div className="enlight-trig-stat__label">Max</div>
          <div className="enlight-trig-stat__value" style={{ color: '#e67e22' }}>{maxVal}</div>
        </div>
        <div className="enlight-trig-stat">
          <div className="enlight-trig-stat__label">Min</div>
          <div className="enlight-trig-stat__value" style={{ color: '#9b59b6' }}>{minVal}</div>
        </div>
      </div>

      <div className="enlight-trig-sliders">
        {sliders.map((s) => (
          <div key={s.key} className="enlight-trig-slider-row">
            <label>{s.label}</label>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              onChange={(e) => s.set(Number(e.target.value))}
              style={{ accentColor: s.color }}
            />
            <input
              type="number"
              value={s.value}
              step={s.step}
              onChange={(e) => s.set(Number(e.target.value))}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
