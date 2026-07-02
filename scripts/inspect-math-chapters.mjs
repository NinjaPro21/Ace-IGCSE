import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

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

const notes = parasFromDocx('Mathnotes.docx')
let currentChapter = null
const map = []

for (const p of notes) {
  if (/^CHAPTER \d+/i.test(p)) {
    currentChapter = p
    continue
  }
  const tm = p.match(/^Topic\s+([\d.]+(?:\s*[–&][\d.]+)?)\s*:?\s*(.+)$/i)
  if (tm) {
    map.push({ chapter: currentChapter, topic: p, num: tm[1], title: tm[2] })
  }
}

console.log('Topics by chapter:')
const byCh = {}
for (const m of map) {
  byCh[m.chapter ?? 'NONE'] = (byCh[m.chapter ?? 'NONE'] ?? 0) + 1
}
for (const [ch, n] of Object.entries(byCh)) console.log(n, ch)

console.log('\nCHAPTER 5 topics:')
map.filter((m) => m.chapter?.includes('TRIGONOMETRY')).forEach((m) => console.log(' -', m.topic))

