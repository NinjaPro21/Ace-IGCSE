import { lazy, Suspense, useState, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import 'katex/dist/katex.min.css'
import { MathText } from '@/components/MathText'
import type { TopicMeta, GuidePanel, DiffGuidePanel, VectorGuidePanel, IntegrationGuidePanel, KinematicsGuidePanel, FnGuidePanel, QuadraticPanel, ModulusPanel, TrigPanel, LineGeometryPanel, CubicPanel } from '@/lib/contentTypes'
import {
  calloutVariant,
  expandWorkedExampleSections,
  prepareMathContent,
  parseContentCards,
  parseFormulaCards,
  parseFormulaCardVariants,
  formulaCardHasKToggle,
  normalizeKeyFormulasBody,
  parseTopicCards,
  parseStepsWithCallouts,
  parseWorkedExampleParts,
  stripStepPrefix,
} from '@/lib/mathMarkdown'

const DiscriminantExplorer = lazy(() =>
  import('@/features/explorers/DiscriminantExplorer').then((m) => ({ default: m.DiscriminantExplorer })),
)
const ModulusExplorer = lazy(() =>
  import('@/features/explorers/ModulusExplorer').then((m) => ({ default: m.ModulusExplorer })),
)
const LineIntersectionExplorer = lazy(() =>
  import('@/features/explorers/LineIntersectionExplorer').then((m) => ({ default: m.LineIntersectionExplorer })),
)
const TrigGraphExplorer = lazy(() =>
  import('@/features/explorers/TrigGraphExplorer').then((m) => ({ default: m.TrigGraphExplorer })),
)
const CastDiagramExplorer = lazy(() =>
  import('@/features/explorers/CastDiagramExplorer').then((m) => ({ default: m.CastDiagramExplorer })),
)
const QuadraticGraphExplorer = lazy(() =>
  import('@/features/explorers/QuadraticGraphExplorer').then((m) => ({ default: m.QuadraticGraphExplorer })),
)
const LogGraphExplorer = lazy(() =>
  import('@/features/explorers/LogGraphExplorer').then((m) => ({ default: m.LogGraphExplorer })),
)
const ChangeOfBaseExplorer = lazy(() =>
  import('@/features/explorers/ChangeOfBaseExplorer').then((m) => ({ default: m.ChangeOfBaseExplorer })),
)
const LogLawsExplorer = lazy(() =>
  import('@/features/explorers/LogLawsExplorer').then((m) => ({ default: m.LogLawsExplorer })),
)
const LogEvaluateQuizExplorer = lazy(() =>
  import('@/features/explorers/LogEvaluateQuizExplorer').then((m) => ({ default: m.LogEvaluateQuizExplorer })),
)
const NaturalLogExplorer = lazy(() =>
  import('@/features/explorers/NaturalLogExplorer').then((m) => ({ default: m.NaturalLogExplorer })),
)
const ShoelaceAreaGuide = lazy(() =>
  import('@/features/explorers/ShoelaceAreaGuide').then((m) => ({ default: m.ShoelaceAreaGuide })),
)
const ExponentialGraphExplorer = lazy(() =>
  import('@/features/explorers/ExponentialGraphExplorer').then((m) => ({ default: m.ExponentialGraphExplorer })),
)
const CircleLineExplorer = lazy(() =>
  import('@/features/explorers/CircleLineExplorer').then((m) => ({ default: m.CircleLineExplorer })),
)
const CircleCircleExplorer = lazy(() =>
  import('@/features/explorers/CircleCircleExplorer').then((m) => ({ default: m.CircleCircleExplorer })),
)
const PncQuestionGuide = lazy(() =>
  import('@/features/explorers/PncQuestionGuide').then((m) => ({ default: m.PncQuestionGuide })),
)
const SeriesVisualGuide = lazy(() =>
  import('@/features/explorers/SeriesVisualGuide').then((m) => ({ default: m.SeriesVisualGuide })),
)
const FunctionsVisualGuide = lazy(() =>
  import('@/features/explorers/FunctionsVisualGuide').then((m) => ({ default: m.FunctionsVisualGuide })),
)
const KinematicsVisualGuide = lazy(() =>
  import('@/features/explorers/KinematicsVisualGuide').then((m) => ({ default: m.KinematicsVisualGuide })),
)
const IntegrationVisualGuide = lazy(() =>
  import('@/features/explorers/IntegrationVisualGuide').then((m) => ({ default: m.IntegrationVisualGuide })),
)
const VectorsVisualGuide = lazy(() =>
  import('@/features/explorers/VectorsVisualGuide').then((m) => ({ default: m.VectorsVisualGuide })),
)
const DifferentiationVisualGuide = lazy(() =>
  import('@/features/explorers/DifferentiationVisualGuide').then((m) => ({ default: m.DifferentiationVisualGuide })),
)
const CubicGraphExplorer = lazy(() =>
  import('@/features/explorers/CubicGraphExplorer').then((m) => ({ default: m.CubicGraphExplorer })),
)
const PolynomialDivisionExplorer = lazy(() =>
  import('@/features/explorers/PolynomialDivisionExplorer').then((m) => ({ default: m.PolynomialDivisionExplorer })),
)
const LinearLawExplorer = lazy(() =>
  import('@/features/explorers/LinearLawExplorer').then((m) => ({ default: m.LinearLawExplorer })),
)
const LineGeometryExplorer = lazy(() =>
  import('@/features/explorers/LineGeometryExplorer').then((m) => ({ default: m.LineGeometryExplorer })),
)
const StatisticsVisualGuide = lazy(() =>
  import('@/features/explorers/StatisticsVisualGuide').then((m) => ({ default: m.StatisticsVisualGuide })),
)
const CurvesVisualGuide = lazy(() =>
  import('@/features/explorers/CurvesVisualGuide').then((m) => ({ default: m.CurvesVisualGuide })),
)
const RightTriangleGuide = lazy(() =>
  import('@/features/explorers/RightTriangleGuide').then((m) => ({ default: m.RightTriangleGuide })),
)
const CasioCalculatorGuide = lazy(() =>
  import('@/features/explorers/CasioCalculatorGuide').then((m) => ({ default: m.CasioCalculatorGuide })),
)
const ThermalVisualGuide = lazy(() =>
  import('@/features/explorers/ThermalVisualGuide').then((m) => ({ default: m.ThermalVisualGuide })),
)

type SectionKind =
  | 'core'
  | 'methods'
  | 'decision-grid'
  | 'graphs'
  | 'steps'
  | 'worked-example'
  | 'examiner-tip'
  | 'key-rule'
  | 'quick-check'
  | 'visual'
  | 'method-block'
  | 'generic'

interface NoteSection {
  kind: SectionKind
  heading: string
  body: string
}

const HEADING_MAP: Record<string, SectionKind> = {
  'core idea': 'core',
  'key definitions': 'core',
  'key formulas': 'methods',
  'key methods': 'methods',
  'key methods / types': 'methods',
  'graphs & diagrams': 'graphs',
  'which method do i use?': 'decision-grid',
  'mapping types': 'decision-grid',
  'steps / method': 'steps',
  'worked example': 'worked-example',
  'examiner tip': 'examiner-tip',
  'key rule': 'key-rule',
  'common mistakes': 'key-rule',
  'quick check': 'quick-check',
  'visual / interactive intent': 'visual',
  'visual diagram': 'visual',
  'worked example (0606/pyp style)': 'worked-example',
}

const METHOD_CARD_ACCENTS = ['violet', 'emerald', 'amber'] as const

function resolveSectionKind(heading: string): SectionKind {
  const lower = heading.toLowerCase()
  if (/^worked examples?(\s|$)/i.test(heading)) return 'worked-example'
  if (HEADING_MAP[lower]) return HEADING_MAP[lower]
  if (/^method\s+\d+/i.test(heading)) return 'method-block'
  return 'generic'
}

function boldFirstVerb(text: string): string {
  return text.replace(/^(\*\*)?([A-Z][a-zéèêàùûôîâ]+)(\*\*)?(\s)/, '**$2**$4')
}

const MD_PLUGINS = {
  remark: [remarkGfm, remarkMath],
  rehype: [rehypeRaw, rehypeKatex],
}

function parseSections(raw: string): NoteSection[] {
  const lines = raw.split(/\r?\n/)
  const sections: NoteSection[] = []
  let current: NoteSection | null = null

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)/)
    if (h2Match) {
      if (current) sections.push(current)
      const heading = h2Match[1].trim()
      current = { kind: resolveSectionKind(heading), heading, body: '' }
    } else if (current) {
      current.body += line + '\n'
    }
  }
  if (current) sections.push(current)
  return sections
}

