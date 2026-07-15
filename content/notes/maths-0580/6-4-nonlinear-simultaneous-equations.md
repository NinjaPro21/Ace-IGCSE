## Core idea

Nonlinear simultaneous equations are systems where at least one equation represents a curve rather than a straight line. They are typically solved by rearranging the linear equation to isolate one variable, and then substituting this expression into the nonlinear equation to create a quadratic equation. Use this method to find the coordinates where a straight line intersects a curve, such as a circle, parabola, or hyperbola.

## Key methods

**Step 1** — rearrange the linear equation to make $y = \ldots$ (or $x = \ldots$).

**Step 2** — substitute into the curve equation so you have one equation in one variable.

**Step 3** — solve the resulting quadratic, then substitute each root back to find the matching coordinate.

Use the **interactive explorer** below to see how a line can meet a curve at 0, 1, or 2 points.

## Graphs & diagrams

<div class="ace-physics-diagram"><svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Line intersecting a parabola">
      <line x1="40" y1="180" x2="280" y2="180" stroke="#a8a29e"/>
      <line x1="61.81818181818182" y1="40" x2="61.81818181818182" y2="180" stroke="#a8a29e"/>
      <text x="284" y="184" font-size="10" fill="#6b6b6b">x</text>
      <text x="26" y="110" font-size="10" fill="#6b6b6b">y</text>
      <polyline points="40.0,26.9 46.5,42.2 53.1,56.8 59.6,70.6 66.2,83.6 72.7,95.8 79.3,107.2 85.8,117.8 92.4,127.7 98.9,136.7 105.5,145.0 112.0,152.5 118.5,159.2 125.1,165.1 131.6,170.2 138.2,174.5 144.7,178.1 151.3,180.8 157.8,182.8 164.4,184.0 170.9,184.4 177.5,184.0 184.0,182.8 190.5,180.8 197.1,178.1 203.6,174.5 210.2,170.2 216.7,165.1 223.3,159.2 229.8,152.5 236.4,145.0 242.9,136.7 249.5,127.7 256.0,117.8 262.5,107.2 269.1,95.8 275.6,83.6" fill="none" stroke="#5b8def" stroke-width="2.5"/>
      <line x1="40" y1="66.25" x2="280" y2="153.75" stroke="#789671" stroke-width="2"/>
      <circle cx="61.81818181818182" cy="75" r="5" fill="#b59a73"/>
      <circle cx="236.36363636363637" cy="145" r="5" fill="#b59a73"/>
      <text x="69.81818181818181" y="69" font-size="9" fill="#b59a73">(0, 6)</text>
      <text x="244.36363636363637" y="149" font-size="9" fill="#b59a73">(4, 2)</text>
    </svg><p class="ace-physics-diagram__caption">Line and curve — $y = x^2 - 5x + 6$ meets $y = -x + 6$ at $(0, 6)$ and $(4, 2)$; each point is a simultaneous solution.</p></div>

## Steps / method

Rearrange the linear equation to express one variable explicitly in terms of the other (for example, $y = \text{expression in } x$).

Substitute this linear expression into the nonlinear equation wherever that variable appears, creating a single equation with only one variable.

Expand any brackets and collect all terms on one side to form a standard quadratic equation equal to zero: $Ax^2 + Bx + C = 0$.

Solve this quadratic equation using factorisation or the quadratic formula to find two distinct values for the first variable.

Substitute each of these values back into the rearranged linear equation to find their corresponding values for the second variable, forming two distinct solution pairs.

## Examiner tip

Always present your final answers clearly as coordinate pairs, matching each $x$ value with its corresponding $y value (e.g$. $2x_1 = 2$, $y_1 = 5$ and $x_2 = -3$, $y_2 = -10$). Mis-matching values or listing them separately without showing which numbers go together will lose you marks on Paper 4.

## Quick check

A straight line can intersect a quadratic curve at a maximum of two unique points.

## Worked example — Example 1 (June 2021 P42 Q6)

Solve the simultaneous equations, showing all your working:

$$
\begin{cases} y = x + 3 \\ x^2 + y^2 = 29 \end{cases}
$$

The linear equation already has $y$ isolated: $y = x + 3$.

Substitute $(x + 3)$ for $y$ in the second equation: $x^2 + (x + 3)^2 = 29$.

Expand the squared bracket carefully: $x^2 + (x^2 + 6x + 9) = 29$.

Collect like terms and set the equation to zero: $2x^2 + 6x + 9 - 29 = 0$, so $2x^2 + 6x - 20 = 0$.

Simplify the quadratic equation by dividing all terms by 2: $x^2 + 3x - 10 = 0$.

Factorise the quadratic expression: $(x + 5)(x - 2) = 0$, which gives the roots $x = -5$ and $x = 2$.

Substitute each $x$ value back into the linear equation ($y = x + 3$) to find the corresponding $y$ values:

For $x = -5$: $y = -5 + 3 = -2$, so $(-5, -2)$.

For $x = 2$: $y = 2 + 3 = 5$, so $(2, 5)$.

## Worked example — Example 2 (Nov 2023 P41 Q8b)

Find the coordinates of intersection between the line $2x + y = 5$ and the curve $y = x^2 - 3x + 1$.

Rearrange the linear equation to isolate $y$: $y = 5 - 2x$.

Substitute this expression into the curve's equation: $5 - 2x = x^2 - 3x + 1$.

Rearrange all terms to one side to form a standard quadratic equation: $0 = x^2 - 3x + 2x + 1 - 5$, so $x^2 - x - 4 = 0$.

Solve this quadratic equation using the quadratic formula since it does not factorise ($a = 1$, $b = -1$, $c = -4$):

$$
x = \frac{-(-1) \pm \sqrt{(-1)^2 - 4(1)(-4)}}{2(1)} = \frac{1 \pm \sqrt{17}}{2}
$$

Calculate the two decimal values for $x$: $x_1 \approx 2.56$ and $x_2 \approx -1.56$.

Substitute both $x$ values back into the linear equation $y = 5 - 2x$ to calculate the corresponding $y$ coordinates:

For $x_1 = 2.56$: $y_1 = 5 - 2(2.56) = -0.12$, so $(2.56, -0.12)$.

For $x_2 = -1.56$: $y_2 = 5 - 2(-1.56) = 8.12$, so $(-1.56, 8.12)$.
