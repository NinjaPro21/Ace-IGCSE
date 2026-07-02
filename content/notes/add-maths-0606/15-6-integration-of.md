## Core idea

The power rule fails when $n = -1$ because division by zero is impossible. Integrals of the form $\frac{1}{x}$ and $\frac{1}{ax+b}$ give natural logarithms.

## Key formulas

**Reciprocal of x**

$$
\int \frac{1}{x}\,dx = \ln|x| + C
$$

**Reciprocal of linear bracket**

$$
\int \frac{1}{ax+b}\,dx = \frac{1}{a}\ln|ax+b| + C
$$

**Recognising f-prime over f**

$$
\int \frac{f'(x)}{f(x)}\,dx = \ln|f(x)| + C
$$

When the numerator is the derivative of the denominator.

## Steps / method

1. **Rewrite** the integrand in the form $\frac{k}{ax+b}$ or $\frac{f'(x)}{f(x)}$.
2. **Integrate** to $\ln|\text{argument}|$.
3. **Divide by $a$** if the denominator is $ax+b$.
4. **Add** $+C$.

### Key rule

Write the argument of $\ln$ in modulus signs: $\ln|ax+b|$, because the log is only defined for positive arguments in its basic form.

## Worked example — Basic reciprocal

Question: Find $\int \frac{5}{x}\,dx$.

$$
\int \frac{5}{x}\,dx = 5\ln|x| + C
$$

## Worked example — Linear denominator

Question: Find $\int \frac{3}{2x - 1}\,dx$

Here $a = 2$.

$$
\int \frac{3}{2x-1}\,dx = \frac{3}{2}\ln|2x-1| + C
$$

## Worked example — Numerator is the derivative

Question: The numerator is the derivative of the denominator.

Answer: $\int \frac{4x+2}{2x^2+2x+1}\,dx = \ln|2x^2+2x+1| + C$

## Examiner tip

Always use modulus signs inside the logarithm. If the numerator is exactly the derivative of the denominator, the answer is $\ln|\text{denominator}| + C$ with no extra fraction.

## Quick check

$\int \frac{1}{3x+5}\,dx = \frac{1}{3}\ln|3x+5| + C$
