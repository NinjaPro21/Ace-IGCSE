import {
  Scene3D,
  EM_COLORS,
  drawBackground,
  drawGraphPanel,
  type V3,
  type HtmlLabel,
} from './em3dCore'
import { isHandDiagramScene, renderHandDiagram2D, renderWireField2D, withCanvasZoom } from './handDiagram2d'

export type Ch18SceneId =
  | 'fleming-left'
  | 'fleming-right'
  | 'grip-rule'
  | 'wire-field'
  | 'solenoid-field'
  | 'induction-magnet'
  | 'induction-ring'
  | 'induction-emf'
  | 'generator'
  | 'generator-voltage'
  | 'catapult-field'
  | 'dc-motor'
  | 'transformer'
  | 'transmission-grid'
  | 'transformer-voltage'

export type SceneParams = {
  yaw: number
  pitch: number
  /** 0–2 for induction stages; coil angle for motor/generator */
  stage?: number
  /** 0–1 animation parameter */
  anim?: number
  stepUp?: boolean
  /** 1 = default; >1 zooms in for clearer detail */
  zoomScale?: number
  /** Flip hand diagrams vertically */
  flipped?: boolean
}

export const SCENE_META: Record<
  Ch18SceneId,
  { title: string; caption: string; hint: string; hasStage?: boolean; hasAnim?: boolean; hasToggle?: boolean; hasFlip?: boolean }
> = {
  'fleming-left': {
    title: "Fleming's Left-Hand Rule (Motor)",
    caption: 'Thumb = Force, 1st finger = Field (N→S), 2nd finger = conventional Current — all at 90°.',
    hint: 'Use Zoom +/− for a closer view · Flip view if the hand looks upside-down',
    hasFlip: true,
  },
  'fleming-right': {
    title: "Fleming's Right-Hand Rule (Generator)",
    caption: 'Thumb = Motion, 1st finger = Field (N→S), 2nd finger = induced Current — all at 90°.',
    hint: 'Use Zoom +/− for a closer view · Flip view if the hand looks upside-down',
    hasFlip: true,
  },
  'grip-rule': {
    title: 'Right-Hand Grip Rule',
    caption: 'Thumb = conventional current I; curled fingers show magnetic field B circling the wire.',
    hint: 'Use Zoom +/− · Flip view to mirror the diagram',
    hasFlip: true,
  },
  'wire-field': {
    title: 'Field Around a Straight Wire',
    caption: 'Concentric circles centred on the wire — strongest near the wire; direction from the grip rule.',
    hint: 'Use Zoom +/− for a closer view · current into the page (⊗)',
  },
  'solenoid-field': {
    title: 'Solenoid Field Pattern',
    caption: 'Uniform field inside the coil; outside loops mimic a bar magnet with N and S poles.',
    hint: 'Drag to rotate · use grip rule to find N pole',
  },
  'induction-magnet': {
    title: 'Magnet & Solenoid Experiment',
    caption: 'Moving the magnet induces current; stationary magnet gives no deflection (Lenz\'s law).',
    hint: 'Use stages or Play · relative motion is essential',
    hasStage: true,
    hasAnim: true,
  },
  'induction-ring': {
    title: "Faraday's Iron Ring",
    caption: 'Changing current in coil A induces a momentary e.m.f. in coil B (mutual induction).',
    hint: 'Drag to rotate · deflection only while current is changing',
  },
  'induction-emf': {
    title: 'Induced e.m.f. vs Time',
    caption: 'Entering coil (+ε), fully inside (ε=0), exiting faster (−ε peak larger & sharper).',
    hint: 'Use stages · exit peak is steeper because speed increases',
    hasStage: true,
  },
  generator: {
    title: 'A.c. Generator',
    caption: 'Rotating coil cuts field lines between curved N–S poles; slip rings transfer a.c. to the circuit.',
    hint: 'Drag to rotate view · slide coil angle or press Play',
    hasAnim: true,
  },
  'generator-voltage': {
    title: 'Generator Output Waveform',
    caption: 'Maximum e.m.f. when coil sides cut field at right angles (90°, 270°); zero at 0°, 180°, 360°.',
    hint: 'Angle slider shows corresponding point on sine wave',
    hasAnim: true,
  },
  'catapult-field': {
    title: 'Catapult Field (Motor Effect)',
    caption: 'Wire field reinforces the main field on one side and cancels on the other — wire pushed toward weaker side.',
    hint: 'Drag to rotate · force F on current-carrying wire',
  },
  'dc-motor': {
    title: 'D.c. Motor',
    caption: 'Split-ring commutator reverses current every half turn; opposite forces create continuous rotation.',
    hint: 'Drag to rotate · slide coil angle or press Play',
    hasAnim: true,
  },
  transformer: {
    title: 'Transformer Structure',
    caption: 'Varying flux in laminated iron core links primary and secondary; Vp/Vs = Np/Ns.',
    hint: 'Toggle step-up / step-down · drag to rotate',
    hasToggle: true,
  },
  'transmission-grid': {
    title: 'High-Voltage Transmission',
    caption: 'Step-up reduces current I → less I²R heat loss in cables; step-down for safe home voltage.',
    hint: 'Drag to rotate isometric view of the grid chain',
  },
  'transformer-voltage': {
    title: 'Primary vs Secondary Voltage',
    caption: 'Same frequency, different amplitudes after step-up or step-down.',
    hint: 'Toggle step-up / step-down to compare wave heights',
    hasToggle: true,
  },
}

