## Core idea

Cubic expressions contain a variable with a maximum exponent of 3, generating a curve that features up to two local turning points and a maximum of three real x-intercepts. Use cubic equation solving techniques when determining equilibrium volumes, optimizing multi-dimensional constraints, or tracing higher-order geometric models. Solving these requires using the Factor Theorem to find an initial linear factor, separating it out, and then solving the remaining quadratic part.

## Key formulas

General form: $ax^3 + bx^2 + cx + d = 0$

Factored form: $(x - x_1)(x - x_2)(x - x_3) = 0$ or $(x - x_1)(ax^2 + bx + c) = 0$

## Steps / method

Use the Factor Theorem to test integer values of x (usually targeting factors of the constant term d) until you discover an initial root where f(c)=0.

Set up a polynomial division or use synthetic algebraic matching to divide f(x) by the confirmed linear factor (x−c), isolating a quadratic quotient (ax2+bx+c).

Factorize or apply the quadratic formula to this newly isolated quadratic quotient to locate the final remaining roots of the equation.

List all valid real solutions clearly, noting if any real roots are repeated or if the quadratic component yields no real roots.

### Key rule

Find one linear factor using the Factor Theorem, divide it out, then solve the remaining quadratic quotient for the other roots.

## Worked example — Three distinct roots

Solve $x^3 - 6x^2 + 11x - 6 = 0$.

Test $x = 1$: $1 - 6 + 11 - 6 = 0$, so $(x - 1)$ is a factor.

Divide: $x^3 - 6x^2 + 11x - 6 = (x - 1)(x^2 - 5x + 6) = (x - 1)(x - 2)(x - 3)$.

Roots: $x = 1$, $x = 2$, $x = 3$.

## Worked example — One real root only

Solve $x^3 + x^2 + x + 1 = 0$.

Test $x = -1$: $-1 + 1 - 1 + 1 = 0$, so $(x + 1)$ is a factor.

Quotient: $x^2 + 1 = 0$ has $\Delta = -4 < 0$, so no further real roots. The only real solution is $x = -1$.

## Examiner tip

When an exam question asks you to &quot;fully factorize&quot; a cubic expression, do not stop after finding the first root. You must show the linear factor multiplied by the remaining quadratic expression, and then completely break down that quadratic into two additional linear factors if real roots exist.

## Quick check

If a cubic equation passes through an initial root and its remaining quadratic quotient has a negative discriminant (Δ&lt;0), then the cubic function has exactly one unique real solution.

## Visual / interactive intent

New explorer — Cubic curve trace engine. Provides sliders for coefficients a,b,c,d. Students drag them to see how the local maximum and minimum coordinates morph, showing visually how the curve transitions from having three unique x-intercepts to just one real x-intercept.
