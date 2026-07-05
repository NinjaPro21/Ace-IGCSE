## Core idea

Definite integrals can find the area under a curve, or the area **between two curves**. First find where the curves intersect, then integrate (top curve minus bottom curve) between those limits.

## Key formulas

**Area under a curve**

$$
A = \int_a^b y\,dx
$$

**Area between two curves**

$$
A = \int_a^b (y_{\text{top}} - y_{\text{bottom}})\,dx
$$

**Shaded region method**

$A_{\text{shaded}} = A_{\text{big}} - A_{\text{small}}$ when one region sits inside another.

## Steps / method

1. **Sketch** both curves and identify the shaded region.

2. **Find intersection points** by solving the curves simultaneously.

3. **Decide** which curve is on top between the intersection points.

4. **Integrate** (top minus bottom) between the $x$-values of intersection.

5. **Split** the integral if a curve crosses the $x$-axis within the interval.

### Key rule

Always find intersection points first — the limits of integration come from where the curves meet, not from the axes alone.

## Worked example — Area under a curve

Question: Find the area bounded by $y = x^2$, the x-axis, and the lines x = 1 and x = 3

$$
A = \int_1^3 x^2\,dx = \left[\frac{x^3}{3}\right]_1^3 = 9 - \frac{1}{3} = \frac{26}{3}
$$

## Worked example — Area between two curves

Question: Find the area enclosed between y = x + 2 and y = x²

The curves meet at x = -1 and x = 2. The line is above the parabola on this interval.

$$
A = \int_{-1}^{2} [(x+2) - x^2]\,dx = \left[\frac{x^2}{2} + 2x - \frac{x^3}{3}\right]_{-1}^{2} = \frac{9}{2}
$$

## Worked example — Shaded region (big area minus small area)

Question: Find the shaded area between y = 4 - x² and y = x²

The curves intersect when x² = 2, so x = ±√2. The upper curve is y = 4 - x²

$A = \int_{-\sqrt{2}}^{\sqrt{2}} (4 - 2x^2)\,dx = \frac{16\sqrt{2}}{3}$

This equals the area under $y = 4 - x^2$ minus the area under $y = x^2$ over the same interval.

## Examiner tip

Sketch the region first. Label which curve is on top, and show intersection working before setting up the integral — method marks are awarded for these steps.

## Quick check

A negative definite integral over an interval means the net signed area lies below the $x$-axis.
