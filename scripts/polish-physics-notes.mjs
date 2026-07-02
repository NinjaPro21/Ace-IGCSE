/**
 * Polish all physics notes: fix LaTeX corruption, tables, structure, and inject SVG diagrams.
 * Run: node scripts/polish-physics-notes.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { SNIPPETS, TOPIC_DIAGRAMS } from './physics-diagram-snippets.mjs'
import { fixPhysicsMarkdown, closeUnclosedInlineMath, normalizeDisplayMath } from './physics-note-latex.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const notesDir = path.join(__dirname, '..', 'content', 'notes', 'physics')

/** Strip graph bullet blocks that were copy-pasted into the wrong subtopic. */
const STRIP_GRAPH_HEADERS = {
  '4-1-forces': [
    /^\*\*Distance[- ]Time/i, /^\*\*Velocity[- ]Time/i,
    /^-\s+\*\*Distance/i, /^-\s+\*\*Velocity/i,
    /^-\s+\*\*Rest\*\*/i, /^-\s+\*\*Constant speed/i, /^-\s+\*\*Acceleration\*\*/i,
    /^-\s+\*\*Deceleration\*\*/i, /^-\s+\*\*Interpretation\*\*.*(?:speed|acceleration|distance)/i,
    /^-\s+\*\*Constant Speed\*\*/i, /^-\s+\*\*Uniform Acceleration/i,
    /^-\s+\*\*Uniform Deceleration/i, /^-\s+\*\*Changing Acceleration/i,
  ],
  '5-3-the-principle-of-conservation-of-momentum': [/^-\s+\*\*Distance/i, /^-\s+\*\*Speed/i],
  '5-1-what-is-momentum': [/^-\s+\*\*Distance/i, /^-\s+\*\*Speed/i],
  '5-2-momentum-impulse-and-force': [/^-\s+\*\*Distance/i, /^-\s+\*\*Speed/i],
}

function sanitizeGraphBullets(slug, body) {
  const patterns = STRIP_GRAPH_HEADERS[slug]
  if (!patterns?.length) return body
  return body
    .split('\n')
    .filter((line) => !patterns.some((re) => re.test(line.trim())))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function fixWorkedExampleHeadings(raw) {
  return raw.replace(/^## (Worked example[^\n]*?)\s+(Question:)/gim, '## $1\n\n$2')
}

function fixMangledBold(text) {
  return text
    .replace(/- \*\*\*\*([^*]+)\*\*:\s*\*\*\s*/g, '- **$1**: ')
    .replace(/\*\*\*\*([^*]+)\*\*:\s*\*\*\s*/g, '**$1**\n\n')
}

function fixCorruptedNumbers(text) {
  return text
    .replace(/1²,000,000/g, '12,000,000')
    .replace(/1²,01²/g, '1200')
    .replace(/Carbon-1²/g, 'Carbon-12')
    .replace(/1²(?=\s*(N|A|m\/s|ml|Pa|kg|Hz|counts))/g, '12')
    .replace(/1²(?=[,.\s/])/g, '12')
}

function formatKeyFormulas(body) {
  let text = body.trim()
  // Split titles glued to end of previous description
  text = text.replace(/\.\s+(\*\*[^*\n]+\*\*)/g, '.\n\n$1')
  text = text.replace(/([^\n])\s+(\*\*[^*\n]+\*\*\s*\n)/g, '$1\n\n$2')
  // Normalise **Title** + inline $...$ + description (strip leading period on description)
  text = text.replace(
    /(\*\*[^*\n]+\*\*)\n\n(\$[^$\n]+\$)\n\n\.?\s*([^\n*][^\n]*)/g,
    (_, title, formula, desc) => `${title}\n\n$$${formula.slice(1, -1)}$$\n\n${desc.trim()}`,
  )
  // **Title** + inline $...$ + trailing $$ corruption
  text = text.replace(
    /(\*\*[^*\n]+\*\*)\n\n(\$[^$\n]+\$\$)\n\n\.?\s*([^\n*][^\n]*)/g,
    (_, title, formula, desc) => `${title}\n\n$$${formula.slice(1, -2)}$$\n\n${desc.trim()}`,
  )
  if (text.includes('\n\n**')) {
    const blocks = text.split(/\n\n(?=\*\*[^*\n]+\*\*)/).map((b) => {
      let block = b.trim().replace(/^\.\s+/, '')
      block = block.replace(
        /(\*\*[^*\n]+\*\*)\n\n(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g,
        (_, title, formula) => {
          if (formula.startsWith('$$')) return `${title}\n\n${formula}`
          return `${title}\n\n$$${formula.slice(1, -1)}$$`
        },
      )
      // **Title** then $formula$$Description glued
      block = block.replace(
        /(\$[^$\n]+\$)\$\$?\s*([A-Za-z][^\n]*)/g,
        (_, formula, desc) => `$$${formula.slice(1, -1)}$$\n\n${desc.trim()}`,
      )
      return block
    }).filter(Boolean)
    if (blocks.length > 1) return blocks.join('\n\n')
  }
  const matches = [...text.matchAll(/([A-Za-z][^:\n]{2,55}):\s*(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g)]
  if (matches.length <= 1) return text
  const parts = []
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i]
    const descStart = m.index + m[0].length
    const descEnd = i + 1 < matches.length ? matches[i + 1].index : text.length
    let desc = text.slice(descStart, descEnd).trim().replace(/^\.\s+/, '')
    let formula = m[2].trim()
    if (formula.startsWith('$') && !formula.startsWith('$$')) {
      formula = `$$${formula.slice(1, -1)}$$`
    }
    parts.push(`**${m[1].trim()}**\n\n${formula}\n\n${desc}`)
  }
  return parts.join('\n\n')
}

function fixMarkdownTables(text) {
  return text.replace(/(\|[^\n]*\|)\n\n+(?=\|)/g, '$1\n')
}

function splitWorkedExampleSteps(body) {
  if (!/Step\s+\d+:/i.test(body) && !/Question:.*Step\s+\d+/i.test(body)) return body
  let text = body
  text = text.replace(/\s+Step\s+(\d+)(\s*\([^)]*\))?:/gi, '\n\n$1$2. ')
  text = text.replace(/(Question:[^\n]+)\n\n(?=\d+\.)/i, '$1\n\n')
  text = text.replace(/\.\s+Step\s+(\d+):/gi, '.\n\n$1. ')
  text = text.replace(/\*\*Final answer:\*\*/gi, '\n\n**Final answer:**')
  text = text.replace(/\.\s+Solution:\s*/gi, '.\n\n**Final answer:** ')
  text = text.replace(/\s+(\d+)\s+\(([^)]+)\)\.\s+/g, '\n\n$1 ($2). ')
  text = text.replace(/\n\n### Trap\n/gi, '\n\n### Trap\n')
  text = text.replace(/\.\s+Trap:/gi, '.\n\n### Trap\n')
  return closeUnclosedInlineMath(text.trim())
}

function formatDefinitions(body) {
  const lines = body.split('\n').map((l) => l.trim()).filter(Boolean)
  const bullets = []
  for (const line of lines) {
    if (/^[-*]\s/.test(line)) {
      bullets.push(line)
      continue
    }
    const m = line.match(/^([^:]+):\s*(.+)$/)
    if (m && m[1].length < 80) {
      bullets.push(`- **${m[1].trim()}**: ${m[2].trim()}`)
    } else {
      bullets.push(line)
    }
  }
  return bullets.join('\n')
}

function fixSplitDisplayMath(text) {
  return text
    .replace(/\$\$([\s\S]*?)\$\$\s+\$([^$]+)\$/g, (_, display, result) => {
      const d = display.trim().replace(/\s+$/, '')
      let r = result.trim().replace(/^=\s*/, '')
      return `$$${d} = ${r}$$`
    })
    .replace(/\$([^$]+?)\.\s+\$/g, '$1$.')
}

function fixThousandsCommasInMath(text) {
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/)
  return parts
    .map((part) => (part.startsWith('$') ? part.replace(/(\d),(\d{3})/g, '$1$2') : part))
    .join('')
}

