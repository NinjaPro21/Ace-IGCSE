import { useMemo, useState } from 'react'
import { GRAPH } from './graphTheme'
import type { CubicPanel } from '@/lib/contentTypes'

const W = 440
const H = 280
const X_MIN = -4
const X_MAX = 4
const Y_MIN = -8
const Y_MAX = 8
const STEP = 0.04

function toSvgX(x: number) {
  return ((x - X_MIN) / (X_MAX - X_MIN)) * W
}
function toSvgY(y: number) {
  return H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * H
}

function evalCubic(x: number, a: number, b: number, c: number, d: number) {
  return a * x * x * x + b * x * x + c * x + d
}

function buildPath(fn: (x: number) => number, applyMod = false): string {
  const pts: string[] = []
  for (let xi = X_MIN; xi <= X_MAX + STEP / 2; xi += STEP) {
    let y = fn(xi)
    if (applyMod) y = Math.abs(y)
    if (y < Y_MIN - 2 || y > Y_MAX + 2) continue
    pts.push(`${toSvgX(xi).toFixed(2)},${toSvgY(y).toFixed(2)}`)
  }
  return pts.join(' ')
}

function findRoots(a: number, b: number, c: number, d: number): number[] {
  const roots: number[] = []
  for (let x = X_MIN; x <= X_MAX; x += 0.01) {
    const y = evalCubic(x, a, b, c, d)
    if (Math.abs(y) < 0.08) {
      if (!roots.some((r) => Math.abs(r - x) < 0.15)) roots.push(Math.round(x * 100) / 100)
    }
  }
  return roots.sort((p, q) => p - q)
}

function TracePanel({ showModulus }: { showModulus: boolean }) {
  const [a, setA] = useState(1)
  const [b, setB] = useState(-3)
  const [c, setC] = useState(0)
  const [d, setD] = useState(2)

  const fn = (x: number) => evalCubic(x, a, b, c, d)
  const path = useMemo(() => buildPath(fn, showModulus), [a, b, c, d, showModulus])
  const basePath = useMemo(() => (showModulus ? buildPath(fn, false) : ''), [a, b, c, d, showModulus])
  const roots = useMemo(() => findRoots(a, b, c, d), [a, b, c, d])

  const sliders = [
    { id: 'ca', label: 'a', value: a, set: setA, min: -2, max: 2, step: 0.5 },
    { id: 'cb', label: 'b', value: b, set: setB, min: -4, max: 4, step: 0.5 },
    { id: 'cc', label: 'c', value: c, set: setC, min: -4, max: 4, step: 0.5 },
    { id: 'cd', label: 'd', value: d, set: setD, min: -4, max: 4, step: 0.5 },
  ] as const

  return (
    <div className="ace-explorer__layout">
      <div>
        <p className="ace-body-text" style={{ marginBottom: 12 }}>
          Drag coefficients to see how a cubic {showModulus ? 'and its modulus graph ' : ''}changes shape and roots.
        </p>
        {sliders.map(({ id, label, value, set, min, max, step }) => (
          <div className="ace-slider-group" key={id}>
            <label htmlFor={id}>
              <strong>{label}</strong> = {value}
            </label>
            <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} />
          </div>
        ))}
        {roots.length > 0 && (
          <p style={{ fontSize: '0.82rem', marginTop: 10 }}>
            <strong>Roots ≈</strong> {roots.map((r) => r.toFixed(2)).join(', ')}
          </p>
        )}
      </div>
      <svg className="ace-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cubic graph">
        {[...Array(9)].map((_, i) => {
          const x = X_MIN + (i * (X_MAX - X_MIN)) / 8
          return <line key={`v${i}`} x1={toSvgX(x)} y1={0} x2={toSvgX(x)} y2={H} stroke={GRAPH.grid} strokeWidth={1} />
        })}
        <line x1={toSvgX(0)} y1={0} x2={toSvgX(0)} y2={H} stroke={GRAPH.axis} strokeWidth={1.5} />
        <line x1={0} y1={toSvgY(0)} x2={W} y2={toSvgY(0)} stroke={GRAPH.axis} strokeWidth={1.5} />
        {showModulus && basePath && (
          <polyline points={basePath} fill="none" stroke="#60a5fa" strokeWidth={1.5} strokeDasharray="5 4" opacity={0.45} />
        )}
        <polyline points={path} fill="none" stroke={showModulus ? '#34d399' : '#5b8def'} strokeWidth={2.5} />
        {roots.map((r, i) => (
          <circle key={i} cx={toSvgX(r)} cy={toSvgY(0)} r={5} fill="#fff" stroke="#34d399" strokeWidth={2} />
        ))}
      </svg>
    </div>
  )
}

function FactorPanel() {
  const [testRoot, setTestRoot] = useState(1)
  const a = 1
  const b = -2
  const c = -1
  const d = 2
  const value = evalCubic(testRoot, a, b, c, d)
  const isFactor = Math.abs(value) < 0.05

  return (
    <div>
      <p className="ace-body-text" style={{ marginBottom: 12 }}>
        Test <strong>f(a) = 0</strong> for f(x) = x³ − 2x² − x + 2. When f(a) = 0, (x − a) is a factor.
      </p>
      <div className="ace-slider-group">
        <label htmlFor="factor-a">
          <strong>Test a</strong> = {testRoot}
        </label>
        <input id="factor-a" type="range" min={-3} max={3} step={0.5} value={testRoot} onChange={(e) => setTestRoot(Number(e.target.value))} />
      </div>
      <div className="ace-discriminant-display" style={{ marginTop: 12 }}>
        <div className="ace-discriminant-display__value">f({testRoot}) = {value.toFixed(3)}</div>
        <div className="ace-discriminant-display__label" style={{ color: isFactor ? '#059669' : '#be123c' }}>
          {isFactor ? `(x − ${testRoot}) is a factor ✓` : 'Not a root — factor test fails'}
        </div>
      </div>
      <TracePanel showModulus={false} />
    </div>
  )
}

const PANEL_META: Record<CubicPanel, { title: string; intro: string }> = {
  trace: { title: 'Cubic Curve Tracer', intro: 'Adjust a, b, c, d and watch turning points and x-intercepts change.' },
  factor: { title: 'Factor Finder', intro: 'Slide a to test the Factor Theorem — f(a) = 0 means (x − a) divides f(x).' },
  modulus: { title: 'Cubic Modulus Transformer', intro: 'Toggle the modulus to reflect negative sections upward.' },
}

export function CubicGraphExplorer({ panels }: { panels?: CubicPanel[] }) {
  const activePanels = panels?.length ? panels : (['trace'] as CubicPanel[])
  const [tab, setTab] = useState<CubicPanel>(activePanels[0])
  const current = activePanels.includes(tab) ? tab : activePanels[0]
  const meta = PANEL_META[current]

  return (
    <section className="ace-explorer">
      <h2 className="ace-explorer__title">{meta.title}</h2>
      <p className="ace-body-text" style={{ marginBottom: 16 }}>{meta.intro}</p>
      {activePanels.length > 1 && (
        <div className="ace-fn-tabs" style={{ marginBottom: 16 }}>
          {activePanels.map((id) => (
            <button
              key={id}
              type="button"
              className={`ace-fn-tabs__btn${current === id ? ' ace-fn-tabs__btn--active' : ''}`}
              onClick={() => setTab(id)}
            >
              {PANEL_META[id].title}
            </button>
          ))}
        </div>
      )}
      {current === 'factor' && <FactorPanel />}
      {current === 'modulus' && <TracePanel showModulus />}
      {current === 'trace' && <TracePanel showModulus={false} />}
    </section>
  )
}
