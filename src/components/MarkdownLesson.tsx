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
  reorderWorkedExamplesAfterSteps,
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
const LensImageExplorer = lazy(() =>
  import('@/features/explorers/LensImageExplorer').then((m) => ({ default: m.LensImageExplorer })),
)
const FlemingHandRuleExplorer = lazy(() =>
  import('@/features/explorers/FlemingHandRuleExplorer').then((m) => ({ default: m.FlemingHandRuleExplorer })),
)
const Ch18Diagram = lazy(() =>
  import('@/features/explorers/ch18').then((m) => ({ default: m.Ch18Diagram })),
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
  const classes = ['ace-markdown', className].filter(Boolean).join(' ')
  return (
    <div className={classes}>
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
    <section id={id} className={`ace-ws-card ${className}`.trim()}>
      {children}
    </section>
  )
}

function WorkspaceLabel({ children }: { children: string }) {
  return <div className="ace-ws-label">{children}</div>
}

function InlineCalloutBox({ label, body }: { label: string; body: string }) {
  const variant = calloutVariant(label)
  return (
    <div className={`ace-inline-callout ace-inline-callout--${variant}`}>
      <div className="ace-inline-callout__label">{label}</div>
      <Md className="ace-inline-callout__body">{body}</Md>
    </div>
  )
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="ace-method-steps">
      {steps.map((step, i) => (
        <li key={i} className="ace-method-step">
          <span className="ace-method-step__num" aria-hidden>
            {i + 1}
          </span>
          <Md className="ace-method-step__text">{boldFirstVerb(stripStepPrefix(step))}</Md>
        </li>
      ))}
    </ol>
  )
}