function Md({ children, className }: { children: string; className?: string }) {
  const prepared = prepareMathContent(children, 'note')
  return (
    <div className={className ?? 'enlight-markdown'}>
      <ReactMarkdown remarkPlugins={MD_PLUGINS.remark} rehypePlugins={MD_PLUGINS.rehype}>
        {prepared}
      </ReactMarkdown>
    </div>
  )
}

function WorkspaceCard({
  children,
  className = '',
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={`enlight-ws-card ${className}`.trim()}>
      {children}
    </section>
  )
}

function WorkspaceLabel({ children }: { children: string }) {
  return <div className="enlight-ws-label">{children}</div>
}

function InlineCalloutBox({ label, body }: { label: string; body: string }) {
  const variant = calloutVariant(label)
  return (
    <div className={`enlight-inline-callout enlight-inline-callout--${variant}`}>
      <div className="enlight-inline-callout__label">{label}</div>
      <Md className="enlight-inline-callout__body">{body}</Md>
    </div>
  )
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="enlight-method-steps">
      {steps.map((step, i) => (
        <li key={i} className="enlight-method-step">
          <span className="enlight-method-step__num" aria-hidden>
            {i + 1}
          </span>
          <Md className="enlight-method-step__text">{boldFirstVerb(stripStepPrefix(step))}</Md>
        </li>
      ))}
    </ol>
  )
}

