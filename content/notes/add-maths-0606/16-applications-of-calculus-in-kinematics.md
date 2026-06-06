## Core idea

Kinematics models the linear motion of objects over time by using calculus to connect displacement ($s$), velocity ($v$), and acceleration ($a$). Differentiation allows you to find rates of change to move from displacement down to acceleration, while integration allows you to reverse the process to find total distances traveled.

## Key formulas

$$\text{Forward Direction (Differentiation): } v = \frac{ds}{dt}, \quad a = \frac{dv}{dt} = \frac{d^2s}{dt^2}$$

$$\text{Reverse Direction (Integration): } v = \int a \, dt, \quad s = \int v \, dt$$

$$\text{Displacement Change: } \Delta s = \int_{t_1}^{t_2} v(t) \, dt, \quad \text{Total Distance} = \int_{t_1}^{t_2} |v(t)| \, dt$$

## Steps / method

Identify the given motion equation and note whether it represents displacement, velocity, or acceleration as a function of time ($t$).

To find velocity from displacement, or acceleration from velocity, differentiate the equation with respect to time.

To find velocity from acceleration, or displacement from velocity, integrate the equation with respect to time and use initial conditions to solve for the constant $+C$.

To find when an object changes direction or comes to a temporary stop, set the velocity equation to zero ($v = 0$) and solve for time $t$.

To find the total distance traveled when an object changes direction, split the integration interval into separate time periods at the turning points.

## Examiner tip

Be careful to distinguish between the terms &quot;displacement&quot; and &quot;total distance traveled&quot;. Displacement is a vector that measures the straight-line distance from the starting point, while total distance tracks the entire path length traveled, requiring you to account for any changes in direction.

## Quick check

If an object reaches its maximum velocity during its motion, its acceleration at that exact moment must be equal to zero.

## Visual / interactive intent

New explorer: Kinematics particle runner. Includes three linked graphs: displacement, velocity, and acceleration versus time. Users can choose a motion equation, and an animation shows a particle moving along a track, highlighting how slopes and areas under the curves relate to each other.
