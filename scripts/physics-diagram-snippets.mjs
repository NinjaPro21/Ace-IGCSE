/** Reusable SVG diagram blocks for physics notes (embedded via rehype-raw). */

export function diagramWrap(caption, svg, extraClass = '') {
  const cls = extraClass ? `enlight-physics-diagram ${extraClass}` : 'enlight-physics-diagram'
  return `<div class="${cls}">${svg}<p class="enlight-physics-diagram__caption">${caption}</p></div>`
}

/** Universal Sankey layout — input bar left; useful branch right; waste branch down. Branch height ∝ energy. */
function buildSankey({ ariaLabel, input, useful, waste, footer }) {
  const barH = 130
  const usefulH = Math.round((barH * useful.value) / input.value)
  const wasteH = barH - usefulH
  const y0 = 50
  const wy = y0 + usefulH
  const wasteDownH = Math.max(wasteH, 30)
  const usefulLabel =
    usefulH >= 36
      ? `<text x="260" y="${y0 + usefulH / 2 + 5}" text-anchor="middle" font-size="11" fill="#ffffff" font-weight="600">${useful.label} — ${useful.value} ${useful.unit}</text>`
      : `<text x="478" y="${y0 + usefulH / 2 + 5}" text-anchor="end" font-size="11" fill="#15803d" font-weight="600">${useful.label} — ${useful.value} ${useful.unit}</text>`

  return `<svg viewBox="0 0 520 270" width="520" height="270" role="img" aria-label="${ariaLabel}">
      <rect width="520" height="270" fill="#fafafa" rx="6"/>
      <text x="14" y="${y0 + barH / 2 + 4}" font-size="11" fill="#1e40af" font-weight="600">${input.label}</text>
      <text x="14" y="${y0 + barH / 2 + 18}" font-size="10" fill="#334155">${input.value} ${input.unit}</text>
      <rect x="36" y="${y0}" width="28" height="${barH}" fill="#2563eb" stroke="#1e40af" stroke-width="1.5" rx="2"/>
      <rect x="64" y="${y0}" width="400" height="${usefulH}" fill="#16a34a" stroke="#15803d" stroke-width="1"/>
      <polygon points="464,${y0} 486,${y0 + usefulH / 2} 464,${y0 + usefulH}" fill="#16a34a" stroke="#15803d" stroke-width="1"/>
      ${usefulLabel}
      <rect x="64" y="${wy}" width="40" height="${wasteH}" fill="#ea580c" stroke="#c2410c" stroke-width="1"/>
      <rect x="64" y="${wy + wasteH}" width="300" height="${wasteDownH}" fill="#ea580c" stroke="#c2410c" stroke-width="1"/>
      <text x="214" y="${wy + wasteH + wasteDownH / 2 + 5}" text-anchor="middle" font-size="11" fill="#ffffff" font-weight="600">${waste.label} — ${waste.value} ${waste.unit}</text>
      <text x="260" y="262" text-anchor="middle" font-size="10" fill="#64748b">${footer}</text>
    </svg>`
}

/** Wave graph geometry — Q control y=10 gives crest exactly at y=55 (rest y=100). */
const WAVE_G = {
  rest: 100,
  crest: 55,
  ctrl: 10,
  crest1: 80,
  crest2: 140,
  path: 'M50 100 Q80 10 110 100 T170 100 T230 100 T290 100 T350 100 T410 100',
}

