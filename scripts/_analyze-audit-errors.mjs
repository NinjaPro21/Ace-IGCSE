#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const r = spawnSync('node', ['scripts/audit-quiz-content.mjs', 'add-maths-0606', '--strict'], {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 50 * 1024 * 1024,
})

const lines = (r.stdout + r.stderr)
  .split('\n')
  .filter((l) => l.includes('add-maths-0606\\'))

const byMsg = {}
const byFile = {}
const byTopicId = new Set()

for (const line of lines) {
  const idx = line.indexOf('add-maths-0606\\')
  if (idx < 0) continue
  const rest = line.slice(idx)
  const fileEnd = rest.indexOf('.json')
  if (fileEnd < 0) continue
  const file = rest.slice('add-maths-0606\\'.length, fileEnd + 5)
  const after = rest.slice(fileEnd + 5)
  const fieldMatch = after.match(/:: ([^\[]+) \[([^\]]+)\]: (.+)$/)
  if (!fieldMatch) continue
  const [, , field, msg] = fieldMatch
  byMsg[msg] = (byMsg[msg] || 0) + 1
  byFile[file] = (byFile[file] || 0) + 1
}

// Load canonical topic IDs from chapter JSON
const chapterDir = path.join(root, 'content', 'chapters', 'add-maths-0606')
const canonicalTopics = new Set()
for (const f of fs.readdirSync(chapterDir)) {
  if (!f.endsWith('.json')) continue
  const ch = JSON.parse(fs.readFileSync(path.join(chapterDir, f), 'utf8'))
  for (const id of ch.topicIds ?? []) canonicalTopics.add(id)
}

// Map quiz files to topicId
const quizDir = path.join(root, 'content', 'quizzes', 'add-maths-0606')
let canonicalErrors = 0
let legacyErrors = 0
const legacyFiles = {}
const canonicalFiles = {}

for (const [file, count] of Object.entries(byFile)) {
  const fp = path.join(quizDir, file)
  if (!fs.existsSync(fp)) continue
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'))
  const tid = data.topicId
  if (canonicalTopics.has(tid)) {
    canonicalErrors += count
    canonicalFiles[file] = count
  } else {
    legacyErrors += count
    legacyFiles[file] = count
  }
}

console.log('TOTAL ERRORS', lines.length)
console.log('\n=== BY ERROR TYPE ===')
Object.entries(byMsg)
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => console.log(`${v}\t${k}`))

console.log(`\n=== SCOPE ===`)
console.log(`Canonical topic quiz errors: ${canonicalErrors}`)
console.log(`Legacy/unwired quiz errors: ${legacyErrors}`)
console.log(`Canonical topics: ${canonicalTopics.size}`)

console.log('\n=== CANONICAL FILES WITH ERRORS (top 30) ===')
Object.entries(canonicalFiles)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 30)
  .forEach(([k, v]) => console.log(`${v}\t${k}`))

console.log('\n=== LEGACY FILES WITH ERRORS (top 20) ===')
Object.entries(legacyFiles)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)
  .forEach(([k, v]) => console.log(`${v}\t${k}`))
