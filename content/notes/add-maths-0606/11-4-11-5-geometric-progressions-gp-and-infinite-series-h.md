## Core idea

A **geometric progression** (GP) multiplies each term by a fixed ratio $r$. When $|r| < 1$, the terms shrink and the **sum to infinity** converges to a finite value.

## Key formulas

**$n$th term**

$$
u_n = ar^{n-1}
$$

**Sum of first $n$ terms** ($r \neq 1$)

$$
S_n = \frac{a(1-r^n)}{1-r}
$$

**Sum to infinity** (when $|r| < 1$)

$$
S_\infty = \frac{a}{1-r}
$$

## Steps / method

1. **Identify** $a$ and $r$ — find $r$ by dividing consecutive terms.
2. **Solve for $n$** — use logarithms when $n$ appears in an exponent.
3. **Check convergence** before using $S_\infty$ — require $|r| < 1$.

### Key rule

The sum-to-infinity formula only applies when $|r| < 1$. When $r = 1$, the $S_n$ formula fails because $1 - r = 0$.

## Worked example — Finding $n$ using logarithms

Question: A GP has $a = 4$ and $r = 1.2$. Find the smallest $n$ such that $u_n > 100$.

$4(1.2)^{n-1} > 100$, so $(1.2)^{n-1} > 25$

Take logs: $(n-1)\lg(1.2) > \lg(25)$, giving $n - 1 > 17.6$, so $n > 18.6$

Smallest integer: $n = 19$

## Worked example — Sum to infinity

Question: A GP has $a = 10$ and $r = 0.6$. Find the sum to infinity.

First check $|r| < 1$ — here $|0.6| < 1$, so the sum exists.

$$
S_\infty = \frac{10}{1 - 0.6} = \frac{10}{0.4} = 25
$$

## Examiner tip

When solving for $n$ in a GP, take logarithms of both sides and round up to the next whole number. For sums to infinity, always verify $|r| < 1$ first — examiners often write $r = \frac{x}{2}$ and ask for the range of $x$.

## Quick check

If $r = 1$, every term equals $a$ and the $S_n$ formula fails because $1 - r = 0$.