export const SNIPPETS = {
  'heating-curve': diagramWrap(
    'Heating curve — temperature rises in each state; flat plateaus during melting and boiling while energy is still supplied.',
    `<svg viewBox="0 0 440 260" width="440" height="260" role="img" aria-label="Heating curve">
      <line x1="55" y1="215" x2="400" y2="215" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="215" x2="55" y2="30" stroke="#64748b" stroke-width="1.5"/>
      <text x="230" y="240" text-anchor="middle" font-size="12" fill="#475569">Time</text>
      <text x="22" y="120" transform="rotate(-90 22 120)" text-anchor="middle" font-size="12" fill="#475569">Temperature</text>
      <polyline fill="none" stroke="#16a34a" stroke-width="2.5" points="65,185 115,150"/>
      <line x1="115" y1="150" x2="175" y2="150" stroke="#16a34a" stroke-width="2.5"/>
      <polyline fill="none" stroke="#16a34a" stroke-width="2.5" points="175,150 225,110"/>
      <line x1="225" y1="110" x2="285" y2="110" stroke="#16a34a" stroke-width="2.5"/>
      <polyline fill="none" stroke="#16a34a" stroke-width="2.5" points="285,110 355,60"/>
      <text x="145" y="142" font-size="10" fill="#dc2626" font-weight="600">melting</text>
      <text x="255" y="102" font-size="10" fill="#dc2626" font-weight="600">boiling</text>
    </svg>`,
  ),

  'state-transitions': diagramWrap(
    'State changes — red arrows show heating (energy in); blue arrows show cooling (energy out).',
    `<svg viewBox="0 0 420 120" width="420" height="120" role="img" aria-label="State transitions">
      <rect x="20" y="40" width="70" height="40" rx="6" fill="#dbeafe" stroke="#3b82f6"/>
      <text x="55" y="65" text-anchor="middle" font-size="12" fill="#1e3a8a">Solid</text>
      <rect x="175" y="40" width="70" height="40" rx="6" fill="#bfdbfe" stroke="#3b82f6"/>
      <text x="210" y="65" text-anchor="middle" font-size="12" fill="#1e3a8a">Liquid</text>
      <rect x="330" y="40" width="70" height="40" rx="6" fill="#93c5fd" stroke="#3b82f6"/>
      <text x="365" y="65" text-anchor="middle" font-size="12" fill="#1e3a8a">Gas</text>
      <path d="M92 50 H168" stroke="#dc2626" stroke-width="2" marker-end="url(#arrR)"/>
      <path d="M168 70 H92" stroke="#2563eb" stroke-width="2" marker-end="url(#arrB)"/>
      <path d="M247 50 H323" stroke="#dc2626" stroke-width="2" marker-end="url(#arrR)"/>
      <path d="M323 70 H247" stroke="#2563eb" stroke-width="2" marker-end="url(#arrB)"/>
      <defs>
        <marker id="arrR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/></marker>
        <marker id="arrB" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker>
      </defs>
    </svg>`,
  ),

  'tir-semicircle': diagramWrap(
    'Semi-circular block — ray enters the curved face without bending; at the flat face it refracts, grazes, or reflects (TIR).',
    `<svg viewBox="0 0 420 200" width="420" height="200" role="img" aria-label="Total internal reflection in semi-circular block">
      <path d="M120 160 A80 80 0 0 1 280 160 L280 160 L120 160 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <line x1="200" y1="160" x2="200" y2="40" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <line x1="200" y1="160" x2="320" y2="90" stroke="#f59e0b" stroke-width="2.5"/>
      <line x1="200" y1="160" x2="340" y2="160" stroke="#16a34a" stroke-width="2"/>
      <line x1="200" y1="160" x2="130" y2="100" stroke="#dc2626" stroke-width="2.5"/>
      <text x="325" y="85" font-size="10" fill="#f59e0b">refract</text>
      <text x="345" y="155" font-size="10" fill="#16a34a">graze</text>
      <text x="95" y="95" font-size="10" fill="#dc2626">TIR</text>
      <text x="205" y="35" font-size="10" fill="#64748b">normal</text>
    </svg>`,
  ),

  'optical-fibre': diagramWrap(
    'Optical fibre — light reflects repeatedly inside the high-index core at the core–cladding boundary.',
    `<svg viewBox="0 0 480 150" width="480" height="150" role="img" aria-label="Optical fibre total internal reflection">
      <rect x="20" y="40" width="440" height="70" rx="35" fill="#93c5fd" stroke="#2563eb" stroke-width="2"/>
      <rect x="40" y="52" width="400" height="46" rx="23" fill="#dbeafe" stroke="#0284c7" stroke-width="2"/>
      <text x="240" y="28" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="600">cladding (lower n)</text>
      <text x="240" y="132" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="600">core (higher n)</text>
      <polyline fill="none" stroke="#f59e0b" stroke-width="3" points="55,75 120,52 185,75 250,52 315,75 380,52 445,75"/>
      <text x="120" y="48" font-size="9" fill="#dc2626" font-weight="600">TIR</text>
      <text x="250" y="48" font-size="9" fill="#dc2626" font-weight="600">TIR</text>
      <text x="380" y="48" font-size="9" fill="#dc2626" font-weight="600">TIR</text>
      <text x="55" y="88" font-size="10" fill="#f59e0b" font-weight="600">light in</text>
      <text x="430" y="88" font-size="10" fill="#f59e0b" font-weight="600">out</text>
    </svg>`,
  ),

  'right-prism': diagramWrap(
    'Right-angled prism — ray enters at 90° to a face; at the hypotenuse i ≈ 45° &gt; c (~42° for glass), so TIR occurs.',
    `<svg viewBox="0 0 220 200" width="220" height="200" role="img" aria-label="Right-angled prism TIR">
      <polygon points="40,160 160,160 40,40" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <line x1="40" y1="160" x2="40" y2="40" stroke="#64748b" stroke-width="1"/>
      <line x1="40" y1="160" x2="160" y2="160" stroke="#64748b" stroke-width="1"/>
      <line x1="40" y1="40" x2="160" y2="160" stroke="#64748b" stroke-width="1"/>
      <line x1="40" y1="120" x2="40" y2="160" stroke="#f59e0b" stroke-width="2.5"/>
      <line x1="40" y1="120" x2="95" y2="75" stroke="#f59e0b" stroke-width="2.5"/>
      <line x1="95" y1="75" x2="40" y2="75" stroke="#dc2626" stroke-width="2.5"/>
      <text x="48" y="115" font-size="9" fill="#f59e0b">in</text>
      <text x="55" y="72" font-size="9" fill="#dc2626">TIR</text>
    </svg>`,
  ),

  'cro-pitch': diagramWrap(
    'C.R.O. traces — same time base: more cycles in the same interval means higher frequency (higher pitch).',
    `<svg viewBox="0 0 420 175" width="420" height="175" role="img" aria-label="CRO pitch comparison">
      <text x="210" y="14" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">High pitch (short period)</text>
      <rect x="30" y="22" width="360" height="52" fill="#f8fafc" stroke="#cbd5e1"/>
      <path d="M40 48 Q55 30 70 48 T100 48 T130 48 T160 48 T190 48" fill="none" stroke="#2563eb" stroke-width="2"/>
      <text x="210" y="88" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Low pitch (long period)</text>
      <rect x="30" y="96" width="360" height="52" fill="#f8fafc" stroke="#cbd5e1"/>
      <path d="M40 122 Q80 104 120 122 T200 122 T280 122 T360 122" fill="none" stroke="#16a34a" stroke-width="2"/>
    </svg>`,
  ),

  'cro-loudness': diagramWrap(
    'C.R.O. traces — same frequency: taller peaks mean larger amplitude (louder sound).',
    `<svg viewBox="0 0 420 175" width="420" height="175" role="img" aria-label="CRO loudness comparison">
      <text x="210" y="14" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Loud (large amplitude)</text>
      <rect x="30" y="22" width="360" height="52" fill="#f8fafc" stroke="#cbd5e1"/>
      <line x1="30" y1="48" x2="390" y2="48" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <path d="M40 48 Q70 10 100 48 T160 48 T220 48 T280 48 T340 48 T390 48" fill="none" stroke="#dc2626" stroke-width="2.5"/>
      <text x="210" y="88" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Soft (small amplitude)</text>
      <rect x="30" y="96" width="360" height="52" fill="#f8fafc" stroke="#cbd5e1"/>
      <line x1="30" y1="122" x2="390" y2="122" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <path d="M40 122 Q70 110 100 122 T160 122 T220 122 T280 122 T340 122 T390 122" fill="none" stroke="#2563eb" stroke-width="2"/>
    </svg>`,
  ),

  'motion-graph': diagramWrap(
    'Distance–time graph — flat = at rest; straight slope = constant speed; curve getting steeper = accelerating.',
    `<svg viewBox="0 0 440 260" width="440" height="260" role="img" aria-label="Distance time graph with acceleration">
      <line x1="55" y1="215" x2="400" y2="215" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="215" x2="55" y2="25" stroke="#64748b" stroke-width="1.5"/>
      <text x="230" y="238" text-anchor="middle" font-size="12" fill="#475569">Time</text>
      <text x="20" y="120" transform="rotate(-90 20 120)" text-anchor="middle" font-size="12" fill="#475569">Distance</text>
      <polyline fill="none" stroke="#2563eb" stroke-width="2.5" points="65,195 120,160"/>
      <path d="M120 160 Q170 150 210 130 T290 70" fill="none" stroke="#2563eb" stroke-width="2.5"/>
      <polyline fill="none" stroke="#2563eb" stroke-width="2.5" points="290,70 370,70"/>
      <text x="90" y="178" font-size="10" fill="#2563eb">constant speed</text>
      <text x="200" y="115" font-size="10" fill="#dc2626">accelerating (curve)</text>
      <text x="330" y="62" font-size="10" fill="#64748b">at rest</text>
    </svg>`,
  ),

  'speed-time-graph': diagramWrap(
    'Speed–time graph — upward slope = acceleration; flat = constant speed; downward slope = deceleration; shaded area = distance travelled.',
    `<svg viewBox="0 0 440 260" width="440" height="260" role="img" aria-label="Speed time graph">
      <line x1="55" y1="215" x2="400" y2="215" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="215" x2="55" y2="25" stroke="#64748b" stroke-width="1.5"/>
      <text x="230" y="238" text-anchor="middle" font-size="12" fill="#475569">Time</text>
      <text x="20" y="120" transform="rotate(-90 20 120)" text-anchor="middle" font-size="12" fill="#475569">Speed</text>
      <polygon fill="rgba(37,99,235,0.18)" stroke="none" points="65,215 65,195 140,90 220,90 300,90 370,170 370,215"/>
      <polyline fill="none" stroke="#16a34a" stroke-width="2.5" points="65,195 140,90 220,90 300,90 370,170"/>
      <text x="95" y="175" font-size="10" fill="#16a34a">acceleration</text>
      <text x="255" y="82" font-size="10" fill="#16a34a">constant speed</text>
      <text x="330" y="155" font-size="10" fill="#dc2626">deceleration</text>
      <text x="200" y="200" font-size="10" fill="#2563eb">area = distance</text>
    </svg>`,
  ),

  'velocity-time-graph': diagramWrap(
    'Velocity–time graph — gradient = acceleration; shaded area under the full line = displacement.',
    `<svg viewBox="0 0 440 260" width="440" height="260" role="img" aria-label="Velocity time graph">
      <line x1="55" y1="215" x2="400" y2="215" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="215" x2="55" y2="25" stroke="#64748b" stroke-width="1.5"/>
      <text x="230" y="238" text-anchor="middle" font-size="12" fill="#475569">Time</text>
      <text x="20" y="120" transform="rotate(-90 20 120)" text-anchor="middle" font-size="12" fill="#475569">Velocity</text>
      <polygon fill="rgba(124,58,237,0.18)" stroke="none" points="65,215 65,195 140,80 220,80 300,80 370,165 370,215"/>
      <polyline fill="none" stroke="#7c3aed" stroke-width="2.5" points="65,195 140,80 220,80 300,80 370,165"/>
      <text x="95" y="175" font-size="10" fill="#7c3aed">+ acceleration</text>
      <text x="255" y="72" font-size="10" fill="#7c3aed">constant velocity</text>
      <text x="330" y="150" font-size="10" fill="#dc2626">− deceleration</text>
      <text x="200" y="200" font-size="10" fill="#7c3aed">area = displacement</text>
    </svg>`,
  ),

  'vector-arrow': diagramWrap(
    'Vector — arrow length shows magnitude; arrowhead shows direction.',
    `<svg viewBox="0 0 320 100" width="320" height="100" role="img" aria-label="Vector arrow">
      <line x1="40" y1="60" x2="260" y2="60" stroke="#2563eb" stroke-width="3" marker-end="url(#va)"/>
      <text x="150" y="48" text-anchor="middle" font-size="12" fill="#2563eb">magnitude (length)</text>
      <text x="270" y="64" font-size="11" fill="#64748b">direction →</text>
      <defs><marker id="va" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker></defs>
    </svg>`,
  ),

  'vector-resultant': diagramWrap(
    'Resultant of perpendicular forces — use Pythagoras for magnitude and tan θ for direction.',
    `<svg viewBox="0 0 280 220" width="280" height="220" role="img" aria-label="Vector resultant at right angles">
      <line x1="40" y1="170" x2="200" y2="170" stroke="#2563eb" stroke-width="3" marker-end="url(#vf1)"/>
      <text x="120" y="188" text-anchor="middle" font-size="11" fill="#2563eb">F₁ = 4 N</text>
      <line x1="40" y1="170" x2="40" y2="50" stroke="#16a34a" stroke-width="3" marker-end="url(#vf2)"/>
      <text x="28" y="110" text-anchor="middle" font-size="11" fill="#16a34a" transform="rotate(-90 28 110)">F₂ = 3 N</text>
      <line x1="40" y1="170" x2="170" y2="80" stroke="#dc2626" stroke-width="3" marker-end="url(#vr)"/>
      <text x="115" y="105" font-size="12" fill="#dc2626" font-weight="600">R = 5 N</text>
      <path d="M55 170 A25 25 0 0 0 48 148" fill="none" stroke="#64748b"/>
      <text x="62" y="152" font-size="10" fill="#64748b">θ</text>
      <defs>
        <marker id="vf1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker>
        <marker id="vf2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#16a34a"/></marker>
        <marker id="vr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/></marker>
      </defs>
    </svg>`,
  ),

  'pendulum-time': diagramWrap(
    'Measuring time with a pendulum — period T is time for one complete swing (there and back).',
    `<svg viewBox="0 0 200 220" width="200" height="220" role="img" aria-label="Simple pendulum">
      <line x1="100" y1="20" x2="100" y2="20" stroke="#64748b" stroke-width="3"/>
      <line x1="60" y1="20" x2="140" y2="20" stroke="#64748b" stroke-width="3"/>
      <line x1="100" y1="20" x2="145" y2="130" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="100" y1="20" x2="55" y2="130" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 3"/>
      <circle cx="145" cy="130" r="14" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <text x="100" y="175" text-anchor="middle" font-size="11" fill="#475569">Period T = time for one full oscillation</text>
    </svg>`,
  ),

  'measure-length': diagramWrap(
    'Measuring length — read the scale at eye level, perpendicular to the ruler, to avoid parallax error.',
    `<svg viewBox="0 0 360 120" width="360" height="120" role="img" aria-label="Measuring length with ruler">
      <rect x="40" y="70" width="280" height="16" fill="#fef3c7" stroke="#ca8a04"/>
      <line x1="60" y1="70" x2="60" y2="86" stroke="#92400e"/>
      <line x1="160" y1="70" x2="160" y2="86" stroke="#92400e"/>
      <line x1="260" y1="70" x2="260" y2="86" stroke="#92400e"/>
      <rect x="120" y="55" width="80" height="30" fill="#dbeafe" stroke="#2563eb" opacity="0.8"/>
      <line x1="200" y1="30" x2="200" y2="55" stroke="#64748b" stroke-dasharray="3 3"/>
      <circle cx="200" cy="25" r="5" fill="#64748b"/>
      <text x="200" y="15" text-anchor="middle" font-size="10" fill="#64748b">eye perpendicular to scale</text>
    </svg>`,
  ),

  'measure-mass': diagramWrap(
    'Measuring mass — use a balance/electronic scale; mass is in kilograms (kg).',
    `<svg viewBox="0 0 280 160" width="280" height="160" role="img" aria-label="Measuring mass">
      <rect x="60" y="100" width="160" height="12" rx="2" fill="#64748b"/>
      <rect x="90" y="60" width="100" height="40" rx="6" fill="#f1f5f9" stroke="#64748b"/>
      <text x="140" y="85" text-anchor="middle" font-size="14" fill="#334155">0.50 kg</text>
      <rect x="115" y="112" width="50" height="20" rx="4" fill="#dbeafe" stroke="#2563eb"/>
      <text x="140" y="145" text-anchor="middle" font-size="10" fill="#475569">electronic balance</text>
    </svg>`,
  ),

  'momentum-vector': diagramWrap(
    'Momentum is a vector — $p = mv$ in the direction of velocity. Larger mass or speed means larger momentum.',
    `<svg viewBox="0 0 440 160" width="440" height="160" role="img" aria-label="Momentum vector diagram">
      <rect x="30" y="55" width="50" height="50" rx="4" fill="#dbeafe" stroke="#2563eb"/>
      <text x="55" y="85" text-anchor="middle" font-size="11" fill="#1e3a8a">m</text>
      <line x1="90" y1="80" x2="200" y2="80" stroke="#2563eb" stroke-width="3" marker-end="url(#mv)"/>
      <text x="145" y="72" text-anchor="middle" font-size="11" fill="#2563eb">v</text>
      <line x1="210" y1="80" x2="340" y2="80" stroke="#dc2626" stroke-width="4" marker-end="url(#mp)"/>
      <text x="275" y="72" text-anchor="middle" font-size="12" fill="#dc2626" font-weight="600">p = mv</text>
      <text x="55" y="130" text-anchor="middle" font-size="10" fill="#64748b">object</text>
      <defs>
        <marker id="mv" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker>
        <marker id="mp" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/></marker>
      </defs>
    </svg>`,
  ),

  'wave-displacement': diagramWrap(
    'Displacement–distance graph — wavelength λ is crest-to-crest distance; amplitude A is maximum displacement from the rest line.',
    `<svg viewBox="0 0 460 200" width="460" height="200" role="img" aria-label="Wave displacement distance graph">
      <line x1="50" y1="100" x2="420" y2="100" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <text x="235" y="188" text-anchor="middle" font-size="11" fill="#475569">Distance</text>
      <text x="16" y="100" transform="rotate(-90 16 100)" text-anchor="middle" font-size="11" fill="#475569">Displacement</text>
      <path d="${WAVE_G.path}" fill="none" stroke="#2563eb" stroke-width="2.5"/>
      <line x1="68" y1="100" x2="68" y2="${WAVE_G.crest}" stroke="#dc2626" stroke-width="2"/>
      <line x1="64" y1="100" x2="72" y2="100" stroke="#dc2626" stroke-width="2"/>
      <line x1="64" y1="${WAVE_G.crest}" x2="72" y2="${WAVE_G.crest}" stroke="#dc2626" stroke-width="2"/>
      <line x1="${WAVE_G.crest1}" y1="${WAVE_G.crest}" x2="${WAVE_G.crest2}" y2="${WAVE_G.crest}" stroke="#16a34a" stroke-width="2"/>
      <line x1="80" y1="51" x2="80" y2="59" stroke="#16a34a" stroke-width="2"/>
      <line x1="140" y1="51" x2="140" y2="59" stroke="#16a34a" stroke-width="2"/>
      <text x="110" y="44" text-anchor="middle" font-size="12" fill="#16a34a" font-weight="600">λ</text>
      <text x="76" y="${WAVE_G.crest - 6}" font-size="12" fill="#dc2626" font-weight="600">A</text>
    </svg>`,
  ),

  'wave-displacement-time': diagramWrap(
    'Displacement–time graph — period T is time for one complete oscillation; amplitude A is maximum displacement from the rest line.',
    `<svg viewBox="0 0 460 200" width="460" height="200" role="img" aria-label="Wave displacement time graph">
      <line x1="50" y1="100" x2="420" y2="100" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <text x="235" y="188" text-anchor="middle" font-size="11" fill="#475569">Time</text>
      <text x="16" y="100" transform="rotate(-90 16 100)" text-anchor="middle" font-size="11" fill="#475569">Displacement</text>
      <path d="${WAVE_G.path}" fill="none" stroke="#7c3aed" stroke-width="2.5"/>
      <line x1="68" y1="100" x2="68" y2="${WAVE_G.crest}" stroke="#dc2626" stroke-width="2"/>
      <line x1="64" y1="100" x2="72" y2="100" stroke="#dc2626" stroke-width="2"/>
      <line x1="64" y1="${WAVE_G.crest}" x2="72" y2="${WAVE_G.crest}" stroke="#dc2626" stroke-width="2"/>
      <line x1="${WAVE_G.crest1}" y1="${WAVE_G.crest}" x2="${WAVE_G.crest2}" y2="${WAVE_G.crest}" stroke="#16a34a" stroke-width="2"/>
      <line x1="80" y1="51" x2="80" y2="59" stroke="#16a34a" stroke-width="2"/>
      <line x1="140" y1="51" x2="140" y2="59" stroke="#16a34a" stroke-width="2"/>
      <text x="110" y="44" text-anchor="middle" font-size="12" fill="#16a34a" font-weight="600">T</text>
      <text x="76" y="${WAVE_G.crest - 6}" font-size="12" fill="#dc2626" font-weight="600">A</text>
    </svg>`,
  ),

  'geiger-setup': diagramWrap(
    'Radiation detection — Geiger–Müller tube connected to a counter records ionising events.',
    `<svg viewBox="0 0 420 140" width="420" height="140" role="img" aria-label="Geiger counter setup">
      <rect x="40" y="50" width="120" height="40" rx="8" fill="#dbeafe" stroke="#2563eb"/>
      <text x="100" y="75" text-anchor="middle" font-size="11" fill="#1e3a8a">G-M tube</text>
      <rect x="220" y="45" width="140" height="50" rx="8" fill="#f1f5f9" stroke="#64748b"/>
      <text x="290" y="75" text-anchor="middle" font-size="11" fill="#334155">Counter</text>
      <line x1="160" y1="70" x2="220" y2="70" stroke="#334155" stroke-width="2"/>
      <circle cx="100" cy="35" r="12" fill="#fef08a" stroke="#ca8a04"/>
      <text x="100" y="20" text-anchor="middle" font-size="10" fill="#854d0e">source</text>
    </svg>`,
  ),

  'spring-extension': diagramWrap(
    'Load–extension graph — straight line through origin (Hooke\'s law) until the limit of proportionality; then the graph curves.',
    `<svg viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Load extension graph">
      <line x1="55" y1="195" x2="400" y2="195" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="195" x2="55" y2="25" stroke="#64748b" stroke-width="1.5"/>
      <text x="230" y="218" text-anchor="middle" font-size="12" fill="#475569">Extension</text>
      <text x="20" y="110" transform="rotate(-90 20 110)" text-anchor="middle" font-size="12" fill="#475569">Load / Force</text>
      <line x1="65" y1="195" x2="200" y2="70" stroke="#2563eb" stroke-width="2.5"/>
      <path d="M200 70 Q260 55 340 45" fill="none" stroke="#dc2626" stroke-width="2.5"/>
      <line x1="200" y1="70" x2="200" y2="195" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <text x="130" y="120" font-size="10" fill="#2563eb">Hooke's law region</text>
      <text x="280" y="50" font-size="10" fill="#dc2626">limit of proportionality</text>
    </svg>`,
  ),

  'free-fall-graph': diagramWrap(
    'Velocity–time for free fall in a vacuum — straight line through origin; gradient = g ≈ 9.8 m/s².',
    `<svg viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Free fall velocity time graph">
      <line x1="55" y1="195" x2="400" y2="195" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="195" x2="55" y2="25" stroke="#64748b" stroke-width="1.5"/>
      <text x="230" y="218" text-anchor="middle" font-size="12" fill="#475569">Time</text>
      <text x="20" y="110" transform="rotate(-90 20 110)" text-anchor="middle" font-size="12" fill="#475569">Velocity</text>
      <polygon fill="rgba(220,38,38,0.12)" stroke="none" points="65,195 340,55 340,195"/>
      <line x1="65" y1="195" x2="340" y2="55" stroke="#dc2626" stroke-width="2.5"/>
      <text x="180" y="110" font-size="11" fill="#dc2626">gradient = g</text>
      <text x="280" y="175" font-size="10" fill="#2563eb">area = height fallen</text>
    </svg>`,
  ),

  'terminal-velocity-graph': diagramWrap(
    'Velocity–time with air resistance — gradient decreases as air resistance builds, then becomes horizontal at terminal velocity (weight = air resistance; acceleration = 0).',
    `<svg viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Terminal velocity graph">
      <line x1="55" y1="195" x2="400" y2="195" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="195" x2="55" y2="25" stroke="#64748b" stroke-width="1.5"/>
      <text x="230" y="218" text-anchor="middle" font-size="12" fill="#475569">Time</text>
      <text x="20" y="110" transform="rotate(-90 20 110)" text-anchor="middle" font-size="12" fill="#475569">Velocity</text>
      <path d="M65 195 C95 155 125 115 155 92 C185 72 215 62 250 56 C285 52 310 50 330 49" fill="none" stroke="#2563eb" stroke-width="2.5"/>
      <line x1="330" y1="49" x2="360" y2="49" stroke="#2563eb" stroke-width="2.5"/>
      <line x1="95" y1="195" x2="155" y2="92" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="155" y1="92" x2="250" y2="56" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 3"/>
      <text x="280" y="42" font-size="10" fill="#2563eb">terminal velocity</text>
      <text x="100" y="165" font-size="10" fill="#64748b">steep gradient → slowing increase</text>
      <text x="280" y="65" font-size="9" fill="#64748b">a = 0</text>
    </svg>`,
  ),

  'cg-stability': diagramWrap(
    'Stability — stable: CG rises when tilted (weight line stays inside base); unstable: CG drops and weight line falls outside base.',
    `<svg viewBox="0 0 420 160" width="420" height="160" role="img" aria-label="Centre of gravity and stability">
      <rect x="40" y="110" width="120" height="12" fill="#64748b"/>
      <rect x="70" y="70" width="60" height="40" fill="#dbeafe" stroke="#2563eb"/>
      <circle cx="100" cy="90" r="4" fill="#dc2626"/>
      <text x="100" y="58" text-anchor="middle" font-size="9" fill="#64748b">CG</text>
      <line x1="100" y1="94" x2="100" y2="122" stroke="#dc2626" stroke-width="1.5"/>
      <text x="100" y="145" text-anchor="middle" font-size="10" fill="#334155">stable</text>
      <rect x="260" y="110" width="120" height="12" fill="#64748b"/>
      <rect x="310" y="55" width="60" height="55" fill="#dbeafe" stroke="#2563eb" transform="rotate(18 340 82)"/>
      <circle cx="352" cy="68" r="4" fill="#dc2626"/>
      <line x1="352" y1="72" x2="370" y2="122" stroke="#dc2626" stroke-width="1.5"/>
      <text x="320" y="145" text-anchor="middle" font-size="10" fill="#334155">unstable (topples)</text>
    </svg>`,
  ),

  'collision-diagram': diagramWrap(
    'Collision diagram — masses and velocities before impact ($u$) and after ($v$); total momentum is conserved.',
    `<svg viewBox="0 0 440 200" width="440" height="200" role="img" aria-label="Collision before and after">
      <text x="220" y="22" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">Before collision</text>
      <rect x="50" y="48" width="48" height="36" rx="4" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
      <text x="74" y="70" text-anchor="middle" font-size="10" fill="#1e3a8a">m₁</text>
      <line x1="102" y1="66" x2="168" y2="66" stroke="#2563eb" stroke-width="2.5" marker-end="url(#cu53)"/>
      <text x="135" y="58" text-anchor="middle" font-size="10" fill="#2563eb">u₁</text>
      <rect x="175" y="48" width="48" height="36" rx="4" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
      <text x="199" y="70" text-anchor="middle" font-size="10" fill="#166534">m₂</text>
      <line x1="227" y1="66" x2="275" y2="66" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/>
      <text x="251" y="58" text-anchor="middle" font-size="9" fill="#64748b">u₂ = 0</text>
      <line x1="223" y1="48" x2="223" y2="90" stroke="#dc2626" stroke-width="1" stroke-dasharray="3 2"/>
      <text x="223" y="100" text-anchor="middle" font-size="8" fill="#dc2626">contact</text>
      <line x1="40" y1="108" x2="400" y2="108" stroke="#cbd5e1" stroke-width="1"/>
      <text x="220" y="128" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">After collision</text>
      <rect x="70" y="140" width="48" height="36" rx="4" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
      <text x="94" y="162" text-anchor="middle" font-size="10" fill="#1e3a8a">m₁</text>
      <line x1="122" y1="158" x2="175" y2="158" stroke="#dc2626" stroke-width="2.5" marker-end="url(#cv53)"/>
      <text x="148" y="150" text-anchor="middle" font-size="10" fill="#dc2626">v₁</text>
      <rect x="250" y="140" width="48" height="36" rx="4" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
      <text x="274" y="162" text-anchor="middle" font-size="10" fill="#166534">m₂</text>
      <line x1="302" y1="158" x2="365" y2="158" stroke="#dc2626" stroke-width="2.5" marker-end="url(#cv53)"/>
      <text x="333" y="150" text-anchor="middle" font-size="10" fill="#dc2626">v₂</text>
      <text x="220" y="192" text-anchor="middle" font-size="9" fill="#64748b">m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂</text>
      <defs>
        <marker id="cu53" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker>
        <marker id="cv53" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/></marker>
      </defs>
    </svg>`,
  ),

  'newtons-cradle': diagramWrap(
    "Newton's cradle — momentum is transferred through stationary balls; the last ball swings out with the same speed.",
    `<svg viewBox="0 0 440 200" width="440" height="200" role="img" aria-label="Newton's cradle">
      <line x1="30" y1="30" x2="410" y2="30" stroke="#64748b" stroke-width="3"/>
      <line x1="80" y1="30" x2="80" y2="95" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="140" y1="30" x2="140" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="200" y1="30" x2="200" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="260" y1="30" x2="260" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="320" y1="30" x2="320" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="380" y1="30" x2="380" y2="95" stroke="#94a3b8" stroke-width="1.5"/>
      <circle cx="80" cy="108" r="22" fill="#2563eb" stroke="#1e40af" stroke-width="1.5"/>
      <text x="80" y="113" text-anchor="middle" font-size="10" fill="#fff" font-weight="600">A</text>
      <circle cx="140" cy="88" r="22" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
      <text x="140" y="93" text-anchor="middle" font-size="10" fill="#334155">B</text>
      <circle cx="200" cy="88" r="22" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
      <text x="200" y="93" text-anchor="middle" font-size="10" fill="#334155">C</text>
      <circle cx="260" cy="88" r="22" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
      <text x="260" y="93" text-anchor="middle" font-size="10" fill="#334155">D</text>
      <circle cx="320" cy="88" r="22" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
      <text x="320" y="93" text-anchor="middle" font-size="10" fill="#334155">E</text>
      <circle cx="380" cy="108" r="22" fill="#16a34a" stroke="#15803d" stroke-width="1.5"/>
      <text x="380" y="113" text-anchor="middle" font-size="10" fill="#fff" font-weight="600">F</text>
      <path d="M80 108 Q55 108 55 140" fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#nc-arr)"/>
      <path d="M380 108 Q405 108 405 140" fill="none" stroke="#16a34a" stroke-width="2" marker-end="url(#nc-arr2)"/>
      <text x="55" y="158" font-size="9" fill="#2563eb">swings in</text>
      <text x="405" y="158" text-anchor="end" font-size="9" fill="#16a34a">swings out</text>
      <text x="220" y="182" text-anchor="middle" font-size="10" fill="#475569">momentum transferred A → F; total momentum conserved</text>
      <defs>
        <marker id="nc-arr" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker>
        <marker id="nc-arr2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#16a34a"/></marker>
      </defs>
    </svg>`,
  ),

  'pressure-depth': diagramWrap(
    'Pressure in a liquid increases with depth — p = ρgh; same depth gives same pressure.',
    `<svg viewBox="0 0 280 220" width="280" height="220" role="img" aria-label="Pressure in liquid">
      <rect x="80" y="40" width="120" height="160" fill="#bfdbfe" stroke="#2563eb" opacity="0.5"/>
      <line x1="80" y1="100" x2="200" y2="100" stroke="#64748b" stroke-dasharray="4 3"/>
      <line x1="80" y1="160" x2="200" y2="160" stroke="#64748b" stroke-dasharray="4 3"/>
      <text x="210" y="104" font-size="10" fill="#334155">p₁</text>
      <text x="210" y="164" font-size="10" fill="#334155">p₂ &gt; p₁</text>
      <text x="140" y="30" text-anchor="middle" font-size="11" fill="#334155">surface</text>
      <text x="140" y="215" text-anchor="middle" font-size="10" fill="#475569">pressure increases with depth</text>
    </svg>`,
  ),

  'half-life-curve': diagramWrap(
    'Radioactive decay — activity (or count rate) halves every half-life; curve never reaches zero.',
    `<svg viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Half life decay curve">
      <line x1="55" y1="195" x2="400" y2="195" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="195" x2="55" y2="25" stroke="#64748b" stroke-width="1.5"/>
      <text x="230" y="218" text-anchor="middle" font-size="12" fill="#475569">Time</text>
      <text x="20" y="110" transform="rotate(-90 20 110)" text-anchor="middle" font-size="12" fill="#475569">Count rate</text>
      <path d="M65 55 Q180 120 370 175" fill="none" stroke="#7c3aed" stroke-width="2.5"/>
      <line x1="140" y1="195" x2="140" y2="110" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <line x1="55" y1="110" x2="140" y2="110" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <text x="140" y="210" text-anchor="middle" font-size="10" fill="#64748b">1 half-life</text>
      <text x="70" y="105" font-size="10" fill="#64748b">½</text>
    </svg>`,
  ),

  'em-spectrum': diagramWrap(
    'Electromagnetic spectrum — frequency increases from radio → microwave → IR → visible → UV → X-ray → gamma.',
    `<svg viewBox="0 0 440 80" width="440" height="80" role="img" aria-label="EM spectrum">
      <rect x="20" y="30" width="50" height="30" fill="#fecaca"/><rect x="70" y="30" width="50" height="30" fill="#fed7aa"/>
      <rect x="120" y="30" width="50" height="30" fill="#fef08a"/><rect x="170" y="30" width="80" height="30" fill="#bbf7d0"/>
      <rect x="250" y="30" width="50" height="30" fill="#bfdbfe"/><rect x="300" y="30" width="50" height="30" fill="#ddd6fe"/>
      <rect x="350" y="30" width="70" height="30" fill="#e9d5ff"/>
      <text x="45" y="50" text-anchor="middle" font-size="8" fill="#334155">radio</text>
      <text x="210" y="50" text-anchor="middle" font-size="8" fill="#334155">visible</text>
      <text x="385" y="50" text-anchor="middle" font-size="8" fill="#334155">gamma</text>
      <text x="220" y="20" text-anchor="middle" font-size="11" fill="#334155">increasing frequency →</text>
    </svg>`,
  ),

  'reflection-ray': diagramWrap(
    'Law of reflection — angle of incidence i equals angle of reflection r (measured from the normal).',
    `<svg viewBox="0 0 320 180" width="320" height="180" role="img" aria-label="Reflection of light">
      <line x1="40" y1="120" x2="280" y2="120" stroke="#64748b" stroke-width="2"/>
      <line x1="160" y1="120" x2="160" y2="30" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <line x1="160" y1="120" x2="100" y2="50" stroke="#f59e0b" stroke-width="2.5"/>
      <line x1="160" y1="120" x2="220" y2="50" stroke="#2563eb" stroke-width="2.5"/>
      <text x="115" y="75" font-size="11" fill="#f59e0b">i</text>
      <text x="205" y="75" font-size="11" fill="#2563eb">r</text>
      <text x="165" y="25" font-size="10" fill="#64748b">normal</text>
    </svg>`,
  ),

  'refraction-ray': diagramWrap(
    'Refraction — ray bends towards the normal when entering a denser medium (slower speed).',
    `<svg viewBox="0 0 320 200" width="320" height="200" role="img" aria-label="Refraction of light">
      <rect x="40" y="120" width="240" height="60" fill="#dbeafe" opacity="0.6"/>
      <line x1="40" y1="120" x2="280" y2="120" stroke="#64748b" stroke-width="2"/>
      <line x1="160" y1="120" x2="160" y2="30" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <line x1="160" y1="120" x2="100" y2="45" stroke="#f59e0b" stroke-width="2.5"/>
      <line x1="160" y1="120" x2="195" y2="175" stroke="#2563eb" stroke-width="2.5"/>
      <text x="120" y="70" font-size="10" fill="#f59e0b">air</text>
      <text x="200" y="155" font-size="10" fill="#2563eb">glass</text>
    </svg>`,
  ),

  'energy-transfer': diagramWrap(
    'Energy stores — energy transfers from one store to another (e.g. kinetic → thermal via friction).',
    `<svg viewBox="0 0 420 120" width="420" height="120" role="img" aria-label="Energy transfer">
      <rect x="30" y="35" width="100" height="50" rx="8" fill="#dbeafe" stroke="#2563eb"/>
      <text x="80" y="65" text-anchor="middle" font-size="11" fill="#1e3a8a">Kinetic</text>
      <path d="M140 60 H260" stroke="#64748b" stroke-width="2" marker-end="url(#et)"/>
      <text x="200" y="50" text-anchor="middle" font-size="10" fill="#64748b">transfer</text>
      <rect x="270" y="35" width="120" height="50" rx="8" fill="#fecaca" stroke="#dc2626"/>
      <text x="330" y="65" text-anchor="middle" font-size="11" fill="#991b1b">Thermal</text>
      <defs><marker id="et" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker></defs>
    </svg>`,
  ),

  'sankey-light-bulb': diagramWrap(
    'Sankey diagram — electrical energy (100 J) splits into useful light energy (75 J, right) and wasted heat energy (25 J, downward). Branch height is proportional to energy.',
    buildSankey({
      ariaLabel: 'Sankey diagram for a light bulb',
      input: { label: 'Electrical input', value: 100, unit: 'J' },
      useful: { label: 'Light (useful)', value: 75, unit: 'J' },
      waste: { label: 'Heat (wasted)', value: 25, unit: 'J' },
      footer: 'Branch height ∝ energy — 75 J + 25 J = 100 J',
    }),
  ),

  'pendulum-energy': diagramWrap(
    'Pendulum energy — max GPE at the highest points (sides); max KE at the lowest point (centre bottom).',
    `<svg viewBox="0 0 420 200" width="420" height="200" role="img" aria-label="Pendulum energy stores">
      <line x1="150" y1="25" x2="270" y2="25" stroke="#64748b" stroke-width="3"/>
      <path d="M130 65 Q210 145 290 65" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="5 4"/>
      <line x1="210" y1="25" x2="130" y2="65" stroke="#7c3aed" stroke-width="2"/>
      <circle cx="130" cy="65" r="14" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <text x="55" y="68" font-size="11" fill="#7c3aed" font-weight="600">Max GPE</text>
      <line x1="210" y1="25" x2="210" y2="140" stroke="#2563eb" stroke-width="2.5"/>
      <circle cx="210" cy="140" r="14" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <text x="232" y="138" font-size="11" fill="#dc2626" font-weight="600">Max KE</text>
    </svg>`,
  ),

  'work-done': diagramWrap(
    'Work done — a constant force $F$ moves an object distance $s$ in the direction of the force; $W = Fs$.',
    `<svg viewBox="0 0 420 160" width="420" height="160" role="img" aria-label="Work done by a force">
      <rect x="60" y="80" width="80" height="50" rx="4" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <text x="100" y="110" text-anchor="middle" font-size="11" fill="#1e3a8a">box</text>
      <line x1="30" y1="105" x2="55" y2="105" stroke="#dc2626" stroke-width="3" marker-end="url(#wf)"/>
      <text x="42" y="95" font-size="12" fill="#dc2626" font-weight="600">F</text>
      <line x1="140" y1="105" x2="320" y2="105" stroke="#64748b" stroke-width="2" marker-end="url(#ws)"/>
      <text x="230" y="95" text-anchor="middle" font-size="12" fill="#334155">distance s</text>
      <text x="210" y="150" text-anchor="middle" font-size="11" fill="#475569">W = F × s</text>
      <defs>
        <marker id="wf" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/></marker>
        <marker id="ws" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker>
      </defs>
    </svg>`,
  ),

  'sankey-power-station': diagramWrap(
    'Sankey diagram for a power station — only 30% becomes useful electrical energy; the rest is wasted (mainly as thermal energy).',
    buildSankey({
      ariaLabel: 'Sankey diagram for a power station',
      input: { label: 'Fuel input', value: 2000, unit: 'MJ' },
      useful: { label: 'Electrical (useful)', value: 600, unit: 'MJ' },
      waste: { label: 'Thermal (wasted)', value: 1400, unit: 'MJ' },
      footer: 'Efficiency = 600 ÷ 2000 × 100% = 30%',
    }),
  ),

  'power-climbing': diagramWrap(
    'Power comparison — same weight climbing the same stairs: less time means greater power because the same energy is transferred faster.',
    `<svg viewBox="0 0 440 200" width="440" height="200" role="img" aria-label="Power comparison climbing stairs">
      <rect x="30" y="140" width="380" height="12" fill="#64748b"/>
      <rect x="50" y="60" width="30" height="80" fill="#dbeafe" stroke="#2563eb"/>
      <rect x="200" y="60" width="30" height="80" fill="#dbeafe" stroke="#2563eb"/>
      <circle cx="65" cy="50" r="14" fill="#fecaca" stroke="#dc2626"/>
      <circle cx="215" cy="50" r="14" fill="#bbf7d0" stroke="#16a34a"/>
      <text x="65" y="175" text-anchor="middle" font-size="10" fill="#334155">5 s — higher power</text>
      <text x="215" y="175" text-anchor="middle" font-size="10" fill="#334155">10 s — lower power</text>
      <text x="350" y="115" font-size="11" fill="#475569">Same work — P = W ÷ t</text>
    </svg>`,
  ),

  'pressure-solid': diagramWrap(
    'Pressure in solids — the same force over a smaller area gives higher pressure (e.g. a sharp heel vs. wide tractor tracks).',
    `<svg viewBox="0 0 440 200" width="440" height="200" role="img" aria-label="Pressure in solids comparison">
      <rect x="30" y="150" width="380" height="10" fill="#94a3b8"/>
      <rect x="80" y="130" width="8" height="20" fill="#dc2626" stroke="#991b1b"/>
      <line x1="84" y1="95" x2="84" y2="130" stroke="#334155" stroke-width="2" marker-end="url(#pf)"/>
      <text x="84" y="60" text-anchor="middle" font-size="11" fill="#dc2626" font-weight="600">High p (small A)</text>
      <rect x="280" y="125" width="80" height="25" fill="#2563eb" stroke="#1e40af" opacity="0.7"/>
      <line x1="320" y1="95" x2="320" y2="125" stroke="#334155" stroke-width="2" marker-end="url(#pf)"/>
      <text x="320" y="60" text-anchor="middle" font-size="11" fill="#16a34a" font-weight="600">Low p (large A)</text>
      <text x="220" y="185" text-anchor="middle" font-size="10" fill="#475569">Same force F — smaller area → greater pressure</text>
      <defs><marker id="pf" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#334155"/></marker></defs>
    </svg>`,
  ),

  'pressure-liquid-atm': diagramWrap(
    'Liquid pressure increases with depth — water jets shoot further from lower holes; pressure at the bottom is greatest.',
    `<svg viewBox="0 0 540 350" width="540" height="350" role="img" aria-label="Liquid pressure increasing with depth">
      <defs>
        <marker id="pj-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker>
        <marker id="pa-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker>
      </defs>
      <rect x="170" y="70" width="120" height="220" fill="#bfdbfe" stroke="#2563eb" stroke-width="2"/>
      <line x1="170" y1="70" x2="290" y2="70" stroke="#334155" stroke-width="2"/>
      <text x="230" y="58" text-anchor="middle" font-size="12" fill="#334155" font-weight="600">surface</text>
      <text x="318" y="58" font-size="12" fill="#7c3aed" font-weight="600">P<tspan baseline-shift="sub" font-size="9">atm</tspan></text>
      <line x1="135" y1="70" x2="135" y2="290" stroke="#dc2626" stroke-width="2"/>
      <line x1="129" y1="70" x2="141" y2="70" stroke="#dc2626" stroke-width="2"/>
      <line x1="129" y1="290" x2="141" y2="290" stroke="#dc2626" stroke-width="2"/>
      <text x="108" y="185" font-size="12" fill="#dc2626" font-weight="600" transform="rotate(-90 108 185)">depth h</text>
      <line x1="170" y1="130" x2="290" y2="130" stroke="#94a3b8" stroke-dasharray="5 4"/>
      <line x1="170" y1="195" x2="290" y2="195" stroke="#94a3b8" stroke-dasharray="5 4"/>
      <line x1="170" y1="260" x2="290" y2="260" stroke="#94a3b8" stroke-dasharray="5 4"/>
      <circle cx="170" cy="130" r="5" fill="#1e40af"/>
      <circle cx="170" cy="195" r="5" fill="#1e40af"/>
      <circle cx="170" cy="260" r="5" fill="#1e40af"/>
      <path d="M165 130 Q95 125 50 118" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#pj-arr)"/>
      <text x="48" y="108" font-size="11" fill="#2563eb">weak jet</text>
      <path d="M165 195 Q75 190 25 185" fill="none" stroke="#2563eb" stroke-width="3" marker-end="url(#pj-arr)"/>
      <text x="22" y="172" font-size="11" fill="#2563eb">medium jet</text>
      <path d="M165 260 Q55 255 8 250" fill="none" stroke="#2563eb" stroke-width="4" marker-end="url(#pj-arr)"/>
      <text x="8" y="238" font-size="11" fill="#2563eb" font-weight="600">strongest jet</text>
      <line x1="292" y1="130" x2="322" y2="130" stroke="#64748b" stroke-width="2.5" marker-end="url(#pa-arr)"/>
      <text x="400" y="134" text-anchor="middle" font-size="12" fill="#334155" font-weight="600">p₁ shallow</text>
      <line x1="292" y1="195" x2="332" y2="195" stroke="#64748b" stroke-width="3.5" marker-end="url(#pa-arr)"/>
      <text x="400" y="199" text-anchor="middle" font-size="12" fill="#334155" font-weight="600">p₂ deeper</text>
      <line x1="292" y1="260" x2="352" y2="260" stroke="#64748b" stroke-width="5.5" marker-end="url(#pa-arr)"/>
      <text x="400" y="264" text-anchor="middle" font-size="12" fill="#334155" font-weight="700">p₃ highest</text>
      <text x="270" y="325" text-anchor="middle" font-size="11" fill="#475569">Pressure and jet strength increase with depth</text>
    </svg>`,
  ),

  'gas-pt-graph': diagramWrap(
    'Pressure–temperature graph (constant volume) — pressure is directly proportional to temperature in Kelvin.',
    `<svg viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Pressure temperature graph">
      <line x1="55" y1="195" x2="400" y2="195" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="195" x2="55" y2="25" stroke="#64748b" stroke-width="1.5"/>
      <text x="230" y="218" text-anchor="middle" font-size="12" fill="#475569">Temperature / K</text>
      <text x="22" y="110" transform="rotate(-90 22 110)" text-anchor="middle" font-size="12" fill="#475569">Pressure</text>
      <line x1="55" y1="195" x2="340" y2="55" stroke="#2563eb" stroke-width="2.5"/>
      <text x="250" y="95" font-size="11" fill="#2563eb">p ∝ T (Kelvin)</text>
    </svg>`,
  ),

  'gas-pv-graph': diagramWrap(
    'Pressure–volume graph (constant temperature) — pressure decreases as volume increases (Boyle\'s law: inverse relationship).',
    `<svg viewBox="0 0 400 280" width="400" height="280" role="img" aria-label="Pressure volume graph">
      <rect width="400" height="280" fill="#faf8f5"/>
      <line x1="60" y1="240" x2="360" y2="240" stroke="#1a1a1a" stroke-width="2"/>
      <line x1="60" y1="240" x2="60" y2="40" stroke="#1a1a1a" stroke-width="2"/>
      <text x="210" y="268" text-anchor="middle" font-size="12" fill="#334155">Volume</text>
      <text x="22" y="140" transform="rotate(-90 22 140)" text-anchor="middle" font-size="12" fill="#334155">Pressure</text>
      <path d="M 72 48 C 110 50, 170 68, 230 105 S 330 195, 352 232" fill="none" stroke="#96301B" stroke-width="5" stroke-linecap="round"/>
    </svg>`,
  ),

  'gas-p-inv-v': diagramWrap(
    'Pressure vs $1/V$ — a straight line through the origin confirms inverse proportionality between $p$ and $V$.',
    `<svg viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Pressure against one over volume">
      <line x1="55" y1="195" x2="400" y2="195" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="195" x2="55" y2="25" stroke="#64748b" stroke-width="1.5"/>
      <text x="230" y="218" text-anchor="middle" font-size="12" fill="#475569">1 / Volume</text>
      <text x="22" y="110" transform="rotate(-90 22 110)" text-anchor="middle" font-size="12" fill="#475569">Pressure</text>
      <line x1="65" y1="185" x2="360" y2="50" stroke="#7c3aed" stroke-width="2.5"/>
      <text x="200" y="120" font-size="11" fill="#7c3aed">straight line → p ∝ 1/V</text>
    </svg>`,
  ),

  'gas-collisions': diagramWrap(
    'Gas pressure — particles collide randomly with container walls; many collisions per second produce a steady pressure.',
    `<svg viewBox="0 0 420 180" width="420" height="180" role="img" aria-label="Gas particle collisions">
      <rect x="60" y="30" width="300" height="120" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="4"/>
      <circle cx="120" cy="70" r="6" fill="#2563eb"/><line x1="120" y1="70" x2="145" y2="55" stroke="#2563eb" stroke-width="1.5"/>
      <circle cx="200" cy="90" r="6" fill="#f59e0b"/><line x1="200" y1="90" x2="230" y2="90" stroke="#f59e0b" stroke-width="1.5"/>
      <circle cx="320" cy="110" r="6" fill="#7c3aed"/><line x1="320" y1="110" x2="350" y2="110" stroke="#7c3aed" stroke-width="2"/>
      <text x="210" y="168" text-anchor="middle" font-size="10" fill="#475569">Random wall collisions create gas pressure</text>
    </svg>`,
  ),

  'ammeter-circuit': diagramWrap(
    'Measuring current — ammeter connected in series; conventional current enters the + terminal.',
    `<svg viewBox="0 0 380 170" width="380" height="170" role="img" aria-label="Circuit with ammeter in series">
      <g stroke="#334155" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 35 45 L 345 45 L 345 125 L 35 125 Z"/>
      </g>
      <rect x="68" y="41" width="18" height="8" fill="#fff"/>
      <line x1="72" y1="35" x2="72" y2="55" stroke="#334155" stroke-width="2"/>
      <line x1="82" y1="40" x2="82" y2="50" stroke="#334155" stroke-width="4"/>
      <text x="77" y="68" text-anchor="middle" font-size="8" fill="#64748b">cell</text>
      <circle cx="151" cy="45" r="13" stroke="#334155" stroke-width="2" fill="#fff"/>
      <line x1="143" y1="37" x2="159" y2="53" stroke="#334155" stroke-width="2"/>
      <line x1="159" y1="37" x2="143" y2="53" stroke="#334155" stroke-width="2"/>
      <text x="151" y="68" text-anchor="middle" font-size="8" fill="#64748b">lamp</text>
      <rect x="210" y="39" width="40" height="12" fill="#fff"/>
      <rect x="214" y="39" width="32" height="12" stroke="#334155" stroke-width="2" fill="none"/>
      <text x="230" y="68" text-anchor="middle" font-size="8" fill="#64748b">resistor</text>
      <circle cx="173" cy="125" r="13" stroke="#334155" stroke-width="2" fill="#fff"/>
      <text x="173" y="129" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">A</text>
      <text x="173" y="152" text-anchor="middle" font-size="8" fill="#64748b">ammeter in series</text>
      <text x="190" y="165" text-anchor="middle" font-size="10" fill="#475569">single loop — same current everywhere</text>
    </svg>`,
  ),

  'series-circuit': diagramWrap(
    'Series circuit — components in one loop; same current through each component.',
    `<svg viewBox="0 0 380 170" width="380" height="170" role="img" aria-label="Series circuit">
      <g stroke="#334155" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 35 45 L 345 45 L 345 125 L 35 125 Z"/>
      </g>
      <rect x="68" y="41" width="18" height="8" fill="#fff"/>
      <line x1="72" y1="35" x2="72" y2="55" stroke="#334155" stroke-width="2"/>
      <line x1="82" y1="40" x2="82" y2="50" stroke="#334155" stroke-width="4"/>
      <text x="77" y="68" text-anchor="middle" font-size="8" fill="#64748b">cell</text>
      <circle cx="151" cy="45" r="13" stroke="#334155" stroke-width="2" fill="#fff"/>
      <line x1="143" y1="37" x2="159" y2="53" stroke="#334155" stroke-width="2"/>
      <line x1="159" y1="37" x2="143" y2="53" stroke="#334155" stroke-width="2"/>
      <text x="151" y="68" text-anchor="middle" font-size="8" fill="#64748b">lamp</text>
      <rect x="210" y="39" width="40" height="12" fill="#fff"/>
      <rect x="214" y="39" width="32" height="12" stroke="#334155" stroke-width="2" fill="none"/>
      <text x="230" y="68" text-anchor="middle" font-size="8" fill="#64748b">resistor</text>
      <text x="190" y="152" text-anchor="middle" font-size="10" fill="#475569">one path — current is the same at every point</text>
    </svg>`,
  ),

  'parallel-circuit': diagramWrap(
    'Parallel circuit — current splits between branches; same p.d. across each branch.',
    `<svg viewBox="0 0 400 190" width="400" height="190" role="img" aria-label="Parallel circuit">
      <g stroke="#334155" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 45 50 L 355 50"/>
        <path d="M 45 50 L 45 78"/>
        <path d="M 45 88 L 45 140 L 355 140"/>
        <path d="M 355 50 L 355 140"/>
        <path d="M 170 50 L 170 88"/>
        <path d="M 170 112 L 170 140"/>
        <path d="M 260 50 L 260 88"/>
        <path d="M 260 112 L 260 140"/>
      </g>
      <line x1="38" y1="78" x2="52" y2="78" stroke="#334155" stroke-width="2"/>
      <line x1="38" y1="88" x2="52" y2="88" stroke="#334155" stroke-width="4"/>
      <text x="28" y="92" text-anchor="middle" font-size="8" fill="#64748b">cell</text>
      <circle cx="170" cy="100" r="12" stroke="#334155" stroke-width="2" fill="#fff"/>
      <line x1="163" y1="93" x2="177" y2="107" stroke="#334155" stroke-width="2"/>
      <line x1="177" y1="93" x2="163" y2="107" stroke="#334155" stroke-width="2"/>
      <text x="128" y="100" text-anchor="end" font-size="8" fill="#64748b">lamp 1</text>
      <circle cx="260" cy="100" r="12" stroke="#334155" stroke-width="2" fill="#fff"/>
      <line x1="253" y1="93" x2="267" y2="107" stroke="#334155" stroke-width="2"/>
      <line x1="267" y1="93" x2="253" y2="107" stroke="#334155" stroke-width="2"/>
      <text x="288" y="100" font-size="8" fill="#64748b">lamp 2</text>
      <text x="200" y="175" text-anchor="middle" font-size="10" fill="#475569">two branches — same p.d. across each lamp</text>
    </svg>`,
  ),

  'convection-cell': diagramWrap(
    'Convection current — warm air rises above the heat source, cools at the top, and sinks down the sides.',
    `<svg viewBox="0 0 440 260" width="440" height="260" role="img" aria-label="Convection current full cycle">
      <defs><marker id="cvRise" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ef4444"/></marker><marker id="cvSink" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker></defs>
      <rect x="80" y="35" width="200" height="190" fill="#f8fafc" stroke="#94a3b8" stroke-width="2" rx="4"/>
      <rect x="130" y="205" width="100" height="14" fill="#dc2626" rx="3"/>
      <line x1="180" y1="200" x2="180" y2="55" stroke="#ef4444" stroke-width="3" marker-end="url(#cvRise)"/>
      <text x="195" y="130" font-size="10" fill="#dc2626" font-weight="600">warm air rises</text>
      <path d="M110 55 Q95 130 110 200" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#cvSink)"/>
      <path d="M250 55 Q265 130 250 200" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#cvSink)"/>
      <text x="88" y="130" font-size="9" fill="#2563eb">cool air sinks</text>
    </svg>`,
  ),

  'convection-heater-ac': diagramWrap(
    'Heater vs air-con — hot air rises, cool air sinks. A floor heater warms air upward; a ceiling air-con pushes cool air down.',
    `<svg viewBox="0 0 480 250" width="480" height="250" role="img" aria-label="Convection with heater and air conditioner">
      <defs><marker id="cvR2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ef4444"/></marker><marker id="cvS2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker></defs>
      <text x="115" y="18" text-anchor="middle" font-size="11" font-weight="600">Heater on floor</text>
      <rect x="30" y="30" width="170" height="185" fill="#f8fafc" stroke="#94a3b8"/>
      <rect x="75" y="195" width="80" height="12" fill="#dc2626" rx="2"/>
      <line x1="115" y1="190" x2="115" y2="50" stroke="#ef4444" stroke-width="3" marker-end="url(#cvR2)"/>
      <line x1="55" y1="45" x2="55" y2="185" stroke="#2563eb" stroke-width="2.5" marker-end="url(#cvS2)"/>
      <text x="365" y="18" text-anchor="middle" font-size="11" font-weight="600">Air-con at ceiling</text>
      <rect x="280" y="30" width="170" height="185" fill="#f8fafc" stroke="#94a3b8"/>
      <rect x="325" y="38" width="80" height="12" fill="#38bdf8" rx="2"/>
      <line x1="365" y1="52" x2="365" y2="190" stroke="#2563eb" stroke-width="3" marker-end="url(#cvS2)"/>
      <line x1="310" y1="190" x2="310" y2="55" stroke="#ef4444" stroke-width="2.5" marker-end="url(#cvR2)"/>
    </svg>`,
  ),

  'magnetic-field': diagramWrap(
    'Magnetic field lines — leave the N pole and enter the S pole; arrows show direction N → S.',
    `<svg viewBox="0 0 320 160" width="320" height="160" role="img" aria-label="Magnetic field between poles">
      <defs><marker id="mf-ns" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#64748b"/></marker></defs>
      <rect x="40" y="50" width="30" height="60" fill="#fecaca" stroke="#dc2626"/>
      <text x="55" y="85" text-anchor="middle" font-size="12" fill="#991b1b">N</text>
      <rect x="250" y="50" width="30" height="60" fill="#bfdbfe" stroke="#2563eb"/>
      <text x="265" y="85" text-anchor="middle" font-size="12" fill="#1e3a8a">S</text>
      <path d="M75 60 Q160 30 245 60" fill="none" stroke="#64748b" stroke-width="1.5" marker-end="url(#mf-ns)"/>
      <path d="M75 80 Q160 80 245 80" fill="none" stroke="#64748b" stroke-width="1.5" marker-end="url(#mf-ns)"/>
      <path d="M75 100 Q160 130 245 100" fill="none" stroke="#64748b" stroke-width="1.5" marker-end="url(#mf-ns)"/>
    </svg>`,
  ),

  'sound-compression': diagramWrap(
    'Longitudinal sound wave — compressions (particles close) and rarefactions (particles far apart).',
    `<svg viewBox="0 0 420 100" width="420" height="100" role="img" aria-label="Sound compression rarefaction">
      <line x1="30" y1="50" x2="390" y2="50" stroke="#cbd5e1"/>
      <circle cx="60" cy="50" r="5" fill="#2563eb"/><circle cx="75" cy="50" r="5" fill="#2563eb"/><circle cx="90" cy="50" r="5" fill="#2563eb"/>
      <circle cx="140" cy="50" r="5" fill="#94a3b8"/><circle cx="175" cy="50" r="5" fill="#94a3b8"/>
      <circle cx="220" cy="50" r="5" fill="#2563eb"/><circle cx="235" cy="50" r="5" fill="#2563eb"/><circle cx="250" cy="50" r="5" fill="#2563eb"/>
      <circle cx="300" cy="50" r="5" fill="#94a3b8"/><circle cx="335" cy="50" r="5" fill="#94a3b8"/>
      <text x="75" y="30" font-size="10" fill="#2563eb">compression</text>
      <text x="300" y="30" font-size="10" fill="#64748b">rarefaction</text>
      <text x="210" y="85" text-anchor="middle" font-size="10" fill="#475569">direction of wave →</text>
    </svg>`,
  ),

  'transformer': diagramWrap(
    'Transformer — alternating p.d. in the primary induces p.d. in the secondary; $V_p/V_s = N_p/N_s$.',
    `<svg viewBox="0 0 320 180" width="320" height="180" role="img" aria-label="Transformer">
      <rect x="120" y="40" width="80" height="100" fill="#e2e8f0" stroke="#64748b" rx="4"/>
      <path d="M130 60 Q150 80 130 100 Q150 120 130 140" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M190 60 Q170 80 190 100 Q170 120 190 140" fill="none" stroke="#dc2626" stroke-width="2"/>
      <text x="80" y="95" text-anchor="middle" font-size="10" fill="#2563eb">primary</text>
      <text x="240" y="95" text-anchor="middle" font-size="10" fill="#dc2626">secondary</text>
      <text x="160" y="165" text-anchor="middle" font-size="10" fill="#475569">iron core</text>
    </svg>`,
  ),

  'nuclear-decay': diagramWrap(
    'Nuclear emission — alpha (2p + 2n), beta (neutron → proton + electron), gamma (no change in proton number).',
    `<svg viewBox="0 0 400 120" width="400" height="120" role="img" aria-label="Types of nuclear emission">
      <circle cx="70" cy="60" r="28" fill="#dbeafe" stroke="#2563eb"/>
      <text x="70" y="55" text-anchor="middle" font-size="9" fill="#1e3a8a">parent</text>
      <text x="70" y="68" text-anchor="middle" font-size="8" fill="#64748b">nucleus</text>
      <line x1="105" y1="60" x2="145" y2="60" stroke="#64748b" marker-end="url(#nd)"/>
      <circle cx="185" cy="60" r="22" fill="#bbf7d0" stroke="#16a34a"/>
      <text x="185" y="64" text-anchor="middle" font-size="9" fill="#166534">daughter</text>
      <text x="260" y="40" font-size="10" fill="#dc2626">α: −2 protons</text>
      <text x="260" y="60" font-size="10" fill="#2563eb">β: n → p + e⁻</text>
      <text x="260" y="80" font-size="10" fill="#7c3aed">γ: no Z change</text>
      <defs><marker id="nd" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker></defs>
    </svg>`,
  ),

  'radiation-penetration': diagramWrap(
    'Penetrating power — α stopped by paper; β by a few mm of aluminium; γ reduced by thick lead or concrete.',
    `<svg viewBox="0 0 480 200" width="480" height="200" role="img" aria-label="Penetration of alpha beta and gamma radiation">
      <circle cx="40" cy="100" r="14" fill="#fef08a" stroke="#ca8a04"/>
      <text x="40" y="104" text-anchor="middle" font-size="8" fill="#854d0e">source</text>
      <line x1="58" y1="55" x2="450" y2="55" stroke="#dc2626" stroke-width="2.5" marker-end="url(#pen-arr)"/>
      <text x="72" y="48" font-size="10" fill="#dc2626" font-weight="600">α</text>
      <rect x="120" y="42" width="6" height="26" fill="#f8fafc" stroke="#64748b"/>
      <text x="123" y="82" font-size="9" fill="#64748b">paper</text>
      <line x1="58" y1="100" x2="450" y2="100" stroke="#2563eb" stroke-width="2.5" marker-end="url(#pen-arr)"/>
      <text x="72" y="93" font-size="10" fill="#2563eb" font-weight="600">β</text>
      <rect x="200" y="86" width="8" height="28" fill="#cbd5e1" stroke="#64748b"/>
      <text x="204" y="128" font-size="9" fill="#64748b">Al</text>
      <line x1="58" y1="145" x2="450" y2="145" stroke="#7c3aed" stroke-width="2.5" marker-end="url(#pen-arr)"/>
      <text x="72" y="138" font-size="10" fill="#7c3aed" font-weight="600">γ</text>
      <rect x="320" y="128" width="14" height="34" fill="#64748b" stroke="#334155"/>
      <text x="327" y="176" font-size="9" fill="#64748b">lead</text>
      <defs><marker id="pen-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker></defs>
    </svg>`,
  ),

  'radiation-safety-shielding': diagramWrap(
    'Radiation safety — store sources in a lead box; handle at a distance with tongs; limit exposure time.',
    `<svg viewBox="0 0 480 200" width="480" height="200" role="img" aria-label="Radiation safety time distance shielding">
      <text x="120" y="22" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Shielding</text>
      <text x="360" y="22" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Distance</text>
      <rect x="60" y="50" width="120" height="90" fill="#64748b" stroke="#334155" stroke-width="2" rx="4"/>
      <rect x="72" y="62" width="96" height="66" fill="#94a3b8"/>
      <circle cx="120" cy="95" r="10" fill="#fef08a" stroke="#ca8a04"/>
      <text x="120" y="99" text-anchor="middle" font-size="8" fill="#854d0e">source</text>
      <text x="120" y="158" text-anchor="middle" font-size="9" fill="#64748b">lead storage box</text>
      <circle cx="300" cy="95" r="10" fill="#fef08a" stroke="#ca8a04"/>
      <line x1="310" y1="95" x2="390" y2="95" stroke="#334155" stroke-width="2"/>
      <rect x="390" y="88" width="24" height="14" fill="#fff" stroke="#334155"/>
      <line x1="402" y1="70" x2="402" y2="88" stroke="#334155" stroke-width="2"/>
      <text x="360" y="80" font-size="9" fill="#64748b">tongs</text>
      <text x="360" y="158" text-anchor="middle" font-size="9" fill="#64748b">keep distance — use long-handled tools</text>
      <text x="240" y="188" text-anchor="middle" font-size="10" fill="#475569">time · distance · shielding</text>
    </svg>`,
  ),

  'earth-day-night': diagramWrap(
    'Day and night — the Sun illuminates half the Earth at a time; rotation from west to east causes the apparent motion of the Sun.',
    `<svg viewBox="0 0 420 200" width="420" height="200" role="img" aria-label="Earth day and night cycle">
      <circle cx="55" cy="100" r="28" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
      <text x="55" y="104" text-anchor="middle" font-size="9" fill="#854d0e">Sun</text>
      <line x1="85" y1="100" x2="130" y2="100" stroke="#fbbf24" stroke-width="2" opacity="0.6"/>
      <circle cx="250" cy="100" r="55" fill="#2563eb" stroke="#1e40af" stroke-width="2"/>
      <path d="M250 45 A55 55 0 0 0 250 155 Z" fill="#1e3a8a"/>
      <line x1="250" y1="35" x2="250" y2="165" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 3"/>
      <text x="290" y="55" font-size="9" fill="#fef08a">day</text>
      <text x="210" y="145" font-size="9" fill="#cbd5e1">night</text>
      <text x="250" y="175" text-anchor="middle" font-size="9" fill="#64748b">axis</text>
      <path d="M195 130 A40 40 0 0 1 305 130" fill="none" stroke="#f59e0b" stroke-width="2" marker-end="url(#edn-arr)"/>
      <text x="250" y="128" text-anchor="middle" font-size="9" fill="#f59e0b">rotation (W → E)</text>
      <defs><marker id="edn-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b"/></marker></defs>
    </svg>`,
  ),

  'earth-seasons': diagramWrap(
    'Seasons — caused by the 23.5° tilt of Earth\'s axis, not by distance from the Sun.',
    `<svg viewBox="0 0 480 220" width="480" height="220" role="img" aria-label="Earth seasons and axial tilt">
      <circle cx="240" cy="110" r="22" fill="#fef08a" stroke="#ca8a04"/>
      <text x="240" y="114" text-anchor="middle" font-size="8" fill="#854d0e">Sun</text>
      <ellipse cx="240" cy="110" rx="170" ry="70" fill="none" stroke="#cbd5e1" stroke-dasharray="5 4"/>
      <g transform="translate(90,110)">
        <circle r="18" fill="#2563eb" stroke="#1e40af"/>
        <line x1="0" y1="-18" x2="8" y2="18" stroke="#94a3b8" stroke-width="2"/>
        <text x="0" y="38" text-anchor="middle" font-size="9" fill="#16a34a">summer (NH)</text>
        <text x="0" y="50" text-anchor="middle" font-size="8" fill="#64748b">tilted toward Sun</text>
      </g>
      <g transform="translate(390,110)">
        <circle r="18" fill="#2563eb" stroke="#1e40af"/>
        <line x1="0" y1="18" x2="-8" y2="-18" stroke="#94a3b8" stroke-width="2"/>
        <text x="0" y="38" text-anchor="middle" font-size="9" fill="#2563eb">winter (NH)</text>
        <text x="0" y="50" text-anchor="middle" font-size="8" fill="#64748b">tilted away</text>
      </g>
      <text x="240" y="200" text-anchor="middle" font-size="10" fill="#475569">axial tilt ≈ 23.5°</text>
    </svg>`,
  ),

  'solar-system-elliptical': diagramWrap(
    'Elliptical orbits — the Sun lies at one focus; comets move fastest when closest to the Sun (perihelion).',
    `<svg viewBox="0 0 480 220" width="480" height="220" role="img" aria-label="Elliptical orbit of a comet">
      <ellipse cx="260" cy="110" rx="180" ry="75" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <circle cx="130" cy="110" r="20" fill="#fef08a" stroke="#ca8a04"/>
      <text x="130" y="114" text-anchor="middle" font-size="8" fill="#854d0e">Sun</text>
      <text x="130" y="145" text-anchor="middle" font-size="8" fill="#64748b">focus</text>
      <circle cx="55" cy="110" r="6" fill="#cbd5e1" stroke="#64748b"/>
      <text x="55" y="95" text-anchor="middle" font-size="8" fill="#64748b">aphelion</text>
      <text x="55" y="130" text-anchor="middle" font-size="8" fill="#64748b">slow, max GPE</text>
      <circle cx="400" cy="110" r="6" fill="#f97316" stroke="#c2410c"/>
      <text x="400" y="95" text-anchor="middle" font-size="8" fill="#c2410c">perihelion</text>
      <text x="400" y="130" text-anchor="middle" font-size="8" fill="#c2410c">fast, max KE</text>
      <path d="M55 110 Q180 60 400 110 Q180 160 55 110" fill="none" stroke="#f97316" stroke-width="2" stroke-dasharray="6 4"/>
      <text x="240" y="200" text-anchor="middle" font-size="10" fill="#475569">GPE → KE as comet approaches the Sun</text>
    </svg>`,
  ),

  'sun-stability': diagramWrap(
    'Stable star — inward gravitational force is balanced by outward pressure from nuclear fusion.',
    `<svg viewBox="0 0 400 200" width="400" height="200" role="img" aria-label="Forces in a stable star">
      <circle cx="200" cy="100" r="55" fill="#fef08a" stroke="#f59e0b" stroke-width="2"/>
      <text x="200" y="96" text-anchor="middle" font-size="11" fill="#854d0e" font-weight="600">Sun</text>
      <text x="200" y="112" text-anchor="middle" font-size="8" fill="#854d0e">H → He fusion</text>
      <line x1="200" y1="38" x2="200" y2="10" stroke="#dc2626" stroke-width="2.5" marker-end="url(#sun-out)"/>
      <line x1="200" y1="162" x2="200" y2="190" stroke="#dc2626" stroke-width="2.5" marker-end="url(#sun-out)"/>
      <line x1="138" y1="100" x2="110" y2="100" stroke="#dc2626" stroke-width="2.5" marker-end="url(#sun-out)"/>
      <line x1="262" y1="100" x2="290" y2="100" stroke="#dc2626" stroke-width="2.5" marker-end="url(#sun-out)"/>
      <text x="200" y="8" text-anchor="middle" font-size="9" fill="#dc2626">radiation pressure</text>
      <line x1="200" y1="45" x2="200" y2="72" stroke="#2563eb" stroke-width="2.5" marker-end="url(#sun-in)"/>
      <line x1="200" y1="155" x2="200" y2="128" stroke="#2563eb" stroke-width="2.5" marker-end="url(#sun-in)"/>
      <line x1="145" y1="100" x2="172" y2="100" stroke="#2563eb" stroke-width="2.5" marker-end="url(#sun-in)"/>
      <line x1="255" y1="100" x2="228" y2="100" stroke="#2563eb" stroke-width="2.5" marker-end="url(#sun-in)"/>
      <text x="200" y="198" text-anchor="middle" font-size="9" fill="#2563eb">gravity (inward)</text>
      <defs>
        <marker id="sun-out" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/></marker>
        <marker id="sun-in" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker>
      </defs>
    </svg>`,
  ),

  'star-life-cycle': diagramWrap(
    'Star life cycles — average stars end as white dwarfs; massive stars may explode as supernovae and leave neutron stars or black holes.',
    `<svg viewBox="0 0 520 240" width="520" height="240" role="img" aria-label="Life cycles of average and massive stars">
      <text x="130" y="22" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Average star</text>
      <text x="390" y="22" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Massive star</text>
      <rect x="20" y="40" width="70" height="24" rx="4" fill="#e2e8f0" stroke="#64748b"/><text x="55" y="56" text-anchor="middle" font-size="8" fill="#334155">Nebula</text>
      <text x="95" y="56" font-size="10" fill="#64748b">→</text>
      <rect x="105" y="40" width="70" height="24" rx="4" fill="#fed7aa" stroke="#f97316"/><text x="140" y="56" text-anchor="middle" font-size="8" fill="#334155">Protostar</text>
      <text x="180" y="56" font-size="10" fill="#64748b">→</text>
      <rect x="190" y="40" width="70" height="24" rx="4" fill="#fef08a" stroke="#ca8a04"/><text x="225" y="56" text-anchor="middle" font-size="8" fill="#334155">Stable</text>
      <rect x="55" y="85" width="80" height="24" rx="4" fill="#fca5a5" stroke="#dc2626"/><text x="95" y="101" text-anchor="middle" font-size="8" fill="#334155">Red giant</text>
      <text x="95" y="78" text-anchor="middle" font-size="10" fill="#64748b">↓</text>
      <rect x="55" y="130" width="80" height="24" rx="4" fill="#ddd6fe" stroke="#7c3aed"/><text x="95" y="146" text-anchor="middle" font-size="8" fill="#334155">White dwarf</text>
      <rect x="300" y="40" width="70" height="24" rx="4" fill="#e2e8f0" stroke="#64748b"/><text x="335" y="56" text-anchor="middle" font-size="8" fill="#334155">Nebula</text>
      <text x="375" y="56" font-size="10" fill="#64748b">→</text>
      <rect x="385" y="40" width="70" height="24" rx="4" fill="#fed7aa" stroke="#f97316"/><text x="420" y="56" text-anchor="middle" font-size="8" fill="#334155">Protostar</text>
      <text x="460" y="56" font-size="10" fill="#64748b">→</text>
      <rect x="470" y="40" width="40" height="24" rx="4" fill="#fef08a" stroke="#ca8a04"/><text x="490" y="56" text-anchor="middle" font-size="7" fill="#334155">Massive</text>
      <rect x="315" y="85" width="90" height="24" rx="4" fill="#f87171" stroke="#b91c1c"/><text x="360" y="101" text-anchor="middle" font-size="8" fill="#334155">Red supergiant</text>
      <text x="360" y="78" text-anchor="middle" font-size="10" fill="#64748b">↓</text>
      <rect x="325" y="130" width="70" height="24" rx="4" fill="#fb923c" stroke="#ea580c"/><text x="360" y="146" text-anchor="middle" font-size="8" fill="#334155">Supernova</text>
      <text x="360" y="123" text-anchor="middle" font-size="10" fill="#64748b">↓</text>
      <rect x="290" y="175" width="70" height="24" rx="4" fill="#94a3b8" stroke="#475569"/><text x="325" y="191" text-anchor="middle" font-size="8" fill="#334155">Neutron star</text>
      <text x="360" y="191" text-anchor="middle" font-size="8" fill="#64748b">or</text>
      <rect x="380" y="175" width="70" height="24" rx="4" fill="#1e293b" stroke="#0f172a"/><text x="415" y="191" text-anchor="middle" font-size="8" fill="#f8fafc">Black hole</text>
    </svg>`,
  ),

  'hubble-graph': diagramWrap(
    'Hubble\'s law — recession speed v is proportional to distance d; gradient gives the Hubble constant H₀.',
    `<svg viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Hubble graph speed versus distance">
      <line x1="55" y1="195" x2="400" y2="195" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="195" x2="55" y2="25" stroke="#64748b" stroke-width="1.5"/>
      <text x="230" y="218" text-anchor="middle" font-size="12" fill="#475569">Distance d</text>
      <text x="20" y="110" transform="rotate(-90 20 110)" text-anchor="middle" font-size="12" fill="#475569">Speed v</text>
      <line x1="55" y1="195" x2="380" y2="45" stroke="#7c3aed" stroke-width="2.5"/>
      <circle cx="120" cy="155" r="5" fill="#7c3aed"/><circle cx="200" cy="115" r="5" fill="#7c3aed"/>
      <circle cx="280" cy="75" r="5" fill="#7c3aed"/><circle cx="360" cy="55" r="5" fill="#7c3aed"/>
      <text x="300" y="100" font-size="11" fill="#7c3aed" font-style="italic">v = H₀d</text>
      <text x="230" y="40" text-anchor="middle" font-size="10" fill="#64748b">galaxies farther away recede faster</text>
    </svg>`,
  ),

  'redshift-expansion': diagramWrap(
    'Redshift and expansion — distant galaxies move away; observed wavelengths increase (shift toward the red end of the spectrum).',
    `<svg viewBox="0 0 480 180" width="480" height="180" role="img" aria-label="Redshift and expanding universe">
      <circle cx="240" cy="90" r="8" fill="#fef08a" stroke="#ca8a04"/>
      <text x="240" y="115" text-anchor="middle" font-size="9" fill="#64748b">observer (Earth)</text>
      <circle cx="120" cy="60" r="14" fill="#bfdbfe" stroke="#2563eb"/>
      <circle cx="360" cy="60" r="14" fill="#bfdbfe" stroke="#2563eb"/>
      <circle cx="100" cy="130" r="10" fill="#ddd6fe" stroke="#7c3aed"/>
      <circle cx="380" cy="130" r="10" fill="#ddd6fe" stroke="#7c3aed"/>
      <line x1="135" y1="65" x2="225" y2="85" stroke="#dc2626" stroke-width="2" marker-end="url(#rs-arr)"/>
      <line x1="345" y1="65" x2="255" y2="85" stroke="#dc2626" stroke-width="2" marker-end="url(#rs-arr)"/>
      <line x1="115" y1="125" x2="230" y2="95" stroke="#dc2626" stroke-width="2" marker-end="url(#rs-arr)"/>
      <line x1="365" y1="125" x2="250" y2="95" stroke="#dc2626" stroke-width="2" marker-end="url(#rs-arr)"/>
      <text x="240" y="25" text-anchor="middle" font-size="10" fill="#475569">Universe expanding — galaxies recede</text>
      <text x="240" y="165" text-anchor="middle" font-size="10" fill="#dc2626">redshift: λ increases (lines shift toward red)</text>
      <defs><marker id="rs-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/></marker></defs>
    </svg>`,
  ),

  'expansion-order': diagramWrap(
    'Relative expansion — for the same temperature rise, gases expand most, then liquids, then solids.',
    `<svg viewBox="0 0 360 200" width="360" height="200" role="img" aria-label="Bar chart comparing thermal expansion">
      <text x="180" y="22" text-anchor="middle" font-size="11" fill="#64748b" font-weight="600">Relative volume increase (same ΔT)</text>
      <rect x="48" y="142" width="64" height="28" rx="6" fill="#64748b" opacity="0.85"/>
      <text x="80" y="188" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Solid</text>
      <rect x="148" y="118" width="64" height="52" rx="6" fill="#0ea5e9" opacity="0.85"/>
      <text x="180" y="188" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Liquid</text>
      <rect x="248" y="82" width="64" height="88" rx="6" fill="#f59e0b" opacity="0.85"/>
      <text x="280" y="188" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Gas</text>
      <text x="180" y="198" text-anchor="middle" font-size="10" fill="#94a3b8">Gases &gt; Liquids &gt; Solids</text>
    </svg>`,
  ),

  'ball-ring': diagramWrap(
    'Ball-and-ring — at room temperature the ball passes through the ring; after heating, thermal expansion stops it fitting.',
    `<svg viewBox="0 0 360 200" width="360" height="200" role="img" aria-label="Ball and ring before and after heating">
      <text x="90" y="24" text-anchor="middle" font-size="11" fill="#64748b" font-weight="600">Room temp</text>
      <text x="270" y="24" text-anchor="middle" font-size="11" fill="#64748b" font-weight="600">Ball heated</text>
      <circle cx="90" cy="95" r="28" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
      <circle cx="90" cy="95" r="38" fill="none" stroke="#cbd5e1" stroke-width="6"/>
      <text x="90" y="150" text-anchor="middle" font-size="10" fill="#059669" font-weight="600">Fits through ✓</text>
      <circle cx="270" cy="95" r="36" fill="#f97316" stroke="#c2410c" stroke-width="2"/>
      <circle cx="270" cy="95" r="38" fill="none" stroke="#cbd5e1" stroke-width="6"/>
      <line x1="248" y1="72" x2="292" y2="118" stroke="#dc2626" stroke-width="2.5"/>
      <text x="270" y="150" text-anchor="middle" font-size="10" fill="#dc2626" font-weight="600">Too large ✗</text>
    </svg>`,
  ),

  'expansion-gap': diagramWrap(
    'Expansion gap — deliberate spaces between rail sections allow safe expansion in hot weather without buckling.',
    `<svg viewBox="0 0 360 200" width="360" height="200" role="img" aria-label="Railway expansion gap">
      <rect x="20" y="120" width="130" height="12" rx="2" fill="#64748b"/>
      <rect x="210" y="120" width="130" height="12" rx="2" fill="#64748b"/>
      <rect x="148" y="116" width="24" height="20" rx="3" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" stroke-dasharray="4 3"/>
      <text x="160" y="108" text-anchor="middle" font-size="10" fill="#b45309" font-weight="600">Gap</text>
      <rect x="0" y="140" width="360" height="40" fill="#e2e8f0"/>
      <text x="180" y="178" text-anchor="middle" font-size="10" fill="#64748b">Rails can lengthen safely in hot weather</text>
    </svg>`,
  ),

  'shc-lab': diagramWrap(
    'SHC experiment — electrical energy $IVt$ heats the block; measure mass $m$ and temperature rise $\\Delta\\theta$ to find $c = IVt / (m\\Delta\\theta)$.',
    `<svg viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Specific heat capacity experiment">
      <rect x="120" y="60" width="160" height="100" rx="8" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
      <text x="200" y="52" text-anchor="middle" font-size="10" fill="#334155" font-weight="600">insulated metal block (mass m)</text>
      <rect x="145" y="80" width="22" height="60" rx="4" fill="#ef4444" stroke="#b91c1c"/>
      <text x="156" y="115" text-anchor="middle" font-size="9" fill="#fff" font-weight="700">heater</text>
      <line x1="200" y1="80" x2="200" y2="55" stroke="#2563eb" stroke-width="2"/>
      <circle cx="200" cy="50" r="7" fill="#2563eb" stroke="#1e40af"/>
      <text x="230" y="48" font-size="9" fill="#2563eb">thermometer</text>
      <rect x="60" y="175" width="80" height="40" rx="4" fill="#f1f5f9" stroke="#64748b"/>
      <text x="100" y="198" text-anchor="middle" font-size="9" fill="#334155">power supply</text>
      <text x="320" y="110" font-size="10" fill="#334155">ΔE = IVt = mcΔθ</text>
    </svg>`,
  ),

  'shc-comparison': diagramWrap(
    'High specific heat capacity (water) means a smaller temperature rise for the same energy — sand heats up faster.',
    `<svg viewBox="0 0 360 200" width="360" height="200" role="img" aria-label="Comparing heat capacities of water and sand">
      <text x="180" y="22" text-anchor="middle" font-size="11" fill="#64748b" font-weight="600">Same energy supplied — different temperature rise</text>
      <rect x="50" y="130" width="100" height="40" rx="4" fill="#0ea5e9" opacity="0.8"/>
      <text x="100" y="155" text-anchor="middle" font-size="11" fill="#fff" font-weight="600">Water</text>
      <text x="100" y="100" font-size="10" fill="#0ea5e9">Small Δθ (high c)</text>
      <rect x="210" y="60" width="100" height="110" rx="4" fill="#f59e0b" opacity="0.8"/>
      <text x="260" y="120" text-anchor="middle" font-size="11" fill="#fff" font-weight="600">Sand</text>
      <text x="260" y="48" font-size="10" fill="#f59e0b">Large Δθ (low c)</text>
    </svg>`,
  ),

  'particle-heating': diagramWrap(
    'Particle model — heating increases average kinetic energy; particles vibrate or move faster and push further apart (they do not grow in size).',
    `<svg viewBox="0 0 360 160" width="360" height="160" role="img" aria-label="Particles before and after heating">
      <text x="90" y="22" text-anchor="middle" font-size="11" fill="#64748b">Cold</text>
      <text x="270" y="22" text-anchor="middle" font-size="11" fill="#64748b">Heated</text>
      <circle cx="60" cy="80" r="6" fill="#64748b"/><circle cx="95" cy="75" r="6" fill="#64748b"/><circle cx="130" cy="90" r="6" fill="#64748b"/>
      <circle cx="75" cy="110" r="6" fill="#64748b"/><circle cx="110" cy="115" r="6" fill="#64748b"/>
      <circle cx="210" cy="80" r="6" fill="#f97316"/><circle cx="255" cy="70" r="6" fill="#f97316"/><circle cx="300" cy="95" r="6" fill="#f97316"/>
      <circle cx="230" cy="115" r="6" fill="#f97316"/><circle cx="275" cy="120" r="6" fill="#f97316"/>
      <text x="90" y="145" text-anchor="middle" font-size="10" fill="#64748b">close together</text>
      <text x="270" y="145" text-anchor="middle" font-size="10" fill="#f97316">further apart</text>
    </svg>`,
  ),

  'particle-states': diagramWrap(
    'Particle arrangement — solids: fixed lattice; liquids: close but sliding; gases: far apart and random.',
    `<svg viewBox="0 0 420 140" width="420" height="140" role="img" aria-label="Particle arrangement in three states">
      <text x="70" y="20" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Solid</text>
      <circle cx="40" cy="55" r="5" fill="#2563eb"/><circle cx="60" cy="55" r="5" fill="#2563eb"/><circle cx="80" cy="55" r="5" fill="#2563eb"/>
      <circle cx="40" cy="75" r="5" fill="#2563eb"/><circle cx="60" cy="75" r="5" fill="#2563eb"/><circle cx="80" cy="75" r="5" fill="#2563eb"/>
      <circle cx="40" cy="95" r="5" fill="#2563eb"/><circle cx="60" cy="95" r="5" fill="#2563eb"/><circle cx="80" cy="95" r="5" fill="#2563eb"/>
      <text x="70" y="125" text-anchor="middle" font-size="9" fill="#64748b">vibrate in place</text>
      <text x="210" y="20" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Liquid</text>
      <circle cx="175" cy="60" r="5" fill="#0ea5e9"/><circle cx="205" cy="75" r="5" fill="#0ea5e9"/><circle cx="235" cy="55" r="5" fill="#0ea5e9"/>
      <circle cx="190" cy="95" r="5" fill="#0ea5e9"/><circle cx="225" cy="100" r="5" fill="#0ea5e9"/>
      <text x="210" y="125" text-anchor="middle" font-size="9" fill="#64748b">slide past each other</text>
      <text x="350" y="20" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Gas</text>
      <circle cx="310" cy="50" r="5" fill="#f59e0b"/><circle cx="370" cy="70" r="5" fill="#f59e0b"/><circle cx="330" cy="100" r="5" fill="#f59e0b"/>
      <circle cx="385" cy="45" r="5" fill="#f59e0b"/><circle cx="295" cy="90" r="5" fill="#f59e0b"/>
      <text x="350" y="125" text-anchor="middle" font-size="9" fill="#64748b">fast random motion</text>
    </svg>`,
  ),

  'brownian-motion': diagramWrap(
    'Brownian motion — visible smoke particles are knocked randomly by invisible fast-moving air molecules.',
    `<svg viewBox="0 0 360 160" width="360" height="160" role="img" aria-label="Brownian motion in smoke cell">
      <rect x="40" y="30" width="280" height="100" rx="6" fill="#f8fafc" stroke="#cbd5e1"/>
      <circle cx="100" cy="70" r="8" fill="#64748b" opacity="0.7"/>
      <circle cx="180" cy="90" r="8" fill="#64748b" opacity="0.7"/>
      <circle cx="250" cy="60" r="8" fill="#64748b" opacity="0.7"/>
      <path d="M100 70 Q120 55 135 75 T160 65" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3 2"/>
      <path d="M180 90 Q200 75 215 95 T240 85" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3 2"/>
      <circle cx="130" cy="55" r="2" fill="#2563eb" opacity="0.5"/><circle cx="155" cy="80" r="2" fill="#2563eb" opacity="0.5"/>
      <circle cx="210" cy="70" r="2" fill="#2563eb" opacity="0.5"/><circle cx="230" cy="100" r="2" fill="#2563eb" opacity="0.5"/>
      <text x="180" y="150" text-anchor="middle" font-size="10" fill="#475569">large smoke dots jiggle; air molecules too small to see</text>
    </svg>`,
  ),

  'conduction-lattice': diagramWrap(
    'Conduction in metals — free electrons collide with lattice ions and transfer kinetic energy along the rod.',
    `<svg viewBox="0 0 360 120" width="360" height="120" role="img" aria-label="Conduction in a metal">
      <rect x="30" y="45" width="300" height="30" rx="4" fill="#e2e8f0" stroke="#64748b"/>
      <rect x="30" y="45" width="60" height="30" rx="4" fill="#fecaca" opacity="0.7"/>
      <circle cx="70" cy="60" r="4" fill="#dc2626"/><circle cx="110" cy="60" r="4" fill="#64748b"/><circle cx="150" cy="60" r="4" fill="#64748b"/>
      <circle cx="190" cy="60" r="4" fill="#64748b"/><circle cx="230" cy="60" r="4" fill="#64748b"/><circle cx="270" cy="60" r="4" fill="#64748b"/>
      <circle cx="95" cy="55" r="2" fill="#2563eb"/><circle cx="130" cy="65" r="2" fill="#2563eb"/><circle cx="175" cy="58" r="2" fill="#2563eb"/>
      <text x="60" y="40" font-size="9" fill="#dc2626">hot end</text>
      <text x="180" y="100" text-anchor="middle" font-size="10" fill="#475569">electrons carry energy →</text>
    </svg>`,
  ),

  'radiation-wave': diagramWrap(
    'Thermal radiation — infrared waves transfer energy without a medium; dark matt surfaces are good absorbers and emitters.',
    `<svg viewBox="0 0 360 140" width="360" height="140" role="img" aria-label="Thermal radiation">
      <rect x="40" y="50" width="50" height="40" fill="#1e293b" stroke="#334155"/>
      <text x="65" y="75" text-anchor="middle" font-size="9" fill="#fff">hot</text>
      <path d="M95 60 Q130 40 165 60" fill="none" stroke="#f97316" stroke-width="2"/>
      <path d="M95 70 Q130 70 165 70" fill="none" stroke="#f97316" stroke-width="2"/>
      <path d="M95 80 Q130 100 165 80" fill="none" stroke="#f97316" stroke-width="2"/>
      <text x="130" y="35" text-anchor="middle" font-size="10" fill="#f97316">IR waves</text>
      <rect x="200" y="50" width="120" height="40" fill="#f8fafc" stroke="#cbd5e1"/>
      <text x="260" y="75" text-anchor="middle" font-size="10" fill="#64748b">absorber (no contact needed)</text>
    </svg>`,
  ),

  'vi-graph': diagramWrap(
    'Ohmic conductor — $I$–$V$ graph is a straight line through the origin; gradient $= 1/R$.',
    `<svg viewBox="0 0 340 240" width="340" height="240" role="img" aria-label="I-V graph for ohmic conductor">
      <line x1="170" y1="30" x2="170" y2="210" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="50" y1="120" x2="310" y2="120" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="50" y1="210" x2="310" y2="210" stroke="#64748b" stroke-width="1.5"/>
      <line x1="50" y1="210" x2="50" y2="30" stroke="#64748b" stroke-width="1.5"/>
      <text x="180" y="232" text-anchor="middle" font-size="11" fill="#475569">Voltage V</text>
      <text x="22" y="120" transform="rotate(-90 22 120)" text-anchor="middle" font-size="11" fill="#475569">Current I</text>
      <line x1="50" y1="210" x2="280" y2="50" stroke="#2563eb" stroke-width="2.5"/>
      <text x="230" y="95" font-size="10" fill="#2563eb">gradient = 1/R</text>
      <text x="170" y="18" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Ohmic conductor</text>
    </svg>`,
  ),

  'vi-graph-filament': diagramWrap(
    'Filament lamp — S-shaped curve through the origin; gradient decreases as $V$ increases (resistance rises with temperature).',
    `<svg viewBox="0 0 340 240" width="340" height="240" role="img" aria-label="I-V graph for filament lamp">
      <line x1="170" y1="30" x2="170" y2="210" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="50" y1="120" x2="310" y2="120" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="50" y1="210" x2="310" y2="210" stroke="#64748b" stroke-width="1.5"/>
      <line x1="50" y1="210" x2="50" y2="30" stroke="#64748b" stroke-width="1.5"/>
      <text x="180" y="232" text-anchor="middle" font-size="11" fill="#475569">Voltage V</text>
      <text x="22" y="120" transform="rotate(-90 22 120)" text-anchor="middle" font-size="11" fill="#475569">Current I</text>
      <path d="M 50 210 C 90 195, 130 165, 170 130 S 250 75 280 58" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
      <path d="M 290 210 C 250 195, 210 165, 170 130 S 90 75 60 58" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
      <text x="255" y="70" font-size="9" fill="#f59e0b">levels off</text>
      <text x="170" y="18" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Filament lamp</text>
    </svg>`,
  ),

  'vi-graph-diode': diagramWrap(
    'Semiconductor diode — almost zero current below ~0.6 V (forward); flat at $I = 0$ for reverse bias (negative $V$).',
    `<svg viewBox="0 0 340 240" width="340" height="240" role="img" aria-label="I-V graph for semiconductor diode">
      <line x1="170" y1="30" x2="170" y2="210" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="50" y1="120" x2="310" y2="120" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="50" y1="210" x2="310" y2="210" stroke="#64748b" stroke-width="1.5"/>
      <line x1="50" y1="210" x2="50" y2="30" stroke="#64748b" stroke-width="1.5"/>
      <text x="180" y="232" text-anchor="middle" font-size="11" fill="#475569">Voltage V</text>
      <text x="22" y="120" transform="rotate(-90 22 120)" text-anchor="middle" font-size="11" fill="#475569">Current I</text>
      <line x1="50" y1="210" x2="198" y2="210" stroke="#7c3aed" stroke-width="2.5"/>
      <line x1="50" y1="210" x2="170" y2="210" stroke="#7c3aed" stroke-width="2.5"/>
      <path d="M 198 210 C 210 208, 218 195, 225 170 S 240 90 265 45" fill="none" stroke="#7c3aed" stroke-width="2.5"/>
      <line x1="198" y1="203" x2="198" y2="217" stroke="#64748b" stroke-width="1.5"/>
      <text x="198" y="225" text-anchor="middle" font-size="8" fill="#64748b">~0.6 V</text>
      <text x="95" y="200" font-size="9" fill="#7c3aed">reverse: I ≈ 0</text>
      <text x="245" y="55" font-size="9" fill="#7c3aed">forward: steep rise</text>
      <text x="170" y="18" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Semiconductor diode</text>
    </svg>`,
  ),

  'converging-lens': diagramWrap(
    'Converging lens — parallel rays refract to meet at the principal focus $F$.',
    `<svg viewBox="0 0 400 220" width="400" height="220" role="img" aria-label="Converging lens ray diagram">
      <defs><marker id="cl-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b"/></marker></defs>
      <line x1="20" y1="110" x2="380" y2="110" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <text x="200" y="205" text-anchor="middle" font-size="10" fill="#64748b">principal axis</text>
      <ellipse cx="200" cy="110" rx="14" ry="75" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5"/>
      <line x1="40" y1="70" x2="186" y2="70" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#cl-arr)"/>
      <line x1="186" y1="70" x2="310" y2="110" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#cl-arr)"/>
      <line x1="40" y1="150" x2="186" y2="150" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#cl-arr)"/>
      <line x1="186" y1="150" x2="310" y2="110" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#cl-arr)"/>
      <circle cx="310" cy="110" r="5" fill="#dc2626"/>
      <text x="318" y="106" font-size="12" fill="#dc2626" font-weight="600">F</text>
      <text x="55" y="62" font-size="10" fill="#64748b">parallel rays in</text>
      <text x="200" y="28" text-anchor="middle" font-size="12" fill="#2563eb" font-weight="600">converging lens</text>
    </svg>`,
  ),

  'diverging-lens': diagramWrap(
    'Diverging lens — parallel rays refract as if coming from the principal focus $F$ on the same side.',
    `<svg viewBox="0 0 400 220" width="400" height="220" role="img" aria-label="Diverging lens ray diagram">
      <defs><marker id="dl-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b"/></marker></defs>
      <line x1="20" y1="110" x2="380" y2="110" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <text x="200" y="205" text-anchor="middle" font-size="10" fill="#64748b">principal axis</text>
      <path d="M200 35 Q186 110 200 185 Q214 110 200 35 Z" fill="#e0e7ff" stroke="#7c3aed" stroke-width="2.5"/>
      <line x1="40" y1="75" x2="186" y2="75" stroke="#f59e0b" stroke-width="2.5"/>
      <line x1="186" y1="75" x2="360" y2="125" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#dl-arr)"/>
      <line x1="40" y1="145" x2="186" y2="145" stroke="#f59e0b" stroke-width="2.5"/>
      <line x1="186" y1="145" x2="360" y2="95" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#dl-arr)"/>
      <line x1="186" y1="75" x2="90" y2="110" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5 4"/>
      <line x1="186" y1="145" x2="90" y2="110" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5 4"/>
      <circle cx="90" cy="110" r="5" fill="#dc2626"/>
      <text x="68" y="106" font-size="12" fill="#dc2626" font-weight="600">F</text>
      <text x="42" y="62" font-size="10" fill="#64748b">parallel rays in</text>
      <text x="200" y="28" text-anchor="middle" font-size="12" fill="#7c3aed" font-weight="600">diverging lens</text>
    </svg>`,
  ),

  'wave-reflection-ripple': diagramWrap(
    'Reflection in a ripple tank — plane wavefronts bounce off a straight barrier with $i = r$.',
    `<svg viewBox="0 0 420 220" width="420" height="220" role="img" aria-label="Wave reflection in ripple tank">
      <rect x="0" y="0" width="420" height="220" fill="#eff6ff"/>
      <line x1="300" y1="30" x2="300" y2="190" stroke="#64748b" stroke-width="4"/>
      <text x="310" y="115" font-size="11" fill="#64748b" font-weight="600">barrier</text>
      <path d="M40 80 H260" stroke="#2563eb" stroke-width="2.5"/>
      <path d="M40 100 H260" stroke="#2563eb" stroke-width="2.5"/>
      <path d="M40 120 H260" stroke="#2563eb" stroke-width="2.5"/>
      <path d="M40 140 H260" stroke="#2563eb" stroke-width="2.5"/>
      <path d="M340 60 L300 100" stroke="#f59e0b" stroke-width="2.5"/>
      <path d="M340 80 L300 120" stroke="#f59e0b" stroke-width="2.5"/>
      <path d="M340 100 L300 140" stroke="#f59e0b" stroke-width="2.5"/>
      <path d="M340 120 L300 160" stroke="#f59e0b" stroke-width="2.5"/>
      <line x1="300" y1="100" x2="300" y2="40" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <text x="250" y="55" font-size="11" fill="#2563eb" font-weight="600">incident</text>
      <text x="350" y="55" font-size="11" fill="#f59e0b" font-weight="600">reflected</text>
      <text x="305" y="38" font-size="10" fill="#64748b">normal</text>
    </svg>`,
  ),

  'wave-refraction-ripple': diagramWrap(
    'Refraction in a ripple tank — waves slow in shallow water; wavelength decreases and wavefronts bend.',
    `<svg viewBox="0 0 420 220" width="420" height="220" role="img" aria-label="Wave refraction in ripple tank">
      <rect x="0" y="0" width="210" height="220" fill="#bfdbfe"/>
      <rect x="210" y="0" width="210" height="220" fill="#dbeafe"/>
      <text x="105" y="24" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="600">deep (faster)</text>
      <text x="315" y="24" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="600">shallow (slower)</text>
      <line x1="210" y1="30" x2="210" y2="190" stroke="#64748b" stroke-width="2" stroke-dasharray="6 4"/>
      <path d="M30 70 H190" stroke="#2563eb" stroke-width="2.5"/>
      <path d="M30 100 H190" stroke="#2563eb" stroke-width="2.5"/>
      <path d="M30 130 H190" stroke="#2563eb" stroke-width="2.5"/>
      <path d="M30 160 H190" stroke="#2563eb" stroke-width="2.5"/>
      <path d="M230 75 H370" stroke="#2563eb" stroke-width="2.5"/>
      <path d="M245 100 H370" stroke="#2563eb" stroke-width="2.5"/>
      <path d="M260 125 H370" stroke="#2563eb" stroke-width="2.5"/>
      <path d="M275 150 H370" stroke="#2563eb" stroke-width="2.5"/>
      <path d="M190 70 Q205 72 230 75" stroke="#2563eb" stroke-width="2.5" fill="none"/>
      <path d="M190 100 Q205 100 245 100" stroke="#2563eb" stroke-width="2.5" fill="none"/>
      <path d="M190 130 Q205 128 260 125" stroke="#2563eb" stroke-width="2.5" fill="none"/>
      <path d="M190 160 Q205 155 275 150" stroke="#2563eb" stroke-width="2.5" fill="none"/>
      <text x="300" y="200" text-anchor="middle" font-size="10" fill="#475569">shorter λ in shallow water</text>
    </svg>`,
  ),

  'wave-diffraction-ripple': diagramWrap(
    'Diffraction in a ripple tank — narrow gaps give large spreading; wide gaps give only slight edge bending. Wavelength λ is unchanged.',
    `<div class="enlight-wave-diffraction" role="img" aria-label="Wave diffraction wide and narrow gap">
      <div class="enlight-wave-diffraction__panel">
        <h4 class="enlight-wave-diffraction__title">Wide Gap — Small Diffraction Effect</h4>
        <svg viewBox="0 0 520 175" width="520" height="175" class="enlight-wave-diffraction__svg" aria-hidden="true">
          <defs>
            <marker id="wd-prop" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 Z" fill="#111827"/></marker>
            <clipPath id="wd-wide-clip"><rect x="205" y="42" width="310" height="112"/></clipPath>
          </defs>
          <rect x="0" y="32" width="520" height="140" fill="#f0fdf4" rx="8"/>
          <line x1="30" y1="48" x2="30" y2="148" stroke="#16a34a" stroke-width="2.5"/>
          <line x1="55" y1="48" x2="55" y2="148" stroke="#16a34a" stroke-width="2.5"/>
          <line x1="80" y1="48" x2="80" y2="148" stroke="#16a34a" stroke-width="2.5"/>
          <line x1="105" y1="48" x2="105" y2="148" stroke="#16a34a" stroke-width="2.5"/>
          <line x1="130" y1="48" x2="130" y2="148" stroke="#16a34a" stroke-width="2.5"/>
          <line x1="12" y1="98" x2="188" y2="98" stroke="#111827" stroke-width="3" marker-end="url(#wd-prop)"/>
          <rect x="195" y="42" width="10" height="112" fill="#86efac" stroke="#16a34a" stroke-width="1.5"/>
          <rect x="285" y="42" width="10" height="112" fill="#86efac" stroke="#16a34a" stroke-width="1.5"/>
          <g clip-path="url(#wd-wide-clip)">
            <line x1="295" y1="48" x2="295" y2="148" stroke="#16a34a" stroke-width="2.5"/>
            <line x1="320" y1="48" x2="320" y2="148" stroke="#16a34a" stroke-width="2.5"/>
            <line x1="345" y1="48" x2="345" y2="148" stroke="#16a34a" stroke-width="2.5"/>
            <line x1="370" y1="48" x2="370" y2="148" stroke="#16a34a" stroke-width="2.5"/>
            <line x1="395" y1="48" x2="395" y2="148" stroke="#16a34a" stroke-width="2.5"/>
            <line x1="420" y1="48" x2="420" y2="148" stroke="#16a34a" stroke-width="2.5"/>
            <line x1="445" y1="48" x2="445" y2="148" stroke="#16a34a" stroke-width="2.5"/>
            <line x1="470" y1="48" x2="470" y2="148" stroke="#16a34a" stroke-width="2.5"/>
          </g>
        </svg>
      </div>
      <div class="enlight-wave-diffraction__panel">
        <h4 class="enlight-wave-diffraction__title">Narrow Gap — Large Diffraction Effect</h4>
        <svg viewBox="0 0 520 175" width="520" height="175" class="enlight-wave-diffraction__svg" aria-hidden="true">
          <defs>
            <marker id="wd-prop2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 Z" fill="#111827"/></marker>
            <clipPath id="wd-narrow-clip"><rect x="210" y="42" width="305" height="112"/></clipPath>
          </defs>
          <rect x="0" y="32" width="520" height="140" fill="#eff6ff" rx="8"/>
          <line x1="30" y1="48" x2="30" y2="148" stroke="#2563eb" stroke-width="2.5"/>
          <line x1="55" y1="48" x2="55" y2="148" stroke="#2563eb" stroke-width="2.5"/>
          <line x1="80" y1="48" x2="80" y2="148" stroke="#2563eb" stroke-width="2.5"/>
          <line x1="105" y1="48" x2="105" y2="148" stroke="#2563eb" stroke-width="2.5"/>
          <line x1="130" y1="48" x2="130" y2="148" stroke="#2563eb" stroke-width="2.5"/>
          <line x1="12" y1="98" x2="188" y2="98" stroke="#111827" stroke-width="3" marker-end="url(#wd-prop2)"/>
          <g clip-path="url(#wd-narrow-clip)">
            <path d="M 215 73 A 25 25 0 0 1 215 123" fill="none" stroke="#f97316" stroke-width="2.5"/>
            <path d="M 215 48 A 50 50 0 0 1 215 148" fill="none" stroke="#f97316" stroke-width="2.5"/>
            <path d="M 215 23 A 75 75 0 0 1 215 173" fill="none" stroke="#f97316" stroke-width="2.5"/>
            <path d="M 215 -2 A 100 100 0 0 1 215 198" fill="none" stroke="#f97316" stroke-width="2.5"/>
            <path d="M 215 -27 A 125 125 0 0 1 215 223" fill="none" stroke="#f97316" stroke-width="2.5"/>
          </g>
          <rect x="200" y="42" width="10" height="112" fill="#86efac" stroke="#16a34a" stroke-width="1.5"/>
          <rect x="220" y="42" width="10" height="112" fill="#86efac" stroke="#16a34a" stroke-width="1.5"/>
          <text x="360" y="90" font-size="11" fill="#ea580c" font-weight="600">same λ (25 px)</text>
        </svg>
      </div>
    </div>`,
  ),

  'circuit-17-4': diagramWrap(
    'Series circuit with exam-standard symbols for a thermistor and LDR.',
    `<div class="enlight-circuit-symbols">
      <svg viewBox="0 0 380 170" width="380" height="170" role="img" aria-label="Series circuit">
        <g stroke="#334155" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M 35 45 L 345 45 L 345 125 L 35 125 Z"/>
        </g>
        <rect x="68" y="41" width="18" height="8" fill="#fff"/>
        <line x1="72" y1="35" x2="72" y2="55" stroke="#334155" stroke-width="2"/>
        <line x1="82" y1="40" x2="82" y2="50" stroke="#334155" stroke-width="4"/>
        <text x="77" y="68" text-anchor="middle" font-size="8" fill="#64748b">cell</text>
        <circle cx="151" cy="45" r="13" stroke="#334155" stroke-width="2" fill="#fff"/>
        <line x1="143" y1="37" x2="159" y2="53" stroke="#334155" stroke-width="2"/>
        <line x1="159" y1="37" x2="143" y2="53" stroke="#334155" stroke-width="2"/>
        <text x="151" y="68" text-anchor="middle" font-size="8" fill="#64748b">lamp</text>
        <rect x="210" y="39" width="40" height="12" fill="#fff"/>
        <rect x="214" y="39" width="32" height="12" stroke="#334155" stroke-width="2" fill="none"/>
        <text x="230" y="68" text-anchor="middle" font-size="8" fill="#64748b">resistor</text>
        <text x="190" y="152" text-anchor="middle" font-size="10" fill="#475569">one path — same current everywhere</text>
      </svg>
      <div class="enlight-circuit-symbols__row">
        <svg viewBox="0 0 100 70" width="100" height="70" aria-label="Thermistor symbol">
          <line x1="10" y1="35" x2="25" y2="35" stroke="#334155" stroke-width="2"/>
          <rect x="25" y="28" width="50" height="14" stroke="#334155" stroke-width="2" fill="#fff"/>
          <line x1="30" y1="42" x2="70" y2="28" stroke="#334155" stroke-width="2"/>
          <line x1="75" y1="35" x2="90" y2="35" stroke="#334155" stroke-width="2"/>
          <text x="50" y="58" text-anchor="middle" font-size="9" fill="#64748b">thermistor</text>
        </svg>
        <svg viewBox="0 0 110 70" width="110" height="70" aria-label="LDR symbol">
          <line x1="8" y1="35" x2="22" y2="35" stroke="#334155" stroke-width="2"/>
          <circle cx="55" cy="35" r="18" stroke="#334155" stroke-width="2" fill="#fff"/>
          <rect x="45" y="30" width="20" height="10" stroke="#334155" stroke-width="2" fill="#fff"/>
          <line x1="65" y1="35" x2="102" y2="35" stroke="#334155" stroke-width="2"/>
          <line x1="32" y1="18" x2="48" y2="30" stroke="#334155" stroke-width="1.8"/>
          <line x1="38" y1="12" x2="54" y2="24" stroke="#334155" stroke-width="1.8"/>
          <line x1="44" y1="6" x2="60" y2="18" stroke="#334155" stroke-width="1.8"/>
          <polygon points="48,30 56,30 52,24" fill="#334155"/>
          <polygon points="54,24 62,24 58,18" fill="#334155"/>
          <polygon points="60,18 68,18 64,12" fill="#334155"/>
          <text x="55" y="62" text-anchor="middle" font-size="9" fill="#64748b">LDR</text>
        </svg>
        <svg viewBox="0 0 100 70" width="100" height="70" aria-label="Fixed resistor symbol">
          <line x1="10" y1="35" x2="28" y2="35" stroke="#334155" stroke-width="2"/>
          <rect x="28" y="28" width="44" height="14" stroke="#334155" stroke-width="2" fill="#fff"/>
          <line x1="72" y1="35" x2="90" y2="35" stroke="#334155" stroke-width="2"/>
          <text x="50" y="58" text-anchor="middle" font-size="9" fill="#64748b">resistor</text>
        </svg>
      </div>
    </div>`,
  ),

  'circuit-17-5': diagramWrap(
    'Series circuit with exam-standard symbols for a fuse, switch, and earth connection.',
    `<div class="enlight-circuit-symbols">
      <svg viewBox="0 0 380 170" width="380" height="170" role="img" aria-label="Series circuit">
        <g stroke="#334155" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M 35 45 L 345 45 L 345 125 L 35 125 Z"/>
        </g>
        <rect x="68" y="41" width="18" height="8" fill="#fff"/>
        <line x1="72" y1="35" x2="72" y2="55" stroke="#334155" stroke-width="2"/>
        <line x1="82" y1="40" x2="82" y2="50" stroke="#334155" stroke-width="4"/>
        <text x="77" y="68" text-anchor="middle" font-size="8" fill="#64748b">cell</text>
        <circle cx="151" cy="45" r="13" stroke="#334155" stroke-width="2" fill="#fff"/>
        <line x1="143" y1="37" x2="159" y2="53" stroke="#334155" stroke-width="2"/>
        <line x1="159" y1="37" x2="143" y2="53" stroke="#334155" stroke-width="2"/>
        <text x="151" y="68" text-anchor="middle" font-size="8" fill="#64748b">lamp</text>
        <rect x="210" y="39" width="40" height="12" fill="#fff"/>
        <rect x="214" y="39" width="32" height="12" stroke="#334155" stroke-width="2" fill="none"/>
        <text x="230" y="68" text-anchor="middle" font-size="8" fill="#64748b">resistor</text>
        <text x="190" y="152" text-anchor="middle" font-size="10" fill="#475569">one path — same current everywhere</text>
      </svg>
      <div class="enlight-circuit-symbols__row">
        <svg viewBox="0 0 100 70" width="100" height="70" aria-label="Fuse symbol">
          <line x1="10" y1="35" x2="28" y2="35" stroke="#334155" stroke-width="2"/>
          <rect x="28" y="28" width="44" height="14" stroke="#334155" stroke-width="2" fill="#fff"/>
          <line x1="50" y1="31" x2="50" y2="39" stroke="#334155" stroke-width="1.5"/>
          <line x1="72" y1="35" x2="90" y2="35" stroke="#334155" stroke-width="2"/>
          <text x="50" y="58" text-anchor="middle" font-size="9" fill="#64748b">fuse</text>
        </svg>
        <svg viewBox="0 0 100 70" width="100" height="70" aria-label="Switch symbol">
          <line x1="10" y1="35" x2="30" y2="35" stroke="#334155" stroke-width="2"/>
          <circle cx="30" cy="35" r="3" fill="#334155"/>
          <line x1="30" y1="35" x2="68" y2="22" stroke="#334155" stroke-width="2"/>
          <circle cx="70" cy="35" r="3" fill="none" stroke="#334155" stroke-width="2"/>
          <line x1="70" y1="35" x2="90" y2="35" stroke="#334155" stroke-width="2"/>
          <text x="50" y="58" text-anchor="middle" font-size="9" fill="#64748b">switch</text>
        </svg>
        <svg viewBox="0 0 80 70" width="80" height="70" aria-label="Earth symbol">
          <line x1="40" y1="12" x2="40" y2="28" stroke="#334155" stroke-width="2"/>
          <line x1="22" y1="28" x2="58" y2="28" stroke="#334155" stroke-width="2.5"/>
          <line x1="28" y1="36" x2="52" y2="36" stroke="#334155" stroke-width="2.5"/>
          <line x1="34" y1="44" x2="46" y2="44" stroke="#334155" stroke-width="2.5"/>
          <text x="40" y="60" text-anchor="middle" font-size="9" fill="#64748b">earth</text>
        </svg>
      </div>
    </div>`,
  ),

  'dispersion-prism': diagramWrap(
    'Dispersion — white light splits into a spectrum because each colour refracts by a different amount.',
    `<svg viewBox="0 0 360 180" width="360" height="180" role="img" aria-label="Dispersion in a prism">
      <polygon points="160,40 220,140 100,140" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <line x1="40" y1="90" x2="155" y2="95" stroke="#64748b" stroke-width="2.5"/>
      <line x1="225" y1="100" x2="320" y2="70" stroke="#dc2626" stroke-width="2"/>
      <line x1="225" y1="105" x2="320" y2="95" stroke="#f59e0b" stroke-width="2"/>
      <line x1="225" y1="110" x2="320" y2="120" stroke="#2563eb" stroke-width="2"/>
      <line x1="225" y1="115" x2="320" y2="145" stroke="#7c3aed" stroke-width="2"/>
      <text x="50" y="80" font-size="10" fill="#64748b">white light</text>
      <text x="300" y="65" font-size="9" fill="#dc2626">red</text>
      <text x="300" y="150" font-size="9" fill="#7c3aed">violet</text>
    </svg>`,
  ),

  'echo-diagram': diagramWrap(
    'Echo — sound reflects from a surface; distance to obstacle = (speed × time) ÷ 2.',
    `<svg viewBox="0 0 360 160" width="360" height="160" role="img" aria-label="Echo diagram">
      <circle cx="80" cy="100" r="20" fill="#dbeafe" stroke="#2563eb"/>
      <text x="80" y="105" text-anchor="middle" font-size="9" fill="#1e3a8a">source</text>
      <rect x="280" y="40" width="20" height="100" fill="#94a3b8"/>
      <text x="290" y="155" text-anchor="middle" font-size="9" fill="#64748b">wall</text>
      <path d="M100 95 H260" stroke="#2563eb" stroke-width="2" marker-end="url(#echo)"/>
      <path d="M260 105 H100" stroke="#64748b" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#echo2)"/>
      <text x="180" y="85" text-anchor="middle" font-size="10" fill="#2563eb">outgoing</text>
      <text x="180" y="125" text-anchor="middle" font-size="10" fill="#64748b">echo returns</text>
      <defs>
        <marker id="echo" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker>
        <marker id="echo2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker>
      </defs>
    </svg>`,
  ),

  'bar-magnet': diagramWrap(
    'Bar magnet — field lines leave the N pole and enter the S pole; arrows show direction N → S.',
    `<svg viewBox="0 0 440 250" width="440" height="250" role="img" aria-label="Bar magnet field lines">
      <defs><marker id="bm-ns" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#6b7280"/></marker></defs>
      <text x="220" y="24" text-anchor="middle" font-size="15" fill="#374151" font-weight="600">Bar magnet</text>
      <rect x="128" y="112" width="92" height="36" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
      <text x="174" y="135" text-anchor="middle" font-size="16" fill="#ffffff" font-weight="700">N</text>
      <rect x="220" y="112" width="92" height="36" fill="#2563eb" stroke="#1e40af" stroke-width="1.5"/>
      <text x="266" y="135" text-anchor="middle" font-size="16" fill="#ffffff" font-weight="700">S</text>
      <path d="M128 116 Q220 26 312 116" fill="none" stroke="#6b7280" stroke-width="1.6" marker-end="url(#bm-ns)"/>
      <path d="M128 122 Q220 46 312 122" fill="none" stroke="#6b7280" stroke-width="1.6" marker-end="url(#bm-ns)"/>
      <path d="M128 128 Q220 66 312 128" fill="none" stroke="#6b7280" stroke-width="1.6" marker-end="url(#bm-ns)"/>
      <path d="M128 134 Q220 86 312 134" fill="none" stroke="#6b7280" stroke-width="1.6" marker-end="url(#bm-ns)"/>
      <path d="M128 140 Q220 164 312 140" fill="none" stroke="#6b7280" stroke-width="1.6" marker-end="url(#bm-ns)"/>
      <path d="M128 146 Q220 184 312 146" fill="none" stroke="#6b7280" stroke-width="1.6" marker-end="url(#bm-ns)"/>
      <path d="M128 152 Q220 204 312 152" fill="none" stroke="#6b7280" stroke-width="1.6" marker-end="url(#bm-ns)"/>
      <path d="M128 158 Q220 224 312 158" fill="none" stroke="#6b7280" stroke-width="1.6" marker-end="url(#bm-ns)"/>
      <line x1="128" y1="116" x2="78" y2="116" stroke="#6b7280" stroke-width="1.6" marker-end="url(#bm-ns)"/>
      <line x1="128" y1="124" x2="78" y2="124" stroke="#6b7280" stroke-width="1.6" marker-end="url(#bm-ns)"/>
      <line x1="128" y1="132" x2="78" y2="132" stroke="#6b7280" stroke-width="1.6" marker-end="url(#bm-ns)"/>
      <line x1="128" y1="140" x2="78" y2="140" stroke="#6b7280" stroke-width="1.6" marker-end="url(#bm-ns)"/>
      <line x1="128" y1="148" x2="78" y2="148" stroke="#6b7280" stroke-width="1.6" marker-end="url(#bm-ns)"/>
      <line x1="362" y1="116" x2="312" y2="116" stroke="#6b7280" stroke-width="1.6" marker-end="url(#bm-ns)"/>
      <line x1="362" y1="124" x2="312" y2="124" stroke="#6b7280" stroke-width="1.6" marker-end="url(#bm-ns)"/>
      <line x1="362" y1="132" x2="312" y2="132" stroke="#6b7280" stroke-width="1.6" marker-end="url(#bm-ns)"/>
      <line x1="362" y1="140" x2="312" y2="140" stroke="#6b7280" stroke-width="1.6" marker-end="url(#bm-ns)"/>
      <line x1="362" y1="148" x2="312" y2="148" stroke="#6b7280" stroke-width="1.6" marker-end="url(#bm-ns)"/>
    </svg>`,
  ),

  'atom-structure': diagramWrap(
    'Atom — nucleus (protons + neutrons) at centre; electrons in shells around it.',
    `<svg viewBox="0 0 280 200" width="280" height="200" role="img" aria-label="Atomic structure">
      <circle cx="140" cy="100" r="70" fill="none" stroke="#cbd5e1" stroke-dasharray="4 3"/>
      <circle cx="140" cy="100" r="45" fill="none" stroke="#cbd5e1" stroke-dasharray="4 3"/>
      <circle cx="140" cy="100" r="18" fill="#fecaca" stroke="#dc2626"/>
      <text x="140" y="105" text-anchor="middle" font-size="9" fill="#991b1b">nucleus</text>
      <circle cx="200" cy="80" r="5" fill="#2563eb"/><circle cx="85" cy="120" r="5" fill="#2563eb"/>
      <circle cx="175" cy="155" r="5" fill="#2563eb"/>
      <text x="140" y="185" text-anchor="middle" font-size="10" fill="#64748b">electrons in shells</text>
    </svg>`,
  ),

  'electric-field-positive': diagramWrap(
    'Positive point charge — field lines radiate outward.',
    `<svg viewBox="0 0 280 200" width="280" height="200" role="img" aria-label="Electric field around a positive point charge">
      <defs><marker id="ef-pos-sn" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/></marker></defs>
      <circle cx="140" cy="100" r="12" fill="#fecaca" stroke="#dc2626" stroke-width="2"/>
      <text x="140" y="104" text-anchor="middle" font-size="11" fill="#991b1b" font-weight="600">+</text>
      <line x1="140" y1="100" x2="140" y2="28" stroke="#dc2626" stroke-width="1.5" marker-end="url(#ef-pos-sn)"/>
      <line x1="140" y1="100" x2="140" y2="172" stroke="#dc2626" stroke-width="1.5" marker-end="url(#ef-pos-sn)"/>
      <line x1="140" y1="100" x2="52" y2="100" stroke="#dc2626" stroke-width="1.5" marker-end="url(#ef-pos-sn)"/>
      <line x1="140" y1="100" x2="228" y2="100" stroke="#dc2626" stroke-width="1.5" marker-end="url(#ef-pos-sn)"/>
      <line x1="140" y1="100" x2="78" y2="38" stroke="#dc2626" stroke-width="1.5" marker-end="url(#ef-pos-sn)"/>
      <line x1="140" y1="100" x2="202" y2="38" stroke="#dc2626" stroke-width="1.5" marker-end="url(#ef-pos-sn)"/>
      <line x1="140" y1="100" x2="78" y2="162" stroke="#dc2626" stroke-width="1.5" marker-end="url(#ef-pos-sn)"/>
      <line x1="140" y1="100" x2="202" y2="162" stroke="#dc2626" stroke-width="1.5" marker-end="url(#ef-pos-sn)"/>
      <text x="140" y="192" text-anchor="middle" font-size="10" fill="#64748b">lines point away from + charge</text>
    </svg>`,
  ),

  'electric-field-plates': diagramWrap(
    'Parallel plates — field lines are parallel and equally spaced between oppositely charged plates.',
    `<svg viewBox="0 0 320 180" width="320" height="180" role="img" aria-label="Uniform electric field between parallel plates">
      <defs><marker id="ef-plate-sn" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker></defs>
      <rect x="60" y="30" width="8" height="120" fill="#fecaca" stroke="#dc2626"/>
      <text x="44" y="92" text-anchor="end" font-size="11" fill="#991b1b" font-weight="600">+</text>
      <rect x="252" y="30" width="8" height="120" fill="#bfdbfe" stroke="#2563eb"/>
      <text x="276" y="92" font-size="11" fill="#1e3a8a" font-weight="600">−</text>
      <line x1="90" y1="55" x2="230" y2="55" stroke="#2563eb" stroke-width="1.5" marker-end="url(#ef-plate-sn)"/>
      <line x1="90" y1="80" x2="230" y2="80" stroke="#2563eb" stroke-width="1.5" marker-end="url(#ef-plate-sn)"/>
      <line x1="90" y1="105" x2="230" y2="105" stroke="#2563eb" stroke-width="1.5" marker-end="url(#ef-plate-sn)"/>
      <line x1="90" y1="130" x2="230" y2="130" stroke="#2563eb" stroke-width="1.5" marker-end="url(#ef-plate-sn)"/>
      <text x="160" y="168" text-anchor="middle" font-size="10" fill="#64748b">uniform field between plates</text>
    </svg>`,
  ),

  'induction-magnet-solenoid': diagramWrap(
    'Three-stage Faraday experiment — moving IN (clockwise I, galvanometer right), stationary INSIDE (I = 0), pulling OUT (anticlockwise I, galvanometer left).',
    `<svg viewBox="0 0 720 300" width="720" height="300" role="img" aria-label="Three stage magnet and solenoid experiment">
      <defs>
        <marker id="im81-v" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#334155"/></marker>
        <marker id="im81-f" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#7c3aed"/></marker>
        <marker id="im81-c" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#16a34a"/></marker>
      </defs>
      <text x="360" y="22" text-anchor="middle" font-size="13" fill="#334155" font-weight="700">Faraday&apos;s magnet–coil experiment (centre-zero galvanometer)</text>
      <g class="seq-stage-1">
        <rect x="8" y="34" width="224" height="200" rx="10" fill="#ecfdf5" stroke="#16a34a" stroke-width="2"/>
        <text x="120" y="54" text-anchor="middle" font-size="11" fill="#166534" font-weight="700">① Moving IN</text>
        <ellipse cx="95" cy="88" rx="26" ry="9" fill="none" stroke="#2563eb" stroke-width="2"/>
        <ellipse cx="95" cy="108" rx="26" ry="9" fill="none" stroke="#2563eb" stroke-width="2"/>
        <ellipse cx="95" cy="128" rx="26" ry="9" fill="none" stroke="#2563eb" stroke-width="2"/>
        <path d="M95 82 Q115 108 95 134 Q75 108 95 82" fill="none" stroke="#16a34a" stroke-width="2.5" marker-end="url(#im81-c)"/>
        <text x="128" y="112" font-size="8" fill="#16a34a" font-weight="600">I clockwise</text>
        <rect x="148" y="92" width="20" height="32" rx="2" fill="#fecaca" stroke="#dc2626"/><text x="158" y="110" text-anchor="middle" font-size="8" fill="#991b1b">N</text>
        <rect x="168" y="98" width="12" height="20" rx="1" fill="#bfdbfe" stroke="#2563eb"/><text x="174" y="111" text-anchor="middle" font-size="6" fill="#1e3a8a">S</text>
        <path d="M188 108 H218" stroke="#334155" stroke-width="2.5" marker-end="url(#im81-v)"/>
        <text x="203" y="100" text-anchor="middle" font-size="8" fill="#334155">v →</text>
        <path d="M158 92 L118 100" stroke="#7c3aed" stroke-width="1.5" marker-end="url(#im81-f)"/>
        <path d="M158 100 L118 108" stroke="#7c3aed" stroke-width="1.5" marker-end="url(#im81-f)"/>
        <path d="M158 108 L118 116" stroke="#7c3aed" stroke-width="1.5" marker-end="url(#im81-f)"/>
        <text x="138" y="88" font-size="7" fill="#7c3aed">flux lines →</text>
        <rect x="62" y="152" width="96" height="44" rx="5" fill="#fff" stroke="#64748b" stroke-width="1.5"/>
        <text x="110" y="166" text-anchor="middle" font-size="7" fill="#334155" font-weight="600">Centre-Zero Galvanometer</text>
        <line x1="74" y1="182" x2="146" y2="182" stroke="#94a3b8" stroke-width="1"/>
        <line x1="110" y1="182" x2="110" y2="170" stroke="#94a3b8" stroke-width="1"/>
        <line x1="110" y1="182" x2="132" y2="174" stroke="#dc2626" stroke-width="2"/>
        <text x="110" y="198" text-anchor="middle" font-size="8" fill="#dc2626">needle →</text>
      </g>
      <g class="seq-stage-2">
        <rect x="248" y="34" width="224" height="200" rx="10" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
        <text x="360" y="54" text-anchor="middle" font-size="11" fill="#334155" font-weight="700">② Stationary INSIDE</text>
        <ellipse cx="335" cy="88" rx="26" ry="9" fill="none" stroke="#2563eb" stroke-width="2"/>
        <ellipse cx="335" cy="108" rx="26" ry="9" fill="none" stroke="#2563eb" stroke-width="2"/>
        <ellipse cx="335" cy="128" rx="26" ry="9" fill="none" stroke="#2563eb" stroke-width="2"/>
        <rect x="326" y="98" width="20" height="32" rx="2" fill="#fecaca" stroke="#dc2626"/><text x="336" y="116" text-anchor="middle" font-size="8" fill="#991b1b">N</text>
        <text x="380" y="112" font-size="8" fill="#64748b">v = 0</text>
        <line x1="378" y1="108" x2="398" y2="108" stroke="#94a3b8" stroke-width="2"/>
        <line x1="388" y1="100" x2="398" y2="116" stroke="#94a3b8" stroke-width="2"/>
        <text x="360" y="142" text-anchor="middle" font-size="8" fill="#64748b">no induced current</text>
        <rect x="302" y="152" width="96" height="44" rx="5" fill="#fff" stroke="#64748b" stroke-width="1.5"/>
        <text x="350" y="166" text-anchor="middle" font-size="7" fill="#334155" font-weight="600">Centre-Zero Galvanometer</text>
        <line x1="314" y1="182" x2="386" y2="182" stroke="#94a3b8" stroke-width="1"/>
        <line x1="350" y1="182" x2="350" y2="170" stroke="#64748b" stroke-width="2"/>
        <text x="350" y="198" text-anchor="middle" font-size="8" fill="#64748b">needle at 0</text>
      </g>
      <g class="seq-stage-3">
        <rect x="488" y="34" width="224" height="200" rx="10" fill="#fef2f2" stroke="#dc2626" stroke-width="2"/>
        <text x="600" y="54" text-anchor="middle" font-size="11" fill="#991b1b" font-weight="700">③ Pulling OUT</text>
        <ellipse cx="625" cy="88" rx="26" ry="9" fill="none" stroke="#2563eb" stroke-width="2"/>
        <ellipse cx="625" cy="108" rx="26" ry="9" fill="none" stroke="#2563eb" stroke-width="2"/>
        <ellipse cx="625" cy="128" rx="26" ry="9" fill="none" stroke="#2563eb" stroke-width="2"/>
        <path d="M625 82 Q605 108 625 134 Q645 108 625 82" fill="none" stroke="#16a34a" stroke-width="2.5" marker-end="url(#im81-c)"/>
        <text x="658" y="112" font-size="8" fill="#16a34a" font-weight="600">I anticlockwise</text>
        <rect x="548" y="92" width="20" height="32" rx="2" fill="#fecaca" stroke="#dc2626"/><text x="558" y="110" text-anchor="middle" font-size="8" fill="#991b1b">N</text>
        <rect x="528" y="98" width="12" height="20" rx="1" fill="#bfdbfe" stroke="#2563eb"/>
        <path d="M522 108 H492" stroke="#334155" stroke-width="2.5" marker-end="url(#im81-v)"/>
        <text x="507" y="100" text-anchor="middle" font-size="8" fill="#334155">← v</text>
        <path d="M558 92 L598 100" stroke="#7c3aed" stroke-width="1.5" marker-end="url(#im81-f)"/>
        <path d="M558 108 L598 116" stroke="#7c3aed" stroke-width="1.5" marker-end="url(#im81-f)"/>
        <rect x="552" y="152" width="96" height="44" rx="5" fill="#fff" stroke="#64748b" stroke-width="1.5"/>
        <text x="600" y="166" text-anchor="middle" font-size="7" fill="#334155" font-weight="600">Centre-Zero Galvanometer</text>
        <line x1="564" y1="182" x2="636" y2="182" stroke="#94a3b8" stroke-width="1"/>
        <line x1="600" y1="182" x2="600" y2="170" stroke="#94a3b8" stroke-width="1"/>
        <line x1="600" y1="182" x2="578" y2="174" stroke="#dc2626" stroke-width="2"/>
        <text x="600" y="198" text-anchor="middle" font-size="8" fill="#dc2626">needle ←</text>
      </g>
      <text x="360" y="258" text-anchor="middle" font-size="10" fill="#475569">Relative motion is essential — opposite motion gives opposite deflection (Lenz&apos;s law)</text>
      <text x="360" y="276" text-anchor="middle" font-size="9" fill="#94a3b8">Stages highlight in turn</text>
    </svg>`,
    'enlight-physics-diagram--hero enlight-physics-diagram--sequence',
  ),

  'faraday-iron-ring': diagramWrap(
    'Faraday&apos;s iron ring — closing the switch in coil A induces a momentary e.m.f. in coil B (mutual induction).',
    `<svg viewBox="0 0 480 220" width="480" height="220" role="img" aria-label="Faraday iron ring experiment">
      <ellipse cx="240" cy="110" rx="95" ry="55" fill="#e2e8f0" stroke="#64748b" stroke-width="3"/>
      <ellipse cx="240" cy="110" rx="55" ry="30" fill="#fafafa" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="240" y="114" text-anchor="middle" font-size="9" fill="#64748b">soft iron ring</text>
      <rect x="128" y="78" width="18" height="64" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M128 78 Q118 78 118 88 Q118 132 128 132" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M146 78 Q156 78 156 88 Q156 132 146 132" fill="none" stroke="#2563eb" stroke-width="2"/>
      <text x="137" y="70" text-anchor="middle" font-size="9" fill="#2563eb" font-weight="600">Coil A</text>
      <rect x="334" y="78" width="18" height="64" fill="none" stroke="#dc2626" stroke-width="2"/>
      <path d="M334 78 Q324 78 324 88 Q324 132 334 132" fill="none" stroke="#dc2626" stroke-width="2"/>
      <path d="M352 78 Q362 78 362 88 Q362 132 352 132" fill="none" stroke="#dc2626" stroke-width="2"/>
      <text x="343" y="70" text-anchor="middle" font-size="9" fill="#dc2626" font-weight="600">Coil B</text>
      <line x1="50" y1="110" x2="118" y2="110" stroke="#334155" stroke-width="2"/>
      <rect x="15" y="95" width="22" height="30" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <line x1="20" y1="100" x2="20" y2="120" stroke="#334155" stroke-width="2"/>
      <line x1="32" y1="104" x2="32" y2="116" stroke="#334155" stroke-width="3"/>
      <rect x="42" y="100" width="18" height="20" rx="2" fill="#f1f5f9" stroke="#64748b"/>
      <text x="51" y="113" text-anchor="middle" font-size="8" fill="#334155">S</text>
      <text x="35" y="88" text-anchor="middle" font-size="8" fill="#64748b">d.c. + switch</text>
      <line x1="362" y1="110" x2="410" y2="110" stroke="#334155" stroke-width="2"/>
      <rect x="410" y="92" width="55" height="36" rx="4" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
      <text x="437" y="108" text-anchor="middle" font-size="8" fill="#334155">galvanometer</text>
      <line x1="425" y1="118" x2="450" y2="118" stroke="#64748b"/>
      <line x1="437" y1="118" x2="448" y2="108" stroke="#dc2626" stroke-width="1.5"/>
      <text x="240" y="200" text-anchor="middle" font-size="10" fill="#475569">changing flux in A induces e.m.f. in B only while current is changing</text>
    </svg>`,
  ),

  'induced-emf-time': diagramWrap(
    'Three-stage sequence — ① magnet enters (+ε peak), ② fully inside (ε = 0 dead zone), ③ exits faster under gravity (larger −ε peak). Stages highlight in turn.',
    `<svg viewBox="0 0 560 380" width="560" height="380" role="img" aria-label="Three stage induced e.m.f. sequence">
      <text x="280" y="20" text-anchor="middle" font-size="12" fill="#334155" font-weight="700">Magnet falling through a coil — mapped to induced e.m.f.</text>
      <g class="seq-stage-1">
        <rect x="15" y="32" width="165" height="128" rx="8" fill="#ecfdf5" stroke="#16a34a" stroke-width="2"/>
        <text x="97" y="50" text-anchor="middle" font-size="10" fill="#166534" font-weight="700">① ENTER</text>
        <ellipse cx="97" cy="72" rx="22" ry="8" fill="none" stroke="#2563eb" stroke-width="2"/>
        <ellipse cx="97" cy="88" rx="22" ry="8" fill="none" stroke="#2563eb" stroke-width="2"/>
        <ellipse cx="97" cy="104" rx="22" ry="8" fill="none" stroke="#2563eb" stroke-width="2"/>
        <rect x="88" y="58" width="18" height="22" rx="2" fill="#fecaca" stroke="#dc2626"/><text x="97" y="72" text-anchor="middle" font-size="7" fill="#991b1b">N</text>
        <path d="M97 80 L97 98" stroke="#334155" stroke-width="2" marker-end="url(#iemf-a)"/>
        <text x="97" y="118" text-anchor="middle" font-size="8" fill="#334155">flux increasing</text>
        <text x="97" y="148" text-anchor="middle" font-size="9" fill="#16a34a" font-weight="600">+ε peak</text>
      </g>
      <g class="seq-stage-2">
        <rect x="197" y="32" width="165" height="128" rx="8" fill="#f1f5f9" stroke="#64748b" stroke-width="2"/>
        <text x="279" y="50" text-anchor="middle" font-size="10" fill="#334155" font-weight="700">② DEAD ZONE</text>
        <ellipse cx="279" cy="72" rx="22" ry="8" fill="none" stroke="#2563eb" stroke-width="2"/>
        <ellipse cx="279" cy="88" rx="22" ry="8" fill="none" stroke="#2563eb" stroke-width="2"/>
        <ellipse cx="279" cy="104" rx="22" ry="8" fill="none" stroke="#2563eb" stroke-width="2"/>
        <rect x="270" y="78" width="18" height="28" rx="2" fill="#fecaca" stroke="#dc2626"/><text x="279" y="96" text-anchor="middle" font-size="7" fill="#991b1b">N</text>
        <text x="279" y="118" text-anchor="middle" font-size="8" fill="#64748b">fully inside</text>
        <text x="279" y="148" text-anchor="middle" font-size="9" fill="#64748b" font-weight="600">ε = 0</text>
      </g>
      <g class="seq-stage-3">
        <rect x="379" y="32" width="165" height="128" rx="8" fill="#fef2f2" stroke="#dc2626" stroke-width="2"/>
        <text x="461" y="50" text-anchor="middle" font-size="10" fill="#991b1b" font-weight="700">③ EXIT (faster)</text>
        <ellipse cx="461" cy="72" rx="22" ry="8" fill="none" stroke="#2563eb" stroke-width="2"/>
        <ellipse cx="461" cy="88" rx="22" ry="8" fill="none" stroke="#2563eb" stroke-width="2"/>
        <ellipse cx="461" cy="104" rx="22" ry="8" fill="none" stroke="#2563eb" stroke-width="2"/>
        <rect x="452" y="100" width="18" height="22" rx="2" fill="#fecaca" stroke="#dc2626"/><text x="461" y="114" text-anchor="middle" font-size="7" fill="#991b1b">N</text>
        <path d="M461 108 L461 126" stroke="#334155" stroke-width="2.5" marker-end="url(#iemf-a)"/>
        <text x="478" y="122" font-size="8" fill="#dc2626">g ↓</text>
        <text x="461" y="118" text-anchor="middle" font-size="8" fill="#334155">flux decreasing fast</text>
        <text x="461" y="148" text-anchor="middle" font-size="9" fill="#dc2626" font-weight="600">−ε larger peak</text>
      </g>
      <line x1="40" y1="178" x2="520" y2="178" stroke="#cbd5e1" stroke-width="1"/>
      <text x="280" y="194" text-anchor="middle" font-size="10" fill="#64748b" font-weight="600">Induced e.m.f. vs time (explicit plot)</text>
      <line x1="55" y1="255" x2="520" y2="255" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="255" x2="55" y2="210" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="215" x2="520" y2="215" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 3"/>
      <text x="290" y="372" text-anchor="middle" font-size="11" fill="#475569">Time</text>
      <text x="18" y="235" transform="rotate(-90 18 235)" text-anchor="middle" font-size="11" fill="#475569">ε</text>
      <g class="seq-graph-1">
        <rect x="55" y="210" width="125" height="45" fill="#16a34a" opacity="0.12"/>
        <path d="M 60 255 Q 90 255 110 225 Q 130 210 175 215" fill="none" stroke="#16a34a" stroke-width="3"/>
        <line x1="175" y1="205" x2="175" y2="265" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="4 3"/>
        <text x="115" y="208" text-anchor="middle" font-size="9" fill="#16a34a" font-weight="600">+ε</text>
      </g>
      <g class="seq-graph-2">
        <rect x="175" y="210" width="145" height="45" fill="#64748b" opacity="0.1"/>
        <line x1="175" y1="215" x2="320" y2="215" stroke="#64748b" stroke-width="2.5"/>
        <line x1="320" y1="205" x2="320" y2="265" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4 3"/>
        <text x="247" y="208" text-anchor="middle" font-size="9" fill="#64748b" font-weight="600">ε = 0</text>
      </g>
      <g class="seq-graph-3">
        <rect x="320" y="210" width="200" height="45" fill="#dc2626" opacity="0.12"/>
        <path d="M 325 215 L 360 215 Q 400 215 430 255 Q 460 290 510 295" fill="none" stroke="#dc2626" stroke-width="3"/>
        <text x="430" y="298" text-anchor="middle" font-size="9" fill="#dc2626" font-weight="600">−ε (steeper &amp; larger)</text>
      </g>
      <defs><marker id="iemf-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#334155"/></marker></defs>
      <text x="280" y="358" text-anchor="middle" font-size="9" fill="#94a3b8">Exit peak is sharper because gravity increases speed → faster flux change</text>
    </svg>`,
    'enlight-physics-diagram--sequence',
  ),

  'ac-generator-schematic': diagramWrap(
    'A.c. generator — coil between curved N–S poles; slip rings and carbon brushes transfer alternating e.m.f. to the external circuit.',
    `<svg viewBox="0 0 500 260" width="500" height="260" role="img" aria-label="A.c. generator schematic">
      <path d="M120 55 Q250 25 380 55 L380 205 Q250 235 120 205 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
      <path d="M120 55 Q250 35 380 55" fill="#fecaca" stroke="#dc2626" stroke-width="2"/>
      <text x="250" y="50" text-anchor="middle" font-size="11" fill="#991b1b" font-weight="700">N pole</text>
      <path d="M120 205 Q250 225 380 205" fill="#bfdbfe" stroke="#2563eb" stroke-width="2"/>
      <text x="250" y="222" text-anchor="middle" font-size="11" fill="#1e3a8a" font-weight="700">S pole</text>
      <rect x="215" y="95" width="70" height="70" fill="none" stroke="#334155" stroke-width="2.5" transform="rotate(25 250 130)"/>
      <line x1="250" y1="60" x2="250" y2="95" stroke="#64748b" stroke-width="2"/>
      <line x1="250" y1="165" x2="250" y2="200" stroke="#64748b" stroke-width="2"/>
      <text x="250" y="88" text-anchor="middle" font-size="8" fill="#64748b">axle</text>
      <circle cx="318" cy="130" r="22" fill="none" stroke="#f59e0b" stroke-width="3"/>
      <circle cx="318" cy="152" r="22" fill="none" stroke="#f59e0b" stroke-width="3"/>
      <text x="350" y="125" font-size="9" fill="#f59e0b" font-weight="600">slip rings</text>
      <rect x="355" y="108" width="12" height="64" rx="3" fill="#1e293b" stroke="#334155"/>
      <text x="390" y="125" font-size="9" fill="#334155">carbon</text>
      <text x="390" y="138" font-size="9" fill="#334155">brushes</text>
      <line x1="367" y1="118" x2="420" y2="118" stroke="#334155" stroke-width="2"/>
      <line x1="367" y1="162" x2="420" y2="162" stroke="#334155" stroke-width="2"/>
      <rect x="420" y="100" width="60" height="80" rx="4" fill="#f8fafc" stroke="#64748b"/>
      <text x="450" y="145" text-anchor="middle" font-size="9" fill="#334155">load /</text>
      <text x="450" y="158" text-anchor="middle" font-size="9" fill="#334155">oscilloscope</text>
      <path d="M175 130 Q200 110 225 130" fill="none" stroke="#64748b" stroke-width="1.5" marker-end="url(#i82-rot)"/>
      <text x="175" y="120" font-size="9" fill="#64748b">rotation</text>
      <defs><marker id="i82-rot" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker></defs>
      <text x="250" y="248" text-anchor="middle" font-size="10" fill="#475569">rotating coil cuts field lines → induced a.c. e.m.f.</text>
    </svg>`,
  ),

  'generator-voltage-time': diagramWrap(
    'Sinusoidal output — maximum e.m.f. at $90^\circ$ and $270^\circ$ when coil sides cut field lines at right angles.',
    `<svg viewBox="0 0 480 260" width="480" height="260" role="img" aria-label="Generator voltage time graph">
      <line x1="60" y1="140" x2="440" y2="140" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="60" y1="220" x2="440" y2="220" stroke="#64748b" stroke-width="1.5"/>
      <line x1="60" y1="220" x2="60" y2="40" stroke="#64748b" stroke-width="1.5"/>
      <text x="250" y="245" text-anchor="middle" font-size="11" fill="#475569">Time / angle of rotation</text>
      <text x="22" y="130" transform="rotate(-90 22 130)" text-anchor="middle" font-size="11" fill="#475569">Induced e.m.f.</text>
      <path d="M 60 140 C 95 140 110 55 150 55 S 230 225 270 225 S 350 55 390 55 S 420 140 440 140" fill="none" stroke="#2563eb" stroke-width="2.5"/>
      <line x1="60" y1="220" x2="60" y2="228" stroke="#64748b"/><text x="60" y="238" text-anchor="middle" font-size="9" fill="#64748b">0°</text>
      <line x1="150" y1="220" x2="150" y2="228" stroke="#64748b"/><text x="150" y="238" text-anchor="middle" font-size="9" fill="#64748b">90°</text>
      <line x1="270" y1="220" x2="270" y2="228" stroke="#64748b"/><text x="270" y="238" text-anchor="middle" font-size="9" fill="#64748b">180°</text>
      <line x1="390" y1="220" x2="390" y2="228" stroke="#64748b"/><text x="390" y="238" text-anchor="middle" font-size="9" fill="#64748b">270°</text>
      <line x1="440" y1="220" x2="440" y2="228" stroke="#64748b"/><text x="440" y="238" text-anchor="middle" font-size="9" fill="#64748b">360°</text>
      <circle cx="150" cy="55" r="4" fill="#16a34a"/><text x="150" y="42" text-anchor="middle" font-size="9" fill="#16a34a" font-weight="600">max e.m.f.</text>
      <circle cx="390" cy="55" r="4" fill="#16a34a"/><text x="390" y="42" text-anchor="middle" font-size="9" fill="#16a34a" font-weight="600">max e.m.f.</text>
      <circle cx="270" cy="225" r="4" fill="#dc2626"/><text x="270" y="215" text-anchor="middle" font-size="9" fill="#dc2626">zero</text>
      <text x="250" y="18" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Alternating output (one revolution)</text>
    </svg>`,
  ),

  'wire-field-pattern': diagramWrap(
    'Field around a straight wire — concentric circles on a cardboard viewed from above; direction from the right-hand grip rule.',
    `<svg viewBox="0 0 400 240" width="400" height="240" role="img" aria-label="Magnetic field around straight wire">
      <defs><marker id="i83-circ" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker></defs>
      <rect x="60" y="50" width="280" height="150" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="200" y="42" text-anchor="middle" font-size="10" fill="#92400e">cardboard (viewed from above)</text>
      <circle cx="200" cy="125" r="8" fill="#334155"/>
      <circle cx="200" cy="125" r="3" fill="#fff"/>
      <text x="200" y="148" text-anchor="middle" font-size="9" fill="#334155">wire ⊗ (into page)</text>
      <circle cx="200" cy="125" r="28" fill="none" stroke="#2563eb" stroke-width="1.5" marker-end="url(#i83-circ)"/>
      <circle cx="200" cy="125" r="48" fill="none" stroke="#2563eb" stroke-width="1.5" marker-end="url(#i83-circ)"/>
      <circle cx="200" cy="125" r="68" fill="none" stroke="#2563eb" stroke-width="1.5" marker-end="url(#i83-circ)"/>
      <text x="200" y="218" text-anchor="middle" font-size="10" fill="#475569">concentric circles — strongest near the wire</text>
    </svg>`,
  ),

  'right-hand-grip-rule': diagramWrap(
    'Right-hand grip rule — thumb = conventional current I (green); curled fingers = magnetic field B (blue). Standardized 3D right-hand pose gripping a vertical wire.',
    `<svg viewBox="0 0 420 300" width="420" height="300" role="img" aria-label="Right hand grip rule 3D">
      <defs>
        <linearGradient id="rhg-palm" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fde4c8"/><stop offset="55%" stop-color="#e8b98a"/><stop offset="100%" stop-color="#c4895a"/></linearGradient>
        <linearGradient id="rhg-finger" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fce8d0"/><stop offset="100%" stop-color="#d4a574"/></linearGradient>
        <filter id="rhg-sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.25"/></filter>
        <marker id="rhg-i" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" class="vec-i"/></marker>
        <marker id="rhg-b" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" class="vec-b"/></marker>
      </defs>
      <rect x="8" y="8" width="404" height="284" rx="10" fill="#fafafa" stroke="#e2e8f0"/>
      <text x="210" y="30" text-anchor="middle" font-size="12" fill="#334155" font-weight="700">Right-Hand Grip Rule</text>
      <line x1="210" y1="55" x2="210" y2="250" stroke="#475569" stroke-width="5"/>
      <line x1="210" y1="55" x2="210" y2="250" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6 4"/>
      <g filter="url(#rhg-sh)">
        <ellipse cx="210" cy="175" rx="52" ry="38" fill="url(#rhg-palm)"/>
        <rect x="188" y="95" width="18" height="55" rx="9" fill="url(#rhg-finger)" transform="rotate(-8 197 122)"/>
        <rect x="208" y="88" width="18" height="62" rx="9" fill="url(#rhg-finger)"/>
        <rect x="228" y="95" width="18" height="55" rx="9" fill="url(#rhg-finger)" transform="rotate(8 237 122)"/>
        <rect x="248" y="108" width="16" height="42" rx="8" fill="url(#rhg-finger)" transform="rotate(18 256 129)"/>
        <path d="M198 88 L218 48 L228 52 L210 92 Z" fill="url(#rhg-finger)"/>
      </g>
      <line x1="210" y1="92" x2="210" y2="42" class="vec-i" stroke-width="5" marker-end="url(#rhg-i)"/>
      <text x="228" y="48" font-size="12" class="vec-i" font-weight="800">I — thumb</text>
      <text x="228" y="62" font-size="9" fill="#64748b">conventional current</text>
      <path d="M255 130 Q285 110 300 140 Q285 170 255 150 Q240 140 255 130" fill="none" class="vec-b" stroke-width="3.5" marker-end="url(#rhg-b)"/>
      <path d="M165 150 Q135 170 120 140 Q135 110 165 130 Q180 140 165 150" fill="none" class="vec-b" stroke-width="3.5" marker-end="url(#rhg-b)"/>
      <text x="305" y="138" font-size="12" class="vec-b" font-weight="800">B — fingers</text>
      <text x="305" y="152" font-size="9" fill="#64748b">field curls around wire</text>
      <rect x="18" y="258" width="384" height="28" rx="6" fill="#fff" stroke="#e2e8f0"/>
      <rect x="26" y="268" width="14" height="8" fill="#16a34a"/><text x="48" y="276" font-size="9" fill="#334155">I = current (thumb)</text>
      <rect x="168" y="268" width="14" height="8" fill="#2563eb"/><text x="190" y="276" font-size="9" fill="#334155">B = field (fingers)</text>
    </svg>`,
    'enlight-physics-diagram--hand-rule',
  ),

  'solenoid-field': diagramWrap(
    'Solenoid field — uniform parallel lines inside; loops outside mimic a bar magnet with clear N and S poles.',
    `<svg viewBox="0 0 420 220" width="420" height="220" role="img" aria-label="Magnetic field of solenoid">
      <defs><marker id="i83-sol" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker></defs>
      <path d="M130 70 Q120 110 130 150" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M150 70 Q140 110 150 150" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M170 70 Q160 110 170 150" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M190 70 Q180 110 190 150" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M210 70 Q200 110 210 150" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M230 70 Q220 110 230 150" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M250 70 Q240 110 250 150" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M270 70 Q260 110 270 150" fill="none" stroke="#2563eb" stroke-width="2"/>
      <text x="200" y="62" text-anchor="middle" font-size="9" fill="#2563eb">coil</text>
      <line x1="145" y1="95" x2="255" y2="95" stroke="#64748b" stroke-width="1.5" marker-end="url(#i83-sol)"/>
      <line x1="145" y1="110" x2="255" y2="110" stroke="#64748b" stroke-width="1.5" marker-end="url(#i83-sol)"/>
      <line x1="145" y1="125" x2="255" y2="125" stroke="#64748b" stroke-width="1.5" marker-end="url(#i83-sol)"/>
      <path d="M120 80 Q80 110 120 140" fill="none" stroke="#64748b" stroke-width="1.5" marker-end="url(#i83-sol)"/>
      <path d="M280 80 Q320 110 280 140" fill="none" stroke="#64748b" stroke-width="1.5" marker-end="url(#i83-sol)"/>
      <path d="M145 80 Q200 45 255 80" fill="none" stroke="#64748b" stroke-width="1.5" marker-end="url(#i83-sol)"/>
      <path d="M145 140 Q200 175 255 140" fill="none" stroke="#64748b" stroke-width="1.5" marker-end="url(#i83-sol)"/>
      <text x="200" y="38" text-anchor="middle" font-size="11" fill="#991b1b" font-weight="700">N</text>
      <text x="200" y="195" text-anchor="middle" font-size="11" fill="#1e3a8a" font-weight="700">S</text>
      <text x="210" y="210" text-anchor="middle" font-size="10" fill="#475569">field like a bar magnet</text>
    </svg>`,
  ),

  'catapult-field': diagramWrap(
    'Catapult field — wire field reinforces the main field on one side and cancels on the other; wire is pushed toward the weaker side.',
    `<svg viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Catapult field distortion">
      <defs><marker id="i84-cat" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker><marker id="i84-f" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/></marker></defs>
      <rect x="50" y="45" width="28" height="50" fill="#fecaca" stroke="#dc2626"/><text x="64" y="75" text-anchor="middle" font-size="10" fill="#991b1b">N</text>
      <rect x="362" y="45" width="28" height="50" fill="#bfdbfe" stroke="#2563eb"/><text x="376" y="75" text-anchor="middle" font-size="10" fill="#1e3a8a">S</text>
      <line x1="90" y1="60" x2="350" y2="60" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#i84-cat)"/>
      <line x1="90" y1="80" x2="350" y2="80" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#i84-cat)"/>
      <line x1="90" y1="100" x2="350" y2="100" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#i84-cat)"/>
      <circle cx="220" cy="100" r="10" fill="#fff" stroke="#334155" stroke-width="2"/>
      <text x="220" y="104" text-anchor="middle" font-size="12" fill="#334155">⊙</text>
      <text x="220" y="125" text-anchor="middle" font-size="8" fill="#334155">current out</text>
      <path d="M220 100 Q250 75 280 60" fill="none" stroke="#2563eb" stroke-width="1.5" marker-end="url(#i84-cat)"/>
      <path d="M220 100 Q250 125 280 140" fill="none" stroke="#2563eb" stroke-width="1.5" marker-end="url(#i84-cat)"/>
      <path d="M220 100 Q190 75 160 60" fill="none" stroke="#2563eb" stroke-width="1.5" marker-end="url(#i84-cat)"/>
      <path d="M220 100 Q190 125 160 140" fill="none" stroke="#2563eb" stroke-width="1.5" marker-end="url(#i84-cat)"/>
      <text x="300" y="52" font-size="9" fill="#16a34a" font-weight="600">reinforced</text>
      <text x="120" y="148" font-size="9" fill="#dc2626" font-weight="600">cancelled</text>
      <path d="M220 115 L220 175" stroke="#dc2626" stroke-width="3" marker-end="url(#i84-f)"/>
      <text x="235" y="165" font-size="10" fill="#dc2626" font-weight="600">force F</text>
      <text x="220" y="220" text-anchor="middle" font-size="10" fill="#475569">wire pushed toward weaker field side</text>
    </svg>`,
  ),

  'flemings-left-hand': diagramWrap(
    'Fleming&apos;s left-hand rule (motor) — thumb F (red), first finger B (blue), second finger I (green); mutually perpendicular.',
    `<svg viewBox="0 0 440 300" width="440" height="300" role="img" aria-label="Flemings left hand rule 3D">
      <defs>
        <linearGradient id="flh-palm" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fde4c8"/><stop offset="55%" stop-color="#e8b98a"/><stop offset="100%" stop-color="#c4895a"/></linearGradient>
        <linearGradient id="flh-digit" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fce8d0"/><stop offset="100%" stop-color="#d4a574"/></linearGradient>
        <filter id="flh-sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.25"/></filter>
        <marker id="flh-f" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" class="vec-f"/></marker>
        <marker id="flh-b" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" class="vec-b"/></marker>
        <marker id="flh-i" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" class="vec-i"/></marker>
      </defs>
      <rect x="8" y="8" width="424" height="284" rx="10" fill="#fafafa" stroke="#e2e8f0"/>
      <text x="220" y="30" text-anchor="middle" font-size="12" fill="#334155" font-weight="700">Fleming&apos;s Left-Hand Rule (Motor Effect)</text>
      <g filter="url(#flh-sh)">
        <ellipse cx="220" cy="185" rx="58" ry="42" fill="url(#flh-palm)"/>
        <rect x="168" y="118" width="20" height="68" rx="10" fill="url(#flh-digit)" transform="rotate(-35 178 152)"/>
        <rect x="198" y="108" width="20" height="78" rx="10" fill="url(#flh-digit)" transform="rotate(-5 208 147)"/>
        <rect x="228" y="112" width="20" height="72" rx="10" fill="url(#flh-digit)" transform="rotate(12 238 148)"/>
        <rect x="252" y="128" width="18" height="58" rx="9" fill="url(#flh-digit)" transform="rotate(28 261 157)"/>
        <path d="M205 108 L225 62 L238 68 L215 115 Z" fill="url(#flh-digit)"/>
      </g>
      <circle cx="220" cy="168" r="6" fill="#334155" opacity="0.35"/>
      <line x1="220" y1="168" x2="220" y2="58" class="vec-f" stroke-width="5.5" marker-end="url(#flh-f)"/>
      <text x="232" y="72" font-size="13" class="vec-f" font-weight="800">F — thumb</text>
      <text x="232" y="86" font-size="9" fill="#64748b">Force / thrust</text>
      <line x1="220" y1="168" x2="340" y2="168" class="vec-b" stroke-width="5.5" marker-end="url(#flh-b)"/>
      <text x="345" y="164" font-size="13" class="vec-b" font-weight="800">B — 1st finger</text>
      <text x="345" y="178" font-size="9" fill="#64748b">Field N → S</text>
      <line x1="220" y1="168" x2="128" y2="248" class="vec-i" stroke-width="5.5" marker-end="url(#flh-i)"/>
      <text x="72" y="252" font-size="13" class="vec-i" font-weight="800">I — 2nd finger</text>
      <text x="72" y="266" font-size="9" fill="#64748b">conventional current</text>
      <rect x="18" y="268" width="404" height="22" rx="6" fill="#fff" stroke="#e2e8f0"/>
      <text x="220" y="282" text-anchor="middle" font-size="9" fill="#475569">Hold thumb, first finger, second finger at 90° — each pair perpendicular</text>
    </svg>`,
    'enlight-physics-diagram--hand-rule',
  ),

  'flemings-right-hand': diagramWrap(
    'Fleming&apos;s right-hand rule (generator) — thumb Motion (purple), first finger B (blue), second finger induced I (green).',
    `<svg viewBox="0 0 440 300" width="440" height="300" role="img" aria-label="Flemings right hand rule 3D">
      <defs>
        <linearGradient id="frh-palm" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fde4c8"/><stop offset="55%" stop-color="#e8b98a"/><stop offset="100%" stop-color="#c4895a"/></linearGradient>
        <linearGradient id="frh-digit" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fce8d0"/><stop offset="100%" stop-color="#d4a574"/></linearGradient>
        <filter id="frh-sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.25"/></filter>
        <marker id="frh-m" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" class="vec-m"/></marker>
        <marker id="frh-b" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" class="vec-b"/></marker>
        <marker id="frh-i" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" class="vec-i"/></marker>
      </defs>
      <rect x="8" y="8" width="424" height="284" rx="10" fill="#fafafa" stroke="#e2e8f0"/>
      <text x="220" y="30" text-anchor="middle" font-size="12" fill="#334155" font-weight="700">Fleming&apos;s Right-Hand Rule (Generator / Induction)</text>
      <g filter="url(#frh-sh)">
        <ellipse cx="220" cy="185" rx="58" ry="42" fill="url(#frh-palm)"/>
        <rect x="168" y="118" width="20" height="68" rx="10" fill="url(#frh-digit)" transform="rotate(-35 178 152)"/>
        <rect x="198" y="108" width="20" height="78" rx="10" fill="url(#frh-digit)" transform="rotate(-5 208 147)"/>
        <rect x="228" y="112" width="20" height="72" rx="10" fill="url(#frh-digit)" transform="rotate(12 238 148)"/>
        <rect x="252" y="128" width="18" height="58" rx="9" fill="url(#frh-digit)" transform="rotate(28 261 157)"/>
        <path d="M205 108 L225 62 L238 68 L215 115 Z" fill="url(#frh-digit)"/>
      </g>
      <circle cx="220" cy="168" r="6" fill="#334155" opacity="0.35"/>
      <line x1="220" y1="168" x2="340" y2="168" class="vec-b" stroke-width="5.5" marker-end="url(#frh-b)"/>
      <text x="345" y="164" font-size="13" class="vec-b" font-weight="800">B — 1st finger</text>
      <text x="345" y="178" font-size="9" fill="#64748b">Field N → S</text>
      <line x1="220" y1="168" x2="220" y2="58" class="vec-m" stroke-width="5.5" marker-end="url(#frh-m)"/>
      <text x="232" y="72" font-size="13" class="vec-m" font-weight="800">Motion — thumb</text>
      <text x="232" y="86" font-size="9" fill="#64748b">wire movement</text>
      <line x1="220" y1="168" x2="128" y2="248" class="vec-i" stroke-width="5.5" marker-end="url(#frh-i)"/>
      <text x="72" y="252" font-size="13" class="vec-i" font-weight="800">I — 2nd finger</text>
      <text x="72" y="266" font-size="9" fill="#64748b">induced current</text>
      <rect x="18" y="268" width="404" height="22" rx="6" fill="#fff" stroke="#e2e8f0"/>
      <text x="220" y="282" text-anchor="middle" font-size="9" fill="#475569">Used for generators — motion, field, and induced current at 90°</text>
    </svg>`,
    'enlight-physics-diagram--hand-rule',
  ),

  'dc-motor-schematic': diagramWrap(
    'D.c. motor — split-ring commutator reverses current every half turn; opposite forces on coil sides create continuous rotation.',
    `<svg viewBox="0 0 500 260" width="500" height="260" role="img" aria-label="D.c. motor schematic">
      <defs><marker id="i85-fu" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#16a34a"/></marker><marker id="i85-fd" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/></marker></defs>
      <rect x="80" y="55" width="24" height="55" fill="#fecaca" stroke="#dc2626"/><text x="92" y="88" text-anchor="middle" font-size="10" fill="#991b1b">N</text>
      <rect x="396" y="55" width="24" height="55" fill="#bfdbfe" stroke="#2563eb"/><text x="408" y="88" text-anchor="middle" font-size="10" fill="#1e3a8a">S</text>
      <rect x="210" y="85" width="80" height="55" fill="none" stroke="#334155" stroke-width="2.5"/>
      <text x="195" y="108" font-size="9" fill="#334155">A</text>
      <text x="305" y="108" font-size="9" fill="#334155">B</text>
      <text x="195" y="128" font-size="9" fill="#334155">D</text>
      <text x="305" y="128" font-size="9" fill="#334155">C</text>
      <line x1="250" y1="55" x2="250" y2="85" stroke="#64748b" stroke-width="2"/>
      <line x1="250" y1="140" x2="250" y2="175" stroke="#64748b" stroke-width="2"/>
      <circle cx="250" cy="175" r="28" fill="none" stroke="#f59e0b" stroke-width="3"/>
      <line x1="250" y1="147" x2="250" y2="203" stroke="#f59e0b" stroke-width="2"/>
      <text x="290" y="178" font-size="9" fill="#f59e0b" font-weight="600">split-ring</text>
      <text x="290" y="191" font-size="9" fill="#f59e0b">commutator</text>
      <rect x="305" y="158" width="10" height="34" rx="2" fill="#1e293b"/>
      <rect x="305" y="192" width="10" height="34" rx="2" fill="#1e293b"/>
      <text x="330" y="178" font-size="9" fill="#334155">brushes</text>
      <line x1="315" y1="168" x2="360" y2="168" stroke="#334155" stroke-width="2"/>
      <line x1="315" y1="202" x2="360" y2="202" stroke="#334155" stroke-width="2"/>
      <rect x="360" y="150" width="22" height="30" fill="#fef08a" stroke="#ca8a04"/>
      <line x1="365" y1="158" x2="365" y2="172" stroke="#334155" stroke-width="2"/>
      <line x1="377" y1="162" x2="377" y2="168" stroke="#334155" stroke-width="3"/>
      <text x="400" y="168" font-size="9" fill="#64748b">d.c.</text>
      <line x1="220" y1="85" x2="220" y2="55" stroke="#16a34a" stroke-width="3" marker-end="url(#i85-fu)"/>
      <text x="188" y="62" font-size="10" fill="#16a34a" font-weight="600">F up</text>
      <line x1="280" y1="140" x2="280" y2="170" stroke="#dc2626" stroke-width="3" marker-end="url(#i85-fd)"/>
      <text x="292" y="165" font-size="10" fill="#dc2626" font-weight="600">F down</text>
      <text x="250" y="245" text-anchor="middle" font-size="10" fill="#475569">couple (turning effect) → continuous rotation</text>
    </svg>`,
  ),

  'transformer-structure': diagramWrap(
    'Transformer — laminated iron core; primary ($N_p$, $V_p$) and secondary ($N_s$, $V_s$); step-up when $N_s > N_p$.',
    `<svg viewBox="0 0 460 240" width="460" height="240" role="img" aria-label="Transformer structure">
      <rect x="155" y="50" width="150" height="130" fill="#e2e8f0" stroke="#64748b" stroke-width="2" rx="4"/>
      <text x="230" y="118" text-anchor="middle" font-size="10" fill="#64748b">laminated</text>
      <text x="230" y="132" text-anchor="middle" font-size="10" fill="#64748b">soft iron core</text>
      <path d="M75 70 Q55 110 75 150" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M95 65 Q75 110 95 155" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M115 62 Q95 110 115 158" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M135 60 Q115 110 135 160" fill="none" stroke="#2563eb" stroke-width="2"/>
      <text x="105" y="48" text-anchor="middle" font-size="9" fill="#2563eb" font-weight="600">$N_p$ (fewer)</text>
      <path d="M325 55 Q345 110 325 165" fill="none" stroke="#dc2626" stroke-width="2"/>
      <path d="M345 52 Q365 110 345 168" fill="none" stroke="#dc2626" stroke-width="2"/>
      <path d="M365 50 Q385 110 365 170" fill="none" stroke="#dc2626" stroke-width="2"/>
      <path d="M385 48 Q405 110 385 172" fill="none" stroke="#dc2626" stroke-width="2"/>
      <path d="M405 46 Q425 110 405 174" fill="none" stroke="#dc2626" stroke-width="2"/>
      <text x="365" y="38" text-anchor="middle" font-size="9" fill="#dc2626" font-weight="600">$N_s$ (more) step-up</text>
      <text x="55" y="200" font-size="10" fill="#2563eb">a.c. input $V_p$</text>
      <text x="355" y="200" font-size="10" fill="#dc2626">output $V_s &gt; V_p$</text>
      <text x="230" y="225" text-anchor="middle" font-size="10" fill="#475569">$V_p/V_s = N_p/N_s$</text>
    </svg>`,
  ),

  'grid-transmission': diagramWrap(
    'High-voltage transmission — step-up at the power station reduces $I$, cutting cable losses ($P = I^2 R$); step-down for homes.',
    `<svg viewBox="0 0 520 200" width="520" height="200" role="img" aria-label="Grid transmission network">
      <defs><marker id="i86-gr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker></defs>
      <rect x="15" y="70" width="75" height="50" rx="6" fill="#fef3c7" stroke="#d97706"/>
      <text x="52" y="92" text-anchor="middle" font-size="9" fill="#92400e" font-weight="600">Power</text>
      <text x="52" y="106" text-anchor="middle" font-size="9" fill="#92400e">Station</text>
      <path d="M90 95 H130" stroke="#64748b" stroke-width="2" marker-end="url(#i86-gr)"/>
      <rect x="130" y="72" width="70" height="46" rx="5" fill="#dbeafe" stroke="#2563eb"/>
      <text x="165" y="92" text-anchor="middle" font-size="8" fill="#1e40af" font-weight="600">Step-up</text>
      <text x="165" y="106" text-anchor="middle" font-size="8" fill="#1e40af">transformer</text>
      <path d="M200 95 H240" stroke="#64748b" stroke-width="2" marker-end="url(#i86-gr)"/>
      <line x1="255" y1="60" x2="255" y2="130" stroke="#64748b" stroke-width="3"/>
      <line x1="240" y1="75" x2="270" y2="55" stroke="#64748b" stroke-width="2"/>
      <line x1="240" y1="115" x2="270" y2="135" stroke="#64748b" stroke-width="2"/>
      <text x="255" y="155" text-anchor="middle" font-size="8" fill="#64748b">HV pylons</text>
      <path d="M270 95 H320" stroke="#64748b" stroke-width="2" marker-end="url(#i86-gr)"/>
      <rect x="320" y="72" width="70" height="46" rx="5" fill="#bbf7d0" stroke="#16a34a"/>
      <text x="355" y="92" text-anchor="middle" font-size="8" fill="#166534" font-weight="600">Step-down</text>
      <text x="355" y="106" text-anchor="middle" font-size="8" fill="#166534">transformer</text>
      <path d="M390 95 H430" stroke="#64748b" stroke-width="2" marker-end="url(#i86-gr)"/>
      <rect x="430" y="70" width="75" height="50" rx="6" fill="#f1f5f9" stroke="#64748b"/>
      <text x="467" y="92" text-anchor="middle" font-size="9" fill="#334155" font-weight="600">Homes /</text>
      <text x="467" y="106" text-anchor="middle" font-size="9" fill="#334155">consumers</text>
      <text x="260" y="185" text-anchor="middle" font-size="10" fill="#475569">high $V$ → low $I$ → less $I^2R$ heat loss in cables</text>
    </svg>`,
  ),

  'transformer-voltage-waves': diagramWrap(
    'Primary and secondary voltage — same frequency, different amplitudes after step-up or step-down.',
    `<svg viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Primary and secondary voltage waves">
      <line x1="55" y1="130" x2="400" y2="130" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="55" y1="210" x2="400" y2="210" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="210" x2="55" y2="35" stroke="#64748b" stroke-width="1.5"/>
      <text x="230" y="232" text-anchor="middle" font-size="11" fill="#475569">Time</text>
      <text x="22" y="125" transform="rotate(-90 22 125)" text-anchor="middle" font-size="11" fill="#475569">Voltage</text>
      <path d="M 55 130 C 90 130 110 55 150 55 S 230 205 270 205 S 350 55 390 55" fill="none" stroke="#2563eb" stroke-width="2.5"/>
      <path d="M 55 130 C 90 130 110 90 150 90 S 230 170 270 170 S 350 90 390 90" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="6 4"/>
      <text x="100" y="48" font-size="10" fill="#2563eb" font-weight="600">primary $V_p$</text>
      <text x="100" y="82" font-size="10" fill="#dc2626" font-weight="600">secondary $V_s$</text>
      <text x="230" y="18" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Same frequency — different peak voltage</text>
    </svg>`,
  ),

  'induction-coil': diagramWrap(
    'Electromagnetic induction — moving a magnet relative to a coil induces an e.m.f. (Faraday&apos;s law).',
    `<svg viewBox="0 0 360 160" width="360" height="160" role="img" aria-label="Electromagnetic induction">
      <path d="M140 40 Q160 80 140 120 Q120 80 140 40" fill="none" stroke="#2563eb" stroke-width="3"/>
      <path d="M160 40 Q180 80 160 120 Q140 80 160 40" fill="none" stroke="#2563eb" stroke-width="3"/>
      <rect x="220" y="55" width="30" height="50" rx="4" fill="#fecaca" stroke="#dc2626"/>
      <text x="235" y="85" text-anchor="middle" font-size="11" fill="#991b1b">N</text>
      <path d="M250 80 H310" stroke="#64748b" stroke-width="2" marker-end="url(#ind)"/>
      <text x="280" y="70" font-size="10" fill="#64748b">motion</text>
      <text x="100" y="145" text-anchor="middle" font-size="10" fill="#475569">induced e.m.f. in coil</text>
      <defs><marker id="ind" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker></defs>
    </svg>`,
  ),
}

