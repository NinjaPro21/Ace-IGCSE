#!/usr/bin/env node
/**
 * One-off repair for Add Math Ch.4 canonical quiz JSON (docx import artefacts).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const quizDir = path.join(root, 'content', 'quizzes', 'add-maths-0606')

const topicIds = [
  '4-1-solving-equations-of-the-type-f-x-g-x',
  '4-2-solving-modulus-inequalities',
  '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu',
]

function countDollars(s) {
  return (s.match(/(?<!\\)\$/g) ?? []).length
}

/** Close orphan opening $ before modulus equations ending with |. */
function fixModulusDelimiter(text) {
  if (!text || typeof text !== 'string') return text
  let t = text

  // $|0$.5x| → $|0.5x|
  t = t.replace(/\$\|0\$\./g, '$|0.')

  // $|expr|.$ at end → $|expr|$.
  t = t.replace(/(\$\|[^$]+)\|\.(\s*)$/g, '$1|$.$2')

  // $| \frac{...} | > |x|.$ → wrapped
  t = t.replace(
    /\$\|\s*\\frac\{([^}]+)\}\{([^}]+)\}\s*\|\s*([<>≤≥=]+)\s*\|([^$|]+)\|\.(\s*)$/g,
    (_, a, b, op, rhs, tail) => `$|\\frac{${a}}{${b}}| ${op} |${rhs}|$.${tail}`,
  )

  // $| \frac{a}{b} | = | \frac{c}{d} |.$ 
  t = t.replace(
    /\$\|\s*\\frac\{([^}]+)\}\{([^}]+)\}\s*\|\s*=\s*\|\s*\\frac\{([^}]+)\}\{([^}]+)\}\s*\|\.(\s*)$/g,
    (_, a, b, c, d, tail) => `$|\\frac{${a}}{${b}}| = |\\frac{${c}}{${d}}|$.${tail}`,
  )

  // $|x - a| = |x - b| where → $|x - a| = |x - b|$ where
  t = t.replace(/(\$\|[^$]+\| = \|[^$]+\|)\s+(where\b)/gi, '$1$ $2')

  // $y = |...|.$ at end (second graph in intersection questions)
  t = t.replace(/(\$y\s*=\s*\|[^$]+\|)\.(\s*)$/g, '$1$.$2')

  // $x$\neq → $x \neq
  t = t.replace(/\$x\$\s*\\neq\s*(-?\d+)/g, '$x \\neq $1$')
  t = t.replace(/\$x\$\s*\\neq\s*(-?\d+)/g, '$x \\neq $1$')

  // and^3 / and^4 docx exponent glitches
  t = t.replace(/,\s*and\^(\d+)/g, ', and $$1$')

  // $k$. $| → $k$ for which $|
  t = t.replace(/\$k\$\.\s*\$\|/g, '$k$ for which $|')

  return t
}

