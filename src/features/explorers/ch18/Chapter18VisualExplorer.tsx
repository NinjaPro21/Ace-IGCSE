import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { project } from './em3dCore'
import { isHandDiagramScene, onFlemingHandImageReady } from './handDiagram2d'
import {
  renderCh18Scene,
  SCENE_META,
  type Ch18SceneId,
  type SceneParams,
} from './ch18Scenes'

export type { Ch18SceneId }

export function Chapter18VisualExplorer({
  scene,
  compact,
  hero,
}: {
  scene: Ch18SceneId
  compact?: boolean
  hero?: boolean
}) {
  const meta = SCENE_META[scene] ?? SCENE_META['fleming-left']
  const isHand = isHandDiagramScene(scene)
  const isFlatCanvas =
    isHand || scene === 'wire-field' || scene === 'generator-voltage' || scene === 'transformer-voltage'
  const [yaw, setYaw] = useState(scene.startsWith('fleming') ? (scene === 'fleming-left' ? 0.55 : -0.55) : 0.45)
  const [pitch, setPitch] = useState(0.32)
  const [stage, setStage] = useState(0)
  const [anim, setAnim] = useState(0.15)
  const [playing, setPlaying] = useState(false)
  const [stepUp, setStepUp] = useState(true)
  const [zoomScale, setZoomScale] = useState(1)
  const [flipped, setFlipped] = useState(false)
  const dragRef = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [labels, setLabels] = useState<Array<{ key: string; sx: number; sy: number; text: string; sub?: string; color: string; align: CanvasTextAlign }>>([])

  useEffect(() => {
    if (!playing) return
    let frame = 0
    const id = window.setInterval(() => {
      frame += 1
      setAnim((frame % 120) / 120)
    }, 40)
    return () => window.clearInterval(id)
  }, [playing])

  const params: SceneParams = { yaw, pitch, stage, anim, stepUp, zoomScale, flipped }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    const w = rect.width
    const h = rect.height
    if (w < 20 || h < 20) return
    canvas.width = w * dpr
    canvas.height = h * dpr
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    try {
      const htmlLabels = renderCh18Scene(ctx, w, h, scene, params)
      if (isFlatCanvas) {
        setLabels([])
        return
      }
      const cx = w / 2
      const cy = h / 2 + 8
      const zoom = Math.min(w, h) * 0.085 * zoomScale
      setLabels(
        htmlLabels.map((lb) => {
          const p = project(lb.point, yaw, pitch, cx, cy, zoom)
          return {
            key: lb.key,
            sx: p.sx + (lb.offsetX ?? 0),
            sy: p.sy + (lb.offsetY ?? 0),
            text: lb.text,
            sub: lb.sub,
            color: lb.color,
            align: lb.align ?? 'center',
          }
        }),
      )
    } catch (err) {
      console.error('[Chapter18VisualExplorer]', scene, err)
      ctx.fillStyle = '#f8fafc'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#64748b'
      ctx.font = '600 14px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Diagram failed to render — try refreshing the page', w / 2, h / 2)
      setLabels([])
    }
  }, [scene, yaw, pitch, stage, anim, stepUp, zoomScale, flipped, isFlatCanvas])

  useEffect(() => {
    draw()
  }, [draw])

  useEffect(() => onFlemingHandImageReady(draw), [draw])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(draw)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [draw])

  const onPointerDown = (e: PointerEvent) => {
    if (isFlatCanvas) return
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

  const stageLabels = ['Moving IN', 'Stationary', 'Pulling OUT']

  return (
    <section
      className={`enlight-em-3d-explorer${compact ? ' enlight-em-3d-explorer--compact' : ''}${hero ? ' enlight-em-3d-explorer--hero' : ''}`}
    >
      {!compact ? <h2 className="enlight-explorer__title">Interactive 3D — {meta.title}</h2> : null}
      <h3 className="enlight-em-3d-explorer__scene-title">{meta.title}</h3>

      {meta.hasStage ? (
        <div className="enlight-em-3d-explorer__controls" role="group" aria-label="Experiment stage">
          {stageLabels.map((label, i) => (
            <button
              key={label}
              type="button"
              className={`enlight-em-3d-explorer__btn${stage === i ? ' enlight-em-3d-explorer__btn--active' : ''}`}
              onClick={() => setStage(i)}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>
      ) : null}

      {meta.hasAnim ? (
        <div className="enlight-em-3d-explorer__controls enlight-em-3d-explorer__controls--row">
          <label className="enlight-em-3d-explorer__slider-label">
            Angle
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(anim * 100)}
              onChange={(e) => {
                setPlaying(false)
                setAnim(Number(e.target.value) / 100)
              }}
            />
          </label>
          <button
            type="button"
            className={`enlight-em-3d-explorer__btn${playing ? ' enlight-em-3d-explorer__btn--active' : ''}`}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? 'Pause' : 'Play'}
          </button>
        </div>
      ) : null}

      {meta.hasToggle ? (
        <div className="enlight-em-3d-explorer__controls">
          <button
            type="button"
            className={`enlight-em-3d-explorer__btn${stepUp ? ' enlight-em-3d-explorer__btn--active' : ''}`}
            onClick={() => setStepUp(true)}
          >
            Step-up
          </button>
          <button
            type="button"
            className={`enlight-em-3d-explorer__btn${!stepUp ? ' enlight-em-3d-explorer__btn--active' : ''}`}
            onClick={() => setStepUp(false)}
          >
            Step-down
          </button>
        </div>
      ) : null}

      {meta.hasFlip ? (
        <div className="enlight-em-3d-explorer__controls">
          <button
            type="button"
            className={`enlight-em-3d-explorer__btn${flipped ? ' enlight-em-3d-explorer__btn--active' : ''}`}
            onClick={() => setFlipped((f) => !f)}
          >
            {flipped ? 'Flip view (on)' : 'Flip view'}
          </button>
        </div>
      ) : null}

      <div
        className={`enlight-em-3d-explorer__viewport${isFlatCanvas ? ' enlight-em-3d-explorer__viewport--2d' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="img"
        aria-label={`Interactive diagram: ${meta.title}`}
      >
        <div className={`enlight-em-3d-explorer__stage${hero ? ' enlight-em-3d-explorer__stage--hero' : ''}`}>
          <div className="enlight-em-3d-explorer__zoom" role="group" aria-label="Zoom" onPointerDown={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="enlight-em-3d-explorer__zoom-btn"
              aria-label="Zoom out"
              disabled={zoomScale <= 0.75}
              onClick={(e) => {
                e.stopPropagation()
                setZoomScale((z) => Math.max(0.75, Math.round((z - 0.25) * 100) / 100))
              }}
            >
              −
            </button>
            <span className="enlight-em-3d-explorer__zoom-label">{Math.round(zoomScale * 100)}%</span>
            <button
              type="button"
              className="enlight-em-3d-explorer__zoom-btn"
              aria-label="Zoom in"
              disabled={zoomScale >= 2.5}
              onClick={(e) => {
                e.stopPropagation()
                setZoomScale((z) => Math.min(2.5, Math.round((z + 0.25) * 100) / 100))
              }}
            >
              +
            </button>
            {zoomScale !== 1 ? (
              <button
                type="button"
                className="enlight-em-3d-explorer__zoom-reset"
                onClick={(e) => {
                  e.stopPropagation()
                  setZoomScale(1)
                }}
              >
                Reset
              </button>
            ) : null}
          </div>
          <canvas ref={canvasRef} className="enlight-em-3d-explorer__canvas" />
          <div className="enlight-fleming-3d__labels" aria-hidden="true">
            {labels.map((lb) => (
              <div
                key={lb.key}
                className="enlight-fleming-3d__label"
                style={{
                  left: lb.sx,
                  top: lb.sy,
                  textAlign: lb.align,
                  color: lb.color,
                } as CSSProperties}
              >
                <strong>{lb.text}</strong>
                {lb.sub ? <span>{lb.sub}</span> : null}
              </div>
            ))}
          </div>
        </div>
        <p className="enlight-fleming-3d__hint">{meta.hint}</p>
      </div>

      <p className="enlight-fleming-3d__caption">{meta.caption}</p>
    </section>
  )
}
