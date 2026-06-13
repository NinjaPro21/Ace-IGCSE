## Core idea

Equations of the form ∣f(x)∣=g(x) involve a modulus expression equated to a linear or non-linear algebraic function, representing the geometric intersection points between a reflected curve and another graph. Use this mathematical setup when analyzing absolute thresholds or variance boundaries where boundaries vary relative to an external function. Solving these equations requires splitting the modulus operator into its positive and negative components, followed by verifying all answers to filter out invalid, extraneous solutions.

## Key formulas

$|f(x)| = g(x) \implies f(x) = g(x) \text{ or } -f(x) = g(x)$

Valid only where $g(x) \ge 0$.

## Steps / method

Split the modulus expression cleanly into two distinct algebraic cases: Case 1 assumes the expression inside the modulus is non-negative (f(x)=g(x)), and Case 2 applies a negative sign to the expression (−f(x)=g(x)).

Solve both individual algebraic equations independently to determine all potential boundary values for x.

Substitute every calculated potential answer back into the original unmodified equation ∣f(x)∣=g(x) to check its validity.

Discard any solution that causes the non-modulus side g(x) to output a negative number, classifying it as an invalid extraneous solution.

### Key rule

Split $|f(x)| = g(x)$ into $f(x) = g(x)$ and $-f(x) = g(x)$, then reject any solution where $g(x) < 0$.

## Worked example — Two valid solutions

Solve $|2x - 3| = x + 1$.

Case 1: $2x - 3 = x + 1 \implies x = 4$.

Case 2: $-(2x - 3) = x + 1 \implies x = \frac{2}{3}$.

Check $x = 4$: $|5| = 5$ and $4 + 1 = 5$ ✓. Check $x = \frac{2}{3}$: both sides equal $\frac{5}{3}$ ✓.

Solutions: $x = 4$ or $x = \frac{2}{3}$.

## Worked example — Rejecting extraneous roots

Solve $|x - 1| = 2x$.

Case 1: $x - 1 = 2x \implies x = -1$. Check: $|{-1} - 1| = 2$ but $2(-1) = -2$ — **reject**.

Case 2: $-(x - 1) = 2x \implies x = \frac{1}{3}$. Check: $|{-\frac{2}{3}}| = \frac{2}{3}$ and $2(\frac{1}{3}) = \frac{2}{3}$ ✓.

Only solution: $x = \frac{1}{3}$.

## Examiner tip

Many students lose half the marks on modulus questions because they forget to test for extraneous roots. If one of your calculated values makes g(x) negative, it cannot be a solution because a modulus output can never be negative.

## Quick check

If a calculated solution yields an value where g(x)&lt;0, then that solution must be crossed out as extraneous.

## Visual / interactive intent

Reuse explorer — Discriminant/modulus slider. Displays a split screen with a live line graph interacting with a modulus V-shape graph. Sliders change the slope of g(x), showing how intersections vanish or appear, while flashing warnings when intersection math drops below the horizontal axis.
