#!/usr/bin/env node
/**
 * Repair Add Math Ch.13 vectors quiz JSON.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizDir = path.join(__dirname, '..', 'content', 'quizzes', 'add-maths-0606')

const topicIds = [
  '13-1-further-vector-notation',
  '13-2-position-vectors',
  '13-3-vector-geometry-harder-topic',
  '13-4-constant-velocity-problems-harder-topic',
]

const INDEX_FIXES = {
  '13-3-vector-geometry-harder-topic-medium-q3': 1,
}

const OVERRIDES = {
  // ── 13.1 Further vector notation ───────────────────────────────
  '13-1-further-vector-notation-easy-q1': {
    question: 'Find the magnitude of the vector $\\mathbf{a} = 8\\mathbf{i} - 15\\mathbf{j}$.',
    explanation:
      'The magnitude is $|x\\mathbf{i} + y\\mathbf{j}| = \\sqrt{x^2 + y^2}$. Here, $\\sqrt{8^2 + (-15)^2} = \\sqrt{289} = 17$.\n\n**Common mistake:** Option B is obtained by simply adding the components ($8 + 15$) without squaring and taking the root.',
  },
  '13-1-further-vector-notation-easy-q2': {
    question:
      'Write the column vector $\\begin{pmatrix} -3 \\\\ 4 \\end{pmatrix}$ in $\\mathbf{i}, \\mathbf{j}$ notation.',
    options: ['$-3\\mathbf{i} + 4\\mathbf{j}$', '$3\\mathbf{i} - 4\\mathbf{j}$', '$4\\mathbf{i} - 3\\mathbf{j}$', '$-3\\mathbf{i} - 4\\mathbf{j}$'],
    explanation:
      'A column vector $\\begin{pmatrix} x \\\\ y \\end{pmatrix}$ corresponds directly to $x\\mathbf{i} + y\\mathbf{j}$.\n\n**Common mistake:** Option C is a common error where the student swaps the $x$ and $y$ components.',
  },
  '13-1-further-vector-notation-easy-q3': {
    question: 'Find the unit vector in the direction of $5\\mathbf{j}$.',
    options: ['$\\mathbf{j}$', '$5\\mathbf{j}$', '$\\frac{1}{5}\\mathbf{j}$', '$0$'],
  },
  '13-1-further-vector-notation-easy-q4': {
    question: 'Calculate the magnitude of the vector $\\mathbf{v} = -6\\mathbf{i} - 8\\mathbf{j}$.',
    explanation:
      'Magnitude is $\\sqrt{(-6)^2 + (-8)^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10$.\n\n**Common mistake:** Option B occurs if a student incorrectly carries the negative signs outside the squares.',
  },
  '13-1-further-vector-notation-easy-q5': {
    question: 'If $\\mathbf{p} = 2\\mathbf{i} + 3\\mathbf{j}$, find the vector $4\\mathbf{p}$.',
    options: ['$8\\mathbf{i} + 12\\mathbf{j}$', '$6\\mathbf{i} + 7\\mathbf{j}$', '$8\\mathbf{i} + 3\\mathbf{j}$', '$2\\mathbf{i} + 12\\mathbf{j}$'],
  },
  '13-1-further-vector-notation-medium-q1': {
    question: 'Given $\\mathbf{u} = 3\\mathbf{i} - \\mathbf{j}$ and $\\mathbf{v} = \\mathbf{i} + 4\\mathbf{j}$, find the magnitude of $\\mathbf{u} + 2\\mathbf{v}$.',
    options: ['$\\sqrt{74}$', '$\\sqrt{50}$', '$5\\mathbf{i} + 7\\mathbf{j}$', '$12$'],
    explanation:
      '$\\mathbf{u} + 2\\mathbf{v} = (3\\mathbf{i} - \\mathbf{j}) + (2\\mathbf{i} + 8\\mathbf{j}) = 5\\mathbf{i} + 7\\mathbf{j}$. Magnitude is $\\sqrt{5^2 + 7^2} = \\sqrt{74}$.\n\n**Common mistake:** Option C is the vector itself, whereas the question asks for the magnitude.',
  },
  '13-1-further-vector-notation-medium-q2': {
    question:
      'Find the value of the constant $k$ such that $|k\\mathbf{i} + 12\\mathbf{j}| = 13$, where $k > 0$.',
    options: ['$5$', '$1$', '$25$', '$\\sqrt{313}$'],
    explanation:
      '$\\sqrt{k^2 + 12^2} = 13 \\implies k^2 + 144 = 169 \\implies k^2 = 25 \\implies k = 5$.\n\n**Common mistake:** Option D is $\\sqrt{13^2 + 12^2}$, incorrectly adding squares of the magnitude and a component.',
  },
  '13-1-further-vector-notation-medium-q3': {
    question: 'Find the unit vector in the direction of $\\mathbf{b} = 7\\mathbf{i} + 24\\mathbf{j}$.',
    options: ['$\\frac{7}{25}\\mathbf{i} + \\frac{24}{25}\\mathbf{j}$', '$\\frac{1}{25}(7\\mathbf{i} - 24\\mathbf{j})$', '$7\\mathbf{i} + 24\\mathbf{j}$', '$0.28\\mathbf{i} + 0.96\\mathbf{j}$'],
    explanation:
      'Magnitude is $\\sqrt{7^2 + 24^2} = 25$. Unit vector is $\\mathbf{b}/25 = \\frac{7}{25}\\mathbf{i} + \\frac{24}{25}\\mathbf{j}$.\n\n**Common mistake:** Option B is chosen if the student incorrectly applies a sign change to the $\\mathbf{j}$ component.',
  },
  '13-1-further-vector-notation-medium-q4': {
    question:
      'Vector $\\vec{AB}$ has starting point $A(2, 5)$ and ending point $B(5, 9)$. Express $\\vec{AB}$ in $\\mathbf{i}, \\mathbf{j}$ form.',
    options: ['$3\\mathbf{i} + 4\\mathbf{j}$', '$7\\mathbf{i} + 14\\mathbf{j}$', '$-3\\mathbf{i} - 4\\mathbf{j}$', '$4\\mathbf{i} + 3\\mathbf{j}$'],
    explanation:
      '$\\vec{AB} = (5-3)\\mathbf{i} + (9-5)\\mathbf{j} = 3\\mathbf{i} + 4\\mathbf{j}$.\n\n**Common mistake:** Option B is $\\vec{OA} + \\vec{OB}$, which does not represent the displacement vector.',
  },
  '13-1-further-vector-notation-medium-q5': {
    question: 'Find the vector of magnitude $20$ that is in the direction of $3\\mathbf{i} - 4\\mathbf{j}$.',
    options: ['$12\\mathbf{i} - 16\\mathbf{j}$', '$60\\mathbf{i} - 80\\mathbf{j}$', '$3\\mathbf{i} - 4\\mathbf{j}$', '$15\\mathbf{i} - 20\\mathbf{j}$'],
  },
  '13-1-further-vector-notation-hard-q1': {
    question:
      'The vector $\\mathbf{v} = t\\mathbf{i} + 6\\mathbf{j}$ is parallel to $\\mathbf{w} = 2\\mathbf{i} - 3\\mathbf{j}$. Find the value of $t$.',
  },
  '13-1-further-vector-notation-hard-q2': {
    question:
      'Find the value of $x$ for which $x\\mathbf{i} + 0.6\\mathbf{j}$ is a unit vector, where $x > 0$.',
    explanation:
      'For a unit vector, $\\sqrt{x^2 + 0.6^2} = 1 \\implies x^2 + 0.36 = 1 \\implies x^2 = 0.64 \\implies x = 0.8$.\n\n**Common mistake:** Option D is the value of $x^2$, where the student forgets to take the final square root.',
  },
  '13-1-further-vector-notation-hard-q3': {
    question:
      'A vector $\\mathbf{r}$ has magnitude $10$ and makes an angle of $120^\\circ$ with the positive $x$-axis. Express $\\mathbf{r}$ in $\\mathbf{i}, \\mathbf{j}$ form.',
    options: [
      '$-5\\mathbf{i} + 5\\sqrt{3}\\mathbf{j}$',
      '$5\\mathbf{i} + 5\\sqrt{3}\\mathbf{j}$',
      '$-5\\sqrt{3}\\mathbf{i} + 5\\mathbf{j}$',
      '$-5\\mathbf{i} - 5\\sqrt{3}\\mathbf{j}$',
    ],
    explanation:
      '$\\mathbf{r} = 10\\cos(120^\\circ)\\mathbf{i} + 10\\sin(120^\\circ)\\mathbf{j} = -5\\mathbf{i} + 5\\sqrt{3}\\mathbf{j}$.\n\n**Common mistake:** Option C swaps the sine and cosine components.',
  },
  '13-1-further-vector-notation-hard-q4': {
    question:
      'Given $\\mathbf{a} = \\mathbf{i} + 2\\mathbf{j}$ and $\\mathbf{b} = 3\\mathbf{i} - \\mathbf{j}$, find the values of $h$ and $k$ such that $h\\mathbf{a} + k\\mathbf{b} = 7\\mathbf{i}$.',
    options: ['$h=1, k=2$', '$h=2, k=1$', '$h=7, k=0$', '$h=-1, k=3$'],
  },
  '13-1-further-vector-notation-hard-q5': {
    question:
      'The points $P$ and $Q$ have position vectors $3\\mathbf{i} + 4\\mathbf{j}$ and $x\\mathbf{i} - 8\\mathbf{j}$ respectively. If $|\\vec{PQ}| = 13$ and $x > 0$, find the value of $x$.',
    explanation:
      '$\\vec{PQ} = (x-3)\\mathbf{i} + (-12)\\mathbf{j}$. Then $(x-3)^2 + 144 = 169 \\implies (x-3)^2 = 25 \\implies x-3 = 5 \\implies x = 8$.\n\n**Common mistake:** Option B is the root $(x-3)=5$ before solving for $x$.',
  },
  '13-1-further-vector-notation-pyp-q1': {
    question:
      'The vectors $\\mathbf{a}$ and $\\mathbf{b}$ are such that $\\mathbf{a} = 4\\mathbf{i} + 3\\mathbf{j}$ and $\\mathbf{b} = m\\mathbf{i} + \\mathbf{j}$. Given that $|\\mathbf{a} + \\mathbf{b}| = 5$, find the possible values of $m$.',
    explanation:
      '$\\mathbf{a} + \\mathbf{b} = (4+m)\\mathbf{i} + 4\\mathbf{j}$. So $(4+m)^2 + 16 = 25 \\implies (4+m)^2 = 9 \\implies 4+m = \\pm 3 \\implies m = -1$ or $-7$.\n\n**Common mistake:** Option B is a sign error where the student solves $4+m=3$ as $m=7$.',
  },
  '13-1-further-vector-notation-pyp-q2': {
    question: 'Find the unit vector in the direction of the vector $7\\mathbf{i} - 24\\mathbf{j}$.',
    options: [
      '$\\frac{1}{25}(7\\mathbf{i} - 24\\mathbf{j})$',
      '$\\frac{7}{25}\\mathbf{i} + \\frac{24}{25}\\mathbf{j}$',
      '$\\frac{1}{25}(7\\mathbf{i} + 24\\mathbf{j})$',
      '$25\\mathbf{i} - 25\\mathbf{j}$',
    ],
    explanation:
      'The magnitude is $\\sqrt{7^2 + (-24)^2} = 25$. The unit vector is the original vector divided by its magnitude.\n\n**Common mistake:** Option B fails to carry the negative sign from the original vector\'s $\\mathbf{j}$ component.',
  },
  '13-1-further-vector-notation-pyp-q3': {
    question:
      'The vectors $\\mathbf{p}$ and $\\mathbf{q}$ are given by $\\mathbf{p} = 2\\mathbf{i} + \\mathbf{j}$ and $\\mathbf{q} = 3\\mathbf{i} - 2\\mathbf{j}$. Find the value of $\\lambda$ for which $\\lambda\\mathbf{p} + \\mathbf{q}$ is parallel to $\\mathbf{i}$.',
  },
  '13-1-further-vector-notation-pyp-q4': {
    question:
      'Show that the magnitude of the vector $\\mathbf{r} = (1-k)\\mathbf{i} + 2\\sqrt{k}\\,\\mathbf{j}$ is $1 + k$.',
    options: ['$1+k$', '$1-k$', '$\\sqrt{1+k^2}$', '$k$'],
    explanation:
      '$|\\mathbf{r}|^2 = (1-k)^2 + (2\\sqrt{k})^2 = 1 - 2k + k^2 + 4k = k^2 + 2k + 1 = (1+k)^2$. Thus the magnitude is $1+k$.\n\n**Common mistake:** Option C results from failing to include the middle term when expanding the squared bracket.',
  },
  '13-1-further-vector-notation-pyp-q5': {
    question:
      'Given that $\\mathbf{a} = 3\\mathbf{i} - 4\\mathbf{j}$ and $\\mathbf{b} = \\mathbf{i} + p\\mathbf{j}$, find the value of $p$ for which $\\mathbf{a} - 2\\mathbf{b}$ has magnitude $5$ and $p > 0$.',
    explanation:
      '$\\mathbf{a} - 2\\mathbf{b} = \\mathbf{i} - (4+2p)\\mathbf{j}$. So $1 + (4+2p)^2 = 25 \\implies (4+2p)^2 = 24 \\implies 4+2p = 2\\sqrt{6} \\implies p = \\sqrt{6} - 2 \\approx 0.45$. Option A is nearest.\n\n**Common mistake:** Option B results from ignoring the $\\mathbf{i}$-component completely in the magnitude calculation.',
  },

  // ── 13.2 Position vectors ──────────────────────────────────────
  '13-2-position-vectors-easy-q3': {
    options: ['$\\mathbf{b} - \\mathbf{a}$', '$\\mathbf{a} - \\mathbf{b}$', '$\\mathbf{a} + \\mathbf{b}$', '$\\mathbf{b} + \\mathbf{a}$'],
    explanation:
      'By vector addition, $\\vec{OA} + \\vec{AB} = \\vec{OB}$. Thus, $\\vec{AB} = \\vec{OB} - \\vec{OA} = \\mathbf{b} - \\mathbf{a}$.\n\n**Common mistake:** Reversing the subtraction to $\\mathbf{a} - \\mathbf{b}$.',
  },
  '13-2-position-vectors-hard-q4': {
    options: ['$x^2 + y^2 = 25$', '$x + y = 5$', '$x^2 + y^2 = 5$', '$y = mx + c$'],
  },

  // ── 13.3 Vector geometry ─────────────────────────────────────
  '13-3-vector-geometry-harder-topic-easy-q1': {
    question:
      'In triangle $OAB$, $\\vec{OA} = \\mathbf{a}$ and $\\vec{OB} = \\mathbf{b}$. Express the vector $\\vec{AB}$ in terms of $\\mathbf{a}$ and $\\mathbf{b}$.',
    explanation:
      'To go from $A$ to $B$, travel from $A$ to $O$ ($-\\mathbf{a}$) and then from $O$ to $B$ ($\\mathbf{b}$), giving $\\mathbf{b} - \\mathbf{a}$.\n\n**Common mistake:** Option B is a common direction error where the student subtracts the destination vector from the start vector.',
  },
  '13-3-vector-geometry-harder-topic-easy-q3': {
    question:
      'Given that $\\vec{OM} = \\mathbf{m}$ and $\\vec{ON} = \\mathbf{n}$, find the position vector of the midpoint of $MN$.',
  },
  '13-3-vector-geometry-harder-topic-easy-q4': {
    question:
      'Vectors $\\mathbf{p}$ and $\\mathbf{q}$ are not parallel. If $k\\mathbf{p} = 5\\mathbf{p}$, state the value of $k$.',
  },
  '13-3-vector-geometry-harder-topic-easy-q5': {
    question:
      'In a parallelogram $ABCD$, $\\vec{AB} = \\mathbf{p}$ and $\\vec{BC} = \\mathbf{q}$. Express $\\vec{AD}$ in terms of $\\mathbf{p}$ and $\\mathbf{q}$.',
    explanation:
      'In a parallelogram, opposite sides are equal and parallel, so $\\vec{AD} = \\vec{BC} = \\mathbf{q}$.\n\n**Common mistake:** Option B is chosen if the student mistakenly identifies the parallel side as $AB$ instead of $BC$.',
  },
  '13-3-vector-geometry-harder-topic-medium-q1': {
    question:
      'In triangle $OAB$, $M$ is the midpoint of $AB$. Given $\\vec{OA} = \\mathbf{a}$ and $\\vec{OB} = \\mathbf{b}$, find $\\vec{OM}$ in terms of $\\mathbf{a}$ and $\\mathbf{b}$.',
  },
  '13-3-vector-geometry-harder-topic-medium-q2': {
    question:
      'Point $X$ divides $PQ$ internally in the ratio $PX : XQ = 1 : 3$. If $\\vec{OP} = \\mathbf{p}$ and $\\vec{OQ} = \\mathbf{q}$, find $\\vec{OX}$.',
  },
  '13-3-vector-geometry-harder-topic-medium-q3': {
    question:
      'In quadrilateral $OABC$, $\\vec{OA} = \\mathbf{a}$, $\\vec{OC} = \\mathbf{c}$, and $\\vec{CB} = 2\\mathbf{a}$. Express $\\vec{AB}$ in terms of $\\mathbf{a}$ and $\\mathbf{c}$.',
    explanation:
      '$\\vec{AB} = \\vec{AO} + \\vec{OC} + \\vec{CB} = -\\mathbf{a} + \\mathbf{c} + 2\\mathbf{a} = \\mathbf{a} + \\mathbf{c}$.\n\n**Common mistake:** Option A is a sign error where the student forgets to negate $\\vec{OA}$ when going from $A$ to $O$.',
  },
  '13-3-vector-geometry-harder-topic-medium-q4': {
    question:
      'Points $A$, $B$, and $C$ are such that $\\vec{AB} = 3\\mathbf{k}$ and $\\vec{BC} = 5\\mathbf{k}$. What can be concluded about $A$, $B$, and $C$?',
  },
  '13-3-vector-geometry-harder-topic-medium-q5': {
    question:
      'In a hexagon $ABCDEF$, $\\vec{AB} = \\mathbf{a}$ and $\\vec{BC} = \\mathbf{b}$. Express $\\vec{AC}$ in terms of $\\mathbf{a}$ and $\\mathbf{b}$.',
  },
  '13-3-vector-geometry-harder-topic-hard-q1': {
    question:
      'In triangle $OAB$, $P$ lies on $OA$ such that $OP : PA = 2 : 1$ and $Q$ is the midpoint of $AB$. Given $\\vec{OA} = \\mathbf{a}$ and $\\vec{OB} = \\mathbf{b}$, find $\\vec{PQ}$.',
  },
  '13-3-vector-geometry-harder-topic-hard-q2': {
    question:
      'In parallelogram $OABC$, $M$ is the midpoint of $BC$ and $OM$ intersects $AC$ at $X$. Given $\\vec{OA} = \\mathbf{a}$ and $\\vec{OC} = \\mathbf{c}$, and $\\vec{OX} = k\\vec{OM}$, find $k$.',
    explanation:
      '$\\vec{OM} = \\mathbf{c} + 0.5\\mathbf{a}$. Also $X$ lies on $AC$, so $\\vec{OX} = (1-m)\\mathbf{a} + m\\mathbf{c}$ for some $m$. Equating with $k(\\mathbf{c} + 0.5\\mathbf{a})$ gives $m = k$ and $1-m = 0.5k$, so $k = 2/3$.\n\n**Common mistake:** Option B is a common guess for intersection points without performing the formal coefficient comparison.',
  },
  '13-3-vector-geometry-harder-topic-hard-q3': {
    question:
      'Points $O$, $A$, and $B$ have $\\vec{OA} = \\mathbf{a}$ and $\\vec{OB} = \\mathbf{b}$. Point $C$ lies on the line through $B$ such that $OB : BC = 1 : 2$. Find $\\vec{AC}$.',
    explanation:
      'Since $OB : BC = 1 : 2$, $\\vec{OC} = 3\\vec{OB} = 3\\mathbf{b}$. Then $\\vec{AC} = \\vec{AO} + \\vec{OC} = -\\mathbf{a} + 3\\mathbf{b}$.\n\n**Common mistake:** Option B occurs if the student interprets the ratio as $OC : OB$ instead of $OB : BC$.',
  },
  '13-3-vector-geometry-harder-topic-hard-q4': {
    explanation:
      'For parallel vectors, one must be a scalar multiple of the other. Since the coefficient of $\\mathbf{a}$ triples (from $1$ to $3$), the coefficient of $\\mathbf{b}$ must also triple: $2 \\times 3 = 6$.\n\n**Common mistake:** Option C is chosen by students who assume the constant $k$ must match the multiplier of the first component.',
  },
  '13-3-vector-geometry-harder-topic-hard-q5': {
    question:
      'In triangle $OAB$, $X$ lies on $OA$ and $Y$ lies on $OB$ such that $OY = 2YB$ and $AY$ intersects $BX$ at $P$. Express $\\vec{OP}$ in terms of $\\mathbf{a}$ and $\\mathbf{b}$.',
    explanation:
      'Using the vector intersection method, $\\vec{OP} = \\frac{1}{5}\\mathbf{a} + \\frac{2}{5}\\mathbf{b} = 0.2\\mathbf{a} + 0.4\\mathbf{b}$.\n\n**Common mistake:** Option B is a common error where students swap the coefficients for the two base vectors.',
  },
  '13-3-vector-geometry-harder-topic-pyp-q1': {
    question:
      'The position vectors of $A$ and $B$ from $O$ are $\\mathbf{a}$ and $\\mathbf{b}$ respectively. Point $P$ lies on the line through $AB$ produced such that $AB : BP = 1 : 2$. Find the position vector of $P$.',
    explanation:
      '$\\vec{AP} = 3\\vec{AB} = 3(\\mathbf{b} - \\mathbf{a})$. Then $\\vec{OP} = \\vec{OA} + \\vec{AP} = \\mathbf{a} + 3\\mathbf{b} - 3\\mathbf{a} = 3\\mathbf{b} - 2\\mathbf{a}$.\n\n**Common mistake:** Option B results from assuming $P$ lies between $A$ and $B$, rather than using the external ratio correctly.',
  },
  '13-3-vector-geometry-harder-topic-pyp-q2': {
    question:
      'In triangle $OAB$, $\\vec{OA} = \\mathbf{a}$ and $\\vec{OB} = \\mathbf{b}$. $M$ is the midpoint of $OA$ and $N$ divides $AB$ internally in the ratio $AN : NB = 1 : 2$. Express $\\vec{MN}$ in its simplest form.',
  },
  '13-3-vector-geometry-harder-topic-pyp-q3': {
    question:
      'Given that $\\vec{OX} = 2\\mathbf{a} + 3\\mathbf{b}$ and $\\vec{OY} = 6\\mathbf{a} + 9\\mathbf{b}$, show that $O$, $X$, and $Y$ are collinear and find the ratio $OX : XY$.',
    explanation:
      '$\\vec{OY} = 3\\vec{OX}$, which proves collinearity. Also $\\vec{XY} = \\vec{OY} - \\vec{OX} = 2\\vec{OX}$, so $OX : XY = 1 : 2$.\n\n**Common mistake:** Option B is the ratio $OX : OY$ instead of $OX : XY$.',
  },
  '13-3-vector-geometry-harder-topic-pyp-q4': {
    question:
      'In triangle $ABC$, $\\vec{AB} = \\mathbf{c}$ and $\\vec{AC} = \\mathbf{b}$. $M$ is the midpoint of $BC$. Express $\\vec{AM}$ in terms of $\\mathbf{b}$ and $\\mathbf{c}$.',
    explanation:
      '$\\vec{AM} = \\vec{AB} + 0.5\\vec{BC} = \\mathbf{c} + 0.5(\\mathbf{b} - \\mathbf{c}) = 0.5\\mathbf{b} + 0.5\\mathbf{c}$.\n\n**Common mistake:** Option B is the vector from $B$ to $M$, not from $A$ to $M$.',
  },
  '13-3-vector-geometry-harder-topic-pyp-q5': {
    question:
      'The points $P$, $Q$, and $R$ have position vectors $\\mathbf{p}$, $\\mathbf{q}$, and $\\mathbf{r}$ respectively. If $3\\mathbf{p} - 2\\mathbf{q} - \\mathbf{r} = \\mathbf{0}$, find the ratio in which $Q$ divides $PR$.',
    explanation:
      'Rearranging: $2\\mathbf{q} = 3\\mathbf{p} - \\mathbf{r}$, so $\\mathbf{q}$ divides $PR$ internally in the ratio $1 : 2$.\n\n**Common mistake:** Ratio problems from equation forms are highly prone to inversion errors ($2:1$ vs $1:2$).',
  },

  // ── 13.4 Constant velocity ─────────────────────────────────────
  '13-4-constant-velocity-problems-harder-topic-pyp-q2': {
    question:
      'A particle travels with velocity $k(2\\mathbf{i} + \\mathbf{j})$. If its speed is $\\sqrt{20}$ m/s, find the positive value of $k$.',
    options: ['$2$', '$4$', '$\\sqrt{2}$', '$10$'],
  },
  '13-4-constant-velocity-problems-harder-topic-pyp-q5': {
    question:
      'A motorboat travels at $15$ km/h in a direction $060^\\circ$. Express its velocity as $x\\mathbf{i} + y\\mathbf{j}$ km/h.',
    options: ['$13.0\\mathbf{i} + 7.5\\mathbf{j}$', '$7.5\\mathbf{i} + 13.0\\mathbf{j}$', '$15\\mathbf{i} + 15\\mathbf{j}$', '$12\\mathbf{i} + 9\\mathbf{j}$'],
  },
}

function fixBrokenSqrt(text) {
  return text.replace(/\(\s*\n+\s*([^)\n]+)\)/g, (_, inner) => {
    const t = inner.trim()
    if (/^[\d.+\-*/^$\\{}()a-zA-Z\s]+$/.test(t)) {
      return `$\\sqrt{${t.replace(/\$/g, '')}}$`
    }
    return `(${inner})`
  })
}

