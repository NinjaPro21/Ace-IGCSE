/** Inline SVG diagrams for IGCSE Mathematics 0580 notes. */

export function diagramWrap(caption, svg) {
  return `<div class="enlight-physics-diagram">${svg}<p class="enlight-physics-diagram__caption">${caption}</p></div>`
}

export const SNIPPETS = {
  'pythagoras-triangle': diagramWrap(
    'Right-angled triangle — $c$ is the hypotenuse (longest side, opposite the $90°$ angle). Use $a^2 + b^2 = c^2$.',
    `<svg viewBox="0 0 280 200" width="280" height="200" role="img" aria-label="Right triangle for Pythagoras">
      <polygon points="40,160 220,160 40,40" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <rect x="40" y="145" width="15" height="15" fill="none" stroke="#64748b"/>
      <text x="130" y="178" text-anchor="middle" font-size="12" fill="#2563eb">a</text>
      <text x="25" y="105" text-anchor="middle" font-size="12" fill="#2563eb">b</text>
      <text x="145" y="95" font-size="12" fill="#dc2626" font-weight="600">c (hyp)</text>
    </svg>`,
  ),

  'sohcahtoa-triangle': diagramWrap(
    'SOH CAH TOA — label opposite, adjacent, and hypotenuse relative to angle $\\theta$.',
    `<svg viewBox="0 0 300 200" width="300" height="200" role="img" aria-label="Trigonometry triangle labels">
      <polygon points="50,170 250,170 50,50" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <rect x="50" y="155" width="15" height="15" fill="none" stroke="#64748b"/>
      <path d="M70 170 A20 20 0 0 0 85 155" fill="none" stroke="#dc2626"/>
      <text x="78" y="162" font-size="11" fill="#dc2626">θ</text>
      <text x="150" y="188" font-size="11" fill="#2563eb">adjacent</text>
      <text x="28" y="120" font-size="11" fill="#16a34a">opposite</text>
      <text x="170" y="100" font-size="11" fill="#7c3aed" font-weight="600">hypotenuse</text>
    </svg>`,
  ),

  'bearing-diagram': diagramWrap(
    'Bearings — measured clockwise from North; always written as three digits (e.g. $045°$).',
    `<svg viewBox="0 0 240 240" width="240" height="240" role="img" aria-label="Bearing from North">
      <circle cx="120" cy="120" r="80" fill="none" stroke="#cbd5e1"/>
      <line x1="120" y1="120" x2="120" y2="30" stroke="#2563eb" stroke-width="2"/>
      <text x="120" y="22" text-anchor="middle" font-size="11" fill="#2563eb" font-weight="600">N</text>
      <line x1="120" y1="120" x2="185" y2="75" stroke="#dc2626" stroke-width="2.5"/>
      <path d="M120 95 A25 25 0 0 1 138 82" fill="none" stroke="#dc2626"/>
      <text x="145" y="88" font-size="11" fill="#dc2626">bearing</text>
      <circle cx="120" cy="120" r="4" fill="#64748b"/>
    </svg>`,
  ),

  'sector-diagram': diagramWrap(
    'Sector — fraction of circle area = $\\theta/360$; arc length = $(\\theta/360) \\times 2\\pi r$.',
    `<svg viewBox="0 0 240 220" width="240" height="220" role="img" aria-label="Circle sector">
      <circle cx="120" cy="110" r="70" fill="#f8fafc" stroke="#cbd5e1"/>
      <path d="M120 110 L120 40 A70 70 0 0 1 185 85 Z" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <text x="130" y="75" font-size="11" fill="#2563eb">θ</text>
      <text x="145" y="130" font-size="11" fill="#64748b">r</text>
      <line x1="120" y1="110" x2="120" y2="40" stroke="#64748b" stroke-dasharray="3 2"/>
    </svg>`,
  ),

  'circle-theorem-angle': diagramWrap(
    'Angle at centre — the angle at the centre is twice the angle at the circumference standing on the same arc.',
    `<svg viewBox="0 0 280 240" width="280" height="240" role="img" aria-label="Angle at centre theorem">
      <circle cx="140" cy="120" r="80" fill="#f8fafc" stroke="#64748b"/>
      <line x1="140" y1="120" x2="80" y2="170" stroke="#2563eb" stroke-width="2"/>
      <line x1="140" y1="120" x2="200" y2="170" stroke="#2563eb" stroke-width="2"/>
      <line x1="80" y1="170" x2="200" y2="170" stroke="#64748b"/>
      <circle cx="140" cy="120" r="4" fill="#dc2626"/>
      <circle cx="140" cy="170" r="4" fill="#16a34a"/>
      <text x="125" y="105" font-size="10" fill="#dc2626">2θ</text>
      <text x="145" y="185" font-size="10" fill="#16a34a">θ</text>
    </svg>`,
  ),

  'linear-graph-forms': diagramWrap(
    'Linear graphs — $y = mx + c$: gradient $m$ (steepness), intercept $c$ (crosses $y$-axis).',
    `<svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Linear graph y=mx+c">
      <line x1="40" y1="190" x2="290" y2="190" stroke="#64748b"/>
      <line x1="40" y1="190" x2="40" y2="30" stroke="#64748b"/>
      <line x1="60" y1="170" x2="260" y2="70" stroke="#2563eb" stroke-width="2.5"/>
      <circle cx="40" cy="150" r="4" fill="#dc2626"/>
      <text x="48" y="145" font-size="10" fill="#dc2626">c</text>
      <text x="180" y="110" font-size="10" fill="#2563eb">gradient m</text>
      <text x="160" y="210" font-size="11" fill="#475569">x</text>
      <text x="22" y="110" font-size="11" fill="#475569">y</text>
    </svg>`,
  ),

  'unit-circle-quadrants': diagramWrap(
    'CAST diagram — signs of sin, cos, tan in each quadrant (All, Sin, Tan, Cos positive).',
    `<svg viewBox="0 0 280 280" width="280" height="280" role="img" aria-label="CAST diagram">
      <circle cx="140" cy="140" r="90" fill="#f8fafc" stroke="#64748b"/>
      <line x1="50" y1="140" x2="230" y2="140" stroke="#94a3b8"/>
      <line x1="140" y1="50" x2="140" y2="230" stroke="#94a3b8"/>
      <text x="140" y="85" text-anchor="middle" font-size="14" fill="#16a34a" font-weight="700">S</text>
      <text x="195" y="145" font-size="14" fill="#2563eb" font-weight="700">C</text>
      <text x="140" y="200" text-anchor="middle" font-size="14" fill="#f59e0b" font-weight="700">T</text>
      <text x="75" y="145" text-anchor="middle" font-size="14" fill="#dc2626" font-weight="700">A</text>
      <text x="140" y="35" text-anchor="middle" font-size="10" fill="#64748b">All positive in Q1 (A)</text>
    </svg>`,
  ),

  'venn-two-set': diagramWrap(
    'Venn diagram — list elements in each region; $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$.',
    `<svg viewBox="0 0 320 180" width="320" height="180" role="img" aria-label="Two-set Venn diagram">
      <rect x="20" y="20" width="280" height="140" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
      <circle cx="130" cy="90" r="55" fill="#dbeafe" stroke="#2563eb" opacity="0.7"/>
      <circle cx="190" cy="90" r="55" fill="#fef3c7" stroke="#d97706" opacity="0.7"/>
      <text x="95" y="95" font-size="13" fill="#1e3a8a" font-weight="600">A</text>
      <text x="215" y="95" font-size="13" fill="#92400e" font-weight="600">B</text>
      <text x="160" y="95" text-anchor="middle" font-size="11" fill="#64748b">A∩B</text>
    </svg>`,
  ),

  'histogram-example': diagramWrap(
    'Histogram — bar area represents frequency; use frequency density = frequency ÷ class width on the $y$-axis.',
    `<svg viewBox="0 0 360 200" width="360" height="200" role="img" aria-label="Histogram with unequal class widths">
      <line x1="50" y1="170" x2="330" y2="170" stroke="#64748b"/>
      <line x1="50" y1="170" x2="50" y2="30" stroke="#64748b"/>
      <rect x="70" y="110" width="40" height="60" fill="#2563eb" opacity="0.7"/>
      <rect x="110" y="80" width="60" height="90" fill="#2563eb" opacity="0.7"/>
      <rect x="170" y="50" width="80" height="120" fill="#2563eb" opacity="0.7"/>
      <rect x="250" y="100" width="50" height="70" fill="#2563eb" opacity="0.7"/>
      <text x="180" y="190" text-anchor="middle" font-size="10" fill="#475569">class intervals</text>
      <text x="22" y="100" transform="rotate(-90 22 100)" text-anchor="middle" font-size="10" fill="#475569">freq. density</text>
    </svg>`,
  ),

  'quadratic-sketch': diagramWrap(
    'Quadratic graph $y = ax^2 + bx + c$ — U-shape if $a > 0$, ∩ if $a < 0$; roots where $y = 0$.',
    `<svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Quadratic parabola sketch">
      <line x1="40" y1="170" x2="290" y2="170" stroke="#64748b"/>
      <line x1="160" y1="30" x2="160" y2="190" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <path d="M70 170 Q160 30 250 170" fill="none" stroke="#2563eb" stroke-width="2.5"/>
      <circle cx="110" cy="170" r="4" fill="#dc2626"/><circle cx="210" cy="170" r="4" fill="#dc2626"/>
      <text x="110" y="185" text-anchor="middle" font-size="9" fill="#dc2626">root</text>
      <text x="165" y="50" font-size="10" fill="#2563eb">a &gt; 0</text>
    </svg>`,
  ),

  'number-line': diagramWrap(
    'Number line — negative numbers lie to the left of zero; moving right means increasing value.',
    `<svg viewBox="0 0 360 80" width="360" height="80" role="img" aria-label="Number line">
      <line x1="30" y1="40" x2="330" y2="40" stroke="#64748b" stroke-width="2"/>
      <polygon points="330,40 322,36 322,44" fill="#64748b"/>
      <line x1="180" y1="30" x2="180" y2="50" stroke="#dc2626" stroke-width="2"/>
      <text x="180" y="65" text-anchor="middle" font-size="11" fill="#dc2626">0</text>
      <text x="120" y="65" text-anchor="middle" font-size="10" fill="#2563eb">−3</text>
      <text x="240" y="65" text-anchor="middle" font-size="10" fill="#16a34a">+3</text>
    </svg>`,
  ),

  'sequence-pattern': diagramWrap(
    'Linear sequence — constant difference between terms; nth term $a + (n-1)d$.',
    `<svg viewBox="0 0 360 100" width="360" height="100" role="img" aria-label="Arithmetic sequence">
      <circle cx="60" cy="50" r="18" fill="#dbeafe" stroke="#2563eb"/><text x="60" y="54" text-anchor="middle" font-size="11">3</text>
      <circle cx="130" cy="50" r="18" fill="#dbeafe" stroke="#2563eb"/><text x="130" y="54" text-anchor="middle" font-size="11">7</text>
      <circle cx="200" cy="50" r="18" fill="#dbeafe" stroke="#2563eb"/><text x="200" y="54" text-anchor="middle" font-size="11">11</text>
      <circle cx="270" cy="50" r="18" fill="#dbeafe" stroke="#2563eb"/><text x="270" y="54" text-anchor="middle" font-size="11">15</text>
      <text x="95" y="30" text-anchor="middle" font-size="9" fill="#64748b">+4</text>
      <text x="165" y="30" text-anchor="middle" font-size="9" fill="#64748b">+4</text>
      <text x="235" y="30" text-anchor="middle" font-size="9" fill="#64748b">+4</text>
    </svg>`,
  ),

  'circle-parts': diagramWrap(
    'Circle — radius $r$ from centre to edge; diameter = $2r$; circumference = $2\\pi r$; area = $\\pi r^2$.',
    `<svg viewBox="0 0 220 220" width="220" height="220" role="img" aria-label="Circle radius and diameter">
      <circle cx="110" cy="110" r="70" fill="#f8fafc" stroke="#2563eb" stroke-width="2"/>
      <line x1="110" y1="110" x2="180" y2="110" stroke="#dc2626" stroke-width="2"/>
      <text x="145" y="100" font-size="11" fill="#dc2626">r</text>
      <line x1="40" y1="110" x2="180" y2="110" stroke="#64748b" stroke-dasharray="4 3"/>
      <text x="110" y="195" text-anchor="middle" font-size="10" fill="#64748b">diameter = 2r</text>
    </svg>`,
  ),

  'similar-triangles': diagramWrap(
    'Similar triangles — corresponding angles equal; lengths in ratio $k : 1$; areas in ratio $k^2 : 1$.',
    `<svg viewBox="0 0 320 180" width="320" height="180" role="img" aria-label="Similar triangles">
      <polygon points="40,150 120,150 40,70" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <polygon points="180,150 300,150 180,30" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="70" y="165" font-size="10" fill="#2563eb">small</text>
      <text x="230" y="165" font-size="10" fill="#d97706">large (×k)</text>
    </svg>`,
  ),

  'angle-types': diagramWrap(
    'Angle types — acute &lt; 90°, right = 90°, obtuse between 90° and 180°, reflex &gt; 180°.',
    `<svg viewBox="0 0 360 120" width="360" height="120" role="img" aria-label="Types of angles">
      <path d="M40 90 L100 90" stroke="#64748b"/><path d="M40 90 L75 50" stroke="#64748b"/>
      <text x="55" y="105" font-size="9" fill="#2563eb">acute</text>
      <path d="M150 90 L210 90" stroke="#64748b"/><path d="M150 90 L150 40" stroke="#64748b"/>
      <rect x="150" y="75" width="12" height="12" fill="none" stroke="#dc2626"/>
      <text x="165" y="105" font-size="9" fill="#dc2626">90°</text>
      <path d="M260 90 L320 90" stroke="#64748b"/><path d="M260 90 L290 55" stroke="#64748b"/>
      <text x="275" y="105" font-size="9" fill="#f59e0b">obtuse</text>
    </svg>`,
  ),

  'coordinate-plane': diagramWrap(
    'Coordinate plane — read $(x, y)$ from horizontal then vertical; gradient = rise ÷ run.',
    `<svg viewBox="0 0 280 240" width="280" height="240" role="img" aria-label="Coordinate plane">
      <line x1="140" y1="20" x2="140" y2="220" stroke="#94a3b8"/>
      <line x1="20" y1="120" x2="260" y2="120" stroke="#94a3b8"/>
      <circle cx="200" cy="70" r="5" fill="#2563eb"/>
      <line x1="200" y1="70" x2="200" y2="120" stroke="#64748b" stroke-dasharray="3 2"/>
      <line x1="140" y1="70" x2="200" y2="70" stroke="#64748b" stroke-dasharray="3 2"/>
      <text x="205" y="65" font-size="10" fill="#2563eb">(x, y)</text>
    </svg>`,
  ),

  'proportion-graph': diagramWrap(
    'Direct proportion — straight line through origin ($y = kx$); inverse proportion — hyperbola ($y = k/x$).',
    `<svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Direct and inverse proportion">
      <line x1="40" y1="190" x2="290" y2="190" stroke="#64748b"/>
      <line x1="40" y1="190" x2="40" y2="30" stroke="#64748b"/>
      <line x1="40" y1="190" x2="260" y2="50" stroke="#2563eb" stroke-width="2"/>
      <path d="M55 185 Q120 60 280 45" fill="none" stroke="#f59e0b" stroke-width="2"/>
      <text x="200" y="70" font-size="10" fill="#2563eb">y ∝ x</text>
      <text x="200" y="100" font-size="10" fill="#f59e0b">y ∝ 1/x</text>
    </svg>`,
  ),

  'cubic-sketch': diagramWrap(
    'Cubic graph — S-shape; can have up to three x-axis intercepts and two turning points.',
    `<svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Cubic curve sketch">
      <line x1="40" y1="170" x2="290" y2="170" stroke="#64748b"/>
      <line x1="160" y1="30" x2="160" y2="190" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <path d="M60 120 C100 200 120 20 160 100 S220 180 260 80" fill="none" stroke="#7c3aed" stroke-width="2.5"/>
    </svg>`,
  ),

  'reciprocal-sketch': diagramWrap(
    'Reciprocal graph $y = k/x$ — two branches; never crosses the axes.',
    `<svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Reciprocal graph">
      <line x1="160" y1="30" x2="160" y2="190" stroke="#94a3b8"/>
      <line x1="40" y1="110" x2="290" y2="110" stroke="#94a3b8"/>
      <path d="M180 40 Q220 110 180 180" fill="none" stroke="#dc2626" stroke-width="2"/>
      <path d="M140 40 Q100 110 140 180" fill="none" stroke="#dc2626" stroke-width="2"/>
    </svg>`,
  ),

  'distance-time-sketch': diagramWrap(
    'Distance–time graph — flat = stationary; straight slope = constant speed; curve = changing speed.',
    `<svg viewBox="0 0 320 200" width="320" height="200" role="img" aria-label="Distance time graph">
      <line x1="40" y1="170" x2="290" y2="170" stroke="#64748b"/>
      <line x1="40" y1="170" x2="40" y2="30" stroke="#64748b"/>
      <polyline fill="none" stroke="#2563eb" stroke-width="2.5" points="50,170 100,130"/>
      <path d="M100 130 Q150 120 200 80" fill="none" stroke="#2563eb" stroke-width="2.5"/>
      <polyline fill="none" stroke="#2563eb" stroke-width="2.5" points="200,80 270,80"/>
      <text x="130" y="185" font-size="10" fill="#475569">time</text>
    </svg>`,
  ),

  'tangent-gradient': diagramWrap(
    'Gradient of curve — draw tangent at a point; gradient = rise ÷ run (derivative at that x).',
    `<svg viewBox="0 0 320 200" width="320" height="200" role="img" aria-label="Tangent to curve">
      <line x1="40" y1="170" x2="290" y2="170" stroke="#64748b"/>
      <line x1="40" y1="170" x2="40" y2="30" stroke="#64748b"/>
      <path d="M60 150 Q160 30 260 90" fill="none" stroke="#2563eb" stroke-width="2"/>
      <line x1="120" y1="130" x2="220" y2="70" stroke="#dc2626" stroke-width="2"/>
      <circle cx="170" cy="100" r="4" fill="#dc2626"/>
      <text x="175" y="90" font-size="10" fill="#dc2626">tangent</text>
    </svg>`,
  ),

  'function-machine': diagramWrap(
    'Function machine — input $x$ maps to exactly one output $f(x)$.',
    `<svg viewBox="0 0 360 120" width="360" height="120" role="img" aria-label="Function machine">
      <rect x="120" y="35" width="120" height="50" rx="8" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <text x="180" y="65" text-anchor="middle" font-size="12" fill="#1e3a8a">f</text>
      <text x="60" y="65" font-size="11" fill="#64748b">x</text>
      <text x="300" y="65" font-size="11" fill="#64748b">f(x)</text>
      <line x1="75" y1="60" x2="115" y2="60" stroke="#64748b" marker-end="url(#fn)"/>
      <line x1="245" y1="60" x2="285" y2="60" stroke="#64748b" marker-end="url(#fn)"/>
      <defs><marker id="fn" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker></defs>
    </svg>`,
  ),

  'vector-addition': diagramWrap(
    'Vector addition — place tail of second vector at tip of first; resultant goes from start to finish.',
    `<svg viewBox="0 0 320 200" width="320" height="200" role="img" aria-label="Vector addition">
      <line x1="60" y1="150" x2="160" y2="80" stroke="#2563eb" stroke-width="2.5" marker-end="url(#va)"/>
      <line x1="160" y1="80" x2="240" y2="120" stroke="#16a34a" stroke-width="2.5" marker-end="url(#va)"/>
      <line x1="60" y1="150" x2="240" y2="120" stroke="#dc2626" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#va)"/>
      <text x="105" y="100" font-size="10" fill="#2563eb">a</text>
      <text x="205" y="95" font-size="10" fill="#16a34a">b</text>
      <text x="145" y="145" font-size="10" fill="#dc2626">a+b</text>
      <defs><marker id="va" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker></defs>
    </svg>`,
  ),

  'reflection-grid': diagramWrap(
    'Reflection — each point and its image are equidistant from the mirror line.',
    `<svg viewBox="0 0 240 240" width="240" height="240" role="img" aria-label="Reflection in a line">
      <line x1="120" y1="20" x2="120" y2="220" stroke="#64748b" stroke-dasharray="6 4"/>
      <polygon points="160,60 200,60 200,100" fill="#dbeafe" stroke="#2563eb"/>
      <polygon points="80,60 40,60 40,100" fill="#fef3c7" stroke="#d97706" stroke-dasharray="4 3"/>
      <text x="120" y="15" text-anchor="middle" font-size="10" fill="#64748b">mirror line</text>
    </svg>`,
  ),

  'scatter-plot': diagramWrap(
    'Scatter diagram — points show paired data; line of best fit shows trend (positive correlation if upward).',
    `<svg viewBox="0 0 320 200" width="320" height="200" role="img" aria-label="Scatter plot">
      <line x1="40" y1="170" x2="290" y2="170" stroke="#64748b"/>
      <line x1="40" y1="170" x2="40" y2="30" stroke="#64748b"/>
      <circle cx="70" cy="140" r="4" fill="#2563eb"/><circle cx="110" cy="120" r="4" fill="#2563eb"/>
      <circle cx="150" cy="100" r="4" fill="#2563eb"/><circle cx="190" cy="80" r="4" fill="#2563eb"/>
      <circle cx="230" cy="60" r="4" fill="#2563eb"/>
      <line x1="60" y1="155" x2="250" y2="45" stroke="#94a3b8" stroke-dasharray="4 3"/>
    </svg>`,
  ),

  'box-plot': diagramWrap(
    'Box plot — box from LQ to UQ; line inside = median; whiskers extend to min and max (or trimmed values).',
    `<svg viewBox="0 0 360 100" width="360" height="100" role="img" aria-label="Box plot">
      <line x1="40" y1="50" x2="320" y2="50" stroke="#64748b"/>
      <line x1="80" y1="35" x2="80" y2="65" stroke="#64748b"/>
      <line x1="280" y1="35" x2="280" y2="65" stroke="#64748b"/>
      <rect x="120" y="30" width="140" height="40" fill="#dbeafe" stroke="#2563eb"/>
      <line x1="190" y1="30" x2="190" y2="70" stroke="#dc2626" stroke-width="2"/>
      <text x="190" y="85" text-anchor="middle" font-size="9" fill="#64748b">median</text>
    </svg>`,
  ),

  'tree-diagram': diagramWrap(
    'Tree diagram — multiply along a branch; add probabilities of separate paths.',
    `<svg viewBox="0 0 320 180" width="320" height="180" role="img" aria-label="Probability tree">
      <circle cx="40" cy="90" r="6" fill="#64748b"/>
      <line x1="46" y1="70" x2="120" y2="50" stroke="#64748b"/>
      <line x1="46" y1="110" x2="120" y2="130" stroke="#64748b"/>
      <circle cx="120" cy="50" r="5" fill="#2563eb"/><text x="130" y="45" font-size="9">R</text>
      <circle cx="120" cy="130" r="5" fill="#f59e0b"/><text x="130" y="135" font-size="9">B</text>
      <line x1="126" y1="50" x2="200" y2="35" stroke="#64748b"/>
      <line x1="126" y1="50" x2="200" y2="65" stroke="#64748b"/>
      <text x="210" y="40" font-size="8" fill="#64748b">multiply</text>
    </svg>`,
  ),

  'intersecting-lines': diagramWrap(
    'Simultaneous equations — solution is the point where the two lines cross.',
    `<svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Intersecting lines">
      <line x1="40" y1="190" x2="290" y2="190" stroke="#64748b"/>
      <line x1="40" y1="190" x2="40" y2="30" stroke="#64748b"/>
      <line x1="60" y1="170" x2="260" y2="50" stroke="#2563eb" stroke-width="2"/>
      <line x1="60" y1="50" x2="260" y2="170" stroke="#16a34a" stroke-width="2"/>
      <circle cx="160" cy="110" r="5" fill="#dc2626"/>
      <text x="168" y="105" font-size="10" fill="#dc2626">solution</text>
    </svg>`,
  ),

  'number-line-inequality': diagramWrap(
    'Inequality on a number line — open circle for &lt; or &gt;; closed circle for ≤ or ≥; arrow shows direction.',
    `<svg viewBox="0 0 360 80" width="360" height="80" role="img" aria-label="Inequality on number line">
      <line x1="30" y1="40" x2="330" y2="40" stroke="#64748b" stroke-width="2"/>
      <circle cx="200" cy="40" r="8" fill="#fff" stroke="#2563eb" stroke-width="2"/>
      <line x1="200" y1="40" x2="300" y2="40" stroke="#2563eb" stroke-width="2.5" marker-end="url(#ineq)"/>
      <text x="200" y="65" text-anchor="middle" font-size="10" fill="#2563eb">x &gt; 2</text>
      <defs><marker id="ineq" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker></defs>
    </svg>`,
  ),

  'place-value-chart': diagramWrap(
    'Place value — each column is a power of 10; digits shift value by column position.',
    `<svg viewBox="0 0 360 100" width="360" height="100" role="img" aria-label="Place value chart">
      <rect x="40" y="30" width="60" height="40" fill="#dbeafe" stroke="#2563eb"/><text x="70" y="55" text-anchor="middle" font-size="14">1</text><text x="70" y="85" font-size="9" fill="#64748b">ones</text>
      <rect x="110" y="30" width="60" height="40" fill="#dbeafe" stroke="#2563eb"/><text x="140" y="55" text-anchor="middle" font-size="14">0</text><text x="140" y="85" font-size="9" fill="#64748b">tens</text>
      <rect x="180" y="30" width="60" height="40" fill="#dbeafe" stroke="#2563eb"/><text x="210" y="55" text-anchor="middle" font-size="14">3</text><text x="210" y="85" font-size="9" fill="#64748b">hundreds</text>
      <text x="180" y="20" text-anchor="middle" font-size="11" fill="#334155">302</text>
    </svg>`,
  ),

  'bidmas-order': diagramWrap(
    'Order of operations — Brackets, Indices, Division/Multiplication (left to right), Addition/Subtraction (left to right).',
    `<svg viewBox="0 0 360 80" width="360" height="80" role="img" aria-label="BIDMAS order">
      <rect x="20" y="25" width="55" height="35" rx="6" fill="#fecaca" stroke="#dc2626"/><text x="47" y="48" text-anchor="middle" font-size="10" font-weight="600">( )</text>
      <rect x="85" y="25" width="55" height="35" rx="6" fill="#fef3c7" stroke="#d97706"/><text x="112" y="48" text-anchor="middle" font-size="10" font-weight="600">x²</text>
      <rect x="150" y="25" width="55" height="35" rx="6" fill="#dbeafe" stroke="#2563eb"/><text x="177" y="48" text-anchor="middle" font-size="10" font-weight="600">÷ ×</text>
      <rect x="215" y="25" width="55" height="35" rx="6" fill="#bbf7d0" stroke="#16a34a"/><text x="242" y="48" text-anchor="middle" font-size="10" font-weight="600">+ −</text>
      <text x="290" y="48" font-size="10" fill="#64748b">→</text>
    </svg>`,
  ),

  'rounding-number-line': diagramWrap(
    'Rounding — identify the two labelled values; decide which is nearer (e.g. 3.47 → 3.5 to 1 d.p.).',
    `<svg viewBox="0 0 360 80" width="360" height="80" role="img" aria-label="Rounding on number line">
      <line x1="30" y1="40" x2="330" y2="40" stroke="#64748b" stroke-width="2"/>
      <line x1="80" y1="30" x2="80" y2="50" stroke="#64748b"/><text x="80" y="65" text-anchor="middle" font-size="10">3.4</text>
      <line x1="280" y1="30" x2="280" y2="50" stroke="#64748b"/><text x="280" y="65" text-anchor="middle" font-size="10">3.5</text>
      <circle cx="230" cy="40" r="6" fill="#2563eb"/>
      <text x="230" y="25" text-anchor="middle" font-size="9" fill="#2563eb">3.47</text>
    </svg>`,
  ),

  'index-laws': diagramWrap(
    'Index laws — multiply same base: add powers; divide: subtract powers; power of power: multiply powers.',
    `<svg viewBox="0 0 360 100" width="360" height="100" role="img" aria-label="Index laws">
      <text x="180" y="35" text-anchor="middle" font-size="12" fill="#334155">a^m × a^n = a^(m+n)</text>
      <text x="180" y="60" text-anchor="middle" font-size="12" fill="#334155">a^m ÷ a^n = a^(m−n)</text>
      <text x="180" y="85" text-anchor="middle" font-size="12" fill="#334155">(a^m)^n = a^(mn)</text>
    </svg>`,
  ),

  'standard-form-table': diagramWrap(
    'Standard form $a × 10^n$ — $1 ≤ a &lt; 10$; $n$ is the power of 10 (positive for large, negative for small).',
    `<svg viewBox="0 0 360 120" width="360" height="120" role="img" aria-label="Standard form examples">
      <text x="40" y="40" font-size="11" fill="#64748b">Large:</text><text x="100" y="40" font-size="12" fill="#2563eb">3.2 × 10^6</text>
      <text x="40" y="70" font-size="11" fill="#64748b">Small:</text><text x="100" y="70" font-size="12" fill="#2563eb">4.5 × 10^−4</text>
      <text x="40" y="100" font-size="10" fill="#64748b">a must be between 1 and 10</text>
    </svg>`,
  ),

  'surd-square': diagramWrap(
    'Surds — √50 = √(25×2) = 5√2; simplify by extracting perfect square factors.',
    `<svg viewBox="0 0 280 160" width="280" height="160" role="img" aria-label="Simplifying surds">
      <rect x="40" y="40" width="80" height="80" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <line x1="40" y1="80" x2="120" y2="80" stroke="#64748b" stroke-dasharray="4 3"/>
      <line x1="80" y1="40" x2="80" y2="120" stroke="#64748b" stroke-dasharray="4 3"/>
      <text x="60" y="70" font-size="10" fill="#2563eb">5</text><text x="95" y="105" font-size="10" fill="#2563eb">5</text>
      <text x="150" y="85" font-size="12" fill="#334155">area 50 → side √50 = 5√2</text>
    </svg>`,
  ),

  'bracket-area': diagramWrap(
    'Expanding brackets — area model: $(x+2)(x+3) = x² + 5x + 6$.',
    `<svg viewBox="0 0 280 200" width="280" height="200" role="img" aria-label="Area model for brackets">
      <rect x="60" y="50" width="80" height="80" fill="#dbeafe" stroke="#2563eb"/><text x="100" y="95" text-anchor="middle" font-size="11">x²</text>
      <rect x="140" y="50" width="40" height="80" fill="#fef3c7" stroke="#d97706"/><text x="160" y="95" text-anchor="middle" font-size="10">3x</text>
      <rect x="60" y="130" width="80" height="30" fill="#bbf7d0" stroke="#16a34a"/><text x="100" y="150" text-anchor="middle" font-size="10">2x</text>
      <rect x="140" y="130" width="40" height="30" fill="#fecaca" stroke="#dc2626"/><text x="160" y="150" text-anchor="middle" font-size="10">6</text>
    </svg>`,
  ),

  'balance-equation': diagramWrap(
    'Linear equations — keep the balance: do the same operation to both sides.',
    `<svg viewBox="0 0 320 120" width="320" height="120" role="img" aria-label="Balance model for equations">
      <line x1="160" y1="30" x2="160" y2="90" stroke="#64748b" stroke-width="3"/>
      <line x1="60" y1="50" x2="260" y2="50" stroke="#64748b" stroke-width="3"/>
      <rect x="80" y="55" width="50" height="25" fill="#dbeafe" stroke="#2563eb"/><text x="105" y="72" text-anchor="middle" font-size="10">2x+3</text>
      <rect x="200" y="55" width="40" height="25" fill="#fef3c7" stroke="#d97706"/><text x="220" y="72" text-anchor="middle" font-size="10">11</text>
    </svg>`,
  ),

  'pie-percentage': diagramWrap(
    'Percentages — slice size shows proportion of the whole; 25% = quarter of the circle.',
    `<svg viewBox="0 0 200 200" width="200" height="200" role="img" aria-label="Percentage pie chart">
      <circle cx="100" cy="100" r="70" fill="#f8fafc" stroke="#cbd5e1"/>
      <path d="M100 100 L100 30 A70 70 0 0 1 170 100 Z" fill="#2563eb" opacity="0.8"/>
      <text x="130" y="70" font-size="11" fill="#1e3a8a">25%</text>
    </svg>`,
  ),

  'map-scale-bar': diagramWrap(
    'Map scale — measure on the map, multiply by the scale factor to get real distance.',
    `<svg viewBox="0 0 360 100" width="360" height="100" role="img" aria-label="Map scale bar">
      <rect x="40" y="40" width="120" height="20" fill="#fef3c7" stroke="#d97706"/>
      <text x="100" y="55" text-anchor="middle" font-size="10" fill="#92400e">2 cm on map</text>
      <text x="200" y="55" font-size="14" fill="#64748b">→</text>
      <text x="280" y="55" text-anchor="middle" font-size="10" fill="#2563eb">1 km real</text>
      <text x="180" y="85" text-anchor="middle" font-size="10" fill="#64748b">scale 1 : 50 000</text>
    </svg>`,
  ),

  'cuboid-dimensions': diagramWrap(
    'Cuboid — volume = length × width × height; surface area = sum of areas of all six faces.',
    `<svg viewBox="0 0 280 200" width="280" height="200" role="img" aria-label="Cuboid dimensions">
      <polygon points="60,120 160,120 200,80 100,80" fill="#dbeafe" stroke="#2563eb"/>
      <polygon points="60,120 60,60 100,20 100,80" fill="#bfdbfe" stroke="#2563eb"/>
      <polygon points="100,80 100,20 200,20 200,80" fill="#93c5fd" stroke="#2563eb"/>
      <text x="130" y="135" font-size="10" fill="#2563eb">length</text>
      <text x="45" y="95" font-size="10" fill="#2563eb">h</text>
      <text x="150" y="55" font-size="10" fill="#2563eb">width</text>
    </svg>`,
  ),

  'line-symmetry': diagramWrap(
    'Line symmetry — fold line maps one half exactly onto the other; count lines of symmetry.',
    `<svg viewBox="0 0 240 200" width="240" height="200" role="img" aria-label="Line symmetry">
      <line x1="120" y1="20" x2="120" y2="180" stroke="#dc2626" stroke-dasharray="6 4"/>
      <polygon points="120,40 180,160 60,160" fill="#dbeafe" stroke="#2563eb"/>
      <text x="120" y="15" text-anchor="middle" font-size="10" fill="#dc2626">line of symmetry</text>
    </svg>`,
  ),

  'construction-arc': diagramWrap(
    'Constructions — use compass for arcs of equal radius to bisect an angle or construct 60°.',
    `<svg viewBox="0 0 240 200" width="240" height="200" role="img" aria-label="Construction arc">
      <line x1="40" y1="160" x2="200" y2="160" stroke="#64748b"/>
      <line x1="40" y1="160" x2="120" y2="40" stroke="#64748b"/>
      <path d="M40 160 A80 80 0 0 0 120 40" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M200 160 A80 80 0 0 1 120 40" fill="none" stroke="#2563eb" stroke-width="2"/>
      <circle cx="120" cy="40" r="4" fill="#dc2626"/>
    </svg>`,
  ),

  'cube-net': diagramWrap(
    'Net of a cube — six squares fold into a cube; opposite faces never share an edge in the net.',
    `<svg viewBox="0 0 240 200" width="240" height="200" role="img" aria-label="Cube net">
      <rect x="80" y="20" width="50" height="50" fill="#dbeafe" stroke="#2563eb"/>
      <rect x="80" y="70" width="50" height="50" fill="#bfdbfe" stroke="#2563eb"/>
      <rect x="30" y="70" width="50" height="50" fill="#bfdbfe" stroke="#2563eb"/>
      <rect x="130" y="70" width="50" height="50" fill="#bfdbfe" stroke="#2563eb"/>
      <rect x="80" y="120" width="50" height="50" fill="#bfdbfe" stroke="#2563eb"/>
      <rect x="80" y="170" width="50" height="50" fill="#bfdbfe" stroke="#2563eb"/>
    </svg>`,
  ),

  'algebraic-fraction': diagramWrap(
    'Algebraic fractions — factorise numerator and denominator, then cancel common factors.',
    `<svg viewBox="0 0 280 80" width="280" height="80" role="img" aria-label="Algebraic fraction">
      <text x="140" y="35" text-anchor="middle" font-size="14" fill="#334155">x² − 4</text>
      <line x1="80" y1="45" x2="200" y2="45" stroke="#64748b" stroke-width="2"/>
      <text x="140" y="65" text-anchor="middle" font-size="14" fill="#334155">x − 2</text>
      <text x="220" y="50" font-size="11" fill="#2563eb">→ x + 2</text>
    </svg>`,
  ),

  'formula-rearrange': diagramWrap(
    'Changing the subject — treat formula like balance; undo operations in reverse order on both sides.',
    `<svg viewBox="0 0 320 80" width="320" height="80" role="img" aria-label="Rearranging formula">
      <text x="160" y="35" text-anchor="middle" font-size="13" fill="#334155">v = u + at</text>
      <text x="160" y="60" text-anchor="middle" font-size="13" fill="#2563eb">a = (v − u) / t</text>
    </svg>`,
  ),

  'mean-bar-chart': diagramWrap(
    'Mean from grouped data — use midpoints × frequencies; sum ÷ total frequency.',
    `<svg viewBox="0 0 320 180" width="320" height="180" role="img" aria-label="Bar chart for mean">
      <line x1="40" y1="150" x2="290" y2="150" stroke="#64748b"/>
      <rect x="60" y="100" width="40" height="50" fill="#2563eb" opacity="0.7"/><text x="80" y="165" text-anchor="middle" font-size="9">10</text>
      <rect x="120" y="70" width="40" height="80" fill="#2563eb" opacity="0.7"/><text x="140" y="165" text-anchor="middle" font-size="9">20</text>
      <rect x="180" y="90" width="40" height="60" fill="#2563eb" opacity="0.7"/><text x="200" y="165" text-anchor="middle" font-size="9">30</text>
      <line x1="80" y1="95" x2="80" y2="105" stroke="#dc2626" stroke-width="2"/><text x="95" y="100" font-size="9" fill="#dc2626">mid</text>
    </svg>`,
  ),
}

