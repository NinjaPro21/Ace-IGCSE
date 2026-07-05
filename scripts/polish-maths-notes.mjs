/**
 * Inject ## Graphs & diagrams into maths-0580 notes where inline visuals help.
 * Run: node scripts/polish-maths-notes.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'
import { SNIPPETS, TOPIC_DIAGRAMS } from './maths-diagram-snippets.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const notesDir = path.join(__dirname, '..', 'content', 'notes', 'maths-0580')

function diagramsForTopic(slug) {
  return (TOPIC_DIAGRAMS[slug] ?? []).map((k) => SNIPPETS[k]).filter(Boolean)
}

function injectDiagrams(sectionBody, slug) {
  const diagrams = diagramsForTopic(slug)
  if (!diagrams.length) return sectionBody

  const withoutDiagrams = sectionBody.replace(/<div class="enlight-physics-diagram">[\s\S]*?<\/div>/g, '').trim()
  const blocks = withoutDiagrams.split(/\n\n(?=\*\*[^*\n]+\*\*)/).filter(Boolean)
  if (blocks.length <= 1) {
    return diagrams.join('\n\n').trim()
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

function polishNote(raw, slug) {
  let working = raw.replace(/\n## Visual diagram[\s\S]*?(?=\n## |$)/g, '')
  const topicDiagrams = TOPIC_DIAGRAMS[slug]
  const hasGraphs = /^## Graphs & diagrams/m.test(working)

  if (!hasGraphs && topicDiagrams?.length) {
    const insertBefore = working.search(
      /^## (Steps \/ method|Worked example|Common mistakes|Examiner tip|Quick check)/m,
    )
    const diagrams = topicDiagrams.map((k) => SNIPPETS[k]).filter(Boolean).join('\n\n')
    const section = `## Graphs & diagrams\n\n${diagrams}`
    if (insertBefore > 0) {
      working = `${working.slice(0, insertBefore).trim()}\n\n${section}\n\n${working.slice(insertBefore).trim()}`
    } else {
      working = `${working.trim()}\n\n${section}`
    }
  }

  const chunks = working.split(/^## /m)
  if (chunks.length <= 1) return working

  const sections = []
  for (let i = 1; i < chunks.length; i++) {
    const part = chunks[i]
    const nl = part.indexOf('\n')
    const heading = nl === -1 ? part.trim() : part.slice(0, nl).trim()
    let body = nl === -1 ? '' : part.slice(nl + 1).trim()

    if (heading.toLowerCase() === 'graphs & diagrams') {
      body = injectDiagrams(body, slug)
    }

    sections.push(`## ${heading}${body ? `\n\n${body}` : ''}`)
  }

  return `${sections.join('\n\n').trim()}\n`
}

const files = fs.readdirSync(notesDir).filter((f) => f.endsWith('.md'))
let updated = 0

for (const file of files) {
  const slug = file.replace(/\.md$/, '')
  if (!TOPIC_DIAGRAMS[slug]) continue
  const filePath = path.join(notesDir, file)
  const before = fs.readFileSync(filePath, 'utf8')
  const after = polishNote(before, slug)
  if (after !== before) {
    fs.writeFileSync(filePath, after, 'utf8')
    updated++
    console.log('polished:', file)
  }
}

console.log(`Done — ${updated} maths-0580 note files updated with diagrams.`)
