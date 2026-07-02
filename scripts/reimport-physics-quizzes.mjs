/**
 * Import physics quizzes from physicsquestions.docx → content/quizzes/physics/
 * Run: npm run import:physics:quizzes:docx
 * Then: npm run fix:math -- physics && npm run verify:physics:quizzes
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import { prepareMathContent } from '../src/lib/mathMarkdown.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const contentRoot = path.join(root, 'content')
const subjectId = 'physics'
const QUIZ_FILE = 'physicsquestions.docx'

function parasFromDocx(filename) {
  const src = path.join(root, filename)
  if (!fs.existsSync(src)) throw new Error(`Missing ${filename} in project root`)
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
    .map((p) => [...p.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]).join('').trim())
    .filter(Boolean)
}

function decodeXmlEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
}

function writeJson(rel, data) {
  const p = path.join(contentRoot, rel)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

function fixQuizText(raw) {
  return prepareMathContent(raw, 'quiz')
}

function readQuotedField(block, fieldName) {
  const marker = `"${fieldName}"`
  const idx = block.indexOf(marker)
  if (idx === -1) return ''
  const colon = block.indexOf(':', idx + marker.length)
  if (colon === -1) return ''
  let i = block.indexOf('"', colon + 1)
  if (i === -1) return ''
  i += 1
  let out = ''
  while (i < block.length) {
    const c = block[i]
    if (c === '\\' && i + 1 < block.length) {
      out += block[i + 1]
      i += 2
      continue
    }
    if (c === '"') {
      const tail = block.slice(i + 1).match(/^\s*([,}\]])/)
      if (tail) return out
    }
    out += c
    i += 1
  }
  return out
}

function readOptionsArray(block) {
  const m = block.match(/"options"\s*:\s*\[([\s\S]*?)\]\s*,\s*"correctIndex"/)
  if (!m) return []
  const inner = m[1]
  const options = []
  let i = 0
  while (i < inner.length) {
    while (i < inner.length && inner[i] !== '"') i += 1
    if (i >= inner.length) break
    i += 1
    let opt = ''
    while (i < inner.length) {
      const c = inner[i]
      if (c === '\\' && i + 1 < inner.length) {
        opt += inner[i + 1]
        i += 2
        continue
      }
      if (c === '"') {
        options.push(opt)
        i += 1
        break
      }
      opt += c
      i += 1
    }
  }
  return options
}

function readIntField(block, fieldName) {
  const m = block.match(new RegExp(`"${fieldName}"\\s*:\\s*(\\d+)`))
  return m ? parseInt(m[1], 10) : 0
}

function normalizeExplanation(expl) {
  if (!expl?.trim()) return ''
  let text = expl.trim()
  if (!/\*\*Common mistake:\*\*/i.test(text) && /common mistake:/i.test(text)) {
    text = text.replace(/Common mistake:\s*/i, '\n\n**Common mistake:** ')
  }
  if (!/\*\*Common mistake:\*\*/i.test(text)) {
    text = `${text}\n\n**Common mistake:** Review the method above and check units/signs.`
  }
  return fixQuizText(text)
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
const topicBySubtitle = new Map(topics.map((t) => [t.subtitle, t]))
const chapterByNumber = new Map(chapters.map((c) => [String(c.number), c]))

/** Docx topicId (e.g. 5.1) → topic when subtitle alone is ambiguous */
const SUBTITLE_ALIASES = {
  '5.1': '5-1-what-is-momentum',
  '6.3': '6-3-energy-resources',
  '8.1': '8-1-the-states-of-matter',
  '12.3': '12-3-total-internal-reflection',
  '13.3': '13-3-electromagnetic-radiation-in-communication',
  '14.4': '14-4-pitch-and-loudness',
}

function resolveTopic(docxTopicId) {
  const alias = SUBTITLE_ALIASES[docxTopicId]
  if (alias) {
    const t = topicById.get(alias)
    if (t) return t
  }
  const bySub = topicBySubtitle.get(docxTopicId)
  if (bySub) return bySub
  const prefix = docxTopicId.replace('.', '-')
  for (const t of topics) {
    if (t.id.startsWith(prefix + '-')) return t
  }
  return null
}

