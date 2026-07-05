## Core idea

Every straight line on a coordinate grid can be defined by a unique linear equation that links its coordinate points. Parallel lines share identical gradients because they run in the same direction, while perpendicular lines meet at right angles and have gradients that are negative reciprocals of each other. Use these geometric relationships to construct equations for parallel paths, normal boundary lines, and geometric shapes.

## Key formulas

$$
\text{Point-Slope Form Equation:} \quad y - y_1 = m(x - x_1)
$$
$$
\text{Parallel Gradient Condition:} \quad m_1 = m_2
$$
$$
\text{Perpendicular Slope Condition:} \quad m_1 \times m_2 = -1 \implies m_2 = -\frac{1}{m_1}
$$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 640 220" width="640" height="220" role="img" aria-label="Parallel and perpendicular lines">
      <text x="160" y="22" text-anchor="middle" font-size="11" fill="#1a1a1a" font-weight="600">Parallel (same m)</text>
      <line x1="20" y1="190" x2="300" y2="190" stroke="#a8a29e"/>
      <line x1="20" y1="190" x2="20" y2="40" stroke="#a8a29e"/>
      <line x1="40" y1="170" x2="260" y2="90" stroke="#5b8def" stroke-width="2"/>
      <line x1="40" y1="130" x2="260" y2="50" stroke="#789671" stroke-width="2" stroke-dasharray="6 4"/>
      <text x="480" y="22" text-anchor="middle" font-size="11" fill="#1a1a1a" font-weight="600">Perpendicular (m₁m₂ = −1)</text>
      <line x1="340" y1="190" x2="620" y2="190" stroke="#a8a29e"/>
      <line x1="340" y1="190" x2="340" y2="40" stroke="#a8a29e"/>
      <line x1="360" y1="170" x2="580" y2="90" stroke="#5b8def" stroke-width="2"/>
      <line x1="360" y1="90" x2="580" y2="170" stroke="#789671" stroke-width="2"/>
      <rect x="368" y="162" width="12" height="12" fill="none" stroke="#b59a73"/>
    </svg><p class="enlight-physics-diagram__caption">Parallel lines share the same gradient; perpendicular lines have gradients that multiply to $-1$.</p></div>

## Steps / method

Identify or calculate the gradient ($m_1$) of the reference line using its given equation or coordinate points.

Determine the gradient ($m_2$) of the target line: use $m_2 = m_1$ if the lines are parallel, or calculate the negative reciprocal $m_2 = -\frac{1}{m_1}$ if the lines are perpendicular.

Substitute this new gradient $m_2$ and the coordinates of a known point $(x_1, y_1)$ into the point-slope equation $y - y_1 = m_2(x - x_1)$.

Expand the brackets and rearrange the terms into the requested format, usually standard slope-intercept form ($y = mx + c$).

## Examiner tip

If a question asks for a perpendicular line equation, do not just change the sign of the gradient. For example, if the reference line has a gradient of $3$, changing it to $-3$ is incorrect. You must find the negative reciprocal, which flips the fraction and changes the sign, giving $-\frac{1}{3}$.

## Quick check

If two lines are perpendicular, multiplying their gradients together must always equal exactly $-1$.

## Worked example — Example 1 (May 2022 P21 Q14)

Find the equation of the straight line that is parallel to $y = 4x - 5$ and passes through the point $(3, 7)$.

Identify the reference gradient from the given line equation: $m_1 = 4$.

Since the target line is parallel, it shares the same gradient: $m_2 = 4$.

Substitute the gradient $m_2 = 4$ and point $(3, 7)$ into the line equation: $y - 7 = 4(x - 3)$. Expand the brackets on the right side: $y - 7 = 4x - 12$.

Add $7$ to both sides to write the final equation in standard form: $y = 4x - 5$.

## Worked example — Example 2 (Nov 2023 P41 Q9c)

Find the equation of the straight line that is perpendicular to the line $y = -\frac{2}{5}x + 1$ and passes through the point $(-4, 6)$.

Identify the reference gradient from the given line equation: $m_1 = -\frac{2}{5}$.

Calculate the perpendicular gradient using the negative reciprocal rule: $m_2 = -\frac{1}{-2/5} = +\frac{5}{2}$.

Substitute the perpendicular gradient $m_2 = \frac{5}{2}$ and point $(-4, 6)$ into the equation template: $y - 6 = \frac{5}{2}(x - (-4))$.

Simplify the double negative sign inside the brackets: $y - 6 = \frac{5}{2}(x + 4)$. Expand the brackets: $y - 6 = \frac{5}{2}x + 10$.

Add $6$ to both sides to find the final equation: $y = \frac{5}{2}x + 16$.
