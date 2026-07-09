/**
 * Validate quiz JSON answers against computed math for known patterns.
 * Run: node scripts/validateQuizzes.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  coeffX2InExpansion,
  evalCubic,
  productOfCubicRootsMinusForm,
  substitutionQuadraticCoeff,
  parseNumericOption,
  parseQuadraticOption,
} from './quizMath.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const QUIZ_ROOT = path.join(__dirname, '..', 'content', 'quizzes')

const errors = []

function check(questionId, field, message) {
  errors.push({ questionId, field, message })
}

function parseCubicFromTex(tex) {
  const normalized = tex.replace(/²/g, '^2').replace(/³/g, '^3').trim()
  const parts = normalized.split(/\s*([+-])\s*/)
  const terms = []
  if (parts[0]) terms.push(parts[0])
  for (let i = 1; i < parts.length; i += 2) {
    terms.push(parts[i] + parts[i + 1])
  }

  let a3 = 0
  let a2 = 0
  let a1 = 0
  let a0 = 0

  for (const term of terms) {
    const t = term.trim()
    if (!t) continue
    const sign = t.startsWith('-') ? -1 : 1
    const body = t.replace(/^[-+]/, '').trim()
    if (body.includes('x^3') || body.includes('x³')) {
      const n = body.replace(/x\^?3.*/, '') || '1'
      a3 = sign * Number(n)
    } else if (body.includes('x^2') || body.includes('x²')) {
      const n = body.replace(/x\^?2.*/, '') || '1'
      a2 = sign * Number(n)
    } else if (/^(\d*)x$/.test(body) || body === 'x') {
      const n = body.replace('x', '') || '1'
      a1 = sign * Number(n)
    } else if (/^\d+$/.test(body)) {
      a0 = sign * Number(body)
    }
  }

  if (a3 === 0 && a2 === 0 && a1 === 0 && a0 === 0) return null
  return [a3, a2, a1, a0]
}

function validateQuestion(q, file) {
  const id = `${file} :: ${q.id}`
  if (q.correctIndex < 0 || q.correctIndex >= q.options.length) {
    check(id, 'correctIndex', `out of range (${q.correctIndex})`)
    return
  }

  const text = q.question
  let expected = null

  let m = text.match(
    /coefficient of \$x\^2\$.*\((\d+)x\^2\s*-\s*(\d+)x\s*\+\s*(\d+)\)\((\d+)x\s*-\s*(\d+)\)/i,
  )
  if (m) {
    expected = coeffX2InExpansion(+m[1], +m[2], +m[4], +m[5])
  }

  m = text.match(
    /remainder when (?:the polynomial )?\$P\(x\) = (.+?)\$ is divided by \$x - (\d+)\$/i,
  )
  if (m && expected === null) {
    const coeffs = parseCubicFromTex(m[1])
    if (coeffs) expected = evalCubic(coeffs, +m[2])
  }

  m = text.match(/(\d+)x\^?3\s*-\s*(\d+)x\^?2\s*\+\s*(\d+)x\s*-\s*(\d+)\s*=\s*0/i)
  if (m && text.toLowerCase().includes('product') && expected === null) {
    expected = productOfCubicRootsMinusForm(+m[1], +m[4])
  }

  m = text.match(
    /y = (?:(\d+)x|x) \+ (\d+).*x² \+ y² = (\d+)/i,
  )
  if (m && expected === null) {
    const mx = m[1] ? Number(m[1]) : 1
    const b = Number(m[2])
    const r = Number(m[3])
    const quad = substitutionQuadraticCoeff(mx, b, r)
    const correctQuad = parseQuadraticOption(q.options[q.correctIndex])
    if (!correctQuad) {
      check(id, 'options', 'could not parse quadratic correct option')
    } else if (
      correctQuad.a !== quad.a ||
      correctQuad.b !== quad.b ||
      correctQuad.c !== quad.c
    ) {
      check(
        id,
        'correctIndex',
        `expected ${quad.a}x² + ${quad.b}x + ${quad.c} = 0, got ${correctQuad.a}x² + ${correctQuad.b}x + ${correctQuad.c} = 0`,
      )
    }
    expected = null // handled above
  }

  if (expected !== null) {
    const correctOpt = parseNumericOption(q.options[q.correctIndex])
    if (correctOpt === null) {
      check(id, 'options', `expected numeric ${expected} but correct option is non-numeric`)
    } else if (correctOpt !== expected) {
      check(
        id,
        'correctIndex',
        `expected ${expected}, got ${correctOpt} (option ${q.correctIndex}: ${q.options[q.correctIndex]})`,
      )
    }
  }

  for (const v of q.variants ?? []) {
    validateQuestion({ ...q, ...v, variants: undefined, id: `${q.id} [variant]` }, file)
  }
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '_deprecated') continue
    const p = path.join(dir, name)
    if (fs.statSync(p).isDirectory()) walk(p)
    else if (name.endsWith('.json')) {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'))
      const rel = path.relative(QUIZ_ROOT, p)
      for (const q of data.questions ?? []) {
        validateQuestion(q, rel)
      }
    }
  }
}

walk(QUIZ_ROOT)

if (errors.length) {
  console.error(`Found ${errors.length} quiz validation error(s):\n`)
  for (const e of errors) {
    console.error(`- ${e.questionId} (${e.field}): ${e.message}`)
  }
  process.exit(1)
}

console.log('All quiz validations passed.')
