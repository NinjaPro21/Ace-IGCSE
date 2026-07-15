#!/usr/bin/env node
/** Scan active quizzes for Class J: unclosed $var$ swallows prose into math mode. */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizDir = path.join(__dirname, '..', 'content', 'quizzes', 'add-maths-0606')
const chapterDir = path.join(__dirname, '..', 'content', 'chapters', 'add-maths-0606')

const active = new Set()
for (const f of fs.readdirSync(chapterDir)) {
  const ch = JSON.parse(fs.readFileSync(path.join(chapterDir, f), 'utf8'))
  for (const t of ch.topicIds ?? []) active.add(t)
}

const ENGLISH_IN_MATH =
  /\b(of|is|and|the|when|at|in|for|a|an|increasing|decreasing|related|passes|moves|find|given|with|from|by|to|or|if|square|perimeter|side|length|particle|velocity|rate)\b/i

function scanText(text) {
  const issues = []
  // $s  of a square — letter then spaces then English before next $
  if (/\$[a-zA-Z]\s{1,}[a-zA-Z]/.test(text)) {
    const m = text.match(/\$[a-zA-Z]\s{1,}[a-zA-Z][^$]{0,80}/)
    issues.push(`unclosed-var-prose: ${m?.[0] ?? ''}`)
  }
  // perimeter P$. — bare letter before trailing $
  if (/\b[A-Za-z]\$\./.test(text)) issues.push('bare-letter-before-period-dollar')
  // at$3$cm/s glue
  if (/at\$\d+\$cm\/s/i.test(text)) issues.push('glue-at-rate')
  // inline math blocks with 2+ English words (no \text)
  for (const m of text.matchAll(/\$([^$\n]+)\$/g)) {
    const inner = m[1]
    if (/\\text\{/.test(inner)) continue
    const words = inner.match(ENGLISH_IN_MATH)
    if (words && (inner.match(ENGLISH_IN_MATH) ?? []).length >= 2) {
      issues.push(`english-in-math: "${inner.slice(0, 70)}${inner.length > 70 ? '…' : ''}"`)
    }
  }
  return issues
}

const hits = []
for (const name of fs.readdirSync(quizDir)) {
  if (!name.endsWith('.json')) continue
  const data = JSON.parse(fs.readFileSync(path.join(quizDir, name), 'utf8'))
  if (!active.has(data.topicId)) continue
  for (const q of data.questions ?? []) {
    for (const [field, text] of [
      ['question', q.question],
      ['explanation', q.explanation],
      ...(q.options ?? []).map((o, i) => [`option ${i + 1}`, String(o)]),
    ]) {
      if (!text) continue
      const issues = scanText(text)
      if (issues.length) hits.push({ file: name, id: q.id, field, issues, snippet: text.slice(0, 100) })
    }
  }
}

console.log(`Class J scan — ${hits.length} hit(s) in active quizzes:\n`)
for (const h of hits) {
  console.log(`${h.file} :: ${h.id} [${h.field}]`)
  h.issues.forEach((i) => console.log(`  - ${i}`))
}
