#!/usr/bin/env node
/**
 * Repair canonical Maths 0580 Ch.2 quiz JSON (live site content only).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prepareMathContent } from '../src/lib/mathMarkdown.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizRoot = path.join(__dirname, '../content/quizzes/maths-0580')
const chapter = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../content/chapters/maths-0580/ch02-algebra.json'), 'utf8'),
)
const topicIds = new Set(chapter.topicIds)

const PROP_EASY = [
  {
    question:
      '$y$ varies directly as $x$. When $x = 4$, $y = 12$. Find $y$ when $x = 9$.',
    explanation:
      'Since $y$ varies directly as $x$, $y = kx$. When $x = 4$ and $y = 12$, $12 = 4k$ so $k = 3$. Hence $y = 3x$. When $x = 9$, $y = 3 \\times 9 = 27$.\n\n**Common mistake:** Students sometimes find $k = 3$ but divide instead of multiply, or add the difference between the given values.',
  },
  {
    question:
      '$p$ and $q$ are directly proportional. When $p = 35$ and $q = 5$, find the formula connecting $p$ and $q$.',
    explanation:
      'Direct proportion means $p = kq$. Substituting gives $35 = k(5)$, so $k = 7$. Thus, the formula is $p = 7q$.\n\n**Common mistake:** Students may perform an incorrect inverse operation, writing $k = 35 \\times 5 = 175$, leading to $p = 175q$.',
  },
  {
    question:
      '$y$ varies inversely as $x$. When $x = 3$, $y = 8$. Find the constant of proportionality, $k$.',
    explanation:
      'For inverse proportion, $y = \\frac{k}{x}$, so $k = xy$. Hence $k = 3 \\times 8 = 24$.\n\n**Common mistake:** Students often treat the problem as direct proportion instead of inverse proportion, calculating $k = \\frac{y}{x} = \\frac{8}{3}$.',
  },
  {
    question:
      '$M$ varies inversely as $g$. When $g = 10$, $M = 4$. Find $M$ when $g = 5$.',
    explanation:
      'The relationship is $M = \\frac{k}{g}$, so $k = Mg = 4 \\times 10 = 40$. Hence $M = \\frac{40}{g}$. When $g = 5$, $M = \\frac{40}{5} = 8$.\n\n**Common mistake:** Students frequently apply direct proportionality steps, reasoning incorrectly that halving $g$ halves $M$.',
  },
  {
    question:
      '$A$ varies directly as $B$. When $B = 12$, $A = 3$. Find $B$ when $A = 5$.',
    explanation:
      'Set up $A = kB$. Then $3 = k(12)$, so $k = 0.25$ and $A = 0.25B$. When $A = 5$, $5 = 0.25B$, so $B = 20$.\n\n**Common mistake:** Students often mistake which variable is divided, calculating $k = 4$ and getting $B = 1.25$.',
  },
]

const PROP_HARD = [
  {
    question:
      'The electrical resistance $R$ of a wire varies directly as its length $L$ and inversely as the square of its radius $r$. When $L = 10$ and $r = 2$, $R = 5$. Find $R$ when $L = 15$ and $r = 3$.',
    explanation:
      'This is joint proportion: $R = \\frac{kL}{r^2}$. Substituting gives $5 = \\frac{10k}{4}$, so $k = 2$. Hence $R = \\frac{2L}{r^2}$. When $L = 15$ and $r = 3$, $R = \\frac{30}{9} = 3.33$ (to 3 s.f.).\n\n**Common mistake:** Combining direct and inverse relationships into one formula often causes layout errors, such as putting $r^2$ in the numerator.',
  },
  {
    question:
      '$y$ varies inversely as $(x + 1)^2$. When $x = 1$, $y = 9$. Find the positive value of $x$ when $y = 4$.',
    explanation:
      'Set up $y = \\frac{k}{(x + 1)^2}$. When $x = 1$ and $y = 9$, $k = 36$. So $4 = \\frac{36}{(x + 1)^2}$, giving $(x + 1)^2 = 9$ and $x = 2$.\n\n**Common mistake:** Students forget to add 1 before squaring, or fail to take the square root of both sides.',
  },
  {
    question:
      '$z$ varies directly as $\\sqrt{x}$ and inversely as $y$. When $x = 9$ and $y = 4$, $z = 6$. Express $x$ in terms of $y$ and $z$.',
    explanation:
      '$z = \\frac{k\\sqrt{x}}{y}$. Substituting gives $6 = \\frac{3k}{4}$, so $k = 8$. Hence $\\sqrt{x} = \\frac{zy}{8}$ and $x = \\left(\\frac{zy}{8}\\right)^2 = \\frac{y^2z^2}{64}$.\n\n**Common mistake:** When squaring the fraction expression, students often forget to square the denominator constant 8.',
  },
  {
    question:
      'If $y$ is directly proportional to $x^2$ and $x$ increases by $20\\%$, find the percentage increase in $y$.',
    explanation:
      '$y = kx^2$. If $x$ increases by $20\\%$, the new value is $1.2x$, so $y_{\\text{new}} = k(1.2x)^2 = 1.44y$. This is a $44\\%$ increase.\n\n**Common mistake:** Students assume that a $20\\%$ increase in $x$ gives a $20\\%$ or $40\\%$ increase in $y$, forgetting to square the scale factor.',
  },
  {
    question:
      '$W$ varies inversely as the cube root of $x$. When $x = 27$, $W = 2$. Find $x$ when $W = 3$.',
    explanation:
      '$W = \\frac{k}{\\sqrt[3]{x}}$. Substituting gives $k = 6$. When $W = 3$, $\\sqrt[3]{x} = 2$, so $x = 8$.\n\n**Common mistake:** Students often make mistakes when reversing a cube root, accidentally multiplying by 3 instead of cubing.',
  },
]

function propEasyFix(id) {
  const m = id.match(/-q(\d+)$/)
  if (!m) return null
  const idx = (Number(m[1]) - 1) % 5
  return PROP_EASY[idx] ?? null
}

function propHardFix(id) {
  const m = id.match(/-q(\d+)$/)
  if (!m) return null
  const idx = (Number(m[1]) - 1) % 5
  return PROP_HARD[idx] ?? null
}

/** Manual fixes for questions the pipeline cannot safely reconstruct. */
const CONTENT_FIXES = {
  '2-2-brackets-and-simplifying-easy-q1': {
    question: 'Simplify completely by collecting like terms: $5x + 3y - 2x + 4y$.',
  },
  '2-2-brackets-and-simplifying-easy-q2': {
    explanation:
      'Multiply the term outside the bracket by each term inside: $4 \\times 3m = 12m$ and $4 \\times (-2n) = -8n$, giving $12m - 8n$.\n\n**Common mistake:** Students often only multiply the first term inside the bracket, leaving the second term completely unchanged as $-2n$.',
  },
  '2-2-brackets-and-simplifying-easy-q3': {
    question: 'Simplify the expression: $a \\times a \\times a + b \\times b$.',
    explanation:
      'Repeated multiplication of the same base gives exponents: $a \\times a \\times a = a^3$ and $b \\times b = b^2$. Adding them gives $a^3 + b^2$.\n\n**Common mistake:** Students commonly confuse multiplication with addition, writing $a \\times a \\times a = 3a$ and $b \\times b = 2b$.',
  },
  '2-2-brackets-and-simplifying-medium-q5': {
    explanation:
      'Group the $k$ terms and constants: $(8k - 2k) + (-5 + 9) = 6k + 4$.\n\n**Common mistake:** Students often make mistakes with negative integers, computing $-5 + 9$ as $-14$ or $-4$.',
  },
  '2-3-2-4-linear-equations-hard-q1': {
    question: 'Solve the algebraic fractional equation: $\\frac{3}{2x - 1} - \\frac{2}{x + 3} = 0$.',
  },
  '2-5-2-6-simultaneous-equations-hard-q2': {
    question:
      'Solve the system where $\\frac{3}{x} + \\frac{2}{y} = 5$ and $\\frac{1}{x} - \\frac{4}{y} = -3$.',
    explanation:
      'Let $u = \\frac{1}{x}$ and $v = \\frac{1}{y}$. Then $3u + 2v = 5$ and $u - 4v = -3$. Multiplying the first by 2 gives $6u + 4v = 10$. Adding to the second equation: $7u = 7$, so $u = 1$ and $x = 1$. Substituting gives $v = 1$ and $y = 1$.\n\n**Common mistake:** Students often leave the answers as $u$ and $v$ instead of finding $x$ and $y$.',
  },
  '2-5-2-6-simultaneous-equations-medium-q5': {
    question:
      'Solve the system where $\\frac{x}{2} + y = 5$ and $3x - 2y = -2$.',
    correctIndex: 1,
    explanation:
      'Multiply the first equation by 2: $x + 2y = 10$. Add to the second equation: $(x + 2y) + (3x - 2y) = 10 + (-2)$, so $4x = 8$ and $x = 2$. Substitute into $x + 2y = 10$ to get $2 + 2y = 10$, hence $y = 4$.\n\n**Common mistake:** Students often struggle to clear denominators accurately or forget to multiply every term when removing fractions.',
  },
  '6-1-factorising-easy-q3': { question: 'Factorise the expression completely: $5a + 5b$.' },
  '6-1-factorising-easy-q4': { question: 'Factorise the expression completely: $2y^2 + 3y$.' },
  '6-1-factorising-easy-q5': {
    question: 'Factorise the expression completely: $x^2 + xy$.',
    explanation:
      'The highest common factor is $x$, giving $x(x + y)$.\n\n**Common mistake:** Leaving one $x$ in $x^2$ as if it has no common factor with $xy$.',
  },
  '6-2-6-3-quadratic-equations-hard-q1': {
    question: 'Solve the rational fractional equation: $\\frac{2}{x} + \\frac{3}{x+1} = 2$.',
  },
  '6-2-6-3-quadratic-equations-pyp-q2': {
    question:
      'The product of two consecutive positive integers is $132$. Find the smaller of these two integers by forming a quadratic equation.',
    explanation:
      'Let the integers be $n$ and $n + 1$. Then $n(n + 1) = 132$, so $n^2 + n - 132 = 0$. Factorising gives $(n + 12)(n - 11) = 0$, so $n = 11$.\n\n**Common mistake:** Students identify both algebraic solutions and select the larger positive integer instead of the smaller one.',
  },
  '6-2-6-3-quadratic-equations-pyp-q3': {
    explanation:
      'Multiply by $x(x - 1)$: $4(x - 1) + 3x = 2x(x - 1)$, giving $2x^2 - 9x + 4 = 0$. Factorising gives $(2x - 1)(x - 4) = 0$, so $x = 4$ or $x = 0.5$.\n\n**Common mistake:** Students often fail to distribute the negative sign properly or drop variable terms during expansion.',
    options: ['$4$ or $0.5$', '$-4$ or $-0.5$', '$2$ or $1$', '$4$ or $-0.5$'],
  },
  '6-2-6-3-quadratic-equations-pyp-q5': {
    options: ['$4$ or $-1$', '$4$ or $1$', '$7$ or $-2$', '$2$ or $-4$'],
  },
  '6-4-nonlinear-simultaneous-equations-hard-q2': {
    question: 'Solve the system where $x + y = 3$ and $\\frac{1}{x} + \\frac{1}{y} = 1.5$.',
  },
  '6-4-nonlinear-simultaneous-equations-pyp-q3': {
    question:
      'A line $y = 2x + c$ touches the curve $y = x^2 + 6x + 7$ at exactly one point. Find $c$.',
    explanation:
      'For a tangent, the discriminant of $x^2 + 6x + 7 = 2x + c$ must be zero. This gives $x^2 + 4x + (7 - c) = 0$, so $16 - 4(7 - c) = 0$ and $c = 3$.\n\n**Common mistake:** Students substitute one point instead of using the condition for equal roots.',
  },
  '8-1-algebraic-fractions-easy-q1': {
    question: 'Simplify the single algebraic fraction completely: $\\frac{6x^2y}{2xy^2}$.',
  },
  '8-1-algebraic-fractions-easy-q2': {
    question: 'Simplify the expression: $\\frac{4}{x} \\times \\frac{x^2}{2}$.',
  },
  '8-1-algebraic-fractions-easy-q3': {
    question: 'Express as a single fraction in its simplest form: $\\frac{a}{3} + \\frac{a}{4}$.',
  },
  '8-1-algebraic-fractions-easy-q4': {
    question: 'Perform the division and simplify fully: $\\frac{3}{2x} \\div \\frac{9}{x^2}$.',
  },
  '8-1-algebraic-fractions-easy-q5': {
    question: 'Simplify the algebraic fraction: $\\frac{5x - 10}{5}$.',
  },
  '8-1-algebraic-fractions-medium-q3': {
    question: 'Solve the fractional equation for $x$: $\\frac{2}{x-1} = \\frac{3}{x+2}$.',
  },
  '8-1-algebraic-fractions-hard-q1': {
    question: 'Simplify completely: $\\frac{2x}{x^2 - 1} + \\frac{3}{x + 1}$.',
  },
  '8-1-algebraic-fractions-hard-q2': {
    question:
      'Simplify completely: $\\frac{\\frac{1}{x} - \\frac{1}{y}}{\\frac{1}{x^2} - \\frac{1}{y^2}}$.',
  },
  '8-1-algebraic-fractions-hard-q3': {
    question: 'Solve the equation: $\\frac{x}{2} + \\frac{3}{x} = 2.5$.',
  },
  '8-1-algebraic-fractions-medium-q1': {
    question: 'Simplify completely: $\\frac{x^2 - 9}{2x + 6}$.',
  },
  '8-1-algebraic-fractions-medium-q2': {
    question: 'Write as a single fraction: $\\frac{3}{x + 1} - \\frac{2}{x}$.',
  },
  '8-1-algebraic-fractions-medium-q4': {
    question: 'Solve the equation: $\\frac{3}{2x - 1} = 2$.',
  },
  '8-1-algebraic-fractions-pyp-q1': {
    question: 'Simplify completely: $\\frac{x^2 - 7x + 12}{x^2 - 9}$.',
  },
  '8-1-algebraic-fractions-pyp-q2': {
    question: 'Write as a single fraction in its simplest form: $\\frac{5}{x - 2} - \\frac{3}{x + 3}$.',
  },
  '8-1-algebraic-fractions-pyp-q3': {
    question: 'Simplify completely: $\\frac{4x^2 - 9}{2x^2 - 5x + 3}$.',
  },
  '8-1-algebraic-fractions-pyp-q4': {
    question: 'Solve the quadratic equation: $\\frac{3}{x + 1} = \\frac{x - 1}{2}$.',
  },
  '8-2-changing-the-subject-hard-q2': {
    question: 'Make $p$ the subject of the formula:\n\n$q = \\frac{2p - 1}{p + 3}$',
    explanation:
      'Multiply both sides by $(p + 3)$: $q(p + 3) = 2p - 1$. Expanding gives $qp + 3q = 2p - 1$. Collecting $p$ terms: $3q + 1 = p(2 - q)$. Hence $p = \\frac{3q + 1}{2 - q}$.\n\n**Common mistake:** Sign errors are common when moving terms across the equals sign.',
  },
  '8-2-changing-the-subject-pyp-q1': {
    question: 'Make $m$ the subject of the formula:\n\n$y = \\frac{3m - 4}{m + 2}$',
  },
  '8-2-changing-the-subject-pyp-q5': {
    question: 'Make $x$ the subject of the formula: $\\frac{y}{2} = \\frac{5}{x}$.',
  },
  '8-5-inequalities-easy-q2': {
    question: 'Solve the inequality: $3x - 1 > x + 19$.',
  },
  '8-5-inequalities-medium-q1': {
    explanation:
      'Subtract $x$ from both sides: $2x > 20$, so $x > 10$.\n\n**Common mistake:** Incorrectly combining the $x$ terms as $4x$ or $0$.',
  },
  '8-5-inequalities-pyp-q1': {
    explanation:
      'Subtract $x$ from both sides: $2x > 20$, so $x > 10$.\n\n**Common mistake:** Incorrectly combining the $x$ terms.',
  },
  '8-5-inequalities-pyp-q2': {
    question:
      'A car rental firm charges $30 per day plus a flat fee of $240$. Maya has at most $470$ to pay. What is the maximum number of whole days for which she can rent the car?',
    explanation:
      'Set up $30d + 240 \\le 470$. Then $30d \\le 230$, so $d \\le 7.66$. The maximum whole number of days is 7.\n\n**Common mistake:** Rounding $7.66$ up to 8 days, which would exceed the budget.',
  },
  '8-5-inequalities-pyp-q3': {
    question:
      'Which three inequalities define the shaded region formed by the lines $y = 2$, $y = 3x$ and $x + y = 6$?',
  },
  '8-5-inequalities-pyp-q4': {
    question: 'State the smallest integer $n$ such that $4n > 19$.',
  },
  '8-5-inequalities-pyp-q5': {
    question:
      'From a graph of $y = 2 + 3x - 2x^2$, find the range of values of $x$ for which $y \\ge -5$.',
    explanation:
      'The curve stays at or above $y = -5$ between $x = -1.3$ and $x = 2.8$.\n\n**Common mistake:** Identifying the $x$-intercepts instead of the intersection with the line $y = -5$.',
  },
}

