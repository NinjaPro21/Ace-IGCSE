import { useMemo, useState } from 'react'
import { GraphAxes, createGraphMapper } from './GraphAxes'
import type { LineGeometryPanel } from '@/lib/contentTypes'

const W = 440
const H = 300
const X_MIN = -1
const X_MAX = 9
const Y_MIN = -1
const Y_MAX = 9
const MAPPER = createGraphMapper(W, H, X_MIN, X_MAX, Y_MIN, Y_MAX)
const { toSvgX, toSvgY } = {
  toSvgX: (x: number) => MAPPER.toX(x),
  toSvgY: (y: number) => MAPPER.toY(y),
}

function FormsPanel() {
  const [m, setM] = useState(1)
  const [c, setC] = useState(2)
  const x1 = 1
  const y1 = m * x1 + c

  const path = useMemo(() => {
    const pts = [`${toSvgX(X_MIN)},${toSvgY(m * X_MIN + c)}`, `${toSvgX(X_MAX)},${toSvgY(m * X_MAX + c)}`]
    return pts.join(' ')
  }, [m, c])

  return (
    <div className="enlight-explorer__layout">
      <div>
        <p className="enlight-body-text" style={{ marginBottom: 12 }}>
          Adjust gradient and intercept — see slope-intercept, point-gradient, and general forms update together.
        </p>
        <div className="enlight-slider-group">
          <label htmlFor="lg-m"><strong>m</strong> = {m}</label>
          <input id="lg-m" type="range" min={-2} max={3} step={0.25} value={m} onChange={(e) => setM(Number(e.target.value))} />
        </div>
        <div className="enlight-slider-group">
          <label htmlFor="lg-c"><strong>c</strong> = {c}</label>
          <input id="lg-c" type="range" min={-2} max={6} step={0.5} value={c} onChange={(e) => setC(Number(e.target.value))} />
        </div>
        <div className="enlight-formula-stack" style={{ marginTop: 12 }}>
          <div className="enlight-formula-stack__item">y = {m}x + {c}</div>
          <div className="enlight-formula-stack__item">y − {y1.toFixed(1)} = {m}(x − {x1})</div>
          <div className="enlight-formula-stack__item">{m}x − y + {c} = 0</div>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="enlight-graph-canvas" role="img" aria-label="Line graph">
        <GraphAxes mapper={MAPPER} gridX={10} gridY={10} />
        <polyline points={path} fill="none" stroke="#5b8def" strokeWidth={2.5} />
        <circle cx={toSvgX(0)} cy={toSvgY(c)} r={5} fill="#f59e0b" />
        <circle cx={toSvgX(x1)} cy={toSvgY(y1)} r={5} fill="#059669" />
      </svg>
    </div>
  )
}

