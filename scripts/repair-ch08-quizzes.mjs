#!/usr/bin/env node
/**
 * Repair Add Math Ch.8 circular measure quiz JSON.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizDir = path.join(__dirname, '..', 'content', 'quizzes', 'add-maths-0606')

const topicIds = [
  '8-1-circular-measure',
  '8-2-length-of-an-arc-harder-topic',
  '8-3-area-of-a-sector-harder-topic',
]

const REMOVE_VARIANTS = new Set([
  '8-1-circular-measure-easy-q5',
  '8-1-circular-measure-medium-q4',
  '8-1-circular-measure-medium-q5',
  '8-1-circular-measure-pyp-q1',
])

const INDEX_FIXES = {
  '8-3-area-of-a-sector-harder-topic-easy-q5': 1,
  '8-3-area-of-a-sector-harder-topic-medium-q2': 0,
  '8-3-area-of-a-sector-harder-topic-hard-q4': 0,
}

const OVERRIDES = {
  '8-1-circular-measure-easy-q1': {
    explanation:
      'To convert degrees to radians, multiply by $\\frac{\\pi}{180}$. Here, $\\frac{150\\pi}{180} = \\frac{5\\pi}{6}$.\n\n**Common mistake:** Multiplying by $\\frac{180}{\\pi}$ instead, or not cancelling the fraction fully.',
  },
  '8-1-circular-measure-easy-q2': {
    explanation:
      'To convert radians to degrees, multiply by $\\frac{180}{\\pi}$. $\\frac{4\\pi}{3} \\times \\frac{180}{\\pi} = \\frac{4 \\times 180}{3} = 240^\\circ$.\n\n**Common mistake:** Dividing $180$ by $4$ or miscalculating $4 \\times 60$.',
  },
  '8-1-circular-measure-easy-q4': {
    explanation:
      'Convert using $\\frac{180}{\\pi}$: $\\frac{\\pi}{12} \\times \\frac{180}{\\pi} = \\frac{180}{12} = 15^\\circ$.\n\n**Common mistake:** Dividing $360$ by $12$ or guessing a small angle.',
  },
  '8-1-circular-measure-easy-q5': {
    explanation:
      '$\\frac{315\\pi}{180} = \\frac{7\\pi}{4}$.\n\n**Common mistake:** Simplifying $\\frac{315}{180}$ incorrectly or confusing $315^\\circ$ with $225^\\circ$ ($\\frac{5\\pi}{4}$).',
  },
  '8-1-circular-measure-medium-q3': {
    explanation:
      'The sum of angles in a triangle is $\\pi$. So $\\pi - (0.6 + 0.6) = \\pi - 1.2$.\n\n**Common mistake:** Using $180^\\circ$ instead of $\\pi$ for the angle sum.',
  },
  '8-1-circular-measure-medium-q5': {
    explanation:
      '$\\frac{80\\pi}{180} = \\frac{4\\pi}{9}$.\n\n**Common mistake:** Incorrectly simplifying $\\frac{80}{180}$ to $\\frac{2}{5}$ instead of $\\frac{4}{9}$.',
  },
  '8-1-circular-measure-hard-q1': {
    explanation:
      'Total parts $= 15$. Largest angle $= \\frac{6}{15}$ of the quadrilateral sum. Sum of angles $= 2\\pi$, so largest $= \\frac{6}{15} \\times 2\\pi = \\frac{4\\pi}{5}$.\n\n**Common mistake:** Using $\\pi$ instead of $2\\pi$ as the quadrilateral angle sum.',
  },
  '8-1-circular-measure-hard-q2': {
    explanation:
      'Sum of exterior angles is $2\\pi$. For a regular decagon, each exterior angle $= \\frac{2\\pi}{10} = \\frac{\\pi}{5}$.\n\n**Common mistake:** Finding the interior angle ($\\frac{4\\pi}{5}$) or dividing by $5$ instead of $10$.',
  },
  '8-1-circular-measure-hard-q3': {
    explanation:
      '15 rev/min $= 0.25$ rev/s. In 4 seconds: $1$ revolution $= 2\\pi$ radians.\n\n**Common mistake:** Failing to convert minutes to seconds, or using $\\pi$ for one full revolution.',
  },
  '8-1-circular-measure-hard-q4': {
    explanation:
      'Acute angles in a right-angled triangle sum to $\\frac{\\pi}{2}$. Other angle $= \\frac{\\pi}{2} - \\frac{\\pi}{8} = \\frac{3\\pi}{8}$.\n\n**Common mistake:** Subtracting from $\\pi$ or $90^\\circ$ instead of $\\frac{\\pi}{2}$.',
  },
  '8-1-circular-measure-hard-q5': {
    question:
      'An angle $\\theta$ satisfies $\\sin \\theta = 0.5$ where $\\frac{\\pi}{2} < \\theta < \\pi$. Find $\\theta$ in radians.',
    explanation:
      'Reference angle is $\\frac{\\pi}{6}$. In the second quadrant, $\\theta = \\pi - \\frac{\\pi}{6} = \\frac{5\\pi}{6}$.\n\n**Common mistake:** Giving the first-quadrant angle $\\frac{\\pi}{6}$ and ignoring the range.',
  },
  '8-1-circular-measure-pyp-q1': {
    explanation:
      'To convert degrees to radians, multiply by $\\frac{\\pi}{180}$. $270 \\times \\frac{\\pi}{180} = \\frac{27}{18}\\pi = \\frac{3\\pi}{2} = 1.5\\pi$.\n\n**Common mistake:** Stopping at $270/180 = 1.5$ without multiplying by $\\pi$.',
  },
  '8-1-circular-measure-pyp-q2': {
    question: 'Given that $x^\\circ = \\frac{2\\pi}{5}$ radians, find $x$.',
  },
  '8-1-circular-measure-pyp-q4': {
    question:
      'The angle $\\theta$ satisfies $0 < \\theta < \\frac{\\pi}{2}$ and $\\tan \\theta = \\sqrt{3}$. Find $\\theta$ in radians.',
    explanation:
      '$\\tan 60^\\circ = \\sqrt{3}$, and $60^\\circ = \\frac{\\pi}{3}$ radians.\n\n**Common mistake:** Confusing with $\\frac{\\pi}{6}$ ($\\tan 30^\\circ$).',
  },
  '8-1-circular-measure-pyp-q5': {
    question: 'Find the angle in radians subtended at the centre of a circle by a semicircle.',
    explanation:
      'A semicircle subtends $180^\\circ = \\pi$ radians.\n\n**Common mistake:** Giving $2\\pi$ (full circle) or $180$ without radians.',
  },
  '8-2-length-of-an-arc-harder-topic-easy-q1': {
    question: 'In the formula $s = r\\theta$, what unit must $\\theta$ be measured in?',
  },
  '8-2-length-of-an-arc-harder-topic-easy-q4': {
    options: ['$\\frac{\\pi}{3}$', '$\\frac{\\pi}{6}$', '$3\\pi$', '$\\frac{\\pi}{2}$'],
  },
  '8-2-length-of-an-arc-harder-topic-easy-q5': {
    explanation:
      'A semicircle subtends $\\pi$ radians. So $s = r \\times \\pi = \\pi r$.\n\n**Common mistake:** Giving the full circumference $2\\pi r$ instead of the semicircle arc.',
  },
  '8-2-length-of-an-arc-harder-topic-medium-q1': {
    question:
      'Find the length of an arc of radius $8$ cm that subtends an angle of $45^\\circ$ at the centre. (Use $\\pi = 3.142$.)',
    correctIndex: 0,
    explanation:
      'Convert: $45^\\circ = \\frac{\\pi}{4}$ rad. Arc length $s = 8 \\times \\frac{\\pi}{4} = 2\\pi \\approx 6.28$ cm.\n\n**Common mistake:** Calculating $8 \\times 45$ without converting to radians.',
  },
  '8-2-length-of-an-arc-harder-topic-medium-q4': {
    explanation:
      'Total angle is $2\\pi$. Major angle $= 2\\pi - 2 \\approx 4.283$ rad. Major arc $= 10 \\times 4.283 \\approx 42.8$ cm.\n\n**Common mistake:** Finding the minor arc ($20$ cm) instead.',
  },
  '8-2-length-of-an-arc-harder-topic-medium-q5': {
    explanation:
      'Arc length $s = 2r = $ diameter. So $2r = r\\theta \\implies \\theta = 2$ radians.\n\n**Common mistake:** Assuming the angle must involve $\\pi$.',
  },
  '8-2-length-of-an-arc-harder-topic-hard-q3': {
    question:
      'A pendulum of length $40$ cm swings through an angle of $15^\\circ$. Find the length of the arc traced. (Give an exact answer.)',
    options: ['$\\frac{10\\pi}{3}$ cm', '$600\\pi$ cm', '$\\frac{20\\pi}{3}$ cm', '$10$ cm'],
    explanation:
      '$\\theta = 15 \\times \\frac{\\pi}{180} = \\frac{\\pi}{12}$ rad. Arc length $s = 40 \\times \\frac{\\pi}{12} = \\frac{10\\pi}{3}$ cm.\n\n**Common mistake:** Forgetting to convert to radians before using $s = r\\theta$.',
  },
  '8-2-length-of-an-arc-harder-topic-hard-q5': {
    options: ['$\\frac{2\\pi r}{3}$', '$\\frac{\\pi r}{3}$', '$\\pi r$', '$2r$'],
    explanation:
      'Vertices of an equilateral triangle divide the circle into three equal arcs. Central angle $= \\frac{2\\pi}{3}$, so arc length $= r \\times \\frac{2\\pi}{3}$.\n\n**Common mistake:** Using $\\frac{\\pi}{3}$ (triangle interior angle) instead of the central angle.',
  },
  '8-2-length-of-an-arc-harder-topic-pyp-q1': {
    question:
      'A sector has radius $r$ cm and angle $\\theta$ radians. Its perimeter is $100$ cm. Express $r$ in terms of $\\theta$.',
    options: [
      '$\\frac{100}{\\theta + 2}$',
      '$\\frac{100}{\\theta + r}$',
      '$\\frac{100\\theta}{2}$',
      '$50 - \\theta$',
    ],
    explanation:
      '$r\\theta + 2r = 100 \\implies r(\\theta + 2) = 100 \\implies r = \\frac{100}{\\theta + 2}$.\n\n**Common mistake:** Writing the denominator as $2\\theta$ instead of $\\theta + 2$.',
  },
  '8-2-length-of-an-arc-harder-topic-pyp-q2': {
    options: ['$\\frac{4}{3}$', '$1.5$', '$3.33$', '$1.25$'],
  },
  '8-2-length-of-an-arc-harder-topic-pyp-q4': {
    question:
      'A sector has radius $r$ and angle $\\theta$. If the radius is doubled and the angle is halved, what happens to the arc length?',
  },
  '8-3-area-of-a-sector-harder-topic-easy-q1': {
    question:
      'A sector has radius $12$ cm and central angle $0.5$ radians. Calculate the area of the sector.',
  },
  '8-3-area-of-a-sector-harder-topic-easy-q2': {
    question:
      'The area of a sector is $25$ cm$^2$ and the radius is $5$ cm. Find the angle in radians.',
    options: ['$2$ radians', '$1$ radian', '$0.5$ radians', '$5$ radians'],
    correctIndex: 0,
    explanation:
      'Using $A = \\frac{1}{2}r^2\\theta$: $25 = 0.5 \\times 25 \\times \\theta \\implies \\theta = 2$ radians.\n\n**Common mistake:** Forgetting to square the radius in $A = \\frac{1}{2}r^2\\theta$.',
  },
  '8-3-area-of-a-sector-harder-topic-easy-q3': {
    question:
      'Find the radius of a sector with area $12$ cm$^2$ and central angle $1.5$ radians.',
    options: ['$4$ cm', '$16$ cm', '$8$ cm', '$2$ cm'],
  },
  '8-3-area-of-a-sector-harder-topic-easy-q4': {
    question:
      'A circle has diameter $20$ cm. Find the area of a sector with central angle $0.4$ radians.',
    explanation:
      'Radius $= 10$ cm. $A = 0.5 \\times 10^2 \\times 0.4 = 20$ cm$^2$.\n\n**Common mistake:** Using diameter $20$ as the radius: $0.5 \\times 20^2 \\times 0.4 = 80$.',
  },
  '8-3-area-of-a-sector-harder-topic-easy-q5': {
    question:
      'Convert $60^\\circ$ to radians and find the area of a sector with radius $6$ cm.',
    options: [
      '$3\\pi$ cm$^2$',
      '$6\\pi$ cm$^2$',
      '$1.5\\pi$ cm$^2$',
      '$1080$ cm$^2$',
    ],
    correctIndex: 1,
    explanation:
      '$60^\\circ = \\frac{\\pi}{3}$ rad. $A = 0.5 \\times 6^2 \\times \\frac{\\pi}{3} = 6\\pi$ cm$^2$.\n\n**Common mistake:** Using $60$ directly in the area formula without converting to radians.',
  },
  '8-3-area-of-a-sector-harder-topic-medium-q1': {
    question:
      'A sector has perimeter $24$ cm and radius $8$ cm. Calculate the area of the sector.',
    explanation:
      'Arc length $s = 24 - 16 = 8$ cm. $A = 0.5 \\times 8 \\times 8 = 32$ cm$^2$.\n\n**Common mistake:** Forgetting the factor $\\frac{1}{2}$ in $A = \\frac{1}{2}rs$.',
  },
  '8-3-area-of-a-sector-harder-topic-medium-q2': {
    question:
      'The arc length of a sector is $10$ cm and the area is $40$ cm$^2$. Find the radius.',
    options: ['$8$ cm', '$4$ cm', '$16$ cm', '$2$ cm'],
    correctIndex: 0,
    explanation:
      'Using $A = \\frac{1}{2}rs$: $40 = 0.5 \\times r \\times 10 \\implies r = 8$ cm.\n\n**Common mistake:** Ignoring the $\\frac{1}{2}$ factor, giving $r = 4$ cm.',
  },
  '8-3-area-of-a-sector-harder-topic-medium-q3': {
    question:
      'A sector is cut from a square sheet of side $10$ cm. The sector has its centre at one corner, radius $10$ cm, and angle $0.6$ radians. Find the area of the remaining metal.',
  },
  '8-3-area-of-a-sector-harder-topic-medium-q4': {
    question:
      'A sector has radius $(x+2)$ cm and central angle $2$ radians. If the area is $49$ cm$^2$, find $x$.',
    explanation:
      '$A = 0.5(x+2)^2 \\times 2 = (x+2)^2 = 49 \\implies x+2 = 7 \\implies x = 5$.\n\n**Common mistake:** Giving the radius $x+2 = 7$ instead of $x$.',
  },
  '8-3-area-of-a-sector-harder-topic-medium-q5': {
    question:
      'A sector has central angle $2.5$ radians and perimeter $18$ cm. Find its area.',
    explanation:
      '$P = r(2 + \\theta) = 3.25r = 18 \\implies r = 4$. $A = 0.5 \\times 16 \\times 2.5 = 20$ cm$^2$.\n\n**Common mistake:** Using $A = r^2\\theta$ and forgetting the $\\frac{1}{2}$ factor.',
  },
  '8-3-area-of-a-sector-harder-topic-hard-q1': {
    question:
      'A sector has radius $10$ cm and angle $1.2$ radians. Find the area of the segment bounded by the arc and chord. (Use $\\sin(1.2) \\approx 0.932$.)',
  },
  '8-3-area-of-a-sector-harder-topic-hard-q4': {
    question:
      'A sector has arc length $12$ cm and area $54$ cm$^2$. Find the central angle $\\theta$ in radians (3 s.f.).',
    options: ['$1.33$ radians', '$9$ radians', '$0.75$ radians', '$1.5$ radians'],
    correctIndex: 0,
    explanation:
      '$A = \\frac{1}{2}rs \\implies 54 = 0.5 \\times r \\times 12 \\implies r = 9$. Then $\\theta = s/r = 12/9 \\approx 1.33$ rad.\n\n**Common mistake:** Giving the radius $9$ instead of $\\theta$.',
  },
  '8-3-area-of-a-sector-harder-topic-hard-q5': {
    question:
      'A sector has radius $e$ cm and central angle $\\ln(9)$ radians. Find the exact area.',
    explanation:
      '$A = 0.5 e^2 \\ln 9 = 0.5 e^2 \\times 2\\ln 3 = e^2 \\ln 3$ cm$^2$.\n\n**Common mistake:** Leaving the answer as $e^2 \\ln 9$ without simplifying.',
  },
  '8-3-area-of-a-sector-harder-topic-pyp-q1': {
    question:
      'A sector has radius $r$ cm and perimeter $36$ cm. Show that $A = 18r - r^2$. Hence find $r$ when $A = 80$ cm$^2$.',
    options: ['$8$ cm or $10$ cm', '$4$ cm or $20$ cm', '$6$ cm or $12$ cm', '$5$ cm or $16$ cm'],
    explanation:
      '$2r + s = 36 \\implies s = 36 - 2r$. So $A = 0.5r(36-2r) = 18r - r^2$. Solving $r^2 - 18r + 80 = 0$ gives $r = 8$ or $r = 10$.\n\n**Common mistake:** Roots that sum to $18$ but come from the wrong perimeter.',
  },
  '8-3-area-of-a-sector-harder-topic-pyp-q2': {
    question:
      'Right-angled triangle $ABC$ has $AB = 6$ cm and $BC = 8$ cm. A sector with centre $A$, radius $AB$, and angle $0.6$ rad lies inside the triangle. Find the shaded area inside the triangle but outside the sector.',
  },
  '8-3-area-of-a-sector-harder-topic-pyp-q3': {
    question:
      'A sector has radius $5$ cm. Find the set of values of $\\theta$ for which the area is strictly between $25$ cm$^2$ and $50$ cm$^2$.',
    explanation:
      '$25 < 0.5 \\times 25 \\times \\theta < 50 \\implies 25 < 12.5\\theta < 50 \\implies 2 < \\theta < 4$.\n\n**Common mistake:** Forgetting the $\\frac{1}{2}$ factor in the area formula.',
  },
  '8-3-area-of-a-sector-harder-topic-pyp-q4': {
    question:
      'A sector has radius $r$. If the radius is increased by $20\\%$ and the angle is decreased by $10\\%$, find the percentage increase in area.',
    explanation:
      "New area $A' = 0.5(1.2r)^2(0.9\\theta) = 1.296A$, a $29.6\\%$ increase.\n\n**Common mistake:** Subtracting $10$ from $20$ without squaring the radius factor.",
  },
  '8-3-area-of-a-sector-harder-topic-pyp-q5': {
    question:
      'A sector has perimeter $4r$. Find the ratio of its area to $r^2$.',
    explanation:
      '$2r + r\\theta = 4r \\implies \\theta = 2$. Area $A = 0.5r^2(2) = r^2$, so the ratio is $1:1$.\n\n**Common mistake:** Forgetting the $\\frac{1}{2}$ in $A = \\frac{1}{2}r^2\\theta$.',
  },
}

function fixBrokenVariantOption(opt) {
  let o = String(opt).trim()
  const frac = o.match(/\\frac\{(\d+)\}\{(\d+)\}\\pi/)
  if (frac && (o.startsWith('$$') || o.includes('\\frac'))) {
    return `$\\frac{${frac[1]}}{${frac[2]}}\\pi$`
  }
  if (o === '\\pi') return '$\\pi$'
  return o
}

function fixCh8Artifacts(text) {
  if (!text || typeof text !== 'string') return text
  let t = text

  t = t.replace(/(of|or|between|by|side|radius|decreased by|cm or)\^(\d+)/gi, '$1 $2')
  t = t.replace(/divide by\^(\d+)/g, 'divide by $1')
  t = t.replace(/roots that sum to\^(\d+)/g, 'roots that sum to $1')
  t = t.replace(/multiply the final area result by the\^2/g, 'multiply the final area result by the $2$')
  t = t.replace(/forgets to divide by\^2/g, 'forgets to divide by $2$')

  t = t.replace(/\$(\d+(?:\.\d+)?)\\pi \. \^2\$/g, '$$$1\\pi$ cm$^2$')

  t = t.replace(/\\pi\^2\s*2\\pi/g, '$\\pi$. A full circle is $2\\pi$')
  t = t.replace(/\$2\\pi\^2\s*So/g, '$2\\pi$. So')
  t = t.replace(/radians\^2\s*2/g, 'radians. ')
  t = t.replace(/cm\^2\s*2/g, 'cm$^2$. ')
  t = t.replace(/\\pi \.\s*=/g, '$\\pi$. Sum $=')
  t = t.replace(/\\pi radians\^2\s*2/g, '$\\pi$ radians. ')
  t = t.replace(/to radians radians/g, 'to radians')
  t = t.replace(/\$10 cm\^2 2A/g, 'radius is $10$ cm. $A')

  t = t.replace(/multiply by \\frac/g, 'multiply by $\\frac')
  t = t.replace(/\\frac\{180\}\{\\pi\}\$instead/g, '$\\frac{180}{\\pi}$ instead')
  t = t.replace(/fraction\$([0-9/]+)\$incorrectly/g, 'fraction $$1$ incorrectly')
  t = t.replace(/\$\$80\/180\$ to \$2\/52/g, '$$80/180$ to $2/5$')
  t = t.replace(/\$\$315\/180\$incorrectly/g, '$$315/180$ incorrectly')
  t = t.replace(/1\.5\$,\s*the multiplication by\$/g, '$1.5$, the multiplication by $\\pi$')
  t = t.replace(/while 270\/180 = 1\.5\$,\s*the multiplication by\$/g, 'while $270/180 = 1.5$, the multiplication by $\\pi$')

  t = t.replace(/\$AB2\\theta/g, '$AB$ and $\\theta')
  t = t.replace(/r\\theta22r/g, '$r\\theta = 2r$')
  t = t.replace(/5r2r/g, '$5r \\implies r')
  t = t.replace(/12\.5\\theta2\\theta/g, '$12.5\\theta \\implies \\theta')
  t = t.replace(/6\\pi20\.5/g, '$6\\pi$. $0.5')
  t = t.replace(/0\.5162\.5/g, '$0.5 \\times 16 \\times 2.5')
  t = t.replace(/Using\^(\d+)/g, 'Using $$180^\\circ$$')

  t = t.replace(/(= \\frac\{\d+\}\{\d+\}\\pi)\.(?!\$)/g, '$1$.')

  t = t.replace(/\$s = r\\theta\$\. \$\$\\theta\$/g, '$s = r\\theta$. Must $\\theta$')
  t = t.replace(/\$\\theta2r\$/g, '$\\theta$. Perimeter $2r$')

  return t
}

function repairString(val) {
  if (typeof val !== 'string') return val
  return fixCh8Artifacts(val)
}

function degreeVariantExplanation(question) {
  const m = String(question).match(/\$(\d+)\^\\circ\$/)
  if (!m) return null
  const deg = Number(m[1])
  const frac = {
    45: [1, 4],
    60: [1, 3],
    80: [4, 9],
    90: [1, 2],
    120: [2, 3],
    150: [5, 6],
  }[deg]
  if (!frac) return null
  return `$\\frac{${deg}\\pi}{180} = \\frac{${frac[0]}\\pi}{${frac[1]}}$.`
}

function repairVariant(v) {
  const next = { ...v }
  if (next.question) next.question = repairString(next.question)
  next.options = (next.options ?? []).map((opt) => repairString(fixBrokenVariantOption(opt)))
  const autoExpl = degreeVariantExplanation(next.question)
  if (autoExpl) next.explanation = autoExpl
  else if (next.explanation) {
    let e = fixCh8Artifacts(next.explanation)
    e = e.replace(/(= \\frac\{\d+\}\{\d+\}\\pi)\.(?!\$)/g, '$1$.')
    next.explanation = repairString(e)
  }
  return next
}

function repairQuestion(q) {
  const id = q.id
  const next = { ...q }

  if (REMOVE_VARIANTS.has(id)) delete next.variants
  else if (next.variants?.length) {
    next.variants = next.variants.map((v) => repairVariant(v))
  }

  if (next.question) next.question = repairString(next.question)
  if (next.options) next.options = next.options.map((opt) => repairString(fixBrokenVariantOption(opt)))
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
console.log(`Ch.8 repair done — ${files} files`)
