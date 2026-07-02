/**
 * Create pending stub quizzes for maths-0580 topics missing quiz JSON files.
 * Run: node scripts/wire-maths-quiz-stubs.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contentRoot = path.join(__dirname, '..', 'content')
const subjectId = 'maths-0580'
const topicsDir = path.join(contentRoot, 'topics', subjectId)
const quizzesDir = path.join(contentRoot, 'quizzes', subjectId)
const DIFFICULTIES = ['easy', 'medium', 'hard', 'pyp']

function writeJson(rel, data) {
  const p = path.join(contentRoot, rel)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

function makeStubQuestion(quizId, index) {
  return {
    id: `${quizId}-stub-${index}`,
    type: 'mcq',
    pending: true,
    question: `Placeholder question ${index} — quiz content pending import.`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctIndex: 0,
    explanation: 'This placeholder will be replaced when quiz content is available.',
  }
}

const topics = fs.readdirSync(topicsDir).filter((f) => f.endsWith('.json'))
let created = 0

for (const file of topics) {
  const topic = JSON.parse(fs.readFileSync(path.join(topicsDir, file), 'utf8'))
  const quizIds = topic.quizIds ?? {}

  for (const diff of DIFFICULTIES) {
    const quizId = quizIds[diff] ?? `${topic.id}-${diff}`
    const quizPath = path.join(quizzesDir, `${quizId}.json`)
    if (fs.existsSync(quizPath)) continue

    const questions = Array.from({ length: 5 }, (_, i) => makeStubQuestion(quizId, i + 1))
    writeJson(`quizzes/${subjectId}/${quizId}.json`, {
      id: quizId,
      topicId: topic.id,
      chapterId: topic.chapterId,
      difficulty: diff,
      title: `${topic.title} — ${diff === 'pyp' ? 'PYP Mastery' : diff.charAt(0).toUpperCase() + diff.slice(1)}`,
      passPercent: 70,
      questionsPerAttempt: 5,
      pending: true,
      questions,
    })
    created++
    console.log('stub:', quizId)
  }
}

console.log(`Created ${created} stub quiz files.`)
