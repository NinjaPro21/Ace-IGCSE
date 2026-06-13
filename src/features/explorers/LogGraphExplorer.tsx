import { useMemo, useState } from 'react'
import { GRAPH } from './graphTheme'

const W = 420
const H = 300
const X_MIN = -2.5
const X_MAX = 12
const Y_MIN = -5
const Y_MAX = 6
const STEP = 0.04

function toSvgX(x: number) {
  return ((x - X_MIN) / (X_MAX - X_MIN)) * W
}
function toSvgY(y: number) {
  return H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * H
}

function logBase(x: number, base: number) {
  return Math.log(x) / Math.log(base)
}

function buildPath(base: number, a: number, h: number, k: number): string {
  const pts: string[] = []
  for (let xi = X_MIN; xi <= X_MAX + STEP / 2; xi += STEP) {
    const arg = xi + h
    if (arg <= 0) continue
    const y = a * logBase(arg, base) + k
    if (y < Y_MIN - 2 || y > Y_MAX + 2) continue
    pts.push(`${toSvgX(xi).toFixed(2)},${toSvgY(y).toFixed(2)}`)
  }
  return pts.join(' ')
}

function fmtCoeff(n: number): string {
  if (n === 1) return ''
  if (n === -1) return '−'
  return n < 0 ? `−${Math.abs(n)}` : `${n}`
}

