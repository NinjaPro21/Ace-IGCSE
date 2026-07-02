import { useMemo, useState, type ReactElement } from 'react'
import { GRAPH } from './graphTheme'
import type { StatsGuidePanel } from '@/lib/contentTypes'

const W = 480
const H = 320

function HistogramPanel() {
  const bars = [
    { x: 50, w: 10, f: 35, fd: 3.5 },
    { x: 60, w: 20, f: 50, fd: 2.5 },
    { x: 80, w: 10, f: 20, fd: 2 },
  ]
  const maxFd = 4
  const xMin = 45
  const xMax = 95

  const toX = (v: number) => 40 + ((v - xMin) / (xMax - xMin)) * (W - 60)
  const toH = (fd: number) => (fd / maxFd) * (H - 50)

  return (
    <div className="enlight-stats-panel">
      <p className="enlight-body-text">
        Column <strong>height</strong> = frequency density. Column <strong>area</strong> = frequency.
        Unequal class widths need FD on the y-axis.
      </p>
      <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Histogram with frequency density">
        {[50, 60, 70, 80, 90].map((t) => (
          <line key={t} x1={toX(t)} y1={20} x2={toX(t)} y2={H - 24} stroke={GRAPH.grid} />
        ))}
        <line x1={40} y1={H - 24} x2={W - 20} y2={H - 24} stroke={GRAPH.axis} strokeWidth={1.5} />
        <line x1={40} y1={20} x2={40} y2={H - 24} stroke={GRAPH.axis} strokeWidth={1.5} />
        <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={10} fill={GRAPH.label}>
          Weight (kg)
        </text>
        <text x={12} y={H / 2} fontSize={10} fill={GRAPH.label} transform={`rotate(-90 12 ${H / 2})`}>
          Frequency density
        </text>
        {bars.map((b) => {
          const bx = toX(b.x)
          const bw = toX(b.x + b.w) - bx
          const bh = toH(b.fd)
          return (
            <g key={b.x}>
              <rect x={bx} y={H - 24 - bh} width={bw} height={bh} fill="#60a5fa" opacity={0.85} stroke="#2563eb" />
              <text x={bx + bw / 2} y={H - 28 - bh} textAnchor="middle" fontSize={8} fill="#1e40af">
                FD={b.fd}
              </text>
              <text x={bx + bw / 2} y={H - 10} textAnchor="middle" fontSize={8} fill={GRAPH.label}>
                {b.x}–{b.x + b.w}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function ScatterPanel() {
  const points = [
    [10, 22], [15, 28], [20, 35], [25, 38], [30, 45], [35, 52], [40, 55], [45, 63],
  ]
  const xMin = 0
  const xMax = 50
  const yMin = 0
  const yMax = 70
  const toX = (v: number) => 40 + ((v - xMin) / (xMax - xMin)) * (W - 60)
  const toY = (v: number) => H - 30 - ((v - yMin) / (yMax - yMin)) * (H - 50)

  return (
    <div className="enlight-stats-panel">
      <p className="enlight-body-text">
        Points trend upward → <strong>positive correlation</strong>. Line of best fit balances points above and below.
      </p>
      <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Scatter diagram with line of best fit">
        <line x1={40} y1={H - 30} x2={W - 20} y2={H - 30} stroke={GRAPH.axis} strokeWidth={1.5} />
        <line x1={40} y1={20} x2={40} y2={H - 30} stroke={GRAPH.axis} strokeWidth={1.5} />
        <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={10} fill={GRAPH.label}>
          x (e.g. study hours)
        </text>
        <text x={14} y={H / 2} fontSize={10} fill={GRAPH.label} transform={`rotate(-90 14 ${H / 2})`}>
          y (e.g. exam mark)
        </text>
        <line x1={toX(8)} y1={toY(18)} x2={toX(48)} y2={toY(68)} stroke="#34d399" strokeWidth={2.5} />
        {points.map(([x, y], i) => (
          <circle key={i} cx={toX(x)} cy={toY(y)} r={5} fill="#2563eb" stroke="#fff" strokeWidth={1.5} />
        ))}
      </svg>
    </div>
  )
}

function CumulativePanel() {
  const pts = [
    [0, 0], [10, 8], [20, 24], [30, 48], [40, 68], [50, 80],
  ]
  const xMin = 0
  const xMax = 55
  const yMax = 80
  const toX = (v: number) => 40 + ((v - xMin) / (xMax - xMin)) * (W - 60)
  const toY = (v: number) => H - 30 - (v / yMax) * (H - 50)
  const path = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${toX(x).toFixed(1)} ${toY(y).toFixed(1)}`).join(' ')

  const q1y = 20
  const medy = 40
  const q1x = 14
  const medx = 22

  return (
    <div className="enlight-stats-panel">
      <p className="enlight-body-text">
        Plot at <strong>upper class boundaries</strong>. Read Q1 at ¼N, median at ½N, Q3 at ¾N by drawing across then down.
      </p>
      <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cumulative frequency curve">
        <line x1={40} y1={H - 30} x2={W - 20} y2={H - 30} stroke={GRAPH.axis} strokeWidth={1.5} />
        <line x1={40} y1={20} x2={40} y2={H - 30} stroke={GRAPH.axis} strokeWidth={1.5} />
        <path d={path} fill="none" stroke="#2563eb" strokeWidth={2.5} />
        <line x1={40} y1={toY(q1y)} x2={toX(q1x)} y2={toY(q1y)} stroke="#f59e0b" strokeDasharray="4 3" />
        <line x1={toX(q1x)} y1={toY(q1y)} x2={toX(q1x)} y2={H - 30} stroke="#f59e0b" strokeDasharray="4 3" />
        <line x1={40} y1={toY(medy)} x2={toX(medx)} y2={toY(medy)} stroke="#34d399" strokeDasharray="4 3" />
        <line x1={toX(medx)} y1={toY(medy)} x2={toX(medx)} y2={H - 30} stroke="#34d399" strokeDasharray="4 3" />
        <text x={W - 18} y={toY(80) + 4} fontSize={9} fill={GRAPH.label}>N=80</text>
        <text x={toX(q1x) + 4} y={toY(q1y) - 4} fontSize={8} fill="#f59e0b">Q1</text>
        <text x={toX(medx) + 4} y={toY(medy) - 4} fontSize={8} fill="#34d399">Med</text>
      </svg>
    </div>
  )
}

function BoxPlotPanel() {
  const min = 8
  const q1 = 14
  const med = 22
  const q3 = 32
  const max = 48
  const y = 100
  const xMin = 0
  const xMax = 55
  const toX = (v: number) => 40 + ((v - xMin) / (xMax - xMin)) * (W - 80)

  return (
    <div className="enlight-stats-panel">
      <p className="enlight-body-text">
        Five-number summary: min, Q1, median, Q3, max. Box width = IQR = Q3 − Q1.
      </p>
      <svg className="enlight-graph-canvas enlight-stats-boxplot" viewBox={`0 0 ${W} 160`} role="img" aria-label="Box plot">
        <line x1={toX(min)} y1={y} x2={toX(max)} y2={y} stroke="#64748b" strokeWidth={2} />
        <line x1={toX(min)} y1={y - 12} x2={toX(min)} y2={y + 12} stroke="#64748b" strokeWidth={2} />
        <line x1={toX(max)} y1={y - 12} x2={toX(max)} y2={y + 12} stroke="#64748b" strokeWidth={2} />
        <rect x={toX(q1)} y={y - 28} width={toX(q3) - toX(q1)} height={56} fill="#dbeafe" stroke="#2563eb" strokeWidth={2} />
        <line x1={toX(med)} y1={y - 28} x2={toX(med)} y2={y + 28} stroke="#1d4ed8" strokeWidth={2.5} />
        {[min, q1, med, q3, max].map((v) => (
          <text key={v} x={toX(v)} y={y + 44} textAnchor="middle" fontSize={9} fill={GRAPH.label}>
            {v}
          </text>
        ))}
      </svg>
    </div>
  )
}

function TreePanel() {
  return (
    <div className="enlight-stats-panel">
      <p className="enlight-body-text">
        Without replacement: second-branch denominators drop by 1. Multiply along a path; add paths for “either order”.
      </p>
      <svg className="enlight-stats-tree" viewBox="0 0 480 220" role="img" aria-label="Probability tree diagram">
        <circle cx={40} cy={110} r={6} fill="#64748b" />
        <line x1={46} y1={70} x2={120} y2={40} stroke="#64748b" strokeWidth={1.5} />
        <line x1={46} y1={150} x2={120} y2={180} stroke="#64748b" strokeWidth={1.5} />
        <text x={72} y={48} fontSize={10} fill="#dc2626" fontWeight={600}>7/10 R</text>
        <text x={72} y={168} fontSize={10} fill="#2563eb" fontWeight={600}>3/10 B</text>
        <circle cx={120} cy={40} r={5} fill="#dc2626" />
        <circle cx={120} cy={180} r={5} fill="#2563eb" />
        <line x1={125} y1={30} x2={200} y2={15} stroke="#64748b" />
        <line x1={125} y1={50} x2={200} y2={65} stroke="#64748b" />
        <text x={150} y={18} fontSize={9} fill="#dc2626">6/9 R</text>
        <text x={150} y={72} fontSize={9} fill="#2563eb">3/9 B</text>
        <line x1={125} y1={170} x2={200} y2={155} stroke="#64748b" />
        <line x1={125} y1={190} x2={200} y2={205} stroke="#64748b" />
        <text x={150} y={158} fontSize={9} fill="#dc2626">7/9 R</text>
        <text x={150} y={212} fontSize={9} fill="#2563eb">2/9 B</text>
        <text x={220} y={20} fontSize={9} fill="#334155">P(RR)=7/10×6/9=7/15</text>
        <text x={220} y={68} fontSize={9} fill="#334155">P(RB)=7/10×3/9</text>
        <text x={220} y={160} fontSize={9} fill="#334155">P(BR)=3/10×7/9</text>
        <text x={220} y={208} fontSize={9} fill="#334155">P(BB)=3/10×2/9</text>
      </svg>
    </div>
  )
}

function GroupedMeanPanel() {
  const rows = [
    { interval: '0 < x ≤ 10', f: 4, mid: 5, fx: 20 },
    { interval: '10 < x ≤ 30', f: 12, mid: 20, fx: 240 },
  ]

  return (
    <div className="enlight-stats-panel">
      <p className="enlight-body-text">
        Use the <strong>midpoint</strong> of each class, not the width. Mean ≈ Σ(fx) ÷ Σf.
      </p>
      <table className="enlight-stats-table">
        <thead>
          <tr>
            <th>Interval</th>
            <th>f</th>
            <th>Midpoint x</th>
            <th>f × x</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.interval}>
              <td>{r.interval}</td>
              <td>{r.f}</td>
              <td>{r.mid}</td>
              <td>{r.fx}</td>
            </tr>
          ))}
          <tr className="enlight-stats-table__total">
            <td colSpan={2}>Total</td>
            <td>—</td>
            <td>260 → mean = 260÷16 = 16.25</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function VennPanel() {
  const nA = 18
  const nB = 15
  const neither = 5
  const total = 30
  const both = nA + nB + neither - total

  return (
    <div className="enlight-stats-panel">
      <p className="enlight-body-text">
        Fill the <strong>overlap first</strong>, then each-only region. All regions sum to n(ℰ).
      </p>
      <svg viewBox="0 0 320 200" className="enlight-stats-venn" role="img" aria-label="Two-set Venn diagram">
        <rect x={8} y={8} width={304} height={184} rx={8} fill="#f8fafc" stroke="#cbd5e1" />
        <text x={16} y={24} fontSize={10} fill="#64748b">ℰ</text>
        <circle cx={120} cy={100} r={56} fill="#dbeafe" fillOpacity={0.6} stroke="#2563eb" strokeWidth={2} />
        <circle cx={200} cy={100} r={56} fill="#fce7f3" fillOpacity={0.6} stroke="#db2777" strokeWidth={2} />
        <text x={78} y={104} fontSize={11} fontWeight={600} fill="#1d4ed8">A</text>
        <text x={228} y={104} fontSize={11} fontWeight={600} fill="#be185d">B</text>
        <text x={152} y={104} fontSize={10} fill="#334155" textAnchor="middle">∩ = {both}</text>
        <text x={90} y={140} fontSize={9} fill="#64748b">A only</text>
        <text x={210} y={140} fontSize={9} fill="#64748b">B only</text>
        <text x={280} y={170} fontSize={9} fill="#64748b">neither = {neither}</text>
      </svg>
      <p className="enlight-rtri-result">Example: 18 Art, 15 Music, 5 neither, 30 total → both = {both}</p>
    </div>
  )
}

const PANEL_LABELS: Record<StatsGuidePanel, string> = {
  histogram: 'Histogram',
  scatter: 'Scatter diagram',
  cumulative: 'Cumulative frequency',
  boxplot: 'Box plot',
  tree: 'Tree diagram',
  'grouped-mean': 'Estimated mean',
  venn: 'Venn diagram',
}

const PANEL_COMPONENTS: Record<StatsGuidePanel, () => ReactElement> = {
  histogram: HistogramPanel,
  scatter: ScatterPanel,
  cumulative: CumulativePanel,
  boxplot: BoxPlotPanel,
  tree: TreePanel,
  'grouped-mean': GroupedMeanPanel,
  venn: VennPanel,
}

export function StatisticsVisualGuide({ panels }: { panels?: StatsGuidePanel[] }) {
  const available = panels?.length ? panels : (['histogram', 'scatter', 'cumulative', 'boxplot', 'tree'] as StatsGuidePanel[])
  const [tab, setTab] = useState<StatsGuidePanel>(available[0] ?? 'histogram')
  const current = available.includes(tab) ? tab : available[0]
  const Panel = PANEL_COMPONENTS[current] ?? HistogramPanel

  const tabs = useMemo(() => available.filter((p) => PANEL_LABELS[p]), [available])

  if (tabs.length === 1) {
    return (
      <section className="enlight-explorer enlight-stats-guide">
        <Panel />
      </section>
    )
  }

  return (
    <section className="enlight-explorer enlight-stats-guide">
      <div className="enlight-stats-guide__tabs" role="tablist">
        {tabs.map((p) => (
          <button
            key={p}
            type="button"
            role="tab"
            className={`enlight-stats-guide__tab${current === p ? ' enlight-stats-guide__tab--active' : ''}`}
            onClick={() => setTab(p)}
          >
            {PANEL_LABELS[p]}
          </button>
        ))}
      </div>
      <Panel />
    </section>
  )
}
