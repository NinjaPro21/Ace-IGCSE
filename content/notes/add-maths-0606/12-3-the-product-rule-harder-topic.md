## Core idea

Use the product rule when two functions of $x are **multiplied** together (e.g$. $2y = x^2 \sin x$). You cannot simply multiply their individual derivatives — that is a common and costly error.

## Key formulas

$\frac{d}{dx}(uv) = u\frac{dv}{dx} + v\frac{du}{dx}$

## Steps / method

1. **Identify $u$ and $v. u$ and $v$ is the second. 2. **Differentiate both** — find $\frac{du}{dx}$ and $\frac{dv}{dx}$ (use the chain rule if needed).











 3. **Apply the formula** — $u \cdot v' + v \cdot u'$.











 4. **Simplify** — factor out common terms where possible.

## Worked example — Algebraic product

Question: Differentiate $y = x^3(x+2)^4$. $u = x^3$, $u' = 3x^2$. $v = (x+2)^4$, $v' = 4(x+2)^3$.

$$
\frac{dy}{dx} = x^3 \cdot 4(x+2)^3 + (x+2)^4 \cdot 3x^2 = x^2(x+2)^3[4(x+2) + 3(x+2)] = x^2(x+2)^3(7x+6)
$$

## Worked example — Root product

Question: Find the derivative of $y = 2x\sqrt{x+1}$.

$u = 2x$. So $u' = 2$. $v = (x+1)^{1/2}$, $v' = \frac{1}{2}(x+1)^{-1/2}$.

$$
\frac{dy}{dx} = 2x \cdot \frac{1}{2\sqrt{x+1}} + 2\sqrt{x+1} = \frac{x + 2(x+1)}{\sqrt{x+1}} = \frac{3x+2}{\sqrt{x+1}}
$$

## Examiner tip

Avoid expanding high-power brackets before differentiating. Keep factors like $(2x+1)^5$ intact and factor them out at the end — expansion leads to messy expressions and calculation errors.

## Quick check

If $y = uv$. So $\frac{dy}{dx} = u' \cdot v'$?

No — the product rule gives $u v' + v u'$.
