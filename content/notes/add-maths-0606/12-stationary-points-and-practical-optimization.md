## Core idea

Stationary points are locations on a curve where the gradient is flat, meaning the derivative is equal to zero. These points can represent local maximums or minimums, which can be identified using the second derivative and applied to solve practical optimization problems.

## Key formulas

$$
\text{Stationary Condition: } \frac{dy}{dx} = 0
$$
$$
\text{Second Derivative Test: } \frac{d^2y}{dx^2} > 0 \implies \text{Local Minimum Turning Point}
$$
$$
\text{Second Derivative Test: } \frac{d^2y}{dx^2} < 0 \implies \text{Local Maximum Turning Point}
$$

## Steps / method

Differentiate the function equation to find the first derivative expression: $\frac{dy}{dx}$.

Set this derivative equal to zero ($\frac{dy}{dx} = 0$) and solve the equation to find the $x$-coordinates of the stationary points.

Substitute these $x$-values back into the original function equation to calculate their corresponding $y$-coordinates.

Differentiate the first derivative a second time to find the second derivative expression: $\frac{d^2y}{dx^2}$.

Substitute the stationary $x$-coordinates into the second derivative. If the result is positive, classify it as a minimum; if negative, classify it as a maximum.

### Key rule

Set $\frac{dy}{dx} = 0$ to find stationary points, then use $\frac{d^2y}{dx^2}$ to classify them. Always show the second derivative test in optimization questions.

## Worked example — Classifying turning points

Find and classify the stationary points of $y = x^3 - 3x^2 + 2$.

$$
\frac{dy}{dx} = 3x^2 - 6x = 3x(x - 2) = 0 \implies x = 0 \text{ or } x = 2
$$

$$
At x = 0, y = 2. At x = 2, y = -22
$$
$$
\frac{d^2y}{dx^2} = 6x - 6
$$

$$
\text{At } x = 0: \frac{d^2y}{dx^2} = -6 < 0 \Rightarrow \text{maximum at } (0, 2)
$$

$$
At x = 2: \frac{d^2y}{dx^2} = 6 > 0 → **minimum** at (2, -2).
$$

## Worked example — Simple optimization

A rectangle has perimeter $20\,\text{cm}$. If one side is $x\,\text{cm}$, the area is $A = x(10 - x) = 10x - x^2$.

$$
\frac{dA}{dx} = 10 - 2x = 0 \implies x = 5
$$

$$
\frac{d^2A}{dx^2} = -2 < 0 \implies \text{maximum area at } x = 5
$$
$$
Maximum area= 5 \times 5 = 25\,\text{cm}^2.
$$

## Examiner tip

When solving practical word problems (such as finding the maximum volume of a box), always show the second derivative test explicitly to justify why your answer is a maximum or minimum. Simply finding the value of $x$ without testing it will result in a loss of marks.

## Quick check

If the first derivative of a function is zero and its second derivative is negative at a given point, that point is a local maximum.

[Image showing a curve highlighting a maximum point with zero gradient and a minimum point with zero gradient]