function repairQuizStringPre(text) {
  if (!text) return text
  let t = text
  t = t.replace(/\$\$\s*\n([\s\S]*?)(?:\n(?!\$)|$)/g, (_, inner) => {
    const trimmed = inner.trim()
    return trimmed ? `$${trimmed}$` : ''
  })
  t = t.replace(/^\$Solve /i, 'Solve ')
  if (((t.match(/(?<!\\)\$/g) ?? []).length % 2) !== 0) {
    t = t.replace(/(\$[^$\n]+)\.(?="|'|\s*$)/g, '$1$.')
  }
  return t
}

function repairString(val) {
  if (typeof val !== 'string') return val
  return prepareMathContent(repairQuizStringPre(val), 'quiz')
}

function repairQuestion(q, topicId) {
  let fix = CONTENT_FIXES[q.id]
  if (!fix && topicId === '8-3-proportion') {
    fix = q.id.includes('hard') || q.id.includes('pyp') ? propHardFix(q.id) : propEasyFix(q.id)
  }
  const next = { ...q }
  if (fix?.question) next.question = fix.question
  if (fix?.explanation) next.explanation = fix.explanation
  if (fix?.options) next.options = fix.options
  if (fix?.correctIndex !== undefined) next.correctIndex = fix.correctIndex
  if (next.question) next.question = repairString(next.question)
  if (next.options) next.options = next.options.map(repairString)
  if (next.explanation) next.explanation = repairString(next.explanation)
  if (next.variants?.length) {
    next.variants = next.variants.map((v) => repairQuestion({ ...q, ...v, variants: undefined }, topicId))
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
      return repairQuestion(q, data.topicId)
    }),
  }
  fs.writeFileSync(filePath, JSON.stringify(repaired, null, 2) + '\n', 'utf8')
  files++
}

console.log(`Repaired ${files} Maths 0580 Ch.2 quiz files (${questions} questions).`)
