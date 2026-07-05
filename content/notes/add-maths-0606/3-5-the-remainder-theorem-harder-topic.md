## Core idea

The Remainder Theorem finds the remainder of a polynomial division without doing long division. When $f(x)$ is divided by $(x - a)$, the remainder is $f(a)$.

## Key formulas

**Remainder Theorem**

$$
\text{Remainder when } f(x) \div (x - a) = f(a)
$$

**For divisor $(ax - b)$**

$$
\text{Remainder} = f\!\left(\frac{b}{a}\right)
$$

## Steps / method

1. **Identify the test value** — set the divisor equal to zero to find $x$.

2. **Substitute** — plug that value into $f(x)$.

3. **Calculate** — the result is the remainder.

### Key rule

If the remainder is $0$, the divisor is a factor (Factor Theorem).

## Worked example — Finding remainder

Question: Find the remainder when $2x^3 - x^2 + 5x - 7$ is divided by $x - 3$.

Test value is $x = 3$:

$$
f(3) = 2(27) - 9 + 15 - 7 = 54 - 9 + 15 - 7 = 53
$$

The remainder is **53**.

## Worked example — Simultaneous equations

Question: $f(x) = x^3 + ax^2 + b$. Divided by $(x - 1)$, remainder is 4. Divided by $(x + 2)$, remainder is 10. Find $a$ and $b$.

$$
f(1) = 4 \Rightarrow 1 + a + b = 4 \Rightarrow a + b = 3
$$

$$
f(-2) = 10 \Rightarrow -8 + 4a + b = 10 \Rightarrow 4a + b = 18
$$

Subtract: $3a = 15 \Rightarrow a = 5$, then $b = -2$.

## Examiner tip

If a question says "leaves the same remainder" when divided by two different linear expressions, set $f(\text{value}_1) = f(\text{value}_2)$ and solve for the unknown constant.

## Quick check

If the Remainder Theorem gives a result of $0$, the divisor is actually a factor.
