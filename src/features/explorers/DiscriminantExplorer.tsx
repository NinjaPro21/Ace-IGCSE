import { useMemo, useState } from 'react'
import { GRAPH } from './graphTheme'

const A = 1
const B = 2

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

  const width = 400
  const height = 280
  const xMin = -6
  const xMax = 4
  const yMin = -4
  const yMax = 12

  const toX = (x: number) => ((x - xMin) / (xMax - xMin)) * width
  const toY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height

  const pathPoints: string[] = []
  for (let x = xMin; x <= xMax; x += 0.05) {
    const y = A * x * x + B * x + c
    if (y >= yMin - 2 && y <= yMax + 2) {
      pathPoints.push(`${toX(x)},${toY(y)}`)
    }
  }

  return (
    <section className="enlight-explorer">
      <h2 className="enlight-explorer__title">Interactive Explorer — Watch the Roots Change</h2>
      <div className="enlight-explorer__layout">
        <div>
          <p className="enlight-body-text" style={{ marginBottom: 16 }}>
            Adjust <strong>c</strong> in $y = x^2 + 2x + c$
          </p>
          <div className="enlight-slider-group">
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
          <div className="enlight-discriminant-display">
            <div className="enlight-discriminant-display__value">Δ = {delta.toFixed(2)}</div>
            <div className="enlight-discriminant-display__label">{natureText}</div>
          </div>
        </div>
        <svg className="enlight-graph-canvas" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Parabola graph">
          {[...Array(11)].map((_, i) => {
            const x = xMin + (i * (xMax - xMin)) / 10
            return (
              <line
                key={`v${i}`}
                x1={toX(x)}
                y1={0}
                x2={toX(x)}
                y2={height}
                stroke="#2a3348"
                strokeWidth={1}
              />
            )
          })}
          {[...Array(9)].map((_, i) => {
            const y = yMin + (i * (yMax - yMin)) / 8
            return (
              <line
                key={`h${i}`}
                x1={0}
                y1={toY(y)}
                x2={width}
                y2={toY(y)}
                stroke="#2a3348"
                strokeWidth={1}
              />
            )
          })}
          <line x1={toX(0)} y1={0} x2={toX(0)} y2={height} stroke={GRAPH.axis} strokeWidth={1.5} />
          <line x1={0} y1={toY(0)} x2={width} y2={toY(0)} stroke={GRAPH.axis} strokeWidth={1.5} />
          <polyline
            points={pathPoints.join(' ')}
            fill="none"
            stroke="#5cb87a"
            strokeWidth={3}
          />
          {rootValues.map((r, i) => (
            <circle key={i} cx={toX(r)} cy={toY(0)} r={6} fill="#fff" stroke="#1a1a1a" strokeWidth={2} />
          ))}
        </svg>
      </div>
    </section>
  )
}
