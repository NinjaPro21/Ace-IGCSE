## Core idea

The discriminant ($\Delta = b^2 - 4ac$) determines the nature of the roots of a quadratic equation, revealing how many times a function hits zero. When applied to a combined line-and-curve system, it evaluates whether a line cuts through a curve twice, touches it once as a tangent line, or misses it entirely.

## Key formulas

$$
\Delta = b^2 - 4ac
$$

$$
\Delta > 0 \implies \text{Two distinct real roots}
$$

$$
\Delta = 0 \implies \text{One repeated root (tangent)}
$$

$$
\Delta < 0 \implies \text{No real roots}
$$

## Steps / method

Equate the line equation and the curve equation together ($f(x) = g(x)$) to form a unified equation.

Group all variables systematically onto one side to construct a single standard quadratic expression: $Ax^2 + Bx + C = 0$.

Extract the clear coefficients for $A$, $B$, and $C$, taking care to include full algebraic groupings if they contain unknown variables like $k$.

Substitute these structural parameters directly into the discriminant expression: $B^2 - 4AC$.

Set up the appropriate inequality or equation based on the requested condition ($>0$, $=0$, or $<0$) and solve for the unknown parameter.

### Key rule

Set $f(x) = g(x)$, rearrange into $Ax^2 + Bx + C = 0$, and use $\Delta = B^2 - 4AC$ to determine whether the line cuts, touches, or misses the curve.

## Worked example — Tangent condition

The line $y = kx + 2$ is tangent to the curve $y = x^2 - 4x + 7$. Find $k$.

Equate: $kx + 2 = x^2 - 4x + 7 \implies x^2 - (k + 4)x + 5 = 0$.

For a tangent, $\Delta = 0$: $(k + 4)^2 - 20 = 0 \implies k + 4 = \pm 2\sqrt{5}$ when 2 or $k = -4 - 2\sqrt{5}$.

## Worked example — No intersection

For what values of $k$ does the line $y = x + k$ not intersect $y = x^2$?

Equate: $x + k = x^2 \implies x^2 - x - k = 0$. For no intersection, $\Delta = 1 + 4k < 0$, so $k < -\frac{1}{4}$.

## Examiner tip

When a question states that a line and a curve "do not intersect," set $b^2 - 4ac < 0$. If it states they "intersect," this implies both one or two points, so you must use $\Delta \ge 0$. Missing the equality condition loses marks.

## Quick check

If $\Delta > 0$, then the quadratic equation has two distinct real roots.
