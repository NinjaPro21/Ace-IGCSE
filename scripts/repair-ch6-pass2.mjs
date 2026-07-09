#!/usr/bin/env node
/** Second-pass Ch.6 repair — fix regressions from pass 1 and remaining docx artefacts. */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const quizDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'content', 'quizzes', 'add-maths-0606')
const topicIds = [
  '6-1-midpoint-parallel-and-perpendicular-lines',
  '6-2-equations-of-straight-lines',
  '6-3-areas-of-rectilinear-figures',
  '6-4-converting-from-a-non-linear-equation-to-linear-form',
  '6-5-finding-relationships-from-data',
]

function pass2(text) {
  if (!text) return text
  let t = text
  t = t.replace(/\$\$+\./g, '$.')
  t = t.replace(/and \$m = (-?\d+(?:\.\d+)?)\$\$/g, 'and $m = $1$')
  t = t.replace(/value of \$([a-zA-Z])\.\.\./g, 'value of $$1$.')
  t = t.replace(/values of \$/g, 'values of $x$ when ')
  t = t.replace(/find\$/g, 'find $a$')
  t = t.replace(/\$B2\(/g, '$B$ are $(')
  t = t.replace(/\$AB2\(/g, '$AB$ are $(')
  t = t.replace(/and \$B2\(/g, 'and $B$ are $(')
  t = t.replace(/\$L\$\.\s*\$/g, '$L$ is $')
  t = t.replace(/\$M\$\.\s*\$/g, '$M$ is the midpoint of $(')
  t = t.replace(/through \$M\$ and \$L\./g, 'through $M$ parallel to $L$.')
  t = t.replace(/\$y\$ = /g, '$y = ')
  t = t.replace(/\$x\$ and \$y\$ = /g, '$x$ and $y$ satisfy $')
  t = t.replace(/\\lg y2\\lg x/g, '$\\lg y$ against $\\lg x$')
  t = t.replace(/\\lg y2x/g, '$\\lg y$ against $x$')
  t = t.replace(/\\ln y2x/g, '$\\ln y$ against $x$')
  t = t.replace(/\$y\/x2x/g, 'plot $y/x$ against $x$')
  t = t.replace(/\$xy2x\^2/g, 'plot $xy$ against $x^2$')
  t = t.replace(/\$xy2x\^3/g, 'plot $xy$ against $x^3$')
  t = t.replace(/\$1\/y\$\.\s*\$1\/x22/g, 'plot $1/y$ against $1/x^2$')
  t = t.replace(/against \$x\^2\$\$/g, 'against $x^2$.')
  t = t.replace(/At the the \$1\$-coordinate:/g, 'On the $y$-axis, set ')
  t = t.replace(/by the \$1\$-coordinate:/g, 'by $x$:')
  t = t.replace(/Dividing the original equation by the \$1\$-coordinate:/g, 'Dividing the original equation by $x$:')
  t = t.replace(/the \$1\$-coordinate: \$y = 10/g, '$x$ when $y = 10$')
  t = t.replace(/with \$X\$ = /g, 'with $X$ = ')
  t = t.replace(/and \$x\$\/y = ax \+ b\$ , find/g, 'with $X = 1/x$. The line is $1/y = ax + b$. Find')
  t = t.replace(/\$b2\\/g, '$b$. Plot $\\')
  t = t.replace(/and q2y/g, 'and $q$, where $y$')
  t = t.replace(/p  and q2y/g, 'constants $p$ and $q$, where $y$')
  t = t.replace(/and \$x2\^2/g, 'and the gradient is $-2$')
  t = t.replace(/k2x\^2/g, 'k$ for which $x^2')
  t = t.replace(/k2y =/g, 'k$ for which $y$ =')
  t = t.replace(/\$ABCD2A/g, '$ABCD$ with $A$')
  t = t.replace(/diagonals \$AC\$\.\s*\$BD2/g, 'diagonals $AC$ and $BD$. Midpoint of ')
  t = t.replace(/and \$C2\(/g, 'and $C$ to $(')
  t = t.replace(/midpoint of \$AB\$\.\s*\$AB\./g, 'midpoint of $AB$.')
  t = t.replace(/gradient \$m\$ and intercept \$c\$ give \$y\$\$/g, 'gradient $m$ and intercept $c$. Express $y$')
  t = t.replace(/and \$\$x\$ and \$y\$/g, 'gives $y = mx + c/x$')
  t = t.replace(/\$x\^2y\$ and \$\$x\$ and \$y\$\$/g, '$x^2y$ against $x$. Find $y$')
  t = t.replace(/Find n\$\./g, 'Find $n$.')
  t = t.replace(/is \$b\$ is \$/g, 'is $b$, using points ')
  t = t.replace(/variable \$X\$ and \$x\$\^2\$/g, 'variable $X = x^2$')
  t = t.replace(/Calculating \$k\$\./g, 'Calculating $k$:')
  t = t.replace(/assuming \$A\$\./g, 'assuming $A$:')
  t = t.replace(/into \$\\lg y\$\./g, 'into $\\lg y$:')
  t = t.replace(/ \$y\$ \\to /g, ', $y \\to ')
  return t
}

const manual = {
  '6-1-midpoint-parallel-and-perpendicular-lines-easy.json': {
    '6-1-midpoint-parallel-and-perpendicular-lines-easy-q2': {
      explanation:
        'Parallel lines have the same gradient. The given line is $y = -4x + 9$, so $m = -4$.\n\n**Common mistake:** Providing the negative reciprocal ($1/4$) by confusing parallel and perpendicular rules.',
    },
  },
  '6-1-midpoint-parallel-and-perpendicular-lines-medium.json': {
    '6-1-midpoint-parallel-and-perpendicular-lines-medium-q2': {
      question:
        'The midpoint of the points $(k, 4)$ and $(6, k+2)$ is $(5, 6)$. Find the value of $k$.',
    },
  },
  '6-2-equations-of-straight-lines-medium.json': {
    '6-2-equations-of-straight-lines-medium-q4': {
      question:
        'The point $P(k, 2k)$ lies on the line $y = x + 5$. Determine the value of $k$.',
    },
  },
  '6-2-equations-of-straight-lines-pyp.json': {
    '6-2-equations-of-straight-lines-pyp-q1': {
      question:
        'Points $A$ and $B$ are $(-2, 1)$ and $(4, 5)$ respectively. Find the equation of the perpendicular bisector of $AB$.',
    },
    '6-2-equations-of-straight-lines-pyp-q2': {
      question:
        'Line $L$ is $2x - 3y = 6$. Point $M$ is the midpoint of $A(1, 4)$ and $B(5, 8)$. Find the equation of the line through $M$ parallel to $L$.',
    },
    '6-2-equations-of-straight-lines-pyp-q4': {
      question:
        'Find the set of values of $k$ for which the line $y = 2x + k$ does not intersect the circle $x^2 + y^2 = 5$.',
    },
    '6-2-equations-of-straight-lines-pyp-q5': {
      question:
        'Parallelogram $ABCD$ has $A(1, 2)$, $B(4, 5)$, and $C(7, 2)$. Find the coordinates of $D$.',
      explanation:
        'Midpoint of $AC$ is $(4, 2)$. This is also the midpoint of $BD$, so $D$ is $(4, -1)$.\n\n**Common mistake:** Adding vector $A \\to B$ to $C$ instead of using diagonal midpoints.',
    },
    '6-2-equations-of-straight-lines-pyp-q6': {
      question:
        'Find the equation of the line through $A(-3, 5)$ and $B(1, -3)$ in the form $y = mx + c$.',
    },
    '6-2-equations-of-straight-lines-pyp-q8': {
      question:
        'Find $k$ if the line $y = x + k$ is tangent to the curve $y = x^2 - 3x + 8$.',
    },
    '6-2-equations-of-straight-lines-pyp-q9': {
      explanation:
        'On the $y$-axis, $x = 0$: $3(0) - 4y = 12 \\Rightarrow y = -3$. The point is $(0, -3)$.\n\n**Common mistake:** Setting $y = 0$ instead of $x = 0$ for a $y$-intercept.',
    },
  },
  '6-3-areas-of-rectilinear-figures-medium.json': {
    '6-3-areas-of-rectilinear-figures-medium-q2': {
      question:
        'A triangle with vertices $(0, 0)$, $(k, 0)$, and $(3, 5)$ has area 20 square units. Find the positive value of $k$.',
    },
  },
  '6-3-areas-of-rectilinear-figures-hard.json': {
    '6-3-areas-of-rectilinear-figures-hard-q1': {
      question:
        'Triangle $P(k, 2)$, $Q(4, 6)$, and $R(1, 5)$ has area 2 square units. Find $k$.',
    },
    '6-3-areas-of-rectilinear-figures-hard-q4': {
      question:
        'A triangle with vertices $(1, p)$, $(4, 1)$, and $(6, 3)$ has area 5 square units. Find the possible values of $p$.',
    },
  },
  '6-3-areas-of-rectilinear-figures-pyp.json': {
    '6-3-areas-of-rectilinear-figures-pyp-q2': {
      question:
        'A triangle with vertices $(2, 3)$, $(5, 7)$, and $(x, 1)$ has area 10 square units. Find the possible values of $x$.',
    },
    '6-3-areas-of-rectilinear-figures-pyp-q3': {
      question:
        'Find the area of the triangle formed by the lines $y = 4$, $x = 2$, and $3x + 4y = 24$.',
    },
    '6-3-areas-of-rectilinear-figures-pyp-q4': {
      question:
        'Triangle $A(1, 1)$, $B(5, 3)$, and $C(k, 7)$ has area 12 square units. Find $k$.',
    },
  },
  '6-4-converting-from-a-non-linear-equation-to-linear-form-easy.json': {
    '6-4-converting-from-a-non-linear-equation-to-linear-form-easy-q3': {
      explanation:
        'Dividing by $x$ gives $y/x = ax + b$, so plot $Y = y/x$ against $X = x$.\n\n**Common mistake:** Reflexively using logarithms for any non-linear law.',
    },
    '6-4-converting-from-a-non-linear-equation-to-linear-form-easy-q4': {
      explanation:
        'The equation is $y = a(1/x) + b$, so plot $Y = y$ against $X = 1/x$.\n\n**Common mistake:** Plotting raw $x$ and $y$, which gives a hyperbola rather than a line.',
    },
  },
  '6-4-converting-from-a-non-linear-equation-to-linear-form-medium.json': {
    '6-4-converting-from-a-non-linear-equation-to-linear-form-medium-q2': {
      question:
        'If $y = px^2 + qx$, plot $y/x$ against $x$. The line passes through $(1, 5)$ and $(3, 11)$. Find $p$.',
    },
    '6-4-converting-from-a-non-linear-equation-to-linear-form-medium-q3': {
      question:
        'A plot of $\\lg y$ against $x$ is a straight line with gradient 2 and intercept 1. Find the value of $A$ if $y = Ab^x$.',
    },
    '6-4-converting-from-a-non-linear-equation-to-linear-form-medium-q5': {
      question:
        'A straight-line graph is obtained by plotting $1/y$ against $1/x^2$. Find the equation relating $y$ and $x$.',
    },
  },
  '6-4-converting-from-a-non-linear-equation-to-linear-form-hard.json': {
    '6-4-converting-from-a-non-linear-equation-to-linear-form-hard-q1': {
      question:
        'Variables $x$ and $y$ satisfy $y = \\frac{a}{x^2 + b}$. Plot $1/y$ against $x^2$ to obtain a straight line. Find the gradient in terms of $a$ and $b$.',
    },
    '6-4-converting-from-a-non-linear-equation-to-linear-form-hard-q2': {
      question:
        'Given $y^n = Ax^b$, plot $\\lg y$ against $\\lg x$. Find the gradient of this line.',
    },
    '6-4-converting-from-a-non-linear-equation-to-linear-form-hard-q4': {
      explanation:
        '$y = \\frac{x}{ax+b} \\Rightarrow \\frac{1}{y} = \\frac{ax+b}{x} = a + \\frac{b}{x}$. With $Y = 1/y$ and $X = 1/x$, the gradient is $b$.\n\n**Common mistake:** Confusing the gradient with the intercept for this transformation.',
    },
    '6-4-converting-from-a-non-linear-equation-to-linear-form-hard-q5': {
      question:
        'The graph of $xy$ against $x^2$ is a straight line with gradient $m$ and intercept $c$. Express $y$ in terms of $x$, $m$, and $c$.',
      explanation:
        '$xy = mx^2 + c$, so $y = mx + \\frac{c}{x}$.\n\n**Common mistake:** Writing $y = mx^2 + c$ instead of dividing by $x$.',
    },
  },
  '6-4-converting-from-a-non-linear-equation-to-linear-form-pyp.json': {
    '6-4-converting-from-a-non-linear-equation-to-linear-form-pyp-q3': {
      question:
        'Variables $x$ and $y$ satisfy $y = ax^2 + b/x$. Plot $xy$ against $x^3$. If the intercept is 1 and the gradient is 1, find the original equation.',
    },
  },
  '6-5-finding-relationships-from-data-medium.json': {
    '6-5-finding-relationships-from-data-medium-q4': {
      question:
        'Points $(0.2, 7)$ and $(0.5, 13)$ lie on a plot of $y$ against $1/x$. If $y = \\frac{a}{x} + b$, find $a$.',
    },
    '6-5-finding-relationships-from-data-medium-q5': {
      explanation:
        'Linear form: $\\frac{y}{x} = 5x^2 + 2$. When $x = 2$, $\\frac{y}{2} = 22$, so $y = 44$.\n\n**Common mistake:** Stopping at $\\frac{y}{x} = 22$ without multiplying by $x$.',
    },
  },
  '6-5-finding-relationships-from-data-hard.json': {
    '6-5-finding-relationships-from-data-hard-q2': {
      question:
        'Data satisfies $y^2 = ax + b$. Plotting $y^2$ against $x$ gives $(2, 11)$ and $(6, 31)$. Find where the curve meets the $y$-axis.',
      options: ['$(0, \\pm 1)$', '$(0, 1)$ only', '$(1, 0)$', '$(0, \\pm \\sqrt{5})$'],
      correctIndex: 0,
    },
    '6-5-finding-relationships-from-data-hard-q3': {
      question:
        'Constants $p$ and $q$ satisfy $y = pe^{qx}$. A plot of $\\ln y$ against $x$ has gradient $-2$ and passes through $(0, 0.5)$. Find $p$.',
    },
    '6-5-finding-relationships-from-data-hard-q4': {
      explanation:
        'The law is $y = \\frac{100}{x^3}$. If $x$ is doubled, $y$ becomes $\\frac{1}{8}$ of its original value.\n\n**Common mistake:** Applying the gradient $-3$ directly to $y$ instead of using the power law.',
    },
    '6-5-finding-relationships-from-data-hard-q5': {
      question:
        'The law $y = ax^n + b$ with $b = 10$ is linearised by plotting $\\ln(y-10)$ against $\\ln x$. The line passes through $(0, 1)$ and $(2, 5)$. Find $a$.',
    },
  },
  '6-5-finding-relationships-from-data-pyp.json': {
    '6-5-finding-relationships-from-data-pyp-q1': {
      question:
        'Experimental data suggests $y = ax^n$. A plot of $\\lg y$ against $\\lg x$ gives gradient 2. Using $(2, 12.1)$, find $a$.',
    },
    '6-5-finding-relationships-from-data-pyp-q2': {
      question:
        'If $y = Ae^{kx}$, a plot of $\\ln y$ against $x$ passes through $(1, 2)$ and $(3, 8)$. Find $k$ and $A$.',
    },
    '6-5-finding-relationships-from-data-pyp-q3': {
      question:
        'Variables satisfy $y = \\frac{a}{x} + bx$. Plotting $xy$ against $x^2$ gives points $(1, 4)$ and $(4, 13)$. Find the law.',
      explanation:
        '$xy = ax + b x^2$. Gradient $b = 3$, intercept gives $a = 1$, so $y = \\frac{1}{x} + 3x$.\n\n**Common mistake:** Using the wrong plotted variables when reading coordinates from the table.',
    },
    '6-5-finding-relationships-from-data-pyp-q4': {
      question:
        'A line of best fit gives $\\lg y = -0.2x + 1.5$. Estimate $x$ when $y = 10$.',
      explanation:
        '$\\lg 10 = -0.2x + 1.5 \\Rightarrow x = 2.5$.\n\n**Common mistake:** Substituting $y = 10$ without taking $\\lg y$ first.',
    },
    '6-5-finding-relationships-from-data-pyp-q5': {
      question:
        'A plot of $x^2y$ against $x$ is a straight line $x^2y = 4x + 5$. Find $y$ when $x = 0.5$.',
    },
  },
}

let n = 0
for (const topicId of topicIds) {
  for (const tier of ['easy', 'medium', 'hard', 'pyp']) {
    const file = path.join(quizDir, `${topicId}-${tier}.json`)
    if (!fs.existsSync(file)) continue
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    const rel = path.basename(file)
    let changed = false
    for (const q of data.questions) {
      const p = manual[rel]?.[q.id] ?? {}
      for (const k of ['question', 'explanation']) {
        if (p[k]) {
          q[k] = p[k]
          changed = true
        } else if (q[k]) {
          const next = pass2(q[k])
          if (next !== q[k]) {
            q[k] = next
            changed = true
          }
        }
      }
      if (p.options) {
        q.options = p.options
        changed = true
      }
      if (typeof p.correctIndex === 'number') {
        q.correctIndex = p.correctIndex
        changed = true
      }
      if (q.options) {
        q.options = q.options.map((o) => {
          const next = pass2(o)
          if (next !== o) changed = true
          return next
        })
      }
    }
    if (changed) {
      fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
      n++
      console.log('pass2', rel)
    }
  }
}
console.log(`Pass2 done — ${n} files`)
