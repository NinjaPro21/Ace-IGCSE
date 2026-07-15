import { useMemo, useState } from 'react'
import { MathText } from '@/components/MathText'
import { GRAPH } from './graphTheme'
import type { TrigPanel } from '@/lib/contentTypes'

type TrigFn = 'sin' | 'cos' | 'tan'
type ViewMode = 'graph' | 'modulus'

const GRAPH_W = 560
const GRAPH_H = 240
const Y_SCALE = 4
const Y_MARGIN = 22

function degToRad(d: number): number {
  return (d * Math.PI) / 180
}

function evaluateRaw(fn: TrigFn, xDeg: number, a: number, b: number, c: number, d: number): number {
  const arg = degToRad(b * xDeg + c)
  if (fn === 'sin') return a * Math.sin(arg) + d
  if (fn === 'cos') return a * Math.cos(arg) + d
  return a * Math.tan(arg) + d
}

function isTanAsymptote(xDeg: number, b: number, c: number): boolean {
  const argDeg = b * xDeg + c
  const mod = ((argDeg - 90) % 180 + 180) % 180
  return mod < 3 || mod > 177
}

function toGraphY(y: number): number {
  return GRAPH_H / 2 - (y / Y_SCALE) * (GRAPH_H / 2 - Y_MARGIN)
}

function toGraphX(xDeg: number): number {
  return (xDeg / 360) * GRAPH_W
}

function buildCurveSegments(
  fn: TrigFn,
  a: number,
  b: number,
  c: number,
  d: number,
  applyModulus: boolean,
): string[][] {
  const segments: string[][] = []
  let current: string[] = []

  for (let xDeg = 0; xDeg <= 360; xDeg += 1) {
    if (fn === 'tan' && isTanAsymptote(xDeg, b, c)) {
      if (current.length > 1) segments.push(current)
      current = []
      continue
    }

    let y = evaluateRaw(fn, xDeg, a, b, c, d)
    if (!Number.isFinite(y)) {
      if (current.length > 1) segments.push(current)
      current = []
      continue
    }

    if (fn === 'tan' && Math.abs(y) > Y_SCALE * 1.05) {
      if (current.length > 1) segments.push(current)
      current = []
      continue
    }

    if (applyModulus) y = Math.abs(y)

    current.push(`${toGraphX(xDeg).toFixed(1)},${toGraphY(y).toFixed(1)}`)
  }

  if (current.length > 1) segments.push(current)
  return segments
}

