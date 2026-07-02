## Core idea

This topic combines simultaneous equations with the discriminant. It allows us to determine if a line cuts a curve twice, touches it once (tangent), or misses it entirely.

## Key formulas

**Combined quadratic**

$$
Ax^2 + Bx + C = 0
$$

**Tangent / intersection conditions**

| Wording | Condition |
|---------|-----------|
| Intersects at two points | $\Delta > 0$ |
| Tangent (one point) | $\Delta = 0$ |
| No intersection | $\Delta < 0$ |

where $\Delta = B^2 - 4AC$.

## Steps / method

1. **Substitute** the linear equation into the curve equation.
2. **Simplify** into a quadratic in $x$.
3. **Apply the discriminant** based on the wording of the question.

### Key rule

Be very careful with signs when calculating $B^2 - 4AC$. Use brackets for negative values: $(-4)^2 = 16$, not $-4^2 = -16$.

## Worked example — Finding range of $k$

Question: Find the range of values of $k$ for which the line $y = x + k$ does not intersect the curve $y = x^2 + 5x$.

Combine:

$$
x + k = x^2 + 5x \Rightarrow x^2 + 4x - k = 0
$$

For no intersection, $\Delta < 0$:

$$
4^2 - 4(1)(-k) < 0 \Rightarrow 16 + 4k < 0 \Rightarrow k < -4
$$

## Worked example — Proving tangency

Question: Show that $y = 4x - 4$ is a tangent to $y = x^2$.

Combine:

$$
x^2 = 4x - 4 \Rightarrow x^2 - 4x + 4 = 0
$$

$$
\Delta = (-4)^2 - 4(1)(4) = 16 - 16 = 0
$$

Since $\Delta = 0$, the line is a **tangent**.

## Examiner tip

Be very careful with signs when calculating $b^2 - 4ac$. A common mistake is writing $-4^2$ (which is $-16$) instead of $(-4)^2$ (which is $16$).

## Quick check

If a line is a tangent, the resulting quadratic equation should be a perfect square, like $(x - 2)^2 = 0$.