function WorkedExampleStepList({ steps }: { steps: string[] }) {
  return (
    <ol className="ace-we-steps">
      {steps.map((step, i) => (
        <li key={i} className="ace-we-step">
          <span className="ace-we-step__num" aria-hidden>
            {i + 1}
          </span>
          <Md className="ace-we-step__text">{boldFirstVerb(stripStepPrefix(step))}</Md>
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
    <article className="ace-we-card">
      {showHeading && (
        <header className="ace-we-card__header">
          <span className="ace-we-card__icon" aria-hidden>
            ✎
          </span>
          <h3 className="ace-we-card__title">
            <MathText content={formatExampleDisplayTitle(heading)} title />
          </h3>
        </header>
      )}

      {questions.map((q, i) => (
        <div key={`q-${i}`} className="ace-we-card__question">
          <Md>{`**Question:** ${q}`}</Md>
        </div>
      ))}

      {steps.length > 0 && (
        <>
          <div className="ace-we-card__solution-label">Solution</div>
          {steps.length > 1 ? (
            <WorkedExampleStepList steps={steps} />
          ) : (
            <div className="ace-we-step ace-we-step--solo">
              <span className="ace-we-step__num" aria-hidden>
                1
              </span>
              <Md className="ace-we-step__text">{boldFirstVerb(stripStepPrefix(steps[0]))}</Md>
            </div>
          )}
        </>
      )}

      {questions.length === 0 && steps.length === 0 && (
        <Md className="ace-we-card__fallback">{body}</Md>
      )}
    </article>
  )
}

function ExamplesPanel({ examples }: { examples: NoteSection[] }) {
  return (
    <div className="ace-examples-panel__stack" aria-label="Worked examples">
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

function MethodWithExamplesCard({
  stepsSection,
  examples,
}: {
  stepsSection: NoteSection
  examples: NoteSection[]
}) {
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
      {examples.length > 0 && (
        <div className="ace-method-examples-bridge">
          <ExamplesPanel examples={examples} />
        </div>
      )}
    </WorkspaceCard>
  )
}

function CoreSection({ section }: { section: NoteSection }) {
  return (
    <WorkspaceCard className="ace-ws-card--core">
      <WorkspaceLabel>{section.heading}</WorkspaceLabel>
      <Md className="ace-markdown ace-note-prose ace-ws-card__body">{section.body}</Md>
    </WorkspaceCard>
  )
}

function DecisionGridSection({ section }: { section: NoteSection }) {
  const cards = parseContentCards(section.body)
  const isDecision = section.kind === 'decision-grid'
  return (
    <WorkspaceCard>
      <WorkspaceLabel>{isDecision ? 'Which method do I use?' : section.heading}</WorkspaceLabel>
      <div className="ace-decision-grid">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`ace-decision-card ace-decision-card--${METHOD_CARD_ACCENTS[i % METHOD_CARD_ACCENTS.length]}`}
          >
            <Md className="ace-markdown ace-decision-card__body">{card}</Md>
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

  if (!active) {
    return (
      <div className="ace-formula-stack__item">
        <Md className="ace-markdown">{card}</Md>
      </div>
    )
  }

  if (!hasToggle) {
    return (
      <div className="ace-formula-stack__item">
        {parsed.titleMarkdown ? (
          <Md className="ace-markdown ace-formula-card__title">{parsed.titleMarkdown}</Md>
        ) : null}
        <Md className="ace-markdown">{`$$\n${active.math}\n$$`}</Md>
        {parsed.description ? (
          <Md className="ace-markdown ace-formula-card__desc">{parsed.description}</Md>
        ) : null}
      </div>
    )
  }

  return (
    <div className="ace-formula-stack__item">
      {parsed.titleMarkdown ? (
        <Md className="ace-markdown ace-formula-card__title">{parsed.titleMarkdown}</Md>
      ) : null}
      <div className="ace-formula-k-toggle" role="tablist" aria-label="Formula variant">
        {parsed.variants.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={variantId === v.id}
            className={`ace-formula-k-toggle__btn${variantId === v.id ? ' ace-formula-k-toggle__btn--active' : ''}`}
            onClick={() => setVariantId(v.id)}
          >
            <Md className="ace-markdown ace-formula-k-toggle__label">{v.label}</Md>
          </button>
        ))}
      </div>
      <Md className="ace-markdown">{`$$\n${active.math}\n$$`}</Md>
      {parsed.description ? (
        <Md className="ace-markdown ace-formula-card__desc">{parsed.description}</Md>
      ) : null}
    </div>
  )
}

function MethodsSection({ section }: { section: NoteSection }) {
  const isKeyFormulas = section.heading.toLowerCase() === 'key formulas'
  const isKeyMethods = /^key methods/i.test(section.heading)
  const sectionBody = isKeyFormulas ? normalizeKeyFormulasBody(section.body) : section.body
  const cards = isKeyFormulas ? parseFormulaCards(sectionBody) : parseContentCards(sectionBody)

  if (cards.length >= 1 && isKeyMethods) {
    return (
      <WorkspaceCard>
        <WorkspaceLabel>{section.heading}</WorkspaceLabel>
        <div className="ace-key-methods-grid">
          {cards.map((card, i) => (
            <div key={i} className="ace-key-methods-card">
              <Md className="ace-markdown ace-key-methods-card__body">{card}</Md>
            </div>
          ))}
        </div>
      </WorkspaceCard>
    )
  }

  // Decision grid is for taxonomy cards (mapping types etc.), not formula lists
  if (cards.length >= 3 && !isKeyFormulas) {
    return <DecisionGridSection section={{ ...section, kind: 'methods' }} />
  }

  if (cards.length >= 1) {
    return (
      <WorkspaceCard>
        <WorkspaceLabel>{section.heading}</WorkspaceLabel>
        <div className={isKeyFormulas ? 'ace-formula-stack' : 'ace-formula-strip'}>
          {cards.map((card, i) =>
            isKeyFormulas ? (
              <FormulaStackItem key={i} card={card} />
            ) : (
              <div key={i} className="ace-formula-strip__item">
                <Md className="ace-markdown">{card}</Md>
              </div>
            ),
          )}
        </div>
      </WorkspaceCard>
    )
  }
  return null
}

function Em3dDiagramCard({ diagram, hero }: { diagram: string; hero?: boolean }) {
  return (
    <Suspense
      fallback={
        <div className="ace-sandbox-coming-soon">
          <span style={{ fontSize: '1.5rem' }}>⏳</span>
          <span>Loading 3D diagram…</span>
        </div>
      }
    >
      <Ch18Diagram diagram={diagram} hero={hero} />
    </Suspense>
  )
}

function isEm3dDiagram(diagram: string) {
  return (
    diagram.includes('ace-em-3d') ||
    diagram.includes('ace-fleming-3d') ||
    diagram.includes('ace-physics-diagram--hand-rule')
  )
}

function GraphDiagramContent({ diagram }: { diagram: string }) {
  if (isEm3dDiagram(diagram)) {
    return <Em3dDiagramCard diagram={diagram} />
  }
  return <Md className="ace-markdown ace-graph-topic-card__diagram">{diagram}</Md>
}

function GraphsDiagramsSection({ section }: { section: NoteSection }) {
  const cards = [...parseTopicCards(section.body)]
  const heroIdx = cards.findIndex((c) => c.diagram?.includes('ace-physics-diagram--hero'))
  const heroCard = heroIdx >= 0 ? cards.splice(heroIdx, 1)[0] : null

  if (cards.length <= 1 && !cards[0]?.diagram && !heroCard) {
    return (
      <WorkspaceCard>
        <WorkspaceLabel>{section.heading}</WorkspaceLabel>
        <Md className="ace-note-prose">{section.body}</Md>
      </WorkspaceCard>
    )
  }

  return (
    <WorkspaceCard className={heroCard ? 'ace-ws-card--graphs-hero' : undefined}>
      <WorkspaceLabel>{section.heading}</WorkspaceLabel>
      {heroCard ? (
        <div className="ace-graph-hero">
          {heroCard.text ? <Md className="ace-markdown ace-graph-hero__text">{heroCard.text}</Md> : null}
          {heroCard.diagram ? (
            isEm3dDiagram(heroCard.diagram) ? (
              <Em3dDiagramCard diagram={heroCard.diagram} hero />
            ) : (
              <Md className="ace-markdown ace-graph-hero__diagram">{heroCard.diagram}</Md>
            )
          ) : null}
        </div>
      ) : null}
      {cards.length > 0 ? (
        <div className={`ace-graph-topic-stack${heroCard ? ' ace-graph-topic-stack--after-hero' : ''}`}>
          {cards.map((card, i) => (
            <div key={i} className="ace-graph-topic-card">
              {card.text ? <Md className="ace-markdown">{card.text}</Md> : null}
              {card.diagram ? <GraphDiagramContent diagram={card.diagram} /> : null}
              {card.caption ? (
                <Md className="ace-markdown ace-graph-topic-card__caption">{card.caption}</Md>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
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
    <WorkspaceCard className="ace-ws-card--flat">
      <div className={`ace-callout ${isExaminerTip ? 'ace-callout--orange' : 'ace-callout--warning'}`}>
        <div className="ace-callout__header">
          <span className="ace-callout__icon" aria-hidden>
            {isExaminerTip ? '⚠' : '★'}
          </span>
          <span className="ace-callout__label">{section.heading}</span>
        </div>
        <Md className="ace-callout__body">{section.body}</Md>
      </div>
    </WorkspaceCard>
  )
}

function QuickCheckSection({ section }: { section: NoteSection }) {
  return (
    <WorkspaceCard className="ace-ws-card--flat">
      <div className="ace-inline-callout ace-inline-callout--green ace-inline-callout--standalone">
        <div className="ace-inline-callout__label">{section.heading}</div>
        <Md className="ace-inline-callout__body">{section.body}</Md>
      </div>
    </WorkspaceCard>
  )
}

function GenericSection({ section }: { section: NoteSection }) {
  return (
    <WorkspaceCard>
      <WorkspaceLabel>{section.heading}</WorkspaceLabel>
      <Md className="ace-note-prose">{section.body}</Md>
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
  'lens-guide': 'Converging Lens Ray Diagrams',
  'fleming-guide': "Fleming's Hand Rules (3D)",
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
  'lens-guide',
  'fleming-guide',
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
    <div className="ace-sandbox-coming-soon">
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
          <div className="ace-calc-guide-wrap">
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
    case 'lens-guide':
      return (
        <Suspense fallback={fallback}>
          <LensImageExplorer panels={explorerPanels as import('@/lib/contentTypes').LensGuidePanel[] | undefined} />
        </Suspense>
      )
    case 'fleming-guide':
      return (
        <Suspense fallback={fallback}>
          <FlemingHandRuleExplorer panels={explorerPanels as import('@/lib/contentTypes').FlemingGuidePanel[] | undefined} />
        </Suspense>
      )
    default:
      return (
        <div className="ace-sandbox-coming-soon">
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
    <WorkspaceCard className={isCalc ? 'ace-ws-card--explorer ace-ws-card--calc' : 'ace-ws-card--explorer'} id="lesson-explorer">
      <WorkspaceLabel>{`${prefix} · ${EXPLORER_LABELS[explorerId]}`}</WorkspaceLabel>
      <div className="ace-explorer-card__body">
        <ExplorerContent explorerId={explorerId} explorerPanels={explorerPanels} subjectId={subjectId} />
      </div>
    </WorkspaceCard>
  )
}

function VisualDiagramSection({ section }: { section: NoteSection }) {
  return (
    <WorkspaceCard className="ace-ws-card--flat">
      <WorkspaceLabel>Visual diagram</WorkspaceLabel>
      <Md className="ace-note-prose ace-visual-diagram__caption">{section.body}</Md>
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
          <MethodWithExamplesCard key={idx} stepsSection={section} examples={examples} />,
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
  const sections = reorderWorkedExamplesAfterSteps(expandWorkedExampleSections(parseSections(content)))

  return (
    <div className="ace-note-workspace">
      {renderSections(sections)}
      {explorerId && <ExplorerSection explorerId={explorerId} explorerPanels={explorerPanels} subjectId={subjectId} />}
    </div>
  )
}