function SectorPanel({
  angleUnit = 'rad',
  focus = 'both',
}: {
  angleUnit?: 'deg' | 'rad'
  focus?: 'length' | 'area' | 'both'
}) {
  const TAU = 2 * Math.PI
  const [r, setR] = useState(3)
  const [thetaDeg, setThetaDeg] = useState(60)
  const [thetaRad, setThetaRad] = useState(1.2)

  const useDeg = angleUnit === 'deg'
  const theta = useDeg ? (thetaDeg * Math.PI) / 180 : thetaRad
  const arcLen = useDeg ? ((thetaDeg / 360) * 2 * Math.PI * r) : r * thetaRad
  const area = useDeg ? ((thetaDeg / 360) * Math.PI * r * r) : 0.5 * r * r * thetaRad
  const perimeter = 2 * r + arcLen
  const cx = 120
  const cy = 120
  const R = 18 * r
  const isFullCircle = useDeg ? thetaDeg >= 359 : theta >= TAU - 0.02
  const thetaDraw = isFullCircle ? TAU : Math.min(Math.max(theta, 0.05), TAU)
  const endX = cx + R * Math.cos(-thetaDraw)
  const endY = cy + R * Math.sin(-thetaDraw)
  const largeArc = thetaDraw > Math.PI ? 1 : 0
  const radMax = Number(TAU.toFixed(2))

  const title =
    focus === 'length'
      ? 'Arc Length Explorer'
      : focus === 'area'
        ? 'Sector Area Explorer'
        : 'Sector & Arc Explorer'

  const intro =
    focus === 'length' ? (
      <MathText content="Drag $r$ and $\theta$ (radians). Arc length $s = r\theta$ and perimeter $P = 2r + s$ update live." />
    ) : focus === 'area' ? (
      <MathText content="Drag $r$ and $\theta$ (radians). Sector area $A = \frac{1}{2}r^2\theta$ updates live." />
    ) : useDeg ? (
      <MathText content="Drag $\theta$ (degrees) to see arc length $s = \dfrac{\theta}{360} \times 2\pi r$ and area $A = \dfrac{\theta}{360} \times \pi r^2$ update live." />
    ) : (
      <MathText content="Drag $\theta$ (radians) to see arc length $s = r\theta$ and area $A = \frac{1}{2}r^2\theta$ update live." />
    )

  return (
    <section className="ace-explorer">
      <h2 className="ace-explorer__title">{title}</h2>
      <p className="ace-body-text" style={{ marginBottom: 12 }}>
        {intro}
      </p>
      <div className="ace-slider-group">
        <label htmlFor="sec-r"><strong>r</strong> = {r}</label>
        <input id="sec-r" type="range" min={1} max={5} step={0.5} value={r} onChange={(e) => setR(Number(e.target.value))} />
      </div>
      <div className="ace-slider-group">
        {useDeg ? (
          <>
            <label htmlFor="sec-t"><strong>θ</strong> = {thetaDeg}°</label>
            <input id="sec-t" type="range" min={10} max={360} step={5} value={thetaDeg} onChange={(e) => setThetaDeg(Number(e.target.value))} />
          </>
        ) : (
          <>
            <label htmlFor="sec-t"><strong>θ</strong> = {thetaRad.toFixed(2)} rad</label>
            <input id="sec-t" type="range" min={0.2} max={radMax} step={0.1} value={thetaRad} onChange={(e) => setThetaRad(Number(e.target.value))} />
          </>
        )}
      </div>
      <div className="ace-discriminant-display" style={{ marginTop: 12 }}>
        <div className="ace-discriminant-display__value">
          {focus === 'length' && (
            <>
              s = {arcLen.toFixed(2)}
              <span style={{ margin: '0 10px', opacity: 0.45 }}>|</span>
              P = {perimeter.toFixed(2)}
            </>
          )}
          {focus === 'area' && <>A = {area.toFixed(2)}</>}
          {focus === 'both' && (
            <>
              s = {arcLen.toFixed(2)}
              <span style={{ margin: '0 10px', opacity: 0.45 }}>|</span>
              A = {area.toFixed(2)}
            </>
          )}
        </div>
      </div>
      <svg viewBox="0 0 240 240" className="ace-graph-canvas" style={{ maxWidth: 280, marginTop: 16 }} role="img" aria-label="Circle sector">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={GRAPH.grid} strokeWidth={1.5} />
        {isFullCircle ? (
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill={focus === 'length' ? 'none' : 'rgba(91,141,239,0.25)'}
            stroke={focus === 'length' ? GRAPH.grid : '#5b8def'}
            strokeWidth={focus === 'length' ? 1.5 : 2}
          />
        ) : (
          <>
            {focus !== 'length' && (
              <path
                d={`M ${cx} ${cy} L ${cx + R} ${cy} A ${R} ${R} 0 ${largeArc} 0 ${endX} ${endY} Z`}
                fill="rgba(91,141,239,0.25)"
                stroke="none"
              />
            )}
            <line x1={cx} y1={cy} x2={cx + R} y2={cy} stroke="#d97706" strokeWidth={2} />
            {!isFullCircle && (
              <line x1={cx} y1={cy} x2={endX} y2={endY} stroke="#d97706" strokeWidth={2} />
            )}
            {!isFullCircle && (
              <path
                d={`M ${cx + R} ${cy} A ${R} ${R} 0 ${largeArc} 0 ${endX} ${endY}`}
                fill="none"
                stroke={focus === 'area' ? '#5b8def' : '#059669'}
                strokeWidth={focus === 'length' ? 3.5 : 2}
              />
            )}
          </>
        )}
      </svg>
    </section>
  )
}

