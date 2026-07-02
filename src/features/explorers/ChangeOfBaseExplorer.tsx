import { useMemo, useState } from 'react'
import { MathText } from '@/components/MathText'

function logBase(n: number, base: number) {
  return Math.log(n) / Math.log(base)
}

function fmt(n: number, dp = 4) {
  if (!Number.isFinite(n)) return '—'
  return Math.abs(n - Math.round(n)) < 1e-9 ? String(Math.round(n)) : n.toFixed(dp)
}

export function ChangeOfBaseExplorer() {
  const [origBase, setOrigBase] = useState(3)
  const [argument, setArgument] = useState(20)
  const [newBase, setNewBase] = useState(10)

  const result = useMemo(() => {
    const direct = logBase(argument, origBase)
    const converted = logBase(argument, newBase) / logBase(origBase, newBase)
    return { direct, converted, match: Math.abs(direct - converted) < 1e-9 }
  }, [argument, newBase, origBase])

  const reciprocal = useMemo(() => {
    const a = logBase(argument, origBase)
    const b = logBase(origBase, argument)
    return { a, b, product: a * b }
  }, [argument, origBase])

  return (
    <section className="enlight-explorer">
      <h2 className="enlight-explorer__title">Change of Base Calculator</h2>
      <p className="enlight-body-text" style={{ marginBottom: 14 }}>
        Convert <MathText content="$\\log_a(b)$" /> to base <MathText content="$c$" /> using{' '}
        <MathText content="$\\dfrac{\\log_c(b)}{\\log_c(a)}$" /> — the same rule used on Paper 1.
      </p>

      <div className="enlight-slider-group">
        <label htmlFor="cob-a">
          <strong>Original base a</strong> = {origBase}
        </label>
        <input
          id="cob-a"
          type="range"
          min={2}
          max={9}
          step={1}
          value={origBase}
          onChange={(e) => setOrigBase(Number(e.target.value))}
        />
      </div>

      <div className="enlight-slider-group">
        <label htmlFor="cob-b">
          <strong>Argument b</strong> = {argument}
        </label>
        <input
          id="cob-b"
          type="range"
          min={2}
          max={50}
          step={1}
          value={argument}
          onChange={(e) => setArgument(Number(e.target.value))}
        />
      </div>

      <div className="enlight-slider-group">
        <label htmlFor="cob-c">
          <strong>New base c</strong> = {newBase === 10 ? '10 (calculator log)' : newBase}
        </label>
        <input
          id="cob-c"
          type="range"
          min={2}
          max={10}
          step={1}
          value={newBase}
          onChange={(e) => setNewBase(Number(e.target.value))}
        />
      </div>

      <div className="enlight-discriminant-display" style={{ marginTop: 16 }}>
        <div className="enlight-discriminant-display__value" style={{ fontSize: '0.95rem' }}>
          <MathText
            content={`$\\log_${origBase}(${argument}) = \\frac{\\log_${newBase}(${argument})}{\\log_${newBase}(${origBase})}$`}
            block
          />
        </div>
        <div style={{ marginTop: 10, fontSize: '0.9rem' }}>
          <MathText
            content={`$${fmt(result.direct)} = \\frac{${fmt(logBase(argument, newBase))}}{${fmt(logBase(origBase, newBase))}} = ${fmt(result.converted)}$`}
            block
          />
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: '0.82rem',
            color: result.match ? '#059669' : '#dc2626',
            fontWeight: 600,
          }}
        >
          Both methods agree {result.match ? '✓' : '✗'}
        </div>
      </div>

      <div className="enlight-inline-callout enlight-inline-callout--gold enlight-inline-callout--standalone" style={{ marginTop: 16 }}>
        <div className="enlight-inline-callout__label">Reciprocal property</div>
        <div className="enlight-inline-callout__body">
          <MathText
            content={`$\\log_${origBase}(${argument}) \\times \\log_${argument}(${origBase}) = ${fmt(reciprocal.a)} \\times ${fmt(reciprocal.b)} = ${fmt(reciprocal.product)}$`}
            block
          />
        </div>
      </div>
    </section>
  )
}
