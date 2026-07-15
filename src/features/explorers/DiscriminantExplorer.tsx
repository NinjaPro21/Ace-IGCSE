import { useMemo, useState } from 'react'
import { GraphAxes, createGraphMapper } from './GraphAxes'

const A = 1
const B = 2

const W = 400
const H = 280
const X_MIN = -6
const X_MAX = 4
const Y_MIN = -4
const Y_MAX = 12
const MAPPER = createGraphMapper(W, H, X_MIN, X_MAX, Y_MIN, Y_MAX)

function discriminant(c: number): number {
  return B * B - 4 * A * c
}

function nature(delta: number): string {
  if (delta > 0) return 'Two real and distinct roots'
  if (delta === 0) return 'One real repeated root'
  return 'No real roots'
}

function roots(c: number): number[] {
  const d = discriminant(c)
  if (d < 0) return []
  const sqrtD = Math.sqrt(d)
  return [(-B + sqrtD) / (2 * A), (-B - sqrtD) / (2 * A)]
}

export function DiscriminantExplorer() {
  const [c, setC] = useState(0)

  const delta = discriminant(c)
  const rootValues = useMemo(() => roots(c), [c])
  const natureText = nature(delta)

  const pathPoints: string[] = []
  for (let x = X_MIN; x <= X_MAX; x += 0.05) {
    const y = A * x * x + B * x + c
    if (y >= Y_MIN - 2 && y <= Y_MAX + 2) {
      pathPoints.push(`${MAPPER.toX(x)},${MAPPER.toY(y)}`)
    }
  }

  return (
    <section className="ace-explorer">
      <h2 className="ace-explorer__title">Interactive Explorer — Watch the Roots Change</h2>
      <div className="ace-explorer__layout">
        <div>
          <p className="ace-body-text" style={{ marginBottom: 16 }}>
            Adjust <strong>c</strong> in <strong>y = x² + 2x + c</strong>
          </p>
          <div className="ace-slider-group">
            <label htmlFor="c-slider">c = {c}</label>
            <input
              id="c-slider"
              type="range"
              min={-4}
              max={8}
              step={0.5}
              value={c}
              onChange={(e) => setC(Number(e.target.value))}
            />
          </div>
          <div className="ace-discriminant-display">
            <div className="ace-discriminant-display__value">Δ = {delta.toFixed(2)}</div>
            <div className="ace-discriminant-display__label">{natureText}</div>
          </div>
        </div>
        <svg className="ace-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Parabola graph">
          <GraphAxes mapper={MAPPER} gridX={10} gridY={8} />
          <polyline
            points={pathPoints.join(' ')}
            fill="none"
            stroke="#5cb87a"
            strokeWidth={3}
          />
          {rootValues.map((r, i) => (
            <circle key={i} cx={MAPPER.toX(r)} cy={MAPPER.toY(0)} r={6} fill="#fff" stroke="#1a1a1a" strokeWidth={2} />
          ))}
        </svg>
      </div>
    </section>
  )
}
