/**
 * Import physics quiz JSON from NotebookLM batch output or individual files.
 *
 * Usage:
 *   node scripts/import-physics-quizzes.mjs path/to/batch.json
 *   node scripts/import-physics-quizzes.mjs path/to/folder-with-json
 *   node scripts/import-physics-quizzes.mjs   (imports content/incoming/physics-quizzes/*.json)
 *
 * Batch format: { "quizzes": [ { id, topicId, difficulty, questions, ... }, ... ] }
 * Single file: one quiz object per file.
 *
 * Then: npm run fix:math -- physics && npm run verify:physics:quizzes
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prepareMathContent } from '../src/lib/mathMarkdown.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const outDir = path.join(root, 'content', 'quizzes', 'physics')
const defaultInDir = path.join(root, 'content', 'incoming', 'physics-quizzes')

const DIFFS = ['easy', 'medium', 'hard', 'pyp']
const errors = []

function walkQuizStrings(obj) {
  if (!obj || typeof obj !== 'object') return
  if (Array.isArray(obj)) {
    obj.forEach(walkQuizStrings)
    return
  }
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string' && ['question', 'explanation', 'commonMistake', 'title'].includes(key)) {
      obj[key] = prepareMathContent(val, key === 'title' ? 'title' : 'quiz')
    } else if (key === 'options' && Array.isArray(val)) {
      obj[key] = val.map((opt) => (typeof opt === 'string' ? prepareMathContent(opt, 'quiz') : opt))
    } else if (typeof val === 'object') {
      walkQuizStrings(val)
    }
  }
}

function validateQuiz(quiz, source) {
  const id = quiz.id ?? source
  if (!quiz.topicId) errors.push(`${id}: missing topicId`)
  if (!quiz.chapterId) errors.push(`${id}: missing chapterId`)
  if (!DIFFS.includes(quiz.difficulty)) errors.push(`${id}: invalid difficulty "${quiz.difficulty}"`)
  if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    errors.push(`${id}: no questions`)
    return
  }
  if (quiz.questions.length !== 5 && !quiz.pending) {
    errors.push(`${id}: expected 5 questions, got ${quiz.questions.length}`)
  }
  for (const q of quiz.questions) {
    const qid = `${id} :: ${q.id ?? '?'}`
    if (!q.question?.trim()) errors.push(`${qid}: empty question`)
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push(`${qid}: need exactly 4 options`)
    }
    if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3) {
      errors.push(`${qid}: correctIndex must be 0–3`)
    }
    if (!q.explanation?.trim()) errors.push(`${qid}: missing explanation`)
    else if (!/common mistake/i.test(q.explanation)) {
      errors.push(`${qid}: explanation should include **Common mistake:**`)
    }
  }
}

function normalizeQuiz(raw) {
  const quiz = { ...raw }
  quiz.passPercent = quiz.passPercent ?? 70
  quiz.questionsPerAttempt = quiz.questionsPerAttempt ?? 5
  quiz.pending = quiz.pending ?? false
  quiz.type = quiz.type ?? 'mcq'
  if (!quiz.id && quiz.topicId && quiz.difficulty) {
    quiz.id = `${quiz.topicId}-${quiz.difficulty}`
  }
  walkQuizStrings(quiz)
  return quiz
}

function writeQuiz(quiz) {
  validateQuiz(quiz, quiz.id)
  const fileName = `${quiz.id}.json`
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, fileName), JSON.stringify(quiz, null, 2) + '\n', 'utf8')
  console.log('wrote', fileName)
}

function loadJson(filePath) {
  const text = fs.readFileSync(filePath, 'utf8').trim()
  const data = JSON.parse(text)
  if (Array.isArray(data.quizzes)) return data.quizzes
  if (Array.isArray(data)) return data
  return [data]
}

function importFromPath(inputPath) {
  const stat = fs.statSync(inputPath)
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(inputPath).filter((f) => f.endsWith('.json'))) {
      for (const quiz of loadJson(path.join(inputPath, name))) {
        writeQuiz(normalizeQuiz(quiz))
      }
    }
    return
  }
  for (const quiz of loadJson(inputPath)) {
    writeQuiz(normalizeQuiz(quiz))
  }
}

const arg = process.argv[2]
const input = arg ? path.resolve(arg) : defaultInDir

if (!fs.existsSync(input)) {
  console.error(`Input not found: ${input}`)
  console.error('Create content/incoming/physics-quizzes/ and drop NotebookLM JSON there, or pass a file path.')
  process.exit(1)
}

importFromPath(input)

if (errors.length) {
  console.error(`\n${errors.length} validation issue(s):`)
  for (const e of errors) console.error(' -', e)
  process.exit(1)
}

console.log(`\nDone — physics quizzes in ${outDir}`)
