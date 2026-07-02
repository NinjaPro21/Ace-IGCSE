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

const W = 440
const H = 280

function ReciprocalPanel() {
  const a = 2
  const pts: string[] = []
  for (let x = -4; x <= 4; x += 0.08) {
    if (Math.abs(x) < 0.08) continue
    const y = a / x
    if (Math.abs(y) > 8) continue
    const sx = ((x + 4) / 8) * W
    const sy = H - ((y + 8) / 16) * H
    pts.push(`${sx.toFixed(1)},${sy.toFixed(1)}`)
  }

  return (
    <div className="enlight-stats-panel">
      <p className="enlight-body-text">
        Reciprocal curves y = a/x have a vertical asymptote at x = 0. Plot both branches separately.
      </p>
      <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Reciprocal curve">
        {[...Array(9)].map((_, i) => {
          const x = -4 + i
          return <line key={i} x1={((x + 4) / 8) * W} y1={0} x2={((x + 4) / 8) * W} y2={H} stroke={GRAPH.grid} />
        })}
        <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="#f43f5e" strokeDasharray="4 3" strokeWidth={1.5} />
        <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke={GRAPH.axis} strokeWidth={1.5} />
        <polyline points={pts.join(' ')} fill="none" stroke="#2563eb" strokeWidth={2.5} />
        <text x={W / 2 + 6} y={16} fontSize={9} fill="#f43f5e">x = 0</text>
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
    <div className="enlight-sandbox-coming-soon">
      <span>Loading curve explorer…</span>
    </div>
  )

  return (
    <section className="enlight-explorer enlight-curves-guide">
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
