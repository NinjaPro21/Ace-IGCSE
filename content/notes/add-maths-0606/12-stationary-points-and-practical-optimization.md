## Core idea

Stationary points are locations on a curve where the gradient is flat, meaning the derivative is equal to zero. These points can represent local maximums or minimums, which can be identified using the second derivative and applied to solve practical optimization problems.

## Key formulas

$$\text{Stationary Condition: } \frac{dy}{dx} = 0$$

$$\text{Second Derivative Test: } \frac{d^2y}{dx^2} &gt; 0 \implies \text{Local Minimum Turning Point}$$

$$\text{Second Derivative Test: } \frac{d^2y}{dx^2} &lt; 0 \implies \text{Local Maximum Turning Point}$$

## Steps / method

Differentiate the function equation to find the first derivative expression: $\frac{dy}{dx}$.

Set this derivative equal to zero ($\frac{dy}{dx} = 0$) and solve the equation to find the $x$-coordinates of the stationary points.

Substitute these $x$-values back into the original function equation to calculate their corresponding $y$-coordinates.

Differentiate the first derivative a second time to find the second derivative expression: $\frac{d^2y}{dx^2}$.

Substitute the stationary $x$-coordinates into the second derivative. If the result is positive, classify it as a minimum; if negative, classify it as a maximum.

## Examiner tip

When solving practical word problems (such as finding the maximum volume of a box), always show the second derivative test explicitly to justify why your answer is a maximum or minimum. Simply finding the value of $x$ without testing it will result in a loss of marks.

## Quick check

If the first derivative of a function is zero and its second derivative is negative at a given point, that point is a local maximum.

[Image showing a curve highlighting a maximum point with zero gradient and a minimum point with zero gradient]

## Visual / interactive intent

New explorer: Optimization sandbox. A geometric word problem interface (e.g., cutting corners out of a cardboard sheet to maximize a box's volume). Moving a slider changes the cut size, dynamically tracking the volume curve alongside a marker indicating where the derivative equals zero.
