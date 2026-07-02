import { useState, type ReactElement } from 'react'
import type { RightTrianglePanel } from '@/lib/contentTypes'

function RightTriangleSvg({
  opp,
  adj,
  hyp,
  angle,
  highlight,
}: {
  opp: number
  adj: number
  hyp: number
  angle: number
  highlight?: 'opp' | 'adj' | 'hyp'
}) {
  const scale = 120 / hyp
  const ax = 40
  const ay = 160
  const bx = ax + adj * scale
  const by = ay
  const cx = ax
  const cy = ay - opp * scale

  const hl = (side: 'opp' | 'adj' | 'hyp') => (highlight === side ? '#2563eb' : '#64748b')

  return (
    <svg viewBox="0 0 220 180" className="enlight-graph-canvas enlight-rtri-svg" role="img" aria-label="Right triangle">
      <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="#eff6ff" stroke="#2563eb" strokeWidth={2} />
      <rect x={ax} y={ay - 12} width={12} height={12} fill="none" stroke="#64748b" />
      <text x={(ax + bx) / 2} y={ay + 18} textAnchor="middle" fontSize={10} fill={hl('adj')} fontWeight={600}>
        Adj = {adj}
      </text>
      <text x={ax - 22} y={(ay + cy) / 2} textAnchor="middle" fontSize={10} fill={hl('opp')} fontWeight={600} transform={`rotate(-90 ${ax - 22} ${(ay + cy) / 2})`}>
        Opp = {opp}
      </text>
      <text x={(bx + cx) / 2 + 10} y={(by + cy) / 2 - 6} fontSize={10} fill={hl('hyp')} fontWeight={600}>
        Hyp = {hyp}
      </text>
      <text x={ax + 18} y={ay - 6} fontSize={11} fill="#059669" fontWeight={700}>
        θ = {angle}°
      </text>
    </svg>
  )
}

function PythagorasPanel() {
  const [a, setA] = useState(3)
  const [b, setB] = useState(4)
  const c = Math.sqrt(a * a + b * b)

  return (
    <div className="enlight-stats-panel">
      <p className="enlight-body-text">Pythagoras: c² = a² + b² on a right-angled triangle.</p>
      <div className="enlight-slider-group">
        <label>Shorter side a = {a}</label>
        <input type="range" min={2} max={8} step={1} value={a} onChange={(e) => setA(Number(e.target.value))} />
      </div>
      <div className="enlight-slider-group">
        <label>Shorter side b = {b}</label>
        <input type="range" min={2} max={8} step={1} value={b} onChange={(e) => setB(Number(e.target.value))} />
      </div>
      <p className="enlight-rtri-result">Hypotenuse c = √({a}² + {b}²) = {c.toFixed(2)}</p>
      <RightTriangleSvg opp={b} adj={a} hyp={c} angle={Math.round((Math.atan2(b, a) * 180) / Math.PI)} highlight="hyp" />
    </div>
  )
}

function SohcahtoaPanel() {
  const [angle, setAngle] = useState(35)
  const hyp = 15
  const opp = hyp * Math.sin((angle * Math.PI) / 180)
  const adj = hyp * Math.cos((angle * Math.PI) / 180)

  return (
    <div className="enlight-stats-panel">
      <p className="enlight-body-text">
        Label **Opposite**, **Adjacent**, **Hypotenuse** relative to θ. Pick SOH, CAH, or TOA.
      </p>
      <div className="enlight-slider-group">
        <label>Angle θ = {angle}°</label>
        <input type="range" min={10} max={80} step={1} value={angle} onChange={(e) => setAngle(Number(e.target.value))} />
      </div>
      <div className="enlight-rtri-formulas">
        <span>sin θ = {opp.toFixed(2)}/{hyp} = {(opp / hyp).toFixed(3)}</span>
        <span>cos θ = {adj.toFixed(2)}/{hyp} = {(adj / hyp).toFixed(3)}</span>
        <span>tan θ = {opp.toFixed(2)}/{adj.toFixed(2)} = {(opp / adj).toFixed(3)}</span>
      </div>
      <RightTriangleSvg opp={+opp.toFixed(1)} adj={+adj.toFixed(1)} hyp={hyp} angle={angle} highlight="opp" />
    </div>
  )
}

