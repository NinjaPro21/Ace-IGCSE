## Core idea

Integration is the mathematical reverse process of differentiation, often referred to as finding the anti-derivative. An indefinite integral finds a general family of functions that share the same derivative, which requires adding an arbitrary constant of integration ($C$) to represent the original constant value that was lost during differentiation.

## Key formulas

$\frac{d}{dx}(\sin x) = \cos x$

$\frac{d}{dx}(\cos x) = -\sin x$

$\frac{d}{dx}(\tan x) = \sec^2 x$

## Steps / method

Identify the form of the expression inside the integral sign.

For basic polynomial powers, increase the exponent by 1, then divide the term by this new power.

For linear composite brackets of the form $(ax+b)^n$, increase the power by 1, then divide by both the new power and the coefficient $a$.

For exponential and trigonometric terms, apply the reverse derivative rules, dividing by the inner linear coefficient $a$ rather than multiplying.

Always append the constant of integration ($+C$) to the end of your final expression for all indefinite integrals.

### Key rule

Integration reverses differentiation. For $(ax+b)^n$, divide by both the new power and the coefficient $a$. Never forget $+C$ for indefinite integrals.

## Worked example — Polynomial integral

Find $\int (3x^2 - 4x + 1)\, dx$.

$$
\int (3x^2 - 4x + 1)\, dx = x^3 - 2x^2 + x + C
$$

## Worked example — Exponential integral

Find $\int e^{2x - 3}\, dx$.

$$
\int e^{2x - 3}\, dx = \frac{1}{2}e^{2x - 3} + C
$$

## Examiner tip

Remember that the power rule does not work when the exponent is $-1$, such as for the function $\frac{1}{x}$. Attempting to apply the power rule here leads to division by zero; instead, recognize that this terms integrates to a natural logarithm function ($\ln|x|$).

## Quick check

If you integrate the function $y = e^{2x}$, the indefinite integral is equal to $\frac{1}{2}e^{2x} + C$.
