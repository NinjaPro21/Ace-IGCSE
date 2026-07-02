/**
 * Validate LaTeX in notes, quizzes, and topic titles.
 * Run: npm run validate:math
 * Fail CI: npm run validate:math -- --strict
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import katex from 'katex'
import { prepareMathContent } from '../src/lib/mathMarkdown.ts'
import { extractMathSegments, findMathStructureIssues } from './lib/mathPipeline.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contentRoot = path.join(__dirname, '..', 'content')
const args = process.argv.slice(2).filter((a) => !a.startsWith('-'))
const strict = process.argv.includes('--strict')
const subjectArg = args[0] ?? 'all'
const subjects = subjectArg === 'all' ? ['add-maths-0606', 'maths-0580', 'physics'] : [subjectArg]

const errors = []
const warnings = []

function validateString(text, file, field, context = 'note') {
  if (!text || typeof text !== 'string') return

  const prepared = prepareMathContent(text, context)
  const stripped = prepared.replace(/<!--[\s\S]*?-->/g, '')

  for (const issue of findMathStructureIssues(stripped, { file, field })) {
    if (issue.level === 'error') errors.push({ file, field, message: issue.message })
    else warnings.push({ file, field, message: issue.message })
  }

  for (const seg of extractMathSegments(stripped)) {
    if (!seg.math) continue
    try {
      katex.renderToString(seg.math, {
        throwOnError: true,
        displayMode: seg.kind === 'display',
        strict: 'ignore',
      })
    } catch (e) {
      errors.push({
        file,
        field,
        message: `KaTeX: ${e.message}`,
        snippet: seg.math.slice(0, 80),
      })
    }
  }
}

function walkQuiz(obj, file, prefix = '') {
  if (!obj || typeof obj !== 'object') return
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => walkQuiz(item, file, prefix ? `${prefix}[${i}]` : `[${i}]`))
    return
  }
  for (const [key, val] of Object.entries(obj)) {
    const field = prefix ? `${prefix}.${key}` : key
    if (typeof val === 'string' && ['question', 'explanation', 'commonMistake', 'title'].includes(key)) {
      validateString(val, file, field, key === 'title' ? 'title' : 'quiz')
    } else if (key === 'options' && Array.isArray(val)) {
      val.forEach((opt, i) => {
        if (typeof opt === 'string') validateString(opt, file, `${field}[${i}]`, 'quiz')
      })
    } else if (typeof val === 'object') {
      walkQuiz(val, file, field)
    }
  }
}

for (const subject of subjects) {
  const notesDir = path.join(contentRoot, 'notes', subject)
  if (fs.existsSync(notesDir)) {
    for (const file of fs.readdirSync(notesDir).filter((f) => f.endsWith('.md'))) {
      validateString(fs.readFileSync(path.join(notesDir, file), 'utf8'), `notes/${subject}/${file}`, 'body')
    }
  }

  const quizzesDir = path.join(contentRoot, 'quizzes', subject)
  if (fs.existsSync(quizzesDir)) {
    for (const file of fs.readdirSync(quizzesDir).filter((f) => f.endsWith('.json'))) {
      walkQuiz(JSON.parse(fs.readFileSync(path.join(quizzesDir, file), 'utf8')), `quizzes/${subject}/${file}`)
    }
  }

  const topicsDir = path.join(contentRoot, 'topics', subject)
  if (fs.existsSync(topicsDir)) {
    for (const file of fs.readdirSync(topicsDir).filter((f) => f.endsWith('.json'))) {
      const topic = JSON.parse(fs.readFileSync(path.join(topicsDir, file), 'utf8'))
      if (topic.title) validateString(topic.title, `topics/${subject}/${file}`, 'title', 'title')
    }
  }
}

console.log(`\nMath validation (${subjects.join(', ')})`)
console.log(`Errors: ${errors.length} · Warnings: ${warnings.length}`)

if (errors.length) {
  console.log('\n--- Errors ---')
  for (const e of errors.slice(0, 60)) {
    console.log(`${e.file} · ${e.field}: ${e.message}${e.snippet ? ` — "${e.snippet}…"` : ''}`)
  }
  if (errors.length > 60) console.log(`… and ${errors.length - 60} more`)
}

if (warnings.length) {
  console.log('\n--- Warnings (first 20) ---')
  for (const w of warnings.slice(0, 20)) {
    console.log(`${w.file} · ${w.field}: ${w.message}`)
  }
  if (warnings.length > 20) console.log(`… and ${warnings.length - 20} more`)
}

if (strict && errors.length) process.exit(1)
if (errors.length) {
  console.log('\nRun npm run fix:math to auto-fix. Use --strict to fail the build.')
  process.exit(strict ? 1 : 0)
}

console.log('\nOK — no KaTeX errors found.')
