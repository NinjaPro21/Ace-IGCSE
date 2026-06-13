import { GRAPH } from './graphTheme'

/** Worked-example triangle: A(0,0), B(4,0), C(2,3) — area = 6 */
const VERTICES = [
  { label: 'A', x: 0, y: 0 },
  { label: 'B', x: 4, y: 0 },
  { label: 'C', x: 2, y: 3 },
] as const

function PolygonDiagram() {
  const w = 220
  const h = 180
  const pad = 28
  const xMin = -0.5
  const xMax = 4.5
  const yMin = -0.5
  const yMax = 3.5
  const toX = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (w - 2 * pad)
  const toY = (y: number) => h - pad - ((y - yMin) / (yMax - yMin)) * (h - 2 * pad)

  const pts = VERTICES.map((v) => `${toX(v.x)},${toY(v.y)}`).join(' ')

  return (
    <svg
      className="enlight-area-guide__polygon"
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="Triangle ABC on a coordinate grid"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`gx${i}`}
          x1={toX(i)}
          y1={pad}
          x2={toX(i)}
          y2={h - pad}
          stroke={GRAPH.grid}
          strokeWidth={1}
        />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={`gy${i}`}
          x1={pad}
          y1={toY(i)}
          x2={w - pad}
          y2={toY(i)}
          stroke={GRAPH.grid}
          strokeWidth={1}
        />
      ))}
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke={GRAPH.axis} strokeWidth={1.5} />
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke={GRAPH.axis} strokeWidth={1.5} />
      <polygon points={pts} fill="rgba(167, 139, 250, 0.12)" stroke="#7c3aed" strokeWidth={2} />
      {VERTICES.map((v) => (
        <g key={v.label}>
          <circle cx={toX(v.x)} cy={toY(v.y)} r={5} fill="#7c3aed" />
          <text
            x={toX(v.x) + (v.label === 'B' ? 8 : v.label === 'C' ? -8 : -10)}
            y={toY(v.y) + (v.label === 'A' ? 16 : v.label === 'C' ? -10 : 16)}
            fontSize={11}
            fontWeight={600}
            fill="#44403c"
            textAnchor="middle"
          >
            {v.label}({v.x},{v.y})
          </text>
        </g>
      ))}
    </svg>
  )
}

function ShoelaceDiagram() {
  const colX = 72
  const colY = 132
  const rowH = 36
  const rows = [...VERTICES, VERTICES[0]]
  const n = rows.length

  const downPairs = rows.slice(0, -1).map((_, i) => ({
    x1: colX,
    y1: 52 + i * rowH,
    x2: colY,
    y2: 52 + (i + 1) * rowH,
  }))
  const upPairs = rows.slice(0, -1).map((_, i) => ({
    x1: colY,
    y1: 52 + i * rowH,
    x2: colX,
    y2: 52 + (i + 1) * rowH,
  }))

  const arrowHead = (x1: number, y1: number, x2: number, y2: number, color: string, key: string) => {
    const dx = x2 - x1
    const dy = y2 - y1
    const len = Math.hypot(dx, dy) || 1
    const ux = dx / len
    const uy = dy / len
    const tipX = x2 - ux * 8
    const tipY = y2 - uy * 8
    return (
      <g key={key}>
        <line x1={x1} y1={y1} x2={tipX} y2={tipY} stroke={color} strokeWidth={2} markerEnd={`url(#arrow-${color.replace('#', '')})`} />
      </g>
    )
  }

  return (
    <svg
      className="enlight-area-guide__shoelace"
      viewBox="0 0 320 220"
      role="img"
      aria-label="Shoelace method with downward and upward diagonal products"
    >
      <defs>
        <marker id="arrow-059669" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#059669" />
        </marker>
        <marker id="arrow-d97706" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#d97706" />
        </marker>
      </defs>

      <text x={colX} y={36} textAnchor="middle" fontSize={11} fontWeight={700} fill="#78716c">
        x
      </text>
      <text x={colY} y={36} textAnchor="middle" fontSize={11} fontWeight={700} fill="#78716c">
        y
      </text>

      {rows.map((v, i) => {
        const isRepeat = i === n - 1
        const y = 52 + i * rowH
        return (
          <g key={i}>
            <rect
              x={36}
              y={y - 14}
              width={248}
              height={28}
              rx={6}
              fill={isRepeat ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.6)'}
              stroke={isRepeat ? '#f59e0b' : 'rgba(0,0,0,0.06)'}
              strokeWidth={isRepeat ? 1.5 : 1}
            />
            <text x={colX} y={y + 4} textAnchor="middle" fontSize={13} fontWeight={600} fill="#292524">
              {v.x}
            </text>
            <text x={colY} y={y + 4} textAnchor="middle" fontSize={13} fontWeight={600} fill="#292524">
              {v.y}
            </text>
            <text x={200} y={y + 4} fontSize={10} fill={isRepeat ? '#b45309' : '#78716c'} fontWeight={isRepeat ? 600 : 400}>
              {isRepeat ? '← repeat first vertex' : `${v.label}(${v.x}, ${v.y})`}
            </text>
          </g>
        )
      })}

      {downPairs.map((p, i) =>
        arrowHead(p.x1 + 14, p.y1 + 4, p.x2 - 14, p.y2 - 4, '#059669', `down-${i}`),
      )}
      {upPairs.map((p, i) =>
        arrowHead(p.x1 - 14, p.y1 + 4, p.x2 + 14, p.y2 - 4, '#d97706', `up-${i}`),
      )}

      <text x={8} y={58} fontSize={9} fill="#059669" fontWeight={600}>
        ↘ down
      </text>
      <text x={8} y={94} fontSize={9} fill="#d97706" fontWeight={600}>
        ↗ up
      </text>

      <g transform="translate(0, 168)">
        <text x={0} y={0} fontSize={10} fill="#059669" fontWeight={600}>
          Downward: 0×0 + 4×3 + 2×0 = 12
        </text>
        <text x={0} y={16} fontSize={10} fill="#d97706" fontWeight={600}>
          Upward: 0×4 + 0×2 + 3×0 = 0
        </text>
        <text x={0} y={34} fontSize={11} fill="#292524" fontWeight={600}>
          Area = ½|12 − 0| = 6 units²
        </text>
      </g>
    </svg>
  )
}

