import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = path.join(root, 'Mathnotes.docx')
const tmpDir = path.join(root, '.tmp-docx', 'Mathnotes_docx')
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
const xml = fs.readFileSync(path.join(extractDir, 'word/document.xml'), 'utf8')
const notes = xml
  .split(/<w:p[ >]/)
  .slice(1)
  .map((p) => [...p.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]).join('').trim())
  .filter(Boolean)

const intents = []
for (let i = 0; i < notes.length; i++) {
  if (notes[i] === 'Visual / interactive intent' && notes[i + 1] && !notes[i + 1].startsWith('Notes only')) {
    intents.push(notes[i + 1])
  }
}
console.log('Explorer intents:', intents.length)
intents.forEach((t, i) => console.log(`${i + 1}. ${t.slice(0, 200)}`))
