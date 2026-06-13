import { lazy, Suspense } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import type { TopicMeta } from '@/lib/contentTypes'
import {
  normalizeMathMarkdown,
  parseContentCards,
  parseWorkedExampleSteps,
} from '@/lib/mathMarkdown'

const DiscriminantExplorer = lazy(() =>
  import('@/features/explorers/DiscriminantExplorer').then((m) => ({
    default: m.DiscriminantExplorer,
  })),
)
const ModulusExplorer = lazy(() =>
  import('@/features/explorers/ModulusExplorer').then((m) => ({
    default: m.ModulusExplorer,
  })),
)
const LineIntersectionExplorer = lazy(() =>
  import('@/features/explorers/LineIntersectionExplorer').then((m) => ({
    default: m.LineIntersectionExplorer,
  })),
)

type SectionKind =
  | 'core'
  | 'methods'
  | 'steps'
  | 'worked-example'
  | 'examiner-tip'
  | 'key-rule'
  | 'quick-check'
  | 'visual'
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
  'steps / method': 'steps',
  'worked example': 'worked-example',
  'examiner tip': 'examiner-tip',
  'key rule': 'key-rule',
  'quick check': 'quick-check',
  'visual / interactive intent': 'visual',
}

const METHOD_CARD_ACCENTS = ['violet', 'emerald', 'amber'] as const

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
      const kind = HEADING_MAP[heading.toLowerCase()] ?? 'generic'
      current = { kind, heading, body: '' }
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

function parseSteps(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function CoreSection({ section }: { section: NoteSection }) {
  return (
    <section className="enlight-core-idea">
      <h2 className="enlight-core-idea__heading">{section.heading}</h2>
      <div className="enlight-core-idea__separator" aria-hidden />
      <Md className="enlight-markdown enlight-note-prose">{section.body}</Md>
    </section>
  )
}

function MethodsSection({ section }: { section: NoteSection }) {
  const cards = parseContentCards(section.body)
  return (
    <section className="enlight-note-section">
      <h2 className="enlight-note-section-heading">{section.heading}</h2>
      <div className="enlight-method-cards">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`enlight-method-card enlight-method-card--${METHOD_CARD_ACCENTS[i % METHOD_CARD_ACCENTS.length]}`}
          >
            <Md className="enlight-markdown enlight-method-card__body">{card}</Md>
          </div>
        ))}
      </div>
    </section>
  )
}

function StepsSection({ section }: { section: NoteSection }) {
  const steps = parseSteps(section.body)
  return (
    <section className="enlight-note-section">
      <h2 className="enlight-note-section-heading">{section.heading}</h2>
      <ol className="enlight-method-steps">
        {steps.map((step, i) => (
          <li key={i} className="enlight-method-step">
            <span className="enlight-method-step__num" aria-hidden>
              {i + 1}
            </span>
            <Md className="enlight-method-step__text">{step}</Md>
          </li>
        ))}
      </ol>
    </section>
  )
}

function WorkedExampleSection({ section }: { section: NoteSection }) {
  const steps = parseWorkedExampleSteps(section.body)
  return (
    <aside className="enlight-worked-example">
      <h2 className="enlight-worked-example__heading">{section.heading}</h2>
      {steps.length > 1 ? (
        <ol className="enlight-worked-example__steps">
          {steps.map((step, i) => (
            <li key={i} className="enlight-worked-example__step">
              <Md className="enlight-markdown">{step}</Md>
            </li>
          ))}
        </ol>
      ) : (
        <Md className="enlight-markdown">{section.body}</Md>
      )}
    </aside>
  )
}

function WarningCalloutSection({ section }: { section: NoteSection }) {
  return (
    <div className="enlight-callout enlight-callout--warning">
      <div className="enlight-callout__header">
        <span className="enlight-callout__icon" aria-hidden>
          ⚠
        </span>
        <span className="enlight-callout__label">{section.heading}</span>
      </div>
      <Md className="enlight-callout__body">{section.body}</Md>
    </div>
  )
}

function QuickCheckSection({ section }: { section: NoteSection }) {
  return (
    <div className="enlight-callout enlight-callout--blue">
      <div className="enlight-callout__header">
        <span className="enlight-callout__icon" aria-hidden>
          ✓
        </span>
        <span className="enlight-callout__label">{section.heading}</span>
      </div>
      <Md className="enlight-callout__body">{section.body}</Md>
    </div>
  )
}

function GenericSection({ section }: { section: NoteSection }) {
  return (
    <section className="enlight-note-section">
      <h2 className="enlight-note-section-heading">{section.heading}</h2>
      <Md className="enlight-note-prose">{section.body}</Md>
    </section>
  )
}

function ExplorerSandbox({ explorerId }: { explorerId: TopicMeta['explorerId'] }) {
  if (explorerId === 'discriminant') {
    return (
      <Suspense fallback={<div className="enlight-sandbox-coming-soon">Loading explorer…</div>}>
        <DiscriminantExplorer />
      </Suspense>
    )
  }
  if (explorerId === 'modulus') {
    return (
      <Suspense fallback={<div className="enlight-sandbox-coming-soon">Loading explorer…</div>}>
        <ModulusExplorer />
      </Suspense>
    )
  }
  if (explorerId === 'line-intersection') {
    return (
      <Suspense fallback={<div className="enlight-sandbox-coming-soon">Loading explorer…</div>}>
        <LineIntersectionExplorer />
      </Suspense>
    )
  }
  return (
    <div className="enlight-sandbox-coming-soon">
      <span style={{ fontSize: '1.5rem' }}>🔬</span>
      <span>Interactive sandbox coming soon for this topic.</span>
    </div>
  )
}

interface MarkdownLessonProps {
  content: string
  explorerId?: TopicMeta['explorerId']
}

export function MarkdownLesson({ content, explorerId }: MarkdownLessonProps) {
  const sections = parseSections(content)
  const hasVisual = sections.some((s) => s.kind === 'visual')

  return (
    <div className="enlight-note-viewer">
      {sections.map((section, i) => {
        switch (section.kind) {
          case 'visual':
            return null
          case 'core':
            return <CoreSection key={i} section={section} />
          case 'methods':
            return <MethodsSection key={i} section={section} />
          case 'steps':
            return <StepsSection key={i} section={section} />
          case 'worked-example':
            return <WorkedExampleSection key={i} section={section} />
          case 'examiner-tip':
          case 'key-rule':
            return <WarningCalloutSection key={i} section={section} />
          case 'quick-check':
            return <QuickCheckSection key={i} section={section} />
          default:
            return <GenericSection key={i} section={section} />
        }
      })}

      {hasVisual && <ExplorerSandbox explorerId={explorerId} />}
    </div>
  )
}