function ObliqueTriangleSvg({ A, B, C, a, b, c }: { A: number; B: number; C: number; a: number; b: number; c: number }) {
  const ax = 30
  const ay = 150
  const bx = 190
  const by = 150
  const rad = (A * Math.PI) / 180
  const cx = bx - c * 8 * Math.cos(rad)
  const cy = by - c * 8 * Math.sin(rad)

  return (
    <svg viewBox="0 0 220 170" className="enlight-graph-canvas enlight-rtri-svg" role="img" aria-label="Oblique triangle">
      <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="#fef3c7" stroke="#d97706" strokeWidth={2} />
      <text x={ax - 8} y={ay + 14} fontSize={9} fill="#64748b">A={A}°</text>
      <text x={bx + 4} y={by + 14} fontSize={9} fill="#64748b">B={B}°</text>
      <text x={cx} y={cy - 8} fontSize={9} fill="#64748b">C={C}°</text>
      <text x={(bx + cx) / 2} y={(by + cy) / 2 - 6} fontSize={9} fill="#2563eb">a={a}</text>
      <text x={(ax + cx) / 2 - 20} y={(ay + cy) / 2} fontSize={9} fill="#2563eb">b={b}</text>
      <text x={(ax + bx) / 2} y={ay + 22} fontSize={9} fill="#2563eb">c={c}</text>
    </svg>
  )
}

function SineRulePanel() {
  const A = 40
  const B = 60
  const C = 180 - A - B
  const c = 10
  const a = (c * Math.sin((A * Math.PI) / 180)) / Math.sin((C * Math.PI) / 180)

  return (
    <div className="enlight-stats-panel">
      <p className="enlight-body-text">Sine rule: a/sin A = b/sin B = c/sin C</p>
      <p className="enlight-rtri-result">Example: c = 10, A = 40 deg, B = 60 deg — a ≈ {a.toFixed(2)}</p>
      <ObliqueTriangleSvg A={A} B={B} C={C} a={+a.toFixed(1)} b={8.7} c={c} />
    </div>
  )
}

function CosineRulePanel() {
  const a = 7
  const b = 9
  const C = 120
  const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos((C * Math.PI) / 180))

  return (
    <div className="enlight-stats-panel">
      <p className="enlight-body-text">Cosine rule: c² = a² + b² − 2ab cos C</p>
      <p className="enlight-rtri-result">a = 7, b = 9, C = 120 deg — c ≈ {c.toFixed(2)}</p>
      <ObliqueTriangleSvg A={35} B={25} C={C} a={a} b={b} c={+c.toFixed(1)} />
    </div>
  )
}

const PANELS: Record<RightTrianglePanel, () => ReactElement> = {
  pythagoras: PythagorasPanel,
  sohcahtoa: SohcahtoaPanel,
  'sine-rule': SineRulePanel,
  'cosine-rule': CosineRulePanel,
}

const LABELS: Record<RightTrianglePanel, string> = {
  pythagoras: 'Pythagoras',
  sohcahtoa: 'SOH CAH TOA',
  'sine-rule': 'Sine rule',
  'cosine-rule': 'Cosine rule',
}

export function RightTriangleGuide({ panels }: { panels?: RightTrianglePanel[] }) {
  const available = panels?.length ? panels : (['sohcahtoa'] as RightTrianglePanel[])
  const [tab, setTab] = useState<RightTrianglePanel>(available[0] ?? 'sohcahtoa')
  const current = available.includes(tab) ? tab : available[0]
  const Panel = PANELS[current]

  return (
    <section className="enlight-explorer enlight-rtri-guide">
      {available.length > 1 && (
        <div className="enlight-stats-guide__tabs" role="tablist">
          {available.map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              className={`enlight-stats-guide__tab${current === p ? ' enlight-stats-guide__tab--active' : ''}`}
              onClick={() => setTab(p)}
            >
              {LABELS[p]}
            </button>
          ))}
        </div>
      )}
      <Panel />
    </section>
  )
}
