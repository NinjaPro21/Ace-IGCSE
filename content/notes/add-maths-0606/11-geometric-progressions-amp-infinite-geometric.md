## Core idea

A geometric progression (GP) is a sequence of numbers where each term after the first is found by multiplying the previous term by a fixed, non-zero number called the common ratio ($r$). If the magnitude of the common ratio is strictly less than 1, the terms grow smaller and converge, allowing the sum of an infinite number of terms to be calculated.

## Key formulas

$$\text{nth Term: } u_n = ar^{n-1}$$

$$\text{Sum of first n terms: } S_n = \frac{a(1 - r^n)}{1 - r} \,\, (r &lt; 1) \quad \text{or} \quad S_n = \frac{a(r^n - 1)}{r - 1} \,\, (r &gt; 1)$$

$$\text{Sum to Infinity: } S_\infty = \frac{a}{1 - r} \quad \text{valid if and only if } |r| &lt; 1 \implies -1 &lt; r &lt; 1$$

## Steps / method

Find the first term ($a$) and calculate the common ratio ($r$) by dividing the second term by the first ($u_2 \div u_1$).

To find a specific term position, substitute these values into the index formula: $u_n = ar^{n-1}$.

To sum a finite number of terms, select the appropriate version of the $S_n$ formula to keep the denominator positive.

Check the convergence condition: if the question asks for a sum to infinity, verify that the common ratio satisfies $-1 &lt; r &lt; 1$.

Substitute $a$ and $r$ into the simplified formula $S_\infty = \frac{a}{1-r}$ to calculate the limiting value.

## Examiner tip

A common trap is assuming a sum to infinity exists for all geometric sequences. If a sequence has a common ratio of $r = 1.5$, attempting to calculate $S_\infty$ is mathematically invalid and will receive zero marks unless you state that the series diverges.

## Quick check

If a geometric sequence has a common ratio of $r = -\frac{1}{2}$, the terms will alternate between positive and negative values while shrinking toward zero.

## Visual / interactive intent

New explorer: GP convergence animator. A bar graph where each bar's height represents the value of a term in a geometric sequence. Users adjust a slider for $r$; when $|r| &lt; 1$, an overlay line shows the cumulative sum leveling off horizontally at the $S_\infty$ limit line.
