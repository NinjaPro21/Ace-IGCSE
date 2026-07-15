import { useMemo, useState } from 'react'
import { GRAPH } from './graphTheme'
import type { KinematicsGuidePanel } from '@/lib/contentTypes'

const W = 480
const H = 120

function toSvgX(t: number, tMax: number) {
  return (t / tMax) * W
}
function toSvgY(v: number, yMin: number, yMax: number) {
  return H - ((v - yMin) / (yMax - yMin)) * H
}

function buildPath(fn: (t: number) => number, tMax: number, yMin: number, yMax: number): string {
  const pts: string[] = []
  for (let t = 0; t <= tMax + 0.02; t += 0.05) {
    const y = fn(t)
    pts.push(`${toSvgX(t, tMax).toFixed(1)},${toSvgY(y, yMin, yMax).toFixed(1)}`)
  }
  return pts.join(' ')
}

function ChainPanel() {
  return (
    <div>
      <p className="ace-guide-panel__intro">
        Differentiate down the chain: <strong>s → v → a</strong>. Integrate to go back up.
      </p>
      <div className="ace-kin-chain">
        <div className="ace-kin-chain__box ace-kin-chain__box--s">
          <div className="ace-kin-chain__label">Displacement s(t)</div>
          <div className="ace-kin-chain__eq">s = t² + 3t</div>
        </div>
        <div className="ace-kin-chain__arrow">
          <span>d/dt</span>
          <span>↓</span>
        </div>
        <div className="ace-kin-chain__box ace-kin-chain__box--v">
          <div className="ace-kin-chain__label">Velocity v = ds/dt</div>
          <div className="ace-kin-chain__eq">v = 2t + 3</div>
        </div>
        <div className="ace-kin-chain__arrow">
          <span>d/dt</span>
          <span>↓</span>
        </div>
        <div className="ace-kin-chain__box ace-kin-chain__box--a">
          <div className="ace-kin-chain__label">Acceleration a = dv/dt</div>
          <div className="ace-kin-chain__eq">a = 2</div>
        </div>
      </div>
      <div className="ace-guide-calc">
        <div>
          At t = 4: v = 2(4) + 3 = <strong>11 m/s</strong>, a = <strong>2 m/s²</strong>
        </div>
        <div className="ace-guide-calc__note">Reverse: ∫a dt → v, ∫v dt → s (add +C from initial conditions)</div>
      </div>
    </div>
  )
}

function GraphsPanel() {
  const [t, setT] = useState(2)
  const tMax = 5
  const s = (ti: number) => ti * ti + 3 * ti
  const v = (ti: number) => 2 * ti + 3
  const a = () => 2

  const sPath = useMemo(() => buildPath(s, tMax, 0, 40), [tMax])
  const vPath = useMemo(() => buildPath(v, tMax, 0, 15), [tMax])

  const particleX = 40 + (t / tMax) * 320

  return (
    <div>
      <p className="ace-guide-panel__intro">
        Linked graphs for <strong>s = t² + 3t</strong>. Slope of s = value of v. Slope of v = value of a.
      </p>
      <div className="ace-slider-group">
        <label htmlFor="kin-t">
          <strong>t</strong> = {t.toFixed(1)} s &nbsp;·&nbsp; s = {s(t).toFixed(1)} m &nbsp;·&nbsp; v = {v(t).toFixed(1)} m/s &nbsp;·&nbsp; a ={' '}
          {a()} m/s²
        </label>
        <input id="kin-t" type="range" min={0} max={tMax} step={0.1} value={t} onChange={(e) => setT(Number(e.target.value))} />
      </div>

      <div className="ace-kin-track">
        <div className="ace-kin-track__label">PARTICLE ON TRACK</div>
        <svg viewBox="0 0 400 36" className="ace-kin-track__svg">
          <line x1={20} y1={20} x2={380} y2={20} stroke="#a8a29e" strokeWidth={3} strokeLinecap="round" />
          <circle cx={particleX} cy={20} r={8} fill="#0891b2" stroke="#fff" strokeWidth={2} />
        </svg>
      </div>

      {(
        [
          { label: 's (displacement)', path: sPath, yMin: 0, yMax: 40, color: '#0891b2', val: s(t) },
          { label: 'v (velocity)', path: vPath, yMin: 0, yMax: 15, color: '#d97706', val: v(t) },
          { label: 'a (acceleration)', path: buildPath(() => 2, tMax, 0, 5), yMin: 0, yMax: 5, color: '#be123c', val: 2 },
        ] as const
      ).map((g) => (
        <div key={g.label} className="ace-kin-graph-row">
          <div className="ace-kin-graph-row__label">{g.label}</div>
          <svg viewBox={`0 0 ${W} ${H}`} className="ace-kin-graph-row__svg">
            <line x1={0} y1={toSvgY(0, g.yMin, g.yMax)} x2={W} y2={toSvgY(0, g.yMin, g.yMax)} stroke={GRAPH.axis} strokeWidth={1} />
            <polyline points={g.path} fill="none" stroke={g.color} strokeWidth={2} />
            <line x1={toSvgX(t, tMax)} y1={0} x2={toSvgX(t, tMax)} y2={H} stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />
            <circle cx={toSvgX(t, tMax)} cy={toSvgY(g.val, g.yMin, g.yMax)} r={5} fill={g.color} stroke="#fff" strokeWidth={1.5} />
          </svg>
        </div>
      ))}
    </div>
  )
}