function extractQuizTiers(text) {
  const tierRe = /"id":\s*"(\d+\.\d+-(?:easy|medium|hard|pyp))"(?=,\s*"topicId")/g
  const matches = [...text.matchAll(tierRe)]
  const tiers = []

  for (let i = 0; i < matches.length; i++) {
    const blockStart = matches[i].index
    const blockEnd = i + 1 < matches.length ? matches[i + 1].index : text.length
    const block = text.slice(blockStart, blockEnd)

    const tierId = matches[i][1]
    const docxTopicId = block.match(/"topicId":\s*"([^"]+)"/)?.[1]
    const chapterNum = block.match(/"chapterId":\s*"([^"]+)"/)?.[1]
    const difficulty = block.match(/"difficulty":\s*"([^"]+)"/)?.[1]?.toLowerCase()
    if (!docxTopicId || !difficulty) continue
    const questionsStart = block.indexOf('"questions"')
    const questionsBlock = questionsStart >= 0 ? block.slice(questionsStart) : block

    const qIdRe = /"id":\s*"(\d+\.\d+-(?:easy|medium|hard|pyp)-q\d+)"/g
    const qMatches = [...questionsBlock.matchAll(qIdRe)]

    const questions = []
    for (let qi = 0; qi < qMatches.length; qi++) {
      const qStart = qMatches[qi].index
      const qEnd = qi + 1 < qMatches.length ? qMatches[qi + 1].index : questionsBlock.length
      const qBlock = questionsBlock.slice(qStart, qEnd)
      const question = readQuotedField(qBlock, 'question')
      const options = readOptionsArray(qBlock)
      const correctIndex = readIntField(qBlock, 'correctIndex')
      const explanation = readQuotedField(qBlock, 'explanation')
      if (!question || options.length < 4) continue
      questions.push({
        id: qMatches[qi][1],
        type: 'mcq',
        question: fixQuizText(question),
        options: options.map((o) => fixQuizText(o)),
        correctIndex,
        explanation: normalizeExplanation(explanation),
      })
    }

    tiers.push({
      tierId,
      docxTopicId,
      chapterNum,
      difficulty,
      questions,
    })
  }

  return tiers
}

const rawText = decodeXmlEntities(parasFromDocx(QUIZ_FILE).join(''))
const tiers = extractQuizTiers(rawText)

const questionsByTopic = {}
const unmapped = new Map()
let writtenQuizzes = 0
let writtenQuestions = 0

for (const tier of tiers) {
  const topic = resolveTopic(tier.docxTopicId)
  if (!topic) {
    unmapped.set(tier.docxTopicId, (unmapped.get(tier.docxTopicId) ?? 0) + tier.questions.length)
    continue
  }
  if (tier.questions.length === 0) continue

  const diff = tier.difficulty
  if (!['easy', 'medium', 'hard', 'pyp'].includes(diff)) continue

  if (!questionsByTopic[topic.id]) {
    questionsByTopic[topic.id] = { easy: [], medium: [], hard: [], pyp: [] }
  }

  const list = questionsByTopic[topic.id][diff]
  for (const q of tier.questions) {
    list.push({
      ...q,
      id: `${topic.id}-${diff}-q${list.length + 1}`,
    })
  }
}

const quizzesDir = path.join(contentRoot, 'quizzes', subjectId)
const topicsDir = path.join(contentRoot, 'topics', subjectId)
fs.mkdirSync(quizzesDir, { recursive: true })

for (const [topicId, tierBuckets] of Object.entries(questionsByTopic)) {
  const topic = topicById.get(topicId)
  if (!topic) continue

  const quizIds = {}
  for (const [diff, questions] of Object.entries(tierBuckets)) {
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
    writtenQuizzes += 1
    writtenQuestions += questions.length
  }

  const topicPath = path.join(topicsDir, `${topicId}.json`)
  if (!fs.existsSync(topicPath)) continue
  const topicMeta = JSON.parse(fs.readFileSync(topicPath, 'utf8'))
  topicMeta.quizIds = { ...(topicMeta.quizIds ?? {}), ...quizIds }
  writeJson(`topics/${subjectId}/${topicId}.json`, topicMeta)
}

for (const ch of chapters) {
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

console.log(`\nImported ${writtenQuizzes} quiz files (${writtenQuestions} questions) for ${Object.keys(questionsByTopic).length} topics`)
for (const [topicId, tierBuckets] of Object.entries(questionsByTopic)) {
  const counts = Object.entries(tierBuckets)
    .filter(([, qs]) => qs.length > 0)
    .map(([d, qs]) => `${d}=${qs.length}`)
    .join(', ')
  if (counts) console.log(`  ${topicId}: ${counts}`)
}

if (unmapped.size) {
  console.log('\nUnmapped docx topicIds:')
  for (const [label, n] of [...unmapped.entries()].sort()) {
    console.log(`  ${label}: ${n} questions skipped`)
  }
}

console.log(`\nRaw tier blocks parsed: ${tiers.length}`)
