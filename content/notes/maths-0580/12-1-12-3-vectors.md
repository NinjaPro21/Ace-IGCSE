## Core idea

Vectors are mathematical quantities that represent both a directional heading and a numerical magnitude (length). In coordinate geometry, displacement vectors are written as column vectors $\begin{pmatrix} x \ y \end{pmatrix}$, where $x$ and $y$ defines the vertical shift. Use vectors to calculate translations, solve geometric proof problems, and find resultant movements by combining scalar tracks.

## Key formulas

$$
\text{Column Vector Representation:} \quad \mathbf{v} = \begin{pmatrix} x \ y \end{pmatrix} \implies \text{Magnitude: } |\mathbf{v}| = \sqrt{x^2 + y^2}

\text{Vector Addition and Subtraction:} \quad \begin{pmatrix} x_1 \ y_1 \end{pmatrix} \pm \begin{pmatrix} x_2 \ y_2 \end{pmatrix} = \begin{pmatrix} x_1 \pm x_2 \ y_1 \pm y_2 \end{pmatrix}

\text{Scalar Scalar Multiplier:} \quad k \cdot \begin{pmatrix} x \ y \end{pmatrix} = \begin{pmatrix} kx \ ky \end{pmatrix}
$$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 320 200" width="320" height="200" role="img" aria-label="Vector addition">
      <line x1="60" y1="150" x2="160" y2="80" stroke="#2563eb" stroke-width="2.5" marker-end="url(#va)"/>
      <line x1="160" y1="80" x2="240" y2="120" stroke="#16a34a" stroke-width="2.5" marker-end="url(#va)"/>
      <line x1="60" y1="150" x2="240" y2="120" stroke="#dc2626" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#va)"/>
      <text x="105" y="100" font-size="10" fill="#2563eb">a</text>
      <text x="205" y="95" font-size="10" fill="#16a34a">b</text>
      <text x="145" y="145" font-size="10" fill="#dc2626">a+b</text>
      <defs><marker id="va" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker></defs>
    </svg></div>

Vector addition — place tail of second vector at tip of first; resultant goes from start to finish.

## Steps / method

To write a translation vector between two points, count the total horizontal change to find the top $x$ and $y$ value.

Add or subtract column vectors by combining their top $x$ and $y$ components together separately.

Multiply a vector by a scalar by multiplying both the top and bottom components by that scalar value.

To calculate the magnitude (length) of a vector, substitute its components into the vector magnitude formula (Pythagoras' Theorem).

## Examiner tip

Be careful with the formatting of vector components. A column vector $\begin{pmatrix} 3 \ -4 \end{pmatrix}$ must never be written with a fraction line or a comma separating the numbers. Writing it as $\begin{pmatrix} \frac{3}{-4} \end{pmatrix}$ or $(3, -4)$ when a column vector is requested will cause you to lose formatting marks on Paper 2.

## Quick check

If two vectors are scalar multiples of each other (such as $\mathbf{a}$ and $3\mathbf{a}$), they run in the same direction and are perfectly parallel on a coordinate grid.

## Worked example — Example 1 (June 2022 P21 Q13)

Given the two vectors $\mathbf{a} = \begin{pmatrix} 4 \ -2 \end{pmatrix}$ and $\mathbf{b} = \begin{pmatrix} -1 \ 5 \end{pmatrix}$, calculate the combined resultant column vector expression for $3\mathbf{a} - 2\mathbf{b}$.

Apply the scalar multipliers to each vector separately:$3\mathbf{a} = 3 \times \begin{pmatrix} 4 \ -2 \end{pmatrix} = \begin{pmatrix} 12 \ -6 \end{pmatrix}

$$
2\mathbf{b} = 2 \times \begin{pmatrix} -1 \ 5 \end{pmatrix} = \begin{pmatrix} -2 \ 10 \end{pmatrix}
$$

Set up the subtraction expression using these modified column components: $\begin{pmatrix} 12 \ -6 \end{pmatrix} - \begin{pmatrix} -2 \ 10 \end{pmatrix}$.

Combine the top $x$. $12 - (-2) = 12 + 2 = 14$. Combine the bottom $y$. $-6 - 10 = -16$.

State the final combined column vector: $\begin{pmatrix} 14 \ -16 \end{pmatrix}$.

## Worked example — Example 2 (Nov 2023 P42 Q6a)

Vector $\mathbf{v}$ tracks a shift from point $P$ and $Q. \overrightarrow{PQ} = \begin{pmatrix} -6 \ 8 \end{pmatrix}$. Calculate the exact absolute magnitude length $|\overrightarrow{PQ}|$.

Identify the components of the vector: $x = -6$ and $y = 8$.

Write down the vector magnitude formula: $|\mathbf{v}| = \sqrt{x^2 + y^2}$.

Substitute the components into the formula, enclosing the negative value in brackets: $|\overrightarrow{PQ}| = \sqrt{(-6)^2 + (8)^2}$.

Evaluate the squared terms: $|\overrightarrow{PQ}| = \sqrt{36 + 64} = \sqrt{100}$.

Take the square root to find the final magnitude: $|\overrightarrow{PQ}| = 10$.
