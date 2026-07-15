import { useMemo, useState } from 'react'
import { MathText } from '@/components/MathText'

type LawTab = 'product' | 'quotient' | 'power'

function logBase(n: number, base: number) {
  return Math.log(n) / Math.log(base)
}

function fmt(n: number, dp = 4) {
  return Number.isInteger(n) ? String(n) : n.toFixed(dp)
}

export function LogLawsExplorer() {
  const [tab, setTab] = useState<LawTab>('product')
  const [base, setBase] = useState(2)
  const [x, setX] = useState(8)
  const [y, setY] = useState(4)
  const [k, setK] = useState(3)

  const product = useMemo(() => {
    const lhs = logBase(x * y, base)
    const rhs = logBase(x, base) + logBase(y, base)
    return { lhs, rhs, match: Math.abs(lhs - rhs) < 1e-9 }
  }, [base, x, y])

  const quotient = useMemo(() => {
    const lhs = logBase(y / x, base)
    const rhs = logBase(y, base) - logBase(x, base)
    return { lhs, rhs, match: Math.abs(lhs - rhs) < 1e-9 }
  }, [base, x, y])

  const power = useMemo(() => {
    const lhs = logBase(Math.pow(x, k), base)
    const rhs = k * logBase(x, base)
    return { lhs, rhs, match: Math.abs(lhs - rhs) < 1e-9 }
  }, [base, x, k])

  const active =
    tab === 'product' ? product : tab === 'quotient' ? quotient : power

  const lawLabel =
    tab === 'product' ? 'Product Law' : tab === 'quotient' ? 'Quotient Law' : 'Power Law'

  const equation =
    tab === 'product'
      ? `$\\log_${base}(xy) = \\log_${base}(x) + \\log_${base}(y)$`
      : tab === 'quotient'
        ? `$\\log_${base}\\!\\left(\\frac{y}{x}\\right) = \\log_${base}(y) - \\log_${base}(x)$`
        : `$\\log_${base}(x^k) = k\\,\\log_${base}(x)$`

  const numericLine =
    tab === 'product'
      ? `$\\log_${base}(${x}\\times${y}) = \\log_${base}(${x}) + \\log_${base}(${y})$`
      : tab === 'quotient'
        ? `$\\log_${base}\\!\\left(\\frac{${y}}{${x}}\\right) = \\log_${base}(${y}) - \\log_${base}(${x})$`
        : `$\\log_${base}(${x}^{${k}}) = ${k}\\,\\log_${base}(${x})$`

  const resultLine = `${fmt(active.lhs)} = ${fmt(active.rhs)}`

  return (
    <section className="ace-explorer">
      <h2 className="ace-explorer__title">Log Laws Explorer</h2>
      <p className="ace-body-text" style={{ marginBottom: 14 }}>
        Pick a law and adjust the values — the left and right sides stay equal when the base is the same.
      </p>

      <div className="ace-fn-tabs" role="tablist" aria-label="Log law">
        {(['product', 'quotient', 'power'] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`ace-fn-tabs__btn${tab === id ? ' ace-fn-tabs__btn--active' : ''}`}
            onClick={() => setTab(id)}
          >
            {id === 'product' ? 'Product' : id === 'quotient' ? 'Quotient' : 'Power'}
          </button>
        ))}
      </div>

      <div className="ace-slider-group" style={{ marginTop: 16 }}>
        <label htmlFor="ll-base">
          <strong>Base a</strong> = {base}
        </label>
        <input
          id="ll-base"
          type="range"
          min={2}
          max={10}
          step={1}
          value={base}
          onChange={(e) => setBase(Number(e.target.value))}
        />
      </div>

      <div className="ace-slider-group">
        <label htmlFor="ll-x">
          <strong>x</strong> = {x}
        </label>
        <input
          id="ll-x"
          type="range"
          min={2}
          max={16}
          step={1}
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
        />
      </div>

      {tab !== 'power' && (
        <div className="ace-slider-group">
          <label htmlFor="ll-y">
            <strong>y</strong> = {y}
          </label>
          <input
            id="ll-y"
            type="range"
            min={2}
            max={16}
            step={1}
            value={y}
            onChange={(e) => setY(Number(e.target.value))}
          />
        </div>
      )}

      {tab === 'power' && (
        <div className="ace-slider-group">
          <label htmlFor="ll-k">
            <strong>k</strong> = {k}
          </label>
          <input
            id="ll-k"
            type="range"
            min={2}
            max={5}
            step={1}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
          />
        </div>
      )}

      <div className="ace-discriminant-display" style={{ marginTop: 16 }}>
        <div className="ace-discriminant-display__label">{lawLabel}</div>
        <div className="ace-discriminant-display__value" style={{ fontSize: '0.95rem' }}>
          <MathText content={equation} block />
        </div>
        <div style={{ marginTop: 10, fontSize: '0.88rem' }}>
          <MathText content={numericLine} block />
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: '0.9rem',
            fontWeight: 600,
            color: active.match ? '#059669' : '#dc2626',
          }}
        >
          {resultLine} {active.match ? '✓' : '✗'}
        </div>
      </div>
    </section>
  )
}
