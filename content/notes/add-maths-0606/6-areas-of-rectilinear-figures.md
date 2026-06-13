## Core idea

The area of any polygon on a coordinate grid can be calculated using the vertices' coordinate points via the shoelace formula. This method avoids the need to break irregular polygons down into simpler triangles and rectangles, working for triangles, quadrilaterals, and higher-order shapes.

## Key formulas

$$\text{Area} = \frac{1}{12} \left| \begin{matrix} x_1 &amp; x_2 &amp; x_3 &amp; \dots &amp; x_1 \\ y_1 &amp; y_2 &amp; y_3 &amp; \dots &amp; y_1 \end{matrix} \right|$$

$$\text{Area} = \frac{1}{2} |(x_1y_2 + x_2y_3 + \dots + x_ny_1) - (y_1x_2 + y_2x_3 + \dots + y_nx_1)|$$

## Steps / method

List all coordinate vertices of the polygon in order, moving counter-clockwise around the shape.

Write down the coordinates in two vertical columns, repeating the initial starting coordinate pair at the very bottom of the list.

Multiply along the downward diagonals (top-left to bottom-right) and sum all those products together.

Multiply along the upward diagonals (bottom-left to top-right) and sum all those products together.

Subtract the sum of the upward products from the sum of the downward products, take the absolute value, and multiply by $\frac{1}{2}$.

### Key rule

List vertices in order (clockwise or anticlockwise) and **repeat the first vertex** at the end before applying the shoelace formula.

## Worked example — Triangle area

Find the area of triangle with vertices $A(0, 0)$, $B(4, 0)$, and $C(2, 3)$.

$$\text{Area} = \frac{1}{2}|(0 \cdot 0 + 4 \cdot 3 + 2 \cdot 0) - (0 \cdot 4 + 0 \cdot 2 + 3 \cdot 0)| = \frac{1}{2}|12| = 6 \text{ units}^2$$

## Worked example — Quadrilateral area

Find the area of quadrilateral with vertices $(1, 1)$, $(5, 1)$, $(6, 4)$, $(2, 5)$.

$$\text{Area} = \frac{1}{2}|(1 + 5 + 24 + 2) - (1 + 4 + 10 + 5)| = \frac{1}{2}|32 - 20| = 6 \text{ units}^2$$

## Examiner tip

The most common mistake is forgetting to repeat the first coordinate pair at the bottom of the shoelace matrix. Omitting this step leaves the polygon unclosed, leading to an incorrect area calculation.

## Quick check

If the shoelace calculation yields a negative value, taking the absolute modulus values ensures the final area is positive.

## Visual / interactive intent

New explorer: Shoelace area calculator. A dynamic coordinate canvas where users click to place vertices forming a polygon. The app draws colored diagonal lines matching the shoelace calculation steps, showing the arithmetic live.
