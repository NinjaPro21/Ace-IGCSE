import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const root = path.dirname(fileURLToPath(import.meta.url)) + '/..'
const src = path.join(root, 'Notes .docx')
const tmpDir = path.join(root, '.tmp-docx', 'inspect')
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
const idx = xml.indexOf('Worked Example 2')
const snippet = xml.slice(idx, idx + 8000)
const paras = snippet.split(/<w:p[ >]/).slice(1, 60)
for (const p of paras) {
  const runs = p.split(/<w:r[ >]/).slice(1)
  let line = ''
  for (const run of runs) {
    const isSup = /w:vertAlign[^>]*w:val="superscript"/.test(run)
    const t = [...run.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]).join('')
    line += isSup ? `[${t}]` : t
  }
  if (line.trim()) console.log(JSON.stringify(line.trim()))
}
