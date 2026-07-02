## Core idea

Advanced differentiation extends calculus beyond polynomial functions to include transcendental functions like exponentials, logarithms, and trigonometric waves. These functions follow specific derivative rules that can be combined with the chain, product, and quotient rules to analyze more complex rates of change.

## Key formulas

$\frac{d}{dx}(e^x) = e^x$

$\frac{d}{dx}(e^{f(x)}) = f'(x)e^{f(x)}$

## Steps / method

Identify the core function type (exponential, log, or trig wave) and its inner algebraic expression.

Apply the specific derivative rule for that function type while keeping the inner expression intact.

Multiply the result by the derivative of the inner expression according to the chain rule.

When differentiating a natural logarithm function, place the derivative of the inner term over the original inner term.

For complex combinations, use the product or quotient rules alongside these transcendental derivative steps.

### Key rule

Differentiate the outer function while keeping the inner expression intact, then multiply by the derivative of the inner expression. Watch the **minus sign** when differentiating $\cos$.

## Worked example — Exponential and logarithm

Differentiate $y = e^{3x - 1}$ and $y = \ln(2x + 5)$.

$$
\frac{dy}{dx} = 3e^{3x - 1}, \quad \frac{dy}{dx} = \frac{2}{2x + 5}
$$

## Worked example — Trigonometric

Differentiate $y = \sin(2x + \pi)$ and $y = \cos(4x)$.

$$
\frac{dy}{dx} = 2\cos(2x + \pi), \quad \frac{dy}{dx} = -4\sin(4x)
$$

## Examiner tip

Pay close attention to signs when differentiating trigonometric functions. Differentiating a sine function gives a positive cosine function, but differentiating a cosine function introduces a negative sign, resulting in a negative sine function.

## Quick check

If you differentiate the function $y = \cos(3x)$, its derivative is exactly equal to $\frac{dy}{dx} = -3\sin(3x)$.
