## Core idea

Many physical relationships are not straight lines (e.g. $y = ax^n$ or $y = Ab^x$). By applying logarithms or algebraic manipulation, we transform them into linear form $Y = mX + c$, letting us find unknown constants from a straight-line graph.

## Key formulas

**Power law** ($y = ax^n$)

$$
\lg y = n \lg x + \lg a \quad (Y = \lg y,\; X = \lg x,\; m = n,\; c = \lg a)
$$

**Exponential law** ($y = Ab^x$)

$$
\lg y = (\lg b)\, x + \lg A \quad (Y = \lg y,\; X = x,\; m = \lg b,\; c = \lg A)
$$

## Steps / method

1. **Apply logarithms** (or divide by $x$) to both sides of the non-linear equation.

2. **Use log laws** — product and power rules — to isolate variables.

3. **Map to** $Y = mX + c$ — identify $Y$, $X$, gradient $m$, and intercept $c$.

### Key rule

State clearly what $Y$ and $X$ represent. If $Y = \lg y$, the intercept is $\lg a$, not $a$ directly.

## Worked example — Logarithmic transformation

Question: Transform $y = 3x^n$ into linear form.

$$
\lg y = \lg 3 + n \lg x
$$

So $Y = \lg y$, $X = \lg x$, $m = n$, $c = \lg 3$.

## Worked example — Algebraic transformation

Question: Transform $y = ax^2 + bx$ into linear form.

Divide by $x$ (for $x \neq 0$):

$\displaystyle\frac{y}{x} = ax + b$

So $Y = \frac{y}{x}$, $X = x$, $m = a$, $c = b$.

## Examiner tip

When mapping variables, state what $Y$ and $X$ represent. If the intercept is $\lg a$, then $a = 10^c$ (when using $\lg$).

## Quick check

If the graph is $\lg y$ against $x$, the original relationship was exponential ($y = Ab^x$).
