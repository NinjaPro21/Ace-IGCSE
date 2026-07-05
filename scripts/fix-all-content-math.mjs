/**
 * Fix LaTeX across notes, quizzes, and topic titles (gentle — preserves structure).
 * Run: npm run fix:math
 * Aggressive note normalizer: npm run fix:math -- --aggressive add-maths-0606
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prepareMathContent, repairMathMarkdown, normalizeKeyFormulasBody } from '../src/lib/mathMarkdown.ts'
import {
  fixMathInLine,
  normalizeKeyFormulas,
  normalizeGenericBlock,
  formatWorkedExampleLines,
} from './normalize-note-content.mjs'
import { fixPhysicsMarkdown } from './physics-note-latex.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contentRoot = path.join(__dirname, '..', 'content')
const args = process.argv.slice(2).filter((a) => !a.startsWith('-'))
const aggressive = process.argv.includes('--aggressive')
const subjectArg = args[0] ?? 'all'
const subjects =
  subjectArg === 'all' ? ['add-maths-0606', 'maths-0580', 'physics'] : [subjectArg]

function joinPreservingTables(lines) {
  if (!lines.length) return ''
  const out = []
  for (let i = 0; i < lines.length; i++) {
    if (i > 0) {
      const prevTable = /^\|/.test(lines[i - 1].trim())
      const currTable = /^\|/.test(lines[i].trim())
      if (!(prevTable && currTable)) out.push('')
    }
    out.push(lines[i])
  }
  return out.join('\n')
}

function isStructuredKeyFormulas(body) {
  return /\*\*[^*]+\*\*/.test(body) && /\$\$/.test(body)
}

function fixNoteSection(heading, body, isPhysics) {
  const trimmed = body.trim()
  if (!trimmed) return ''

  if (isPhysics) {
    const h = heading.toLowerCase()
    if (h.startsWith('worked example') || h === 'key formulas' || h === 'quick check') {
      return prepareMathContent(fixPhysicsMarkdown(trimmed), 'note')
    }
    return trimmed
  }

  const h = heading.toLowerCase()
  if (h === 'key formulas') {
    const normalized = normalizeKeyFormulasBody(trimmed)
    if (aggressive && !isStructuredKeyFormulas(normalized)) {
      const lines = normalized.split('\n').map((l) => l.trim()).filter(Boolean)
      return prepareMathContent(joinPreservingTables(normalizeKeyFormulas(lines)), 'note')
    }
    return prepareMathContent(normalized, 'note')
  }

  if (!aggressive) {
    return prepareMathContent(trimmed, 'note')
  }

  const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean)
  let fixed = ''
  if (h.startsWith('worked example')) {
    fixed = joinPreservingTables(formatWorkedExampleLines(lines))
  } else {
    fixed = joinPreservingTables(normalizeGenericBlock(lines))
  }
  return prepareMathContent(fixed, 'note')
}

function collapseBlankLines(text) {
  return text.replace(/\n{3,}/g, '\n\n')
}

function fixNoteMarkdown(raw, isPhysics) {
  const chunks = raw.split(/^## /m)
  if (chunks.length <= 1) {
    return collapseBlankLines(
      repairMathMarkdown(
        raw
          .split('\n')
          .map((l) => (l.trim() ? prepareMathContent(fixMathInLine(l), 'note') : l))
          .join('\n'),
      ).trim(),
    ) + '\n'
  }

  const sections = []
  for (let i = 1; i < chunks.length; i++) {
    const part = chunks[i]
    const nl = part.indexOf('\n')
    const heading = nl === -1 ? part.trim() : part.slice(0, nl).trim()
    const body = nl === -1 ? '' : part.slice(nl + 1).trim()
    const fixedBody = fixNoteSection(heading, body, isPhysics)
    sections.push(`## ${heading}${fixedBody ? `\n\n${fixedBody}` : ''}`)
  }
  return collapseBlankLines(sections.join('\n\n').trim()) + '\n'
}

function fixQuizString(val) {
  if (typeof val !== 'string') return val
  return prepareMathContent(val, 'quiz')
}

function walkQuizStrings(obj) {
  if (!obj || typeof obj !== 'object') return
  if (Array.isArray(obj)) {
    obj.forEach(walkQuizStrings)
    return
  }
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string' && ['question', 'explanation', 'commonMistake', 'title'].includes(key)) {
      obj[key] = fixQuizString(val)
    } else if (key === 'options' && Array.isArray(val)) {
      obj[key] = val.map((opt) => fixQuizString(opt))
    } else if (typeof val === 'object') {
      walkQuizStrings(val)
    }
  }
}

let totalUpdated = 0

for (const subject of subjects) {
  const notesDir = path.join(contentRoot, 'notes', subject)
  const isPhysics = subject === 'physics'

  if (fs.existsSync(notesDir)) {
    for (const file of fs.readdirSync(notesDir).filter((f) => f.endsWith('.md'))) {
      const filePath = path.join(notesDir, file)
      const before = fs.readFileSync(filePath, 'utf8')
      const after = fixNoteMarkdown(before, isPhysics)
      if (after !== before) {
        fs.writeFileSync(filePath, after, 'utf8')
        totalUpdated++
        console.log(`note [${subject}]:`, file)
      }
    }
  }

  const quizzesDir = path.join(contentRoot, 'quizzes', subject)
  if (fs.existsSync(quizzesDir)) {
    for (const file of fs.readdirSync(quizzesDir).filter((f) => f.endsWith('.json'))) {
      const filePath = path.join(quizzesDir, file)
      const quiz = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      const before = JSON.stringify(quiz)
      if (quiz.title) quiz.title = prepareMathContent(quiz.title, 'title')
      walkQuizStrings(quiz)
      const after = JSON.stringify(quiz)
      if (before !== after) {
        fs.writeFileSync(filePath, JSON.stringify(quiz, null, 2) + '\n', 'utf8')
        totalUpdated++
        console.log(`quiz [${subject}]:`, file)
      }
    }
  }

  const topicsDir = path.join(contentRoot, 'topics', subject)
  if (fs.existsSync(topicsDir)) {
    for (const file of fs.readdirSync(topicsDir).filter((f) => f.endsWith('.json'))) {
      const filePath = path.join(topicsDir, file)
      const topic = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      const nextTitle = prepareMathContent(topic.title ?? '', 'title')
      if (nextTitle !== topic.title) {
        topic.title = nextTitle
        fs.writeFileSync(filePath, JSON.stringify(topic, null, 2) + '\n', 'utf8')
        totalUpdated++
        console.log(`topic [${subject}]:`, file)
      }
    }
  }
}

console.log(`Done — ${totalUpdated} files updated (${subjects.join(', ')})${aggressive ? ' [aggressive]' : ''}.`)
