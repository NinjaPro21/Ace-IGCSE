#!/usr/bin/env node
/**
 * Repair canonical Maths 0580 Ch.7 quiz JSON (live site content only).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prepareMathContent } from '../src/lib/mathMarkdown.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizRoot = path.join(__dirname, '../content/quizzes/maths-0580')
const chapter = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../content/chapters/maths-0580/ch07-sets-functions-logical-systems.json'),
    'utf8',
  ),
)
const topicIds = new Set(chapter.topicIds)

const CONTENT_FIXES = {
  '11-1-11-2-sets-venn-diagrams-easy-q3': {
    explanation:
      'The symbol $\\in$ means "is an element of" or "belongs to".\n\n**Common mistake:** Confusing the element symbol $\\in$ with $\\subseteq$.',
  },
  '11-1-11-2-sets-venn-diagrams-hard-q1': {
    question:
      "On a Venn diagram with three intersecting sets A, B, and C, which region is described by $(B \\cap C) \\cap A'$?",
  },
  '11-1-11-2-sets-venn-diagrams-hard-q3': {
    question:
      'In a school of 50 students, everyone takes at least one science. 7 take all three. 9 take Physics and Chemistry only, 8 take Maths and Physics only, 5 take Maths and Chemistry only. If $x$ students take Maths only and $x+3$ take Chemistry only, find $x$.',
  },
  '11-1-11-2-sets-venn-diagrams-hard-q5': {
    question:
      "Simplify the following set to its simplest form: $(A \\cup B) \\cap (A \\cup B)'$.",
  },
  '11-1-11-2-sets-venn-diagrams-medium-q1': {
    question:
      'Given $\\mathscr{E} = \\{1, 2, 3, 4, 5, 6, 7, 8\\}$, $A = \\{1, 3, 5\\}$ and $B = \\{5, 6, 7\\}$, list the members of the set $A \\cap B$.',
  },
  '11-3-11-4-functions-pyp-q4': {
    question:
      'If $f(x) = \\sin x$ and $g(x) = 3x + 6$, determine the expression for $g^{-1}(f(x))$.',
    explanation:
      'First find $g^{-1}(x) = (x - 6) / 3$. Then substitute $f(x)$ into $g^{-1}$: $g^{-1}(f(x)) = (\\sin x - 6) / 3$.\n\n**Common mistake:** Failing to calculate the inverse function of $g$ before substituting $f(x)$.',
  },
}

function repairQuizStringPre(text) {
  if (!text) return text
  let t = text
  t = t.replace(/\$\$\s*\n([\s\S]*?)(?:\n(?!\$)|$)/g, (_, inner) => {
    const trimmed = inner.trim()
    return trimmed ? `$${trimmed}$` : ''
  })
  if (((t.match(/(?<!\\)\$/g) ?? []).length % 2) !== 0) {
    t = t.replace(/(\$[^$\n]+)\.(?="|'|\s*$)/g, '$1$.')
    t = t.replace(/(\$[^$\n]+)\?(?="|'|\s*$)/g, '$1$?')
  }
  return t
}

function repairString(val) {
  if (typeof val !== 'string') return val
  return prepareMathContent(repairQuizStringPre(val), 'quiz')
}

function repairQuestion(q) {
  const fix = CONTENT_FIXES[q.id]
  const next = { ...q }
  if (fix?.question) next.question = fix.question
  if (fix?.explanation) next.explanation = fix.explanation
  if (fix?.options) next.options = fix.options
  if (fix?.correctIndex !== undefined) next.correctIndex = fix.correctIndex
  if (next.question) next.question = repairString(next.question)
  if (next.options) next.options = next.options.map(repairString)
  if (next.explanation) next.explanation = repairString(next.explanation)
  if (next.variants?.length) {
    next.variants = next.variants.map((v) => repairQuestion({ ...q, ...v, variants: undefined }))
  }
  return next
}

let files = 0
let questions = 0

for (const name of fs.readdirSync(quizRoot)) {
  if (!name.endsWith('.json')) continue
  const filePath = path.join(quizRoot, name)
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  if (!topicIds.has(data.topicId)) continue

  const repaired = {
    ...data,
    title: repairString(data.title ?? ''),
    questions: (data.questions ?? []).map((q) => {
      questions++
      return repairQuestion(q)
    }),
  }
  fs.writeFileSync(filePath, JSON.stringify(repaired, null, 2) + '\n', 'utf8')
  files++
}

console.log(`Repaired ${files} Maths 0580 Ch.7 quiz files (${questions} questions).`)
