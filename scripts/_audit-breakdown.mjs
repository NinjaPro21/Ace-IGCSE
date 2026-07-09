#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

for (const subject of ['add-maths-0606', 'maths-0580']) {
  const r = spawnSync('node', ['scripts/audit-quiz-content.mjs', subject, '--strict'], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 80 * 1024 * 1024,
  })

  const lines = (r.stdout + r.stderr)
    .split('\n')
    .filter((l) => l.includes(`${subject}\\`) || l.includes(`${subject}/`))

  const byMsg = {}
  const byField = {}
  const byFile = {}
  const byChapter = {}

  for (const line of lines) {
    const fieldMatch = line.match(/\[([^\]]+)\]: (.+)$/)
    if (!fieldMatch) continue
    const [, field, msg] = fieldMatch
    byMsg[msg] = (byMsg[msg] || 0) + 1
    byField[field] = (byField[field] || 0) + 1

    const fileMatch = line.match(new RegExp(`${subject.replace(/-/g, '[-]')}\\\\([^:]+)`))
    if (fileMatch) {
      const file = fileMatch[1]
      byFile[file] = (byFile[file] || 0) + 1
      const ch = file.match(/^(\d+)-/)?.[1] ?? file.match(/^ch(\d+)/)?.[1] ?? 'legacy'
      byChapter[ch] = (byChapter[ch] || 0) + 1
    }
  }

  console.log(`\n========== ${subject} ==========`)
  console.log(`TOTAL ERRORS: ${lines.length}`)
  console.log('\nBY FIELD:')
  Object.entries(byField)
    .sort((a, b) => b[1] - a[1])
    .forEach(([k, v]) => console.log(`  ${v}\t${k}`))

  console.log('\nBY ERROR TYPE (top 30):')
  Object.entries(byMsg)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .forEach(([k, v]) => console.log(`  ${v}\t${k}`))

  console.log('\nBY CHAPTER:')
  Object.entries(byChapter)
    .sort((a, b) => {
      const na = a[0] === 'legacy' ? 999 : Number(a[0])
      const nb = b[0] === 'legacy' ? 999 : Number(b[0])
      return na - nb
    })
    .forEach(([k, v]) => console.log(`  ${v}\tCh${k}`))

  console.log('\nTOP FILES (15):')
  Object.entries(byFile)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([k, v]) => console.log(`  ${v}\t${k}`))
}
