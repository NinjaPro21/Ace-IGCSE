/**
 * Validate all quiz JSON files + runtime variant generators.
 * Run: npm run quiz:validate
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'
import { validateMcqQuestion } from './validateQuestionAnswer.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const QUIZ_ROOT = path.join(__dirname, '..', 'content', 'quizzes')
const root = path.join(__dirname, '..')

const errors = []
let checked = 0
let patternChecked = 0

function walkJson(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '_deprecated') continue
    const p = path.join(dir, name)
    if (fs.statSync(p).isDirectory()) walkJson(p)
    else if (name.endsWith('.json')) {
      const rel = path.relative(QUIZ_ROOT, p)
      let data
      try {
        data = JSON.parse(fs.readFileSync(p, 'utf8'))
      } catch (e) {
        errors.push(`${rel}: invalid JSON — ${e.message}`)
        continue
      }
      for (const q of data.questions ?? []) {
        validateQuestionTree(q, rel)
      }
    }
  }
}

function validateQuestionStructure(q, file, suffix = '') {
  const id = `${file} :: ${q.id}${suffix}`
  const qText = (q.questionText ?? q.question ?? q.q ?? '').trim()
  const opts = q.options ?? q.choices ?? []
  const correctIdx = q.correctIndex ?? q.correct ?? q.answer
  const correctAns = q.correctAnswer
  const structural = []

  if (correctAns !== undefined && !opts.includes(correctAns)) {
    structural.push(`${id}: correctAnswer not found in options`)
  }
  if (correctIdx === undefined && correctAns === undefined) {
    structural.push(`${id}: missing correctIndex/correctAnswer`)
  } else if (correctIdx !== undefined && (correctIdx < 0 || correctIdx >= opts.length)) {
    structural.push(`${id}: correctIndex ${correctIdx} out of range (options: ${opts.length})`)
  }
  if (opts.length < 2) structural.push(`${id}: fewer than 2 options (${opts.length})`)
  if (qText.length < 10) structural.push(`${id}: question text too short (${qText.length} chars)`)
  if (!(q.explanation ?? '').trim()) structural.push(`${id}: missing explanation`)

  return structural
}

function validateQuestionTree(q, file) {
  const id = `${file} :: ${q.id}`
  errors.push(...validateQuestionStructure(q, file))

  const errs = validateMcqQuestion(q, id)
  checked += 1
  if (errs.length) errors.push(...errs)
  else if (errs.length === 0 && matchesPattern(q.question)) patternChecked += 1

  for (const v of q.variants ?? []) {
    const merged = { ...q, ...v, variants: undefined, id: `${q.id} [variant]` }
    errors.push(...validateQuestionStructure(merged, file, ' [variant]'))
    const variantId = `${file} :: ${merged.id}`
    const vErrs = validateMcqQuestion(merged, variantId)
    checked += 1
    if (vErrs.length) errors.push(...vErrs)
    else if (matchesPattern(merged.question)) patternChecked += 1
  }
}

function matchesPattern(text) {
  const patterns = [
    /f\(x\)\s*=/,
    /coefficient of/i,
    /remainder when/i,
    /product of the roots/i,
    /y = .*x² \+ y²/i,
    /log_/,
    /\\frac\{\d+!}/,
    /\|(\d+)x/,
    /arc length/i,
    /radians/i,
    /committee/i,
    /stationary/i,
    /Tangent to/i,
    /fencing/i,
    /equal roots/i,
    /critical values/i,
    /y-intercept/i,
    /Gradient of/i,
    /exactly 3/i,
    /Sum of \d+ terms/i,
  ]
  return patterns.some((p) => p.test(text))
}

console.log('Validating quiz JSON files…')
walkJson(QUIZ_ROOT)

console.log('Validating runtime variant generators…')
const runtime = spawnSync(
  'npx',
  ['tsx', 'scripts/validateRuntimeVariants.ts'],
  { cwd: root, shell: true, encoding: 'utf8' },
)

if (runtime.status !== 0) {
  if (runtime.stdout) console.error(runtime.stdout)
  if (runtime.stderr) console.error(runtime.stderr)
  process.exit(runtime.status ?? 1)
}

if (runtime.stdout?.trim()) console.log(runtime.stdout.trim())

if (errors.length) {
  console.error(`\nFound ${errors.length} quiz validation error(s):\n`)
  const show = errors.slice(0, 50)
  show.forEach((e) => console.error(`- ${e}`))
  if (errors.length > 50) console.error(`… and ${errors.length - 50} more`)
  process.exit(1)
}

console.log(
  `\n✓ All quiz validations passed (${checked} questions checked, ${patternChecked} with math cross-check).`,
)
