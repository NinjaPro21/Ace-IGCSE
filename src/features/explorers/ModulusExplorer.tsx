import { useMemo, useState } from 'react'
import { GraphAxes, createGraphMapper } from './GraphAxes'
import { formatLinearCombination, formatModulusVsLine } from './formatEquation'
import type { ModulusPanel } from '@/lib/contentTypes'

const W = 480
const H = 280
const X_MIN = -5
const X_MAX = 5
const Y_MIN = -3
const Y_MAX = 8
const STEP = 0.05
const MAPPER = createGraphMapper(W, H, X_MIN, X_MAX, Y_MIN, Y_MAX)
const { toX, toY } = MAPPER

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
    pts.push(`${toX(x).toFixed(1)},${toY(y).toFixed(1)}`)
  }
  return pts.join(' ')
}

function formatLinearEquation(a: number, b: number, c: number): string {
  return `y = ${formatLinearCombination(a, b)}${c === 0 ? '' : c > 0 ? ` + ${c}` : ` − ${Math.abs(c)}`}`.replace('y = ', 'y = ')
}

function formatEquation(a: number, b: number, c: number): string {
  const inner = formatLinearCombination(a, b)
  const cPart = c === 0 ? '' : c > 0 ? ` + ${c}` : ` − ${Math.abs(c)}`
  return `y = |${inner}|${cPart}`
}

function GraphReflectorPanel() {
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
    <>
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
        <GraphAxes mapper={MAPPER} />
        {hasFold && (
          <polyline points={linearPath} fill="none" stroke="#60a5fa" strokeWidth={2} strokeDasharray="6 5" strokeLinecap="round" opacity={0.75} />
        )}
        <polyline points={path} fill="none" stroke="#d97706" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        {vertexInView && (
          <circle cx={toX(vertexX)} cy={toY(vertexY)} r={6} fill="#1c1917" stroke="#fff" strokeWidth={2} />
        )}
      </svg>
    </>
  )
}

function FxGxPanel() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(-1)
  const [c, setC] = useState(1)
  const [d, setD] = useState(0)

  const modPath = useMemo(() => buildPath((x) => Math.abs(a * x + b)), [a, b])
  const linePath = useMemo(() => buildPath((x) => c * x + d), [c, d])

  return (
    <div className="enlight-explorer__layout">
      <div>
        <p className="enlight-body-text" style={{ marginBottom: 12 }}>{formatModulusVsLine(a, b, c, d)}</p>
        {[
          { id: 'fa', label: 'a', value: a, set: setA, min: -2, max: 2, step: 0.5 },
          { id: 'fb', label: 'b', value: b, set: setB, min: -3, max: 3, step: 0.5 },
          { id: 'fc', label: 'c', value: c, set: setC, min: -2, max: 2, step: 0.5 },
          { id: 'fd', label: 'd', value: d, set: setD, min: -3, max: 3, step: 0.5 },
        ].map(({ id, label, value, set, min, max, step }) => (
          <div className="enlight-slider-group" key={id}>
            <label htmlFor={id}><strong>{label}</strong> = {value}</label>
            <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} />
          </div>
        ))}
      </div>
      <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Modulus vs line">
        <GraphAxes mapper={MAPPER} />
        <polyline points={modPath} fill="none" stroke="#d97706" strokeWidth={2.5} />
        <polyline points={linePath} fill="none" stroke="#5b8def" strokeWidth={2.5} />
      </svg>
    </div>
  )
}

