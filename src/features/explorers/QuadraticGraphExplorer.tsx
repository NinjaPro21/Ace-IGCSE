import { useMemo, useState } from 'react'
import { GRAPH } from './graphTheme'

const W = 420
const H = 300
const X_MIN = -7
const X_MAX = 7
const Y_MIN = -10
const Y_MAX = 14
const STEP = 0.04

function toSvgX(x: number) {
  return ((x - X_MIN) / (X_MAX - X_MIN)) * W
}
function toSvgY(y: number) {
  return H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * H
}

function calcVertex(a: number, b: number, c: number): [number, number] {
  if (Math.abs(a) < 1e-9) return [0, c]
  const h = -b / (2 * a)
  const k = a * h * h + b * h + c
  return [h, k]
}

function findRoots(a: number, b: number, c: number): number[] {
  if (Math.abs(a) < 1e-9) {
    if (Math.abs(b) < 1e-9) return []
    return [-c / b]
  }
  const disc = b * b - 4 * a * c
  if (disc < -1e-9) return []
  if (Math.abs(disc) < 1e-9) return [-b / (2 * a)]
  const sq = Math.sqrt(disc)
  return [(-b + sq) / (2 * a), (-b - sq) / (2 * a)]
}

function buildPath(a: number, b: number, c: number): string {
  const pts: string[] = []
  for (let xi = X_MIN; xi <= X_MAX + STEP / 2; xi += STEP) {
    const y = a * xi * xi + b * xi + c
    if (y < Y_MIN - 2 || y > Y_MAX + 2) continue
    pts.push(`${toSvgX(xi).toFixed(2)},${toSvgY(y).toFixed(2)}`)
  }
  return pts.join(' ')
}

