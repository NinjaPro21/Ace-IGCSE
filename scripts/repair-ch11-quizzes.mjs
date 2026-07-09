#!/usr/bin/env node
/**
 * Repair Add Math Ch.11 series quiz JSON.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizDir = path.join(__dirname, '..', 'content', 'quizzes', 'add-maths-0606')

const topicIds = [
  '11-1-pascal-s-triangle',
  '11-2-the-binomial-theorem-harder-topic',
  '11-3-arithmetic-progressions-ap-harder-topic',
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h',
  '11-6-further-arithmetic-and-geometric-series',
]

const INDEX_FIXES = {
  '11-2-the-binomial-theorem-harder-topic-hard-q1': 1,
  '11-2-the-binomial-theorem-harder-topic-hard-q2': 0,
  '11-2-the-binomial-theorem-harder-topic-hard-q5': 0,
}

const OVERRIDES = {
  // ── 11.2 Binomial ──────────────────────────────────────────────
  '11-2-the-binomial-theorem-harder-topic-easy-q2': {
    question:
      'In the expansion of $(1 + x)^3$, write down the coefficients of $x^0$, $x^1$, $x^2$, and $x^3$ from Pascal\'s triangle.',
  },
  '11-2-the-binomial-theorem-harder-topic-easy-q4': {
    question:
      'Write down the first two terms in the expansion of $(2 + x)^5$ in ascending powers of $x$.',
  },
  '11-2-the-binomial-theorem-harder-topic-easy-q5': {
    question:
      'If the expansion of $(1 + ax)^4$ starts with $1 - 12x + \\ldots$, find the value of $a$.',
  },
  '11-2-the-binomial-theorem-harder-topic-medium-q3': {
    question:
      'Given that $(1 + px)^n = 1 + 24x + 240x^2 + \\ldots$, find the values of $n$ and $p$.',
  },
  '11-2-the-binomial-theorem-harder-topic-medium-q4': {
    question:
      'Find the first three terms of $(1 - \\frac{x}{2})^8$ in ascending powers of $x$.',
  },
  '11-2-the-binomial-theorem-harder-topic-medium-q5': {
    explanation:
      'Expanding: $(x^2)^3 + 3(x^2)^2\\left(\\frac{k}{x}\\right) + 3(x^2)\\left(\\frac{k}{x}\\right)^2 + \\left(\\frac{k}{x}\\right)^3 = x^6 + 3kx^3 + 3k^2 + k^3/x^3$. The coefficient of $x^3$ is $3k$.\n\n**Common mistake:** Option B picks the constant term or a term with a different power of $x$.',
    options: ['$3k$', '$k^3$', '$3k^2$', '$1$'],
  },
  '11-2-the-binomial-theorem-harder-topic-hard-q1': {
    explanation:
      'General term $T_{r+1} = \\binom{9}{r}(2x^2)^{9-r}\\left(-\\frac{1}{x}\\right)^r$. For the term independent of $x$: $2(9-r) - r = 0 \\implies r = 6$. Term: $\\binom{9}{6}(2)^3(-1)^6 = 84 \\times 8 = 672$.\n\n**Common mistake:** Option A is a sign error if the student treats $(-1)^6$ as negative.',
  },
  '11-2-the-binomial-theorem-harder-topic-hard-q2': {
    options: ['$10$', '$40$', '$30$', '$70$'],
    explanation:
      '$(1-2x)^5 = 1 - 10x + 40x^2 + \\ldots$. Multiply by $(1+3x)$: $(1 \\times 40x^2) + (3x \\times -10x) = 40x^2 - 30x^2 = 10x^2$. The coefficient is $10$.\n\n**Common mistake:** Option B only considers the $x^2$ term from the bracketed expansion, ignoring the product with $3x$.',
  },
  '11-2-the-binomial-theorem-harder-topic-hard-q4': {
    question:
      'The first three terms in the expansion of $(2 + x)^6$ are $64$, $192x$, and $240x^2$. Find the values of the base and the power.',
    options: ['$2$ and $6$', '$4$ and $3$', '$2$ and $5$', '$4$ and $6$'],
    explanation:
      '$(2+x)^6 = 2^6 + 6(2^5)x + \\binom{6}{2}(2^4)x^2 + \\ldots = 64 + 192x + 240x^2 + \\ldots$. So the base is $2$ and the power is $6$.\n\n**Common mistake:** Confusing the coefficients with the parameters $a$ and $n$ in $(a+x)^n$.',
  },
  '11-2-the-binomial-theorem-harder-topic-hard-q5': {
    options: ['$90$', '$80$', '$40$', '$160$'],
    explanation:
      '$(2+x)^5 = 32 + 80x + 80x^2 + 40x^3 + 10x^4 + x^5$. The $x^4$ term from $(1+x^2)(2+x)^5$ is $(1 \\times 10x^4) + (x^2 \\times 80x^2) = 10 + 80 = 90$.\n\n**Common mistake:** Option B results from only taking the $x^2$ term coefficient from the power expansion.',
  },
  '11-2-the-binomial-theorem-harder-topic-pyp-q1': {
    question:
      'Find the first three terms, in ascending powers of $x$, in the expansion of $\\left(2 - \\frac{x}{4}\\right)^6$.',
    correctIndex: 1,
    explanation:
      '$2^6 = 64$. Second term: $\\binom{6}{1}(2^5)\\left(-\\frac{x}{4}\\right) = -48x$. Third term: $\\binom{6}{2}(2^4)\\left(-\\frac{x}{4}\\right)^2 = 15x^2$. So the expansion starts $64 - 48x + 15x^2$.\n\n**Common mistake:** Option A miscalculates the third term by not squaring $1/4$ correctly.',
  },
  '11-2-the-binomial-theorem-harder-topic-hard-q3': {
    question:
      'In the expansion of $(1 + kx)^6$, the coefficients of $x^2$ and $x^3$ are equal. Find the value of the non-zero constant $k$.',
  },
  '11-2-the-binomial-theorem-harder-topic-pyp-q2': {
    question:
      'Given that the coefficient of $x^2$ in the expansion of $(1 + kx)^8$ is $70$, find the possible values of the constant $k$.',
  },
  '11-2-the-binomial-theorem-harder-topic-pyp-q4': {
    question:
      'The first three terms in the expansion of $(1 + ax)^n$ are $1 + 30x + 405x^2$. Find the values of $a$ and $n$.',
  },

  // ── 11.3 AP ────────────────────────────────────────────────────
  '11-3-arithmetic-progressions-ap-harder-topic-hard-q3': {
    explanation:
      '$155 = \\frac{n}{2}[4 + (n-1)(3)] \\implies 310 = n(3n + 1) \\implies 3n^2 + n - 310 = 0$. Testing: $3(100) + 10 = 310$, so $n = 10$.\n\n**Common mistake:** Difficulty solving the resulting quadratic equation or arithmetic errors in clearing the fraction.',
  },

  // ── 11.4–11.5 GP ─────────────────────────────────────────────
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-easy-q1': {
    question:
      'The first term of a geometric progression is $5$ and the common ratio is $2$. Find the $6$th term.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-easy-q2': {
    question:
      'Find the common ratio $r$ if the first term is $12$ and the second term is $4$.',
    explanation:
      'The common ratio $r = u_2/u_1$. So $r = 4/12 = 1/3$.\n\n**Common mistake:** Option B is the result of dividing the first term by the second term, confusing the order of the ratio.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-easy-q3': {
    question:
      'Calculate the sum to infinity of a geometric series with first term $10$ and common ratio $0.6$.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-easy-q4': {
    question:
      'In a geometric progression, the second term is $10$ and the common ratio is $5$. Find the first term $a$.',
    options: ['$2$', '$50$', '$5$', '$0.5$'],
    explanation:
      'Since $u_2 = ar$, we have $10 = a(5) \\implies a = 2$.\n\n**Common mistake:** Option B occurs if the student multiplies the second term by the ratio instead of dividing by it.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-easy-q5': {
    explanation:
      'A geometric series converges if and only if the magnitude of the common ratio is less than $1$ ($|r| < 1$).\n\n**Common mistake:** Students often forget that the condition applies to the absolute value, mistakenly thinking $r = -1.2$ converges because it is negative.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-medium-q1': {
    question:
      'The terms $x-1$, $x+2$, and $3x$ are consecutive terms of a GP. Find the positive value of $x$.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-medium-q2': {
    question:
      'In a geometric progression, the second term is $6$ and the fourth term is $54$. Given $r > 0$, calculate the sum of the first three terms.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-medium-q3': {
    question:
      'Express the recurring decimal $0.474747\\ldots$ as a fraction in its simplest form using the sum to infinity formula.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-medium-q4': {
    question:
      'A geometric progression has first term $100$ and common ratio $0.9$. Find the smallest value of $n$ such that the $n$th term is less than $10$.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-medium-q5': {
    question:
      'Find the sum of the first $5$ terms of a geometric progression with $a=4$ and $r=1.5$.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-hard-q1': {
    question:
      'The sum to infinity of a geometric series is $4$ times the sum of its first two terms. Find the possible values of the common ratio $r$.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-hard-q2': {
    question:
      'A geometric progression is defined by $u_n = 5(0.2)^{n-1}$. Find the sum to infinity of the even-numbered terms only ($u_2 + u_4 + u_6 + \\ldots$).',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-hard-q3': {
    question:
      'A geometric progression has first term $k$ and common ratio $\\sin\\theta$, where $0^\\circ < \\theta < 90^\\circ$. The sum to infinity is twice the first term. Find $\\theta$.',
    explanation:
      '$\\frac{k}{1 - \\sin\\theta} = 2k \\implies 1 = 2 - 2\\sin\\theta \\implies 2\\sin\\theta = 1 \\implies \\sin\\theta = 0.5 \\implies \\theta = 30^\\circ$.\n\n**Common mistake:** Option B is chosen if the student incorrectly equates $\\cos\\theta = 0.5$ instead of $\\sin\\theta$.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-hard-q4': {
    question:
      'A ball is dropped from a height of $10$ m. After each bounce, it reaches $80\\%$ of its previous height. Calculate the total distance traveled by the ball until it stops.',
    explanation:
      'Distance $= 10 + 2(8 + 6.4 + \\ldots)$. The bounce series has $a=8$, $r=0.8$. Sum $= 8/0.2 = 40$. Total $= 10 + 2(40) = 90$ m.\n\n**Common mistake:** Option B results from applying the sum to infinity starting from the $10$ m drop and not doubling the upward/downward travel for bounces.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-hard-q5': {
    question:
      'The sum of the first $n$ terms of a sequence is $S_n = 3^n - 1$. Find an expression for the $n$th term $u_n$.',
    explanation:
      '$u_n = S_n - S_{n-1} = (3^n - 1) - (3^{n-1} - 1) = 3^n - 3^{n-1} = 3^{n-1}(3 - 1) = 2(3^{n-1})$.\n\n**Common mistake:** Option C results from incorrectly assuming $u_n = S_n$.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-pyp-q1': {
    question:
      'The first term of a geometric progression is $a$ and the sum to infinity is $15$. The second term is $10/3$. Find the two possible values of $r$.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-pyp-q2': {
    question:
      'Find the set of values of $x$ for which $1 + (x-3) + (x-3)^2 + \\ldots$ is convergent.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-pyp-q3': {
    question:
      'In a geometric progression, the sum of the first two terms is $12$ and the sum to infinity is $16$. Given $a > 12$, find the value of $a$.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-pyp-q4': {
    question:
      'Show that the $n$th term of the GP $8, 4, 2, \\ldots$ can be written in the form $2^{k-n}$. State the value of $k$.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-pyp-q5': {
    question:
      'A geometric progression has first term $a$ and common ratio $r$. The sum of the first $3$ terms is $7$ and the sum of the first $6$ terms is $63$. Find the value of $r$.',
  },

  // ── 11.6 Further series ────────────────────────────────────────
  '11-6-further-arithmetic-and-geometric-series-easy-q5': {
    question:
      'If $S_n$ denotes the sum of the first $n$ terms of a series, how can the $5$th term $u_5$ be found?',
    options: ['$S_5 - S_4$', '$S_5 / S_4$', '$S_4 - S_5$', '$5 \\times S_1$'],
  },
  '11-6-further-arithmetic-and-geometric-series-hard-q3': {
    options: ['Complex Formula Required', '$100$', '$10$', '$x^{10}$'],
  },
  '11-6-further-arithmetic-and-geometric-series-pyp-q4': {
    question:
      'Find the sum of the first $20$ terms of a series where the $n$th term is $u_n = 3n + 2^n$.',
  },
}

function fixCh11Artifacts(text) {
  if (!text || typeof text !== 'string') return text
  let t = text

  // Caret glue (Class A)
  t = t.replace(/(of|from|reaches|term|first|less than|the)\^(\d+)/gi, '$1 $2')
  t = t.replace(/first\^(\d+)\s*terms/gi, 'first $1$ terms')
  t = t.replace(/first term\^(\d+)/gi, 'first term $1$')
  t = t.replace(/the\^(\d+)\s*th/gi, 'the $1$th')
  t = t.replace(/forgetting to square the\^(\d+)/g, 'forgetting to square the $1$')
  t = t.replace(/square the\^(\d+)/g, 'square the $1$')

  // Docx "So" glue
  t = t.replace(/\)\^n\$\.\s*So\s*\$/g, ')^n$. So $')
  t = t.replace(/\$n\$\.\s*So\s*\$/g, '$n$ terms. Given $')
  t = t.replace(/\$n\$\.\s*\$/g, '$n$th term $')
  t = t.replace(/\$r\$\.\s*So\s*\$/g, '$r$. So $')
  t = t.replace(/\$r\$\.\s*\$/g, '$r$. $')
  t = t.replace(/\$x\$\.\s*\$/g, '$x$. $')
  t = t.replace(/\$k\$\.\s*\\\$/g, '$k$. $\\')
  t = t.replace(/\$fraction\$/g, 'fraction')
  t = t.replace(/powers of \$x\./g, 'powers of $x$.')
  t = t.replace(/ascending powers of \$x\./g, 'ascending powers of $x$.')
  t = t.replace(/\+\$\.\.\./g, '+ \\ldots$')
  t = t.replace(/\+\$,\.\.\./g, '+ \\ldots$,')
  t = t.replace(/\+\$\.\.\.,/g, '+ \\ldots$,')
  t = t.replace(/\$u_n\./g, '$u_n$.')
  t = t.replace(/\$k\./g, '$k$.')
  t = t.replace(/and \$n(\d+)/g, 'and $n > $1')
  t = t.replace(/\$r(\d+)/g, '$r = $1')
  t = t.replace(/\\\$theta(\d+)/g, '$\\theta$ ($1')
  t = t.replace(/\\\sin \\theta22k/g, '$\\sin\\theta = 2k$')
  t = t.replace(/\$a > 12\$/g, '$a > 12$')
  t = t.replace(/starting from the\^(\d+)/g, 'starting from the $1$')

  return t
}

function repairString(val) {
  if (typeof val !== 'string') return val
  return fixCh11Artifacts(val)
}

function repairQuestion(q) {
  const id = q.id
  const next = { ...q }

  if (next.question) next.question = repairString(next.question)
  if (next.options) next.options = next.options.map((opt) => repairString(opt))
  if (next.explanation) next.explanation = repairString(next.explanation)

  const ov = OVERRIDES[id]
  if (ov) {
    if (ov.question) next.question = ov.question
    if (ov.options) next.options = ov.options
    if (ov.explanation) next.explanation = ov.explanation
    if (ov.correctIndex !== undefined) next.correctIndex = ov.correctIndex
  }

  if (INDEX_FIXES[id] !== undefined) next.correctIndex = INDEX_FIXES[id]

  return next
}

let files = 0
for (const topicId of topicIds) {
  for (const tier of ['easy', 'medium', 'hard', 'pyp']) {
    const filePath = path.join(quizDir, `${topicId}-${tier}.json`)
    if (!fs.existsSync(filePath)) continue
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    data.questions = (data.questions ?? []).map(repairQuestion)
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`)
    console.log('repaired', path.basename(filePath))
    files++
  }
}
console.log(`Ch.11 repair done — ${files} files`)
