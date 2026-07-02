/**
 * Import physicsnotes.docx → physics chapters, topics, notes.
 * Run: node scripts/import-physics-notes.mjs
 * Then: node scripts/fix-all-note-latex.mjs physics
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import { mapExplorer } from './explorer-map.mjs'
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
const subjectId = 'physics'
const NOTES_FILE = 'physicsnotes.docx'
const SYLLABUS_END = 103

/** Syllabus ref → alternate section headers in the docx body */
const TOPIC_ALIASES = {
  '5.1': ['Momentum'],
  '6.3': ['Energy Resources and Efficiency'],
  '13.3': ['Radiation in Communication'],
  '8.1': ['The States of Matter'],
  '12.3': ['Total Internal Reflection'],
  '14.4': ['Pitch and Loudness'],
}

const ACCENTS = ['green', 'blue', 'gold', 'purple', 'teal', 'orange', 'rose', 'lavender']

const SECTION_LABELS = new Set([
  'Key definitions',
  'Key formulas',
  'Graphs & diagrams',
  'Graphs &amp; diagrams',
  'Steps / method',
  'Worked example',
  'Worked examples',
  'Worked Example',
  'Common mistakes',
  'Examiner tip',
  'Quick check',
  'Core idea',
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

function slugify(text) {
  return cleanText(text)
    .toLowerCase()
    .replace(/\$[^$]+\$/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 52)
}

function normTitle(s) {
  return cleanText(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function normForMatch(s) {
  return cleanText(s)
    .toLowerCase()
    .replace(/^what is /i, '')
    .replace(/^the /i, '')
    .replace(/\?/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function headerVariants(topic) {
  const variants = [normForMatch(topic.title)]
  for (const alias of TOPIC_ALIASES[topic.num] ?? []) {
    variants.push(normForMatch(alias))
  }
  return variants
}

function matchTopicByHeader(line, topic) {
  const n = normForMatch(line)
  if (!n || line.length > 75) return false
  return headerVariants(topic).some((v) => {
    if (n === v) return true
    if (v.length >= 12 && n.startsWith(v)) return true
    if (n.length >= 12 && v.startsWith(n)) return true
    return false
  })
}

function parseSyllabus(paras) {
  const chapters = new Map()
  const topics = []

  for (let i = 0; i < SYLLABUS_END; i++) {
    const line = paras[i]
    const major = line.match(/^(\d+)\.\s+(.+)$/)
    if (major && !/^\d+\.\d+/.test(line)) {
      const num = parseInt(major[1], 10)
      chapters.set(num, major[2].trim())
      continue
    }
    const sub = line.match(/^(\d+\.\d+)\s+([^:]+):/)
    if (sub) {
      const [majorNum, minorNum] = sub[1].split('.').map(Number)
      topics.push({
        num: sub[1],
        major: majorNum,
        minor: minorNum,
        title: sub[2].trim(),
      })
    }
  }

  return { chapters, topics }
}

function findTopicStarts(paras, syllabusTopics) {
  const byNum = new Map(syllabusTopics.map((t) => [t.num, t]))
  const seen = new Set()
  const starts = [{ index: SYLLABUS_END, topic: syllabusTopics[0] }]
  seen.add(syllabusTopics[0].num)

  for (let i = SYLLABUS_END + 1; i < paras.length; i++) {
    const line = paras[i]

    const numbered = line.match(/^(\d+\.\d+)\s+(.+)$/)
    if (numbered && byNum.has(numbered[1]) && line.length < 80) {
      if (!seen.has(numbered[1])) {
        starts.push({ index: i, topic: byNum.get(numbered[1]) })
        seen.add(numbered[1])
      }
      continue
    }

    for (const topic of syllabusTopics) {
      if (seen.has(topic.num)) continue
      if (!matchTopicByHeader(line, topic)) continue
      const next = paras.slice(i + 1, i + 4).join(' ')
      if (/Key definitions/i.test(next) || next.length > 35) {
        starts.push({ index: i, topic })
        seen.add(topic.num)
        break
      }
    }
  }

  starts.sort((a, b) => a.index - b.index)
  return starts
}

function polishPhysicsMarkdown(md, title) {
  let out = md
    .replace(/## Graphs &amp; diagrams/g, '## Graphs & diagrams')
    .replace(/&quot;/g, '"')

  if (/graph|motion|distance|speed|velocity|acceleration/i.test(title + out)) {
    const replacements = [
      [/Increasing Speed \(Acceleration\): A curve that gets steeper \(gradient increases\)\./i, 'Increasing Speed (Acceleration): A curve like a **smile ☺** — getting steeper (speeding up).'],
      [/Decreasing Speed \(Deceleration\): A curve that gets flatter \(gradient decreases\)\./i, 'Decelerating: A curve like a **frown ☹** — getting flatter (slowing down).'],
      [/Acceleration: A curve with an increasing gradient \(steeper\)\./i, 'Acceleration: A curve like a **smile ☺** — gradient getting steeper.'],
      [/Deceleration: A curve with a decreasing gradient \(flatter\)\./i, 'Deceleration: A curve like a **frown ☹** — gradient getting flatter.'],
      [/Rest: A horizontal line; distance does not change\./i, 'Rest: Flat horizontal line — not moving at all.'],
      [/Constant speed: A straight line with a constant positive gradient\./i, 'Constant speed: Straight diagonal line — same speed throughout.'],
      [/At Rest: A horizontal line \(gradient = 0\)\./i, 'At rest: Flat line (gradient = 0) — speed is zero.'],
    ]
    for (const [re, rep] of replacements) out = out.replace(re, rep)
  }

  return out.trim() + '\n'
}

function sectionToMarkdown(section) {
  const parts = []

  for (const block of section.blocks) {
    if (block.label === 'Content') {
      const filtered = block.lines.filter((l) => !isOrphanPreambleLine(l))
      if (!filtered.length) continue
      parts.push('## Core idea')
      parts.push('')
      parts.push(normalizeGenericBlock(filtered).join('\n\n'))
      parts.push('')
      continue
    }

    if (block.label === 'Visual / interactive intent') continue

    let label = block.label.replace(/&amp;/g, '&')
    parts.push(`## ${label}`)
    parts.push('')

    const lines = block.lines

    if (label === 'Steps / method') {
      const { methodLines, examples } = splitStepsAndExamples(lines)
      const steps = consolidateMethodSteps(methodLines)
      if (steps.length) {
        parts.push(steps.join('\n\n'))
        parts.push('')
      }
      for (const ex of examples) {
        parts.push(`## Worked example — ${ex.title}`)
        parts.push('')
        parts.push(formatWorkedExampleLines(ex.lines).join('\n\n'))
        parts.push('')
      }
      continue
    }

    if (/^worked examples?$/i.test(label)) {
      const examples = splitExampleBlocks(lines)
      for (const ex of examples) {
        parts.push(`## Worked example — ${ex.title}`)
        parts.push('')
        parts.push(formatWorkedExampleLines(ex.lines).join('\n\n'))
        parts.push('')
      }
      continue
    }

    if (/worked example/i.test(label)) {
      parts.push(formatWorkedExampleLines(lines).join('\n\n'))
      parts.push('')
      continue
    }

    let paragraphs
    if (label === 'Key formulas') {
      paragraphs = normalizeKeyFormulas(lines)
    } else {
      paragraphs = normalizeGenericBlock(lines)
    }

    if (paragraphs.length) {
      parts.push(paragraphs.join('\n\n'))
      parts.push('')
    }
  }

  return polishPhysicsMarkdown(parts.join('\n'), section.title)
}

function chapterIdFromMajor(major, title) {
  return `ch${String(major).padStart(2, '0')}-${slugify(title)}`
}

function topicIdFromSyllabus(topic) {
  return `${topic.major}-${topic.minor}-${slugify(topic.title)}`
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

const paras = parasFromDocx(NOTES_FILE).map(cleanText)
const { chapters: chapterTitles, topics: syllabusTopics } = parseSyllabus(paras)
const starts = findTopicStarts(paras, syllabusTopics)

const noteSections = []

for (let s = 0; s < starts.length; s++) {
  const { index, topic } = starts[s]
  const end = starts[s + 1]?.index ?? paras.length
  const slice = paras.slice(index, end)

  const chapterTitle = chapterTitles.get(topic.major) ?? `Chapter ${topic.major}`
  const chapterId = chapterIdFromMajor(topic.major, chapterTitle)
  const topicId = topicIdFromSyllabus(topic)

  const section = {
    chapterNumber: topic.major,
    chapterId,
    chapterTitle,
    sectionNumber: topic.minor,
    title: cleanDisplayTitle(topic.title),
    topicId,
    topicNum: topic.num,
    blocks: [],
    visualIntent: null,
  }

  let skipTitleLine = normTitle(slice[0]) === normTitle(topic.title)
  const bodyLines = skipTitleLine ? slice.slice(1) : slice

  for (const line of bodyLines) {
    if (/^Worked example \d+/i.test(line)) {
      const m = line.match(/^Worked example \d+\s*[—-]\s*(.+)$/i)
      section.blocks.push({ label: `Worked example — ${m?.[1]?.trim() ?? line}`, lines: [] })
      continue
    }

    const sectionLabel = line === 'Graphs &amp; diagrams' ? 'Graphs & diagrams' : line
    if (SECTION_LABELS.has(line) || SECTION_LABELS.has(sectionLabel)) {
      section.blocks.push({ label: sectionLabel, lines: [] })
      continue
    }

    if (section.blocks.length === 0) {
      section.blocks.push({ label: 'Content', lines: [line] })
    } else {
      section.blocks[section.blocks.length - 1].lines.push(line)
    }
  }

  noteSections.push(section)
}

// Report missing topics
const importedNums = new Set(noteSections.map((s) => s.topicNum))
const missing = syllabusTopics.filter((t) => !importedNums.has(t.num))
if (missing.length) {
  console.warn('Missing topics (no body header found):', missing.map((t) => t.num).join(', '))
}

const chapterMap = new Map()
for (const sec of noteSections) {
  if (!chapterMap.has(sec.chapterId)) {
    chapterMap.set(sec.chapterId, {
      id: sec.chapterId,
      number: sec.chapterNumber,
      title: sec.chapterTitle,
      topics: [],
    })
  }
  chapterMap.get(sec.chapterId).topics.push(sec)
}

const chapters = [...chapterMap.values()].sort((a, b) => a.number - b.number)

// Remove stale files
const topicsDir = path.join(contentRoot, 'topics', subjectId)
const notesDir = path.join(contentRoot, 'notes', subjectId)
const chaptersDir = path.join(contentRoot, 'chapters', subjectId)
const validTopicIds = new Set(noteSections.map((s) => s.topicId))
const validChapterIds = new Set(chapters.map((c) => c.id))

for (const dir of [topicsDir, notesDir, chaptersDir]) {
  if (!fs.existsSync(dir)) continue
  for (const file of fs.readdirSync(dir)) {
    const id = file.replace(/\.(json|md)$/, '')
    const isChapter = dir === chaptersDir
    const valid = isChapter ? validChapterIds.has(id) : validTopicIds.has(id)
    if (!valid) {
      fs.unlinkSync(path.join(dir, file))
      console.log('Removed stale:', file)
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
    badge: existingCh?.badge ?? `CH.${ch.number}`,
    summary: ch.topics.map((t) => t.title).join(' · ').slice(0, 160),
    topicIds: ch.topics.map((t) => t.topicId),
    accentColor: existingCh?.accentColor ?? ACCENTS[(ch.number - 1) % ACCENTS.length],
    hasChapterQuiz: existingCh?.hasChapterQuiz ?? true,
  })

  ch.topics.forEach((topic, i, arr) => {
    const existing = readExistingTopic(topic.topicId)
    const explorer = mapExplorer(topic.visualIntent, topic.title)
    if (explorer) explorerCount++

    writeJson(`topics/${subjectId}/${topic.topicId}.json`, {
      ...(existing ?? {}),
      id: topic.topicId,
      subjectId,
      chapterId: ch.id,
      title: topic.title,
      subtitle: existing?.subtitle ?? topic.topicNum,
      notesFile: `${subjectId}/${topic.topicId}.md`,
      quizIds: existing?.quizIds ?? {
        easy: `${topic.topicId}-easy`,
        medium: `${topic.topicId}-medium`,
        hard: `${topic.topicId}-hard`,
        pyp: `${topic.topicId}-pyp`,
      },
      ...(i === arr.length - 1 ? { isChapterQuizAnchor: true } : {}),
      ...(explorer?.explorerId ? { explorerId: explorer.explorerId, explorerPanels: explorer.explorerPanels } : {}),
    })
  })
}

for (const section of noteSections) {
  writeMd(`notes/${subjectId}/${section.topicId}.md`, sectionToMarkdown(section))
}

writeJson(`subjects/${subjectId}.json`, {
  id: subjectId,
  name: 'Physics',
  code: '0625',
  syllabus: 'IGCSE PHYSICS 0625',
  description:
    'Mechanics, waves, electricity, and exam-style practice — understand the physics, not just the formulas.',
  chapterIds: chapters.map((c) => c.id),
})

console.log(`Imported ${noteSections.length} topics across ${chapters.length} chapters (${explorerCount} explorers).`)
