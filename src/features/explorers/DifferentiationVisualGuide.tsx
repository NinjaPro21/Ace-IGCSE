import { useMemo, useState } from 'react'
import { GRAPH } from './graphTheme'
import type { DiffGuidePanel } from '@/lib/contentTypes'

type Tab = DiffGuidePanel

const ALL_PANELS: Tab[] = ['gradient', 'tangent', 'approximation', 'rates', 'optimization', 'rules']

const PANEL_META: Record<Tab, { label: string; title: string; intro: string }> = {
  gradient: {
    label: 'Gradient tracer',
    title: 'Gradient Tracer',
    intro: 'Drag along the curve to see the tangent slope at each point — that slope is dy/dx.',
  },
  tangent: {
    label: 'Tangent & normal',
    title: 'Tangents & Normals',
    intro: 'The derivative gives the tangent gradient; the normal is perpendicular with gradient −1/m.',
  },
  approximation: {
    label: 'Small approx',
    title: 'Small Increments',
    intro: 'For a tiny change in x, the curve behaves like its tangent: δy ≈ (dy/dx) × δx.',
  },
  rates: {
    label: 'Rate of change',
    title: 'Connected Rates',
    intro: 'Chain related rates so matching variables cancel — e.g. how fast a cone fills with water.',
  },
  optimization: {
    label: 'Max area',
    title: 'Optimization',
    intro: 'Set dA/dx = 0 to find turning points, then use d²A/dx² to confirm a maximum or minimum.',
  },
  rules: {
    label: 'Rules',
    title: 'Derivative Rules',
    intro: 'Quick reference for power, chain, product, quotient, and transcendental derivatives.',
  },
  chain: {
    label: 'Chain rule',
    title: 'Chain Rule — (ax + b)ⁿ',
    intro: 'Differentiate a linear power: bring down n, reduce power by 1, multiply by a.',
  },
  transcendental: {
    label: 'Exp · log · trig',
    title: 'Transcendental Derivatives',
    intro: 'See how eˣ, ln x, and sin/cos relate to their derivatives — Ch.14 focus.',
  },
  trig: {
    label: 'Sin · cos · tan',
    title: 'Trigonometric Derivatives',
    intro: 'sin → cos, cos → −sin, tan → sec² — with the chain rule for ax + b.',
  },
  power: {
    label: 'Power rule',
    title: 'Power Rule',
    intro: 'Multiply by the power, then subtract 1 from the power.',
  },
  product: {
    label: 'Product rule',
    title: 'Product Rule',
    intro: 'First × derivative of second + second × derivative of first.',
  },
  quotient: {
    label: 'Quotient rule',
    title: 'Quotient Rule',
    intro: 'Bottom × derivative of top − top × derivative of bottom, all over bottom squared.',
  },
  approx: {
    label: 'Small changes',
    title: 'Small Increments',
    intro: 'For a tiny change in x, δy ≈ (dy/dx) × δx.',
  },
  exponential: {
    label: 'Exponential',
    title: 'Exponential Derivatives',
    intro: 'eˣ is its own derivative; for e^(ax+b), multiply by a.',
  },
  logarithm: {
    label: 'Logarithm',
    title: 'Logarithmic Derivatives',
    intro: 'd/dx ln x = 1/x; for ln(ax+b), put a in the numerator.',
  },
  cheatsheet: {
    label: 'Cheat sheet',
    title: 'Differentiation Cheat Sheet',
    intro: 'All Ch.12–14 derivative rules in one place — use as a quick reference at the end of the chapter.',
  },
}

function renderPanel(tab: Tab) {
  switch (tab) {
    case 'gradient':
      return <GradientTracerPanel />
    case 'tangent':
      return <TangentNormalPanel />
    case 'approximation':
      return <SmallApproximationPanel />
    case 'rates':
      return <RateOfChangePanel />
    case 'optimization':
      return <OptimizationPanel />
    case 'rules':
      return <RulesPanel />
    case 'chain':
      return <ChainRulePanel />
    case 'transcendental':
      return <TranscendentalPanel />
    case 'trig':
      return <TrigDerivPanel />
    case 'power':
      return <FormulaRefPanel titles={['Power rule', 'Constants']} />
    case 'product':
      return <FormulaRefPanel titles={['Product rule']} />
    case 'quotient':
      return <FormulaRefPanel titles={['Quotient rule']} />
    case 'approx':
      return <ApproxFormulaPanel />
    case 'exponential':
      return <FormulaRefPanel titles={['Exponential']} intro="The derivative of e^(ax+b) equals the original, scaled by a." />
    case 'logarithm':
      return <FormulaRefPanel titles={['Logarithm']} intro="Inner derivative over the inner expression." />
    case 'cheatsheet':
      return <CheatsheetPanel />
  }
}

const W = 480
const H = 220
const H_SMALL = 130
const STEP = 0.04

function toSvgX(x: number, xMin: number, xMax: number) {
  return ((x - xMin) / (xMax - xMin)) * W
}
function toSvgY(y: number, yMin: number, yMax: number, h: number) {
  return h - ((y - yMin) / (yMax - yMin)) * h
}

function buildPath(
  evalFn: (x: number) => number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  h: number,
): string {
  const pts: string[] = []
  for (let x = xMin; x <= xMax + STEP / 2; x += STEP) {
    const y = evalFn(x)
    if (y < yMin - 2 || y > yMax + 2) continue
    pts.push(`${toSvgX(x, xMin, xMax).toFixed(1)},${toSvgY(y, yMin, yMax, h).toFixed(1)}`)
  }
  return pts.join(' ')
}

function GraphGrid({
  xMin,
  xMax,
  yMin,
  yMax,
  h,
  xTicks,
  yTicks,
}: {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  h: number
  xTicks: number[]
  yTicks: number[]
}) {
  return (
    <>
      {[...Array(11)].map((_, i) => {
        const x = xMin + (i * (xMax - xMin)) / 10
        return (
          <line
            key={`v${i}`}
            x1={toSvgX(x, xMin, xMax)}
            y1={0}
            x2={toSvgX(x, xMin, xMax)}
            y2={h}
            stroke={GRAPH.grid}
            strokeWidth={1}
          />
        )
      })}
      {[...Array(8)].map((_, i) => {
        const y = yMin + (i * (yMax - yMin)) / 7
        return (
          <line
            key={`h${i}`}
            x1={0}
            y1={toSvgY(y, yMin, yMax, h)}
            x2={W}
            y2={toSvgY(y, yMin, yMax, h)}
            stroke={GRAPH.grid}
            strokeWidth={1}
          />
        )
      })}
      <line x1={toSvgX(0, xMin, xMax)} y1={0} x2={toSvgX(0, xMin, xMax)} y2={h} stroke={GRAPH.axis} strokeWidth={1.5} />
      <line x1={0} y1={toSvgY(0, yMin, yMax, h)} x2={W} y2={toSvgY(0, yMin, yMax, h)} stroke={GRAPH.axis} strokeWidth={1.5} />
      {xTicks.map((n) => (
        <text key={`x${n}`} x={toSvgX(n, xMin, xMax)} y={toSvgY(0, yMin, yMax, h) + 14} textAnchor="middle" fill={GRAPH.muted} fontSize={9}>
          {n}
        </text>
      ))}
      {yTicks.map((n) => (
        <text key={`y${n}`} x={6} y={toSvgY(n, yMin, yMax, h) + 3} fill={GRAPH.muted} fontSize={9}>
          {n}
        </text>
      ))}
    </>
  )
}

