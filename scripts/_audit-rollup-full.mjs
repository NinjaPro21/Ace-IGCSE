#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function runReport(subject) {
  const r = spawnSync('node', ['scripts/audit-quiz-content.mjs', subject, '--report'], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 100 * 1024 * 1024,
  })
  return JSON.parse(r.stdout)
}

function loadCanonical(subject) {
  const chapterDir = path.join(root, 'content/chapters', subject)
  const topicToChapter = {}
  const canonical = new Set()
  for (const f of fs.readdirSync(chapterDir)) {
    if (!f.endsWith('.json')) continue
    const ch = JSON.parse(fs.readFileSync(path.join(chapterDir, f), 'utf8'))
    for (const id of ch.topicIds ?? []) {
      canonical.add(id)
      topicToChapter[id] = ch.number
    }
  }
  return { canonical, topicToChapter }
}

for (const subject of ['add-maths-0606', 'maths-0580']) {
  const data = runReport(subject)
  const { canonical, topicToChapter } = loadCanonical(subject)
  const byChapter = {}
  const byTopic = {}
  let canon = 0
  let legacy = 0

  for (const line of data.errors) {
    const fileMatch = line.match(new RegExp(`${subject.replace(/-/g, '[-]')}[\\\\/]([^:]+)`))
    if (!fileMatch) continue
    const quizFile = fileMatch[1].trim()
    const topicId = quizFile.replace(/-(easy|medium|hard|pyp)\.json$/, '')
    byTopic[topicId] = (byTopic[topicId] || 0) + 1
    if (canonical.has(topicId)) {
      canon++
      const ch = topicToChapter[topicId] ?? 0
      byChapter[ch] = (byChapter[ch] || 0) + 1
    } else {
      legacy++
    }
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log(subject)
  console.log(`Questions checked: ${data.checked}`)
  console.log(`Blocking errors: ${data.errorCount} | Explanation warnings: ${data.warningCount}`)
  console.log(`Canonical errors: ${canon} | Legacy/unwired: ${legacy}`)
  console.log('\nErrors by chapter (canonical):')
  for (const [ch, n] of Object.entries(byChapter).sort((a, b) => Number(a[0]) - Number(b[0]))) {
    console.log(`  Ch${ch}: ${n}`)
  }
  console.log('\nTop error types:')
  for (const [msg, n] of Object.entries(data.byMsg).slice(0, 15)) {
    console.log(`  ${n}\t${msg.slice(0, 90)}`)
  }
  console.log('\nWorst canonical topics:')
  for (const [t, n] of Object.entries(byTopic)
    .filter(([id]) => canonical.has(id))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)) {
    console.log(`  ${n}\t${t}`)
  }
}
