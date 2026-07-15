import { useId, useMemo, useState, type ReactElement } from 'react'
import { MathText } from '@/components/MathText'
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
    <div className="ace-stats-panel">
      <p className="ace-body-text">
        Column <strong>height</strong> = frequency density. Column <strong>area</strong> = frequency.
        Unequal class widths need FD on the y-axis.
      </p>
      <svg className="ace-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Histogram with frequency density">
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

function MiniScatter({
  title,
  points,
  line,
  color,
  ox,
  oy,
}: {
  title: string
  points: [number, number][]
  line?: [[number, number], [number, number]]
  color: string
  ox: number
  oy: number
}) {
  const pw = 140
  const ph = 110
  const toX = (v: number) => ox + 12 + (v / 50) * (pw - 20)
  const toY = (v: number) => oy + ph - 14 - (v / 70) * (ph - 24)

  return (
    <g>
      <text x={ox + pw / 2} y={oy + 12} textAnchor="middle" fontSize={10} fontWeight={600} fill={color}>
        {title}
      </text>
      <line x1={ox + 12} y1={oy + ph - 14} x2={ox + pw - 4} y2={oy + ph - 14} stroke={GRAPH.axis} />
      <line x1={ox + 12} y1={oy + 18} x2={ox + 12} y2={oy + ph - 14} stroke={GRAPH.axis} />
      {line && (
        <line
          x1={toX(line[0][0])}
          y1={toY(line[0][1])}
          x2={toX(line[1][0])}
          y2={toY(line[1][1])}
          stroke="#94a3b8"
          strokeDasharray="4 3"
        />
      )}
      {points.map(([x, y], i) => (
        <circle key={i} cx={toX(x)} cy={toY(y)} r={3.5} fill={color} stroke="#fff" strokeWidth={1} />
      ))}
    </g>
  )
}

