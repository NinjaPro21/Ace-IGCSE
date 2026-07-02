## Core idea

Pascal's triangle is a triangular array where each entry is the sum of the two above it. Row $n$ gives the coefficients for expanding $(a+b)^n$ without long multiplication.

## Key formulas

**Binomial coefficient** (entry in row $n$, position $r$)

$$
\binom{n}{r} = \frac{n!}{r!\,(n-r)!}
$$

**Row sum**

The numbers in row $n$ add to $2^n$.

## Steps / method

1. **Start** with 1 at the top; each row begins and ends with 1.
2. **Fill** internal entries by adding the two numbers directly above.
3. **Expand** $(a+b)^n$ using row $n$ coefficients, from $a^n$ down to $b^n$.

### Key rule

Match coefficient $r$ to the term $a^{n-r}b^r$ — powers of $a$ decrease as powers of $b$ increase.

## Worked example — Expanding with Pascal's triangle

Question: Use Pascal's triangle to expand $(2+x)^4$.

Row 4 coefficients: $1,\,4,\,6,\,4,\,1$.

$(2+x)^4 = 1(2)^4 + 4(2)^3(x) + 6(2)^2(x^2) + 4(2)(x^3) + 1(x^4) = 16 + 32x + 24x^2 + 8x^3 + x^4$

## Examiner tip

Pascal's triangle works well for small powers ($n \le 5$). For larger $n$ or a single middle term, use the binomial theorem formula instead.

## Quick check

The sum of the entries in row $n$ is always $2^n$.
