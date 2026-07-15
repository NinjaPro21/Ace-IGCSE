import { useMemo, useState } from 'react'

export type LensGuidePanel =
  | 'infinity'
  | 'beyond-2f'
  | 'at-2f'
  | 'between-f-2f'
  | 'at-f'
  | 'inside-f'

const PANEL_ORDER: LensGuidePanel[] = [
  'infinity',
  'beyond-2f',
  'at-2f',
  'between-f-2f',
  'at-f',
  'inside-f',
]

const AXIS = 130
const LENS_X = 240
const LENS_EDGE = 228
const F_R = 290
const F_L = 190
const TWO_F_L = 140
const TWO_F_R = 340

type Pt = { x: number; y: number }

const ROWS: {
  id: LensGuidePanel
  label: string
  objectDist: string
  type: string
  orientation: string
  size: string
  application: string
  caption: string
}[] = [
  {
    id: 'infinity',
    label: 'u = ∞',
    objectDist: '$u = \\infty$',
    type: 'Real',
    orientation: 'Inverted',
    size: 'Diminished',
    application: 'Telescope objective',
    caption: 'Parallel rays from a distant object converge to a diminished real image at F.',
  },
  {
    id: 'beyond-2f',
    label: 'u > 2f',
    objectDist: '$u > 2f$',
    type: 'Real',
    orientation: 'Inverted',
    size: 'Diminished',
    application: 'Camera, eye',
    caption: 'Object beyond 2F forms a diminished inverted real image between F and 2F.',
  },
  {
    id: 'at-2f',
    label: 'u = 2f',
    objectDist: '$u = 2f$',
    type: 'Real',
    orientation: 'Inverted',
    size: 'Same size',
    application: 'Photocopier',
    caption: 'Object at 2F forms an inverted real image the same size at 2F on the other side.',
  },
  {
    id: 'between-f-2f',
    label: 'f < u < 2f',
    objectDist: '$f < u < 2f$',
    type: 'Real',
    orientation: 'Inverted',
    size: 'Magnified',
    application: 'Projector',
    caption: 'Object between F and 2F forms a magnified inverted real image beyond 2F.',
  },
  {
    id: 'at-f',
    label: 'u = f',
    objectDist: '$u = f$',
    type: '—',
    orientation: '—',
    size: '—',
    application: 'Searchlight',
    caption: 'Object at F refracts to parallel rays — no image is formed on a screen.',
  },
  {
    id: 'inside-f',
    label: 'u < f',
    objectDist: '$u < f$',
    type: 'Virtual',
    orientation: 'Upright',
    size: 'Magnified',
    application: 'Magnifying glass',
    caption: 'Object inside F forms a magnified upright virtual image on the same side (magnifying glass).',
  },
]

function intersect(a: Pt, b: Pt, c: Pt, d: Pt): Pt | null {
  const denom = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x)
  if (Math.abs(denom) < 1e-6) return null
  const t = ((a.x - c.x) * (c.y - d.y) - (a.y - c.y) * (c.x - d.x)) / denom
  return { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) }
}

function extend(p1: Pt, p2: Pt, toX: number): Pt {
  const t = (toX - p1.x) / (p2.x - p1.x)
  return { x: toX, y: p1.y + t * (p2.y - p1.y) }
}

function seg(p1: Pt, p2: Pt) {
  return <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#f59e0b" strokeWidth="2.5" />
}

function dashSeg(p1: Pt, p2: Pt) {
  return (
    <line
      x1={p1.x}
      y1={p1.y}
      x2={p2.x}
      y2={p2.y}
      stroke="#f59e0b"
      strokeWidth="2"
      strokeDasharray="6 4"
    />
  )
}

