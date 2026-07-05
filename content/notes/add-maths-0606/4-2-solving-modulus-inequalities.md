## Core idea

Modulus inequalities define a **region** of values. For $|x| < a$ we want values near zero; for $|x| > a$ we want values far from zero. When both sides have a modulus, squaring is the safest method.

## Key formulas

**Less than**

$$
|x| < a \iff -a < x < a
$$

**Greater than**

$$
|x| > a \iff x < -a \quad \text{or} \quad x > a
$$

**Both sides modulus**

$$
|f(x)| \le |g(x)| \iff [f(x)]^2 \le [g(x)]^2
$$

## Steps / method

1. **Method A (squaring)** — if both sides have a modulus, square both sides to get a quadratic inequality.

2. **Method B (boundaries)** — solve $|f(x)| = g(x)$ first to find critical values.

3. **Test regions** — sketch or test a value from each region.

4. **State the interval** — write the final answer in correct inequality notation.

### Key rule

Never combine two separate regions into one statement like $4 \le x \le \frac{2}{3}$. Use **or** between distinct regions.

## Worked example — Simple inequality

Question: Solve $|x - 4| < 2$.

$$
-2 < x - 4 < 2 \Rightarrow 2 < x < 6
$$

The solution is the interval $(2, 6)$.

## Worked example — Both sides modulus

Question: Solve $|2x - 3| \ge |x + 1|$.

Square both sides and expand:

$(2x - 3)^2 \ge (x + 1)^2$

$4x^2 - 12x + 9 \ge x^2 + 2x + 1$

$3x^2 - 14x + 8 \ge 0$

Critical values: $(3x - 2)(x - 4) = 0$, so $x = \frac{2}{3}$ or $x = 4$.

Parabola opens up, so we need the outside regions: $x \le \frac{2}{3}$ or $x \ge 4$.

## Examiner tip

Never write $4 \le x \le \frac{2}{3}$ — that is logically impossible. Use "or" between two separate inequality statements.

## Quick check

The square of a modulus, $(|x|)^2$, is identical to $x^2$.
