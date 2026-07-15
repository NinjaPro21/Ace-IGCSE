#!/usr/bin/env node
/** Targeted Ch.7 fixes — no prepareMathContent. Run: node scripts/repair-ch07-quizzes-targeted.mjs */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizDir = path.join(__dirname, '..', 'content', 'quizzes', 'add-maths-0606')

const PATCHES = {
  '7-1-the-equation-of-a-circle-medium.json': {
    '7-1-the-equation-of-a-circle-medium-q2': {
      explanation:
        'Radius is the distance from centre to a point on the circle: $r = \\sqrt{(7-4)^2 + (3-(-1))^2} = \\sqrt{9 + 16} = 5$.\n\n**Common mistake:** Mistakenly subtracting the coordinates incorrectly, such as $3 - 1 = 2$ instead of $3 - (-1) = 4$.',
    },
    '7-1-the-equation-of-a-circle-medium-q4': {
      question:
        'The equation of a circle is $(x + 4)^2 + (y - 1)^2 = k$. If the circle passes through $(0, 0)$, find the value of $k$.',
    },
    '7-1-the-equation-of-a-circle-medium-q5': {
      question:
        'Determine the value of $c$ if $x^2 + y^2 + 8x - 4y + c = 0$ represents a circle with radius 6.',
    },
  },
  '7-1-the-equation-of-a-circle-hard.json': {
    '7-1-the-equation-of-a-circle-hard-q1': {
      explanation:
        'The points form a right-angled triangle. The hypotenuse joining $(8, 0)$ and $(0, 6)$ is the diameter. Centre is the midpoint $(4, 3)$. Radius is half the distance $\\sqrt{8^2 + 6^2} = 10$, so $r = 5$.\n\n**Common mistake:** Assuming the centre is at the origin $(0,0)$ because one of the points is there.',
    },
    '7-1-the-equation-of-a-circle-hard-q2': {
      question:
        'Find the equation of the circle that touches the $x$-axis at $(4, 0)$ and also passes through the point $(0, 8)$.',
      explanation:
        'If it touches the $x$-axis at $(4, 0)$, the centre is $(4, r)$ and the radius is $r$. Then $(0-4)^2 + (8-r)^2 = r^2 \\Rightarrow 16 + 64 - 16r = 0 \\Rightarrow r = 5$.\n\n**Common mistake:** Setting the centre to $(4, 0)$ or assuming the radius is 4 based on the $x$-intercept.',
    },
    '7-1-the-equation-of-a-circle-hard-q4': {
      question:
        'Determine the set of values of $k$ for which $x^2 + y^2 - 4x + 6y + k = 0$ represents a real circle.',
    },
  },
  '7-1-the-equation-of-a-circle-pyp.json': {
    '7-1-the-equation-of-a-circle-pyp-q2': {
      options: [
        'LHS $= (7-3)^2 + (1+2)^2 = 4^2 + 3^2 = 25 =$ RHS',
        'LHS $= (7+3)^2 + (1-2)^2 = 100 + 1 \\neq 25$',
        'LHS $= 7^2 + 1^2 = 50 \\neq 25$',
        'LHS $= (7-3) + (1+2) = 7 \\neq 25$',
      ],
    },
    '7-1-the-equation-of-a-circle-pyp-q3': {
      explanation:
        'Centre is midpoint $\\left(\\frac{-1+5}{2}, \\frac{-2+6}{2}\\right) = (2, 2)$. Diameter length is $\\sqrt{6^2 + 8^2} = 10$, so $r = 5$. Equation: $(x-2)^2 + (y-2)^2 = 25$.\n\n**Common mistake:** Using the diameter length 10 as the radius $r$ in the equation formula.',
    },
    '7-1-the-equation-of-a-circle-pyp-q4': {
      question:
        'Find the values of $k$ for which the line $y = 2x + k$ is tangent to the circle $x^2 + y^2 = 5$.',
    },
    '7-1-the-equation-of-a-circle-pyp-q5': {
      explanation:
        'At the $x$-axis, $y = 0$. So $x^2 - 4x + 4 = 0 \\Rightarrow (x-2)^2 = 0 \\Rightarrow x = 2$. The only point is $(2, 0)$, where the circle is tangent to the axis.\n\n**Common mistake:** Applying the quadratic formula and making a calculation error that leads to two distinct roots.',
    },
  },
  '7-2-problems-involving-intersection-of-lines-and-circles-easy.json': {
    '7-2-problems-involving-intersection-of-lines-and-circles-easy-q1': {
      explanation:
        'Substitute $y = 4$ into the circle equation: $x^2 + 16 = 25 \\Rightarrow x^2 = 9$, so $x = \\pm 3$. The points are $(3, 4)$ and $(-3, 4)$.\n\n**Common mistake:** Swapping the $x$ and $y$ coordinates to get $(4, 3)$ and $(4, -3)$.',
    },
    '7-2-problems-involving-intersection-of-lines-and-circles-easy-q2': {
      explanation:
        'Since the radius is $3$, the vertical line $x = 5$ lies entirely outside the circle and does not intersect it.\n\n**Common mistake:** Solving $25 + y^2 = 9$, getting $y^2 = -16$, and incorrectly assuming there is still one intersection point.',
    },
    '7-2-problems-involving-intersection-of-lines-and-circles-easy-q3': {
      question:
        'The line $y = x$ intersects the circle $x^2 + y^2 = 2$ at two points. One point is $(1, 1)$. Find the other point.',
    },
    '7-2-problems-involving-intersection-of-lines-and-circles-easy-q4': {
      question:
        'Find the $y$-coordinates where the circle $(x - 2)^2 + (y - 3)^2 = 16$ intersects the $y$-axis.',
      explanation:
        'On the $y$-axis, $x = 0$. Substitute: $4 + (y-3)^2 = 16 \\Rightarrow (y-3)^2 = 12 \\Rightarrow y = 3 \\pm \\sqrt{12}$.\n\n**Common mistake:** Subtracting 4 from 16 to get 12 but then failing to take the square root properly or forgetting the $\\pm$ sign.',
    },
    '7-2-problems-involving-intersection-of-lines-and-circles-easy-q5': {
      question:
        'The line $y = k$ is tangent to the circle $x^2 + y^2 = 49$. Find the possible values of $k$.',
      explanation:
        'A horizontal tangent occurs at the top and bottom of the circle, where $y = \\pm r = \\pm 7$.\n\n**Common mistake:** Using the value of $r^2$ (49) instead of the radius $r$ (7).',
    },
  },
  '7-2-problems-involving-intersection-of-lines-and-circles-medium.json': {
    '7-2-problems-involving-intersection-of-lines-and-circles-medium-q1': {
      options: [
        '$\\left(\\frac{6}{5}, \\frac{17}{5}\\right)$ and $(-2, -3)$',
        '$(2, 5)$ and $(-2, -3)$',
        '$(1, 3)$ and $(3, 7)$',
        '$(1, 3)$ and $(-1, -1)$',
      ],
      explanation:
        '$x^2 + (2x+1)^2 = 13 \\Rightarrow 5x^2 + 4x - 12 = 0 \\Rightarrow (5x-6)(x+2)=0$, so $x = \\frac{6}{5}$ or $x = -2$. The points are $\\left(\\frac{6}{5}, \\frac{17}{5}\\right)$ and $(-2, -3)$.\n\n**Common mistake:** Errors in expanding $(2x+1)^2$, often forgetting the middle $4x$ term.',
    },
    '7-2-problems-involving-intersection-of-lines-and-circles-medium-q2': {
      question:
        'The line $x + y = 7$ intersects the circle $x^2 + y^2 = 25$ at points $A$ and $B$. Find the midpoint of $AB$.',
      explanation:
        'Substitute $y = 7 - x$: $x^2 + (7-x)^2 = 25 \\Rightarrow 2x^2 - 14x + 24 = 0 \\Rightarrow x = 3, 4$. The points are $(3, 4)$ and $(4, 3)$, so the midpoint is $(3.5, 3.5)$.\n\n**Common mistake:** Using one intersection point only instead of finding both before averaging.',
    },
    '7-2-problems-involving-intersection-of-lines-and-circles-medium-q4': {
      question:
        'Find the values of $c$ for which the line $y = 3x + c$ is tangent to the circle $x^2 + y^2 = 10$.',
    },
    '7-2-problems-involving-intersection-of-lines-and-circles-medium-q5': {
      explanation:
        '$x^2 + (2x)^2 = 20 \\Rightarrow 5x^2 = 20 \\Rightarrow x = \\pm 2$. The points are $(2, 4)$ and $(-2, -4)$. Distance $= \\sqrt{4^2 + 8^2} = \\sqrt{80} = 4\\sqrt{5}$.\n\n**Common mistake:** Using the difference in $x$-coordinates only instead of the full distance formula.',
    },
  },
  '7-2-problems-involving-intersection-of-lines-and-circles-hard.json': {
    '7-2-problems-involving-intersection-of-lines-and-circles-hard-q2': {
      question:
        'Find the point where the line $x + 2y = 10$ touches the circle $(x - 1)^2 + (y - 2)^2 = 5$.',
      options: ['$(2, 4)$', '$(4, 3)$', '$(0, 5)$', '$(3, 3.5)$'],
      correctIndex: 0,
      explanation:
        'Substitute $x = 10 - 2y$ to get $5y^2 - 40y + 80 = 0 \\Rightarrow (y-4)^2 = 0$, so the line is tangent at $(2, 4)$.\n\n**Common mistake:** Incorrectly expanding $(9-2y)^2$ as $81 - 4y^2$ or failing to group the $y$ terms.',
    },
    '7-2-problems-involving-intersection-of-lines-and-circles-hard-q4': {
      question:
        'Find the set of values of $k$ for which the line $y = kx$ intersects the circle $(x - 10)^2 + y^2 = 36$ in two distinct points.',
      explanation:
        'Substitute $y = kx$: $(x-10)^2 + k^2x^2 = 36 \\Rightarrow x^2(1+k^2) - 20x + 64 = 0$. For two intersections, $\\Delta > 0 \\Rightarrow 400 - 256(1+k^2) > 0 \\Rightarrow k^2 < \\frac{9}{16}$, so $-\\frac{3}{4} < k < \\frac{3}{4}$.\n\n**Common mistake:** Reversing the inequality for two intersections and no intersection.',
    },
    '7-2-problems-involving-intersection-of-lines-and-circles-hard-q5': {
      correctIndex: 1,
      explanation:
        'Substituting $y = x + 2$ gives $2x^2 - 2x - 20 = 0 \\Rightarrow x^2 - x - 10 = 0$. The chord length is $\\sqrt{2}(x_2-x_1) = \\sqrt{2 \\cdot 41} = \\sqrt{82}$ units.\n\n**Common mistake:** Calculating the coordinates numerically and rounding too early, leading to an imprecise chord length.',
    },
  },
  '7-2-problems-involving-intersection-of-lines-and-circles-pyp.json': {
    '7-2-problems-involving-intersection-of-lines-and-circles-pyp-q3': {
      question:
        'Find the set of values of $k$ for which the line $y = x + k$ intersects the circle $x^2 + y^2 = 18$ in two distinct points.',
    },
    '7-2-problems-involving-intersection-of-lines-and-circles-pyp-q4': {
      correctIndex: 3,
      explanation:
        '$x^2 + (4-x)^2 = 10 \\Rightarrow x^2 - 4x + 3 = 0 \\Rightarrow x = 1, 3$. The points are $(1, 3)$ and $(3, 1)$, so the chord length is $\\sqrt{2^2 + (-2)^2} = \\sqrt{8}$ units.\n\n**Common mistake:** Incorrectly solving $x^2 - 4x + 3 = 0$ as $x = 1, 4$.',
    },
  },
}

let files = 0
for (const [fileName, questions] of Object.entries(PATCHES)) {
  const filePath = path.join(quizDir, fileName)
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  let changed = false
  for (const q of data.questions) {
    const patch = questions[q.id]
    if (!patch) continue
    for (const [key, val] of Object.entries(patch)) {
      if (JSON.stringify(q[key]) !== JSON.stringify(val)) {
        q[key] = val
        changed = true
      }
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
    files++
    console.log('updated', fileName)
  }
}
console.log(`Done — ${files} file(s)`)
