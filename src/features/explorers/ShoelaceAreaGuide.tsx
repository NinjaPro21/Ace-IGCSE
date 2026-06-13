import { GRAPH } from './graphTheme'

/** Worked-example triangle: A(0,0), B(4,0), C(2,3) — area = 6 */
const VERTICES = [
  { label: 'A', x: 0, y: 0 },
  { label: 'B', x: 4, y: 0 },
  { label: 'C', x: 2, y: 3 },
] as const

function PolygonDiagram() {
  const w = 200
  const h = 160
  const pad = 24
  const xMin = -0.5
  const xMax = 4.5
  const yMin = -0.5
  const yMax = 3.5
  const toX = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (w - 2 * pad)
  const toY = (y: number) => h - pad - ((y - yMin) / (yMax - yMin)) * (h - 2 * pad)
  const pts = VERTICES.map((v) => `${toX(v.x)},${toY(v.y)}`).join(' ')

  return (
    <svg className="enlight-area-guide__polygon" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Triangle ABC">
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={`gx${i}`} x1={toX(i)} y1={pad} x2={toX(i)} y2={h - pad} stroke={GRAPH.grid} strokeWidth={1} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <line key={`gy${i}`} x1={pad} y1={toY(i)} x2={w - pad} y2={toY(i)} stroke={GRAPH.grid} strokeWidth={1} />
      ))}
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke={GRAPH.axis} strokeWidth={1.5} />
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke={GRAPH.axis} strokeWidth={1.5} />
      <polygon points={pts} fill="rgba(167, 139, 250, 0.12)" stroke="#7c3aed" strokeWidth={2} />
      {VERTICES.map((v) => (
        <g key={v.label}>
          <circle cx={toX(v.x)} cy={toY(v.y)} r={4} fill="#7c3aed" />
          <text
            x={toX(v.x)}
            y={toY(v.y) + (v.label === 'C' ? -10 : 14)}
            fontSize={10}
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

function ShoelaceDiagramHorizontal() {
  const rows = [...VERTICES, VERTICES[0]]
  const colXs = [70, 190, 310, 430]
  const xRowY = 48
  const yRowY = 108
  const cellW = 72
  const cellH = 32

  const arrow = (x1: number, y1: number, x2: number, y2: number, color: string, id: string) => (
    <line
      key={id}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={2}
      markerEnd={`url(#arrow-${color === '#059669' ? 'green' : 'amber'})`}
    />
  )

  return (
    <svg
      className="enlight-area-guide__shoelace"
      viewBox="0 0 500 210"
      role="img"
      aria-label="Horizontal shoelace layout with diagonal products"
    >
      <defs>
        <marker id="arrow-green" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#059669" />
        </marker>
        <marker id="arrow-amber" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#d97706" />
        </marker>
      </defs>

      <text x={8} y={xRowY + 5} fontSize={10} fontWeight={700} fill="#78716c">
        x
      </text>
      <text x={8} y={yRowY + 5} fontSize={10} fontWeight={700} fill="#78716c">
        y
      </text>

      {rows.map((v, i) => {
        const cx = colXs[i]
        const isRepeat = i === rows.length - 1
        const label = isRepeat ? 'A (repeat)' : `${v.label}(${v.x}, ${v.y})`
        return (
          <g key={`col-${i}`}>
            <text x={cx} y={18} textAnchor="middle" fontSize={9} fill={isRepeat ? '#b45309' : '#78716c'} fontWeight={isRepeat ? 600 : 400}>
              {label}
            </text>
            <rect
              x={cx - cellW / 2}
              y={xRowY - cellH / 2}
              width={cellW}
              height={cellH}
              rx={6}
              fill={isRepeat ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255,255,255,0.85)'}
              stroke={isRepeat ? '#f59e0b' : 'rgba(0,0,0,0.08)'}
              strokeWidth={isRepeat ? 1.5 : 1}
            />
            <rect
              x={cx - cellW / 2}
              y={yRowY - cellH / 2}
              width={cellW}
              height={cellH}
              rx={6}
              fill={isRepeat ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255,255,255,0.85)'}
              stroke={isRepeat ? '#f59e0b' : 'rgba(0,0,0,0.08)'}
              strokeWidth={isRepeat ? 1.5 : 1}
            />
            <text x={cx} y={xRowY + 5} textAnchor="middle" fontSize={14} fontWeight={600} fill="#292524">
              {v.x}
            </text>
            <text x={cx} y={yRowY + 5} textAnchor="middle" fontSize={14} fontWeight={600} fill="#292524">
              {v.y}
            </text>
          </g>
        )
      })}

      {/* Downward: x_i × y_{i+1} */}
      {colXs.slice(0, -1).map((_, i) =>
        arrow(colXs[i] + 20, xRowY + 10, colXs[i + 1] - 20, yRowY - 10, '#059669', `down-${i}`),
      )}
      {/* Upward: y_i × x_{i+1} */}
      {colXs.slice(0, -1).map((_, i) =>
        arrow(colXs[i] + 20, yRowY - 10, colXs[i + 1] - 20, xRowY + 10, '#d97706', `up-${i}`),
      )}

      <g transform="translate(16, 152)">
        <text x={0} y={0} fontSize={10} fill="#059669" fontWeight={600}>
          ↘ Downward: 0×0 + 4×3 + 2×0 = 12
        </text>
        <text x={0} y={18} fontSize={10} fill="#d97706" fontWeight={600}>
          ↗ Upward: 0×4 + 0×2 + 3×0 = 0
        </text>
        <text x={0} y={38} fontSize={11} fill="#292524" fontWeight={600}>
          Area = ½|12 − 0| = 6 units²
        </text>
      </g>

      <text x={340} y={168} fontSize={9} fill="#b45309" fontWeight={600}>
        ← repeat first vertex
      </text>
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
      <div className="enlight-area-guide__layout enlight-area-guide__layout--horizontal">
        <div className="enlight-area-guide__panel enlight-area-guide__panel--compact">
          <h3 className="enlight-area-guide__panel-title">1 · Plot the vertices</h3>
          <PolygonDiagram />
        </div>

        <div className="enlight-area-guide__panel enlight-area-guide__panel--shoelace">
          <h3 className="enlight-area-guide__panel-title">2 · Shoelace products (left → right)</h3>
          <p className="enlight-area-guide__panel-desc">
            Write <strong>x</strong> on the top row and <strong>y</strong> below.{' '}
            <span className="enlight-area-guide__highlight">Repeat the first pair at the end</span> to close the
            polygon.
          </p>
          <ShoelaceDiagramHorizontal />
          <div className="enlight-area-guide__legend">
            <span className="enlight-area-guide__legend-item enlight-area-guide__legend-item--down">
              ↘ Downward (x × next y)
            </span>
            <span className="enlight-area-guide__legend-item enlight-area-guide__legend-item--up">
              ↗ Upward (y × next x)
            </span>
          </div>
        </div>
      </div>

      <div className="enlight-area-guide__formulas">
        <h3 className="enlight-area-guide__formulas-title">Three ways to find area</h3>
        <div className="enlight-formula-stack">
          {FORMULAS.map((f) => (
            <div key={f.title} className="enlight-formula-stack__item enlight-area-guide__formula-card">
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