/* ── Tab 1: Gradient tracer ─────────────────────────────────────────── */

function cubic(x: number) {
  return x ** 3 - 3 * x ** 2 + 2
}
function cubicDeriv(x: number) {
  return 3 * x ** 2 - 6 * x
}

function GradientTracerPanel() {
  const [x, setX] = useState(1)
  const xMin = -0.5
  const xMax = 3.5
  const yMin = -3
  const yMax = 4
  const y = cubic(x)
  const m = cubicDeriv(x)

  const curvePath = useMemo(() => buildPath(cubic, xMin, xMax, yMin, yMax, H), [])
  const derivPath = useMemo(() => buildPath(cubicDeriv, xMin, xMax, -8, 8, H_SMALL), [])

  const tangentSpan = 1.2
  const tx1 = x - tangentSpan
  const tx2 = x + tangentSpan
  const ty1 = y + m * (tx1 - x)
  const ty2 = y + m * (tx2 - x)

  return (
    <div className="enlight-diff-gradient">
      <p className="enlight-diff-panel__intro">
        Drag <strong>x</strong> along <strong>y = x³ − 3x² + 2</strong>. The tangent slope at each point is{' '}
        <strong>dy/dx = 3x² − 6x</strong> — plotted below.
      </p>

      <div className="enlight-slider-group">
        <label htmlFor="diff-x">
          <strong>x</strong> = {x.toFixed(1)} &nbsp;·&nbsp; <strong>y</strong> = {y.toFixed(2)} &nbsp;·&nbsp;{' '}
          <strong>dy/dx</strong> = {m.toFixed(2)}
        </label>
        <input id="diff-x" type="range" min={xMin} max={xMax} step={0.05} value={x} onChange={(e) => setX(Number(e.target.value))} />
      </div>

      <div className="enlight-diff-graph-block">
        <div className="enlight-diff-graph-label">Curve y = f(x)</div>
        <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Curve with tangent">
          <GraphGrid xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} h={H} xTicks={[-0, 1, 2, 3]} yTicks={[-2, 0, 2, 4]} />
          <polyline points={curvePath} fill="none" stroke="#0891b2" strokeWidth={2.5} strokeLinecap="round" />
          <line
            x1={toSvgX(tx1, xMin, xMax)}
            y1={toSvgY(ty1, yMin, yMax, H)}
            x2={toSvgX(tx2, xMin, xMax)}
            y2={toSvgY(ty2, yMin, yMax, H)}
            stroke="#d97706"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <circle cx={toSvgX(x, xMin, xMax)} cy={toSvgY(y, yMin, yMax, H)} r={6} fill="#1c1917" stroke="#fff" strokeWidth={2} />
        </svg>
      </div>

      <div className="enlight-diff-graph-block">
        <div className="enlight-diff-graph-label">Gradient function dy/dx</div>
        <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H_SMALL}`} role="img" aria-label="Derivative graph">
          <GraphGrid xMin={xMin} xMax={xMax} yMin={-8} yMax={8} h={H_SMALL} xTicks={[0, 1, 2, 3]} yTicks={[-6, 0, 6]} />
          <polyline points={derivPath} fill="none" stroke="#7c3aed" strokeWidth={2.5} strokeLinecap="round" />
          <line
            x1={toSvgX(xMin, xMin, xMax)}
            y1={toSvgY(m, -8, 8, H_SMALL)}
            x2={toSvgX(xMax, xMin, xMax)}
            y2={toSvgY(m, -8, 8, H_SMALL)}
            stroke="#d97706"
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.5}
          />
          <circle cx={toSvgX(x, xMin, xMax)} cy={toSvgY(m, -8, 8, H_SMALL)} r={5} fill="#d97706" stroke="#fff" strokeWidth={1.5} />
        </svg>
      </div>

      <div className="enlight-diff-formula-row">
        <span className="enlight-diff-formula">f(x) = x³ − 3x² + 2</span>
        <span className="enlight-diff-formula enlight-diff-formula--deriv">f′(x) = 3x² − 6x</span>
      </div>
    </div>
  )
}

/* ── Tab 2: Tangent & normal ──────────────────────────────────────────── */

function parabola(x: number) {
  return x ** 2 + 3 * x
}
function parabolaDeriv(x: number) {
  return 2 * x + 3
}

function TangentNormalPanel() {
  const [x, setX] = useState(2)
  const xMin = -4
  const xMax = 2
  const yMin = -4
  const yMax = 12
  const y = parabola(x)
  const mt = parabolaDeriv(x)
  const mn = mt === 0 ? null : -1 / mt

  const curvePath = useMemo(() => buildPath(parabola, xMin, xMax, yMin, yMax, H), [])

  const span = 2
  const tLine = (m: number) => {
    const x1 = x - span
    const x2 = x + span
    return {
      x1,
      y1: y + m * (x1 - x),
      x2,
      y2: y + m * (x2 - x),
    }
  }
  const tangent = tLine(mt)
  const normal = mn !== null ? tLine(mn) : null

  const tangentEq = `y − ${y.toFixed(0)} = ${mt}(x − ${x.toFixed(0)})`
  const normalEq = mn !== null ? `y − ${y.toFixed(0)} = ${mn < 0 ? '−' : ''}${Math.abs(mn).toFixed(3)}(x − ${x.toFixed(0)})` : 'undefined (horizontal tangent)'

  return (
    <div className="enlight-diff-tangent">
      <p className="enlight-diff-panel__intro">
        On <strong>y = x² + 3x</strong>, the tangent gradient is <strong>mₜ = dy/dx = 2x + 3</strong>. The normal is
        perpendicular: <strong>mₙ = −1/mₜ</strong>.
      </p>

      <div className="enlight-slider-group">
        <label htmlFor="diff-tan-x">
          <strong>x</strong> = {x.toFixed(1)} &nbsp;·&nbsp; point ({x.toFixed(1)}, {y.toFixed(1)}) &nbsp;·&nbsp;{' '}
          <strong>mₜ</strong> = {mt} &nbsp;·&nbsp; <strong>mₙ</strong> = {mn !== null ? mn.toFixed(3) : '—'}
        </label>
        <input id="diff-tan-x" type="range" min={xMin} max={xMax} step={0.1} value={x} onChange={(e) => setX(Number(e.target.value))} />
      </div>

      <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Tangent and normal lines">
        <GraphGrid xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} h={H} xTicks={[-4, -2, 0, 2]} yTicks={[0, 4, 8, 12]} />
        <polyline points={curvePath} fill="none" stroke="#0891b2" strokeWidth={2.5} strokeLinecap="round" />
        <line
          x1={toSvgX(tangent.x1, xMin, xMax)}
          y1={toSvgY(tangent.y1, yMin, yMax, H)}
          x2={toSvgX(tangent.x2, xMin, xMax)}
          y2={toSvgY(tangent.y2, yMin, yMax, H)}
          stroke="#d97706"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {normal && (
          <line
            x1={toSvgX(normal.x1, xMin, xMax)}
            y1={toSvgY(normal.y1, yMin, yMax, H)}
            x2={toSvgX(normal.x2, xMin, xMax)}
            y2={toSvgY(normal.y2, yMin, yMax, H)}
            stroke="#7c3aed"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        )}
        <circle cx={toSvgX(x, xMin, xMax)} cy={toSvgY(y, yMin, yMax, H)} r={6} fill="#1c1917" stroke="#fff" strokeWidth={2} />
        <g className="enlight-diff-legend">
          <line x1={12} y1={14} x2={32} y2={14} stroke="#d97706" strokeWidth={2.5} />
          <text x={38} y={17} fontSize={9} fill="#64748b">
            tangent
          </text>
          <line x1={100} y1={14} x2={120} y2={14} stroke="#7c3aed" strokeWidth={2.5} />
          <text x={126} y={17} fontSize={9} fill="#64748b">
            normal (⊥)
          </text>
        </g>
      </svg>

      <div className="enlight-diff-eq-cards">
        <div className="enlight-diff-eq-card enlight-diff-eq-card--tan">
          <div className="enlight-diff-eq-card__label">Tangent · mₜ = {mt}</div>
          <div className="enlight-diff-eq-card__eq">{tangentEq}</div>
        </div>
        <div className="enlight-diff-eq-card enlight-diff-eq-card--norm">
          <div className="enlight-diff-eq-card__label">Normal · mₙ = −1/mₜ</div>
          <div className="enlight-diff-eq-card__eq">{normalEq}</div>
        </div>
      </div>
    </div>
  )
}

/* ── Tab 3: Small approximations ──────────────────────────────────────── */

function cube(x: number) {
  return x ** 3
}
function cubeDeriv(x: number) {
  return 3 * x ** 2
}

function SmallApproximationPanel() {
  const x0 = 2
  const y0 = cube(x0)
  const [deltaX, setDeltaX] = useState(0.1)
  const xNew = x0 + deltaX
  const yNew = cube(xNew)
  const gradient = cubeDeriv(x0)
  const deltaYApprox = gradient * deltaX
  const deltaYExact = yNew - y0
  const error = Math.abs(deltaYExact - deltaYApprox)

  const xMin = 1.5
  const xMax = 2.6
  const yMin = 6
  const yMax = 20
  const curvePath = useMemo(() => buildPath(cube, xMin, xMax, yMin, yMax, H), [])

  const m = gradient
  const tangentX1 = x0 - 0.15
  const tangentX2 = xNew + 0.05
  const tangentY1 = y0 + m * (tangentX1 - x0)
  const tangentY2 = y0 + m * (tangentX2 - x0)
  const yApprox = y0 + deltaYApprox

  return (
    <div className="enlight-diff-approx">
      <p className="enlight-diff-panel__intro">
        For a <strong>small</strong> change in x, treat the curve like its tangent:{' '}
        <strong>δy ≈ (dy/dx) × δx</strong>. Example: <strong>y = x³</strong> near x = 2.
      </p>

      <div className="enlight-slider-group">
        <label htmlFor="diff-dx">
          <strong>δx</strong> = {deltaX.toFixed(2)} &nbsp;·&nbsp; x: {x0} → {xNew.toFixed(2)} &nbsp;·&nbsp;{' '}
          <strong>δy ≈ {deltaYApprox.toFixed(3)}</strong> &nbsp;·&nbsp; exact Δy = {deltaYExact.toFixed(3)}
        </label>
        <input
          id="diff-dx"
          type="range"
          min={0.02}
          max={0.3}
          step={0.01}
          value={deltaX}
          onChange={(e) => setDeltaX(Number(e.target.value))}
        />
      </div>

      <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Small increment approximation">
        <GraphGrid xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} h={H} xTicks={[1.6, 2, 2.4]} yTicks={[8, 12, 16]} />
        <polyline points={curvePath} fill="none" stroke="#0891b2" strokeWidth={2.5} strokeLinecap="round" />
        <line
          x1={toSvgX(tangentX1, xMin, xMax)}
          y1={toSvgY(tangentY1, yMin, yMax, H)}
          x2={toSvgX(tangentX2, xMin, xMax)}
          y2={toSvgY(tangentY2, yMin, yMax, H)}
          stroke="#d97706"
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* δx arrow on x-axis */}
        <line
          x1={toSvgX(x0, xMin, xMax)}
          y1={toSvgY(y0, yMin, yMax, H) + 28}
          x2={toSvgX(xNew, xMin, xMax)}
          y2={toSvgY(y0, yMin, yMax, H) + 28}
          stroke="#64748b"
          strokeWidth={1.5}
          markerEnd="url(#diff-arrow)"
        />
        <text x={toSvgX((x0 + xNew) / 2, xMin, xMax)} y={toSvgY(y0, yMin, yMax, H) + 42} textAnchor="middle" fontSize={9} fill="#64748b">
          δx
        </text>
        {/* δy approx (along tangent) */}
        <line
          x1={toSvgX(xNew, xMin, xMax) + 14}
          y1={toSvgY(y0, yMin, yMax, H)}
          x2={toSvgX(xNew, xMin, xMax) + 14}
          y2={toSvgY(yApprox, yMin, yMax, H)}
          stroke="#d97706"
          strokeWidth={2.5}
        />
        <text x={toSvgX(xNew, xMin, xMax) + 22} y={toSvgY((y0 + yApprox) / 2, yMin, yMax, H) + 3} fontSize={9} fill="#d97706" fontWeight={700}>
          δy≈
        </text>
        {/* exact Δy (on curve) */}
        <line
          x1={toSvgX(xNew, xMin, xMax) - 14}
          y1={toSvgY(y0, yMin, yMax, H)}
          x2={toSvgX(xNew, xMin, xMax) - 14}
          y2={toSvgY(yNew, yMin, yMax, H)}
          stroke="#0891b2"
          strokeWidth={2.5}
          strokeDasharray="4 3"
        />
        <text x={toSvgX(xNew, xMin, xMax) - 22} y={toSvgY((y0 + yNew) / 2, yMin, yMax, H) + 3} textAnchor="end" fontSize={9} fill="#0891b2" fontWeight={700}>
          Δy
        </text>
        <circle cx={toSvgX(x0, xMin, xMax)} cy={toSvgY(y0, yMin, yMax, H)} r={5} fill="#1c1917" stroke="#fff" strokeWidth={1.5} />
        <circle cx={toSvgX(xNew, xMin, xMax)} cy={toSvgY(yNew, yMin, yMax, H)} r={5} fill="#0891b2" stroke="#fff" strokeWidth={1.5} />
        <defs>
          <marker id="diff-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
          </marker>
        </defs>
      </svg>

      <div className="enlight-diff-calc-flow">
        <div className="enlight-diff-calc-step">
          <span className="enlight-diff-calc-step__label">1 · Gradient at x = 2</span>
          <span className="enlight-diff-calc-step__eq">dy/dx = 3x² = 3(4) = <strong>{gradient}</strong></span>
        </div>
        <div className="enlight-diff-calc-step">
          <span className="enlight-diff-calc-step__label">2 · Approximate change</span>
          <span className="enlight-diff-calc-step__eq">
            δy ≈ {gradient} × {deltaX.toFixed(2)} = <strong>{deltaYApprox.toFixed(3)}</strong>
          </span>
        </div>
        <div className="enlight-diff-calc-step">
          <span className="enlight-diff-calc-step__label">3 · Exact change (check)</span>
          <span className="enlight-diff-calc-step__eq">
            Δy = {xNew.toFixed(2)}³ − 8 = <strong>{deltaYExact.toFixed(3)}</strong>
            <span className="enlight-diff-calc-step__err"> (error {error.toFixed(3)})</span>
          </span>
        </div>
      </div>
      <p className="enlight-diff-panel__note">Smaller δx → better match. Large δx bends away from the tangent.</p>
    </div>
  )
}

/* ── Tab 4: Rate of change (cone) ─────────────────────────────────────── */

const CONE_H = 6
const CONE_R = 4
const CONE_K = CONE_R / CONE_H // r = k·h (similar triangles from apex)

function coneRadius(h: number) {
  return CONE_K * h
}
function coneVolume(h: number) {
  const r = coneRadius(h)
  return (Math.PI * r * r * h) / 3
}
function coneDvDh(h: number) {
  return Math.PI * CONE_K * CONE_K * h * h
}

function RateOfChangePanel() {
  const [h, setH] = useState(3.9)
  const [dhDt, setDhDt] = useState(2)
  const r = coneRadius(h)
  const V = coneVolume(h)
  const dVdh = coneDvDh(h)
  const dVdt = dVdh * dhDt

  const svgW = 200
  const svgH = 220
  const cx = 100
  const topY = 24
  const apexY = 200
  const scale = (apexY - topY) / CONE_H
  const waterY = apexY - h * scale
  const waterR = (r / CONE_R) * 72

  return (
    <div className="enlight-diff-rates">
      <p className="enlight-diff-panel__intro">
        Water fills a cone <strong>tip-down</strong> (height {CONE_H} cm, base radius {CONE_R} cm). The water surface
        forms a smaller similar cone — chain the rates: <strong>dV/dt = (dV/dh) × (dh/dt)</strong>.
      </p>

      <div className="enlight-diff-rates-layout">
        <div className="enlight-diff-cone-diagram">
          <div className="enlight-diff-cone-diagram__label">INVERTED CONE (tip at bottom)</div>
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="enlight-diff-cone-svg" role="img" aria-label="Inverted cone filling with water">
            {/* Empty cone outline — apex at bottom, base at top */}
            <polygon points={`${cx},${apexY} ${cx - 72},${topY} ${cx + 72},${topY}`} fill="rgba(8,145,178,0.06)" stroke="#0891b2" strokeWidth={2} />
            {/* Water = smaller similar cone from apex up to water line */}
            <polygon
              points={`${cx},${apexY} ${cx - waterR},${waterY} ${cx + waterR},${waterY}`}
              fill="rgba(8,145,178,0.4)"
              stroke="#0891b2"
              strokeWidth={1.5}
            />
            <line x1={cx - waterR} y1={waterY} x2={cx + waterR} y2={waterY} stroke="#0891b2" strokeWidth={1.5} strokeDasharray="4 3" />
            <circle cx={cx} cy={apexY} r={3} fill="#0891b2" />
            <text x={cx + waterR + 4} y={waterY + 4} fontSize={10} fill="#0891b2" fontWeight={600}>
              r = {r.toFixed(1)}
            </text>
            <line x1={cx + 84} y1={apexY} x2={cx + 84} y2={waterY} stroke="#64748b" strokeWidth={1.5} />
            <text x={cx + 90} y={(apexY + waterY) / 2 + 4} fontSize={10} fill="#64748b" fontWeight={600}>
              h = {h.toFixed(1)}
            </text>
            <text x={cx} y={topY - 6} textAnchor="middle" fontSize={9} fill="#64748b">
              base R = {CONE_R}
            </text>
          </svg>
        </div>

        <div className="enlight-diff-rates-controls">
          <div className="enlight-slider-group">
            <label htmlFor="diff-h">
              Water depth <strong>h</strong> (from tip) = {h.toFixed(1)} cm
            </label>
            <input id="diff-h" type="range" min={0.5} max={5.5} step={0.1} value={h} onChange={(e) => setH(Number(e.target.value))} />
          </div>
          <div className="enlight-slider-group">
            <label htmlFor="diff-dhdt">
              Fill rate <strong>dh/dt</strong> = {dhDt} cm/s
            </label>
            <input id="diff-dhdt" type="range" min={0.5} max={4} step={0.5} value={dhDt} onChange={(e) => setDhDt(Number(e.target.value))} />
          </div>

          <div className="enlight-diff-chain">
            <div className="enlight-diff-chain__title">Chain rule in action</div>
            <div className="enlight-diff-chain__row">
              <span className="enlight-diff-chain__box">dV/dt</span>
              <span className="enlight-diff-chain__eq">=</span>
              <span className="enlight-diff-chain__box enlight-diff-chain__box--highlight">dV/dh</span>
              <span className="enlight-diff-chain__eq">×</span>
              <span className="enlight-diff-chain__box enlight-diff-chain__box--highlight">dh/dt</span>
            </div>
            <div className="enlight-diff-chain__detail">
              V = ⅓πr²h, &nbsp; r = ({CONE_R}/{CONE_H})h &nbsp;→&nbsp; V = ({CONE_R * CONE_R}/{CONE_H * CONE_H * 3})πh³ = (4π/27)h³
            </div>
            <div className="enlight-diff-chain__detail">
              dV/dh = (4π/9)h² = {dVdh.toFixed(2)} cm³/cm
            </div>
            <div className="enlight-diff-chain__result">
              dV/dt = {dVdh.toFixed(1)} × {dhDt} = <strong>{dVdt.toFixed(1)} cm³/s</strong>
            </div>
            <div className="enlight-diff-chain__detail">Current volume V = {V.toFixed(1)} cm³</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Tab 5: Optimization (second derivative) ──────────────────────────── */

function rectArea(x: number) {
  return x * (10 - x)
}
function rectAreaDeriv(x: number) {
  return 10 - 2 * x
}

const FIXED_VOLUME = 32

function boxSurface(x: number) {
  return x * x + (4 * FIXED_VOLUME) / x
}
function boxSurfaceDeriv(x: number) {
  return 2 * x - (4 * FIXED_VOLUME) / (x * x)
}
function boxSurfaceSecondDeriv(x: number) {
  return 2 + (8 * FIXED_VOLUME) / (x * x * x)
}

type OptExample = 'max' | 'min'

function MaxAreaExample() {
  const [x, setX] = useState(3)
  const other = 10 - x
  const A = rectArea(x)
  const dA = rectAreaDeriv(x)
  const d2A = -2
  const isMax = Math.abs(x - 5) < 0.15

  const xMin = 0
  const xMax = 10
  const yMin = 0
  const yMax = 30
  const curvePath = useMemo(() => buildPath(rectArea, 0.5, 9.5, yMin, yMax, H), [])

  const rectScale = 12
  const rectW = x * rectScale
  const rectH = other * rectScale

  return (
    <>
      <p className="enlight-diff-panel__intro">
        Perimeter <strong>20 cm</strong>, one side <strong>x</strong> → area <strong>A = x(10 − x)</strong>. Find the
        turning point and use <strong>d²A/dx² &lt; 0</strong> to confirm a <strong>maximum</strong>.
      </p>

      <div className="enlight-diff-opt-layout">
        <div className="enlight-diff-rect-diagram">
          <div className="enlight-diff-rect-diagram__label">RECTANGLE (perimeter 20)</div>
          <svg viewBox="0 0 180 180" className="enlight-diff-rect-svg" role="img" aria-label="Rectangle with sides x and 10-x">
            <rect
              x={(180 - rectW) / 2}
              y={(180 - rectH) / 2}
              width={rectW}
              height={rectH}
              fill="rgba(190,18,60,0.1)"
              stroke="#be123c"
              strokeWidth={2.5}
              rx={2}
            />
            <text x={90} y={(180 - rectH) / 2 - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="#be123c">
              x = {x.toFixed(1)} cm
            </text>
            <text x={(180 + rectW) / 2 + 10} y={90 + 4} fontSize={11} fontWeight={700} fill="#be123c">
              {other.toFixed(1)}
            </text>
            <text x={90} y={170} textAnchor="middle" fontSize={10} fill="#64748b">
              Area = {A.toFixed(1)} cm²
            </text>
          </svg>
        </div>

        <div className="enlight-diff-opt-controls">
          <div className="enlight-slider-group">
            <label htmlFor="diff-opt-x">
              Side <strong>x</strong> = {x.toFixed(1)} cm &nbsp;·&nbsp; <strong>A = {A.toFixed(1)} cm²</strong>
            </label>
            <input id="diff-opt-x" type="range" min={1} max={9} step={0.1} value={x} onChange={(e) => setX(Number(e.target.value))} />
          </div>

          <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Area curve with maximum">
            <GraphGrid xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} h={H} xTicks={[0, 2, 4, 6, 8, 10]} yTicks={[0, 10, 20, 30]} />
            <polyline points={curvePath} fill="none" stroke="#be123c" strokeWidth={2.5} strokeLinecap="round" />
            <circle cx={toSvgX(5, xMin, xMax)} cy={toSvgY(25, yMin, yMax, H)} r={7} fill="#be123c" stroke="#fff" strokeWidth={2} />
            <text x={toSvgX(5, xMin, xMax) + 10} y={toSvgY(25, yMin, yMax, H) - 8} fontSize={10} fontWeight={700} fill="#be123c">
              max (5, 25)
            </text>
            <circle cx={toSvgX(x, xMin, xMax)} cy={toSvgY(A, yMin, yMax, H)} r={6} fill="#1c1917" stroke="#fff" strokeWidth={2} />
          </svg>
        </div>
      </div>

      <div className="enlight-diff-steps">
        <div className="enlight-diff-step">
          <span className="enlight-diff-step__num">1</span>
          <span>
            dA/dx = 10 − 2x = 0 → <strong>x = 5</strong>
            {Math.abs(dA) < 0.05 ? ' ✓' : ''}
          </span>
        </div>
        <div className="enlight-diff-step">
          <span className="enlight-diff-step__num">2</span>
          <span>
            d²A/dx² = <strong>{d2A}</strong> &lt; 0 → <strong className="enlight-diff-max">maximum</strong>
          </span>
        </div>
        <div className="enlight-diff-step">
          <span className="enlight-diff-step__num">3</span>
          <span>
            Square sides 5 × 5 → max area = <strong>25 cm²</strong>
          </span>
        </div>
      </div>

      {isMax && (
        <div className="enlight-diff-opt-banner enlight-diff-opt-banner--max">
          At x = 5 both sides equal 5 cm — a <strong>square</strong> gives the maximum area.
        </div>
      )}
    </>
  )
}

function OpenTopBoxDiagram({ x, h }: { x: number; h: number }) {
  const px = 7
  const depX = 20
  const depY = 12
  const cx = 92
  const baseY = 148
  const w = x * px
  const ht = h * px

  const fl = { x: cx - w / 2, y: baseY }
  const fr = { x: cx + w / 2, y: baseY }
  const br = { x: fr.x + depX, y: fr.y + depY }
  const bl = { x: fl.x + depX, y: fl.y + depY }
  const flt = { x: fl.x, y: fl.y - ht }
  const frt = { x: fr.x, y: fr.y - ht }
  const brt = { x: br.x, y: br.y - ht }
  const blt = { x: bl.x, y: bl.y - ht }

  const S = x * x + 4 * x * h
  const pt = (p: { x: number; y: number }) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`

  return (
    <svg viewBox="0 0 180 180" className="enlight-diff-rect-svg" role="img" aria-label="Open-top box">
      {/* Interior floor */}
      <polygon points={`${pt(fl)} ${pt(fr)} ${pt(br)} ${pt(bl)}`} fill="rgba(5,150,105,0.08)" stroke="#059669" strokeWidth={1.5} />
      {/* Left wall */}
      <polygon points={`${pt(fl)} ${pt(bl)} ${pt(blt)} ${pt(flt)}`} fill="rgba(5,150,105,0.2)" stroke="#059669" strokeWidth={2} />
      {/* Right wall */}
      <polygon points={`${pt(fr)} ${pt(br)} ${pt(brt)} ${pt(frt)}`} fill="rgba(5,150,105,0.28)" stroke="#059669" strokeWidth={2} />
      {/* Back wall */}
      <polygon points={`${pt(bl)} ${pt(br)} ${pt(brt)} ${pt(blt)}`} fill="rgba(5,150,105,0.35)" stroke="#059669" strokeWidth={2} />
      {/* Front wall */}
      <polygon points={`${pt(fl)} ${pt(fr)} ${pt(frt)} ${pt(flt)}`} fill="rgba(5,150,105,0.15)" stroke="#059669" strokeWidth={2} />
      {/* Open top rim (back + sides only) */}
      <polyline points={`${pt(blt)} ${pt(brt)} ${pt(frt)}`} fill="none" stroke="#059669" strokeWidth={1.5} strokeDasharray="4 3" />
      <line x1={flt.x} y1={flt.y} x2={blt.x} y2={blt.y} stroke="#059669" strokeWidth={1.5} strokeDasharray="4 3" />
      {/* Height bracket on front-right edge */}
      <line x1={fr.x + 10} y1={fr.y} x2={fr.x + 10} y2={frt.y} stroke="#64748b" strokeWidth={1.5} />
      <text x={fr.x + 16} y={(fr.y + frt.y) / 2 + 4} fontSize={10} fontWeight={600} fill="#64748b">
        h = {h.toFixed(2)}
      </text>
      <text x={cx} y={baseY + 16} textAnchor="middle" fontSize={10} fontWeight={700} fill="#059669">
        base {x.toFixed(1)} × {x.toFixed(1)} cm
      </text>
      <text x={cx} y={14} textAnchor="middle" fontSize={9} fill="#64748b">
        open top (no lid)
      </text>
      <text x={cx} y={172} textAnchor="middle" fontSize={10} fill="#64748b">
        S = x² + 4xh = {S.toFixed(1)} cm²
      </text>
    </svg>
  )
}

