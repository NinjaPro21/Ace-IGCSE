#!/usr/bin/env node
/**
 * Repair canonical Maths 0580 Ch.4 quiz JSON (live site content only).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prepareMathContent } from '../src/lib/mathMarkdown.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizRoot = path.join(__dirname, '../content/quizzes/maths-0580')
const chapter = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../content/chapters/maths-0580/ch04-geometry-transformations.json'),
    'utf8',
  ),
)
const topicIds = new Set(chapter.topicIds)

const CONTENT_FIXES = {
  '7-1-angles-easy-q1': {
    explanation:
      'Angles on a straight line add up to $180°$. Therefore, the third angle is $180° - (45° + 72°) = 63°$.\n\n**Common mistake:** A student might subtract the sum from $360°$ (angles at a point) or simply add the two given angles and stop at $117°$.',
  },
  '7-1-angles-hard-q3': {
    question:
      'A quadrilateral $ABCD$ has angles $A = 2x$, $B = 3x - 10$, $C = x + 50$ and $D = 2x + 20$. Find the size of the largest angle.',
    options: ['$102.5°$', '$110°$', '$80°$', '$120°$'],
    correctIndex: 0,
    explanation:
      'Sum of angles $= 360°$. So $2x + 3x - 10 + x + 50 + 2x + 20 = 360 \\Rightarrow 8x + 60 = 360 \\Rightarrow x = 37.5$. The angles are $75°$, $102.5°$, $87.5°$ and $95°$, so the largest is $102.5°$.\n\n**Common mistake:** The student might assume it is a triangle and sum to $180°$, or give the value of $x$ as the final answer.',
  },
  '7-1-angles-hard-q4': {
    question:
      'Two adjacent sides of a regular octagon are extended until they meet. Find the size of the angle formed at their intersection.',
  },
  '7-1-angles-hard-q5': {
    question:
      'In a diagram with three parallel lines, angles $a$, $b$ and $c$ are marked. If $a = 75°$ and $b$ and $c$ are co-interior, find $c$.',
  },
  '7-1-angles-medium-q4': {
    question:
      'Two parallel lines are crossed by a transversal. A pair of co-interior angles are $2x$ and $3x + 20$. Find the value of $x$.',
  },
  '7-1-angles-pyp-q1': {
    question:
      'Work out the number of sides of a regular polygon where each interior angle is $162°$.',
  },
  '7-1-angles-pyp-q2': {
    question:
      'The diagram shows a regular hexagon $ABCDEF$. Find the size of angle $FDE$.',
    explanation:
      'In a regular hexagon, each interior angle is $120°$. Triangle $FED$ is isosceles with $FE = ED$, so $\\angle FED = 120°$ and $\\angle FDE = (180 - 120) / 2 = 30°$.\n\n**Common mistake:** A student might assume the triangle is equilateral and answer $60°$ or give the full interior angle $120°$.',
  },
  '7-1-angles-pyp-q3': {
    question:
      'The sum of the interior angles of a polygon is $2340°$. Find the number of sides, $n$.',
  },
  '7-2-symmetry-medium-q1': {
    question:
      'In kite $ABCD$, $AB = AD$ and $BC = CD$. If $\\angle ABC = 115°$, use symmetry to find the size of angle $ADC$.',
  },
  '7-3-circle-theorems-easy-q4': {
    question:
      'Points $P$, $Q$, $R$ and $S$ lie on a circle. If $\\angle PQS = 42°$, find the size of angle $PRS$.',
  },
  '7-3-circle-theorems-hard-q1': {
    question:
      '$PR$ is a diameter of a circle. In cyclic quadrilateral $PQRS$, if $\\angle RPQ = 28°$, calculate the size of angle $QSR$.',
    correctIndex: 1,
    explanation:
      'In triangle $PRQ$, $\\angle PRQ = 90°$ (angle in a semicircle). So $\\angle PQR = 180 - 90 - 28 = 62°$. Angles $\\angle QSR$ and $\\angle PQR$ are subtended by the same arc $QR$, so $\\angle QSR = 62°$.\n\n**Common mistake:** The student might assume $\\angle QSR = \\angle RPQ = 28°$ without checking which arc the angles are subtended by.',
  },
  '7-3-circle-theorems-hard-q2': {
    question:
      'Point $T$ lies outside a circle. Tangents $TA$ and $TC$ touch the circle at $A$ and $C$, and $O$ lies on the line through $T$ and $C$. If $\\angle ATC = 36°$, calculate the size of the minor angle $AOC$ at the centre.',
    explanation:
      'In triangle $TAO$, $\\angle TAO = 90°$ (radius-tangent). So $\\angle AOT = 180 - 90 - 36 = 54°$. The minor angle $\\angle AOC = 54°$.\n\n**Common mistake:** A student might forget the $90°$ tangent rule or misinterpret the position of the centre on the line.',
  },
  '7-3-circle-theorems-hard-q3': {
    question:
      'In a circle, chords $AD$ and $BC$ intersect at $X$. If $\\angle ABC = 38°$ and $\\angle BCD = 44°$, calculate the size of $\\angle AXB$.',
    correctIndex: 1,
    explanation:
      '$\\angle BAD = \\angle BCD = 44°$ (angles in the same segment, arc $BD$). In triangle $ABX$, $\\angle AXB = 180 - (38 + 44) = 98°$.\n\n**Common mistake:** The student might add the two given angles directly without finding the third angle of the triangle.',
  },
  '7-3-circle-theorems-hard-q4': {
    question:
      'A tangent $XY$ touches a circle at $P$. Points $Q$ and $R$ lie on the circle with $\\angle RPQ = 50°$ and $\\angle RQP = 70°$. Calculate the acute angle between the tangent $XY$ and chord $PQ$.',
  },
  '7-3-circle-theorems-hard-q5': {
    question:
      'The vertices of cyclic quadrilateral $ABCD$ lie on a circle, and $AB \\parallel DC$. If $\\angle ABC = 105°$, calculate the size of $\\angle BCD$.',
    explanation:
      'Opposite angles of a cyclic quadrilateral sum to $180°$, so $\\angle ADC = 75°$. Since $AB \\parallel DC$, $\\angle DAB$ and $\\angle ADC$ are co-interior, so $\\angle DAB = 105°$. Also $\\angle DAB + \\angle BCD = 180°$, so $\\angle BCD = 75°$.\n\n**Common mistake:** The student might assume $\\angle BCD = 105°$ because they see parallel lines and think of alternate angles.',
  },
  '7-3-circle-theorems-medium-q1': {
    question:
      'A cyclic quadrilateral $ABCD$ has $\\angle A = 2x + 10$ and $\\angle C = x + 50$. Determine the value of $x$.',
  },
  '7-3-circle-theorems-medium-q2': {
    question:
      'Two tangents are drawn from an external point $T$ to touch a circle at $A$ and $B$. If $\\angle ATB = 40°$, calculate the size of angle $ABT$.',
    explanation:
      'Tangents from an external point are equal in length, so triangle $TAB$ is isosceles with $TA = TB$. Therefore $\\angle ABT = (180 - 40) \\div 2 = 70°$.\n\n**Common mistake:** A student might assume the triangle is equilateral or forget to divide the remaining $140°$ by 2.',
  },
  '7-3-circle-theorems-medium-q3': {
    question:
      'In the diagram, $O$ is the centre of the circle. If $\\angle BAC = x$ and reflex $\\angle BOC = 250°$, find $x$.',
  },
  '7-3-circle-theorems-medium-q4': {
    question:
      'A tangent at $P$ touches a circle. The angle between the tangent and chord $PQ$ is $64°$. According to the Alternate Segment Theorem, what is the size of the angle in the alternate segment subtended by chord $PQ$?',
  },
  '7-3-circle-theorems-medium-q5': {
    question:
      'In a circle with centre $O$, $OA = OB$ and $\\angle OAB = 25°$. Calculate the angle subtended by arc $AB$ at the circumference.',
    explanation:
      'Triangle $OAB$ is isosceles with $OA = OB$, so $\\angle OBA = 25°$. Angle at the centre $\\angle AOB = 180 - (25 + 25) = 130°$. Angle at the circumference is $130 \\div 2 = 65°$.\n\n**Common mistake:** The student might think the angle at the circumference equals the base angle $25°$ or double it to $50°$.',
  },
  '7-3-circle-theorems-pyp-q1': {
    question:
      'Points $A$, $B$, $C$ and $D$ lie on a circle with centre $O$. If $\\angle AOC = 124°$, write down the size of $\\angle ABC$.',
  },
  '7-4-constructions-hard-q1': {
    question:
      'An angle $XOY$ is $80°$. A point $P$ is equidistant from $OX$ and $OY$, and $5\\text{ cm}$ from the vertex $O$. Find the size of angle $POX$.',
  },
  '7-4-constructions-hard-q3': {
    options: [
      'Equilateral triangle $\\rightarrow$ Angle bisector $\\rightarrow$ Angle bisector',
      'Perpendicular bisector $\\rightarrow$ Angle bisector $\\rightarrow$ Angle bisector',
      'Equilateral triangle $\\rightarrow$ Perpendicular bisector',
      'Perpendicular bisector $\\rightarrow$ Angle bisector',
    ],
  },
  '7-4-constructions-hard-q5': {
    question:
      'Construct triangle $ABC$ with $AB = 9\\text{ cm}$, $BC = 7\\text{ cm}$ and $AC = 5\\text{ cm}$. The perpendicular bisector of $AB$ meets $BC$ at $X$. Which statement is true about $AX$ and $BX$?',
  },
  '7-4-constructions-medium-q5': {
    question:
      'A rhombus $ABCD$ has side length $7\\text{ cm}$. If $\\angle ABC = 120°$, what is the length of the diagonal $AC$?',
    explanation:
      'In a rhombus with a $120°$ angle, the other interior angle is $60°$. Since $\\angle ABC = 120°$, $AC$ is the long diagonal and is longer than the sides.\n\n**Common mistake:** The student might assume $AC = 7\\text{ cm}$, but $AC$ spans the $120°$ angle and is significantly longer than the sides.',
  },
  '7-4-constructions-pyp-q2': {
    question:
      'Using a ruler and compasses only, construct the perpendicular bisector of a line $AB$. If $P$ is a point on this bisector, which statement must be true?',
    explanation:
      'The perpendicular bisector is the locus of all points equidistant from $A$ and $B$.\n\n**Common mistake:** A student might think the line is $90°$ to segments $PA$ and $PB$ rather than to $AB$.',
  },
  '7-5-nets-hard-q1': {
    question:
      'The net of a closed rectangular box has dimensions $a$, $b$ and $c$. The volume is $480\\text{ cm}^3$ and the net shows two rectangles of $8\\text{ cm} \\times 6\\text{ cm}$. Find the third dimension $c$.',
  },
  '7-5-nets-hard-q2': {
    question:
      'A net is being designed for a cylinder of height $10\\text{ cm}$ and radius $r$. The curved surface area is $60\\pi\\text{ cm}^2$. Find the value of $r$.',
  },
  '7-5-nets-hard-q3': {
    question:
      'A net for a right-angled triangular prism is made. The triangular faces have sides $3\\text{ cm}$, $4\\text{ cm}$ and $5\\text{ cm}$. The prism length is $L$. The total surface area is $132\\text{ cm}^2$. Find $L$.',
  },
  '7-5-nets-hard-q5': {
    question:
      'The net of a cone consists of a circle of radius $3\\text{ cm}$ and a sector of a larger circle with radius $R$. Find the arc length of the sector, leaving your answer in terms of $\\pi$.',
    explanation:
      'The arc length of the sector must equal the circumference of the circular base. $C = 2\\pi r = 2\\pi(3) = 6\\pi\\text{ cm}$.\n\n**Common mistake:** A student might use $\\pi r^2$ or $2\\pi r^2$ instead of the circumference.',
  },
  '7-5-nets-medium-q1': {
    explanation:
      'An open-topped box has only 5 faces. Area of one square $= 4 \\times 4 = 16\\text{ cm}^2$. Total area $= 5 \\times 16 = 80\\text{ cm}^2$.\n\n**Common mistake:** Students often calculate the area for a closed cube (6 faces), leading to $96\\text{ cm}^2$.',
  },
  '7-5-nets-medium-q3': {
    question:
      'In a standard cube net, face $A$ is the base. Which face will be opposite face $A$ when the net is folded?',
  },
  '7-5-nets-medium-q5': {
    question:
      'Consider the net of a cuboid with dimensions $x$, $y$ and $z$. If $x = 2$, $y = 3$ and $z = 5$, how many rectangles in the net have an area of $10$ square units?',
    explanation:
      'The possible face areas are $xy = 6$, $xz = 10$ and $yz = 15$. Each pair appears twice on the net, so there are two rectangles with area $10$.\n\n**Common mistake:** The student might assume all faces are the same or only count one face of the pair.',
  },
  '7-5-nets-pyp-q4': {
    question:
      'Show that the total surface area of a cube with side length $s$ is $6s^2$. If $s = 0.5\\text{ m}$, what is the area of the net in $\\text{cm}^2$?',
    options: [
      '$15000\\text{ cm}^2$',
      '$1500\\text{ cm}^2$',
      '$1.5\\text{ cm}^2$',
      '$6000\\text{ cm}^2$',
    ],
  },
  '12-1-12-3-vectors-hard-q2': {
    question:
      'Given position vectors $\\vec{OA} = 4\\mathbf{a}$ and $\\vec{OB} = 6\\mathbf{b}$. Point $N$ lies on $AB$ such that $AN : NB = 1 : 2$. Express $\\vec{ON}$ in terms of $\\mathbf{a}$ and $\\mathbf{b}$.',
  },
  '12-1-12-3-vectors-medium-q5': {
    question:
      'The vector $\\begin{pmatrix} m \\\\ 15 \\end{pmatrix}$ is parallel to $\\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix}$. Calculate the value of $m$.',
  },
  '12-4-12-5-transformations-easy-q3': {
    question:
      'A triangle with an area of $10\\text{ cm}^2$ is enlarged by a scale factor of $3$. What is the area of the resulting image?',
    options: [
      '$90\\text{ cm}^2$',
      '$30\\text{ cm}^2$',
      '$100\\text{ cm}^2$',
      '$60\\text{ cm}^2$',
    ],
  },
  '12-4-12-5-transformations-medium-q1': {
    question:
      'The point $A(1, 2)$ is reflected in the line $y = x$. Write down the coordinates of $A\'$.',
  },
  '12-4-12-5-transformations-pyp-q2': {
    question:
      'Triangle $P$ is mapped onto triangle $Q$ by translation $\\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix}$. Triangle $Q$ is mapped onto triangle $R$ by translation $\\begin{pmatrix} -1 \\\\ 4 \\end{pmatrix}$. Describe the single transformation that maps $P$ onto $R$.',
  },
  '12-4-12-5-transformations-pyp-q4': {
    question:
      'Triangle $ABC$ is mapped onto triangle $A\'B\'C\'$ by a reflection in the line $x = 1$. If $A$ is at $(4, 3)$, work out the coordinates of $A\'$.',
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

console.log(`Repaired ${files} Maths 0580 Ch.4 quiz files (${questions} questions).`)
