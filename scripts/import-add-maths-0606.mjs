/**
 * One-off import: Notes .docx → syllabus/chapters/topics/notes
 *                    Notes (1).docx → chapter-scoped quiz JSON
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

const ACCENTS = ['gold', 'blue', 'green', 'lavender', 'gold', 'blue', 'green', 'lavender']

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

const SECTION_LABELS = new Set([
  'Core idea',
  'Key formulas',
  'Steps / method',
  'Worked example',
  'Examiner tip',
  'Quick check',
  'Visual / interactive intent',
])

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
      blocks: [],
    }
    continue
  }

  if (!currentSection) continue

  if (SECTION_LABELS.has(line)) {
    currentSection.blocks.push({ label: line, lines: [] })
    continue
  }

  if (line.startsWith('Notes only')) continue
  if (line.match(/^Module \d+:/)) continue
  if (line.match(/^Chapter \d+:/)) continue

  const blocks = currentSection.blocks
  if (blocks.length === 0) {
    blocks.push({ label: 'Content', lines: [line] })
  } else {
    blocks[blocks.length - 1].lines.push(line)
  }
}
if (currentSection) noteSections.push(currentSection)

for (const ch of chapters) {
  ch.topics = noteSections
    .filter((s) => s.chapterNumber === ch.number)
    .map((s, i, arr) => ({
      id: s.topicId,
      title: s.title,
      subtitle: `Section ${s.sectionNumber}`,
      notesFile: `${subjectId}/${s.topicId}.md`,
      isChapterQuizAnchor: i === arr.length - 1,
    }))
}

function sectionToMarkdown(section) {
  const parts = []
  for (const block of section.blocks) {
    if (block.label !== 'Content') {
      parts.push(`## ${block.label}`)
      parts.push('')
    }
    for (const line of block.lines) {
      parts.push(line)
      parts.push('')
    }
  }
  return parts.join('\n').trim() + '\n'
}

const QUIZ_TOPIC_TO_CHAPTER = {}

for (const ch of chapters) {
  for (const t of ch.syllabusTopics) {
    QUIZ_TOPIC_TO_CHAPTER[t.toLowerCase()] = ch.number
  }
  for (const topic of ch.topics) {
    QUIZ_TOPIC_TO_CHAPTER[topic.title.toLowerCase()] = ch.number
  }
}

const QUIZ_ALIASES = {
  'mappings and definition of a function': 1,
  'domain and range': 1,
  'composite functions': 1,
  'inverse functions': 1,
  'graphs of $y = |f(x)|$ where $f(x)$ is linear': 1,
  'simultaneous equations': 2,
  'maximum and minimum values of a quadratic function': 2,
  'graphs of $y = |f(x)|$ where $f(x)$ is quadratic': 2,
  'graphs of modulus quadratic functions': 2,
  'quadratic inequalities': 2,
  'roots of quadratic equations': 2,
  'intersection of a line and a curve': 2,
  'adding, subtracting, and multiplying polynomials': 3,
  'division of polynomials': 3,
  'the factor theorem': 3,
  'the remainder theorem': 3,
  'cubic expressions and equations': 3,
  'solving equations of the form $|f(x)| = g(x)$': 4,
  'solving modulus inequalities': 4,
  'introduction to logarithms': 5,
  'laws of logarithms': 5,
  'change of base of logarithms': 5,
  'exponential equations': 5,
  'logarithmic equations': 5,
  'length of a line segment': 6,
  'midpoint of a line segment': 6,
  'gradient of a line': 6,
  'parallel lines': 6,
  'perpendicular lines': 6,
  'parallel and perpendicular lines': 6,
  'equation of a straight line': 6,
  'area of rectilinear figures': 6,
  'equations of geometric figures': 6,
  'collinear points': 6,
  'perpendicular bisector': 6,
  'equation of a circle': 7,
  'center and radius of a circle': 7,
  'intersection of a line and a circle': 7,
  'intersection of lines and circles': 7,
  'intersection of two circles': 7,
  'properties of chords': 7,
  'properties of tangents': 7,
  'radians, arc length and sector area': 8,
  'trigonometric ratios of general angles': 9,
  'secant, cosecant and cotangent ratios': 9,
  'trigonometric graphs': 9,
  'trigonometric equations': 9,
  'trigonometric identities': 9,
  'factorial notation': 10,
  arrangements: 10,
  permutations: 10,
  combinations: 10,
  'permutations and combinations': 10,
  "pascal's triangle": 11,
  'the binomial theorem': 11,
  'arithmetic progressions': 11,
  'geometric progressions': 11,
  'infinite geometric series': 11,
  'further arithmetic and geometric series': 11,
  differentiation: 12,
  'equation of a tangent': 12,
  'equation of a normal': 12,
  vectors: 13,
  'further differentiation': 14,
  'differentiation reversed': 15,
  'indefinite integrals': 15,
  'further indefinite integration': 15,
  'definite integration': 15,
  'further definite integration': 15,
  'integration of exponential functions': 15,
  'integration of sine and cosine functions': 15,
  'integration of functions of the form 1/x and 1/(ax+b)': 15,
  'area under a curve': 15,
  'area of regions bounded by a line and a curve': 15,
  'applications of differentiation in kinematics': 16,
  'applications of integration in kinematics': 16,
}

Object.assign(
  QUIZ_TOPIC_TO_CHAPTER,
  Object.fromEntries(Object.entries(QUIZ_ALIASES).map(([k, v]) => [k, v])),
)

function mapQuizTopicToChapter(topicLabel) {
  const key = topicLabel.toLowerCase().trim()
  if (QUIZ_TOPIC_TO_CHAPTER[key] !== undefined) return QUIZ_TOPIC_TO_CHAPTER[key]
  for (const ch of chapters) {
    for (const st of ch.syllabusTopics) {
      const sk = st.toLowerCase()
      if (key.includes(sk) || sk.includes(key)) return ch.number
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

const questionsByChapter = {}
const unmapped = new Set()

let m
while ((m = questionRegex.exec(quizFullText)) !== null) {
  const [, topic, difficulty, stem, optionsRaw, correctIndex, explanation, commonMistake] = m
  const chNum = mapQuizTopicToChapter(topic)
  if (!chNum) {
    unmapped.add(topic)
    continue
  }
  const ch = chapters.find((c) => c.number === chNum)
  if (!ch) continue

  if (!questionsByChapter[ch.id]) {
    questionsByChapter[ch.id] = { easy: [], medium: [], hard: [], pyp: [] }
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
  const list = questionsByChapter[ch.id][diff]
  if (!list) continue

  list.push({
    id: `${ch.id}-q${list.length + 1}`,
    type: 'mcq',
    question: prepareMathContent(stem.replace(/\\"/g, '"').replace(/\\n/g, '\n'), 'quiz'),
    options: options.map((o) => prepareMathContent(o, 'quiz')),
    correctIndex: parseInt(correctIndex, 10),
    ...(expl ? { explanation: prepareMathContent(expl, 'quiz') } : {}),
  })
}

function writeJson(rel, data) {
  const p = path.join(contentRoot, rel)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

function writeMd(rel, data) {
  const p = path.join(contentRoot, rel)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, data, 'utf8')
}

function readExistingTopic(topicId) {
  const p = path.join(contentRoot, `topics/${subjectId}/${topicId}.json`)
  if (!fs.existsSync(p)) return null
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'))
  } catch {
    return null
  }
}

function readExistingChapter(chId) {
  const p = path.join(contentRoot, `chapters/${subjectId}/${chId}.json`)
  if (!fs.existsSync(p)) return null
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'))
  } catch {
    return null
  }
}

const notesOnly = process.argv.includes('--notes-only')

if (!notesOnly) {
  writeJson(`subjects/${subjectId}.json`, {
    id: subjectId,
    name: 'Additional Mathematics',
    code: '0606',
    syllabus: 'IGCSE ADDITIONAL MATHEMATICS 0606',
    description:
      'Notes, chapter quizzes, and mastery progression — study topic by topic, then test yourself on the full chapter.',
    chapterIds: chapters.map((c) => c.id),
  })

  for (const ch of chapters) {
    const hasQuizzes = Boolean(questionsByChapter[ch.id])
    const existingCh = readExistingChapter(ch.id)
    writeJson(`chapters/${subjectId}/${ch.id}.json`, {
      ...(existingCh ?? {}),
      id: ch.id,
      subjectId,
      number: ch.number,
      title: ch.title,
      badge: existingCh?.badge ?? `CH.${ch.number} ${ch.title.toUpperCase().slice(0, 14)}`,
      summary:
        existingCh?.summary ??
        ch.topics.map((t) => t.title.split('(')[0].trim()).join(' · ').slice(0, 120),
      topicIds: ch.topics.map((t) => t.id),
      accentColor: existingCh?.accentColor ?? ACCENTS[(ch.number - 1) % ACCENTS.length],
      hasChapterQuiz: existingCh?.hasChapterQuiz ?? hasQuizzes,
    })

    for (const topic of ch.topics) {
      const existing = readExistingTopic(topic.id)
      const quizIds =
        existing?.quizIds ??
        (topic.isChapterQuizAnchor && hasQuizzes
          ? {
              easy: `${ch.id}-easy`,
              medium: `${ch.id}-medium`,
              hard: `${ch.id}-hard`,
              pyp: `${ch.id}-pyp`,
            }
          : undefined)

      writeJson(`topics/${subjectId}/${topic.id}.json`, {
        ...(existing ?? {}),
        id: topic.id,
        subjectId,
        chapterId: ch.id,
        title: topic.title,
        subtitle: existing?.subtitle ?? topic.subtitle,
        notesFile: topic.notesFile,
        ...(existing?.lessonMeta ? { lessonMeta: existing.lessonMeta } : {}),
        ...(existing?.explorerId ? { explorerId: existing.explorerId } : {}),
        ...(existing?.explorerPanels ? { explorerPanels: existing.explorerPanels } : {}),
        ...(existing?.lessonNav ? { lessonNav: existing.lessonNav } : {}),
        ...(topic.isChapterQuizAnchor ? { isChapterQuizAnchor: true } : {}),
        ...(quizIds ? { quizIds } : {}),
      })
    }
  }
}

for (const section of noteSections) {
  writeMd(`notes/${subjectId}/${section.topicId}.md`, sectionToMarkdown(section))
}

if (notesOnly) {
  console.log('Notes refreshed:', noteSections.length, 'sections')
  process.exit(0)
}

for (const [chId, tiers] of Object.entries(questionsByChapter)) {
  const ch = chapters.find((c) => c.id === chId)
  for (const [diff, questions] of Object.entries(tiers)) {
    if (questions.length === 0) continue
    writeJson(`quizzes/${subjectId}/${chId}-${diff}.json`, {
      id: `${chId}-${diff}`,
      topicId: chId,
      chapterId: chId,
      difficulty: diff,
      title: `Chapter ${ch?.number}: ${ch?.title} — ${diff.charAt(0).toUpperCase() + diff.slice(1)}`,
      passPercent: 70,
      questions,
    })
  }
}

console.log('Chapters:', chapters.length)
console.log('Note sections:', noteSections.length)
console.log('Chapters with quizzes:', Object.keys(questionsByChapter).length)
console.log('NOTE: Chapter quiz files bundle all section questions. For per-section quizzes run:')
console.log('  node scripts/reimportTopicQuizzes.mjs')
for (const [chId, tiers] of Object.entries(questionsByChapter)) {
  console.log(`  ${chId}:`, Object.entries(tiers).map(([d, q]) => `${d}=${q.length}`).join(', '))
}
if (unmapped.size) console.log('Unmapped quiz topics:', [...unmapped])