function WorkedExampleStepList({ steps }: { steps: string[] }) {
  return (
    <ol className="enlight-we-steps">
      {steps.map((step, i) => (
        <li key={i} className="enlight-we-step">
          <span className="enlight-we-step__num" aria-hidden>
            {i + 1}
          </span>
          <Md className="enlight-we-step__text">{boldFirstVerb(stripStepPrefix(step))}</Md>
        </li>
      ))}
    </ol>
  )
}

function formatExampleDisplayTitle(heading: string): string {
  const match = heading.match(/^worked examples?\s*[—–-]\s*(.+)/i)
  if (match?.[1]) {
    const subtitle = match[1].trim()
    const cased = subtitle.charAt(0).toUpperCase() + subtitle.slice(1)
    return `Worked example — ${cased}`
  }
  if (/^worked examples?$/i.test(heading.trim())) return 'Worked example'
  return heading.trim() || 'Worked example'
}

function WorkedExamplePanel({
  body,
  heading = 'Worked example',
}: {
  body: string
  heading?: string
}) {
  const { questions, steps } = parseWorkedExampleParts(body)
  const showHeading = heading.length > 0

  return (
    <article className="enlight-we-card">
      {showHeading && (
        <header className="enlight-we-card__header">
          <span className="enlight-we-card__icon" aria-hidden>
            ✎
          </span>
          <h3 className="enlight-we-card__title">
            <MathText content={formatExampleDisplayTitle(heading)} title />
          </h3>
        </header>
      )}

      {questions.map((q, i) => (
        <div key={`q-${i}`} className="enlight-we-card__question">
          <Md>{`**Question:** ${q}`}</Md>
        </div>
      ))}

      {steps.length > 0 && (
        <>
          <div className="enlight-we-card__solution-label">Solution</div>
          {steps.length > 1 ? (
            <WorkedExampleStepList steps={steps} />
          ) : (
            <div className="enlight-we-step enlight-we-step--solo">
              <span className="enlight-we-step__num" aria-hidden>
                1
              </span>
              <Md className="enlight-we-step__text">{boldFirstVerb(stripStepPrefix(steps[0]))}</Md>
            </div>
          )}
        </>
      )}

      {questions.length === 0 && steps.length === 0 && (
        <Md className="enlight-we-card__fallback">{body}</Md>
      )}
    </article>
  )
}

function ExamplesPanel({ examples }: { examples: NoteSection[] }) {
  return (
    <div className="enlight-examples-panel__stack" aria-label="Worked examples">
      {examples.map((ex, i) => (
        <WorkedExamplePanel
          key={i}
          heading={ex.heading}
          body={ex.body}
        />
      ))}
    </div>
  )
}