function MinSurfaceAreaExample() {
  const [x, setX] = useState(3.2)
  const h = FIXED_VOLUME / (x * x)
  const S = x * x + 4 * x * h
  const dS = boxSurfaceDeriv(x)
  const d2S = boxSurfaceSecondDeriv(x)
  const isMin = Math.abs(x - 4) < 0.15

  const xMin = 2
  const xMax = 8
  const yMin = 40
  const yMax = 90
  const curvePath = useMemo(() => buildPath(boxSurface, xMin, xMax, yMin, yMax, H), [])

  return (
    <>
      <p className="enlight-diff-panel__intro">
        An <strong>open-top box</strong> must hold <strong>{FIXED_VOLUME} cm³</strong>. Base is a square of side{' '}
        <strong>x</strong>, height <strong>h = {FIXED_VOLUME}/x²</strong>. Minimize the <strong>surface area</strong>{' '}
        (material used): <strong>S = x² + 4xh</strong>. At the minimum, <strong>x = 2h</strong>.
      </p>

      <div className="enlight-diff-opt-layout">
        <div className="enlight-diff-rect-diagram">
          <div className="enlight-diff-rect-diagram__label">OPEN-TOP BOX (V = {FIXED_VOLUME} cm³)</div>
          <OpenTopBoxDiagram x={x} h={h} />
        </div>

        <div className="enlight-diff-opt-controls">
          <div className="enlight-slider-group">
            <label htmlFor="diff-min-box-x">
              Base side <strong>x</strong> = {x.toFixed(1)} cm &nbsp;·&nbsp; h = {h.toFixed(2)} cm &nbsp;·&nbsp;{' '}
              <strong>S = {S.toFixed(1)} cm²</strong>
            </label>
            <input id="diff-min-box-x" type="range" min={2.5} max={7} step={0.1} value={x} onChange={(e) => setX(Number(e.target.value))} />
          </div>

          <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Surface area curve with minimum">
            <GraphGrid xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} h={H} xTicks={[2, 4, 6, 8]} yTicks={[40, 55, 70, 85]} />
            <polyline points={curvePath} fill="none" stroke="#059669" strokeWidth={2.5} strokeLinecap="round" />
            <circle cx={toSvgX(4, xMin, xMax)} cy={toSvgY(48, yMin, yMax, H)} r={7} fill="#059669" stroke="#fff" strokeWidth={2} />
            <text x={toSvgX(4, xMin, xMax) + 10} y={toSvgY(48, yMin, yMax, H) - 8} fontSize={10} fontWeight={700} fill="#059669">
              min (4, 48)
            </text>
            <circle cx={toSvgX(x, xMin, xMax)} cy={toSvgY(S, yMin, yMax, H)} r={6} fill="#1c1917" stroke="#fff" strokeWidth={2} />
          </svg>
        </div>
      </div>

      <div className="enlight-diff-steps">
        <div className="enlight-diff-step">
          <span className="enlight-diff-step__num">1</span>
          <span>
            h = {FIXED_VOLUME}/x² → S = x² + {4 * FIXED_VOLUME}/x
          </span>
        </div>
        <div className="enlight-diff-step">
          <span className="enlight-diff-step__num">2</span>
          <span>
            dS/dx = 2x − {4 * FIXED_VOLUME}/x² = 0 → <strong>x = 4</strong>
            {Math.abs(dS) < 0.1 ? ' ✓' : ''}
          </span>
        </div>
        <div className="enlight-diff-step">
          <span className="enlight-diff-step__num">3</span>
          <span>
            d²S/dx² = {d2S.toFixed(1)} &gt; 0 → <strong className="enlight-diff-min">minimum</strong> surface area ={' '}
            <strong>48 cm²</strong> (base 4×4, h = 2)
          </span>
        </div>
      </div>

      {isMin && (
        <div className="enlight-diff-opt-banner enlight-diff-opt-banner--min">
          At x = 4: least material needed — base <strong>4 × 4 cm</strong>, height <strong>2 cm</strong>, min area ={' '}
          <strong>48 cm²</strong>.
        </div>
      )}
    </>
  )
}

