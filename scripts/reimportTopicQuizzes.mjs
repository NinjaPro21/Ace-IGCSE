/**
 * Re-import quiz JSON from Notes (1).docx → per-section topic quiz files.
 * Maps each question's "topic" label to the matching note section (not whole chapter).
 *
 * Run: node scripts/reimportTopicQuizzes.mjs
 * Then: node scripts/generateQuizVariants.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const contentRoot = path.join(root, 'content')
const subjectId = 'add-maths-0606'

function parasFromDocx(filename) {
  const src = path.join(root, filename)
  const tmpDir = path.join(root, '.tmp-docx', filename.replace(/\s/g, '_'))
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
    .map((p) => {
      const ts = [...p.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1])
      return ts.join('').trim()
    })
    .filter(Boolean)
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\$[^$]+\$/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
}

function cleanText(t) {
  return t
    .replace(/\[cite_start\]/g, '')
    .replace(/\uFFFD/g, '')
    .replace(/â€™/g, "'")
    .replace(/â€"/g, '—')
    .replace(/Â/g, '')
    .trim()
}

function normalizeLabel(text) {
  return text
    .toLowerCase()
    .replace(/\$[^$]+\$/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function writeJson(rel, data) {
  const p = path.join(contentRoot, rel)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

// ── Load chapters + sections from Notes.docx (same as full import) ──
const notesParas = parasFromDocx('Notes .docx').map(cleanText)
const chapters = []
let currentChapter = null
let inSyllabus = false

for (const line of notesParas) {
  if (line.startsWith('Syllabus Map')) {
    inSyllabus = true
    continue
  }
  if (inSyllabus && line.startsWith('Module 1:')) break
  if (!inSyllabus) continue

  const chMatch = line.match(/^Chapter (\d+):\s*(.+)$/)
  if (chMatch) {
    const num = parseInt(chMatch[1], 10)
    const title = chMatch[2]
    const id = `ch${String(num).padStart(2, '0')}-${slugify(title)}`
    currentChapter = { number: num, id, title, syllabusTopics: [] }
    chapters.push(currentChapter)
    continue
  }

  if (currentChapter && !line.match(/^\d+\./) && line.length < 100 && !line.includes('IGCSE')) {
    currentChapter.syllabusTopics.push(line)
  }
}

const noteSections = []
let currentSection = null
let inNotes = false

for (const line of notesParas) {
  if (line.startsWith('Module 1:')) inNotes = true
  if (!inNotes) continue

  const secMatch = line.match(/^(\d+)\.(\d+)\s+(.+)$/)
  if (secMatch) {
    if (currentSection) noteSections.push(currentSection)
    const chNum = parseInt(secMatch[1], 10)
    const secNum = parseInt(secMatch[2], 10)
    const title = secMatch[3]
    const ch = chapters.find((c) => c.number === chNum)
    currentSection = {
      chapterNumber: chNum,
      chapterId: ch?.id ?? `ch${String(chNum).padStart(2, '0')}`,
      sectionNumber: secNum,
      title,
      topicId: slugify(`${chNum}-${title}`) || `ch${chNum}-s${secNum}`,
    }
    continue
  }
}

if (currentSection) noteSections.push(currentSection)

// ── Build label → section map ──
const sectionByNorm = new Map()
for (const section of noteSections) {
  sectionByNorm.set(normalizeLabel(section.title), section)
}

/** Quiz labels that belong to a note section (not always identical titles). */
const QUIZ_LABEL_TO_TOPIC_ID = {
  'domain and range': '1-mappings-and-definition-of-a-function',
  'mappings and definition of a function': '1-mappings-and-definition-of-a-function',
  'composite functions': '1-composite-functions',
  'inverse functions': '1-inverse-functions-and-their-graphs',
  'graphs of y f x where f x is linear': '1-modulus-functions-amp-graphs-of-linear',
  'graphs of modulus quadratic functions': '4-graphs-of-y-f-x-where-f-x-is-quadratic',
  'graphs of y f x where f x is quadratic': '4-graphs-of-y-f-x-where-f-x-is-quadratic',
  'simultaneous equations': '2-simultaneous-equations-linear-and-non-linear',
  'maximum and minimum values of a quadratic function': '2-maximum-and-minimum-values-of-a-quadratic-func',
  'quadratic inequalities': '2-quadratic-inequalities',
  'roots of quadratic equations': '2-roots-of-quadratic-equations-amp-intersection-',
  'intersection of a line and a curve': '2-roots-of-quadratic-equations-amp-intersection-',
  'adding subtracting and multiplying polynomials': '3-adding-subtracting-and-multiplying-polynomials',
  'division of polynomials': '3-division-of-polynomials',
  'the factor theorem': '3-the-factor-theorem',
  'the remainder theorem': '3-the-remainder-theorem',
  'cubic expressions and equations': '3-cubic-expressions-and-equations',
  'solving equations of the form f x g x': '4-solving-equations-of-the-form-f-x-g-x',
  'solving modulus inequalities': '4-solving-modulus-inequalities',
  'introduction to logarithms': '5-introduction-to-logarithms',
  'laws of logarithms': '5-laws-of-logarithms',
  'change of base of logarithms': '5-change-of-base-of-logarithms',
  'exponential equations': '5-exponential-equations',
  'logarithmic equations': '5-logarithmic-equations',
  'length of a line segment': '6-midpoint-parallel-and-perpendicular-lines',
  'midpoint of a line segment': '6-midpoint-parallel-and-perpendicular-lines',
  'gradient of a line': '6-equations-of-straight-lines',
  'parallel lines': '6-midpoint-parallel-and-perpendicular-lines',
  'perpendicular lines': '6-midpoint-parallel-and-perpendicular-lines',
  'parallel and perpendicular lines': '6-midpoint-parallel-and-perpendicular-lines',
  'equation of a straight line': '6-equations-of-straight-lines',
  'equations of straight lines': '6-equations-of-straight-lines',
  'area of rectilinear figures': '6-areas-of-rectilinear-figures',
  'linear law converting non linear to linear form': '6-linear-law-converting-non-linear-to-linear-for',
  'equation of a circle': '7-the-equation-of-a-circle',
  'center and radius of a circle': '7-the-equation-of-a-circle',
  'intersection of a line and a circle': '7-intersection-of-lines-and-circles',
  'intersection of lines and circles': '7-intersection-of-lines-and-circles',
  'radians arc length and sector area': '8-arc-length-and-area-of-a-sector-radians',
  'trigonometric ratios of general angles': '9-trigonometric-ratios-of-general-angles-amp-gra',
  'trigonometric graphs': '9-graphs-of-modulus-trigonometric-functions',
  'trigonometric equations': '9-trigonometric-equations-and-identities',
  'trigonometric identities': '9-trigonometric-equations-and-identities',
  'factorial notation': '10-factorial-notation-and-arrangements',
  arrangements: '10-factorial-notation-and-arrangements',
  permutations: '10-permutations-and-combinations',
  combinations: '10-permutations-and-combinations',
  'permutations and combinations': '10-permutations-and-combinations',
  'pascal s triangle': '11-pascal-s-triangle-and-the-binomial-theorem',
  'the binomial theorem': '11-pascal-s-triangle-and-the-binomial-theorem',
  'arithmetic progressions': '11-arithmetic-progressions',
  'geometric progressions': '11-geometric-progressions-amp-infinite-geometric',
  'infinite geometric series': '11-geometric-progressions-amp-infinite-geometric',
  differentiation: '12-the-gradient-function-amp-basic-differentiati',
  'the gradient function': '12-the-gradient-function-amp-basic-differentiati',
  'equation of a tangent': '12-tangents-and-normals',
  'equation of a normal': '12-tangents-and-normals',
  'tangents and normals': '12-tangents-and-normals',
  'stationary points': '12-stationary-points-and-practical-optimization',
  'small increments approximations and rates of change': '12-small-increments-approximations-and-rates-of-',
  vectors: '13-vector-notation-position-vectors-and-geometry',
  'further differentiation': '14-derivatives-of-exponential-logarithmic-and-tr',
  'derivatives of exponential logarithmic and trigonometric functions': '14-derivatives-of-exponential-logarithmic-and-tr',
  'indefinite integrals': '15-indefinite-integrals-amp-basic-integration-ru',
  'definite integration': '15-definite-integration-amp-area-under-a-curve',
  'area under a curve': '15-definite-integration-amp-area-under-a-curve',
  'applications of differentiation in kinematics': '16-applications-of-calculus-in-kinematics',
  'applications of integration in kinematics': '16-applications-of-calculus-in-kinematics',
  'constant velocity problems': '13-constant-velocity-problems',
  'area of regions bounded by a line and a curve': '15-definite-integration-amp-area-under-a-curve',
  'collinear points': '6-midpoint-parallel-and-perpendicular-lines',
  'equations of geometric figures': '6-equations-of-straight-lines',
  'further arithmetic and geometric series': '11-geometric-progressions-amp-infinite-geometric',
  'further definite integration': '15-definite-integration-amp-area-under-a-curve',
  'further indefinite integration': '15-indefinite-integrals-amp-basic-integration-ru',
  'differentiation reversed': '15-indefinite-integrals-amp-basic-integration-ru',
  'integration of exponential functions': '15-indefinite-integrals-amp-basic-integration-ru',
  'integration of functions of the form ax b n': '15-indefinite-integrals-amp-basic-integration-ru',
  'integration of functions of the form 1 x and 1 ax b': '15-indefinite-integrals-amp-basic-integration-ru',
  'integration of sine and cosine functions': '15-indefinite-integrals-amp-basic-integration-ru',
  'perpendicular bisector': '6-midpoint-parallel-and-perpendicular-lines',
  'properties of chords': '7-intersection-of-lines-and-circles',
  'properties of tangents': '7-intersection-of-lines-and-circles',
  'secant cosecant and cotangent ratios': '9-trigonometric-ratios-of-general-angles-amp-gra',
  'graphs of y f x where f x is linear': '1-modulus-functions-amp-graphs-of-linear',
  'modulus functions': '1-modulus-functions-amp-graphs-of-linear',
  'stationary points': '12-stationary-points-and-practical-optimization',
  'practical optimization': '12-stationary-points-and-practical-optimization',
  'small increments approximations and rates of change': '12-small-increments-approximations-and-rates-of-',
  'graphs of quadratic': '2-graphs-of-quadratic',
  'linear law converting non linear to linear form': '6-linear-law-converting-non-linear-to-linear-for',
  'integration of functions of the form ax b n': '15-indefinite-integrals-amp-basic-integration-ru',
}

