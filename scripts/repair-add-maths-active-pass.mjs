#!/usr/bin/env node
/**
 * Final manual overrides for remaining active Add Maths quiz issues.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizDir = path.join(__dirname, '..', 'content', 'quizzes', 'add-maths-0606')

const chapterDir = path.join(__dirname, '..', 'content', 'chapters', 'add-maths-0606')
const activeTopics = new Set()
for (const f of fs.readdirSync(chapterDir)) {
  if (!f.endsWith('.json')) continue
  const ch = JSON.parse(fs.readFileSync(path.join(chapterDir, f), 'utf8'))
  for (const t of ch.topicIds ?? []) activeTopics.add(t)
}

const OVERRIDES = {
  '11-1-pascal-s-triangle-hard-q1': {
    explanation:
      'Row 4 coefficients: $1, 4, 6, 4, 1$. The $x^2$ term is $6 \\cdot 1^2 \\cdot (2x)^2 = 24x^2$.\n\n**Common mistake:** Using only the coefficient $6$ and forgetting to square the $2$ from $(2x)$.',
  },
  '11-1-pascal-s-triangle-hard-q3': {
    explanation:
      'Row 5: $1, 5, 10, 10, 5, 1$. The $x^3$ term is $10 \\cdot 2^2 \\cdot (-x)^3 = -40x^3$.\n\n**Common mistake:** Forgetting the negative sign from $(-x)$ or using the wrong power of $2$.',
  },
  '11-1-pascal-s-triangle-pyp-q1': {
    explanation:
      'Row 4: $1, 4, 6, 4, 1$. The $x^2$ term is $6 \\cdot 1^2 \\cdot (-3x)^2 = 54x^2$.\n\n**Common mistake:** Squaring $-3$ incorrectly or forgetting the Pascal coefficient $6$.',
  },
  '11-1-pascal-s-triangle-pyp-q2': {
    explanation:
      'Row 4: $1, 4, 6, 4, 1$. The constant term is $6 \\cdot x^2 \\cdot (2/x)^2 = 24$.\n\n**Common mistake:** Taking the last term only instead of the term where powers of $x$ cancel.',
  },
  '11-4-11-5-geometric-progressions-gp-and-infinite-series-h-pyp-q4': {
    question:
      'Show that the $n$th term of the GP $8, 4, 2, \\ldots$ can be written as $2^{k-n}$. Find $k$.',
  },

  // ── Ch.2 ───────────────────────────────────────────────────────
  '2-6-intersection-of-a-line-and-a-curve-harder-topic-hard-q2': {
    question:
      'Find the set of values of $m$ for which the line $y = mx + 2$ intersects the curve $y = x^2 + 4x + 6$ at two distinct points.',
  },

  // ── Ch.3 ───────────────────────────────────────────────────────
  '3-1-adding-subtracting-and-multiplying-polynomials-hard-q5': {
    question:
      'If $(ax + b)^2 = 9x^2 - 30x + 25$, find the values of $a$ and $b$ given that $a > 0$.',
  },
  '3-1-adding-subtracting-and-multiplying-polynomials-pyp-q4': {
    question:
      'Find the values of the constants $A$, $B$ and $C$ such that $x^3 - 7x + 6 = (x - 1)(Ax^2 + Bx + C)$.',
    explanation:
      'Comparing coefficients: $A = 1$; $-C = 6 \\implies C = -6$; the $x^2$ coefficient gives $B - A = 0 \\implies B = 1$.\n\n**Common mistake:** Neglecting the $-Ax^2$ term from the expansion when matching the $x^2$ coefficient.',
  },
  '3-3-the-factor-theorem-harder-topic-medium-q3': {
    explanation:
      '$P(1) = 0 \\implies 1 + m - 4 = 0 \\implies m = 3$. Then $P(2) = 8 + 12 - 4 = 16$.\n\n**Common mistake:** Substituting $x = 2$ before finding the value of $m$.',
  },
  '3-4-cubic-expressions-and-equations-harder-topic-pyp-q1': {
    question:
      'The polynomial $f(x) = x^3 + ax^2 + bx + 12$ has factors $(x - 1)$ and $(x + 2)$. Find the values of $a$ and $b$ and solve $f(x) = 0$.',
    explanation:
      '$f(1) = 1 + a + b + 12 = 0$ and $f(-2) = -8 + 4a - 2b + 12 = 0$. Solving gives $a = -5$, $b = -8$. The third factor is $(x - 6)$, so the roots are $1$, $-2$ and $6$.\n\n**Common mistake:** Sign errors when forming the simultaneous equations from $f(-2) = 0$.',
  },
  '3-4-cubic-expressions-and-equations-harder-topic-pyp-q3': {
    question:
      'Find the values of $p$ and $q$ if $(x - 2)$ and $(x + 1)$ are both linear factors of $x^3 + px^2 + qx - 8$.',
    explanation:
      '$P(2) = 0 \\implies q = -2p$. $P(-1) = 0 \\implies p - q = 9$. Solving gives $p = 3$ and $q = -6$.\n\n**Common mistake:** Sign errors when substituting $x = -1$.',
  },

  // ── Ch.5 ───────────────────────────────────────────────────────
  '5-1-introduction-to-logarithms-easy-q4': {
    options: ['$0$', '$1$', '$a$', 'Undefined'],
    explanation:
      'By the laws of indices, $a^0 = 1$ for any $a \\neq 0$. Therefore $\\log_a 1 = 0$.\n\n**Common mistake:** Confusing this with $\\log_a a = 1$.',
  },
  '5-1-introduction-to-logarithms-hard-q2': {
    explanation:
      '$a^{1.5} = 125 \\implies a^{3/2} = 125$. Square both sides: $a^3 = 125^2 = 15625$, so $a = 25$.\n\n**Common mistake:** Mishandling fractional exponents and getting $a = 5$ or $a = 625$.',
  },
  '5-1-introduction-to-logarithms-pyp-q5': {
    options: ['$0 < x < 1$', '$x < 0$', '$x < 1$', '$x > 1$'],
  },
  '5-3-change-of-base-of-logarithms-medium-q2': {
    question: 'If $\\log_x 2 = a$, express $\\log_2 x$ in terms of $a$.',
    options: ['$\\frac{1}{a}$', '$-a$', '$a^2$', '$\\sqrt{a}$'],
  },
  '5-4-exponential-equations-harder-topic-easy-q4': {
    explanation:
      'Since $\\ln x = 5$, we have $x = e^5$.\n\n**Common mistake:** Confusing the base and exponent, or treating $\\ln$ as base 10.',
  },
  '5-4-exponential-equations-harder-topic-hard-q1': {
    question:
      'Find the exact values of $x$ for which $(\\log_2 x)^2 - \\log_2(x^3) - 4 = 0$.',
    explanation:
      'Let $u = \\log_2 x$. Then $u^2 - 3u - 4 = 0 \\implies (u-4)(u+1) = 0$. So $\\log_2 x = 4 \\implies x = 16$, or $\\log_2 x = -1 \\implies x = \\frac{1}{2}$.\n\n**Common mistake:** Forgetting to convert back from $u$ to $x$ using base 2.',
  },
  '5-6-natural-logarithms-and-exponential-functions-hard-q4': {
    options: [
      '$\\frac{1}{3} < x < \\frac{e^4 + 1}{3}$',
      '$x < \\frac{e^4 + 1}{3}$',
      '$x > \\frac{1}{3}$',
      '$\\frac{e^4 - 1}{3} < x < e^4$',
    ],
  },
  '5-6-natural-logarithms-and-exponential-functions-hard-q5': {
    options: ['$f(x) < 5$', '$f(x) \\leq 5$', '$f(x) > 0$', '$f(x) \\in \\mathbb{R}$'],
    explanation:
      'Since $e^{2x} > 0$, we have $-e^{2x} < 0$, so $f(x) = 5 - e^{2x} < 5$.\n\n**Common mistake:** Including $5$ in the range even though $e^{2x}$ can never be zero.',
  },
  '5-6-natural-logarithms-and-exponential-functions-pyp-q1': {
    options: ['$\\ln 3$', '$3$', '$e^3$', '$\\log 3$'],
  },
  '5-6-natural-logarithms-and-exponential-functions-pyp-q3': {
    question: 'Find the set of values of $x$ such that $e^{2x+1} \\geq 10$.',
    options: [
      '$x \\geq \\frac{\\ln 10 - 1}{2}$',
      '$x \\geq \\ln 5 - 1$',
      '$x \\leq \\frac{\\ln 10 + 1}{2}$',
      '$x \\geq \\frac{e^{10} - 1}{2}$',
    ],
  },
  '5-7-converting-non-linear-laws-to-linear-form-hard-q1': {
    question:
      'The variables $x$ and $y$ are related by $y = p q^{x^2}$. A straight line is obtained by plotting $\\ln y$ against $x^2$. If the line passes through $(1, 4)$ and $(3, 10)$, find the value of $q$.',
    options: ['$e^3$', '$3$', '$e^4$', '$e^{10}$'],
    explanation:
      '$\\ln y = x^2 \\ln q + \\ln p$. So $m = \\ln q = \\frac{10-4}{3-1} = 3$. Therefore $q = e^3$.\n\n**Common mistake:** Plotting $\\ln y$ against $x$ instead of $x^2$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-medium-q1': {
    options: ['$100$', '$2$', '$10$', '$e^2$'],
  },
  '5-7-converting-non-linear-laws-to-linear-form-medium-q7': {
    options: ['$e^2$', '$2$', '$e^8$', '$4$'],
  },
  '5-7-converting-non-linear-laws-to-linear-form-pyp-q7': {
    question:
      'Variables $x$ and $y$ are related by $y^2 = 3x + 1$. A graph of $y^2$ against $x$ passes through $(3, 10)$ and $(7, 22)$. Find $y$ when $x = 2$.',
    options: ['$\\sqrt{7}$', '$7$', '$1$', '$4$'],
  },

  // ── Ch.5 (continued) ───────────────────────────────────────────
  '5-6-natural-logarithms-and-exponential-functions-easy-q2': {
    options: ['$x = \\ln 12$', '$x = \\log 12$', '$12 = \\ln x$', '$x = e^{12}$'],
    explanation:
      '$e^x = 12 \\implies x = \\ln 12$.\n\n**Common mistake:** Using $\\log$ instead of $\\ln$ for a natural exponential equation.',
  },
  '5-6-natural-logarithms-and-exponential-functions-medium-q5': {
    options: ['$x = \\ln 5$', '$x = \\ln 25$', '$x = 5$', '$x = \\frac{\\ln 25}{2}$'],
    explanation:
      'Taking $\\ln$ of both sides: $2x = \\ln 25$. So $x = \\frac{\\ln 25}{2} = \\ln 5$.\n\n**Common mistake:** Forgetting that $\\ln 25 = 2\\ln 5$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-medium-q5': {
    question:
      'The law $xy = ax + b$ can be written as $y = a + \\frac{b}{x}$. Identify the gradient and vertical intercept when $y$ is plotted against $\\frac{1}{x}$.',
    options: [
      'Gradient = $a$, Intercept = $b$',
      'Gradient = $b$, Intercept = $a$',
      'Gradient = $1$, Intercept = $a$',
      'Gradient = $b$, Intercept = $0$',
    ],
    correctIndex: 0,
    explanation:
      'Dividing $xy = ax + b$ by $x$ gives $y = a + \\frac{b}{x}$. So the gradient is $a$ and the intercept is $b$.\n\n**Common mistake:** Swapping the roles of $a$ and $b$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-medium-q7': {
    question:
      'Variables $x$ and $y$ are related by $y = ab^x$. A graph of $\\ln y$ against $x$ is a straight line through $(0, 2)$ and $(4, 10)$. Find the value of $b$.',
    options: ['$e^2$', '$2$', '$e^8$', '$4$'],
  },
  '5-7-converting-non-linear-laws-to-linear-form-pyp-q4': {
    question:
      'A graph of $x^2 y$ against $x^3$ is a straight line with gradient $4$ passing through $(0, -5)$. Find the relationship between $x$ and $y$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-pyp-q10': {
    question:
      'The variables $x$ and $y$ satisfy $y = ax + \\frac{b}{x}$. If a graph of $xy$ against $x^2$ is a straight line through the origin, what is the value of $b$?',
    options: ['$0$', '$1$', 'any value', 'the gradient'],
    correctIndex: 0,
    explanation:
      '$xy = ax^2 + b$. If the graph of $xy$ against $x^2$ passes through the origin, the intercept is $0$, so $b = 0$.\n\n**Common mistake:** Confusing the intercept with the gradient.',
  },

  // ── Ch.9 ───────────────────────────────────────────────────────
  '9-1-basic-trigonometry-0-medium-q3': {
    options: ['$\\frac{12}{5}$', '$\\frac{12}{13}$', '$\\frac{5}{12}$', '$\\frac{13}{5}$'],
    explanation:
      'Adjacent side $= 5$, hypotenuse $= 13$, so opposite side $= 12$. Hence $\\tan \\theta = \\frac{12}{5}$.\n\n**Common mistake:** Using $\\frac{5}{12}$ by swapping opposite and adjacent.',
  },
  '9-1-basic-trigonometry-0-pyp-q3': {
    explanation:
      'Opposite $= 3$, hypotenuse $= 5$, so adjacent $= 4$. Then $\\cos \\theta = \\frac{4}{5}$ and $\\tan \\theta = \\frac{3}{4}$. Value $= 5\\left(\\frac{4}{5}\\right) + 4\\left(\\frac{3}{4}\\right) = 7$.\n\n**Common mistake:** Misidentifying the adjacent side length.',
  },
  '9-2-9-3-general-angles-and-the-cast-diagram-harder-topic-hard-q3': {
    explanation:
      '$|3\\cos 2x| = 2 \\implies |\\cos 2x| = \\frac{2}{3}$. For $0 \\le 2x \\le 2\\pi$, each of $\\cos 2x = \\frac{2}{3}$ and $\\cos 2x = -\\frac{2}{3}$ has two solutions, giving $4$ solutions in total.\n\n**Common mistake:** Ignoring the modulus and solving only $\\cos 2x = \\frac{2}{3}$.',
  },
  '9-6-9-9-reciprocals-identities-and-equations-harder-topi-pyp-q3': {
    question:
      'Find the coordinates of the points of intersection of $y = \\csc x$ and $y = 2$ for $0 \\le x \\le \\pi$.',
    explanation:
      '$\\csc x = 2 \\implies \\sin x = \\frac{1}{2}$. In $0 \\le x \\le \\pi$, $x = \\frac{\\pi}{6}$ or $x = \\frac{5\\pi}{6}$.\n\n**Common mistake:** Including a solution outside the interval $0 \\le x \\le \\pi$.',
  },

  // ── Ch.10 ──────────────────────────────────────────────────────
  '10-2-arrangements-medium-q5': {
    explanation:
      'There are two patterns: BGBGBGBG or GBGBGBGB. For each, there are $4!$ ways to arrange boys and $4!$ ways to arrange girls. Total $= 2 \\times 4! \\times 4! = 1152$.\n\n**Common mistake:** Only counting one starting pattern.',
  },

  // ── Ch.12 ──────────────────────────────────────────────────────
  '12-6-small-increments-and-approximations-hard-q4': {
    question:
      'The variables $x$ and $y$ are related by $y = \\frac{10}{x+1}$. When $x = 4$, $x$ increases by $p$%. Find the approximate percentage change in $y$.',
    explanation:
      '$\\frac{dy}{dx} = -\\frac{10}{(x+1)^2}$. At $x = 4$, $\\frac{dy}{dx} = -0.4$. $\\delta x = \\frac{p}{100}(4) = 0.04p$, so $\\delta y \\approx -0.016p$. Since $y(4) = 2$, the percentage change is $-0.8p$ %.\n\n**Common mistake:** Forgetting that $\\delta x$ is a percentage of the original $x$.',
  },
  '12-7-rates-of-change-harder-topic-hard-q2': {
    question:
      'A ladder $5$ m long leans against a vertical wall. The base is pulled away from the wall at $2$ m/s. Find the rate at which the top slides down when the base is $3$ m from the wall.',
    explanation:
      '$x^2 + y^2 = 25$. Differentiating with respect to $t$: $2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$. When $x = 3$, $y = 4$, so $12 + 8\\frac{dy}{dt} = 0$ and $\\frac{dy}{dt} = -1.5$ m/s.\n\n**Common mistake:** Using $\\frac{dy}{dt} = -\\frac{dx}{dt}$ without the $x/y$ ratio from implicit differentiation.',
  },
  '12-7-rates-of-change-harder-topic-pyp-q3': {
    question:
      'Show that $\\frac{dA}{dt} = \\frac{\\sqrt{3}}{2}s\\frac{ds}{dt}$ for an equilateral triangle with side $s$. Hence find the rate of increase of the area when $s = 10$ cm and $\\frac{ds}{dt} = 4$ cm/s.',
    options: [
      '$20\\sqrt{3}$ cm$^2$/s',
      '$40\\sqrt{3}$ cm$^2$/s',
      '$10\\sqrt{3}$ cm$^2$/s',
      '$80\\sqrt{3}$ cm$^2$/s',
    ],
    explanation:
      '$A = \\frac{\\sqrt{3}}{4}s^2 \\implies \\frac{dA}{ds} = \\frac{\\sqrt{3}}{2}s$. So $\\frac{dA}{dt} = \\frac{\\sqrt{3}}{2}(10)(4) = 20\\sqrt{3}$ cm$^2$/s.\n\n**Common mistake:** Forgetting the factor $\\frac{1}{2}$ when differentiating $s^2$.',
  },
  '12-9-stationary-points-harder-topic-hard-q1': {
    explanation:
      '$\\frac{dy}{dx} = 1 + \\ln x$. Setting this to zero gives $x = e^{-1}$ and $y = -\\frac{1}{e}$. Since $\\frac{d^2y}{dx^2} = \\frac{1}{x} > 0$ at $x = \\frac{1}{e}$, the point is a minimum.\n\n**Common mistake:** Differentiating $x\\ln x$ as just $\\ln x$.',
  },

  // ── Class J: unclosed $var$ swallows prose into math mode ───────
  '1-1-mappings-hard-q3': {
    explanation:
      'As $x \\to \\infty$, $y \\to 2$. Since $x+3>0$ for $x>-3$ and $2x-1<2x+6$, the value of $y$ is always less than $2$.\n\n**Common mistake:** Students may incorrectly identify the vertical asymptote ($x=-3$) as a restriction on the range rather than the domain.',
  },
  '1-5-graphs-of-y-f-x-where-f-x-is-linear-harder-topic-hard-q2': {
    question:
      'The graph $y=|ax+b|$ has a vertex at $(4,0)$ and passes through the point $(0,8)$. Find the values of $a$ and $b$ where $a > 0$.',
  },
  '3-1-adding-subtracting-and-multiplying-polynomials-hard-q2': {
    question:
      'Find the values of $p$ and $q$ if $(x - 1)(x^2 + px + q) = x^3 - 6x^2 + 11x - 6$.',
  },
  '5-6-natural-logarithms-and-exponential-functions-medium-q4': {
    question:
      'Given that $\\ln a = p$ and $\\ln b = q$, express $\\ln\\left(\\frac{\\sqrt{a}}{b^3}\\right)$ in terms of $p$ and $q$.',
  },
  '6-5-finding-relationships-from-data-hard-q3': {
    explanation:
      'Gradient $m = q = -2$. Intercept $c = \\ln p = 4$, so $p = e^4$.\n\n**Common mistake:** Incorrectly relating the plot constants to $p$ and $q$ in the non-linear law.',
  },
  '7-2-problems-involving-intersection-of-lines-and-circles-medium-q2': {
    question:
      'The line $x + y = 7$ intersects the circle $x^2 + y^2 = 25$ at points $A$ and $B$. Find the midpoint of $AB$.',
  },
  '12-7-rates-of-change-harder-topic-easy-q2': {
    question:
      'The radius of a circle is increasing at a constant rate of $2$ cm/s. Find the rate of increase of the area when the radius is $10$ cm.',
    options: [
      '$40\\pi$ cm$^2$/s',
      '$20\\pi$ cm$^2$/s',
      '$100\\pi$ cm$^2$/s',
      '$4\\pi$ cm$^2$/s',
    ],
  },
  '12-7-rates-of-change-harder-topic-easy-q4': {
    question:
      'The side length $s$ of a square is increasing at $3$ cm/s. Find the rate of increase of the perimeter $P$.',
  },
  '15-8-15-9-definite-integration-easy-q5': {
    explanation:
      'The integral of $\\frac{1}{x}$ is $\\ln|x|$. Evaluating from $1$ to $e$ gives $\\ln e - \\ln 1 = 1$.\n\n**Common mistake:** Option B results if the student confuses the result of the integral with the upper limit variable.',
  },
  '15-8-15-9-definite-integration-medium-q5': {
    explanation:
      '$[\\ln x]_1^{e^2} = \\ln(e^2) - \\ln(1) = 2$.\n\n**Common mistake:** Incorrectly evaluating $\\ln(e^2)$ as $e^2$ or $\\ln(1)$ as $1$.',
  },
  '16-1-applications-of-differentiation-in-kinematics-easy-q1': {
    question:
      'A particle moves in a straight line such that its displacement $s$ metres from $O$ is given by $s = t^3 + 5$. Find the velocity of the particle at any time $t$.',
  },
  '16-2-applications-of-integration-in-kinematics-harder-top-hard-q3': {
    question:
      'A particle $P$ starts from the origin $O$ with velocity $v = 6\\cos(2t)$ m/s. Find the first time $t > 0$ when the particle returns to $O$.',
    options: ['$\\frac{\\pi}{2}$', '$\\pi$', '$\\frac{\\pi}{4}$', '$2\\pi$'],
    correctIndex: 0,
    explanation:
      '$s = \\int 6\\cos(2t)\\,dt = 3\\sin(2t) + c$. Since $s = 0$ when $t = 0$, $c = 0$. Returns to $O$ when $s = 0$, so $\\sin(2t) = 0$ and the first positive solution is $t = \\frac{\\pi}{2}$.\n\n**Common mistake:** Finding when the velocity is zero instead of when the displacement is zero.',
  },
}

function repairQuestion(q) {
  const ov = OVERRIDES[q.id]
  if (!ov) return q
  return {
    ...q,
    ...(ov.question !== undefined ? { question: ov.question } : {}),
    ...(ov.options !== undefined ? { options: ov.options } : {}),
    ...(ov.explanation !== undefined ? { explanation: ov.explanation } : {}),
    ...(ov.correctIndex !== undefined ? { correctIndex: ov.correctIndex } : {}),
  }
}

let files = 0
let questions = 0

for (const name of fs.readdirSync(quizDir)) {
  if (!name.endsWith('.json')) continue
  const filePath = path.join(quizDir, name)
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  if (!activeTopics.has(data.topicId)) continue

  let changed = false
  const nextQuestions = (data.questions ?? []).map((q) => {
    const repaired = repairQuestion(q)
    if (JSON.stringify(repaired) !== JSON.stringify(q)) {
      changed = true
      questions++
    }
    return repaired
  })

  if (changed) {
    data.questions = nextQuestions
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`)
    files++
    console.log('fixed', name)
  }
}

console.log(`Active pass done — ${files} file(s), ${questions} question field(s)`)
