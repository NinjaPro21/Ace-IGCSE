import { useMemo, useState } from 'react'
import type { SeriesGuidePanel } from '@/lib/contentTypes'

type Tab = SeriesGuidePanel

function buildPascal(maxN: number): number[][] {
  const tri: number[][] = [[1]]
  for (let i = 1; i <= maxN; i++) {
    const row = [1]
    for (let j = 1; j < i; j++) {
      row.push(tri[i - 1][j - 1] + tri[i - 1][j])
    }
    row.push(1)
    tri.push(row)
  }
  return tri
}

function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0
  let num = 1
  let den = 1
  for (let i = 0; i < r; i++) {
    num *= n - i
    den *= i + 1
  }
  return num / den
}

function exampleNeedsDot(aStr: string, bStr: string): boolean {
  return aStr.length > 1 || bStr.length > 1
}

function binomialTerm(n: number, r: number, aStr: string, bStr: string, numeric = false): string {
  const coef = nCr(n, r)
  const aPow = n - r
  const bPow = r

  if (numeric) {
    const aVal = aStr === '2x' ? 2 : 1
    const bVal = bStr === '3' ? 3 : 1
    const num = coef * Math.pow(aVal, aPow) * Math.pow(bVal, bPow)
    if (aStr === '2x') {
      if (aPow === 0) return String(num)
      return aPow === 1 ? `${num}x` : `${num}x${sup(aPow)}`
    }
    return String(num)
  }

  const coefStr = coef === 1 ? '' : String(coef)
  const aPart = aPow === 0 ? '' : aPow === 1 ? aStr : `${aStr}${sup(aPow)}`
  const bPart = bPow === 0 ? '' : bPow === 1 ? bStr : `${bStr}${sup(bPow)}`
  if (!bPart) return coefStr + aPart
  if (!aPart) return coefStr + bPart
  return coefStr + aPart + (exampleNeedsDot(aStr, bStr) ? ' · ' : '') + bPart
}