type MethodTab = 'steps' | 'examples'

function MethodTabbedCard({
  stepsSection,
  examples,
}: {
  stepsSection: NoteSection
  examples: NoteSection[]
}) {
  const [tab, setTab] = useState<MethodTab>('steps')
  const { steps, callouts } = parseStepsWithCallouts(stepsSection.body)
  const label = stepsSection.heading.replace(/^method\s+\d+\s*[—–-]\s*/i, '').trim()
  const methodNum = stepsSection.heading.match(/^method\s+(\d+)/i)?.[1]
  const wsLabel = methodNum ? `Method ${methodNum} — ${label}` : stepsSection.heading

  return (
    <WorkspaceCard className="enlight-ws-card--tabbed">
      <p className="enlight-lesson-tabs__section-title">{wsLabel}</p>
      <div className="enlight-lesson-tabs" role="tablist" aria-label={`${wsLabel} sections`}>
        <button
          type="button"
          role="tab"
          id="tab-steps"
          aria-selected={tab === 'steps'}
          aria-controls="panel-steps"
          className={`enlight-lesson-tabs__btn${tab === 'steps' ? ' enlight-lesson-tabs__btn--active' : ''}`}
          onClick={() => setTab('steps')}
        >
          Steps
        </button>
        <button
          type="button"
          role="tab"
          id="tab-examples"
          aria-selected={tab === 'examples'}
          aria-controls="panel-examples"
          className={`enlight-lesson-tabs__btn${tab === 'examples' ? ' enlight-lesson-tabs__btn--active' : ''}`}
          onClick={() => setTab('examples')}
        >
          Worked examples
          {examples.length > 1 && (
            <span className="enlight-lesson-tabs__count">{examples.length}</span>
          )}
        </button>
      </div>
      {tab === 'steps' ? (
        <div
          role="tabpanel"
          id="panel-steps"
          aria-labelledby="tab-steps"
          className="enlight-lesson-tabs__panel"
        >
          <StepList steps={steps} />
          {callouts.map((c, i) => (
            <InlineCalloutBox key={i} label={c.label} body={c.body} />
          ))}
        </div>
      ) : (
        <div
          role="tabpanel"
          id="panel-examples"
          aria-labelledby="tab-examples"
          className="enlight-lesson-tabs__panel"
        >
          <ExamplesPanel examples={examples} />
        </div>
      )}
    </WorkspaceCard>
  )
}

function CoreSection({ section }: { section: NoteSection }) {
  return (
    <WorkspaceCard className="enlight-ws-card--core">
      <WorkspaceLabel>{section.heading}</WorkspaceLabel>
      <Md className="enlight-markdown enlight-note-prose enlight-ws-card__body">{section.body}</Md>
    </WorkspaceCard>
  )
}

function DecisionGridSection({ section }: { section: NoteSection }) {
  const cards = parseContentCards(section.body)
  const isDecision = section.kind === 'decision-grid'
  return (
    <WorkspaceCard>
      <WorkspaceLabel>{isDecision ? 'Which method do I use?' : section.heading}</WorkspaceLabel>
      <div className="enlight-decision-grid">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`enlight-decision-card enlight-decision-card--${METHOD_CARD_ACCENTS[i % METHOD_CARD_ACCENTS.length]}`}
          >
            <Md className="enlight-markdown enlight-decision-card__body">{card}</Md>
          </div>
        ))}
      </div>
    </WorkspaceCard>
  )
}

function FormulaStackItem({ card }: { card: string }) {
  const parsed = parseFormulaCardVariants(card)
  const hasToggle = formulaCardHasKToggle(card)
  const [variantId, setVariantId] = useState(parsed.variants[0]?.id ?? 'base')
  const active = parsed.variants.find((v) => v.id === variantId) ?? parsed.variants[0]

  if (!hasToggle || !active) {
    return (
      <div className="enlight-formula-stack__item">
        <Md className="enlight-markdown">{card}</Md>
      </div>
    )
  }

  return (
    <div className="enlight-formula-stack__item">
      {parsed.titleMarkdown ? (
        <Md className="enlight-markdown enlight-formula-card__title">{parsed.titleMarkdown}</Md>
      ) : null}
      <div className="enlight-formula-k-toggle" role="tablist" aria-label="Formula variant">
        {parsed.variants.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={variantId === v.id}
            className={`enlight-formula-k-toggle__btn${variantId === v.id ? ' enlight-formula-k-toggle__btn--active' : ''}`}
            onClick={() => setVariantId(v.id)}
          >
            <Md className="enlight-markdown enlight-formula-k-toggle__label">{v.label}</Md>
          </button>
        ))}
      </div>
      <Md className="enlight-markdown">{`$$\n${active.math}\n$$`}</Md>
      {parsed.description ? (
        <Md className="enlight-markdown enlight-formula-card__desc">{parsed.description}</Md>
      ) : null}
    </div>
  )
}

