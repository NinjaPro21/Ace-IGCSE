#!/usr/bin/env node
/**
 * Semantic quiz content audit — catches import corruption that KaTeX syntax checks miss.
 *
 * Bug classes:
 *  A. Raw JSON corruption (docx import artefacts)
 *  B. Bare LaTeX / exponents / composite notation
 *  C. Post-normalization render failures (fixQuizLatexText pipeline)
 *  D. Question ↔ explanation formula mismatches
 *  E. Delimiter / escape issues ($ imbalance, \$ escapes, period inside math)
 *  F. Mapping / domain notation (prose trapped in math, orphan $)
 *  G. Modulus / inverse / composite patterns
 *  H. Bare math in options (no $ delimiters — renders as plain text in quiz UI)
 *  I. Docx "$. So" glue (^2 So), duplicate $ after math, newline-split variables
 *
 * Severity:
 *  - error: questions & options (blocks deploy)
 *  - warn:  explanations only (logged, does not fail unless --strict)
 *
 * Usage:
 *   npm run audit:quizzes
 *   npm run audit:quizzes -- --topic 1-1-mappings
 *   npm run audit:quizzes -- add-maths-0606
 *   npm run audit:quizzes -- --strict
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { findQuizMathRenderIssues, isBareQuizOptionMath } from '../src/lib/mathMarkdown.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const QUIZ_ROOT = path.join(__dirname, '..', 'content', 'quizzes')

const args = process.argv.slice(2)
const strict = args.includes('--strict')
const reportJson = args.includes('--report')
const topicFilters = []
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--topic' && args[i + 1]) topicFilters.push(args[i + 1])
}
const subjectFilter =
  args.find((a) => !a.startsWith('-') && !topicFilters.includes(a) && a !== '--topic') ?? null

const PROSE_IN_MATH =
  /\b(for the domain|where the domain is|Find the set|Determine the set|Find the value|Solve the|State the type|Given the)\b/i

const BARE_LATEX_RE = /\\(neq|in|mathbb|le|ge|leq|geq|mapsto|frac)\b|[≤≥]|(?<![$\\])\by\s*[<>]\s*\d/

/** Class A — docx import corruption in raw JSON. */
const CLASS_A = [
  { cls: 'A', re: /\$1\$\s+where the domain/i, msg: 'corrupted mapping ($1$ instead of x ↦ …)' },
  { cls: 'A', re: /\\frac\{[^}]*-\}\{1x/, msg: 'corrupted fraction (\\frac{…x-}{1x+…})' },
  { cls: 'A', re: /\\frac\{[^}]*\+\}\{1x/, msg: 'corrupted fraction (\\frac{ax+}{1x-…})' },
  { cls: 'A', re: /\$\$\s*\\n/, msg: 'broken display-math (newline inside $$)' },
  { cls: 'A', re: /Range is\s*\./i, msg: 'incomplete explanation (Range is .)' },
  { cls: 'A', re: /\\nle|\\nge|\\nneq/i, msg: 'corrupted \\nle / \\nge (newline ate backslash)' },
  { cls: 'A', re: /\\frac\{tion/i, msg: 'corrupted \\frac word-split (frac{tions})' },
  { cls: 'A', re: /\$2\$/g, msg: 'import placeholder $2$ between math fragments' },
  { cls: 'A', re: /[Yy]2[XxYy]/, msg: 'docx glue artefact (Y2X / y2y / x2x)' },
  { cls: 'A', re: /\\u221A/, msg: 'unicode sqrt escape (use \\sqrt{…} in LaTeX)' },
  { cls: 'A', re: /(of|or|between|by|side|radius|and|at|height|length|ladder)\^(\d+)/i, msg: 'docx caret glue (of^12 → of 12)' },
  { cls: 'I', re: /\^2 So /, msg: 'docx ate "$. So" as "^2 So" (sentence split inside math)' },
  { cls: 'I', re: /\$[^$\n]+\$\s+\$/, msg: 'duplicate $ after closed inline math ($...$ $,)' },
  { cls: 'I', re: /\bvalue of [a-zA-Z]\s*\n+\s*\$\./, msg: 'variable split across newlines before lone $.' },
  { cls: 'I', re: /\$e\^2 So /i, msg: 'corrupted natural-log base ($e$. So → $e^2 So)' },
  { cls: 'J', re: /\$[a-zA-Z]\s{1,}(of|is|and|the|when|at|in|for|a|an|or|with|from|by|to|metres|meters|gives|where|increasing|decreasing)\b/i, msg: 'unclosed $var$ before prose ($s of → $s$ of)' },
  { cls: 'J', re: /\b[A-Za-z]\$\./, msg: 'bare variable before $. ($P$. → $P$.)' },
  { cls: 'J', re: /at\$\d+\$(cm\/s|m\/s)/i, msg: 'glue at$3$cm/s — separate rate unit' },
]

/** Class B — bare math outside delimiters. */
const CLASS_B = [
  { cls: 'B', re: /[a-zA-Z]\^\{[^}]+\}(?![^$]*\$)/, msg: 'bare ^{...} exponent (wrap in $...$)' },
  { cls: 'B', re: /\b(gf|fg|gh)\([0-9a-zx]+\)/i, msg: 'bare composite gf(…) / fg(…) notation' },
  { cls: 'B', re: /(?<!\$)\|[^|$\n]+\|(?!\$)/, msg: 'bare modulus |…| outside $...$' },
  { cls: 'B', re: /\bf⁻¹|f\^{-1}(?!\$)/, msg: 'unicode / bare inverse notation (use $f^{-1}$)' },
  { cls: 'B', re: /(?<!\$)\b\d+\s*\/\s*\([^)]+\)(?!\$)/, msg: 'bare fraction a/(…) outside $...$' },
]

