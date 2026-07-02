import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { mapExplorer } from './explorer-map.mjs'

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
    .map((p) => [...p.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]).join('').trim())
    .filter(Boolean)
}

function cleanText(t) {
  return t.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 52)
}

const SECTION_LABELS = new Set([
  'Core idea', 'Key formulas', 'Steps / method', 'Worked example',
  'Worked Example (0606/PYP Style)', 'Examiner tip', 'Quick check', 'Visual / interactive intent',
])

const notesParas = parasFromDocx('Notes .docx').map(cleanText)
const docSections = []
let current = null
let visualIntent = null
let inVisual = false

for (const line of notesParas) {
  const secMatch = line.match(/^(\d+)\.(\d+)\s+(.+)$/)
  if (secMatch && /[a-zA-Z]/.test(secMatch[3])) {
    if (current) {
      current.visualIntent = visualIntent?.trim() || null
      current.expected = mapExplorer(current.visualIntent, current.title)
      docSections.push(current)
    }
    current = {
      section: `${secMatch[1]}.${secMatch[2]}`,
      title: secMatch[3],
      topicId: `${secMatch[1]}-${secMatch[2]}-${slugify(secMatch[3])}`,
    }
    visualIntent = null
    inVisual = false
    continue
  }
  if (!current) continue
  if (line === 'Visual / interactive intent') { inVisual = true; continue }
  if (inVisual) {
    if (SECTION_LABELS.has(line) || /^\d+\.\d+/.test(line)) { inVisual = false; continue }
    visualIntent = (visualIntent ? visualIntent + ' ' : '') + line
  }
}
if (current) {
  current.visualIntent = visualIntent?.trim() || null
  current.expected = mapExplorer(current.visualIntent, current.title)
  docSections.push(current)
}

const topicDir = path.join(contentRoot, 'topics', subjectId)
const mismatches = []

for (const sec of docSections) {
  const topicPath = path.join(topicDir, `${sec.topicId}.json`)
  if (!fs.existsSync(topicPath)) {
    mismatches.push({ section: sec.section, title: sec.title, issue: 'MISSING TOPIC FILE' })
    continue
  }
  const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'))
  const exp = sec.expected
  const notesOnly = !sec.visualIntent || /notes only/i.test(sec.visualIntent)

  if (notesOnly) {
    if (topic.explorerId) mismatches.push({ section: sec.section, title: sec.title, issue: 'should be notes-only', current: topic.explorerId })
    continue
  }
  if (!exp) {
    mismatches.push({ section: sec.section, title: sec.title, issue: 'UNMAPPED', intent: sec.visualIntent?.slice(0, 80) })
    continue
  }
  const sameId = topic.explorerId === exp.explorerId
  const samePanels = JSON.stringify(topic.explorerPanels ?? null) === JSON.stringify(exp.explorerPanels ?? null)
  if (!sameId || !samePanels) {
    mismatches.push({
      section: sec.section,
      title: sec.title,
      current: { explorerId: topic.explorerId, explorerPanels: topic.explorerPanels },
      expected: exp,
    })
  }
}

console.log('Sections audited:', docSections.length)
console.log('Mismatches:', mismatches.length)
if (mismatches.length) {
  console.log(JSON.stringify(mismatches, null, 2))
  process.exit(1)
}
console.log('All explorer assignments match the doc.')
