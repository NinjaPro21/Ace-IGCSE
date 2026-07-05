## Core idea

The derivative of a curve evaluated at a specific point gives the gradient of the tangent line at that location. The normal line is perpendicular to the tangent at that same point of contact, meaning its gradient is the negative reciprocal of the tangent's gradient.

## Key formulas

$$
\text{Gradient of Tangent: } m_t = \left. \frac{dy}{dx} \right|_{x = x_1}
$$
$$
\text{Gradient of Normal: } m_n = -\frac{1}{m_t}
$$
$$
\text{Equations: } y - y_1 = m_t(x - x_1) \quad \text{and} \quad y - y_1 = m_n(x - x_1)
$$

## Steps / method

Differentiate the function equation to find the gradient expression: $\frac{dy}{dx}$.

Substitute the given coordinate value $x_1$ into this derivative to find the numerical gradient of the tangent ($m_t$).

If you need to find the equation of the normal, calculate its gradient using the negative reciprocal formula ($m_n = -\frac{1}{m_t}$).

Find the corresponding $y_1$ coordinate by substituting $x_1$ back into the original function equation if it wasn't provided.

Substitute the coordinates $(x_1, y_1)$ and the appropriate gradient ($m_t$ or $m_n$) into the linear equation formula: $y - y_1 = m(x - x_1)$.

### Key rule

The tangent gradient comes from $\frac{dy}{dx}$ at the point — not from the original curve equation. The normal gradient is the negative reciprocal of the tangent gradient.

## Worked example — Equation of tangent

Find the equation of the tangent to $y = x^2 + 3x$ at the point where $x = 2$.

When $x = 2$, $y = 4 + 6 = 10$. Al so $\frac{dy}{dx} = 2x + 3$, so at $x = 2$, $m_t = 7$.

$$
y - 10 = 7(x - 2) \implies y = 7x - 4
$$

## Worked example — Equation of normal

At the same point $(2, 10)$ with $m_t = 7$: $$
$m_n = -\frac{1}{7}$

$y - 10 = -\frac{1}{7}(x - 2) \implies 7y - 70 = -x + 2 \implies x + 7y = 72$

## Examiner tip

A common mistake is using the original function equation to find the gradient instead of the derivative. Remember: the original equation outputs position coordinates, while the derivative outputs the gradient.

## Quick check

If a tangent line has a slope of 4, then the normal line at that same point must have a slope of $-\frac{1}{4}$.
