import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
function load() {
  const src = path.join(root, 'physicsquestions.docx')
  const tmpDir = path.join(root, '.tmp-docx', 'pqgrep')
  fs.mkdirSync(tmpDir, { recursive: true })
  const zipPath = path.join(tmpDir, 'doc.zip')
  fs.copyFileSync(src, zipPath)
  const extractDir = path.join(tmpDir, 'ex')
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
    .map((p) => [...p.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]).join(''))
    .join('')
    .replace(/&quot;/g, '"')
}

const joined = load()
const needle = process.argv[2] ?? 'kinetic theory of matter'
const idx = joined.indexOf(needle)
console.log(joined.slice(idx, idx + 1200))
