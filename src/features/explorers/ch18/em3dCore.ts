export type V3 = { x: number; y: number; z: number }

export type Projected = { sx: number; sy: number; depth: number }

export type HtmlLabel = {
  key: string
  point: V3
  text: string
  sub?: string
  color: string
  align?: CanvasTextAlign
  offsetX?: number
  offsetY?: number
}

export type DrawItem = { depth: number; draw: (ctx: CanvasRenderingContext2D) => void }

export const EM_COLORS = {
  force: '#dc2626',
  field: '#2563eb',
  current: '#16a34a',
  motion: '#9333ea',
  hand: '#5b9bd5',
  handDark: '#3d7ab8',
  handLight: '#7eb3e8',
  north: '#dc2626',
  south: '#2563eb',
  wire: '#475569',
  coil: '#f59e0b',
  iron: '#94a3b8',
  flux: '#7c3aed',
  emf: '#16a34a',
  grid: '#64748b',
}

export function add(a: V3, b: V3): V3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }
}

export function scale(v: V3, s: number): V3 {
  return { x: v.x * s, y: v.y * s, z: v.z * s }
}

export function rotX(v: V3, a: number): V3 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return { x: v.x, y: v.y * c - v.z * s, z: v.y * s + v.z * c }
}

export function rotY(v: V3, a: number): V3 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return { x: v.x * c + v.z * s, y: v.y, z: -v.x * s + v.z * c }
}

export function project(v: V3, yaw: number, pitch: number, cx: number, cy: number, zoom: number): Projected {
  let p = rotY(v, yaw)
  p = rotX(p, pitch)
  const perspective = 520 / (520 - p.z * zoom)
  return {
    sx: cx + p.x * zoom * perspective,
    sy: cy - p.y * zoom * perspective,
    depth: p.z,
  }
}

export class Scene3D {
  items: DrawItem[] = []
  labels: HtmlLabel[] = []

  constructor(
    public ctx: CanvasRenderingContext2D,
    public w: number,
    public h: number,
    public yaw: number,
    public pitch: number,
    public zoom: number,
    public cx = w / 2,
    public cy = h / 2 + 8,
  ) {}

  p(v: V3): Projected {
    return project(v, this.yaw, this.pitch, this.cx, this.cy, this.zoom)
  }

  queue(depth: number, draw: DrawItem['draw']) {
    this.items.push({ depth, draw })
  }

  label(l: HtmlLabel) {
    this.labels.push(l)
  }

  sphere(c: V3, r: number, color: string, shade = 1) {
    const p = this.p(c)
    this.queue(p.depth, (g) => {
      const grad = g.createRadialGradient(p.sx - r * 2, p.sy - r * 2, 0, p.sx, p.sy, r * this.zoom)
      grad.addColorStop(0, color)
      grad.addColorStop(1, EM_COLORS.handDark)
      g.globalAlpha = Math.min(1, 0.65 + shade * 0.2)
      g.fillStyle = grad
      g.beginPath()
      g.arc(p.sx, p.sy, r * this.zoom, 0, Math.PI * 2)
      g.fill()
      g.globalAlpha = 1
    })
  }

