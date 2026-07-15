import { useMemo, useState } from 'react'
import { GRAPH } from './graphTheme'

const W = 420
const H = 300
const X_MIN = -4
const X_MAX = 8
const Y_MIN = -4
const Y_MAX = 14
const STEP = 0.04

function toSvgX(x: number) {
  return ((x - X_MIN) / (X_MAX - X_MIN)) * W
}
function toSvgY(y: number) {
  return H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * H
}

function buildPath(base: number, a: number, h: number, k: number): string {
  const pts: string[] = []
  for (let xi = X_MIN; xi <= X_MAX + STEP / 2; xi += STEP) {
    const exp = xi - h
    const y = a * Math.pow(base, exp) + k
    if (!Number.isFinite(y) || y < Y_MIN - 2 || y > Y_MAX + 2) continue
    pts.push(`${toSvgX(xi).toFixed(2)},${toSvgY(y).toFixed(2)}`)
  }
  return pts.join(' ')
}

function fmtCoeff(n: number): string {
  if (n === 1) return ''
  if (n === -1) return '−'
  return n < 0 ? `−${Math.abs(n)}` : `${n}`
}

export function ExponentialGraphExplorer() {
  const [base, setBase] = useState(2)
  const [a, setA] = useState(1)
  const [h, setH] = useState(0)
  const [k, setK] = useState(0)

  // y = a · base^(x − h) + k
  const path = useMemo(() => buildPath(base, a, h, k), [base, a, h, k])

  const yIntercept = useMemo(() => a * Math.pow(base, -h) + k, [a, base, h, k])

  const xIntercept = useMemo(() => {
    if (Math.abs(a) < 1e-9 || k >= 0) return null
    const ratio = -k / a
    if (ratio <= 0) return null
    const x = Math.log(ratio) / Math.log(base) + h
    return Number.isFinite(x) ? x : null
  }, [a, base, h, k])

  const hPart = h === 0 ? 'x' : h > 0 ? `(x − ${h})` : `(x + ${Math.abs(h)})`
  const kPart = k === 0 ? '' : k > 0 ? ` + ${k}` : ` − ${Math.abs(k)}`
  const eq = `y = ${fmtCoeff(a)}${base}^(${hPart})${kPart}`

  return (
    <section className="ace-explorer">
      <h2 className="ace-explorer__title">Exponential Graph Explorer</h2>
      <div className="ace-explorer__layout">
        <div>
          <p className="ace-body-text" style={{ marginBottom: 14 }}>
            Explore y = a · b<sup>x−h</sup> + k. Watch how the <strong>y-intercept</strong> and asymptote change.
          </p>

          <div className="ace-slider-group">
            <label htmlFor="e-base">
              <strong>base b</strong> = {base}
              <span style={{ fontWeight: 400, color: 'var(--ace-text-light)', fontSize: '0.78rem' }}> — growth rate</span>
            </label>
            <input
              id="e-base"
              type="range"
              min={2}
              max={5}
              step={0.5}
              value={base}
              onChange={(e) => setBase(Number(e.target.value))}
            />
          </div>

          <div className="ace-slider-group">
            <label htmlFor="e-a">
              <strong>a</strong> = {a}
              <span style={{ fontWeight: 400, color: 'var(--ace-text-light)', fontSize: '0.78rem' }}> — vertical stretch</span>
            </label>
            <input
              id="e-a"
              type="range"
              min={-3}
              max={3}
              step={0.5}
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
            />
          </div>

          <div className="ace-slider-group">
            <label htmlFor="e-h">
              <strong>h</strong> = {h}
              <span style={{ fontWeight: 400, color: 'var(--ace-text-light)', fontSize: '0.78rem' }}> — horizontal shift</span>
            </label>
            <input
              id="e-h"
              type="range"
              min={-3}
              max={3}
              step={0.5}
              value={h}
              onChange={(e) => setH(Number(e.target.value))}
            />
          </div>

          <div className="ace-slider-group">
            <label htmlFor="e-k">
              <strong>k</strong> = {k}
              <span style={{ fontWeight: 400, color: 'var(--ace-text-light)', fontSize: '0.78rem' }}> — vertical shift / asymptote</span>
            </label>
            <input
              id="e-k"
              type="range"
              min={-2}
              max={4}
              step={0.5}
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
            />
          </div>

          <div className="ace-discriminant-display" style={{ marginTop: 14 }}>
            <div className="ace-discriminant-display__value" style={{ fontSize: '0.9rem', letterSpacing: '-0.01em' }}>
              {eq}
            </div>
            <div className="ace-discriminant-display__label">
              Horizontal asymptote: y = {k}
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--ace-text-light)', marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span>
              <strong style={{ color: 'var(--ace-text)' }}>y-intercept</strong> (x = 0):{' '}
              y = {yIntercept.toFixed(2)} &nbsp;→&nbsp; (0, {yIntercept.toFixed(2)})
            </span>
            {xIntercept !== null && xIntercept >= X_MIN && xIntercept <= X_MAX && (
              <span>
                <strong style={{ color: 'var(--ace-text)' }}>x-intercept:</strong> x ≈ {xIntercept.toFixed(3)}
              </span>
            )}
          </div>
        </div>

        <svg
          className="ace-graph-canvas"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Interactive exponential graph"
        >
          {[...Array(13)].map((_, i) => {
            const x = X_MIN + (i * (X_MAX - X_MIN)) / 12
            return <line key={`gv${i}`} x1={toSvgX(x)} y1={0} x2={toSvgX(x)} y2={H} stroke={GRAPH.grid} strokeWidth={1} />
          })}
          {[...Array(10)].map((_, i) => {
            const y = Y_MIN + (i * (Y_MAX - Y_MIN)) / 9
            return <line key={`gh${i}`} x1={0} y1={toSvgY(y)} x2={W} y2={toSvgY(y)} stroke={GRAPH.grid} strokeWidth={1} />
          })}

          <line x1={toSvgX(0)} y1={0} x2={toSvgX(0)} y2={H} stroke={GRAPH.axis} strokeWidth={1.5} />
          <line x1={0} y1={toSvgY(0)} x2={W} y2={toSvgY(0)} stroke={GRAPH.axis} strokeWidth={1.5} />
          <text x={toSvgX(0) + 4} y={10} fill={GRAPH.label} fontSize={10}>y</text>
          <text x={W - 10} y={toSvgY(0) - 4} fill={GRAPH.label} fontSize={10}>x</text>

          {/* Horizontal asymptote */}
          {k >= Y_MIN && k <= Y_MAX && (
            <>
              <line
                x1={0}
                y1={toSvgY(k)}
                x2={W}
                y2={toSvgY(k)}
                stroke="#f97316"
                strokeWidth={1.5}
                strokeDasharray="5 4"
              />
              <text x={8} y={toSvgY(k) - 6} fill="#f97316" fontSize={9} fontWeight="bold">
                y = {k}
              </text>
            </>
          )}

          <polyline points={path} fill="none" stroke="#34d399" strokeWidth={2.5} strokeLinecap="round" />

          {/* y-intercept */}
          {yIntercept >= Y_MIN && yIntercept <= Y_MAX && (
            <g>
              <circle cx={toSvgX(0)} cy={toSvgY(yIntercept)} r={5} fill="#fff" stroke="#059669" strokeWidth={2} />
              <text x={toSvgX(0) + 8} y={toSvgY(yIntercept) - 6} fill="#059669" fontSize={9} fontWeight="bold">
                (0, {yIntercept.toFixed(1)})
              </text>
            </g>
          )}

          {/* x-intercept */}
          {xIntercept !== null && xIntercept >= X_MIN && xIntercept <= X_MAX && (
            <g>
              <circle cx={toSvgX(xIntercept)} cy={toSvgY(0)} r={5} fill="#fff" stroke="#34d399" strokeWidth={2} />
              <text x={toSvgX(xIntercept) + 7} y={toSvgY(0) - 5} fill="#34d399" fontSize={9}>
                ({xIntercept.toFixed(1)}, 0)
              </text>
            </g>
          )}
        </svg>
      </div>
    </section>
  )
}