function InequalityPanel() {
  const [k, setK] = useState(3)
  const [mode, setMode] = useState<'lt' | 'gt'>('lt')

  return (
    <div>
      <p className="enlight-body-text" style={{ marginBottom: 12 }}>
        Shaded regions show where |x| {mode === 'lt' ? '<' : '>'} {k}.
      </p>
      <div className="enlight-fn-tabs" style={{ marginBottom: 12 }}>
        {(['lt', 'gt'] as const).map((m) => (
          <button key={m} type="button" className={`enlight-fn-tabs__btn${mode === m ? ' enlight-fn-tabs__btn--active' : ''}`} onClick={() => setMode(m)}>
            |x| {m === 'lt' ? '<' : '>'} k
          </button>
        ))}
      </div>
      <div className="enlight-slider-group">
        <label htmlFor="mk"><strong>k</strong> = {k}</label>
        <input id="mk" type="range" min={0.5} max={4} step={0.5} value={k} onChange={(e) => setK(Number(e.target.value))} />
      </div>
      <svg viewBox="0 0 440 72" style={{ width: '100%', marginTop: 16 }} role="img" aria-label="Number line shading">
        <defs>
          <linearGradient id="mod-shade-left" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(52,211,153,0.55)" />
            <stop offset="85%" stopColor="rgba(52,211,153,0.35)" />
            <stop offset="100%" stopColor="rgba(52,211,153,0.08)" />
          </linearGradient>
          <linearGradient id="mod-shade-right" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(52,211,153,0.08)" />
            <stop offset="15%" stopColor="rgba(52,211,153,0.35)" />
            <stop offset="100%" stopColor="rgba(52,211,153,0.55)" />
          </linearGradient>
        </defs>
        <line x1={20} y1={36} x2={420} y2={36} stroke="#57534e" strokeWidth={2} />
        {[-4, -2, 0, 2, 4].map((n) => (
          <g key={n}>
            <line x1={20 + (n + 4) * 44} y1={30} x2={20 + (n + 4) * 44} y2={42} stroke="#57534e" strokeWidth={1.5} />
            <text x={20 + (n + 4) * 44} y={58} textAnchor="middle" fontSize={10}>{n}</text>
          </g>
        ))}
        {mode === 'lt' ? (
          <rect x={20 + (-k + 4) * 44} y={24} width={(2 * k) * 44} height={24} fill="rgba(52,211,153,0.35)" rx={4} />
        ) : (
          <>
            <rect x={20} y={24} width={(-k + 4) * 44} height={24} fill="url(#mod-shade-left)" />
            <rect x={20 + (k + 4) * 44} y={24} width={(4 - k) * 44} height={24} fill="url(#mod-shade-right)" />
            <polygon points="12,36 22,30 22,42" fill="rgba(52,211,153,0.55)" />
            <polygon points="428,36 418,30 418,42" fill="rgba(52,211,153,0.55)" />
            <text x={8} y={20} fontSize={9} fill="#059669" fontWeight={700}>−∞</text>
            <text x={412} y={20} fontSize={9} fill="#059669" fontWeight={700}>+∞</text>
          </>
        )}
        {mode === 'gt' && (
          <>
            <line x1={20 + (-k + 4) * 44} y1={24} x2={20 + (-k + 4) * 44} y2={48} stroke="#059669" strokeWidth={2.5} />
            <line x1={20 + (k + 4) * 44} y1={24} x2={20 + (k + 4) * 44} y2={48} stroke="#059669" strokeWidth={2.5} />
          </>
        )}
      </svg>
    </div>
  )
}

const PANEL_TITLES: Record<ModulusPanel, string> = {
  graph: 'Modulus Graph Explorer',
  'fx-gx': 'Modulus Intersector',
  inequality: 'Modulus Inequality Shading',
}

export function ModulusExplorer({ panels }: { panels?: ModulusPanel[] }) {
  const active = panels?.length ? panels : (['graph'] as ModulusPanel[])
  const [tab, setTab] = useState<ModulusPanel>(active[0])
  const current = active.includes(tab) ? tab : active[0]

  return (
    <section className="enlight-explorer" id="modulus-explorer">
      <h2 className="enlight-explorer__title">{PANEL_TITLES[current]}</h2>
      {active.length > 1 && (
        <div className="enlight-fn-tabs" style={{ marginBottom: 16 }}>
          {active.map((id) => (
            <button key={id} type="button" className={`enlight-fn-tabs__btn${current === id ? ' enlight-fn-tabs__btn--active' : ''}`} onClick={() => setTab(id)}>
              {PANEL_TITLES[id]}
            </button>
          ))}
        </div>
      )}
      {current === 'graph' && (
        <>
          <p className="enlight-body-text" style={{ marginBottom: 20 }}>
            Explore <strong>y = a|x + b| + c</strong>. The dashed line shows the linear graph before the modulus fold.
          </p>
          <GraphReflectorPanel />
        </>
      )}
      {current === 'fx-gx' && <FxGxPanel />}
      {current === 'inequality' && <InequalityPanel />}
    </section>
  )
}