function OptimizationPanel() {
  const [example, setExample] = useState<OptExample>('max')

  return (
    <div className="enlight-diff-optimization">
      <div className="enlight-diff-opt-tabs">
        <button
          type="button"
          className={`enlight-diff-opt-tabs__btn enlight-diff-opt-tabs__btn--max${example === 'max' ? ' enlight-diff-opt-tabs__btn--active' : ''}`}
          onClick={() => setExample('max')}
        >
          Maximum area
        </button>
        <button
          type="button"
          className={`enlight-diff-opt-tabs__btn enlight-diff-opt-tabs__btn--min${example === 'min' ? ' enlight-diff-opt-tabs__btn--active' : ''}`}
          onClick={() => setExample('min')}
        >
          Minimum surface area
        </button>
      </div>

      {example === 'max' ? <MaxAreaExample /> : <MinSurfaceAreaExample />}
    </div>
  )
}

/* ── Tab 6: Derivative rules ──────────────────────────────────────────── */

const RULES = [
  {
    title: 'Power rule',
    formula: 'd/dx (axⁿ) = anxⁿ⁻¹',
    note: 'Multiply by the power, then subtract 1 from the power.',
    example: 'd/dx (3x⁴) = 12x³',
    color: '#0891b2',
  },
  {
    title: 'Chain rule',
    formula: 'd/dx [f(x)]ⁿ = n[f(x)]ⁿ⁻¹ · f′(x)',
    note: 'Differentiate the outer, keep the inner, multiply by inner derivative.',
    example: 'd/dx (2x+1)⁵ = 10(2x+1)⁴',
    color: '#7c3aed',
  },
  {
    title: 'Product rule',
    formula: 'd/dx (uv) = u·v′ + v·u′',
    note: 'First × derivative of second + second × derivative of first.',
    example: 'd/dx (x²·eˣ) = x²eˣ + 2xeˣ',
    color: '#d97706',
  },
  {
    title: 'Quotient rule',
    formula: 'd/dx (u/v) = (v·u′ − u·v′) / v²',
    note: 'Bottom × deriv of top − top × deriv of bottom. Watch the minus sign.',
    example: 'd/dx (3x/(x−2)) = −6/(x−2)²',
    color: '#be123c',
  },
  {
    title: 'Exponential',
    formula: 'd/dx (e^(ax+b)) = ae^(ax+b)',
    note: 'The derivative equals the original, scaled by the inner coefficient.',
    example: 'd/dx (e³ˣ⁻¹) = 3e³ˣ⁻¹',
    color: '#059669',
  },
  {
    title: 'Logarithm',
    formula: 'd/dx (ln(ax+b)) = a/(ax+b)',
    note: 'Inner derivative over the inner expression.',
    example: 'd/dx (ln(2x+5)) = 2/(2x+5)',
    color: '#1e3a5f',
  },
  {
    title: 'Sine & cosine',
    formula: 'd/dx sin(ax+b) = a·cos(ax+b)\nd/dx cos(ax+b) = −a·sin(ax+b)',
    note: 'Identify a from the coefficient of x. Cos → minus sine.',
    example: 'd/dx sin(2x+1) = 2cos(2x+1)',
    color: '#6366f1',
  },
  {
    title: 'Tangent',
    formula: 'd/dx tan(ax+b) = a·sec²(ax+b)',
    note: 'Same chain-rule pattern as sin and cos.',
    example: 'd/dx tan(3x) = 3sec²(3x)',
    color: '#4f46e5',
  },
  {
    title: 'Trig powers',
    formula: 'd/dx sinⁿx = n·sinⁿ⁻¹x·cos x',
    note: 'Rewrite sin²x as (sin x)² — power rule + chain rule.',
    example: 'd/dx sin³x = 3sin²x cos x',
    color: '#818cf8',
  },
  {
    title: 'Constants',
    formula: 'd/dx (c) = 0',
    note: 'A horizontal line has zero gradient everywhere.',
    example: 'd/dx (7) = 0',
    color: '#78716c',
  },
]