/** Class E — delimiter / escape issues in raw JSON. */
const CLASS_E = [
  { cls: 'E', re: /\$\\\$/, msg: 'double-escaped dollar (\\$) in source' },
  { cls: 'E', re: /\$[^$\n]{1,120}[?!]\$/, msg: 'sentence ? or ! trapped inside $...$ (KaTeX shows raw LaTeX)' },
  { cls: 'E', re: /\$[^$\n]{1,120}\.\$/, msg: 'sentence period trapped inside $...$ (e.g. $f^{-1}(4).$)' },
  { cls: 'E', re: /\?\$$/, msg: 'orphan $ before ?' },
  { cls: 'E', re: /[0-9]≤|[0-9]≥|≤y|≥y|≤x|≥x/i, msg: 'unicode inequality glued to digits' },
  { cls: 'E', re: /\$\s*\n\s*\\(le|ge|neq)/, msg: 'inline math split across lines before \\le/\\ge' },
  { cls: 'E', re: /\$ \./, msg: 'stray space before period outside math ($ .)' },
]

/** Class F — mapping / domain notation. */
const CLASS_F = [
  { cls: 'F', re: /\$The function/i, msg: 'prose trapped in math ($The function)' },
  { cls: 'F', re: /\$[^$]*\\mapsto[^$]*for the domain/i, msg: 'mapping + domain prose in one $...$ block' },
  { cls: 'F', re: /where the domain is\$(?!\{)/, msg: 'domain glued to math delimiter (where the domain is$…)' },
  { cls: 'F', re: /domain\$\{?[-\d,]/i, msg: 'domain list glued inside math ($domain$…)' },
]

/** Class G — modulus / graphs patterns common in Ch.1+. */
const CLASS_G = [
  { cls: 'G', re: /y\s*=\s*\|[^$|]+\|(?!\$)/i, msg: 'bare y=|f(x)| outside $...$' },
  { cls: 'G', re: /graph of y=\|/i, msg: 'bare modulus graph label outside $...$' },
]

const RAW_PATTERNS = [...CLASS_A, ...CLASS_B, ...CLASS_E, ...CLASS_F, ...CLASS_G]

/** Explanation-only patterns (unicode inequalities in prose are common). */
const EXPLANATION_ONLY = [
  { re: /[≤≥]/, msg: 'unicode inequality in explanation (prefer $\\le$ / $\\ge$)' },
  { re: /∣/, msg: 'unicode modulus ∣ in explanation' },
]

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

function bareLatexOutsideMath(text) {
  const issues = []
  const outside = text.split(/\$[^$]*\$/)
  for (const seg of outside) {
    if (!seg.trim()) continue
    if (BARE_LATEX_RE.test(seg)) {
      issues.push(`bare LaTeX outside $...$: "${seg.trim().slice(0, 48)}${seg.length > 48 ? '…' : ''}"`)
      break
    }
  }
  return issues
}

function countDollars(text) {
  return (text.match(/(?<!\\)\$/g) ?? []).length
}

function rawDelimiterIssues(text) {
  const issues = []
  if (countDollars(text) % 2 !== 0) {
    issues.push('unbalanced $ delimiters in source JSON')
  }
  return issues
}

function patternsOutsideMath(text, patterns) {
  const issues = []
  const segments = text.split(/(\$[^$]+\$|\$\$[\s\S]*?\$\$)/)
  for (const seg of segments) {
    if (seg.startsWith('$')) continue
    for (const { msg, re } of patterns) {
      if (re.test(seg)) {
        issues.push(msg)
        break
      }
    }
  }
  return issues
}

function auditField(text, file, qid, label) {
  if (!text?.trim()) return { errors: [], warnings: [] }
  const id = `${file} :: ${qid}`
  const errors = []
  const warnings = []
  const isExplanation = label === 'explanation'
  const isOption = /^option \d+$/.test(label)

  if (isOption && isBareQuizOptionMath(text)) {
    errors.push(`${id} [${label}]: bare math in option (wrap in $...$; use \\lg not lg)`)
  }

  const classBPatterns = CLASS_B
  const nonBPatterns = RAW_PATTERNS.filter((p) => p.cls !== 'B')

  const rawPatternIssues = isExplanation
    ? [
        ...patternsOutsideMath(text, nonBPatterns),
        ...patternsOutsideMath(text, EXPLANATION_ONLY),
      ]
    : [
        ...patternsOutsideMath(text, CLASS_A),
        ...patternsOutsideMath(text, CLASS_E),
        ...patternsOutsideMath(text, CLASS_F),
        ...patternsOutsideMath(text, CLASS_G),
      ]

  for (const msg of rawPatternIssues) {
    const line = `${id} [${label}]: ${msg}`
    if (isExplanation && !strict) warnings.push(line)
    else errors.push(line)
  }

  errors.push(...rawDelimiterIssues(text).map((m) => `${id} [${label}]: ${m}`))

  if (label === 'question') {
    errors.push(...proseInsideInlineMath(text).map((m) => `${id} [${label}]: ${m}`))
  }

  const bare = bareLatexOutsideMath(text)
  if (isExplanation && !strict) {
    warnings.push(...bare.map((m) => `${id} [${label}]: ${m}`))
  } else {
    errors.push(...bare.map((m) => `${id} [${label}]: ${m}`))
  }

  for (const renderIssue of findQuizMathRenderIssues(text)) {
    const line = `${id} [${label} render]: ${renderIssue}`
    if (isExplanation && !strict) warnings.push(line)
    else errors.push(line)
  }

  return { errors, warnings }
}

function auditQuestion(q, file, suffix = '') {
  const qid = `${q.id}${suffix}`
  const question = (q.question ?? q.questionText ?? '').trim()
  const explanation = (q.explanation ?? '').trim()
  const options = q.options ?? q.choices ?? []

  const errors = []
  const warnings = []

  for (const r of [
    auditField(question, file, qid, 'question'),
    auditField(explanation, file, qid, 'explanation'),
    ...options.map((opt, i) => auditField(String(opt), file, qid, `option ${i + 1}`)),
  ]) {
    errors.push(...r.errors)
    warnings.push(...r.warnings)
  }

  const qFracs = extractMappingFractions(question)
  const eFracs = extractMappingFractions(explanation)
  if (qFracs.length && eFracs.length) {
    const overlap = qFracs.some((f) => eFracs.some((g) => f === g || f.includes(g) || g.includes(f)))
    if (!overlap) {
      warnings.push(
        `${file} :: ${qid}: question/explanation formula mismatch (Q: ${qFracs.join(', ')} vs E: ${eFracs.join(', ')})`,
      )
    }
  }

  return { errors, warnings }
}

function walkQuizzes(dir, relBase = '') {
  const errors = []
  const warnings = []
  let checked = 0

  for (const name of fs.readdirSync(dir)) {
    if (name === '_deprecated') continue
    const full = path.join(dir, name)
    const rel = path.join(relBase, name)
    if (fs.statSync(full).isDirectory()) {
      if (subjectFilter && !rel.startsWith(subjectFilter)) continue
      const nested = walkQuizzes(full, rel)
      errors.push(...nested.errors)
      warnings.push(...nested.warnings)
      checked += nested.checked
      continue
    }
    if (!name.endsWith('.json')) continue
    if (subjectFilter && !rel.startsWith(subjectFilter)) continue

    const data = JSON.parse(fs.readFileSync(full, 'utf8'))
    if (topicFilters.length && !topicFilters.includes(data.topicId)) continue

    for (const q of data.questions ?? []) {
      const r = auditQuestion(q, rel)
      errors.push(...r.errors)
      warnings.push(...r.warnings)
      checked += 1
      for (const v of q.variants ?? []) {
        const merged = { ...q, ...v, variants: undefined, id: `${q.id} [variant]` }
        const vr = auditQuestion(merged, rel, ' [variant]')
        errors.push(...vr.errors)
        warnings.push(...vr.warnings)
        checked += 1
      }
    }
  }

  return {
    errors: [...new Set(errors)],
    warnings: [...new Set(warnings)],
    checked,
  }
}

const { errors, warnings, checked } = walkQuizzes(QUIZ_ROOT)
const scope =
  [subjectFilter, topicFilters.length ? topicFilters.join(' + ') : null].filter(Boolean).join(', ') ||
  'all quizzes'

if (reportJson) {
  const byMsg = {}
  const byField = {}
  for (const line of errors) {
    const m = line.match(/\[([^\]]+)\]: (.+)$/)
    if (!m) continue
    byMsg[m[2]] = (byMsg[m[2]] || 0) + 1
    byField[m[1]] = (byField[m[1]] || 0) + 1
  }
  console.log(
    JSON.stringify(
      {
        scope,
        checked,
        errorCount: errors.length,
        warningCount: warnings.length,
        errors,
        warnings,
        byMsg: Object.fromEntries(Object.entries(byMsg).sort((a, b) => b[1] - a[1])),
        byField: Object.fromEntries(Object.entries(byField).sort((a, b) => b[1] - a[1])),
      },
      null,
      2,
    ),
  )
  process.exit(errors.length ? 1 : 0)
}

console.log(`Quiz content audit (${scope})`)
console.log(`Checked ${checked} question(s)`)

if (warnings.length) {
  console.warn(`\n⚠ ${warnings.length} warning(s) (explanations — use --strict to fail on these):\n`)
  warnings.slice(0, 20).forEach((w) => console.warn(`  - ${w}`))
  if (warnings.length > 20) console.warn(`  … and ${warnings.length - 20} more`)
}

if (errors.length) {
  console.error(`\n✗ ${errors.length} error(s):\n`)
  errors.slice(0, 50).forEach((e) => console.error(`  - ${e}`))
  if (errors.length > 50) console.error(`  … and ${errors.length - 50} more`)
  process.exit(1)
}

console.log('\n✓ No blocking quiz content issues found')
