/**
 * Fix physics notes broken by docx import: inline section titles, wrong order, bare tables.
 * Run: node scripts/fix-physics-import-structure.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { fixPhysicsMarkdown, normalizeDisplayMath } from './physics-note-latex.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const notesDir = path.join(__dirname, '..', 'content', 'notes', 'physics')

const SECTION_ORDER = [
  'core idea',
  'key definitions',
  'syllabus wording',
  'key formulas',
  'graphs & diagrams',
  'steps / method',
  'common mistakes',
  'examiner tip',
  'quick check',
]

const WORKED_EXAMPLE_RE = /^worked example(?:\s+\d+)?\s*[—–-]/i

/** Lines that should become ## sections (exact or prefix). */
function promoteLineToHeading(line) {
  const t = line.trim()
  if (!t || t.startsWith('#') || t.startsWith('-') || t.startsWith('<')) return null

  if (/^quick check$/i.test(t)) return 'Quick check'
  if (/^key definitions$/i.test(t)) return 'Key definitions'
  if (/^key formulas$/i.test(t)) return 'Key formulas'
  if (/^graphs & diagrams$/i.test(t)) return 'Graphs & diagrams'
  if (/^steps \/ method$/i.test(t)) return 'Steps / method'
  if (/^examiner tip$/i.test(t)) return 'Examiner tip'
  if (/^common mistakes$/i.test(t)) return 'Common mistakes'
  if (/^syllabus wording$/i.test(t)) return 'Syllabus wording'
  if (WORKED_EXAMPLE_RE.test(t)) return t.replace(/^worked example(?:\s+\d+)?\s*/i, 'Worked example — ').trim()

  const m = t.match(/^Worked Example — (.+)$/i)
  if (m) return `Worked example — ${m[1].trim()}`

  return null
}

/** Sub-headings often left inside Core idea — promote to Key definitions blocks. */
const SUBSECTION_TITLES = new Set(
  [
    'Production and Propagation',
    'Compressions and Rarefactions',
    'Range of Audibility',
    'The Bell Jar Experiment',
    'Speed of Sound in Different Media',
    'Measuring the Speed of Sound in Air',
    'Electromotive Force (e.m.f.)',
    'Potential Difference (p.d.)',
    'Key Differences',
    'Measuring e.m.f. and p.d.',
    'Properties of Magnets',
    'Induced Magnetism',
    'Magnetic Domains',
    'Properties of Magnets',
    'Echoes',
    'Ultrasound and Its Applications',
    'Quality Control and Testing',
    'Medical Scanning (Prenatal)',
    'Sonar and Navigation',
    'Key formula for Echo/Sonar Calculations',
  ].map((s) => s.toLowerCase()),
)

function isSubsectionTitle(line) {
  const t = line.trim()
  if (!t || t.length > 80 || /[.?!]$/.test(t)) return false
  if (t.startsWith('-') || t.startsWith('$') || t.startsWith('<')) return false
  return SUBSECTION_TITLES.has(t.toLowerCase())
}

function fixSpeedTable(body) {
  const lines = body.split('\n')
  const out = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i].trim()
    if (line === 'Medium' && lines[i + 1]?.trim() === 'Approximate Speed (m/s)') {
      out.push('| Medium | Approximate speed (m/s) |')
      out.push('| --- | --- |')
      i += 2
      while (i < lines.length) {
        const medium = lines[i]?.trim()
        const speed = lines[i + 1]?.trim()
        if (!medium || !speed || medium.startsWith('##') || promoteLineToHeading(medium)) break
        if (/^(Measuring|Worked|Quick|Note:|Setup:|Procedure:)/i.test(medium)) break
        out.push(`| ${medium} | ${speed} |`)
        i += 2
      }
      out.push('')
      continue
    }
    out.push(lines[i])
    i++
  }
  return out.join('\n')
}

