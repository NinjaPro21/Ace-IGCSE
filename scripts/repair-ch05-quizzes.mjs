#!/usr/bin/env node
/**
 * Repair Add Math Ch.5 canonical quiz JSON (docx import artefacts).
 * Does NOT use prepareMathContent — targeted fixText + manual overrides only.
 * Run: node scripts/repair-ch05-quizzes.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizDir = path.join(__dirname, '..', 'content', 'quizzes', 'add-maths-0606')

const topicIds = [
  '5-1-introduction-to-logarithms',
  '5-2-laws-of-logarithms-harder-topic',
  '5-3-change-of-base-of-logarithms',
  '5-4-exponential-equations-harder-topic',
  '5-6-natural-logarithms-and-exponential-functions',
  '5-7-converting-non-linear-laws-to-linear-form',
]

const tiers = ['easy', 'medium', 'hard', 'pyp']

/** Common docx corruption fixes — safe to re-run (must not match already-clean text). */
function fixText(text) {
  if (!text || typeof text !== 'string') return text
  let t = text

  // Unicode superscripts → caret notation
  t = t.replace(/x⁴/g, 'x^4')
  t = t.replace(/10⁵/g, '10^5')
  t = t.replace(/10³/g, '10^3')
  t = t.replace(/10²/g, '10^2')

  // Caret glued to English words (docx exponent glitch)
  t = t.replace(
    /\b(of|or|and|as|roots|that|are|between|by)\^(\d+)/gi,
    (_, word, n) => `${word} $${n}$`,
  )

  // Linear-form docx glue (context-specific — avoid bare c2Y which breaks mid-equation)
  t = t.replace(/\$Y = mX \+ c2Y =/g, '$Y = mX + c$. So $Y$ =')
  t = t.replace(/So \$Y = mX \+ c2Y/g, 'So $Y = mX + c$. So $Y$')
  t = t.replace(/\$Y = mX \+ c2Y/g, '$Y = mX + c$. So $Y$')
  t = t.replace(/\$Y = mX \+ c2c/g, '$Y = mX + c$. So $c$')
  t = t.replace(/\$Y = mX \+ c2m/g, '$Y = mX + c$. So $m$')
  t = t.replace(/\$Y = mX \+ c2X/g, '$Y = mX + c$. So $X$')
  t = t.replace(/Rearranging to \$Y = mX \+ c2Y/g, 'Rearranging to $Y = mX + c$. So $Y$')
  t = t.replace(/Rearranging to \$Y = mX \+ c2X/g, 'Rearranging to $Y = mX + c$. So $X$')
  t = t.replace(/and \$c2\\/g, 'and $c = \\')
  t = t.replace(/and \$c2\\lg/g, 'and $c = \\lg')

  // Plot / axis docx glue
  t = t.replace(/Y2\\lg/g, '$Y = \\lg')
  t = t.replace(/\\lg y2\\lg x/g, '$\\lg y$ against $\\lg x$')
  t = t.replace(/\\lg y2x/g, '$\\lg y$ against $x$')
  t = t.replace(/\\ln y2\\ln x/g, '$\\ln y$ against $\\ln x$')
  t = t.replace(/\\ln y2x/g, '$\\ln y$ against $x$')
  t = t.replace(/\\ln y2/g, '$\\ln y$ against ')
  t = t.replace(/x2\(/g, 'through $(')
  t = t.replace(/\\lg x2\(/g, '$\\lg x$ at $(')
  t = t.replace(/\$y\$\. \$\\frac/g, '$y$ against $\\frac')
  t = t.replace(/plotting\$\\lg/g, 'plotting $\\lg')
  t = t.replace(/\^2 So /g, '^2$. So ')
  t = t.replace(/q2\\lg/g, '$q$, express $\\lg')
  t = t.replace(/\$\\lg\$\. So /g, '$\\lg$ means ')
  t = t.replace(/\$\\lg\$\. /g, '$\\lg$ means ')

  // Broken $$ at end of explanations
  t = t.replace(/\n\$\$\n\*\*Common mistake/g, '\n\n**Common mistake')
  t = t.replace(/\n\$\$\.\n\n\*\*Common mistake/g, '\n\n**Common mistake')
  t = t.replace(/\$\$\n\*\*Common mistake/g, '\n\n**Common mistake')
  t = t.replace(/\$\$\.(\n|$)/g, '.$1')
  t = t.replace(/\$\$as /g, ' as ')
  t = t.replace(/\n\$\$\n/g, '\n\n')

  // Shared axis / variable glue (only corrupted forms)
  t = t.replace(/Y2X/g, '$Y$ and $X$')
  t = t.replace(/y2X/g, '$y$ and $X$')
  t = t.replace(/x2y/g, '$x$ and $y$')
  t = t.replace(/y2y/g, '$y$')
  t = t.replace(/\$\\lg y\$2\\lg x/g, 'plot of $\\lg y$ against $\\lg x$')
  t = t.replace(/\$\\lg y\$2x/g, 'plot of $\\lg y$ against $x$')
  t = t.replace(/\$\\ln y\$2x/g, 'plot of $\\ln y$ against $x$')
  t = t.replace(/\$\\lg y\$\. \$\\lg x2/g, 'plot of $\\lg y$ against $\\lg x$. Find ')
  t = t.replace(/\$xy\$\. \$x\^2/g, 'plot $xy$ against $x^2$')
  t = t.replace(/\$1\/y\$\. \$x\^2/g, 'plot $1/y$ against $x^2$')
  t = t.replace(/and \$m  and n/g, 'and $m$ is $n$')
  t = t.replace(/and \$p  and q/g, 'and $p$ and $q$')
  t = t.replace(/by when \$/g, 'by $')
  t = t.replace(/Dividing both sides by when \$/g, 'Dividing both sides by $')
  t = t.replace(/Multiplying by when \$/g, 'Multiplying by $')
  t = t.replace(/Dividing the original equation by when \$/g, 'Dividing the original equation by $')
  t = t.replace(/Find the value of when \$/g, 'Find the value of $')
  t = t.replace(/Solve for when \$/g, 'Solve for $x$ when $')
  t = t.replace(/\$k\$\.\s*\$\|/g, '$k$ for which $|')
  t = t.replace(/\$x\$\.\s*\$\log_2 x/g, 'the range of values for $x$ such that $\\log_2 x$')
  t = t.replace(/\$y\$\. \$k\\sqrt\{10\}/g, 'Express $y$ in the form $k\\sqrt{10}$')
  t = t.replace(/Solve for \$x\$\. \$2 \\log/g, 'Solve for $x$ when $2 \\log')
  t = t.replace(/\$x\$\.\s*\$e\^\{2x\+1\}/g, 'Find the set of values of $x$ such that $e^{2x+1}$')
  t = t.replace(/Take \$\\ln\$\. \$/g, 'Take $\\ln$ of both sides: $')
  t = t.replace(/x\^2 \+\$x\$= 2\^3/g, 'x^2 + 2x = 2^3')
  t = t.replace(/\$\\lg a = p\^2 So \\lg b = q2\\lg \(100a\/b\^3\) in terms of\$p  and q\./g,
    'Given $\\lg a = p$ and $\\lg b = q$, express $\\lg(100a/b^3)$ in terms of $p$ and $q$.')
  t = t.replace(/If \$\\log_2 3 = p \. \\log_2 4\.5\$ in terms of \$p\./g,
    'If $\\log_2 3 = p$, express $\\log_2 4.5$ in terms of $p$.')
  t = t.replace(/Using log laws: \$\\ln x\^4 \+ \\ln e\^\{1\/2\} = 4\\ln x \+ \\frac\{1\}\{2\}\\ln e\^2 So \\ln e = 1, the result is\$4\\ln x \+ 0\.5\$\$/g,
    'Using log laws: $\\ln x^4 + \\ln e^{1/2} = 4\\ln x + \\frac{1}{2}\\ln e = 4\\ln x + 0.5$.')
  t = t.replace(/\$\\lg 10\$\. Since \$\\lg\$\. So \$\\lg 10 = 1\$/g,
    '$\\lg 10$. Since $\\lg$ means log base 10, $\\lg 10 = 1$')
  t = t.replace(/\$\\lg\$\. \$10\^\{1\} = x x\$ = 10\$\$/g, '$\\lg x = 1$ means $x = 10^1 = 10$')

  return t
}

/** Manual overrides keyed by question id. */
const OVERRIDES = {
  // --- 5-1 ---
  '5-1-introduction-to-logarithms-medium-q4': {
    question: 'Solve for $x$ when $\\lg x = 1$.',
    explanation:
      '$\\lg x = 1$ means $x = 10^1 = 10$.\n\n**Common mistake:** Thinking $x = 1$ because the result is 1.',
  },
  '5-1-introduction-to-logarithms-pyp-q2': {
    question:
      'Given that $\\lg y = 2.5$, find the value of $y$ in the form $k\\sqrt{10}$ where $k$ is an integer.',
  },

  // --- 5-2 ---
  '5-2-laws-of-logarithms-harder-topic-pyp-q2': {
    question:
      'Given $\\lg a = p$ and $\\lg b = q$, express $\\lg(100a/b^3)$ in terms of $p$ and $q$.',
  },
  '5-2-laws-of-logarithms-harder-topic-easy-q4': {
    explanation:
      '$\\lg 5 + \\lg 2 = \\lg(5 \\times 2) = \\lg 10$. Since $\\lg$ means log base 10, $\\lg 10 = 1$.\n\n**Common mistake:** Leaving the answer as $\\lg 10$ or incorrectly adding the arguments to get $\\lg 7$.',
  },
  '5-2-laws-of-logarithms-harder-topic-hard-q4': {
    question:
      'If $x^2 + y^2 = 7xy$, show that $2 \\lg \\left(\\frac{x+y}{3}\\right) = \\lg x + \\lg y$. Which of the following is the first step in this proof?',
    explanation:
      'To relate $x+y$ and $xy$, expand $(x+y)^2 = x^2 + 2xy + y^2$. Substituting $x^2+y^2=7xy$ gives $(x+y)^2 = 9xy$.\n\n**Common mistake:** Trying to apply logs directly to the original sum $x^2+y^2$, which is not possible using basic log laws.',
  },

  // --- 5-3 ---
  '5-3-change-of-base-of-logarithms-pyp-q3': {
    question:
      'Given that $\\log_a 3 = x$ and $\\log_a 5 = y$, express $\\log_{15} a$ in terms of $x$ and $y$.',
  },
  '5-3-change-of-base-of-logarithms-pyp-q4': {
    question: 'Solve for $x$ when $2 \\log_4 x + \\log_x 4 = 3$.',
  },

  // --- 5-6 ---
  '5-6-natural-logarithms-and-exponential-functions-pyp-q5': {
    question:
      'Express $\\ln(x^4 \\sqrt{e})$ in the form $A\\ln x + B$, where $A$ and $B$ are constants.',
    explanation:
      'Using log laws: $\\ln x^4 + \\ln e^{1/2} = 4\\ln x + \\frac{1}{2}\\ln e = 4\\ln x + 0.5$.\n\n**Common mistake:** Leaving the second term as $\\ln \\sqrt{e}$ or mistakenly evaluating $\\ln e$ as $e$ or 0.',
  },

  // --- 5-7 easy (q1–q10) ---
  '5-7-converting-non-linear-laws-to-linear-form-easy-q1': {
    question:
      'To transform the non-linear equation $y = ax^n$ into the linear form $Y = mX + c$, which variables should be plotted on the $Y$ and $X$ axes?',
    options: [
      '$\\lg y$ and $\\lg x$',
      '$y$ and $x^n$',
      '$\\lg y$ and $x$',
      '$y$ and $\\lg x$',
    ],
    explanation:
      'Taking logs of both sides gives $\\lg y = \\lg(ax^n) = n \\lg x + \\lg a$. So $Y = mX + c$ with $Y = \\lg y$ and $X = \\lg x$.\n\n**Common mistake:** Students often forget to take the logarithm of the independent variable $x$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-easy-q2': {
    question:
      'Identify the gradient ($m$) and vertical intercept ($c$) when the equation $y = Ae^{kx}$ is converted to linear form using natural logarithms.',
    explanation:
      'Applying natural logarithms gives $\\ln y = \\ln(Ae^{kx}) = \\ln A + kx$. So $Y = mX + c$ where $m = k$ and $c = \\ln A$.\n\n**Common mistake:** A student might confuse the gradient with the intercept and select $\\ln A$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-easy-q3': {
    question:
      'For the equation $y = px^2 + qx$, which pair of variables should be plotted to obtain a straight line? What do the gradient and intercept represent in terms of $p$ and $q$?',
    options: [
      '$\\frac{y}{x}$ against $x$',
      '$y$ against $x^2$',
      '$\\frac{y}{x^2}$ against $\\frac{1}{x}$',
      '$\\lg y$ against $\\lg x$',
    ],
    explanation:
      'Dividing the original equation by $x$ gives $\\frac{y}{x} = px + q$. So $Y = mX + c$ with $Y = \\frac{y}{x}$ and $X = x$.\n\n**Common mistake:** Students often attempt to use logarithms for all non-linear equations instead of simple algebraic division.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-easy-q4': {
    question:
      'If a graph of $y$ against $\\frac{1}{x}$ is a straight line passing through the origin with gradient 5, what is the original relationship between $x$ and $y$?',
    explanation:
      'The linear form $Y = mX + c$ with $c=0$ and $m=5$ gives $y = 5(\\frac{1}{x})$, which simplifies to $y = \\frac{5}{x}$.\n\n**Common mistake:** A student might misinterpret the axes and plot $y$ against $x$ instead of $\\frac{1}{x}$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-easy-q5': {
    explanation:
      'The equation transforms to $\\lg y = x \\lg b + \\lg A$. So $Y = mX + c$ where $c = \\lg A$.\n\n**Common mistake:** It is common to assume the intercept is the constant $A$ itself without applying the logarithm.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-easy-q6': {
    question:
      'Which of the following transformations would turn the equation $y = k x^n$ into the linear form $Y = mX + c$?',
  },
  '5-7-converting-non-linear-laws-to-linear-form-easy-q7': {
    question:
      'If a graph of $\\ln y$ against $x$ is a straight line, which non-linear relationship does this represent?',
    explanation:
      'The linear equation is $\\ln y = mx + c$. So $y = e^{mx+c} = e^c e^{mx}$, which is in the form $y = A e^{mx}$.\n\n**Common mistake:** A student might confuse a plot of $\\ln y$ against $x$ with one of $\\lg y$ against $\\lg x$ for a power law.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-easy-q8': {
    question:
      'To obtain a straight line from the equation $y = a\\sqrt{x} + b$, which variables should be plotted on the $Y$ and $X$ axes?',
    options: [
      '$y$ against $\\sqrt{x}$',
      '$y$ against $x$',
      '$y^2$ against $x$',
      '$\\lg y$ against $\\lg x$',
    ],
    explanation:
      'The equation $y = a(x^{0.5}) + b$ is already linear in $X = \\sqrt{x}$. So $Y = y$ and $X = \\sqrt{x}$.\n\n**Common mistake:** Students often default to using logarithms for any non-linear equation instead of identifying direct algebraic substitutions.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-easy-q9': {
    explanation:
      'Multiplying $\\frac{y}{x} = ax + b$ by $x$ gives $y = ax^2 + bx$, so the gradient $a$ is the coefficient of the $x^2$ term.\n\n**Common mistake:** Students may think the gradient always represents the coefficient of $x$ in the original equation without rearranging it first.',
    options: [
      'The coefficient of the $x^2$ term',
      'The constant term',
      'The coefficient of the $x$ term',
      'The value of $y$ when $x=0$',
    ],
  },
  '5-7-converting-non-linear-laws-to-linear-form-easy-q10': {
    question:
      'State the vertical intercept of the straight line obtained by plotting $\\lg y$ against $x$ for the relationship $y = 5(2^x)$.',
    explanation:
      'Taking logs gives $\\lg y = x \\lg 2 + \\lg 5$. In the form $Y = mX + c$, the intercept is $c = \\lg 5$.\n\n**Common mistake:** Mistakenly identifying the coefficient 5 as the intercept without applying the logarithm.',
  },

  // --- 5-7 medium (q1–q10) ---
  '5-7-converting-non-linear-laws-to-linear-form-medium-q1': {
    question:
      'The variables $x$ and $y$ are related by $y = kx^3$. When $\\lg y$ is plotted against $\\lg x$, the straight line has vertical intercept 2. Find $k$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-medium-q2': {
    question:
      'A graph of $\\ln y$ against $x$ passes through $(0, 5)$. Express $y$ in terms of $x$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-medium-q3': {
    question:
      'Convert the equation $y = \\frac{a}{x^2} + b$ into the form $Y = mX + c$. What are $Y$, $X$, and $m$?',
  },
  '5-7-converting-non-linear-laws-to-linear-form-medium-q4': {
    question:
      'A straight line is obtained by plotting $\\lg y$ against $\\lg x$. The line passes through $(0, 1)$ and $(2, 7)$. Find the value of $n$ when $y = ax^n$.',
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
    correctIndex: 1,
    explanation:
      'Rearranging $xy = ax + b$ gives $y = a + \\frac{b}{x}$. Plotting $y$ against $\\frac{1}{x}$, the gradient is $b$ and the intercept is $a$.\n\n**Common mistake:** Swapping the roles of $a$ and $b$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-medium-q6': {
    question:
      'A graph of $xy$ against $x^2$ is a straight line with gradient 3 and intercept 7. Find an equation for $y$ in terms of $x$.',
    explanation:
      'The linear equation is $xy = 3x^2 + 7$. Dividing both sides by $x$ gives $y = 3x + \\frac{7}{x}$.\n\n**Common mistake:** Forgetting to divide the intercept term by $x$ when converting back to $y$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-medium-q7': {
    question:
      'Variables $x$ and $y$ are related by $y = ab^x$. A plot of $\\ln y$ against $x$ passes through $(0, 2)$ and $(4, 10)$. Find the value of $b$.',
    explanation:
      '$\\ln y = x \\ln b + \\ln a$. So $m = \\ln b = \\frac{10-2}{4-0} = 2$. Therefore, $b = e^2$.\n\n**Common mistake:** Identifying the gradient as $b$ instead of $\\ln b$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-medium-q8': {
    question:
      'Transform $y = \\frac{a}{x} + bx$ into the form $Y = mX + c$. What are $Y$, $X$, and $m$?',
    explanation:
      'Multiplying by $x$ gives $xy = a + bx^2$. Rearranging to $Y = mX + c$ with $Y = xy$, $X = x^2$, and $m = b$.\n\n**Common mistake:** Misidentifying the gradient as $a$ because it is the first constant mentioned in the original equation.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-medium-q9': {
    question:
      'The law $y = k x^n$ is linearised by plotting $\\lg y$ against $\\lg x$. The straight line passes through $(1, 3)$. Find the value of $k$.',
    options: ['$10^5$', '$10^3$', '5', '0.1'],
  },
  '5-7-converting-non-linear-laws-to-linear-form-medium-q10': {
    question:
      'A straight line is obtained by plotting $\\frac{1}{y}$ against $x^2$. The line has gradient 0.4 and passes through $(5, 3)$. Find $y$ when $x = 0$.',
  },

  // --- 5-7 hard (q1–q10) ---
  '5-7-converting-non-linear-laws-to-linear-form-hard-q1': {
    question:
      'The variables $x$ and $y$ are related by $y = pq^{x^2}$. A straight line is obtained by plotting $\\ln y$ against $x^2$. If the line passes through $(1, 4)$ and $(3, 10)$, find the value of $q$.',
    explanation:
      '$\\ln y = x^2 \\ln q + \\ln p$. So $m = \\ln q = \\frac{10-4}{3-1} = 3$. Therefore $q = e^3$.\n\n**Common mistake:** Plotting $\\ln y$ against $x$ instead of $x^2$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-hard-q2': {
    question:
      'A graph of $\\frac{y}{x}$ against $x^2$ is a straight line passing through $(2, 11)$ and $(5, 20)$. Find the equation for $y$ in terms of $x$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-hard-q3': {
    question:
      'For the law $y = \\frac{a}{x+b}$, a straight line is obtained by plotting $\\frac{1}{y}$ against $x$. The line has gradient 0.5 and intercept 2. Find $a$ and $b$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-hard-q4': {
    question:
      'Two variables are related by $y = 10^{ax+b}$. The graph of $\\lg y$ against $x$ passes through $(1, 5)$ and $(3, 11)$. Determine the values of $a$ and $b$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-hard-q5': {
    question:
      'The relationship $y = ax^n + 3$ can be linearised. Which plot gives a straight line, and how can $a$ and $n$ be found from the graph?',
    explanation:
      'Rearrange to $y - 3 = ax^n$. Taking logs gives $\\lg(y - 3) = n \\lg x + \\lg a$. Plotting $\\lg(y - 3)$ against $\\lg x$ yields a straight line.\n\n**Common mistake:** Attempting to take the log of the sum ($ax^n + 3$), which does not simplify to a linear form.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-hard-q6': {
    question:
      'The relationship $y = a e^{bx^2}$ is plotted as $\\ln y$ against $x^2$. The line passes through $P(1, 4)$ and $Q(3, 10)$. Calculate the values of $a$ and $b$.',
    explanation:
      '$\\ln y = bx^2 + \\ln a$. So $b = \\frac{10-4}{3-1} = 3$. Intercept $\\ln a = 4 - 3(1) = 1 \\Rightarrow a = e^1$.\n\n**Common mistake:** Calculating $b$ as $\\ln 3$ instead of 3, or forgetting to take the exponential of the intercept to find $a$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-hard-q7': {
    question:
      'Given $y = \\frac{k}{x+a}$, a graph of $\\frac{1}{y}$ against $x$ has gradient 0.2 and intercept 0.8. Find $x$ when $y = 0.5$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-hard-q8': {
    question:
      'The variables $x$ and $y$ satisfy $y = Ax^n + 4$. A straight line is obtained by plotting $\\lg(y-4)$ against $\\lg x$ through $(2, 7)$ and $(4, 13)$. Determine the law connecting $x$ and $y$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-hard-q9': {
    question:
      'A graph of $\\frac{y}{x^2}$ against $\\frac{1}{x}$ is a straight line through $(1, 5)$ and $(3, 13)$. Express $y$ in terms of $x$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-hard-q10': {
    question:
      'The variables $p$ and $q$ satisfy $q = ap^b$. A plot of $\\ln q$ against $\\ln p$ is a straight line through the origin with gradient 0.5. Given $q = 4$ when $p = 16$, find $a$.',
    explanation:
      '$\\ln q = b \\ln p + \\ln a$. So $b = 0.5$. Substituting: $\\ln 4 = 0.5 \\ln 16 + \\ln a \\Rightarrow \\ln 4 = \\ln(16^{0.5}) + \\ln a \\Rightarrow \\ln 4 = \\ln 4 + \\ln a \\Rightarrow \\ln a = 0 \\Rightarrow a = 1$.\n\n**Common mistake:** Assuming $a = q/p$ when $p = 1$ without verifying the power relationship.',
  },

  // --- 5-7 pyp (q1–q10) ---
  '5-7-converting-non-linear-laws-to-linear-form-pyp-q1': {
    question:
      'Variables $x$ and $y$ are related by $y = Ae^{kx}$. When $\\ln y$ is plotted against $x$, a straight line through $(2, 5.2)$ and $(5, 8.8)$ is obtained. Find $y$ in terms of $x$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-pyp-q2': {
    question:
      'The diagram shows the graph of $\\lg y$ against $\\lg x$ passing through $(1, 3)$ with gradient 2. Find the value of $y$ when $x = 2$.',
    explanation:
      'Equation: $\\lg y - 3 = 2(\\lg x - 1) \\Rightarrow \\lg y = 2\\lg x + 1$. When $x=2, \\lg y = 2\\lg 2 + 1 = \\lg 4 + \\lg 10 = \\lg 40$. So $y=40$.\n\n**Common mistake:** Adding the gradient to the $x$-coordinate ($2+1=3$) and forgetting to perform the inverse log operation.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-pyp-q3': {
    question:
      'Given that $y = ab^x$, a plot of $\\ln y$ against $x$ has vertical intercept $\\ln 3$ and passes through $(2, \\ln 12)$. Find the value of $b$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-pyp-q4': {
    question:
      'A graph of $x^2 y$ against $x^3$ is a straight line with gradient $4$ passing through $(0, -5)$. Find the relationship between $x$ and $y$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-pyp-q5': {
    question:
      'Show that $y = kx^n$ can be written as $\\lg y = n\\lg x + \\lg k$. A plot of $\\lg y$ against $\\lg x$ passes through $(1, 2)$ and $(2, 5)$. Find the law connecting $x$ and $y$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-pyp-q6': {
    question:
      'A straight line is obtained by plotting $\\lg y$ against $\\lg x$. The line passes through $(2, 4)$ and $(5, 10)$. Find $y$ in terms of $x$.',
    correctIndex: 1,
    explanation:
      'Gradient $n = \\frac{10-4}{5-2} = 2$. Intercept $\\lg k = 4 - 2(2) = 0 \\Rightarrow k = 10^{0} = 1$. So $y = x^2$.\n\n**Common mistake:** A student might give the linear equation $Y = 2X + 0$ as the final answer instead of converting back to $y = x^2$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-pyp-q7': {
    question:
      'Variables $x$ and $y$ are related by $y^2 = 3x + 1$. A graph of $y^2$ against $x$ passes through $(3, 10)$ and $(7, 22)$. Find $y$ when $x = 2$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-pyp-q8': {
    question:
      'A straight line through the origin is obtained by plotting $\\ln y$ against $\\ln x$. The gradient is 3 and the vertical intercept is $\\ln 2$. Find the relationship between $x$ and $y$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-pyp-q9': {
    question:
      'Show that $y = ab^x$ can be written as $\\ln y = x \\ln b + \\ln a$. If a plot of $\\ln y$ against $x$ passes through $(0, 4)$, find the value of $a$.',
  },
  '5-7-converting-non-linear-laws-to-linear-form-pyp-q10': {
    question:
      'The variables $x$ and $y$ satisfy $y = ax + \\frac{b}{x}$. If a graph of $xy$ against $x^2$ is a straight line through the origin, what is the value of $b$?',
    explanation:
      '$xy = ax^2 + b$. If the graph of $xy$ against $x^2$ passes through the origin, the intercept is $0$, so $b = 0$.\n\n**Common mistake:** Confusing the intercept with the gradient.',
  },
}

function applyPatch(q, patch) {
  if (!patch) return false
  let changed = false
  for (const key of ['question', 'explanation', 'options']) {
    if (patch[key] !== undefined && JSON.stringify(q[key]) !== JSON.stringify(patch[key])) {
      q[key] = patch[key]
      changed = true
    }
  }
  if (typeof patch.correctIndex === 'number' && q.correctIndex !== patch.correctIndex) {
    q.correctIndex = patch.correctIndex
    changed = true
  }
  return changed
}

function applyFixesToQuestion(q) {
  let changed = false
  const patch = OVERRIDES[q.id]

  for (const field of ['question', 'explanation']) {
    if (q[field] && !patch?.[field]) {
      const next = fixText(q[field])
      if (next !== q[field]) {
        q[field] = next
        changed = true
      }
    }
  }

  if (q.options?.length && !patch?.options) {
    const nextOpts = q.options.map((opt) => fixText(opt))
    if (JSON.stringify(nextOpts) !== JSON.stringify(q.options)) {
      q.options = nextOpts
      changed = true
    }
  }

  if (applyPatch(q, patch)) changed = true
  return changed
}

let filesChanged = 0
let questionsChanged = 0
const updated = []

for (const topicId of topicIds) {
  for (const tier of tiers) {
    const rel = `${topicId}-${tier}.json`
    const filePath = path.join(quizDir, rel)
    if (!fs.existsSync(filePath)) {
      console.warn('skip (missing):', rel)
      continue
    }

    const raw = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(raw)
    let fileChanged = false

    for (const q of data.questions ?? []) {
      if (applyFixesToQuestion(q)) {
        fileChanged = true
        questionsChanged++
      }
    }

    if (data.title && !OVERRIDES[data.id]) {
      const nextTitle = fixText(data.title)
      if (nextTitle !== data.title) {
        data.title = nextTitle
        fileChanged = true
      }
    }

    if (fileChanged) {
      fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`)
      filesChanged++
      updated.push(rel)
      console.log('updated', rel)
    }
  }
}

console.log(`\nDone — ${filesChanged} file(s) updated (${questionsChanged} question(s) touched).`)
if (updated.length) {
  console.log('Files:', updated.join(', '))
}
