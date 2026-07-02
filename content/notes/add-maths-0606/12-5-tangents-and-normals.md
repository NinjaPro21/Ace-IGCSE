## Core idea

The derivative gives the **gradient** of a curve at any point. Use it to find the equation of the **tangent** (line touching the curve) or the **normal** (line perpendicular to the tangent) at a given point.

## Key formulas

**Point–gradient form**

$$
y - y_1 = m(x - x_1)
$$

**Tangent gradient**

$$
m_{\text{tangent}} = \frac{dy}{dx}\bigg|_{x = x_1}
$$

**Normal gradient**

$$
m_{\text{normal}} = -\frac{1}{m_{\text{tangent}}}
$$

## Steps / method

1. **Differentiate** to find $\dfrac{dy}{dx}$.
2. **Substitute** the given $x$-value to find the tangent gradient.
3. **Find** $(x_1, y_1)$ on the curve — substitute $x_1$ into the original equation if needed.
4. **Write** the tangent equation, then flip the gradient for the normal.

### Key rule

Tangent and normal at the same point are perpendicular: $m_{\text{tangent}} \times m_{\text{normal}} = -1$.

## Worked example — Tangent and normal

Question: Find the equations of the tangent and normal to $y = x^2$ at the point where $x = 2$.

$\dfrac{dy}{dx} = 2x$. At $x = 2$, gradient $= 4$. Point: $y = 4$, so $(2, 4)$.

Tangent: $y - 4 = 4(x - 2)$, giving $y = 4x - 4$.

Normal gradient $= -\dfrac{1}{4}$. Normal: $y - 4 = -\dfrac{1}{4}(x - 2)$.

## Worked example — Horizontal tangent

Question: Find the point on $y = x^2 - 4x + 7$ where the tangent is parallel to the $x$-axis.

Horizontal tangent $\Rightarrow \dfrac{dy}{dx} = 0$.

$2x - 4 = 0$, so $x = 2$. When $x = 2$, $y = 3$. Point: $(2, 3)$.

## Examiner tip

If the tangent is parallel to the $x$-axis, set $\dfrac{dy}{dx} = 0$. If it is parallel to the $y$-axis, the gradient is undefined (vertical tangent).

## Quick check

The tangent and normal at the same point always satisfy $m_{\text{tangent}} \times m_{\text{normal}} = -1$.
