import { useMemo, useState } from 'react'
import { GraphAxes, createGraphMapper } from './GraphAxes'
import type { QuadraticPanel } from '@/lib/contentTypes'

const W = 420
const H = 300
const X_MIN = -7
const X_MAX = 7
const Y_MIN = -10
const Y_MAX = 14
const STEP = 0.04
const MAPPER = createGraphMapper(W, H, X_MIN, X_MAX, Y_MIN, Y_MAX)
const { toX, toY } = MAPPER

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

function buildPath(a: number, b: number, c: number, applyMod = false): string {
  const pts: string[] = []
  for (let xi = X_MIN; xi <= X_MAX + STEP / 2; xi += STEP) {
    let y = a * xi * xi + b * xi + c
    if (applyMod) y = Math.abs(y)
    if (y < Y_MIN - 2 || y > Y_MAX + 2) continue
    pts.push(`${toX(xi).toFixed(2)},${toY(y).toFixed(2)}`)
  }
  return pts.join(' ')
}

function ModulusPanel() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(-2)
  const [c, setC] = useState(-3)
  const [showModulus, setShowModulus] = useState(true)

  const [vx, vy] = useMemo(() => calcVertex(a, b, c), [a, b, c])
  const roots = useMemo(() => findRoots(a, b, c), [a, b, c])
  const modPath = useMemo(() => buildPath(a, b, c, showModulus), [a, b, c, showModulus])
  const basePath = useMemo(() => (showModulus ? buildPath(a, b, c, false) : ''), [a, b, c, showModulus])

  const aStr = a === 1 ? '' : a === -1 ? '−' : `${a}`
  const bAbs = Math.abs(b)
  const bPart = b === 0 ? '' : ` ${b > 0 ? '+' : '−'} ${bAbs}x`
  const cPart = c === 0 ? '' : ` ${c > 0 ? '+' : '−'} ${Math.abs(c)}`
  const inner = `${aStr}x²${bPart}${cPart}`.replace(/^ /, '')
  const eq = showModulus ? `y = |${inner}|` : `y = ${inner}`

  const sliders = [
    { id: 'ma', label: 'a', value: a, set: setA, min: -2, max: 2, step: 0.5 },
    { id: 'mb', label: 'b', value: b, set: setB, min: -6, max: 6, step: 0.5 },
    { id: 'mc', label: 'c', value: c, set: setC, min: -8, max: 8, step: 0.5 },
  ] as const

  return (
    <div className="enlight-explorer__layout">
      <div>
        <p className="enlight-body-text" style={{ marginBottom: 14 }}>
          Explore <strong>y = |ax² + bx + c|</strong>. Toggle the modulus to fold negative regions upward and highlight cusps on the x-axis.
        </p>

        <div className="enlight-fn-tabs" style={{ marginBottom: 12 }}>
          <button
            type="button"
            className={`enlight-fn-tabs__btn${showModulus ? ' enlight-fn-tabs__btn--active' : ''}`}
            onClick={() => setShowModulus(true)}
          >
            |f(x)| applied
          </button>
          <button
            type="button"
            className={`enlight-fn-tabs__btn${!showModulus ? ' enlight-fn-tabs__btn--active' : ''}`}
            onClick={() => setShowModulus(false)}
          >
            Original f(x)
          </button>
        </div>

        {sliders.map(({ id, label, value, set, min, max, step }) => (
          <div className="enlight-slider-group" key={id}>
            <label htmlFor={id}>
              <strong>{label}</strong> = {value}
            </label>
            <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} />
          </div>
        ))}

        <div className="enlight-discriminant-display" style={{ marginTop: 14 }}>
          <div className="enlight-discriminant-display__value" style={{ fontSize: '0.95rem' }}>{eq}</div>
          <div className="enlight-discriminant-display__label">
            {showModulus ? 'Cusps appear at roots where f(x) = 0' : `Vertex: (${vx.toFixed(2)}, ${vy.toFixed(2)})`}
          </div>
        </div>

        {roots.length > 0 && (
          <div style={{ fontSize: '0.82rem', color: 'var(--enlight-text-light)', marginTop: 8 }}>
            <strong style={{ color: 'var(--enlight-text)' }}>Roots (cusps):</strong>{' '}
            {roots.sort((p, q) => p - q).map((r) => r.toFixed(2)).join(', ')}
          </div>
        )}
      </div>

      <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Quadratic modulus graph">
        <GraphAxes mapper={MAPPER} gridX={14} gridY={12} />
        {showModulus && basePath && (
          <polyline points={basePath} fill="none" stroke="#60a5fa" strokeWidth={1.5} strokeDasharray="5 4" opacity={0.45} />
        )}
        <polyline points={modPath} fill="none" stroke={showModulus ? '#d97706' : '#5b8def'} strokeWidth={2.5} strokeLinecap="round" />
        {roots.filter((r) => r >= X_MIN && r <= X_MAX).map((r, i) => (
          <circle key={i} cx={toX(r)} cy={toY(0)} r={5} fill="#fff" stroke={showModulus ? '#d97706' : '#34d399'} strokeWidth={2} />
        ))}
      </svg>
    </div>
  )
}

