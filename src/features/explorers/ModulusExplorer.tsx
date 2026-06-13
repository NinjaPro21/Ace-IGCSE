import { useMemo, useState } from 'react'
import { GRAPH } from './graphTheme'

const W = 480
const H = 280
const X_MIN = -5
const X_MAX = 5
const Y_MIN = -3
const Y_MAX = 8
const STEP = 0.05

function toSvgX(x: number) {
  return ((x - X_MIN) / (X_MAX - X_MIN)) * W
}
function toSvgY(y: number) {
  return H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * H
}

function evalLinear(x: number, a: number, b: number, c: number) {
  return a * (x + b) + c
}

function evalModulus(x: number, a: number, b: number, c: number) {
  return a * Math.abs(x + b) + c
}

function buildPath(evalFn: (x: number) => number): string {
  const pts: string[] = []
  for (let x = X_MIN; x <= X_MAX + STEP / 2; x += STEP) {
    const y = evalFn(x)
    if (y < Y_MIN - 1 || y > Y_MAX + 1) continue
    pts.push(`${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`)
  }
  return pts.join(' ')
}

function formatLinearEquation(a: number, b: number, c: number): string {
  const aStr = a === 1 ? '' : a === -1 ? '−' : `${a}`
  const inner = b === 0 ? 'x' : b > 0 ? `(x + ${b})` : `(x − ${Math.abs(b)})`
  const cPart = c === 0 ? '' : c > 0 ? ` + ${c}` : ` − ${Math.abs(c)}`
  return `y = ${aStr}${inner}${cPart}`
}

function formatEquation(a: number, b: number, c: number): string {
  const aStr = a === 1 ? '' : a === -1 ? '−' : `${a} · `
  const inner = b === 0 ? 'x' : b > 0 ? `x + ${b}` : `x − ${Math.abs(b)}`
  const cPart = c === 0 ? '' : c > 0 ? ` + ${c}` : ` − ${Math.abs(c)}`
  return `y = ${aStr}|${inner}|${cPart}`
}

export function ModulusExplorer() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(0)
  const [c, setC] = useState(0)

  const path = useMemo(() => buildPath((x) => evalModulus(x, a, b, c)), [a, b, c])
  const linearPath = useMemo(() => buildPath((x) => evalLinear(x, a, b, c)), [a, b, c])
  const hasFold = a !== 0
  const vertexX = -b
  const vertexY = c
  const vertexInView = vertexX >= X_MIN && vertexX <= X_MAX && vertexY >= Y_MIN && vertexY <= Y_MAX

  return (
    <section className="enlight-explorer" id="modulus-explorer">
      <h2 className="enlight-explorer__title">Modulus Graph Explorer</h2>
      <p className="enlight-body-text" style={{ marginBottom: 20 }}>
        Explore <strong>y = a|x + b| + c</strong>. The dashed line shows the linear graph{' '}
        <strong>before</strong> the modulus — fold the negative side up to get the V-shape.
      </p>

      <div className="enlight-modulus-sliders">
        <div className="enlight-modulus-slider enlight-modulus-slider--a">
          <label htmlFor="mod-a">
            <strong>a</strong> = {a} <span className="enlight-modulus-slider__hint">(neg = flip)</span>
          </label>
          <input id="mod-a" type="range" min={-2} max={2} step={0.25} value={a} onChange={(e) => setA(Number(e.target.value))} />
        </div>
        <div className="enlight-modulus-slider enlight-modulus-slider--b">
          <label htmlFor="mod-b">
            <strong>b</strong> = {b} <span className="enlight-modulus-slider__hint">(h. shift)</span>
          </label>
          <input id="mod-b" type="range" min={-4} max={4} step={0.5} value={b} onChange={(e) => setB(Number(e.target.value))} />
        </div>
        <div className="enlight-modulus-slider enlight-modulus-slider--c">
          <label htmlFor="mod-c">
            <strong>c</strong> = {c} <span className="enlight-modulus-slider__hint">(v. shift)</span>
          </label>
          <input id="mod-c" type="range" min={-3} max={3} step={0.5} value={c} onChange={(e) => setC(Number(e.target.value))} />
        </div>
      </div>

      <div className="enlight-modulus-equations">
        <div className="enlight-modulus-equation enlight-modulus-equation--after">{formatEquation(a, b, c)}</div>
        <div className="enlight-modulus-equation enlight-modulus-equation--before">{formatLinearEquation(a, b, c)} (before)</div>
      </div>

      <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Modulus V graph">
        {[...Array(11)].map((_, i) => {
          const x = X_MIN + (i * (X_MAX - X_MIN)) / 10
          return <line key={`v${i}`} x1={toSvgX(x)} y1={0} x2={toSvgX(x)} y2={H} stroke={GRAPH.grid} strokeWidth={1} />
        })}
        {[...Array(12)].map((_, i) => {
          const y = Y_MIN + (i * (Y_MAX - Y_MIN)) / 11
          return <line key={`h${i}`} x1={0} y1={toSvgY(y)} x2={W} y2={toSvgY(y)} stroke={GRAPH.grid} strokeWidth={1} />
        })}
        <line x1={toSvgX(0)} y1={0} x2={toSvgX(0)} y2={H} stroke={GRAPH.axis} strokeWidth={1.5} />
        <line x1={0} y1={toSvgY(0)} x2={W} y2={toSvgY(0)} stroke={GRAPH.axis} strokeWidth={1.5} />

        {[-4, -2, 0, 2, 4].map((n) => (
          <text key={`x${n}`} x={toSvgX(n)} y={toSvgY(0) + 14} textAnchor="middle" fill={GRAPH.muted} fontSize={9}>
            {n}
          </text>
        ))}

        {hasFold && (
          <polyline
            points={linearPath}
            fill="none"
            stroke="#60a5fa"
            strokeWidth={2}
            strokeDasharray="6 5"
            strokeLinecap="round"
            opacity={0.75}
          />
        )}

        <polyline points={path} fill="none" stroke="#d97706" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

        <g className="enlight-modulus-legend">
          <line x1={12} y1={14} x2={36} y2={14} stroke="#60a5fa" strokeWidth={2} strokeDasharray="6 5" />
          <text x={42} y={17} fontSize={9} fill="#64748b">before modulus</text>
          <line x1={130} y1={14} x2={154} y2={14} stroke="#d97706" strokeWidth={3} />
          <text x={160} y={17} fontSize={9} fill="#64748b">after | · |</text>
        </g>

        {vertexInView && (
          <g>
            <circle cx={toSvgX(vertexX)} cy={toSvgY(vertexY)} r={6} fill="#1c1917" stroke="#fff" strokeWidth={2} />
            <text x={toSvgX(vertexX) + 10} y={toSvgY(vertexY) - 8} fill="#1c1917" fontSize={10} fontWeight={700}>
              ({vertexX}, {vertexY})
            </text>
            <text x={toSvgX(vertexX) + 10} y={toSvgY(vertexY) + 4} fill="#78716c" fontSize={9}>
              vertex {a > 0 ? '(min)' : a < 0 ? '(max)' : ''}
            </text>
          </g>
        )}
      </svg>

      <div className="enlight-modulus-hints">
        <div className="enlight-modulus-hint enlight-modulus-hint--pos">
          <strong>a &gt; 0</strong> → normal V. Opens upward. Vertex = minimum. Try a = 2.
        </div>
        <div className="enlight-modulus-hint enlight-modulus-hint--neg">
          <strong>a &lt; 0</strong> → inverted V. Opens downward. Vertex = maximum. Try a = −1.
        </div>
      </div>
    </section>
  )
}