function splitTrapCallouts(body) {
  return body.replace(/\n*(Common Trap|Trap|Watch out):/gi, '\n\n### $1\n')
}

function formatGraphsSection(body) {
  const chunks = body.split(/(?=<div class="enlight-physics-diagram">)/)
  return chunks
    .map((chunk) => {
      const trimmed = chunk.trim()
      if (!trimmed || trimmed.startsWith('<div')) return trimmed
      const lines = trimmed.split('\n')
      const out = []
      let buf = []
      const flush = () => {
        if (!buf.length) return
        out.push(buf.join('\n'))
        buf = []
      }
      for (const raw of lines) {
        const line = raw.trim()
        if (!line) continue
        if (/^\*\*[^*\n]+\*\*$/.test(line)) {
          flush()
          out.push(line)
          continue
        }
        if (line.startsWith('- ')) {
          buf.push(line)
          continue
        }
        if (line.startsWith('**')) {
          flush()
          out.push(line)
          continue
        }
        if (/^[A-Za-z][^:\n*]{2,50}:\s*$/.test(line)) {
          flush()
          out.push(`**${line.slice(0, -1)}**`)
          continue
        }
        const m = line.match(/^([^:*]+):\s*(.+)$/)
        if (m && m[1].length < 55 && !m[1].includes('$')) {
          buf.push(`- **${m[1].trim()}**: ${m[2].trim()}`)
        } else {
          buf.push(line)
        }
      }
      flush()
      return out.join('\n\n')
    })
    .filter(Boolean)
    .join('\n\n')
}

function stripDuplicateCoreTitle(body, slug) {
  const lines = body.split('\n').map((l) => l.trim()).filter(Boolean)
  if (lines.length < 2) return body
  const first = lines[0]
  if (/^\d+\.\d+\s/.test(first)) return lines.slice(1).join('\n\n')
  if (first.length <= 55 && !/[.?!]/.test(first)) {
    const slugWords = slug.replace(/^\d+-\d+-/, '').replace(/-/g, ' ').toLowerCase()
    const firstNorm = first.toLowerCase().replace(/[^\w\s]/g, '').trim()
    if (
      slugWords.includes(firstNorm) ||
      firstNorm.split(/\s+/).every((w) => w.length > 2 && slugWords.includes(w))
    ) {
      return lines.slice(1).join('\n\n')
    }
  }
  return body
}

