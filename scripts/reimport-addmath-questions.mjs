/**
 * Re-import Add Maths quizzes from Addmath questions.docx → per-topic quiz JSON.
 * Run: tsx scripts/reimport-addmath-questions.mjs
 * Then: npm run fix:math && node scripts/generateQuizVariants.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import { prepareMathContent } from '../src/lib/mathMarkdown.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const contentRoot = path.join(root, 'content')
const subjectId = 'add-maths-0606'
const QUIZ_FILE = 'Addmath questions.docx'

function parasFromDocx(filename) {
  const src = path.join(root, filename)
  if (!fs.existsSync(src)) throw new Error(`Missing ${filename}`)
  const tmpDir = path.join(root, '.tmp-docx', filename.replace(/[^\w.-]+/g, '_'))
  fs.mkdirSync(tmpDir, { recursive: true })
  const zipPath = path.join(tmpDir, 'doc.zip')
  fs.copyFileSync(src, zipPath)
  const extractDir = path.join(tmpDir, 'extracted')
  if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true })
  fs.mkdirSync(extractDir)
  execSync(
    `powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${extractDir.replace(/'/g, "''")}' -Force"`,
    { stdio: 'pipe' },
  )
  const xml = fs.readFileSync(path.join(extractDir, 'word', 'document.xml'), 'utf8')
  return xml
    .split(/<w:p[ >]/)
    .slice(1)
    .map((p) => [...p.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]).join('').trim())
    .filter(Boolean)
}

function normalizeLabel(text) {
  return text
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/\$[^$]+\$/g, '')
    .replace(/[^\w\s.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function fixQuizLatexText(raw) {
  return prepareMathContent(raw, 'quiz')
}

function writeJson(rel, data) {
  const p = path.join(contentRoot, rel)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

function decodeXmlEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
}

function loadTopics() {
  const dir = path.join(contentRoot, 'topics', subjectId)
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
}

function loadChapters() {
  const dir = path.join(contentRoot, 'chapters', subjectId)
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
    .sort((a, b) => a.number - b.number)
}

const topics = loadTopics()
const chapters = loadChapters()
const topicById = new Map(topics.map((t) => [t.id, t]))
const topicByNormTitle = new Map(topics.map((t) => [normalizeLabel(t.title), t]))

const topicsByNumPrefix = new Map()
for (const t of topics) {
  const m = t.id.match(/^(\d+-\d+)/)
  if (!m) continue
  const key = m[1]
  if (!topicsByNumPrefix.has(key)) topicsByNumPrefix.set(key, [])
  topicsByNumPrefix.get(key).push(t)
}

/** Explicit docx label → topic id overrides */
const QUIZ_LABEL_ALIASES = {
  'domain and range': '1-2-definition-of-a-function',
  'mappings and definition of a function': '1-1-mappings',
  mappings: '1-1-mappings',
  'definition of a function': '1-2-definition-of-a-function',
  'composite functions': '1-3-composite-functions-harder-topic',
  'modulus functions': '1-4-modulus-functions-harder-topic',
  'graphs of y f x where f x is linear': '1-5-graphs-of-y-f-x-where-f-x-is-linear-harder-topic',
  'inverse functions': '1-6-inverse-functions-harder-topic',
  'the graph of a function and its inverse': '1-7-the-graph-of-a-function-and-its-inverse-harder-topic',
  'simultaneous equations one linear and one non linear': '2-1-simultaneous-equations-one-linear-and-one-non-linear',
  'maximum and minimum values of a quadratic function': '2-2-maximum-and-minimum-values-of-a-quadratic-function-h',
  'graphs of y f x where f x is quadratic': '2-3-graphs-of-y-f-x-where-f-x-is-quadratic-harder-topic',
  'quadratic inequalities': '2-4-quadratic-inequalities',
  'roots of quadratic equations': '2-5-roots-of-quadratic-equations',
  'intersection of a line and a curve': '2-6-intersection-of-a-line-and-a-curve-harder-topic',
  'adding subtracting and multiplying polynomials': '3-1-adding-subtracting-and-multiplying-polynomials',
  'division of polynomials': '3-2-division-of-polynomials-harder-topic',
  'the factor theorem': '3-3-the-factor-theorem-harder-topic',
  'cubic expressions and equations': '3-4-cubic-expressions-and-equations-harder-topic',
  'the remainder theorem': '3-5-the-remainder-theorem-harder-topic',
  'solving equations of the form f x g x': '4-1-solving-equations-of-the-type-f-x-g-x',
  'solving modulus inequalities': '4-2-solving-modulus-inequalities',
  'sketching graphs of cubic polynomials and their modulus': '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu',
  'introduction to logarithms': '5-1-introduction-to-logarithms',
  'laws of logarithms': '5-2-laws-of-logarithms-harder-topic',
  'change of base of logarithms': '5-3-change-of-base-of-logarithms',
  'exponential equations': '5-4-exponential-equations-harder-topic',
  'logarithmic equations': '5-4-exponential-equations-harder-topic',
  'natural logarithms and exponential functions': '5-6-natural-logarithms-and-exponential-functions',
  'converting non linear laws to linear form': '5-7-converting-non-linear-laws-to-linear-form',
  'midpoint parallel and perpendicular lines': '6-1-midpoint-parallel-and-perpendicular-lines',
  'midpoint and gradient': '6-1-midpoint-parallel-and-perpendicular-lines',
  'midpoint of a line segment': '6-1-midpoint-parallel-and-perpendicular-lines',
  'parallel lines': '6-1-midpoint-parallel-and-perpendicular-lines',
  'perpendicular lines': '6-1-midpoint-parallel-and-perpendicular-lines',
  'parallel and perpendicular lines': '6-1-midpoint-parallel-and-perpendicular-lines',
  'perpendicular bisector': '6-1-midpoint-parallel-and-perpendicular-lines',
  'perpendicular distances': '6-1-midpoint-parallel-and-perpendicular-lines',
  'algebraic coordinate geometry': '6-1-midpoint-parallel-and-perpendicular-lines',
  'exam style coordinate geometry': '6-2-equations-of-straight-lines',
  'coordinates of a rhombus': '6-2-equations-of-straight-lines',
  'equations of straight lines': '6-2-equations-of-straight-lines',
  'equation of a straight line': '6-2-equations-of-straight-lines',
  'areas of rectilinear figures': '6-3-areas-of-rectilinear-figures',
  'converting from a non linear equation to linear form': '6-4-converting-from-a-non-linear-equation-to-linear-form',
  'finding relationships from data': '6-5-finding-relationships-from-data',
  'the equation of a circle': '7-1-the-equation-of-a-circle',
  'problems involving intersection of lines and circles': '7-2-problems-involving-intersection-of-lines-and-circles',
  'circular measure': '8-1-circular-measure',
  'length of an arc': '8-2-length-of-an-arc-harder-topic',
  'area of a sector': '8-3-area-of-a-sector-harder-topic',
  'basic trigonometry 0 to 90': '9-1-basic-trigonometry-0',
  'angles between 0 and 90': '9-1-basic-trigonometry-0',
  'general angles and the cast diagram': '9-2-9-3-general-angles-and-the-cast-diagram-harder-topic',
  'graphs of trig and modulus functions': '9-4-9-5-graphs-of-trig-and-modulus-functions-harder-topi',
  'reciprocals identities and equations': '9-6-9-9-reciprocals-identities-and-equations-harder-topi',
  'factorial notation': '10-1-factorial-notation',
  arrangements: '10-2-arrangements',
  permutations: '10-3-permutations-harder-topic',
  combinations: '10-4-combinations-harder-topic',
  'pascal s triangle': '11-1-pascal-s-triangle',
  'the binomial theorem': '11-2-the-binomial-theorem-harder-topic',
  'arithmetic progressions': '11-3-arithmetic-progressions-ap-harder-topic',
  'geometric progressions': '11-4-11-5-geometric-progressions-gp-and-infinite-series-h',
  'infinite series': '11-4-11-5-geometric-progressions-gp-and-infinite-series-h',
  'further arithmetic and geometric series': '11-6-further-arithmetic-and-geometric-series',
  'the gradient function': '12-1-the-gradient-function',
  'the chain rule': '12-2-the-chain-rule-harder-topic',
  'the product rule': '12-3-the-product-rule-harder-topic',
  'the quotient rule': '12-4-the-quotient-rule-harder-topic',
  'tangents and normals': '12-5-tangents-and-normals',
  'small increments and approximations': '12-6-small-increments-and-approximations',
  'rates of change': '12-7-rates-of-change-harder-topic',
  'second derivatives': '12-8-second-derivatives',
  'stationary points': '12-9-stationary-points-harder-topic',
  'practical maximum and minimum problems': '12-10-practical-maximum-and-minimum-problems',
  'further vector notation': '13-1-further-vector-notation',
  'position vectors': '13-2-position-vectors',
  'vector geometry': '13-3-vector-geometry-harder-topic',
  'constant velocity problems': '13-4-constant-velocity-problems-harder-topic',
  'derivatives of exponential functions': '14-1-derivatives-of-exponential-functions',
  'derivatives of logarithmic functions': '14-2-derivatives-of-logarithmic-functions-harder-topic',
  'derivatives of trigonometric functions': '14-3-derivatives-of-trigonometric-functions-harder-topic',
  'further applications of differentiation': '14-4-further-applications-of-differentiation-harder-topic',
  'indefinite integrals differentiation reversed': '15-1-15-2-indefinite-integrals-differentiation-reversed',
  'integration of functions of the form ax b': '15-3-integration-of-functions-of-the-form-ax-b',
  'integration of exponential and trig functions': '15-4-15-5-integration-of-exponential-and-trig-functions',
  'integration of 1 x and 1 ax b': '15-6-integration-of',
  'definite integration': '15-8-15-9-definite-integration',
  'further definite integration': '15-8-15-9-definite-integration',
  'area under a curve': '15-8-15-9-definite-integration',
  'area under a curve between regions': '15-10-15-11-area-under-a-curve-between-regions',
  'between regions': '15-10-15-11-area-under-a-curve-between-regions',
  pyp: '15-10-15-11-area-under-a-curve-between-regions',
  'applications of differentiation in kinematics': '16-1-applications-of-differentiation-in-kinematics',
  'applications of integration in kinematics': '16-2-applications-of-integration-in-kinematics-harder-top',
}

