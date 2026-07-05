/**
 * Repair quiz JSON damaged by an over-aggressive frac normalizer
 * (English "fraction" → \frac{tion}{}, 10/(x+1) → \frac{1}{0x+1}, etc.).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prepareMathContent } from '../src/lib/mathMarkdown.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizzesDir = path.join(__dirname, '../content/quizzes/add-maths-0606')

function repairValue(val) {
  if (typeof val === 'string') return prepareMathContent(val, 'quiz')
  return val
}

function repairQuestion(q) {
  const next = { ...q }
  if (next.question) next.question = repairValue(next.question)
  if (next.options) next.options = next.options.map(repairValue)
  if (next.explanation) next.explanation = repairValue(next.explanation)
  if (next.variants?.length) {
    next.variants = next.variants.map((v) => repairQuestion(v))
  }
  return next
}

function repairQuizFile(filePath) {
  const quiz = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  if (quiz.title) quiz.title = repairValue(quiz.title)
  if (quiz.questions) quiz.questions = quiz.questions.map(repairQuestion)
  fs.writeFileSync(filePath, JSON.stringify(quiz, null, 2) + '\n', 'utf8')
}

const files = fs.readdirSync(quizzesDir).filter((f) => f.endsWith('.json'))
let count = 0
for (const f of files) {
  repairQuizFile(path.join(quizzesDir, f))
  count++
}
console.log(`Repaired ${count} quiz files in add-maths-0606`)
