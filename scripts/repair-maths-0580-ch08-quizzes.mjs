#!/usr/bin/env node
/**
 * Repair canonical Maths 0580 Ch.8 quiz JSON (live site content only).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prepareMathContent } from '../src/lib/mathMarkdown.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizRoot = path.join(__dirname, '../content/quizzes/maths-0580')
const chapter = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../content/chapters/maths-0580/ch08-probability-statistics.json'),
    'utf8',
  ),
)
const topicIds = new Set(chapter.topicIds)

const CONTENT_FIXES = {
  '13-2-13-6-averages-comparison-medium-q1': {
    question:
      'A set contains the numbers 3, 7, 8, 10, and $x$. If the mean is 6, find $x$.',
  },
  '13-2-13-6-averages-comparison-pyp-q4': {
    question:
      'The table shows marks 3, 4, and 5 with frequencies 3, $x$, and 4. If the mean is 4.1, find $x$.',
    explanation:
      'Total sum $= (3 \\times 3) + (4 \\times x) + (5 \\times 4) = 9 + 4x + 20 = 29 + 4x$. Total frequency $= 3 + x + 4 = 7 + x$. $(29 + 4x) / (7 + x) = 4.1 \\Rightarrow 29 + 4x = 28.7 + 4.1x \\Rightarrow 0.3 = 0.1x \\Rightarrow x = 3$.\n\n**Common mistake:** Setting up the equation incorrectly, such as multiplying the mean by only the known frequency (7).',
  },
  '13-5-cumulative-frequency-box-plots-easy-q5': {
    question:
      'How is the lower quartile (25th percentile) found using the total frequency $N$?',
  },
  '14-1-14-3-probability-rules-hard-q1': {
    question:
      'A bag contains 12 balls, of which $x$ are white. When 6 more white balls are added, the probability of selecting a white ball is exactly doubled. Find the value of $x$.',
  },
  '14-4-tree-diagrams-pyp-q2': {
    explanation:
      'Total students $= 27$. $P(B,B) = 14/27 \\times 13/26 = 182/702 = 91/351$.\n\n**Common mistake:** Treating the events as independent ($14/27 \\times 14/27$) or forgetting to simplify the fraction.',
  },
  '14-5-14-6-advanced-probability-hard-q1': {
    question:
      'In a school group of 120, students study Biology (B), Chemistry (C), and Physics (P). In the diagram, $x$ students study Biology only, $2x+1$ study B and C only, $x+1$ study B and P only, and 10 study all three. If the total studying Biology is 60, find $x$.',
    explanation:
      '$x + (2x + 1) + (x + 1) + 10 = 60 \\Rightarrow 4x + 12 = 60 \\Rightarrow x = 12$.\n\n**Common mistake:** Forgetting to include the "all three" (10) in the sum for the Biology circle.',
  },
  '14-5-14-6-advanced-probability-pyp-q5': {
    explanation:
      '$P(B\') = 1 - 0.7 = 0.3$. The part of $A$ outside $B$ is $0.8 - 0.5 = 0.3$. So $P(A \\mid B\') = 0.3 / 0.3 = 1.0$.\n\n**Common mistake:** Thinking that if $B$ does not occur, $A$ and $B$ must be independent.',
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

console.log(`Repaired ${files} Maths 0580 Ch.8 quiz files (${questions} questions).`)
