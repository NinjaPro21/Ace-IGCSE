import { useMemo, useState } from 'react'
import { GRAPH } from './graphTheme'

const W = 480
const H = 340
const X_MIN = -6
const X_MAX = 6
const Y_MIN = -8
const Y_MAX = 12
const STEP = 0.02

function toSvgX(x: number) {
  return ((x - X_MIN) / (X_MAX - X_MIN)) * W
}
function toSvgY(y: number) {
  return H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * H
}

/** Build SVG polyline points for y = Ax²+Bx+C, clipping to view. */
function buildCurvePath(A: number, B: number, C: number): string {
  const pts: string[] = []
  for (let xi = X_MIN; xi <= X_MAX + STEP / 2; xi += STEP) {
    const y = A * xi * xi + B * xi + C
    if (y < Y_MIN - 2 || y > Y_MAX + 2) continue
    pts.push(`${toSvgX(xi).toFixed(2)},${toSvgY(y).toFixed(2)}`)
  }
  return pts.join(' ')
}

function formatLineLabel(m: number, d: number): string {
  if (m === 0) return d === 0 ? 'y = 0' : `y = ${d}`
  const mPart = m === 1 ? 'x' : m === -1 ? '−x' : `${m}x`
  if (d === 0) return `y = ${mPart}`
  return d > 0 ? `y = ${mPart} + ${d}` : `y = ${mPart} − ${Math.abs(d)}`
}

/**
 * Solve Ax² + (B - m)x + (C - d) = 0 → discriminant = (B-m)² - 4A(C-d)
 */
function computeDiscriminant(A: number, B: number, C: number, m: number, d: number) {
  const effB = B - m
  const effC = C - d
  return effB * effB - 4 * A * effC
}

/** Return real intersection x-values. */
function intersectionXs(A: number, B: number, C: number, m: number, d: number): number[] {
  const effB = B - m
  const effC = C - d
  const disc = effB * effB - 4 * A * effC
  if (disc < -1e-9) return []
  if (Math.abs(disc) < 1e-9) return [-effB / (2 * A)]
  const sq = Math.sqrt(disc)
  return [(-effB + sq) / (2 * A), (-effB - sq) / (2 * A)]
}

const INTERSECTION_COLORS = {
  two: '#34d399',   // emerald
  one: '#f59e0b',   // amber
  zero: '#f43f5e',  // rose
} as const

type IntersectionCase = keyof typeof INTERSECTION_COLORS

