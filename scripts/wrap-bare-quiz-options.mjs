#!/usr/bin/env node
/**
 * Wrap bare-math quiz options in $...$ (Class H fix).
 * Usage: node scripts/wrap-bare-quiz-options.mjs [--topic 6-4-...]
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { isBareQuizOptionMath, wrapBareQuizOption } from '../src/lib/mathMarkdown.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizRoot = path.join(__dirname, '..', 'content', 'quizzes')

const args = process.argv.slice(2)
const topicFilters = []
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--topic' && args[i + 1]) topicFilters.push(args[i + 1])
}

function walk(dir, rel = '') {
  let changed = 0
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const relPath = path.join(rel, name)
    if (fs.statSync(full).isDirectory()) {
      changed += walk(full, relPath)
      continue
    }
    if (!name.endsWith('.json')) continue
    const data = JSON.parse(fs.readFileSync(full, 'utf8'))
    if (topicFilters.length && !topicFilters.includes(data.topicId)) continue

    let fileChanged = false
    for (const q of data.questions ?? []) {
      if (!Array.isArray(q.options)) continue
      q.options = q.options.map((opt) => {
        const s = String(opt)
        if (!isBareQuizOptionMath(s)) return opt
        const wrapped = wrapBareQuizOption(s)
        if (wrapped !== s) {
          fileChanged = true
          changed += 1
        }
        return wrapped
      })
    }
    if (fileChanged) {
      fs.writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`)
      console.log('wrapped', relPath)
    }
  }
  return changed
}

const n = walk(quizRoot)
console.log(`Done — ${n} option(s) wrapped`)
