#!/usr/bin/env node
/** Repair quiz JSON for Add Math Ch.16 topics only. */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prepareMathContent } from '../src/lib/mathMarkdown.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizRoot = path.join(__dirname, '../content/quizzes/add-maths-0606')
const chapter = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../content/chapters/add-maths-0606/ch16-kinematics.json'),
    'utf8',
  ),
)
const topicIds = new Set([...chapter.topicIds, chapter.id])

function repairString(val) {
  if (typeof val !== 'string') return val
  return prepareMathContent(val, 'quiz')
}

function repairQuestion(q) {
  const next = { ...q }
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

console.log(`Repaired ${files} Ch.16 quiz files (${questions} questions).`)
