import { useState } from 'react'

type ScenarioId = 'committee' | 'roles' | 'mixed' | 'together' | 'apart' | 'restriction'

type Step = {
  label: string
  detail: string
  highlight?: 'perm' | 'comb' | 'multiply' | 'bundle' | 'subtract'
}

type Scenario = {
  id: ScenarioId
  tab: string
  question: string
  orderMatters: boolean
  keywords: string[]
  steps: Step[]
  formula: string
  working: string
  answer: string
  tip: string
}

const SCENARIOS: Scenario[] = [
  {
    id: 'committee',
    tab: 'Committee',
    question: 'From 8 people, how many committees of 3 can be formed?',
    orderMatters: false,
    keywords: ['choose', 'select', 'committee', 'team'],
    steps: [
      { label: 'Does order matter?', detail: 'No — {A,B,C} is the same committee as {C,B,A}.', highlight: 'comb' },
      { label: 'Identify n and r', detail: 'Pool n = 8 people. Select r = 3 for the committee.' },
      { label: 'Pick the formula', detail: 'Use combinations: ⁿCᵣ = n! / [r!(n−r)!]', highlight: 'comb' },
      { label: 'Calculate', detail: '⁸C₃ = (8×7×6) / (3×2×1) = 56' },
    ],
    formula: '⁸C₃ = 8! / (3! × 5!)',
    working: '= (8 × 7 × 6) / (3 × 2 × 1) = 56',
    answer: '56 committees',
    tip: 'Keywords like “choose” or “select” usually mean order does NOT matter.',
  },
  {
    id: 'roles',
    tab: 'Ordered roles',
    question: 'From 8 people, how many ways can President, Vice-President and Secretary be chosen?',
    orderMatters: true,
    keywords: ['arrange', 'president', 'ranked', 'sequence'],
    steps: [
      { label: 'Does order matter?', detail: 'Yes — President ≠ Secretary. Each role is distinct.', highlight: 'perm' },
      { label: 'Identify n and r', detail: 'Pool n = 8. Fill r = 3 distinct positions.' },
      { label: 'Pick the formula', detail: 'Use permutations: ⁿPᵣ = n! / (n−r)!', highlight: 'perm' },
      { label: 'Calculate', detail: '⁸P₃ = 8 × 7 × 6 = 336' },
    ],
    formula: '⁸P₃ = 8! / 5!',
    working: '= 8 × 7 × 6 = 336',
    answer: '336 ordered selections',
    tip: 'Distinct titles or digit positions → permutations.',
  },
  {
    id: 'mixed',
    tab: 'Mixed groups',
    question: 'A team of 6: exactly 4 boys (from 7) and 2 girls (from 5). How many teams?',
    orderMatters: false,
    keywords: ['exactly', 'and', 'boys', 'girls', 'both'],
    steps: [
      { label: 'Split the problem', detail: 'Two independent choices — boys AND girls.', highlight: 'multiply' },
      { label: 'Group 1 — boys', detail: 'Choose 4 from 7: ⁷C₄ = 35', highlight: 'comb' },
      { label: 'Group 2 — girls', detail: 'Choose 2 from 5: ⁵C₂ = 10', highlight: 'comb' },
      { label: 'Multiply (AND rule)', detail: 'Total = 35 × 10 = 350', highlight: 'multiply' },
    ],
    formula: '⁷C₄ × ⁵C₂',
    working: '= 35 × 10 = 350',
    answer: '350 teams',
    tip: '“Exactly … and …” → calculate each group separately, then multiply. Do NOT add.',
  },
  {
    id: 'together',
    tab: 'Stay together',
    question: '5 Maths books + 2 Science books in a row. Science books must be adjacent. How many arrangements?',
    orderMatters: true,
    keywords: ['next to', 'together', 'adjacent', 'bundle'],
    steps: [
      { label: 'Bundle the constraint', detail: 'Treat the 2 Science books as ONE block [S S].', highlight: 'bundle' },
      { label: 'Count external units', detail: '5 Maths + 1 block = 6 units → arrange in 6! ways.' },
      { label: 'Internal arrangements', detail: 'Inside the block, S books swap: 2! = 2 ways.', highlight: 'multiply' },
      { label: 'Multiply', detail: 'Total = 6! × 2! = 720 × 2 = 1440', highlight: 'multiply' },
    ],
    formula: '6! × 2!',
    working: '= 720 × 2 = 1440',
    answer: '1440 arrangements',
    tip: '“Together” → tie into one bundle, arrange bundles, then × internal permutations.',
  },
  {
    id: 'apart',
    tab: 'Stay apart',
    question: 'Arrange the letters of VECTOR. Vowels (E, O) must NOT be adjacent.',
    orderMatters: true,
    keywords: ['not together', 'not adjacent', 'separated', 'complement'],
    steps: [
      { label: 'Total (no restriction)', detail: 'All 6 letters: 6! = 720 arrangements.' },
      { label: 'Invalid — vowels together', detail: 'Bundle [E O]: 5! × 2! = 240 (together cases).', highlight: 'bundle' },
      { label: 'Complement rule', detail: 'Valid = Total − Invalid', highlight: 'subtract' },
      { label: 'Calculate', detail: '720 − 240 = 480', highlight: 'subtract' },
    ],
    formula: '6! − (5! × 2!)',
    working: '= 720 − 240 = 480',
    answer: '480 arrangements',
    tip: '“Not together” → find total, subtract the “together” count. Never stop at 240.',
  },
  {
    id: 'restriction',
    tab: 'Slot restriction',
    question: '4-digit even numbers from {2,3,5,7,8,9}, no repeated digits.',
    orderMatters: true,
    keywords: ['last digit', 'even', 'must be', 'slot'],
    steps: [
      { label: 'Fix the restricted slot first', detail: 'Last digit must be even → 2 or 8 (2 choices).', highlight: 'perm' },
      { label: 'Fill remaining slots', detail: '3 positions left, 5 digits remain → ⁵P₃ = 60.' },
      { label: 'Multiply slot choices', detail: 'Total = 2 × 60 = 120', highlight: 'multiply' },
      { label: 'Check', detail: 'Do NOT use ⁶P₄ = 360 — that ignores the even restriction.' },
    ],
    formula: '2 × ⁵P₃',
    working: '= 2 × (5 × 4 × 3) = 120',
    answer: '120 even numbers',
    tip: 'Slot restrictions (last digit, first letter, etc.) → handle that slot first, then permute the rest.',
  },
]

