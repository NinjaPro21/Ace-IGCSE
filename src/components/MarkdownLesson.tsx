import { lazy, Suspense } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import type { TopicMeta } from '@/lib/contentTypes'

// Lazy-load explorers so they don't block the lesson page
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

// ─── HTML entity decoder ─────────────────────────────────────────────────────
// Notes are authored/converted with HTML-encoded characters. KaTeX / remark-math
// cannot parse &gt; inside $...$ so we must decode before passing to ReactMarkdown.
function decodeHTMLEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
}

// ─── Section parser ──────────────────────────────────────────────────────────
type SectionKind =
  | 'core'
  | 'formulas'
  | 'steps'
  | 'examiner-tip'
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
  'key formulas': 'formulas',
  'steps / method': 'steps',
  'examiner tip': 'examiner-tip',
  'quick check': 'quick-check',
  'visual / interactive intent': 'visual',
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
    } else {
      if (current) {
        current.body += line + '\n'
      }
    }
  }
  if (current) sections.push(current)
  return sections
}

// ─── Markdown renderer (shared config) ──────────────────────────────────────
const MD_PLUGINS = {
  remark: [remarkMath],
  rehype: [rehypeKatex],
}

function Md({ children }: { children: string }) {
  const decoded = decodeHTMLEntities(children)
  return (
    <ReactMarkdown remarkPlugins={MD_PLUGINS.remark} rehypePlugins={MD_PLUGINS.rehype}>
      {decoded}
    </ReactMarkdown>
  )
}

// ─── Step-list parser: splits body by paragraphs into steps ─────────────────
function parseSteps(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean)
}

// ─── Section renderers ───────────────────────────────────────────────────────
function CoreSection({ section }: { section: NoteSection }) {
  return (
    <div className="enlight-note-section">
      <h2 className="enlight-note-section-heading">{section.heading}</h2>
      <div className="enlight-markdown">
        <Md>{section.body}</Md>
      </div>
    </div>
  )
}

function FormulasSection({ section }: { section: NoteSection }) {
  return (
    <div className="enlight-note-section">
      <h2 className="enlight-note-section-heading">{section.heading}</h2>
      <div
        className="enlight-formula-box"
        style={{ textAlign: 'left', fontFamily: 'inherit', fontSize: '0.95rem' }}
      >
        <div className="enlight-markdown">
          <Md>{section.body}</Md>
        </div>
      </div>
    </div>
  )
}

function StepsSection({ section }: { section: NoteSection }) {
  const steps = parseSteps(section.body)
  return (
    <div className="enlight-note-section">
      <h2 className="enlight-note-section-heading">{section.heading}</h2>
      <ol className="enlight-method-steps">
        {steps.map((step, i) => (
          <li key={i} className="enlight-method-step">
            <span className="enlight-method-step__num">{i + 1}</span>
            <div className="enlight-method-step__text enlight-markdown">
              <Md>{step}</Md>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function ExaminerTipSection({ section }: { section: NoteSection }) {
  return (
    <div className="enlight-callout enlight-callout--amber">
      <div className="enlight-callout__header">
        <span className="enlight-callout__icon">⚡</span>
        <span className="enlight-callout__label">{section.heading}</span>
      </div>
      <div className="enlight-callout__body enlight-markdown">
        <Md>{section.body}</Md>
      </div>
    </div>
  )
}

function QuickCheckSection({ section }: { section: NoteSection }) {
  return (
    <div className="enlight-callout enlight-callout--blue">
      <div className="enlight-callout__header">
        <span className="enlight-callout__icon">✓</span>
        <span className="enlight-callout__label">{section.heading}</span>
      </div>
      <div className="enlight-callout__body enlight-markdown">
        <Md>{section.body}</Md>
      </div>
    </div>
  )
}

function GenericSection({ section }: { section: NoteSection }) {
  return (
    <div className="enlight-note-section">
      <h2 className="enlight-note-section-heading">{section.heading}</h2>
      <div className="enlight-markdown">
        <Md>{section.body}</Md>
      </div>
    </div>
  )
}

// ─── Explorer dispatcher ─────────────────────────────────────────────────────
function ExplorerSandbox({
  explorerId,
}: {
  explorerId: TopicMeta['explorerId']
}) {
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
  // Unknown or undefined explorerId — show a tasteful placeholder
  return (
    <div className="enlight-sandbox-coming-soon">
      <span style={{ fontSize: '1.5rem' }}>🔬</span>
      <span>Interactive sandbox coming soon for this topic.</span>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────
interface MarkdownLessonProps {
  content: string
  explorerId?: TopicMeta['explorerId']
}

export function MarkdownLesson({ content, explorerId }: MarkdownLessonProps) {
  const sections = parseSections(content)
  const hasVisual = sections.some((s) => s.kind === 'visual')

  return (
    <div className="enlight-markdown">
      {sections.map((section, i) => {
        switch (section.kind) {
          case 'visual':
            // Strip the raw description — render the live component instead
            return null
          case 'core':
            return <CoreSection key={i} section={section} />
          case 'formulas':
            return <FormulasSection key={i} section={section} />
          case 'steps':
            return <StepsSection key={i} section={section} />
          case 'examiner-tip':
            return <ExaminerTipSection key={i} section={section} />
          case 'quick-check':
            return <QuickCheckSection key={i} section={section} />
          default:
            return <GenericSection key={i} section={section} />
        }
      })}

      {/* Render interactive explorer in place of the visual/interactive-intent section */}
      {hasVisual && <ExplorerSandbox explorerId={explorerId} />}
    </div>
  )
}
