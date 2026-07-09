#!/usr/bin/env node
/** Fix KaTeX blockers that fail content:qa predeploy gate. */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizDir = path.join(__dirname, '..', 'content', 'quizzes')

const PATCHES = {
  'add-maths-0606/11-4-11-5-geometric-progressions-gp-and-infinite-series-h-pyp.json': {
    '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-pyp-q4': {
      question: 'The general term of the GP $8, 4, 2, \\ldots$ is $2^{k-n}$. Find $k$.',
    },
  },
  'add-maths-0606/11-pascal-s-triangle-and-the-binomial-theorem-hard.json': {
    '11-pascal-s-triangle-and-the-binomial-theorem-hard-q1': {
      explanation:
        'Row 4 coefficients: $1, 4, 6, 4, 1$. The $x^2$ term is $6 \\cdot 1^2 \\cdot (2x)^2 = 24x^2$.\n\n**Common mistake:** Using only the coefficient $6$ and forgetting to square the $2$ from $(2x)$.',
    },
  },
  'add-maths-0606/11-pascal-s-triangle-and-the-binomial-theorem-pyp.json': {
    '11-pascal-s-triangle-and-the-binomial-theorem-pyp-q1': {
      explanation:
        'Row 4: $1, 4, 6, 4, 1$. The $x^2$ term is $6 \\cdot 1^2 \\cdot (-3x)^2 = 54x^2$.\n\n**Common mistake:** Squaring $-3$ incorrectly or forgetting the Pascal coefficient $6$.',
    },
    '11-pascal-s-triangle-and-the-binomial-theorem-pyp-q2': {
      explanation:
        'Row 4: $1, 4, 6, 4, 1$. The constant term is $6 \\cdot x^2 \\cdot (2/x)^2 = 24$.\n\n**Common mistake:** Taking the last term only instead of the term where powers of $x$ cancel.',
    },
  },
  'add-maths-0606/14-derivatives-of-exponential-logarithmic-and-tr-hard.json': {
    '14-derivatives-of-exponential-logarithmic-and-tr-hard-q12': {
      question: 'Determine $\\frac{d^2y}{dx^2}$ for $y = \\tan x$.',
      options: [
        '$2\\sec^2 x \\tan x$',
        '$\\sec^4 x$',
        '$2\\sec x \\tan x$',
        '$\\sec^2 x \\tan^2 x$',
      ],
      explanation:
        'Let $y = \\tan x$. Then $\\frac{dy}{dx} = \\sec^2 x$ and $\\frac{d^2y}{dx^2} = 2\\sec^2 x \\tan x$.\n\n**Common mistake:** Applying the power rule to $\\sec^2 x$ without the chain rule.',
    },
  },
  'add-maths-0606/15-definite-integration-amp-area-under-a-curve-pyp.json': {
    '15-definite-integration-amp-area-under-a-curve-pyp-q4': {
      question: 'Evaluate $\\int_0^1 e^{2x}\\,dx$.',
      options: ['$0.5(e^2 - 1)$', '$e^2 - 1$', '$0.5e^2$', '$e^2$'],
    },
  },
  'add-maths-0606/ch14-calculus-differentiation-2-easy.json': {
    'ch14-calculus-differentiation-2-q4': {
      explanation:
        'Using the chain rule with $u = 3x + 2$, $\\frac{dy}{dx} = \\cos(3x + 2) \\cdot 3 = 3\\cos(3x + 2)$.\n\n**Common mistake:** Forgetting to multiply by the derivative of the inner function.',
    },
  },
  'add-maths-0606/ch16-kinematics-hard.json': {
    'ch16-kinematics-q3': {
      explanation:
        '$v = \\int (2t + 1)^{-2}\\,dt = -\\frac{1}{2(2t + 1)} + c$. With $v = 0.5$ at $t = 0$, $c = 1$. So $v = 1 - \\frac{1}{2(2t + 1)} \\to 1$ as $t \\to \\infty$.\n\n**Common mistake:** Taking the constant $c$ alone as the limiting velocity.',
    },
  },
}

// maths-0580 duplicate explanation fix
const m0580Files = [
  'maths-0580/1-6-8-4-indices-hard.json',
  'maths-0580/ch01-number-hard.json',
]

for (const [rel, overrides] of Object.entries(PATCHES)) {
  const fp = path.join(quizDir, rel)
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'))
  for (const q of data.questions ?? []) {
    const ov = overrides[q.id]
    if (!ov) continue
    Object.assign(q, ov)
  }
  fs.writeFileSync(fp, `${JSON.stringify(data, null, 2)}\n`)
  console.log('patched', rel)
}

for (const rel of m0580Files) {
  const fp = path.join(quizDir, rel)
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'))
  let changed = false
  for (const q of data.questions ?? []) {
    if (q.explanation?.includes('$fraction:$')) {
      q.explanation = q.explanation.replace(/\$fraction:\$/g, 'fraction ')
      changed = true
    }
  }
  if (changed) {
    fs.writeFileSync(fp, `${JSON.stringify(data, null, 2)}\n`)
    console.log('patched', rel)
  }
}

console.log('Deploy KaTeX blockers fixed')
