## Core idea

Vectors are mathematical quantities that have both a magnitude (size) and a direction, often used to describe displacements between points in space. Position vectors specify the location of a point relative to a fixed origin, allowing geometric problems to be solved algebraically using vector operations.

## Key formulas

**Column vector**

$$
\mathbf{r} = \begin{pmatrix} x \ \\ y \end{pmatrix} = x\mathbf{i} + y\mathbf{j}
$$

**Magnitude and unit vector**

$$
|\mathbf{r}| = \sqrt{x^2 + y^2},
$$

$$
\hat{\mathbf{r}} = \frac{\mathbf{r}}{|\mathbf{r}|}
$$

**Displacement vector**

$$
\vec{AB} = \vec{OB} - \vec{OA} = \mathbf{b} - \mathbf{a}
$$

## Steps / method

Write down position vectors relative to the origin as column vectors or in $\mathbf{i}, \mathbf{j}$ unit component notation.

To find the displacement vector between two points $A$ and $B$, subtract the starting position vector from the ending position vector ($\mathbf{b} - \mathbf{a}$).

Calculate the magnitude of a vector by applying Pythagoras' theorem to its components.

To find a unit vector pointing in the same direction, divide each component of the original vector by its total magnitude.

Solve geometric path problems by combining vector displacements along known line segments.

### Key rule

Displacement from $A$ to $B$ is $\vec{AB} = \mathbf{b} - \mathbf{a}$ — subtract the start from the end. Magnitude uses Pythagoras on the components.

## Worked example — Displacement vector

Points $A$ and $B$ have position vectors $\mathbf{a} = \begin{pmatrix} 2 \ \\ 1 \end{pmatrix}$ and $\mathbf{b} = \begin{pmatrix} 5 \ \\ 5 \end{pmatrix}$. Find $\vec{AB}$.

$$
\vec{AB} = \mathbf{b} - \mathbf{a} = \begin{pmatrix} 3 \ \\ 4 \end{pmatrix}
$$

## Worked example — Magnitude and unit vector

Find $|\vec{AB}|$ and a unit vector in the same direction.

$$
|\vec{AB}| = \sqrt{3^2 + 4^2} = 5
\hat{\mathbf{u}} = \frac{1}{5}\begin{pmatrix} 3 \ \\ 4 \end{pmatrix} = \begin{pmatrix} 0.6 \ \\ 0.8 \end{pmatrix}
$$

## Examiner tip

Vectors are distinct from scalar numbers. In written exam papers, you must underline vector variables (like $\underline{u}$ or $\underline{v}$) to indicate they are vectors, as typeset bold notation cannot be easily reproduced by hand.

## Quick check

If a vector is a unit vector, its total calculated magnitude must be exactly equal to 1.
