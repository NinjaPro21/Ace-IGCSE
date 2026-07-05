## Core idea

Polynomial long division is an algorithmic procedure used to divide a polynomial of higher degree (the dividend) by a polynomial of equal or lower degree (the divisor). Use this when you need to express an improper algebraic fraction as a combination of a polynomial quotient and a proper fractional remainder. This process is essential for breaking down cubic and quartic curves to locate their horizontal asymptotes or structural components.

## Key formulas

$$
f(x) = d(x)\,Q(x) + R(x),
$$

$$
\operatorname{deg}(R) < \operatorname{deg}(d)
$$

## Steps / method

Set up the long division grid, writing the dividend inside and the divisor outside in descending order of their algebraic powers.

Insert filler terms with a coefficient of zero ($0x^2$, $0x$, etc.) for any missing consecutive powers in the dividend to keep your column alignment pristine.

Divide the highest-degree term of the dividend by the highest-degree term of the divisor to get the first term of the quotient.

Multiply this new quotient term by the entire divisor expression, write the result below the dividend, subtract it cleanly, and bring down the remaining terms. Repeat this exact cycle until the degree of the subtraction result is strictly less than the divisor's degree.

### Key rule

Continue dividing until the remainder has degree strictly less than the divisor; the result is $f(x) = d(x) \cdot Q(x) + R(x)$.

## Worked example — Long division of a cubic

Divide $f(x) = 2x^3 - 5x^2 + 3x - 1$ by $(x - 2)$.

**Step 1 — Leading term:** $2x^3 \div x = 2x^2$. Write $2x^2$ as the first term of $Q(x)$.

Multiply: $2x^2(x - 2) = 2x^3 - 4x^2$. Subtract to get $-x^2 + 3x - 1$.

**Step 2 — Second term:** $-x^2 \div x = -x$. Multiply: $-x(x - 2) = -x^2 + 2x$. Subtract to get $x - 1$.

**Step 3 — Third term:** $x \div x = 1$. Multiply: $1(x - 2) = x - 2$. Subtract to get remainder $1$.

**Result:** Quotient $Q(x) = 2x^2 - x + 1$, remainder $R(x) = 1$ when 2.

## Worked example — Cubic with a missing term

Divide $x^3 - 7x + 6$ by $(x - 2)$. Insert $0x^2$ in the dividend: $x^3 + 0x^2 - 7x + 6$.

$x^3 \div x = x^2$. Subtract $x^2(x-2) = x^3 - 2x^2$ to get $2x^2 - 7x + 6$.

$2x^2 \div x = 2x$. Subtract $2x(x-2) = 2x^2 - 4x$ to get $-3x + 6$.

$-3x \div x = -3$. Subtract $-3(x-2) = -3x + 6$ to get remainder $0$.

Quotient: $x^2 + 2x - 3$. Since the remainder is zero, $(x - 2)$ is a factor.

## Examiner tip

When executing your subtraction step within the polynomial division column layout, ensure you subtract the entire lower binomial or trinomial row. Always place parentheses around the lower row with a minus sign outside to prevent sign errors on the second or third terms.

## Quick check

If a cubic polynomial is cleanly divided by a linear divisor, then the resulting quotient expression will always be a quadratic polynomial.