function MethodsSection({ section }: { section: NoteSection }) {
  const isKeyFormulas = section.heading.toLowerCase() === 'key formulas'
  const sectionBody = isKeyFormulas ? normalizeKeyFormulasBody(section.body) : section.body
  const cards = isKeyFormulas ? parseFormulaCards(sectionBody) : parseContentCards(section.body)

  // Decision grid is for taxonomy cards (mapping types etc.), not formula lists
  if (cards.length >= 3 && !isKeyFormulas) {
    return <DecisionGridSection section={{ ...section, kind: 'methods' }} />
  }

  if (cards.length >= 1) {
    return (
      <WorkspaceCard>
        <WorkspaceLabel>{section.heading}</WorkspaceLabel>
        <div className={isKeyFormulas ? 'enlight-formula-stack' : 'enlight-formula-strip'}>
          {cards.map((card, i) =>
            isKeyFormulas ? (
              <FormulaStackItem key={i} card={card} />
            ) : (
              <div key={i} className="enlight-formula-strip__item">
                <Md className="enlight-markdown">{card}</Md>
              </div>
            ),
          )}
        </div>
      </WorkspaceCard>
    )
  }
  return null
}

function GraphsDiagramsSection({ section }: { section: NoteSection }) {
  const cards = parseTopicCards(section.body)

  if (cards.length <= 1 && !cards[0]?.diagram) {
    return (
      <WorkspaceCard>
        <WorkspaceLabel>{section.heading}</WorkspaceLabel>
        <Md className="enlight-note-prose">{section.body}</Md>
      </WorkspaceCard>
    )
  }

  return (
    <WorkspaceCard>
      <WorkspaceLabel>{section.heading}</WorkspaceLabel>
      <div className="enlight-graph-topic-stack">
        {cards.map((card, i) => (
          <div key={i} className="enlight-graph-topic-card">
            {card.text ? <Md className="enlight-markdown">{card.text}</Md> : null}
            {card.diagram ? <Md className="enlight-markdown enlight-graph-topic-card__diagram">{card.diagram}</Md> : null}
          </div>
        ))}
      </div>
    </WorkspaceCard>
  )
}

function MethodWorkspaceCard({ stepsSection }: { stepsSection: NoteSection }) {
  const { steps, callouts } = parseStepsWithCallouts(stepsSection.body)
  const label = stepsSection.heading.replace(/^method\s+\d+\s*[—–-]\s*/i, '').trim()
  const methodNum = stepsSection.heading.match(/^method\s+(\d+)/i)?.[1]
  const wsLabel = methodNum ? `Method ${methodNum} — ${label}` : stepsSection.heading

  return (
    <WorkspaceCard>
      <WorkspaceLabel>{wsLabel}</WorkspaceLabel>
      <StepList steps={steps} />
      {callouts.map((c, i) => (
        <InlineCalloutBox key={i} label={c.label} body={c.body} />
      ))}
    </WorkspaceCard>
  )
}

function WorkedExamplesOnlySection({ examples }: { examples: NoteSection[] }) {
  return <ExamplesPanel examples={examples} />
}

function WarningCalloutSection({ section }: { section: NoteSection }) {
  const isExaminerTip = section.kind === 'examiner-tip'
  return (
    <WorkspaceCard className="enlight-ws-card--flat">
      <div className={`enlight-callout ${isExaminerTip ? 'enlight-callout--orange' : 'enlight-callout--warning'}`}>
        <div className="enlight-callout__header">
          <span className="enlight-callout__icon" aria-hidden>
            {isExaminerTip ? '⚠' : '★'}
          </span>
          <span className="enlight-callout__label">{section.heading}</span>
        </div>
        <Md className="enlight-callout__body">{section.body}</Md>
      </div>
    </WorkspaceCard>
  )
}

