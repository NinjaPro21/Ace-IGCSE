import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'

export type FlemingHand = 'left' | 'right'
export type FlemingGuidePanel = 'left-hand' | 'right-hand'

const PANEL_META: Record<FlemingGuidePanel, { label: string; hand: FlemingHand; caption: string }> = {
  'left-hand': {
    label: 'Left-hand rule (motor)',
    hand: 'left',
    caption:
      'Motor effect — thumb = Force, first finger = Field (N→S), second finger = conventional Current. All three at 90°.',
  },
  'right-hand': {
    label: 'Right-hand rule (generator)',
    hand: 'right',
    caption:
      'Electromagnetic induction — thumb = Motion, first finger = Field (N→S), second finger = induced Current. All three at 90°.',
  },
}

type V3 = { x: number; y: number; z: number }

type DrawItem = {
  depth: number
  draw: (ctx: CanvasRenderingContext2D) => void
}

type LabelAnchor = {
  key: string
  point: V3
  text: string
  sub?: string
  color: string
  align: CanvasTextAlign
  offsetX: number
  offsetY: number
}

const COLORS = {
  force: '#dc2626',
  field: '#2563eb',
  current: '#16a34a',
  motion: '#9333ea',
  hand: '#5b9bd5',
  handDark: '#3d7ab8',
  handLight: '#7eb3e8',
}

function add(a: V3, b: V3): V3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }
}

function scale(v: V3, s: number): V3 {
  return { x: v.x * s, y: v.y * s, z: v.z * s }
}

function rotX(v: V3, a: number): V3 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return { x: v.x, y: v.y * c - v.z * s, z: v.y * s + v.z * c }
}

function rotY(v: V3, a: number): V3 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return { x: v.x * c + v.z * s, y: v.y, z: -v.x * s + v.z * c }
}

function mirrorHand(v: V3, hand: FlemingHand): V3 {
  return hand === 'right' ? { x: -v.x, y: v.y, z: v.z } : v
}

function project(
  v: V3,
  yaw: number,
  pitch: number,
  cx: number,
  cy: number,
  zoom: number,
): { sx: number; sy: number; depth: number } {
  let p = rotY(v, yaw)
  p = rotX(p, pitch)
  const perspective = 520 / (520 - p.z * zoom)
  return {
    sx: cx + p.x * zoom * perspective,
    sy: cy - p.y * zoom * perspective,
    depth: p.z,
  }
}

function buildFingerSpheres(from: V3, to: V3, radius: number, steps: number): Array<{ c: V3; r: number }> {
  const pts: Array<{ c: V3; r: number }> = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const c = {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
      z: from.z + (to.z - from.z) * t,
    }
    const taper = 1 - t * 0.22
    pts.push({ c, r: radius * taper })
  }
  return pts
}

function renderScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  hand: FlemingHand,
  yaw: number,
  pitch: number,
): LabelAnchor[] {
  const cx = width / 2
  const cy = height / 2 + 12
  const zoom = Math.min(width, height) * 0.095
  const items: DrawItem[] = []

  const palm: V3 = { x: 0, y: -0.35, z: 0 }
  const wrist: V3 = { x: 0, y: -1.05, z: -0.15 }

  const thumbBase = { x: 0.42, y: -0.05, z: 0.18 }
  const thumbTip = { x: 0.35, y: 1.35, z: 0.28 }
  const indexBase = { x: 0.05, y: 0.15, z: 0.05 }
  const indexTip = { x: -1.25, y: 0.22, z: 0.02 }
  const middleBase = { x: 0.18, y: 0.18, z: 0.08 }
  const middleTip = { x: 0.12, y: 0.28, z: 1.15 }
  const ringBase = { x: 0.38, y: 0.05, z: 0.02 }
  const ringTip = { x: 0.55, y: -0.55, z: 0.35 }
  const pinkyBase = { x: 0.52, y: -0.08, z: -0.05 }
  const pinkyTip = { x: 0.62, y: -0.62, z: 0.12 }

  const parts: Array<{ from: V3; to: V3; r: number; steps: number; shade: number }> = [
    { from: wrist, to: palm, r: 0.42, steps: 8, shade: 0.85 },
    { from: palm, to: thumbBase, r: 0.28, steps: 4, shade: 0.9 },
    { from: thumbBase, to: thumbTip, r: 0.24, steps: 14, shade: 1 },
    { from: palm, to: indexBase, r: 0.22, steps: 4, shade: 0.95 },
    { from: indexBase, to: indexTip, r: 0.2, steps: 14, shade: 1.02 },
    { from: palm, to: middleBase, r: 0.22, steps: 4, shade: 0.98 },
    { from: middleBase, to: middleTip, r: 0.2, steps: 14, shade: 1.04 },
    { from: palm, to: ringBase, r: 0.18, steps: 4, shade: 0.88 },
    { from: ringBase, to: ringTip, r: 0.16, steps: 8, shade: 0.82 },
    { from: palm, to: pinkyBase, r: 0.15, steps: 3, shade: 0.8 },
    { from: pinkyBase, to: pinkyTip, r: 0.13, steps: 7, shade: 0.78 },
  ]

  for (const part of parts) {
    const from = mirrorHand(part.from, hand)
    const to = mirrorHand(part.to, hand)
    for (const { c, r } of buildFingerSpheres(from, to, part.r, part.steps)) {
      const p = project(c, yaw, pitch, cx, cy, zoom)
      const colorMix = part.shade
      items.push({
        depth: p.depth,
        draw: (g) => {
          const grad = g.createRadialGradient(p.sx - r * 2, p.sy - r * 2, 0, p.sx, p.sy, r * zoom * 1.1)
          grad.addColorStop(0, COLORS.handLight)
          grad.addColorStop(0.55, COLORS.hand)
          grad.addColorStop(1, COLORS.handDark)
          g.globalAlpha = Math.min(1, 0.72 + colorMix * 0.12)
          g.fillStyle = grad
          g.beginPath()
          g.arc(p.sx, p.sy, r * zoom * 1.05, 0, Math.PI * 2)
          g.fill()
          g.globalAlpha = 1
        },
      })
    }
  }

  const origin = mirrorHand({ x: 0, y: 0, z: 0 }, hand)
  const axes: Array<{ dir: V3; color: string; width: number }> = [
    { dir: { x: 0, y: 1.55, z: 0 }, color: hand === 'left' ? COLORS.force : COLORS.motion, width: 5 },
    { dir: { x: -1.55, y: 0, z: 0 }, color: COLORS.field, width: 5 },
    { dir: { x: 0, y: 0, z: 1.55 }, color: COLORS.current, width: 5 },
  ]

  for (const axis of axes) {
    const dir = mirrorHand(axis.dir, hand)
    const tip = add(origin, dir)
    const o = project(origin, yaw, pitch, cx, cy, zoom)
    const t = project(tip, yaw, pitch, cx, cy, zoom)
    items.push({
      depth: (o.depth + t.depth) / 2 + 0.5,
      draw: (g) => {
        g.strokeStyle = axis.color
        g.lineWidth = axis.width
        g.lineCap = 'round'
        g.beginPath()
        g.moveTo(o.sx, o.sy)
        g.lineTo(t.sx, t.sy)
        g.stroke()

        const angle = Math.atan2(t.sy - o.sy, t.sx - o.sx)
        const head = 14
        g.fillStyle = axis.color
        g.beginPath()
        g.moveTo(t.sx, t.sy)
        g.lineTo(t.sx - head * Math.cos(angle - 0.35), t.sy - head * Math.sin(angle - 0.35))
        g.lineTo(t.sx - head * Math.cos(angle + 0.35), t.sy - head * Math.sin(angle + 0.35))
        g.closePath()
        g.fill()
      },
    })
  }

  items.sort((a, b) => a.depth - b.depth)
  for (const item of items) item.draw(ctx)

  const thumbLabel = hand === 'left' ? 'F — Force' : 'Motion'
  const thumbSub = hand === 'left' ? 'thumb' : 'thumb'
  const fieldDir = mirrorHand({ x: -1.55, y: 0, z: 0 }, hand)
  const currentDir = mirrorHand({ x: 0, y: 0, z: 1.55 }, hand)
  const forceDir = mirrorHand({ x: 0, y: 1.55, z: 0 }, hand)

  return [
    {
      key: 'thumb',
      point: add(origin, scale(forceDir, 1.05)),
      text: thumbLabel,
      sub: thumbSub,
      color: hand === 'left' ? COLORS.force : COLORS.motion,
      align: hand === 'left' ? 'left' : 'left',
      offsetX: 10,
      offsetY: -8,
    },
    {
      key: 'field',
      point: add(origin, scale(fieldDir, 1.05)),
      text: 'B — Field',
      sub: '1st finger · N → S',
      color: COLORS.field,
      align: hand === 'left' ? 'right' : 'left',
      offsetX: hand === 'left' ? -10 : 10,
      offsetY: -4,
    },
    {
      key: 'current',
      point: add(origin, scale(currentDir, 1.05)),
      text: 'I — Current',
      sub: hand === 'left' ? '2nd finger' : '2nd finger · induced',
      color: COLORS.current,
      align: 'center',
      offsetX: 0,
      offsetY: 14,
    },
  ]
}

type LabelPosition = LabelAnchor & { sx: number; sy: number }

