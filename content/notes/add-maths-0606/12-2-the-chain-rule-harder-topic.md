## Core idea

The chain rule differentiates composite functions — a function inside another function. It is essential for powers like $(2x+1)^5$, square roots, and any expression where you must differentiate the **outer** and **inner** parts separately, then multiply.

## Key formulas

$\frac{dy}{dx} = \frac{dy}{du} \times \frac{du}{dx}$

## Steps / method

1. **Define $u$ and $u$ be the expression inside the brackets. 2. **Differentiate the outer** — treat $u$. $\frac{dy}{du}$).











 3. **Differentiate the inner** — find $\frac{du}{dx}$.











 4. **Multiply** — $\frac{dy}{dx} = \frac{dy}{du} \times \frac{du}{dx}$.

## Worked example — Standard power

Question: Differentiate $y = (4x^2 + 1)^3$. Let $u = 4x^2 + 1$, so $\frac{du}{dx} = 8x$.

$$
\frac{dy}{dx} = 3(4x^2 + 1)^2 \times 8x = 24x(4x^2 + 1)^2
$$

## Worked example — Square root

Question: Find $\frac{dy}{dx}$ for $y = \sqrt{2x - 5}$.

Rewrite: $y = (2x - 5)^{1/2}$. Inner $\frac{du}{dx} = 2$, outer $\frac{dy}{du} = \frac{1}{2}(2x-5)^{-1/2}$.

$$
\frac{dy}{dx} = \frac{1}{2}(2x-5)^{-1/2} \times 2 = \frac{1}{\sqrt{2x-5}}
$$

## Examiner tip

**The forgotten derivative**: The most frequent error is differentiating the power but forgetting to multiply by $\frac{du}{dx}$. Always ask: "Did I multiply by the derivative of the inside?"

## Quick check

Find $\frac{d}{dx}[(x+1)^2]$.

Answer: $2(x+1) \times 1 = 2x + 2$.