function QuickCheckSection({ section }: { section: NoteSection }) {
  return (
    <WorkspaceCard className="enlight-ws-card--flat">
      <div className="enlight-inline-callout enlight-inline-callout--green enlight-inline-callout--standalone">
        <div className="enlight-inline-callout__label">{section.heading}</div>
        <Md className="enlight-inline-callout__body">{section.body}</Md>
      </div>
    </WorkspaceCard>
  )
}

function GenericSection({ section }: { section: NoteSection }) {
  return (
    <WorkspaceCard>
      <WorkspaceLabel>{section.heading}</WorkspaceLabel>
      <Md className="enlight-note-prose">{section.body}</Md>
    </WorkspaceCard>
  )
}

const EXPLORER_LABELS: Record<NonNullable<TopicMeta['explorerId']>, string> = {
  discriminant: 'Discriminant Explorer',
  modulus: 'Modulus Graph Explorer',
  'line-intersection': 'Line & Curve Explorer',
  trig: 'Trigonometry Graph Explorer',
  cast: 'CAST Diagram Explorer',
  quadratic: 'Quadratic Graph Explorer',
  log: 'Logarithm Graph Explorer',
  'log-laws': 'Log Laws Explorer',
  'change-of-base': 'Change of Base Calculator',
  'log-eval': 'Log Evaluation Practice',
  'natural-log': 'Natural Log & Exponential Grid',
  shoelace: 'Shoelace & Area Methods',
  exponential: 'Exponential Graph Explorer',
  'circle-line': 'Line & Circle Discriminant',
  'circle-circle': 'Two Circles Intersection',
  'pnc-guide': 'PnC Question Breakdown',
  'series-guide': 'Series Visual Guide',
  'functions-guide': 'Functions Visual Guide',
  'differentiation-guide': 'Differentiation Visual Guide',
  'vectors-guide': 'Vectors Visual Guide',
  'integration-guide': 'Integration Visual Guide',
  'kinematics-guide': 'Kinematics Visual Guide',
  'line-geometry': 'Coordinate Geometry Lab',
  cubic: 'Cubic Graph Explorer',
  'poly-division': 'Polynomial Division Guide',
  'linear-law': 'Non-Linear to Linear Tool',
  'calculator-guide': 'Casio Calculator Guide',
  'stats-guide': 'Statistics Visual Guide',
  'curves-guide': 'Curve Plotting Guide',
  'right-triangle-guide': 'Right-Triangle Trigonometry',
  'thermal-guide': 'Thermal Properties Diagrams',
}

const VISUAL_GUIDE_IDS = new Set<TopicMeta['explorerId']>([
  'shoelace',
  'cast',
  'pnc-guide',
  'series-guide',
  'functions-guide',
  'differentiation-guide',
  'vectors-guide',
  'integration-guide',
  'kinematics-guide',
  'line-geometry',
  'cubic',
  'calculator-guide',
  'stats-guide',
  'curves-guide',
  'right-triangle-guide',
  'thermal-guide',
])

