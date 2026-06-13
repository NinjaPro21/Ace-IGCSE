import { lazy, Suspense, useState, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import type { TopicMeta, GuidePanel, DiffGuidePanel, VectorGuidePanel, IntegrationGuidePanel, KinematicsGuidePanel } from '@/lib/contentTypes'
import {
  calloutVariant,
  normalizeMathMarkdown,
  parseContentCards,
  parseStepsWithCallouts,
  parseWorkedExampleSteps,
  workedExampleTitle,
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

type SectionKind =
  | 'core'
  | 'methods'
  | 'decision-grid'
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
  'key formulas': 'methods',
  'key methods': 'methods',
  'key methods / types': 'methods',
  'which method do i use?': 'decision-grid',
  'mapping types': 'decision-grid',
  'steps / method': 'steps',
  'worked example': 'worked-example',
  'examiner tip': 'examiner-tip',
  'key rule': 'key-rule',
  'quick check': 'quick-check',
  'visual / interactive intent': 'visual',
}

const METHOD_CARD_ACCENTS = ['violet', 'emerald', 'amber'] as const
const SHORT_PHASE = ['Sub', 'Rearr', 'Formula', 'Solve', 'Check'] as const

function resolveSectionKind(heading: string): SectionKind {
  const lower = heading.toLowerCase()
  if (/^worked examples?(\s|$)/i.test(heading)) return 'worked-example'
  if (HEADING_MAP[lower]) return HEADING_MAP[lower]
  if (/^method\s+\d+/i.test(heading)) return 'method-block'
  return 'generic'
}

function getPhaseLabel(index: number, total: number): string {
  if (index === 0) return 'Problem'
  if (index === total - 1) return 'Result'
  return SHORT_PHASE[(index - 1) % SHORT_PHASE.length]
}

function boldFirstVerb(text: string): string {
  return text.replace(/^(\*\*)?([A-Z][a-zéèêàùûôîâ]+)(\*\*)?(\s)/, '**$2**$4')
}

const MD_PLUGINS = {
  remark: [remarkMath],
  rehype: [rehypeKatex],
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
  const prepared = normalizeMathMarkdown(children)
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
}: {
  children: ReactNode
  className?: string
}) {
  return <section className={`enlight-ws-card ${className}`.trim()}>{children}</section>
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
          <Md className="enlight-method-step__text">{boldFirstVerb(step)}</Md>
        </li>
      ))}
    </ol>
  )
}

function WorkedExamplePanel({
  body,
  heading = 'Worked example',
}: {
  body: string
  heading?: string
}) {
  const exampleSteps = parseWorkedExampleSteps(body)
  const showHeading = heading.length > 0

  return (
    <div className="enlight-example-block">
      {showHeading && (
        <div className="enlight-concept-module__example-heading">{heading}</div>
      )}
      {exampleSteps.length > 1 ? (
        <div className="enlight-we-phase-rows">
          {exampleSteps.map((step, i) => {
            const label = getPhaseLabel(i, exampleSteps.length)
            const isResult = i === exampleSteps.length - 1
            if (isResult) {
              return (
                <div key={i} className="enlight-we-result-banner">
                  <div className="enlight-we-result-label">Result</div>
                  <Md className="enlight-markdown enlight-we-phase-content">{step}</Md>
                </div>
              )
            }
            return (
              <div key={i} className="enlight-we-phase-row">
                <span className="enlight-we-pill">{label}</span>
                <Md className="enlight-markdown enlight-we-phase-content">{step}</Md>
              </div>
            )
          })}
        </div>
      ) : (
        <Md className="enlight-markdown enlight-example-block__body">{body}</Md>
      )}
    </div>
  )
}

