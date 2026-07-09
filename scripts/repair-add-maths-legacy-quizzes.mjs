#!/usr/bin/env node
/**
 * Apply universal docx-import artefact fixes to ALL add-maths-0606 quiz JSON,
 * including legacy combined-topic duplicates not covered by chapter repair scripts.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizDir = path.join(__dirname, '..', 'content', 'quizzes', 'add-maths-0606')

const chapterDir = path.join(__dirname, '..', 'content', 'chapters', 'add-maths-0606')
const activeTopics = new Set()
for (const f of fs.readdirSync(chapterDir)) {
  if (!f.endsWith('.json')) continue
  const ch = JSON.parse(fs.readFileSync(path.join(chapterDir, f), 'utf8'))
  for (const t of ch.topicIds ?? []) activeTopics.add(t)
}

function fixUniversalArtifacts(text) {
  if (!text || typeof text !== 'string') return text
  let t = text

  // Docx glue: letter2letter ($t2O$, $s2s$, etc.)
  t = t.replace(/\$([a-zA-Z])2([a-zA-Z])\$/g, (_, a, b) => {
    const map = {
      tO: 'from $O$',
      sO: 'from $O$',
      O2: 'from $O$ with $',
      t2: 'when $',
      v2: 'is $v$',
      a2: 'is $a$',
      s2: 'is $s$',
      x2: 'when $x$',
      n2: 'when $n$',
    }
    return map[a + b] ?? `$${a}$ and $${b}$`
  })
  t = t.replace(/\$s2t/g, 'when $t$')
  t = t.replace(/\$t2([A-Z])/g, 'from $O$ and $')
  t = t.replace(/ and \$O2/g, ' from $O$ with $')
  t = t.replace(/\$O2/g, 'from $O$ with $')

  // Import placeholder $2$ between fragments
  t = t.replace(/\$2\$/g, ' ')

  // Caret glue (of^12 → of 12) — common in factorial/permutation explanations
  t = t.replace(/(of|or|between|by|side|radius|and|at|height|length|ladder)\^(\d+)/gi, '$1 $2')

  // ^2 So glue (ate "$. So")
  t = t.replace(/\^2 So /g, '$. So ')
  t = t.replace(/\$e\^2 So /gi, '$e$. So ')

  // $. So sentence splits
  t = t.replace(/\$O\$\.\s*So\s*\$/g, 'from $O$ is $')
  t = t.replace(/\$t\$\.\s*So\s*\$/g, 'for which $')
  t = t.replace(/\$v\$\.\s*So\s*\$/g, 'is $')
  t = t.replace(/\$s\$\.\s*So\s*\$/g, 'is $')
  t = t.replace(/\$x\$\.\s*So\s*\$/g, 'when $')
  t = t.replace(/\$n\$\.\s*So\s*\$/g, 'when $')

  // Unclosed math before period
  t = t.replace(/ at any time \$t\./, ' at any time $t$.')
  t = t.replace(/ as a function of \$t\./, ' as a function of $t$.')
  t = t.replace(/ as \$t \\to \\infty\./, ' as $t \\to \\infty$.')
  t = t.replace(/ when \$t = 5\$\./, ' when $t = 5$.')
  t = t.replace(/ \$0 \\le t \\le \\pi \./, ' for $0 \\le t \\le \\pi$.')
  t = t.replace(/\\to \\infty2e/g, '\\to \\infty$, $e')

  // Broken acceleration glue
  t = t.replace(/\$a = 4 - \$t\$/g, '$a = 4 - 2t$')

  // Binomial / series unclosed stems (common pattern)
  t = t.replace(/powers of \$x\./, 'powers of $x$.')
  t = t.replace(/powers of \$n\./, 'powers of $n$.')
  t = t.replace(/term \$x\^(\d+)\./, 'term $x^$1$.')
  t = t.replace(/in the interval \$0 \\le t \\le \\pi\./, 'in the interval $0 \\le t \\le \\pi$.')

  // Trailing corrupted explanation tails
  t = t.replace(/values of \$\$t\$\. 2\./g, 'values of $2t$ instead of $t$.')
  t = t.replace(/values of \$\$t\$\. \d+\./g, 'values of $t$.')

  return t
}

function repairString(val) {
  if (typeof val !== 'string') return val
  return fixUniversalArtifacts(val)
}

function repairQuestion(q) {
  const next = { ...q }
  if (next.question) next.question = repairString(next.question)
  if (next.options) next.options = next.options.map(repairString)
  if (next.explanation) next.explanation = repairString(next.explanation)
  return next
}

let files = 0
let legacyOnly = 0

for (const name of fs.readdirSync(quizDir)) {
  if (!name.endsWith('.json')) continue
  const filePath = path.join(quizDir, name)
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const isLegacy = !activeTopics.has(data.topicId)
  if (!isLegacy) continue

  const repaired = {
    ...data,
    questions: (data.questions ?? []).map(repairQuestion),
  }

  const before = JSON.stringify(data)
  const after = JSON.stringify(repaired)
  if (before !== after) {
    fs.writeFileSync(filePath, `${JSON.stringify(repaired, null, 2)}\n`)
    files++
    legacyOnly++
    console.log('legacy', name)
  }
}

console.log(`Universal legacy repair — ${files} legacy file(s) updated`)
