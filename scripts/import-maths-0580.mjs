/**
 * Import Mathnotes.docx → maths-0580 chapters, topics, notes.
 * Run: node scripts/import-maths-0580.mjs
 * Then: node scripts/reimport-maths-quizzes.mjs
 * Then: node scripts/fix-all-note-latex.mjs  (with MATHS_NOTES_DIR)
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import { mapExplorer } from './explorer-map.mjs'
import { resolveMaths0580Explorer } from './maths-0580-explorers.mjs'
import {
  toSuperscript,
  splitStepsAndExamples,
  consolidateMethodSteps,
  formatWorkedExampleLines,
  splitExampleBlocks,
  normalizeKeyFormulas,
  normalizeGenericBlock,
  cleanDisplayTitle,
  isOrphanPreambleLine,
} from './normalize-note-content.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const contentRoot = path.join(root, 'content')
const subjectId = 'maths-0580'
const NOTES_FILE = 'Mathnotes.docx'

const ACCENTS = ['gold', 'blue', 'green', 'lavender', 'purple', 'teal', 'orange', 'rose']

/** 8 modules from the syllabus map at the start of Mathnotes.docx */
const CHAPTER_DEFS = [
  { number: 1, id: 'ch01-number', title: 'Number' },
  { number: 2, id: 'ch02-algebra', title: 'Algebra' },
  { number: 3, id: 'ch03-coordinate-geometry-graphs', title: 'Coordinate Geometry & Graphs' },
  { number: 4, id: 'ch04-geometry-transformations', title: 'Geometry & Transformations' },
  { number: 5, id: 'ch05-trigonometry', title: 'Trigonometry' },
  { number: 6, id: 'ch06-mensuration', title: 'Mensuration' },
  { number: 7, id: 'ch07-sets-functions-logical-systems', title: 'Sets, Functions & Logical Systems' },
  { number: 8, id: 'ch08-probability-statistics', title: 'Probability & Statistics' },
]

const FALLBACK_MAJOR_TO_CHAPTER = {
  1: 1, 2: 2, 3: 3, 4: 5, 5: 6, 6: 2, 7: 4, 8: 2, 9: 3, 10: 5, 11: 7, 12: 4, 13: 8, 14: 8,
}

const SECTION_LABELS = new Set([
  'Core idea',
  'Key formulas',
  'Steps / method',
  'Worked example',
  'Worked examples',
  'Worked Example (0606/PYP Style)',
  'Examiner tip',
  'Quick check',
  'Visual / interactive intent',
])

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
    .map(parseParagraphXml)
    .filter(Boolean)
}

function parseParagraphXml(pXml) {
  const runs = pXml.split(/<w:r[ >]/).slice(1)
  let text = ''
  for (const run of runs) {
    const isSup = /w:vertAlign[^>]*w:val="superscript"/.test(run)
    const parts = [...run.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1])
    const joined = parts.join('')
    text += isSup ? toSuperscript(joined) : joined
  }
  return text.trim()
}

