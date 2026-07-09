#!/usr/bin/env node
/**
 * Repair Add Math Ch.6 coordinate geometry quiz JSON (docx import artefacts).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const quizDir = path.join(root, 'content', 'quizzes', 'add-maths-0606')

const topicIds = [
  '6-1-midpoint-parallel-and-perpendicular-lines',
  '6-2-equations-of-straight-lines',
  '6-3-areas-of-rectilinear-figures',
  '6-4-converting-from-a-non-linear-equation-to-linear-form',
  '6-5-finding-relationships-from-data',
]

function fixCh6Artifacts(text) {
  if (!text || typeof text !== 'string') return text
  let t = text

  t = t.replace(/\$([A-Za-z][A-Za-z0-9_]*)\$\.\s*\$\(/g, '$$$1$ is $(')
  t = t.replace(/\$L\$\.\s*\$\(/g, 'line $L$ passes through $(')
  t = t.replace(/\$L\$\.\s*So\s+/g, 'The line is ')
  // Removed: $x$. So / $y$. So → "the $1$-coordinate" (corrupts valid prose on re-run)
  t = t.replace(/\$B\$\.\s*\$AC2AC/g, '$B$ is the midpoint of $AC$')
  t = t.replace(/\$AB2A\$/g, '$AB$')
  t = t.replace(/\$A2C\$/g, '$A$ and $C$')
  t = t.replace(/\$AB2-2\$/g, '$AB$ has gradient $-2$')
  t = t.replace(/\$m2(-?\d+(?:\.\d+)?)/g, '$m = $1$')
  t = t.replace(/\$fraction\$/g, 'fraction')
  t = t.replace(/Identifying\^(\d+)/g, 'Identifying $$1$')
  t = t.replace(/divide\^(\d+)/g, 'dividing by $$1$')
  t = t.replace(/or\^(\d+)/g, 'or $$1$')
  t = t.replace(/gradient\^(\d+)/g, 'gradient $$1$')
  t = t.replace(/\$y2y/g, '$y$')
  t = t.replace(/y2y/g, 'y')
  t = t.replace(/a2b/g, '$a$ and $b$')
  t = t.replace(/Y2X/g, '$Y$ and $X$')
  t = t.replace(/y2X/g, '$y$ and $X$')
  t = t.replace(/x2y/g, '$x$ and $y$')
  t = t.replace(/c2Y\s*=/g, ', so $Y$ =')
  t = t.replace(/c2b/g, ', so $b$')
  t = t.replace(/c2m/g, ', so $m$')
  t = t.replace(/bx2Y/g, 'bx$, plot $Y$')
  t = t.replace(/ax \+ b2Y/g, 'ax + b$, plot $Y$')
  t = t.replace(/2k22k/g, '2k =')
  t = t.replace(/and \$b2\(/g, 'and passes through $(')
  t = t.replace(/points \$A\$ and \$B2c/g, 'points $A$ and $B$ to find $c$')
  t = t.replace(/from \$B\$\.\s*\$OA/g, 'from $B$ to side $OA$')
  t = t.replace(/Line \$A\$\.\s*\$1\.5\$/g, 'Line $A$ has gradient $1.5$')
  t = t.replace(/line \$B\$\s+and\s+\$A\$/g, 'line $B$ is perpendicular to line $A$')
  t = t.replace(/Triangle \$OAB\$\.\s*\$/g, 'Triangle $OAB$ has vertices $')
  t = t.replace(/\$y\s*=\s*mx\s*\+\s*c\$\.\s*\$/g, '$y = mx + c$ is parallel to $')
  t = t.replace(/\$y = ax\^2 \+ bx\$\s+and \$x2\\/g, '$y = ax^2 + bx$ by $x$: $\\')
  t = t.replace(/Dividing the equation \$y = ax\^2 \+ bx\$\s+and \$x2\\/g, 'Dividing $y = ax^2 + bx$ by $x$ gives $\\')
  t = t.replace(/So \$Y = mX \+ c2Y/g, 'So $Y = mX + c$ with $Y$')
  t = t.replace(/\$y = a\(1\/x\) \+ b\$\.\s+So \$Y = mX \+ c2X/g, '$y = a(1/x) + b$ with $X$')
  t = t.replace(/variables \$x\$ and \$y2y/g, 'variables $x$ and $y$ follow $y')
  t = t.replace(/graph of \$\\lg y\$ and \$x2x/g, 'graph of $\\lg y$ against $x$ suggests a relationship between $x$')
  t = t.replace(/\$\\ln y\$2x/g, 'plot of $\\ln y$ against $x$')
  t = t.replace(/\$\\lg y\$2\\lg x/g, 'plot of $\\lg y$ against $\\lg x$')
  t = t.replace(/\$\\lg y\$2x/g, 'plot of $\\lg y$ against $x$')
  t = t.replace(/\$\\ln y\$2x/g, 'plot of $\\ln y$ against $x$')
  t = t.replace(/\$p\s+and q2q/g, 'variables $p$ and $q$ with $q$')
  t = t.replace(/\$1\/y\$\.\s*\$x\^2/g, 'plot $1/y$ against $x^2$')
  t = t.replace(/\$xy\$\.\s*\$x\^2/g, 'plot $xy$ against $x^2$')
  t = t.replace(/\$\\lg y\$\.\s*\$\\lg x2/g, 'plot of $\\lg y$ against $\\lg x$. Find ')
  t = t.replace(/\$x\^2\$ on the \$X\$\.\s*\$y\/x2Y/g, '$x^2$ on the $X$-axis and $y/x$ on the $Y$-axis for $y = ax^3 + bx^2$. Find $y$')
  t = t.replace(/bx2y/g, 'bx^2$. Find $y$')
  t = t.replace(/\$y\$\.\s*So \$X = x\^2/g, 'plot $Y = y$ against $X = x^2$')
  t = t.replace(/\$y\$\.\s*So \$X/g, '$Y$ and $X$')
  t = t.replace(/axes and \$Y2X/g, 'axes are $Y$ and $X$')
  t = t.replace(/law \$y = ax\^2 \+ bx\$\s+and \$a2b\$/g, 'law $y = ax^2 + bx$. Which variables should be plotted on the $Y$ and $X$ axes')
  t = t.replace(/between \$x\$ and \$y2y/g, 'between $x$ and $y$ satisfies $y')
  t = t.replace(/\$Y = mX \+ c2Y/g, '$Y = mX + c$. Which choices define $Y$')
  t = t.replace(/\$n\$\.\s*So \$y/g, '$n$ in $y$')
  t = t.replace(/\$a\$\.\s*So \$y/g, '$a$ in $y$')
  t = t.replace(/\$k\$\.\s*\$\|/g, '$k$ for which $|')
  t = t.replace(/\$x\$\.\s*\$\|/g, '$x$ for which $|')
  t = t.replace(/and \$y2y/g, 'and $y$ where $y$')
  t = t.replace(/\$y\^2 = ax \+ b\$\s+and \$y\$/g, '$y^2 = ax + b$ meets the $y$')
  t = t.replace(/the \$x\$ and \$y23x/g, 'the $x$- and $y$-axes and the line $3x')
  t = t.replace(/the \$x\$ and \$k\./g, 'the base and $k$.')
  t = t.replace(/using the \$x\$ and \$y2\\/g, 'using original $x$ and $y$ vs $\\')
  t = t.replace(/substitute \$x = k\$\.\s*So \$y = 2k22k/g, 'substitute $x = k$ and $y = 2k$ into $2k = k + 5$')
  t = t.replace(/substitute \$x = k\$\.\s*So \$y = 2k/g, 'substitute $x = k$ and $y = 2k$')
  t = t.replace(/Midpoint of \$OA\$\.\s*\$\(/g, 'Midpoint of $OA$ is $(')
  t = t.replace(/from \$B\$\.\s*\$OA\./g, 'from $B$ to $OA$.')
  t = t.replace(/on \$L\$\s+and \$x\$-axis/g, 'on $L$ that lies on the $x$-axis')
  t = t.replace(/on \$L\$\s+and \$k\./g, 'on $L$. Find $k$.')
  t = t.replace(/perpendicular to \$y = 2x\$\.\s*\$\(k/g, 'perpendicular to $y = 2x$. Point $(k')
  t = t.replace(/is perpendicular to \$y = 2x\$\.\s*\$\(k/g, 'is perpendicular to $y = 2x$. Point $(k')
  t = t.replace(/\$L\$\.\s*\$\(4,\s*5\)/g, 'Line $L$ passes through $(4, 5)$')
  t = t.replace(/as \$-3-x\./g, 'as $-3-x$.')
  t = t.replace(/as \$-3-x\$/g, 'as $-3-x$')
  t = t.replace(/, and \$x2y\$/g, ', and both $x$ and $y$')
  t = t.replace(/\$y_m\^2 So k=4\$/g, '$y_m = 6$ when $k = 4$')
  t = t.replace(/Gradient \$BC\$\.\s*\$/g, 'Gradient $BC$ is $')
  t = t.replace(/gradient of \$AB\$\.\s*\$BC\$/g, 'gradient of $AB$ or $BC$')
  t = t.replace(/gradient of \$AC\$\.\s*\$BD\$/g, 'gradient of $AC$ and $BD$')
  t = t.replace(/constant \$c\$\.\s*\$PQ\$/g, 'constant $c$, not gradient of $PQ$')
  t = t.replace(/into \$y = 2x \+ c\$\.\s*\$/g, 'into $y = 2x + c$: $')
  t = t.replace(/For \$x\$\.\s*So \$y=0/g, 'For the $x$-intercept, set $y=0$')
  t = t.replace(/the \$y\$\s+and \$x\$-axis/g, 'the $y$-intercept and $x$-axis')
  t = t.replace(/the \$y\$\s+and \$x\$/g, 'the $y$- and $x$-')
  t = t.replace(/\$y\$\s+and \$x\$-ints/g, '$y$-intercept and $x$-intercepts')
  t = t.replace(/\$2y\$/g, '$y$-intercept')
  t = t.replace(/\$\\\lg A\$\.\s*\$\\\lg/g, '$\\lg A$. Plot $\\lg')
  t = t.replace(/\$\\\ln a2\(/g, '$\\ln a$ from $(')
  t = t.replace(/\$\\\lg a2\(/g, '$\\lg a$ from $(')
  t = t.replace(/If \$x \\to 2x\$\.\s*So \$y/g, 'If $x$ is doubled, then $y$')
  t = t.replace(/\$y - 10\$\s+and \$b2\\/g, '$y - 10$ and $b \\ne 0$. Plot $\\')
  t = t.replace(/m\s+and c2y/g, 'gradient $m$ and intercept $c$ give $y$')
  t = t.replace(/and \$x2y = mx \+ c\/x/g, 'gives $y = mx + c/x$')
  t = t.replace(/and \$x2\\/g, 'gives $\\')
  t = t.replace(/, and \$b2\\/g, ', and $b \\ne 0$. Plot $\\')
  t = t.replace(/and \$Y\$\)/g, 'and $Y$)')
  t = t.replace(/and \$Y\$\?/g, 'and $Y$ axes?')
  t = t.replace(/and \$X\$\?/g, 'and $X$?')
  t = t.replace(/and \$y2X\$/g, 'and $y$ against $X$?')
  t = t.replace(/and \$y2\./g, 'and $y$.')
  t = t.replace(/and \$y2\$/g, 'and $y$?')
  t = t.replace(/, and \$a\./g, ', find $a$.')
  t = t.replace(/, and \$a\$/g, ', find $a$.')
  t = t.replace(/and \$a\$/g, ', find $a$.')
  t = t.replace(/and \$b\$/g, 'and $b$.')
  t = t.replace(/and \$n\./g, 'and $n$.')
  t = t.replace(/and \$n\$/g, 'and $n$.')
  t = t.replace(/and \$p\s+and q/g, 'and constants $p$ and $q$')
  t = t.replace(/and \$x2X/g, 'and $X = x$')
  t = t.replace(/and \$X2X/g, 'and $X$')
  t = t.replace(/and \$x2x/g, 'and $x$')
  t = t.replace(/, and\^(\d+)/g, ', and $$$1$')
  t = t.replace(/roots at \$-4, 0,\$\s+and\^4/g, 'roots at $-4, 0,$ and $4$')
  t = t.replace(/x=1, 2,\$\s+and\^3/g, 'x=1, 2,$ and $3$')
  t = t.replace(/and\^(\d+)/g, 'and $$$1$')

  return t
}

/** Full manual rewrites where auto-fix is insufficient. */
const manual = {
  '6-1-midpoint-parallel-and-perpendicular-lines-easy.json': {
    '6-1-midpoint-parallel-and-perpendicular-lines-easy-q3': {
      explanation:
        'The product of the gradients of perpendicular lines is $-1$. Thus, $m_2 = -\\frac{1}{m_1} = -\\frac{1}{2/3} = -\\frac{3}{2}$.\n\n**Common mistake:** A student may flip the fraction but forget the negative sign, or apply the negative sign without flipping the fraction.',
    },
    '6-1-midpoint-parallel-and-perpendicular-lines-easy-q4': {
      question:
        'The midpoint of a line segment $PQ$ is $(4, 1)$. If $P$ is $(1, -2)$, find the coordinates of $Q$.',
    },
    '6-1-midpoint-parallel-and-perpendicular-lines-easy-q5': {
      explanation:
        'Rearranging $3x + y = 10$ gives $y = -3x + 10$, so the gradient is $-3$. The line $y = -3x + 5$ shares the same gradient.\n\n**Common mistake:** Identifying $3$ as the gradient because it is the coefficient of $x$ before rearranging to $y = mx + c$ form.',
    },
  },
  '6-1-midpoint-parallel-and-perpendicular-lines-medium.json': {
    '6-1-midpoint-parallel-and-perpendicular-lines-medium-q1': {
      question:
        'A line $L$ passes through $(2, 3)$ and $(5, 9)$. Find the gradient of any line perpendicular to $L$.',
      explanation:
        'The gradient of $L$ is $m = \\frac{9 - 3}{5 - 2} = 2$. The perpendicular gradient is the negative reciprocal, $-\\frac{1}{2}$.\n\n**Common mistake:** Calculating the gradient correctly as 2 but failing to take the negative reciprocal for the perpendicular condition.',
    },
    '6-1-midpoint-parallel-and-perpendicular-lines-medium-q2': {
      explanation:
        'Using the $x$-coordinate: $\\frac{k + 6}{2} = 5 \\Rightarrow k = 4$. Checking the $y$-coordinate: $\\frac{4 + (4+2)}{2} = 5$, which matches the given midpoint $(5, 6)$ when $k = 4$.\n\n**Common mistake:** Failing to check that the same value of $k$ satisfies both midpoint conditions.',
    },
    '6-1-midpoint-parallel-and-perpendicular-lines-medium-q4': {
      question:
        'The points $A(1, 2)$, $B(3, 5)$, and $C(x, 1)$ form a triangle that is right-angled at $B$. Find $x$.',
      options: ['$9$', '$7.5$', '$6$', '$0$'],
      correctIndex: 0,
      explanation:
        'Gradient $AB = \\frac{3}{2}$. For a right angle at $B$, gradient $BC = -\\frac{2}{3}$. So $\\frac{1-5}{x-3} = -\\frac{2}{3} \\Rightarrow x = 9$.\n\n**Common mistake:** Setting the gradients equal (parallel) instead of using the negative reciprocal (perpendicular) at vertex $B$.',
    },
    '6-1-midpoint-parallel-and-perpendicular-lines-medium-q5': {
      question:
        'Points $A(-2, 1)$, $B(2, 3)$, and $C(6, 5)$ are collinear with $B$ the midpoint of $AC$. Find the gradient of a line perpendicular to $AC$.',
      options: [
        'Perpendicular gradient is $-2$',
        'Perpendicular gradient is $0.5$',
        'Midpoint is $(4, 3)$, perpendicular gradient is $-2$',
        'Perpendicular gradient is $2$',
      ],
      correctIndex: 0,
      explanation:
        'Midpoint of $AC$ is $(2, 3) = B$. Gradient of $AC = \\frac{4}{8} = 0.5$, so the perpendicular gradient is $-2$.\n\n**Common mistake:** Finding the gradient of $AB$ or $BC$ and forgetting to take the negative reciprocal.',
    },
  },
  '6-1-midpoint-parallel-and-perpendicular-lines-hard.json': {
    '6-1-midpoint-parallel-and-perpendicular-lines-hard-q1': {
      explanation:
        'Midpoint $M = (2, 3)$. Gradient $PQ = -\\frac{1}{3}$. Perpendicular gradient $m = 3$. Equation: $y = 3x - 3$.\n\n**Common mistake:** Using an endpoint instead of the midpoint, or using the gradient of $PQ$ itself instead of the perpendicular gradient.',
    },
    '6-1-midpoint-parallel-and-perpendicular-lines-hard-q3': {
      question:
        'The line $y = mx + c$ is parallel to $4x - 2y = 5$ and passes through the midpoint of the line joining $(1, 7)$ and $(5, -1)$. Find $c$.',
      explanation:
        'Gradient of $4x - 2y = 5$ is $2$. Midpoint is $(3, 3)$. Substituting into $y = 2x + c$: $3 = 6 + c \\Rightarrow c = -3$.\n\n**Common mistake:** Calculating the gradient as $-2$ or using an endpoint instead of the midpoint.',
    },
    '6-1-midpoint-parallel-and-perpendicular-lines-hard-q4': {
      question:
        'Line $L$ is the perpendicular bisector of $AB$ where $A$ is $(0, 4)$ and $B$ is $(6, 0)$. Find the coordinates of the point where $L$ meets the $x$-axis.',
      explanation:
        'Midpoint $M = (3, 2)$. Gradient of $AB$ is $-\\frac{2}{3}$, so perpendicular gradient is $\\frac{3}{2}$. Line: $y - 2 = \\frac{3}{2}(x - 3)$. Setting $y = 0$ gives $x = \\frac{5}{3}$.\n\n**Common mistake:** Confusing the $x$-intercept with the $y$-intercept.',
    },
    '6-1-midpoint-parallel-and-perpendicular-lines-hard-q5': {
      question:
        'Point $M(3,1)$ is the midpoint of $AB$. If $AB$ has gradient $-2$, find the equation of the perpendicular bisector of $AB$.',
    },
  },
  '6-1-midpoint-parallel-and-perpendicular-lines-pyp.json': {
    '6-1-midpoint-parallel-and-perpendicular-lines-pyp-q3': {
      question:
        'Line $A$ has gradient $1.5$. If line $B$ is perpendicular to line $A$, find its gradient.',
    },
    '6-1-midpoint-parallel-and-perpendicular-lines-pyp-q4': {
      question:
        'Triangle $OAB$ has vertices $O(0,0)$, $A(6,0)$, and $B(2,4)$. Find the length of the median from $B$ to side $OA$.',
      explanation:
        'Midpoint of $OA$ is $(3,0)$. Distance from $(2,4)$ to $(3,0)$ is $\\sqrt{17}$.\n\n**Common mistake:** Finding the length of the altitude instead of the median.',
    },
    '6-1-midpoint-parallel-and-perpendicular-lines-pyp-q5': {
      question:
        'Line $L$ passes through $(4, 5)$ and is perpendicular to $y = 2x$. Point $(k, 2)$ lies on $L$. Find $k$.',
      explanation:
        'Perpendicular gradient is $-\\frac{1}{2}$. Equation: $y - 5 = -\\frac{1}{2}(x - 4)$. Substituting $y = 2$ gives $k = 10$.\n\n**Common mistake:** Using gradient $2$ instead of $-\\frac{1}{2}$.',
    },
  },
  '6-2-equations-of-straight-lines-medium.json': {
    '6-2-equations-of-straight-lines-medium-q2': {
      question:
        'The line $L$ has equation $y - 3 = 2(x + 1)$. Express this in the form $ax + by + c = 0$.',
    },
    '6-2-equations-of-straight-lines-medium-q4': {
      explanation:
        'Substitute $x = k$ and $y = 2k$ into $y = x + 5$: $2k = k + 5$, so $k = 5$.\n\n**Common mistake:** Subtracting $k$ from $2k$ incorrectly or misapplying the substitution.',
    },
  },
  '6-2-equations-of-straight-lines-hard.json': {
    '6-2-equations-of-straight-lines-hard-q1': {
      question:
        'In rhombus $ABCD$, vertices $A$ and $C$ are $(1, 5)$ and $(7, -3)$ respectively. Find the equation of diagonal $BD$.',
      explanation:
        'Diagonals of a rhombus are perpendicular bisectors. Midpoint of $AC$ is $(4, 1)$. Gradient of $AC$ is $-\\frac{4}{3}$, so gradient of $BD$ is $\\frac{3}{4}$. Equation: $y = \\frac{3}{4}x - 2$.\n\n**Common mistake:** Using the gradient of $AC$ for $BD$ instead of the perpendicular gradient.',
    },
    '6-2-equations-of-straight-lines-hard-q3': {
      explanation:
        'Midpoint is $(3, 5)$. Equation: $y - 5 = -2(x - 3) \\Rightarrow y = -2x + 11$.\n\n**Common mistake:** Using an endpoint of $AB$ instead of the midpoint to find $c$.',
    },
    '6-2-equations-of-straight-lines-hard-q5': {
      question:
        'The line $y = kx - 4$ passes through the intersection of $x + y = 5$ and $2x - y = 4$. Find $k$.',
    },
    '6-2-equations-of-straight-lines-hard-q6': {
      question:
        'The line $ax + by = 1$ passes through $(1, 2)$ and $(3, -4)$. Find $a$.',
    },
  },
  '6-3-areas-of-rectilinear-figures-medium.json': {
    '6-3-areas-of-rectilinear-figures-medium-q2': {
      explanation:
        'Area $= 0.5 \\times k \\times 5 = 2.5k$. Solving $2.5k = 20$ gives $k = 8$.\n\n**Common mistake:** Using the slant side length instead of the base $k$ on the $x$-axis.',
    },
    '6-3-areas-of-rectilinear-figures-medium-q3': {
      question:
        'A triangle is formed by the $x$-axis, the $y$-axis, and the line $3x + 4y = 24$. Find its area.',
    },
  },
  '6-4-converting-from-a-non-linear-equation-to-linear-form-easy.json': {
    '6-4-converting-from-a-non-linear-equation-to-linear-form-easy-q1': {
      question:
        'The equation $y = ax^n$ is to be written as $Y = mX + c$. Which choices define $Y$ and $X$?',
      explanation:
        'Taking logarithms: $\\lg y = n \\lg x + \\lg a$. So $Y = \\lg y$ and $X = \\lg x$.\n\n**Common mistake:** Confusing the power law with an exponential law.',
    },
    '6-4-converting-from-a-non-linear-equation-to-linear-form-easy-q3': {
      question:
        'For $y = ax^2 + bx$, which transformation of $y$ (as $Y$) gives a straight line when plotted against $x$?',
    },
    '6-4-converting-from-a-non-linear-equation-to-linear-form-easy-q4': {
      question:
        'Variables $x$ and $y$ satisfy $y = \\frac{a}{x} + b$. What should be plotted on the $Y$ and $X$ axes?',
    },
    '6-4-converting-from-a-non-linear-equation-to-linear-form-easy-q5': {
      question:
        'If the graph of $\\lg y$ against $x$ is a straight line, what type of relationship exists between $x$ and $y$?',
      explanation:
        'Linearising $y = Ab^x$ gives $\\lg y = x \\lg b + \\lg A$.\n\n**Common mistake:** Choosing a power law, which requires plotting against $\\lg x$.',
    },
  },
  '6-5-finding-relationships-from-data-easy.json': {
    '6-5-finding-relationships-from-data-easy-q1': {
      question:
        'Data $(x, y)$ satisfies $y = ax^2 + bx$. Which variables should be plotted on the $Y$ and $X$ axes?',
      options: [
        '$Y = \\frac{y}{x}$ and $X = x$',
        '$Y = y$ and $X = x^2$',
        '$Y = \\lg y$ and $X = \\lg x$',
        '$Y = y$ and $X = x$',
      ],
      explanation:
        'Dividing by $x$ gives $\\frac{y}{x} = ax + b$, so plot $Y = \\frac{y}{x}$ against $X = x$.\n\n**Common mistake:** Assuming every non-linear relationship requires logarithms.',
    },
    '6-5-finding-relationships-from-data-easy-q2': {
      question:
        'For $y = Ab^x$, a plot of $\\lg y$ against $x$ has intercept $0.602$. Find $A$.',
      explanation:
        'Intercept $c = \\lg A = 0.602$, so $A = 10^{0.602} \\approx 4$.\n\n**Common mistake:** Using base $e$ instead of base $10$ for $\\lg$.',
    },
    '6-5-finding-relationships-from-data-easy-q3': {
      question:
        'Variables $p$ and $q$ satisfy $q = kp^n$. If $\\lg q$ is plotted against $\\lg p$, what does the gradient represent?',
      explanation:
        'Log form: $\\lg q = n \\lg p + \\lg k$, so the gradient is $n$.\n\n**Common mistake:** Confusing the gradient with the intercept $\\lg k$.',
    },
    '6-5-finding-relationships-from-data-easy-q4': {
      question:
        'Plotting $y$ against $\\frac{1}{x^2}$ gives a straight line through $(0, 5)$. For $y = \\frac{a}{x^2} + b$, find $b$.',
      explanation:
        'The intercept when $X = 0$ gives $b = 5$.\n\n**Common mistake:** Assuming the line must pass through the origin.',
    },
    '6-5-finding-relationships-from-data-easy-q5': {
      question:
        'A straight-line graph of $\\ln y$ against $x$ has gradient $-0.5$. Which equation links $x$ and $y$?',
      explanation:
        '$\\ln y = -0.5x + c$ gives $y = Ae^{-0.5x}$.\n\n**Common mistake:** Confusing this exponential law with a power law.',
    },
  },
  '6-5-finding-relationships-from-data-medium.json': {
    '6-5-finding-relationships-from-data-medium-q1': {
      question:
        'Linearised points $(\\lg x, \\lg y)$ are $(1, 2.5)$ and $(3, 6.5)$. Find $n$ if $y = kx^n$.',
      explanation:
        'Gradient $n = \\frac{6.5 - 2.5}{3 - 1} = 2$.\n\n**Common mistake:** Using original $x$ and $y$ instead of $\\lg x$ and $\\lg y$.',
    },
    '6-5-finding-relationships-from-data-medium-q2': {
      question:
        'Data $(2, 12)$ and $(5, 75)$ satisfy $y = ax^2 + bx$. Find $a$.',
    },
    '6-5-finding-relationships-from-data-medium-q3': {
      question:
        'For $y = Ab^x$, a plot of $\\ln y$ against $x$ passes through $(2, 4.39)$ and $(5, 7.69)$. Find $b$ to one decimal place.',
    },
    '6-5-finding-relationships-from-data-medium-q5': {
      question:
        'A student plots $x^2$ on the $X$-axis and $y/x$ on the $Y$-axis for $y = ax^3 + bx^2$. If the line has gradient $5$ and intercept $2$, find $y$ when $x = 2$.',
    },
  },
}