function IntersectPanel() {
  const [m1, setM1] = useState(2)
  const [c1, setC1] = useState(1)
  const [m2, setM2] = useState(-1)
  const [c2, setC2] = useState(8)

  const xInt = m1 !== m2 ? (c2 - c1) / (m1 - m2) : 0
  const yInt = m1 * xInt + c1
  const inView = xInt >= X_MIN && xInt <= X_MAX && yInt >= Y_MIN && yInt <= Y_MAX

  const line = (m: number, c: number, color: string) => {
    const pts = [`${toSvgX(X_MIN)},${toSvgY(m * X_MIN + c)}`, `${toSvgX(X_MAX)},${toSvgY(m * X_MAX + c)}`]
    return <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2.5} />
  }

  return (
    <div className="enlight-explorer__layout">
      <div>
        <p className="enlight-body-text" style={{ marginBottom: 12 }}>
          Two lines: adjust gradients and intercepts. The intersection point is the simultaneous solution.
        </p>
        <div className="enlight-slider-group">
          <label htmlFor="lg-m1">Line 1: y = {m1}x + {c1}</label>
          <input id="lg-m1" type="range" min={-3} max={4} step={0.5} value={m1} onChange={(e) => setM1(Number(e.target.value))} />
          <input id="lg-c1" type="range" min={-2} max={10} step={0.5} value={c1} onChange={(e) => setC1(Number(e.target.value))} />
        </div>
        <div className="enlight-slider-group">
          <label htmlFor="lg-m2">Line 2: y = {m2}x + {c2}</label>
          <input id="lg-m2" type="range" min={-3} max={4} step={0.5} value={m2} onChange={(e) => setM2(Number(e.target.value))} />
          <input id="lg-c2" type="range" min={-2} max={10} step={0.5} value={c2} onChange={(e) => setC2(Number(e.target.value))} />
        </div>
        {m1 !== m2 && (
          <p className="enlight-rtri-result">Solution: x = {xInt.toFixed(2)}, y = {yInt.toFixed(2)}</p>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="enlight-graph-canvas" role="img" aria-label="Two lines intersection">
        <GraphAxes mapper={MAPPER} gridX={10} gridY={10} />
        {line(m1, c1, '#2563eb')}
        {line(m2, c2, '#059669')}
        {inView && m1 !== m2 && (
          <circle cx={toSvgX(xInt)} cy={toSvgY(yInt)} r={7} fill="#f59e0b" stroke="#fff" strokeWidth={2} />
        )}
      </svg>
    </div>
  )
}

function ParallelPanel() {
  const [ax, setAx] = useState(2)
  const [ay, setAy] = useState(2)
  const [bx, setBx] = useState(6)
  const [by, setBy] = useState(5)
  const [mode, setMode] = useState<'parallel' | 'perpendicular'>('parallel')

  const mx = (by - ay) / (bx - ax || 0.001)
  const midX = (ax + bx) / 2
  const midY = (ay + by) / 2
  const secM = mode === 'parallel' ? mx : mx === 0 ? 999 : -1 / mx

  const lineThrough = (x1: number, y1: number, slope: number, len = 4) => {
    const dx = len / Math.sqrt(1 + slope * slope)
    const x0 = x1 - dx
    const y0 = y1 + slope * (x0 - x1)
    const x2 = x1 + dx
    const y2 = y1 + slope * (x2 - x1)
    return `${toSvgX(x0)},${toSvgY(y0)} ${toSvgX(x2)},${toSvgY(y2)}`
  }

  return (
    <div>
      <p className="enlight-body-text" style={{ marginBottom: 12 }}>
        Drag endpoints of line AB. A second line through the midpoint shows a {mode} line.
      </p>
      <div className="enlight-fn-tabs" style={{ marginBottom: 12 }}>
        {(['parallel', 'perpendicular'] as const).map((m) => (
          <button
            key={m}
            type="button"
            className={`enlight-fn-tabs__btn${mode === m ? ' enlight-fn-tabs__btn--active' : ''}`}
            onClick={() => setMode(m)}
          >
            {m === 'parallel' ? 'Parallel' : 'Perpendicular'}
          </button>
        ))}
      </div>
      <div className="enlight-slider-group">
        <label>A ({ax}, {ay})</label>
        <input type="range" min={0} max={8} step={0.5} value={ax} onChange={(e) => setAx(Number(e.target.value))} />
        <input type="range" min={0} max={8} step={0.5} value={ay} onChange={(e) => setAy(Number(e.target.value))} />
      </div>
      <div className="enlight-slider-group">
        <label>B ({bx}, {by})</label>
        <input type="range" min={0} max={8} step={0.5} value={bx} onChange={(e) => setBx(Number(e.target.value))} />
        <input type="range" min={0} max={8} step={0.5} value={by} onChange={(e) => setBy(Number(e.target.value))} />
      </div>
      <p style={{ fontSize: '0.82rem', marginTop: 8 }}>
        Midpoint M = ({midX.toFixed(1)}, {midY.toFixed(1)}) · gradient AB = {mx.toFixed(2)}
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="enlight-graph-canvas" style={{ marginTop: 12 }} role="img" aria-label="Parallel lines">
        <GraphAxes mapper={MAPPER} gridX={10} gridY={10} />
        <polyline points={lineThrough(ax, ay, mx, 8)} fill="none" stroke="#5b8def" strokeWidth={2.5} />
        <polyline points={lineThrough(midX, midY, secM, 6)} fill="none" stroke="#059669" strokeWidth={2} strokeDasharray="6 4" />
        <circle cx={toSvgX(ax)} cy={toSvgY(ay)} r={6} fill="#5b8def" />
        <circle cx={toSvgX(bx)} cy={toSvgY(by)} r={6} fill="#5b8def" />
        <circle cx={toSvgX(midX)} cy={toSvgY(midY)} r={5} fill="#f59e0b" />
        <text x={toSvgX(ax) - 12} y={toSvgY(ay) - 8} fontSize={11} fontWeight={700}>A</text>
        <text x={toSvgX(bx) + 6} y={toSvgY(by) - 4} fontSize={11} fontWeight={700}>B</text>
        <text x={toSvgX(midX) + 8} y={toSvgY(midY)} fontSize={11} fontWeight={700} fill="#f59e0b">M</text>
      </svg>
    </div>
  )
}

export function LineGeometryExplorer({ panels }: { panels?: LineGeometryPanel[] }) {
  const active = panels?.length ? panels : (['forms'] as LineGeometryPanel[])
  const [tab, setTab] = useState<LineGeometryPanel>(active[0])
  const current = active.includes(tab) ? tab : active[0]

  const tabLabels: Record<LineGeometryPanel, string> = {
    forms: 'Line forms',
    parallel: 'Parallel & perp.',
    intersect: 'Two lines',
  }

  return (
    <section className="enlight-explorer">
      <h2 className="enlight-explorer__title">Coordinate Geometry Lab</h2>
      {active.length > 1 && (
        <div className="enlight-fn-tabs" style={{ marginBottom: 16 }}>
          {active.map((id) => (
            <button
              key={id}
              type="button"
              className={`enlight-fn-tabs__btn${current === id ? ' enlight-fn-tabs__btn--active' : ''}`}
              onClick={() => setTab(id)}
            >
              {tabLabels[id]}
            </button>
          ))}
        </div>
      )}
      {current === 'forms' && <FormsPanel />}
      {current === 'parallel' && <ParallelPanel />}
      {current === 'intersect' && <IntersectPanel />}
    </section>
  )
}