function sectionFromTopic(topic) {
  return { topicId: topic.id, chapterId: topic.chapterId, title: topic.title }
}

function mapQuizTopicToSection(topicLabel) {
  const norm = normalizeLabel(topicLabel)
  const normAlt = norm.replace(/\./g, ' ')

  if (QUIZ_LABEL_ALIASES[norm]) {
    const t = topicById.get(QUIZ_LABEL_ALIASES[norm])
    if (t) return sectionFromTopic(t)
  }
  if (normAlt !== norm && QUIZ_LABEL_ALIASES[normAlt]) {
    const t = topicById.get(QUIZ_LABEL_ALIASES[normAlt])
    if (t) return sectionFromTopic(t)
  }

  const nums = [...topicLabel.matchAll(/(\d+\.\d+)/g)].map((m) => m[1])
  const firstPrefix = nums[0]?.replace('.', '-')
  if (firstPrefix && topicsByNumPrefix.has(firstPrefix)) {
    const candidates = topicsByNumPrefix.get(firstPrefix)
    if (candidates.length === 1) return sectionFromTopic(candidates[0])
    const titlePart = norm.replace(/^[\d.\s]+/, '').trim()
    for (const t of candidates) {
      const st = normalizeLabel(t.title)
      if (st === titlePart || st.includes(titlePart) || titlePart.includes(st)) return sectionFromTopic(t)
    }
    return sectionFromTopic(candidates[0])
  }

  if (topicByNormTitle.has(norm)) return sectionFromTopic(topicByNormTitle.get(norm))

  for (const t of topics) {
    const st = normalizeLabel(t.title)
    if (st === norm || st.includes(norm) || norm.includes(st)) return sectionFromTopic(t)
  }

  for (const t of topics) {
    const st = normalizeLabel(t.title)
    const words = norm.split(' ').filter((w) => w.length > 3)
    if (words.length >= 2 && words.every((w) => st.includes(w))) return sectionFromTopic(t)
  }

  if (norm.includes('angles between') && norm.includes('90')) {
    const t = topicById.get('9-1-basic-trigonometry-0')
    if (t) return sectionFromTopic(t)
  }
  if (norm.startsWith('exam style') && norm.includes('coordinate')) {
    const t = topicById.get('6-2-equations-of-straight-lines')
    if (t) return sectionFromTopic(t)
  }

  return null
}