let changed = 0

for (const topicId of topicIds) {
  for (const tier of ['easy', 'medium', 'hard', 'pyp']) {
    const file = path.join(quizDir, `${topicId}-${tier}.json`)
    if (!fs.existsSync(file)) continue
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    const rel = path.basename(file)
    let fileChanged = false

    for (const q of data.questions) {
      const patches = manual[rel]?.[q.id] ?? {}
      for (const key of ['question', 'explanation']) {
        if (patches[key]) {
          q[key] = patches[key]
          fileChanged = true
          continue
        }
        if (q[key]) {
          const next = fixCh6Artifacts(q[key])
          if (next !== q[key]) {
            q[key] = next
            fileChanged = true
          }
        }
      }
      if (patches.options) {
        q.options = patches.options
        fileChanged = true
      }
      if (typeof patches.correctIndex === 'number') {
        q.correctIndex = patches.correctIndex
        fileChanged = true
      }
      if (Array.isArray(q.options)) {
        q.options = q.options.map((o) => {
          const next = fixCh6Artifacts(o)
          return next === o ? o : (fileChanged = true, next)
        })
      }
    }

    if (fileChanged) {
      fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
      changed++
      console.log('updated', rel)
    }
  }
}

console.log(`Done — ${changed} file(s) updated.`)