function drawSolenoid(scene: Scene3D) {
  for (let i = 0; i < 14; i++) {
    const t = i / 13
    const x = -1.1 + t * 2.2
    const y = Math.sin(t * Math.PI * 6) * 0.35
    scene.sphere({ x, y, z: 0 }, 0.12, EM_COLORS.coil)
  }
  for (let z = -0.3; z <= 0.3; z += 0.15) {
    scene.line({ x: -0.85, y: 0, z }, { x: 0.85, y: 0, z }, EM_COLORS.field, 2)
    scene.arrow({ x: -0.3, y: 0, z }, { x: 0.3, y: 0, z }, EM_COLORS.field, 2)
  }
  scene.label({ key: 'n', point: { x: 0, y: 0.65, z: 0 }, text: 'N pole', color: EM_COLORS.north })
  scene.label({ key: 's', point: { x: 0, y: -0.65, z: 0 }, text: 'S pole', color: EM_COLORS.south })
  scene.circleLoop({ x: 0, y: 0.75, z: 0 }, 0.55, 'z', EM_COLORS.field, 24)
  scene.circleLoop({ x: 0, y: -0.75, z: 0 }, 0.55, 'z', EM_COLORS.field, 24)
}

function drawMagnetPoles(scene: Scene3D, gap = 2.2) {
  scene.box({ x: -gap / 2 - 0.35, y: -0.5, z: -0.8 }, { x: -gap / 2 + 0.35, y: 0.5, z: 0.8 }, EM_COLORS.north, 0.7)
  scene.box({ x: gap / 2 - 0.35, y: -0.5, z: -0.8 }, { x: gap / 2 + 0.35, y: 0.5, z: 0.8 }, EM_COLORS.south, 0.7)
  scene.label({ key: 'n', point: { x: -gap / 2, y: 0.65, z: 0 }, text: 'N', color: EM_COLORS.north })
  scene.label({ key: 's', point: { x: gap / 2, y: 0.65, z: 0 }, text: 'S', color: EM_COLORS.south })
  for (let y = -0.35; y <= 0.35; y += 0.18) {
    scene.arrow({ x: -gap / 2 + 0.4, y, z: 0 }, { x: gap / 2 - 0.4, y, z: 0 }, '#94a3b8', 1.5)
  }
}

function drawCoil(scene: Scene3D, angle: number, width = 0.9, height = 0.7) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const corners: V3[] = [
    { x: -width / 2, y: height / 2, z: 0 },
    { x: width / 2, y: height / 2, z: 0 },
    { x: width / 2, y: -height / 2, z: 0 },
    { x: -width / 2, y: -height / 2, z: 0 },
  ].map((c) => ({
    x: c.x * cos - c.z * sin,
    y: c.y,
    z: c.x * sin + c.z * cos,
  }))
  for (let i = 0; i < 4; i++) scene.line(corners[i], corners[(i + 1) % 4], EM_COLORS.coil, 3)
}

const BAR_MAG = { halfX: 0.38, halfY: 0.32, halfZ: 0.22 }

