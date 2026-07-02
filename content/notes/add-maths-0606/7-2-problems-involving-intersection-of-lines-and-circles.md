## Core idea

This topic finds where a straight line meets a circle. Algebraically you solve simultaneous equations; geometrically the line may be a **chord** (2 intersections), a **tangent** (1), or miss the circle entirely (0).

## Key formulas

**Substitution**

Substitute the line $y = mx + c$ into $(x - h)^2 + (y - k)^2 = r^2$.

**Discriminant**

$$
\Delta = b^2 - 4ac
$$

| Condition | Intersections |
|-----------|---------------|
| $\Delta > 0$ | 2 (chord) |
| $\Delta = 0$ | 1 (tangent) |
| $\Delta < 0$ | 0 (no contact) |

## Steps / method

1. **Substitute** the linear equation into the circle equation.
2. **Simplify** to a quadratic in one variable.
3. **Solve** for coordinates, or calculate $\Delta$ to determine the nature of intersection.
4. **For a tangent**, set $\Delta = 0$ and solve for the unknown constant.

### Key rule

Use brackets carefully when calculating $\Delta$, especially with negative coefficients: $(-4)^2 = 16$, not $-4^2 = -16$.

## Worked example — Finding intersections

Question: Find where $y = x + 1$ meets $x^2 + y^2 = 5$.

Substitute $y = x + 1$:

$$
x^2 + (x + 1)^2 = 5
$$

$$
2x^2 + 2x - 4 = 0 \Rightarrow x^2 + x - 2 = 0 \Rightarrow (x + 2)(x - 1) = 0
$$

So $x = -2$ or $x = 1$, giving points $(-2, -1)$ and $(1, 2)$.

## Worked example — Tangent condition

Question: For which values of $k$ is $y = 2x + k$ a tangent to $x^2 + y^2 = 5$?

Substitute:

$$
x^2 + (2x + k)^2 = 5 \Rightarrow 5x^2 + 4kx + (k^2 - 5) = 0
$$

For a tangent, $\Delta = 0$:

$$
(4k)^2 - 4(5)(k^2 - 5) = 0 \Rightarrow 16k^2 - 20k^2 + 100 = 0 \Rightarrow k^2 = 25
$$

So $k = \pm 5$.

## Examiner tip

To find the tangent at a point $(x_1, y_1)$ on the circle, the tangent is perpendicular to the radius. Find the radius gradient $m_r$, then use $m_t = -\frac{1}{m_r}$ in $y - y_1 = m_t(x - x_1)$.

## Quick check

If $\Delta < 0$ for the combined quadratic, the line and circle never touch.
