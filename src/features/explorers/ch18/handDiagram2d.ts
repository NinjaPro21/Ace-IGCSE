import { EM_COLORS } from './em3dCore'

export type HandDiagramKind = 'fleming-left' | 'fleming-right' | 'grip-rule'

export function isHandDiagramScene(id: string): id is HandDiagramKind {
  return id === 'fleming-left' || id === 'fleming-right' || id === 'grip-rule'
}

const FLEMING_IMG_SRC = '/fleming-hand-reference.png'
let flemingImg: HTMLImageElement | null = null
let flemingImgLoaded = false
const flemingLoadCallbacks = new Set<() => void>()

function ensureFlemingImage() {
  if (flemingImg) return flemingImg
  flemingImg = new Image()
  flemingImg.src = FLEMING_IMG_SRC
  flemingImg.onload = () => {
    flemingImgLoaded = true
    flemingLoadCallbacks.forEach((cb) => cb())
    flemingLoadCallbacks.clear()
  }
  return flemingImg
}

/** Subscribe to redraw when the reference hand image finishes loading */
export function onFlemingHandImageReady(cb: () => void) {
  ensureFlemingImage()
  if (flemingImgLoaded && flemingImg?.complete) cb()
  else flemingLoadCallbacks.add(cb)
}

function drawArrow2D(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width = 3,
) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = width
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const head = 11
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - head * Math.cos(angle - 0.35), y2 - head * Math.sin(angle - 0.35))
  ctx.lineTo(x2 - head * Math.cos(angle + 0.35), y2 - head * Math.sin(angle + 0.35))
  ctx.closePath()
  ctx.fill()
}

function drawAxisLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  title: string,
  color: string,
  align: CanvasTextAlign = 'left',
) {
  ctx.textAlign = align
  ctx.fillStyle = color
  ctx.font = '800 16px system-ui, sans-serif'
  ctx.fillText(title, x, y)
}

/** Reference image already includes Motion / Field / Current labels — no extra overlays */
function drawFlemingHand2D(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  hand: 'left' | 'right',
  flipped: boolean,
  zoom: number,
) {
  const img = ensureFlemingImage()
  const cx = w / 2
  const cy = h / 2 - 8
  const imgScale = Math.min(w, h) * 0.72 * zoom
  const imgW = imgScale
  const imgH = img.complete && img.naturalWidth ? imgScale * (img.naturalHeight / img.naturalWidth) : imgScale * 1.05
  const ix = cx - imgW / 2
  const iy = cy - imgH / 2

  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#ffffff')
  bg.addColorStop(1, '#f8fafc')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  ctx.save()
  ctx.translate(cx, cy)
  if (flipped) ctx.scale(1, -1)
  if (hand === 'left') ctx.scale(-1, 1)
  ctx.translate(-cx, -cy)

  if (flemingImgLoaded && img.complete) {
    ctx.drawImage(img, ix, iy, imgW, imgH)
  } else {
    ctx.fillStyle = '#e2e8f0'
    ctx.fillRect(ix, iy, imgW, imgH)
    ctx.fillStyle = '#64748b'
    ctx.font = '600 13px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Loading hand diagram…', cx, cy)
  }

  ctx.restore()

  ctx.textAlign = 'center'
  ctx.fillStyle = '#475569'
  ctx.font = '600 11px system-ui, sans-serif'
  const footnote =
    hand === 'left'
      ? 'Left hand · read thumb as Force (motor effect)'
      : 'Right hand · thumb = Motion (generator effect)'
  ctx.fillText(footnote, w / 2, h - 12)
}

function drawHandPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  ctx.fillStyle = EM_COLORS.hand
  ctx.strokeStyle = EM_COLORS.handDark
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cx + s * 0.05, cy + s * 0.85)
  ctx.quadraticCurveTo(cx + s * 0.55, cy + s * 0.95, cx + s * 0.75, cy + s * 0.55)
  ctx.quadraticCurveTo(cx + s * 0.95, cy + s * 0.15, cx + s * 0.55, cy - s * 0.05)
  ctx.quadraticCurveTo(cx + s * 0.15, cy - s * 0.15, cx - s * 0.05, cy + s * 0.25)
  ctx.quadraticCurveTo(cx - s * 0.2, cy + s * 0.55, cx + s * 0.05, cy + s * 0.85)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Palm crease
  ctx.strokeStyle = 'rgba(255,255,255,0.45)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(cx + s * 0.15, cy + s * 0.35)
  ctx.quadraticCurveTo(cx + s * 0.35, cy + s * 0.45, cx + s * 0.55, cy + s * 0.3)
  ctx.stroke()
}

/** Right-hand grip rule — fist gripping vertical wire, thumb = I, fingers curl → B */
function drawGripHand2D(ctx: CanvasRenderingContext2D, w: number, h: number, flipped: boolean, zoom: number) {
  const cx = w / 2 - 8
  const cy = h / 2 + 10
  const s = Math.min(w, h) * 0.13 * zoom

  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#ffffff')
  bg.addColorStop(1, '#f8fafc')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  ctx.save()
  ctx.translate(cx, cy)
  if (flipped) ctx.scale(1, -1)
  ctx.translate(-cx, -cy)

  // Wire (vertical, through fist)
  ctx.fillStyle = EM_COLORS.wire
  ctx.fillRect(cx - s * 0.1, cy - s * 2.4, s * 0.2, s * 4.8)
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 2
  ctx.strokeRect(cx - s * 0.1, cy - s * 2.4, s * 0.2, s * 4.8)

  // ⊗ at top — current into page
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.arc(cx, cy - s * 2.55, s * 0.22, 0, Math.PI * 2)
  ctx.moveTo(cx - s * 0.14, cy - s * 2.55)
  ctx.lineTo(cx + s * 0.14, cy - s * 2.55)
  ctx.moveTo(cx, cy - s * 2.69)
  ctx.lineTo(cx, cy - s * 2.41)
  ctx.stroke()

  drawHandPath(ctx, cx + s * 0.22, cy + s * 0.15, s)

  // Thumb along wire
  ctx.fillStyle = EM_COLORS.hand
  ctx.strokeStyle = EM_COLORS.handDark
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.12, cy - s * 0.55)
  ctx.lineTo(cx - s * 0.12, cy - s * 1.55)
  ctx.quadraticCurveTo(cx - s * 0.05, cy - s * 1.75, cx + s * 0.08, cy - s * 1.65)
  ctx.quadraticCurveTo(cx + s * 0.2, cy - s * 1.45, cx + s * 0.12, cy - s * 0.55)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Curled fingers wrapping wire (3 visible arcs)
  ctx.strokeStyle = EM_COLORS.hand
  ctx.lineCap = 'round'
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.arc(cx + s * 0.42, cy - s * 0.15 + i * s * 0.32, s * 0.38, 0.35, Math.PI * 1.05)
    ctx.lineWidth = s * 0.24
    ctx.stroke()
  }

  ctx.restore()

  // B-field circles (left of wire)
  for (const r of [0.5, 0.78, 1.06]) {
    ctx.strokeStyle = EM_COLORS.field
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(cx, cy, s * r, 0, Math.PI * 2)
    ctx.stroke()
    drawArrow2D(ctx, cx + s * r - 10, cy, cx + s * r, cy, EM_COLORS.field, 2)
  }

  drawArrow2D(ctx, cx, cy - s * 1.85, cx, cy - s * 2.35, EM_COLORS.current, 4)
  drawAxisLabel(ctx, cx + 14, cy - s * 2.45, 'Current I', EM_COLORS.current)
  drawAxisLabel(ctx, cx - s * 1.55, cy - 6, 'Field B', EM_COLORS.field, 'right')
  ctx.textAlign = 'center'
  ctx.fillStyle = '#64748b'
  ctx.font = '600 11px system-ui, sans-serif'
  ctx.fillText('curled fingers', cx - s * 1.55, cy + 10)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#475569'
  ctx.font = '600 11px system-ui, sans-serif'
  ctx.fillText('Grip wire with right hand · thumb = I · fingers curl in direction of B', w / 2, h - 12)
}

