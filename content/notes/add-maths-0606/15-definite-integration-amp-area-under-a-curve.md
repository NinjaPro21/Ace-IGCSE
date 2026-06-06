## Core idea

Definite integration evaluates an integral between two specified numerical boundaries, removing the constant of integration ($C$) to find a single numerical value. Geometrically, this value represents the net area enclosed between the curve, the horizontal horizontal axis, and the two vertical boundary lines.

## Key formulas

$$\text{Definite Integral: } \int_{a}^{b} f(x) \, dx = [F(x)]_{a}^{b} = F(b) - F(a)$$

$$\text{Area Enclosed by Curve and x-axis: } A = \int_{a}^{b} y \, dx$$

$$\text{Area Between Curve and Line: } A = \int_{a}^{b} (y_{\text{top}} - y_{\text{bottom}}) \, dx$$

## Steps / method

Integrate the given function expression normally, omitting the constant of integration $+C$, and enclose the result in square brackets with the boundary limits written outside.

Substitute the upper boundary limit value ($b$) into this integrated expression to calculate a numerical result.

Substitute the lower boundary limit value ($a$) into the same expression to calculate a second numerical result.

Subtract the lower boundary result from the upper boundary result ($F(b) - F(a)$) to find the final value.

If calculating a physical area, check if any part of the curve sinks below the x-axis, as these sections yield negative values that must be evaluated using absolute values.

## Examiner tip

When calculating the area under a curve that crosses below the horizontal x-axis within the integration interval, you must split the integral into separate sections at the root crossing point. Integrating across both sections at once causes the positive and negative areas to cancel out, leading to an incorrect total area.

## Quick check

If a definite integral calculation yields a negative value, it indicates that the enclosed area lies entirely beneath the horizontal x-axis line.

[Image showing a curve shaded between vertical boundaries a and b to represent the area under the curve]

## Visual / interactive intent

New explorer: Area integration sandbox. A curve graph with two draggable vertical lines representing the integration boundaries $a$ and $b$. As the lines move, the region below the curve is shaded, and a readout displays the changing definite integral value.
