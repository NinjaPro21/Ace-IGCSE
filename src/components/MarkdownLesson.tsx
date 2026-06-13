import { lazy, Suspense, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import type { TopicMeta } from '@/lib/contentTypes'
import {
  calloutVariant,
  normalizeMathMarkdown,
  parseContentCards,
  parseStepsWithCallouts,
  parseWorkedExampleSteps,
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
const QuadraticGraphExplorer = lazy(() =>
  import('@/features/explorers/QuadraticGraphExplorer').then((m) => ({ default: m.QuadraticGraphExplorer })),
)
const LogGraphExplorer = lazy(() =>
  import('@/features/explorers/LogGraphExplorer').then((m) => ({ default: m.LogGraphExplorer })),
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

function WorkedExamplePanel({ body, heading = 'Worked example' }: { body: string; heading?: string }) {
  const exampleSteps = parseWorkedExampleSteps(body)

  return (
    <div className="enlight-concept-module__example-panel">
      <div className="enlight-concept-module__example-heading">{heading}</div>
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
        <Md className="enlight-markdown">{body}</Md>
      )}
    </div>
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
  if (cards.length >= 3) {
    return <DecisionGridSection section={{ ...section, kind: 'methods' }} />
  }
  if (cards.length >= 1) {
    return (
      <WorkspaceCard>
        <WorkspaceLabel>{section.heading}</WorkspaceLabel>
        <div className="enlight-formula-strip">
          {cards.map((card, i) => (
            <div key={i} className="enlight-formula-strip__item">
              <Md className="enlight-markdown">{card}</Md>
            </div>
          ))}
        </div>
      </WorkspaceCard>
    )
  }
  return null
}

function MethodWorkspaceCard({
  stepsSection,
  exampleSection,
}: {
  stepsSection: NoteSection
  exampleSection?: NoteSection
}) {
  const { steps, callouts } = parseStepsWithCallouts(stepsSection.body)
  const label = stepsSection.heading.replace(/^method\s+\d+\s*[—–-]\s*/i, '').trim()
  const methodNum = stepsSection.heading.match(/^method\s+(\d+)/i)?.[1]
  const wsLabel = methodNum
    ? `Method ${methodNum} — ${label}`
    : stepsSection.heading

  return (
    <WorkspaceCard>
      <WorkspaceLabel>{wsLabel}</WorkspaceLabel>
      <div className={exampleSection ? 'enlight-concept-module' : 'enlight-concept-module enlight-concept-module--solo'}>
        <div className="enlight-concept-module__steps">
          <StepList steps={steps} />
          {callouts.map((c, i) => (
            <InlineCalloutBox key={i} label={c.label} body={c.body} />
          ))}
        </div>
        {exampleSection && <WorkedExamplePanel body={exampleSection.body} />}
      </div>
    </WorkspaceCard>
  )
}

function WorkedExampleSection({ section }: { section: NoteSection }) {
  return (
    <WorkspaceCard>
      <WorkspaceLabel>{section.heading}</WorkspaceLabel>
      <WorkedExamplePanel body={section.body} heading="" />
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
  quadratic: 'Quadratic Graph Explorer',
  log: 'Logarithm Graph Explorer',
}

function ExplorerContent({ explorerId }: { explorerId: TopicMeta['explorerId'] }) {
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
    case 'quadratic':
      return <Suspense fallback={fallback}><QuadraticGraphExplorer /></Suspense>
    case 'log':
      return <Suspense fallback={fallback}><LogGraphExplorer /></Suspense>
    default:
      return (
        <div className="enlight-sandbox-coming-soon">
          <span style={{ fontSize: '1.5rem' }}>🔬</span>
          <span>Interactive sandbox coming soon for this topic.</span>
        </div>
      )
  }
}

function ExplorerSection({ explorerId }: { explorerId: NonNullable<TopicMeta['explorerId']> }) {
  return (
    <WorkspaceCard className="enlight-ws-card--explorer">
      <WorkspaceLabel>Interactive · {EXPLORER_LABELS[explorerId]}</WorkspaceLabel>
      <div className="enlight-explorer-card__body">
        <ExplorerContent explorerId={explorerId} />
      </div>
    </WorkspaceCard>
  )
}

function renderSections(sections: NoteSection[]): ReactNode[] {
  const elements: ReactNode[] = []
  let idx = 0

  while (idx < sections.length) {
    const section = sections[idx]
    const next = sections[idx + 1]

    const isStepsLike =
      section.kind === 'steps' || section.kind === 'method-block'

    if (isStepsLike && next?.kind === 'worked-example') {
      elements.push(
        <MethodWorkspaceCard key={idx} stepsSection={section} exampleSection={next} />,
      )
      idx += 2
      continue
    }

    if (isStepsLike) {
      elements.push(<MethodWorkspaceCard key={idx} stepsSection={section} />)
      idx++
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
      case 'worked-example':
        elements.push(<WorkedExampleSection key={idx} section={section} />)
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
}

export function MarkdownLesson({ content, explorerId }: MarkdownLessonProps) {
  const sections = parseSections(content)
  const visibleSections = sections.filter((s) => s.kind !== 'visual')

  return (
    <div className="enlight-note-workspace">
      {renderSections(visibleSections)}
      {explorerId && <ExplorerSection explorerId={explorerId} />}
    </div>
  )
}
