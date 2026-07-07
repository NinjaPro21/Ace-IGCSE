#!/usr/bin/env node
/**
 * Semantic quiz content audit — catches import corruption that KaTeX syntax checks miss.
 *
 * Usage:
 *   npm run audit:quizzes
 *   npm run audit:quizzes -- --topic 1-1-mappings
 *   npm run audit:quizzes -- add-maths-0606
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const QUIZ_ROOT = path.join(__dirname, '..', 'content', 'quizzes')

const args = process.argv.slice(2)
const topicFilters = []
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--topic' && args[i + 1]) topicFilters.push(args[i + 1])
}
const topicFilter = topicFilters[0] ?? null
const subjectFilter =
  args.find((a, i) => !a.startsWith('-') && !topicFilters.includes(a) && a !== '--topic') ?? null

const PROSE_IN_MATH =
  /\b(for the domain|where the domain is|Find the set|Determine the set|Find the value|Solve the|State the type|Given the)\b/i

const BARE_LATEX_OPTION = /\\(neq|in|mathbb|le|ge|leq|geq)\b|[≤≥]|(?<![$\\])\by\s*[<>]\s*\d/

const CORRUPTED_PATTERNS = [
  { re: /\$1\$\s+where the domain/i, msg: 'corrupted mapping ($1$ instead of x ↦ …)' },
  { re: /\\frac\{[^}]*-\}\{1x/, msg: 'corrupted fraction (\\frac{3x-}{1x+2})' },
  { re: /\$\$\s*\\n/, msg: 'broken display-math option' },
  { re: /\?\$$/, msg: 'orphan $ before ?' },
  { re: /Range is\s*\./i, msg: 'incomplete explanation (Range is .)' },
  { re: /\$The function/i, msg: 'prose trapped in math ($The function)' },
]

/** Extract simple rational mapping fractions for cross-check. */
function extractMappingFractions(text) {
  const out = []
  const mapsto = text.matchAll(/\\mapsto\s*\\frac\{([^}]+)\}\{([^}]+)\}/g)
  for (const m of mapsto) out.push(`${m[1]}/${m[2]}`)
  const plain = text.matchAll(/(\d+)\s*\/\s*\(([^)]+)\)/g)
  for (const m of plain) out.push(`${m[1]}/(${m[2]})`)
  const plain2 = text.matchAll(/(\d+)\s*\/\s*([a-z0-9+]+)/gi)
  for (const m of plain2) {
    if (!m[0].includes('http')) out.push(`${m[1]}/${m[2]}`)
  }
  return [...new Set(out.map((s) => s.replace(/\s/g, '')))]
}

function proseInsideInlineMath(text) {
  const issues = []
  const inline = text.matchAll(/\$([^$\n]+)\$/g)
  for (const m of inline) {
    const inner = m[1]
    if (PROSE_IN_MATH.test(inner) && !/\\text\{/.test(inner)) {
      issues.push(`prose inside $...$: "${inner.slice(0, 60)}${inner.length > 60 ? '…' : ''}"`)
    }
  }
  return issues
}

function auditQuestion(q, file, suffix = '') {
  const id = `${file} :: ${q.id}${suffix}`
  const issues = []
  const question = (q.question ?? q.questionText ?? '').trim()
  const explanation = (q.explanation ?? '').trim()
  const options = q.options ?? q.choices ?? []

  for (const { re, msg } of CORRUPTED_PATTERNS) {
    if (re.test(question) || re.test(explanation)) issues.push(msg)
  }

  issues.push(...proseInsideInlineMath(question))

  for (const opt of options) {
    if (BARE_LATEX_OPTION.test(opt) && !opt.includes('$')) {
      issues.push(`bare LaTeX in option: "${opt}"`)
    }
    if (/^\$\$/.test(opt) && !/\$\$[\s\S]*\$\$$/.test(opt)) {
      issues.push(`broken display-math option: "${opt.slice(0, 40)}…"`)
    }
  }

  const qFracs = extractMappingFractions(question)
  const eFracs = extractMappingFractions(explanation)
  if (qFracs.length && eFracs.length) {
    const overlap = qFracs.some((f) => eFracs.some((g) => f === g || f.includes(g) || g.includes(f)))
    if (!overlap) {
      issues.push(
        `question/explanation formula mismatch (Q: ${qFracs.join(', ')} vs E: ${eFracs.join(', ')})`,
      )
    }
  }

  return issues.map((msg) => `${id}: ${msg}`)
}

function walkQuizzes(dir, relBase = '') {
  const errors = []
  let checked = 0

  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const rel = path.join(relBase, name)
    if (fs.statSync(full).isDirectory()) {
      if (subjectFilter && !rel.startsWith(subjectFilter)) continue
      const nested = walkQuizzes(full, rel)
      errors.push(...nested.errors)
      checked += nested.checked
      continue
    }
    if (!name.endsWith('.json')) continue
    if (subjectFilter && !rel.startsWith(subjectFilter)) continue

    const data = JSON.parse(fs.readFileSync(full, 'utf8'))
    if (topicFilters.length && !topicFilters.includes(data.topicId)) continue

    for (const q of data.questions ?? []) {
      errors.push(...auditQuestion(q, rel))
      checked += 1
      for (const v of q.variants ?? []) {
        const merged = { ...q, ...v, variants: undefined, id: `${q.id} [variant]` }
        errors.push(...auditQuestion(merged, rel, ' [variant]'))
        checked += 1
      }
    }
  }

  return { errors, checked }
}

const { errors, checked } = walkQuizzes(QUIZ_ROOT)
const scope = [subjectFilter, topicFilters.join(' + ') || topicFilter].filter(Boolean).join(', ') || 'all quizzes'

console.log(`Quiz content audit (${scope})`)
console.log(`Checked ${checked} question(s)`)

if (errors.length) {
  console.error(`\n✗ ${errors.length} issue(s):\n`)
  errors.slice(0, 40).forEach((e) => console.error(`  - ${e}`))
  if (errors.length > 40) console.error(`  … and ${errors.length - 40} more`)
  process.exit(1)
}

console.log('✓ No quiz content issues found')