function LensAxis() {
  return (
    <>
      <line x1="20" y1={AXIS} x2="460" y2={AXIS} stroke="#94a3b8" strokeDasharray="4 3" />
      <ellipse cx={LENS_X} cy={AXIS} rx="12" ry="72" fill="#dbeafe" stroke="#2563eb" strokeWidth="2.5" />
      <circle cx={F_L} cy={AXIS} r="4" fill="#dc2626" />
      <circle cx={F_R} cy={AXIS} r="4" fill="#dc2626" />
      <circle cx={TWO_F_L} cy={AXIS} r="3" fill="#64748b" />
      <circle cx={TWO_F_R} cy={AXIS} r="3" fill="#64748b" />
      <text x={F_L - 8} y={AXIS + 18} fontSize="11" fill="#dc2626" fontWeight="600">
        F
      </text>
      <text x={F_R - 8} y={AXIS + 18} fontSize="11" fill="#dc2626" fontWeight="600">
        F
      </text>
      <text x={TWO_F_L - 12} y={AXIS + 18} fontSize="10" fill="#64748b">
        2F
      </text>
      <text x={TWO_F_R - 12} y={AXIS + 18} fontSize="10" fill="#64748b">
        2F
      </text>
    </>
  )
}

function ObjectArrow({ x, h }: { x: number; h: number }) {
  const tip = { x, y: AXIS - h }
  return (
    <g>
      <line x1={x} y1={AXIS} x2={tip.x} y2={tip.y} stroke="#f97316" strokeWidth="3" />
      <polygon
        points={`${tip.x},${tip.y - 8} ${tip.x - 6},${tip.y + 2} ${tip.x + 6},${tip.y + 2}`}
        fill="#f97316"
      />
      <text x={tip.x - 18} y={tip.y - 10} fontSize="10" fill="#f97316" fontWeight="600">
        object
      </text>
    </g>
  )
}

function ImageArrow({ x, tipY, virtual = false }: { x: number; tipY: number; virtual?: boolean }) {
  const stroke = virtual ? '#16a34a' : '#059669'
  const dash = virtual ? '6 4' : undefined
  const head = tipY < AXIS ? tipY - 8 : tipY + 8
  const base = tipY < AXIS ? tipY + 2 : tipY - 2
  return (
    <g>
      <line x1={x} y1={AXIS} x2={x} y2={tipY} stroke={stroke} strokeWidth="3" strokeDasharray={dash} />
      <polygon points={`${x},${head} ${x - 6},${base} ${x + 6},${base}`} fill={stroke} />
      <text x={x + 10} y={tipY + 4} fontSize="10" fill={stroke} fontWeight="600">
        image
      </text>
    </g>
  )
}

function rayParallelToF(tip: Pt) {
  const hit = { x: LENS_EDGE, y: tip.y }
  const focus = { x: F_R, y: AXIS }
  const end = extend(hit, focus, 430)
  return { hit, focus, end }
}

function rayThroughCenter(tip: Pt, toX = 430) {
  const center = { x: LENS_X, y: AXIS }
  const end = extend(tip, center, toX)
  return { center, end }
}

