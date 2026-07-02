## Core idea

Exponential functions with base $e$: $e^x$ is its own derivative — essential for modeling natural growth and decay.

## Key formulas

$\frac{d}{dx}(e^x) = e^x$

$\frac{d}{dx}(e^{f(x)}) = f'(x)e^{f(x)}$

## Steps / method

1. **Identify the exponent** — isolate $f(x)$ in the power of $e$.











 2. **Differentiate the exponent** — find $f'(x)$.











 3. **Multiply** — the derivative is $f'(x) \cdot e^{f(x)}$.

## Worked example — Quadratic exponent

Question: Differentiate $y = e^{x^2 + 5x}$. Exponent $f(x) = x^2 + 5x$, so $f'(x) = 2x + 5$.

$$
\frac{dy}{dx} = (2x + 5)e^{x^2 + 5x}
$$

## Worked example — With constant $ k $

Question: Differentiate $y = 4e^{3x - 1}$. Here $k = 4$ and the inner coefficient is $3$.

$$
\frac{dy}{dx} = 4 \times 3e^{3x-1} = 12e^{3x-1}
$$

## Examiner tip

**The power error**: Do not use the power rule on $e^x$ — the base $e$ stays unchanged in the derivative.

## Quick check

If $y = e^{3x}$, then $\frac{dy}{dx} = 3e^{3x}$.
