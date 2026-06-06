import { useMemo, useState } from 'react'

const W = 420
const H = 300
const X_MIN = -5
const X_MAX = 5
const Y_MIN = -6
const Y_MAX = 10
const STEP = 0.03

function toSvgX(x: number) {
  return ((x - X_MIN) / (X_MAX - X_MIN)) * W
}
function toSvgY(y: number) {
  return H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * H
}

function evalF(x: number, a: number, b: number, c: number) {
  return a * x * x + b * x + c
}

function findRoots(a: number, b: number, c: number): number[] {
  if (Math.abs(a) < 1e-9) {
    if (Math.abs(b) < 1e-9) return []
    return [-c / b]
  }
  const disc = b * b - 4 * a * c
  if (disc < 0) return []
  if (Math.abs(disc) < 1e-9) return [-b / (2 * a)]
  const sq = Math.sqrt(disc)
  return [(-b + sq) / (2 * a), (-b - sq) / (2 * a)]
}

function buildPath(
  a: number,
  b: number,
  c: number,
  applyModulus: boolean,
): string {
  const points: string[] = []
  for (let xi = X_MIN; xi <= X_MAX + STEP / 2; xi += STEP) {
    const rawY = evalF(xi, a, b, c)
    const y = applyModulus ? Math.abs(rawY) : rawY
    if (y < Y_MIN - 2 || y > Y_MAX + 2) continue
    points.push(`${toSvgX(xi).toFixed(2)},${toSvgY(y).toFixed(2)}`)
  }
  return points.join(' ')
}

function buildReflectedPath(a: number, b: number, c: number): string {
  // Only the segment that was below x-axis (rawY < 0) which gets reflected
  const points: string[] = []
  for (let xi = X_MIN; xi <= X_MAX + STEP / 2; xi += STEP) {
    const rawY = evalF(xi, a, b, c)
    if (rawY >= 0) continue
    const y = -rawY
    if (y > Y_MAX + 2) continue
    points.push(`${toSvgX(xi).toFixed(2)},${toSvgY(y).toFixed(2)}`)
  }
  return points.join(' ')
}

function rootsIntersectionCount(a: number, b: number, c: number): string {
  const roots = findRoots(a, b, c)
  if (roots.length === 0) return 'No real roots — no reflection needed'
  if (roots.length === 1) return 'One repeated root — one cusp point'
  return 'Two distinct roots — two cusp points'
}

