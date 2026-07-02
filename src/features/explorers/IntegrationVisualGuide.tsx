import { useMemo, useState } from 'react'
import { GRAPH } from './graphTheme'
import type { IntegrationGuidePanel } from '@/lib/contentTypes'

const W = 480
const H = 220
const STEP = 0.04

function toSvgX(x: number, xMin: number, xMax: number) {
  return ((x - xMin) / (xMax - xMin)) * W
}
function toSvgY(y: number, yMin: number, yMax: number) {
  return H - ((y - yMin) / (yMax - yMin)) * H
}

function buildPath(fn: (x: number) => number, xMin: number, xMax: number, yMin: number, yMax: number): string {
  const pts: string[] = []
  for (let x = xMin; x <= xMax + STEP / 2; x += STEP) {
    const y = fn(x)
    if (y < yMin - 1 || y > yMax + 1) continue
    pts.push(`${toSvgX(x, xMin, xMax).toFixed(1)},${toSvgY(y, yMin, yMax).toFixed(1)}`)
  }
  return pts.join(' ')
}

function buildAreaPath(fn: (x: number) => number, a: number, b: number, xMin: number, xMax: number, yMin: number, yMax: number): string {
  const pts: string[] = [`${toSvgX(a, xMin, xMax).toFixed(1)},${toSvgY(0, yMin, yMax).toFixed(1)}`]
  for (let x = a; x <= b + STEP / 2; x += STEP) {
    pts.push(`${toSvgX(x, xMin, xMax).toFixed(1)},${toSvgY(fn(x), yMin, yMax).toFixed(1)}`)
  }
  pts.push(`${toSvgX(b, xMin, xMax).toFixed(1)},${toSvgY(0, yMin, yMax).toFixed(1)}`)
  return pts.join(' ')
}

function PowerPanel() {
  const examples = [
    { f: '3x²', F: 'x³ + C', d: 'differentiate → 3x²' },
    { f: '4x − 7', F: '2x² − 7x + C', d: 'integrate term by term' },
    { f: '5', F: '5x + C', d: '∫ k dx = kx + C' },
    { f: 'x⁻²', F: '−x⁻¹ + C', d: 'rewrite as a power first' },
  ]

  return (
    <div>
      <p className="enlight-guide-panel__intro">
        Integration reverses differentiation for polynomials. Every indefinite integral needs <strong>+ C</strong>.
      </p>
      <div className="enlight-int-reverse">
        <div className="enlight-int-reverse__col">
          <div className="enlight-int-reverse__label">Differentiate ↓</div>
          {examples.map((e) => (
            <div key={e.f} className="enlight-int-reverse__box enlight-int-reverse__box--deriv">
              {e.f}
            </div>
          ))}
        </div>
        <div className="enlight-int-reverse__arrow">⇄</div>
        <div className="enlight-int-reverse__col">
          <div className="enlight-int-reverse__label">Integrate ↑</div>
          {examples.map((e) => (
            <div key={e.F} className="enlight-int-reverse__box enlight-int-reverse__box--integ">
              {e.F}
            </div>
          ))}
        </div>
      </div>
      <div className="enlight-guide-calc">
        <div>∫(3x² − 4x + 1) dx = <strong>x³ − 2x² + x + C</strong></div>
        <div className="enlight-guide-calc__note">Power +1, divide by new power. Never use power rule when n = −1 (use ln instead).</div>
      </div>
    </div>
  )
}

