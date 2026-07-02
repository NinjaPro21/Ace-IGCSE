## Core idea

Polynomial long division splits a high-degree polynomial into a **quotient** and **remainder**. This is the main tool for breaking a cubic into a linear factor times a quadratic.

## Key formulas

**Division algorithm**

$$
f(x) = D(x)Q(x) + R(x)
$$

The divisor is $D(x)$, the quotient is $Q(x)$, and the remainder $R(x)$ has lower degree than $D(x)$.

## Steps / method

1. **Divide** the leading term of the dividend by the leading term of the divisor.
2. **Multiply** the whole divisor by that result and write it under the dividend.
3. **Subtract** to get a new remainder and bring down the next term.
4. **Repeat** until the remainder has lower degree than the divisor.

### Key rule

If a power of $x$ is missing, use a placeholder (e.g. write $x^3 + 0x^2 + 0x - 8$).

## Worked example — Long division

Question: Divide $x^3 + 2x^2 - 5x - 6$ by $x - 2$.

$$
\frac{x^3 + 2x^2 - 5x - 6}{x - 2} = x^2 + 4x + 3 \quad \text{remainder } 0
$$

Check: $(x - 2)(x^2 + 4x + 3) = x^3 + 2x^2 - 5x - 6$ ✓

## Worked example — Missing terms

Question: Divide $x^3 - 8$ by $x - 2$.

Write placeholders: $x^3 + 0x^2 + 0x - 8$.

Quotient: $x^2 + 2x + 4$, remainder $0$.

## Examiner tip

If your polynomial is missing a power of $x$ (e.g. $x^3 + 5$), write it as $x^3 + 0x^2 + 0x + 5$ in the long division grid to keep columns aligned.

## Quick check

If $(x - a)$ is a factor, the remainder at the end of long division must be zero.
