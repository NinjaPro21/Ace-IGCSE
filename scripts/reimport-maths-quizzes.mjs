/**
 * Re-import quiz JSON from Mathquestions.docx → maths-0580 topic quiz files.
 * Run: node scripts/reimport-maths-quizzes.mjs
 * Then: node scripts/generateQuizVariants.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const contentRoot = path.join(root, 'content')
const subjectId = 'maths-0580'
const QUIZ_FILE = 'Mathquestions.docx'

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

function normalizeLabel(text) {
  return text
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/\$[^$]+\$/g, '')
    .replace(/[^\w\s.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
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
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
}

function loadChapters() {
  const dir = path.join(contentRoot, 'chapters', subjectId)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
}

const topics = loadTopics()
const chapters = loadChapters()
const topicById = new Map(topics.map((t) => [t.id, t]))
const topicByNormTitle = new Map(topics.map((t) => [normalizeLabel(t.title), t]))

/** Build prefix map: "1-1" → topics starting with that prefix */
const topicsByNumPrefix = new Map()
for (const t of topics) {
  const m = t.id.match(/^(\d+-\d+)/)
  if (!m) continue
  const key = m[1]
  if (!topicsByNumPrefix.has(key)) topicsByNumPrefix.set(key, [])
  topicsByNumPrefix.get(key).push(t)
}

function sectionFromTopic(topic) {
  return { topicId: topic.id, chapterId: topic.chapterId, title: topic.title }
}

/** Docx quiz labels → topic id overrides */
const QUIZ_LABEL_ALIASES = {
  '13 6 comparing data sets': '13-2-13-6-averages-comparison',
  '13.6 comparing data sets': '13-2-13-6-averages-comparison',
}

function mapQuizTopicToSection(topicLabel) {
  const norm = normalizeLabel(topicLabel)
  const normAlt = norm.replace(/\./g, ' ')

  if (QUIZ_LABEL_ALIASES[norm]) {
    const t = topicById.get(QUIZ_LABEL_ALIASES[norm])
    if (t) return sectionFromTopic(t)
  }
  if (QUIZ_LABEL_ALIASES[normAlt]) {
    const t = topicById.get(QUIZ_LABEL_ALIASES[normAlt])
    if (t) return sectionFromTopic(t)
  }

  const nums = [...topicLabel.matchAll(/(\d+\.\d+)/g)].map((m) => m[1])
  const firstPrefix = nums[0]?.replace('.', '-')

  if (firstPrefix && topicsByNumPrefix.has(firstPrefix)) {
    const candidates = topicsByNumPrefix.get(firstPrefix)
    if (candidates.length === 1) return sectionFromTopic(candidates[0])

    const titlePart = norm.replace(/^[\d.\s&and]+/, '').trim()
    for (const t of candidates) {
      const st = normalizeLabel(t.title)
      if (st === titlePart || st.includes(titlePart) || titlePart.includes(st)) {
        return sectionFromTopic(t)
      }
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

  return null
}

const quizParas = parasFromDocx(QUIZ_FILE)
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
fs.mkdirSync(quizzesDir, { recursive: true })

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
  const sectionIds = ch.topicIds ?? []
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
