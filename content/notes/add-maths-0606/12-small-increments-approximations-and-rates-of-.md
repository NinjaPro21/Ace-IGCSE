## Core idea

Calculus can be used to approximate small changes in dependent variables by assuming the curve behaves like a straight line over short intervals. This relationship al so links rates of change with respect to time by using the chain rule to connect different related variables.

## Key formulas

$$
\text{Small Increments: } \delta y \approx \left( \frac{dy}{dx} \right) \times \delta x
$$

$$
\text{Connected Rates of Change: } \frac{dy}{dt} = \frac{dy}{dx} \times \frac{dx}{dt}
$$

## Steps / method

Differentiate the base equation connecting the two primary variables to find $\frac{dy}{dx}$.

Substitute the initial starting value of $x$ into the derivative to get a numerical gradient.

For small changes, calculate $\delta x$ by finding the difference between the new value and the old value ($x_{\text{new}} - x_{\text{old}}$).

Multiply this change $\delta x$ by the calculated derivative value to approximate the change in the other variable: $\delta y$.

For rates of change over time, substitute the known time derivative and the spatial derivative into the connected rates chain rule formula to solve for the missing rate.

### Key rule

Small-change approximation uses $\delta y \approx \frac{dy}{dx} \times \delta x$. For connected rates, chain the derivatives so matching variables cancel.

## Worked example — Small increment

Given $y = x^3$ and $x$ increases from 2 to $2.1$, estimate the change in $y$.

$\frac{dy}{dx} = 3x^2 \implies \text{at } x = 2, \; \frac{dy}{dx} = 12$

$\delta x = 0.1 \implies \delta y \approx 12 \times 0.1 = 1.2$

The approximate increase in y $is **1.2** (exact change is$2.1^3 - 2^3 = 1.261$).$

## Worked example — Connected rates

A spherical balloon has radius increasing at $2\,\text{cm/s}$. Find $\frac{dV}{dt}$ when $r = 5\,\text{cm}$, given $V = \frac{4}{3}\pi r^3$. $\frac{dV}{dr} = 4\pi r^2, \quad \frac{dr}{dt} = 2$ $\frac{dV}{dt} = 4\pi r^2 \times 2 = 8\pi r^2$

At r = 5$:$\frac{dV}{dt} = 8\pi(25) = 200\pi\,\text{cm}^3/\text{s}2

## Examiner tip

Ensure that the components in your rate equations match up correctly. When a question states that a measurement is "decreasing at a uniform rate," you must include a negative sign on that derivative term (e.g., $\frac{dx}{dt} = -0.5$) in your calculations.

## Quick check

If the value of $x$ increases by a small amount $\delta x$ and the gradient $\frac{dy}{dx}$ is negative, the corresponding value of $y$ will decrease.