function drawBarMagnet(scene: Scene3D, cx: number) {
  scene.box(
    { x: cx - BAR_MAG.halfX, y: -BAR_MAG.halfY, z: -BAR_MAG.halfZ },
    { x: cx, y: BAR_MAG.halfY, z: BAR_MAG.halfZ },
    EM_COLORS.north,
    0.92,
  )
  scene.box(
    { x: cx, y: -BAR_MAG.halfY, z: -BAR_MAG.halfZ },
    { x: cx + BAR_MAG.halfX, y: BAR_MAG.halfY, z: BAR_MAG.halfZ },
    EM_COLORS.south,
    0.92,
  )
  scene.label({ key: `n-${cx}`, point: { x: cx - BAR_MAG.halfX * 0.5, y: BAR_MAG.halfY + 0.14, z: 0 }, text: 'N', color: EM_COLORS.north })
  scene.label({ key: `s-${cx}`, point: { x: cx + BAR_MAG.halfX * 0.5, y: BAR_MAG.halfY + 0.14, z: 0 }, text: 'S', color: EM_COLORS.south })
}

function drawSolenoidCoil(scene: Scene3D) {
  const turns = 11
  for (let i = 0; i < turns; i++) {
    const t = i / (turns - 1)
    const x = -0.55 + t * 1.1
    const y = Math.sin(t * Math.PI * 5) * 0.42
    scene.sphere({ x, y, z: 0.35 }, 0.11, EM_COLORS.coil)
  }
  scene.label({ key: 'coil', point: { x: 0, y: 0.62, z: 0.35 }, text: 'Solenoid coil', color: EM_COLORS.coil })
}

function drawGalvanometerCircuit(scene: Scene3D, needle: number) {
  const leftTap = { x: -0.55, y: -0.42, z: 0.35 }
  const rightTap = { x: 0.55, y: -0.42, z: 0.35 }
  const leftTerm = { x: -0.22, y: -0.95, z: 0.48 }
  const rightTerm = { x: 0.22, y: -0.95, z: 0.48 }

  scene.line(leftTap, { x: leftTap.x, y: -0.72, z: 0.48 }, EM_COLORS.coil, 3)
  scene.line({ x: leftTap.x, y: -0.72, z: 0.48 }, leftTerm, EM_COLORS.coil, 3)
  scene.line(rightTap, { x: rightTap.x, y: -0.72, z: 0.48 }, EM_COLORS.coil, 3)
  scene.line({ x: rightTap.x, y: -0.72, z: 0.48 }, rightTerm, EM_COLORS.coil, 3)

  scene.box({ x: -0.32, y: -1.22, z: 0.38 }, { x: 0.32, y: -0.82, z: 0.62 }, '#334155', 0.88)
  scene.line({ x: -0.18, y: -1.02, z: 0.62 }, { x: 0.18, y: -1.02, z: 0.62 }, '#94a3b8', 2)
  scene.line({ x: 0, y: -1.02, z: 0.62 }, { x: needle * 0.16, y: -1.02 + Math.abs(needle) * 0.08, z: 0.62 }, '#dc2626', 3)
  scene.label({
    key: 'galv',
    point: { x: 0, y: -1.38, z: 0.5 },
    text: needle === 0 ? 'Galvanometer: 0' : needle > 0 ? 'Galvanometer: deflects →' : 'Galvanometer: deflects ←',
    color: needle === 0 ? '#64748b' : '#dc2626',
  })
}

function drawInductionMagnet(scene: Scene3D, stage: number, anim: number) {
  drawSolenoidCoil(scene)
  drawGalvanometerCircuit(scene, stage === 0 ? 0.55 : stage === 2 ? -0.55 : 0)

  const bases = [-1.35, -0.05, 1.05]
  const base = bases[Math.min(2, Math.max(0, stage))]
  const offset = stage === 0 ? anim * 0.55 : stage === 2 ? -anim * 0.55 : 0
  const cx = base + offset

  drawBarMagnet(scene, cx)

  if (stage !== 1) {
    const dir = stage === 0 ? 1 : -1
    scene.arrow(
      { x: cx + dir * (BAR_MAG.halfX + 0.15), y: 0.55, z: 0 },
      { x: cx + dir * (BAR_MAG.halfX + 0.55), y: 0.55, z: 0 },
      EM_COLORS.motion,
      4,
    )
    scene.label({
      key: 'motion',
      point: { x: cx + dir * (BAR_MAG.halfX + 0.65), y: 0.72, z: 0 },
      text: stage === 0 ? 'Moving IN' : 'Pulling OUT',
      color: EM_COLORS.motion,
    })
  }

  for (let i = 0; i < 5; i++) {
    const y = -0.28 + i * 0.14
    const fromX = cx + BAR_MAG.halfX * 0.3
    scene.arrow({ x: fromX, y, z: 0.52 }, { x: -0.15, y, z: 0.52 }, EM_COLORS.flux, 2)
  }
}

