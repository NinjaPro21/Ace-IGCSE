import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const contentRoot = path.join(root, 'content')
const subjectId = 'add-maths-0606'

// duplicate mapExplorer + parse from audit - import by running import script logic inline
import { createRequire } from 'module'
// We'll inline minimal parse

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
  return xml.split(/<w:p[ >]/).slice(1).map((p) => [...p.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]).join('').trim()).filter(Boolean)
}

function cleanText(t) {
  return t.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
}
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 52)
}

// load mapExplorer from import script by eval - simpler: read topics and doc visual intents only
const SECTION_LABELS = new Set(['Core idea', 'Key formulas', 'Steps / method', 'Worked example', 'Worked Example (0606/PYP Style)', 'Examiner tip', 'Quick check', 'Visual / interactive intent'])
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
      docSections.push(current)
    }
    current = { section: `${secMatch[1]}.${secMatch[2]}`, title: secMatch[3], topicId: `${secMatch[1]}-${secMatch[2]}-${slugify(secMatch[3])}` }
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
if (current) { current.visualIntent = visualIntent?.trim() || null; docSections.push(current) }

const topicDir = path.join(contentRoot, 'topics', subjectId)
console.log('SECTION | EXPLORER | PANELS | DOC INTENT (first 80 chars)')
console.log('-'.repeat(120))
for (const sec of docSections) {
  const topicPath = path.join(topicDir, `${sec.topicId}.json`)
  const topic = fs.existsSync(topicPath) ? JSON.parse(fs.readFileSync(topicPath, 'utf8')) : null
  const notesOnly = !sec.visualIntent || /notes only/i.test(sec.visualIntent)
  const exp = notesOnly ? '—' : (topic?.explorerId ?? 'MISSING')
  const panels = notesOnly ? '—' : JSON.stringify(topic?.explorerPanels ?? [])
  const intent = notesOnly ? 'Notes only' : (sec.visualIntent?.slice(0, 80) ?? '')
  console.log(`${sec.section.padEnd(8)} | ${String(exp).padEnd(22)} | ${panels.padEnd(20)} | ${intent}`)
}
