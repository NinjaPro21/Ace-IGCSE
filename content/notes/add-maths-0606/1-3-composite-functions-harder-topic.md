## Core idea

A composite function applies one function to the result of another. In $fg(x)$, you evaluate the **inner** function $g(x)$ first, then substitute that output into the **outer** function $f(x)$.

## Key formulas

**Composite function**

$$
fg(x) = f(g(x))
$$

**Function iterated twice**

$$
f^2(x) = f(f(x))
$$

## Steps / method

1. **Start inside** — evaluate or write down the inner function $g(x)$ first.
2. **Substitute** — replace every $x$ in the outer function $f$ with the entire expression for $g(x)$.
3. **Simplify** — expand brackets and collect like terms.

### Key rule

Order matters: $fg(x) \neq gf(x)$ in general. Always work from the innermost function outward.

## Worked example — Finding the expression

Question: Given $f(x) = 3x - 2$ and $g(x) = x^2 + 1$, find $fg(x)$.

The inner function is $g(x) = x^2 + 1$. Substitute into $f$:

$$
fg(x) = f(x^2 + 1) = 3(x^2 + 1) - 2 = 3x^2 + 1
$$

## Worked example — Solving equations

Question: Given $f(x) = 2^{x+1}$, solve $f^2(x) = 5$.

First find $f^2(x) = f(f(x))$:

$$
f^2(x) = f(2^{x+1}) = 2^{(2^{x+1}) + 1}
$$

For a simpler syllabus-style question, if $f(x) = 2x + 1$ and $f^2(x) = 11$:

$$
f^2(x) = 2(2x + 1) + 1 = 4x + 3
$$

Set $4x + 3 = 11$, so $x = 2$.

## Examiner tip

Order matters! $fg(x)$ is generally not equal to $gf(x)$. Always work from the innermost bracket outwards.

## Quick check

The range of the inner function must lie within the domain of the outer function for $fg(x)$ to exist.
