## Core idea

The quotient rule is used when differentiating a **fraction** where both the numerator and denominator are functions of $x (e.g$. $2y = \frac{3x}{x-2}$).

## Key formulas

$\frac{d}{dx}\left(\frac{u}{v}\right) = \frac{v\frac{du}{dx} - u\frac{dv}{dx}}{v^2}$

## Steps / method

1. **Define $u$ and $v. u$ and $v$ is the denominator. 2. **Differentiate both** — find $u'$ and $v'$.











 3. **Apply the formula** — $(v u' - u v') / v^2$.











 4. **Simplify the numerator** — do not expand $v^2$ unless required.

## Worked example — Simple fraction

Question: Differentiate $y = \frac{3x}{x-2}$. $u = 3x$. So $u' = 3$. $v = x-2$, $v' = 1$.

$$
\frac{dy}{dx} = \frac{(x-2)(3) - 3x(1)}{(x-2)^2} = \frac{-6}{(x-2)^2}
$$

## Worked example — Complex numerator

Question: Find $\frac{dy}{dx}$ for $y = \frac{x^2+4}{x+1}$. $u = x^2+4$, $u' = 2x$. So $v = x+1$, $v' = 1$.

$$
\frac{dy}{dx} = \frac{(x+1)(2x) - (x^2+4)(1)}{(x+1)^2} = \frac{x^2 + 2x - 4}{(x+1)^2}
$$

## Examiner tip

**Order matters**: The numerator must start with $v \cdot u'$. Swapping $u$ and $v$ in the subtraction gives the wrong sign.

## Quick check

The denominator of the derivative is always the original denominator **squared**.
