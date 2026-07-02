/**
 * Analyze question counts in a quiz docx file.
 * Run: node scripts/analyze-quiz-docx.mjs "Addmath questions.docx"
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const filename = process.argv[2] ?? 'Addmath questions.docx'

function parasFromDocx(name) {
  const src = path.join(root, name)
  const tmpDir = path.join(root, '.tmp-docx', name.replace(/[^\w.-]+/g, '_'))
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
}

const text = decodeXmlEntities(parasFromDocx(filename).join('\n'))
const re = /\{\s*"topic":\s*"([^"]+)",\s*"difficulty":\s*"([^"]+)",\s*"stem":/gs
const byTopic = {}
let total = 0
let m
while ((m = re.exec(text)) !== null) {
  const topic = m[1]
  const diff = m[2].toLowerCase()
  if (!byTopic[topic]) byTopic[topic] = {}
  byTopic[topic][diff] = (byTopic[topic][diff] ?? 0) + 1
  total++
}

const topics = Object.keys(byTopic).sort()
const diffs = ['easy', 'medium', 'hard', 'pyp']
console.log(`File: ${filename}`)
console.log(`Total questions: ${total}`)
console.log(`Unique topic labels: ${topics.length}`)
console.log(`Topics with 5+ per tier: ${topics.filter((t) => diffs.every((d) => (byTopic[t][d] ?? 0) >= 5)).length}`)
console.log(`Topics incomplete: ${topics.filter((t) => !diffs.every((d) => (byTopic[t][d] ?? 0) >= 5)).length}`)

const incomplete = topics.filter((t) => !diffs.every((d) => (byTopic[t][d] ?? 0) >= 5))
if (incomplete.length) {
  console.log('\nIncomplete topics:')
  for (const t of incomplete.slice(0, 30)) {
    console.log(`  ${t}: ${JSON.stringify(byTopic[t])}`)
  }
  if (incomplete.length > 30) console.log(`  ... and ${incomplete.length - 30} more`)
}