type TransType = 'exp' | 'log' | 'trig'

const TRANS_META: Record<TransType, { rule: string; example: string }> = {
  exp: {
    rule: 'd/dx (e^(ax+b)) = ae^(ax+b)',
    example: 'd/dx (e^(3x−1)) = 3e^(3x−1)',
  },
  log: {
    rule: 'd/dx (ln(ax+b)) = a/(ax+b)',
    example: 'd/dx (ln(2x+5)) = 2/(2x+5)',
  },
  trig: {
    rule: 'd/dx sin(ax+b) = a cos(ax+b)\nd/dx cos(ax+b) = −a sin(ax+b)\nd/dx tan(ax+b) = a sec²(ax+b)',
    example: 'd/dx sin(2x+1) = 2cos(2x+1)',
  },
}

function ChainRulePanel() {
  const steps = [
    { n: '1', text: 'Rewrite as [f(x)]ⁿ — here f(x) = ax + b' },
    { n: '2', text: 'Bring down n and reduce the power by 1' },
    { n: '3', text: 'Multiply by f′(x) = a' },
    { n: '4', text: 'Check: inside must be linear for the quick ax + b pattern' },
  ]

  return (
    <div className="enlight-diff-rules">
      <p className="enlight-diff-panel__intro">
        Mirror of ∫(ax + b)ⁿ integration — differentiate the outer power, then multiply by the derivative of the inside.
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
        <div>d/dx (2x + 1)⁵ = <strong>10(2x + 1)⁴</strong></div>
        <div className="enlight-guide-calc__note">5(2x + 1)⁴ × 2 — power rule on the outside, ×2 from the inner derivative.</div>
      </div>
      <div className="enlight-diff-rules-grid" style={{ marginTop: 14 }}>
        <div className="enlight-diff-rule-card" style={{ borderLeftColor: '#7c3aed' }}>
          <div className="enlight-diff-rule-card__title" style={{ color: '#7c3aed' }}>
            Chain rule
          </div>
          <div className="enlight-diff-rule-card__formula">d/dx [f(x)]ⁿ = n[f(x)]ⁿ⁻¹ · f′(x)</div>
          <div className="enlight-diff-rule-card__example">d/dx (3x − 2)⁻² = −2(3x − 2)⁻³ × 3</div>
        </div>
      </div>
    </div>
  )
}

