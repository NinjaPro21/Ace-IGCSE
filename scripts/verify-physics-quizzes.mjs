/**
 * Verify physics topic quizIds resolve to JSON files with valid structure.
 * Run: npm run verify:physics:quizzes
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { validateMcqQuestion } from './validateQuestionAnswer.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const topicsDir = path.join(root, 'content', 'topics', 'physics')
const quizzesDir = path.join(root, 'content', 'quizzes', 'physics')
const DIFFS = ['easy', 'medium', 'hard', 'pyp']

const quizById = new Map()
if (fs.existsSync(quizzesDir)) {
  for (const file of fs.readdirSync(quizzesDir).filter((f) => f.endsWith('.json'))) {
    const quiz = JSON.parse(fs.readFileSync(path.join(quizzesDir, file), 'utf8'))
    quizById.set(quiz.id, { quiz, file })
  }
}

const missing = []
const structural = []
let topicsWithQuizzes = 0
let questionCount = 0

for (const file of fs.readdirSync(topicsDir).filter((f) => f.endsWith('.json'))) {
  const topic = JSON.parse(fs.readFileSync(path.join(topicsDir, file), 'utf8'))
  if (!topic.quizIds) continue
  topicsWithQuizzes += 1

  for (const diff of DIFFS) {
    const quizId = topic.quizIds[diff]
    if (!quizId) {
      missing.push(`${topic.id}: missing quizIds.${diff}`)
      continue
    }
    const entry = quizById.get(quizId)
    if (!entry) {
      missing.push(`${topic.id}: ${quizId}.json not found`)
      continue
    }
    const { quiz, file: quizFile } = entry
    if (quiz.topicId !== topic.id) {
      structural.push(`${quizFile}: topicId "${quiz.topicId}" ≠ "${topic.id}"`)
    }
    if (quiz.difficulty !== diff) {
      structural.push(`${quizFile}: difficulty "${quiz.difficulty}" ≠ "${diff}"`)
    }
    for (const q of quiz.questions ?? []) {
      questionCount += 1
      if (!q.explanation?.trim()) {
        structural.push(`${quizFile} :: ${q.id}: missing explanation`)
      }
      structural.push(...validateMcqQuestion(q, `${quizFile} :: ${q.id}`))
    }
  }
}

console.log(`Physics quiz coverage`)
console.log(`Topics with quizIds: ${topicsWithQuizzes}`)
console.log(`Quiz files on disk: ${quizById.size}`)
console.log(`Questions checked: ${questionCount}`)

if (missing.length) {
  console.log(`\nMissing (${missing.length}):`)
  for (const m of missing.slice(0, 30)) console.log(' -', m)
  if (missing.length > 30) console.log(` … and ${missing.length - 30} more`)
}

if (structural.length) {
  console.log(`\nIssues (${structural.length}):`)
  for (const s of structural.slice(0, 20)) console.log(' -', s)
  if (structural.length > 20) console.log(` … and ${structural.length - 20} more`)
}

if (missing.length || structural.length) process.exit(1)
console.log('\nOK — all physics quiz links resolve and explanations are present.')