function AxbPowerPanel() {
  const steps = [
    { n: '1', text: 'Identify a, b, and n in (ax + b)ⁿ' },
    { n: '2', text: 'Add 1 to the power: n → n + 1' },
    { n: '3', text: 'Divide by (n + 1) and by a' },
    { n: '4', text: 'Add +C' },
    { n: '5', text: 'Check: inside must be linear — not x² or (x² + 1)³' },
  ]

  return (
    <div>
      <p className="enlight-guide-panel__intro">
        Reverse of the <strong>chain rule</strong> when the inside is linear only: ∫(ax + b)ⁿ dx.
      </p>
      <div className="enlight-diff-steps">
        {steps.map((s) => (
          <div key={s.n} className="enlight-diff-step">
            <span className="enlight-diff-step__num">{s.n}</span>
            <span>{s.text}</span>
          </div>
        ))}
      </div>
      <div className="enlight-guide-calc" style={{ marginTop: 14 }}>
        <div>∫(2x + 1)³ dx = <strong>(2x + 1)⁴ / 8 + C</strong></div>
        <div className="enlight-guide-calc__note">a = 2, n = 3 → divide by 4 (new power) and by 2 (coefficient of x).</div>
      </div>
      <div className="enlight-diff-rules-grid" style={{ marginTop: 14 }}>
        <div className="enlight-diff-rule-card" style={{ borderLeftColor: '#7c3aed' }}>
          <div className="enlight-diff-rule-card__title" style={{ color: '#7c3aed' }}>
            Linear power
          </div>
          <div className="enlight-diff-rule-card__formula">∫(ax + b)ⁿ dx = (ax + b)ⁿ⁺¹ / [a(n + 1)] + C</div>
          <div className="enlight-diff-rule-card__example">e.g. ∫(3x − 2)⁻² dx = −1/[3(3x − 2)] + C</div>
        </div>
        <div className="enlight-diff-rule-card" style={{ borderLeftColor: '#be123c' }}>
          <div className="enlight-diff-rule-card__title" style={{ color: '#be123c' }}>
            Not allowed
          </div>
          <div className="enlight-diff-rule-card__formula">Inside must be ax + b only</div>
          <div className="enlight-diff-rule-card__example">Expand (x² + 1)² first — then use the power rule</div>
        </div>
      </div>
    </div>
  )
}

function ExpTrigPanel() {
  const examples = [
    { f: 'e²ˣ', F: '½e²ˣ + C', d: 'divide by a = 2' },
    { f: 'sin(2x+1)', F: '−½cos(2x+1) + C', d: 'sin → −cos, divide by a' },
    { f: '3cos 4x', F: '¾sin 4x + C', d: 'cos → sin, k = 3, a = 4' },
    { f: 'sec²(3x)', F: '⅓tan(3x) + C', d: 'reverse of d/dx tan → sec²' },
  ]

  const trigLayers = [
    { layer: 'Basic', rule: '∫ sin x dx = −cos x + C · ∫ cos x dx = sin x + C · ∫ sec² x dx = tan x + C', ex: '∫ sec² x dx = tan x + C' },
    { layer: 'ax + b', rule: '∫ sin(ax+b) dx = −(1/a)cos(ax+b) + C', ex: '∫ sec²(2x+1) dx = ½tan(2x+1) + C' },
    { layer: 'k·f(ax+b)', rule: '∫ k sin(ax+b) dx = −(k/a)cos(ax+b) + C', ex: '∫ 6cos(2x−1) dx = 3sin(2x−1) + C' },
  ]

  return (
    <div>
      <p className="enlight-guide-panel__intro">
        Reverse Chapter 14 derivatives — exponential, sine, cosine, and tangent (via sec²). Always add <strong>+ C</strong>.
      </p>
      <div className="enlight-int-reverse">
        <div className="enlight-int-reverse__col">
          <div className="enlight-int-reverse__label">Integrand ↓</div>
          {examples.map((e) => (
            <div key={e.f} className="enlight-int-reverse__box enlight-int-reverse__box--deriv">
              {e.f}
            </div>
          ))}
        </div>
        <div className="enlight-int-reverse__arrow">→</div>
        <div className="enlight-int-reverse__col">
          <div className="enlight-int-reverse__label">Antiderivative ↑</div>
          {examples.map((e) => (
            <div key={e.F} className="enlight-int-reverse__box enlight-int-reverse__box--integ">
              {e.F}
            </div>
          ))}
        </div>
      </div>
      <div className="enlight-diff-rules-grid" style={{ marginTop: 14 }}>
        {trigLayers.map((t) => (
          <div key={t.layer} className="enlight-diff-rule-card" style={{ borderLeftColor: '#6366f1' }}>
            <div className="enlight-diff-rule-card__title" style={{ color: '#6366f1' }}>
              {t.layer}
            </div>
            <div className="enlight-diff-rule-card__formula">{t.rule}</div>
            <div className="enlight-diff-rule-card__example">e.g. {t.ex}</div>
          </div>
        ))}
      </div>
      <div className="enlight-guide-calc" style={{ marginTop: 14 }}>
        <div>∫ 4sec²(2x + 1) dx = <strong>2tan(2x + 1) + C</strong></div>
        <div className="enlight-guide-calc__note">Because d/dx[tan(ax+b)] = a·sec²(ax+b) — divide by a after integrating.</div>
      </div>
    </div>
  )
}