function drawInductionRing(scene: Scene3D) {
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 10) {
    scene.sphere({ x: Math.cos(a) * 1.1, y: 0, z: Math.sin(a) * 0.55 }, 0.14, EM_COLORS.iron)
  }
  for (let y = -0.5; y <= 0.5; y += 0.25) {
    scene.sphere({ x: -1.15, y, z: 0 }, 0.08, EM_COLORS.coil)
    scene.sphere({ x: 1.15, y, z: 0 }, 0.08, '#dc2626')
  }
  scene.label({ key: 'a', point: { x: -1.15, y: 0.75, z: 0 }, text: 'Coil A (d.c.)', color: EM_COLORS.coil })
  scene.label({ key: 'b', point: { x: 1.15, y: 0.75, z: 0 }, text: 'Coil B → galvanometer', color: '#dc2626' })
}

function drawInductionEmf(scene: Scene3D, stage: number, w: number, h: number, ctx: CanvasRenderingContext2D) {
  for (let i = 0; i < 7; i++) {
    scene.sphere({ x: -0.6 + (i / 6) * 1.2, y: Math.sin(i * 0.9) * 0.35, z: 0 }, 0.09, EM_COLORS.coil)
  }
  const yPos = stage === 0 ? 0.9 : stage === 1 ? 0 : -0.9
  scene.box({ x: -0.12, y: yPos - 0.22, z: -0.12 }, { x: 0.12, y: yPos + 0.22, z: 0.12 }, EM_COLORS.north, 0.85)
  scene.label({
    key: 'st',
    point: { x: 0, y: yPos + 0.45, z: 0 },
    text: stage === 0 ? '① ENTER (+ε)' : stage === 1 ? '② INSIDE (ε=0)' : '③ EXIT (−ε)',
    color: stage === 0 ? EM_COLORS.emf : stage === 1 ? '#64748b' : EM_COLORS.force,
  })
  scene.flush()
  drawGraphPanel(ctx, 16, h * 0.58, w - 32, h * 0.36, 'Induced e.m.f. vs time', (g, gx, gy, gw, gh) => {
    g.strokeStyle = '#64748b'
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(gx, gy + gh / 2)
    g.lineTo(gx + gw, gy + gh / 2)
    g.stroke()
    g.beginPath()
    g.moveTo(gx, gy)
    g.lineTo(gx, gy + gh)
    g.stroke()
    g.strokeStyle = EM_COLORS.emf
    g.lineWidth = 2.5
    g.beginPath()
    for (let x = 0; x <= gw; x++) {
      const t = x / gw
      let y = 0
      if (t < 0.25) y = -Math.sin((t / 0.25) * Math.PI) * gh * 0.35
      else if (t < 0.55) y = 0
      else y = Math.sin(((t - 0.55) / 0.45) * Math.PI) * gh * 0.45
      if (x === 0) g.moveTo(gx + x, gy + gh / 2 + y)
      else g.lineTo(gx + x, gy + gh / 2 + y)
    }
    g.stroke()
    const markerX = stage === 0 ? gx + gw * 0.12 : stage === 1 ? gx + gw * 0.4 : gx + gw * 0.78
    g.fillStyle = stage === 1 ? '#64748b' : stage === 0 ? EM_COLORS.emf : EM_COLORS.force
    g.beginPath()
    g.arc(markerX, gy + gh / 2 + (stage === 0 ? -gh * 0.3 : stage === 1 ? 0 : gh * 0.35), 5, 0, Math.PI * 2)
    g.fill()
  })
}

function drawGenerator(scene: Scene3D, angle: number) {
  drawMagnetPoles(scene, 2.6)
  drawCoil(scene, angle, 0.85, 0.65)
  scene.sphere({ x: 0, y: 0, z: 0.55 }, 0.08, EM_COLORS.wire)
  scene.sphere({ x: 0, y: 0, z: 0.75 }, 0.1, EM_COLORS.coil)
  scene.label({ key: 'rot', point: { x: 0, y: -0.95, z: 0 }, text: 'Rotating coil', color: EM_COLORS.coil })
  scene.label({ key: 'sr', point: { x: 0.95, y: 0.2, z: 0.7 }, text: 'Slip rings', color: EM_COLORS.coil })
}

