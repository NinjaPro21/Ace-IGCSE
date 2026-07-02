## Core idea

Modulus equations require accounting for both positive and negative cases inside the absolute value. When $x$ appears on both sides, check for **extraneous solutions** that satisfy the algebra but not the original modulus constraint.

## Key formulas

**Modulus equation**

$$
|f(x)| = g(x) \Rightarrow f(x) = g(x) \quad \text{or} \quad f(x) = -g(x)
$$

**Both sides modulus (squaring)**

$$
|f(x)| = |g(x)| \Rightarrow [f(x)]^2 = [g(x)]^2
$$

## Steps / method

1. **Isolate** the modulus expression on one side (if needed).
2. **Split into cases** — write $f(x) = g(x)$ and $f(x) = -g(x)$.
3. **Solve** each equation for $x$.
4. **Verify** — substitute each answer back; reject any that give $|{\ldots}| = \text{negative}$.

### Key rule

A modulus result is always $\ge 0$. If the non-modulus side is negative, reject that solution.

## Worked example — Both sides modulus

Question: Solve $|3x - 2| = |x + 1|$.

Square both sides:

$$
(3x - 2)^2 = (x + 1)^2
$$

$$
9x^2 - 12x + 4 = x^2 + 2x + 1 \Rightarrow 8x^2 - 14x + 3 = 0
$$

Factor: $(4x - 1)(2x - 3) = 0$, so $x = \frac{1}{4}$ or $x = \frac{3}{2}$. Both are valid.

## Worked example — Variable on both sides

Question: Solve $|2x + 5| = 3 - x$.

**Case 1:** $2x + 5 = 3 - x \Rightarrow 3x = -2 \Rightarrow x = -\frac{2}{3}$. Check: RHS $= 3 - (-\frac{2}{3}) = \frac{11}{3} > 0$ ✓

**Case 2:** $2x + 5 = -(3 - x) \Rightarrow x = -8$. Check: RHS $= 3 - (-8) = 11 > 0$ ✓

Both solutions are valid.

## Examiner tip

If your algebraic steps give a solution where the non-modulus side is negative, reject it. Examiners often award zero marks if an extraneous solution is not explicitly rejected.

## Quick check

If $|x| = -5$, there are no solutions.