function DistancePanel() {
  const v = (t: number) => t * t - 4 * t + 3 // roots at t=1, t=3
  const s = (t: number) => (t ** 3) / 3 - 2 * t ** 2 + 3 * t
  const [t1, setT1] = useState(0)
  const [t2, setT2] = useState(4)
  const lo = Math.min(t1, t2)
  const hi = Math.max(t1, t2)

  const displacement = s(hi) - s(lo)
  const splits = [lo, 1, 3, hi].filter((x, i, arr) => x >= lo - 0.001 && x <= hi + 0.001 && (i === 0 || x > arr[i - 1] + 0.001))
  let distance = 0
  for (let i = 0; i < splits.length - 1; i++) {
    const a = splits[i]
    const b = splits[i + 1]
    distance += Math.abs(s(b) - s(a))
  }

  const tMax = 5
  const yMin = -3
  const yMax = 8
  const vPath = useMemo(() => buildPath(v, tMax, yMin, yMax), [tMax])
  const zeroY = toSvgY(0, yMin, yMax)

  const trackPad = 24
  const trackW = 352
  const posAt = (t: number) => trackPad + (s(t) / 10) * trackW
  const startX = posAt(lo)
  const endX = posAt(hi)

  return (
    <div className="ace-kin-distance">
      <p className="ace-guide-panel__intro">
        <strong>Displacement</strong> = straight-line change in position (can be negative).{' '}
        <strong>Distance</strong> = total path length (always positive).
      </p>

      <div className="ace-kin-distance__track-block">
        <p className="ace-kin-track__label">Straight track — displacement vs distance</p>
        <svg viewBox="0 0 400 48" width="100%" height="48" role="img" aria-label="Particle positions on a straight track">
          <line x1={trackPad} y1={28} x2={trackPad + trackW} y2={28} stroke="#a8a29e" strokeWidth={3} strokeLinecap="round" />
          <circle cx={trackPad} cy={28} r={4} fill="#64748b" />
          <line x1={Math.min(startX, endX)} y1={12} x2={Math.max(startX, endX)} y2={12} stroke="#0891b2" strokeWidth={2.5} markerEnd="url(#kin-disp-arrow)" />
          <defs>
            <marker id="kin-disp-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#0891b2" />
            </marker>
          </defs>
          <circle cx={startX} cy={28} r={6} fill="#fff" stroke="#0891b2" strokeWidth={2} />
          <circle cx={endX} cy={28} r={6} fill="#0891b2" stroke="#fff" strokeWidth={2} />
        </svg>
        <div className="ace-kin-distance__track-legend">
          <span><span className="ace-kin-distance__swatch ace-kin-distance__swatch--disp" /> Blue arrow = displacement</span>
          <span><span className="ace-kin-distance__swatch ace-kin-distance__swatch--pos" /> Circles = position at t₁ and t₂</span>
        </div>
      </div>

      <div className="ace-int-sliders">
        <div className="ace-slider-group">
          <label htmlFor="kin-t1">From t = {t1.toFixed(1)}</label>
          <input id="kin-t1" type="range" min={0} max={4} step={0.1} value={t1} onChange={(e) => setT1(Number(e.target.value))} />
        </div>
        <div className="ace-slider-group">
          <label htmlFor="kin-t2">To t = {t2.toFixed(1)}</label>
          <input id="kin-t2" type="range" min={0.5} max={5} step={0.1} value={t2} onChange={(e) => setT2(Number(e.target.value))} />
        </div>
      </div>

      <p className="ace-kin-distance__graph-caption">
        Velocity v = t² − 4t + 3. Red dots = turning points (v = 0). Split the integral at these points for distance.
      </p>

      <svg className="ace-graph-canvas ace-kin-distance__graph" viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label="Velocity graph with zero crossings">
        <line x1={0} y1={zeroY} x2={W} y2={zeroY} stroke={GRAPH.axis} strokeWidth={1.5} />
        <text x={6} y={zeroY - 4} fontSize={9} fill="#64748b">v = 0</text>
        <polyline points={vPath} fill="none" stroke="#d97706" strokeWidth={2.5} />
        {[1, 3].map((root) => (
          <circle key={root} cx={toSvgX(root, tMax)} cy={zeroY} r={4} fill="#be123c" stroke="#fff" strokeWidth={1.5} />
        ))}
        <line x1={toSvgX(lo, tMax)} y1={4} x2={toSvgX(lo, tMax)} y2={H - 4} stroke="#0891b2" strokeWidth={1.5} strokeDasharray="4 3" />
        <line x1={toSvgX(hi, tMax)} y1={4} x2={toSvgX(hi, tMax)} y2={H - 4} stroke="#0891b2" strokeWidth={1.5} strokeDasharray="4 3" />
      </svg>

      <div className="ace-guide-calc ace-kin-distance__results">
        <div className="ace-kin-distance__result">
          <span className="ace-kin-distance__result-label">Displacement</span>
          <strong>{displacement.toFixed(2)} m</strong>
          <span className="ace-kin-distance__result-hint">signed</span>
        </div>
        <div className="ace-kin-distance__result">
          <span className="ace-kin-distance__result-label">Total distance</span>
          <strong>{distance.toFixed(2)} m</strong>
          <span className="ace-kin-distance__result-hint">path length</span>
        </div>
      </div>
      {Math.abs(displacement - distance) > 0.01 && (
        <p className="ace-guide-calc__note">
          Distance exceeds |displacement| because the particle reverses between t = 1 and t = 3.
        </p>
      )}
    </div>
  )
}

