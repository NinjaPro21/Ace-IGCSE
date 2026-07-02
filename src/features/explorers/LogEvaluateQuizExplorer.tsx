import { useMemo, useState } from 'react'
import { MathText } from '@/components/MathText'

type Question = {
  base: number
  argument: number
  answer: number
}

const BANK: Question[] = [
  { base: 2, argument: 8, answer: 3 },
  { base: 2, argument: 16, answer: 4 },
  { base: 2, argument: 32, answer: 5 },
  { base: 3, argument: 9, answer: 2 },
  { base: 3, argument: 27, answer: 3 },
  { base: 5, argument: 25, answer: 2 },
  { base: 5, argument: 125, answer: 3 },
  { base: 10, argument: 100, answer: 2 },
  { base: 10, argument: 1000, answer: 3 },
  { base: 4, argument: 64, answer: 3 },
]

function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

function buildOptions(q: Question): { value: number; label: string }[] {
  const wrong = new Set<number>()
  const offsets = [-2, -1, 1, 2, 3, 4]
  for (const d of offsets) {
    const v = q.answer + d
    if (v > 0 && v !== q.answer) wrong.add(v)
    if (wrong.size >= 3) break
  }
  while (wrong.size < 3) wrong.add(q.answer + wrong.size + 5)

  const opts = [...wrong].slice(0, 3).map((v) => ({ value: v, label: String(v) }))
  opts.push({ value: q.answer, label: String(q.answer) })
  return shuffle(opts)
}

export function LogEvaluateQuizExplorer() {
  const [order] = useState(() => shuffle(BANK).slice(0, 5))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = order[index]
  const options = useMemo(() => (q ? buildOptions(q) : []), [q])

  const answered = selected !== null
  const correct = selected === q?.answer

  function pick(value: number) {
    if (answered || !q) return
    setSelected(value)
    if (value === q.answer) setScore((s) => s + 1)
  }

  function next() {
    if (index >= order.length - 1) {
      setDone(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
  }

  function restart() {
    setIndex(0)
    setSelected(null)
    setScore(0)
    setDone(false)
  }

  if (done) {
    return (
      <section className="enlight-explorer">
        <h2 className="enlight-explorer__title">Log Evaluation Practice</h2>
        <div className="enlight-discriminant-display" style={{ marginTop: 8 }}>
          <div className="enlight-discriminant-display__value">
            {score} / {order.length} correct
          </div>
          <div className="enlight-discriminant-display__label">
            Think: what power raises the base to the argument?
          </div>
        </div>
        <button type="button" className="enlight-fn-tabs__btn enlight-fn-tabs__btn--active" style={{ marginTop: 16 }} onClick={restart}>
          Try again
        </button>
      </section>
    )
  }

  if (!q) return null

  return (
    <section className="enlight-explorer">
      <h2 className="enlight-explorer__title">Log Evaluation Practice</h2>
      <p className="enlight-body-text" style={{ marginBottom: 14 }}>
        Evaluate each logarithm — think: what power raises the base to the argument?{' '}
        <MathText content="$2^{?} = 8 \\Rightarrow \\log_2 8 = 3$" />
      </p>

      <div className="enlight-discriminant-display">
        <div className="enlight-discriminant-display__label">
          Question {index + 1} of {order.length}
        </div>
        <div className="enlight-discriminant-display__value" style={{ fontSize: '1.35rem' }}>
          <MathText content={`$\\log_{${q.base}}(${q.argument}) = \\;?$`} block />
        </div>
      </div>

      <div className="enlight-log-quiz__options" role="listbox" aria-label="Answer choices">
        {options.map((opt) => {
          const isSelected = selected === opt.value
          const isCorrect = opt.value === q.answer
          let cls = 'enlight-log-quiz__opt'
          if (answered && isCorrect) cls += ' enlight-log-quiz__opt--correct'
          else if (answered && isSelected && !isCorrect) cls += ' enlight-log-quiz__opt--wrong'
          else if (!answered) cls += ' enlight-log-quiz__opt--idle'

          return (
            <button
              key={opt.value}
              type="button"
              className={cls}
              disabled={answered}
              onClick={() => pick(opt.value)}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {answered && (
        <div style={{ marginTop: 14 }}>
          <p className="enlight-body-text" style={{ marginBottom: 10 }}>
            {correct ? 'Correct!' : 'Not quite.'}{' '}
            <MathText
              content={`$\\log_{${q.base}}(${q.argument}) = ${q.answer}$ because $${q.base}^{${q.answer}} = ${q.argument}$.`}
            />
          </p>
          <button type="button" className="enlight-fn-tabs__btn enlight-fn-tabs__btn--active" onClick={next}>
            {index >= order.length - 1 ? 'See score' : 'Next question →'}
          </button>
        </div>
      )}
    </section>
  )
}