const manual = {
  '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu-easy.json': {
    '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu-easy-q1': {
      question:
        'If a cubic function $f(x)$ has roots at $x = -2, 1,$ and $3$, where does the graph of $y = |f(x)|$ meet the $x$-axis?',
      explanation:
        'The modulus transformation $y = |f(x)|$ reflects negative $y$-values above the $x$-axis but does not change the roots (values where $y=0$).\n\n**Common mistake:** Students may mistakenly reflect the $x$-coordinates as well, leading to the wrong sign for the intercepts.',
    },
    '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu-easy-q2': {
      question: 'Find the $y$-intercept of $y = |x(x-2)(x+3)|$.',
    },
    '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu-easy-q4': {
      question:
        'If the cubic graph $y = (x-1)^2(x+2)$ is transformed to $y = |(x-1)^2(x+2)|$, how many distinct $x$-intercepts are shown?',
    },
    '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu-easy-q5': {
      question: 'Identify the basic shape of $y = x^3$ after applying the modulus transformation $y = |x^3|$.',
    },
  },
  '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu-medium.json': {
    '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu-medium-q2': {
      question: 'Find the $y$-intercept of $y = |(x+1)(x-2)(x-4)|$.',
    },
    '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu-medium-q3': {
      question:
        'The cubic $f(x)$ has roots at $-4, 0,$ and $4$. Describe the end behavior of $y = |f(x)|$ as $x \\to \\infty$ and $x \\to -\\infty$.',
    },
    '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu-medium-q5': {
      explanation:
        'The equation is zero only at the roots of the cubic expression: $x=1, 2,$ and $3$.\n\n**Common mistake:** Thinking the modulus doubles the number of solutions for a \'zero\' equation.',
    },
  },
  '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu-hard.json': {
    '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu-hard-q1': {
      question:
        'Find the range of values of $k$ for which $|x(x-2)(x-4)| = k$ has exactly 6 distinct solutions.',
    },
    '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu-hard-q3': {
      question:
        'If the cubic $f(x) = x^3 + k$ has exactly one real root, how many $x$-intercepts does $y = |f(x)|$ have?',
    },
    '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu-hard-q4': {
      question:
        'When transforming $y = x^3 - x$ to $y = |x^3 - x|$, on which intervals is the original graph below the $x$-axis (and therefore reflected)?',
    },
    '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu-hard-q5': {
      question:
        'The line $y = c$ intersects $y = |x^3 - 4x|$ at exactly 5 points. What must $c$ equal?',
    },
  },
  '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu-pyp.json': {
    '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu-pyp-q2': {
      question:
        'The function $f(x) = x^3 - 9x$ is sketched. Which statement best describes the graph of $y = |f(x)|$ compared with $y = f(x)$?',
      options: [
        'Reflect the portions of $y = f(x)$ that lie below the $x$-axis in the $x$-axis.',
        'Reflect the entire graph across the $y$-axis.',
        'Shift the entire graph up by 9 units.',
        'Reflect the portions where the graph is below the $x$-axis.',
      ],
      correctIndex: 3,
    },
    '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu-pyp-q3': {
      question: 'Find the values of $x$ for which $|x(x-3)^2| = 0$.',
    },
    '4-3-sketching-graphs-of-cubic-polynomials-and-their-modu-pyp-q1': {
      explanation:
        '$x$-intercepts from the factors are $-2, 1, 4$. At $x=0$, $y = |(2)(-1)(-4)| = 8$, so the $y$-intercept is $(0, 8)$.\n\n**Common mistake:** Mixing up the signs of the roots derived from the linear factors.',
    },
  },
  '4-1-solving-equations-of-the-type-f-x-g-x-hard.json': {
    '4-1-solving-equations-of-the-type-f-x-g-x-hard-q1': {
      question: 'Solve the equation $|0.5x + 4| = |1.5x - 2|$.',
    },
    '4-1-solving-equations-of-the-type-f-x-g-x-hard-q2': {
      question: 'Find the values of $x$ such that $|\\frac{x+1}{2}| = |\\frac{x-3}{4}|$.',
    },
  },
  '4-2-solving-modulus-inequalities-hard.json': {
    '4-2-solving-modulus-inequalities-hard-q4': {
      question: 'Find the range of values for $x$ such that $|\\frac{2x-1}{x+3}| < 1$, assuming $x \\neq -3$.',
    },
  },
}

let changed = 0

for (const topicId of topicIds) {
  for (const tier of ['easy', 'medium', 'hard', 'pyp']) {
    const file = path.join(quizDir, `${topicId}-${tier}.json`)
    if (!fs.existsSync(file)) continue
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    const rel = path.basename(file)
    let fileChanged = false

    for (const q of data.questions) {
      const patches = manual[rel]?.[q.id] ?? {}
      for (const key of ['question', 'explanation', 'options']) {
        if (key === 'options') {
          if (patches.options) {
            q.options = patches.options
            fileChanged = true
          }
          continue
        }
        if (patches[key]) {
          q[key] = patches[key]
          fileChanged = true
          continue
        }
        if (q[key]) {
          const next = fixModulusDelimiter(q[key])
          if (next !== q[key]) {
            q[key] = next
            fileChanged = true
          }
        }
      }
      if (typeof patches.correctIndex === 'number') {
        q.correctIndex = patches.correctIndex
        fileChanged = true
      }
    }

    if (fileChanged) {
      fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
      changed++
      console.log('updated', rel)
    }
  }
}

console.log(`Done — ${changed} file(s) updated.`)