function diagramsForTopic(slug) {
  return (TOPIC_DIAGRAMS[slug] ?? []).map((k) => SNIPPETS[k]).filter(Boolean)
}

function injectDiagrams(sectionBody, slug) {
  const withoutDiagrams = sectionBody.replace(/<div class="enlight-physics-diagram">[\s\S]*?<\/div>/g, '').trim()
  const sanitized = sanitizeGraphBullets(slug, withoutDiagrams)
  const diagrams = diagramsForTopic(slug)
  if (!diagrams.length) {
    return sectionBody.includes('enlight-physics-diagram') ? fixSvgAttributes(sectionBody) : sanitized
  }
  const blocks = sanitized.split(/\n\n(?=\*\*[^*\n]+\*\*)/).filter(Boolean)
  if (blocks.length <= 1) {
    return `${sanitized}\n\n${diagrams.join('\n\n')}`.trim()
  }
  const parts = []
  for (let i = 0; i < blocks.length; i++) {
    parts.push(blocks[i])
    if (diagrams[i]) parts.push(diagrams[i])
  }
  for (let i = blocks.length; i < diagrams.length; i++) {
    parts.push(diagrams[i])
  }
  return parts.join('\n\n').trim()
}

function fixSvgAttributes(text) {
  return text.replace(/\bx²=/g, 'x2=').replace(/\by²=/g, 'y2=').replace(/\bx2="/g, 'x2="')
}

function polishSection(heading, body, slug) {
  const h = heading.toLowerCase()
  let text = body.trim()
  if (!text) return ''

  text = fixCorruptedNumbers(text)
  text = fixMarkdownTables(text)
  text = fixSplitDisplayMath(text)
  text = fixThousandsCommasInMath(text)

  if (h === 'core idea') {
    text = stripDuplicateCoreTitle(text, slug)
  }

  if (h === 'key definitions' || h === 'syllabus wording') {
    text = formatDefinitions(text)
  }

  if (h === 'key formulas') {
    text = formatKeyFormulas(text)
  }

  if (h.startsWith('worked example')) {
    text = splitWorkedExampleSteps(text)
    text = splitTrapCallouts(text)
  }

  if (h === 'graphs & diagrams') {
    text = formatGraphsSection(text)
    text = injectDiagrams(text, slug)
  }

  const lines = text.split('\n').map((l) => {
    const t = l.trim()
    if (!t) return l
    if (/^<\/?[a-z]/i.test(t) || t.includes('enlight-physics-diagram')) return l
    return l
  })
  return fixSvgAttributes(lines.join('\n').trim())
}

function polishNote(raw, slug) {
  let working = fixWorkedExampleHeadings(raw)
  working = working.replace(/\n## Visual diagram[\s\S]*?(?=\n## |$)/g, '')
  const hasGraphs = /^## Graphs & diagrams/m.test(working)
  const topicDiagrams = TOPIC_DIAGRAMS[slug]
  if (!hasGraphs && topicDiagrams?.length) {
    const insertBefore = working.search(/^## (Steps \/ method|Worked example|Common mistakes|Examiner tip|Quick check)/m)
    const diagrams = topicDiagrams.map((k) => SNIPPETS[k]).filter(Boolean).join('\n\n')
    const section = `## Graphs & diagrams\n\n${diagrams}`
    if (insertBefore > 0) {
      working = `${working.slice(0, insertBefore).trim()}\n\n${section}\n\n${working.slice(insertBefore).trim()}`
    } else {
      working = `${working.trim()}\n\n${section}`
    }
  }

  const chunks = working.split(/^## /m)
  if (chunks.length <= 1) return fixSvgAttributes(fixCorruptedNumbers(fixMarkdownTables(raw)))

  const sections = []
  for (let i = 1; i < chunks.length; i++) {
    const part = chunks[i]
    const nl = part.indexOf('\n')
    const heading = nl === -1 ? part.trim() : part.slice(0, nl).trim()
    const body = nl === -1 ? '' : part.slice(nl + 1)
    const polished = polishSection(heading, body, slug)
    sections.push(`## ${heading}${polished ? `\n\n${polished}` : ''}`)
  }
  return normalizeDisplayMath(fixPhysicsMarkdown(fixMangledBold(fixSvgAttributes(fixCorruptedNumbers(fixMarkdownTables(sections.join('\n\n').trim())))))) + '\n'
}

const files = fs.readdirSync(notesDir).filter((f) => f.endsWith('.md'))
let updated = 0

for (const file of files) {
  const slug = file.replace(/\.md$/, '')
  const filePath = path.join(notesDir, file)
  const before = fs.readFileSync(filePath, 'utf8')
  const after = polishNote(before, slug)
  if (after !== before) {
    fs.writeFileSync(filePath, after, 'utf8')
    updated++
    console.log('polished:', file)
  }
}

console.log(`Done — ${updated}/${files.length} physics note files polished.`)