export function renderHandDiagram2D(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  kind: HandDiagramKind,
  flipped: boolean,
  zoom: number,
) {
  if (kind === 'grip-rule') {
    drawGripHand2D(ctx, w, h, flipped, zoom)
  } else {
    drawFlemingHand2D(ctx, w, h, kind === 'fleming-right' ? 'right' : 'left', flipped, zoom)
  }
}

/** Top-down wire field — avoids overlapping 3D HTML labels */
export function renderWireField2D(ctx: CanvasRenderingContext2D, w: number, h: number, zoom: number) {
  const cx = w / 2
  const cy = h / 2
  const s = Math.min(w, h) * 0.38 * zoom

  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#f8fafc')
  bg.addColorStop(1, '#fef9c3')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Cardboard
  ctx.fillStyle = '#fef3c7'
  ctx.strokeStyle = '#92400e'
  ctx.lineWidth = 2
  ctx.fillRect(cx - s * 1.05, cy - s * 1.05, s * 2.1, s * 2.1)
  ctx.strokeRect(cx - s * 1.05, cy - s * 1.05, s * 2.1, s * 2.1)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#92400e'
  ctx.font = '700 14px system-ui, sans-serif'
  ctx.fillText('Top view — cardboard with iron filings', cx, cy - s * 1.22)

  // B-field circles (clockwise when I into page)
  for (const r of [0.22, 0.42, 0.62, 0.82]) {
    ctx.strokeStyle = EM_COLORS.field
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.arc(cx, cy, s * r, 0, Math.PI * 2)
    ctx.stroke()
    const ax = cx + s * r
    drawArrow2D(ctx, ax - 12, cy + 4, ax, cy + 4, EM_COLORS.field, 2)
  }

  // Wire cross-section
  ctx.fillStyle = EM_COLORS.wire
  ctx.beginPath()
  ctx.arc(cx, cy, s * 0.1, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 2
  ctx.stroke()

  // ⊗ symbol
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.06, cy - s * 0.06)
  ctx.lineTo(cx + s * 0.06, cy + s * 0.06)
  ctx.moveTo(cx + s * 0.06, cy - s * 0.06)
  ctx.lineTo(cx - s * 0.06, cy + s * 0.06)
  ctx.stroke()

  ctx.fillStyle = EM_COLORS.wire
  ctx.font = '800 13px system-ui, sans-serif'
  ctx.fillText('I', cx, cy - s * 0.22)
  ctx.font = '600 11px system-ui, sans-serif'
  ctx.fillStyle = '#475569'
  ctx.fillText('into page (⊗)', cx, cy + s * 0.28)

  ctx.textAlign = 'left'
  ctx.fillStyle = EM_COLORS.field
  ctx.font = '700 13px system-ui, sans-serif'
  ctx.fillText('Magnetic field B', cx + s * 0.15, cy - s * 0.55)
  ctx.font = '600 11px system-ui, sans-serif'
  ctx.fillStyle = '#64748b'
  ctx.fillText('concentric circles · clockwise', cx + s * 0.15, cy - s * 0.38)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#475569'
  ctx.font = '600 11px system-ui, sans-serif'
  ctx.fillText('Use right-hand grip rule to find B direction', w / 2, h - 12)
}

/** Apply zoom transform for full-canvas 2D graph scenes */
export function withCanvasZoom(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  zoom: number,
  draw: () => void,
) {
  if (zoom <= 1.001) {
    draw()
    return
  }
  ctx.save()
  ctx.translate(w / 2, h / 2)
  ctx.scale(zoom, zoom)
  ctx.translate(-w / 2, -h / 2)
  draw()
  ctx.restore()
}
