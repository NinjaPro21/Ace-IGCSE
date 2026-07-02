/**
 * Split combined "## Worked examples" sections into separate ## Worked example — headers.
 * Run: node scripts/split-worked-examples.mjs [subject-dir]
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { splitExampleBlocks, formatWorkedExampleLines } from './normalize-note-content.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const subject = process.argv[2] ?? 'maths-0580'
const notesDir = path.join(__dirname, '..', 'content', 'notes', subject)

function extractWorkedExamplesBody(raw) {
  const startMatch = raw.match(/^## Worked examples?\s*\n/im)
  if (!startMatch) return null
  const startIdx = startMatch.index + startMatch[0].length
  const rest = raw.slice(startIdx)
  const nextH2 = rest.search(/^## /m)
  return nextH2 === -1 ? rest : rest.slice(0, nextH2)
}

function splitWorkedExamplesSection(body) {
  const lines = body.split('\n').map((l) => l.trim()).filter(Boolean)
  const examples = splitExampleBlocks(lines)
  if (examples.length <= 1) return null

  const parts = []
  for (const ex of examples) {
    parts.push(`## Worked example — ${ex.title}`)
    parts.push('')
    const paras = formatWorkedExampleLines(ex.lines)
    if (paras.length) {
      parts.push(paras.join('\n\n'))
      parts.push('')
    }
  }
  return parts.join('\n').trim()
}

let updated = 0
for (const file of fs.readdirSync(notesDir).filter((f) => f.endsWith('.md'))) {
  const filePath = path.join(notesDir, file)
  const raw = fs.readFileSync(filePath, 'utf8')
  const body = extractWorkedExamplesBody(raw)
  if (!body) continue

  const replacement = splitWorkedExamplesSection(body)
  if (!replacement) continue

  const startMatch = raw.match(/^## Worked examples?\s*\n/im)
  const startIdx = startMatch.index
  const rest = raw.slice(startMatch.index + startMatch[0].length)
  const nextH2 = rest.search(/^## /m)
  const endIdx = nextH2 === -1 ? raw.length : startMatch.index + startMatch[0].length + nextH2

  const after = `${raw.slice(0, startIdx)}${replacement}\n\n${raw.slice(endIdx).trimStart()}`
  if (after !== raw) {
    fs.writeFileSync(filePath, after.trim() + '\n', 'utf8')
    updated++
    console.log('split:', file)
  }
}

console.log(`Done — ${updated} files updated (${subject}).`)
