import { lazy, Suspense, useState } from 'react'
import type { CurvesGuidePanel } from '@/lib/contentTypes'
import { GRAPH } from './graphTheme'

const QuadraticGraphExplorer = lazy(() =>
  import('./QuadraticGraphExplorer').then((m) => ({ default: m.QuadraticGraphExplorer })),
)
const CubicGraphExplorer = lazy(() =>
  import('./CubicGraphExplorer').then((m) => ({ default: m.CubicGraphExplorer })),
)
const ExponentialGraphExplorer = lazy(() =>
  import('./ExponentialGraphExplorer').then((m) => ({ default: m.ExponentialGraphExplorer })),
)

function ReciprocalPanel() {
  const a = 2
  const W = 440
  const H = 280
  const xMin = -4
  const xMax = 4
  const yMin = -8
  const yMax = 8
  const toX = (x: number) => ((x - xMin) / (xMax - xMin)) * W
  const toY = (y: number) => H - ((y - yMin) / (yMax - yMin)) * H

  const pos: string[] = []
  const neg: string[] = []
  for (let x = 0.15; x <= xMax; x += 0.08) {
    const y = a / x
    if (Math.abs(y) > yMax) continue
    pos.push(`${toX(x).toFixed(1)},${toY(y).toFixed(1)}`)
  }
  for (let x = -xMax; x <= -0.15; x += 0.08) {
    const y = a / x
    if (Math.abs(y) > yMax) continue
    neg.push(`${toX(x).toFixed(1)},${toY(y).toFixed(1)}`)
  }

  return (
    <div className="ace-stats-panel">
      <p className="ace-body-text">
        Reciprocal curves $y = a/x$ have vertical asymptote $x = 0$ and horizontal asymptote $y = 0$. Plot each branch separately.
      </p>
      <svg className="ace-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Reciprocal curve">
        {[...Array(9)].map((_, i) => {
          const x = xMin + i
          return <line key={`v${i}`} x1={toX(x)} y1={0} x2={toX(x)} y2={H} stroke={GRAPH.grid} />
        })}
        {[...Array(9)].map((_, i) => {
          const y = yMin + i * 2
          return <line key={`h${i}`} x1={0} y1={toY(y)} x2={W} y2={toY(y)} stroke={GRAPH.grid} />
        })}
        <line x1={toX(0)} y1={0} x2={toX(0)} y2={H} stroke={GRAPH.axis} strokeDasharray="4 3" strokeWidth={1.5} />
        <line x1={0} y1={toY(0)} x2={W} y2={toY(0)} stroke={GRAPH.axis} strokeWidth={1.5} />
        <polyline points={pos.join(' ')} fill="none" stroke="#2563eb" strokeWidth={2.5} />
        <polyline points={neg.join(' ')} fill="none" stroke="#2563eb" strokeWidth={2.5} />
        <text x={toX(0) + 6} y={14} fontSize={9} fill={GRAPH.label}>x = 0</text>
      </svg>
    </div>
  )
}

const LABELS: Record<CurvesGuidePanel, string> = {
  quadratic: 'Quadratic',
  cubic: 'Cubic',
  exponential: 'Exponential',
  reciprocal: 'Reciprocal',
}

export function CurvesVisualGuide({ panels }: { panels?: CurvesGuidePanel[] }) {
  const available = panels?.length ? panels : (['quadratic', 'cubic', 'exponential', 'reciprocal'] as CurvesGuidePanel[])
  const [tab, setTab] = useState<CurvesGuidePanel>(available[0] ?? 'quadratic')
  const current = available.includes(tab) ? tab : available[0]

  const fallback = (
    <div className="ace-sandbox-coming-soon">
      <span>Loading curve explorer…</span>
    </div>
  )

  return (
    <section className="ace-explorer ace-curves-guide">
      {available.length > 1 && (
        <div className="ace-stats-guide__tabs" role="tablist">
          {available.map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              className={`ace-stats-guide__tab${current === p ? ' ace-stats-guide__tab--active' : ''}`}
              onClick={() => setTab(p)}
            >
              {LABELS[p]}
            </button>
          ))}
        </div>
      )}
      {current === 'quadratic' && (
        <Suspense fallback={fallback}>
          <QuadraticGraphExplorer panels={['graph']} />
        </Suspense>
      )}
      {current === 'cubic' && (
        <Suspense fallback={fallback}>
          <CubicGraphExplorer panels={['trace']} />
        </Suspense>
      )}
      {current === 'exponential' && (
        <Suspense fallback={fallback}>
          <ExponentialGraphExplorer />
        </Suspense>
      )}
      {current === 'reciprocal' && <ReciprocalPanel />}
    </section>
  )
}
