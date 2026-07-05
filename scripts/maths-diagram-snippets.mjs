/** Inline SVG diagrams for IGCSE Mathematics 0580 notes. */

/** Muted palette — matches src/styles/tokens.css */
const C = {
  axis: '#a8a29e',
  grid: '#e8e2d8',
  line: '#5b8def',
  lineAlt: '#789671',
  accent: '#b59a73',
  label: '#6b6b6b',
  text: '#1a1a1a',
  eqFill: '#f5edd8',
  eqStroke: '#b59a73',
  eqFillAlt: '#fdfbf7',
}

export function diagramWrap(caption, svg) {
  // Markdown HTML blocks end at a blank line — keep diagram markup contiguous.
  const compact = String(svg).replace(/\n\s*\n/g, '\n').trim()
  return `<div class="enlight-physics-diagram">${compact}<p class="enlight-physics-diagram__caption">${caption}</p></div>`
}

function graphMap(viewW, viewH, pad, xMin, xMax, yMin, yMax) {
  const innerW = viewW - 2 * pad
  const innerH = viewH - 2 * pad
  return {
    toX: (x) => pad + ((x - xMin) / (xMax - xMin)) * innerW,
    toY: (y) => viewH - pad - ((y - yMin) / (yMax - yMin)) * innerH,
    pad,
    viewW,
    viewH,
  }
}

/** Side-by-side panel mapper (e.g. dual quadratic sketches in one SVG). */
function graphMapPanel(totalW, viewH, pad, panelIndex, panelCount, xMin, xMax, yMin, yMax) {
  const panelW = totalW / panelCount
  const innerW = panelW - 2 * pad
  const innerH = viewH - 2 * pad
  const offsetX = panelIndex * panelW
  return {
    toX: (x) => offsetX + pad + ((x - xMin) / (xMax - xMin)) * innerW,
    toY: (y) => viewH - pad - ((y - yMin) / (yMax - yMin)) * innerH,
    pad,
    offsetX,
    panelW,
    viewW: totalW,
    viewH,
  }
}

function axisLinesPanel(g, xMin, xMax, yMin, yMax) {
  const x0 = g.toX(0)
  const y0 = g.toY(0)
  const left = g.offsetX + g.pad
  const right = g.offsetX + g.panelW - g.pad
  return `<line x1="${left}" y1="${y0}" x2="${right}" y2="${y0}" stroke="${C.axis}"/>
      <line x1="${x0}" y1="${g.pad}" x2="${x0}" y2="${g.viewH - g.pad}" stroke="${C.axis}"/>`
}

function polylinePoints(fn, xMin, xMax, toX, toY, step = 0.15) {
  const pts = []
  for (let x = xMin; x <= xMax + 1e-9; x += step) {
    const y = fn(x)
    if (!Number.isFinite(y)) continue
    pts.push(`${toX(x).toFixed(1)},${toY(y).toFixed(1)}`)
  }
  return pts.join(' ')
}

function reciprocalBranchPoints(k, xMin, xMax, toX, toY, yMin, yMax, step = 0.12) {
  const pts = []
  for (let x = xMin; x <= xMax + 1e-9; x += step) {
    if (Math.abs(x) < 0.08) continue
    const y = k / x
    if (!Number.isFinite(y) || y < yMin || y > yMax) continue
    pts.push(`${toX(x).toFixed(1)},${toY(y).toFixed(1)}`)
  }
  return pts.join(' ')
}

function axisLines(g, xMin, xMax, yMin, yMax) {
  const x0 = g.toX(0)
  const y0 = g.toY(0)
  return `<line x1="${g.pad}" y1="${y0}" x2="${g.viewW - g.pad}" y2="${y0}" stroke="${C.axis}"/>
      <line x1="${x0}" y1="${g.pad}" x2="${x0}" y2="${g.viewH - g.pad}" stroke="${C.axis}"/>`
}

