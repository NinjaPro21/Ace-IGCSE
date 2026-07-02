import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function parasFromDocx(name) {
  const src = path.join(root, name)
  const tmpDir = path.join(root, '.tmp-docx', name.replace(/\s/g, '_'))
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
  return xml.split(/<w:p[ >]/).slice(1).map((pXml) => {
    let text = ''
    for (const run of pXml.split(/<w:r[ >]/).slice(1)) {
      text += [...run.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]).join('')
    }
    return text.trim()
  }).filter(Boolean)
}

const paras = parasFromDocx('physicsnotes.docx')
for (const kw of ['Total Internal', 'States of Matter', 'Pitch', 'Loudness', 'critical angle', 'optical fibre']) {
  console.log('\n===', kw, '===')
  paras.forEach((p, i) => {
    if (p.toLowerCase().includes(kw.toLowerCase()) && p.length < 120) console.log(i + 1, p)
  })
}