function ScatterPanel() {
  return (
    <div className="ace-stats-panel">
      <p className="ace-body-text">
        Direction: <strong>positive</strong> (up) or <strong>negative</strong> (down). Strength: points close to the line →{' '}
        <strong>strong</strong>; spread out → <strong>slight / weak</strong>. No pattern → <strong>no correlation</strong>.
      </p>
      <svg className="ace-graph-canvas" viewBox="0 0 480 280" role="img" aria-label="Correlation types on scatter diagrams">
        <MiniScatter
          title="Strong positive"
          color="#2563eb"
          ox={10}
          oy={8}
          line={[
            [5, 12],
            [48, 65],
          ]}
          points={[
            [8, 18],
            [15, 22],
            [22, 34],
            [30, 40],
            [38, 54],
            [45, 58],
          ]}
        />
        <MiniScatter
          title="Slightly positive"
          color="#2563eb"
          ox={170}
          oy={8}
          line={[
            [5, 20],
            [48, 55],
          ]}
          points={[
            [8, 28],
            [14, 18],
            [20, 38],
            [26, 30],
            [32, 48],
            [38, 36],
            [44, 58],
          ]}
        />
        <MiniScatter
          title="Strong negative"
          color="#b45309"
          ox={330}
          oy={8}
          line={[
            [5, 62],
            [48, 12],
          ]}
          points={[
            [8, 58],
            [15, 50],
            [22, 40],
            [30, 30],
            [38, 20],
            [45, 14],
          ]}
        />
        <MiniScatter
          title="Slightly negative"
          color="#b45309"
          ox={10}
          oy={140}
          line={[
            [5, 55],
            [48, 22],
          ]}
          points={[
            [8, 50],
            [14, 58],
            [20, 36],
            [26, 48],
            [32, 28],
            [38, 40],
            [44, 18],
          ]}
        />
        <MiniScatter
          title="No correlation"
          color="#64748b"
          ox={170}
          oy={140}
          points={[
            [8, 30],
            [14, 55],
            [20, 22],
            [26, 48],
            [32, 35],
            [38, 58],
            [44, 28],
          ]}
        />
        <text x={400} y={190} textAnchor="middle" fontSize={10} fill={GRAPH.label}>
          Close to line → strong
        </text>
        <text x={400} y={208} textAnchor="middle" fontSize={10} fill={GRAPH.label}>
          Spread out → slight / weak
        </text>
        <text x={400} y={226} textAnchor="middle" fontSize={10} fill={GRAPH.label}>
          No pattern → no line
        </text>
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
    <div className="ace-stats-panel">
      <p className="ace-body-text">
        Plot at <strong>upper class boundaries</strong>. Read Q1 at ¼N, median at ½N, Q3 at ¾N by drawing across then down.
      </p>
      <svg className="ace-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cumulative frequency curve">
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
  const y = 70
  const xMin = 0
  const xMax = 55
  const toX = (v: number) => 40 + ((v - xMin) / (xMax - xMin)) * (W - 80)
  const labels: { v: number; name: string; sub?: string }[] = [
    { v: min, name: 'min' },
    { v: q1, name: 'Q1', sub: '(LQ)' },
    { v: med, name: 'median' },
    { v: q3, name: 'Q3', sub: '(UQ)' },
    { v: max, name: 'max' },
  ]

  return (
    <div className="ace-stats-panel">
      <p className="ace-body-text">
        Five-number summary: <strong>min</strong>, <strong>Q1</strong> (LQ), <strong>median</strong>, <strong>Q3</strong>{' '}
        (UQ), <strong>max</strong>. Box width = IQR = Q3 − Q1.
      </p>
      <svg className="ace-graph-canvas ace-stats-boxplot" viewBox={`0 0 ${W} 180`} role="img" aria-label="Box plot with labels">
        {labels.map(({ v }) => (
          <text key={`val-${v}`} x={toX(v)} y={y - 40} textAnchor="middle" fontSize={10} fill={GRAPH.label}>
            {v}
          </text>
        ))}
        <line x1={toX(min)} y1={y} x2={toX(max)} y2={y} stroke="#64748b" strokeWidth={2} />
        <line x1={toX(min)} y1={y - 12} x2={toX(min)} y2={y + 12} stroke="#64748b" strokeWidth={2} />
        <line x1={toX(max)} y1={y - 12} x2={toX(max)} y2={y + 12} stroke="#64748b" strokeWidth={2} />
        <rect x={toX(q1)} y={y - 28} width={toX(q3) - toX(q1)} height={56} fill="#dbeafe" stroke="#2563eb" strokeWidth={2} />
        <line x1={toX(med)} y1={y - 28} x2={toX(med)} y2={y + 28} stroke="#1d4ed8" strokeWidth={2.5} />
        {labels.map(({ v, name, sub }) => (
          <g key={name}>
            <text x={toX(v)} y={y + 48} textAnchor="middle" fontSize={11} fontWeight={600} fill="#1e293b">
              {name}
            </text>
            {sub && (
              <text x={toX(v)} y={y + 62} textAnchor="middle" fontSize={9} fill={GRAPH.label}>
                {sub}
              </text>
            )}
          </g>
        ))}
        <line x1={toX(q1)} y1={y + 78} x2={toX(q3)} y2={y + 78} stroke="#2563eb" strokeWidth={1.5} />
        <line x1={toX(q1)} y1={y + 72} x2={toX(q1)} y2={y + 84} stroke="#2563eb" />
        <line x1={toX(q3)} y1={y + 72} x2={toX(q3)} y2={y + 84} stroke="#2563eb" />
        <text x={(toX(q1) + toX(q3)) / 2} y={y + 96} textAnchor="middle" fontSize={10} fill="#2563eb" fontWeight={600}>
          IQR = Q3 − Q1
        </text>
      </svg>
    </div>
  )
}

function TreePanel() {
  return (
    <div className="ace-stats-panel">
      <p className="ace-body-text">
        Without replacement: second-branch denominators drop by 1. Multiply along a path; add paths for “either order”.
      </p>
      <svg className="ace-stats-tree" viewBox="0 0 480 220" role="img" aria-label="Probability tree diagram">
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

function Tree3Panel() {
  // Full 3-stage tree (7R, 3B without replacement). Layout keeps stage headers
  // above the nodes and outcome labels to the right so nothing overlaps.
  const x0 = 28
  const x1 = 110
  const x2 = 230
  const x3 = 370
  const xl = 400

  const r1 = 70
  const b1 = 230
  const rr = 40
  const rb = 100
  const br = 200
  const bb = 260
  const leaves = {
    RRR: 28,
    RRB: 52,
    RBR: 88,
    RBB: 112,
    BRR: 188,
    BRB: 212,
    BBR: 248,
    BBB: 272,
  } as const

  const branch = (
    xA: number,
    yA: number,
    xB: number,
    yB: number,
    label: string,
    color: string,
    labelYOffset = -4,
  ) => (
    <g key={`${xA}-${yA}-${xB}-${yB}-${label}`}>
      <line x1={xA} y1={yA} x2={xB} y2={yB} stroke="#64748b" strokeWidth={1.4} />
      <text
        x={(xA + xB) / 2}
        y={(yA + yB) / 2 + labelYOffset}
        textAnchor="middle"
        fontSize={8}
        fill={color}
        fontWeight={600}
      >
        {label}
      </text>
    </g>
  )

  const node = (cx: number, cy: number, fill: string, r = 4) => (
    <circle key={`${cx}-${cy}-${fill}`} cx={cx} cy={cy} r={r} fill={fill} />
  )

  return (
    <div className="ace-stats-panel">
      <p className="ace-body-text">
        Advanced questions may need a <strong>third stage</strong> — after the 2nd draw, every path branches again.
        Multiply along the full path (e.g. P(RRR) = 7/10 × 6/9 × 5/8).
      </p>
      <svg className="ace-stats-tree" viewBox="0 0 480 300" role="img" aria-label="Three-stage probability tree">
        <text x={x0} y={14} textAnchor="middle" fontSize={9} fill={GRAPH.label}>
          start
        </text>
        <text x={x1} y={14} textAnchor="middle" fontSize={9} fill={GRAPH.label}>
          1st
        </text>
        <text x={x2} y={14} textAnchor="middle" fontSize={9} fill={GRAPH.label}>
          2nd
        </text>
        <text x={x3} y={14} textAnchor="middle" fontSize={9} fill={GRAPH.label}>
          3rd
        </text>

        {node(x0, 150, '#64748b', 6)}

        {branch(x0 + 6, 140, x1, r1, '7/10 R', '#dc2626', -6)}
        {branch(x0 + 6, 160, x1, b1, '3/10 B', '#2563eb', 12)}
        {node(x1, r1, '#dc2626', 5)}
        {node(x1, b1, '#2563eb', 5)}

        {branch(x1 + 5, r1 - 4, x2, rr, '6/9 R', '#dc2626', -6)}
        {branch(x1 + 5, r1 + 4, x2, rb, '3/9 B', '#2563eb', 12)}
        {branch(x1 + 5, b1 - 4, x2, br, '7/9 R', '#dc2626', -6)}
        {branch(x1 + 5, b1 + 4, x2, bb, '2/9 B', '#2563eb', 12)}
        {node(x2, rr, '#dc2626')}
        {node(x2, rb, '#2563eb')}
        {node(x2, br, '#dc2626')}
        {node(x2, bb, '#2563eb')}

        {branch(x2 + 4, rr - 3, x3, leaves.RRR, '5/8 R', '#dc2626', -5)}
        {branch(x2 + 4, rr + 3, x3, leaves.RRB, '3/8 B', '#2563eb', 11)}
        {branch(x2 + 4, rb - 3, x3, leaves.RBR, '6/8 R', '#dc2626', -5)}
        {branch(x2 + 4, rb + 3, x3, leaves.RBB, '2/8 B', '#2563eb', 11)}
        {branch(x2 + 4, br - 3, x3, leaves.BRR, '6/8 R', '#dc2626', -5)}
        {branch(x2 + 4, br + 3, x3, leaves.BRB, '2/8 B', '#2563eb', 11)}
        {branch(x2 + 4, bb - 3, x3, leaves.BBR, '7/8 R', '#dc2626', -5)}
        {branch(x2 + 4, bb + 3, x3, leaves.BBB, '1/8 B', '#2563eb', 11)}

        {node(x3, leaves.RRR, '#dc2626', 3.5)}
        {node(x3, leaves.RRB, '#2563eb', 3.5)}
        {node(x3, leaves.RBR, '#dc2626', 3.5)}
        {node(x3, leaves.RBB, '#2563eb', 3.5)}
        {node(x3, leaves.BRR, '#dc2626', 3.5)}
        {node(x3, leaves.BRB, '#2563eb', 3.5)}
        {node(x3, leaves.BBR, '#dc2626', 3.5)}
        {node(x3, leaves.BBB, '#2563eb', 3.5)}

        {(
          [
            ['RRR', leaves.RRR],
            ['RRB', leaves.RRB],
            ['RBR', leaves.RBR],
            ['RBB', leaves.RBB],
            ['BRR', leaves.BRR],
            ['BRB', leaves.BRB],
            ['BBR', leaves.BBR],
            ['BBB', leaves.BBB],
          ] as const
        ).map(([label, y]) => (
          <text key={label} x={xl} y={y + 3} fontSize={9} fill="#334155" fontWeight={600}>
            {label}
          </text>
        ))}
      </svg>
    </div>
  )
}

function GroupedMeanPanel() {
  const rows = [
    { interval: '0 < x ≤ 10', f: 4, mid: 5, fx: 20 },
    { interval: '10 < x ≤ 30', f: 12, mid: 20, fx: 240 },
    { interval: '30 < x ≤ 50', f: 6, mid: 40, fx: 240 },
  ]
  const bars = [
    { x: 70, w: 60, f: 4, mid: 5, h: 40 },
    { x: 150, w: 60, f: 12, mid: 20, h: 120 },
    { x: 230, w: 60, f: 6, mid: 40, h: 60 },
  ]

  return (
    <div className="ace-stats-panel">
      <p className="ace-body-text">
        Use the <strong>midpoint</strong> of each class, not the width. Mean ≈ Σ(fx) ÷ Σf.
      </p>
      <svg className="ace-graph-canvas" viewBox="0 0 360 200" role="img" aria-label="Grouped frequency bars with midpoints">
        <line x1={50} y1={160} x2={320} y2={160} stroke={GRAPH.axis} />
        <line x1={50} y1={160} x2={50} y2={20} stroke={GRAPH.axis} />
        <text x={18} y={95} fontSize={10} fill={GRAPH.label} transform="rotate(-90 18 95)">
          frequency f
        </text>
        {bars.map((b) => (
          <g key={b.mid}>
            <rect x={b.x} y={160 - b.h} width={b.w} height={b.h} fill="#60a5fa" opacity={0.85} stroke="#2563eb" />
            <text x={b.x + b.w / 2} y={160 - b.h - 6} textAnchor="middle" fontSize={10} fontWeight={600} fill="#1e40af">
              f = {b.f}
            </text>
            <line
              x1={b.x + b.w / 2}
              y1={160 - b.h}
              x2={b.x + b.w / 2}
              y2={160}
              stroke="#b45309"
              strokeWidth={2}
              strokeDasharray="3 2"
            />
            <circle cx={b.x + b.w / 2} cy={160} r={4} fill="#b45309" />
            <text x={b.x + b.w / 2} y={176} textAnchor="middle" fontSize={9} fill={GRAPH.label}>
              mid x = {b.mid}
            </text>
          </g>
        ))}
      </svg>
      <table className="ace-stats-table">
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
          <tr className="ace-stats-table__total">
            <td colSpan={2}>Total Σf = 22</td>
            <td>—</td>
            <td>500 → mean = 500÷22 ≈ 22.7</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

/** Region bits: A-only | intersection | B-only | neither (outside A∪B, inside ℰ). */
type VennRegion = 'aOnly' | 'both' | 'bOnly' | 'neither'

interface VennExpression {
  id: string
  label: string
  meaning: string
  regions: VennRegion[]
}

const VENN_SYMBOLS: VennExpression[] = [
  { id: 'A', label: '$A$', meaning: 'Everything inside circle A (including the overlap).', regions: ['aOnly', 'both'] },
  { id: 'B', label: '$B$', meaning: 'Everything inside circle B (including the overlap).', regions: ['both', 'bOnly'] },
  { id: 'A∩B', label: '$A \\cap B$', meaning: 'Intersection — only the overlap of A and B.', regions: ['both'] },
  { id: 'A∪B', label: '$A \\cup B$', meaning: 'Union — all of A and all of B combined.', regions: ['aOnly', 'both', 'bOnly'] },
  { id: "A'", label: "$A'$", meaning: 'Complement of A — everything in ℰ that is not in A.', regions: ['bOnly', 'neither'] },
  { id: "B'", label: "$B'$", meaning: 'Complement of B — everything in ℰ that is not in B.', regions: ['aOnly', 'neither'] },
]

const VENN_COMBOS: VennExpression[] = [
  { id: "A'∩B", label: "$A' \\cap B$", meaning: 'In B but not in A (B only).', regions: ['bOnly'] },
  { id: "A∩B'", label: "$A \\cap B'$", meaning: 'In A but not in B (A only).', regions: ['aOnly'] },
  { id: "(A∪B)'", label: "$(A \\cup B)'$", meaning: 'Outside both circles — neither A nor B.', regions: ['neither'] },
  {
    id: "A'∪B'",
    label: "$A' \\cup B'$",
    meaning: 'De Morgan: same as the complement of the intersection — everything except the overlap.',
    regions: ['aOnly', 'bOnly', 'neither'],
  },
]

const VENN_EXPRESSIONS = [...VENN_SYMBOLS, ...VENN_COMBOS]

/** Theme-aligned palette (tokens.css). */
const VENN = {
  universe: '#fdfbf7',
  universeStroke: '#e6dfd5',
  aStroke: '#5b8def',
  aIdle: 'rgba(91, 141, 239, 0.1)',
  aLabel: '#3d6fd4',
  bStroke: '#b59a73',
  bIdle: 'rgba(181, 154, 115, 0.14)',
  bLabel: '#8f7958',
  muted: '#6b6b6b',
}

function VennChipGroup({
  label,
  items,
  activeId,
  onSelect,
}: {
  label: string
  items: VennExpression[]
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="ace-venn-interactive__group">
      <span className="ace-venn-interactive__group-label">{label}</span>
      <div className="ace-venn-interactive__chips" role="group" aria-label={label}>
        {items.map((expr) => (
          <button
            key={expr.id}
            type="button"
            className={`ace-venn-interactive__chip${activeId === expr.id ? ' ace-venn-interactive__chip--active' : ''}`}
            onClick={() => onSelect(expr.id)}
            aria-pressed={activeId === expr.id}
          >
            <MathText content={expr.label} />
          </button>
        ))}
      </div>
    </div>
  )
}

function VennPanel() {
  const uid = useId().replace(/:/g, '')
  const clipA = `venn-a-${uid}`
  const clipB = `venn-b-${uid}`
  const clipU = `venn-u-${uid}`
  const gradId = `venn-grad-${uid}`

  const [activeId, setActiveId] = useState(VENN_EXPRESSIONS[0].id)
  const active = VENN_EXPRESSIONS.find((e) => e.id === activeId) ?? VENN_EXPRESSIONS[0]
  const lit = new Set(active.regions)

  return (
    <div className="ace-venn-interactive">
      <header className="ace-venn-interactive__header">
        <h3 className="ace-venn-interactive__title">Set notation explorer</h3>
        <p className="ace-venn-interactive__intro">
          Tap a symbol or combination — the matching region shades on the Venn diagram so you can see what{' '}
          <MathText content="$\\cap$" />, <MathText content="$\\cup$" />, and <MathText content="$'$" /> really mean.
        </p>
      </header>

      <div className="ace-venn-interactive__controls">
        <VennChipGroup label="Symbols" items={VENN_SYMBOLS} activeId={activeId} onSelect={setActiveId} />
        <VennChipGroup label="Combinations" items={VENN_COMBOS} activeId={activeId} onSelect={setActiveId} />
      </div>

      <div className="ace-venn-interactive__stage">
        <svg
          viewBox="0 0 340 220"
          className="ace-venn-interactive__svg"
          role="img"
          aria-label={`Venn diagram highlighting ${active.id}`}
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#789671" />
              <stop offset="100%" stopColor="#b59a73" />
            </linearGradient>
            <clipPath id={clipA}>
              <circle cx={130} cy={112} r={58} />
            </clipPath>
            <clipPath id={clipB}>
              <circle cx={210} cy={112} r={58} />
            </clipPath>
            <clipPath id={clipU}>
              <rect x={14} y={14} width={312} height={192} rx={12} />
            </clipPath>
          </defs>

          <rect x={14} y={14} width={312} height={192} rx={12} fill={VENN.universe} stroke={VENN.universeStroke} strokeWidth={1.5} />

          {/* Soft idle washes so circles read as sets even before a selection */}
          <circle cx={130} cy={112} r={58} fill={VENN.aIdle} stroke="none" />
          <circle cx={210} cy={112} r={58} fill={VENN.bIdle} stroke="none" />

          {/* neither = universe minus both circles */}
          {lit.has('neither') && (
            <g clipPath={`url(#${clipU})`}>
              <rect x={14} y={14} width={312} height={192} fill={`url(#${gradId})`} opacity={0.72} />
              <circle cx={130} cy={112} r={58} fill={VENN.universe} />
              <circle cx={210} cy={112} r={58} fill={VENN.universe} />
              <circle cx={130} cy={112} r={58} fill={VENN.aIdle} />
              <circle cx={210} cy={112} r={58} fill={VENN.bIdle} />
            </g>
          )}

          {/* A only */}
          {lit.has('aOnly') && (
            <g clipPath={`url(#${clipA})`}>
              <circle cx={130} cy={112} r={58} fill={`url(#${gradId})`} opacity={0.72} />
              <circle cx={210} cy={112} r={58} fill={VENN.universe} />
              <circle cx={210} cy={112} r={58} fill={VENN.bIdle} />
            </g>
          )}

          {/* B only */}
          {lit.has('bOnly') && (
            <g clipPath={`url(#${clipB})`}>
              <circle cx={210} cy={112} r={58} fill={`url(#${gradId})`} opacity={0.72} />
              <circle cx={130} cy={112} r={58} fill={VENN.universe} />
              <circle cx={130} cy={112} r={58} fill={VENN.aIdle} />
            </g>
          )}

          {/* Intersection */}
          {lit.has('both') && (
            <g clipPath={`url(#${clipA})`}>
              <circle cx={210} cy={112} r={58} fill={`url(#${gradId})`} opacity={0.78} />
            </g>
          )}

          <circle cx={130} cy={112} r={58} fill="none" stroke={VENN.aStroke} strokeWidth={2.25} />
          <circle cx={210} cy={112} r={58} fill="none" stroke={VENN.bStroke} strokeWidth={2.25} />
          <rect x={14} y={14} width={312} height={192} rx={12} fill="none" stroke={VENN.universeStroke} strokeWidth={1.5} />

          <text x={24} y={34} fontSize={13} fontWeight={600} fill={VENN.muted} fontFamily="Georgia, serif">
            ℰ
          </text>
          <text x={88} y={116} fontSize={15} fontWeight={700} fill={VENN.aLabel}>
            A
          </text>
          <text x={238} y={116} fontSize={15} fontWeight={700} fill={VENN.bLabel}>
            B
          </text>
        </svg>

        <aside className="ace-venn-interactive__card" aria-live="polite">
          <span className="ace-venn-interactive__card-kicker">Selected</span>
          <div className="ace-venn-interactive__card-expr">
            <MathText content={active.label} />
          </div>
          <p className="ace-venn-interactive__card-meaning">{active.meaning}</p>
          <p className="ace-venn-interactive__card-tip">
            Survey tip: fill the <strong>overlap first</strong>, then each-only region. All regions sum to{' '}
            <MathText content="$n(\\mathcal{E})$" />.
          </p>
        </aside>
      </div>
    </div>
  )
}

const PANEL_LABELS: Record<StatsGuidePanel, string> = {
  histogram: 'Histogram',
  scatter: 'Scatter diagram',
  cumulative: 'Cumulative frequency',
  boxplot: 'Box plot',
  tree: 'Tree diagram',
  'tree-3': '3-stage tree',
  'grouped-mean': 'Estimated mean',
  venn: 'Venn diagram',
}

const PANEL_COMPONENTS: Record<StatsGuidePanel, () => ReactElement> = {
  histogram: HistogramPanel,
  scatter: ScatterPanel,
  cumulative: CumulativePanel,
  boxplot: BoxPlotPanel,
  tree: TreePanel,
  'tree-3': Tree3Panel,
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
      <section className="ace-explorer ace-stats-guide">
        <Panel />
      </section>
    )
  }

  return (
    <section className="ace-explorer ace-stats-guide">
      <div className="ace-stats-guide__tabs" role="tablist">
        {tabs.map((p) => (
          <button
            key={p}
            type="button"
            role="tab"
            className={`ace-stats-guide__tab${current === p ? ' ace-stats-guide__tab--active' : ''}`}
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