function splitIntoSections(raw) {
  const lines = raw.split('\n')
  const sections = []
  let current = { heading: 'Core idea', body: [] }

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current.body.length || current.heading) {
        sections.push({ heading: current.heading, body: current.body.join('\n').trim() })
      }
      current = { heading: line.slice(3).trim(), body: [] }
      continue
    }

    const promoted = promoteLineToHeading(line)
    if (promoted) {
      if (current.body.length || sections.length === 0) {
        sections.push({ heading: current.heading, body: current.body.join('\n').trim() })
      } else if (current.body.length) {
        sections.push({ heading: current.heading, body: current.body.join('\n').trim() })
      }
      current = { heading: promoted, body: [] }
      continue
    }

    current.body.push(line)
  }

  if (current.body.length || current.heading) {
    sections.push({ heading: current.heading, body: current.body.join('\n').trim() })
  }

  return sections.filter((s) => s.heading || s.body)
}

function formatSubsectionsAsBullets(body) {
  const lines = body.split('\n')
  const out = []
  let buf = []

  const flush = () => {
    if (buf.length) {
      out.push(buf.join('\n'))
      buf = []
    }
  }

  for (const line of lines) {
    if (isSubsectionTitle(line)) {
      flush()
      out.push(`**${line.trim()}**`)
      continue
    }
    buf.push(line)
  }
  flush()
  return out.join('\n\n').trim()
}

function mergeDuplicateHeadings(sections) {
  const merged = []
  for (const sec of sections) {
    const key = sec.heading.toLowerCase()
    const prev = merged.find((s) => s.heading.toLowerCase() === key)
    if (prev && ['key definitions', 'core idea'].includes(key)) {
      prev.body = [prev.body, sec.body].filter(Boolean).join('\n\n').trim()
    } else {
      merged.push({ ...sec })
    }
  }
  return merged
}

function reorderSections(sections) {
  const rank = (h) => {
    const lower = h.toLowerCase()
    if (WORKED_EXAMPLE_RE.test(lower)) return 6.5
    const idx = SECTION_ORDER.indexOf(lower)
    return idx === -1 ? 6 : idx
  }
  return [...sections].sort((a, b) => rank(a.heading) - rank(b.heading))
}

function polishSectionBody(heading, body) {
  let text = body.trim()
  if (!text) return ''

  const h = heading.toLowerCase()
  if (h === 'core idea' || h === 'key definitions') {
    text = formatSubsectionsAsBullets(text)
    text = fixSpeedTable(text)
  }

  if (h === 'key definitions') {
    text = text
      .split('\n')
      .map((line) => {
        const t = line.trim()
        if (!t || t.startsWith('-') || t.startsWith('**') || t.startsWith('<')) return line
        const m = t.match(/^([^:]+):\s*(.+)$/)
        if (m && m[1].length < 70) return `- **${m[1].trim()}**: ${m[2].trim()}`
        return line
      })
      .join('\n')
  }

  text = text.replace(/\*\* ### Trap/g, '### Trap')
  text = text.replace(/\n{3,}/g, '\n\n')

  return fixPhysicsMarkdown(normalizeDisplayMath(text))
}

function fixNote(raw) {
  const sections = mergeDuplicateHeadings(splitIntoSections(raw))
  const reordered = reorderSections(sections)

  return (
    reordered
      .map(({ heading, body }) => {
        const polished = polishSectionBody(heading, body)
        return `## ${heading}${polished ? `\n\n${polished}` : ''}`
      })
      .join('\n\n')
      .trim() + '\n'
  )
}

let updated = 0
for (const file of fs.readdirSync(notesDir).filter((f) => f.endsWith('.md'))) {
  const filePath = path.join(notesDir, file)
  const before = fs.readFileSync(filePath, 'utf8')
  const after = fixNote(before)
  if (after !== before) {
    fs.writeFileSync(filePath, after, 'utf8')
    updated++
    console.log('fixed:', file)
  }
}

console.log(`Done — ${updated} physics notes restructured.`)
