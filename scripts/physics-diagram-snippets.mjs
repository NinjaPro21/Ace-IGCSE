/** Reusable SVG diagram blocks for physics notes (embedded via rehype-raw). */

export function diagramWrap(caption, svg) {
  return `<div class="enlight-physics-diagram">${svg}<p class="enlight-physics-diagram__caption">${caption}</p></div>`
}

export const SNIPPETS = {
  'heating-curve': diagramWrap(
    'Heating curve — temperature plateaus during melting and boiling while energy is still supplied.',
    `<svg viewBox="0 0 420 220" width="420" height="220" role="img" aria-label="Heating curve">
      <line x1="50" y1="190" x2="390" y2="190" stroke="#888" stroke-width="1.5"/>
      <line x1="50" y1="190" x2="50" y2="30" stroke="#888" stroke-width="1.5"/>
      <text x="200" y="212" text-anchor="middle" font-size="12" fill="#666">Time</text>
      <text x="18" y="110" transform="rotate(-90 18 110)" text-anchor="middle" font-size="12" fill="#666">Temperature</text>
      <polyline fill="none" stroke="#2a7a5f" stroke-width="2.5" points="60,170 110,130 110,110 170,110 170,70 260,70 260,50 340,50"/>
      <text x="95" y="125" font-size="10" fill="#2a7a5f">melting</text>
      <text x="215" y="85" font-size="10" fill="#2a7a5f">boiling</text>
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
      <text x="325" y="85" font-size="10" fill="#f59e0b">refract (i &lt; c)</text>
      <text x="345" y="155" font-size="10" fill="#16a34a">graze (i = c)</text>
      <text x="95" y="95" font-size="10" fill="#dc2626">TIR (i &gt; c)</text>
      <text x="205" y="35" font-size="10" fill="#64748b">normal</text>
    </svg>`,
  ),

  'optical-fibre': diagramWrap(
    'Optical fibre — light reflects repeatedly inside the high-index core at the core–cladding boundary.',
    `<svg viewBox="0 0 420 120" width="420" height="120" role="img" aria-label="Optical fibre">
      <rect x="30" y="35" width="360" height="50" rx="25" fill="#bfdbfe" stroke="#2563eb"/>
      <rect x="45" y="45" width="330" height="30" rx="15" fill="#dbeafe" stroke="#0284c7"/>
      <polyline fill="none" stroke="#f59e0b" stroke-width="2.5" points="55,60 110,45 165,60 220,45 275,60 330,45 385,60"/>
      <text x="210" y="25" text-anchor="middle" font-size="11" fill="#334155">cladding (lower n)</text>
      <text x="210" y="100" text-anchor="middle" font-size="11" fill="#334155">core (higher n)</text>
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
    `<svg viewBox="0 0 420 160" width="420" height="160" role="img" aria-label="CRO pitch comparison">
      <rect x="30" y="20" width="360" height="50" fill="#f8fafc" stroke="#cbd5e1"/>
      <path d="M40 45 Q55 25 70 45 T100 45 T130 45 T160 45 T190 45" fill="none" stroke="#2563eb" stroke-width="2"/>
      <text x="30" y="15" font-size="11" fill="#334155">High pitch (short period)</text>
      <rect x="30" y="90" width="360" height="50" fill="#f8fafc" stroke="#cbd5e1"/>
      <path d="M40 115 Q80 95 120 115 T200 115 T280 115 T360 115" fill="none" stroke="#16a34a" stroke-width="2"/>
      <text x="30" y="85" font-size="11" fill="#334155">Low pitch (long period)</text>
    </svg>`,
  ),

  'cro-loudness': diagramWrap(
    'C.R.O. traces — same frequency: taller peaks mean larger amplitude (louder sound).',
    `<svg viewBox="0 0 420 160" width="420" height="160" role="img" aria-label="CRO loudness comparison">
      <line x1="30" y1="70" x2="390" y2="70" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <path d="M40 70 Q70 20 100 70 T160 70 T220 70 T280 70 T340 70 T390 70" fill="none" stroke="#dc2626" stroke-width="2.5"/>
      <text x="30" y="15" font-size="11" fill="#334155">Loud (large amplitude)</text>
      <line x1="30" y1="140" x2="390" y2="140" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <path d="M40 140 Q70 120 100 140 T160 140 T220 140 T280 140 T340 140 T390 140" fill="none" stroke="#2563eb" stroke-width="2"/>
      <text x="30" y="105" font-size="11" fill="#334155">Soft (small amplitude)</text>
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
    'Displacement–distance graph — wavelength λ is peak-to-peak distance; amplitude A is maximum displacement.',
    `<svg viewBox="0 0 420 160" width="420" height="160" role="img" aria-label="Wave displacement graph">
      <line x1="30" y1="80" x2="390" y2="80" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <path d="M40 80 Q70 30 100 80 T160 80 T220 80 T280 80 T340 80 T400 80" fill="none" stroke="#2563eb" stroke-width="2.5"/>
      <line x1="100" y1="80" x2="100" y2="30" stroke="#dc2626" stroke-width="1.5"/>
      <line x1="100" y1="30" x2="220" y2="30" stroke="#16a34a" stroke-width="1.5"/>
      <text x="160" y="22" text-anchor="middle" font-size="11" fill="#16a34a">λ</text>
      <text x="108" y="55" font-size="11" fill="#dc2626">A</text>
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
    'Velocity–time with air resistance — curve steep at first, then a flat horizontal line at terminal velocity (weight = air resistance; acceleration = 0).',
    `<svg viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Terminal velocity graph">
      <line x1="55" y1="195" x2="400" y2="195" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="195" x2="55" y2="25" stroke="#64748b" stroke-width="1.5"/>
      <text x="230" y="218" text-anchor="middle" font-size="12" fill="#475569">Time</text>
      <text x="20" y="110" transform="rotate(-90 20 110)" text-anchor="middle" font-size="12" fill="#475569">Velocity</text>
      <path d="M65 195 Q120 150 170 110 Q190 95 200 85" fill="none" stroke="#2563eb" stroke-width="2.5"/>
      <line x1="200" y1="85" x2="360" y2="85" stroke="#2563eb" stroke-width="2.5"/>
      <text x="280" y="78" font-size="10" fill="#2563eb">terminal velocity</text>
      <text x="115" y="145" font-size="10" fill="#64748b">decreasing acceleration</text>
      <text x="280" y="100" font-size="9" fill="#64748b">a = 0</text>
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
    `<svg viewBox="0 0 420 180" width="420" height="180" role="img" aria-label="Collision before and after">
      <text x="210" y="22" text-anchor="middle" font-size="11" fill="#334155">Before collision</text>
      <rect x="40" y="45" width="45" height="35" rx="4" fill="#dbeafe" stroke="#2563eb"/>
      <text x="62" y="67" text-anchor="middle" font-size="10" fill="#1e3a8a">m₁</text>
      <line x1="95" y1="62" x2="155" y2="62" stroke="#2563eb" stroke-width="2.5" marker-end="url(#cu)"/>
      <text x="125" y="55" font-size="10" fill="#2563eb">u₁</text>
      <rect x="170" y="45" width="45" height="35" rx="4" fill="#bbf7d0" stroke="#16a34a"/>
      <text x="192" y="67" text-anchor="middle" font-size="10" fill="#166534">m₂</text>
      <line x1="225" y1="62" x2="285" y2="62" stroke="#16a34a" stroke-width="2.5" marker-end="url(#cu)"/>
      <text x="255" y="55" font-size="10" fill="#16a34a">u₂</text>
      <text x="210" y="105" text-anchor="middle" font-size="11" fill="#334155">After collision</text>
      <rect x="60" y="125" width="45" height="35" rx="4" fill="#dbeafe" stroke="#2563eb"/>
      <line x1="115" y1="142" x2="175" y2="142" stroke="#dc2626" stroke-width="2.5" marker-end="url(#cv)"/>
      <text x="145" y="135" font-size="10" fill="#dc2626">v₁</text>
      <rect x="220" y="125" width="45" height="35" rx="4" fill="#bbf7d0" stroke="#16a34a"/>
      <line x1="275" y1="142" x2="335" y2="142" stroke="#dc2626" stroke-width="2.5" marker-end="url(#cv)"/>
      <text x="305" y="135" font-size="10" fill="#dc2626">v₂</text>
      <defs>
        <marker id="cu" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker>
        <marker id="cv" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/></marker>
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

  'series-circuit': diagramWrap(
    'Series circuit — one path for current; same current through each component.',
    `<svg viewBox="0 0 360 140" width="360" height="140" role="img" aria-label="Series circuit">
      <rect x="40" y="50" width="280" height="60" fill="none" stroke="#334155" stroke-width="2"/>
      <rect x="70" y="65" width="40" height="30" fill="#fef08a" stroke="#ca8a04"/>
      <text x="90" y="84" text-anchor="middle" font-size="9" fill="#854d0e">cell</text>
      <circle cx="180" cy="80" r="18" fill="#fef3c7" stroke="#f59e0b"/>
      <text x="180" y="84" text-anchor="middle" font-size="9" fill="#92400e">lamp</text>
      <rect x="250" y="65" width="40" height="30" fill="#e2e8f0" stroke="#64748b"/>
      <text x="270" y="84" text-anchor="middle" font-size="9" fill="#334155">R</text>
      <text x="180" y="130" text-anchor="middle" font-size="10" fill="#475569">single loop — same I everywhere</text>
    </svg>`,
  ),

  'parallel-circuit': diagramWrap(
    'Parallel circuit — current splits; potential difference same across each branch.',
    `<svg viewBox="0 0 360 160" width="360" height="160" role="img" aria-label="Parallel circuit">
      <rect x="40" y="30" width="280" height="100" fill="none" stroke="#334155" stroke-width="2"/>
      <rect x="55" y="65" width="35" height="25" fill="#fef08a" stroke="#ca8a04"/>
      <line x1="120" y1="50" x2="120" y2="110" stroke="#334155" stroke-width="2"/>
      <line x1="240" y1="50" x2="240" y2="110" stroke="#334155" stroke-width="2"/>
      <circle cx="180" cy="50" r="14" fill="#fef3c7" stroke="#f59e0b"/>
      <circle cx="180" cy="110" r="14" fill="#fef3c7" stroke="#f59e0b"/>
      <text x="180" y="145" text-anchor="middle" font-size="10" fill="#475569">branches — same p.d. across each</text>
    </svg>`,
  ),

  'convection-cell': diagramWrap(
    'Convection — heated fluid rises, cools, and sinks; sets up a convection current.',
    `<svg viewBox="0 0 280 200" width="280" height="200" role="img" aria-label="Convection current">
      <rect x="60" y="40" width="160" height="120" fill="#fef3c7" stroke="#ca8a04" opacity="0.4"/>
      <rect x="60" y="140" width="160" height="20" fill="#dc2626" opacity="0.5"/>
      <text x="140" y="155" text-anchor="middle" font-size="9" fill="#991b1b">heat source</text>
      <path d="M100 130 Q100 70 140 50 Q180 70 180 130" fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#conv)"/>
      <text x="140" y="35" text-anchor="middle" font-size="10" fill="#2563eb">hot fluid rises</text>
      <text x="200" y="100" font-size="10" fill="#64748b">cools &amp; sinks</text>
      <defs><marker id="conv" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker></defs>
    </svg>`,
  ),

  'magnetic-field': diagramWrap(
    'Magnetic field lines — leave the N pole and enter the S pole; lines show direction and strength.',
    `<svg viewBox="0 0 320 160" width="320" height="160" role="img" aria-label="Magnetic field between poles">
      <rect x="40" y="50" width="30" height="60" fill="#fecaca" stroke="#dc2626"/>
      <text x="55" y="85" text-anchor="middle" font-size="12" fill="#991b1b">N</text>
      <rect x="250" y="50" width="30" height="60" fill="#bfdbfe" stroke="#2563eb"/>
      <text x="265" y="85" text-anchor="middle" font-size="12" fill="#1e3a8a">S</text>
      <path d="M75 60 Q160 30 245 60" fill="none" stroke="#64748b" stroke-width="1.5" marker-end="url(#mf)"/>
      <path d="M75 80 Q160 80 245 80" fill="none" stroke="#64748b" stroke-width="1.5" marker-end="url(#mf)"/>
      <path d="M75 100 Q160 130 245 100" fill="none" stroke="#64748b" stroke-width="1.5" marker-end="url(#mf)"/>
      <defs><marker id="mf" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker></defs>
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
    'Specific heat capacity experiment — electrical energy $IVt$ raises the block temperature; measure $m$ and $\\Delta\\theta$ to find $c$.',
    `<svg viewBox="0 0 360 220" width="360" height="220" role="img" aria-label="Specific heat capacity experiment">
      <rect x="110" y="70" width="140" height="90" rx="8" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
      <rect x="125" y="85" width="18" height="60" rx="4" fill="#ef4444"/>
      <text x="134" y="118" text-anchor="middle" font-size="8" fill="#fff" font-weight="700">H</text>
      <rect x="220" y="85" width="10" height="60" rx="3" fill="#2563eb"/>
      <circle cx="225" cy="78" r="6" fill="#2563eb"/>
      <text x="180" y="190" text-anchor="middle" font-size="10" fill="#334155" font-weight="600">ΔE = IVt = mcΔθ</text>
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
    'V–I graph — ohmic conductor: straight line through origin; gradient = resistance $R = V/I$.',
    `<svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="V-I graph for ohmic conductor">
      <line x1="50" y1="190" x2="290" y2="190" stroke="#64748b" stroke-width="1.5"/>
      <line x1="50" y1="190" x2="50" y2="30" stroke="#64748b" stroke-width="1.5"/>
      <text x="170" y="210" text-anchor="middle" font-size="11" fill="#475569">Current I</text>
      <text x="22" y="110" transform="rotate(-90 22 110)" text-anchor="middle" font-size="11" fill="#475569">Voltage V</text>
      <line x1="50" y1="190" x2="260" y2="50" stroke="#2563eb" stroke-width="2.5"/>
      <text x="200" y="100" font-size="10" fill="#2563eb">gradient = R</text>
    </svg>`,
  ),

  'converging-lens': diagramWrap(
    'Converging lens — parallel rays refract to meet at the principal focus $F$.',
    `<svg viewBox="0 0 360 200" width="360" height="200" role="img" aria-label="Converging lens ray diagram">
      <line x1="20" y1="100" x2="340" y2="100" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <ellipse cx="180" cy="100" rx="12" ry="70" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <line x1="60" y1="60" x2="168" y2="95" stroke="#f59e0b" stroke-width="2"/>
      <line x1="168" y1="95" x2="280" y2="100" stroke="#f59e0b" stroke-width="2"/>
      <line x1="60" y1="140" x2="168" y2="105" stroke="#f59e0b" stroke-width="2"/>
      <line x1="168" y1="105" x2="280" y2="100" stroke="#f59e0b" stroke-width="2"/>
      <circle cx="280" cy="100" r="4" fill="#dc2626"/>
      <text x="285" y="95" font-size="10" fill="#dc2626">F</text>
    </svg>`,
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
    'Bar magnet — field lines leave the N pole and enter the S pole; unlike poles attract, like poles repel.',
    `<svg viewBox="0 0 320 120" width="320" height="120" role="img" aria-label="Bar magnet field lines">
      <rect x="80" y="45" width="70" height="30" rx="4" fill="#fecaca" stroke="#dc2626"/>
      <text x="115" y="65" text-anchor="middle" font-size="12" fill="#991b1b" font-weight="600">N</text>
      <rect x="150" y="45" width="70" height="30" rx="4" fill="#bfdbfe" stroke="#2563eb"/>
      <text x="185" y="65" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="600">S</text>
      <path d="M80 50 Q160 15 220 50" fill="none" stroke="#64748b" stroke-width="1.5"/>
      <path d="M80 70 Q160 105 220 70" fill="none" stroke="#64748b" stroke-width="1.5"/>
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
  '5-3-the-principle-of-conservation-of-momentum': ['momentum-vector', 'collision-diagram'],
  '6-1-energy': ['energy-transfer'],
  '6-2-work': ['energy-transfer'],
  '6-3-energy-resources': ['energy-transfer'],
  '6-4-power': ['energy-transfer'],
  '7-1-pressure': ['pressure-depth'],
  '7-2-pressure-in-liquids': ['pressure-depth'],
  '8-1-the-states-of-matter': ['heating-curve', 'state-transitions'],
  '8-2-the-particle-model': ['particle-states', 'brownian-motion', 'particle-heating'],
  '8-3-gases-and-the-absolute-scale-of-temperature': ['heating-curve'],
  '9-1-thermal-expansion': ['expansion-order', 'ball-ring', 'expansion-gap', 'particle-heating'],
  '9-2-specific-heat-capacity': ['shc-lab', 'particle-heating'],
  '9-3-changes-of-state': ['heating-curve', 'state-transitions'],
  '10-1-transfer-of-thermal-energy': ['conduction-lattice', 'convection-cell', 'radiation-wave'],
  '10-2-conduction': ['conduction-lattice'],
  '10-4-radiation': ['radiation-wave'],
  '10-5-applications-and-consequences-of-thermal-energy-tran': ['convection-cell', 'radiation-wave'],
  '11-3-common-features-of-wave-behaviour': ['wave-displacement', 'reflection-ray'],
  '12-4-refraction-by-thin-lenses': ['converging-lens', 'refraction-ray'],
  '12-5-ray-diagrams-for-thin-converging-lenses': ['converging-lens'],
  '12-6-dispersion-of-light': ['dispersion-prism'],
  '13-3-electromagnetic-radiation-in-communication': ['em-spectrum', 'optical-fibre'],
  '14-3-echoes-and-ultrasound': ['echo-diagram'],
  '15-1-magnets-and-their-properties': ['bar-magnet'],
  '15-2-temporary-and-permanent-magnets': ['bar-magnet', 'magnetic-field'],
  '16-1-electric-charge': ['atom-structure'],
  '16-2-electric-field': ['atom-structure'],
  '16-4-electromotive-force-and-potential-difference': ['series-circuit'],
  '16-5-resistance': ['vi-graph'],
  '16-6-electrical-energy-and-electrical-power': ['vi-graph', 'series-circuit'],
  '17-1-circuit-diagrams-and-components': ['series-circuit', 'parallel-circuit'],
  '17-4-action-and-use-of-circuit-components': ['series-circuit'],
  '17-5-electrical-safety': ['series-circuit'],
  '18-1-electromagnetic-induction': ['induction-coil'],
  '18-2-the-a-c-generator': ['induction-coil', 'transformer'],
  '18-3-magnetic-effect-of-a-current': ['magnetic-field'],
  '18-4-force-on-a-current-carrying-conductor': ['magnetic-field'],
  '18-5-the-d-c-motor': ['magnetic-field'],
  '19-1-the-atom': ['atom-structure'],
  '19-2-the-nucleus': ['atom-structure', 'nuclear-decay'],
  '19-3-nuclear-fission-and-nuclear-fusion': ['nuclear-decay'],
  '20-5-safety-precautions': ['geiger-setup'],
  '10-3-convection': ['convection-cell'],
  '11-1-introducing-waves': ['wave-displacement'],
  '11-2-properties-of-wave-motion': ['wave-displacement', 'cro-pitch'],
  '12-1-reflection-of-light': ['reflection-ray'],
  '12-2-refraction-of-light': ['refraction-ray'],
  '12-3-total-internal-reflection': ['tir-semicircle', 'optical-fibre', 'right-prism'],
  '13-1-electromagnetic-spectrum': ['em-spectrum'],
  '13-2-electromagnetic-radiation': ['em-spectrum'],
  '14-1-what-is-sound': ['sound-compression'],
  '14-2-transmission-of-sound': ['sound-compression'],
  '14-4-pitch-and-loudness': ['cro-pitch', 'cro-loudness'],
  '15-3-magnetic-field': ['magnetic-field'],
  '16-3-electric-current': ['series-circuit'],
  '17-2-series-circuits': ['series-circuit'],
  '17-3-parallel-circuits': ['parallel-circuit'],
  '18-6-the-transformer': ['transformer'],
  '20-1-detection-of-radioactivity': ['geiger-setup'],
  '20-2-nuclear-emission': ['nuclear-decay'],
  '20-3-radioactive-decay': ['half-life-curve', 'nuclear-decay'],
  '20-4-half-life': ['half-life-curve'],
  '21-1-the-earth': ['em-spectrum'],
  '21-2-the-solar-system': ['em-spectrum'],
  '22-1-the-sun-as-a-star': ['em-spectrum'],
  '22-2-stars': ['em-spectrum'],
  '22-3-the-universe': ['em-spectrum'],
}

/** @deprecated Keyword injection removed — use TOPIC_DIAGRAMS only to avoid wrong graphs in subtopics. */
export const KEYWORD_DIAGRAMS = []
