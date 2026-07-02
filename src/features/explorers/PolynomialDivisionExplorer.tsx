import { useState } from 'react'
import { MathText } from '@/components/MathText'

/** One cell per power of x (x³, x², x, constant) — null leaves the column empty. */
type TermRow = [string | null, string | null, string | null, string | null]

function TermCells({ terms, className }: { terms: TermRow; className?: string }) {
  return (
    <>
      {terms.map((term, i) => (
        <td key={i} className={className}>
          {term ? <MathText content={`$${term}$`} /> : null}
        </td>
      ))}
    </>
  )
}

const STEPS = [
  {
    title: 'Set up',
    body: 'Divide $2x^3 - 5x^2 + 3x - 1$ by $(x - 2)$. The quotient is written above; each subtraction step aligns terms in columns under the dividend.',
    show: 0,
  },
  {
    title: 'First term of quotient',
    body: '$2x^3 \\div x = 2x^2$. Multiply $(x-2)$ by $2x^2$ to get $2x^3 - 4x^2$, then subtract.',
    show: 1,
  },
  {
    title: 'Second term of quotient',
    body: '$-x^2 \\div x = -x$. Multiply $(x-2)$ by $-x$ to get $-x^2 + 2x$, then subtract to obtain $x - 1$.',
    show: 2,
  },
  {
    title: 'Third term of quotient',
    body: '$x \\div x = 1$. Multiply $(x-2)$ by $1$ to get $x - 2$, then subtract.',
    show: 3,
  },
  {
    title: 'Result',
    body: 'Quotient $Q(x) = 2x^2 - x + 1$, remainder $R(x) = 1$. So $2x^3 - 5x^2 + 3x - 1 = (x - 2)(2x^2 - x + 1) + 1$.',
    show: 4,
  },
] as const

const DIVIDEND: TermRow = ['2x^3', '-5x^2', '+3x', '-1']
const SUB1: TermRow = ['-2x^3', '+4x^2', null, null]
const RES1: TermRow = [null, '-x^2', '+3x', '-1']
const SUB2: TermRow = [null, '+x^2', '-2x', null]
const RES2: TermRow = [null, null, '+x', '-1']
const SUB3: TermRow = [null, null, '-x', '+2']
const REM: TermRow = [null, null, null, '1']

export function PolynomialDivisionExplorer() {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const phase = current.show

  return (
    <section className="enlight-explorer">
      <h2 className="enlight-explorer__title">Polynomial Long Division</h2>
      <p className="enlight-body-text" style={{ marginBottom: 16 }}>
        Click <strong>Next step</strong> to walk through dividing a cubic by a linear factor — terms stay aligned in columns like on Paper 1.
      </p>

      <div className="enlight-poly-longdiv-wrap" aria-label="Polynomial long division layout">
        <table className="enlight-poly-longdiv-table">
          <colgroup>
            <col className="enlight-poly-longdiv-table__col-divisor" />
            <col className="enlight-poly-longdiv-table__col-paren" />
            <col className="enlight-poly-longdiv-table__col-term" />
            <col className="enlight-poly-longdiv-table__col-term" />
            <col className="enlight-poly-longdiv-table__col-term" />
            <col className="enlight-poly-longdiv-table__col-term" />
          </colgroup>
          <tbody>
            {/* Quotient row — spans term columns */}
            <tr className="enlight-poly-longdiv-table__quotient">
              <td colSpan={2} />
              <td>{phase >= 1 ? <MathText content="$2x^2$" /> : null}</td>
              <td>{phase >= 2 ? <MathText content="$-\,x$" /> : null}</td>
              <td>{phase >= 3 ? <MathText content="$+\,1$" /> : null}</td>
              <td />
            </tr>

            {/* Divisor | Dividend */}
            <tr className="enlight-poly-longdiv-table__header">
              <td className="enlight-poly-longdiv-table__divisor">
                <MathText content="$x - 2$" />
              </td>
              <td className="enlight-poly-longdiv-table__paren" aria-hidden="true">
                )
              </td>
              <TermCells terms={DIVIDEND} />
            </tr>

            {phase >= 1 && (
              <>
                <tr className="enlight-poly-longdiv-table__rule">
                  <td colSpan={6} />
                </tr>
                <tr className="enlight-poly-longdiv-table__subtract">
                  <td colSpan={2} />
                  <TermCells terms={SUB1} />
                </tr>
                <tr className="enlight-poly-longdiv-table__rule enlight-poly-longdiv-table__rule--thin">
                  <td colSpan={6} />
                </tr>
                <tr className="enlight-poly-longdiv-table__result">
                  <td colSpan={2} />
                  <TermCells terms={RES1} />
                </tr>
              </>
            )}

            {phase >= 2 && (
              <>
                <tr className="enlight-poly-longdiv-table__subtract">
                  <td colSpan={2} />
                  <TermCells terms={SUB2} />
                </tr>
                <tr className="enlight-poly-longdiv-table__rule enlight-poly-longdiv-table__rule--thin">
                  <td colSpan={6} />
                </tr>
                <tr className="enlight-poly-longdiv-table__result">
                  <td colSpan={2} />
                  <TermCells terms={RES2} />
                </tr>
              </>
            )}

            {phase >= 3 && (
              <>
                <tr className="enlight-poly-longdiv-table__subtract">
                  <td colSpan={2} />
                  <TermCells terms={SUB3} />
                </tr>
                <tr className="enlight-poly-longdiv-table__rule enlight-poly-longdiv-table__rule--thin">
                  <td colSpan={6} />
                </tr>
                <tr
                  className={`enlight-poly-longdiv-table__result${
                    phase >= 3 ? ' enlight-poly-longdiv-table__result--remainder' : ''
                  }`}
                >
                  <td colSpan={2} />
                  <TermCells terms={REM} />
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="enlight-inline-callout enlight-inline-callout--violet enlight-inline-callout--standalone">
        <div className="enlight-inline-callout__label">{current.title}</div>
        <div className="enlight-inline-callout__body">
          <MathText content={current.body} block />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <button
          type="button"
          className="enlight-fn-tabs__btn"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          ← Back
        </button>
        <button
          type="button"
          className="enlight-fn-tabs__btn enlight-fn-tabs__btn--active"
          disabled={step >= STEPS.length - 1}
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
        >
          Next step →
        </button>
        <span style={{ alignSelf: 'center', fontSize: '0.82rem', color: 'var(--enlight-text-light)' }}>
          Step {step + 1} / {STEPS.length}
        </span>
      </div>
    </section>
  )
}
