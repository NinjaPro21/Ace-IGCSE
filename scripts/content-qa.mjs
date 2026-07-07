#!/usr/bin/env node
/**
 * Unified content QA gate — run before deploy or after bulk imports.
 *
 * Usage:
 *   npm run content:qa              # full gate (strict)
 *   npm run content:qa -- --fix     # auto-fix math then re-validate
 *   node scripts/content-qa.mjs physics  # single subject math check only
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const args = process.argv.slice(2)
const doFix = args.includes('--fix')
const subjectArg = args.find((a) => !a.startsWith('-')) ?? 'all'

function run(label, cmd, cmdArgs, { optional = false } = {}) {
  console.log(`\n── ${label} ──`)
  const result = spawnSync(cmd, cmdArgs, { cwd: root, shell: true, encoding: 'utf8', stdio: 'pipe' })
  if (result.stdout?.trim()) console.log(result.stdout.trim())
  if (result.stderr?.trim()) console.error(result.stderr.trim())
  if (result.status !== 0 && !optional) {
    console.error(`✗ ${label} failed`)
    return false
  }
  console.log(`✓ ${label} passed`)
  return true
}

function countMissingVisuals(subjectId) {
  const topicsDir = path.join(root, 'content', 'topics', subjectId)
  const notesRoot = path.join(root, 'content', 'notes')
  if (!fs.existsSync(topicsDir)) return []
  const missing = []
  for (const file of fs.readdirSync(topicsDir).filter((f) => f.endsWith('.json'))) {
    const t = JSON.parse(fs.readFileSync(path.join(topicsDir, file), 'utf8'))
    const notesPath = path.join(notesRoot, t.notesFile)
    const notes = fs.existsSync(notesPath) ? fs.readFileSync(notesPath, 'utf8') : ''
    const hasDiagram =
      notes.includes('## Graphs & diagrams') ||
      notes.includes('enlight-physics-diagram') ||
      Boolean(t.explorerId)
    if (!hasDiagram) missing.push(`${subjectId}/${t.id}`)
  }
  return missing
}

console.log('Project Enlight — content QA gate')
console.log(`Subject filter: ${subjectArg}`)

  if (doFix) {
  const fixArgs = subjectArg === 'all' ? [] : [subjectArg]
  if (!run('Auto-fix math (fix:math)', 'npm', ['run', 'fix:math', '--', ...fixArgs])) process.exit(1)
  if (!run('Quiz repair (all subjects)', 'npm', ['run', 'quiz:repair:all'])) process.exit(1)
}

const steps = [
  ['Quiz content audit (ch1)', 'npm', ['run', 'audit:quizzes', '--', '--topic', '1-1-mappings', '--topic', '1-2-definition-of-a-function', '--topic', '1-3-composite-functions-harder-topic', '--topic', '1-4-modulus-functions-harder-topic', '--topic', '1-5-graphs-of-y-f-x-where-f-x-is-linear-harder-topic', '--topic', '1-6-inverse-functions-harder-topic', '--topic', '1-7-the-graph-of-a-function-and-its-inverse-harder-topic', ...(subjectArg === 'all' ? [] : [subjectArg])]],
  ['KaTeX validation (strict)', 'npm', ['run', 'validate:math', '--', '--strict', ...(subjectArg === 'all' ? [] : [subjectArg])]],
  ['Quiz integrity + answer cross-check', 'npm', ['run', 'quiz:validate']],
  ['Note structure audit', 'npm', ['run', 'audit:content']],
]

let ok = true
for (const [label, cmd, cmdArgs] of steps) {
  if (!run(label, cmd, cmdArgs)) ok = false
}

console.log('\n── Visual coverage ──')
const visualGaps = ['physics', 'add-maths-0606', 'maths-0580'].flatMap(countMissingVisuals)
if (visualGaps.length) {
  console.warn(`⚠ ${visualGaps.length} topic(s) lack diagrams/explorer:`)
  visualGaps.slice(0, 20).forEach((id) => console.warn(`  - ${id}`))
  if (visualGaps.length > 20) console.warn(`  … and ${visualGaps.length - 20} more`)
} else {
  console.log('✓ All topics have visual help')
}

if (!ok) {
  console.error('\nContent QA failed. Fix errors above, or run: npm run content:qa -- --fix')
  process.exit(1)
}

console.log('\n✓ Content QA passed')