function drawGeneratorVoltage(ctx: CanvasRenderingContext2D, w: number, h: number, angle: number, zoomScale = 1) {
  withCanvasZoom(ctx, w, h, zoomScale, () => {
    drawBackground(ctx, w, h)
    const scene = new Scene3D(ctx, w, h * 0.55, 0.4, 0.45, Math.min(w, h) * 0.07)
    drawGenerator(scene, angle)
    scene.flush()
    const emf = Math.sin(angle)
    drawGraphPanel(ctx, 16, h * 0.52, w - 32, h * 0.42, 'Induced e.m.f. vs rotation angle', (g, gx, gy, gw, gh) => {
      g.strokeStyle = '#64748b'
      g.lineWidth = 1.5
      g.beginPath()
      g.moveTo(gx, gy + gh / 2)
      g.lineTo(gx + gw, gy + gh / 2)
      g.moveTo(gx, gy)
      g.lineTo(gx, gy + gh)
      g.stroke()
      g.strokeStyle = EM_COLORS.field
      g.lineWidth = 2.5
      g.beginPath()
      for (let x = 0; x <= gw; x++) {
        const t = (x / gw) * Math.PI * 2
        const y = -Math.sin(t) * gh * 0.38
        if (x === 0) g.moveTo(gx + x, gy + gh / 2 + y)
        else g.lineTo(gx + x, gy + gh / 2 + y)
      }
      g.stroke()
      const mx = gx + ((angle % (Math.PI * 2)) / (Math.PI * 2)) * gw
      g.fillStyle = EM_COLORS.field
      g.beginPath()
      g.arc(mx, gy + gh / 2 - emf * gh * 0.38, 6, 0, Math.PI * 2)
      g.fill()
    })
  })
}

function drawCatapult(scene: Scene3D) {
  drawMagnetPoles(scene, 2.2)
  scene.capsule({ x: 0, y: -0.05, z: 0 }, { x: 0, y: 0.05, z: 0 }, 0.08, EM_COLORS.wire, 4)
  scene.label({ key: 'cur', point: { x: 0.25, y: 0.2, z: 0.15 }, text: 'I ⊗ out', color: EM_COLORS.current })
  for (let i = 0; i < 5; i++) {
    const y = -0.35 + i * 0.18
    scene.arrow({ x: -0.75, y, z: 0.2 }, { x: 0.75, y, z: 0.2 }, '#94a3b8', 1.2)
    const dense = i >= 2
    scene.arrow({ x: 0, y, z: 0.35 }, { x: dense ? 0.55 : 0.35, y, z: 0.35 }, dense ? EM_COLORS.field : '#93c5fd', dense ? 2.5 : 1.5)
  }
  scene.label({ key: 'rein', point: { x: 0.65, y: 0.35, z: 0.5 }, text: 'Reinforced', color: EM_COLORS.field })
  scene.label({ key: 'cancel', point: { x: -0.65, y: -0.35, z: 0.5 }, text: 'Cancelled', color: EM_COLORS.force })
  scene.arrow({ x: 0, y: 0.1, z: 0 }, { x: 0, y: -0.75, z: 0 }, EM_COLORS.force, 5)
  scene.label({ key: 'f', point: { x: 0.2, y: -0.85, z: 0 }, text: 'Force F', color: EM_COLORS.force })
}

function drawDcMotor(scene: Scene3D, angle: number) {
  drawMagnetPoles(scene, 2.4)
  drawCoil(scene, angle, 0.85, 0.65)
  scene.sphere({ x: 0, y: 0, z: 0.6 }, 0.12, EM_COLORS.coil)
  scene.line({ x: 0, y: 0, z: 0.72 }, { x: 0, y: 0, z: 0.72 }, EM_COLORS.coil, 3)
  scene.label({ key: 'com', point: { x: 0.55, y: 0, z: 0.75 }, text: 'Split-ring commutator', color: EM_COLORS.coil })
  scene.arrow({ x: -0.45, y: 0.35, z: 0 }, { x: -0.45, y: 0.75, z: 0 }, EM_COLORS.emf, 4)
  scene.arrow({ x: 0.45, y: -0.35, z: 0 }, { x: 0.45, y: -0.75, z: 0 }, EM_COLORS.force, 4)
  scene.label({ key: 'fu', point: { x: -0.65, y: 0.85, z: 0 }, text: 'F up', color: EM_COLORS.emf })
  scene.label({ key: 'fd', point: { x: 0.65, y: -0.85, z: 0 }, text: 'F down', color: EM_COLORS.force })
}