export function ModulusExplorer() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(-1)
  const [c, setC] = useState(-2)
  const [modulus, setModulus] = useState(false)

  const roots = useMemo(() => findRoots(a, b, c), [a, b, c])
  const hasNegative = useMemo(() => {
    for (let xi = X_MIN; xi <= X_MAX; xi += STEP) {
      if (evalF(xi, a, b, c) < -1e-6) return true
    }
    return false
  }, [a, b, c])

  const basePath = useMemo(() => buildPath(a, b, c, false), [a, b, c])
  const modPath = useMemo(() => buildPath(a, b, c, true), [a, b, c])
  const reflectedPath = useMemo(() => buildReflectedPath(a, b, c), [a, b, c])
  const cuspLabel = rootsIntersectionCount(a, b, c)

  // Equation strings
  const aStr = a === 1 ? '' : a === -1 ? '-' : `${a}`
  const bAbs = Math.abs(b)
  const bSign = b >= 0 ? '+' : '−'
  const cAbs = Math.abs(c)
  const cSign = c >= 0 ? '+' : '−'
  const eqBase = `${aStr}x² ${bSign} ${bAbs}x ${cSign} ${cAbs}`
  const eqDisplay = modulus ? `y = |${eqBase}|` : `y = ${eqBase}`

  const cuspColor = '#f97316'  // amber
  const lineColor = modulus ? '#34d399' : '#60a5fa'  // teal when modulus on, blue otherwise

  return (
    <section className="enlight-explorer" id="modulus-explorer">
      <h2 className="enlight-explorer__title">
        Interactive Explorer — Modulus Transformation
      </h2>
      <p className="enlight-body-text" style={{ marginBottom: 20 }}>
        Adjust the quadratic coefficients and toggle the modulus switch. Watch
        the negative section reflect upward, forming sharp{' '}
        <strong>cusps</strong> where it meets the x-axis.
      </p>

      <div className="enlight-explorer__layout">
        {/* Controls panel */}
        <div>
          {/* Modulus toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24,
              padding: '12px 16px',
              borderRadius: 10,
              background: modulus ? 'rgba(52,211,153,0.12)' : 'var(--enlight-formula-bg)',
              border: `1.5px solid ${modulus ? '#34d399' : 'var(--enlight-border)'}`,
              transition: 'all 0.3s ease',
            }}
          >
            <button
              id="modulus-toggle"
              type="button"
              onClick={() => setModulus((v) => !v)}
              aria-pressed={modulus}
              style={{
                width: 48,
                height: 26,
                borderRadius: 13,
                border: 'none',
                background: modulus ? '#34d399' : '#cbd5e1',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.25s',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 3,
                  left: modulus ? 25 : 3,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#fff',
                  transition: 'left 0.25s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }}
              />
            </button>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {modulus ? 'Modulus ON — y = |f(x)|' : 'Modulus OFF — y = f(x)'}
            </span>
          </div>

          {/* Coefficient sliders */}
          {(
            [
              { id: 'slider-a', label: 'a', value: a, set: setA, min: -3, max: 3, step: 0.5 },
              { id: 'slider-b', label: 'b', value: b, set: setB, min: -6, max: 6, step: 0.5 },
              { id: 'slider-c', label: 'c', value: c, set: setC, min: -6, max: 6, step: 0.5 },
            ] as const
          ).map(({ id, label, value, set, min, max, step }) => (
            <div className="enlight-slider-group" key={label}>
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

          {/* Live equation display */}
          <div
            className="enlight-discriminant-display"
            style={{ marginTop: 12 }}
          >
            <div
              className="enlight-discriminant-display__value"
              style={{ fontSize: '1.25rem', letterSpacing: '-0.02em' }}
            >
              {eqDisplay}
            </div>
            <div
              className="enlight-discriminant-display__label"
              style={{
                color: roots.length === 2
                  ? 'var(--enlight-mint-text)'
                  : roots.length === 1
                    ? '#92400e'
                    : 'var(--enlight-pink-text)',
              }}
            >
              {cuspLabel}
            </div>
          </div>

          {modulus && hasNegative && (
            <div
              style={{
                marginTop: 12,
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(249,115,22,0.10)',
                border: '1.5px solid #f97316',
                fontSize: '0.85rem',
                color: '#92400e',
              }}
            >
              ⚡ <strong>Cusps visible</strong> — the graph hits the x-axis at a
              sharp angle here. Do <em>not</em> round these off in exam sketches.
            </div>
          )}
        </div>

        {/* SVG canvas */}
        <svg
          className="enlight-graph-canvas"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Interactive modulus graph"
        >
          {/* Grid lines */}
          {[...Array(11)].map((_, i) => {
            const x = X_MIN + (i * (X_MAX - X_MIN)) / 10
            return (
              <line
                key={`gv${i}`}
                x1={toSvgX(x)} y1={0}
                x2={toSvgX(x)} y2={H}
                stroke="#1e2a40" strokeWidth={1}
              />
            )
          })}
          {[...Array(9)].map((_, i) => {
            const y = Y_MIN + (i * (Y_MAX - Y_MIN)) / 8
            return (
              <line
                key={`gh${i}`}
                x1={0} y1={toSvgY(y)}
                x2={W} y2={toSvgY(y)}
                stroke="#1e2a40" strokeWidth={1}
              />
            )
          })}

          {/* Axes */}
          <line x1={toSvgX(0)} y1={0} x2={toSvgX(0)} y2={H} stroke="#4a5568" strokeWidth={1.5} />
          <line x1={0} y1={toSvgY(0)} x2={W} y2={toSvgY(0)} stroke="#4a5568" strokeWidth={1.5} />
          <text x={toSvgX(0) + 4} y={8} fill="#4a5568" fontSize={10}>y</text>
          <text x={W - 12} y={toSvgY(0) - 4} fill="#4a5568" fontSize={10}>x</text>

          {/* Original curve (faint guide when modulus is on) */}
          {modulus && hasNegative && (
            <polyline
              points={basePath}
              fill="none"
              stroke="#60a5fa"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              opacity={0.35}
            />
          )}

          {/* Reflected portion highlight (amber, only when modulus active) */}
          {modulus && reflectedPath.length > 0 && (
            <polyline
              points={reflectedPath}
              fill="none"
              stroke={cuspColor}
              strokeWidth={3}
              strokeLinecap="round"
            />
          )}

          {/* Main curve */}
          <polyline
            points={modulus ? modPath : basePath}
            fill="none"
            stroke={lineColor}
            strokeWidth={3}
            strokeLinecap="round"
            style={{ transition: 'stroke 0.25s' }}
          />

          {/* Cusp / root markers */}
          {roots
            .filter((r) => r >= X_MIN && r <= X_MAX)
            .map((r, i) => (
              <g key={`root-${i}`}>
                <circle
                  cx={toSvgX(r)} cy={toSvgY(0)}
                  r={modulus ? 7 : 5}
                  fill={modulus ? cuspColor : '#fff'}
                  stroke={modulus ? '#fff' : '#1a1a1a'}
                  strokeWidth={2}
                />
                {modulus && (
                  <text
                    x={toSvgX(r)}
                    y={toSvgY(0) - 12}
                    textAnchor="middle"
                    fill={cuspColor}
                    fontSize={9}
                    fontWeight="bold"
                  >
                    cusp
                  </text>
                )}
              </g>
            ))}

          {/* x-axis tick labels */}
          {[-4, -2, 0, 2, 4].map((n) => (
            <text
              key={`xt${n}`}
              x={toSvgX(n)}
              y={toSvgY(0) + 14}
              textAnchor="middle"
              fill="#6b7280"
              fontSize={9}
            >
              {n}
            </text>
          ))}
        </svg>
      </div>
    </section>
  )
}