function sup(n: number): string {
  const map: Record<number, string> = { 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸' }
  return map[n] ?? `^${n}`
}

function PascalTriangle({ n, triangle }: { n: number; triangle: number[][] }) {
  const cellW = 44
  const cellH = 32
  const rows = triangle.length
  const width = rows * cellW + 40
  const height = rows * cellH + 24

  return (
    <svg className="enlight-series-pascal" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Pascal triangle">
      {triangle.map((row, ri) =>
        row.map((val, ci) => {
          const cx = width / 2 + (ci - ri / 2) * cellW
          const cy = ri * cellH + 20
          const active = ri === n
          return (
            <g key={`${ri}-${ci}`}>
              {ri > 0 && ci > 0 && (
                <line
                  x1={width / 2 + (ci - 1 - (ri - 1) / 2) * cellW}
                  y1={(ri - 1) * cellH + 20}
                  x2={cx}
                  y2={cy}
                  stroke="#cbd5e1"
                  strokeWidth={1}
                  opacity={active ? 0.8 : 0.3}
                />
              )}
              {ri > 0 && ci < ri && (
                <line
                  x1={width / 2 + (ci - (ri - 1) / 2) * cellW}
                  y1={(ri - 1) * cellH + 20}
                  x2={cx}
                  y2={cy}
                  stroke="#cbd5e1"
                  strokeWidth={1}
                  opacity={active ? 0.8 : 0.3}
                />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={active ? 17 : 14}
                fill={active ? 'rgba(124, 58, 237, 0.15)' : 'rgba(255,255,255,0.9)'}
                stroke={active ? '#7c3aed' : '#e7e5e4'}
                strokeWidth={active ? 2 : 1}
              />
              <text x={cx} y={cy + 4} textAnchor="middle" fontSize={active ? 11 : 10} fontWeight={active ? 700 : 500} fill={active ? '#5b21b6' : '#57534e'}>
                {val}
              </text>
            </g>
          )
        }),
      )}
    </svg>
  )
}

function BinomialPanel() {
  const [n, setN] = useState(4)
  const [r, setR] = useState(2)
  const [example, setExample] = useState<'simple' | 'worked'>('simple')

  const triangle = useMemo(() => buildPascal(8), [])
  const row = triangle[n] ?? [1]
  const aStr = example === 'simple' ? 'a' : '2x'
  const bStr = example === 'simple' ? 'b' : '3'
  const bracket = example === 'simple' ? `(a + b)${sup(n)}` : `(2x + 3)${sup(n)}`

  const expansion = row
    .map((_, i) => binomialTerm(n, i, aStr, bStr, example === 'worked'))
    .join(' + ')

  const gtCoef = nCr(n, r)
  const gtA = n - r === 0 ? '' : n - r === 1 ? aStr : `${aStr}${sup(n - r)}`
  const gtB = r === 0 ? '' : r === 1 ? bStr : `${bStr}${sup(r)}`
  const gtJoin = gtA && gtB && exampleNeedsDot(aStr, bStr) ? ' · ' : ''
  const gtDisplay = `${gtCoef}${gtA}${gtJoin}${gtB}`

  return (
    <div className="enlight-series-panel">
      <p className="enlight-series-panel__intro">
        Each row of Pascal&apos;s triangle gives the coefficients of <strong>(a + b)ⁿ</strong>. Each entry is the sum of
        the two numbers directly above it.
      </p>

      <div className="enlight-series-toggle">
        <button type="button" className={`enlight-series-toggle__btn${example === 'simple' ? ' enlight-series-toggle__btn--active' : ''}`} onClick={() => setExample('simple')}>
          (a + b)ⁿ
        </button>
        <button type="button" className={`enlight-series-toggle__btn${example === 'worked' ? ' enlight-series-toggle__btn--active' : ''}`} onClick={() => setExample('worked')}>
          (2x + 3)⁴ example
        </button>
      </div>

      <div className="enlight-slider-group">
        <label htmlFor="bin-n">
          <strong>Power n</strong> = {n} → row {n} has {n + 1} terms
        </label>
        <input id="bin-n" type="range" min={0} max={8} step={1} value={n} onChange={(e) => { setN(Number(e.target.value)); setR((prev) => Math.min(prev, Number(e.target.value))) }} />
      </div>

      <div className="enlight-series-binomial-layout">
        <PascalTriangle n={n} triangle={triangle} />
        <div className="enlight-series-binomial-right">
          <div className="enlight-series-formula-card">
            <div className="enlight-series-formula-card__label">Expansion</div>
            <div className="enlight-series-formula-card__eq">{bracket} =</div>
            <div className="enlight-series-formula-card__expansion">{expansion}</div>
          </div>

          <div className="enlight-series-coef-row">
            {row.map((c, i) => (
              <div key={i} className={`enlight-series-coef${i === r ? ' enlight-series-coef--active' : ''}`}>
                <span className="enlight-series-coef__c">{c}</span>
                <span className="enlight-series-coef__r">r = {i}</span>
              </div>
            ))}
          </div>

          <div className="enlight-slider-group">
            <label htmlFor="bin-r">
              <strong>General term</strong> — pick r = {r} (term {r + 1})
            </label>
            <input id="bin-r" type="range" min={0} max={n} step={1} value={r} onChange={(e) => setR(Number(e.target.value))} />
          </div>

          <div className="enlight-series-formula-card enlight-series-formula-card--highlight">
            <div className="enlight-series-formula-card__label">General term formula</div>
            <div className="enlight-series-formula-card__eq">T<sub>{r + 1}</sub> = ⁿCᵣ · aⁿ⁻ʳ · bʳ</div>
            <div className="enlight-series-formula-card__expansion">= {gtDisplay}</div>
          </div>

          <div className="enlight-series-tip">
            Powers of <strong>a</strong> decrease (n → 0) while powers of <strong>b</strong> increase (0 → n).
          </div>
        </div>
      </div>
    </div>
  )
}

function ApPanel() {
  const [a, setA] = useState(5)
  const [d, setD] = useState(3)
  const [n, setN] = useState(6)

  const terms = useMemo(() => Array.from({ length: n }, (_, i) => a + i * d), [a, d, n])
  const nth = a + (n - 1) * d
  const sum = (n / 2) * (2 * a + (n - 1) * d)
  const maxVal = Math.max(...terms, 1)

  return (
    <div className="enlight-series-panel">
      <p className="enlight-series-panel__intro">
        Each term adds the same amount <strong>d</strong> (common difference). The sequence forms a straight-line pattern.
      </p>

      <div className="enlight-series-sliders">
        <div className="enlight-slider-group">
          <label htmlFor="ap-a"><strong>First term a</strong> = {a}</label>
          <input id="ap-a" type="range" min={-5} max={20} step={1} value={a} onChange={(e) => setA(Number(e.target.value))} />
        </div>
        <div className="enlight-slider-group">
          <label htmlFor="ap-d"><strong>Common difference d</strong> = {d}</label>
          <input id="ap-d" type="range" min={-8} max={8} step={1} value={d} onChange={(e) => setD(Number(e.target.value))} />
        </div>
        <div className="enlight-slider-group">
          <label htmlFor="ap-n"><strong>Terms shown n</strong> = {n}</label>
          <input id="ap-n" type="range" min={3} max={12} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} />
        </div>
      </div>

      <svg className="enlight-series-ap-chart" viewBox="0 0 520 180" role="img" aria-label="AP bar chart">
        <line x1={40} y1={150} x2={500} y2={150} stroke="#57534e" strokeWidth={2} />
        {terms.map((t, i) => {
          const barW = 380 / n
          const x = 60 + i * barW
          const h = (Math.abs(t) / Math.max(maxVal, 1)) * 100
          const y = t >= 0 ? 150 - h : 150
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW - 8} height={Math.max(h, 2)} rx={4} fill={i === n - 1 ? '#7c3aed' : '#5b8def'} opacity={0.85} />
              <text x={x + (barW - 8) / 2} y={y - 6} textAnchor="middle" fontSize={10} fontWeight={600} fill="#44403c">
                {t}
              </text>
              <text x={x + (barW - 8) / 2} y={166} textAnchor="middle" fontSize={9} fill="#78716c">
                u{i + 1}
              </text>
              {i < terms.length - 1 && (
                <text x={x + barW - 2} y={140} fontSize={11} fill="#059669" fontWeight={700}>
                  +{d}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      <div className="enlight-series-results">
        <div className="enlight-series-result-card">
          <div className="enlight-series-result-card__label">nth term</div>
          <div className="enlight-series-result-card__formula">uₙ = a + (n−1)d</div>
          <div className="enlight-series-result-card__value">u{n} = {a} + ({n}−1)({d}) = <strong>{nth}</strong></div>
        </div>
        <div className="enlight-series-result-card">
          <div className="enlight-series-result-card__label">Sum of n terms</div>
          <div className="enlight-series-result-card__formula">Sₙ = n/2 [2a + (n−1)d]</div>
          <div className="enlight-series-result-card__value">S{n} = <strong>{sum}</strong></div>
        </div>
      </div>
    </div>
  )
}

function GpPanel() {
  const [a, setA] = useState(12)
  const [r, setR] = useState(0.33)
  const [n, setN] = useState(8)

  const terms = useMemo(() => Array.from({ length: n }, (_, i) => a * Math.pow(r, i)), [a, r, n])
  const partialSums = useMemo(() => {
    const sums: number[] = []
    let acc = 0
    for (const t of terms) {
      acc += t
      sums.push(acc)
    }
    return sums
  }, [terms])

  const converges = Math.abs(r) < 1
  const sInf = converges ? a / (1 - r) : null
  const maxVal = Math.max(...terms, ...(sInf ? [sInf] : []), 1)
  const barW = 420 / n

  return (
    <div className="enlight-series-panel">
      <p className="enlight-series-panel__intro">
        Each term is multiplied by ratio <strong>r</strong>. When <strong>|r| &lt; 1</strong>, terms shrink and the
        infinite sum converges to a limit.
      </p>

      <div className="enlight-series-sliders">
        <div className="enlight-slider-group">
          <label htmlFor="gp-a"><strong>First term a</strong> = {a}</label>
          <input id="gp-a" type="range" min={1} max={20} step={1} value={a} onChange={(e) => setA(Number(e.target.value))} />
        </div>
        <div className="enlight-slider-group">
          <label htmlFor="gp-r"><strong>Common ratio r</strong> = {r.toFixed(2)}</label>
          <input id="gp-r" type="range" min={-0.9} max={1.5} step={0.01} value={r} onChange={(e) => setR(Number(e.target.value))} />
        </div>
        <div className="enlight-slider-group">
          <label htmlFor="gp-n"><strong>Terms shown n</strong> = {n}</label>
          <input id="gp-n" type="range" min={3} max={12} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} />
        </div>
      </div>

      <div className={`enlight-series-convergence ${converges ? 'enlight-series-convergence--yes' : 'enlight-series-convergence--no'}`}>
        {converges ? `|r| < 1 ✓ — sum to infinity exists: S∞ = a/(1−r) = ${sInf!.toFixed(2)}` : `|r| ≥ 1 ✗ — series diverges, no S∞`}
      </div>

      <svg className="enlight-series-gp-chart" viewBox="0 0 520 200" role="img" aria-label="GP bar and cumulative chart">
        <line x1={40} y1={170} x2={500} y2={170} stroke="#57534e" strokeWidth={2} />
        {terms.map((t, i) => {
          const x = 60 + i * barW
          const h = (Math.abs(t) / maxVal) * 110
          const y = 170 - h
          return (
            <g key={`t${i}`}>
              <rect x={x} y={y} width={barW - 6} height={Math.max(h, 2)} rx={3} fill="#34d399" opacity={0.8} />
              <text x={x + (barW - 6) / 2} y={y - 4} textAnchor="middle" fontSize={8} fill="#047857">
                {t.toFixed(1)}
              </text>
              {i < terms.length - 1 && (
                <text x={x + barW - 1} y={165} fontSize={9} fill="#7c3aed" fontWeight={600}>
                  ×{r.toFixed(1)}
                </text>
              )}
            </g>
          )
        })}
        {partialSums.map((s, i) => {
          const x = 60 + i * barW + (barW - 6) / 2
          const y = 170 - (s / maxVal) * 110
          if (i === 0) return <circle key={`s${i}`} cx={x} cy={y} r={3} fill="#f59e0b" />
          const px = 60 + (i - 1) * barW + (barW - 6) / 2
          const py = 170 - (partialSums[i - 1] / maxVal) * 110
          return (
            <g key={`s${i}`}>
              <line x1={px} y1={py} x2={x} y2={y} stroke="#f59e0b" strokeWidth={2} />
              <circle cx={x} cy={y} r={3} fill="#f59e0b" />
            </g>
          )
        })}
        {converges && sInf !== null && (
          <>
            <line x1={40} y1={170 - (sInf / maxVal) * 110} x2={500} y2={170 - (sInf / maxVal) * 110} stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 4" />
            <text x={505} y={170 - (sInf / maxVal) * 110 + 4} fontSize={9} fill="#f59e0b" fontWeight={700}>
              S∞
            </text>
          </>
        )}
        <text x={48} y={14} fontSize={9} fill="#34d399" fontWeight={600}>■ term uₙ</text>
        <text x={130} y={14} fontSize={9} fill="#f59e0b" fontWeight={600}>— cumulative Sₙ</text>
      </svg>

      <div className="enlight-series-results">
        <div className="enlight-series-result-card">
          <div className="enlight-series-result-card__label">nth term</div>
          <div className="enlight-series-result-card__formula">uₙ = arⁿ⁻¹</div>
          <div className="enlight-series-result-card__value">u{n} = <strong>{terms[n - 1].toFixed(2)}</strong></div>
        </div>
        <div className="enlight-series-result-card">
          <div className="enlight-series-result-card__label">Partial sum</div>
          <div className="enlight-series-result-card__formula">Sₙ = a(1−rⁿ)/(1−r)</div>
          <div className="enlight-series-result-card__value">S{n} = <strong>{partialSums[n - 1].toFixed(2)}</strong></div>
        </div>
      </div>
    </div>
  )
}

export function SeriesVisualGuide({ panels }: { panels?: SeriesGuidePanel[] }) {
  const available = panels?.length ? panels : (['binomial', 'ap', 'gp'] as SeriesGuidePanel[])
  const [tab, setTab] = useState<Tab>(available[0] ?? 'ap')
  const current = available.includes(tab) ? tab : available[0]

  const tabOptions = (
    [
      { id: 'binomial' as const, label: "Pascal & Binomial" },
      { id: 'ap' as const, label: 'Arithmetic (AP)' },
      { id: 'gp' as const, label: 'Geometric (GP)' },
    ] as const
  ).filter((t) => available.includes(t.id))

  return (
    <section className="enlight-explorer enlight-series-guide">
      <h2 className="enlight-explorer__title">Series Visual Guide</h2>
      <p className="enlight-body-text enlight-series-guide__intro">
        {available.includes('binomial')
          ? "Interactive diagrams for Pascal's triangle, binomial expansions, arithmetic progressions, and geometric series."
          : 'Arithmetic and geometric sequences — common difference and common ratio visualised.'}
      </p>

      {tabOptions.length > 1 && (
        <div className="enlight-series-tabs">
          {tabOptions.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`enlight-series-tabs__btn${current === id ? ' enlight-series-tabs__btn--active' : ''}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {current === 'binomial' && <BinomialPanel />}
      {current === 'ap' && <ApPanel />}
      {current === 'gp' && <GpPanel />}
    </section>
  )
}