function ExamplesPanel({ examples }: { examples: NoteSection[] }) {
  return (
    <div className="enlight-examples-panel" aria-label="Worked examples">
      <div className="enlight-examples-panel__stack">
        {examples.map((ex, i) => (
          <WorkedExamplePanel
            key={i}
            heading={workedExampleTitle(ex.heading)}
            body={ex.body}
          />
        ))}
      </div>
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
      <WorkspaceLabel>{wsLabel}</WorkspaceLabel>
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

function MethodsSection({ section }: { section: NoteSection }) {
  const cards = parseContentCards(section.body)
  const isKeyFormulas = section.heading.toLowerCase() === 'key formulas'

  // Decision grid is for taxonomy cards (mapping types etc.), not formula lists
  if (cards.length >= 3 && !isKeyFormulas) {
    return <DecisionGridSection section={{ ...section, kind: 'methods' }} />
  }

  if (cards.length >= 1) {
    return (
      <WorkspaceCard>
        <WorkspaceLabel>{section.heading}</WorkspaceLabel>
        <div className={isKeyFormulas ? 'enlight-formula-stack' : 'enlight-formula-strip'}>
          {cards.map((card, i) => (
            <div
              key={i}
              className={isKeyFormulas ? 'enlight-formula-stack__item' : 'enlight-formula-strip__item'}
            >
              <Md className="enlight-markdown">{card}</Md>
            </div>
          ))}
        </div>
      </WorkspaceCard>
    )
  }
  return null
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
  return (
    <WorkspaceCard className="enlight-ws-card--tabbed">
      <WorkspaceLabel>Worked examples</WorkspaceLabel>
      <ExamplesPanel examples={examples} />
    </WorkspaceCard>
  )
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
])

function ExplorerContent({
  explorerId,
  explorerPanels,
}: {
  explorerId: TopicMeta['explorerId']
  explorerPanels?: GuidePanel[]
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
      return <Suspense fallback={fallback}><ModulusExplorer /></Suspense>
    case 'line-intersection':
      return <Suspense fallback={fallback}><LineIntersectionExplorer /></Suspense>
    case 'trig':
      return <Suspense fallback={fallback}><TrigGraphExplorer /></Suspense>
    case 'cast':
      return <Suspense fallback={fallback}><CastDiagramExplorer /></Suspense>
    case 'quadratic':
      return <Suspense fallback={fallback}><QuadraticGraphExplorer /></Suspense>
    case 'log':
      return <Suspense fallback={fallback}><LogGraphExplorer /></Suspense>
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
      return <Suspense fallback={fallback}><SeriesVisualGuide /></Suspense>
    case 'functions-guide':
      return <Suspense fallback={fallback}><FunctionsVisualGuide /></Suspense>
    case 'differentiation-guide':
      return <Suspense fallback={fallback}><DifferentiationVisualGuide panels={explorerPanels as DiffGuidePanel[] | undefined} /></Suspense>
    case 'vectors-guide':
      return <Suspense fallback={fallback}><VectorsVisualGuide panels={explorerPanels as VectorGuidePanel[] | undefined} /></Suspense>
    case 'integration-guide':
      return <Suspense fallback={fallback}><IntegrationVisualGuide panels={explorerPanels as IntegrationGuidePanel[] | undefined} /></Suspense>
    case 'kinematics-guide':
      return <Suspense fallback={fallback}><KinematicsVisualGuide panels={explorerPanels as KinematicsGuidePanel[] | undefined} /></Suspense>
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
}: {
  explorerId: NonNullable<TopicMeta['explorerId']>
  explorerPanels?: GuidePanel[]
}) {
  const prefix = VISUAL_GUIDE_IDS.has(explorerId) ? 'Visual guide' : 'Interactive'
  return (
    <WorkspaceCard className="enlight-ws-card--explorer">
      <WorkspaceLabel>{`${prefix} · ${EXPLORER_LABELS[explorerId]}`}</WorkspaceLabel>
      <div className="enlight-explorer-card__body">
        <ExplorerContent explorerId={explorerId} explorerPanels={explorerPanels} />
      </div>
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
      case 'examiner-tip':
      case 'key-rule':
        elements.push(<WarningCalloutSection key={idx} section={section} />)
        break
      case 'quick-check':
        elements.push(<QuickCheckSection key={idx} section={section} />)
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
}

export function MarkdownLesson({ content, explorerId, explorerPanels }: MarkdownLessonProps) {
  const sections = parseSections(content)
  const visibleSections = sections.filter((s) => s.kind !== 'visual')

  return (
    <div className="enlight-note-workspace">
      {renderSections(visibleSections)}
      {explorerId && <ExplorerSection explorerId={explorerId} explorerPanels={explorerPanels} />}
    </div>
  )
}