function decodeEntities(t) {
  return t
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function slugify(text) {
  return decodeEntities(text)
    .toLowerCase()
    .replace(/\[cite_start\]/g, '')
    .replace(/\$[^$]+\$/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 52)
}

function cleanText(t) {
  return decodeEntities(t)
    .replace(/\[cite_start\]/g, '')
    .replace(/\uFFFD/g, '')
    .replace(/â€™/g, "'")
    .replace(/â€"/g, '—')
    .replace(/Â/g, '')
    .trim()
}

function topicIdFromHeader(raw) {
  const body = raw.replace(/^Topic\s+/i, '').trim()
  const nums = body.match(/\d+\.\d+/g) ?? ['0-0']
  const prefix = nums.map((n) => n.replace('.', '-')).join('-')
  let title = body
    .replace(/^[\d.\s&–—\-]+(:?\s*&\s*[\d.\s]+)*\s*:?\s*/i, '')
    .trim()
  if (!title) title = body
  return `${prefix}-${slugify(title)}`
}

function parseChapterLine(line) {
  const m = line.match(/^CHAPTER\s+(\d+):\s*(.+)$/i)
  if (!m) return null
  return { docChapter: parseInt(m[1], 10) }
}

function chapterDef(chNum) {
  return CHAPTER_DEFS.find((c) => c.number === chNum) ?? CHAPTER_DEFS[0]
}

/** Parse syllabus map (lines before first CHAPTER header) → topic number → module number */
function parseSyllabusMap(paras) {
  const topicToChapter = new Map()
  let currentChapter = null

  for (const line of paras) {
    if (/^CHAPTER \d+/i.test(line)) break

    const modMatch = line.match(/^(\d+)\.\s+([A-Z])/)
    if (modMatch) {
      currentChapter = parseInt(modMatch[1], 10)
      continue
    }

    const nums = line.match(/\d+\.\d+/g)
    if (nums?.length && currentChapter) {
      for (const num of nums) topicToChapter.set(num, currentChapter)
    }
  }

  return topicToChapter
}

function resolveChapterNumber(topicLine, topicToChapter) {
  const body = topicLine.replace(/^Topic\s+/i, '').trim()
  const nums = body.match(/\d+\.\d+/g) ?? []
  for (const num of nums) {
    if (topicToChapter.has(num)) return topicToChapter.get(num)
  }
  const major = parseInt(nums[0]?.split('.')[0] ?? '1', 10)
  return FALLBACK_MAJOR_TO_CHAPTER[major] ?? 1
}

function sectionToMarkdown(section) {
  const parts = []
  for (const block of section.blocks) {
    if (block.label === 'Content') {
      const filtered = block.lines.filter((l) => !isOrphanPreambleLine(l))
      if (!filtered.length) continue
    }

    const lines =
      block.label === 'Content' ? block.lines.filter((l) => !isOrphanPreambleLine(l)) : block.lines

    if (block.label !== 'Content' && block.label !== 'Visual / interactive intent') {
      parts.push(`## ${block.label}`)
      parts.push('')
    }
    if (block.label === 'Visual / interactive intent') continue

    if (block.label === 'Steps / method') {
      const { methodLines, examples } = splitStepsAndExamples(lines)
      const steps = consolidateMethodSteps(methodLines)
      if (steps.length) {
        parts.push(steps.join('\n\n'))
        parts.push('')
      }
      for (const ex of examples) {
        parts.push(`## Worked example — ${ex.title}`)
        parts.push('')
        const exParas = formatWorkedExampleLines(ex.lines)
        if (exParas.length) {
          parts.push(exParas.join('\n\n'))
          parts.push('')
        }
      }
      continue
    }

    let paragraphs
    if (/^worked examples?$/i.test(block.label)) {
      const examples = splitExampleBlocks(lines)
      if (examples.length > 1) {
        for (const ex of examples) {
          parts.push(`## Worked example — ${ex.title}`)
          parts.push('')
          const exParas = formatWorkedExampleLines(ex.lines)
          if (exParas.length) {
            parts.push(exParas.join('\n\n'))
            parts.push('')
          }
        }
        continue
      }
      paragraphs = formatWorkedExampleLines(lines)
    } else if (/worked example/i.test(block.label)) {
      paragraphs = formatWorkedExampleLines(lines)
    } else if (block.label === 'Key formulas') {
      paragraphs = normalizeKeyFormulas(lines)
    } else {
      paragraphs = normalizeGenericBlock(lines)
    }

    if (paragraphs.length) {
      parts.push(paragraphs.join('\n\n'))
      parts.push('')
    }
  }
  return parts.join('\n').trim() + '\n'
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

const notesParas = parasFromDocx(NOTES_FILE).map(cleanText)
const topicToChapter = parseSyllabusMap(notesParas)

const noteSections = []
let currentSection = null
let visualIntent = null
let inContent = false
const sectionCounters = new Map()

for (const line of notesParas) {
  const ch = parseChapterLine(line)
  if (ch) {
    inContent = true
    if (currentSection) {
      currentSection.visualIntent = visualIntent
      noteSections.push(currentSection)
      currentSection = null
    }
    visualIntent = null
    continue
  }

  if (!inContent) continue

  if (/^Topic\s+/i.test(line)) {
    if (currentSection) {
      currentSection.visualIntent = visualIntent
      noteSections.push(currentSection)
    }

    const chNum = resolveChapterNumber(line, topicToChapter)
    const def = chapterDef(chNum)
    sectionCounters.set(chNum, (sectionCounters.get(chNum) ?? 0) + 1)

    const raw = line.replace(/^Topic\s+/i, '').trim()
    const title = cleanDisplayTitle(raw.replace(/^[\d.\s&–—\-]+(:?\s*&\s*[\d.\s]+)*\s*:?\s*/i, '').trim() || raw)
    const topicId = topicIdFromHeader(line)
    currentSection = {
      chapterNumber: def.number,
      chapterId: def.id,
      chapterTitle: def.title,
      sectionNumber: sectionCounters.get(chNum),
      title,
      topicId,
      blocks: [],
      visualIntent: null,
    }
    visualIntent = null
    continue
  }

  if (!currentSection) continue

  if (line === 'Visual / interactive intent') {
    currentSection.blocks.push({ label: line, lines: [] })
    continue
  }

  if (SECTION_LABELS.has(line)) {
    currentSection.blocks.push({ label: line, lines: [] })
    continue
  }

  if (line.startsWith('Notes only')) {
    visualIntent = line
    continue
  }

  const blocks = currentSection.blocks
  const last = blocks[blocks.length - 1]
  if (last?.label === 'Visual / interactive intent') {
    visualIntent = (visualIntent ? `${visualIntent} ` : '') + line
    last.lines.push(line)
    continue
  }

  if (blocks.length === 0) {
    blocks.push({ label: 'Content', lines: [line] })
  } else {
    blocks[blocks.length - 1].lines.push(line)
  }
}

if (currentSection) {
  currentSection.visualIntent = visualIntent
  noteSections.push(currentSection)
}

const chapters = CHAPTER_DEFS.map((def) => {
  const topics = noteSections.filter((s) => s.chapterNumber === def.number)
  return { ...def, topics }
}).filter((ch) => ch.topics.length > 0)

// Remove stale chapter JSON from old 5-chapter layout
const chaptersDir = path.join(contentRoot, 'chapters', subjectId)
const validChapterIds = new Set(chapters.map((c) => c.id))
if (fs.existsSync(chaptersDir)) {
  for (const file of fs.readdirSync(chaptersDir)) {
    if (!file.endsWith('.json')) continue
    const id = file.replace(/\.json$/, '')
    if (!validChapterIds.has(id)) {
      fs.unlinkSync(path.join(chaptersDir, file))
      console.log('Removed stale chapter:', id)
    }
  }
}

let explorerCount = 0
for (const ch of chapters) {
  const existingCh = readExistingChapter(ch.id)
  writeJson(`chapters/${subjectId}/${ch.id}.json`, {
    ...(existingCh ?? {}),
    id: ch.id,
    subjectId,
    number: ch.number,
    title: ch.title,
    badge: existingCh?.badge ?? `CH.${ch.number} ${ch.title.toUpperCase().slice(0, 14)}`,
    summary: ch.topics.map((t) => cleanDisplayTitle(t.title)).join(' · ').slice(0, 140),
    topicIds: ch.topics.map((t) => t.topicId),
    accentColor: existingCh?.accentColor ?? ACCENTS[(ch.number - 1) % ACCENTS.length],
    hasChapterQuiz: existingCh?.hasChapterQuiz ?? true,
  })

  ch.topics.forEach((topic, i, arr) => {
    const existing = readExistingTopic(topic.topicId)
    const explorer =
      resolveMaths0580Explorer(topic.topicId, topic.visualIntent, topic.title) ??
      mapExplorer(topic.visualIntent, topic.title)
    if (explorer) explorerCount++

    const isAnchor = i === arr.length - 1
    const payload = {
      ...(existing ?? {}),
      id: topic.topicId,
      subjectId,
      chapterId: ch.id,
      title: cleanDisplayTitle(topic.title),
      subtitle: existing?.subtitle ?? `Section ${topic.sectionNumber}`,
      notesFile: `${subjectId}/${topic.topicId}.md`,
      quizIds: existing?.quizIds ?? {
        easy: `${topic.topicId}-easy`,
        medium: `${topic.topicId}-medium`,
        hard: `${topic.topicId}-hard`,
        pyp: `${topic.topicId}-pyp`,
      },
      ...(isAnchor ? { isChapterQuizAnchor: true } : {}),
      ...(existing?.lessonMeta ? { lessonMeta: existing.lessonMeta } : {}),
    }
    if (explorer?.explorerId) {
      payload.explorerId = explorer.explorerId
      if (explorer.explorerPanels?.length) payload.explorerPanels = explorer.explorerPanels
      else delete payload.explorerPanels
    } else {
      delete payload.explorerId
      delete payload.explorerPanels
    }
    writeJson(`topics/${subjectId}/${topic.topicId}.json`, payload)
  })
}

for (const section of noteSections) {
  writeMd(`notes/${subjectId}/${section.topicId}.md`, sectionToMarkdown(section))
}

writeJson(`subjects/${subjectId}.json`, {
  id: subjectId,
  name: 'Mathematics',
  code: '0580',
  syllabus: 'IGCSE MATHEMATICS 0580',
  description:
    'Core IGCSE Mathematics — notes, section quizzes, and mastery progression topic by topic.',
  chapterIds: chapters.map((c) => c.id),
})

console.log('Imported maths-0580 sections:', noteSections.length)
console.log('Chapters:', chapters.length)
console.log('Sections with explorers:', explorerCount)
