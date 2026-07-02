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
    .map((p) => {
      const runs = p.split(/<w:r[ >]/).slice(1)
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

for (const f of ['Mathnotes.docx', 'Mathquestions.docx']) {
  const paras = parasFromDocx(f)
  console.log(`\n=== ${f} (${paras.length} paragraphs) ===`)
  paras.slice(0, 50).forEach((p, i) => console.log(`${i + 1}. ${p.slice(0, 140)}`))
  console.log('--- tail ---')
  paras.slice(-20).forEach((p, i) => console.log(`${paras.length - 20 + i + 1}. ${p.slice(0, 140)}`))
}

// quiz count in Mathquestions
const qText = decodeXmlEntities(parasFromDocx('Mathquestions.docx').join('\n'))
const re = /\{\s*"topic":\s*"([^"]+)",\s*"difficulty":\s*"([^"]+)"/gi
const byTopic = {}
let m
while ((m = re.exec(qText)) !== null) {
  byTopic[m[1]] = byTopic[m[1]] ?? {}
  const diff = m[2].toLowerCase()
  byTopic[m[1]][diff] = (byTopic[m[1]][diff] ?? 0) + 1
}
console.log('\n=== Quiz topics in Mathquestions.docx ===')
console.log('Count:', Object.keys(byTopic).length)
for (const [t, tiers] of Object.entries(byTopic).slice(0, 30)) {
  console.log(t, tiers)
}

function decodeXmlEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

// Mathnotes structure
const notes = parasFromDocx('Mathnotes.docx')
const coreIdx = notes.map((p, i) => ({ i, p })).filter((x) => x.p === 'Core idea')
console.log('\n=== Mathnotes structure ===')
console.log('Core idea sections:', coreIdx.length)
if (coreIdx[0]) {
  const i = coreIdx[0].i
  console.log('First section context:')
  notes.slice(Math.max(0, i - 3), i + 8).forEach((p, j) => console.log(`${Math.max(0, i - 3) + j + 1}. ${p.slice(0, 120)}`))
}
const secHeadings = notes.filter((p) => /^\d+\.\d+/.test(p) && /[A-Za-z]/.test(p))
console.log('Numbered headings:', secHeadings.length)
secHeadings.slice(0, 15).forEach((p) => console.log(' -', p.slice(0, 100)))
const visual = notes.filter((p) => /visual|explorer|interactive/i.test(p))
console.log('Visual/explorer mentions:', visual.length)
visual.filter((p) => !p.startsWith('Notes only')).slice(0, 40).forEach((p) => console.log(' *', p.slice(0, 160)))

const chapters = notes.filter((p) => /^CHAPTER \d+/i.test(p))
console.log('\nChapter headers:', chapters.length)
chapters.forEach((p) => console.log(' #', p))

const topics = notes.filter((p) => /^Topic \d+\.\d+/i.test(p))
console.log('\nTopic headers:', topics.length)
topics.slice(0, 20).forEach((p) => console.log(' >', p))
topics.slice(-10).forEach((p) => console.log(' >', p))


