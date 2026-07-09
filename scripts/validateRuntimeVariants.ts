/**
 * Validate every runtime-generated quiz variant against computed answers.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateRuntimeVariants } from '../src/features/quiz/quizVariantGenerators.ts'
import { validateMcqQuestion } from './validateQuestionAnswer.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const QUIZ_ROOT = path.join(__dirname, '..', 'content', 'quizzes')

const errors: string[] = []
let variantCount = 0
let patternVariantCount = 0

function walk(dir: string) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '_deprecated') continue
    const p = path.join(dir, name)
    if (fs.statSync(p).isDirectory()) walk(p)
    else if (name.endsWith('.json')) {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'))
      const rel = path.relative(QUIZ_ROOT, p)
      for (const q of data.questions ?? []) {
        const variants = generateRuntimeVariants(q)
        for (const v of variants) {
          variantCount += 1
          const id = `${rel} :: ${q.id} [runtime]`
          const merged = {
            ...q,
            question: v.question,
            options: v.options,
            correctIndex: v.correctIndex,
            explanation: v.explanation,
          }
          const errs = validateMcqQuestion(merged, id)
          if (errs.length) errors.push(...errs)
          else patternVariantCount += 1
        }
      }
    }
  }
}

walk(QUIZ_ROOT)

if (errors.length) {
  console.error(`Runtime variant errors (${errors.length}):\n`)
  errors.slice(0, 100).forEach((e) => console.error(`- ${e}`))
  if (errors.length > 100) console.error(`… and ${errors.length - 100} more`)
  process.exit(1)
}

console.log(`Runtime variants OK (${variantCount} variants generated and checked).`)
