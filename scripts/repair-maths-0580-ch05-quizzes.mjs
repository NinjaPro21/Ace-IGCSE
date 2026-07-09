#!/usr/bin/env node
/**
 * Repair canonical Maths 0580 Ch.5 quiz JSON (live site content only).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prepareMathContent } from '../src/lib/mathMarkdown.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizRoot = path.join(__dirname, '../content/quizzes/maths-0580')
const chapter = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../content/chapters/maths-0580/ch05-trigonometry.json'), 'utf8'),
)
const topicIds = new Set(chapter.topicIds)

const CONTENT_FIXES = {
  '10-1-any-angle-easy-q1': {
    question:
      'According to the unit circle definition, if a point $P(x, y)$ moves around a circle of radius 1, which trigonometric ratio is represented by the $y$-coordinate of $P$?',
    explanation:
      'On a unit circle of radius 1, the $y$-coordinate of $P$ gives $\\sin\\theta$.\n\n**Common mistake:** Students often swap the coordinates, thinking the $x$-coordinate is sine.',
  },
  '10-1-any-angle-easy-q4': {
    explanation:
      'The cosine graph has reflective symmetry about the $y$-axis. So $\\cos(-x) = \\cos x$.\n\n**Common mistake:** Students often assume all trigonometric functions behave the same and might think $\\cos(-x) = -\\cos x$, which is actually the rule for sine.',
  },
  '10-1-any-angle-easy-q5': {
    question: 'State the exact value of $\\cos 120°$.',
  },
  '10-1-any-angle-hard-q2': {
    question:
      'Find the two values of $x$ such that $\\sin(x + 30°) = 0.5$ in the interval $0° \\le x \\le 360°$.',
  },
  '10-1-any-angle-hard-q3': {
    explanation:
      '$\\cos 150° = -\\sqrt{3}/2$, $\\tan 210° = 1/\\sqrt{3}$, and $\\sin(-60°) = -\\sqrt{3}/2$. So $\\frac{(-\\sqrt{3}/2)(1/\\sqrt{3})}{-\\sqrt{3}/2} = \\frac{-1/2}{-\\sqrt{3}/2} = 1/\\sqrt{3}$.\n\n**Common mistake:** Arithmetic errors with surds and sign flips are extremely common in multi-step exact value problems.',
    correctIndex: 2,
  },
  '10-1-any-angle-hard-q4': {
    question:
      'At which point does the graph of $y = \\cos x$ have rotational symmetry for $0° \\le x \\le 360°$?',
    explanation:
      'The cosine curve has rotational symmetry about $(90°, 0)$ and reflective symmetry about the $y$-axis.\n\n**Common mistake:** The student may incorrectly assume the cosine graph has rotational symmetry about the origin, which is actually a property of the sine graph.',
  },
  '10-1-any-angle-hard-q5': {
    explanation:
      '$\\tan x = -4/3 \\approx -1.333$. $\\tan^{-1}(-1.333) \\approx -53.1°$. Adding $180°$ gives $126.9°$ and $306.9°$.\n\n**Common mistake:** The student might accidentally find the quadrant 1 angle ($53.1°$) and fail to apply the negative sign correctly.',
  },
  '10-1-any-angle-pyp-q1': {
    question: 'Solve the equation $\\sin x = -0.5$ for $0° \\le x \\le 360°$.',
  },
  '10-1-any-angle-pyp-q2': {
    question: 'Work out the exact value of $\\sin 150° + \\cos 330°$.',
  },
  '10-1-any-angle-pyp-q3': {
    question:
      'A graph of $y = f(x)$ is shown for $0° \\le x \\le 360°$. The graph crosses the $x$-axis at $90°$ and $270°$, and has its minimum point at $(180°, -1)$. Identify the function.',
  },
  '10-1-any-angle-pyp-q4': {
    question: 'Solve the equation $\\tan(x - 45°) = 1$ for $0° \\le x \\le 360°$.',
    explanation:
      'If $\\tan\\theta = 1$, then $\\theta = 45°$ or $225°$. So $x - 45° = 45° \\Rightarrow x = 90°$ and $x - 45° = 225° \\Rightarrow x = 270°$.\n\n**Common mistake:** The student might think the solutions are simply $45°$ and $225°$, forgetting to add the $45°$ shift to each root.',
  },
  '10-1-any-angle-pyp-q5': {
    question:
      'Given that $\\sin 35° = 0.574$, find the value of $\\sin 145°$.',
  },
  '10-2-10-3-sine-cosine-rules-easy-q1': {
    explanation:
      'You know an opposite pair (side $a$ and angle $A$), which is the standard criterion for the Sine Rule.\n\n**Common mistake:** Students may try to use Pythagoras\' Theorem even though the triangle is not right-angled.',
  },
  '10-2-10-3-sine-cosine-rules-easy-q3': {
    question:
      'In the Cosine Rule formula $a^2 = b^2 + c^2 - 2bc\\cos A$, what does angle $A$ represent?',
    explanation:
      'In both Sine and Cosine rules, the letter $a$ denotes a side and $A$ denotes the angle opposite side $a$.\n\n**Common mistake:** Confusion often arises between which angle is opposite and which is included.',
  },
  '10-2-10-3-sine-cosine-rules-easy-q4': {
    question:
      'Calculate the value of side $c$ if $\\frac{c}{\\sin 50°} = \\frac{7}{\\sin 60°}$.',
    explanation:
      '$c = (7 \\times \\sin 50°) / \\sin 60° = (7 \\times 0.766) / 0.866 \\approx 6.19$.\n\n**Common mistake:** A student might cross-multiply incorrectly or use $\\cos$ instead of $\\sin$.',
  },
  '10-2-10-3-sine-cosine-rules-easy-q5': {
    question:
      'Given $\\cos x = -0.5$ in the Cosine Rule, what does this tell you about the nature of the angle $x$?',
  },
  '10-2-10-3-sine-cosine-rules-hard-q2': {
    question:
      'Two sides of a triangle are $3x$ cm and $4x$ cm. The side opposite the $150°$ angle is $40.6$ cm. Find $x$.',
    explanation:
      'Cosine Rule: $40.6^2 = (3x)^2 + (4x)^2 - (2 \\times 3x \\times 4x \\times \\cos 150°)$. $1648.36 = 9x^2 + 16x^2 - (24x^2 \\times -0.866) = 25x^2 + 20.78x^2 = 45.78x^2$. $x^2 = 1648.36 / 45.78 \\approx 36 \\Rightarrow x = 6$.\n\n**Common mistake:** The student might square $3x$ as $3x^2$ or $4x$ as $4x^2$ instead of $9x^2$ and $16x^2$.',
  },
  '10-2-10-3-sine-cosine-rules-hard-q3': {
    question:
      'In triangle $PQR$, the area is $93\\text{ cm}^2$, side $p = 12$ cm, and side $r = 16$ cm. Find angle $Q$ and side $q$.',
  },
  '10-2-10-3-sine-cosine-rules-hard-q5': {
    question:
      'Town X is $8$ km from Town Y and $5$ km from Town Z. Town Y is $9$ km due North of Town Z. If X is West of line $YZ$, find angle $YZX$.',
    explanation:
      'Sides of triangle $XYZ$ are $8$, $5$ and $9$. Angle $Z$ is opposite $XY$ ($8$). $\\cos Z = (5^2 + 9^2 - 8^2) / (2 \\times 5 \\times 9) = 42/90 = 0.4667$. $Z = \\cos^{-1}(0.4667) \\approx 62.2°$.\n\n**Common mistake:** The student might calculate the angle at $Y$ or use the wrong sides in the formula numerator.',
  },
  '10-2-10-3-sine-cosine-rules-medium-q1': {
    explanation:
      'Use Cosine Rule: $a^2 = 7^2 + 5^2 - (2 \\times 7 \\times 5 \\times \\cos 60°) = 49 + 25 - (70 \\times 0.5) = 74 - 35 = 39$. Thus $a = \\sqrt{39} \\approx 6.25$.\n\n**Common mistake:** The student might forget to take the square root at the final step, giving $\\sqrt{39}$ as the answer without evaluating it.',
  },
  '10-2-10-3-sine-cosine-rules-medium-q2': {
    question:
      'Find the size of angle $B$ if $a = 15$ cm, $b = 6$ cm, and angle $A = 120°$.',
    explanation:
      'Use Sine Rule: $\\sin B / 6 = \\sin 120° / 15$. $\\sin B = (6 \\times 0.866) / 15 = 0.3464$. $B = \\sin^{-1}(0.3464) \\approx 20.3°$.\n\n**Common mistake:** The student might use the Cosine Rule by mistake even though an opposite pair is known.',
  },
  '10-2-10-3-sine-cosine-rules-medium-q3': {
    question:
      'Calculate the largest angle in a triangle with sides $5$ cm, $6$ cm, and $7$ cm.',
    explanation:
      'Longest side $a = 7$. $\\cos A = (5^2 + 6^2 - 7^2) / (2 \\times 5 \\times 6) = 12/60 = 0.2$. $A = \\cos^{-1}(0.2) \\approx 78.5°$.\n\n**Common mistake:** Students may calculate one of the smaller angles instead of the one opposite the longest side.',
  },
  '10-2-10-3-sine-cosine-rules-medium-q4': {
    question:
      'In triangle $XYZ$, $X = 61°$, $Y = 47°$, and side $y = 7.2$ cm. Find the length of side $x$.',
  },
  '10-2-10-3-sine-cosine-rules-medium-q5': {
    question:
      'A triangle has sides of $8$ cm and $14$ cm with an included angle of $112°$. Calculate the third side to 3 significant figures.',
  },
  '10-2-10-3-sine-cosine-rules-pyp-q1': {
    explanation:
      '$\\sin C / 7 = \\sin 62° / 8 \\Rightarrow \\sin C = (7 \\times 0.8829) / 8 = 0.7725$. $C = \\sin^{-1}(0.7725) \\approx 50.6°$.\n\n**Common mistake:** The student might select $67.4°$ which is the third angle, or multiply $7 \\times \\sin 62°$ without dividing by $8$.',
  },
  '10-2-10-3-sine-cosine-rules-pyp-q5': {
    question:
      'Given a triangle with sides $3$, $4$, and $6$, find the value of the cosine of the largest angle.',
    explanation:
      'Largest angle is opposite side $6$. $\\cos A = (3^2 + 4^2 - 6^2) / (2 \\times 3 \\times 4) = (9 + 16 - 36) / 24 = -11/24 \\approx -0.458$.\n\n**Common mistake:** The student might use the wrong sides in the formula or conclude it is right-angled because $3^2+4^2=25$ is close to $6^2=36$.',
  },
  '4-1-pythagoras-theorem-easy-q4': {
    question:
      'Which formula gives the interior diagonal $d$ of a cuboid with edge lengths $a$, $b$, and $c$?',
    options: [
      '$d = \\sqrt{a^2 + b^2 + c^2}$',
      '$d = a + b + c$',
      '$d = \\sqrt{a^2 + b^2}$',
      '$d = a^2 + b^2 + c^2$',
    ],
  },
  '4-1-pythagoras-theorem-hard-q2': {
    question:
      'The sides of a right-angled triangle are $x$, $15$, and $x + 3$, where $x + 3$ is the hypotenuse. Solve for $x$.',
  },
  '4-1-pythagoras-theorem-pyp-q4': {
    question:
      'Triangle $ABC$ has $AB = \\sqrt{12}\\text{ cm}$ and $BC = \\sqrt{48}\\text{ cm}$. If $\\angle ABC = 90°$, find the exact length of $AC$.',
  },
  '4-2-trigonometry-easy-q1': {
    question:
      'In a right-angled triangle, if the side opposite angle $x$ is $O$ and the hypotenuse is $H$, which ratio equals $O/H$?',
  },
  '4-2-trigonometry-easy-q2': {
    question: 'State the exact value of $\\tan 45°$.',
  },
  '4-2-trigonometry-easy-q3': {
    question:
      'Which side of a right-angled triangle is always the denominator in the ratios for both $\\sin x$ and $\\cos x$?',
    explanation:
      'Both $\\sin x$ ($O/H$) and $\\cos x$ ($A/H$) are calculated by dividing a side by the length of the hypotenuse.\n\n**Common mistake:** A student might choose the adjacent side, confusing the cosine ratio with the tangent ratio.',
  },
  '4-2-trigonometry-easy-q4': {
    question: 'Identify the exact value of $\\cos 60°$.',
  },
  '4-2-trigonometry-hard-q1': {
    question:
      'The diagram shows two right-angled triangles $ABC$ and $ACD$ sharing side $AC$. In $\\triangle ABC$, $\\angle B = 90°$, $\\angle A = 30°$, and $AB = 12\\text{ cm}$. In $\\triangle ACD$, $\\angle D = 90°$ and $\\angle CAD = 40°$. Calculate $CD$.',
    explanation:
      'In $\\triangle ABC$, $\\cos 30° = AB/AC$, so $AC = 12/\\cos 30° \\approx 13.86\\text{ cm}$. In $\\triangle ACD$, $\\sin 40° = CD/AC$, so $CD = AC\\sin 40° \\approx 8.91\\text{ cm}$.\n\n**Common mistake:** The student might assume $AC$ is a leg of $\\triangle ABC$ or misapply the ratio in the second triangle.',
    correctIndex: 3,
  },
  '4-2-trigonometry-hard-q5': {
    explanation:
      'If $\\tan x = 3/4$, then Opposite $= 3$ and Adjacent $= 4$. By Pythagoras, Hypotenuse $= \\sqrt{3^2 + 4^2} = 5$. Thus $\\sin x = O/H = 3/5 = 0.6$.\n\n**Common mistake:** A student might think $\\sin x$ equals $3$ or divide the adjacent by the opposite.',
  },
  '4-2-trigonometry-medium-q1': {
    question:
      'Calculate the length of side $y$ if the hypotenuse is $14\\text{ cm}$ and the angle adjacent to side $y$ is $40°$.',
  },
  '4-2-trigonometry-medium-q3': {
    question: 'Simplify the exact expression: $10\\sin 30° + 4\\cos 60°$.',
  },
  '4-3-4-5-bearings-scale-drawing-easy-q2': {
    question:
      'The bearing of Town $Y$ from Town $X$ is $072°$. Calculate the bearing of Town $X$ from Town $Y$.',
  },
  '4-3-4-5-bearings-scale-drawing-hard-q1': {
    question:
      'A ship sails $18\\text{ km}$ from $P$ on a bearing of $060°$ to $Q$, then $24\\text{ km}$ from $Q$ on a bearing of $150°$ to $R$. Find the direct distance $PR$.',
    explanation:
      'The angle between the bearings is $90°$. Use Pythagoras: $\\sqrt{18^2 + 24^2} = \\sqrt{900} = 30$.\n\n**Common mistake:** A student might add the distances directly ($18 + 24 = 42$) or fail to identify that the path forms a right-angled triangle.',
  },
  '4-3-4-5-bearings-scale-drawing-hard-q2': {
    question:
      'From the top of a $100\\text{ m}$ tower, the angles of depression of two points $A$ and $B$ on the same side are $22°$ and $38°$ respectively. Calculate the distance between $A$ and $B$.',
  },
  '4-3-4-5-bearings-scale-drawing-hard-q3': {
    question:
      'A map scale is $1 : 50000$. A lake covers an actual area of $12\\text{ km}^2$. Calculate the area of the lake on the map in $\\text{cm}^2$.',
    options: [
      '$4.8\\text{ cm}^2$',
      '$24\\text{ cm}^2$',
      '$48\\text{ cm}^2$',
      '$0.48\\text{ cm}^2$',
    ],
    correctIndex: 2,
    explanation:
      'Scale: $1\\text{ cm} = 0.5\\text{ km}$. Area scale: $1\\text{ cm}^2 = 0.25\\text{ km}^2$. Map area $= 12 / 0.25 = 48\\text{ cm}^2$.\n\n**Common mistake:** A student might divide the area by $50000$ only once or misplace the decimal point during the km to cm conversion.',
  },
  '4-3-4-5-bearings-scale-drawing-medium-q4': {
    question:
      'A plane flies from $A$ to $B$ on a bearing of $040°$, then from $B$ to $C$ on a bearing of $090°$. Find angle $ABC$.',
    explanation:
      'The back bearing of $040°$ is $220°$. Bearing to East is $090°$. Angle at $B = 220° - 90° = 130°$.\n\n**Common mistake:** A student might assume the turn is $90°$ or miscalculate the relationship between the bearing and the turn.',
  },
  '4-3-4-5-bearings-scale-drawing-pyp-q1': {
    question:
      'Point $B$ is on a bearing of $134°$ from Point $A$. Find the bearing of Point $A$ from Point $B$.',
    explanation:
      'The back bearing is $134 + 180 = 314°$.\n\n**Common mistake:** A student might subtract $134°$ from $180°$ or $360°$ incorrectly.',
  },
  '4-3-4-5-bearings-scale-drawing-pyp-q5': {
    question:
      'In triangle $FLS$, $FS = 426\\text{ km}$, $LS = 507\\text{ km}$, angle $SFL = 100°$, and angle $FLS = 75°$. Find the bearing of San Diego ($S$) from Fresno ($F$).',
    explanation:
      'Use the Sine Rule in $\\triangle FLS$ to find the required bearing ($\\approx 154°$).\n\n**Common mistake:** The student might assume triangle $FLS$ and add $75°$ directly to the bearing.',
  },
  '4-6-three-dimensional-trigonometry-easy-q2': {
    question:
      'Identify the standard formula for finding the length of the interior diagonal $d$ of a cuboid with length $l$, width $w$, and height $h$.',
    options: [
      '$d = \\sqrt{l^2 + w^2 + h^2}$',
      '$d = l + w + h$',
      '$d = \\sqrt{l^2 + w^2}$',
      '$d = (l \\times w) + h$',
    ],
  },
  '4-6-three-dimensional-trigonometry-hard-q1': {
    question:
      'In a pyramid with square base $ABCD$ of side $12\\text{ cm}$, the vertex $V$ is above the centre $O$ of the base and $VA = 15\\text{ cm}$. Calculate the angle between the slant face $VBC$ and the base $ABCD$.',
    correctIndex: 1,
    explanation:
      'Half of $BC$ is $6\\text{ cm}$. $VO = \\sqrt{15^2 - (6\\sqrt{2})^2} = \\sqrt{153} \\approx 12.37$. $\\tan\\theta = VO/6 \\approx 2.06$, so $\\theta \\approx 64.1°$.\n\n**Common mistake:** The student might use the slant edge $VA$ instead of the perpendicular height $VO$ when calculating the angle.',
  },
  '4-6-three-dimensional-trigonometry-hard-q5': {
    explanation:
      'Base diagonal $= \\sqrt{8^2 + 6^2} = 10$. $\\tan 30° = x / 10 \\Rightarrow x = 10 \\times \\tan 30° = 10/\\sqrt{3} \\approx 5.77$.\n\n**Common mistake:** The student might multiply by $\\sin 30°$ or use the side length $8$ instead of the base diagonal $10$.',
  },
  '4-6-three-dimensional-trigonometry-medium-q2': {
    question:
      'A vertical pole of height $10\\text{ m}$ stands at corner $B$ of rectangle $ABCD$, where $AB = 20\\text{ m}$ and $BC = 15\\text{ m}$. Calculate the angle of elevation of the top of the pole from the opposite corner $D$.',
    explanation:
      'First, find base diagonal $BD = \\sqrt{20^2 + 15^2} = 25\\text{ m}$. Then $\\tan\\theta = 10/25 = 0.4$, so $\\theta = \\tan^{-1}(0.4) \\approx 21.8°$.\n\n**Common mistake:** The student might use the side length $20$ or $15$ as the adjacent side instead of the diagonal $25$.',
  },
  '4-6-three-dimensional-trigonometry-medium-q4': {
    question:
      'A wedge is formed by a horizontal rectangle $ABRQ$ and vertical rectangle $PQRS$, with $AB = 10\\text{ m}$, $BR = 6\\text{ m}$, and $RS = 3\\text{ m}$. Find the length $AS$.',
  },
  '4-6-three-dimensional-trigonometry-pyp-q1': {
    explanation:
      'Diagonal $AC = \\sqrt{12^2 + 9^2} = 15$. Half-diagonal $OB = 7.5$. $VB = \\sqrt{10^2 + 7.5^2} = \\sqrt{156.25} = 12.5$.\n\n**Common mistake:** A student might add the vertical height to the side length directly ($12+10$) or forget to halve the base diagonal.',
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

console.log(`Repaired ${files} Maths 0580 Ch.5 quiz files (${questions} questions).`)
