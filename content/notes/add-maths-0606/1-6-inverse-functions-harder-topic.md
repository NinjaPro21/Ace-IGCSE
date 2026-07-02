## Core idea

An inverse function $f^{-1}(x)$ undoes the operation of $f(x)$: if $f(a) = b$, then $f^{-1}(b) = a$. It only exists when $f$ is **one-to-one** — each output comes from exactly one input. The domain of $f^{-1}$ equals the range of $f$, and the range of $f^{-1}$ equals the domain of $f$.

## Key formulas

**1 — Definition**

$$
f(x) = y \iff f^{-1}(y) = x
$$

**2 — Composition check**

$$
f(f^{-1}(x)) = x \quad \text{and} \quad f^{-1}(f(x)) = x
$$

**3 — Domain and range swap**

$$
\text{Domain of } f^{-1} = \text{Range of } f, \qquad \text{Range of } f^{-1} = \text{Domain of } f
$$

## Steps / method

1. **Check one-to-one** — if $f is many-to-one (e.g$. $2x^2$ over all reals), restrict the domain before finding $f^{-1}$.






2. **Write** $y = f(x)$.






3. **Rearrange** to make $x$ the subject in terms of $y$.






4. **Swap** $x$ and $y$ so the answer is written as $f^{-1}(x) = \ldots$






5. **State the domain** of $f^{-1}$ using the range of $f$.

### Key rule

The final answer must use $x$ as the independent variable — never leave it in terms of $y$. Do not confuse $f^{-1}(x)$ (the inverse function) with $[f(x)]^{-1}$ (the reciprocal).

## Worked example — Linear inverse

Question: Find $f^{-1}(x)$ for $f(x) = 5x + 2$.

Let $y = 5x + 2$. Rearrange:

$$
x = \frac{y - 2}{5}
$$

Swap variables:

$$
f^{-1}(x) = \frac{x - 2}{5}
$$

Domain of $f^{-1}$ = range of $f$ = $\mathbb{R}$.

## Worked example — Rational inverse

Question: Find $f^{-1}(x)$ for $f(x) = \frac{x - 3}{2x}$, where $x \neq 0$.

Let $y = \frac{x - 3}{2x}$. Swap $x$ and $y$:

$$
x = \frac{y - 3}{2y}
$$

Multiply both sides by $2y$:

$$
2xy = y - 3 \Rightarrow 2xy - y = -3 \Rightarrow y(2x - 1) = -3
$$

So:

$$
f^{-1}(x) = \frac{-3}{2x - 1}, \quad x \neq \frac{1}{2}
$$

Domain of $f^{-1}$ = range of $f$. Since $f(x) = \frac{1}{2} - \frac{3}{2x}$, the range is $y \neq \frac{1}{2}$.

## Worked example — Using $ f(a) = b $

Question: If $f(x) = 2x + 1$ and $f(3) = 7$, find $f^{-1}(7)$ without finding the full formula.

By definition, $f^{-1}(7) = 3$.

Check: $f^{-1}(x) = \frac{x - 1}{2}$, so $f^{-1}(7) = \frac{6}{2} = 3$ ✓

## Worked example — Domain restriction

Question: $f(x) = x^2 - 4x + 7$ for $x \ge k$. Find the least value of $k$ so that $f^{-1}$ exists.

Complete the square: $f(x) = (x - 2)^2 + 3$. The parabola has axis of symmetry $x = 2$.

For $f$ to be one-to-one, restrict to one side of the vertex. The least value is:

$$
k = 2
$$

## Worked example — Domain and range of the inverse

Question: $f(x) = 3x - 5$ for $2 \le x \le 8$. Find the range of $f^{-1}$.

The range of $f^{-1}$ equals the domain of $f$:

$$
2 \le f^{-1}(x) \le 8
$$

## Common mistakes

**Confusing inverse and reciprocal**: $f^{-1}(x) \neq \frac{1}{f(x)}$. These are completely different operations.

**Leaving the answer in terms of $y$**: Always swap and write $f^{-1}(x) = \ldots$

**Wrong domain**: The domain of $f^{-1}$ is the **range** of $f$, not its domain.

**Forgetting restrictions**: When $f$ involves a fraction, state values that make the denominator zero in $f^{-1}$.

## Examiner tip

If a function is many-to-one over its full domain (like $x^2$ for all real $x$), the inverse does not exist unless the domain is restricted to make it one-to-one.

Use $f(f^{-1}(x)) = x$ to verify your algebra quickly.

For rational functions, rearrange carefully — multiply through by the denominator and collect terms before isolating $y$.

## Quick check

Find $f^{-1}(x)$ for $f(x) = \frac{2x + 3}{x - 1}$, where $x \neq 1$.

If $f(4) = 9$, what is $f^{-1}(9)$?

Why does $f(x) = x^2$ (for all real $x$) not have an inverse?
