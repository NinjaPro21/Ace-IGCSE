/**
 * Targeted repairs for Ch.3 canonical quiz JSON — NO prepareMathContent (over-wraps).
 * Run: node scripts/repair-ch03-quizzes.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizzesDir = path.join(__dirname, '..', 'content', 'quizzes', 'add-maths-0606')
const TOPICS = [
  '3-1-adding-subtracting-and-multiplying-polynomials',
  '3-2-division-of-polynomials-harder-topic',
  '3-3-the-factor-theorem-harder-topic',
  '3-4-cubic-expressions-and-equations-harder-topic',
  '3-5-the-remainder-theorem-harder-topic',
]
const DIFFS = ['easy', 'medium', 'hard', 'pyp']

function fixText(s) {
  if (typeof s !== 'string') return s
  let t = s
  t = t.replace(/x⁴/g, 'x^4')
  t = t.replace(/(-1)⁴/g, '(-1)^4')
  t = t.replace(/\b(of|or|between|by|side|radius|and|at|height|length|ladder|roots|that|are)\^(\d+)/gi, (_, word, n) => `${word} $${n}$`)
  t = t.replace(/\n\$\$\n\*\*Common mistake/g, '\n\n**Common mistake')
  t = t.replace(/\n\$\$\.\n\n\*\*Common mistake/g, '\n\n**Common mistake')
  t = t.replace(/\n\$\$\n/g, '\n\n')
  t = t.replace(/\$\$\n\*\*Common mistake/g, '\n\n**Common mistake')
  t = t.replace(/\$\$as /g, ' as ')
  t = t.replace(/\$\$\.(\n|$)/g, '.$1')
  t = t.replace(/\$fractions/g, 'fractions')
  t = t.replace(/\n\$?\*\*Common mistake/g, '\n\n**Common mistake')
  t = t.replace(/instead of\^(\d+)/g, 'instead of $$1$')
  t = t.replace(/substituting x = 2\$instead of\$-2\$\$/g, 'substituting $x = 2$ instead of $x = -2$')
  t = t.replace(/Find the value of \$k\$\. So /g, 'Find the value of $k$ so that ')
  t = t.replace(/Find the set of values of \$k\$\. So /g, 'Find the value of $k$ if ')
  t = t.replace(/Find the value of the constant \$m \. /g, 'If the constant $m$ is such that ')
  t = t.replace(/Calculating \$m \. -1/g, 'Calculating $m = -1$')
  t = t.replace(/\$1or /g, '$1$ or ')
  t = t.replace(/roots\^(\d+) and (-?\d+)/g, 'roots $$1$ and $2$')
  t = t.replace(/Roots are\^(\d+) and (-?\d+)/g, 'Roots are $$1$ and $2$')
  t = t.replace(/, -2,\$ and\^4\./g, ', $-2$, and $4$.')
  t = t.replace(/\$b2\(/g, '$b$ if $(')
  t = t.replace(/values of \$a\$ and \$b2\(/g, 'values of $a$ and $b$ if $(')
  return t
}

const OVERRIDES = {
  '3-1-adding-subtracting-and-multiplying-polynomials-easy-q1':
    'Add the coefficients of like terms: $(2+1)x^2 + (-3+5)x + (4-1) = 3x^2 + 2x + 3$.\n\n**Common mistake:** Adding $|-3|$ and $5$ to get $8x$ instead of $2x$.',
  '3-2-division-of-polynomials-harder-topic-medium-q1':
    '$x(x+2) = x^2 + 2x$. Subtract from $x^2 + 7x$ to get $5x$. Then $5(x+2) = 5x + 10$. Subtracting leaves remainder $5$.\n\n**Common mistake:** Subtracting incorrectly in long division, e.g. $7x - 2x = 9x$ or $15 - 10 = 25$.',
  '3-2-division-of-polynomials-harder-topic-medium-q2':
    'The first term of the quotient is $2x^2$. Subtracting $2x^2(x-1)$ gives $-3x^2 + 4x$. Then $-3x(x-1)$ gives $x - 1$. The quotient is $2x^2 - 3x + 1$.\n\n**Common mistake:** Sign errors when subtracting, e.g. treating $-5x^2 - (-2x^2)$ as $-7x^2$ instead of $-3x^2$.',
  '3-2-division-of-polynomials-harder-topic-medium-q4':
    'This is a difference of squares: $(2x-1)(2x+1)$. Dividing by $(2x+1)$ gives $(2x-1)$.\n\n**Common mistake:** Incorrectly dividing the constant term, thinking that $1$ divided by $1$ is $1$ or introducing an incorrect fractional coefficient.',
  '3-2-division-of-polynomials-harder-topic-easy-q5':
    'The expression is already in the form $D(x)Q(x) + R(x)$ where $D(x) = (x-2)$. The constant term $5$ is the remainder.\n\n**Common mistake:** Expanding and performing long division is correct but inefficient and prone to arithmetic errors.',
  '3-2-division-of-polynomials-harder-topic-pyp-q2':
    '$x^2(x+3) = x^3+3x^2$. Subtract to get $x^2+kx$. Then $x(x+3) = x^2+3x$, leaving $(k-3)x - 12$. For zero remainder, $k-3=4 \\implies k=7$. Quotient is $x^2+x-4$.\n\n**Common mistake:** Failing to solve for $k$ first or making arithmetic errors in the subtraction steps.',
  '3-2-division-of-polynomials-harder-topic-pyp-q5':
    'Divide $x^3 - 3x^2 + 4$ by $(x - 2)$ to get $x^2 - x - 2$. Factoring gives $(x - 2)(x + 1)$, so the roots are $2$ and $-1$.\n\n**Common mistake:** Forgetting that the quotient may have repeated roots or failing to factor the quadratic quotient.',
  '3-2-division-of-polynomials-harder-topic-hard-q2':
    'Find the values of $a$ and $b$ if $(x^2 + 1)$ is a factor of $x^4 + ax^3 + bx^2 + 3x + 2$.',
  '3-2-division-of-polynomials-harder-topic-hard-q3':
    'Performing division: $x^2(x^2+1) = x^4+x^2$. Subtract to get $ax^3 + (b-1)x^2 + 3x$. Then $ax(x^2+1) = ax^3+ax$, leaving $(b-1-a)x^2 + (3-a)x + 2$. For no remainder, $3-a=0 \\implies a=3$ and $b-1-a=0 \\implies b=4$.\n\n**Common mistake:** Difficulty aligning the coefficients of the remainder $(3-a)x$ and $(b-1)$ with zero.',
  '3-3-the-factor-theorem-harder-topic-medium-q4':
    'Set $x = -3$: $(-3)^3 + c(-3)^2 + 9 = 0 \\implies -27 + 9c + 9 = 0 \\implies 9c = 18 \\implies c = 2$.\n\n**Common mistake:** Calculating $(-3)^2$ as $-9$ instead of $9$, leading to $-9c = 18$ and $c = -2$.',
  '3-3-the-factor-theorem-harder-topic-medium-q5':
    'Set $x = 0.5$: $2(0.5)^2 + b(0.5) - 3 = 0 \\implies 2(0.25) + 0.5b - 3 = 0 \\implies 0.5 + 0.5b - 3 = 0 \\implies 0.5b = 2.5 \\implies b = 5$.\n\n**Common mistake:** Errors with fractions or decimals, e.g. miscalculating $2(0.5)^2$ as $0.25$ or $1$.',
  '3-3-the-factor-theorem-harder-topic-hard-q2':
    'Find the value of $k$ if $P(x) = x^2 - kx + 16$ and $(x - 4)$ is a factor.',
  '3-4-cubic-expressions-and-equations-harder-topic-hard-q1':
    'Divide by $(x + 1)$ to obtain $x^2 - x - 6$. Factoring gives $(x - 3)(x + 2)$, so the roots are $3$ and $-2$.\n\n**Common mistake:** Dividing by $(x - 1)$ instead of $(x + 1)$ when the known root is $-1$.',
  '3-4-cubic-expressions-and-equations-harder-topic-hard-q4':
    'Division by $(x - 3)$ gives $2x^2 + x - 1$. Factorizing gives $(2x - 1)(x + 1)$, so the additional roots are $0.5$ and $-1$.\n\n**Common mistake:** Misidentifying $0.5$ as $2$ when factoring $2x^2 + x - 1$.',
  '3-4-cubic-expressions-and-equations-harder-topic-hard-q5':
    '$P(1) = 1 + m - 10 + 8 = 0 \\implies m = 1$. Dividing by $(x - 1)$ gives $x^2 + 2x - 8 = (x + 4)(x - 2)$, so the other roots are $-4$ and $2$.\n\n**Common mistake:** Calculating $m = -1$ or misreading the roots from $(x + 4)$ and $(x - 2)$.',
  '3-4-cubic-expressions-and-equations-harder-topic-pyp-q1':
    'Testing $x = 1$: $1 - 4 - 7 + 10 = 0$. Dividing by $(x - 1)$ gives $x^2 - 3x - 10 = (x - 5)(x + 2)$, so the roots are $5$ and $-2$.\n\n**Common mistake:** Starting with $x = -1$ or errors when factoring the quadratic quotient.',
  '3-5-the-remainder-theorem-harder-topic-easy-q3':
    'Substitute $x = -2$: $f(-2) = 2(-2)^2 + 7 = 2(4) + 7 = 15$.\n\n**Common mistake:** Treating $(-2)^2$ as $-4$ instead of $4$, or substituting $x = 2$ instead of $x = -2$.',
  '3-5-the-remainder-theorem-harder-topic-medium-q4':
    'Substitute $x = -1$: $(-1)^3 + a(-1)^2 - 5 = -2 \\implies -1 + a - 5 = -2 \\implies a = 4$.\n\n**Common mistake:** Arithmetic errors with negatives, or cubing $-1$ as $1$ instead of $-1$.',
  '3-5-the-remainder-theorem-harder-topic-pyp-q1':
    '$2+k+4 = 2(-8)+4k+4 \\implies k+6 = 4k-12 \\implies 18 = 3k \\implies k = 6$.\n\n**Common mistake:** Cubing $-2$ as $8$ instead of $-8$, leading to a wrong value of $k$.',
}

let changed = 0
for (const topic of TOPICS) {
  for (const diff of DIFFS) {
    const file = path.join(quizzesDir, `${topic}-${diff}.json`)
    if (!fs.existsSync(file)) continue
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    let fileChanged = false
    for (const q of data.questions ?? []) {
      for (const field of ['question', 'explanation']) {
        if (q[field]) {
          const next = fixText(q[field])
          if (next !== q[field]) {
            q[field] = next
            fileChanged = true
          }
        }
      }
      if (OVERRIDES[q.id]) {
        const override = OVERRIDES[q.id]
        if (override.startsWith('Find the') || override.startsWith('If the')) {
          q.question = override
        } else {
          q.explanation = override
        }
        fileChanged = true
      }
      for (const opt of q.options ?? []) {
        const idx = q.options.indexOf(opt)
        const next = fixText(opt)
        if (next !== opt) {
          q.options[idx] = next
          fileChanged = true
        }
      }
    }
    if (fileChanged) {
      fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8')
      changed++
      console.log('repaired', path.basename(file))
    }
  }
}
console.log(`Done — ${changed} file(s) updated`)