function HandCanvas({
  hand,
  yaw,
  pitch,
  compact,
}: {
  hand: FlemingHand
  yaw: number
  pitch: number
  compact?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [labels, setLabels] = useState<LabelPosition[]>([])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    const w = rect.width
    const h = rect.height
    canvas.width = w * dpr
    canvas.height = h * dpr
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    const bg = ctx.createLinearGradient(0, 0, 0, h)
    bg.addColorStop(0, '#f8fafc')
    bg.addColorStop(1, '#eef2ff')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.ellipse(w / 2, h * 0.72, w * 0.28, h * 0.06, 0, 0, Math.PI * 2)
    ctx.stroke()

    const anchors = renderScene(ctx, w, h, hand, yaw, pitch)
    const cx = w / 2
    const cy = h / 2 + 12
    const zoom = Math.min(w, h) * 0.095
    setLabels(
      anchors.map((lb) => {
        const p = project(lb.point, yaw, pitch, cx, cy, zoom)
        return { ...lb, sx: p.sx, sy: p.sy }
      }),
    )
  }, [hand, yaw, pitch])

  useEffect(() => {
    draw()
  }, [draw])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(draw)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [draw])

  return (
    <div className={`ace-fleming-3d__stage${compact ? ' ace-fleming-3d__stage--compact' : ''}`}>
      <canvas ref={canvasRef} className="ace-fleming-3d__canvas" aria-hidden="true" />
      <div className="ace-fleming-3d__labels" aria-hidden="true">
        {labels.map((lb) => (
          <div
            key={lb.key}
            className="ace-fleming-3d__label"
            style={{
              left: lb.sx + lb.offsetX,
              top: lb.sy + lb.offsetY,
              textAlign: lb.align,
              color: lb.color,
            }}
          >
            <strong>{lb.text}</strong>
            {lb.sub ? <span>{lb.sub}</span> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

function HandView({ hand, compact }: { hand: FlemingHand; compact?: boolean }) {
  const [yaw, setYaw] = useState(hand === 'left' ? 0.55 : -0.55)
  const [pitch, setPitch] = useState(0.35)
  const dragRef = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(null)

  const onPointerDown = (e: PointerEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY, yaw, pitch }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.x
    const dy = e.clientY - dragRef.current.y
    setYaw(dragRef.current.yaw + dx * 0.012)
    setPitch(Math.max(-0.9, Math.min(1.1, dragRef.current.pitch + dy * 0.012)))
  }

  const onPointerUp = () => {
    dragRef.current = null
  }

  const title =
    hand === 'left'
      ? "Fleming's Left-Hand Rule (Motor Effect)"
      : "Fleming's Right-Hand Rule (Generator / Induction)"

  return (
    <div className={`ace-fleming-3d${compact ? ' ace-fleming-3d--compact' : ''}`}>
      {!compact ? <h3 className="ace-fleming-3d__title">{title}</h3> : null}
      <div
        className="ace-fleming-3d__viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="img"
        aria-label={`Interactive 3D ${hand} hand showing Fleming's rule with draggable rotation`}
      >
        <HandCanvas hand={hand} yaw={yaw} pitch={pitch} compact={compact} />
        <p className="ace-fleming-3d__hint">Drag to rotate · thumb, 1st &amp; 2nd fingers at 90°</p>
      </div>
      <div className="ace-fleming-3d__legend">
        <span className="ace-fleming-3d__chip" style={{ '--chip-color': hand === 'left' ? COLORS.force : COLORS.motion } as CSSProperties}>
          {hand === 'left' ? 'Thumb → Force' : 'Thumb → Motion'}
        </span>
        <span className="ace-fleming-3d__chip" style={{ '--chip-color': COLORS.field } as CSSProperties}>
          1st finger → Field
        </span>
        <span className="ace-fleming-3d__chip" style={{ '--chip-color': COLORS.current } as CSSProperties}>
          2nd finger → Current
        </span>
      </div>
    </div>
  )
}

export function FlemingHandRuleExplorer({
  hand,
  panels,
  compact,
}: {
  hand?: FlemingHand
  panels?: FlemingGuidePanel[]
  compact?: boolean
}) {
  const available = panels?.length
    ? panels.filter((p) => p in PANEL_META)
    : (['left-hand', 'right-hand'] as FlemingGuidePanel[])
  const [active, setActive] = useState<FlemingGuidePanel>(
    hand === 'right' ? 'right-hand' : hand === 'left' ? 'left-hand' : available[0] ?? 'left-hand',
  )

  const showTabs = !hand && available.length > 1
  const activeHand = hand ?? PANEL_META[active].hand

  return (
    <section className={`ace-explorer ace-fleming-explorer${compact ? ' ace-fleming-explorer--compact' : ''}`}>
      {!compact ? (
        <h2 className="ace-explorer__title">Interactive 3D — Fleming&apos;s Hand Rules</h2>
      ) : null}
      {showTabs ? (
        <div className="ace-fleming-explorer__tabs" role="tablist">
          {available.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active === id}
              className={`ace-fleming-explorer__tab${active === id ? ' ace-fleming-explorer__tab--active' : ''}`}
              onClick={() => setActive(id)}
            >
              {PANEL_META[id].label}
            </button>
          ))}
        </div>
      ) : null}
      <HandView hand={activeHand} compact={compact} />
      <p className="ace-fleming-3d__caption">
        {hand
          ? PANEL_META[hand === 'left' ? 'left-hand' : 'right-hand'].caption
          : PANEL_META[active].caption}
      </p>
    </section>
  )
}

export function parseFlemingHandFromDiagram(diagram: string): FlemingHand | null {
  if (!diagram.includes('ace-fleming-3d')) return null
  if (/data-hand="right"/.test(diagram)) return 'right'
  if (/data-hand="left"/.test(diagram)) return 'left'
  if (/Right-Hand|right-hand rule/i.test(diagram)) return 'right'
  if (/Left-Hand|left-hand rule/i.test(diagram)) return 'left'
  return 'left'
}
