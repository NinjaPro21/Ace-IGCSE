import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const filename = 'physicsnotes.docx'

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
  return xml
    .split(/<w:p[ >]/)
    .slice(1)
    .map((pXml) => {
      const runs = pXml.split(/<w:r[ >]/).slice(1)
      let text = ''
      for (const run of runs) {
        const isSup = /w:vertAlign[^>]*w:val="superscript"/.test(run)
        const parts = [...run.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1])
        const joined = parts.join('')
        text += isSup ? joined : joined
      }
      return text.trim()
    })
    .filter(Boolean)
}

const paras = parasFromDocx(filename)
console.log('Total paras:', paras.length)
for (let i = 0; i < Math.min(100, paras.length); i++) {
  console.log(`${i + 1}\t${paras[i].slice(0, 140)}`)
}

console.log('\n--- CHAPTER MARKERS ---')
paras.forEach((p, i) => {
  if (/^CHAPTER|^Chapter|^CH\.|^Module|^Section \d/i.test(p) || /^Physics/i.test(p)) {
    console.log(`${i + 1}\t${p}`)
  }
})

console.log('\n--- TOPIC / SECTION HEADERS ---')
paras.forEach((p, i) => {
  if (/^\d+\.\d+/.test(p) || /^Topic:/i.test(p) || p === 'Core idea' || /^[A-Z][a-z].* —/.test(p)) {
    if (p.length < 100) console.log(`${i + 1}\t${p}`)
  }
})
