## Core idea

**Stationary points** occur where the gradient is zero. The second derivative test tells you whether each point is a **maximum**, **minimum**, or **point of inflexion**.

## Key formulas

**Stationary condition**

$$
\frac{dy}{dx} = 0
$$

**Second derivative test**

$$
\frac{d^2y}{dx^2} < 0 \Rightarrow \text{maximum}, \quad \frac{d^2y}{dx^2} > 0 \Rightarrow \text{minimum}
$$

## Steps / method

1. **Find** $\dfrac{dy}{dx}$ and set it equal to zero.
2. **Solve** for $x$, then find the corresponding $y$-values.
3. **Find** $\dfrac{d^2y}{dx^2}$ and substitute each $x$-value.
4. **Classify** each point as a maximum or minimum.

### Key rule

If $\dfrac{d^2y}{dx^2} = 0$, the test is inconclusive — check the gradient on either side of the point.

## Worked example — Quadratic

Question: Find and classify the stationary point of $y = x^2 - 6x + 5$.

$\dfrac{dy}{dx} = 2x - 6 = 0$, so $x = 3$. When $x = 3$, $y = -4$. Point: $(3, -4)$.

$\dfrac{d^2y}{dx^2} = 2 > 0$, so $(3, -4)$ is a **minimum**.

## Worked example — Cubic

Question: Find and classify the stationary points of $y = 2x^3 - 6x^2$.

$\dfrac{dy}{dx} = 6x^2 - 12x = 6x(x - 2) = 0$, so $x = 0$ or $x = 2$.

Points: $(0, 0)$ and $(2, -8)$. $\dfrac{d^2y}{dx^2} = 12x - 12$.

At $x = 0$: $\dfrac{d^2y}{dx^2} = -12 < 0$ → maximum. At $x = 2$: $\dfrac{d^2y}{dx^2} = 12 > 0$ → minimum.

## Examiner tip

If $\dfrac{d^2y}{dx^2} = 0$, check the sign of $\dfrac{dy}{dx}$ just before and after the point. Patterns $(+, 0, +)$ or $(-, 0, -)$ indicate a point of inflexion.

## Quick check

A maximum is like the top of a hill; a minimum is like the bottom of a bowl.
