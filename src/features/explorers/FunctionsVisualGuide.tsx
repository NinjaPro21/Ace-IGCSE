import { useMemo, useState } from 'react'

type Tab = 'types' | 'mapping' | 'composite'

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

export function FunctionsVisualGuide() {
  const [tab, setTab] = useState<Tab>('types')

  return (
    <section className="enlight-explorer enlight-fn-guide">
      <h2 className="enlight-explorer__title">Functions Visual Guide</h2>
      <p className="enlight-body-text enlight-fn-guide__intro">
        Mapping types, domain→range diagrams, and composite function flow — the three visuals that unlock Ch.1
        functions.
      </p>

      <div className="enlight-fn-tabs">
        {(
          [
            ['types', 'Mapping types'],
            ['mapping', 'Mapping diagram'],
            ['composite', 'Composite flow'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`enlight-fn-tabs__btn${tab === id ? ' enlight-fn-tabs__btn--active' : ''}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'types' && <MappingTypesPanel />}
      {tab === 'mapping' && <MappingDiagramPanel />}
      {tab === 'composite' && <CompositeFlowPanel />}
    </section>
  )
}