function drawTransformer(scene: Scene3D, stepUp: boolean) {
  scene.box({ x: -0.25, y: -0.9, z: -0.35 }, { x: 0.25, y: 0.9, z: 0.35 }, EM_COLORS.iron, 0.6)
  scene.box({ x: -0.9, y: -0.25, z: -0.35 }, { x: 0.9, y: 0.25, z: 0.35 }, EM_COLORS.iron, 0.6)
  const np = stepUp ? 3 : 5
  const ns = stepUp ? 6 : 2
  const npSpan = Math.max(1, np - 1)
  const nsSpan = Math.max(1, ns - 1)
  for (let i = 0; i < np; i++) {
    scene.sphere({ x: -0.65, y: -0.6 + (i / npSpan) * 1.2, z: 0.45 }, 0.09, EM_COLORS.field)
  }
  for (let i = 0; i < ns; i++) {
    scene.sphere({ x: 0.65, y: -0.6 + (i / nsSpan) * 1.2, z: 0.45 }, 0.09, '#dc2626')
  }
  for (let y = -0.5; y <= 0.5; y += 0.2) {
    scene.arrow({ x: -0.5, y, z: 0 }, { x: 0.5, y, z: 0 }, EM_COLORS.flux, 2)
  }
  scene.label({ key: 'pri', point: { x: -0.65, y: 1.05, z: 0 }, text: `Primary Np=${np}`, color: EM_COLORS.field })
  scene.label({
    key: 'sec',
    point: { x: 0.65, y: 1.05, z: 0 },
    text: `Secondary Ns=${ns} (${stepUp ? 'step-up' : 'step-down'})`,
    color: '#dc2626',
  })
}

function drawTransmissionGrid(scene: Scene3D) {
  const nodes = [
    { x: -1.8, label: 'Power\nstation', color: '#fef3c7' },
    { x: -0.9, label: 'Step-up', color: '#dbeafe' },
    { x: 0, label: 'HV\npylons', color: '#e2e8f0' },
    { x: 0.9, label: 'Step-down', color: '#bbf7d0' },
    { x: 1.8, label: 'Homes', color: '#f1f5f9' },
  ]
  for (const n of nodes) {
    scene.box({ x: n.x - 0.28, y: -0.35, z: -0.2 }, { x: n.x + 0.28, y: 0.35, z: 0.2 }, n.color, 0.9)
    scene.label({ key: `node-${n.x}`, point: { x: n.x, y: 0.55, z: 0 }, text: n.label.replace('\n', ' '), color: '#334155' })
  }
  for (let i = 0; i < nodes.length - 1; i++) {
    scene.arrow({ x: nodes[i].x + 0.3, y: 0, z: 0 }, { x: nodes[i + 1].x - 0.3, y: 0, z: 0 }, EM_COLORS.grid, 3)
  }
  scene.label({ key: 'loss', point: { x: 0, y: -0.75, z: 0 }, text: 'High V → low I → less I²R loss', color: '#475569' })
}

function drawTransformerVoltage(ctx: CanvasRenderingContext2D, w: number, h: number, stepUp: boolean, zoomScale = 1) {
  withCanvasZoom(ctx, w, h, zoomScale, () => {
    drawBackground(ctx, w, h)
    drawGraphPanel(ctx, 24, 28, w - 48, h - 56, 'Primary vs secondary voltage (same frequency)', (g, gx, gy, gw, gh) => {
      g.strokeStyle = '#64748b'
      g.lineWidth = 1.5
      g.beginPath()
      g.moveTo(gx, gy + gh / 2)
      g.lineTo(gx + gw, gy + gh / 2)
      g.stroke()
      const drawWave = (amp: number, color: string, yOff: number) => {
        g.strokeStyle = color
        g.lineWidth = 2.5
        g.beginPath()
        for (let x = 0; x <= gw; x++) {
          const t = (x / gw) * Math.PI * 4
          const y = yOff - Math.sin(t) * amp
          if (x === 0) g.moveTo(gx + x, y)
          else g.lineTo(gx + x, y)
        }
        g.stroke()
      }
      drawWave(gh * 0.22, EM_COLORS.field, gy + gh * 0.55)
      drawWave(gh * (stepUp ? 0.38 : 0.12), '#dc2626', gy + gh * 0.55)
      g.fillStyle = EM_COLORS.field
      g.fillText('Vp (primary)', gx + 8, gy + 14)
      g.fillStyle = '#dc2626'
      g.fillText(`Vs (secondary, ${stepUp ? 'higher' : 'lower'})`, gx + 8, gy + 28)
    })
  })
}

