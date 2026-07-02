## Core idea

Coordinate geometry uses algebraic formulas to analyze points, line segments, and geometric shapes plotted on a Cartesian coordinate grid. It provides exact methods for calculating the midpoint, total length, and gradient of any line segment connecting two coordinates. Use these formulas to analyze geometric properties, verify shapes, and solve spatial navigation problems.

## Key formulas

$$
\text{Gradient (Slope) Equation:} \quad m = \frac{y_2 - y_1}{x_2 - x_1}

\text{Midpoint Coordinate Formula:} \quad M = \left( \frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2} \right)

\text{Line Segment Length (Pythagoras):} \quad d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}
$$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 280 240" width="280" height="240" role="img" aria-label="Coordinate plane">
      <line x1="140" y1="20" x2="140" y2="220" stroke="#94a3b8"/>
      <line x1="20" y1="120" x2="260" y2="120" stroke="#94a3b8"/>
      <circle cx="200" cy="70" r="5" fill="#2563eb"/>
      <line x1="200" y1="70" x2="200" y2="120" stroke="#64748b" stroke-dasharray="3 2"/>
      <line x1="140" y1="70" x2="200" y2="70" stroke="#64748b" stroke-dasharray="3 2"/>
      <text x="205" y="65" font-size="10" fill="#2563eb">(x, y)</text>
    </svg></div>

Coordinate plane — read $(x, y)$ from horizontal then vertical; gradient = rise ÷ run.

## Steps / method

Label the two given coordinate points clearly as $(x_1, y_1)$ and $(x_2, y_2)$ to avoid mixing up values during substitution.

To find the gradient, divide the vertical change ($y_2 - y_1$) by the horizontal change ($x_2 - x_1$).

To locate the midpoint, calculate the average of the x-coordinates and the average of the y-coordinates separately.

To calculate the total length, find the horizontal and vertical distances, square them, add them together, and take the square root of the sum.

## Examiner tip

Be careful when dealing with negative values in the gradient formula. For points like $(2, -3)$ and $(5, -7)$, the gradient calculation is $m = \frac{-7 - (-3)}{5 - 2} = \frac{-7 + 3}{3} = -\frac{4}{3}$. Forgetting to turn double negatives into additions is a frequent source of error on Paper 2.

## Quick check

The midpoint of a line segment is the arithmetic average of its endpoint coordinates, meaning it will always lie exactly halfway between them.

## Worked example — Example 1 (June 2023 P21 Q15)

Find the midpoint and total length of the line segment connecting coordinate points $A(2, -1)$ and $B(6, 7)$.

Label the coordinates: $x_1 = 2, y_1 = -1$ and $x_2 = 6, y_2 = 7$.

Substitute these into the midpoint formula: $M = \left( \frac{2 + 6}{2}, \frac{-1 + 7}{2} \right) = \left( \frac{8}{2}, \frac{6}{2} \right) = (4, 3)$.

Substitute the coordinates into the length formula: $d = \sqrt{(6 - 2)^2 + (7 - (-1))^2}$.

Simplify the squared terms: $d = \sqrt{(4)^2 + (8)^2} = \sqrt{16 + 64} = \sqrt{80}$.

Calculate the final decimal length to $3$ significant figures: $d \approx 8.94$.

## Worked example — Example 2 (Nov 2022 P42 Q8a)

Point $P$. $(1, 3)$ and point $Q$. $(5, k)$. Given that the gradient of the straight line segment $PQ$. . , calculate the value of the unknown parameter $k$.

Set up the gradient formula using the given points: $m = \frac{k - 3}{5 - 1}$.

Simplify the denominator: $m = \frac{k - 3}{4}$.

Substitute the given gradient value ($m = 2$) into the equation: $2 = \frac{k - 3}{4}$.

Multiply both sides by $4$ to clear the fraction: $8 = k - 3$. Add $3$ to both sides to find the value of $k$. So $k = 11$.