function ScenarioDiagram({ panel }: { panel: LensGuidePanel }) {
  if (panel === 'infinity') {
    const y1 = 95
    const y2 = 165
    const r1 = rayParallelToF({ x: 40, y: y1 })
    const r2 = rayParallelToF({ x: 40, y: y2 })
    return (
      <svg viewBox="0 0 480 230" className="ace-thermal-diagram__svg" role="img" aria-label="Lens at infinity">
        <LensAxis />
        <line x1="40" y1={y1} x2={LENS_EDGE} y2={y1} stroke="#f59e0b" strokeWidth="2.5" />
        {seg(r1.hit, r1.focus)}
        <line x1="40" y1={y2} x2={LENS_EDGE} y2={y2} stroke="#f59e0b" strokeWidth="2.5" />
        {seg(r2.hit, r2.focus)}
        <ImageArrow x={F_R} tipY={AXIS + 18} />
        <text x="55" y="82" fontSize="10" fill="#64748b">
          parallel rays (u = ∞)
        </text>
      </svg>
    )
  }

  if (panel === 'at-f') {
    const objX = F_L
    const h = 40
    const tip = { x: objX, y: AXIS - h }
    const par = rayParallelToF(tip)
    const cen = rayThroughCenter(tip, 430)
    return (
      <svg viewBox="0 0 480 230" className="ace-thermal-diagram__svg" role="img" aria-label="Lens at F">
        <LensAxis />
        <ObjectArrow x={objX} h={h} />
        <line x1={tip.x} y1={tip.y} x2={par.hit.x} y2={par.hit.y} stroke="#f59e0b" strokeWidth="2.5" />
        {seg(par.hit, par.end)}
        {seg(tip, cen.end)}
        <text x="300" y={par.hit.y - 10} fontSize="11" fill="#dc2626" fontWeight="600">
          refracted rays emerge parallel — no image
        </text>
      </svg>
    )
  }

  if (panel === 'inside-f') {
    const objX = 210
    const h = 28
    const tip = { x: objX, y: AXIS - h }
    const par = rayParallelToF(tip)
    const cen = rayThroughCenter(tip, 430)
    const virtual = intersect(par.focus, par.hit, tip, cen.center)
    return (
      <svg viewBox="0 0 480 230" className="ace-thermal-diagram__svg" role="img" aria-label="Magnifying glass">
        <LensAxis />
        <ObjectArrow x={objX} h={h} />
        <line x1={tip.x} y1={tip.y} x2={par.hit.x} y2={par.hit.y} stroke="#f59e0b" strokeWidth="2.5" />
        {seg(par.hit, par.end)}
        {dashSeg(par.hit, par.focus)}
        {seg(tip, cen.end)}
        {virtual && <ImageArrow x={virtual.x} tipY={virtual.y} virtual />}
      </svg>
    )
  }

  const configs: Record<string, { objX: number; h: number }> = {
    'beyond-2f': { objX: 70, h: 50 },
    'at-2f': { objX: TWO_F_L, h: 45 },
    'between-f-2f': { objX: 165, h: 35 },
  }
  const cfg = configs[panel]
  if (!cfg) return null
  const tip = { x: cfg.objX, y: AXIS - cfg.h }
  const par = rayParallelToF(tip)
  const cen = rayThroughCenter(tip, 430)
  const imagePt = intersect(par.hit, par.focus, tip, cen.center)
  const inverted = imagePt && imagePt.y > AXIS

  return (
    <svg viewBox="0 0 480 230" className="ace-thermal-diagram__svg" role="img" aria-label={`Lens ${panel}`}>
      <LensAxis />
      <ObjectArrow x={cfg.objX} h={cfg.h} />
      <line x1={tip.x} y1={tip.y} x2={par.hit.x} y2={par.hit.y} stroke="#f59e0b" strokeWidth="2.5" />
      {seg(par.hit, par.end)}
      {seg(tip, cen.end)}
      {imagePt && inverted && <ImageArrow x={imagePt.x} tipY={imagePt.y} />}
    </svg>
  )
}

export function LensImageExplorer({ panels }: { panels?: LensGuidePanel[] }) {
  const available = useMemo(() => {
    const set = new Set(panels?.length ? panels : PANEL_ORDER)
    return ROWS.filter((r) => set.has(r.id))
  }, [panels])

  const [active, setActive] = useState<LensGuidePanel>(available[0]?.id ?? 'infinity')
  const meta = ROWS.find((r) => r.id === active) ?? ROWS[0]

  return (
    <section className="ace-explorer ace-thermal-guide">
      {available.length > 1 && (
        <div className="ace-thermal-guide__tabs" role="tablist" aria-label="Object distance scenarios">
          {available.map((row) => (
            <button
              key={row.id}
              type="button"
              role="tab"
              aria-selected={active === row.id}
              className={`ace-thermal-guide__tab${active === row.id ? ' ace-thermal-guide__tab--active' : ''}`}
              onClick={() => setActive(row.id)}
            >
              {row.label}
            </button>
          ))}
        </div>
      )}
      <div className="ace-thermal-guide__frame">
        <ScenarioDiagram panel={active} />
      </div>
      <div className="ace-markdown" style={{ marginTop: 12 }}>
        <table>
          <thead>
            <tr>
              <th>Object distance</th>
              <th>Image type</th>
              <th>Orientation</th>
              <th>Size</th>
              <th>Application</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.filter((r) => available.some((a) => a.id === r.id)).map((row) => (
              <tr
                key={row.id}
                style={row.id === active ? { background: 'rgba(52, 211, 153, 0.12)' } : undefined}
              >
                <td>{row.label}</td>
                <td>{row.type}</td>
                <td>{row.orientation}</td>
                <td>{row.size}</td>
                <td>{row.application}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="ace-thermal-guide__caption">{meta.caption}</p>
    </section>
  )
}
