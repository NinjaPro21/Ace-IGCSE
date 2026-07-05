## Core idea

Plotting curves involves graphing non-linear functions—such as quadratics, cubics, reciprocals, and exponentials—by calculating coordinate points across a specific domain. Unlike straight lines, non-linear curves have variable gradients, producing characteristic shapes like parabolas, inflections, asymptotes, and rapid growth curves. Use these plotting techniques to solve non-linear equations graphically, locate local turning points, and model complex physical systems.

## Key formulas

**Quadratic (parabola)**

$$
y = ax^2 + bx + c
$$

**Cubic**

$$
y = ax^3 + bx^2 + cx + d
$$

**Reciprocal**

$$
y = \frac{a}{x} \quad \text{or} \quad y = \frac{a}{x^2}
$$

**Exponential**

$$
y = a \times b^x
$$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 640 220" width="640" height="220" role="img" aria-label="Quadratic graphs a positive and negative">
      <text x="160" y="22" text-anchor="middle" font-size="11" fill="#5b8def" font-weight="600">a &gt; 0 (U-shape)</text>
      <line x1="40" y1="156.66666666666666" x2="280" y2="156.66666666666666" stroke="#a8a29e"/>
      <line x1="80" y1="40" x2="80" y2="180" stroke="#a8a29e"/>
      <polyline points="60.0,95.4 66.0,103.9 72.0,111.9 78.0,119.3 84.0,126.2 90.0,132.6 96.0,138.5 102.0,143.8 108.0,148.6 114.0,152.9 120.0,156.7 126.0,159.9 132.0,162.6 138.0,164.8 144.0,166.5 150.0,167.6 156.0,168.2 162.0,168.3 168.0,167.9 174.0,166.9 180.0,165.4 186.0,163.4 192.0,160.9 198.0,157.8 204.0,154.2 210.0,150.1 216.0,145.5 222.0,140.3 228.0,134.6 234.0,128.4 240.0,121.7 246.0,114.4 252.0,106.6 258.0,98.3" fill="none" stroke="#5b8def" stroke-width="2.5"/>
      <circle cx="120" cy="156.66666666666666" r="4" fill="#b59a73"/><circle cx="200" cy="156.66666666666666" r="4" fill="#b59a73"/>
      <text x="120" y="170.66666666666666" text-anchor="middle" font-size="8" fill="#b59a73">root</text>
      <text x="200" y="170.66666666666666" text-anchor="middle" font-size="8" fill="#b59a73">root</text>
      <text x="480" y="22" text-anchor="middle" font-size="11" fill="#b59a73" font-weight="600">a &lt; 0 (∩-shape)</text>
      <line x1="360" y1="96" x2="600" y2="96" stroke="#a8a29e"/>
      <line x1="400" y1="40" x2="400" y2="180" stroke="#a8a29e"/>
      <polyline points="380.0,169.5 386.0,159.3 392.0,149.8 398.0,140.8 404.0,132.5 410.0,124.9 416.0,117.8 422.0,111.4 428.0,105.7 434.0,100.5 440.0,96.0 446.0,92.1 452.0,88.9 458.0,86.2 464.0,84.2 470.0,82.9 476.0,82.1 482.0,82.0 488.0,82.6 494.0,83.7 500.0,85.5 506.0,87.9 512.0,91.0 518.0,94.6 524.0,98.9 530.0,103.9 536.0,109.4 542.0,115.6 548.0,122.5 554.0,129.9 560.0,138.0 566.0,146.7 572.0,156.1 578.0,166.0" fill="none" stroke="#b59a73" stroke-width="2.5"/>
      <circle cx="440" cy="96" r="4" fill="#b59a73"/><circle cx="520" cy="96" r="4" fill="#b59a73"/>
    </svg><p class="enlight-physics-diagram__caption">Quadratic graph $y = ax^2 + bx + c$ — U-shape when $a > 0$ (left), ∩-shape when $a < 0$ (right); dots mark roots on the $x$-axis.</p></div>

<div class="enlight-physics-diagram"><svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Cubic curve sketch">
      <line x1="40" y1="110" x2="280" y2="110" stroke="#a8a29e"/>
      <line x1="160" y1="40" x2="160" y2="180" stroke="#a8a29e"/>
      <polyline points="64.0,156.7 69.8,133.4 75.5,114.0 81.3,98.1 87.0,85.5 92.8,76.0 98.6,69.3 104.3,65.2 110.1,63.4 115.8,63.8 121.6,65.9 127.4,69.7 133.1,74.9 138.9,81.2 144.6,88.4 150.4,96.2 156.2,104.4 161.9,112.8 167.7,121.1 173.4,129.1 179.2,136.5 185.0,143.1 190.7,148.7 196.5,153.0 202.2,155.7 208.0,156.7 213.8,155.6 219.5,152.3 225.3,146.5 231.0,138.0 236.8,126.4 242.6,111.7 248.3,93.4 254.1,71.5" fill="none" stroke="#5b8def" stroke-width="2.5"/>
    </svg><p class="enlight-physics-diagram__caption">Cubic graph — S-shape; can have up to three x-axis intercepts and two turning points.</p></div>