export function QuadraticGraphExplorer() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(-2)
  const [c, setC] = useState(-3)

  const disc = b * b - 4 * a * c
  const [vx, vy] = useMemo(() => calcVertex(a, b, c), [a, b, c])
  const roots = useMemo(() => findRoots(a, b, c), [a, b, c])
  const path = useMemo(() => buildPath(a, b, c), [a, b, c])

  const natureText =
    disc > 1e-9 ? 'Two distinct real roots' : Math.abs(disc) < 1e-9 ? 'One repeated root' : 'No real roots'
  const natureColor =
    disc > 1e-9 ? '#34d399' : Math.abs(disc) < 1e-9 ? '#f59e0b' : '#f43f5e'

  const aStr = a === 1 ? '' : a === -1 ? '-' : `${a}`
  const bAbs = Math.abs(b)
  const bPart = b === 0 ? '' : ` ${b > 0 ? '+' : '−'} ${bAbs}x`
  const cPart = c === 0 ? '' : ` ${c > 0 ? '+' : '−'} ${Math.abs(c)}`
  const eq = `y = ${aStr}x²${bPart}${cPart}`

  const sliders = [
    { id: 'qa', label: 'a', value: a, set: setA, min: -3, max: 3, step: 0.5, hint: 'opens up / down' },
    { id: 'qb', label: 'b', value: b, set: setB, min: -6, max: 6, step: 0.5, hint: 'shifts vertex left / right' },
    { id: 'qc', label: 'c', value: c, set: setC, min: -8, max: 8, step: 0.5, hint: 'y-intercept' },
  ] as const

  return (
    <section className="enlight-explorer">
      <h2 className="enlight-explorer__title">Quadratic Graph Explorer</h2>
      <div className="enlight-explorer__layout">
        <div>
          <p className="enlight-body-text" style={{ marginBottom: 14 }}>
            Adjust <strong>a</strong>, <strong>b</strong>, <strong>c</strong> to see how the parabola, vertex, and roots change.
          </p>

          {sliders.map(({ id, label, value, set, min, max, step, hint }) => (
            <div className="enlight-slider-group" key={id}>
              <label htmlFor={id}>
                <strong>{label}</strong> = {value} <span style={{ fontWeight: 400, color: 'var(--enlight-text-light)', fontSize: '0.78rem' }}>— {hint}</span>
              </label>
              <input
                id={id}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => set(Number(e.target.value))}
              />
            </div>
          ))}

          <div className="enlight-discriminant-display" style={{ marginTop: 14 }}>
            <div className="enlight-discriminant-display__value" style={{ fontSize: '0.95rem' }}>
              {eq}
            </div>
            <div className="enlight-discriminant-display__label">
              Vertex: ({vx.toFixed(2)}, {vy.toFixed(2)})
            </div>
          </div>

          <div className="enlight-discriminant-display" style={{ marginTop: 8 }}>
            <div className="enlight-discriminant-display__value">Δ = {disc.toFixed(2)}</div>
            <div className="enlight-discriminant-display__label" style={{ color: natureColor }}>
              {natureText}
            </div>
          </div>

          {roots.length > 0 && (
            <div style={{ fontSize: '0.82rem', color: 'var(--enlight-text-light)', marginTop: 8 }}>
              <strong style={{ color: 'var(--enlight-text)' }}>Roots:</strong>{' '}
              {roots.sort((p, q) => p - q).map((r) => r.toFixed(2)).join(', ')}
            </div>
          )}
        </div>

        <svg
          className="enlight-graph-canvas"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Interactive quadratic graph"
        >
          {[...Array(15)].map((_, i) => {
            const x = X_MIN + (i * (X_MAX - X_MIN)) / 14
            return <line key={`gv${i}`} x1={toSvgX(x)} y1={0} x2={toSvgX(x)} y2={H} stroke={GRAPH.grid} strokeWidth={1} />
          })}
          {[...Array(13)].map((_, i) => {
            const y = Y_MIN + (i * (Y_MAX - Y_MIN)) / 12
            return <line key={`gh${i}`} x1={0} y1={toSvgY(y)} x2={W} y2={toSvgY(y)} stroke={GRAPH.grid} strokeWidth={1} />
          })}

          <line x1={toSvgX(0)} y1={0} x2={toSvgX(0)} y2={H} stroke={GRAPH.axis} strokeWidth={1.5} />
          <line x1={0} y1={toSvgY(0)} x2={W} y2={toSvgY(0)} stroke={GRAPH.axis} strokeWidth={1.5} />
          <text x={toSvgX(0) + 4} y={10} fill={GRAPH.label} fontSize={10}>y</text>
          <text x={W - 10} y={toSvgY(0) - 4} fill={GRAPH.label} fontSize={10}>x</text>

          {[-6, -4, -2, 2, 4, 6].map((n) => (
            <text key={`xl${n}`} x={toSvgX(n)} y={toSvgY(0) + 14} textAnchor="middle" fill="#6b7280" fontSize={9}>{n}</text>
          ))}
          {[-8, -4, 4, 8, 12].map((n) => (
            <text key={`yl${n}`} x={toSvgX(0) - 6} y={toSvgY(n) + 3} textAnchor="end" fill="#6b7280" fontSize={9}>{n}</text>
          ))}

          <polyline points={path} fill="none" stroke="#5b8def" strokeWidth={2.5} strokeLinecap="round" />

          {/* Vertex dot */}
          {vx >= X_MIN && vx <= X_MAX && vy >= Y_MIN && vy <= Y_MAX && (
            <g>
              <circle cx={toSvgX(vx)} cy={toSvgY(vy)} r={6} fill="#f59e0b" stroke="#fff" strokeWidth={2} />
              <text x={toSvgX(vx) + 9} y={toSvgY(vy) - 5} fill="#f59e0b" fontSize={9} fontWeight="bold">V</text>
            </g>
          )}

          {/* Root dots */}
          {roots
            .filter((r) => r >= X_MIN && r <= X_MAX)
            .map((r, i) => (
              <circle key={i} cx={toSvgX(r)} cy={toSvgY(0)} r={5} fill="#fff" stroke="#34d399" strokeWidth={2} />
            ))}
        </svg>
      </div>
    </section>
  )
}
