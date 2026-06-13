import { useMemo, useState } from 'react'
import { GRAPH } from './graphTheme'

const W = 480
const H = 340
const X_MIN = -2
const X_MAX = 14
const Y_MIN = -8
const Y_MAX = 8

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

type CircleCase = 'two' | 'one' | 'zero'

function classify(d: number, r1: number, r2: number): { caseKey: CircleCase; label: string } {
  const sum = r1 + r2
  const diff = Math.abs(r1 - r2)
  const eps = 0.08
  if (d > sum + eps) return { caseKey: 'zero', label: 'Separate — circles do not touch' }
  if (Math.abs(d - sum) <= eps) return { caseKey: 'one', label: 'External tangent — 1 common point' }
  if (d < diff - eps) return { caseKey: 'zero', label: 'One circle inside the other — no touch' }
  if (Math.abs(d - diff) <= eps) return { caseKey: 'one', label: 'Internal tangent — 1 common point' }
  return { caseKey: 'two', label: 'Intersecting — 2 common points' }
}

/** Circle 1: centre (0,0), r1. Circle 2: centre (d,0), r2. */
function circleIntersections(d: number, r1: number, r2: number): { x: number; y: number }[] {
  if (d < 1e-6) return []
  const { caseKey } = classify(d, r1, r2)
  if (caseKey === 'zero') return []

  const x = (d * d + r1 * r1 - r2 * r2) / (2 * d)
  const ySq = r1 * r1 - x * x
  if (ySq < -1e-9) return []
  if (Math.abs(ySq) < 1e-9) return [{ x, y: 0 }]

  const y = Math.sqrt(ySq)
  return [
    { x, y },
    { x, y: -y },
  ]
}

const COLORS = { two: '#34d399', one: '#f59e0b', zero: '#f43f5e' } as const

export function CircleCircleExplorer() {
  const [r1, setR1] = useState(3)
  const [r2, setR2] = useState(2.5)
  const [d, setD] = useState(5)

  const points = useMemo(() => circleIntersections(d, r1, r2), [d, r1, r2])
  const { caseKey, label } = useMemo(() => classify(d, r1, r2), [d, r1, r2])
  const accent = COLORS[caseKey]

  const chipClass =
    caseKey === 'two'
      ? 'line-explorer__disc-chip--green'
      : caseKey === 'one'
        ? 'line-explorer__disc-chip--amber'
        : 'line-explorer__disc-chip--red'

  const centreDist = d
  const sumR = r1 + r2
  const diffR = Math.abs(r1 - r2)

  return (
    <section className="enlight-explorer">
      <h2 className="enlight-explorer__title">Two Circles — Intersection Explorer</h2>
      <p className="enlight-body-text" style={{ marginBottom: 16 }}>
        Compare the distance between centres with <strong>r₁ + r₂</strong> and <strong>|r₁ − r₂|</strong> to see
        whether the circles are separate, tangent, or intersecting.
      </p>

      <div className="enlight-explorer__layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="enlight-discriminant-display">
            <div className="enlight-discriminant-display__label">Circle 1 (purple)</div>
            <div className="enlight-discriminant-display__value" style={{ fontSize: '0.95rem' }}>
              Centre (0, 0), r = {r1}
            </div>
          </div>
          <div className="enlight-slider-group">
            <label htmlFor="cc-r1">
              <strong>r₁</strong> = {r1}
            </label>
            <input id="cc-r1" type="range" min={1} max={5} step={0.25} value={r1} onChange={(e) => setR1(Number(e.target.value))} />
          </div>

          <div className="enlight-discriminant-display">
            <div className="enlight-discriminant-display__label">Circle 2 (teal)</div>
            <div className="enlight-discriminant-display__value" style={{ fontSize: '0.95rem' }}>
              Centre ({d}, 0), r = {r2}
            </div>
          </div>
          <div className="enlight-slider-group">
            <label htmlFor="cc-r2">
              <strong>r₂</strong> = {r2}
            </label>
            <input id="cc-r2" type="range" min={1} max={5} step={0.25} value={r2} onChange={(e) => setR2(Number(e.target.value))} />
          </div>
          <div className="enlight-slider-group">
            <label htmlFor="cc-d">
              <strong>Distance d</strong> between centres = {d}
            </label>
            <input id="cc-d" type="range" min={0.5} max={12} step={0.25} value={d} onChange={(e) => setD(Number(e.target.value))} />
          </div>

          <div className={`line-explorer__disc-chip ${chipClass}`}>
            <span className="line-explorer__disc-value">{label}</span>
            <span className="line-explorer__disc-label circle-explorer__formula-row">
              d = {centreDist.toFixed(2)} · r₁+r₂ = {sumR.toFixed(2)} · |r₁−r₂| = {diffR.toFixed(2)}
            </span>
          </div>

          <div className="circle-explorer__rules">
            <strong>d &gt; r₁ + r₂</strong> → separate<br />
            <strong>d = r₁ + r₂</strong> → external tangent<br />
            <strong>|r₁−r₂| &lt; d &lt; r₁+r₂</strong> → two intersections<br />
            <strong>d = |r₁−r₂|</strong> → internal tangent<br />
            <strong>d &lt; |r₁−r₂|</strong> → one inside, no touch
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

        <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Two circles intersection graph">
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
            rx={scaleX(r1)}
            ry={scaleY(r1)}
            fill="rgba(167, 139, 250, 0.08)"
            stroke="#7c3aed"
            strokeWidth={2}
          />
          <ellipse
            cx={toSvgX(d)}
            cy={toSvgY(0)}
            rx={scaleX(r2)}
            ry={scaleY(r2)}
            fill="rgba(52, 211, 153, 0.08)"
            stroke="#059669"
            strokeWidth={2}
          />

          <line
            x1={toSvgX(0)}
            y1={toSvgY(0)}
            x2={toSvgX(d)}
            y2={toSvgY(0)}
            stroke={accent}
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
          <text x={toSvgX(d / 2)} y={toSvgY(0) + 16} textAnchor="middle" fill={accent} fontSize={9} fontWeight={600}>
            d = {d}
          </text>

          {points.map((p, i) => (
            <g key={i}>
              <circle cx={toSvgX(p.x)} cy={toSvgY(p.y)} r={5} fill="#fff" stroke={accent} strokeWidth={2} />
            </g>
          ))}
        </svg>
      </div>
    </section>
  )
}