const quizFullText = decodeXmlEntities(parasFromDocx(QUIZ_FILE).join('\n'))
const questionRegex =
  /\{\s*"topic":\s*"([^"]+)",\s*"difficulty":\s*"([^"]+)",\s*"stem":\s*"((?:[^"\\]|\\.)*)",\s*"options":\s*\[((?:[^\]]|\][^,])*)\],\s*"correctIndex":\s*(\d+)(?:,\s*"explanation":\s*"((?:[^"\\]|\\.)*)")?(?:,\s*"commonMistake":\s*"((?:[^"\\]|\\.)*)")?\s*\}/gs

const questionsByTopic = {}
const unmapped = new Map()

let m
while ((m = questionRegex.exec(quizFullText)) !== null) {
  const [, topicLabel, difficulty, stem, optionsRaw, correctIndex, explanation, commonMistake] = m
  const section = mapQuizTopicToSection(topicLabel)
  if (!section) {
    unmapped.set(topicLabel, (unmapped.get(topicLabel) ?? 0) + 1)
    continue
  }

  const topicId = section.topicId
  if (!questionsByTopic[topicId]) {
    questionsByTopic[topicId] = { easy: [], medium: [], hard: [], pyp: [] }
  }

  const options = [...optionsRaw.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((om) =>
    fixQuizLatexText(om[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')),
  )

  let expl = fixQuizLatexText(explanation?.replace(/\\"/g, '"').replace(/\\n/g, '\n') ?? '')
  if (commonMistake) {
    const cm = fixQuizLatexText(commonMistake.replace(/\\"/g, '"').replace(/\\n/g, '\n'))
    expl = expl ? `${expl}\n\n**Common mistake:** ${cm}` : `**Common mistake:** ${cm}`
  }

  const diff = difficulty.toLowerCase()
  if (!['easy', 'medium', 'hard', 'pyp'].includes(diff)) continue
  const list = questionsByTopic[topicId][diff]

  list.push({
    id: `${topicId}-${diff}-q${list.length + 1}`,
    type: 'mcq',
    question: fixQuizLatexText(stem.replace(/\\"/g, '"').replace(/\\n/g, '\n')),
    options,
    correctIndex: parseInt(correctIndex, 10),
    ...(expl ? { explanation: expl } : {}),
  })
}

const topicsDir = path.join(contentRoot, 'topics', subjectId)
fs.mkdirSync(path.join(contentRoot, 'quizzes', subjectId), { recursive: true })

for (const [topicId, tiers] of Object.entries(questionsByTopic)) {
  const topic = topicById.get(topicId)
  if (!topic) continue

  const quizIds = {}
  for (const [diff, questions] of Object.entries(tiers)) {
    if (questions.length === 0) continue
    const quizId = `${topicId}-${diff}`
    quizIds[diff] = quizId
    writeJson(`quizzes/${subjectId}/${quizId}.json`, {
      id: quizId,
      topicId,
      chapterId: topic.chapterId,
      difficulty: diff,
      title: `${topic.title} — ${diff === 'pyp' ? 'PYP Mastery' : diff.charAt(0).toUpperCase() + diff.slice(1)}`,
      passPercent: 70,
      questionsPerAttempt: Math.min(5, questions.length),
      pending: false,
      questions,
    })
  }

  const topicPath = path.join(topicsDir, `${topicId}.json`)
  if (!fs.existsSync(topicPath)) continue
  const topicMeta = JSON.parse(fs.readFileSync(topicPath, 'utf8'))
  topicMeta.quizIds = { ...(topicMeta.quizIds ?? {}), ...quizIds }
  writeJson(`topics/${subjectId}/${topicId}.json`, topicMeta)
}

for (const ch of chapters) {
  if (ch.id.includes('calculator')) continue
  for (const diff of ['easy', 'medium', 'hard', 'pyp']) {
    const merged = []
    for (const topicId of ch.topicIds ?? []) {
      const bucket = questionsByTopic[topicId]
      if (bucket?.[diff]) merged.push(...bucket[diff])
    }
    if (merged.length === 0) continue
    writeJson(`quizzes/${subjectId}/${ch.id}-${diff}.json`, {
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

console.log('Imported topics with quizzes:', Object.keys(questionsByTopic).length)
for (const [topicId, tiers] of Object.entries(questionsByTopic)) {
  const counts = Object.entries(tiers)
    .filter(([, qs]) => qs.length > 0)
    .map(([d, qs]) => `${d}=${qs.length}`)
    .join(', ')
  if (counts) console.log(`  ${topicId}: ${counts}`)
}

if (unmapped.size) {
  console.log('\nUnmapped labels (' + unmapped.size + '):')
  for (const [label, n] of [...unmapped.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${label}: ${n}`)
  }
}

console.log('\nSyncing legacy chapter-navigation topic quizzes from v2 banks…')
execSync('npx tsx scripts/sync-legacy-topic-quizzes.mjs', { stdio: 'inherit', cwd: root })
