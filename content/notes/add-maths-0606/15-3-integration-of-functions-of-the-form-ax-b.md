## Core idea

This is the reverse of the chain rule for **linear** insides only. You can integrate $(ax+b)^n$ directly when the bracket is linear — if the inside is quadratic or higher, expand first.

## Key formulas

**Linear power rule**

$$
\int (ax+b)^n\,dx = \frac{(ax+b)^{n+1}}{a(n+1)} + C \quad (n \neq -1)
$$

Applies when the bracket is linear: $(ax+b)^n$.

**Constant multiple**

$$
\int k(ax+b)^n\,dx = \frac{k(ax+b)^{n+1}}{a(n+1)} + C \quad (n \neq -1)
$$

**Special case when a equals 1**

$$
\int (x+b)^n\,dx = \frac{(x+b)^{n+1}}{n+1} + C
$$

## Steps / method

1. **Identify** $a$, $b$, and $n$ in $(ax+b)^n$.

2. **Add 1** to the power.

3. **Divide** by the new power **and** by $a$.

4. **Add** $+C$.

### Key rule

The inside must be **linear** ($ax+b$ only). For $(x^2+1)^2$, expand first.

## Worked example — Basic linear power

Question: Find $\int (2x+1)^3\,dx$

Here $a = 2$, $b = 1$, $n = 3$.

$$
\int (2x+1)^3\,dx = \frac{(2x+1)^4}{2 \times 4} + C = \frac{(2x+1)^4}{8} + C
$$

## Worked example — With a fraction power

Question: Find $\int (3x - 2)^{-2}\,dx$

Here $a = 3$, $n = -2$, so $n+1 = -1$.

$$
\int (3x-2)^{-2}\,dx = \frac{(3x-2)^{-1}}{3 \times (-1)} + C = -\frac{1}{3(3x-2)} + C
$$

## Worked example — Constant multiple

Question: Find $\int 5(4x + 1)^2\,dx$.

$$
\int 5(4x+1)^2\,dx = \frac{5(4x+1)^3}{4 \times 3} + C = \frac{5(4x+1)^3}{12} + C
$$

## Examiner tip

Ask whether the inside is of the form $ax+b$ only. If yes, use this formula. If not, expand or use another technique.

## Quick check

$\int (3x - 1)^4\,dx = \frac{(3x-1)^5}{15} + C$
