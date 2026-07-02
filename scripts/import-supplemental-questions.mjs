/**
 * Merge gap-fill questions from questions.docx into existing quiz JSON (both subjects).
 * Run: node scripts/import-supplemental-questions.mjs
 * Then: node scripts/fix-content-math.mjs && node scripts/generateQuizVariants.mjs && npm run quiz:validate
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prepareMathContent } from '../src/lib/mathMarkdown.ts'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentRoot = path.join(root, 'content')
const QUIZ_FILE = 'questions.docx'
const DIFFS = ['easy', 'medium', 'hard', 'pyp']

function parasFromDocx(filename) {
  const src = path.join(root, filename)
  const tmpDir = path.join(root, '.tmp-docx', 'supplemental')
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

function normalizeLabel(text) {
  return text
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/\$[^$]+\$/g, '')
    .replace(/[^\w\s./-]/g, ' ')
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

function loadSubject(subjectId) {
  const topicsDir = path.join(contentRoot, 'topics', subjectId)
  const chaptersDir = path.join(contentRoot, 'chapters', subjectId)
  const topics = fs
    .readdirSync(topicsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(topicsDir, f), 'utf8')))
  const chapters = fs
    .readdirSync(chaptersDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(chaptersDir, f), 'utf8')))
    .sort((a, b) => a.number - b.number)
  return {
    subjectId,
    topics,
    chapters,
    topicById: new Map(topics.map((t) => [t.id, t])),
    topicByNormTitle: new Map(topics.map((t) => [normalizeLabel(t.title), t])),
    topicsByNumPrefix: buildPrefixMap(topics),
  }
}

function buildPrefixMap(topics) {
  const map = new Map()
  for (const t of topics) {
    const m = t.id.match(/^(\d+-\d+)/)
    if (!m) continue
    if (!map.has(m[1])) map.set(m[1], [])
    map.get(m[1]).push(t)
  }
  return map
}

/** Label → topic id (normalized keys) */
const LABEL_ALIASES = {
  // maths-0580
  '1 5 approximations': 'maths-0580::1-5-approximations-and-estimation',
  '1 9 calculator': 'maths-0580::1-9-calculator',
  '6 1 factorising': 'maths-0580::6-1-factorising',
  '6 4 non linear simultaneous': 'maths-0580::6-4-nonlinear-simultaneous-equations',
  '8 1 algebraic fractions': 'maths-0580::8-1-algebraic-fractions',
  '8 5 inequalities': 'maths-0580::8-5-inequalities',
  '9 1 linear graphs drawing and intercepts': 'maths-0580::9-1-linear-graphs',
  '4 3 bearings': 'maths-0580::4-3-4-5-bearings-scale-drawing',
  '4 6 3d trigonometry': 'maths-0580::4-6-three-dimensional-trigonometry',
  '5 5 volume and surface area': 'maths-0580::5-5-5-6-volume-surface-area',
  // add-maths-0606
  '5 4 exponential equations': 'add-maths-0606::5-4-exponential-equations-harder-topic',
  '6 1 midpoint parallel perpendicular': 'add-maths-0606::6-1-midpoint-parallel-and-perpendicular-lines',
  '10 2 arrangements': 'add-maths-0606::10-2-arrangements',
  '10 4 combinations': 'add-maths-0606::10-4-combinations-harder-topic',
  '14 1 derivatives of exponential functions': 'add-maths-0606::14-1-derivatives-of-exponential-functions',
  '15 1 15 2 indefinite integrals': 'add-maths-0606::15-1-15-2-indefinite-integrals-differentiation-reversed',
  '15 8 15 9 definite integration': 'add-maths-0606::15-8-15-9-definite-integration',
  '15 10 15 11 area under curve between regions': 'add-maths-0606::15-10-15-11-area-under-a-curve-between-regions',
  'converting from a non linear equation to linear form': 'add-maths-0606::6-4-converting-from-a-non-linear-equation-to-linear-form',
}

