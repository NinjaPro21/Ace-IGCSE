## Core idea

Connected rates of change link how fast one quantity changes to another using the chain rule. If $y$ depends on $x$ and $x$ changes with time, then $\dfrac{dy}{dt} = \dfrac{dy}{dx} \times \dfrac{dx}{dt}$.

## Key formulas

**Chain rule for time**

$$
\frac{dy}{dt} = \frac{dy}{dx} \times \frac{dx}{dt}
$$

## Steps / method

1. **Write** the relationship between the variables (e.g. $A = \pi r^2$).
2. **Differentiate** with respect to the linking variable.
3. **Substitute** known rates and values.
4. **Solve** for the required rate.

### Key rule

Read units carefully: cm/s is a length rate, cm²/s is an area rate, cm³/s is a volume rate.

## Worked example — Area of a circle

Question: The radius of a circle increases at 3 cm/s. Find the rate of increase of the area when $r = 5$ cm.

Use the chain rule with $A = \pi r^2$ and $\dfrac{dr}{dt} = 3$:

$$
\frac{dA}{dt} = \frac{dA}{dr} \times \frac{dr}{dt} = 2\pi r \times 3 = 6\pi r
$$

When $r = 5$, $\dfrac{dA}{dt} = 30\pi$

The area increases at 30π cm² per second.

## Worked example — Volume of a cube

Question: A cube has side length 2 cm when measured. The volume increases at 12 cm³/s. Find the rate of change of the side length at that instant.

When s = 2, dV/ds = 12. The chain rule gives:

$$
12 = 12 \times \frac{ds}{dt} \quad \Rightarrow \quad \frac{ds}{dt} = 1
$$

The side increases at 1 cm per second.

## Examiner tip

Identify each rate by its units before setting up the chain rule. This helps even when the wording is dense.

## Quick check

When the radius is constant, the area does not change.
