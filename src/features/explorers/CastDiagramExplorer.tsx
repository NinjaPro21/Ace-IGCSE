import { useMemo, useState } from 'react'

type TrigFn = 'sin' | 'cos' | 'tan'
type Rotation = 'anticlockwise' | 'clockwise'

const MAG_MIN = 0
const MAG_MAX = 360
const DOMAIN_MIN = -360
const DOMAIN_MAX = 360

function degToRad(d: number): number {
  return (d * Math.PI) / 180
}

function normalizeAngle(theta: number): number {
  return ((theta % 360) + 360) % 360
}

function referenceAngle(theta: number): number {
  const t = normalizeAngle(theta)
  if (t <= 90) return t
  if (t <= 180) return 180 - t
  if (t <= 270) return t - 180
  return 360 - t
}

function quadrantIndex(theta: number): 1 | 2 | 3 | 4 {
  const t = normalizeAngle(theta)
  if (t === 0 || t === 90 || t === 180 || t === 270) {
    if (t === 90 || t === 0) return 1
    if (t === 180) return 3
    return 4
  }
  if (t < 90) return 1
  if (t < 180) return 2
  if (t < 270) return 3
  return 4
}

function castLabel(q: 1 | 2 | 3 | 4): string {
  if (q === 1) return 'A — All +'
  if (q === 2) return 'S — Sin +'
  if (q === 3) return 'T — Tan +'
  return 'C — Cos +'
}

function fnSignInQuadrant(fn: TrigFn, q: 1 | 2 | 3 | 4): boolean {
  if (fn === 'sin') return q === 1 || q === 2
  if (fn === 'cos') return q === 1 || q === 4
  return q === 1 || q === 3
}

/** Anticlockwise → +magnitude; clockwise → −magnitude. */
function effectiveAngle(magnitude: number, rotation: Rotation): number {
  const mag = Math.abs(magnitude)
  return rotation === 'anticlockwise' ? mag : -mag
}

function formatSignedAngle(deg: number): string {
  if (deg === 0) return '0°'
  return deg > 0 ? `+${deg}°` : `${deg}°`
}

const EXACT: Record<number, { sin: string; cos: string; tan: string }> = {
  0: { sin: '0', cos: '1', tan: '0' },
  30: { sin: '½', cos: '√3/2', tan: '1/√3' },
  45: { sin: '√2/2', cos: '√2/2', tan: '1' },
  60: { sin: '√3/2', cos: '½', tan: '√3' },
  90: { sin: '1', cos: '0', tan: 'undefined' },
}

function numericRatio(fn: TrigFn, theta: number): number {
  const rad = degToRad(theta)
  if (fn === 'sin') return Math.sin(rad)
  if (fn === 'cos') return Math.cos(rad)
  return Math.tan(rad)
}

function ratioAnswer(fn: TrigFn, theta: number) {
  const q = quadrantIndex(theta)
  const alpha = referenceAngle(theta)
  const positive = fnSignInQuadrant(fn, q)
  const sign = positive ? '+' : '−'
  const exact = EXACT[alpha]?.[fn] ?? null
  const numeric = numericRatio(fn, theta)
  const refLabel = `${sign}${fn} ${alpha}°`
  const exactPart = exact && exact !== 'undefined' ? ` = ${sign}${exact}` : ''
  const decimalPart = Number.isFinite(numeric) ? ` ≈ ${numeric.toFixed(3)}` : ''
  return {
    q,
    alpha,
    positive,
    refLabel,
    display: `${fn}(${formatSignedAngle(theta)}) = ${refLabel}${exactPart}${decimalPart}`,
  }
}

function domainX(theta: number, width: number): number {
  const clamped = Math.max(DOMAIN_MIN, Math.min(DOMAIN_MAX, theta))
  return ((clamped - DOMAIN_MIN) / (DOMAIN_MAX - DOMAIN_MIN)) * width
}