export function TrigGraphExplorer({ panels }: { panels?: TrigPanel[] }) {
  if (panels?.includes('sector-length') && panels.length === 1) {
    return <SectorPanel angleUnit="rad" focus="length" />
  }
  if (panels?.includes('sector-area') && panels.length === 1) {
    return <SectorPanel angleUnit="rad" focus="area" />
  }
  if (panels?.includes('sector-deg') && panels.length === 1) {
    return <SectorPanel angleUnit="deg" focus="both" />
  }
  if (panels?.includes('sector') && panels.length === 1) {
    return <SectorPanel angleUnit="rad" focus="both" />
  }

  const [view, setView] = useState<ViewMode>(panels?.includes('modulus') ? 'modulus' : 'graph')
  const [fn, setFn] = useState<TrigFn>('sin')
  const [modulusOn, setModulusOn] = useState(false)
  const [a, setA] = useState(1)
  const [b, setB] = useState(1)
  const [c, setC] = useState(0)
  const [d, setD] = useState(0)

  const applyModulus = view === 'modulus' && modulusOn
  const period = fn === 'tan' ? 180 / Math.abs(b || 1) : 360 / Math.abs(b || 1)
  const amplitude = fn === 'tan' ? '∞' : String(Math.abs(a))
  const maxVal = fn === 'tan' ? '∞' : (a + d).toFixed(2)
  const minVal = fn === 'tan' ? '∞' : (-a + d).toFixed(2)

  const fnLabel = fn === 'sin' ? 'sin' : fn === 'cos' ? 'cos' : 'tan'
  const inner = `${a === 1 ? '' : a === -1 ? '−' : a}${fnLabel}(${b === 1 ? '' : b}${b === 1 ? 'x' : `${b}x`}${c === 0 ? '' : c > 0 ? ` + ${c}°` : ` − ${Math.abs(c)}°`})`
  const equation = applyModulus
    ? `y = |${inner}|${d === 0 ? '' : d > 0 ? ` + ${d}` : ` − ${Math.abs(d)}`}`
    : `y = ${inner}${d === 0 ? '' : d > 0 ? ` + ${d}` : ` − ${Math.abs(d)}`}`

  const curveSegments = useMemo(
    () => buildCurveSegments(fn, a, b, c, d, applyModulus),
    [fn, a, b, c, d, applyModulus],
  )
  const baseSegments = useMemo(
    () => (applyModulus ? buildCurveSegments(fn, a, b, c, d, false) : []),
    [fn, a, b, c, d, applyModulus],
  )

  const sliders = [
    { key: 'a', label: 'a — amplitude', value: a, set: setA, min: 0.5, max: 3, step: 0.1, color: '#e67e22' },
    { key: 'b', label: 'b — frequency', value: b, set: setB, min: 0.5, max: 3, step: 0.1, color: '#27ae60' },
    { key: 'c', label: 'c — phase (°)', value: c, set: setC, min: -180, max: 180, step: 5, color: '#3498db' },
    { key: 'd', label: 'd — vertical shift', value: d, set: setD, min: -2, max: 2, step: 0.1, color: '#9b59b6' },
  ] as const

  return (
    <div className="ace-trig-explorer">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--ace-font-serif)', margin: '0 0 8px' }}>Interactive Graph Explorer</h3>
          <p style={{ fontFamily: 'var(--ace-font-mono)', fontSize: '0.85rem', margin: 0 }}>
            y = a · f(bx + c°) + d
          </p>
        </div>
        <span className="ace-badge ace-badge--mint">FREE PREVIEW</span>
      </div>

      <div className="ace-trig-view-tabs">
        {(
          [
            ['graph', 'Graph'],
            ['modulus', 'Modulus'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`ace-trig-view-tabs__btn${view === id ? ' ace-trig-view-tabs__btn--active' : ''}`}
            onClick={() => {
              setView(id)
              if (id === 'modulus') setModulusOn(true)
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="ace-trig-tabs">
        {(['sin', 'cos', 'tan'] as TrigFn[]).map((f) => (
          <button
            key={f}
            type="button"
            className={`ace-trig-tabs__btn${fn === f ? ' ace-trig-tabs__btn--active' : ''}`}
            onClick={() => setFn(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {view === 'modulus' && (
        <div className="ace-trig-modulus-toggle">
          <button
            type="button"
            className={`ace-trig-modulus-toggle__btn${!modulusOn ? ' ace-trig-modulus-toggle__btn--active' : ''}`}
            onClick={() => setModulusOn(false)}
          >
            y = {fnLabel}(…)
          </button>
          <button
            type="button"
            className={`ace-trig-modulus-toggle__btn${modulusOn ? ' ace-trig-modulus-toggle__btn--active' : ''}`}
            onClick={() => setModulusOn(true)}
          >
            y = |{fnLabel}(…)|
          </button>
        </div>
      )}

      <div className="ace-trig-equation">{equation}</div>

      <svg className="ace-graph-canvas ace-trig-graph" viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`} style={{ minHeight: 240 }}>
        {[0, 90, 180, 270, 360].map((deg) => (
          <g key={deg}>
            <line x1={toGraphX(deg)} y1={0} x2={toGraphX(deg)} y2={GRAPH_H} stroke={GRAPH.grid} strokeWidth={1} />
            <text x={toGraphX(deg)} y={GRAPH_H - 6} fill={GRAPH.label} fontSize={10} textAnchor="middle">
              {deg}°
            </text>
          </g>
        ))}

        {[-Y_SCALE, -2, -1, 0, 1, 2, Y_SCALE].map((yVal) => (
          <g key={`y${yVal}`}>
            <line
              x1={0}
              y1={toGraphY(yVal)}
              x2={GRAPH_W}
              y2={toGraphY(yVal)}
              stroke={yVal === 0 ? 'transparent' : GRAPH.grid}
              strokeWidth={1}
            />
            {yVal !== 0 && Math.abs(yVal) <= 2 && (
              <text x={4} y={toGraphY(yVal) - 3} fill={GRAPH.muted} fontSize={9}>
                {yVal}
              </text>
            )}
          </g>
        ))}

        <line x1={0} y1={toGraphY(0)} x2={GRAPH_W} y2={toGraphY(0)} stroke="#57534e" strokeWidth={2.5} />
        <line x1={toGraphX(0)} y1={0} x2={toGraphX(0)} y2={GRAPH_H} stroke="#57534e" strokeWidth={2.5} />
        <text x={GRAPH_W - 14} y={toGraphY(0) - 6} fill={GRAPH.label} fontSize={11} fontWeight={600}>
          x
        </text>
        <text x={toGraphX(0) + 6} y={12} fill={GRAPH.label} fontSize={11} fontWeight={600}>
          y
        </text>
        <text x={toGraphX(0) - 4} y={toGraphY(0) + 14} fill={GRAPH.label} fontSize={9} textAnchor="end">
          0
        </text>

        {fn === 'tan' &&
          Array.from({ length: 5 }, (_, i) => {
            const asymDeg = (90 + 180 * i - c) / b
            if (asymDeg <= 0 || asymDeg >= 360) return null
            return (
              <line
                key={`asym${i}`}
                x1={toGraphX(asymDeg)}
                y1={0}
                x2={toGraphX(asymDeg)}
                y2={GRAPH_H}
                stroke="#f97316"
                strokeWidth={1}
                strokeDasharray="4 4"
                opacity={0.55}
              />
            )
          })}

        {applyModulus &&
          baseSegments.map((seg, i) => (
            <polyline
              key={`base${i}`}
              points={seg.join(' ')}
              fill="none"
              stroke="#60a5fa"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              opacity={0.35}
            />
          ))}

        {curveSegments.map((seg, i) => (
          <polyline
            key={`curve${i}`}
            points={seg.join(' ')}
            fill="none"
            stroke={applyModulus ? '#34d399' : '#5b8def'}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        ))}
      </svg>

      <div className="ace-trig-stats">
        <div className="ace-trig-stat">
          <div className="ace-trig-stat__label">Amplitude</div>
          <div className="ace-trig-stat__value" style={{ color: '#e67e22' }}>
            {amplitude}
          </div>
        </div>
        <div className="ace-trig-stat">
          <div className="ace-trig-stat__label">Period</div>
          <div className="ace-trig-stat__value" style={{ color: '#27ae60' }}>
            {period.toFixed(0)}°
          </div>
        </div>
        <div className="ace-trig-stat">
          <div className="ace-trig-stat__label">Max</div>
          <div className="ace-trig-stat__value" style={{ color: '#e67e22' }}>
            {maxVal}
          </div>
        </div>
        <div className="ace-trig-stat">
          <div className="ace-trig-stat__label">Min</div>
          <div className="ace-trig-stat__value" style={{ color: '#9b59b6' }}>
            {minVal}
          </div>
        </div>
      </div>

      <div className="ace-trig-sliders">
        {sliders.map((s) => (
          <div key={s.key} className="ace-trig-slider-row">
            <label>{s.label}</label>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              onChange={(e) => s.set(Number(e.target.value))}
              style={{ accentColor: s.color }}
            />
            <input type="number" value={s.value} step={s.step} onChange={(e) => s.set(Number(e.target.value))} />
          </div>
        ))}
      </div>
    </div>
  )
}