const FORMULAS = [
  {
    title: 'Shoelace (coordinates)',
    body: 'A = ½|Σ(xᵢyᵢ₊₁) − Σ(yᵢxᵢ₊₁)|',
    note: 'List vertices in order; repeat the first at the end.',
  },
  {
    title: 'Two sides + angle',
    body: 'A = ½ab sin C',
    note: 'Use when you know two sides and the included angle.',
  },
  {
    title: 'Base × height',
    body: 'A = ½ × base × height',
    note: 'Use when you can find a perpendicular height.',
  },
] as const

export function ShoelaceAreaGuide() {
  return (
    <section className="enlight-explorer enlight-area-guide">
      <div className="enlight-area-guide__layout">
        <div className="enlight-area-guide__panel">
          <h3 className="enlight-area-guide__panel-title">1 · Plot the vertices</h3>
          <p className="enlight-area-guide__panel-desc">
            List points in order around the shape (clockwise or anticlockwise).
          </p>
          <PolygonDiagram />
        </div>

        <div className="enlight-area-guide__panel enlight-area-guide__panel--wide">
          <h3 className="enlight-area-guide__panel-title">2 · Shoelace columns</h3>
          <p className="enlight-area-guide__panel-desc">
            Write <strong>x</strong> and <strong>y</strong> columns.{' '}
            <span className="enlight-area-guide__highlight">Repeat the first coordinate pair at the bottom</span>{' '}
            to close the polygon.
          </p>
          <ShoelaceDiagram />
          <div className="enlight-area-guide__legend">
            <span className="enlight-area-guide__legend-item enlight-area-guide__legend-item--down">
              ↘ Downward products (x × next y)
            </span>
            <span className="enlight-area-guide__legend-item enlight-area-guide__legend-item--up">
              ↗ Upward products (y × next x)
            </span>
          </div>
        </div>
      </div>

      <div className="enlight-area-guide__formulas">
        <h3 className="enlight-area-guide__formulas-title">Three ways to find area</h3>
        <div className="enlight-formula-strip">
          {FORMULAS.map((f) => (
            <div key={f.title} className="enlight-formula-strip__item enlight-area-guide__formula-card">
              <div className="enlight-area-guide__formula-label">{f.title}</div>
              <div className="enlight-area-guide__formula-body">{f.body}</div>
              <div className="enlight-area-guide__formula-note">{f.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
