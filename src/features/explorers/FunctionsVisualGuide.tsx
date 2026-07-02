import { useMemo, useState } from 'react'
import { GraphAxes, createGraphMapper } from './GraphAxes'
import type { FnGuidePanel } from '@/lib/contentTypes'

type Tab = FnGuidePanel

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <>
      <line x1={x1} y1={y1} x2={x2 - 6} y2={y2} stroke={color} strokeWidth={2} />
      <polygon points={`${x2},${y2} ${x2 - 8},${y2 - 4} ${x2 - 8},${y2 + 4}`} fill={color} />
    </>
  )
}

function dotY(index: number, total: number, height: number, pad = 16): number {
  if (total <= 1) return height / 2
  return pad + (index * (height - pad * 2)) / (total - 1)
}

function MappingTypesPanel() {
  const svgH = 130
  const panels = [
    {
      title: 'ONE-TO-ONE',
      color: '#059669',
      inputs: 3,
      outputs: 3,
      links: [[0, 0], [1, 1], [2, 2]] as [number, number][],
      caption: 'Each input → unique output. Has an inverse.',
    },
    {
      title: 'MANY-TO-ONE',
      color: '#d97706',
      inputs: 3,
      outputs: 2,
      links: [[0, 0], [1, 0], [2, 1]] as [number, number][],
      caption: 'Multiple inputs → same output. Still a function. No inverse.',
    },
    {
      title: 'ONE-TO-MANY',
      color: '#be123c',
      inputs: 2,
      outputs: 3,
      links: [[0, 0], [0, 1], [1, 2]] as [number, number][],
      caption: 'One input → multiple outputs. NOT a function.',
    },
  ]

  return (
    <div className="enlight-fn-types">
      {panels.map((p) => (
        <div key={p.title} className="enlight-fn-types__card">
          <div className="enlight-fn-types__title" style={{ color: p.color }}>
            {p.title}
          </div>
          <svg viewBox={`0 0 200 ${svgH}`} className="enlight-fn-types__svg" role="img" aria-label={p.title} preserveAspectRatio="xMidYMid meet">
            {Array.from({ length: p.inputs }).map((_, i) => (
              <circle key={`i${i}`} cx={24} cy={dotY(i, p.inputs, svgH)} r={8} fill="#d97706" opacity={0.85} />
            ))}
            {Array.from({ length: p.outputs }).map((_, i) => (
              <circle key={`o${i}`} cx={176} cy={dotY(i, p.outputs, svgH)} r={8} fill={p.color} opacity={0.85} />
            ))}
            {p.links.map(([from, to], i) => (
              <Arrow
                key={i}
                x1={32}
                y1={dotY(from, p.inputs, svgH)}
                x2={168}
                y2={dotY(to, p.outputs, svgH)}
                color={p.color}
              />
            ))}
          </svg>
          <p className="enlight-fn-types__caption">{p.caption}</p>
        </div>
      ))}
    </div>
  )
}

function MappingDiagramPanel() {
  const rule = (x: number) => 2 * x + 1
  const inputs = [1, 2, 3]
  const outputs = inputs.map(rule)

  return (
    <div className="enlight-fn-mapping">
      <div className="enlight-fn-mapping__label">MAPPING DIAGRAM</div>
      <svg viewBox="0 0 420 200" className="enlight-fn-mapping__svg" role="img" aria-label="Mapping diagram f(x)=2x+1">
        <ellipse cx={100} cy={100} rx={72} ry={88} fill="rgba(255,255,255,0.6)" stroke="#1e3a5f" strokeWidth={2} />
        <ellipse cx={320} cy={100} rx={72} ry={88} fill="rgba(255,255,255,0.6)" stroke="#1e3a5f" strokeWidth={2} />
        <text x={100} y={28} textAnchor="middle" fontSize={13} fontWeight={700} fill="#1e3a5f">
          Domain
        </text>
        <text x={320} y={28} textAnchor="middle" fontSize={13} fontWeight={700} fill="#1e3a5f">
          Range
        </text>
        <text x={210} y={108} textAnchor="middle" fontSize={14} fontWeight={700} fill="#d97706">
          f(x) = 2x + 1
        </text>
        {inputs.map((x, i) => {
          const y = outputs[i]
          const iy = 55 + i * 45
          const oy = 55 + i * 45
          return (
            <g key={x}>
              <circle cx={88} cy={iy} r={6} fill="#d97706" />
              <text x={108} y={iy + 4} fontSize={12} fontWeight={600} fill="#44403c">
                {x}
              </text>
              <Arrow x1={130} y1={iy} x2={270} y2={oy} color="#d97706" />
              <circle cx={332} cy={oy} r={6} fill="#059669" />
              <text x={302} y={oy + 4} textAnchor="end" fontSize={12} fontWeight={600} fill="#44403c">
                {y}
              </text>
            </g>
          )
        })}
      </svg>
      <p className="enlight-fn-mapping__note">
        Each domain value maps to exactly <strong>one</strong> range value → this is a valid function (one-to-one here).
      </p>
    </div>
  )
}