function DefinitePanel() {
  return (
    <div>
      <p className="enlight-guide-panel__intro">
        Definite integral: evaluate the antiderivative at the limits, then <strong>F(b) − F(a)</strong>. No +C.
      </p>
      <div className="enlight-int-definite">
        <div className="enlight-int-definite__expr">∫₁³ (2x + 1) dx = [x² + x]₁³</div>
        <div className="enlight-int-definite__step">
          <span>F(3) = 9 + 3 = <strong>12</strong></span>
          <span>F(1) = 1 + 1 = <strong>2</strong></span>
        </div>
        <div className="enlight-int-definite__result">= 12 − 2 = <strong>10</strong></div>
      </div>
      <div className="enlight-diff-steps">
        <div className="enlight-diff-step">
          <span className="enlight-diff-step__num">1</span>
          <span>Integrate: ∫(2x + 1) dx = x² + x</span>
        </div>
        <div className="enlight-diff-step">
          <span className="enlight-diff-step__num">2</span>
          <span>Substitute upper limit: F(3) = 12</span>
        </div>
        <div className="enlight-diff-step">
          <span className="enlight-diff-step__num">3</span>
          <span>Subtract lower limit: F(3) − F(1) = 12 − 2 = <strong>10</strong></span>
        </div>
      </div>
    </div>
  )
}

type AreaCase = 'above' | 'below' | 'both'

const AREA_CASE_META: Record<AreaCase, { label: string; intro: string }> = {
  above: {
    label: 'Above axis',
    intro: 'When y ≥ 0 on [a, b], the integral gives the area directly: A = ∫ₐᵇ y dx.',
  },
  below: {
    label: 'Below axis',
    intro: 'When y ≤ 0 on [a, b], the integral is negative. Use A = −∫ₐᵇ y dx, swap limits (∫ᵇₐ y dx), or write ∫ₐᵇ |y| dx.',
  },
  both: {
    label: 'Both sides',
    intro: 'When the curve crosses the x-axis, split at each root and add |each part| — never integrate straight through a sign change.',
  },
}

function AreaGraph({
  fn,
  segments,
  roots,
  xMin,
  xMax,
  yMin,
  yMax,
  lo,
  hi,
  ariaLabel,
}: {
  fn: (x: number) => number
  segments: { from: number; to: number; fill: string }[]
  roots?: number[]
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  lo: number
  hi: number
  ariaLabel: string
}) {
  const curvePath = useMemo(() => buildPath(fn, xMin, xMax, yMin, yMax), [fn, xMin, xMax, yMin, yMax])
  const areaPaths = useMemo(
    () => segments.map((s) => buildAreaPath(fn, s.from, s.to, xMin, xMax, yMin, yMax)),
    [fn, segments, xMin, xMax, yMin, yMax],
  )

  return (
    <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
      {[...Array(9)].map((_, i) => {
        const x = xMin + (i * (xMax - xMin)) / 8
        return <line key={i} x1={toSvgX(x, xMin, xMax)} y1={0} x2={toSvgX(x, xMin, xMax)} y2={H} stroke={GRAPH.grid} strokeWidth={1} />
      })}
      <line x1={0} y1={toSvgY(0, yMin, yMax)} x2={W} y2={toSvgY(0, yMin, yMax)} stroke={GRAPH.axis} strokeWidth={1.5} />
      {areaPaths.map((path, i) => (
        <polygon key={i} points={path} fill={segments[i].fill} stroke="none" />
      ))}
      <polyline points={curvePath} fill="none" stroke="#7c3aed" strokeWidth={2.5} />
      {roots?.map((root) => (
        <circle
          key={root}
          cx={toSvgX(root, xMin, xMax)}
          cy={toSvgY(0, yMin, yMax)}
          r={5}
          fill="#be123c"
          stroke="#fff"
          strokeWidth={1.5}
        />
      ))}
      <line x1={toSvgX(lo, xMin, xMax)} y1={0} x2={toSvgX(lo, xMin, xMax)} y2={H} stroke="#d97706" strokeWidth={2} strokeDasharray="5 4" />
      <line x1={toSvgX(hi, xMin, xMax)} y1={0} x2={toSvgX(hi, xMin, xMax)} y2={H} stroke="#d97706" strokeWidth={2} strokeDasharray="5 4" />
      <text x={toSvgX(lo, xMin, xMax)} y={H - 6} textAnchor="middle" fontSize={10} fill="#d97706" fontWeight={700}>
        a
      </text>
      <text x={toSvgX(hi, xMin, xMax)} y={H - 6} textAnchor="middle" fontSize={10} fill="#d97706" fontWeight={700}>
        b
      </text>
    </svg>
  )
}

