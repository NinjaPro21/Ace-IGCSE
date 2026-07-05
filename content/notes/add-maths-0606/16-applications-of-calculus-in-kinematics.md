## Core idea

Kinematics models the linear motion of objects over time by using calculus to connect displacement ($s$), velocity ($v$), and acceleration ($a$). Differentiation allows you to find rates of change to move from displacement down to acceleration, while integration allows you to reverse the process to find total distances traveled.

## Key formulas

$$
\text{Forward Direction (Differentiation): } v = \frac{ds}{dt}, \quad a = \frac{dv}{dt} = \frac{d^2s}{dt^2}
$$
$$
\text{Reverse Direction (Integration): } v = \int a \, dt, \quad s = \int v \, dt
$$
$$
\text{Displacement Change: } \Delta s = \int_{t_1}^{t_2} v(t) \, dt, \quad \text{Total Distance} = \int_{t_1}^{t_2} |v(t)| \, dt
$$

## Steps / method

Identify the given motion equation and note whether it represents displacement, velocity, or acceleration as a function of time ($t$).

To find velocity from displacement, or acceleration from velocity, differentiate the equation with respect to time.

To find velocity from acceleration, or displacement from velocity, integrate the equation with respect to time and use initial conditions to solve for the constant $+C$.

To find when an object changes direction or comes to a temporary stop, set the velocity equation to zero ($v = 0$) and solve for time $t$.

To find the total distance traveled when an object changes direction, split the integration interval into separate time periods at the turning points.

### Key rule

Differentiate to go from displacement → velocity → acceleration. Integrate in reverse. Displacement uses $\int v\, dt$; total distance uses $\int |v|\, dt$ when direction changes.

## Worked example — Velocity from displacement

A particle has displacement $s = t^2 + 3t$ (metres) at time $t$ (seconds). Find its velocity at $t = 4$.

$$
v = \frac{ds}{dt} = 2t + 3
$$

At $t = 4$: $v = 11\,\text{m/s}$.

## Worked example — Displacement from acceleration

A particle has acceleration $a = 6t\,\text{m/s}^2$. Given $v = 2\,\text{m/s}$ when $t = 0$, find $v$ and $s$ at $t = 3$.

$$
v = \int 6t\, dt = 3t^2 + C \implies v(0) = 2 \implies C = 2
$$

$$
v = 3t^2 + 2 \implies v(3) = 29\,\text{m/s}
$$

$$
s = \int (3t^2 + 2)\, dt = t^3 + 2t + C' \implies s(3) = 33\,\text{m}
$$

## Examiner tip

Be careful to distinguish between the terms "displacement" and "total distance traveled". Displacement is a vector that measures the straight-line distance from the starting point, while total distance tracks the entire path length traveled, requiring you to account for any changes in direction.

## Quick check

If an object reaches its maximum velocity during its motion, its acceleration at that exact moment must be equal to zero.