export function CastDiagramExplorer() {
  const [fn, setFn] = useState<TrigFn>('sin')
  const [magnitude, setMagnitude] = useState(135)
  const [rotation, setRotation] = useState<Rotation>('anticlockwise')

  const theta = effectiveAngle(magnitude, rotation)
  const q = quadrantIndex(theta)
  const alpha = referenceAngle(theta)
  const coterminal = normalizeAngle(theta)

  const answers = useMemo(
    () => ({
      sin: ratioAnswer('sin', theta),
      cos: ratioAnswer('cos', theta),
      tan: ratioAnswer('tan', theta),
    }),
    [theta],
  )

  const diagramSize = 380
  const cx = diagramSize / 2
  const cy = diagramSize / 2
  const r = 130
  const rad = degToRad(theta)
  const rayX = cx + r * Math.cos(rad)
  const rayY = cy - r * Math.sin(rad)
  const arcR = 46
  const arcEndX = cx + arcR * Math.cos(rad)
  const arcEndY = cy - arcR * Math.sin(rad)
  const arcLarge = Math.abs(theta) > 180 ? 1 : 0
  // SVG y-axis points down; with cy − sin(θ) we flip y, so sweep 0 = anticlockwise, 1 = clockwise on screen.
  const arcSweep = rotation === 'anticlockwise' ? 0 : 1
  const arcPath = `M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 ${arcLarge} ${arcSweep} ${arcEndX} ${arcEndY}`

  const domainW = 720

  return (
    <section className="enlight-explorer enlight-cast-explorer">
      <h2 className="enlight-explorer__title">CAST Diagram — ASTC Rule Explorer</h2>
      <p className="enlight-body-text enlight-cast-explorer__intro">
        Use <strong>anticlockwise (+θ)</strong> for positive angles and <strong>clockwise (−θ)</strong> for negative
        angles. Pick sin, cos, or tan to highlight signs — then read off values using the reference angle α.
      </p>

      <div className="enlight-trig-tabs">
        {(['sin', 'cos', 'tan'] as TrigFn[]).map((f) => (
          <button
            key={f}
            type="button"
            className={`enlight-trig-tabs__btn${fn === f ? ' enlight-trig-tabs__btn--active' : ''}`}
            onClick={() => setFn(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="enlight-trig-modulus-toggle">
        <button
          type="button"
          className={`enlight-trig-modulus-toggle__btn${rotation === 'anticlockwise' ? ' enlight-trig-modulus-toggle__btn--active' : ''}`}
          onClick={() => setRotation('anticlockwise')}
        >
          ↺ Anticlockwise (+θ)
        </button>
        <button
          type="button"
          className={`enlight-trig-modulus-toggle__btn${rotation === 'clockwise' ? ' enlight-trig-modulus-toggle__btn--active' : ''}`}
          onClick={() => setRotation('clockwise')}
        >
          ↻ Clockwise (−θ)
        </button>
      </div>

      <div className="enlight-cast-angle-control">
        <label htmlFor="cast-mag">
          <strong>Magnitude</strong> = {magnitude}° · <strong>effective θ</strong> = {formatSignedAngle(theta)}
          {theta !== coterminal && (
            <span className="enlight-cast-coterminal"> · coterminal with {formatSignedAngle(coterminal === 0 ? 0 : coterminal)}</span>
          )}
        </label>
        <input
          id="cast-mag"
          type="range"
          min={MAG_MIN}
          max={MAG_MAX}
          step={1}
          value={magnitude}
          onChange={(e) => setMagnitude(Number(e.target.value))}
        />
        <div className="enlight-cast-domain-labels">
          <span>0°</span>
          <span>90°</span>
          <span>180°</span>
          <span>270°</span>
          <span>360°</span>
        </div>
      </div>

      <svg className="enlight-cast-domain-line" viewBox={`0 0 ${domainW} 48`} role="img" aria-label="Angle domain from -360 to 360">
        <line x1={8} y1={24} x2={domainW - 8} y2={24} stroke="#57534e" strokeWidth={2} />
        {[-360, -270, -180, -90, 0, 90, 180, 270, 360].map((deg) => (
          <g key={deg}>
            <line x1={domainX(deg, domainW)} y1={18} x2={domainX(deg, domainW)} y2={30} stroke="#94a3b8" strokeWidth={deg === 0 ? 2 : 1} />
            {deg % 90 === 0 && (
              <text x={domainX(deg, domainW)} y={44} textAnchor="middle" fontSize={9} fill="#64748b">
                {deg}°
              </text>
            )}
          </g>
        ))}
        <circle cx={domainX(theta, domainW)} cy={24} r={7} fill="#5b8def" stroke="#fff" strokeWidth={2} />
      </svg>

      <div className="enlight-cast-standalone-diagram-wrap">
        <svg className="enlight-cast-diagram enlight-cast-diagram--large" viewBox={`0 0 ${diagramSize} ${diagramSize}`} role="img" aria-label="CAST diagram">
          {/* SVG y increases downward: top-left = Q2, top-right = Q1, bottom-left = Q3, bottom-right = Q4 */}
          <rect x={0} y={0} width={cx} height={cy} fill={fnSignInQuadrant(fn, 2) ? 'rgba(52,211,153,0.3)' : 'rgba(244,63,94,0.2)'} />
          <rect x={cx} y={0} width={cx} height={cy} fill={fnSignInQuadrant(fn, 1) ? 'rgba(52,211,153,0.3)' : 'rgba(244,63,94,0.2)'} />
          <rect x={0} y={cy} width={cx} height={cy} fill={fnSignInQuadrant(fn, 3) ? 'rgba(52,211,153,0.3)' : 'rgba(244,63,94,0.2)'} />
          <rect x={cx} y={cy} width={cx} height={cy} fill={fnSignInQuadrant(fn, 4) ? 'rgba(52,211,153,0.3)' : 'rgba(244,63,94,0.2)'} />


          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#57534e" strokeWidth={2.5} />
          <line x1={cx - r - 20} y1={cy} x2={cx + r + 20} y2={cy} stroke="#57534e" strokeWidth={2.5} />
          <line x1={cx} y1={cy - r - 20} x2={cx} y2={cy + r + 20} stroke="#57534e" strokeWidth={2.5} />
          <text x={cx + r + 26} y={cy + 5} fontSize={13} fontWeight={700} fill="#57534e">
            x
          </text>
          <text x={cx + 8} y={cy - r - 10} fontSize={13} fontWeight={700} fill="#57534e">
            y
          </text>

          <text x={cx + 44} y={cy - 44} fontSize={16} fontWeight={800} fill="#047857">
            A
          </text>
          <text x={cx - 58} y={cy - 44} fontSize={16} fontWeight={800} fill="#047857">
            S
          </text>
          <text x={cx - 58} y={cy + 56} fontSize={16} fontWeight={800} fill="#047857">
            T
          </text>
          <text x={cx + 44} y={cy + 56} fontSize={16} fontWeight={800} fill="#047857">
            C
          </text>

          {[1, 2, 3, 4].map((qi) => {
            const pos = fnSignInQuadrant(fn, qi as 1 | 2 | 3 | 4)
            const mid =
              qi === 1
                ? [cx + 62, cy - 62]
                : qi === 2
                  ? [cx - 62, cy - 62]
                  : qi === 3
                    ? [cx - 62, cy + 62]
                    : [cx + 62, cy + 62]
            return (
              <text key={qi} x={mid[0]} y={mid[1]} textAnchor="middle" fontSize={12} fontWeight={700} fill={pos ? '#059669' : '#e11d48'}>
                {fn} {pos ? '+' : '−'}
              </text>
            )
          })}

          <line
            x1={cx}
            y1={cy}
            x2={q === 1 || q === 4 ? cx + r : cx - r}
            y2={cy}
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 4"
          />
          <text x={cx + (q === 1 || q === 4 ? r * 0.55 : -r * 0.55)} y={cy + 18} textAnchor="middle" fontSize={11} fill="#64748b" fontWeight={600}>
            α = {alpha.toFixed(0)}°
          </text>

          <line x1={cx} y1={cy} x2={rayX} y2={rayY} stroke="#5b8def" strokeWidth={3} />
          <circle cx={rayX} cy={rayY} r={6} fill="#fff" stroke="#5b8def" strokeWidth={2.5} />
          <text
            x={rayX + (rayX > cx ? 10 : -10)}
            y={rayY + (rayY > cy ? 16 : -8)}
            textAnchor={rayX > cx ? 'start' : 'end'}
            fontSize={12}
            fontWeight={700}
            fill="#5b8def"
          >
            θ = {formatSignedAngle(theta)}
          </text>

          <defs>
            <marker id="cast-arrow-lg" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#f59e0b" />
            </marker>
          </defs>
          <path d={arcPath} fill="none" stroke="#f59e0b" strokeWidth={2.5} markerEnd="url(#cast-arrow-lg)" />
        </svg>

        <div className="enlight-cast-summary-card">
          <div className="enlight-cast-summary-card__heading">Quadrant {q}</div>
          <div className="enlight-cast-summary-card__rule">{castLabel(q)}</div>
          <div className="enlight-cast-summary-card__detail">
            θ = {formatSignedAngle(theta)} → reference α = {alpha.toFixed(0)}°
          </div>
        </div>
      </div>

      <div className="enlight-cast-answers">
        <div className="enlight-cast-answers__title">Values for θ = {formatSignedAngle(theta)}</div>
        <div className="enlight-cast-answers__grid">
          {(['sin', 'cos', 'tan'] as TrigFn[]).map((f) => {
            const ans = answers[f]
            return (
              <div
                key={f}
                className={`enlight-cast-answer-card${fn === f ? ' enlight-cast-answer-card--active' : ''}`}
              >
                <div className="enlight-cast-answer-card__fn">{f}</div>
                <div className={ans.positive ? 'enlight-cast-sign--pos' : 'enlight-cast-sign--neg'}>
                  {ans.display}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="enlight-cast-rules">
        <strong>ASTC:</strong> Q1 All + · Q2 Sin + · Q3 Tan + · Q4 Cos + — anticlockwise gives +θ, clockwise gives −θ.
        Measure α from the principal (x) axis, then apply the quadrant sign.
      </div>
    </section>
  )
}
