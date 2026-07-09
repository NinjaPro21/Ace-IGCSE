#!/usr/bin/env node
/**
 * Repair canonical Maths 0580 Ch.6 quiz JSON (live site content only).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prepareMathContent } from '../src/lib/mathMarkdown.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizRoot = path.join(__dirname, '../content/quizzes/maths-0580')
const chapter = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../content/chapters/maths-0580/ch06-mensuration.json'), 'utf8'),
)
const topicIds = new Set(chapter.topicIds)

const CONTENT_FIXES = {
  '3-1-percentages-financial-maths-rates-and-time-easy-q5': {
    question:
      'Find the speed of an object that travels a distance of $600$ km in $8$ hours.',
  },
  '3-1-percentages-financial-maths-rates-and-time-hard-q4': {
    question:
      'A car travels $60$ km at $30$ km/h and then a further $180$ km at $160$ km/h. Find the average speed for the whole journey.',
  },
  '3-1-percentages-financial-maths-rates-and-time-medium-q1': {
    question:
      'Divide $60$ between two people, A and B, in the ratio $5:7$. How much does person B receive?',
    options: ['$35$', '$25$', '$5$', '$42$'],
    explanation:
      'Total parts $= 5 + 7 = 12$. Each part $= 60 \\div 12 = 5$. Person B receives 7 parts: $7 \\times 5 = 35$.\n\n**Common mistake:** The student might calculate the share for person A ($25$) instead of person B.',
  },
  '3-1-percentages-financial-maths-rates-and-time-medium-q2': {
    question:
      'In a sale, a jacket costing $40$ is reduced by $20\\%$. What is the sale price?',
    options: ['$32$', '$8$', '$20$', '$48$'],
    explanation:
      'A reduction of $20\\%$ means the new price is $80\\%$ of the original. $0.8 \\times 40 = 32$. Alternatively, $20\\%$ of $40$ is $8$, and $40 - 8 = 32$.\n\n**Common mistake:** A student might calculate the discount amount ($8$) and provide that as the final answer.',
  },
  '3-1-percentages-financial-maths-rates-and-time-medium-q3': {
    question:
      'Using the exchange rate $1 = 0.31$ Dinars, convert $22.50$ into Dinars.',
    explanation:
      'Multiply the amount in dollars by the exchange rate: $22.50 \\times 0.31 = 6.975$, which rounds to $6.98$ Dinars.\n\n**Common mistake:** A student might divide the dollar amount by $0.31$ instead of multiplying.',
  },
  '3-1-percentages-financial-maths-rates-and-time-medium-q4': {
    question:
      'Calculate the simple interest earned on $1200$ invested for $2$ years at a rate of $3\\%$ per year.',
    options: ['$72$', '$36$', '$1272$', '$7.20$'],
    explanation:
      '$I = (P \\times R \\times T) / 100 = (1200 \\times 3 \\times 2) / 100 = 72$.\n\n**Common mistake:** The student might provide the total amount in the account ($1272$) instead of just the interest earned.',
  },
  '3-1-percentages-financial-maths-rates-and-time-pyp-q2': {
    question:
      'In 2019, Patrick had a salary of $32000$. This was an increase of $9\\%$ on his salary in 2017. Calculate his salary in 2017 to the nearest cent.',
    options: ['$29357.80$', '$29120.00$', '$34880.00$', '$30000.00$'],
    explanation:
      'Let 2017 salary be $x$. $1.09x = 32000 \\Rightarrow x = 32000 \\div 1.09 \\approx 29357.80$.\n\n**Common mistake:** Students often calculate $9\\%$ of $32000$ and subtract it, resulting in $29120$.',
  },
  '3-1-percentages-financial-maths-rates-and-time-pyp-q3': {
    question:
      'Edward invests $204$ for four years at a rate of $6\\%$ per year compound interest. Calculate, to the nearest cent, how much money he has at the end of these four years.',
    options: ['$257.55$', '$252.96$', '$216.24$', '$248.88$'],
    explanation:
      'Amount $= 204 \\times (1.06)^4 = 204 \\times 1.26247\\ldots = 257.5452\\ldots$, which rounds to $257.55$.\n\n**Common mistake:** Rounding early in the calculation could lead to $257.54$, which is slightly inaccurate.',
  },
  '3-1-percentages-financial-maths-rates-and-time-pyp-q5': {
    question:
      'Halima sells apples for $0.45$ per kilogram. She reduces this price by $20\\%$. Calculate the new price per kilogram.',
    options: ['$0.36$', '$0.09$', '$0.35$', '$0.54$'],
    explanation:
      'Reduction $= 20\\%$ of $0.45 = 0.09$. New price $= 0.45 - 0.09 = 0.36$.\n\n**Common mistake:** The student might provide the amount of reduction ($0.09$) instead of the new price.',
  },
  '5-1-5-2-area-circles-easy-q2': {
    question:
      'Calculate the circumference of a circle with a diameter of $8\\text{ cm}$. Leave your answer in terms of $\\pi$.',
  },
  '5-1-5-2-area-circles-easy-q3': {
    question:
      'Which of these is the correct formula for the area of a trapezium with parallel sides $a$ and $b$ and height $h$?',
  },
  '5-1-5-2-area-circles-medium-q1': {
    explanation:
      '$105 = 0.5 \\times (5 + 9) \\times h \\Rightarrow 105 = 7 \\times h \\Rightarrow h = 15\\text{ cm}$.\n\n**Common mistake:** A student might forget to divide the sum of parallel sides by 2 before solving for $h$.',
  },
  '5-1-5-2-area-circles-medium-q2': {
    question:
      'A rectangular field is $400\\text{ m}$ long and has an area of $6$ hectares. Calculate the perimeter of the field ($1\\text{ hectare} = 10000\\text{ m}^2$).',
  },
  '5-1-5-2-area-circles-pyp-q2': {
    question:
      'A shape is made by removing a small semi-circle from a large semi-circle. On the large semi-circle, diameter $AB$ and midpoint $M$, $AM = MB = 10\\text{ cm}$. If the small semi-circle has diameter $AM$, find the area of the shape in terms of $\\pi$.',
    explanation:
      'Large radius $= 10$, area $= 0.5\\pi(10^{2}) = 50\\pi$. Small radius $= 5$, area $= 0.5\\pi(5^2) = 12.5\\pi$. Shaded area $= 50\\pi - 12.5\\pi = 37.5\\pi$.\n\n**Common mistake:** The student might subtract the small circle area from the full large circle instead of using semi-circles.',
  },
  '5-1-5-2-area-circles-pyp-q5': {
    question:
      'In triangle $ABC$, $AB = 8\\text{ cm}$, $AC = 10\\text{ cm}$, and $BC = 14\\text{ cm}$. Given angle $ACB = 29.2^{\\circ}$, calculate the area of triangle $ABC$.',
    explanation:
      'Area $= 0.5 \\times AC \\times BC \\times \\sin(ACB) = 0.5 \\times 10 \\times 14 \\times \\sin 29.2^{\\circ} \\approx 34.15$.\n\n**Common mistake:** Using the wrong pair of sides for the given angle; for angle $ACB$, sides $BC$ and $AC$ must be used.',
  },
  '5-3-5-4-sector-segment-analysis-easy-q1': {
    question:
      'Which formula is used to calculate the arc length $l$ when the radius is $r$ and the central angle is $\\theta$?',
    explanation:
      'The arc length is a fraction of the whole circumference ($2\\pi r$). It is $\\frac{\\theta}{360°}$ of the circle.\n\n**Common mistake:** Students often confuse the formula for arc length with the formula for sector area.',
  },
  '5-3-5-4-sector-segment-analysis-easy-q2': {
    question:
      'Calculate the area of a sector with a radius of $10\\text{ cm}$ and a central angle of $45°$. Leave your answer in terms of $\\pi$.',
  },
  '5-3-5-4-sector-segment-analysis-easy-q5': {
    question:
      'Find the arc length of a semicircle with a diameter of $20\\text{ cm}$ in terms of $\\pi$.',
    explanation:
      'Radius is $10\\text{ cm}$. Semicircle angle is $180°$. Arc length $= \\frac{180}{360} \\times 2\\pi(10) = 10\\pi$.\n\n**Common mistake:** The student might use the diameter ($20$) in the formula as the radius, leading to $20\\pi$.',
  },
  '5-3-5-4-sector-segment-analysis-medium-q1': {
    question:
      'A sector of a circle with radius $12\\text{ cm}$ has an arc length of $14\\pi\\text{ cm}$. Calculate the central angle $\\theta$.',
  },
  '5-3-5-4-sector-segment-analysis-pyp-q1': {
    question:
      'Points $A$ and $B$ lie on a circle with centre $O$ and radius $10\\text{ cm}$. If angle $AOB = 70°$, calculate the arc length $AB$.',
  },
  '5-3-5-4-sector-segment-analysis-pyp-q2': {
    question:
      'Hence, using the radius of $10\\text{ cm}$ and angle of $70°$, find the area of the minor sector $AOB$.',
  },
  '5-3-5-4-sector-segment-analysis-pyp-q4': {
    question:
      'The points $X$ and $Y$ lie on a circle with centre $O$ and radius $8\\text{ cm}$. Given angle $XOY = 80°$, calculate the length of the chord $XY$.',
    explanation:
      'Use the sine rule in triangle $XOY$: $XY = 2 \\times 8 \\times \\sin(40°) \\approx 10.28$.\n\n**Common mistake:** A student might assume the triangle is equilateral and pick $8\\text{ cm}$.',
  },
  '5-5-5-6-volume-surface-area-easy-q1': {
    question:
      'Which formula is used to calculate the volume of a prism with cross-sectional area $A$ and length $l$?',
  },
  '5-5-5-6-volume-surface-area-easy-q2': {
    question:
      'Calculate the volume of a sphere with a radius of $6\\text{ cm}$ in terms of $\\pi$.',
    explanation:
      'Using the formula $V = \\frac{4}{3}\\pi r^3$, for $r = 6$: $V = \\frac{4}{3} \\times \\pi \\times 216 = 288\\pi$.\n\n**Common mistake:** A student might use the surface area formula $4\\pi r^2$ ($144\\pi$) instead of $r^3$.',
  },
  '5-5-5-6-volume-surface-area-easy-q3': {
    question:
      'Identify the curved surface area formula for a cylinder with radius $r$ and height $h$.',
    explanation:
      'The curved surface of a cylinder is essentially a flattened rectangle with length equal to the circumference ($2\\pi r$) and height $h$.\n\n**Common mistake:** Students often provide the volume formula ($\\pi r^2 h$) or the total surface area formula which includes the circular ends.',
  },
  '5-5-5-6-volume-surface-area-easy-q5': {
    question:
      'What is the surface area of a sphere with a radius of $3\\text{ cm}$ in terms of $\\pi$?',
  },
  '5-5-5-6-volume-surface-area-hard-q1': {
    question:
      'A cylindrical metal pipe has an external diameter of $6\\text{ cm}$ and an internal diameter of $4\\text{ cm}$. Calculate the volume of metal in a pipe of length $25\\text{ cm}$ in terms of $\\pi$.',
    explanation:
      'External radius $= 3$, Internal radius $= 2$. Metal Volume $= \\text{Ext Volume} - \\text{Int Volume} = \\pi(3^2)(25) - \\pi(2^2)(25) = 225\\pi - 100\\pi = 125\\pi$.\n\n**Common mistake:** A common error is subtracting the diameters ($6-4=2$) and then finding the volume as if it were a solid cylinder of radius $1$.',
  },
  '5-5-5-6-volume-surface-area-medium-q4': {
    explanation:
      'Curved area $= 2\\pi r^2 = 98\\pi$. Base area $= \\pi r^2 = 49\\pi$. Total $= 147\\pi$.\n\n**Common mistake:** A student might only calculate the curved surface area ($98\\pi$) and forget to add the circular base.',
  },
  '5-7-similarity-length-area-volume-ratios-easy-q4': {
    question:
      'Two similar 3D solids have a linear scale factor of $3$. What is the ratio of their volumes?',
  },
  '5-7-similarity-length-area-volume-ratios-hard-q4': {
    question:
      'Triangles $ABC$ and $EBD$ are similar, with $DE \\parallel AC$. If $AB = 8\\text{ cm}$, $BE = 4\\text{ cm}$, and the area of triangle $DBE$ is $6\\text{ cm}^2$, find the area of triangle $ABC$.',
  },
  '5-7-similarity-length-area-volume-ratios-medium-q1': {
    question:
      'In a diagram, triangle $ADE$ is similar to triangle $ABC$, with $DE \\parallel BC$. If $AD = 2\\text{ cm}$, $AB = 6\\text{ cm}$, and $DE = 5\\text{ cm}$, find the length of $BC$.',
    explanation:
      'The linear scale factor $k = AB/AD = 6/2 = 3$. Therefore, $BC = DE \\times 3 = 5 \\times 3 = 15\\text{ cm}$.\n\n**Common mistake:** The student might use the length $BD$ ($4\\text{ cm}$) as the scale factor instead of the full side $AB$.',
  },
  '5-7-similarity-length-area-volume-ratios-pyp-q4': {
    question:
      'In triangle $PQR$, $S$ lies on $PR$ and $T$ lies on $PQ$, with $ST \\parallel RQ$. If $PT = 5\\text{ cm}$, $TQ = 2\\text{ cm}$, and $ST = 4\\text{ cm}$, calculate the length of $RQ$.',
    explanation:
      '$PQ = 5 + 2 = 7\\text{ cm}$. Linear scale factor $k = PQ/PT = 7/5 = 1.4$. Therefore, $RQ = 4 \\times 1.4 = 5.6\\text{ cm}$.\n\n**Common mistake:** Using the segment $TQ$ ($2\\text{ cm}$) in the ratio calculation instead of the full side length $PQ$.',
  },
}

function repairQuizStringPre(text) {
  if (!text) return text
  let t = text
  t = t.replace(/\$\$\s*\n([\s\S]*?)(?:\n(?!\$)|$)/g, (_, inner) => {
    const trimmed = inner.trim()
    return trimmed ? `$${trimmed}$` : ''
  })
  t = t.replace(/\$\$([^$\n]+)\$/g, '$$$1$')
  if (((t.match(/(?<!\\)\$/g) ?? []).length % 2) !== 0) {
    t = t.replace(/(\$[^$\n]+)\.(?="|'|\s*$)/g, '$1$.')
    t = t.replace(/(\$[^$\n]+)\?(?="|'|\s*$)/g, '$1$?')
  }
  t = t.replace(/√/g, '\\sqrt')
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

console.log(`Repaired ${files} Maths 0580 Ch.6 quiz files (${questions} questions).`)
