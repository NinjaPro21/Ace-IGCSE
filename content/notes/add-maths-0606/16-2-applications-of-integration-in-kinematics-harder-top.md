## Core idea

Integration reverses differentiation in kinematics. Given acceleration or velocity, integrate to recover velocity or displacement. Initial conditions determine the constant of integration.

## Key formulas

$$
v = \int a\, dt, \quad s = \int v\, dt
$$
$\Delta s = \int_{t_1}^{t_2} v(t)\, dt, \quad \text{Total distance} = \int_{t_1}^{t_2} |v(t)|\, dt$

## Steps / method

1. **Integrate** the given expression with respect to $t$ and include $+C.$

2. **Use** an initial condition (e.g22v = 2$when$t = 0$) to find$ C2

3. **Integrate** again if displacement is required.


4. **Split** the time interval and use $|v(t)|$ for total distance when the particle changes direction.

### Key rule

Displacement uses $\int v\, dt$; total distance uses $\int |v|\, dt$ when direction changes. Displacement is net change from the start; distance is path length.

## Worked example — Velocity from acceleration

Question: A particle has $a = 6t\,\text{m/s}^2$. Given $v = 2\,\text{m/s}$ when $t = 0$, find $v$ and $s$ at $t = 3$.

$v = \int 6t\, dt = 3t^2 + C$

When $t = 0$: $v = 2 \implies C = 2$, so $v = 3t^2 + 2$

At $t = 3$: $v = 29\,\text{m/s}$

$s = \int (3t^2 + 2)\, dt = t^3 + 2t + C'$

Taking $s = 0$ at $t = 0$ gives $s = t^3 + 2t$

At $t = 3$: $s = 33\,\text{m}$

## Worked example — Displacement over an interval

Question: A particle has $v = 2t - 4$ m/s. Find the displacement from $t = 1$ to $t = 4$.

$$
\Delta s = \int_1^4 (2t - 4)\, dt = \left[t^2 - 4t\right]_1^4 = (16 - 16) - (1 - 4) = 3\,\text{m}
$$

## Examiner tip

Distinguish displacement from total distance. If $v$ changes sign inside the interval, find where $v = 0$, split the integral, and add the absolute areas.

## Quick check

If $v = 3\,\text{m/s}$ is constant, then $s = 3t + C$ and displacement over $[0, 5]$ is $15\,\text{m}$.
