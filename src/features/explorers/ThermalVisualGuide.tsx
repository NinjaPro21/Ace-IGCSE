import { useMemo, useState } from 'react'

export type ThermalGuidePanel = 'expansion' | 'ball-ring' | 'expansion-gap' | 'shc-lab' | 'particles'

const PANEL_ORDER: ThermalGuidePanel[] = ['expansion', 'ball-ring', 'expansion-gap', 'shc-lab', 'particles']

const PANEL_META: Record<ThermalGuidePanel, { label: string; caption: string }> = {
  expansion: {
    label: 'Expansion order',
    caption: 'For the same temperature rise, gases expand most, then liquids, then solids.',
  },
  'ball-ring': {
    label: 'Ball & ring',
    caption: 'At room temperature the ball passes through the ring. After heating, thermal expansion stops it fitting.',
  },
  'expansion-gap': {
    label: 'Expansion gap',
    caption: 'Gaps between rail sections allow rails to expand in hot weather without buckling.',
  },
  'shc-lab': {
    label: 'SHC experiment',
    caption: 'Electrical energy from the heater (IVt) raises the block temperature — measure m and Δθ to find c.',
  },
  particles: {
    label: 'Particle model',
    caption: 'Particles vibrate faster when heated and push further apart. The particles themselves do not grow.',
  },
}

function ExpansionOrderSvg() {
  const bars = [
    { label: 'Solid', h: 28, color: '#64748b' },
    { label: 'Liquid', h: 52, color: '#0ea5e9' },
    { label: 'Gas', h: 88, color: '#f59e0b' },
  ]
  return (
    <svg viewBox="0 0 360 200" className="ace-thermal-diagram__svg" role="img" aria-label="Bar chart comparing expansion">
      <text x="180" y="22" textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600">
        Relative volume increase (same ΔT)
      </text>
      {bars.map((b, i) => {
        const x = 48 + i * 100
        const y = 170 - b.h
        return (
          <g key={b.label}>
            <rect x={x} y={y} width={64} height={b.h} rx={6} fill={b.color} opacity={0.85} />
            <text x={x + 32} y={188} textAnchor="middle" fontSize="11" fill="#334155" fontWeight="600">
              {b.label}
            </text>
          </g>
        )
      })}
      <text x="180" y="198" textAnchor="middle" fontSize="10" fill="#94a3b8">
        Gases &gt; Liquids &gt; Solids
      </text>
    </svg>
  )
}

function BallRingSvg() {
  return (
    <svg viewBox="0 0 360 200" className="ace-thermal-diagram__svg" role="img" aria-label="Ball and ring before and after heating">
      <text x="90" y="24" textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600">
        Room temp
      </text>
      <text x="270" y="24" textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600">
        Ball heated
      </text>
      <circle cx="90" cy="95" r="28" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
      <circle cx="90" cy="95" r="38" fill="none" stroke="#cbd5e1" strokeWidth="6" />
      <text x="90" y="150" textAnchor="middle" fontSize="10" fill="#059669" fontWeight="600">
        Fits through ✓
      </text>
      <circle cx="270" cy="95" r="36" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
      <circle cx="270" cy="95" r="38" fill="none" stroke="#cbd5e1" strokeWidth="6" />
      <line x1="248" y1="72" x2="292" y2="118" stroke="#dc2626" strokeWidth="2.5" />
      <text x="270" y="150" textAnchor="middle" fontSize="10" fill="#dc2626" fontWeight="600">
        Too large ✗
      </text>
    </svg>
  )
}

function ExpansionGapSvg() {
  return (
    <svg viewBox="0 0 360 200" className="ace-thermal-diagram__svg" role="img" aria-label="Railway expansion gap">
      <rect x="20" y="120" width="130" height="12" rx="2" fill="#64748b" />
      <rect x="210" y="120" width="130" height="12" rx="2" fill="#64748b" />
      <rect x="148" y="116" width="24" height="20" rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="160" y="108" textAnchor="middle" fontSize="10" fill="#b45309" fontWeight="600">
        Gap
      </text>
      <rect x="0" y="140" width="360" height="40" fill="#e2e8f0" />
      <text x="180" y="178" textAnchor="middle" fontSize="10" fill="#64748b">
        Rails can lengthen safely in hot weather
      </text>
    </svg>
  )
}

function ShcLabSvg() {
  return (
    <svg viewBox="0 0 360 220" className="ace-thermal-diagram__svg" role="img" aria-label="Specific heat capacity experiment">
      <rect x="110" y="70" width="140" height="90" rx="8" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
      <rect x="125" y="85" width="18" height="60" rx="4" fill="#ef4444" />
      <text x="134" y="118" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="700">
        H
      </text>
      <rect x="220" y="85" width="10" height="60" rx="3" fill="#2563eb" />
      <circle cx="225" cy="78" r="6" fill="#2563eb" />
      <text x="180" y="190" textAnchor="middle" fontSize="10" fill="#334155" fontWeight="600">
        ΔE = IVt = mcΔθ
      </text>
    </svg>
  )
}

function ParticlesSvg() {
  const cold = [
    [60, 80], [95, 75], [130, 90], [75, 110], [110, 115], [145, 105],
  ]
  const hot = [
    [230, 70], [275, 85], [320, 75], [245, 115], [290, 125], [335, 110],
  ]
  return (
    <svg viewBox="0 0 360 200" className="ace-thermal-diagram__svg" role="img" aria-label="Particle spacing cold vs hot">
      <text x="95" y="28" textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600">
        Cold
      </text>
      <text x="285" y="28" textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600">
        Hot
      </text>
      <rect x="30" y="45" width="130" height="120" rx="8" fill="#f1f5f9" stroke="#cbd5e1" />
      <rect x="200" y="45" width="130" height="120" rx="8" fill="#fff7ed" stroke="#fdba74" />
      {cold.map(([cx, cy], i) => (
        <circle key={`c-${i}`} cx={cx} cy={cy} r="7" fill="#64748b" />
      ))}
      {hot.map(([cx, cy], i) => (
        <circle key={`h-${i}`} cx={cx} cy={cy} r="7" fill="#ea580c" />
      ))}
    </svg>
  )
}

function PanelDiagram({ panel }: { panel: ThermalGuidePanel }) {
  switch (panel) {
    case 'expansion':
      return <ExpansionOrderSvg />
    case 'ball-ring':
      return <BallRingSvg />
    case 'expansion-gap':
      return <ExpansionGapSvg />
    case 'shc-lab':
      return <ShcLabSvg />
    case 'particles':
      return <ParticlesSvg />
  }
}

export function ThermalVisualGuide({ panels }: { panels?: ThermalGuidePanel[] }) {
  const available = useMemo(() => {
    const set = new Set(panels?.length ? panels : PANEL_ORDER)
    return PANEL_ORDER.filter((p) => set.has(p))
  }, [panels])

  const [active, setActive] = useState<ThermalGuidePanel>(available[0] ?? 'expansion')
  const meta = PANEL_META[active]

  return (
    <section className="ace-explorer ace-thermal-guide">
      {available.length > 1 && (
        <div className="ace-thermal-guide__tabs" role="tablist" aria-label="Diagram views">
          {available.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active === id}
              className={`ace-thermal-guide__tab${active === id ? ' ace-thermal-guide__tab--active' : ''}`}
              onClick={() => setActive(id)}
            >
              {PANEL_META[id].label}
            </button>
          ))}
        </div>
      )}
      <div className="ace-thermal-guide__frame">
        <PanelDiagram panel={active} />
      </div>
      <p className="ace-thermal-guide__caption">{meta.caption}</p>
    </section>
  )
}