export function renderCh18Scene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  sceneId: Ch18SceneId,
  params: SceneParams,
): HtmlLabel[] {
  if (sceneId === 'generator-voltage') {
    drawGeneratorVoltage(ctx, w, h, (params.anim ?? 0) * Math.PI * 2, params.zoomScale ?? 1)
    return []
  }
  if (sceneId === 'transformer-voltage') {
    drawTransformerVoltage(ctx, w, h, params.stepUp ?? true, params.zoomScale ?? 1)
    return []
  }

  if (isHandDiagramScene(sceneId)) {
    renderHandDiagram2D(ctx, w, h, sceneId, params.flipped ?? false, params.zoomScale ?? 1)
    return []
  }

  if (sceneId === 'wire-field') {
    renderWireField2D(ctx, w, h, params.zoomScale ?? 1)
    return []
  }

  drawBackground(ctx, w, h)
  const graphH = sceneId === 'induction-emf' ? h : h
  const zoom = Math.min(w, h) * 0.085 * (params.zoomScale ?? 1)
  const scene = new Scene3D(ctx, w, graphH, params.yaw, params.pitch, zoom)

  switch (sceneId) {
    case 'solenoid-field':
      drawSolenoid(scene)
      break
    case 'induction-magnet':
      drawInductionMagnet(scene, params.stage ?? 0, params.anim ?? 0)
      break
    case 'induction-ring':
      drawInductionRing(scene)
      break
    case 'induction-emf':
      drawInductionEmf(scene, params.stage ?? 0, w, h, ctx)
      return scene.labels
    case 'generator':
      drawGenerator(scene, (params.anim ?? 0) * Math.PI * 2)
      break
    case 'catapult-field':
      drawCatapult(scene)
      break
    case 'dc-motor':
      drawDcMotor(scene, (params.anim ?? 0) * Math.PI * 2)
      break
    case 'transformer':
      drawTransformer(scene, params.stepUp ?? true)
      break
    case 'transmission-grid':
      drawTransmissionGrid(scene)
      break
    default:
      break
  }

  scene.flush()
  return scene.labels
}

export function parseCh18SceneFromDiagram(diagram: string): Ch18SceneId {
  const m = diagram.match(/data-scene="([^"]+)"/)
  if (m?.[1] && m[1] in SCENE_META) return m[1] as Ch18SceneId
  if (diagram.includes('enlight-fleming-3d') || diagram.includes('Left-Hand')) {
    return /data-hand="right"|Right-Hand/i.test(diagram) ? 'fleming-right' : 'fleming-left'
  }
  if (/grip rule/i.test(diagram)) return 'grip-rule'
  if (/straight wire/i.test(diagram)) return 'wire-field'
  if (/solenoid/i.test(diagram)) return 'solenoid-field'
  if (/magnet and solenoid|magnet–coil/i.test(diagram)) return 'induction-magnet'
  if (/iron ring/i.test(diagram)) return 'induction-ring'
  if (/induced e\.m\.f/i.test(diagram)) return 'induction-emf'
  if (/A\.c\. generator schematic/i.test(diagram)) return 'generator'
  if (/Generator voltage|sinusoidal/i.test(diagram)) return 'generator-voltage'
  if (/Catapult/i.test(diagram)) return 'catapult-field'
  if (/D\.c\. motor/i.test(diagram)) return 'dc-motor'
  if (/Transformer structure/i.test(diagram)) return 'transformer'
  if (/transmission|Grid transmission/i.test(diagram)) return 'transmission-grid'
  if (/Primary and secondary|voltage waves/i.test(diagram)) return 'transformer-voltage'
  if (/Fleming.*Right/i.test(diagram)) return 'fleming-right'
  return 'fleming-left'
}
