#!/usr/bin/env node
/**
 * Repair canonical Maths 0580 Ch.3 quiz JSON (live site content only).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prepareMathContent } from '../src/lib/mathMarkdown.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizRoot = path.join(__dirname, '../content/quizzes/maths-0580')
const chapter = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../content/chapters/maths-0580/ch03-coordinate-geometry-graphs.json'),
    'utf8',
  ),
)
const topicIds = new Set(chapter.topicIds)

const CONTENT_FIXES = {
  '3-2-map-scales-easy-q2': {
    question:
      'The actual distance between two towns is $12\\text{ km}$. On a map, this distance is represented by a line of length $4\\text{ cm}$. Find the scale of the map in the form $1 : n$.',
  },
  '3-2-map-scales-easy-q5': {
    question:
      'A map has a scale of $1\\text{ cm}$ to $2\\text{ km}$. Write this scale as a ratio in the form $1 : n$.',
  },
  '3-2-map-scales-hard-q1': {
    question:
      'A map has a scale of $1 : n$. A rectangular field measuring $150\\text{ m}$ by $100\\text{ m}$ has an area of $6\\text{ cm}^2$ on the map. Find the value of $n$.',
  },
  '3-2-map-scales-medium-q3': {
    question:
      'A forest has an actual area of $12\\text{ km}^2$. On a map, its area is represented by $48\\text{ cm}^2$. Find the linear scale of the map in the form $1 : n$.',
  },
  '3-2-map-scales-pyp-q5': {
    question:
      'The distance between two points on a map is $6.5\\text{ cm}$. The actual distance is $1.3\\text{ km}$. Find the scale of the map in the form $1 : n$.',
  },
  '9-1-linear-graphs-hard-q3': {
    question:
      "A car's value $v$ (in dollars) is modelled by $v = 4500 - 0.05n$, where $n$ is the distance travelled in km. Find $n$ when $v = 3200$.",
  },
  '9-3-equations-of-straight-lines-hard-q2': {
    correctIndex: 3,
    explanation:
      'The line $y = x + 2$ has gradient $1$, so the perpendicular through $(4, 8)$ is $y = -x + 12$. Solving $x + 2 = -x + 12$ gives $(5, 7)$. The distance is $\\sqrt{(5-4)^2 + (7-8)^2} = \\sqrt{2}$ units.\n\n**Common mistake:** The student might substitute the point into the line equation directly without finding the perpendicular intersection point, or forget to take the square root in Pythagoras\' theorem.',
  },
  '3-2-map-scales-hard-q4': {
    question:
      'A physical region with an area of $180\\text{ km}^2$ is represented on a map by a sector of a circle with radius $12\\text{ cm}$ and sector angle $40^\\circ$. Taking $\\pi = \\frac{22}{7}$, find the scale of the map in the form $1 : n$.',
    explanation:
      'Map sector area $= \\frac{40}{360} \\times \\frac{22}{7} \\times 12^2 = \\frac{352}{7}\\text{ cm}^2$. Compare the area ratio with the actual area to find the linear scale: if $1\\text{ cm}$ represents $3\\text{ km}$, then $1\\text{ cm}^2$ represents $9\\text{ km}^2$, so the map area is $180 \\div 9 = 20\\text{ cm}^2$. This gives $n = 300\\,000$.\n\n**Common mistake:** Students use the linear scale factor instead of its square when converting between map area and actual area.',
  },
  '9-6-graphical-solutions-pyp-q4': {
    explanation:
      'For a $\\cup$-shaped quadratic, a horizontal line above the minimum intersects the curve twice; a line through the minimum is tangent (one solution); a line below the minimum has no solutions.\n\n**Common mistake:** The student might think the turning point (where there is only one solution) is the answer for exactly two solutions.',
  },
  '9-4-plotting-curves-easy-q2': {
    question: 'Identify the $y$-intercept of the curve $y = x^3 + 5x^2 - 2x - 7$.',
  },
  '9-4-plotting-curves-easy-q4': {
    question:
      'For the reciprocal function $y = \\frac{8}{x}$, what happens to $y$ as $x$ becomes a very large positive number?',
    explanation:
      'In $y = \\frac{k}{x}$, as $x \\to \\infty$, $y \\to 0$.\n\n**Common mistake:** Students may think $y$ approaches $k$ instead of $0$.',
  },
  '9-4-plotting-curves-easy-q5': {
    explanation:
      'Exponential decay occurs in functions of the form $y = ab^x$ where $0 < b < 1$.\n\n**Common mistake:** Students may confuse the roles of the initial value $a$ and the base $b$.',
  },
  '9-4-plotting-curves-hard-q4': {
    explanation:
      'For $y = \\frac{k}{x}$, as $x \\to 0^+$, $|y| \\to \\infty$.\n\n**Common mistake:** Students may think $y$ approaches $k$ rather than becoming very large.',
  },
  '9-5-interpreting-graphs-easy-q1': {
    question:
      'A conversion graph passes through $(0, 0)$ and $(50, 11)$, where the horizontal axis is Litres ($L$) and the vertical axis is Gallons ($G$). Use the graph to estimate the number of gallons equivalent to $25$ Litres.',
  },
  '9-5-interpreting-graphs-easy-q4': {
    question:
      'A bike rental shop charges a fixed fee of $\\$15$ plus $\\$5$ per hour. If a graph is drawn with cost $C$ on the vertical axis and time $h$ hours on the horizontal axis, what is the $y$-intercept?',
  },
  '9-5-interpreting-graphs-medium-q1': {
    question:
      'A car travels $30$ km at a constant speed of $60$ km/h and then remains stationary for $15$ minutes. Calculate the total time elapsed from the start of the journey, in minutes.',
  },
  '9-5-interpreting-graphs-medium-q3': {
    question:
      'A plumber charges a call-out fee plus an hourly rate. The graph of total charge $C$ against time $t$ hours passes through $(1, 80)$ and $(4, 200)$. Find the formula for $C$ in terms of $t$.',
    explanation:
      'The gradient is $\\frac{200-80}{4-1} = 40$. Using $C = 40t + c$ and $(1,80)$ gives $c = 40$, so $C = 40t + 40$.\n\n**Common mistake:** Students may use only one point and forget the fixed call-out fee.',
  },
  '9-5-interpreting-graphs-medium-q4': {
    question:
      'A travel graph shows a bus journey. The bus is stationary from $10{:}15$ to $10{:}35$. On the time axis, $1$ cm represents $10$ minutes. What is the length of the horizontal line representing this stop?',
  },
  '9-5-interpreting-graphs-medium-q5': {
    question:
      'Runner A starts at $0$ m when $t = 0$ and runs at $4$ m/s. Runner B starts at $30$ m when $t = 0$ and runs at $2$ m/s in the same direction. After how many seconds does Runner A overtake Runner B?',
  },
  '9-5-interpreting-graphs-hard-q1': {
    question:
      'A speed–time graph shows a car accelerating uniformly from $0$ to $V$ m/s in $10$ seconds, then travelling at constant speed $V$ m/s for $20$ seconds. If the total distance is $400$ m, find $V$.',
    explanation:
      'Distance $= \\frac{1}{2}(10)V + 20V = 25V$. So $400 = 25V$ and $V = 16$ m/s.\n\n**Common mistake:** Students forget the triangular area during acceleration and use only $20V$.',
  },
  '9-5-interpreting-graphs-hard-q3': {
    question:
      'A car starts with $40$ Litres of fuel. It travels $120$ km at $8$ km/L, refuels $25$ Litres, then travels another $180$ km at $12$ km/L. How much fuel remains at the end?',
  },
  '9-5-interpreting-graphs-hard-q4': {
    question:
      'A motorboat travels downstream at $24$ km/h and upstream at $16$ km/h. It has fuel for $5$ hours of travel. Find the maximum downstream distance it can travel before turning back and returning to the start within the fuel limit.',
  },
  '9-5-interpreting-graphs-hard-q5': {
    question:
      'The profit $P$ (in thousands of dollars) is modelled by $P = -x^2 + 6x - 5$, where $x$ is in hundreds of units sold. Use the graph to find the range of $x$ for which the profit is at least 3000 dollars.',
    explanation:
      'Set $P \\ge 3$: $-x^2 + 6x - 5 \\ge 3 \\Rightarrow -x^2 + 6x - 8 \\ge 0 \\Rightarrow x^2 - 6x + 8 \\le 0$. Factorising $(x-2)(x-4) \\le 0$ gives the interval $2 \\le x \\le 4$.\n\n**Common mistake:** The student might find the roots of the original equation ($1$ and $5$) where the profit is zero, rather than the range for at least 3000 dollars profit.',
  },
  '9-5-interpreting-graphs-pyp-q2': {
    question:
      'The diagram shows a speed–time graph of a bus. The bus accelerates from rest at $0.8$ m/s$^2$. How long does it take to reach a speed of $12$ m/s?',
  },
  '9-5-interpreting-graphs-pyp-q3': {
    question:
      'A distance–time graph is a straight line through the origin with gradient $15$. What does the gradient represent?',
  },
  '9-7-differentiation-easy-q5': {
    question: 'Differentiate $y = \\frac{1}{3}x^3 + 5x$ with respect to $x$.',
  },
  '9-7-differentiation-medium-q3': {
    question:
      'Find the $x$-coordinates of the turning points of $y = x^3 - 3x^2 - 24x + 10$.',
    options: ['$4$ and $-2$', '$2$ and $-4$', '$5$ and $-1$', '$15$ and $0$'],
  },
  '9-7-differentiation-medium-q4': {
    question: 'Find the second derivative $\\frac{d^2y}{dx^2}$ of $y = x^4 - 5x^2 + 2x$.',
  },
  '9-7-differentiation-medium-q5': {
    question: 'The gradient of $y = kx^2 - 4x$ at $x = 3$ is $1$. Find $k$.',
  },
  '9-7-differentiation-hard-q1': {
    explanation:
      '$\\frac{dy}{dx} = 2x - 6 = 0$ gives $x = 3$. Then $y = 9 - 18 + 5 = -4$. The minimum point is $(3, -4)$.\n\n**Common mistake:** Students substitute $x = 3$ into the derivative instead of the original equation.',
  },
  '9-7-differentiation-hard-q3': {
    question:
      'The curve $y = ax^2 + bx + 2$ passes through $(1, 6)$ and has gradient $7$ at that point. Find $a$ and $b$.',
  },
  '9-7-differentiation-hard-q4': {
    question:
      'For what values of $x$ is $y = x^3 - 3x^2 - 24x + 10$ negative?',
  },
  '9-7-differentiation-pyp-q1': {
    options: ['$2$ and $-1$', '$-2$ and $1$', '$0$ and $2$', '$3$ and $-2$'],
  },
  '9-7-differentiation-pyp-q5': {
    question:
      'Find the $x$-coordinates of the turning points of $y = x^3 - 6x^2 - 7x$, correct to 2 decimal places.',
    options: ['$-0.52$ and $4.52$', '$0.52$ and $-4.52$', '$-1$ and $7$', '$-0.48$ and $4.48$'],
  },
  '9-2-coordinate-geometry-pyp-q1': {
    explanation:
      'Length $= \\sqrt{(5-(-3))^2 + (4-(-2))^2} = \\sqrt{8^2 + 6^2} = \\sqrt{100} = 10$.\n\n**Common mistake:** A student might subtract the coordinates incorrectly (e.g., $5-3=2$) due to a sign error.',
  },
  '9-2-coordinate-geometry-pyp-q5': {
    explanation:
      '$m_1 = \\frac{5-1}{3-1} = 2$ and $m_2 = \\frac{2-4}{4-0} = -0.5$. Product $m_1 \\times m_2 = 2 \\times (-0.5) = -1$, so the lines are perpendicular.\n\n**Common mistake:** The student might think the product should be $1$ or fail to calculate one of the gradients correctly.',
  },
  '9-2-coordinate-geometry-easy-q3': {
    explanation:
      'Using the distance formula $\\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$, we get $\\sqrt{(13-5)^2 + (7-1)^2} = \\sqrt{8^2 + 6^2} = \\sqrt{100} = 10$.\n\n**Common mistake:** The student might add the coordinates directly or forget to take the square root at the end.',
  },
}

function repairQuizStringPre(text) {
  if (!text) return text
  let t = text
  t = t.replace(/\$\$\s*\n([\s\S]*?)(?:\n(?!\$)|$)/g, (_, inner) => {
    const trimmed = inner.trim()
    return trimmed ? `$${trimmed}$` : ''
  })
  if (((t.match(/(?<!\\)\$/g) ?? []).length % 2) !== 0) {
    t = t.replace(/(\$[^$\n]+)\.(?="|'|\s*$)/g, '$1$.')
  }
  return t
}

function repairString(val) {
  if (typeof val !== 'string') return val
  return prepareMathContent(repairQuizStringPre(val), 'quiz')
}

function repairQuestion(q) {
  const fix = CONTENT_FIXES[q.id]
  const next = { ...q }
  if (fix?.question) next.question = fix.question
  if (fix?.explanation) next.explanation = fix.explanation
  if (fix?.options) next.options = fix.options
  if (fix?.correctIndex !== undefined) next.correctIndex = fix.correctIndex
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

console.log(`Repaired ${files} Maths 0580 Ch.3 quiz files (${questions} questions).`)