function mapLabel(topicLabel, subjects) {
  const norm = normalizeLabel(topicLabel)
  const normAlt = norm
    .replace(/\./g, ' ')
    .replace(/\//g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  for (const key of [norm, normAlt]) {
    if (LABEL_ALIASES[key]) {
      const [subjectId, topicId] = LABEL_ALIASES[key].split('::')
      const topic = subjects.get(subjectId)?.topicById.get(topicId)
      if (topic) return { subjectId, topicId, topic }
    }
  }

  for (const [subjectId, ctx] of subjects) {
    const hit = mapInSubject(topicLabel, ctx)
    if (hit) return { subjectId, topicId: hit.id, topic: hit }
  }
  return null
}

function mapInSubject(topicLabel, ctx) {
  const norm = normalizeLabel(topicLabel)
  const normAlt = norm.replace(/\./g, ' ')

  const nums = [...topicLabel.matchAll(/(\d+)[./-](\d+)/g)].map((m) => `${m[1]}-${m[2]}`)
  if (nums[0] && ctx.topicsByNumPrefix.has(nums[0])) {
    const candidates = ctx.topicsByNumPrefix.get(nums[0])
    if (candidates.length === 1) return candidates[0]
    const titlePart = norm.replace(/^[\d.\s/-]+/, '').trim()
    for (const t of candidates) {
      const st = normalizeLabel(t.title)
      if (st.includes(titlePart) || titlePart.includes(st)) return t
    }
    return candidates[0]
  }

  if (ctx.topicByNormTitle.has(norm)) return ctx.topicByNormTitle.get(norm)
  if (normAlt !== norm && ctx.topicByNormTitle.has(normAlt)) return ctx.topicByNormTitle.get(normAlt)

  for (const t of ctx.topics) {
    const st = normalizeLabel(t.title)
    if (st === norm || st.includes(norm) || norm.includes(st)) return t
  }
  return null
}

function isStubQuestion(q) {
  return Boolean(q.pending) || /placeholder question/i.test(q.question ?? '')
}

function normStem(text) {
  return (text ?? '').replace(/\s+/g, ' ').trim().toLowerCase()
}

function mergeTier(existing, incoming, topicId, diff, topic) {
  const kept = (existing ?? []).filter((q) => !isStubQuestion(q))
  const seen = new Set(kept.map((q) => normStem(q.question)))
  const merged = [...kept]
  for (const q of incoming) {
    const key = normStem(q.question)
    if (!key || seen.has(key)) continue
    seen.add(key)
    merged.push(q)
  }
  return merged.map((q, i) => {
    const { pending: _p, ...rest } = q
    return {
      ...rest,
      id: `${topicId}-${diff}-q${i + 1}`,
      type: 'mcq',
    }
  })
}

const subjects = new Map([
  ['maths-0580', loadSubject('maths-0580')],
  ['add-maths-0606', loadSubject('add-maths-0606')],
])

const quizFullText = decodeXmlEntities(parasFromDocx(QUIZ_FILE).join('\n'))
const questionRegex =
  /\{\s*"topic":\s*"([^"]+)",\s*"difficulty":\s*"([^"]+)",\s*"stem":\s*"((?:[^"\\]|\\.)*)",\s*"options":\s*\[((?:[^\]]|\][^,])*)\],\s*"correctIndex":\s*(\d+)(?:,\s*"explanation":\s*"((?:[^"\\]|\\.)*)")?(?:,\s*"commonMistake":\s*"((?:[^"\\]|\\.)*)")?\s*\}/gs

const incomingByKey = new Map()
const unmapped = new Map()

