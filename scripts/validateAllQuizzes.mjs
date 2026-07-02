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
    const p = path.join(dir, name)
    if (fs.statSync(p).isDirectory()) walkJson(p)
    else if (name.endsWith('.json')) {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'))
      const rel = path.relative(QUIZ_ROOT, p)
      for (const q of data.questions ?? []) {
        validateQuestionTree(q, rel)
      }
    }
  }
}

function validateQuestionTree(q, file) {
  const id = `${file} :: ${q.id}`
  const errs = validateMcqQuestion(q, id)
  checked += 1
  if (errs.length) errors.push(...errs)
  else if (errs.length === 0 && matchesPattern(q.question)) patternChecked += 1

  for (const v of q.variants ?? []) {
    validateQuestionTree({ ...q, ...v, variants: undefined, id: `${q.id} [variant]` }, file)
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