  capsule(from: V3, to: V3, r: number, color: string, steps = 10) {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const c = {
        x: from.x + (to.x - from.x) * t,
        y: from.y + (to.y - from.y) * t,
        z: from.z + (to.z - from.z) * t,
      }
      this.sphere(c, r * (1 - t * 0.15), color, 1)
    }
  }

  line(a: V3, b: V3, color: string, width = 2, dash?: number[]) {
    const pa = this.p(a)
    const pb = this.p(b)
    const depth = (pa.depth + pb.depth) / 2
    this.queue(depth, (g) => {
      g.strokeStyle = color
      g.lineWidth = width
      g.lineCap = 'round'
      if (dash) g.setLineDash(dash)
      g.beginPath()
      g.moveTo(pa.sx, pa.sy)
      g.lineTo(pb.sx, pb.sy)
      g.stroke()
      if (dash) g.setLineDash([])
    })
  }

  arrow(from: V3, to: V3, color: string, width = 4) {
    const pa = this.p(from)
    const pb = this.p(to)
    const depth = (pa.depth + pb.depth) / 2 + 0.2
    this.queue(depth, (g) => {
      g.strokeStyle = color
      g.fillStyle = color
      g.lineWidth = width
      g.lineCap = 'round'
      g.beginPath()
      g.moveTo(pa.sx, pa.sy)
      g.lineTo(pb.sx, pb.sy)
      g.stroke()
      const angle = Math.atan2(pb.sy - pa.sy, pb.sx - pa.sx)
      const head = Math.max(10, width * 3)
      g.beginPath()
      g.moveTo(pb.sx, pb.sy)
      g.lineTo(pb.sx - head * Math.cos(angle - 0.35), pb.sy - head * Math.sin(angle - 0.35))
      g.lineTo(pb.sx - head * Math.cos(angle + 0.35), pb.sy - head * Math.sin(angle + 0.35))
      g.closePath()
      g.fill()
    })
  }

  axisArrow(origin: V3, dir: V3, color: string, label: string, sub?: string) {
    this.arrow(origin, add(origin, dir), color, 5)
    this.label({
      key: label,
      point: add(origin, scale(dir, 1.12)),
      text: label,
      sub,
      color,
      align: 'center',
    })
  }

  box(min: V3, max: V3, color: string, alpha = 0.85) {
    const corners: V3[] = [
      { x: min.x, y: min.y, z: min.z },
      { x: max.x, y: min.y, z: min.z },
      { x: max.x, y: max.y, z: min.z },
      { x: min.x, y: max.y, z: min.z },
      { x: min.x, y: min.y, z: max.z },
      { x: max.x, y: min.y, z: max.z },
      { x: max.x, y: max.y, z: max.z },
      { x: min.x, y: max.y, z: max.z },
    ]
    const edges: [number, number][] = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ]
    for (const [a, b] of edges) this.line(corners[a], corners[b], color, 2)
    const c = {
      x: (min.x + max.x) / 2,
      y: (min.y + max.y) / 2,
      z: (min.z + max.z) / 2,
    }
    const p = this.p(c)
    this.queue(p.depth - 0.5, (g) => {
      g.globalAlpha = alpha * 0.25
      g.fillStyle = color
      const pts = corners.map((corner) => this.p(corner))
      g.beginPath()
      g.moveTo(pts[0].sx, pts[0].sy)
      for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].sx, pts[i].sy)
      g.closePath()
      g.fill()
      g.globalAlpha = 1
    })
  }

  circleLoop(center: V3, radius: number, normal: 'y' | 'z', color: string, segments = 32) {
    const pts: V3[] = []
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2
      if (normal === 'y') {
        pts.push({ x: center.x + Math.cos(t) * radius, y: center.y, z: center.z + Math.sin(t) * radius })
      } else {
        pts.push({ x: center.x + Math.cos(t) * radius, y: center.y + Math.sin(t) * radius, z: center.z })
      }
    }
    for (let i = 0; i < pts.length - 1; i++) {
      if (i % 4 === 0) this.arrow(pts[i], pts[i + 1], color, 2)
      else this.line(pts[i], pts[i + 1], color, 1.5)
    }
  }

  flush() {
    this.items.sort((a, b) => a.depth - b.depth)
    for (const item of this.items) item.draw(this.ctx)
  }
}

export function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#f8fafc')
  bg.addColorStop(1, '#eef2ff')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.ellipse(w / 2, h * 0.78, w * 0.3, h * 0.05, 0, 0, Math.PI * 2)
  ctx.stroke()
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
  ctx.lineTo(x + w, y + h - radius)
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
  ctx.lineTo(x + radius, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

export function drawGraphPanel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  drawGraph: (g: CanvasRenderingContext2D, gx: number, gy: number, gw: number, gh: number) => void,
) {
  if (w < 8 || h < 8) return
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  roundRectPath(ctx, x, y, w, h, 8)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#64748b'
  ctx.font = '600 11px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(title, x + w / 2, y + 16)
  drawGraph(ctx, x + 12, y + 24, Math.max(4, w - 24), Math.max(4, h - 32))
}