export const SNIPPETS = {
  'pythagoras-triangle': diagramWrap(
    'Right-angled triangle — $c$ is the hypotenuse (longest side, opposite the $90°$ angle). Use $a^2 + b^2 = c^2$.',
    `<svg viewBox="0 0 280 200" width="280" height="200" role="img" aria-label="Right triangle for Pythagoras">
      <polygon points="40,160 220,160 40,40" fill="${C.eqFill}" stroke="${C.line}" stroke-width="2"/>
      <rect x="40" y="145" width="15" height="15" fill="none" stroke="${C.axis}"/>
      <text x="130" y="178" text-anchor="middle" font-size="12" fill="${C.line}">a</text>
      <text x="25" y="105" text-anchor="middle" font-size="12" fill="${C.line}">b</text>
      <text x="145" y="95" font-size="12" fill="${C.accent}" font-weight="600">c (hyp)</text>
    </svg>`,
  ),

  'sohcahtoa-triangle': diagramWrap(
    'SOH CAH TOA — label opposite, adjacent, and hypotenuse relative to angle $\\theta$ (the acute angle, not the right angle).',
    `<svg viewBox="0 0 300 200" width="300" height="200" role="img" aria-label="Trigonometry triangle labels">
      <polygon points="50,170 250,170 50,50" fill="${C.eqFillAlt}" stroke="${C.eqStroke}" stroke-width="2"/>
      <rect x="50" y="155" width="15" height="15" fill="none" stroke="${C.axis}"/>
      <path d="M230 170 A20 20 0 0 1 238 155" fill="none" stroke="${C.accent}" stroke-width="1.5"/>
      <text x="212" y="158" font-size="12" fill="${C.accent}" font-weight="700">θ</text>
      <text x="150" y="188" text-anchor="middle" font-size="11" fill="${C.line}">adjacent</text>
      <text x="28" y="120" font-size="11" fill="${C.lineAlt}">opposite</text>
      <text x="170" y="100" font-size="11" fill="${C.line}" font-weight="600">hypotenuse</text>
    </svg>`,
  ),

  'bearing-diagram': diagramWrap(
    'Forward bearing — always measured clockwise from North, written as three digits (e.g. $045°$).',
    `<svg viewBox="0 0 260 260" width="260" height="260" role="img" aria-label="Forward bearing measured clockwise from North">
      <circle cx="130" cy="140" r="90" fill="none" stroke="${C.grid}"/>
      <line x1="130" y1="140" x2="130" y2="40" stroke="${C.line}" stroke-width="2"/>
      <text x="130" y="32" text-anchor="middle" font-size="12" fill="${C.line}" font-weight="700">N</text>
      <line x1="130" y1="140" x2="210" y2="90" stroke="${C.accent}" stroke-width="2.5"/>
      <path d="M130 70 A70 70 0 0 1 186 98" fill="none" stroke="${C.accent}" stroke-width="1.5"/>
      <text x="168" y="72" font-size="12" fill="${C.accent}" font-weight="700">θ</text>
      <text x="175" y="118" font-size="11" fill="${C.accent}">bearing</text>
      <circle cx="130" cy="140" r="4" fill="${C.axis}"/>
      <text x="130" y="250" text-anchor="middle" font-size="11" fill="${C.label}">Clockwise from North</text>
    </svg>`,
  ),

  'bearing-reverse': diagramWrap(
    'Reverse (back) bearing — draw a North line at $B$, then use $\\theta \\pm 180°$. Parallel North lines make co-interior angles easy to read.',
    `<svg viewBox="0 0 380 260" width="380" height="260" role="img" aria-label="Forward and reverse bearings with parallel North lines">
      <line x1="70" y1="210" x2="70" y2="30" stroke="${C.line}" stroke-width="2"/>
      <text x="70" y="22" text-anchor="middle" font-size="12" fill="${C.line}" font-weight="700">N</text>
      <line x1="290" y1="70" x2="290" y2="20" stroke="${C.line}" stroke-width="2"/>
      <text x="290" y="14" text-anchor="middle" font-size="12" fill="${C.line}" font-weight="700">N</text>
      <line x1="70" y1="210" x2="290" y2="70" stroke="${C.accent}" stroke-width="2.5"/>
      <circle cx="70" cy="210" r="4" fill="${C.axis}"/>
      <circle cx="290" cy="70" r="4" fill="${C.axis}"/>
      <text x="52" y="228" font-size="13" fill="${C.label}" font-weight="700">A</text>
      <text x="302" y="66" font-size="13" fill="${C.label}" font-weight="700">B</text>
      <!-- θ at A: clockwise from North to AB -->
      <path d="M70 160 A50 50 0 0 1 112 178" fill="none" stroke="${C.lineAlt}" stroke-width="2"/>
      <text x="92" y="152" font-size="13" fill="${C.lineAlt}" font-weight="700">θ</text>
      <!-- θ+180° at B: clockwise from North all the way to BA -->
      <path d="M290 30 A40 40 0 1 1 256 94" fill="none" stroke="${C.accent}" stroke-width="2"/>
      <text x="318" y="120" font-size="12" fill="${C.accent}" font-weight="700">θ+180°</text>
      <text x="190" y="248" text-anchor="middle" font-size="12" fill="${C.label}">A→B: θ · B→A: θ ± 180°</text>
    </svg>`,
  ),

  'bearing-two-leg': diagramWrap(
    'Two-leg journey — at the turn point, find the interior angle of triangle $PQR$ from the bearings, then use Pythagoras, SOH CAH TOA, or the cosine rule for the direct distance $PR$.',
    `<svg viewBox="0 0 340 290" width="340" height="290" role="img" aria-label="Two-leg journey and interior angle from bearings">
      <line x1="50" y1="190" x2="50" y2="28" stroke="${C.line}" stroke-width="1.5" stroke-dasharray="4 3"/>
      <text x="50" y="20" text-anchor="middle" font-size="12" fill="${C.line}" font-weight="700">N</text>
      <line x1="170" y1="120" x2="170" y2="28" stroke="${C.line}" stroke-width="1.5" stroke-dasharray="4 3"/>
      <text x="170" y="20" text-anchor="middle" font-size="12" fill="${C.line}" font-weight="700">N</text>
      <line x1="50" y1="190" x2="170" y2="120" stroke="${C.line}" stroke-width="2.5"/>
      <line x1="170" y1="120" x2="240" y2="241" stroke="${C.accent}" stroke-width="2.5"/>
      <circle cx="50" cy="190" r="4" fill="${C.axis}"/>
      <circle cx="170" cy="120" r="4" fill="${C.axis}"/>
      <circle cx="240" cy="241" r="4" fill="${C.axis}"/>
      <text x="34" y="208" font-size="13" fill="${C.label}" font-weight="700">P</text>
      <text x="182" y="112" font-size="13" fill="${C.label}" font-weight="700">Q</text>
      <text x="250" y="252" font-size="13" fill="${C.label}" font-weight="700">R</text>
      <path d="M50 145 A45 45 0 0 1 89 168" fill="none" stroke="${C.line}" stroke-width="2"/>
      <text x="72" y="142" font-size="12" fill="${C.line}" font-weight="700">060°</text>
      <path d="M170 75 A45 45 0 0 1 193 159" fill="none" stroke="${C.accent}" stroke-width="2"/>
      <text x="198" y="70" font-size="12" fill="${C.accent}" font-weight="700">150°</text>
      <path d="M148 133 A26 26 0 0 1 183 143" fill="none" stroke="${C.lineAlt}" stroke-width="2"/>
      <text x="148" y="162" font-size="13" fill="${C.lineAlt}" font-weight="700">90°</text>
      <text x="170" y="278" text-anchor="middle" font-size="12" fill="${C.label}">Interior angle at Q from the two bearings</text>
    </svg>`,
  ),



  'cuboid-space-diagonal': diagramWrap(
    'Cuboid space diagonal — find the base diagonal $d$ first, then the space diagonal $D$ in the vertical right triangle: $d = \\sqrt{x^2+y^2}$, $D = \\sqrt{d^2+h^2}$.',
    `<svg viewBox="0 0 340 250" width="340" height="250" role="img" aria-label="Cuboid with base diagonal and space diagonal">
      <polygon points="110,50 240,50 240,140 110,140" fill="${C.eqFillAlt}" stroke="${C.axis}" stroke-width="1.5"/>
      <polygon points="40,100 110,50 110,140 40,190" fill="${C.eqFill}" stroke="${C.line}" stroke-width="1.5"/>
      <polygon points="40,190 110,140 240,140 170,190" fill="#eef2ff" stroke="${C.line}" stroke-width="1.5"/>
      <line x1="40" y1="100" x2="170" y2="100" stroke="${C.line}" stroke-width="1.5"/>
      <line x1="170" y1="100" x2="240" y2="50" stroke="${C.line}" stroke-width="1.5"/>
      <line x1="170" y1="100" x2="170" y2="190" stroke="${C.line}" stroke-width="1.5"/>
      <!-- base diagonal d -->
      <line x1="40" y1="190" x2="240" y2="140" stroke="${C.lineAlt}" stroke-width="2" stroke-dasharray="5 3"/>
      <text x="100" y="178" font-size="13" fill="${C.lineAlt}" font-weight="700">d</text>
      <!-- space diagonal D -->
      <line x1="40" y1="190" x2="240" y2="50" stroke="${C.accent}" stroke-width="2.5"/>
      <text x="155" y="100" font-size="14" fill="${C.accent}" font-weight="700">D</text>
      <!-- height h -->
      <line x1="240" y1="50" x2="240" y2="140" stroke="${C.line}" stroke-width="2"/>
      <text x="252" y="100" font-size="13" fill="${C.line}" font-weight="700">h</text>
      <!-- right angle at back-right-bottom between d and h -->
      <path d="M240 128 L228 131 L228 143" fill="none" stroke="${C.accent}" stroke-width="2"/>

      <text x="95" y="208" font-size="12" fill="${C.line}" font-weight="600">x</text>
      <text x="185" y="172" font-size="12" fill="${C.line}" font-weight="600">y</text>
    </svg>`,
  ),

  'pyramid-3d-trig': diagramWrap(
    'Square pyramid — work in right triangle $VMA$: height $h = VM$, base half-diagonal $MA$, sloping edge $VA = \\sqrt{h^2+MA^2}$, elevation $\\tan\\alpha = h/MA$.',
    `<svg viewBox="0 0 380 300" width="380" height="300" role="img" aria-label="Square pyramid with right triangle VMA highlighted">
      <polygon points="60,175 160,220 300,175 200,130" fill="#f8fafc" stroke="${C.grid}" stroke-width="1.5"/>
      <line x1="180" y1="36" x2="60" y2="175" stroke="${C.grid}" stroke-width="1.5"/>
      <line x1="180" y1="36" x2="300" y2="175" stroke="${C.grid}" stroke-width="1.5"/>
      <line x1="180" y1="36" x2="200" y2="130" stroke="${C.grid}" stroke-width="1.5" stroke-dasharray="4 3"/>
      <polygon points="180,36 180,175 270,215" fill="${C.eqFill}" fill-opacity="0.55" stroke="none"/>
      <line x1="180" y1="36" x2="180" y2="175" stroke="${C.line}" stroke-width="2.5"/>
      <line x1="180" y1="175" x2="270" y2="215" stroke="${C.lineAlt}" stroke-width="2.5"/>
      <line x1="180" y1="36" x2="270" y2="215" stroke="${C.accent}" stroke-width="2.5"/>
      <path d="M180 163 L191 168 L191 180" fill="none" stroke="${C.line}" stroke-width="2"/>

      <circle cx="180" cy="36" r="4" fill="${C.axis}"/>
      <circle cx="180" cy="175" r="4" fill="${C.axis}"/>
      <circle cx="270" cy="215" r="4" fill="${C.axis}"/>
      <text x="192" y="30" font-size="15" fill="${C.label}" font-weight="700">V</text>
      <text x="152" y="180" font-size="15" fill="${C.label}" font-weight="700">M</text>
      <text x="280" y="232" font-size="15" fill="${C.label}" font-weight="700">A</text>
      <text x="148" y="110" font-size="15" fill="${C.line}" font-weight="700">h</text>
      <text x="218" y="206" font-size="14" fill="${C.lineAlt}" font-weight="700">MA</text>
      <text x="238" y="100" font-size="15" fill="${C.accent}" font-weight="700">VA</text>
      <path d="M248 205 A24 24 0 0 0 259 194" fill="none" stroke="${C.accent}" stroke-width="2"/>
      <text x="270" y="186" font-size="15" fill="${C.accent}" font-weight="700">α</text>

      <text x="190" y="280" text-anchor="middle" font-size="12" fill="${C.label}">Shaded = right triangle VMA used for lengths and angles</text>
    </svg>`,
  ),





  'sector-diagram': diagramWrap(
    'Sector — fraction of circle area = $\\theta/360$; arc length = $(\\theta/360) \\times 2\\pi r$.',
    `<svg viewBox="0 0 240 220" width="240" height="220" role="img" aria-label="Circle sector">
      <circle cx="120" cy="110" r="70" fill="${C.eqFillAlt}" stroke="${C.grid}"/>
      <path d="M120 110 L120 40 A70 70 0 0 1 185 85 Z" fill="${C.eqFill}" stroke="${C.line}" stroke-width="2"/>
      <text x="130" y="75" font-size="11" fill="${C.line}">θ</text>
      <text x="145" y="130" font-size="11" fill="${C.axis}">r</text>
      <line x1="120" y1="110" x2="120" y2="40" stroke="${C.axis}" stroke-dasharray="3 2"/>
    </svg>`,
  ),

  'circle-theorem-angle': diagramWrap(
    'Angle at centre — $\\angle AOC = 2 \\times \\angle ABC$; both stand on the same arc $AC$.',
    `<svg viewBox="0 0 280 260" width="280" height="260" role="img" aria-label="Angle at centre theorem"><circle cx="140" cy="130" r="85" fill="${C.eqFillAlt}" stroke="${C.axis}"/><line x1="140" y1="130" x2="70" y2="180" stroke="${C.line}" stroke-width="2"/><line x1="140" y1="130" x2="210" y2="180" stroke="${C.line}" stroke-width="2"/><line x1="70" y1="180" x2="140" y2="45" stroke="${C.lineAlt}" stroke-width="2"/><line x1="210" y1="180" x2="140" y2="45" stroke="${C.lineAlt}" stroke-width="2"/><path d="M140 130 L112 150 A32 32 0 0 0 168 150 Z" fill="${C.accent}" fill-opacity="0.3" stroke="${C.accent}" stroke-width="2"/><path d="M140 45 L128 66 A24 24 0 0 0 152 66 Z" fill="${C.lineAlt}" fill-opacity="0.3" stroke="${C.lineAlt}" stroke-width="2"/><circle cx="140" cy="130" r="4" fill="${C.accent}"/><circle cx="70" cy="180" r="4" fill="${C.line}"/><circle cx="210" cy="180" r="4" fill="${C.line}"/><circle cx="140" cy="45" r="4" fill="${C.lineAlt}"/><text x="152" y="120" font-size="11" fill="${C.accent}" font-weight="600">O</text><text x="52" y="198" font-size="11" fill="${C.line}">A</text><text x="218" y="198" font-size="11" fill="${C.line}">C</text><text x="148" y="38" font-size="11" fill="${C.lineAlt}">B</text><text x="140" y="175" text-anchor="middle" font-size="14" fill="${C.accent}" font-weight="700">2θ</text><text x="140" y="78" text-anchor="middle" font-size="14" fill="${C.lineAlt}" font-weight="700">θ</text></svg>`,
  ),

  'circle-theorem-same-segment': diagramWrap(
    'Angles in the same segment — angles standing on the same arc are equal ($\\angle ABC = \\angle ADC$).',
    `<svg viewBox="0 0 280 260" width="280" height="260" role="img" aria-label="Angles in the same segment"><circle cx="140" cy="130" r="85" fill="${C.eqFillAlt}" stroke="${C.axis}"/><line x1="60" y1="159" x2="98" y2="56" stroke="${C.line}" stroke-width="2"/><line x1="220" y1="159" x2="98" y2="56" stroke="${C.line}" stroke-width="2"/><line x1="60" y1="159" x2="182" y2="56" stroke="${C.lineAlt}" stroke-width="2"/><line x1="220" y1="159" x2="182" y2="56" stroke="${C.lineAlt}" stroke-width="2"/><path d="M92 73 A18 18 0 0 1 112 68" fill="none" stroke="${C.line}" stroke-width="2"/><path d="M168 68 A18 18 0 0 1 188 73" fill="none" stroke="${C.lineAlt}" stroke-width="2"/><circle cx="60" cy="159" r="4" fill="${C.line}"/><circle cx="220" cy="159" r="4" fill="${C.line}"/><circle cx="98" cy="56" r="4" fill="${C.line}"/><circle cx="182" cy="56" r="4" fill="${C.lineAlt}"/><text x="42" y="172" font-size="11" fill="${C.line}">A</text><text x="228" y="172" font-size="11" fill="${C.line}">C</text><text x="88" y="46" font-size="11" fill="${C.line}">B</text><text x="188" y="46" font-size="11" fill="${C.lineAlt}">D</text><text x="102" y="96" text-anchor="middle" font-size="13" fill="${C.line}" font-weight="700">θ</text><text x="178" y="96" text-anchor="middle" font-size="13" fill="${C.lineAlt}" font-weight="700">θ</text></svg>`,
  ),

  'circle-theorem-semicircle': diagramWrap(
    'Angle in a semicircle — the angle at the circumference standing on a diameter is $90°$.',
    `<svg viewBox="0 0 280 240" width="280" height="240" role="img" aria-label="Angle in a semicircle"><circle cx="140" cy="130" r="85" fill="${C.eqFillAlt}" stroke="${C.axis}"/><line x1="55" y1="130" x2="225" y2="130" stroke="${C.accent}" stroke-width="2.5"/><line x1="55" y1="130" x2="140" y2="45" stroke="${C.line}" stroke-width="2"/><line x1="225" y1="130" x2="140" y2="45" stroke="${C.line}" stroke-width="2"/><path d="M128 57 L140 69 L152 57" fill="none" stroke="${C.accent}" stroke-width="2"/><circle cx="140" cy="130" r="4" fill="${C.accent}"/><circle cx="55" cy="130" r="4" fill="${C.line}"/><circle cx="225" cy="130" r="4" fill="${C.line}"/><circle cx="140" cy="45" r="4" fill="${C.line}"/><text x="140" y="118" text-anchor="middle" font-size="11" fill="${C.accent}" font-weight="600">O</text><text x="40" y="125" font-size="11" fill="${C.line}">A</text><text x="230" y="125" font-size="11" fill="${C.line}">C</text><text x="148" y="38" font-size="11" fill="${C.line}">B</text><text x="140" y="150" text-anchor="middle" font-size="10" fill="${C.accent}">diameter</text><text x="140" y="92" text-anchor="middle" font-size="13" fill="${C.accent}" font-weight="700">90°</text></svg>`,
  ),

  'circle-theorem-cyclic-quad': diagramWrap(
    'Cyclic quadrilateral — opposite angles sum to $180°$ ($a + c = 180°$, $b + d = 180°$).',
    `<svg viewBox="0 0 280 260" width="280" height="260" role="img" aria-label="Cyclic quadrilateral"><circle cx="140" cy="130" r="85" fill="${C.eqFillAlt}" stroke="${C.axis}"/><polygon points="60,101 155,46 224,115 155,214" fill="${C.eqFill}" fill-opacity="0.45" stroke="${C.line}" stroke-width="2"/><circle cx="60" cy="101" r="4" fill="${C.line}"/><circle cx="155" cy="46" r="4" fill="${C.line}"/><circle cx="224" cy="115" r="4" fill="${C.line}"/><circle cx="155" cy="214" r="4" fill="${C.line}"/><text x="42" y="95" font-size="11" fill="${C.line}">A</text><text x="160" y="38" font-size="11" fill="${C.line}">B</text><text x="232" y="110" font-size="11" fill="${C.line}">C</text><text x="160" y="232" font-size="11" fill="${C.line}">D</text><text x="88" y="118" font-size="13" fill="${C.accent}" font-weight="700">a</text><text x="155" y="78" font-size="13" fill="${C.lineAlt}" font-weight="700">b</text><text x="188" y="138" font-size="13" fill="${C.accent}" font-weight="700">c</text><text x="128" y="178" font-size="13" fill="${C.lineAlt}" font-weight="700">d</text><text x="140" y="248" text-anchor="middle" font-size="10" fill="${C.label}">a + c = 180° ; b + d = 180°</text></svg>`,
  ),

  'circle-theorem-alternate-segment': diagramWrap(
    'Alternate segment — the angle between a tangent and a chord equals the angle in the alternate segment.',
    `<svg viewBox="0 0 300 270" width="300" height="270" role="img" aria-label="Alternate segment theorem"><circle cx="150" cy="140" r="80" fill="${C.eqFillAlt}" stroke="${C.axis}"/><line x1="70" y1="30" x2="70" y2="250" stroke="${C.accent}" stroke-width="2.5"/><line x1="70" y1="140" x2="219" y2="180" stroke="${C.line}" stroke-width="2.5"/><line x1="70" y1="140" x2="211" y2="89" stroke="${C.line}" stroke-width="1.5" opacity="0.4"/><line x1="219" y1="180" x2="211" y2="89" stroke="${C.lineAlt}" stroke-width="2"/><path d="M70 140 L70 166 L94 147 Z" fill="${C.accent}" fill-opacity="0.4" stroke="${C.accent}" stroke-width="2"/><path d="M211 89 L190 97 L213 111 Z" fill="${C.lineAlt}" fill-opacity="0.4" stroke="${C.lineAlt}" stroke-width="2"/><circle cx="70" cy="140" r="4" fill="${C.line}"/><circle cx="219" cy="180" r="4" fill="${C.line}"/><circle cx="211" cy="89" r="4" fill="${C.lineAlt}"/><text x="48" y="132" font-size="11" fill="${C.line}">A</text><text x="225" y="198" font-size="11" fill="${C.line}">B</text><text x="218" y="78" font-size="11" fill="${C.lineAlt}">C</text><text x="86" y="172" font-size="14" fill="${C.accent}" font-weight="700">θ</text><text x="192" y="112" font-size="14" fill="${C.lineAlt}" font-weight="700">θ</text><text x="78" y="42" font-size="10" fill="${C.accent}">tangent</text><text x="150" y="262" text-anchor="middle" font-size="10" fill="${C.label}">θ at A (tangent–chord AB) = θ at C (alternate segment)</text></svg>`,
  ),

  'circle-theorem-tangent-radius': diagramWrap(
    'Tangent–radius — a tangent is perpendicular to the radius at the point of contact ($90°$).',
    `<svg viewBox="0 0 280 240" width="280" height="240" role="img" aria-label="Tangent perpendicular to radius">
      <circle cx="140" cy="130" r="70" fill="${C.eqFillAlt}" stroke="${C.axis}"/>
      <line x1="140" y1="130" x2="210" y2="130" stroke="${C.line}" stroke-width="2.5"/>
      <line x1="210" y1="40" x2="210" y2="220" stroke="${C.accent}" stroke-width="2.5"/>
      <rect x="198" y="118" width="12" height="12" fill="none" stroke="${C.accent}"/>
      <circle cx="140" cy="130" r="4" fill="${C.line}"/>
      <circle cx="210" cy="130" r="4" fill="${C.accent}"/>
      <text x="125" y="125" font-size="11" fill="${C.line}">O</text>
      <text x="218" y="125" font-size="11" fill="${C.accent}">A</text>
      <text x="155" y="120" font-size="11" fill="${C.line}">r</text>
      <text x="220" y="55" font-size="10" fill="${C.accent}">tangent</text>
      <text x="175" y="115" font-size="12" fill="${C.accent}" font-weight="600">90°</text>
    </svg>`,
  ),

  'linear-graph-forms': diagramWrap(
    'Linear graphs — $y = mx + c$: gradient $m$ (steepness), intercept $c$ (crosses $y$-axis).',
    `<svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Linear graph y=mx+c">
      <line x1="40" y1="190" x2="290" y2="190" stroke="${C.axis}"/>
      <line x1="40" y1="190" x2="40" y2="30" stroke="${C.axis}"/>
      <line x1="40" y1="150" x2="260" y2="70" stroke="${C.line}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="40" y1="150" x2="40" y2="190" stroke="${C.accent}" stroke-width="3" opacity="0.35"/>
      <circle cx="40" cy="150" r="5" fill="${C.accent}"/>
      <text x="48" y="145" font-size="10" fill="${C.accent}">c</text>
      <text x="180" y="100" font-size="10" fill="${C.line}">gradient m</text>
      <text x="160" y="210" font-size="11" fill="${C.label}">x</text>
      <text x="22" y="110" font-size="11" fill="${C.label}">y</text>
    </svg>`,
  ),

  'unit-circle-quadrants': diagramWrap(
    'CAST / ASTC diagram — All positive in Q1, Sin in Q2, Tan in Q3, Cos in Q4.',
    `<svg viewBox="0 0 280 280" width="280" height="280" role="img" aria-label="CAST diagram with correct quadrant signs">
      <circle cx="140" cy="140" r="100" fill="${C.eqFillAlt}" stroke="${C.axis}" stroke-width="2"/>
      <line x1="30" y1="140" x2="250" y2="140" stroke="#57534e" stroke-width="1.5"/>
      <line x1="140" y1="30" x2="140" y2="250" stroke="#57534e" stroke-width="1.5"/>
      <text x="258" y="144" font-size="12" fill="#57534e" font-weight="700">x</text>
      <text x="144" y="26" font-size="12" fill="#57534e" font-weight="700">y</text>
      <text x="185" y="95" text-anchor="middle" font-size="22" fill="#047857" font-weight="800">A</text>
      <text x="185" y="112" text-anchor="middle" font-size="10" fill="${C.label}">All +</text>
      <text x="95" y="95" text-anchor="middle" font-size="22" fill="#047857" font-weight="800">S</text>
      <text x="95" y="112" text-anchor="middle" font-size="10" fill="${C.label}">Sin +</text>
      <text x="95" y="185" text-anchor="middle" font-size="22" fill="#047857" font-weight="800">T</text>
      <text x="95" y="202" text-anchor="middle" font-size="10" fill="${C.label}">Tan +</text>
      <text x="185" y="185" text-anchor="middle" font-size="22" fill="#047857" font-weight="800">C</text>
      <text x="185" y="202" text-anchor="middle" font-size="10" fill="${C.label}">Cos +</text>
      <text x="140" y="268" text-anchor="middle" font-size="11" fill="${C.label}">ASTC anticlockwise from Q1 (or CAST from Q4)</text>
    </svg>`,
  ),


  'venn-two-set': diagramWrap(
    'Venn diagram — list elements in each region; $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$.',
    `<svg viewBox="0 0 320 180" width="320" height="180" role="img" aria-label="Two-set Venn diagram">
      <rect x="20" y="20" width="280" height="140" rx="8" fill="${C.eqFillAlt}" stroke="${C.grid}"/>
      <circle cx="130" cy="90" r="55" fill="${C.eqFill}" stroke="${C.line}" opacity="0.7"/>
      <circle cx="190" cy="90" r="55" fill="${C.eqFillAlt}" stroke="${C.eqStroke}" opacity="0.7"/>
      <text x="95" y="95" font-size="13" fill="${C.text}" font-weight="600">A</text>
      <text x="215" y="95" font-size="13" fill="${C.text}" font-weight="600">B</text>
      <text x="160" y="95" text-anchor="middle" font-size="11" fill="${C.axis}">A∩B</text>
    </svg>`,
  ),

  'histogram-example': diagramWrap(
    'Histogram — bar area represents frequency; use frequency density = frequency ÷ class width on the $y$-axis.',
    `<svg viewBox="0 0 360 200" width="360" height="200" role="img" aria-label="Histogram with unequal class widths">
      <line x1="50" y1="170" x2="330" y2="170" stroke="${C.axis}"/>
      <line x1="50" y1="170" x2="50" y2="30" stroke="${C.axis}"/>
      <rect x="70" y="110" width="40" height="60" fill="${C.line}" opacity="0.7"/>
      <rect x="110" y="80" width="60" height="90" fill="${C.line}" opacity="0.7"/>
      <rect x="170" y="50" width="80" height="120" fill="${C.line}" opacity="0.7"/>
      <rect x="250" y="100" width="50" height="70" fill="${C.line}" opacity="0.7"/>
      <text x="180" y="190" text-anchor="middle" font-size="10" fill="${C.label}">class intervals</text>
      <text x="22" y="100" transform="rotate(-90 22 100)" text-anchor="middle" font-size="10" fill="${C.label}">freq. density</text>
    </svg>`,
  ),

  'quadratic-sketch': (() => {
    const g = graphMapPanel(640, 220, 40, 0, 2, -1, 5, -2, 10)
    const uPts = polylinePoints((x) => x * x - 4 * x + 3, -0.5, 4.5, g.toX, g.toY)
    const g2 = graphMapPanel(640, 220, 40, 1, 2, -1, 5, -6, 4)
    const nPts = polylinePoints((x) => -(x * x - 4 * x + 3), -0.5, 4.5, g2.toX, g2.toY)
    return diagramWrap(
      'Quadratic graph $y = ax^2 + bx + c$ — U-shape when $a > 0$ (left), ∩-shape when $a < 0$ (right); dots mark roots on the $x$-axis.',
      `<svg viewBox="0 0 640 220" width="640" height="220" role="img" aria-label="Quadratic graphs a positive and negative">
      <text x="160" y="22" text-anchor="middle" font-size="11" fill="${C.line}" font-weight="600">a &gt; 0 (U-shape)</text>
      ${axisLinesPanel(g, -1, 5, -2, 10)}
      <polyline points="${uPts}" fill="none" stroke="${C.line}" stroke-width="2.5"/>
      <circle cx="${g.toX(1)}" cy="${g.toY(0)}" r="4" fill="${C.accent}"/><circle cx="${g.toX(3)}" cy="${g.toY(0)}" r="4" fill="${C.accent}"/>
      <text x="${g.toX(1)}" y="${g.toY(0) + 14}" text-anchor="middle" font-size="8" fill="${C.accent}">root</text>
      <text x="${g.toX(3)}" y="${g.toY(0) + 14}" text-anchor="middle" font-size="8" fill="${C.accent}">root</text>
      <text x="480" y="22" text-anchor="middle" font-size="11" fill="${C.accent}" font-weight="600">a &lt; 0 (∩-shape)</text>
      ${axisLinesPanel(g2, -1, 5, -6, 4)}
      <polyline points="${nPts}" fill="none" stroke="${C.accent}" stroke-width="2.5"/>
      <circle cx="${g2.toX(1)}" cy="${g2.toY(0)}" r="4" fill="${C.accent}"/><circle cx="${g2.toX(3)}" cy="${g2.toY(0)}" r="4" fill="${C.accent}"/>
    </svg>`,
    )
  })(),

  'number-line': diagramWrap(
    'Number line — negative numbers lie to the left of zero; moving right means increasing value.',
    `<svg viewBox="0 0 360 80" width="360" height="80" role="img" aria-label="Number line">
      <line x1="30" y1="40" x2="330" y2="40" stroke="${C.axis}" stroke-width="2"/>
      <polygon points="330,40 322,36 322,44" fill="${C.axis}"/>
      <line x1="180" y1="30" x2="180" y2="50" stroke="${C.accent}" stroke-width="2"/>
      <text x="180" y="65" text-anchor="middle" font-size="11" fill="${C.accent}">0</text>
      <text x="120" y="65" text-anchor="middle" font-size="10" fill="${C.line}">−3</text>
      <text x="240" y="65" text-anchor="middle" font-size="10" fill="${C.lineAlt}">+3</text>
    </svg>`,
  ),

  'sequence-pattern': diagramWrap(
    'Linear sequence — constant difference between terms; nth term $a + (n-1)d$.',
    `<svg viewBox="0 0 360 100" width="360" height="100" role="img" aria-label="Arithmetic sequence">
      <circle cx="60" cy="50" r="18" fill="${C.eqFill}" stroke="${C.line}"/><text x="60" y="54" text-anchor="middle" font-size="11">3</text>
      <circle cx="130" cy="50" r="18" fill="${C.eqFill}" stroke="${C.line}"/><text x="130" y="54" text-anchor="middle" font-size="11">7</text>
      <circle cx="200" cy="50" r="18" fill="${C.eqFill}" stroke="${C.line}"/><text x="200" y="54" text-anchor="middle" font-size="11">11</text>
      <circle cx="270" cy="50" r="18" fill="${C.eqFill}" stroke="${C.line}"/><text x="270" y="54" text-anchor="middle" font-size="11">15</text>
      <text x="95" y="30" text-anchor="middle" font-size="9" fill="${C.axis}">+4</text>
      <text x="165" y="30" text-anchor="middle" font-size="9" fill="${C.axis}">+4</text>
      <text x="235" y="30" text-anchor="middle" font-size="9" fill="${C.axis}">+4</text>
    </svg>`,
  ),

  'circle-parts': diagramWrap(
    'Circle — radius $r$ from centre to edge; diameter = $2r$; circumference = $2\\pi r$; area = $\\pi r^2$.',
    `<svg viewBox="0 0 220 220" width="220" height="220" role="img" aria-label="Circle radius and diameter">
      <circle cx="110" cy="110" r="70" fill="${C.eqFillAlt}" stroke="${C.line}" stroke-width="2"/>
      <line x1="110" y1="110" x2="180" y2="110" stroke="${C.accent}" stroke-width="2"/>
      <text x="145" y="100" font-size="11" fill="${C.accent}">r</text>
      <line x1="40" y1="110" x2="180" y2="110" stroke="${C.axis}" stroke-dasharray="4 3"/>
      <text x="110" y="195" text-anchor="middle" font-size="10" fill="${C.axis}">diameter = 2r</text>
    </svg>`,
  ),

  'similar-triangles': diagramWrap(
    'Similar triangles — corresponding angles equal; lengths in ratio $k : 1$; areas in ratio $k^2 : 1$.',
    `<svg viewBox="0 0 320 180" width="320" height="180" role="img" aria-label="Similar triangles">
      <polygon points="40,150 120,150 40,70" fill="${C.eqFill}" stroke="${C.line}" stroke-width="2"/>
      <polygon points="180,150 300,150 180,30" fill="${C.eqFillAlt}" stroke="${C.eqStroke}" stroke-width="2"/>
      <text x="70" y="165" font-size="10" fill="${C.line}">small</text>
      <text x="230" y="165" font-size="10" fill="${C.eqStroke}">large (×k)</text>
    </svg>`,
  ),

  'angle-types': diagramWrap(
    'Angle types — acute under 90°, right = 90°, obtuse between 90° and 180°, reflex over 180°.',
    `<svg viewBox="0 0 520 150" width="520" height="150" role="img" aria-label="Types of angles"><line x1="20" y1="95" x2="105" y2="95" stroke="${C.axis}" stroke-width="2.5" stroke-linecap="round"/><line x1="20" y1="95" x2="72" y2="38" stroke="${C.axis}" stroke-width="2.5" stroke-linecap="round"/><path d="M48 95 A28 28 0 0 0 39 74" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-linecap="round"/><text x="58" y="78" font-size="11" fill="${C.line}" font-weight="700">50°</text><text x="52" y="125" text-anchor="middle" font-size="11" fill="${C.line}" font-weight="600">acute</text><text x="52" y="140" text-anchor="middle" font-size="9" fill="${C.label}">under 90°</text><line x1="150" y1="95" x2="235" y2="95" stroke="${C.axis}" stroke-width="2.5" stroke-linecap="round"/><line x1="150" y1="95" x2="150" y2="25" stroke="${C.axis}" stroke-width="2.5" stroke-linecap="round"/><rect x="150" y="83" width="12" height="12" fill="none" stroke="${C.accent}" stroke-width="2"/><text x="175" y="80" font-size="11" fill="${C.accent}" font-weight="700">90°</text><text x="180" y="125" text-anchor="middle" font-size="11" fill="${C.accent}" font-weight="600">right</text><text x="180" y="140" text-anchor="middle" font-size="9" fill="${C.label}">= 90°</text><line x1="270" y1="95" x2="355" y2="95" stroke="${C.axis}" stroke-width="2.5" stroke-linecap="round"/><line x1="270" y1="95" x2="222" y2="38" stroke="${C.axis}" stroke-width="2.5" stroke-linecap="round"/><path d="M298 95 A28 28 0 0 0 252 73" fill="none" stroke="${C.eqStroke}" stroke-width="2.5" stroke-linecap="round"/><text x="278" y="62" font-size="11" fill="${C.eqStroke}" font-weight="700">130°</text><text x="300" y="125" text-anchor="middle" font-size="11" fill="${C.eqStroke}" font-weight="600">obtuse</text><text x="300" y="140" text-anchor="middle" font-size="9" fill="${C.label}">90° to 180°</text><line x1="400" y1="95" x2="495" y2="95" stroke="${C.axis}" stroke-width="2.5" stroke-linecap="round"/><line x1="400" y1="95" x2="372" y2="48" stroke="${C.axis}" stroke-width="2.5" stroke-linecap="round"/><path d="M428 95 A28 28 0 1 1 386 70" fill="none" stroke="${C.lineAlt}" stroke-width="2.5" stroke-linecap="round"/><text x="462" y="108" font-size="11" fill="${C.lineAlt}" font-weight="700">240°</text><text x="445" y="125" text-anchor="middle" font-size="11" fill="${C.lineAlt}" font-weight="600">reflex</text><text x="445" y="140" text-anchor="middle" font-size="9" fill="${C.label}">over 180°</text></svg>`,
  ),

  'parallel-line-angles': diagramWrap(
    'Parallel lines — alternate (Z) angles equal, corresponding (F) angles equal, co-interior (C) angles sum to $180°$.',
    `<svg viewBox="0 0 360 220" width="360" height="220" role="img" aria-label="Angles with parallel lines"><line x1="30" y1="55" x2="330" y2="55" stroke="${C.axis}" stroke-width="2.5"/><line x1="30" y1="145" x2="330" y2="145" stroke="${C.axis}" stroke-width="2.5"/><line x1="70" y1="15" x2="290" y2="185" stroke="${C.line}" stroke-width="2.5" stroke-linecap="round"/><path d="M142 55 A20 20 0 0 1 138 67" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-linecap="round"/><path d="M218 145 A20 20 0 0 0 222 133" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-linecap="round"/><path d="M142 55 A20 20 0 0 0 106 43" fill="none" stroke="${C.accent}" stroke-width="2.5" stroke-linecap="round"/><path d="M258 145 A20 20 0 0 0 222 133" fill="none" stroke="${C.accent}" stroke-width="2.5" stroke-linecap="round"/><text x="160" y="82" font-size="14" fill="${C.line}" font-weight="700">a</text><text x="188" y="118" font-size="14" fill="${C.line}" font-weight="700">a</text><text x="128" y="32" font-size="14" fill="${C.accent}" font-weight="700">b</text><text x="272" y="122" font-size="14" fill="${C.accent}" font-weight="700">b</text><text x="20" y="50" font-size="12" fill="${C.label}">∥</text><text x="20" y="140" font-size="12" fill="${C.label}">∥</text><text x="180" y="205" text-anchor="middle" font-size="11" fill="${C.label}">a = alternate (Z) · b = corresponding (F)</text></svg>`,
  ),

  'coordinate-plane': diagramWrap(
    'Coordinate plane — read $(x, y)$ from horizontal then vertical; gradient = rise ÷ run.',
    `<svg viewBox="0 0 280 240" width="280" height="240" role="img" aria-label="Coordinate plane">
      <line x1="140" y1="20" x2="140" y2="220" stroke="${C.grid}"/>
      <line x1="20" y1="120" x2="260" y2="120" stroke="${C.grid}"/>
      <circle cx="200" cy="70" r="5" fill="${C.line}"/>
      <line x1="200" y1="70" x2="200" y2="120" stroke="${C.axis}" stroke-dasharray="3 2"/>
      <line x1="140" y1="70" x2="200" y2="70" stroke="${C.axis}" stroke-dasharray="3 2"/>
      <text x="205" y="65" font-size="10" fill="${C.line}">(x, y)</text>
    </svg>`,
  ),

  'line-segment-coords': diagramWrap(
    'Line segment — gradient $m = \\frac{y_2 - y_1}{x_2 - x_1}$; midpoint is the average of the coordinates.',
    `<svg viewBox="0 0 320 240" width="320" height="240" role="img" aria-label="Line segment on coordinate plane">
      <line x1="160" y1="20" x2="160" y2="220" stroke="${C.grid}"/>
      <line x1="20" y1="180" x2="300" y2="180" stroke="${C.grid}"/>
      <line x1="80" y1="200" x2="240" y2="80" stroke="${C.line}" stroke-width="2.5"/>
      <circle cx="80" cy="200" r="5" fill="${C.line}"/>
      <circle cx="240" cy="80" r="5" fill="${C.line}"/>
      <circle cx="160" cy="140" r="5" fill="${C.accent}"/>
      <text x="68" y="215" font-size="10" fill="${C.line}">(x₁, y₁)</text>
      <text x="248" y="75" font-size="10" fill="${C.line}">(x₂, y₂)</text>
      <text x="168" y="135" font-size="10" fill="${C.accent}">M</text>
      <line x1="80" y1="200" x2="160" y2="140" stroke="${C.axis}" stroke-dasharray="3 2"/>
      <line x1="160" y1="140" x2="160" y2="200" stroke="${C.axis}" stroke-dasharray="3 2"/>
      <text x="118" y="175" font-size="9" fill="${C.label}">rise</text>
      <text x="165" y="195" font-size="9" fill="${C.label}">run</text>
    </svg>`,
  ),

  'parallel-perpendicular-lines': diagramWrap(
    'Parallel lines share the same gradient; perpendicular lines have gradients that multiply to $-1$.',
    `<svg viewBox="0 0 640 220" width="640" height="220" role="img" aria-label="Parallel and perpendicular lines">
      <text x="160" y="22" text-anchor="middle" font-size="11" fill="${C.text}" font-weight="600">Parallel (same m)</text>
      <line x1="20" y1="190" x2="300" y2="190" stroke="${C.axis}"/>
      <line x1="20" y1="190" x2="20" y2="40" stroke="${C.axis}"/>
      <line x1="40" y1="170" x2="260" y2="90" stroke="${C.line}" stroke-width="2"/>
      <line x1="40" y1="130" x2="260" y2="50" stroke="${C.lineAlt}" stroke-width="2" stroke-dasharray="6 4"/>
      <text x="480" y="22" text-anchor="middle" font-size="11" fill="${C.text}" font-weight="600">Perpendicular (m₁m₂ = −1)</text>
      <line x1="340" y1="190" x2="620" y2="190" stroke="${C.axis}"/>
      <line x1="340" y1="190" x2="340" y2="40" stroke="${C.axis}"/>
      <line x1="360" y1="170" x2="580" y2="90" stroke="${C.line}" stroke-width="2"/>
      <line x1="360" y1="90" x2="580" y2="170" stroke="${C.lineAlt}" stroke-width="2"/>
      <rect x="368" y="162" width="12" height="12" fill="none" stroke="${C.accent}"/>
    </svg>`,
  ),

  'proportion-graph': diagramWrap(
    'Direct proportion — straight line through origin ($y = kx$); inverse proportion — hyperbola ($y = k/x$).',
    `<svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Direct and inverse proportion">
      <line x1="40" y1="190" x2="290" y2="190" stroke="${C.axis}"/>
      <line x1="40" y1="190" x2="40" y2="30" stroke="${C.axis}"/>
      <line x1="40" y1="190" x2="260" y2="50" stroke="${C.line}" stroke-width="2"/>
      <path d="M55 185 Q120 60 280 45" fill="none" stroke="${C.eqStroke}" stroke-width="2"/>
      <text x="200" y="70" font-size="10" fill="${C.line}">y ∝ x</text>
      <text x="200" y="100" font-size="10" fill="${C.eqStroke}">y ∝ 1/x</text>
    </svg>`,
  ),

  'cubic-sketch': (() => {
    const g = graphMap(320, 220, 40, -2.5, 2.5, -3, 3)
    const pts = polylinePoints((x) => x * x * x - 3 * x, -2, 2, g.toX, g.toY, 0.12)
    return diagramWrap(
      'Cubic graph — S-shape; can have up to three x-axis intercepts and two turning points.',
      `<svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Cubic curve sketch">
      ${axisLines(g, -2.5, 2.5, -3, 3)}
      <polyline points="${pts}" fill="none" stroke="${C.line}" stroke-width="2.5"/>
    </svg>`,
    )
  })(),

  'reciprocal-sketch': (() => {
    const g = graphMap(320, 220, 40, -5, 5, -5, 5)
    const pos = reciprocalBranchPoints(4, 0.35, 5, g.toX, g.toY, -5, 5)
    const neg = reciprocalBranchPoints(4, -5, -0.35, g.toX, g.toY, -5, 5)
    const x0 = g.toX(0)
    const y0 = g.toY(0)
    return diagramWrap(
      'Reciprocal graph $y = k/x$ — two branches in opposite quadrants; asymptotes at both axes.',
      `<svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Reciprocal graph">
      <line x1="${x0}" y1="${g.pad}" x2="${x0}" y2="${g.viewH - g.pad}" stroke="${C.grid}" stroke-dasharray="4 3"/>
      <line x1="${g.pad}" y1="${y0}" x2="${g.viewW - g.pad}" y2="${y0}" stroke="${C.grid}" stroke-dasharray="4 3"/>
      ${axisLines(g, -5, 5, -5, 5)}
      <polyline points="${pos}" fill="none" stroke="${C.line}" stroke-width="2.5"/>
      <polyline points="${neg}" fill="none" stroke="${C.line}" stroke-width="2.5"/>
      <text x="${x0 + 6}" y="${g.pad + 12}" font-size="9" fill="${C.label}">x = 0</text>
      <text x="${g.viewW - g.pad - 30}" y="${y0 - 6}" font-size="9" fill="${C.label}">y = 0</text>
    </svg>`,
    )
  })(),

  'distance-time-sketch': diagramWrap(
    'Distance–time graph — flat = stationary; straight slope = constant speed; curve = changing speed.',
    `<svg viewBox="0 0 320 200" width="320" height="200" role="img" aria-label="Distance time graph">
      <line x1="40" y1="170" x2="290" y2="170" stroke="${C.axis}"/>
      <line x1="40" y1="170" x2="40" y2="30" stroke="${C.axis}"/>
      <text x="22" y="100" font-size="10" fill="${C.label}">distance</text>
      <text x="160" y="195" font-size="10" fill="${C.label}">time</text>
      <polyline fill="none" stroke="${C.line}" stroke-width="2.5" points="50,170 100,130"/>
      <path d="M100 130 Q150 120 200 80" fill="none" stroke="${C.line}" stroke-width="2.5"/>
      <polyline fill="none" stroke="${C.line}" stroke-width="2.5" points="200,80 270,80"/>
      <text x="75" y="155" font-size="9" fill="${C.label}">steady speed</text>
      <text x="145" y="115" font-size="9" fill="${C.label}">accelerating</text>
      <text x="235" y="95" font-size="9" fill="${C.label}">stopped</text>
    </svg>`,
  ),

  'tangent-gradient': (() => {
    const g = graphMap(320, 200, 40, -0.5, 3, 0, 9)
    const curve = polylinePoints((x) => x * x, -0.5, 3, g.toX, g.toY)
    const px = 1
    const py = 1
    const slope = 2
    const xA = 0.2
    const xB = 2.2
    const yA = py + slope * (xA - px)
    const yB = py + slope * (xB - px)
    return diagramWrap(
      'Gradient of curve — draw tangent at a point; gradient = rise ÷ run (derivative at that $x$).',
      `<svg viewBox="0 0 320 200" width="320" height="200" role="img" aria-label="Tangent to curve">
      ${axisLines(g, -0.5, 3, 0, 9)}
      <polyline points="${curve}" fill="none" stroke="${C.line}" stroke-width="2.5"/>
      <line x1="${g.toX(xA)}" y1="${g.toY(yA)}" x2="${g.toX(xB)}" y2="${g.toY(yB)}" stroke="${C.accent}" stroke-width="2"/>
      <circle cx="${g.toX(px)}" cy="${g.toY(py)}" r="4" fill="${C.accent}"/>
      <text x="${g.toX(px) + 8}" y="${g.toY(py) - 6}" font-size="10" fill="${C.accent}">tangent</text>
    </svg>`,
    )
  })(),

  'graphical-curve-horizontal': (() => {
    const g = graphMap(320, 220, 40, -2, 2, -3, 3)
    const curve = polylinePoints((x) => x * x * x - 3 * x, -1.8, 1.8, g.toX, g.toY, 0.1)
    const yLine = 1
    return diagramWrap(
      'Solving $f(x) = k$ — draw the horizontal line $y = k$; x-coordinates of intersections are the solutions.',
      `<svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Curve with horizontal line">
      ${axisLines(g, -2, 2, -3, 3)}
      <polyline points="${curve}" fill="none" stroke="${C.line}" stroke-width="2.5"/>
      <line x1="${g.pad}" y1="${g.toY(yLine)}" x2="${g.viewW - g.pad}" y2="${g.toY(yLine)}" stroke="${C.accent}" stroke-width="2" stroke-dasharray="6 4"/>
      <text x="${g.viewW - g.pad - 4}" y="${g.toY(yLine) - 6}" text-anchor="end" font-size="10" fill="${C.accent}">y = 1</text>
      <circle cx="${g.toX(-1.53)}" cy="${g.toY(1)}" r="4" fill="${C.accent}"/>
      <circle cx="${g.toX(-0.35)}" cy="${g.toY(1)}" r="4" fill="${C.accent}"/>
      <circle cx="${g.toX(1.88)}" cy="${g.toY(1)}" r="4" fill="${C.accent}"/>
    </svg>`,
    )
  })(),

  'graphical-curve-line': (() => {
    const g = graphMap(320, 220, 40, -1, 6, -2, 8)
    const curve = polylinePoints((x) => x * x - 4 * x, -0.5, 5.5, g.toX, g.toY)
    const x1 = (5 - Math.sqrt(33)) / 2
    const x2 = (5 + Math.sqrt(33)) / 2
    const y1 = x1 + 2
    const y2 = x2 + 2
    return diagramWrap(
      'Solving $f(x) = g(x)$ — plot both graphs; intersection x-values are the solutions.',
      `<svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Curve intersecting a line">
      ${axisLines(g, -1, 6, -2, 8)}
      <polyline points="${curve}" fill="none" stroke="${C.line}" stroke-width="2.5"/>
      <line x1="${g.toX(-0.5)}" y1="${g.toY(1.5)}" x2="${g.toX(5.5)}" y2="${g.toY(7.5)}" stroke="${C.lineAlt}" stroke-width="2"/>
      <circle cx="${g.toX(x1)}" cy="${g.toY(y1)}" r="5" fill="${C.accent}"/>
      <circle cx="${g.toX(x2)}" cy="${g.toY(y2)}" r="5" fill="${C.accent}"/>
      <text x="${g.toX(x1) + 8}" y="${g.toY(y1) - 4}" font-size="9" fill="${C.accent}">solution</text>
    </svg>`,
    )
  })(),

  'function-machine': diagramWrap(
    'Function machine — input $x$ maps to exactly one output $f(x)$.',
    `<svg viewBox="0 0 360 120" width="360" height="120" role="img" aria-label="Function machine">
      <rect x="120" y="35" width="120" height="50" rx="8" fill="${C.eqFill}" stroke="${C.line}" stroke-width="2"/>
      <text x="180" y="65" text-anchor="middle" font-size="12" fill="${C.text}">f</text>
      <text x="60" y="65" font-size="11" fill="${C.axis}">x</text>
      <text x="300" y="65" font-size="11" fill="${C.axis}">f(x)</text>
      <line x1="75" y1="60" x2="115" y2="60" stroke="${C.axis}" marker-end="url(#fn)"/>
      <line x1="245" y1="60" x2="285" y2="60" stroke="${C.axis}" marker-end="url(#fn)"/>
      <defs><marker id="fn" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${C.axis}"/></marker></defs>
    </svg>`,
  ),

  'vector-addition': diagramWrap(
    'Vector addition — place tail of second vector at tip of first; resultant goes from start to finish.',
    `<svg viewBox="0 0 320 200" width="320" height="200" role="img" aria-label="Vector addition">
      <line x1="60" y1="150" x2="160" y2="80" stroke="${C.line}" stroke-width="2.5" marker-end="url(#va)"/>
      <line x1="160" y1="80" x2="240" y2="120" stroke="${C.lineAlt}" stroke-width="2.5" marker-end="url(#va)"/>
      <line x1="60" y1="150" x2="240" y2="120" stroke="${C.accent}" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#va)"/>
      <text x="105" y="100" font-size="10" fill="${C.line}">a</text>
      <text x="205" y="95" font-size="10" fill="${C.lineAlt}">b</text>
      <text x="145" y="145" font-size="10" fill="${C.accent}">a+b</text>
      <defs><marker id="va" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${C.axis}"/></marker></defs>
    </svg>`,
  ),

  'reflection-grid': diagramWrap(
    'Reflection — each point and its image are equidistant from the mirror line.',
    `<svg viewBox="0 0 240 240" width="240" height="240" role="img" aria-label="Reflection in a line">
      <line x1="120" y1="20" x2="120" y2="220" stroke="${C.axis}" stroke-dasharray="6 4"/>
      <polygon points="160,60 200,60 200,100" fill="${C.eqFill}" stroke="${C.line}"/>
      <polygon points="80,60 40,60 40,100" fill="${C.eqFillAlt}" stroke="${C.eqStroke}" stroke-dasharray="4 3"/>
      <text x="120" y="15" text-anchor="middle" font-size="10" fill="${C.axis}">mirror line</text>
    </svg>`,
  ),

  'rotation-grid': diagramWrap(
    'Rotation — turn every point about the centre by the given angle and direction (here $90°$ anticlockwise about $O$).',
    `<svg viewBox="0 0 280 260" width="280" height="260" role="img" aria-label="Rotation about a centre">
      <line x1="20" y1="140" x2="260" y2="140" stroke="${C.grid}"/>
      <line x1="140" y1="20" x2="140" y2="240" stroke="${C.grid}"/>
      <polygon points="170,90 210,90 210,130" fill="${C.eqFill}" stroke="${C.line}" stroke-width="2"/>
      <polygon points="90,110 90,70 130,70" fill="${C.eqFillAlt}" stroke="${C.eqStroke}" stroke-width="2" stroke-dasharray="5 3"/>
      <circle cx="140" cy="140" r="5" fill="${C.accent}"/>
      <text x="148" y="135" font-size="12" fill="${C.accent}" font-weight="600">O</text>
      <path d="M185 110 A40 40 0 0 0 110 95" fill="none" stroke="${C.accent}" stroke-width="1.5" marker-end="url(#rot-arr)"/>
      <text x="100" y="125" font-size="11" fill="${C.accent}" font-weight="600">90°</text>
      <text x="215" y="85" font-size="10" fill="${C.line}">object</text>
      <text x="55" y="60" font-size="10" fill="${C.eqStroke}">image</text>
      <defs><marker id="rot-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${C.accent}"/></marker></defs>
    </svg>`,
  ),

  'translation-grid': diagramWrap(
    'Translation — every point slides by the same column vector $\\begin{pmatrix} x \\\\ y \\end{pmatrix}$.',
    `<svg viewBox="0 0 280 220" width="280" height="220" role="img" aria-label="Translation by a vector"><line x1="20" y1="180" x2="260" y2="180" stroke="${C.grid}"/><line x1="40" y1="20" x2="40" y2="200" stroke="${C.grid}"/><polygon points="60,140 100,140 100,100" fill="${C.eqFill}" stroke="${C.line}" stroke-width="2"/><polygon points="150,90 190,90 190,50" fill="${C.eqFillAlt}" stroke="${C.eqStroke}" stroke-width="2" stroke-dasharray="5 3"/><line x1="80" y1="120" x2="170" y2="70" stroke="${C.accent}" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#tr-arr)"/><text x="55" y="160" font-size="10" fill="${C.line}">object</text><text x="195" y="55" font-size="10" fill="${C.eqStroke}">image</text><text x="118" y="72" text-anchor="middle" font-size="11" fill="${C.accent}" font-weight="600">(+3, +2)</text><defs><marker id="tr-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${C.accent}"/></marker></defs></svg>`,
  ),

  'enlargement-grid': diagramWrap(
    'Enlargement — rays from the centre through each vertex; distances multiply by scale factor $k$.',
    `<svg viewBox="0 0 280 240" width="280" height="240" role="img" aria-label="Enlargement from a centre">
      <circle cx="60" cy="180" r="5" fill="${C.accent}"/>
      <text x="48" y="175" font-size="12" fill="${C.accent}" font-weight="600">O</text>
      <polygon points="110,150 150,150 150,110" fill="${C.eqFill}" stroke="${C.line}" stroke-width="2"/>
      <polygon points="160,120 240,120 240,40" fill="${C.eqFillAlt}" stroke="${C.eqStroke}" stroke-width="2" stroke-dasharray="5 3"/>
      <line x1="60" y1="180" x2="240" y2="40" stroke="${C.grid}" stroke-dasharray="4 3"/>
      <line x1="60" y1="180" x2="240" y2="120" stroke="${C.grid}" stroke-dasharray="4 3"/>
      <line x1="60" y1="180" x2="160" y2="120" stroke="${C.grid}" stroke-dasharray="4 3"/>
      <text x="115" y="165" font-size="10" fill="${C.line}">object</text>
      <text x="245" y="35" font-size="10" fill="${C.eqStroke}">image (k = 2)</text>
    </svg>`,
  ),

  'scatter-plot': diagramWrap(
    'Scatter diagram — points show paired data; line of best fit shows trend (positive correlation if upward).',
    `<svg viewBox="0 0 320 200" width="320" height="200" role="img" aria-label="Scatter plot">
      <line x1="40" y1="170" x2="290" y2="170" stroke="${C.axis}"/>
      <line x1="40" y1="170" x2="40" y2="30" stroke="${C.axis}"/>
      <circle cx="70" cy="140" r="4" fill="${C.line}"/><circle cx="110" cy="120" r="4" fill="${C.line}"/>
      <circle cx="150" cy="100" r="4" fill="${C.line}"/><circle cx="190" cy="80" r="4" fill="${C.line}"/>
      <circle cx="230" cy="60" r="4" fill="${C.line}"/>
      <line x1="60" y1="155" x2="250" y2="45" stroke="${C.grid}" stroke-dasharray="4 3"/>
    </svg>`,
  ),

  'box-plot': diagramWrap(
    'Box plot — box from LQ to UQ; line inside = median; whiskers extend to min and max (or trimmed values).',
    `<svg viewBox="0 0 360 100" width="360" height="100" role="img" aria-label="Box plot">
      <line x1="40" y1="50" x2="320" y2="50" stroke="${C.axis}"/>
      <line x1="80" y1="35" x2="80" y2="65" stroke="${C.axis}"/>
      <line x1="280" y1="35" x2="280" y2="65" stroke="${C.axis}"/>
      <rect x="120" y="30" width="140" height="40" fill="${C.eqFill}" stroke="${C.line}"/>
      <line x1="190" y1="30" x2="190" y2="70" stroke="${C.accent}" stroke-width="2"/>
      <text x="190" y="85" text-anchor="middle" font-size="9" fill="${C.axis}">median</text>
    </svg>`,
  ),

  'tree-diagram': diagramWrap(
    'Tree diagram — multiply along a branch; add probabilities of separate paths.',
    `<svg viewBox="0 0 320 180" width="320" height="180" role="img" aria-label="Probability tree">
      <circle cx="40" cy="90" r="6" fill="${C.axis}"/>
      <line x1="46" y1="70" x2="120" y2="50" stroke="${C.axis}"/>
      <line x1="46" y1="110" x2="120" y2="130" stroke="${C.axis}"/>
      <circle cx="120" cy="50" r="5" fill="${C.line}"/><text x="130" y="45" font-size="9">R</text>
      <circle cx="120" cy="130" r="5" fill="${C.eqStroke}"/><text x="130" y="135" font-size="9">B</text>
      <line x1="126" y1="50" x2="200" y2="35" stroke="${C.axis}"/>
      <line x1="126" y1="50" x2="200" y2="65" stroke="${C.axis}"/>
      <text x="210" y="40" font-size="8" fill="${C.axis}">multiply</text>
    </svg>`,
  ),

  'line-curve-intersection': (() => {
    const g = graphMap(320, 220, 40, -0.5, 5, 0, 8)
    const curve = polylinePoints((x) => x * x - 5 * x + 6, -0.5, 5, g.toX, g.toY)
    const x1 = 0
    const y1 = 6
    const x2 = 4
    const y2 = 2
    return diagramWrap(
      'Line and curve — $y = x^2 - 5x + 6$ meets $y = -x + 6$ at $(0, 6)$ and $(4, 2)$; each point is a simultaneous solution.',
      `<svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Line intersecting a parabola">
      ${axisLines(g, -0.5, 5, 0, 8)}
      <text x="${g.viewW - g.pad + 4}" y="${g.toY(0) + 4}" font-size="10" fill="${C.label}">x</text>
      <text x="${g.pad - 14}" y="${g.toY(4)}" font-size="10" fill="${C.label}">y</text>
      <polyline points="${curve}" fill="none" stroke="${C.line}" stroke-width="2.5"/>
      <line x1="${g.toX(-0.5)}" y1="${g.toY(6.5)}" x2="${g.toX(5)}" y2="${g.toY(1.5)}" stroke="${C.lineAlt}" stroke-width="2"/>
      <circle cx="${g.toX(x1)}" cy="${g.toY(y1)}" r="5" fill="${C.accent}"/>
      <circle cx="${g.toX(x2)}" cy="${g.toY(y2)}" r="5" fill="${C.accent}"/>
      <text x="${g.toX(x1) + 8}" y="${g.toY(y1) - 6}" font-size="9" fill="${C.accent}">(0, 6)</text>
      <text x="${g.toX(x2) + 8}" y="${g.toY(y2) + 4}" font-size="9" fill="${C.accent}">(4, 2)</text>
    </svg>`,
    )
  })(),

  'intersecting-lines': diagramWrap(
    'Simultaneous equations — solution is the point where the two lines cross.',
    `<svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Intersecting lines">
      <line x1="40" y1="190" x2="290" y2="190" stroke="${C.axis}"/>
      <line x1="40" y1="190" x2="40" y2="30" stroke="${C.axis}"/>
      <line x1="60" y1="170" x2="260" y2="50" stroke="${C.line}" stroke-width="2"/>
      <line x1="60" y1="50" x2="260" y2="170" stroke="${C.lineAlt}" stroke-width="2"/>
      <circle cx="160" cy="110" r="5" fill="${C.accent}"/>
      <text x="168" y="105" font-size="10" fill="${C.accent}">solution</text>
    </svg>`,
  ),

  'number-line-inequality': diagramWrap(
    'Inequality on a number line — open circle for &lt; or &gt;; closed circle for ≤ or ≥; arrow shows direction.',
    `<svg viewBox="0 0 360 80" width="360" height="80" role="img" aria-label="Inequality on number line">
      <line x1="30" y1="40" x2="330" y2="40" stroke="${C.axis}" stroke-width="2"/>
      <circle cx="200" cy="40" r="8" fill="#fff" stroke="${C.line}" stroke-width="2"/>
      <line x1="200" y1="40" x2="300" y2="40" stroke="${C.line}" stroke-width="2.5" marker-end="url(#ineq)"/>
      <text x="200" y="65" text-anchor="middle" font-size="10" fill="${C.line}">x &gt; 2</text>
      <defs><marker id="ineq" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${C.line}"/></marker></defs>
    </svg>`,
  ),

  'place-value-chart': diagramWrap(
    'Place value — each column is a power of 10; digits shift value by column position.',
    `<svg viewBox="0 0 360 100" width="360" height="100" role="img" aria-label="Place value chart">
      <rect x="40" y="30" width="60" height="40" fill="${C.eqFill}" stroke="${C.line}"/><text x="70" y="55" text-anchor="middle" font-size="14">1</text><text x="70" y="85" font-size="9" fill="${C.axis}">ones</text>
      <rect x="110" y="30" width="60" height="40" fill="${C.eqFill}" stroke="${C.line}"/><text x="140" y="55" text-anchor="middle" font-size="14">0</text><text x="140" y="85" font-size="9" fill="${C.axis}">tens</text>
      <rect x="180" y="30" width="60" height="40" fill="${C.eqFill}" stroke="${C.line}"/><text x="210" y="55" text-anchor="middle" font-size="14">3</text><text x="210" y="85" font-size="9" fill="${C.axis}">hundreds</text>
      <text x="180" y="20" text-anchor="middle" font-size="11" fill="${C.text}">302</text>
    </svg>`,
  ),

  'bidmas-order': diagramWrap(
    'Order of operations — Brackets, Indices, Division/Multiplication (left to right), Addition/Subtraction (left to right).',
    `<svg viewBox="0 0 360 80" width="360" height="80" role="img" aria-label="BIDMAS order">
      <rect x="20" y="25" width="55" height="35" rx="6" fill="${C.eqFillAlt}" stroke="${C.accent}"/><text x="47" y="48" text-anchor="middle" font-size="10" font-weight="600">( )</text>
      <rect x="85" y="25" width="55" height="35" rx="6" fill="${C.eqFillAlt}" stroke="${C.eqStroke}"/><text x="112" y="48" text-anchor="middle" font-size="10" font-weight="600">x²</text>
      <rect x="150" y="25" width="55" height="35" rx="6" fill="${C.eqFill}" stroke="${C.line}"/><text x="177" y="48" text-anchor="middle" font-size="10" font-weight="600">÷ ×</text>
      <rect x="215" y="25" width="55" height="35" rx="6" fill="${C.eqFillAlt}" stroke="${C.lineAlt}"/><text x="242" y="48" text-anchor="middle" font-size="10" font-weight="600">+ −</text>
      <text x="290" y="48" font-size="10" fill="${C.axis}">→</text>
    </svg>`,
  ),

  'rounding-number-line': diagramWrap(
    'Rounding — identify the two labelled values; decide which is nearer (e.g. 3.47 → 3.5 to 1 d.p.).',
    `<svg viewBox="0 0 360 80" width="360" height="80" role="img" aria-label="Rounding on number line">
      <line x1="30" y1="40" x2="330" y2="40" stroke="${C.axis}" stroke-width="2"/>
      <line x1="80" y1="30" x2="80" y2="50" stroke="${C.axis}"/><text x="80" y="65" text-anchor="middle" font-size="10">3.4</text>
      <line x1="280" y1="30" x2="280" y2="50" stroke="${C.axis}"/><text x="280" y="65" text-anchor="middle" font-size="10">3.5</text>
      <circle cx="230" cy="40" r="6" fill="${C.line}"/>
      <text x="230" y="25" text-anchor="middle" font-size="9" fill="${C.line}">3.47</text>
    </svg>`,
  ),

  'index-laws': diagramWrap(
    'Index laws — multiply same base: add powers; divide: subtract powers; power of power: multiply powers.',
    `<svg viewBox="0 0 360 100" width="360" height="100" role="img" aria-label="Index laws">
      <text x="180" y="35" text-anchor="middle" font-size="12" fill="${C.text}">a^m × a^n = a^(m+n)</text>
      <text x="180" y="60" text-anchor="middle" font-size="12" fill="${C.text}">a^m ÷ a^n = a^(m−n)</text>
      <text x="180" y="85" text-anchor="middle" font-size="12" fill="${C.text}">(a^m)^n = a^(mn)</text>
    </svg>`,
  ),

  'standard-form-table': diagramWrap(
    'Standard form $a × 10^n$ — $1 ≤ a &lt; 10$; $n$ is the power of 10 (positive for large, negative for small).',
    `<svg viewBox="0 0 360 120" width="360" height="120" role="img" aria-label="Standard form examples">
      <text x="40" y="40" font-size="11" fill="${C.axis}">Large:</text><text x="100" y="40" font-size="12" fill="${C.line}">3.2 × 10^6</text>
      <text x="40" y="70" font-size="11" fill="${C.axis}">Small:</text><text x="100" y="70" font-size="12" fill="${C.line}">4.5 × 10^−4</text>
      <text x="40" y="100" font-size="10" fill="${C.axis}">a must be between 1 and 10</text>
    </svg>`,
  ),

  'surd-square': diagramWrap(
    'Surds — √50 = √(25×2) = 5√2; simplify by extracting perfect square factors.',
    `<svg viewBox="0 0 280 160" width="280" height="160" role="img" aria-label="Simplifying surds">
      <rect x="40" y="40" width="80" height="80" fill="${C.eqFill}" stroke="${C.line}" stroke-width="2"/>
      <line x1="40" y1="80" x2="120" y2="80" stroke="${C.axis}" stroke-dasharray="4 3"/>
      <line x1="80" y1="40" x2="80" y2="120" stroke="${C.axis}" stroke-dasharray="4 3"/>
      <text x="60" y="70" font-size="10" fill="${C.line}">5</text><text x="95" y="105" font-size="10" fill="${C.line}">5</text>
      <text x="150" y="85" font-size="12" fill="${C.text}">area 50 → side √50 = 5√2</text>
    </svg>`,
  ),

  'bracket-area': diagramWrap(
    'Expanding brackets — area model: $(x+2)(x+3) = x² + 5x + 6$.',
    `<svg viewBox="0 0 280 200" width="280" height="200" role="img" aria-label="Area model for brackets">
      <rect x="60" y="50" width="80" height="80" fill="${C.eqFill}" stroke="${C.line}"/><text x="100" y="95" text-anchor="middle" font-size="11">x²</text>
      <rect x="140" y="50" width="40" height="80" fill="${C.eqFillAlt}" stroke="${C.eqStroke}"/><text x="160" y="95" text-anchor="middle" font-size="10">3x</text>
      <rect x="60" y="130" width="80" height="30" fill="${C.eqFillAlt}" stroke="${C.lineAlt}"/><text x="100" y="150" text-anchor="middle" font-size="10">2x</text>
      <rect x="140" y="130" width="40" height="30" fill="${C.eqFillAlt}" stroke="${C.accent}"/><text x="160" y="150" text-anchor="middle" font-size="10">6</text>
    </svg>`,
  ),

  'balance-equation': diagramWrap(
    'Linear equations — keep the balance: do the same operation to both sides.',
    `<svg viewBox="0 0 320 160" width="320" height="160" role="img" aria-label="Balance model for equations">
      <polygon points="160,115 142,140 178,140" fill="${C.axis}"/>
      <line x1="40" y1="70" x2="280" y2="70" stroke="${C.axis}" stroke-width="4" stroke-linecap="round"/>
      <line x1="100" y1="70" x2="100" y2="95" stroke="${C.axis}" stroke-width="2"/>
      <line x1="220" y1="70" x2="220" y2="95" stroke="${C.axis}" stroke-width="2"/>
      <rect x="65" y="95" width="70" height="28" rx="4" fill="${C.eqFill}" stroke="${C.eqStroke}" stroke-width="2"/>
      <text x="100" y="113" text-anchor="middle" font-size="11" fill="${C.text}" font-weight="600">2x + 3</text>
      <rect x="185" y="95" width="70" height="28" rx="4" fill="${C.eqFillAlt}" stroke="${C.eqStroke}" stroke-width="2"/>
      <text x="220" y="113" text-anchor="middle" font-size="11" fill="${C.text}" font-weight="600">11</text>
      <text x="160" y="58" text-anchor="middle" font-size="14" fill="${C.axis}" font-weight="700">=</text>
    </svg>`,
  ),

  'elimination-method': diagramWrap(
    'Elimination — align like terms, then add or subtract the equations to remove one variable.',
    `<svg viewBox="0 0 280 140" width="280" height="140" role="img" aria-label="Elimination method">
      <rect x="30" y="20" width="220" height="32" rx="4" fill="${C.eqFill}" stroke="${C.eqStroke}"/>
      <text x="140" y="41" text-anchor="middle" font-size="12" fill="${C.text}">3x + 2y = 12</text>
      <rect x="30" y="58" width="220" height="32" rx="4" fill="${C.eqFillAlt}" stroke="${C.eqStroke}"/>
      <text x="140" y="79" text-anchor="middle" font-size="12" fill="${C.text}">5x − 2y = 4</text>
      <text x="140" y="108" text-anchor="middle" font-size="18" fill="${C.label}">+</text>
      <line x1="30" y1="118" x2="250" y2="118" stroke="${C.axis}" stroke-width="2"/>
      <text x="140" y="135" text-anchor="middle" font-size="12" fill="${C.lineAlt}" font-weight="600">8x = 16 → x = 2</text>
    </svg>`,
  ),

  'substitution-method': diagramWrap(
    'Substitution — rearrange one equation for $y$, then replace $y$ in the other equation.',
    `<svg viewBox="0 0 320 120" width="320" height="120" role="img" aria-label="Substitution method">
      <rect x="20" y="35" width="110" height="50" rx="6" fill="${C.eqFill}" stroke="${C.eqStroke}" stroke-width="1.5"/>
      <text x="75" y="65" text-anchor="middle" font-size="11" fill="${C.text}">y = 2x + 1</text>
      <line x1="135" y1="60" x2="175" y2="60" stroke="${C.label}" marker-end="url(#sub-arr)"/>
      <text x="155" y="50" text-anchor="middle" font-size="9" fill="${C.label}">sub</text>
      <rect x="180" y="25" width="120" height="70" rx="6" fill="${C.eqFillAlt}" stroke="${C.eqStroke}" stroke-width="1.5"/>
      <text x="240" y="50" text-anchor="middle" font-size="11" fill="${C.text}">3x + y = 14</text>
      <text x="240" y="72" text-anchor="middle" font-size="11" fill="${C.lineAlt}">3x + (2x+1) = 14</text>
      <defs><marker id="sub-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${C.label}"/></marker></defs>
    </svg>`,
  ),

  'pie-percentage': diagramWrap(
    'Percentages — slice size shows proportion of the whole; 25% = quarter of the circle.',
    `<svg viewBox="0 0 200 200" width="200" height="200" role="img" aria-label="Percentage pie chart">
      <circle cx="100" cy="100" r="70" fill="${C.eqFillAlt}" stroke="${C.grid}"/>
      <path d="M100 100 L100 30 A70 70 0 0 1 170 100 Z" fill="${C.line}" opacity="0.8"/>
      <text x="130" y="70" font-size="11" fill="${C.text}">25%</text>
    </svg>`,
  ),

  'map-scale-bar': diagramWrap(
    'Map scale — measure on the map, multiply by the scale factor to get real distance.',
    `<svg viewBox="0 0 360 100" width="360" height="100" role="img" aria-label="Map scale bar">
      <rect x="40" y="40" width="120" height="20" rx="3" fill="${C.eqFill}" stroke="${C.eqStroke}"/>
      <text x="100" y="55" text-anchor="middle" font-size="10" fill="${C.text}">2 cm on map</text>
      <text x="200" y="55" font-size="14" fill="${C.label}">→</text>
      <text x="280" y="55" text-anchor="middle" font-size="10" fill="${C.text}">1 km real</text>
      <text x="180" y="85" text-anchor="middle" font-size="10" fill="${C.label}">scale 1 : 50 000</text>
    </svg>`,
  ),

  'cuboid-dimensions': diagramWrap(
    'Cuboid — volume = length × width × height; surface area = sum of areas of all six faces.',
    `<svg viewBox="0 0 280 200" width="280" height="200" role="img" aria-label="Cuboid dimensions">
      <polygon points="60,120 160,120 200,80 100,80" fill="${C.eqFill}" stroke="${C.line}"/>
      <polygon points="60,120 60,60 100,20 100,80" fill="${C.eqFill}" stroke="${C.line}"/>
      <polygon points="100,80 100,20 200,20 200,80" fill="${C.eqFill}" stroke="${C.line}"/>
      <text x="130" y="135" font-size="10" fill="${C.line}">length</text>
      <text x="45" y="95" font-size="10" fill="${C.line}">h</text>
      <text x="150" y="55" font-size="10" fill="${C.line}">width</text>
    </svg>`,
  ),

  'line-symmetry': diagramWrap(
    'Line symmetry — fold line maps one half exactly onto the other; count lines of symmetry.',
    `<svg viewBox="0 0 240 200" width="240" height="200" role="img" aria-label="Line symmetry">
      <line x1="120" y1="20" x2="120" y2="180" stroke="${C.accent}" stroke-dasharray="6 4"/>
      <polygon points="120,40 180,160 60,160" fill="${C.eqFill}" stroke="${C.line}"/>
      <text x="120" y="15" text-anchor="middle" font-size="10" fill="${C.accent}">line of symmetry</text>
    </svg>`,
  ),

  'construction-arc': diagramWrap(
    'Constructions — use compass for arcs of equal radius to bisect an angle or construct 60°.',
    `<svg viewBox="0 0 240 200" width="240" height="200" role="img" aria-label="Construction arc">
      <line x1="40" y1="160" x2="200" y2="160" stroke="${C.axis}"/>
      <line x1="40" y1="160" x2="120" y2="40" stroke="${C.axis}"/>
      <path d="M40 160 A80 80 0 0 0 120 40" fill="none" stroke="${C.line}" stroke-width="2"/>
      <path d="M200 160 A80 80 0 0 1 120 40" fill="none" stroke="${C.line}" stroke-width="2"/>
      <circle cx="120" cy="40" r="4" fill="${C.accent}"/>
    </svg>`,
  ),

  'cube-net': diagramWrap(
    'Net of a cube — six squares fold into a cube; opposite faces never share an edge in the net.',
    `<svg viewBox="0 0 240 200" width="240" height="200" role="img" aria-label="Cube net">
      <rect x="80" y="20" width="50" height="50" fill="${C.eqFill}" stroke="${C.line}"/>
      <rect x="80" y="70" width="50" height="50" fill="${C.eqFill}" stroke="${C.line}"/>
      <rect x="30" y="70" width="50" height="50" fill="${C.eqFill}" stroke="${C.line}"/>
      <rect x="130" y="70" width="50" height="50" fill="${C.eqFill}" stroke="${C.line}"/>
      <rect x="80" y="120" width="50" height="50" fill="${C.eqFill}" stroke="${C.line}"/>
      <rect x="80" y="170" width="50" height="50" fill="${C.eqFill}" stroke="${C.line}"/>
    </svg>`,
  ),

  'algebraic-fraction': diagramWrap(
    'Algebraic fractions — factorise numerator and denominator, then cancel common factors.',
    `<svg viewBox="0 0 280 80" width="280" height="80" role="img" aria-label="Algebraic fraction">
      <text x="140" y="35" text-anchor="middle" font-size="14" fill="${C.text}">x² − 4</text>
      <line x1="80" y1="45" x2="200" y2="45" stroke="${C.axis}" stroke-width="2"/>
      <text x="140" y="65" text-anchor="middle" font-size="14" fill="${C.text}">x − 2</text>
      <text x="220" y="50" font-size="11" fill="${C.line}">→ x + 2</text>
    </svg>`,
  ),

  'formula-rearrange': diagramWrap(
    'Changing the subject — treat formula like balance; undo operations in reverse order on both sides.',
    `<svg viewBox="0 0 320 80" width="320" height="80" role="img" aria-label="Rearranging formula">
      <text x="160" y="35" text-anchor="middle" font-size="13" fill="${C.text}">v = u + at</text>
      <text x="160" y="60" text-anchor="middle" font-size="13" fill="${C.line}">a = (v − u) / t</text>
    </svg>`,
  ),

  'mean-bar-chart': diagramWrap(
    'Mean from grouped data — use midpoints × frequencies; sum ÷ total frequency.',
    `<svg viewBox="0 0 320 180" width="320" height="180" role="img" aria-label="Bar chart for mean">
      <line x1="40" y1="150" x2="290" y2="150" stroke="${C.axis}"/>
      <rect x="60" y="100" width="40" height="50" fill="${C.line}" opacity="0.7"/><text x="80" y="165" text-anchor="middle" font-size="9">10</text>
      <rect x="120" y="70" width="40" height="80" fill="${C.line}" opacity="0.7"/><text x="140" y="165" text-anchor="middle" font-size="9">20</text>
      <rect x="180" y="90" width="40" height="60" fill="${C.line}" opacity="0.7"/><text x="200" y="165" text-anchor="middle" font-size="9">30</text>
      <line x1="80" y1="95" x2="80" y2="105" stroke="${C.accent}" stroke-width="2"/><text x="95" y="100" font-size="9" fill="${C.accent}">mid</text>
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
  '2-5-2-6-simultaneous-equations': ['elimination-method', 'substitution-method', 'intersecting-lines'],
  '3-1-percentages-financial-maths-rates-and-time': ['pie-percentage'],
  '3-2-map-scales': ['map-scale-bar'],
  '4-1-pythagoras-theorem': ['pythagoras-triangle'],
  '4-2-trigonometry': ['sohcahtoa-triangle'],
  '4-3-4-5-bearings-scale-drawing': ['bearing-diagram', 'bearing-reverse', 'bearing-two-leg'],
  '4-6-three-dimensional-trigonometry': ['cuboid-space-diagonal', 'pyramid-3d-trig'],

  '5-1-5-2-area-circles': ['circle-parts'],
  '5-3-5-4-sector-segment-analysis': ['sector-diagram', 'circle-parts'],
  '5-5-5-6-volume-surface-area': ['cuboid-dimensions'],
  '5-7-similarity-length-area-volume-ratios': ['similar-triangles'],
  '6-1-factorising': [],
  '6-2-6-3-quadratic-equations': [],
  '6-4-nonlinear-simultaneous-equations': ['line-curve-intersection'],
  '7-1-angles': ['angle-types', 'parallel-line-angles'],
  '7-2-symmetry': ['line-symmetry'],
  '7-3-circle-theorems': [
    'circle-theorem-angle',
    'circle-theorem-same-segment',
    'circle-theorem-semicircle',
    'circle-theorem-cyclic-quad',
    'circle-theorem-alternate-segment',
    'circle-theorem-tangent-radius',
  ],
  '7-4-constructions': ['construction-arc'],
  '7-5-nets': ['cube-net'],
  '8-1-algebraic-fractions': ['algebraic-fraction'],
  '8-2-changing-the-subject': ['formula-rearrange'],
  '8-3-proportion': ['proportion-graph'],
  '8-5-inequalities': [],
  '9-1-linear-graphs': ['linear-graph-forms'],
  '9-2-coordinate-geometry': ['line-segment-coords'],
  '9-3-equations-of-straight-lines': ['parallel-perpendicular-lines'],
  '9-4-plotting-curves': ['quadratic-sketch', 'cubic-sketch', 'reciprocal-sketch'],
  '9-5-interpreting-graphs': ['distance-time-sketch'],
  '9-6-graphical-solutions': ['graphical-curve-horizontal', 'graphical-curve-line'],
  '9-7-differentiation': ['tangent-gradient'],
  '10-1-any-angle': ['unit-circle-quadrants'],
  '10-2-10-3-sine-cosine-rules': ['sohcahtoa-triangle'],
  '11-1-11-2-sets-venn-diagrams': ['venn-two-set'],
  '11-3-11-4-functions': ['function-machine'],
  '12-1-12-3-vectors': ['vector-addition'],
  '12-4-12-5-transformations': ['translation-grid', 'reflection-grid', 'rotation-grid', 'enlargement-grid'],
  '13-1-13-3-data-displays-histograms': ['histogram-example'],
  '13-2-13-6-averages-comparison': ['mean-bar-chart'],
  '13-4-scatter-diagrams': ['scatter-plot'],
  '13-5-cumulative-frequency-box-plots': ['box-plot'],
  '14-1-14-3-probability-rules': ['venn-two-set'],
  '14-4-tree-diagrams': ['tree-diagram'],
  '14-5-14-6-advanced-probability': ['venn-two-set'],
}
