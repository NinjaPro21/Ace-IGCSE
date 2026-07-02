/**
 * Copy full per-section quiz banks from v2 topic IDs onto legacy chapter-navigation
 * topic IDs (the ones linked in chapter.topicIds and shown in the lesson UI).
 *
 * Run: node scripts/sync-legacy-topic-quizzes.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prepareMathContent } from '../src/lib/mathMarkdown.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const contentRoot = path.join(root, 'content')
const subjectId = 'add-maths-0606'
const topicsDir = path.join(contentRoot, 'topics', subjectId)
const quizzesDir = path.join(contentRoot, 'quizzes', subjectId)
const chaptersDir = path.join(contentRoot, 'chapters', subjectId)
const DIFFICULTIES = ['easy', 'medium', 'hard', 'pyp']
const QUESTIONS_PER_ATTEMPT = 5

/** Legacy navigation topic → one or more v2 quiz source topic IDs. */
const LEGACY_V2_SOURCES = {
  '1-mappings-and-definition-of-a-function': ['1-1-mappings', '1-2-definition-of-a-function'],
  '1-modulus-functions-amp-graphs-of-linear': [
    '1-4-modulus-functions-harder-topic',
    '1-5-graphs-of-y-f-x-where-f-x-is-linear-harder-topic',
  ],
  '1-inverse-functions-and-their-graphs': [
    '1-6-inverse-functions-harder-topic',
    '1-7-the-graph-of-a-function-and-its-inverse-harder-topic',
  ],
  '2-simultaneous-equations-linear-and-non-linear': ['2-1-simultaneous-equations-one-linear-and-one-non-linear'],
  '2-graphs-of-quadratic': ['2-3-graphs-of-y-f-x-where-f-x-is-quadratic-harder-topic'],
  '2-roots-of-quadratic-equations-amp-intersection-': [
    '2-5-roots-of-quadratic-equations',
    '2-6-intersection-of-a-line-and-a-curve-harder-topic',
  ],
  '4-solving-equations-of-the-form-f-x-g-x': ['4-1-solving-equations-of-the-type-f-x-g-x'],
  '4-graphs-of-y-f-x-where-f-x-is-quadratic': ['2-3-graphs-of-y-f-x-where-f-x-is-quadratic-harder-topic'],
  '5-exponential-equations': ['5-4-exponential-equations-harder-topic'],
  '5-logarithmic-equations': ['5-4-exponential-equations-harder-topic'],
  '6-linear-law-converting-non-linear-to-linear-for': ['6-4-converting-from-a-non-linear-equation-to-linear-form'],
  '7-intersection-of-lines-and-circles': ['7-2-problems-involving-intersection-of-lines-and-circles'],
  '8-arc-length-and-area-of-a-sector-radians': [
    '8-1-circular-measure',
    '8-2-length-of-an-arc-harder-topic',
    '8-3-area-of-a-sector-harder-topic',
  ],
  '9-trigonometric-ratios-of-general-angles-amp-gra': [
    '9-1-basic-trigonometry-0',
    '9-2-9-3-general-angles-and-the-cast-diagram-harder-topic',
  ],
  '9-graphs-of-modulus-trigonometric-functions': ['9-4-9-5-graphs-of-trig-and-modulus-functions-harder-topi'],
  '9-trigonometric-equations-and-identities': ['9-6-9-9-reciprocals-identities-and-equations-harder-topi'],
  '10-factorial-notation-and-arrangements': ['10-1-factorial-notation', '10-2-arrangements'],
  '10-permutations-and-combinations': ['10-3-permutations-harder-topic', '10-4-combinations-harder-topic'],
  '11-pascal-s-triangle-and-the-binomial-theorem': ['11-1-pascal-s-triangle', '11-2-the-binomial-theorem-harder-topic'],
  '11-arithmetic-progressions': ['11-3-arithmetic-progressions-ap-harder-topic'],
  '11-geometric-progressions-amp-infinite-geometric': [
    '11-4-11-5-geometric-progressions-gp-and-infinite-series-h',
    '11-6-further-arithmetic-and-geometric-series',
  ],
  '12-the-gradient-function-amp-basic-differentiati': [
    '12-1-the-gradient-function',
    '12-2-the-chain-rule-harder-topic',
    '12-3-the-product-rule-harder-topic',
    '12-4-the-quotient-rule-harder-topic',
  ],
  '12-small-increments-approximations-and-rates-of-': [
    '12-6-small-increments-and-approximations',
    '12-7-rates-of-change-harder-topic',
  ],
  '12-stationary-points-and-practical-optimization': [
    '12-9-stationary-points-harder-topic',
    '12-10-practical-maximum-and-minimum-problems',
  ],
  '13-vector-notation-position-vectors-and-geometry': [
    '13-1-further-vector-notation',
    '13-2-position-vectors',
    '13-3-vector-geometry-harder-topic',
  ],
  '14-derivatives-of-exponential-logarithmic-and-tr': [
    '14-1-derivatives-of-exponential-functions',
    '14-2-derivatives-of-logarithmic-functions-harder-topic',
    '14-3-derivatives-of-trigonometric-functions-harder-topic',
  ],
  '15-indefinite-integrals-amp-basic-integration-ru': [
    '15-1-15-2-indefinite-integrals-differentiation-reversed',
    '15-3-integration-of-functions-of-the-form-ax-b',
    '15-4-15-5-integration-of-exponential-and-trig-functions',
    '15-6-integration-of',
  ],
  '15-definite-integration-amp-area-under-a-curve': [
    '15-8-15-9-definite-integration',
    '15-10-15-11-area-under-a-curve-between-regions',
  ],
  '16-applications-of-calculus-in-kinematics': [
    '16-1-applications-of-differentiation-in-kinematics',
    '16-2-applications-of-integration-in-kinematics-harder-top',
  ],
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function writeJson(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

function normalizeTitle(text) {
  return text
    .toLowerCase()
    .replace(/\$[^$]+\$/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function loadTopics() {
  return fs
    .readdirSync(topicsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => readJson(path.join(topicsDir, f)))
}

function resolveV2Sources(legacyTopic, allTopics) {
  if (LEGACY_V2_SOURCES[legacyTopic.id]) return LEGACY_V2_SOURCES[legacyTopic.id]

  const norm = normalizeTitle(legacyTopic.title)
  const exact = allTopics.filter(
    (t) => t.chapterId === legacyTopic.chapterId && t.id !== legacyTopic.id && normalizeTitle(t.title) === norm,
  )
  if (exact.length === 1) return [exact[0].id]
  if (exact.length > 1) return exact.map((t) => t.id)

  return []
}

function fixQuizText(raw) {
  if (typeof raw !== 'string') return raw
  // Only normalize raw docx artefacts — re-running on fixed quizzes corrupts prose ("fraction" → \\frac{tion}{})
  if (/\r?\nfrac|(?<![\\a-zA-Z{])frac\d/.test(raw)) {
    return prepareMathContent(raw, 'quiz')
  }
  return raw
}

function cloneQuestion(q, legacyTopicId, diff, index) {
  const id = `${legacyTopicId}-${diff}-q${index + 1}`
  const next = {
    ...q,
    id,
    question: fixQuizText(q.question),
    options: q.options.map((o) => fixQuizText(o)),
    explanation: q.explanation ? fixQuizText(q.explanation) : undefined,
  }
  if (q.variants?.length) {
    next.variants = q.variants.map((v) => ({
      ...v,
      question: fixQuizText(v.question),
      options: v.options.map((o) => fixQuizText(o)),
      explanation: v.explanation ? fixQuizText(v.explanation) : undefined,
    }))
  }
  delete next.pending
  return next
}

function loadSourceQuestions(sourceIds, diff) {
  const merged = []
  for (const sourceId of sourceIds) {
    const quizPath = path.join(quizzesDir, `${sourceId}-${diff}.json`)
    if (!fs.existsSync(quizPath)) continue
    const quiz = readJson(quizPath)
    const active = (quiz.questions ?? []).filter((q) => !q.pending)
    merged.push(...active)
  }
  return merged
}

const allTopics = loadTopics()
const topicById = new Map(allTopics.map((t) => [t.id, t]))
const chapters = fs
  .readdirSync(chaptersDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => readJson(path.join(chaptersDir, f)))
  .filter((c) => c.subjectId === subjectId)

const legacyTopicIds = new Set(chapters.flatMap((c) => c.topicIds ?? []))
let synced = 0
let skipped = 0
const report = []

for (const legacyId of legacyTopicIds) {
  const legacyTopic = topicById.get(legacyId)
  if (!legacyTopic) continue

  const sourceIds = resolveV2Sources(legacyTopic, allTopics)
  if (sourceIds.length === 0) {
    skipped++
    continue
  }

  const quizIds = {}
  let topicSynced = false

  for (const diff of DIFFICULTIES) {
    const sourceQuestions = loadSourceQuestions(sourceIds, diff)
    if (sourceQuestions.length === 0) continue

    const questions = sourceQuestions.map((q, i) => cloneQuestion(q, legacyId, diff, i))
    const quizId = `${legacyId}-${diff}`
    quizIds[diff] = quizId

    writeJson(path.join(quizzesDir, `${quizId}.json`), {
      id: quizId,
      topicId: legacyId,
      chapterId: legacyTopic.chapterId,
      difficulty: diff,
      title: `${legacyTopic.title} — ${diff === 'pyp' ? 'PYP Mastery' : diff.charAt(0).toUpperCase() + diff.slice(1)}`,
      passPercent: 70,
      questionsPerAttempt: Math.min(QUESTIONS_PER_ATTEMPT, questions.length),
      pending: false,
      questions,
    })
    topicSynced = true
  }

  if (topicSynced) {
    const topicPath = path.join(topicsDir, `${legacyId}.json`)
    const topicMeta = readJson(topicPath)
    topicMeta.quizIds = { ...(topicMeta.quizIds ?? {}), ...quizIds }
    writeJson(topicPath, topicMeta)
    synced++
    report.push(`${legacyId} ← ${sourceIds.join(' + ')}`)
  }
}

// Regenerate chapter review quizzes from synced legacy section banks
for (const ch of chapters) {
  if (ch.id.includes('calculator')) continue
  for (const diff of DIFFICULTIES) {
    const merged = []
    for (const topicId of ch.topicIds ?? []) {
      const quizPath = path.join(quizzesDir, `${topicId}-${diff}.json`)
      if (!fs.existsSync(quizPath)) continue
      const quiz = readJson(quizPath)
      merged.push(...(quiz.questions ?? []).filter((q) => !q.pending))
    }
    if (merged.length === 0) continue
    writeJson(path.join(quizzesDir, `${ch.id}-${diff}.json`), {
      id: `${ch.id}-${diff}`,
      topicId: ch.id,
      chapterId: ch.id,
      difficulty: diff,
      title: `Chapter ${ch.number}: ${ch.title} — ${diff === 'pyp' ? 'PYP' : diff.charAt(0).toUpperCase() + diff.slice(1)}`,
      passPercent: 70,
      questionsPerAttempt: Math.min(10, merged.length),
      pending: false,
      questions: merged.map((q, i) => ({ ...q, id: `${ch.id}-${diff}-q${i + 1}` })),
    })
  }
}

console.log(`Synced ${synced} legacy navigation topics (${skipped} skipped — no v2 source or calculator-only).`)
for (const line of report) console.log(`  ${line}`)