<div class="enlight-physics-diagram"><svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Reciprocal graph">
      <line x1="160" y1="40" x2="160" y2="180" stroke="#e8e2d8" stroke-dasharray="4 3"/>
      <line x1="40" y1="110" x2="280" y2="110" stroke="#e8e2d8" stroke-dasharray="4 3"/>
      <line x1="40" y1="110" x2="280" y2="110" stroke="#a8a29e"/>
      <line x1="160" y1="40" x2="160" y2="180" stroke="#a8a29e"/>
      <polyline points="179.9,42.5 182.8,51.1 185.7,57.7 188.6,62.9 191.4,67.3 194.3,70.8 197.2,73.9 200.1,76.5 203.0,78.7 205.8,80.7 208.7,82.4 211.6,84.0 214.5,85.3 217.4,86.6 220.2,87.7 223.1,88.7 226.0,89.6 228.9,90.5 231.8,91.3 234.6,92.0 237.5,92.7 240.4,93.3 243.3,93.9 246.2,94.4 249.0,94.9 251.9,95.4 254.8,95.8 257.7,96.2 260.6,96.6 263.4,97.0 266.3,97.4 269.2,97.7 272.1,98.0 275.0,98.3 277.8,98.6" fill="none" stroke="#5b8def" stroke-width="2.5"/>
      <polyline points="40.0,121.2 42.9,121.5 45.8,121.8 48.6,122.1 51.5,122.4 54.4,122.7 57.3,123.1 60.2,123.5 63.0,123.9 65.9,124.3 68.8,124.7 71.7,125.2 74.6,125.7 77.4,126.3 80.3,126.9 83.2,127.5 86.1,128.2 89.0,128.9 91.8,129.7 94.7,130.6 97.6,131.5 100.5,132.6 103.4,133.7 106.2,135.0 109.1,136.4 112.0,138.0 114.9,139.8 117.8,141.8 120.6,144.1 123.5,146.8 126.4,150.0 129.3,153.8 132.2,158.3 135.0,163.8 137.9,170.9" fill="none" stroke="#5b8def" stroke-width="2.5"/>
      <text x="166" y="52" font-size="9" fill="#6b6b6b">x = 0</text>
      <text x="250" y="104" font-size="9" fill="#6b6b6b">y = 0</text>
    </svg><p class="enlight-physics-diagram__caption">Reciprocal graph $y = k/x$ — two branches in opposite quadrants; asymptotes at both axes.</p></div>

## Steps / method

Complete the missing values in the provided table of coordinates by substituting each $x$ value into the given non-linear function.

Use brackets around negative values when evaluating indices on your calculator to avoid sign errors.

Plot each coordinate pair $(x, y)$ carefully onto the exam grid using a sharp pencil.

Join the plotted points with a single, smooth, continuous freehand curve.

Do not use a ruler to connect points on a curve.

## Examiner tip

When drawing curves on Paper 4, never use a ruler to connect your points into straight segments. The curve must be drawn as a single, smooth freehand line. Additionally, ensure your curve does not overshoot turning points or double back on itself, as these drawing errors will lose you accuracy marks.

## Quick check

Reciprocal curves of the form $y = \frac{a}{x}$ are discontinuous and break at $x = 0$ because division by zero is mathematically undefined.

[Image showing the characteristic shapes of quadratic, cubic, reciprocal, and exponential curves side-by-side]

## Worked example — Example 1 (June 2022 P42 Q4a)

Complete the value table and plot the curve $y = x^3 - 3x$. $-2 \le x \le 2$.

Substitute selected $x$ values into $y = x^3 - 3x$:

For $x = -2 \implies y = (-2)^3 - 3(-2) = -8 + 6 = -2 \implies (-2, -2)$

For $x = -1 \implies y = (-1)^3 - 3(-1) = -1 + 3 = 2 \implies (-1, 2)$

For $x = 0 \implies y = 0 \implies (0, 0)$

For $x = 1 \implies y = 1 - 3 = -2 \implies (1, -2)$

For $x = 2 \implies y = 8 - 6 = 2 \implies (2, 2)$

Plot these coordinates accurately on the grid axes.

Draw a smooth, continuous cubic curve through the points, showing the peak at $(-1,2)$ and the trough at $(1,-2)$.

## Worked example — Example 2 (Nov 2023 P41 Q5a)

Plot the reciprocal function $y = 2 + \frac{1}{x}$ across the broken domain range $-3 \le x \le 3, x \neq 0$.

Calculate coordinate outputs for both negative and positive domain branches:

For $x = -2 \implies y = 2 + \frac{1}{-2} = 1.5 \implies (-2, 1.5)$

For $x = -0.5 \implies y = 2 + \frac{1}{-0.5} = 0 \implies (-0.5, 0)$

For $x = 0.5 \implies y = 2 + \frac{1}{0.5} = 4 \implies (0.5, 4)$

For $x = 2 \implies y = 2 + \frac{1}{2} = 2.5 \implies (2, 2.5)$

Plot the points on the grid, keeping the two branches separate.

Draw two smooth, disconnected curve branches that approach but do not touch the vertical asymptote at $x = 0$ and the horizontal asymptote at $y = 2$.
