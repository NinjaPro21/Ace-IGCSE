import { useCallback, useMemo, useState } from 'react'
import { MathText } from '@/components/MathText'
import { GRAPH } from './graphTheme'

const W = 220
const H = 200
const X_MAX = 4
const Y_MAX = 30
const LN_Y_MIN = -1
const LN_Y_MAX = 3

function toSvgX(x: number, xMax: number) {
  return (x / xMax) * W
}
function toSvgY(y: number, yMin: number, yMax: number) {
  return H - ((y - yMin) / (yMax - yMin)) * H
}

function fitFromPoints(points: { x: number; y: number }[]) {
  if (points.length < 2 || points.some((p) => p.y <= 0)) return { A: 2, b: 1.5 }
  const [p1, p2] = points
  const lnY1 = Math.log(p1.y)
  const lnY2 = Math.log(p2.y)
  const lnB = (lnY2 - lnY1) / (p2.x - p1.x || 1)
  const lnA = lnY1 - lnB * p1.x
  return { A: Math.exp(lnA), b: Math.exp(lnB) }
}

export function LinearLawExplorer() {
  const [points, setPoints] = useState([
    { x: 1, y: 3 },
    { x: 2, y: 6.75 },
    { x: 3, y: 15.2 },
  ])
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  const { A, b } = useMemo(() => fitFromPoints(points), [points])

  const expPoints = useMemo(() => {
    const pts: string[] = []
    for (let x = 0; x <= X_MAX; x += 0.15) {
      const y = A * Math.pow(b, x)
      if (y > Y_MAX) continue
      pts.push(`${toSvgX(x, X_MAX).toFixed(1)},${toSvgY(y, 0, Y_MAX).toFixed(1)}`)
    }
    return pts.join(' ')
  }, [A, b])

  const lnPoints = useMemo(() => {
    const lnA = Math.log(A)
    const lnB = Math.log(b)
    const pts: string[] = []
    for (let x = 0; x <= X_MAX; x += 0.15) {
      const lny = lnA + x * lnB
      pts.push(`${toSvgX(x, X_MAX).toFixed(1)},${toSvgY(lny, LN_Y_MIN, LN_Y_MAX).toFixed(1)}`)
    }
    return pts.join(' ')
  }, [A, b])

  const handlePointerMove = useCallback(
    (clientY: number, svgEl: SVGSVGElement) => {
      if (dragIdx === null) return
      const rect = svgEl.getBoundingClientRect()
      const relY = 1 - (clientY - rect.top) / rect.height
      const y = relY * Y_MAX
      setPoints((prev) => prev.map((p, i) => (i === dragIdx ? { ...p, y: Math.max(0.5, Math.min(Y_MAX - 1, y)) } : p)))
    },
    [dragIdx],
  )

  return (
    <section className="enlight-explorer">
      <h2 className="enlight-explorer__title">Non-Linear to Linear Transition Tool</h2>
      <p className="enlight-body-text" style={{ marginBottom: 16 }}>
        <MathText content="Drag the data points on the exponential curve. The linearised plot $\ln y$ vs $x$ updates instantly — read off gradient $\ln b$ and intercept $\ln A$." />
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: 6, color: '#78716c' }}>
            <MathText content="$y = Ab^x$" />
          </div>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="enlight-graph-canvas"
            role="img"
            aria-label="Exponential curve with data points"
            onPointerMove={(e) => handlePointerMove(e.clientY, e.currentTarget)}
            onPointerUp={() => setDragIdx(null)}
            onPointerLeave={() => setDragIdx(null)}
          >
            <line x1={0} y1={toSvgY(0, 0, Y_MAX)} x2={W} y2={toSvgY(0, 0, Y_MAX)} stroke={GRAPH.axis} strokeWidth={1} />
            <polyline points={expPoints} fill="none" stroke="#5b8def" strokeWidth={2.5} />
            {points.map((p, i) => {
              const cx = toSvgX(p.x, X_MAX)
              const cy = toSvgY(p.y, 0, Y_MAX)
              return (
                <circle
                  key={p.x}
                  cx={cx}
                  cy={cy}
                  r={7}
                  fill="#f59e0b"
                  stroke="#fff"
                  strokeWidth={2}
                  style={{ cursor: 'ns-resize' }}
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId)
                    setDragIdx(i)
                  }}
                />
              )
            })}
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: 6, color: '#78716c' }}>
            <MathText content="$\ln y$ vs $x$" />
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="enlight-graph-canvas" role="img" aria-label="Linearised plot">
            <line x1={0} y1={toSvgY(0, LN_Y_MIN, LN_Y_MAX)} x2={W} y2={toSvgY(0, LN_Y_MIN, LN_Y_MAX)} stroke={GRAPH.axis} strokeWidth={1} />
            <polyline points={lnPoints} fill="none" stroke="#059669" strokeWidth={2.5} />
            {points.map((p) => {
              const lny = Math.log(A) + p.x * Math.log(b)
              return (
                <circle
                  key={`ln-${p.x}`}
                  cx={toSvgX(p.x, X_MAX)}
                  cy={toSvgY(lny, LN_Y_MIN, LN_Y_MAX)}
                  r={5}
                  fill="#059669"
                  stroke="#fff"
                  strokeWidth={1.5}
                />
              )
            })}
          </svg>
        </div>
      </div>

      <div className="enlight-discriminant-display" style={{ marginTop: 14 }}>
        <div className="enlight-discriminant-display__value">
          <MathText content={`$A \\approx ${A.toFixed(2)}$, $b \\approx ${b.toFixed(2)}$`} />
        </div>
        <div className="enlight-discriminant-display__label">
          <MathText content={`Gradient $= \\ln b \\approx ${Math.log(b).toFixed(3)}$ · Intercept $= \\ln A \\approx ${Math.log(A).toFixed(3)}$`} />
        </div>
      </div>
    </section>
  )
}
