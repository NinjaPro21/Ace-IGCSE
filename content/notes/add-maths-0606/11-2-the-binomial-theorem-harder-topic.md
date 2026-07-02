## Core idea

The Binomial Theorem provides a general formula for expanding $(a+b)^n$ without multiplying out every bracket. Each term uses a binomial coefficient and powers of $a$ and $b$ that always add up to $n$.

## Key formulas

**Binomial expansion**

$$
(a+b)^n = \binom{n}{0}a^n + \binom{n}{1}a^{n-1}b + \cdots + \binom{n}{n}b^n
$$

**General term** ($(r+1)$-th term)

$$
T_{r+1} = \binom{n}{r}a^{n-r}b^r
$$

## Steps / method

Identify $n$, $a$ and $b$. Treat any negative sign as part of $b$ (e.g. for $(3-2x)^6$, $a=3$ and $b=-2x$).

If you need the coefficient of $x^k$, choose $r$ so that the power of $x$ in $b^r$ equals $k$.

Calculate the coefficient using $\binom{n}{r}$ and simplify.

## Worked example — Finding a coefficient

Find the coefficient of $x^3$ in $(3 - 2x)^6$.

Here $n = 6$, $a = 3$, $b = -2x$. For $x^3$, we need $r = 3$.

$$
T_4 = \binom{6}{3}(3)^{3}(-2x)^3 = 20 \times 27 \times (-8x^3)
$$

The coefficient is $-4320$.



## Worked example — Unknown $ n $

The coefficient of $x^2$ in $(1 + kx)^n$ is 60. Given $n = 5$, find $k$.

$$
T_3 = \binom{5}{2}(1)^3(kx)^2 = 10k^2 x^2
$$

So $10k^2 = 60$, hence $k^2 = 6$ and $k = \pm\sqrt{6}$.



## Examiner tip

The power of $a$ decreases from $n$ to $0$ while the power of $b$ increases from $0$ to $n$. The expansion of $(a+b)^n$ has exactly $n+1$ terms.

## Quick check

The expansion of $(a+b)^n$ has $n+1$ terms.
