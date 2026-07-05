/**
 * Repair all quiz JSON across subjects: math normalization + known content fixes.
 * Run: npm run quiz:repair:all
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prepareMathContent } from '../src/lib/mathMarkdown.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizzesRoot = path.join(__dirname, '../content/quizzes')
const subjects = fs.readdirSync(quizzesRoot).filter((d) =>
  fs.statSync(path.join(quizzesRoot, d)).isDirectory(),
)

const BRACKET_QUESTION =
  /Insert one pair of brackets into the statement to make it correct: \$5 \+ 3 \\times 8 - 2 \+ 4 = 51\$/
const BRACKET_FIX = {
  question:
    'Insert one pair of brackets into the statement to make it correct: $5 + 3 \\times 8 - 2 + 4 = 35$. Which part must be bracketed?',
  correctIndex: 0,
  explanation:
    'Bracket $8 - 2 + 4$: $5 + 3 \\times (8 - 2 + 4) = 5 + 3 \\times 10 = 5 + 30 = 35$.\n\n**Common mistake:** Students randomly guess bracket placement without applying the order of operations systematically.',
}

function repairString(val) {
  if (typeof val !== 'string') return val
  return prepareMathContent(val, 'quiz')
}

function repairQuestion(q) {
  const next = { ...q }
  const questionText = q.question ?? ''

  if (BRACKET_QUESTION.test(questionText)) {
    next.question = BRACKET_FIX.question
    next.correctIndex = BRACKET_FIX.correctIndex
    next.explanation = BRACKET_FIX.explanation
  } else if (next.question) {
    next.question = repairString(next.question)
  }

  if (next.options) next.options = next.options.map(repairString)
  if (next.explanation && !BRACKET_QUESTION.test(questionText)) {
    let expl = repairString(next.explanation)
    if (/structural design|Let's state option|re-verify\^51/i.test(expl)) {
      const cm = expl.split(/\n\n\*\*Common mistake:\*\*/)[1]
      expl = cm
        ? `Review the order of operations and test each bracket placement.\n\n**Common mistake:**${cm}`
        : 'Review the order of operations and test each bracket placement systematically.'
    }
    next.explanation = expl
  }

  if (next.variants?.length) {
    next.variants = next.variants.map((v) => repairQuestion({ ...q, ...v, variants: undefined }))
  }
  return next
}

let filesUpdated = 0
let questionsFixed = 0
let writeErrors = 0

function sleep(ms) {
  const end = Date.now() + ms
  while (Date.now() < end) {}
}

function writeJsonSafe(filePath, content) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      fs.writeFileSync(filePath, content, 'utf8')
      return true
    } catch (e) {
      if (attempt === 2) {
        console.error(`Failed to write ${filePath}: ${e.message}`)
        writeErrors++
        return false
      }
      sleep(250)
    }
  }
  return false
}

for (const subject of subjects) {
  const dir = path.join(quizzesRoot, subject)
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const filePath = path.join(dir, file)
    const before = fs.readFileSync(filePath, 'utf8')
    const quiz = JSON.parse(before)
    if (quiz.title) quiz.title = prepareMathContent(quiz.title, 'title')
    if (quiz.questions) {
      quiz.questions = quiz.questions.map((q) => {
        const repaired = repairQuestion(q)
        if (JSON.stringify(repaired) !== JSON.stringify(q)) questionsFixed++
        return repaired
      })
    }
    const after = JSON.stringify(quiz, null, 2) + '\n'
    if (after !== before) {
      if (writeJsonSafe(filePath, after)) filesUpdated++
    }
  }
}

console.log(
  `Repaired ${filesUpdated} quiz files (${subjects.join(', ')}), ${questionsFixed} questions touched.${writeErrors ? ` (${writeErrors} write errors)` : ''}`,
)
if (writeErrors) process.exit(1)