const POOL_COLORS = ['#5b8def', '#34d399', '#f59e0b', '#a78bfa', '#f43f5e', '#06b6d4', '#84cc16', '#ec4899']

function OrderCompare() {
  const people = ['A', 'B', 'C']
  const permExamples = [
    ['Pres', 'VP', 'Sec'],
    ['A', 'B', 'C'],
    ['B', 'A', 'C'],
  ]
  return (
    <div className="enlight-pnc-compare">
      <div className="enlight-pnc-compare__col enlight-pnc-compare__col--perm">
        <div className="enlight-pnc-compare__heading">Permutation — order matters</div>
        <div className="enlight-pnc-compare__slots">
          {permExamples.map((row, i) => (
            <div key={i} className="enlight-pnc-slot-row">
              {row.map((p, j) => (
                <div key={j} className="enlight-pnc-slot">
                  <span className="enlight-pnc-slot__label">{['1st', '2nd', '3rd'][j]}</span>
                  <span className="enlight-pnc-slot__val">{p}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="enlight-pnc-compare__note">ABC ≠ BAC → 3! = 6 arrangements</div>
      </div>
      <div className="enlight-pnc-compare__col enlight-pnc-compare__col--comb">
        <div className="enlight-pnc-compare__heading">Combination — order ignored</div>
        <div className="enlight-pnc-group">
          {people.map((p, i) => (
            <span key={p} className="enlight-pnc-person" style={{ background: POOL_COLORS[i] }}>
              {p}
            </span>
          ))}
        </div>
        <div className="enlight-pnc-compare__note">{`{A,B,C} = {C,B,A} → ³C₃ = 1 group`}</div>
      </div>
    </div>
  )
}

function ScenarioVisual({ scenario }: { scenario: Scenario }) {
  if (scenario.id === 'committee' || scenario.id === 'roles') {
    return (
      <div className="enlight-pnc-visual">
        <div className="enlight-pnc-pool">
          <span className="enlight-pnc-pool__label">Pool (n = 8)</span>
          <div className="enlight-pnc-pool__dots">
            {POOL_COLORS.map((c, i) => (
              <span key={i} className="enlight-pnc-dot" style={{ background: c }} />
            ))}
          </div>
        </div>
        <div className="enlight-pnc-arrow">↓ pick 3</div>
        {scenario.orderMatters ? (
          <div className="enlight-pnc-slot-row enlight-pnc-slot-row--hero">
            {['President', 'Vice-Pres', 'Secretary'].map((slot, i) => (
              <div key={slot} className="enlight-pnc-slot enlight-pnc-slot--filled">
                <span className="enlight-pnc-slot__label">{slot}</span>
                <span className="enlight-pnc-slot__val" style={{ background: POOL_COLORS[i] }}>
                  ?
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="enlight-pnc-sack">
            <span className="enlight-pnc-sack__label">Committee (unordered)</span>
            <div className="enlight-pnc-group">
              {POOL_COLORS.slice(0, 3).map((c, i) => (
                <span key={i} className="enlight-pnc-person" style={{ background: c }} />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (scenario.id === 'mixed') {
    return (
      <div className="enlight-pnc-visual enlight-pnc-visual--mixed">
        <div className="enlight-pnc-group-box">
          <span className="enlight-pnc-group-box__title">Boys (7)</span>
          <div className="enlight-pnc-pool__dots">
            {POOL_COLORS.slice(0, 7).map((c, i) => (
              <span key={i} className="enlight-pnc-dot" style={{ background: c }} />
            ))}
          </div>
          <span className="enlight-pnc-group-box__pick">pick 4 → ⁷C₄ = 35</span>
        </div>
        <span className="enlight-pnc-multiply">×</span>
        <div className="enlight-pnc-group-box">
          <span className="enlight-pnc-group-box__title">Girls (5)</span>
          <div className="enlight-pnc-pool__dots">
            {POOL_COLORS.slice(0, 5).map((_, i) => (
              <span key={i} className="enlight-pnc-dot" style={{ background: '#f472b6' }} />
            ))}
          </div>
          <span className="enlight-pnc-group-box__pick">pick 2 → ⁵C₂ = 10</span>
        </div>
      </div>
    )
  }

  if (scenario.id === 'together') {
    return (
      <div className="enlight-pnc-visual enlight-pnc-visual--row">
        {['M', 'M', 'M', 'M', 'M'].map((l, i) => (
          <span key={`m${i}`} className="enlight-pnc-block enlight-pnc-block--math">
            {l}
          </span>
        ))}
        <span className="enlight-pnc-block enlight-pnc-block--bundle">
          S + S
          <span className="enlight-pnc-block__sub">one block</span>
        </span>
        <div className="enlight-pnc-visual__caption">6 units → 6! × 2! (internal swap)</div>
      </div>
    )
  }

  if (scenario.id === 'apart') {
    return (
      <div className="enlight-pnc-visual enlight-pnc-visual--bars">
        <div className="enlight-pnc-bar enlight-pnc-bar--total">
          <span>All arrangements</span>
          <strong>6! = 720</strong>
        </div>
        <div className="enlight-pnc-bar enlight-pnc-bar--minus">−</div>
        <div className="enlight-pnc-bar enlight-pnc-bar--invalid">
          <span>Vowels together [EO]</span>
          <strong>5! × 2! = 240</strong>
        </div>
        <div className="enlight-pnc-bar enlight-pnc-bar--equals">=</div>
        <div className="enlight-pnc-bar enlight-pnc-bar--valid">
          <span>Vowels apart ✓</span>
          <strong>480</strong>
        </div>
      </div>
    )
  }

  return (
    <div className="enlight-pnc-visual">
      <div className="enlight-pnc-slot-row enlight-pnc-slot-row--hero">
        {['_', '_', '_', 'even'].map((slot, i) => (
          <div key={i} className={`enlight-pnc-slot${i === 3 ? ' enlight-pnc-slot--locked' : ''}`}>
            <span className="enlight-pnc-slot__label">{i === 3 ? '4th' : `${i + 1}st`.replace('0', '')}</span>
            <span className="enlight-pnc-slot__val">{slot === 'even' ? '2 or 8' : '?'}</span>
          </div>
        ))}
      </div>
      <div className="enlight-pnc-visual__caption">Fix restricted slot first → then ⁵P₃ for the rest</div>
    </div>
  )
}

export function PncQuestionGuide() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('committee')
  const [stepIndex, setStepIndex] = useState(0)

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!
  const maxStep = scenario.steps.length - 1

  function pickScenario(id: ScenarioId) {
    setScenarioId(id)
    setStepIndex(0)
  }

  return (
    <section className="enlight-explorer enlight-pnc-guide">
      <h2 className="enlight-explorer__title">PnC Question Breakdown Guide</h2>
      <p className="enlight-body-text enlight-pnc-guide__intro">
        Pick a question type, then walk through each step. The hardest part is choosing the right method —
        permutations, combinations, multiply groups, bundle, or complement.
      </p>

      <OrderCompare />

      <div className="enlight-pnc-scenario-tabs">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`enlight-pnc-scenario-tabs__btn${scenarioId === s.id ? ' enlight-pnc-scenario-tabs__btn--active' : ''}`}
            onClick={() => pickScenario(s.id)}
          >
            {s.tab}
          </button>
        ))}
      </div>

      <div className="enlight-pnc-question-card">
        <div className="enlight-pnc-question-card__label">Example question</div>
        <div className="enlight-pnc-question-card__text">{scenario.question}</div>
        <div className="enlight-pnc-keywords">
          {scenario.keywords.map((k) => (
            <span key={k} className="enlight-pnc-keyword">
              {k}
            </span>
          ))}
        </div>
      </div>

      <ScenarioVisual scenario={scenario} />

      <div className="enlight-pnc-step-nav">
        <button type="button" className="enlight-pnc-step-nav__btn" disabled={stepIndex === 0} onClick={() => setStepIndex((i) => i - 1)}>
          ← Previous
        </button>
        <span className="enlight-pnc-step-nav__count">
          Step {stepIndex + 1} of {scenario.steps.length}
        </span>
        <button type="button" className="enlight-pnc-step-nav__btn" disabled={stepIndex === maxStep} onClick={() => setStepIndex((i) => i + 1)}>
          Next →
        </button>
      </div>

      <div className="enlight-pnc-steps">
        {scenario.steps.map((step, i) => (
          <div
            key={step.label}
            className={`enlight-pnc-step${i === stepIndex ? ' enlight-pnc-step--active' : ''}${i < stepIndex ? ' enlight-pnc-step--done' : ''}${step.highlight ? ` enlight-pnc-step--${step.highlight}` : ''}`}
          >
            <div className="enlight-pnc-step__num">{i + 1}</div>
            <div>
              <div className="enlight-pnc-step__label">{step.label}</div>
              <div className="enlight-pnc-step__detail">{step.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {stepIndex === maxStep && (
        <div className="enlight-pnc-result">
          <div className="enlight-pnc-result__formula">{scenario.formula}</div>
          <div className="enlight-pnc-result__working">{scenario.working}</div>
          <div className="enlight-pnc-result__answer">{scenario.answer}</div>
          <div className="enlight-pnc-result__tip">💡 {scenario.tip}</div>
        </div>
      )}

      <div className="enlight-pnc-decision-tree">
        <div className="enlight-pnc-decision-tree__title">Quick decision tree</div>
        <div className="enlight-pnc-decision-tree__flow">
          <span className="enlight-pnc-node">Read question</span>
          <span className="enlight-pnc-node-arrow">→</span>
          <span className="enlight-pnc-node enlight-pnc-node--q">Order matters?</span>
          <span className="enlight-pnc-node-arrow">→</span>
          <span className="enlight-pnc-node enlight-pnc-node--yes">Yes → ⁿPᵣ</span>
          <span className="enlight-pnc-node enlight-pnc-node--no">No → ⁿCᵣ</span>
        </div>
        <div className="enlight-pnc-decision-tree__flow">
          <span className="enlight-pnc-node">Then check:</span>
          <span className="enlight-pnc-tag">together → bundle</span>
          <span className="enlight-pnc-tag">not together → total − together</span>
          <span className="enlight-pnc-tag">exactly A and B → multiply groups</span>
          <span className="enlight-pnc-tag">slot rule → fix slot first</span>
        </div>
      </div>
    </section>
  )
}