const ALL: KinematicsGuidePanel[] = ['chain', 'graphs', 'distance']

const META: Record<KinematicsGuidePanel, { label: string; title: string; intro: string }> = {
  chain: { label: 's → v → a', title: 'Calculus Chain', intro: 'Differentiate and integrate between s, v, and a.' },
  graphs: { label: 'Linked graphs', title: 'Motion Graphs', intro: 'See s, v, and a change together over time.' },
  distance: { label: 'Distance vs disp.', title: 'Distance vs Displacement', intro: 'Displacement is the straight-line change in position; distance is the total path length. When velocity changes sign, they differ.' },
}

function renderPanel(p: KinematicsGuidePanel) {
  switch (p) {
    case 'chain':
      return <ChainPanel />
    case 'graphs':
      return <GraphsPanel />
    case 'distance':
      return <DistancePanel />
  }
}

export function KinematicsVisualGuide({ panels }: { panels?: KinematicsGuidePanel[] }) {
  const active = panels?.length ? panels : ALL
  const [tab, setTab] = useState<KinematicsGuidePanel>(active[0])
  const current = active.includes(tab) ? tab : active[0]
  const meta = META[current]

  return (
    <section className="ace-explorer ace-kin-guide">
      <h2 className="ace-explorer__title">{meta.title}</h2>
      <p className="ace-body-text ace-guide__intro">{meta.intro}</p>
      {active.length > 1 && (
        <div className="ace-guide-tabs ace-guide-tabs--kin">
          {active.map((id) => (
            <button key={id} type="button" className={`ace-guide-tabs__btn${current === id ? ' ace-guide-tabs__btn--active' : ''}`} onClick={() => setTab(id)}>
              {META[id].label}
            </button>
          ))}
        </div>
      )}
      {renderPanel(current)}
    </section>
  )
}
