## Core idea

These integrals reverse the Chapter 14 derivatives. When the inside is a linear function $ax+b$, integrate first, then divide by $a$. Pull any constant $k$ outside the integral.

## Key formulas

**Exponential**

$$
\int e^{ax+b}\,dx = \frac{1}{a}e^{ax+b} + C
$$

**Sine**

$$
\int \sin(ax+b)\,dx = -\frac{1}{a}\cos(ax+b) + C
$$

**Cosine**

$$
\int \cos(ax+b)\,dx = \frac{1}{a}\sin(ax+b) + C
$$

**Secant squared**

$$
\int \sec^2(ax+b)\,dx = \frac{1}{a}\tan(ax+b) + C
$$

## Steps / method

1. **Identify** the type — exponential, sine, cosine, or sec².
2. **Spot** any constant factor $k$ outside the function.
3. **Integrate** using the reverse-derivative result.
4. **Divide by $a$** when the inside is $ax+b$.
5. **Add** $+C$.

### Key rule

$\int \sin(ax+b)\,dx$ gives a **minus** sign: $-\frac{1}{a}\cos(ax+b) + C$.

## Worked example — Exponential

Question: Find $\int 5e^{3x+1}\,dx$.

Inner part is $3x+1$, so $a = 3$ and $k = 5$.

$$
\int 5e^{3x+1}\,dx = \frac{5}{3}e^{3x+1} + C
$$

## Worked example — Sine

Question: Find $\int \sin(2x + 1)\,dx$.

Here $a = 2$.

$$
\int \sin(2x + 1)\,dx = -\frac{1}{2}\cos(2x + 1) + C
$$

## Worked example — Cosine with constant

Question: Find $\int 6\cos(2x - 1)\,dx$.

$$
\int 6\cos(2x - 1)\,dx = \frac{6}{2}\sin(2x - 1) + C = 3\sin(2x - 1) + C
$$

## Worked example — Mixed exponential and trig

Question: Evaluate $\int \left(e^{x} + 3\sin 2x\right) dx$.

$$
\int e^x\,dx + 3\int \sin(2x)\,dx = e^x - \frac{3}{2}\cos 2x + C
$$

## Examiner tip

Differentiate your answer to check you recover the original integrand. The $\frac{1}{a}$ factor applies only when the inside is linear.

## Quick check

$\int \sin(4x - 2)\,dx = -\frac{1}{4}\cos(4x - 2) + C$