function ExplorerContent({
  explorerId,
  explorerPanels,
  subjectId,
}: {
  explorerId: TopicMeta['explorerId']
  explorerPanels?: GuidePanel[]
  subjectId?: string
}) {
  const fallback = (
    <div className="enlight-sandbox-coming-soon">
      <span style={{ fontSize: '1.5rem' }}>⏳</span>
      <span>Loading explorer…</span>
    </div>
  )
  switch (explorerId) {
    case 'discriminant':
      return <Suspense fallback={fallback}><DiscriminantExplorer /></Suspense>
    case 'modulus':
      return <Suspense fallback={fallback}><ModulusExplorer panels={explorerPanels as ModulusPanel[] | undefined} /></Suspense>
    case 'line-intersection':
      return <Suspense fallback={fallback}><LineIntersectionExplorer /></Suspense>
    case 'trig':
      return <Suspense fallback={fallback}><TrigGraphExplorer panels={explorerPanels as TrigPanel[] | undefined} /></Suspense>
    case 'cast':
      return <Suspense fallback={fallback}><CastDiagramExplorer /></Suspense>
    case 'quadratic':
      return <Suspense fallback={fallback}><QuadraticGraphExplorer panels={explorerPanels as QuadraticPanel[] | undefined} /></Suspense>
    case 'log':
      return <Suspense fallback={fallback}><LogGraphExplorer /></Suspense>
    case 'change-of-base':
      return <Suspense fallback={fallback}><ChangeOfBaseExplorer /></Suspense>
    case 'log-laws':
      return <Suspense fallback={fallback}><LogLawsExplorer /></Suspense>
    case 'log-eval':
      return <Suspense fallback={fallback}><LogEvaluateQuizExplorer /></Suspense>
    case 'natural-log':
      return <Suspense fallback={fallback}><NaturalLogExplorer /></Suspense>
    case 'shoelace':
      return <Suspense fallback={fallback}><ShoelaceAreaGuide /></Suspense>
    case 'exponential':
      return <Suspense fallback={fallback}><ExponentialGraphExplorer /></Suspense>
    case 'circle-line':
      return <Suspense fallback={fallback}><CircleLineExplorer /></Suspense>
    case 'circle-circle':
      return <Suspense fallback={fallback}><CircleCircleExplorer /></Suspense>
    case 'pnc-guide':
      return <Suspense fallback={fallback}><PncQuestionGuide /></Suspense>
    case 'series-guide':
      return (
        <Suspense fallback={fallback}>
          <SeriesVisualGuide panels={explorerPanels as import('@/lib/contentTypes').SeriesGuidePanel[] | undefined} />
        </Suspense>
      )
    case 'functions-guide':
      return <Suspense fallback={fallback}><FunctionsVisualGuide panels={explorerPanels as FnGuidePanel[] | undefined} /></Suspense>
    case 'differentiation-guide':
      return <Suspense fallback={fallback}><DifferentiationVisualGuide panels={explorerPanels as DiffGuidePanel[] | undefined} /></Suspense>
    case 'vectors-guide':
      return <Suspense fallback={fallback}><VectorsVisualGuide panels={explorerPanels as VectorGuidePanel[] | undefined} /></Suspense>
    case 'integration-guide':
      return <Suspense fallback={fallback}><IntegrationVisualGuide panels={explorerPanels as IntegrationGuidePanel[] | undefined} /></Suspense>
    case 'kinematics-guide':
      return <Suspense fallback={fallback}><KinematicsVisualGuide panels={explorerPanels as KinematicsGuidePanel[] | undefined} /></Suspense>
    case 'line-geometry':
      return <Suspense fallback={fallback}><LineGeometryExplorer panels={explorerPanels as LineGeometryPanel[] | undefined} /></Suspense>
    case 'cubic':
      return <Suspense fallback={fallback}><CubicGraphExplorer panels={explorerPanels as CubicPanel[] | undefined} /></Suspense>
    case 'poly-division':
      return <Suspense fallback={fallback}><PolynomialDivisionExplorer /></Suspense>
    case 'linear-law':
      return <Suspense fallback={fallback}><LinearLawExplorer /></Suspense>
    case 'calculator-guide':
      return (
        <Suspense fallback={fallback}>
          <div className="enlight-calc-guide-wrap">
            <CasioCalculatorGuide
              panels={explorerPanels as import('@/lib/contentTypes').CalculatorGuidePanel[] | undefined}
              variant={subjectId === 'add-maths-0606' ? '0606' : '0580'}
            />
          </div>
        </Suspense>
      )
    case 'stats-guide':
      return (
        <Suspense fallback={fallback}>
          <StatisticsVisualGuide panels={explorerPanels as import('@/lib/contentTypes').StatsGuidePanel[] | undefined} />
        </Suspense>
      )
    case 'curves-guide':
      return (
        <Suspense fallback={fallback}>
          <CurvesVisualGuide panels={explorerPanels as import('@/lib/contentTypes').CurvesGuidePanel[] | undefined} />
        </Suspense>
      )
    case 'right-triangle-guide':
      return (
        <Suspense fallback={fallback}>
          <RightTriangleGuide panels={explorerPanels as import('@/lib/contentTypes').RightTrianglePanel[] | undefined} />
        </Suspense>
      )
    case 'thermal-guide':
      return (
        <Suspense fallback={fallback}>
          <ThermalVisualGuide panels={explorerPanels as import('@/lib/contentTypes').ThermalGuidePanel[] | undefined} />
        </Suspense>
      )
    default:
      return (
        <div className="enlight-sandbox-coming-soon">
          <span style={{ fontSize: '1.5rem' }}>🔬</span>
          <span>Interactive sandbox coming soon for this topic.</span>
        </div>
      )
  }
}

