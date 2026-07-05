## Core idea

The natural logarithm $\ln x$ has derivative $\frac{1}{x}$, linking logarithmic and algebraic calculus. For $\ln[f(x)]$, use the chain rule: $\frac{f'(x)}{f(x)}$.

## Key formulas

**1 — Basic $\ln x$**

$$
\frac{d}{dx}(\ln x) = \frac{1}{x}
$$

<!-- k-variant -->

$$
\frac{d}{dx}[\ln(kx)] = \frac{1}{x}
$$

**2 — Log of linear function $\ln(ax+b)$**

$$
\frac{d}{dx}[\ln(ax+b)] = \frac{a}{ax+b}
$$

<!-- k-variant -->

$$
\frac{d}{dx}[k\ln(ax+b)] = \frac{ka}{ax+b}
$$

**3 — General form $\ln[f(x)]$**

$$
\frac{d}{dx}[\ln(f(x))] = \frac{f'(x)}{f(x)}
$$

## Steps / method

1. **Simplify first** — use log laws (e.g. $\ln x^3 = 3\ln x$) before differentiating.

 2. **Identify the argument** — note $f(x)$ inside the log.

 3. **Apply the rule** — put $f'(x)$ in the numerator and $f(x)$ in the denominator.

## Worked example — Using log laws

Question: Find $\frac{dy}{dx}$ for $y = \ln(x^3)$.

Simplify: $y = 3\ln x$, so $\frac{dy}{dx} = \frac{3}{x}$.

## Worked example — Complex argument

Question: Differentiate $y = \ln(4x^2 + 1)$. $f(x) = 4x^2 + 1$, $f'(x) = 8x$.

$$
\frac{dy}{dx} = \frac{8x}{4x^2 + 1}
$$

## Examiner tip

**Pre-differentiation simplification**: Always look to use log laws first. Expanding $\ln\!\left(\frac{x+1}{x-1}\right)$ to $\ln(x+1) - \ln(x-1)$ before differentiating is far easier than using the quotient rule inside a log.

## Quick check

The derivative of $\ln(kx)$ is $\frac{1}{x}$ for any constant $k > 0$.
