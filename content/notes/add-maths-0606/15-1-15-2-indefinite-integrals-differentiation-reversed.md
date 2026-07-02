## Core idea

Integration is the reverse of differentiation — it finds the **anti-derivative**. An indefinite integral gives a family of functions, so always add the constant of integration $C$.

## Key formulas

**Power rule**

$$
\int x^n\,dx = \frac{x^{n+1}}{n+1} + C \quad (n \neq -1)
$$

**Constant multiple and sum**

$$
\int k\,f(x)\,dx = k\int f(x)\,dx, \qquad \int [f(x) + g(x)]\,dx = \int f(x)\,dx + \int g(x)\,dx
$$

## Steps / method

1. **Identify** the form of each term in the integrand.
2. **Integrate** term by term using the power rule.
3. **Add** $+C$ to the final answer for indefinite integrals.

### Key rule

Integration reverses differentiation. Never forget $+C$ for indefinite integrals.

## Worked example — Polynomial integral

Question: Find $\int (3x^2 - 4x + 1)\,dx$.

$$
\int (3x^2 - 4x + 1)\,dx = x^3 - 2x^2 + x + C
$$

## Worked example — Finding the constant of integration

Question: Given $\frac{dy}{dx} = 2x + 1$ and the curve passes through $(1, 4)$, find $y$.

Integrate: $y = x^2 + x + C$

At $(1, 4)$: $4 = 1 + 1 + C$, so $C = 2$

Therefore $y = x^2 + x + 2$

## Examiner tip

The power rule does not work when the exponent is $-1$. Use $\int \frac{1}{x}\,dx = \ln|x| + C$ instead.

## Quick check

If you integrate $e^{2x}$, the indefinite integral is $\frac{1}{2}e^{2x} + C$