function findSectionByTopicId(topicId) {
  return noteSections.find((s) => s.topicId === topicId)
}

/** Load v2 topic JSON (current canonical ids). */
function loadV2Topics() {
  const dir = path.join(contentRoot, 'topics', subjectId)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
}

const v2Topics = loadV2Topics()
const v2TopicById = new Map(v2Topics.map((t) => [t.id, t]))
const v2TopicByNormTitle = new Map(v2Topics.map((t) => [normalizeLabel(t.title), t]))

/** Docx quiz labels → v2 topic id (includes merged sections). */
const QUIZ_LABEL_TO_V2_ID = {
  'exponential equations': '5-4-exponential-equations-harder-topic',
  'logarithmic equations': '5-4-exponential-equations-harder-topic',
  'exponential and logarithmic equations': '5-4-exponential-equations-harder-topic',
  'natural logarithms and exponential functions': '5-6-natural-logarithms-and-exponential-functions',
  'converting non linear laws to linear form': '5-7-converting-non-linear-laws-to-linear-form',
  'linear law converting non linear to linear form': '5-7-converting-non-linear-laws-to-linear-form',
}

function sectionFromV2Topic(topic) {
  return { topicId: topic.id, chapterId: topic.chapterId, title: topic.title }
}

function mapQuizTopicToSection(topicLabel) {
  const norm = normalizeLabel(topicLabel)
  const normAlt = norm.replace(/ⁿ/g, 'n')

  if (QUIZ_LABEL_TO_V2_ID[norm]) {
    const t = v2TopicById.get(QUIZ_LABEL_TO_V2_ID[norm])
    if (t) return sectionFromV2Topic(t)
  }
  if (normAlt !== norm && QUIZ_LABEL_TO_V2_ID[normAlt]) {
    const t = v2TopicById.get(QUIZ_LABEL_TO_V2_ID[normAlt])
    if (t) return sectionFromV2Topic(t)
  }

  if (v2TopicByNormTitle.has(norm)) {
    return sectionFromV2Topic(v2TopicByNormTitle.get(norm))
  }

  for (const t of v2Topics) {
    const st = normalizeLabel(t.title)
    if (st === norm || st.includes(norm) || norm.includes(st)) return sectionFromV2Topic(t)
  }

  for (const t of v2Topics) {
    const st = normalizeLabel(t.title)
    const words = norm.split(' ').filter((w) => w.length > 3)
    if (words.length >= 2 && words.every((w) => st.includes(w))) return sectionFromV2Topic(t)
  }

  // Legacy fallback
  if (QUIZ_LABEL_TO_TOPIC_ID[norm]) {
    const section = findSectionByTopicId(QUIZ_LABEL_TO_TOPIC_ID[norm])
    if (section) {
      const v2 = v2TopicById.get(section.topicId)
      if (v2) return sectionFromV2Topic(v2)
      return section
    }
  }
  if (sectionByNorm.has(norm)) {
    const section = sectionByNorm.get(norm)
    const v2 = v2TopicById.get(section.topicId)
    if (v2) return sectionFromV2Topic(v2)
    return section
  }

  for (const section of noteSections) {
    const st = normalizeLabel(section.title)
    if (st === norm || st.includes(norm) || norm.includes(st)) {
      const v2 = v2Topics.find((t) => normalizeLabel(t.title) === st || t.id.includes(String(section.sectionNumber)))
      if (v2) return sectionFromV2Topic(v2)
      return section
    }
  }

  return null
}

function decodeXmlEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
}

const quizParas = parasFromDocx('Notes  (1).docx')
const quizFullText = decodeXmlEntities(quizParas.join('\n'))

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
    om[1].replace(/\\"/g, '"').replace(/\\n/g, '\n'),
  )

  let expl = explanation?.replace(/\\"/g, '"').replace(/\\n/g, '\n') ?? ''
  if (commonMistake) {
    const cm = commonMistake.replace(/\\"/g, '"').replace(/\\n/g, '\n')
    expl = expl ? `${expl}\n\n**Common mistake:** ${cm}` : `**Common mistake:** ${cm}`
  }

  const diff = difficulty.toLowerCase()
  const list = questionsByTopic[topicId][diff]
  if (!list) continue

  list.push({
    id: `${topicId}-${diff}-q${list.length + 1}`,
    type: 'mcq',
    question: stem.replace(/\\"/g, '"').replace(/\\n/g, '\n'),
    options,
    correctIndex: parseInt(correctIndex, 10),
    ...(expl ? { explanation: expl } : {}),
  })
}

const quizzesDir = path.join(contentRoot, 'quizzes', subjectId)
const topicsDir = path.join(contentRoot, 'topics', subjectId)

// Remove stale split artifacts (chapter-only files stay for chapter-review merge)
for (const file of fs.readdirSync(quizzesDir)) {
  if (!file.endsWith('.json')) continue
  if (file.startsWith('ch') && file.match(/^ch\d{2}-/)) continue
  // topic quiz files — will be rewritten
}

for (const [topicId, tiers] of Object.entries(questionsByTopic)) {
  const section = findSectionByTopicId(topicId)
  if (!section) continue
  const ch = chapters.find((c) => c.id === section.chapterId)

  const quizIds = {}
  for (const [diff, questions] of Object.entries(tiers)) {
    if (questions.length === 0) continue
    const quizId = `${topicId}-${diff}`
    quizIds[diff] = quizId
    writeJson(`quizzes/${subjectId}/${quizId}.json`, {
      id: quizId,
      topicId,
      chapterId: section.chapterId,
      difficulty: diff,
      title: `${section.title} — ${diff === 'pyp' ? 'PYP Mastery' : diff.charAt(0).toUpperCase() + diff.slice(1)}`,
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

// Regenerate chapter merged files for /quiz/chapterId/diff route
for (const ch of chapters) {
  const sectionIds = noteSections.filter((s) => s.chapterId === ch.id).map((s) => s.topicId)
  for (const diff of ['easy', 'medium', 'hard', 'pyp']) {
    const merged = []
    for (const topicId of sectionIds) {
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
      questions: merged.map((q, i) => ({ ...q, id: `${ch.id}-${diff}-q${i + 1}` })),
    })
  }
}

console.log('Sections with quizzes:', Object.keys(questionsByTopic).length)
for (const [topicId, tiers] of Object.entries(questionsByTopic)) {
  const counts = Object.entries(tiers)
    .filter(([, qs]) => qs.length > 0)
    .map(([d, qs]) => `${d}=${qs.length}`)
    .join(', ')
  if (counts) console.log(`  ${topicId}: ${counts}`)
}

if (unmapped.size) {
  console.log('Unmapped quiz labels:')
  for (const [label, n] of [...unmapped.entries()].sort()) {
    console.log(`  ${label}: ${n}`)
  }
}
