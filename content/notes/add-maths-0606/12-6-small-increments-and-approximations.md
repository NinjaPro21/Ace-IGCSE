## Core idea

For a small change $\delta x$ in $x$, the corresponding change $\delta y$ in $y$ can be estimated using the gradient. This gives a **linear approximation** to the curve over a tiny interval.

## Key formulas

**Small increment**

$$
\delta y \approx \frac{dy}{dx} \times \delta x
$$

**Approximate value**

$$
y_{\text{new}} \approx y_{\text{old}} + \delta y
$$

## Steps / method

1. **Identify** $x$, $y$, and $\delta x$ from the question.

2. **Differentiate** to find $\frac{dy}{dx}$.

3. **Evaluate** the gradient at the starting value of $x$.

4. **Calculate** $\delta y$, then add to $y_{\text{old}}$ if an approximate value is needed.

### Key rule

This method works best when $\delta x$ is small compared to $x$.

## Worked example — Approximate change

Question: Given $y = x^3$, find the approximate change in $y$ when $xincreases from .  to2.01$.

$\frac{dy}{dx} = 3x^2$. At $x = 2$, gradient $= 12$. $\delta x = 0.01$.

$\delta y \approx 12 \times 0.01 = 0.12$

## Worked example — Approximate value

Question: Use calculus to estimate $\sqrt{4.02}$ using $y = \sqrt{x}$ at $x = 4$.

$\frac{dy}{dx} = \frac{1}{2\sqrt{x}}$. At $x = 4$, gradient $= \frac{1}{4}$. $\delta x = 0.02$.

$\delta y \approx \frac{1}{4} \times 0.02 = 0.005$ when 2.

## Examiner tip

For a percentage change in $x$ of $p\%$, use $\delta x = \frac{p}{100} \times x$. Percentage change in $y$ is $\frac{\delta y}{y} \times 100$.

## Quick check

If $\delta x = 0$, then $\delta y = 0$ — no change means no approximate increment.
