/**
 * Wire every subtopic to 4 quiz tiers (easy/medium/hard/pyp).
 * Creates stub quiz JSON (5 questions per attempt) ready for docx re-import.
 *
 * Run: node scripts/wire-topic-quizzes.mjs
 * Then (when docx ready): node scripts/reimportTopicQuizzes.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const contentRoot = path.join(root, 'content')
const subjectId = 'add-maths-0606'
const topicsDir = path.join(contentRoot, 'topics', subjectId)
const quizzesDir = path.join(contentRoot, 'quizzes', subjectId)
const DIFFICULTIES = ['easy', 'medium', 'hard', 'pyp']
const QUESTIONS_PER_TIER = 5

/** Old quiz topicId prefixes → new v2 topic id (for migrating existing question banks). */
const LEGACY_TOPIC_ALIASES = {
  '5-4-exponential-equations-harder-topic': ['5-exponential-equations', '5-logarithmic-equations'],
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function writeJson(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

function tierTitle(topicTitle, diff) {
  const label = diff === 'pyp' ? 'PYP Mastery' : diff.charAt(0).toUpperCase() + diff.slice(1)
  return `${topicTitle} — ${label}`
}

function findLegacyQuiz(legacyTopicId, diff) {
  const candidate = path.join(quizzesDir, `${legacyTopicId}-${diff}.json`)
  return fs.existsSync(candidate) ? readJson(candidate) : null
}

function mergeLegacyQuestions(topicId, diff) {
  const aliases = LEGACY_TOPIC_ALIASES[topicId] ?? []
  const merged = []
  for (const legacyId of aliases) {
    const quiz = findLegacyQuiz(legacyId, diff)
    if (quiz?.questions?.length) merged.push(...quiz.questions)
  }
  return merged
}

function makeStubQuestion(topicId, diff, index) {
  const id = `${topicId}-${diff}-stub-${index}`
  return {
    id,
    type: 'mcq',
    pending: true,
    question: `Placeholder question ${index} — import from docx to replace.`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctIndex: 0,
    explanation: 'This placeholder will be replaced when quiz content is imported from the authoring docx.',
  }
}

function ensureQuizFile(topic, diff) {
  const quizId = `${topic.id}-${diff}`
  const quizPath = path.join(quizzesDir, `${quizId}.json`)

  let questions = mergeLegacyQuestions(topic.id, diff)
  if (questions.length) {
    questions = questions.map((q, i) => ({
      ...q,
      id: q.id?.includes(topic.id) ? q.id : `${quizId}-q${i + 1}`,
    }))
  }

  const existing = fs.existsSync(quizPath) ? readJson(quizPath) : null
  const existingActive = (existing?.questions ?? []).filter((q) => !q.pending)
  if (existingActive.length >= QUESTIONS_PER_TIER && !existing?.pending) {
    return { quizId, created: false, count: existingActive.length }
  }

  if (!questions.length && existing?.questions?.length) {
    questions = existing.questions
  }

  while (questions.length < QUESTIONS_PER_TIER) {
    questions.push(makeStubQuestion(topic.id, diff, questions.length + 1))
  }

  const pending = questions.every((q) => q.pending)
  const quiz = {
    id: quizId,
    topicId: topic.id,
    chapterId: topic.chapterId,
    difficulty: diff,
    title: tierTitle(topic.title, diff),
    passPercent: 70,
    questionsPerAttempt: QUESTIONS_PER_TIER,
    pending,
    questions,
  }

  writeJson(quizPath, quiz)
  return { quizId, created: true, count: questions.length, pending }
}

const topicFiles = fs.readdirSync(topicsDir).filter((f) => f.endsWith('.json'))
let wired = 0
let stubs = 0

for (const file of topicFiles) {
  const topicPath = path.join(topicsDir, file)
  const topic = readJson(topicPath)
  const quizIds = { ...(topic.quizIds ?? {}) }

  for (const diff of DIFFICULTIES) {
    const { quizId, created, pending } = ensureQuizFile(topic, diff)
    quizIds[diff] = quizId
    if (created && pending) stubs++
  }

  topic.quizIds = quizIds
  writeJson(topicPath, topic)
  wired++
}

console.log(`Wired quizIds on ${wired} topics.`)
console.log(`Stub quiz tiers created/updated: ${stubs} (pending docx import).`)
console.log(`Target: ${QUESTIONS_PER_TIER} questions per tier per subtopic.`)
