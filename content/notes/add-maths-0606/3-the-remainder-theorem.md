## Core idea

The Remainder Theorem provides a rapid way to calculate the numerical remainder left behind when a polynomial f(x) is divided by a non-factor linear expression (ax−b), without actually performing long division. Use this when exam questions ask you to solve for unknown coefficients embedded within a polynomial by providing you with a known fractional remainder.

## Key formulas

$$
\text{Remainder when } f(x) \text{ is divided by } (x - c)\text{: } R = f(c)
$$

$$
\text{Remainder when } f(x) \text{ is divided by } (ax - b)\text{: } R = f\left(\frac{b}{a}\right)
$$

$$
f(x) = (x - c)\,Q(x) + R
$$

## Steps / method

Isolate the divisor binomial, formatted as $(ax - b)$, and find its root value by setting it to zero ($x = \frac{b}{a}$).

Substitute that value directly into the polynomial function expression, giving you $f\left(\frac{b}{a}\right)$.

Simplify the expression arithmetically to calculate a final numerical integer or fraction.

Set this numerical result equal to the stated remainder value given in the prompt to create an equation to solve for any unknown polynomial coefficients.

### Key rule

When $f(x)$ is divided by $(ax - b)$, the remainder is $f\left(\frac{b}{a}\right)$; set this equal to the given remainder to find unknown coefficients.

## Worked example — Finding an unknown coefficient

The polynomial $f(x) = 2x^3 - x^2 + kx - 5$ leaves a remainder of $7$ when divided by $(x - 2)$. Find $k$. Set the divisor to zero: $x - 2 = 0 \implies x = 2$.

Apply the Remainder Theorem: $f(2) = 7$.

Substitute:

$$
2(2)^3 - (2)^2 + 2k - 5 = 7 \implies 16 - 4 + 2k - 5 = 7 \implies 2k = 0 \implies k = 0.
$$

## Worked example — Exact divisibility

Find the remainder when $f(x) = x^3 - 5x + 6$ is divided by $(x + 1)$.

The root of the divisor is $x = -1$.

$$
f(-1) = (-1)^3 - 5(-1) + 6 = -1 + 5 + 6 = 10
$$
The remainder is $10$. (If the question asked for exact divisibility, we would require $f(-1) = 0$.)

## Examiner tip

Be careful when a problem states that a polynomial is "exactly divisible" by an expression. "Exactly divisible" means that the linear expression is a perfect factor, so you must automatically set your remainder evaluation to equal 0.

## Quick check

If a polynomial f(x) evaluated at f(4) yields a value of −3, then dividing f(x) by (x−4) leaves an exact remainder of −3.
