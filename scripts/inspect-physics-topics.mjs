import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

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
    const runs = pXml.split(/<w:r[ >]/).slice(1)
    let text = ''
    for (const run of runs) {
      const isSup = /w:vertAlign[^>]*w:val="superscript"/.test(run)
      const parts = [...run.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1])
      text += isSup ? parts.join('') : parts.join('')
    }
    return text.trim()
  }).filter(Boolean)
}

function decode(t) {
  return t.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

const paras = parasFromDocx('physicsnotes.docx').map(decode)

const syllabusTopics = []
let currentMajor = null
for (let i = 0; i < 103; i++) {
  const line = paras[i]
  const major = line.match(/^(\d+)\.\s+(.+)$/)
  if (major && !/^\d+\.\d+/.test(line)) {
    currentMajor = parseInt(major[1], 10)
    continue
  }
  const sub = line.match(/^(\d+\.\d+)\s+([^:]+):/)
  if (sub) {
    syllabusTopics.push({ num: sub[1], title: sub[2].trim(), major: currentMajor })
  }
}

function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

const titleSet = new Map(syllabusTopics.map((t) => [norm(t.title), t]))
const numTitleSet = new Map(syllabusTopics.map((t) => [t.num, t]))

const starts = [{ index: 103, topic: syllabusTopics[0] }]
for (let i = 104; i < paras.length; i++) {
  const line = paras[i]
  const numbered = line.match(/^(\d+\.\d+)\s+(.+)$/)
  if (numbered && numTitleSet.has(numbered[1]) && line.length < 80) {
    starts.push({ index: i, topic: numTitleSet.get(numbered[1]) })
    continue
  }
  const n = norm(line)
  if (n.length < 8 || n.length > 80) continue
  if (titleSet.has(n)) {
    starts.push({ index: i, topic: titleSet.get(n) })
  }
}

// dedupe adjacent same topic
const deduped = starts.filter((s, idx) => idx === 0 || s.topic.num !== starts[idx - 1].topic.num)

console.log('Topics found:', deduped.length, 'expected', syllabusTopics.length)
deduped.forEach((s, idx) => {
  const end = deduped[idx + 1]?.index ?? paras.length
  console.log(`${s.topic.num}\t${s.index + 1}-${end}\t${s.topic.title}`)
})
