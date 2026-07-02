## Core idea

Simultaneous equations involving one linear equation and one non-linear equation represent the geometric intersection points between a straight line and a curve. Because the system results in a quadratic equation upon substitution, there can be a maximum of two unique real coordinate solutions, one solution (tangent), or zero solutions.

## Key formulas

$$
\text{Linear: } y = mx + c

\text{Non-Linear: } ay^2 + bxy + cx^2 + dx + ey + f = 0
$$


## Steps / method

Isolate one of the variables (either $x$ or $y$) from the linear equation to get a clear expression (e.g., $y = mx + c$).

Substitute this linear expression into every instance of that chosen variable within the non-linear equation.

Expand all brackets, collect like terms, and rearrange the expression into the standard quadratic form: $Ax^2 + Bx + C = 0$.

Solve the quadratic equation using factorization or the quadratic formula to find the input coordinate values.

Substitute these values back into the original linear equation to solve for the corresponding partner coordinates.

### Key rule

Substitute the linear expression into the non-linear equation to obtain a quadratic; verify every coordinate pair by substituting back into the **linear** equation.

## Worked example — Line meets a parabola

Solve $y = x + 1$ and $y = x^2 - 3x + 5$ simultaneously.

Substitute: $x + 1 = x^2 - 3x + 5 \implies x^2 - 4x + 4 = 0 \implies (x - 2)^2 = 0$.

So $x = 2$ and $y = 2 + 1 = 3$. The line touches the parabola at the single point $(2, 3)$.

## Worked example — Two intersection points

Solve $y = 2x - 1$ and $y = x^2 - 2$.

Substitute: $2x - 1 = x^2 - 2 \implies x^2 - 2x - 1 = 0$.

Using the quadratic formula: $x = \frac{2 \pm \sqrt{8}}{2} = 1 \pm \sqrt{2}$.

When $x = 1 + \sqrt{2}$, $y = 1 + 2\sqrt{2}$; when $x = 1 - \sqrt{2}$, $y = 1 - 2\sqrt{2}$.

## Examiner tip

Always substitute your solved variable values back into the linear equation rather than the non-linear one. Using the non-linear equation can generate invalid, extraneous coordinate pairs that will penalize your accuracy score.

## Quick check

If the resulting quadratic equation has a discriminant equal to zero, then the line touches the curve at exactly one point.
