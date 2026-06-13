## Core idea

Finding where a line and a circle intersect involves solving a system of simultaneous quadratic equations. Analyzing the discriminant of the resulting quadratic reveals whether the line cuts through the circle at two distinct points, touches it at a single point as a tangent, or misses the circle entirely.

## Key formulas

$$\text{Substitute } y = mx + c \text{ into } (x - h)^2 + (y - k)^2 = r^2$$

$$\Delta = b^2 - 4ac \implies \text{Determines intersection count (2, 1, or 0).}$$

## Steps / method

Isolate one variable from the straight-line equation (e.g., $y = mx + c$).

Substitute this expression into the circle's equation, replacing every instance of that chosen variable.

Fully expand all the squared terms and combine like terms to form a standard quadratic equation: $Ax^2 + Bx + C = 0$.

Calculate the value of the discriminant ($B^2 - 4AC$).

If coordinates are required, solve the quadratic equation to find the values of $x$, then find $y$ using the linear equation.

### Key rule

Substitute the line into the circle, then use $\Delta = b^2 - 4ac$: $\Delta > 0$ (two points), $\Delta = 0$ (tangent), $\Delta < 0$ (no intersection).

## Worked example — Two intersection points

Find where the line $y = x + 1$ meets the circle $x^2 + y^2 = 25$.

Substitute: $x^2 + (x + 1)^2 = 25 \implies 2x^2 + 2x - 24 = 0 \implies x^2 + x - 12 = 0$

$$(x + 4)(x - 3) = 0 \implies x = -4 \text{ or } x = 3$$

Points: $(-4, -3)$ and $(3, 4)$. Here $\Delta = 4 + 48 = 52 > 0$.

## Worked example — Tangent condition

For what value of $c$ is $y = 2x + c$ tangent to $x^2 + y^2 = 5$?

Substitute: $x^2 + (2x + c)^2 = 5 \implies 5x^2 + 4cx + c^2 - 5 = 0$

For tangency, $\Delta = 0$: $(4c)^2 - 4(5)(c^2 - 5) = 0 \implies -4c^2 + 100 = 0 \implies c = \pm 5$

## Examiner tip

When a line is tangent to a circle, the radius drawn to the point of contact is perpendicular to that line. You can use this geometric property ($m_{\text{radius}} \times m_{\text{tangent}} = -1$) as an alternative way to solve or verify tangent problems without using the discriminant.

## Quick check

If the discriminant of the combined line-circle equation is exactly zero, then the line acts as a tangent touching the circle once.

## Visual / interactive intent

New explorer: Circle tangent visualizer. A circle centered at the origin with an adjustable secant/tangent line. Users slide the line closer to the circle, tracking how the two intersection coordinates merge into a single tangent point as $b^2 - 4ac$ approaches zero.