export const TOPIC_DIAGRAMS = {
  '1-1-arithmetic': ['place-value-chart', 'bidmas-order'],
  '1-2-negative-numbers': ['number-line'],
  '1-3-number-facts': ['bidmas-order'],
  '1-4-sequences': ['sequence-pattern'],
  '1-5-approximations-and-estimation': ['rounding-number-line'],
  '1-6-8-4-indices': ['index-laws'],
  '1-7-standard-form': ['standard-form-table'],
  '1-8-surds': ['surd-square'],
  '2-1-substitution': ['function-machine'],
  '2-2-brackets-and-simplifying': ['bracket-area'],
  '2-3-2-4-linear-equations': ['balance-equation'],
  '2-5-2-6-simultaneous-equations': ['intersecting-lines'],
  '3-1-percentages-financial-maths-rates-and-time': ['pie-percentage'],
  '3-2-map-scales': ['map-scale-bar'],
  '4-1-pythagoras-theorem': ['pythagoras-triangle'],
  '4-2-trigonometry': ['sohcahtoa-triangle'],
  '4-3-4-5-bearings-scale-drawing': ['bearing-diagram', 'sohcahtoa-triangle'],
  '4-6-three-dimensional-trigonometry': ['pythagoras-triangle', 'sohcahtoa-triangle'],
  '5-1-5-2-area-circles': ['circle-parts'],
  '5-3-5-4-sector-segment-analysis': ['sector-diagram', 'circle-parts'],
  '5-5-5-6-volume-surface-area': ['cuboid-dimensions'],
  '5-7-similarity-length-area-volume-ratios': ['similar-triangles'],
  '6-1-factorising': ['quadratic-sketch'],
  '6-2-6-3-quadratic-equations': ['quadratic-sketch'],
  '6-4-nonlinear-simultaneous-equations': ['intersecting-lines', 'quadratic-sketch'],
  '7-1-angles': ['angle-types'],
  '7-2-symmetry': ['line-symmetry'],
  '7-3-circle-theorems': ['circle-theorem-angle', 'circle-parts'],
  '7-4-constructions': ['construction-arc'],
  '7-5-nets': ['cube-net'],
  '8-1-algebraic-fractions': ['algebraic-fraction'],
  '8-2-changing-the-subject': ['formula-rearrange'],
  '8-3-proportion': ['proportion-graph'],
  '8-5-inequalities': ['number-line-inequality'],
  '9-1-linear-graphs': ['linear-graph-forms'],
  '9-2-coordinate-geometry': ['coordinate-plane'],
  '9-3-equations-of-straight-lines': ['linear-graph-forms', 'coordinate-plane'],
  '9-4-plotting-curves': ['quadratic-sketch', 'cubic-sketch', 'reciprocal-sketch'],
  '9-5-interpreting-graphs': ['distance-time-sketch'],
  '9-6-graphical-solutions': ['cubic-sketch', 'intersecting-lines'],
  '9-7-differentiation': ['tangent-gradient'],
  '10-1-any-angle': ['unit-circle-quadrants'],
  '10-2-10-3-sine-cosine-rules': ['sohcahtoa-triangle'],
  '11-1-11-2-sets-venn-diagrams': ['venn-two-set'],
  '11-3-11-4-functions': ['function-machine'],
  '12-1-12-3-vectors': ['vector-addition'],
  '12-4-12-5-transformations': ['reflection-grid'],
  '13-1-13-3-data-displays-histograms': ['histogram-example'],
  '13-2-13-6-averages-comparison': ['mean-bar-chart'],
  '13-4-scatter-diagrams': ['scatter-plot'],
  '13-5-cumulative-frequency-box-plots': ['box-plot'],
  '14-1-14-3-probability-rules': ['venn-two-set'],
  '14-4-tree-diagrams': ['tree-diagram'],
  '14-5-14-6-advanced-probability': ['venn-two-set'],
}