function fixCh13Artifacts(text) {
  if (!text || typeof text !== 'string') return text
  let t = text

  t = fixBrokenSqrt(t)

  // j^2 / i,j^2 — docx ate full stop as ^2
  t = t.replace(/([ij])\^2\s+(Find|Given|Express|Show|Calculate|If|The|find)/g, '$1. $2')
  t = t.replace(/([ij])\^2\s*,/g, '$1,')
  t = t.replace(/([ij])\^2\s*$/gm, '$1.')

  // Unclosed $ before final period on single-letter variables
  t = t.replace(/\$([a-zA-Z]{1,3})\.(?!\$)/g, '$$$1$.')

  // Fix broken column vector row breaks
  t = t.replace(/\\\\\s*\\\\/g, ' \\\\ ')

  // beginpmatrix without backslashes
  t = t.replace(/beginpmatrix/g, '\\begin{pmatrix}')
  t = t.replace(/endpmatrix/g, '\\end{pmatrix}')

  // Caret glue
  t = t.replace(/(of|from|reaches|term|first|less than|the)\^(\d+)/gi, '$1 $2')

  // Split vector labels AB on newlines
  t = t.replace(/Vector\s*\n\s*AB\s*\n/gi, 'Vector $\\vec{AB}$ ')
  t = t.replace(/\|\$\s*\n\s*PQ\s*\n+\s*\|/g, '$|\\vec{PQ}|$')
  t = t.replace(/\$\s*\n\s*PQ\s*\n+\s*\|=/g, '$|\\vec{PQ}| =')

  // Unwrap whole-question prose trapped in $...$
  t = t.replace(
    /^\$Find the value of ([^$]+)\$/,
    'Find the value of $$$1$',
  )
  t = t.replace(
    /^\$The points ([^$]+)\$/,
    'The points $$$1$',
  )

  return t
}

function repairString(val) {
  if (typeof val !== 'string') return val
  return fixCh13Artifacts(val)
}

function repairQuestion(q) {
  const id = q.id
  const next = { ...q }

  if (next.question) next.question = repairString(next.question)
  if (next.options) next.options = next.options.map((opt) => repairString(opt))
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
console.log(`Ch.13 repair done — ${files} files`)
