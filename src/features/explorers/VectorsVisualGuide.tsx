import { useMemo, useState } from 'react'
import type { VectorGuidePanel } from '@/lib/contentTypes'

const W = 440
const H = 300
const PAD = 36

function toSvgX(x: number, xMin: number, xMax: number) {
  return PAD + ((x - xMin) / (xMax - xMin)) * (W - PAD * 2)
}
function toSvgY(y: number, yMin: number, yMax: number) {
  return PAD + (H - PAD * 2) - ((y - yMin) / (yMax - yMin)) * (H - PAD * 2)
}

function VectorArrow({
  x1,
  y1,
  x2,
  y2,
  color,
  width = 2.5,
  dashed = false,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  width?: number
  dashed?: boolean
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const ax = x2 - 9 * Math.cos(angle)
  const ay = y2 - 9 * Math.sin(angle)
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={ax}
        y2={ay}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? '6 4' : undefined}
      />
      {!dashed && (
        <polygon
          points={`${x2},${y2} ${x2 - 10 * Math.cos(angle - 0.42)},${y2 - 10 * Math.sin(angle - 0.42)} ${x2 - 10 * Math.cos(angle + 0.42)},${y2 - 10 * Math.sin(angle + 0.42)}`}
          fill={color}
        />
      )}
    </g>
  )
}

function Grid({ xMin, xMax, yMin, yMax }: { xMin: number; xMax: number; yMin: number; yMax: number }) {
  const lines = []
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
    lines.push(
      <line key={`v${x}`} x1={toSvgX(x, xMin, xMax)} y1={PAD - 8} x2={toSvgX(x, xMin, xMax)} y2={H - PAD + 8} stroke="#e8e2d8" strokeWidth={1} />,
    )
  }
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
    lines.push(
      <line key={`h${y}`} x1={PAD - 8} y1={toSvgY(y, yMin, yMax)} x2={W - PAD + 8} y2={toSvgY(y, yMin, yMax)} stroke="#e8e2d8" strokeWidth={1} />,
    )
  }
  const ox = toSvgX(0, xMin, xMax)
  const oy = toSvgY(0, yMin, yMax)
  return (
    <>
      {lines}
      <line x1={ox} y1={PAD - 8} x2={ox} y2={H - PAD + 8} stroke="#a8a29e" strokeWidth={1.5} />
      <line x1={PAD - 8} y1={oy} x2={W - PAD + 8} y2={oy} stroke="#a8a29e" strokeWidth={1.5} />
      <text x={ox - 10} y={oy + 14} fontSize={10} fill="#78716c" fontWeight={600}>
        O
      </text>
    </>
  )
}