function ExplorerSection({
  explorerId,
  explorerPanels,
  subjectId,
}: {
  explorerId: NonNullable<TopicMeta['explorerId']>
  explorerPanels?: GuidePanel[]
  subjectId?: string
}) {
  const prefix = VISUAL_GUIDE_IDS.has(explorerId) ? 'Visual diagram' : 'Interactive'
  const isCalc = explorerId === 'calculator-guide'
  return (
    <WorkspaceCard className={isCalc ? 'enlight-ws-card--explorer enlight-ws-card--calc' : 'enlight-ws-card--explorer'} id="lesson-explorer">
      <WorkspaceLabel>{`${prefix} · ${EXPLORER_LABELS[explorerId]}`}</WorkspaceLabel>
      <div className="enlight-explorer-card__body">
        <ExplorerContent explorerId={explorerId} explorerPanels={explorerPanels} subjectId={subjectId} />
      </div>
    </WorkspaceCard>
  )
}

function VisualDiagramSection({ section }: { section: NoteSection }) {
  return (
    <WorkspaceCard className="enlight-ws-card--flat">
      <WorkspaceLabel>Visual diagram</WorkspaceLabel>
      <Md className="enlight-note-prose enlight-visual-diagram__caption">{section.body}</Md>
    </WorkspaceCard>
  )
}

function renderSections(sections: NoteSection[]): ReactNode[] {
  const elements: ReactNode[] = []
  let idx = 0

  while (idx < sections.length) {
    const section = sections[idx]
    const isStepsLike = section.kind === 'steps' || section.kind === 'method-block'

    if (isStepsLike) {
      const examples: NoteSection[] = []
      let j = idx + 1
      while (j < sections.length && sections[j].kind === 'worked-example') {
        examples.push(sections[j])
        j++
      }
      if (examples.length > 0) {
        elements.push(
          <MethodTabbedCard key={idx} stepsSection={section} examples={examples} />,
        )
        idx = j
      } else {
        elements.push(<MethodWorkspaceCard key={idx} stepsSection={section} />)
        idx++
      }
      continue
    }

    if (section.kind === 'worked-example') {
      const examples: NoteSection[] = []
      let j = idx
      while (j < sections.length && sections[j].kind === 'worked-example') {
        examples.push(sections[j])
        j++
      }
      elements.push(<WorkedExamplesOnlySection key={idx} examples={examples} />)
      idx = j
      continue
    }

    switch (section.kind) {
      case 'core':
        elements.push(<CoreSection key={idx} section={section} />)
        break
      case 'decision-grid':
        elements.push(<DecisionGridSection key={idx} section={section} />)
        break
      case 'methods':
        elements.push(<MethodsSection key={idx} section={section} />)
        break
      case 'graphs':
        elements.push(<GraphsDiagramsSection key={idx} section={section} />)
        break
      case 'examiner-tip':
      case 'key-rule':
        elements.push(<WarningCalloutSection key={idx} section={section} />)
        break
      case 'quick-check':
        elements.push(<QuickCheckSection key={idx} section={section} />)
        break
      case 'visual':
        elements.push(<VisualDiagramSection key={idx} section={section} />)
        break
      default:
        elements.push(<GenericSection key={idx} section={section} />)
    }
    idx++
  }

  return elements
}

interface MarkdownLessonProps {
  content: string
  explorerId?: TopicMeta['explorerId']
  explorerPanels?: GuidePanel[]
  subjectId?: string
}

export function MarkdownLesson({ content, explorerId, explorerPanels, subjectId }: MarkdownLessonProps) {
  const sections = expandWorkedExampleSections(parseSections(content))

  return (
    <div className="enlight-note-workspace">
      {renderSections(sections)}
      {explorerId && <ExplorerSection explorerId={explorerId} explorerPanels={explorerPanels} subjectId={subjectId} />}
    </div>
  )
}