function GraphPanel() {
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
            <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} />
          </div>
        ))}

        <div className="enlight-discriminant-display" style={{ marginTop: 14 }}>
          <div className="enlight-discriminant-display__value" style={{ fontSize: '0.95rem' }}>{eq}</div>
          <div className="enlight-discriminant-display__label">Vertex: ({vx.toFixed(2)}, {vy.toFixed(2)})</div>
        </div>

        <div className="enlight-discriminant-display" style={{ marginTop: 8 }}>
          <div className="enlight-discriminant-display__value">Δ = {disc.toFixed(2)}</div>
          <div className="enlight-discriminant-display__label" style={{ color: natureColor }}>{natureText}</div>
        </div>

        {roots.length > 0 && (
          <div style={{ fontSize: '0.82rem', color: 'var(--enlight-text-light)', marginTop: 8 }}>
            <strong style={{ color: 'var(--enlight-text)' }}>Roots:</strong>{' '}
            {roots.sort((p, q) => p - q).map((r) => r.toFixed(2)).join(', ')}
          </div>
        )}
      </div>

      <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Interactive quadratic graph">
        <GraphAxes mapper={MAPPER} gridX={14} gridY={12} />
        <polyline points={path} fill="none" stroke="#5b8def" strokeWidth={2.5} strokeLinecap="round" />
        {vx >= X_MIN && vx <= X_MAX && vy >= Y_MIN && vy <= Y_MAX && (
          <circle cx={toX(vx)} cy={toY(vy)} r={6} fill="#f59e0b" stroke="#fff" strokeWidth={2} />
        )}
        {roots.filter((r) => r >= X_MIN && r <= X_MAX).map((r, i) => (
          <circle key={i} cx={toX(r)} cy={toY(0)} r={5} fill="#fff" stroke="#34d399" strokeWidth={2} />
        ))}
      </svg>
    </div>
  )
}

function InequalityPanel() {
  const [a] = useState(1)
  const [b] = useState(0)
  const [c, setC] = useState(-4)
  const [mode, setMode] = useState<'gt' | 'lt'>('gt')

  const roots = useMemo(() => findRoots(a, b, c).sort((p, q) => p - q), [a, b, c])
  const path = useMemo(() => buildPath(a, b, c, false), [a, b, c])
  const [r1, r2] = roots.length >= 2 ? roots : roots.length === 1 ? [roots[0], roots[0]] : [-999, 999]

  return (
    <div className="enlight-explorer__layout">
      <div>
        <p className="enlight-body-text" style={{ marginBottom: 12 }}>
          Shade where ax² + bx + c {mode === 'gt' ? '>' : '<'} 0 on the x-axis.
        </p>
        <div className="enlight-fn-tabs" style={{ marginBottom: 12 }}>
          {(['gt', 'lt'] as const).map((m) => (
            <button key={m} type="button" className={`enlight-fn-tabs__btn${mode === m ? ' enlight-fn-tabs__btn--active' : ''}`} onClick={() => setMode(m)}>
              {m === 'gt' ? '> 0' : '< 0'}
            </button>
          ))}
        </div>
        <div className="enlight-slider-group">
          <label htmlFor="qi-c"><strong>c</strong> = {c}</label>
          <input id="qi-c" type="range" min={-6} max={2} step={0.5} value={c} onChange={(e) => setC(Number(e.target.value))} />
        </div>
        {roots.length > 0 && (
          <p style={{ fontSize: '0.82rem', marginTop: 8 }}>Roots: {roots.map((r) => r.toFixed(2)).join(', ')}</p>
        )}
      </div>
      <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Quadratic inequality shading">
        <GraphAxes mapper={MAPPER} gridX={14} gridY={12} />
        <polyline points={path} fill="none" stroke="#5b8def" strokeWidth={2.5} />
        {roots.length === 2 && a > 0 && (
          <>
            {(mode === 'gt'
              ? [
                  [X_MIN, r1],
                  [r2, X_MAX],
                ]
              : [[r1, r2]]
            ).map(([x0, x1], i) => (
              <rect
                key={i}
                x={toX(x0)}
                y={toY(0) - 4}
                width={toX(x1) - toX(x0)}
                height={8}
                fill="rgba(52,211,153,0.5)"
              />
            ))}
          </>
        )}
      </svg>
    </div>
  )
}

const PANEL_TITLES: Record<QuadraticPanel, string> = {
  graph: 'Quadratic Graph Explorer',
  inequality: 'Quadratic Inequality Explorer',
  modulus: 'Quadratic Modulus Explorer',
}

export function QuadraticGraphExplorer({ panels }: { panels?: QuadraticPanel[] }) {
  const active = panels?.length ? panels : (['graph'] as QuadraticPanel[])
  const [tab, setTab] = useState<QuadraticPanel>(active[0])
  const current = active.includes(tab) ? tab : active[0]

  return (
    <section className="enlight-explorer">
      <h2 className="enlight-explorer__title">{PANEL_TITLES[current]}</h2>
      {active.length > 1 && (
        <div className="enlight-fn-tabs" style={{ marginBottom: 16 }}>
          {active.map((id) => (
            <button key={id} type="button" className={`enlight-fn-tabs__btn${current === id ? ' enlight-fn-tabs__btn--active' : ''}`} onClick={() => setTab(id)}>
              {id === 'graph' ? 'Graph' : id === 'inequality' ? 'Inequalities' : 'Modulus'}
            </button>
          ))}
        </div>
      )}
      {current === 'modulus' ? <ModulusPanel /> : current === 'inequality' ? <InequalityPanel /> : <GraphPanel />}
    </section>
  )
}
