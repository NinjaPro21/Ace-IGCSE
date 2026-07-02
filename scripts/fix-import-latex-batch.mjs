/**
 * Batch-fix post-import LaTeX across add-maths notes and quizzes.
 * Run: node scripts/fix-import-latex-batch.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  prepareMathContent,
  repairCorruptedQuizMath,
  repairQuizImportArtifacts,
  repairImportedNoteMath,
  repairImportedNoteArtifacts,
  closeUnclosedDisplayMath,
  normalizeKeyFormulasBody,
} from '../src/lib/mathMarkdown.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const subjectId = 'add-maths-0606'
const notesDir = path.join(root, 'content', 'notes', subjectId)
const quizzesDir = path.join(root, 'content', 'quizzes', subjectId)

function fixQuizString(val) {
  if (typeof val !== 'string') return val
  let t = repairQuizImportArtifacts(val)
  t = repairCorruptedQuizMath(t)
  if (/\r?\nfrac|(?<![\\a-zA-Z{])frac\d/.test(t)) {
    t = prepareMathContent(t, 'quiz')
  }
  return t
}

function walkQuiz(obj) {
  if (!obj || typeof obj !== 'object') return
  if (Array.isArray(obj)) {
    obj.forEach(walkQuiz)
    return
  }
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string' && ['question', 'explanation', 'commonMistake', 'title'].includes(key)) {
      obj[key] = fixQuizString(val)
    } else if (key === 'options' && Array.isArray(val)) {
      obj[key] = val.map((opt) => fixQuizString(opt))
    } else if (typeof val === 'object') {
      walkQuiz(val)
    }
  }
}

function fixNote(raw) {
  let t = repairImportedNoteArtifacts(raw)
  t = repairImportedNoteMath(t)
  const chunks = t.split(/^## /m)
  if (chunks.length <= 1) {
    return closeUnclosedDisplayMath(prepareMathContent(t, 'note').trim()) + '\n'
  }
  const sections = []
  for (let i = 1; i < chunks.length; i++) {
    const part = chunks[i]
    const nl = part.indexOf('\n')
    const heading = nl === -1 ? part.trim() : part.slice(0, nl).trim()
    let body = nl === -1 ? '' : part.slice(nl + 1).trim()
    if (heading.toLowerCase() === 'key formulas') {
      body = normalizeKeyFormulasBody(body)
    }
    body = prepareMathContent(body, 'note')
    sections.push(`## ${heading}${body ? `\n\n${body}` : ''}`)
  }
  return closeUnclosedDisplayMath(sections.join('\n\n').trim()) + '\n'
}

let updated = 0

for (const file of fs.readdirSync(notesDir).filter((f) => f.endsWith('.md'))) {
  const filePath = path.join(notesDir, file)
  const before = fs.readFileSync(filePath, 'utf8')
  const after = fixNote(before)
  if (after !== before) {
    fs.writeFileSync(filePath, after, 'utf8')
    updated++
    console.log('note:', file)
  }
}

for (const file of fs.readdirSync(quizzesDir).filter((f) => f.endsWith('.json'))) {
  const filePath = path.join(quizzesDir, file)
  const quiz = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const before = JSON.stringify(quiz)
  if (quiz.title) quiz.title = fixQuizString(quiz.title)
  walkQuiz(quiz)
  const after = JSON.stringify(quiz)
  if (before !== after) {
    fs.writeFileSync(filePath, JSON.stringify(quiz, null, 2) + '\n', 'utf8')
    updated++
    console.log('quiz:', file)
  }
}

console.log(`\nDone — ${updated} files updated.`)