function CompositeFlowPanel() {
  const [x, setX] = useState(5)
  const gx = x - 3
  const fx = gx === 0 ? null : 1 / gx
  const fg = fx

  const steps = useMemo(
    () => [
      { label: 'x', value: String(x), sub: 'input', color: '#44403c' },
      { label: 'g(x)', value: String(gx), sub: 'first', color: '#d97706' },
      { label: 'f(...)', value: fx === null ? 'undefined' : fx.toFixed(2), sub: 'second', color: '#7c3aed' },
      { label: 'fg(x)', value: fg === null ? 'undefined' : fg.toFixed(2), sub: 'output', color: '#059669' },
    ],
    [x, gx, fx, fg],
  )

  return (
    <div className="enlight-fn-composite">
      <p className="enlight-fn-composite__intro">
        Example: <strong>f(x) = 1/x</strong>, <strong>g(x) = x − 3</strong>. Evaluate the{' '}
        <strong>inner</strong> function first: fg(x) = f(g(x)).
      </p>

      <div className="enlight-slider-group">
        <label htmlFor="comp-x">
          <strong>Input x</strong> = {x}
        </label>
        <input id="comp-x" type="range" min={-2} max={8} step={0.5} value={x} onChange={(e) => setX(Number(e.target.value))} />
      </div>

      <div className="enlight-fn-flow">
        <div className="enlight-fn-flow__label">FLOW DIAGRAM</div>
        <div className="enlight-fn-flow__row">
          {steps.map((s, i) => (
            <div key={s.label} className="enlight-fn-flow__group">
              {i > 0 && <span className="enlight-fn-flow__arrow">→</span>}
              <div className={`enlight-fn-flow__box${i === 0 || i === 3 ? ' enlight-fn-flow__box--dark' : ''}`}>
                <div className="enlight-fn-flow__box-label" style={{ color: s.color }}>
                  {s.label}
                </div>
                <div className="enlight-fn-flow__box-value">{s.value}</div>
                <div className="enlight-fn-flow__box-sub">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="enlight-fn-composite__formula">
        fg({x}) = f(g({x})) = f({gx}) = {fg === null ? 'undefined (x = 3 excluded)' : `1/${gx} = ${fg.toFixed(2)}`}
      </div>

      <div className="enlight-fn-composite__compare">
        <div>
          <strong>fg(x)</strong> = 1/(x−3) — apply <em>g</em> first, then <em>f</em>
        </div>
        <div>
          <strong>gf(x)</strong> = 1/x − 3 — order reversed, different result
        </div>
      </div>
    </div>
  )
}

function InverseReflectionPanel() {
  const [x, setX] = useState(2)
  const fx = 0.5 * x + 1
  const W = 420
  const H = 280
  const X_MIN = -1
  const X_MAX = 5
  const Y_MIN = -2
  const Y_MAX = 5
  const mapper = useMemo(
    () => createGraphMapper(W, H, X_MIN, X_MAX, Y_MIN, Y_MAX),
    [],
  )
  const { toX, toY } = mapper

  const fPath = useMemo(() => {
    const pts: string[] = []
    for (let xi = X_MIN; xi <= X_MAX; xi += 0.08) {
      const y = 0.5 * xi + 1
      if (y < Y_MIN - 0.5 || y > Y_MAX + 0.5) continue
      pts.push(`${toX(xi).toFixed(1)},${toY(y).toFixed(1)}`)
    }
    return pts.join(' ')
  }, [toX, toY])

  const invPath = useMemo(() => {
    const pts: string[] = []
    for (let xi = X_MIN; xi <= X_MAX; xi += 0.08) {
      const y = 2 * xi - 2
      if (y < Y_MIN - 0.5 || y > Y_MAX + 0.5) continue
      pts.push(`${toX(xi).toFixed(1)},${toY(y).toFixed(1)}`)
    }
    return pts.join(' ')
  }, [toX, toY])

  const diagPath = useMemo(() => {
    const lo = Math.max(X_MIN, Y_MIN)
    const hi = Math.min(X_MAX, Y_MAX)
    return `${toX(lo).toFixed(1)},${toY(lo).toFixed(1)} ${toX(hi).toFixed(1)},${toY(hi).toFixed(1)}`
  }, [toX, toY])

  return (
    <div>
      <p className="enlight-fn-inverse__intro">
        <strong>f(x) = 0.5x + 1</strong> and its inverse <strong>f⁻¹(x) = 2x − 2</strong> are reflections in the
        line <strong>y = x</strong>.
      </p>
      <div className="enlight-slider-group">
        <label htmlFor="inv-x"><strong>x</strong> = {x}</label>
        <input id="inv-x" type="range" min={-0.5} max={4.5} step={0.25} value={x} onChange={(e) => setX(Number(e.target.value))} />
      </div>
      <p className="enlight-fn-inverse__readout">
        ({x}, {fx.toFixed(2)}) on <span style={{ color: '#5b8def' }}>f</span> ↔ ({fx.toFixed(2)}, {x}) on{' '}
        <span style={{ color: '#059669' }}>f⁻¹</span>
      </p>
      <div className="enlight-fn-inverse__legend">
        <span><i style={{ background: '#5b8def' }} /> f(x) = 0.5x + 1</span>
        <span><i style={{ background: '#059669' }} /> f⁻¹(x) = 2x − 2</span>
        <span><i style={{ background: '#94a3b8', opacity: 0.7 }} /> y = x</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="enlight-graph-canvas" role="img" aria-label="Inverse function reflection">
        <GraphAxes mapper={mapper} gridX={12} gridY={10} />
        <polyline points={diagPath} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 4" />
        <text x={toX(4.2)} y={toY(4.2) - 8} fontSize={10} fill="#78716c">y = x</text>
        <polyline points={fPath} fill="none" stroke="#5b8def" strokeWidth={2.5} />
        <polyline points={invPath} fill="none" stroke="#059669" strokeWidth={2.5} />
        <line x1={toX(x)} y1={toY(fx)} x2={toX(fx)} y2={toY(x)} stroke="#d97706" strokeWidth={1.5} strokeDasharray="4 3" />
        <circle cx={toX(x)} cy={toY(fx)} r={6} fill="#5b8def" stroke="#fff" strokeWidth={2} />
        <circle cx={toX(fx)} cy={toY(x)} r={6} fill="#059669" stroke="#fff" strokeWidth={2} />
      </svg>
    </div>
  )
}

export function FunctionsVisualGuide({ panels }: { panels?: FnGuidePanel[] }) {
  const allTabs: { id: Tab; label: string }[] = [
    { id: 'types', label: 'Mapping types' },
    { id: 'mapping', label: 'Mapping diagram' },
    { id: 'composite', label: 'Composite flow' },
    { id: 'inverse', label: 'Inverse reflection' },
  ]
  const activeTabs = panels?.length ? allTabs.filter((t) => panels.includes(t.id)) : allTabs
  const [tab, setTab] = useState<Tab>(activeTabs[0]?.id ?? 'types')
  const currentTab = activeTabs.some((t) => t.id === tab) ? tab : activeTabs[0]?.id ?? 'types'

  return (
    <section className="enlight-explorer enlight-fn-guide">
      <h2 className="enlight-explorer__title">Functions Visual Guide</h2>
      <p className="enlight-body-text enlight-fn-guide__intro">
        Mapping types, domain→range diagrams, and composite function flow — the three visuals that unlock Ch.1
        functions.
      </p>

      {activeTabs.length > 1 && (
        <div className="enlight-fn-tabs">
          {activeTabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`enlight-fn-tabs__btn${currentTab === id ? ' enlight-fn-tabs__btn--active' : ''}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {currentTab === 'types' && <MappingTypesPanel />}
      {currentTab === 'mapping' && <MappingDiagramPanel />}
      {currentTab === 'composite' && <CompositeFlowPanel />}
      {currentTab === 'inverse' && <InverseReflectionPanel />}
    </section>
  )
}
