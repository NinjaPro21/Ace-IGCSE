/**
 * Analyze quiz counts per topic label in Notes (1).docx
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

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
      const ts = [...p.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1])
      return ts.join('').trim()
    })
    .filter(Boolean)
}

function decodeXmlEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
}

const quizParas = parasFromDocx('Notes  (1).docx')
const text = decodeXmlEntities(quizParas.join('\n'))
const re =
  /\{\s*"topic":\s*"([^"]+)",\s*"difficulty":\s*"([^"]+)",\s*"stem":/gs

const byTopic = {}
let m
while ((m = re.exec(text)) !== null) {
  const topic = m[1]
  const diff = m[2].toLowerCase()
  if (!byTopic[topic]) byTopic[topic] = {}
  byTopic[topic][diff] = (byTopic[topic][diff] ?? 0) + 1
}

const topics = Object.keys(byTopic).sort()
console.log('Unique quiz topic labels:', topics.length)

const ch1 = topics.filter((t) =>
  /function|mapping|composite|modulus|inverse|domain/i.test(t),
)
console.log('Ch1-related labels:', ch1.map((t) => `${t}: ${JSON.stringify(byTopic[t])}`))

console.log('Topics with >=5 easy:', topics.filter((t) => (byTopic[t].easy ?? 0) >= 5).length)
console.log('Topics with <5 easy:', topics.filter((t) => (byTopic[t].easy ?? 0) < 5).length)

const low = topics.filter((t) => (byTopic[t].easy ?? 0) < 5)
if (low.length) console.log('Low easy count samples:', low.slice(0, 15).map((t) => `${t}: ${byTopic[t].easy ?? 0}`))

const high = topics.filter((t) => (byTopic[t].easy ?? 0) >= 5).slice(0, 5)
for (const t of high) {
  console.log('OK', t, byTopic[t])
}

console.log('Total questions:', topics.reduce((s, t) => s + Object.values(byTopic[t]).reduce((a, b) => a + b, 0), 0))
