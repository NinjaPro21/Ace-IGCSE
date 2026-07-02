## Core idea

The Factor Theorem is a targeted algebraic tool that determines whether a specific linear binomial (x−c) divides exactly into a polynomial f(x) without resorting to full long division. Use this when you need to rapidly guess or verify the rational linear roots of cubic or higher-degree equations. If substituting a value c into the polynomial yields an output of zero, that value is confirmed as an exact root, and its corresponding binomial is an official structural factor.

## Key formulas

$$
f(c) = 0 \implies (x - c) \text{ is a factor of } f(x)
$$
$f\left(\frac{b}{a}\right) = 0 \implies (ax - b) \text{ is a factor of } f(x)$

## Steps / method

Identify the proposed linear factor, written in the general mathematical form (ax−b).

Solve the factor for zero to extract its root value, which yields $x = \frac{b}{a}$.

Substitute this exact fraction or integer directly into every variable instance within the given polynomial $f(x)$.

Evaluate the arithmetic operations completely; if the final total equals zero, conclude definitively that (ax−b) is a factor.

### Key rule

If $f(c) = 0$, then $(x - c)$ is a factor; always substitute the root from the linear factor — for $(x + 3)$, evaluate $f(-3)$, not $f(3)$.

## Worked example — Testing $(x - 2)$

Show that $(x - 2)$ is a factor of $f(x) = x^3 - 3x^2 - 4x + 12$.

Evaluate $f(2) = 8 - 12 - 8 + 12 = 0$. Since $f(2) = 0$, $(x - 2)$ is a factor.

## Worked example — Testing $(2x - 3)$

Is $(2x - 3)$ a factor of $f(x) = 2x^3 - 7x^2 + 7x - 3$?

Set $2x - 3 = 0 \implies x = \frac{3}{2}$. Evaluate $f\left(\frac{3}{2}\right) = \frac{27}{4} - \frac{63}{4} + \frac{21}{2} - 3 = 0$.

Since $f\left(\frac{3}{2}\right) = 0$, $(2x - 3)$ is a factor.

## Examiner tip

Examiners frequently trick students by changing the sign of the root value inside the polynomial. If you are testing whether (x+3) is a factor, you must evaluate f(−3), not f(3). Substituting the wrong sign will invalidate your analysis and cause you to miss points.

## Quick check

If f(−2)=0, then (x+2) is a guaranteed clean factor of the polynomial.
