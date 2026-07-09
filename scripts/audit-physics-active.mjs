#!/usr/bin/env node
/** Audit only active physics topic quizzes (excludes chNN-* stubs). */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const chapterDir = path.join(__dirname, '..', 'content', 'chapters', 'physics')

const active = new Set()
for (const f of fs.readdirSync(chapterDir)) {
  if (!f.endsWith('.json')) continue
  const ch = JSON.parse(fs.readFileSync(path.join(chapterDir, f), 'utf8'))
  for (const t of ch.topicIds ?? []) active.add(t)
}

const r = spawnSync('node', ['scripts/audit-quiz-content.mjs', 'physics', '--strict', '--report'], {
  cwd: path.join(__dirname, '..'),
  encoding: 'utf8',
})
const j = JSON.parse(r.stdout)

function topicFromError(line) {
  const file = line.split(' :: ')[0].split(/[/\\]/).pop()
  if (file.startsWith('ch')) return null
  return file.replace(/-(easy|medium|hard|pyp)\.json$/, '')
}

const activeErrors = j.errors.filter((e) => {
  const t = topicFromError(e)
  return t && active.has(t)
})

console.log(`Active physics quiz audit: ${activeErrors.length} error(s) (${j.errorCount} total incl. stubs)`)
if (activeErrors.length) {
  activeErrors.forEach((e) => console.log(`  - ${e}`))
  process.exit(1)
}
console.log('✓ No blocking issues on active physics topics')
process.exit(0)