export function LineIntersectionExplorer() {
  // Fixed quadratic: y = x² - 2x - 1
  const A = 1
  const B = -2
  const C = -1

  const [m, setM] = useState(1)
  const [d, setD] = useState(2)

  const disc = useMemo(() => computeDiscriminant(A, B, C, m, d), [m, d])
  const xs = useMemo(() => intersectionXs(A, B, C, m, d), [m, d])

  const intersectionCase: IntersectionCase =
    xs.length >= 2 ? 'two' : xs.length === 1 ? 'one' : 'zero'
  const lineColor = INTERSECTION_COLORS[intersectionCase]

  const curvePath = useMemo(() => buildCurvePath(A, B, C), [])

  const intersectionLabel =
    intersectionCase === 'two'
      ? '2 intersection points'
      : intersectionCase === 'one'
        ? '1 intersection (tangent)'
        : '0 intersections'

  const discBgClass =
    intersectionCase === 'two'
      ? 'line-explorer__disc-chip--green'
      : intersectionCase === 'one'
        ? 'line-explorer__disc-chip--amber'
        : 'line-explorer__disc-chip--red'

  // Build label for fixed curve
  const curveLabel = `y = x² − 2x − 1`
  const lineLabel = formatLineLabel(m, d)

  return (
    <section className="enlight-explorer" id="line-intersection-explorer">
      <h2 className="enlight-explorer__title">
        Interactive Explorer — Line &amp; Curve Intersections
      </h2>
      <p className="enlight-body-text" style={{ marginBottom: 20 }}>
        Adjust the gradient (<em>m</em>) and y-intercept (<em>d</em>) of the straight line. The
        discriminant&nbsp;
        <strong>Δ = (B − m)² − 4A(C − d)</strong> tells you how many times the line meets the curve.
      </p>

      <div className="enlight-explorer__layout line-explorer__layout">
        {/* Controls */}
        <div className="line-explorer__controls">
          {/* Curve label */}
          <div className="enlight-discriminant-display">
            <div className="enlight-discriminant-display__label" style={{ marginBottom: 2 }}>
              Fixed curve
            </div>
            <div className="enlight-discriminant-display__value" style={{ fontSize: '1rem' }}>
              {curveLabel}
            </div>
          </div>

          {/* Sliders */}
          {(
            [
              { id: 'slider-m', label: 'm (gradient)', value: m, set: setM, min: -5, max: 5, step: 0.5 },
              { id: 'slider-d', label: 'd (y-intercept)', value: d, set: setD, min: -8, max: 8, step: 0.5 },
            ] as const
          ).map(({ id, label, value, set, min, max, step }) => (
            <div className="enlight-slider-group" key={id}>
              <label htmlFor={id}>
                <strong>{label}</strong> = {value}
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

          {/* Line equation */}
          <div className="enlight-discriminant-display">
            <div className="enlight-discriminant-display__label" style={{ marginBottom: 2 }}>
              Line equation
            </div>
            <div className="enlight-discriminant-display__value" style={{ fontSize: '1rem' }}>
              {lineLabel}
            </div>
          </div>

          {/* Discriminant chip */}
          <div className={`line-explorer__disc-chip ${discBgClass}`}>
            <span className="line-explorer__disc-value">Δ = {disc.toFixed(2)}</span>
            <span className="line-explorer__disc-label">{intersectionLabel}</span>
          </div>

          {intersectionCase === 'two' && xs.length === 2 && (
            <div className="line-explorer__coords">
              <strong>x =</strong>{' '}
              {xs
                .map((x) => x.toFixed(2))
                .sort((a, b) => Number(a) - Number(b))
                .join(', ')}
            </div>
          )}
          {intersectionCase === 'one' && xs.length === 1 && (
            <div className="line-explorer__coords">
              <strong>x =</strong> {xs[0].toFixed(2)} (tangent point)
            </div>
          )}
        </div>

        {/* SVG Canvas */}
        <div className="line-explorer__graph-wrap">
        <svg
          className="enlight-graph-canvas"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Interactive line and curve intersection graph"
        >
          {/* Grid */}
          {[...Array(13)].map((_, i) => {
            const x = X_MIN + (i * (X_MAX - X_MIN)) / 12
            return (
              <line key={`gv${i}`} x1={toSvgX(x)} y1={0} x2={toSvgX(x)} y2={H}
                stroke={GRAPH.grid} strokeWidth={1} />
            )
          })}
          {[...Array(11)].map((_, i) => {
            const y = Y_MIN + (i * (Y_MAX - Y_MIN)) / 10
            return (
              <line key={`gh${i}`} x1={0} y1={toSvgY(y)} x2={W} y2={toSvgY(y)}
                stroke={GRAPH.grid} strokeWidth={1} />
            )
          })}

          {/* Axes */}
          <line x1={toSvgX(0)} y1={0} x2={toSvgX(0)} y2={H}
            stroke={GRAPH.axis} strokeWidth={1.5} />
          <line x1={0} y1={toSvgY(0)} x2={W} y2={toSvgY(0)}
            stroke={GRAPH.axis} strokeWidth={1.5} />
          <text x={toSvgX(0) + 4} y={10} fill={GRAPH.label} fontSize={10}>y</text>
          <text x={W - 12} y={toSvgY(0) - 4} fill={GRAPH.label} fontSize={10}>x</text>

          {/* Axis labels */}
          {[-4, -2, 2, 4].map((n) => (
            <text key={`xl${n}`} x={toSvgX(n)} y={toSvgY(0) + 14}
              textAnchor="middle" fill="#6b7280" fontSize={9}>{n}</text>
          ))}
          {[-4, -2, 2, 4, 6, 8].map((n) => (
            <text key={`yl${n}`} x={toSvgX(0) - 6} y={toSvgY(n) + 3}
              textAnchor="end" fill="#6b7280" fontSize={9}>{n}</text>
          ))}

          {/* Quadratic curve */}
          <polyline
            points={curvePath}
            fill="none"
            stroke="#60a5fa"
            strokeWidth={2.5}
            strokeLinecap="round"
          />

          {/* Straight line — viewBox clips endpoints naturally */}
          <line
            x1={toSvgX(X_MIN)}
            y1={toSvgY(m * X_MIN + d)}
            x2={toSvgX(X_MAX)}
            y2={toSvgY(m * X_MAX + d)}
            stroke={lineColor}
            strokeWidth={2.5}
            strokeDasharray={intersectionCase === 'zero' ? '6 4' : undefined}
            style={{ transition: 'stroke 0.25s' }}
          />

          {/* Intersection dots */}
          {xs
            .filter((x) => x >= X_MIN && x <= X_MAX)
            .map((x, i) => {
              const y = m * x + d
              if (y < Y_MIN || y > Y_MAX) return null
              return (
                <g key={`int${i}`}>
                  <circle
                    cx={toSvgX(x)} cy={toSvgY(y)}
                    r={6}
                    fill={lineColor}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                  <text
                    x={toSvgX(x) + 8} y={toSvgY(y) - 6}
                    fill={lineColor}
                    fontSize={9}
                    fontWeight="bold"
                  >
                    ({x.toFixed(2)}, {y.toFixed(2)})
                  </text>
                </g>
              )
            })}
        </svg>
        </div>
      </div>
    </section>
  )
}
