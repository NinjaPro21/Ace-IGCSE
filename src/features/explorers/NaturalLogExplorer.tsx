import { useMemo, useState } from 'react'
import { MathText } from '@/components/MathText'
import { GRAPH } from './graphTheme'

const W = 420
const H = 320
const X_MIN = -3
const X_MAX = 4
const Y_MIN = -3
const Y_MAX = 8
const STEP = 0.04

function toSvgX(x: number) {
  return ((x - X_MIN) / (X_MAX - X_MIN)) * W
}
function toSvgY(y: number) {
  return H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * H
}

function buildExpPath(a: number, h: number, k: number): string {
  const pts: string[] = []
  for (let x = X_MIN; x <= X_MAX + STEP / 2; x += STEP) {
    const y = a * Math.exp(x - h) + k
    if (!Number.isFinite(y) || y < Y_MIN - 1 || y > Y_MAX + 1) continue
    pts.push(`${toSvgX(x).toFixed(2)},${toSvgY(y).toFixed(2)}`)
  }
  return pts.join(' ')
}

function buildInversePath(a: number, h: number, k: number): string {
  const pts: string[] = []
  for (let y = Y_MIN; y <= Y_MAX + STEP / 2; y += STEP) {
    if (a === 0) continue
    const ratio = (y - k) / a
    if (ratio <= 0) continue
    const x = h + Math.log(ratio)
    if (x < X_MIN - 0.5 || x > X_MAX + 0.5) continue
    pts.push(`${toSvgX(x).toFixed(2)},${toSvgY(y).toFixed(2)}`)
  }
  return pts.join(' ')
}

export function NaturalLogExplorer() {
  const [a, setA] = useState(1)
  const [h, setH] = useState(0)
  const [k, setK] = useState(0)

  const expPath = useMemo(() => buildExpPath(a, h, k), [a, h, k])
  const lnPath = useMemo(() => buildInversePath(a, h, k), [a, h, k])
  const mirrorPath = useMemo(() => {
    const pts: string[] = []
    for (let x = X_MIN; x <= X_MAX + STEP / 2; x += STEP) {
      const y = a * Math.exp(x - h) + k
      if (!Number.isFinite(y) || y < Y_MIN || y > Y_MAX) continue
      if (x < Y_MIN || x > Y_MAX || y < X_MIN || y > X_MAX) continue
      pts.push(`${toSvgX(y).toFixed(2)},${toSvgY(x).toFixed(2)}`)
    }
    return pts.join(' ')
  }, [a, h, k])

  const eqLabel = useMemo(() => {
    const aStr = a === 1 ? '' : `${a}`
    const inner = h === 0 ? 'x' : h > 0 ? `x - ${h}` : `x + ${Math.abs(h)}`
    const kStr = k === 0 ? '' : k > 0 ? ` + ${k}` : ` - ${Math.abs(k)}`
    return `$y = ${aStr}e^{${inner}}${kStr}$`
  }, [a, h, k])

  return (
    <section className="enlight-explorer">
      <h2 className="enlight-explorer__title">The e and ln x Transformation Grid</h2>
      <div className="enlight-explorer__layout">
        <div>
          <p className="enlight-body-text" style={{ marginBottom: 14 }}>
            <MathText content="Shift and stretch $y = ae^{x-h} + k$. The dashed line $y = x$ shows how $e^x$ and $\ln x$ are inverses — their domains and ranges flip." />
          </p>

          <div className="enlight-slider-group">
            <label htmlFor="nl-a"><strong>a</strong> = {a} (vertical stretch)</label>
            <input id="nl-a" type="range" min={0.5} max={2} step={0.25} value={a} onChange={(e) => setA(Number(e.target.value))} />
          </div>
          <div className="enlight-slider-group">
            <label htmlFor="nl-h"><strong>h</strong> = {h} (horizontal shift)</label>
            <input id="nl-h" type="range" min={-2} max={2} step={0.5} value={h} onChange={(e) => setH(Number(e.target.value))} />
          </div>
          <div className="enlight-slider-group">
            <label htmlFor="nl-k"><strong>k</strong> = {k} (vertical shift)</label>
            <input id="nl-k" type="range" min={-2} max={2} step={0.5} value={k} onChange={(e) => setK(Number(e.target.value))} />
          </div>

          <div className="enlight-formula-stack" style={{ marginTop: 12 }}>
            <div className="enlight-formula-stack__item">
              <MathText content={eqLabel} />
            </div>
            <div className="enlight-formula-stack__item" style={{ fontSize: '0.82rem', color: 'var(--enlight-text-light)' }}>
              <MathText content="$x = h + \ln\!\left(\dfrac{y - k}{a}\right)$" />
            </div>
          </div>
        </div>

        <svg className="enlight-graph-canvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Natural exponential and logarithm graphs">
          {[...Array(8)].map((_, i) => {
            const x = X_MIN + (i * (X_MAX - X_MIN)) / 7
            return <line key={`gv${i}`} x1={toSvgX(x)} y1={0} x2={toSvgX(x)} y2={H} stroke={GRAPH.grid} strokeWidth={1} />
          })}
          {[...Array(12)].map((_, i) => {
            const y = Y_MIN + (i * (Y_MAX - Y_MIN)) / 11
            return <line key={`gh${i}`} x1={0} y1={toSvgY(y)} x2={W} y2={toSvgY(y)} stroke={GRAPH.grid} strokeWidth={1} />
          })}
          <line x1={toSvgX(0)} y1={0} x2={toSvgX(0)} y2={H} stroke={GRAPH.axis} strokeWidth={1.5} />
          <line x1={0} y1={toSvgY(0)} x2={W} y2={toSvgY(0)} stroke={GRAPH.axis} strokeWidth={1.5} />

          <line
            x1={toSvgX(X_MIN)} y1={toSvgY(X_MIN)}
            x2={toSvgX(Math.min(X_MAX, Y_MAX))} y2={toSvgY(Math.min(X_MAX, Y_MAX))}
            stroke="#78716c" strokeWidth={1.5} strokeDasharray="6 5"
          />
          <text x={toSvgX(3.2)} y={toSvgY(3.6)} fontSize={9} fill="#78716c" fontWeight={700}>y = x</text>

          <polyline points={expPath} fill="none" stroke="#0891b2" strokeWidth={2.5} strokeLinecap="round" />
          <polyline points={lnPath} fill="none" stroke="#7c3aed" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="8 4" />
          <polyline points={mirrorPath} fill="none" stroke="#7c3aed" strokeWidth={1} strokeDasharray="3 4" opacity={0.35} />

          <text x={toSvgX(2.5)} y={toSvgY(a * Math.exp(2.5 - h) + k) - 8} fontSize={10} fill="#0891b2" fontWeight={700}>e^x</text>
          <text x={toSvgX(h + 1.5)} y={toSvgY(1.2) + 14} fontSize={10} fill="#7c3aed" fontWeight={700}>ln x</text>
        </svg>
      </div>
    </section>
  )
}
