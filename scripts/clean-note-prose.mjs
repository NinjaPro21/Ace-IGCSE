/**
 * Clean duplicated worked-example content and shorten wordy Steps / method blocks.
 * Run: node scripts/clean-note-prose.mjs [maths-0580|add-maths-0606|all]
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const arg = process.argv[2] ?? 'all'
const subjects =
  arg === 'all' ? ['maths-0580', 'add-maths-0606'] : [arg]

function normKey(text) {
  return text.replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 100)
}

function dedupeParagraphs(text) {
  const paras = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
  const out = []
  const seen = new Set()

  for (const p of paras) {
    const key = normKey(p)
    if (!key || seen.has(key)) continue
    // Skip if nearly identical to previous (shorter duplicate of prior)
    if (out.length) {
      const prev = out[out.length - 1]
      if (prev.includes(p) || p.includes(prev)) {
        if (p.length <= prev.length) continue
        out.pop()
      }
    }
    seen.add(key)
    out.push(p)
  }
  return out.join('\n\n')
}

function extractExampleNum(heading) {
  const m = heading.match(/Example\s+(\d+)/i)
  return m ? parseInt(m[1], 10) : null
}

function cleanWorkedExampleBody(body, exampleNum) {
  let text = body.trim()
  if (!text) return text

  // Drop content belonging to the next example when not yet split into its own section
  if (exampleNum != null) {
    const next = new RegExp(`\\nExample\\s+${exampleNum + 1}\\s*\\(`, 'i')
    const idx = text.search(next)
    if (idx !== -1) text = text.slice(0, idx).trim()
  }

  // Remove embedded "Example N (ref):" headers duplicated mid-text
  if (exampleNum != null) {
    text = text.replace(new RegExp(`Example\\s+${exampleNum}\\s*\\([^)]+\\):\\s*`, 'gi'), '')
  } else {
    text = text.replace(/Example\s+\d+\s*\([^)]+\):\s*/gi, '')
  }

  // Remove orphaned fragments from bad merges (e.g. "hori" before zontal on next line)
  text = text.replace(/\bhori\s*$/im, '')
  text = text.replace(/\n\s*zontal/g, 'zontal')

  // Strip garbled partial duplicates mid-sentence
  text = text.replace(/\s+\\times 4x\^\{1-1\}[\s\S]*?(?=##|$)/g, '')

  return dedupeParagraphs(text)
}

function splitLongWorkedExampleParagraphs(text) {
  return text
    .split(/\n\n+/)
    .flatMap((para) => {
      const p = para.trim()
      if (!p || p.length < 220 || p.startsWith('$$') || /^Question:/i.test(p)) return [p]
      const sentences = p.split(/(?<=[.!?])\s+(?=[A-Z(])/).map((s) => s.trim()).filter(Boolean)
      if (sentences.length <= 2) return [p]
      return sentences
    })
    .join('\n\n')
}

function shortenMethodBody(body) {
  const trimmed = body.trim()
  if (!trimmed) return trimmed
  if (/^\d+\.\s/m.test(trimmed)) return trimmed
  if (/\*\*[^*]+\*\*/.test(trimmed) && trimmed.includes('\n\n')) return trimmed

  // Pull worked examples out of Steps if they were merged in
  if (/Worked Examples?/i.test(trimmed)) {
    const cut = trimmed.search(/\bWorked Examples?\b/i)
    if (cut > 0) return trimmed.slice(0, cut).trim()
  }

  const paragraphs = trimmed.split(/\n\n+/)
  const out = []

  for (const para of paragraphs) {
    const p = para.trim()
    if (!p) continue
    if (/^\d+\.\s/.test(p) || p.startsWith('**')) {
      out.push(p)
      continue
    }
    if (p.length < 180) {
      out.push(p)
      continue
    }

    const sentences = p
      .split(/\.\s+(?=[A-Z(])/)
      .map((s) => s.trim())
      .filter(Boolean)

    if (sentences.length <= 2) {
      out.push(p.endsWith('.') ? p : `${p}.`)
      continue
    }

    out.push(
      sentences
        .map((s, i) => {
          const t = s.replace(/\.$/, '').trim()
          return `${i + 1}. ${t}.`
        })
        .join('\n'),
    )
  }

  return out.join('\n\n')
}

function splitSections(raw) {
  const parts = raw.split(/\n(?=## )/)
  return parts.map((block) => {
    const m = block.match(/^## (.+)\n([\s\S]*)/)
    if (!m) return { heading: '', body: block, raw: block }
    return { heading: m[1].trim(), body: m[2].trim(), raw: block }
  })
}

function rebuildSections(sections) {
  return sections
    .map(({ heading, body }) => {
      if (!heading) return body
      return `## ${heading}\n\n${body}`.trim()
    })
    .filter(Boolean)
    .join('\n\n')
}

function cleanFile(raw) {
  let changed = false
  const sections = splitSections(raw)
  const out = []

  for (const section of sections) {
    let { heading, body } = section

    if (/^Steps\s*\/\s*method$/i.test(heading)) {
      const next = shortenMethodBody(body)
      if (next !== body) {
        body = next
        changed = true
      }
    }

    if (/^Worked example/i.test(heading)) {
      const num = extractExampleNum(heading)
      const next = splitLongWorkedExampleParagraphs(cleanWorkedExampleBody(body, num))
      if (next !== body) {
        body = next
        changed = true
      }
    }

    out.push({ heading, body })
  }

  return { text: rebuildSections(out), changed }
}

let total = 0
for (const subject of subjects) {
  const notesDir = path.join(__dirname, '..', 'content', 'notes', subject)
  if (!fs.existsSync(notesDir)) continue

  for (const file of fs.readdirSync(notesDir).filter((f) => f.endsWith('.md'))) {
    const filePath = path.join(notesDir, file)
    const raw = fs.readFileSync(filePath, 'utf8')
    const { text, changed } = cleanFile(raw)
    if (changed) {
      fs.writeFileSync(filePath, `${text.trim()}\n`, 'utf8')
      total++
      console.log(`${subject}/${file}`)
    }
  }
}

console.log(`Done — ${total} files updated.`)