let m
while ((m = questionRegex.exec(quizFullText)) !== null) {
  const [, topicLabel, difficulty, stem, optionsRaw, correctIndex, explanation, commonMistake] = m
  const mapped = mapLabel(topicLabel, subjects)
  if (!mapped) {
    unmapped.set(topicLabel, (unmapped.get(topicLabel) ?? 0) + 1)
    continue
  }

  const diff = difficulty.toLowerCase()
  if (!DIFFS.includes(diff)) continue

  const options = [...optionsRaw.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((om) =>
    fixQuizLatexText(om[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')),
  )

  let expl = fixQuizLatexText(explanation?.replace(/\\"/g, '"').replace(/\\n/g, '\n') ?? '')
  if (commonMistake) {
    const cm = fixQuizLatexText(commonMistake.replace(/\\"/g, '"').replace(/\\n/g, '\n'))
    expl = expl ? `${expl}\n\n**Common mistake:** ${cm}` : `**Common mistake:** ${cm}`
  }

  const key = `${mapped.subjectId}::${mapped.topicId}::${diff}`
  if (!incomingByKey.has(key)) incomingByKey.set(key, [])
  incomingByKey.get(key).push({
    type: 'mcq',
    question: fixQuizLatexText(stem.replace(/\\"/g, '"').replace(/\\n/g, '\n')),
    options,
    correctIndex: parseInt(correctIndex, 10),
    ...(expl ? { explanation: expl } : {}),
  })
}

const touchedTopics = new Set()
let filesWritten = 0

for (const [key, incoming] of incomingByKey) {
  const [subjectId, topicId, diff] = key.split('::')
  const ctx = subjects.get(subjectId)
  const topic = ctx.topicById.get(topicId)
  if (!topic) continue

  const quizId = topic.quizIds?.[diff] ?? `${topicId}-${diff}`
  const quizPath = path.join(contentRoot, 'quizzes', subjectId, `${quizId}.json`)
  let existing = []
  if (fs.existsSync(quizPath)) {
    existing = JSON.parse(fs.readFileSync(quizPath, 'utf8')).questions ?? []
  }

  const merged = mergeTier(existing, incoming, topicId, diff, topic)
  writeJson(`quizzes/${subjectId}/${quizId}.json`, {
    id: quizId,
    topicId,
    chapterId: topic.chapterId,
    difficulty: diff,
    title: `${topic.title} — ${diff === 'pyp' ? 'PYP Mastery' : diff.charAt(0).toUpperCase() + diff.slice(1)}`,
    passPercent: 70,
    questionsPerAttempt: Math.min(5, merged.length),
    pending: false,
    questions: merged,
  })
  touchedTopics.add(`${subjectId}::${topicId}`)
  filesWritten++
}

function regenerateChapterQuizzes(subjectId, ctx) {
  for (const ch of ctx.chapters) {
    if (ch.id.includes('calculator')) continue
    for (const diff of DIFFS) {
      const merged = []
      for (const topicId of ch.topicIds ?? []) {
        const topic = ctx.topicById.get(topicId)
        if (!topic) continue
        const quizId = topic.quizIds?.[diff] ?? `${topicId}-${diff}`
        const quizPath = path.join(contentRoot, 'quizzes', subjectId, `${quizId}.json`)
        if (!fs.existsSync(quizPath)) continue
        const data = JSON.parse(fs.readFileSync(quizPath, 'utf8'))
        const qs = (data.questions ?? []).filter((q) => !isStubQuestion(q))
        merged.push(...qs)
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
      filesWritten++
    }
  }
}

for (const [subjectId, ctx] of subjects) {
  regenerateChapterQuizzes(subjectId, ctx)
}

console.log(`Imported ${incomingByKey.size} tier batches from ${QUIZ_FILE}`)
console.log(`Wrote/updated ${filesWritten} quiz files`)
console.log(`Touched ${touchedTopics.size} topics`)

if (unmapped.size) {
  console.log('\nUnmapped labels:')
  for (const [label, n] of [...unmapped.entries()].sort()) {
    console.log(`  ${label}: ${n}`)
  }
}
