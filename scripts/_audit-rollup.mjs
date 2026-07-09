#!/usr/bin/env node
/** Full audit rollup: blocking errors by chapter/topic for math subjects. */
import fs from 'fs'
import path from 'path'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function loadCanonical(subject) {
  const chapterDir = path.join(root, 'content', 'chapters', subject)
  const topicToChapter = {}
  const canonical = new Set()
  for (const f of fs.readdirSync(chapterDir)) {
    if (!f.endsWith('.json')) continue
    const ch = JSON.parse(fs.readFileSync(path.join(chapterDir, f), 'utf8'))
    for (const id of ch.topicIds ?? []) {
      canonical.add(id)
      topicToChapter[id] = { num: ch.number, title: ch.title }
    }
  }
  return { canonical, topicToChapter }
}

function topicFromFile(file) {
  return file.replace(/-(easy|medium|hard|pyp)\.json$/, '')
}

function runAudit(subject, strict = false) {
  const args = ['scripts/audit-quiz-content.mjs', subject]
  if (strict) args.push('--strict')
  const r = spawnSync('node', args, { cwd: root, encoding: 'utf8', maxBuffer: 100 * 1024 * 1024 })
  const lines = (r.stdout + r.stderr)
    .split('\n')
    .filter((l) => l.trim().startsWith('-') && l.includes(`${subject}\\`))

  const byMsg = {}
  const byField = {}
  const byChapter = {}
  const byTopic = {}
  let canonicalCount = 0
  let legacyCount = 0

  const { canonical, topicToChapter } = loadCanonical(subject)

  for (const line of lines) {
    const fieldMatch = line.match(/\[([^\]]+)\]: (.+)$/)
    if (!fieldMatch) continue
    const [, field, msg] = fieldMatch
    byMsg[msg] = (byMsg[msg] || 0) + 1
    byField[field] = (byField[field] || 0) + 1

    const fileMatch = line.match(new RegExp(`${subject}\\\\([^:]+)`))
    if (!fileMatch) continue
    const file = fileMatch[1]
    const topicId = topicFromFile(file)
    byTopic[topicId] = (byTopic[topicId] || 0) + 1

    if (canonical.has(topicId)) {
      canonicalCount++
      const ch = topicToChapter[topicId]?.num ?? 0
      byChapter[ch] = (byChapter[ch] || 0) + 1
    } else {
      legacyCount++
      byChapter.legacy = (byChapter.legacy || 0) + 1
    }
  }

  return { total: lines.length, canonicalCount, legacyCount, byMsg, byField, byChapter, byTopic }
}

for (const subject of ['add-maths-0606', 'maths-0580']) {
  const r = runAudit(subject, false)
  console.log(`\n${'='.repeat(60)}`)
  console.log(`${subject} — BLOCKING ERRORS (questions + options)`)
  console.log(`Total: ${r.total} | Canonical: ${r.canonicalCount} | Legacy/unwired: ${r.legacyCount}`)
  console.log('\nBy chapter (canonical):')
  Object.entries(r.byChapter)
    .filter(([k]) => k !== 'legacy')
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .forEach(([ch, n]) => console.log(`  Ch${ch}: ${n}`))
  if (r.byChapter.legacy) console.log(`  Legacy files: ${r.byChapter.legacy}`)

  console.log('\nTop error types:')
  Object.entries(r.byMsg)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([msg, n]) => console.log(`  ${n}\t${msg.slice(0, 90)}`))

  console.log('\nWorst topics (canonical):')
  const { canonical } = loadCanonical(subject)
  Object.entries(r.byTopic)
    .filter(([t]) => canonical.has(t))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .forEach(([t, n]) => console.log(`  ${n}\t${t}`))
}
