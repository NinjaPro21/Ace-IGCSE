## Core idea

A geometric progression (GP) is a sequence of numbers where each term after the first is found by multiplying the previous term by a fixed, non-zero number called the common ratio ($r$). If the magnitude of the common ratio is strictly less than 1, the terms grow smaller and converge, allowing the sum of an infinite number of terms to be calculated.

## Key formulas

$$
\text{nth Term: } u_n = ar^{n-1}

\text{Sum of first n terms: } S_n = \frac{a(1 - r^n)}{1 - r} \,\, (r < 1) \quad \text{or} \quad S_n = \frac{a(r^n - 1)}{r - 1} \,\, (r > 1)

\text{Sum to Infinity: } S_\infty = \frac{a}{1 - r} \quad \text{valid if and only if } |r| < 1 \implies -1 < r < 1
$$


## Steps / method

Find the first term ($a$) and calculate the common ratio ($r$) by dividing the second term by the first ($u_2 \div u_1$).

To find a specific term position, substitute these values into the index formula: $u_n = ar^{n-1}$.

To sum a finite number of terms, select the appropriate version of the $S_n$ formula to keep the denominator positive.

Check the convergence condition: if the question asks for a sum to infinity, verify that the common ratio satisfies $-1 < r < 1$.

Substitute $a$ and $r$ into the simplified formula $S_\infty = \frac{a}{1-r}$ to calculate the limiting value.

### Key rule

A sum to infinity exists only when $|r| < 1$. Always check convergence before using $S_\infty = \frac{a}{1-r}$.

## Worked example — nth term

The GP $3, 6, 12, 24, \ldots$ has $a = 3$ and $r = 2$. Find the 8th term.

$$
u_8 = 3 \times 2^{7} = 3 \times 128 = 384
$$
The 8th term is **384**.



## Worked example — Sum to infinity

Find $S_\infty$ for the GP with $a = 12$ and $r = \frac{1}{3}$.

Since $|r| = \frac{1}{3} < 1$, the series converges.

$$
S_\infty = \frac{12}{1 - \frac{1}{3}} = \frac{12}{\frac{2}{3}} = 18
$$

The sum to infinity is **18**.

## Examiner tip

A common trap is assuming a sum to infinity exists for all geometric sequences. If a sequence has a common ratio of $r = 1.5$, attempting to calculate $S_\infty$ is mathematically invalid and will receive zero marks unless you state that the series diverges.

## Quick check

If a geometric sequence has a common ratio of $r = -\frac{1}{2}$, the terms will alternate between positive and negative values while shrinking toward zero.
