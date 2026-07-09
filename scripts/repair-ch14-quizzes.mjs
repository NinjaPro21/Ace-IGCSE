#!/usr/bin/env node
/**
 * Repair Add Math Ch.14 calculus differentiation 2 quiz JSON.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizDir = path.join(__dirname, '..', 'content', 'quizzes', 'add-maths-0606')

const topicIds = [
  '14-1-derivatives-of-exponential-functions',
  '14-2-derivatives-of-logarithmic-functions-harder-topic',
  '14-3-derivatives-of-trigonometric-functions-harder-topic',
  '14-4-further-applications-of-differentiation-harder-topic',
]

const INDEX_FIXES = {
  '14-3-derivatives-of-trigonometric-functions-harder-topic-hard-q1': 1,
  '14-3-derivatives-of-trigonometric-functions-harder-topic-hard-q4': 3,
}

const OVERRIDES = {
  // ── 14.1 Exponential ───────────────────────────────────────────
  '14-1-derivatives-of-exponential-functions-easy-q1': {
    explanation:
      'Using $\\frac{d}{dx}(e^{ax}) = ae^{ax}$, we get $\\frac{dy}{dx} = 6e^{6x}$.\n\n**Common mistake:** Option D is a common error where the student incorrectly applies the power rule for polynomials to an exponential function.',
  },
  '14-1-derivatives-of-exponential-functions-easy-q2': {
    question: 'Differentiate $y = 3e^{-x} + 5$ with respect to $x$.',
    explanation:
      'The derivative of $e^{-x}$ is $-e^{-x}$, and the derivative of the constant $5$ is $0$. Multiplying by $3$ gives $\\frac{dy}{dx} = -3e^{-x}$.\n\n**Common mistake:** Option C is a mistake where the student forgets that the derivative of a constant is zero.',
  },
  '14-1-derivatives-of-exponential-functions-easy-q4': {
    question: 'Differentiate $y = \\frac{1}{2}e^{4x}$ with respect to $x$.',
  },
  '14-1-derivatives-of-exponential-functions-easy-q5': {
    question: 'State the derivative of $y = e^x + x^e$.',
    explanation:
      'The derivative of $e^x$ is $e^x$, and the derivative of $x^e$ is $ex^{e-1}$. So $\\frac{dy}{dx} = e^x + ex^{e-1}$.\n\n**Common mistake:** Option C results from incorrectly applying the power rule to the exponential function $e^x$.',
  },
  '14-1-derivatives-of-exponential-functions-medium-q1': {
    question: 'Find the derivative of $y = x^2 e^x$.',
    explanation:
      'Using the product rule with $u = x^2$ and $v = e^x$: $\\frac{dy}{dx} = x^2 e^x + e^x(2x) = xe^x(x + 2)$.\n\n**Common mistake:** Option B is a common error where the student differentiates both parts and multiplies them together, failing to use the product rule correctly.',
  },
  '14-1-derivatives-of-exponential-functions-medium-q2': {
    question: 'Differentiate $y = e^{x^2 + 3x}$ with respect to $x$.',
  },
  '14-1-derivatives-of-exponential-functions-medium-q4': {
    question: 'Differentiate $y = \\frac{e^x}{x}$ with respect to $x$.',
  },
  '14-1-derivatives-of-exponential-functions-hard-q1': {
    question: 'Find the $x$-coordinate of the stationary point of $y = xe^{-2x}$.',
    explanation:
      '$\\frac{dy}{dx} = x(-2e^{-2x}) + e^{-2x}(1) = e^{-2x}(1 - 2x)$. Setting this to $0$ gives $1 - 2x = 0$, so $x = 0.5$.\n\n**Common mistake:** Option C is chosen if the student incorrectly assumes the stationary point is always at the origin for exponential products.',
  },
  '14-1-derivatives-of-exponential-functions-hard-q3': {
    explanation:
      '$\\frac{dy}{dx} = 2xe^{x^2}$. Using the product rule for the second derivative: $2x(2xe^{x^2}) + e^{x^2}(2) = 4x^2 e^{x^2} + 2e^{x^2} = 2e^{x^2}(1 + 2x^2)$.\n\n**Common mistake:** Option B results if the student forgets the second half of the product rule ($v \\frac{du}{dx}$) during the second differentiation step.',
  },
  '14-1-derivatives-of-exponential-functions-pyp-q2': {
    question:
      'The equation of a curve is $y = e^{2x} - 4e^x$. Find the set of values of $x$ for which $y$ is an increasing function.',
    explanation:
      '$y$ is increasing when $\\frac{dy}{dx} > 0$: $2e^{2x} - 4e^x > 0 \\implies 2e^x(e^x - 2) > 0$. Since $2e^x > 0$, we need $e^x > 2$, so $x > \\ln 2$.\n\n**Common mistake:** Option B is the set of values for which the function is decreasing.',
  },
  '14-1-derivatives-of-exponential-functions-pyp-q3': {
    question:
      'Find the coordinates of the point on the curve $y = 3e^x + 2e^{-x}$ where the gradient is $1$.',
  },
  '14-1-derivatives-of-exponential-functions-pyp-q4': {
    question:
      'A curve has the equation $y = x^2 e^{k-x}$. Given that the stationary point occurs at $x = 2$ and $y = 4$, find the value of the constant $k$.',
  },

  // ── 14.2 Logarithmic ───────────────────────────────────────────
  '14-2-derivatives-of-logarithmic-functions-harder-topic-easy-q1': {
    question: 'Find the derivative of $y = \\ln(5x)$ with respect to $x$.',
    options: ['$1/x$', '$5/x$', '$1/(5x)$', '$5\\ln x$'],
    explanation:
      'Using the chain rule: $\\frac{dy}{dx} = \\frac{5}{5x} = \\frac{1}{x}$. Alternatively, $\\ln(5x) = \\ln 5 + \\ln x$, and the derivative of $\\ln 5$ is $0$.\n\n**Common mistake:** Thinking the answer is $5/x$, forgetting that the $5$ in the numerator and denominator cancels out.',
  },
  '14-2-derivatives-of-logarithmic-functions-harder-topic-easy-q3': {
    question: 'What is the derivative of $y = 4\\ln x$?',
    options: ['$4/x$', '$1/(4x)$', '$4/x^2$', '$4$'],
  },
  '14-2-derivatives-of-logarithmic-functions-harder-topic-easy-q5': {
    question: 'Evaluate the derivative of $y = \\ln x$ at $x = 2$.',
  },
  '14-2-derivatives-of-logarithmic-functions-harder-topic-hard-q3': {
    question: 'Find the equation of the tangent to $y = \\ln x$ at the point where $y = 0$.',
    options: ['$y = x - 1$', '$y = x$', '$y = x + 1$', '$y = 1$'],
  },
  '14-2-derivatives-of-logarithmic-functions-harder-topic-hard-q4': {
    question: 'Determine $\\frac{dy}{dx}$ if $y = \\ln(xe^x)$.',
    options: ['$1/x + 1$', '$e^x/x$', '$1/(xe^x)$', '$x + 1$'],
  },
  '14-2-derivatives-of-logarithmic-functions-harder-topic-hard-q5': {
    question: 'Find the stationary point of the curve $y = \\ln x - x$.',
    options: ['$(1, -1)$', '$(1, 0)$', '$(e, 0)$', 'No stationary points'],
  },
  '14-2-derivatives-of-logarithmic-functions-harder-topic-pyp-q2': {
    question: 'Find $\\frac{dy}{dx}$ if $y = \\frac{\\ln x}{x}$.',
    options: ['$(1 - \\ln x)/x^2$', '$1/x^2$', '$(\\ln x - 1)/x^2$', '$0$'],
  },
  '14-2-derivatives-of-logarithmic-functions-harder-topic-pyp-q3': {
    question: 'Show that the derivative of $y = \\ln(\\sin x)$ is $\\cot x$.',
  },
  '14-2-derivatives-of-logarithmic-functions-harder-topic-pyp-q4': {
    question: 'Given $y = e^x \\ln x$, find $\\frac{dy}{dx}$ when $x = 1$.',
  },
  '14-2-derivatives-of-logarithmic-functions-harder-topic-pyp-q5': {
    question: 'Find the approximate change in $y = \\ln x$ when $x$ increases from $5$ to $5.01$.',
  },

  // ── 14.3 Trigonometric ─────────────────────────────────────────
  '14-3-derivatives-of-trigonometric-functions-harder-topic-easy-q1': {
    question: 'Find the gradient function $\\frac{dy}{dx}$ for the curve $y = \\sin(5x)$.',
    options: ['$5\\cos(5x)$', '$\\cos(5x)$', '$-5\\cos(5x)$', '$5x\\cos(5x-1)$'],
    explanation:
      'Using $\\frac{d}{dx}[\\sin(ax)] = a\\cos(ax)$, we get $\\frac{dy}{dx} = 5\\cos(5x)$.\n\n**Common mistake:** Option D is an error where the student incorrectly applies the power rule for polynomials to a trigonometric function.',
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-easy-q2': {
    question: 'Differentiate $y = 4\\cos x - 3$ with respect to $x$.',
    options: ['$-4\\sin x$', '$4\\sin x$', '$-4\\sin x - 3$', '$-4\\cos x$'],
    explanation:
      'The derivative of $\\cos x$ is $-\\sin x$, and the derivative of $-3$ is $0$. Multiplying by $4$ gives $\\frac{dy}{dx} = -4\\sin x$.\n\n**Common mistake:** Option B ignores the sign change required when differentiating the cosine function.',
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-easy-q3': {
    question:
      'Calculate the value of the gradient of $y = \\tan x$ at the point where $x = \\frac{\\pi}{4}$.',
    options: ['$2$', '$1$', '$\\sqrt{2}$', '$0.5$'],
    explanation:
      '$\\frac{dy}{dx} = \\sec^2 x$. At $x = \\frac{\\pi}{4}$, $\\sec^2\\left(\\frac{\\pi}{4}\\right) = 2$.\n\n**Common mistake:** Option B is the value of $\\tan\\left(\\frac{\\pi}{4}\\right)$, not the value of its derivative.',
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-easy-q4': {
    question: 'Find the derivative of $y = 2\\sin(3x+1)$.',
    options: ['$6\\cos(3x+1)$', '$2\\cos(3x+1)$', '$-6\\cos(3x+1)$', '$6\\sin(3x+1)$'],
    explanation:
      'Applying the chain rule: $\\frac{d}{dx}[2\\sin(3x+1)] = 2\\cos(3x+1) \\times 3 = 6\\cos(3x+1)$.\n\n**Common mistake:** Option B occurs if the student forgets to multiply by the derivative of the inner function ($3$).',
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-easy-q5': {
    question: 'Given $f(x) = \\cos\\left(x - \\frac{\\pi}{2}\\right)$, find $f\'(x)$.',
    options: [
      '$-\\sin\\left(x - \\frac{\\pi}{2}\\right)$',
      '$\\sin\\left(x - \\frac{\\pi}{2}\\right)$',
      '$\\cos x$',
      '$-\\cos x$',
    ],
    explanation:
      'Using the chain rule, $f\'(x) = -\\sin\\left(x - \\frac{\\pi}{2}\\right)$.\n\n**Common mistake:** Option B results from neglecting the negative sign in the derivative of cosine.',
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-medium-q1': {
    question: 'Differentiate $y = x^2\\cos x$ with respect to $x$.',
    options: [
      '$2x\\cos x - x^2\\sin x$',
      '$-2x\\sin x$',
      '$2x\\cos x + x^2\\sin x$',
      '$x^2\\sin x - 2x\\cos x$',
    ],
    explanation:
      'Using the product rule with $u = x^2$ and $v = \\cos x$: $\\frac{dy}{dx} = x^2(-\\sin x) + \\cos x(2x) = 2x\\cos x - x^2\\sin x$.\n\n**Common mistake:** Option B is a common error where the student simply multiplies the derivatives of the two parts together.',
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-medium-q2': {
    question: 'Find the derivative of $y = \\sin^3 x$.',
    options: [
      '$3\\sin^2 x\\cos x$',
      '$3\\sin^2 x$',
      '$-3\\sin^2 x\\cos x$',
      '$3\\cos^2 x$',
    ],
    explanation:
      'Using the chain rule on $(\\sin x)^3$: $3(\\sin x)^2 \\cdot \\cos x = 3\\sin^2 x\\cos x$.\n\n**Common mistake:** Option B results from only applying the power rule and forgetting to multiply by the derivative of the inner function.',
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-medium-q3': {
    question:
      'Find the gradient of the curve $y = \\tan(2x)$ at the point where $x = \\frac{\\pi}{8}$.',
    explanation:
      '$\\frac{dy}{dx} = 2\\sec^2(2x)$. At $x = \\frac{\\pi}{8}$, $2x = \\frac{\\pi}{4}$ and $\\sec^2\\left(\\frac{\\pi}{4}\\right) = 2$. Thus $\\frac{dy}{dx} = 2 \\times 2 = 4$.\n\n**Common mistake:** Option B occurs if the student forgets the multiplier $2$ from the chain rule derivative of the argument.',
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-medium-q4': {
    question: 'Differentiate $y = \\frac{\\sin x}{x}$ with respect to $x$.',
    options: [
      '$\\frac{x\\cos x - \\sin x}{x^2}$',
      '$\\cos x$',
      '$\\frac{\\sin x - x\\cos x}{x^2}$',
      '$\\frac{x\\cos x + \\sin x}{x^2}$',
    ],
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-medium-q5': {
    question:
      'Find the equation of the tangent to the curve $y = \\cos(2x)$ at the point where $x = \\frac{\\pi}{4}$.',
    options: [
      '$y = -2x + \\frac{\\pi}{2}$',
      '$y = 2x - \\frac{\\pi}{2}$',
      '$y = -2x$',
      '$y = 0$',
    ],
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-hard-q1': {
    question:
      'Find the $x$-coordinate of the stationary point of $y = e^x\\cos x$ for $0 < x < \\pi$.',
    explanation:
      '$\\frac{dy}{dx} = e^x(-\\sin x) + \\cos x(e^x) = e^x(\\cos x - \\sin x)$. Setting this to $0$ gives $\\cos x = \\sin x$, so $\\tan x = 1$ and $x = \\frac{\\pi}{4}$.\n\n**Common mistake:** Option A is a solution for $\\tan x = -1$, which would occur if the derivative were $\\cos x + \\sin x$.',
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-hard-q2': {
    question: 'Determine the second derivative $\\frac{d^2y}{dx^2}$ of the function $y = \\tan x$.',
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-hard-q3': {
    question:
      'Find the derivative of $y = \\sin^2(3x)$ and simplify using a double-angle identity.',
    options: ['$3\\sin(6x)$', '$6\\sin(3x)\\cos(3x)$', '$2\\sin(6x)$', '$6\\cos(6x)$'],
    explanation:
      '$\\frac{dy}{dx} = 2\\sin(3x) \\times 3\\cos(3x) = 6\\sin(3x)\\cos(3x)$. Using $2\\sin A\\cos A = \\sin 2A$, this becomes $3\\sin(6x)$.\n\n**Common mistake:** Option B is the unsimplified form; students may stop here and fail to reach the requested simplest form.',
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-hard-q4': {
    question:
      'A particle moves such that its displacement is $s = 4\\cos\\left(2t + \\frac{\\pi}{6}\\right)$. Find the velocity when $t = \\frac{\\pi}{6}$.',
    explanation:
      '$v = \\frac{ds}{dt} = -8\\sin\\left(2t + \\frac{\\pi}{6}\\right)$. At $t = \\frac{\\pi}{6}$, $v = -8\\sin\\left(\\frac{\\pi}{2}\\right) = -8$.\n\n**Common mistake:** Option A occurs if the student uses the cosine function for velocity instead of the negative sine derivative.',
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-hard-q5': {
    question:
      'Find the value of $k$ such that the derivative of $y = \\frac{1}{\\cos x}$ is $k\\sec x\\tan x$.',
    options: ['$1$', '$-1$', '$0$', '$-2$'],
    explanation:
      '$y = (\\cos x)^{-1} \\implies \\frac{dy}{dx} = -1(\\cos x)^{-2}(-\\sin x) = \\frac{\\sin x}{\\cos^2 x} = \\sec x\\tan x$. Thus $k = 1$.\n\n**Common mistake:** Option B results from a sign error when differentiating the inner cosine function.',
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-pyp-q1': {
    question:
      'Find the $x$-coordinate of the stationary point of $y = x - 2\\sin x$ for $0 < x < \\pi$.',
    options: ['$\\frac{\\pi}{3}$', '$\\frac{\\pi}{6}$', '$\\frac{\\pi}{2}$', '$\\pi$'],
    explanation:
      '$\\frac{dy}{dx} = 1 - 2\\cos x = 0 \\implies \\cos x = \\frac{1}{2} \\implies x = \\frac{\\pi}{3}$.\n\n**Common mistake:** Confusing the stationary point of $x - 2\\sin x$ with that of $\\sin x$ alone.',
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-pyp-q2': {
    question:
      'Show that the derivative of $y = \\tan x$ is $1 + \\tan^2 x$. Hence, find the exact gradient of $y = \\tan x$ at $x = \\frac{\\pi}{3}$.',
    options: ['$4$', '$\\sqrt{3}$', '$3$', '$1$'],
    explanation:
      '$\\frac{dy}{dx} = \\sec^2 x = 1 + \\tan^2 x$. At $x = \\frac{\\pi}{3}$, $\\tan\\left(\\frac{\\pi}{3}\\right) = \\sqrt{3}$, so the gradient is $1 + 3 = 4$.\n\n**Common mistake:** Option B is the value of $\\tan x$, not its derivative.',
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-pyp-q3': {
    question:
      'A curve has equation $y = 3\\sin\\left(2x - \\frac{\\pi}{4}\\right)$. Find the equation of the tangent to the curve at the point where $x = \\frac{\\pi}{4}$.',
    options: ['$y = 3$', '$y = -6x + \\frac{3\\pi}{2}$', '$y = 6x - \\frac{3\\pi}{2}$', '$y = 0$'],
    explanation:
      'At $x = \\frac{\\pi}{4}$, $y = 3\\sin\\left(\\frac{\\pi}{2}\\right) = 3$. Also $\\frac{dy}{dx} = 6\\cos\\left(2x - \\frac{\\pi}{4}\\right)$, so at $x = \\frac{\\pi}{4}$ the gradient is $0$. The tangent is the horizontal line $y = 3$.\n\n**Common mistake:** Using a non-zero gradient from an incorrect chain-rule calculation.',
    correctIndex: 0,
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-pyp-q4': {
    question:
      'Find the set of values of $x$ for which $y = x + \\cos x$ is an increasing function in the interval $0 < x < 2\\pi$.',
    options: [
      '$0 < x < \\pi$',
      '$\\pi < x < 2\\pi$',
      'all $x$ in the interval',
      'no values in the interval',
    ],
    explanation:
      '$\\frac{dy}{dx} = 1 - \\sin x$. Since $\\sin x \\le 1$, we have $1 - \\sin x \\ge 0$ for all $x$, with equality only when $\\sin x = 1$ (at $x = \\frac{\\pi}{2}$). So $y$ is increasing on $(0, 2\\pi)$ except at a single point.\n\n**Common mistake:** Thinking $\\cos x$ being negative makes the function decreasing.',
    correctIndex: 2,
  },
  '14-3-derivatives-of-trigonometric-functions-harder-topic-pyp-q5': {
    question:
      'Given $y = \\cos^2 x - \\sin^2 x$, find $\\frac{dy}{dx}$ in its simplest form.',
    options: ['$-2\\sin(2x)$', '$2\\cos(2x)$', '$-\\sin(2x)$', '$\\cos(2x)$'],
    explanation:
      '$y = \\cos 2x$, so $\\frac{dy}{dx} = -2\\sin(2x)$.\n\n**Common mistake:** Differentiating $\\cos^2 x$ and $\\sin^2 x$ separately without using the double-angle identity.',
    correctIndex: 0,
  },

  // ── 14.4 Further applications ──────────────────────────────────
  '14-4-further-applications-of-differentiation-harder-topic-easy-q4': {
    question: 'Find the equation of the tangent to $y = 5e^x$ at the point where $x = 0$.',
  },
  '14-4-further-applications-of-differentiation-harder-topic-easy-q5': {
    question: 'Find the rate of change of $y = \\tan x$ when $x = \\pi/4$.',
    options: ['$2$', '$1$', '$0$', '$\\sqrt{2}$'],
  },
  '14-4-further-applications-of-differentiation-harder-topic-medium-q2': {
    question: 'Find the equation of the normal to the curve $y = \\ln x$ at the point where $x = e$.',
    options: [
      '$y = -ex + e^2 + 1$',
      '$y = (1/e)x$',
      '$y = -ex + 1$',
      '$y = ex - 1$',
    ],
  },
  '14-4-further-applications-of-differentiation-harder-topic-medium-q3': {
    question:
      'Determine the nature of the stationary point of $y = \\sin x + \\cos x$ for $0 < x < \\pi$.',
  },
  '14-4-further-applications-of-differentiation-harder-topic-medium-q5': {
    question: 'Find the approximate change in $y = e^x$ when $x$ increases from $2$ to $2.01$.',
    options: ['$0.01e^2$', '$e^2$', '$0.01$', '$0.1e^2$'],
    explanation:
      '$\\delta y \\approx \\frac{dy}{dx}\\,\\delta x$. $\\frac{dy}{dx} = e^x$. At $x = 2$, $\\frac{dy}{dx} = e^2$. With $\\delta x = 0.01$, $\\delta y \\approx 0.01e^2$.\n\n**Common mistake:** Substituting the increment directly into the original function.',
  },
  '14-4-further-applications-of-differentiation-harder-topic-hard-q1': {
    question:
      'Find the $x$-coordinate of the stationary point of $y = e^x\\cos x$ for $0 < x < \\pi$.',
  },
  '14-4-further-applications-of-differentiation-harder-topic-hard-q2': {
    question:
      'The curve $y = 2\\ln(x+2)$ and the line $y = 2x + k$ touch at one point. Find $k$.',
    options: ['$k = 2$', '$k = 0$', '$k = 2\\ln 3 - 2$', '$k = -1$'],
    explanation:
      '$\\frac{dy}{dx} = \\frac{2}{x+2}$. For tangency with gradient $2$: $\\frac{2}{x+2} = 2 \\implies x = -1$. Then $y = 2\\ln 1 = 0$. Substituting into the line: $0 = 2(-1) + k \\implies k = 2$.\n\n**Common mistake:** Algebraic errors when equating the derivative to the line\'s gradient.',
    correctIndex: 0,
  },
  '14-4-further-applications-of-differentiation-harder-topic-hard-q3': {
    question:
      'The volume of water in a cone is $V = \\frac{1}{3}\\pi h^3$. Water flows in at $10$ cubic cm per second. Find $\\frac{dh}{dt}$ when $h = 2$ cm.',
  },
  '14-4-further-applications-of-differentiation-harder-topic-hard-q5': {
    question:
      'Determine the approximate percentage increase in $y = \\sin x$ when $x = \\pi/6$ increases by $1\\%$.',
  },
  '14-4-further-applications-of-differentiation-harder-topic-pyp-q2': {
    question:
      'Given that $y = \\ln(x^2 + 1)$, find the value of $x$ for which $\\frac{dy}{dx}$ is a maximum.',
  },
  '14-4-further-applications-of-differentiation-harder-topic-pyp-q3': {
    question: 'Find the $x$-coordinate of the stationary point of $y = 2e^{3x} - 6x$.',
  },
  '14-4-further-applications-of-differentiation-harder-topic-pyp-q1': {
    question:
      'Find the gradient of the normal to the curve $y = 3\\tan(2x)$ at the point where $x = \\frac{\\pi}{8}$.',
    explanation:
      '$\\frac{dy}{dx} = 6\\sec^2(2x)$. At $x = \\frac{\\pi}{8}$, $2x = \\frac{\\pi}{4}$ and $\\sec^2\\left(\\frac{\\pi}{4}\\right) = 2$, so $\\frac{dy}{dx} = 12$. The normal gradient is $-\\frac{1}{12}$.\n\n**Common mistake:** Giving the tangent gradient ($12$) instead of the normal gradient ($-\\frac{1}{12}$).',
  },
  '14-4-further-applications-of-differentiation-harder-topic-pyp-q4': {
    question:
      'The volume of a sphere is increasing at $12\\pi$ cm$^3$/s. When $V = 36\\pi$ cm$^3$, find $\\frac{dr}{dt}$.',
  },
  '14-4-further-applications-of-differentiation-harder-topic-pyp-q5': {
    question:
      'Find the approximate change in $y = \\cos(2x)$ as $x$ increases from $\\frac{\\pi}{4}$ to $\\frac{\\pi}{4} + h$, where $h$ is small.',
    explanation:
      '$\\frac{dy}{dx} = -2\\sin(2x)$. At $x = \\frac{\\pi}{4}$, $\\frac{dy}{dx} = -2\\sin\\left(\\frac{\\pi}{2}\\right) = -2$. So $\\delta y \\approx -2h$.\n\n**Common mistake:** Forgetting the multiplier $2$ from the chain rule or the negative sign for the derivative of cosine.',
  },
}

function countDollars(text) {
  return (text.match(/(?<!\\)\$/g) ?? []).length
}

function fixTrigNewlines(text) {
  let t = text
  // sin/cos/tan split across lines (missing backslash)
  t = t.replace(/\n(sin|cos|tan|sec|cosec|cot)(?=\(|x|\s|[+-])/gi, (_, fn) => `\\${fn}`)
  t = t.replace(/([^\\a-z])(sin|cos|tan|sec)(?=\(|x)/gi, (m, pre, fn) => {
    if (pre === '\\' || pre === '$') return m
    return `${pre}\\${fn}`
  })
  t = t.replace(/(?<!\\)pi(?![a-z])/g, '\\pi')
  t = t.replace(/\bsqrt2\b/g, '\\sqrt{2}')
  return t
}

function fixBrokenDisplayMath(text) {
  return text
    .replace(/\$\$\s*\\n\s*\\sqrt\{([^}]+)\}\s*\\n/g, '$$\\sqrt{$1}$$')
    .replace(/\$\$\s*\\n\s*\\sqrt\{([^}]+)\}\s*$/g, '$$\\sqrt{$1}$$')
}

function fixCh14Artifacts(text) {
  if (!text || typeof text !== 'string') return text
  let t = text

  t = fixTrigNewlines(t)
  t = fixBrokenDisplayMath(t)

  // Caret / docx glue
  t = t.replace(/(coefficient|multiplier|derivative|constant|Setting this) to\^(\d+)/gi, '$1 to $$2$')
  t = t.replace(/by\^(\d+)%/g, 'by $$1$%')
  t = t.replace(/\$12\\pi\^2 So /g, '$12\\pi$ when ')
  t = t.replace(/\$x2([a-z]{1,3})\$/gi, (_, rest) => {
    const map = { y: '\\frac{dy}{dx}', x: 'x' }
    return map[rest] ?? `$x$ and $${rest}$`
  })
  t = t.replace(/\$dy\/dx2x/g, '$\\frac{dy}{dx}$ when $x')
  t = t.replace(/\$\\frac\{dy\}\{dx\}\$\$/g, '$\\frac{dy}{dx}$')
  t = t.replace(/\$2\\frac\{dy\}\{dx\}/g, '$\\frac{dy}{dx}$')

  // Unclosed math before final period
  t = t.replace(/ with respect to \$x\.$/, ' with respect to $x$.')
  t = t.replace(/ is \$\\cot x\.$/, ' is $\\cot x$.')
  t = t.replace(/ \$y = \\ln x - x\.$/, ' $y = \\ln x - x$.')
  t = t.replace(/ \$y = 4 \\ln x\.$/, ' $y = 4 \\ln x$.')
  t = t.replace(/ \$y = x\^2 e\^x\.$/, ' $y = x^2 e^x$.')
  t = t.replace(/ \$y = e\^\{x\^2 \+ 3x\}\$ with respect to \$x\.$/, ' $y = e^{x^2 + 3x}$ with respect to $x$.')
  t = t.replace(/ \$y = \\frac\{e\^x\}\{x\}\$ with respect to \$x\.$/, ' $y = \\frac{e^x}{x}$ with respect to $x$.')
  t = t.replace(/ \$y = 2e\^\{3x\} - 6x\.$/, ' $y = 2e^{3x} - 6x$.')
  t = t.replace(/ \$0 < x < \\pi\.$/, ' for $0 < x < \\pi$.')
  t = t.replace(/ \$x > 0\.$/, ' for $x > 0$.')
  t = t.replace(/ \$x = e\.$/, ' at $x = e$.')
  t = t.replace(/ So \$x = 2\.$/, ' at $x = 2$.')
  t = t.replace(/ So \$y = 0\.$/, ' at the point where $y = 0$.')
  t = t.replace(/ So \$x = 0\.$/, ' at the point where $x = 0$.')

  // Unwrap prose trapped in leading $
  t = t.replace(/^\$Find /, 'Find ')
  t = t.replace(/^\$Differentiate /, 'Differentiate ')
  t = t.replace(/^\$Show /, 'Show ')
  t = t.replace(/^\$Given /, 'Given ')

  // Broken sin^2 patterns
  t = t.replace(/\\sin\^\{2\}\$x/g, '\\sin^2 x')
  t = t.replace(/\\cos\^\{2\}\$x/g, '\\cos^2 x')
  t = t.replace(/\\tan\^\{2\}\$x/g, '\\tan^2 x')
  t = t.replace(/\\sec\^\{2\}\$/g, '\\sec^2 ')

  if (countDollars(t) % 2 !== 0 && /\$[^$]+\.$/.test(t)) {
    t = t.replace(/\$([^$]+)\.$/, '$$$1$.')
  }

  return t
}

function repairString(val) {
  if (typeof val !== 'string') return val
  return fixCh14Artifacts(val)
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
console.log(`Ch.14 repair done — ${files} files`)