function AreaAboveCase() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(3)
  const lo = Math.min(a, b)
  const hi = Math.max(a, b)
  const fn = (x: number) => x * x
  const signed = (hi ** 3 - lo ** 3) / 3

  return (
    <>
      <div className="enlight-int-sliders">
        <div className="enlight-slider-group">
          <label htmlFor="int-a">Lower limit <strong>a</strong> = {a.toFixed(1)}</label>
          <input id="int-a" type="range" min={0} max={3.5} step={0.1} value={a} onChange={(e) => setA(Number(e.target.value))} />
        </div>
        <div className="enlight-slider-group">
          <label htmlFor="int-b">Upper limit <strong>b</strong> = {b.toFixed(1)}</label>
          <input id="int-b" type="range" min={0.5} max={4} step={0.1} value={b} onChange={(e) => setB(Number(e.target.value))} />
        </div>
      </div>
      <AreaGraph
        fn={fn}
        segments={[{ from: lo, to: hi, fill: 'rgba(124,58,237,0.28)' }]}
        xMin={0}
        xMax={4}
        yMin={0}
        yMax={12}
        lo={lo}
        hi={hi}
        ariaLabel="Area above the x-axis"
      />
      <div className="enlight-guide-calc">
        <div>
          <strong>y = x²</strong> stays above the axis, so A = ∫<sub>{lo.toFixed(1)}</sub><sup>{hi.toFixed(1)}</sup> x² dx ={' '}
          <strong>{signed.toFixed(2)}</strong> sq units
        </div>
      </div>
    </>
  )
}

function AreaBelowCase() {
  const lo = 1
  const hi = 3
  const fn = (x: number) => -x * x
  const signed = (hi ** 3 - lo ** 3) / -3
  const area = Math.abs(signed)

  return (
    <>
      <AreaGraph
        fn={fn}
        segments={[{ from: lo, to: hi, fill: 'rgba(190,18,60,0.22)' }]}
        xMin={0}
        xMax={4}
        yMin={-12}
        yMax={2}
        lo={lo}
        hi={hi}
        ariaLabel="Area below the x-axis"
      />
      <div className="enlight-guide-calc">
        <div>
          <strong>y = −x²</strong> from {lo} to {hi}: ∫<sub>1</sub><sup>3</sup> (−x²) dx = <strong>{signed.toFixed(2)}</strong> (signed, negative)
        </div>
        <div>
          Area = −∫<sub>1</sub><sup>3</sup> (−x²) dx = ∫<sub>3</sub><sup>1</sup> (−x²) dx = <strong>{area.toFixed(2)}</strong> sq units
        </div>
        <div className="enlight-guide-calc__note">Swap limits or add modulus — both give a positive area.</div>
      </div>
    </>
  )
}