function VecLegend({ items }: { items: { color: string; label: string; dashed?: boolean }[] }) {
  return (
    <div className="enlight-vec-legend">
      {items.map((item) => (
        <div key={item.label} className="enlight-vec-legend__item">
          <svg width={28} height={12} aria-hidden="true">
            <line x1={2} y1={6} x2={26} y2={6} stroke={item.color} strokeWidth={2.5} strokeDasharray={item.dashed ? '4 3' : undefined} />
          </svg>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function DisplacementPanel() {
  const ax = 2
  const ay = 1
  const bx = 5
  const by = 5
  const dx = bx - ax
  const dy = by - ay
  const xMin = -0.5
  const xMax = 6.5
  const yMin = -0.5
  const yMax = 6.5

  const ox = toSvgX(0, xMin, xMax)
  const oy = toSvgY(0, yMin, yMax)
  const sax = toSvgX(ax, xMin, xMax)
  const say = toSvgY(ay, yMin, yMax)
  const sbx = toSvgX(bx, xMin, xMax)
  const sby = toSvgY(by, yMin, yMax)
  const cmx = toSvgX(bx, xMin, xMax)
  const cmy = toSvgY(ay, yMin, yMax)

  return (
    <div className="enlight-vec-panel">
      <p className="enlight-guide-panel__intro">
        Displacement from A to B: <strong>AB⃗ = b − a</strong> (end minus start).
      </p>

      <div className="enlight-vec-layout">
        <svg className="enlight-vec-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Displacement vector">
          <Grid xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} />
          {/* Position vectors — dashed, no labels on arrows */}
          <VectorArrow x1={ox} y1={oy} x2={sax} y2={say} color="#94a3b8" width={2} dashed />
          <VectorArrow x1={ox} y1={oy} x2={sbx} y2={sby} color="#94a3b8" width={2} dashed />
          {/* Component breakdown from A */}
          <line x1={sax} y1={say} x2={cmx} y2={cmy} stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4 3" />
          <line x1={cmx} y1={cmy} x2={sbx} y2={sby} stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={(sax + cmx) / 2} y={cmy + 16} textAnchor="middle" fontSize={10} fill="#64748b" fontWeight={600}>
            +{dx}
          </text>
          <text x={cmx + 14} y={(cmy + sby) / 2 + 4} fontSize={10} fill="#64748b" fontWeight={600}>
            +{dy}
          </text>
          {/* Displacement AB — solid */}
          <VectorArrow x1={sax} y1={say} x2={sbx} y2={sby} color="#d97706" width={3} />
          {/* Points */}
          <circle cx={sax} cy={say} r={6} fill="#1e3a5f" stroke="#fff" strokeWidth={2} />
          <circle cx={sbx} cy={sby} r={6} fill="#1e3a5f" stroke="#fff" strokeWidth={2} />
          <text x={sax - 16} y={say + 4} fontSize={12} fontWeight={700} fill="#1e3a5f">
            A
          </text>
          <text x={sbx + 10} y={sby - 6} fontSize={12} fontWeight={700} fill="#1e3a5f">
            B
          </text>
          <text x={(sax + sbx) / 2 - 20} y={(say + sby) / 2 - 10} fontSize={11} fontWeight={700} fill="#d97706">
            AB⃗
          </text>
        </svg>

        <div className="enlight-vec-side">
          <VecLegend
            items={[
              { color: '#94a3b8', label: 'Position vectors a, b', dashed: true },
              { color: '#d97706', label: 'Displacement AB⃗ = b − a' },
            ]}
          />
          <div className="enlight-vec-cards">
            <div className="enlight-vec-card">
              <div className="enlight-vec-card__label">Position vectors</div>
              <div className="enlight-vec-card__eq">a = (2, 1)</div>
              <div className="enlight-vec-card__eq">b = (5, 5)</div>
            </div>
            <div className="enlight-vec-card enlight-vec-card--highlight">
              <div className="enlight-vec-card__label">Displacement</div>
              <div className="enlight-vec-card__eq">
                AB⃗ = (5−2, 5−1) = <strong>({dx}, {dy})</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MagnitudePanel() {
  const vx = 3
  const vy = 4
  const mag = 5
  const ux = 0.6
  const uy = 0.8
  const xMin = -0.5
  const xMax = 5.5
  const yMin = -0.5
  const yMax = 5.5

  const ox = toSvgX(0, xMin, xMax)
  const oy = toSvgY(0, yMin, yMax)
  const ex = toSvgX(vx, xMin, xMax)
  const ey = toSvgY(vy, yMin, yMax)
  const legX = toSvgX(vx, xMin, xMax)
  const legY = toSvgY(0, yMin, yMax)

  return (
    <div className="enlight-vec-panel">
      <p className="enlight-guide-panel__intro">
        Magnitude from Pythagoras: <strong>|r| = √(x² + y²)</strong>. Unit vector scales to length 1.
      </p>

      <div className="enlight-vec-layout">
        <svg className="enlight-vec-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Magnitude and unit vector">
          <Grid xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} />
          {/* Right triangle components */}
          <line x1={ox} y1={oy} x2={legX} y2={legY} stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="5 4" />
          <line x1={legX} y1={legY} x2={ex} y2={ey} stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="5 4" />
          <rect x={legX - 10} y={legY - 10} width={10} height={10} fill="none" stroke="#94a3b8" strokeWidth={1} />
          <text x={(ox + legX) / 2} y={legY + 18} textAnchor="middle" fontSize={11} fill="#64748b" fontWeight={600}>
            x = 3
          </text>
          <text x={legX + 16} y={(legY + ey) / 2 + 4} fontSize={11} fill="#64748b" fontWeight={600}>
            y = 4
          </text>
          {/* Main vector */}
          <VectorArrow x1={ox} y1={oy} x2={ex} y2={ey} color="#d97706" width={3} />
          <text x={(ox + ex) / 2 - 28} y={(oy + ey) / 2 - 6} fontSize={11} fontWeight={700} fill="#d97706">
            |r| = 5
          </text>
          <circle cx={ex} cy={ey} r={5} fill="#d97706" stroke="#fff" strokeWidth={1.5} />
        </svg>

        <div className="enlight-vec-side">
          <div className="enlight-vec-unit-box">
            <div className="enlight-vec-unit-box__title">Unit vector r̂ (length = 1)</div>
            <svg viewBox="0 0 200 100" className="enlight-vec-unit-box__svg" aria-hidden="true">
              <line x1={20} y1={80} x2={180} y2={80} stroke="#a8a29e" strokeWidth={1.5} />
              <line x1={20} y1={80} x2={20} y2={20} stroke="#a8a29e" strokeWidth={1.5} />
              <VectorArrow x1={20} y1={80} x2={104} y2={16} color="#059669" width={2.5} />
              <circle cx={104} cy={16} r={4} fill="#059669" />
              <text x={108} y={20} fontSize={10} fontWeight={700} fill="#059669">
                r̂ = (0.6, 0.8)
              </text>
              <text x={60} y={95} fontSize={9} fill="#64748b">
                same direction, length 1
              </text>
            </svg>
          </div>
          <div className="enlight-vec-cards">
            <div className="enlight-vec-card">
              <div className="enlight-vec-card__label">Magnitude</div>
              <div className="enlight-vec-card__eq">|r| = √(3² + 4²) = <strong>{mag}</strong></div>
            </div>
            <div className="enlight-vec-card enlight-vec-card--highlight">
              <div className="enlight-vec-card__label">Unit vector</div>
              <div className="enlight-vec-card__eq">
                r̂ = (1/5)(3, 4) = <strong>({ux}, {uy})</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MotionPanel() {
  const [t, setT] = useState(2)
  const p0 = { x: 1, y: 2 }
  const v = { x: 3, y: -1 }
  const pos = { x: p0.x + v.x * t, y: p0.y + v.y * t }
  const speed = Math.sqrt(v.x * v.x + v.y * v.y)
  const vScale = 0.9

  const xMin = -1
  const xMax = 14
  const yMin = -3
  const yMax = 7

  const pathPts = useMemo(() => {
    const pts: string[] = []
    for (let ti = 0; ti <= 5; ti += 0.08) {
      pts.push(`${toSvgX(p0.x + v.x * ti, xMin, xMax).toFixed(1)},${toSvgY(p0.y + v.y * ti, yMin, yMax).toFixed(1)}`)
    }
    return pts.join(' ')
  }, [xMin, xMax, yMin, yMax])

  const px0 = toSvgX(p0.x, xMin, xMax)
  const py0 = toSvgY(p0.y, yMin, yMax)
  const px = toSvgX(pos.x, xMin, xMax)
  const py = toSvgY(pos.y, yMin, yMax)
  const vTipX = toSvgX(pos.x + v.x * vScale, xMin, xMax)
  const vTipY = toSvgY(pos.y + v.y * vScale, yMin, yMax)

  return (
    <div className="enlight-vec-panel">
      <p className="enlight-guide-panel__intro">
        Constant velocity: <strong>r = r₀ + vt</strong>. The velocity vector v shows direction &amp; rate of change.
      </p>

      <div className="enlight-slider-group">
        <label htmlFor="vec-t">
          <strong>t</strong> = {t.toFixed(1)} s &nbsp;·&nbsp; r = ({pos.x.toFixed(1)}, {pos.y.toFixed(1)}) &nbsp;·&nbsp; speed ={' '}
          {speed.toFixed(2)} units/s
        </label>
        <input id="vec-t" type="range" min={0} max={5} step={0.1} value={t} onChange={(e) => setT(Number(e.target.value))} />
      </div>

      <div className="enlight-vec-layout">
        <svg className="enlight-vec-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Vector motion">
          <Grid xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} />
          <polyline points={pathPts} fill="none" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="6 4" />
          {/* Displacement from start to current — subtle */}
          <line x1={px0} y1={py0} x2={px} y2={py} stroke="#0891b2" strokeWidth={1.5} strokeDasharray="4 4" opacity={0.5} />
          {/* Velocity at current position */}
          <VectorArrow x1={px} y1={py} x2={vTipX} y2={vTipY} color="#059669" width={2.5} />
          <text x={vTipX + 8} y={vTipY + 4} fontSize={10} fontWeight={700} fill="#059669">
            v
          </text>
          <circle cx={px0} cy={py0} r={7} fill="#1e3a5f" stroke="#fff" strokeWidth={2} />
          <circle cx={px} cy={py} r={7} fill="#0891b2" stroke="#fff" strokeWidth={2} />
          <text x={px0 - 22} y={py0 + 4} fontSize={11} fontWeight={700} fill="#1e3a5f">
            r₀
          </text>
          <text x={px + 10} y={py - 8} fontSize={11} fontWeight={700} fill="#0891b2">
            r(t)
          </text>
        </svg>

        <div className="enlight-vec-side">
          <VecLegend
            items={[
              { color: '#cbd5e1', label: 'Path (constant v)', dashed: true },
              { color: '#0891b2', label: 'Position r(t)' },
              { color: '#059669', label: 'Velocity v' },
            ]}
          />
          <div className="enlight-vec-cards">
            <div className="enlight-vec-card">
              <div className="enlight-vec-card__label">Given</div>
              <div className="enlight-vec-card__eq">r₀ = (1, 2)</div>
              <div className="enlight-vec-card__eq">v = (3, −1)</div>
            </div>
            <div className="enlight-vec-card enlight-vec-card--highlight">
              <div className="enlight-vec-card__label">At t = {t.toFixed(1)}</div>
              <div className="enlight-vec-card__eq">
                r = (1, 2) + {t.toFixed(1)}(3, −1)
              </div>
              <div className="enlight-vec-card__eq">
                = <strong>({pos.x.toFixed(1)}, {pos.y.toFixed(1)})</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ALL: VectorGuidePanel[] = ['displacement', 'magnitude', 'motion']

const META: Record<VectorGuidePanel, { label: string; title: string; intro: string }> = {
  displacement: { label: 'Displacement', title: 'Displacement Vectors', intro: 'Find AB⃗ by subtracting position vectors.' },
  magnitude: { label: 'Magnitude', title: 'Magnitude & Unit Vector', intro: 'Length via Pythagoras, then scale to a unit vector.' },
  motion: { label: 'Motion', title: 'Constant Velocity', intro: 'Track position r = r₀ + vt over time.' },
}

function renderPanel(p: VectorGuidePanel) {
  switch (p) {
    case 'displacement':
      return <DisplacementPanel />
    case 'magnitude':
      return <MagnitudePanel />
    case 'motion':
      return <MotionPanel />
  }
}

export function VectorsVisualGuide({ panels }: { panels?: VectorGuidePanel[] }) {
  const active = panels?.length ? panels : ALL
  const [tab, setTab] = useState<VectorGuidePanel>(active[0])
  const current = active.includes(tab) ? tab : active[0]
  const meta = META[current]

  return (
    <section className="enlight-explorer enlight-vec-guide">
      <h2 className="enlight-explorer__title">{meta.title}</h2>
      <p className="enlight-body-text enlight-guide__intro">{meta.intro}</p>
      {active.length > 1 && (
        <div className="enlight-guide-tabs enlight-guide-tabs--vec">
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