type TrigKind = 'sin' | 'cos' | 'tan'

const TRIG_META: Record<TrigKind, { rule: string; example: string }> = {
  sin: {
    rule: 'd/dx sin(ax+b) = a cos(ax+b)',
    example: 'd/dx sin(2x+1) = 2cos(2x+1)',
  },
  cos: {
    rule: 'd/dx cos(ax+b) = −a sin(ax+b)',
    example: 'd/dx cos(5x) = −5sin(5x)',
  },
  tan: {
    rule: 'd/dx tan(ax+b) = a sec²(ax+b)',
    example: 'd/dx tan(3x) = 3sec²(3x)',
  },
}

function TrigDerivPanel() {
  const [kind, setKind] = useState<TrigKind>('sin')
  const cfg = TRIG_META[kind]

  return (
    <div className="enlight-diff-trans">
      <p className="enlight-diff-panel__intro">Trigonometric derivatives only — radians throughout. Watch the minus on cos.</p>
      <div className="enlight-diff-opt-tabs">
        {(
          [
            ['sin', 'Sine'],
            ['cos', 'Cosine'],
            ['tan', 'Tangent'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`enlight-diff-opt-tabs__btn${kind === id ? ' enlight-diff-opt-tabs__btn--active' : ''}`}
            onClick={() => setKind(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="enlight-diff-rules-grid">
        <div className="enlight-diff-rule-card" style={{ borderLeftColor: '#6366f1' }}>
          <div className="enlight-diff-rule-card__title" style={{ color: '#6366f1' }}>
            {kind === 'sin' ? 'Sine' : kind === 'cos' ? 'Cosine' : 'Tangent'}
          </div>
          <div className="enlight-diff-rule-card__formula">{cfg.rule}</div>
          <div className="enlight-diff-rule-card__example">e.g. {cfg.example}</div>
        </div>
      </div>
      <div className="enlight-guide-calc" style={{ marginTop: 14 }}>
        <div className="enlight-guide-calc__note">Toggle <strong>With constant $k$</strong> on formula cards above for $k\sin(ax+b)$ forms.</div>
      </div>
    </div>
  )
}

function FormulaRefPanel({ titles, intro }: { titles: string[]; intro?: string }) {
  const items = RULES.filter((r) => titles.includes(r.title))

  return (
    <div className="enlight-diff-rules">
      {intro ? <p className="enlight-diff-panel__intro">{intro}</p> : null}
      <div className="enlight-diff-rules-grid">
        {items.map((r) => (
          <div key={r.title} className="enlight-diff-rule-card" style={{ borderLeftColor: r.color }}>
            <div className="enlight-diff-rule-card__title" style={{ color: r.color }}>
              {r.title}
            </div>
            <div className="enlight-diff-rule-card__formula">{r.formula}</div>
            {r.note ? <div className="enlight-diff-rule-card__note">{r.note}</div> : null}
            <div className="enlight-diff-rule-card__example">e.g. {r.example}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ApproxFormulaPanel() {
  return (
    <div className="enlight-diff-rules">
      <p className="enlight-diff-panel__intro">For a very small change δx, use the gradient at the original point.</p>
      <div className="enlight-diff-rules-grid">
        <div className="enlight-diff-rule-card" style={{ borderLeftColor: '#0891b2' }}>
          <div className="enlight-diff-rule-card__title" style={{ color: '#0891b2' }}>
            Small increments
          </div>
          <div className="enlight-diff-rule-card__formula">δy ≈ (dy/dx) × δx</div>
          <div className="enlight-diff-rule-card__note">Approximate value ≈ y_old + δy</div>
          <div className="enlight-diff-rule-card__example">e.g. if x increases by 0.01, multiply dy/dx by 0.01</div>
        </div>
        <div className="enlight-diff-rule-card" style={{ borderLeftColor: '#d97706' }}>
          <div className="enlight-diff-rule-card__title" style={{ color: '#d97706' }}>
            Percentage change
          </div>
          <div className="enlight-diff-rule-card__formula">If x increases by p%, then δx = (p/100) × x</div>
          <div className="enlight-diff-rule-card__note">Percentage change in y = (δy/y) × 100</div>
        </div>
      </div>
    </div>
  )
}

function CheatsheetPanel() {
  return <RulesPanel />
}

function TranscendentalPanel() {
  const [kind, setKind] = useState<TransType>('exp')
  const cfg = TRANS_META[kind]
  const transcendentalRules = RULES.filter((r) =>
    ['Exponential', 'Logarithm', 'Sine & cosine', 'Tangent', 'Trig powers'].includes(r.title),
  )

  return (
    <div className="enlight-diff-trans">
      <div className="enlight-diff-opt-tabs">
        {(
          [
            ['exp', 'Exponential'],
            ['log', 'Logarithm'],
            ['trig', 'Sin & cos'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`enlight-diff-opt-tabs__btn${kind === id ? ' enlight-diff-opt-tabs__btn--active' : ''}`}
            onClick={() => setKind(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="enlight-guide-calc">
        <div>
          <strong>Rule:</strong> {cfg.rule}
        </div>
        <div>
          <strong>Example:</strong> {cfg.example}
        </div>
      </div>
      <div className="enlight-diff-rules-grid" style={{ marginTop: 14 }}>
        {transcendentalRules.map((r) => (
          <div key={r.title} className="enlight-diff-rule-card" style={{ borderLeftColor: r.color }}>
            <div className="enlight-diff-rule-card__title" style={{ color: r.color }}>
              {r.title}
            </div>
            <div className="enlight-diff-rule-card__formula">{r.formula}</div>
            <div className="enlight-diff-rule-card__example">e.g. {r.example}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RulesPanel({ filter }: { filter?: 'all' | 'transcendental' }) {
  const transcendentalTitles = new Set(['Exponential', 'Logarithm', 'Sine & cosine', 'Tangent', 'Trig powers'])
  const items = filter === 'transcendental' ? RULES.filter((r) => transcendentalTitles.has(r.title)) : RULES

  return (
    <div className="enlight-diff-rules">
      <p className="enlight-diff-panel__intro">
        {filter === 'transcendental'
          ? 'Ch.14 transcendental derivative rules — watch the minus sign on cos.'
          : 'Quick reference for Ch.12 basic rules and Ch.14 transcendental derivatives. Rewrite roots and fractions as powers before using the power rule.'}
      </p>
      <div className="enlight-diff-rules-grid">
        {items.map((r) => (
          <div key={r.title} className="enlight-diff-rule-card" style={{ borderLeftColor: r.color }}>
            <div className="enlight-diff-rule-card__title" style={{ color: r.color }}>
              {r.title}
            </div>
            <div className="enlight-diff-rule-card__formula">{r.formula}</div>
            <div className="enlight-diff-rule-card__note">{r.note}</div>
            <div className="enlight-diff-rule-card__example">e.g. {r.example}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Main export ──────────────────────────────────────────────────────── */

export function DifferentiationVisualGuide({ panels }: { panels?: DiffGuidePanel[] }) {
  const activePanels = panels?.length ? panels : ALL_PANELS
  const [tab, setTab] = useState<Tab>(activePanels[0])

  const currentTab = activePanels.includes(tab) ? tab : activePanels[0]
  const meta = PANEL_META[currentTab]
  const showTabs = activePanels.length > 1

  return (
    <section className="enlight-explorer enlight-diff-guide">
      <h2 className="enlight-explorer__title">{meta.title}</h2>
      <p className="enlight-body-text enlight-diff-guide__intro">{meta.intro}</p>

      {showTabs && (
        <div className="enlight-diff-tabs">
          {activePanels.map((id) => (
            <button
              key={id}
              type="button"
              className={`enlight-diff-tabs__btn${currentTab === id ? ' enlight-diff-tabs__btn--active' : ''}`}
              onClick={() => setTab(id)}
            >
              {PANEL_META[id].label}
            </button>
          ))}
        </div>
      )}

      {renderPanel(currentTab)}
    </section>
  )
}