/** Topic slug → diagram keys to inject (explicit mapping only — no keyword cross-contamination). */
export const TOPIC_DIAGRAMS = {
  '1-1-physical-quantities': ['measure-length', 'measure-mass', 'pendulum-time'],
  '1-2-scalars-and-vectors': ['vector-arrow', 'vector-resultant'],
  '2-1-speed-velocity-and-acceleration': ['motion-graph', 'speed-time-graph'],
  '2-2-graphs-of-motion': ['motion-graph', 'speed-time-graph', 'velocity-time-graph'],
  '2-3-acceleration-of-free-fall': ['free-fall-graph', 'terminal-velocity-graph'],
  '3-1-mass-and-weight': ['measure-mass'],
  '3-2-density': ['measure-mass'],
  '4-1-forces': ['spring-extension'],
  '4-2-forces-and-motion': ['motion-graph', 'speed-time-graph'],
  '4-3-turning-effect-of-forces': ['vector-arrow'],
  '4-4-centre-of-gravity': ['cg-stability'],
  '5-1-what-is-momentum': ['momentum-vector'],
  '5-2-momentum-impulse-and-force': ['momentum-vector'],
  '5-3-the-principle-of-conservation-of-momentum': ['newtons-cradle', 'collision-diagram'],
  '6-1-energy': ['sankey-light-bulb', 'pendulum-energy'],
  '6-2-work': ['work-done'],
  '6-3-energy-resources': ['sankey-power-station'],
  '6-4-power': ['power-climbing'],
  '7-1-pressure': ['pressure-solid'],
  '7-2-pressure-in-liquids': ['pressure-liquid-atm'],
  '8-1-the-states-of-matter': ['heating-curve', 'state-transitions'],
  '8-2-the-particle-model': ['particle-states', 'brownian-motion', 'particle-heating'],
  '8-3-gases-and-the-absolute-scale-of-temperature': ['gas-pt-graph', 'gas-pv-graph', 'gas-p-inv-v', 'gas-collisions'],
  '9-1-thermal-expansion': ['expansion-order', 'ball-ring', 'expansion-gap', 'particle-heating'],
  '9-2-specific-heat-capacity': ['shc-lab', 'shc-comparison'],
  '9-3-changes-of-state': ['heating-curve', 'state-transitions'],
  '10-1-transfer-of-thermal-energy': ['conduction-lattice', 'convection-cell', 'convection-heater-ac', 'radiation-wave'],
  '10-2-conduction': ['conduction-lattice'],
  '10-4-radiation': ['radiation-wave'],
  '10-3-convection': ['convection-cell', 'convection-heater-ac'],
  '10-5-applications-and-consequences-of-thermal-energy-tran': ['convection-heater-ac', 'radiation-wave'],
  '11-3-common-features-of-wave-behaviour': ['wave-reflection-ripple', 'wave-refraction-ripple'],
  '12-4-refraction-by-thin-lenses': ['converging-lens', 'diverging-lens'],
  '12-5-ray-diagrams-for-thin-converging-lenses': ['converging-lens'],
  '12-6-dispersion-of-light': ['dispersion-prism'],
  '13-3-electromagnetic-radiation-in-communication': ['em-spectrum', 'optical-fibre'],
  '14-3-echoes-and-ultrasound': ['echo-diagram'],
  '15-1-magnets-and-their-properties': ['bar-magnet'],
  '15-2-temporary-and-permanent-magnets': ['bar-magnet', 'magnetic-field'],
  '16-1-electric-charge': ['atom-structure'],
  '16-2-electric-field': ['electric-field-positive', 'electric-field-plates'],
  '16-3-electric-current': ['ammeter-circuit'],
  '16-5-resistance': ['vi-graph', 'vi-graph-filament', 'vi-graph-diode'],
  '17-1-circuit-diagrams-and-components': ['series-circuit', 'parallel-circuit'],
  '17-2-series-circuits': ['series-circuit'],
  '17-3-parallel-circuits': ['parallel-circuit'],
  '17-4-action-and-use-of-circuit-components': ['circuit-17-4'],
  '17-5-electrical-safety': ['circuit-17-5'],
  '18-1-electromagnetic-induction': ['induction-magnet-solenoid', 'faraday-iron-ring', 'induced-emf-time'],
  '18-2-the-a-c-generator': ['ac-generator-schematic', 'generator-voltage-time', 'flemings-right-hand'],
  '18-3-magnetic-effect-of-a-current': ['wire-field-pattern', 'right-hand-grip-rule', 'solenoid-field'],
  '18-4-force-on-a-current-carrying-conductor': ['catapult-field', 'flemings-left-hand'],
  '18-5-the-d-c-motor': ['dc-motor-schematic'],
  '18-6-the-transformer': ['transformer-structure', 'grid-transmission', 'transformer-voltage-waves'],
  '19-1-the-atom': ['atom-structure'],
  '19-2-the-nucleus': ['atom-structure'],
  '20-5-safety-precautions': ['radiation-safety-shielding'],
  '11-1-introducing-waves': ['wave-displacement'],
  '11-2-properties-of-wave-motion': ['wave-displacement', 'wave-displacement-time', 'cro-pitch'],
  '12-1-reflection-of-light': ['reflection-ray'],
  '12-2-refraction-of-light': ['refraction-ray'],
  '12-3-total-internal-reflection': ['tir-semicircle', 'optical-fibre', 'right-prism'],
  '13-1-electromagnetic-spectrum': ['em-spectrum'],
  '13-2-electromagnetic-radiation': ['em-spectrum'],
  '14-1-what-is-sound': ['sound-compression'],
  '14-2-transmission-of-sound': ['sound-compression'],
  '14-4-pitch-and-loudness': ['cro-pitch', 'cro-loudness'],
  '15-3-magnetic-field': ['magnetic-field'],
  '20-1-detection-of-radioactivity': ['geiger-setup'],
  '20-2-nuclear-emission': ['radiation-penetration', 'nuclear-decay'],
  '20-3-radioactive-decay': ['nuclear-decay'],
  '20-4-half-life': ['half-life-curve'],
  '21-1-the-earth': ['earth-day-night', 'earth-seasons'],
  '21-2-the-solar-system': ['solar-system-elliptical'],
  '22-1-the-sun-as-a-star': ['sun-stability', 'em-spectrum'],
  '22-2-stars': ['star-life-cycle', 'sun-stability'],
  '22-3-the-universe': ['hubble-graph', 'redshift-expansion'],
}

/** @deprecated Keyword injection removed — use TOPIC_DIAGRAMS only to avoid wrong graphs in subtopics. */
export const KEYWORD_DIAGRAMS = []
