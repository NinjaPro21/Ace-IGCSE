import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function parasFromDocx() {
  const src = path.join(root, 'Notes .docx')
  const tmpDir = path.join(root, '.tmp-docx', 'Notes_.docx')
  const zipPath = path.join(tmpDir, 'doc.zip')
  fs.copyFileSync(src, zipPath)
  const extractDir = path.join(tmpDir, 'extracted')
  if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true })
  fs.mkdirSync(extractDir, { recursive: true })
  execSync(
    `powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${extractDir.replace(/'/g, "''")}' -Force"`,
    { stdio: 'pipe' },
  )
  const xml = fs.readFileSync(path.join(extractDir, 'word', 'document.xml'), 'utf8')
  return xml.split(/<w:p[ >]/).slice(1).map((p) => [...p.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]).join('').trim()).filter(Boolean)
}

const paras = parasFromDocx()
let current = null
let visual = null
let inVisual = false
for (const line of paras) {
  const m = line.match(/^(\d+)\.(\d+)\s+(.+)$/)
  if (m && /[a-zA-Z]/.test(m[3])) {
    if (current) console.log(`\n${current}\n${visual}`)
    current = `${m[1]}.${m[2]} ${m[3]}`
    visual = null
    inVisual = false
    continue
  }
  if (!current) continue
  if (line === 'Visual / interactive intent') { inVisual = true; continue }
  if (inVisual) visual = (visual ? visual + ' ' : '') + line
}
if (current) console.log(`\n${current}\n${visual}`)
