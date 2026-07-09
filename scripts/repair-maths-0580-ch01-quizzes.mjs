#!/usr/bin/env node
/**
 * Repair canonical Maths 0580 Ch.1 quiz JSON (live site content only).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prepareMathContent } from '../src/lib/mathMarkdown.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizRoot = path.join(__dirname, '../content/quizzes/maths-0580')
const chapter = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../content/chapters/maths-0580/ch01-number.json'), 'utf8'),
)
const topicIds = new Set(chapter.topicIds)

/** Manual fixes for questions the pipeline cannot safely reconstruct. */
const CONTENT_FIXES = {
  '1-1-arithmetic-hard-q3': {
    question:
      'Calculate the exact fractional value of $\\left(3.25 - 1 \\frac{7}{8}\\right) \\div 0.75 + \\frac{4}{3}$.',
  },
  '1-1-arithmetic-medium-q3': {
    explanation:
      'Convert mixed numbers to improper fractions: $\\frac{7}{3} + \\frac{3}{2} = \\frac{14}{6} + \\frac{9}{6} = \\frac{23}{6}$. Multiply by the scalar: $\\frac{23}{6} \\times \\frac{6}{23} = 1$.\n\n**Common mistake:** Students may add whole parts and fractional parts separately without adjusting denominators first.',
  },
  '1-3-number-facts-hard-q2': {
    question:
      'Three numbers are 90, 126 and $x$. The HCF of 90 and 126 is 18. The LCM of 90, 126 and $x$ is 1260. Find $x$.',
    explanation:
      'Factor the numbers: $90 = 2 \\times 3^2 \\times 5$ and $126 = 2 \\times 3^2 \\times 7$. For $\\text{HCF}(90,126)=18=2 \\times 3^2$, the missing factor in $x$ must supply $2^2$ because neither 90 nor 126 has $2^2$. Also $\\text{LCM}(90,126,x)=1260=2^2 \\times 3^2 \\times 5 \\times 7$, so $x$ must include the factor 5. Thus $x = 2^2 \\times 3^2 \\times 5 = 180$.\n\n**Common mistake:** Students divide the LCM by the HCF directly without checking which prime powers $x$ must contribute.',
  },
  '1-3-number-facts-medium-q5': {
    question:
      'Find the smallest positive integer $k$ such that $135k$ is a perfect square.',
  },
  '1-4-sequences-hard-q1': {
    question: 'Find the formula for the $n$th term of the sequence $3, 11, 23, 39, 59, \\ldots$',
    explanation:
      'First differences: 8, 12, 16, 20. Second differences: 4, 4, 4. Thus the quadratic coefficient is $a = 4 \\div 2 = 2$, so the sequence contains $2n^2$. Subtracting $2n^2$ from the terms gives $1, 3, 5, \\ldots$, which is $2n - 1$. Hence the $n$th term is $2n^2 + 2n - 1$.\n\n**Common mistake:** Students may fail to subtract the $2n^2$ base sequence correctly or find the linear component incorrectly, leading to misaligned coefficients.',
  },
  '1-4-sequences-hard-q2': {
    question:
      'A sequence is formed by multiplying corresponding terms of two sequences. The first has $n$th term $2n+1$. The second is geometric with $n$th term $3^{n-1}$. Find the 3rd term of the product sequence.',
  },
  '1-4-sequences-hard-q3': {
    question:
      'The $n$th term of a sequence is $n^3 - bn + 4$. Given that the 4th term is 52, determine $b$.',
  },
  '1-4-sequences-pyp-q5': {
    question:
      'For a sequence with nth term $\\frac{3}{n+2}$, find the difference between the 1st term and the 4th term.',
    explanation:
      '1st term ($n=1$): $\\frac{3}{1+2} = 1$. 4th term ($n=4$): $\\frac{3}{4+2} = \\frac{3}{6} = \\frac{1}{2}$. Difference: $1 - \\frac{1}{2} = \\frac{1}{2}$.\n\n**Common mistake:** Students often make errors when finding the common denominator of fractional terms or substitute the position incorrectly.',
  },
  '1-5-approximations-and-estimation-pyp-q1': {
    question:
      'The mass, $m$, is $4200\\text{ kg}$, correct to the nearest $100\\text{ kg}$. Complete the inequality showing the error bounds for $m$.',
    explanation:
      'The precision unit is $100\\text{ kg}$, so the variation is $\\pm 50\\text{ kg}$. Lower limit: $4200 - 50 = 4150$. Upper limit: $4200 + 50 = 4250$. Thus, $4150 \\le m < 4250$.\n\n**Common mistake:** Students often use the full unit value ($100\\text{ kg}$) for the boundary shift, resulting in $4100$ and $4300$.',
  },
  '1-6-8-4-indices-medium-q1': {
    question: 'Evaluate the exact fractional or integer value of $27^{-\\frac{2}{3}}$.',
    explanation:
      'Apply the index rules: $27^{-\\frac{2}{3}} = \\frac{1}{(27^{\\frac{1}{3}})^2}$. The cube root of 27 is 3, and squaring 3 gives 9. The reciprocal gives $\\frac{1}{9}$.\n\n**Common mistake:** Students often forget the negative sign\'s reciprocal operation or multiply $27 \\times -\\frac{2}{3}$ directly to get $-18$.',
    options: ['$\\frac{1}{9}$', '$-\\frac{1}{9}$', '$9$', '$-9$'],
  },
  '1-6-8-4-indices-pyp-q2': {
    question: 'Find the value of $k$ if $\\frac{x^5}{x^{-2}} = x^k$.',
  },
  '1-6-8-4-indices-pyp-q3': {
    options: ['$\\frac{5}{2}$', '$\\frac{2}{5}$', '$\\frac{25}{4}$', '$\\frac{4}{25}$'],
  },
  '1-7-standard-form-pyp-q1': {
    question: 'Find the value of $p$ if $8.4 \\times 10^n + 6 \\times 10^{n-1} = p \\times 10^n$.',
    explanation:
      'Rewrite $6 \\times 10^{n-1}$ as $0.6 \\times 10^n$. Then $(8.4 + 0.6) \\times 10^n = 9.0 \\times 10^n$, so $p = 9.0$.\n\n**Common mistake:** Students frequently add coefficients directly across differing index orders, erroneously concluding that $p = 14.4$ or $8.46$.',
  },
  '1-8-surds-hard-q4': {
    question: 'Express $\\frac{\\sqrt{32} + \\sqrt{8}}{\\sqrt{50}}$ as a simplified fraction.',
  },
  '1-8-surds-easy-q3': {
    question: 'Express $\\sqrt{\\frac{9}{49}}$ as a rational fraction.',
    explanation:
      'Apply the radical rule across fractions: $\\sqrt{\\frac{9}{49}} = \\frac{\\sqrt{9}}{\\sqrt{49}} = \\frac{3}{7}$.\n\n**Common mistake:** Students sometimes only find the square root of the numerator or square the components instead of extracting the root.',
  },
}

function repairString(val) {
  if (typeof val !== 'string') return val
  return prepareMathContent(val, 'quiz')
}

function repairQuestion(q) {
  const fix = CONTENT_FIXES[q.id]
  const next = { ...q }
  if (fix?.question) next.question = fix.question
  if (fix?.explanation) next.explanation = fix.explanation
  if (fix?.options) next.options = fix.options
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

console.log(`Repaired ${files} Maths 0580 Ch.1 quiz files (${questions} questions).`)