function AreaBothCase() {
  const lo = 0
  const hi = 2.5
  const root = Math.sqrt(3)
  const fn = (x: number) => x * x - 3
  const int = (x: number) => (x ** 3) / 3 - 3 * x
  const part1 = Math.abs(int(root) - int(lo))
  const part2 = Math.abs(int(hi) - int(root))
  const signed = int(hi) - int(lo)
  const total = part1 + part2

  return (
    <>
      <AreaGraph
        fn={fn}
        segments={[
          { from: lo, to: root, fill: 'rgba(190,18,60,0.22)' },
          { from: root, to: hi, fill: 'rgba(124,58,237,0.28)' },
        ]}
        roots={[root]}
        xMin={-0.5}
        xMax={3}
        yMin={-4}
        yMax={4}
        lo={lo}
        hi={hi}
        ariaLabel="Area with curve crossing the x-axis"
      />
      <div className="enlight-guide-calc">
        <div>
          <strong>y = x² − 3</strong> crosses at x = √3 ≈ {root.toFixed(2)}. Signed integral = <strong>{signed.toFixed(2)}</strong>
        </div>
        <div>
          Split: |∫<sub>0</sub><sup>√3</sup> (x²−3) dx| + |∫<sub>√3</sub><sup>2.5</sup> (x²−3) dx| = {part1.toFixed(2)} + {part2.toFixed(2)} ={' '}
          <strong>{total.toFixed(2)}</strong> sq units
        </div>
        <div className="enlight-guide-calc__note">Red = below axis, purple = above axis — add both parts.</div>
      </div>
    </>
  )
}

function AreaPanel() {
  const [areaCase, setAreaCase] = useState<AreaCase>('above')
  const meta = AREA_CASE_META[areaCase]

  return (
    <div>
      <p className="enlight-guide-panel__intro">{meta.intro}</p>
      <div className="enlight-guide-tabs enlight-guide-tabs--int">
        {(Object.keys(AREA_CASE_META) as AreaCase[]).map((id) => (
          <button
            key={id}
            type="button"
            className={`enlight-guide-tabs__btn${areaCase === id ? ' enlight-guide-tabs__btn--active' : ''}`}
            onClick={() => setAreaCase(id)}
          >
            {AREA_CASE_META[id].label}
          </button>
        ))}
      </div>
      {areaCase === 'above' && <AreaAboveCase />}
      {areaCase === 'below' && <AreaBelowCase />}
      {areaCase === 'both' && <AreaBothCase />}
    </div>
  )
}

const ALL: IntegrationGuidePanel[] = ['indefinite', 'definite', 'area']

const META: Record<IntegrationGuidePanel, { label: string; title: string; intro: string }> = {
  indefinite: { label: 'Indefinite', title: 'Indefinite Integrals', intro: 'Reverse differentiation — always add +C.' },
  power: { label: 'Power rule', title: 'Polynomial Integration', intro: 'Integrate powers of x term by term — reverse of the basic power rule.' },
  axb: { label: '(ax + b)ⁿ', title: 'Linear Power Integration', intro: 'Integrate (ax + b)ⁿ without expanding — divide by a and the new power.' },
  'exp-trig': { label: 'Exp · trig', title: 'Exponential & Trig Integration', intro: 'Reverse Ch.14 derivatives — eˣ, sin, cos, and tan (via sec²).' },
  definite: { label: 'Definite', title: 'Definite Integrals', intro: 'Evaluate F(b) − F(a) between two limits.' },
  area: { label: 'Area', title: 'Area Under a Curve', intro: 'Signed vs total area — above, below, and crossing the x-axis.' },
}

function renderPanel(p: IntegrationGuidePanel) {
  switch (p) {
    case 'indefinite':
    case 'power':
      return <PowerPanel />
    case 'axb':
      return <AxbPowerPanel />
    case 'exp-trig':
      return <ExpTrigPanel />
    case 'definite':
      return <DefinitePanel />
    case 'area':
      return <AreaPanel />
  }
}

export function IntegrationVisualGuide({ panels }: { panels?: IntegrationGuidePanel[] }) {
  const active = panels?.length ? panels : ALL
  const [tab, setTab] = useState<IntegrationGuidePanel>(active[0])
  const current = active.includes(tab) ? tab : active[0]
  const meta = META[current]

  return (
    <section className="enlight-explorer enlight-int-guide">
      <h2 className="enlight-explorer__title">{meta.title}</h2>
      <p className="enlight-body-text enlight-guide__intro">{meta.intro}</p>
      {active.length > 1 && (
        <div className="enlight-guide-tabs enlight-guide-tabs--int">
          {active.map((id) => (
            <button key={id} type="button" className={`enlight-guide-tabs__btn${current === id ? ' enlight-guide-tabs__btn--active' : ''}`} onClick={() => setTab(id)}>
              {META[id].label}
            </button>
          ))}
        </div>
      )}
      {renderPanel(current)}
    </section>
  )
}
