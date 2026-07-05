## Core idea

The area of polygons on a coordinate plane can be found using the **shoelace formula**. This is more efficient than splitting the shape into triangles and rectangles.

## Key formulas

**Shoelace formula**

$$
\text{Area} = \frac{1}{2}\left|(x_1 y_2 + x_2 y_3 + \cdots + x_n y_1) - (y_1 x_2 + y_2 x_3 + \cdots + y_n x_1)\right|
$$

## Steps / method

1. **List coordinates** in a column, repeating the first point at the bottom.

2. **Multiply diagonally** downward (left to right) and sum.

3. **Multiply diagonally** upward and sum.

4. **Subtract**, take the absolute value, and divide by 2.

### Key rule

Always repeat the first coordinate at the end of your list before applying the formula.

## Worked example — Triangle area

Question: Find the area of a triangle with vertices $(1, 2)$, $(4, 5)$, and $(2, 8)$.

List: $(1,2)$, $(4,5)$, $(2,8)$, $(1,2)$.

Down: $(1 \times 5) + (4 \times 8) + (2 \times 2) = 5 + 32 + 4 = 41$

Up: $(2 \times 4) + (5 \times 2) + (8 \times 1) = 8 + 10 + 8 = 26$

$$
\text{Area} = \frac{1}{2}|41 - 26| = 7.5 \text{ units}^2
$$

## Examiner tip

Always repeat the first coordinate at the end. Missing this step makes the area calculation fundamentally wrong.

## Quick check

For a triangle with a horizontal or vertical base, you can al so use $\text{Area} = \frac{1}{2} \times \text{base} \times \text{height}$.
