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

function IndefinitePanel() {
  const examples = [
    { f: '3x²', F: 'x³ + C', d: 'differentiate → 3x²' },
    { f: 'e²ˣ', F: '½e²ˣ + C', d: 'differentiate → e²ˣ' },
    { f: '1/x', F: 'ln|x| + C', d: 'differentiate → 1/x' },
  ]

  return (
    <div>
      <p className="enlight-guide-panel__intro">
        Integration reverses differentiation. Every indefinite integral needs <strong>+ C</strong>.
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
        <div className="enlight-guide-calc__note">Power +1, divide by new power. Never use power rule when n = −1.</div>
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

function AreaPanel() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(3)
  const lo = Math.min(a, b)
  const hi = Math.max(a, b)
  const fn = (x: number) => x * x
  const area = (hi ** 3 - lo ** 3) / 3

  const xMin = 0
  const xMax = 4
  const yMin = 0
  const yMax = 12
  const curvePath = useMemo(() => buildPath(fn, xMin, xMax, yMin, yMax), [xMin, xMax, yMin, yMax])
  const areaPath = useMemo(() => buildAreaPath(fn, lo, hi, xMin, xMax, yMin, yMax), [lo, hi, xMin, xMax, yMin, yMax])

  return (
    <div>
      <p className="enlight-guide-panel__intro">
        Area under <strong>y = x²</strong> from <strong>x = a</strong> to <strong>x = b</strong>:{' '}
        <strong>A = ∫ₐᵇ y dx</strong>.
      </p>
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
      <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Area under curve">
        {[...Array(9)].map((_, i) => {
          const x = xMin + (i * (xMax - xMin)) / 8
          return <line key={i} x1={toSvgX(x, xMin, xMax)} y1={0} x2={toSvgX(x, xMin, xMax)} y2={H} stroke={GRAPH.grid} strokeWidth={1} />
        })}
        <line x1={0} y1={toSvgY(0, yMin, yMax)} x2={W} y2={toSvgY(0, yMin, yMax)} stroke={GRAPH.axis} strokeWidth={1.5} />
        <polygon points={areaPath} fill="rgba(124,58,237,0.25)" stroke="none" />
        <polyline points={curvePath} fill="none" stroke="#7c3aed" strokeWidth={2.5} />
        <line x1={toSvgX(lo, xMin, xMax)} y1={0} x2={toSvgX(lo, xMin, xMax)} y2={H} stroke="#d97706" strokeWidth={2} strokeDasharray="5 4" />
        <line x1={toSvgX(hi, xMin, xMax)} y1={0} x2={toSvgX(hi, xMin, xMax)} y2={H} stroke="#d97706" strokeWidth={2} strokeDasharray="5 4" />
        <text x={toSvgX(lo, xMin, xMax)} y={H - 6} textAnchor="middle" fontSize={10} fill="#d97706" fontWeight={700}>
          a
        </text>
        <text x={toSvgX(hi, xMin, xMax)} y={H - 6} textAnchor="middle" fontSize={10} fill="#d97706" fontWeight={700}>
          b
        </text>
      </svg>
      <div className="enlight-guide-calc">
        <div>
          A = ∫_{lo.toFixed(1)}^{hi.toFixed(1)} x² dx = [x³/3] = <strong>{area.toFixed(2)}</strong> square units
        </div>
      </div>
    </div>
  )
}

const ALL: IntegrationGuidePanel[] = ['indefinite', 'definite', 'area']

const META: Record<IntegrationGuidePanel, { label: string; title: string; intro: string }> = {
  indefinite: { label: 'Indefinite', title: 'Indefinite Integrals', intro: 'Reverse differentiation — always add +C.' },
  definite: { label: 'Definite', title: 'Definite Integrals', intro: 'Evaluate F(b) − F(a) between two limits.' },
  area: { label: 'Area', title: 'Area Under a Curve', intro: 'Shaded region = definite integral.' },
}

function renderPanel(p: IntegrationGuidePanel) {
  switch (p) {
    case 'indefinite':
      return <IndefinitePanel />
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