export function LogGraphExplorer() {
  const [base, setBase] = useState(10)
  const [a, setA] = useState(1)
  const [h, setH] = useState(0)
  const [k, setK] = useState(0)

  // y = a · log_base(x + h) + k
  // asymptote at x = −h, domain x > −h
  const asymptoteX = -h

  const path = useMemo(() => buildPath(base, a, h, k), [base, a, h, k])

  // x-intercept: solve a·log_b(x+h)+k = 0 → x = b^(−k/a) − h
  const xIntercept = useMemo(() => {
    if (Math.abs(a) < 1e-9) return null
    const val = Math.pow(base, -k / a) - h
    return val > asymptoteX ? val : null
  }, [base, a, h, k, asymptoteX])

  // Build equation string
  const hPart = h === 0 ? 'x' : h > 0 ? `(x + ${h})` : `(x − ${Math.abs(h)})`
  const kPart = k === 0 ? '' : k > 0 ? ` + ${k}` : ` − ${Math.abs(k)}`
  const eq = `y = ${fmtCoeff(a)}log${base === 10 ? '' : base === Math.E ? 'e' : base}(${hPart})${kPart}`

  return (
    <section className="enlight-explorer">
      <h2 className="enlight-explorer__title">Logarithm Graph Explorer</h2>
      <div className="enlight-explorer__layout">
        <div>
          <p className="enlight-body-text" style={{ marginBottom: 14 }}>
            Adjust the base and transformations to see how the log graph shifts and stretches.
          </p>

          <div className="enlight-slider-group">
            <label htmlFor="l-base">
              <strong>base</strong> = {base}
              <span style={{ fontWeight: 400, color: 'var(--enlight-text-light)', fontSize: '0.78rem' }}> — changes steepness</span>
            </label>
            <input
              id="l-base"
              type="range"
              min={2}
              max={10}
              step={1}
              value={base}
              onChange={(e) => setBase(Number(e.target.value))}
            />
          </div>

          <div className="enlight-slider-group">
            <label htmlFor="l-a">
              <strong>a</strong> = {a}
              <span style={{ fontWeight: 400, color: 'var(--enlight-text-light)', fontSize: '0.78rem' }}> — vertical stretch / flip</span>
            </label>
            <input
              id="l-a"
              type="range"
              min={-3}
              max={3}
              step={0.5}
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
            />
          </div>

          <div className="enlight-slider-group">
            <label htmlFor="l-h">
              <strong>h</strong> = {h}
              <span style={{ fontWeight: 400, color: 'var(--enlight-text-light)', fontSize: '0.78rem' }}> — horizontal shift</span>
            </label>
            <input
              id="l-h"
              type="range"
              min={-4}
              max={4}
              step={0.5}
              value={h}
              onChange={(e) => setH(Number(e.target.value))}
            />
          </div>

          <div className="enlight-slider-group">
            <label htmlFor="l-k">
              <strong>k</strong> = {k}
              <span style={{ fontWeight: 400, color: 'var(--enlight-text-light)', fontSize: '0.78rem' }}> — vertical shift</span>
            </label>
            <input
              id="l-k"
              type="range"
              min={-4}
              max={4}
              step={0.5}
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
            />
          </div>

          <div className="enlight-discriminant-display" style={{ marginTop: 14 }}>
            <div className="enlight-discriminant-display__value" style={{ fontSize: '0.9rem', letterSpacing: '-0.01em' }}>
              {eq}
            </div>
            <div className="enlight-discriminant-display__label">
              Asymptote: x = {asymptoteX} &nbsp;·&nbsp; Domain: x &gt; {asymptoteX}
            </div>
          </div>

          {xIntercept !== null && (
            <div style={{ fontSize: '0.82rem', color: 'var(--enlight-text-light)', marginTop: 8 }}>
              <strong style={{ color: 'var(--enlight-text)' }}>x-intercept:</strong> x ≈ {xIntercept.toFixed(3)}
            </div>
          )}
        </div>

        <svg
          className="enlight-graph-canvas"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Interactive logarithm graph"
        >
          {[...Array(15)].map((_, i) => {
            const x = X_MIN + (i * (X_MAX - X_MIN)) / 14
            return <line key={`gv${i}`} x1={toSvgX(x)} y1={0} x2={toSvgX(x)} y2={H} stroke={GRAPH.grid} strokeWidth={1} />
          })}
          {[...Array(12)].map((_, i) => {
            const y = Y_MIN + (i * (Y_MAX - Y_MIN)) / 11
            return <line key={`gh${i}`} x1={0} y1={toSvgY(y)} x2={W} y2={toSvgY(y)} stroke={GRAPH.grid} strokeWidth={1} />
          })}

          <line x1={toSvgX(0)} y1={0} x2={toSvgX(0)} y2={H} stroke={GRAPH.axis} strokeWidth={1.5} />
          <line x1={0} y1={toSvgY(0)} x2={W} y2={toSvgY(0)} stroke={GRAPH.axis} strokeWidth={1.5} />
          <text x={toSvgX(0) + 4} y={10} fill={GRAPH.label} fontSize={10}>y</text>
          <text x={W - 10} y={toSvgY(0) - 4} fill={GRAPH.label} fontSize={10}>x</text>

          {[2, 4, 6, 8, 10].map((n) => (
            <text key={`xl${n}`} x={toSvgX(n)} y={toSvgY(0) + 14} textAnchor="middle" fill="#6b7280" fontSize={9}>{n}</text>
          ))}
          {[-4, -2, 2, 4].map((n) => (
            <text key={`yl${n}`} x={toSvgX(0) - 6} y={toSvgY(n) + 3} textAnchor="end" fill="#6b7280" fontSize={9}>{n}</text>
          ))}

          {/* Vertical asymptote — dashed orange */}
          {asymptoteX >= X_MIN && asymptoteX <= X_MAX && (
            <>
              <line
                x1={toSvgX(asymptoteX)} y1={0}
                x2={toSvgX(asymptoteX)} y2={H}
                stroke="#f97316" strokeWidth={1.5} strokeDasharray="5 4"
              />
              <text
                x={toSvgX(asymptoteX) + 4} y={16}
                fill="#f97316" fontSize={9} fontWeight="bold"
              >
                x={asymptoteX}
              </text>
            </>
          )}

          {/* Log curve */}
          <polyline
            points={path}
            fill="none"
            stroke="#a78bfa"
            strokeWidth={2.5}
            strokeLinecap="round"
          />

          {/* x-intercept dot */}
          {xIntercept !== null && xIntercept >= X_MIN && xIntercept <= X_MAX && (
            <g>
              <circle cx={toSvgX(xIntercept)} cy={toSvgY(0)} r={5} fill="#fff" stroke="#a78bfa" strokeWidth={2} />
              <text x={toSvgX(xIntercept) + 7} y={toSvgY(0) - 5} fill="#a78bfa" fontSize={9}>
                ({xIntercept.toFixed(1)}, 0)
              </text>
            </g>
          )}
        </svg>
      </div>
    </section>
  )
}
