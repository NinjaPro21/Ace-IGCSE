/**
 * Import Notes .docx (v2 format) → chapters, topics, notes markdown
 * Preserves existing topic metadata (quizIds, lessonMeta) when topic id matches.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const contentRoot = path.join(root, 'content')
const subjectId = 'add-maths-0606'

const CHAPTER_TITLES = {
  1: 'Functions',
  2: 'Simultaneous Equations and Quadratics',
  3: 'Factors and Polynomials',
  4: 'Equations, Inequalities and Graphs',
  5: 'Logarithms',
  6: 'Coordinate Geometry',
  7: 'Coordinate Geometry of the Circle',
  8: 'Circular Measure',
  9: 'Trigonometry',
  10: 'Permutations and Combinations',
  11: 'Series',
  12: 'Calculus – Differentiation 1',
  13: 'Vectors',
  14: 'Calculus – Differentiation 2',
  15: 'Calculus – Integration',
  16: 'Kinematics',
}

const ACCENTS = ['gold', 'blue', 'green', 'lavender']

const SECTION_LABELS = new Set([
  'Core idea',
  'Key formulas',
  'Steps / method',
  'Worked example',
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

import { mapExplorer } from './explorer-map.mjs'
import {
  toSuperscript,
  splitStepsAndExamples,
  consolidateMethodSteps,
  formatWorkedExampleLines,
  normalizeKeyFormulas,
  normalizeGenericBlock,
  cleanDisplayTitle,
  isOrphanPreambleLine,
} from './normalize-note-content.mjs'

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
    if (/worked example/i.test(block.label)) {
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

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\[cite_start\]/g, '')
    .replace(/\$[^$]+\$/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 52)
}

function cleanText(t) {
  return t
    .replace(/\[cite_start\]/g, '')
    .replace(/\uFFFD/g, '')
    .replace(/â€™/g, "'")
    .replace(/â€"/g, '—')
    .replace(/Â/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
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

const notesParas = parasFromDocx('Notes .docx').map(cleanText)

const noteSections = []
let currentSection = null
let visualIntent = null

for (const line of notesParas) {
  const secMatch = line.match(/^(\d+)\.(\d+)\s+(.+)$/)
  if (secMatch && /[a-zA-Z]/.test(secMatch[3])) {
    if (currentSection) {
      currentSection.visualIntent = visualIntent
      noteSections.push(currentSection)
    }
    const chNum = parseInt(secMatch[1], 10)
    const secNum = parseInt(secMatch[2], 10)
    const rawTitle = secMatch[3]
    const title = cleanDisplayTitle(rawTitle)
    const chapterId = `ch${String(chNum).padStart(2, '0')}-${slugify(CHAPTER_TITLES[chNum] ?? `chapter-${chNum}`)}`
    const topicId = `${chNum}-${secNum}-${slugify(rawTitle)}`
    currentSection = {
      chapterNumber: chNum,
      chapterId,
      sectionNumber: secNum,
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
    visualIntent = (visualIntent ? visualIntent + ' ' : '') + line
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

const chapters = []
for (const chNum of [...new Set(noteSections.map((s) => s.chapterNumber))].sort((a, b) => a - b)) {
  const topics = noteSections.filter((s) => s.chapterNumber === chNum)
  chapters.push({
    number: chNum,
    id: topics[0].chapterId,
    title: CHAPTER_TITLES[chNum] ?? `Chapter ${chNum}`,
    topics,
  })
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
    summary: ch.topics.map((t) => cleanDisplayTitle(t.title)).join(' · ').slice(0, 120),
    topicIds: ch.topics.map((t) => t.topicId),
    accentColor: existingCh?.accentColor ?? ACCENTS[(ch.number - 1) % ACCENTS.length],
    hasChapterQuiz: existingCh?.hasChapterQuiz ?? true,
  })

  ch.topics.forEach((topic, i, arr) => {
    const existing = readExistingTopic(topic.topicId)
    const explorer = mapExplorer(topic.visualIntent, topic.title)
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
  name: 'Additional Mathematics',
  code: '0606',
  syllabus: 'IGCSE ADDITIONAL MATHEMATICS 0606',
  description:
    'Notes, chapter quizzes, and mastery progression — study topic by topic, then test yourself on the full chapter.',
  chapterIds: chapters.map((c) => c.id),
})

console.log('Imported sections:', noteSections.length)
console.log('Chapters:', chapters.length)
console.log('Sections with explorers:', explorerCount)
