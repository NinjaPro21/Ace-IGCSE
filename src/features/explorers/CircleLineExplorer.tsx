import { useMemo, useState } from 'react'
import { GRAPH } from './graphTheme'

const W = 480
const H = 340
const X_MIN = -8
const X_MAX = 8
const Y_MIN = -8
const Y_MAX = 8
const R = 5 // x² + y² = 25

function toSvgX(x: number) {
  return ((x - X_MIN) / (X_MAX - X_MIN)) * W
}
function toSvgY(y: number) {
  return H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * H
}
function scaleX(units: number) {
  return units * (W / (X_MAX - X_MIN))
}
function scaleY(units: number) {
  return units * (H / (Y_MAX - Y_MIN))
}

function lineCircleDisc(m: number, c: number) {
  const A = 1 + m * m
  const B = 2 * m * c
  const C = c * c - R * R
  const disc = B * B - 4 * A * C
  return { A, B, C, disc }
}

function lineCircleIntersections(m: number, c: number): { x: number; y: number }[] {
  const { A, B, disc } = lineCircleDisc(m, c)
  if (disc < -1e-9) return []
  if (Math.abs(disc) < 1e-9) {
    const x = -B / (2 * A)
    return [{ x, y: m * x + c }]
  }
  const sq = Math.sqrt(disc)
  const x1 = (-B + sq) / (2 * A)
  const x2 = (-B - sq) / (2 * A)
  return [
    { x: x1, y: m * x1 + c },
    { x: x2, y: m * x2 + c },
  ]
}

const COLORS = { two: '#34d399', one: '#f59e0b', zero: '#f43f5e' } as const

export function CircleLineExplorer() {
  const [m, setM] = useState(1)
  const [c, setC] = useState(0)

  const { disc } = useMemo(() => lineCircleDisc(m, c), [m, c])
  const points = useMemo(() => lineCircleIntersections(m, c), [m, c])

  const caseKey = points.length >= 2 ? 'two' : points.length === 1 ? 'one' : 'zero'
  const lineColor = COLORS[caseKey]

  const label =
    caseKey === 'two'
      ? '2 intersection points — Δ > 0'
      : caseKey === 'one'
        ? '1 intersection (tangent) — Δ = 0'
        : 'No intersection — Δ < 0'

  const chipClass =
    caseKey === 'two'
      ? 'line-explorer__disc-chip--green'
      : caseKey === 'one'
        ? 'line-explorer__disc-chip--amber'
        : 'line-explorer__disc-chip--red'

  const lineLabel =
    c === 0
      ? `y = ${m === 1 ? '' : m === -1 ? '−' : m}x`
      : `y = ${m === 0 ? '' : m === 1 ? '' : m === -1 ? '−' : m}x ${c > 0 ? '+ ' : '− '}${Math.abs(c)}`

  return (
    <section className="enlight-explorer">
      <h2 className="enlight-explorer__title">Line &amp; Circle — Discriminant Explorer</h2>
      <p className="enlight-body-text" style={{ marginBottom: 16 }}>
        Substitute the line into <strong>x² + y² = 25</strong>. The discriminant{' '}
        <strong>Δ = b² − 4ac</strong> tells you whether the line cuts, touches, or misses the circle.
      </p>

      <div className="enlight-explorer__layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="enlight-discriminant-display">
            <div className="enlight-discriminant-display__label">Fixed circle</div>
            <div className="enlight-discriminant-display__value" style={{ fontSize: '1rem' }}>
              x² + y² = 25 &nbsp;(centre O, r = 5)
            </div>
          </div>

          <div className="enlight-slider-group">
            <label htmlFor="cl-m">
              <strong>m</strong> (gradient) = {m}
            </label>
            <input id="cl-m" type="range" min={-3} max={3} step={0.25} value={m} onChange={(e) => setM(Number(e.target.value))} />
          </div>
          <div className="enlight-slider-group">
            <label htmlFor="cl-c">
              <strong>c</strong> (y-intercept) = {c}
            </label>
            <input id="cl-c" type="range" min={-10} max={10} step={0.5} value={c} onChange={(e) => setC(Number(e.target.value))} />
          </div>

          <div className="enlight-discriminant-display">
            <div className="enlight-discriminant-display__label">Line</div>
            <div className="enlight-discriminant-display__value" style={{ fontSize: '1rem' }}>
              {lineLabel}
            </div>
          </div>

          <div className={`line-explorer__disc-chip ${chipClass}`}>
            <span className="line-explorer__disc-value">Δ = {disc.toFixed(2)}</span>
            <span className="line-explorer__disc-label">{label}</span>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--enlight-text-muted)', lineHeight: 1.5 }}>
            <strong>Δ &gt; 0</strong> → line cuts circle twice<br />
            <strong>Δ = 0</strong> → tangent (one touch point)<br />
            <strong>Δ &lt; 0</strong> → line misses the circle
          </div>

          {points.length > 0 && (
            <div style={{ fontSize: '0.82rem', color: 'var(--enlight-text-light)' }}>
              {points.map((p, i) => (
                <div key={i}>
                  Point {points.length > 1 ? i + 1 : ''}: ({p.x.toFixed(2)}, {p.y.toFixed(2)})
                </div>
              ))}
            </div>
          )}
        </div>

        <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Line and circle graph">
          {[...Array(17)].map((_, i) => {
            const x = X_MIN + (i * (X_MAX - X_MIN)) / 16
            return <line key={`v${i}`} x1={toSvgX(x)} y1={0} x2={toSvgX(x)} y2={H} stroke={GRAPH.grid} strokeWidth={1} />
          })}
          {[...Array(17)].map((_, i) => {
            const y = Y_MIN + (i * (Y_MAX - Y_MIN)) / 16
            return <line key={`h${i}`} x1={0} y1={toSvgY(y)} x2={W} y2={toSvgY(y)} stroke={GRAPH.grid} strokeWidth={1} />
          })}
          <line x1={toSvgX(0)} y1={0} x2={toSvgX(0)} y2={H} stroke={GRAPH.axis} strokeWidth={1.5} />
          <line x1={0} y1={toSvgY(0)} x2={W} y2={toSvgY(0)} stroke={GRAPH.axis} strokeWidth={1.5} />

          <ellipse
            cx={toSvgX(0)}
            cy={toSvgY(0)}
            rx={scaleX(R)}
            ry={scaleY(R)}
            fill="rgba(167, 139, 250, 0.08)"
            stroke="#7c3aed"
            strokeWidth={2}
          />
          <text x={toSvgX(0) + 8} y={toSvgY(0) - 8} fill="#7c3aed" fontSize={10} fontWeight={600}>
            O
          </text>

          <line
            x1={toSvgX(X_MIN)}
            y1={toSvgY(m * X_MIN + c)}
            x2={toSvgX(X_MAX)}
            y2={toSvgY(m * X_MAX + c)}
            stroke={lineColor}
            strokeWidth={2.5}
          />

          {points.map((p, i) => (
            <g key={i}>
              <circle cx={toSvgX(p.x)} cy={toSvgY(p.y)} r={5} fill="#fff" stroke={lineColor} strokeWidth={2} />
              <text x={toSvgX(p.x) + 8} y={toSvgY(p.y) - 6} fill={lineColor} fontSize={9}>
                ({p.x.toFixed(1)}, {p.y.toFixed(1)})
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  )
}
