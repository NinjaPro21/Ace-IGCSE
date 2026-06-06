## Core idea

Vectors can be used to model motion over time by combining an object's initial position vector with its velocity vector. This allows the position of an object moving at a constant speed to be calculated at any given time, which is useful for solving collision or interception problems.

## Key formulas

$$\text{Position Vector at time } t: \mathbf{r} = \mathbf{r}_0 + \mathbf{v}t$$

$$\text{Where: } \mathbf{r}_0 = \text{initial position vector at } t=0, \,\, \mathbf{v} = \text{constant velocity vector}$$

$$\text{Speed} = |\mathbf{v}| = \sqrt{v_x^2 + v_y^2}$$

## Steps / method

Extract the initial position vector ($\mathbf{r}_0$) and the velocity vector ($\mathbf{v}$) from the information provided.

Set up the vector equation of motion as a function of time: $\mathbf{r} = \mathbf{r}_0 + \mathbf{v}t$.

To determine if two moving objects collide, set their position equations equal to each other ($\mathbf{r}_1 = \mathbf{r}_2$).

Separate the combined vector equation into two independent scalar equations: one for the horizontal $x$-components and one for the vertical $y$-components.

Solve for time $t$ in both equations; if the calculated time values are identical, a collision occurs at that moment.

## Examiner tip

Remember that speed and velocity are different terms. Velocity is a vector quantity containing components or a direction, while speed is a single scalar number representing the magnitude of that velocity vector.

## Quick check

If an object starts at the origin and moves with a velocity vector of $\begin{pmatrix} 3 \\ 4 \end{pmatrix}$ for 2 seconds, its final position vector will be $\begin{pmatrix} 6 \\ 8 \end{pmatrix}$.

## Visual / interactive intent

New explorer: Vector kinematics simulator. A simulation showing two boats moving across a grid. Users change their starting positions and velocity vectors using sliders, then press play to see if the paths intersect and result in a collision.
