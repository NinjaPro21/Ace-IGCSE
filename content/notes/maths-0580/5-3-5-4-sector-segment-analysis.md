## Core idea

This topic adapts full-circle geometry to partial arcs and segments sliced from a circle via central angles. It is used whenever you need to compute structural elements of a circle slice, such as tracking the length of a single pendulum swing or finding the surface area of a liquid line in a horizontal cylindrical pipe.

## Key formulas

$$
\text{Arc Length} = \frac{\theta}{360} \times 2\pi r
$$
$$
\text{Sector Area} = \frac{\theta}{360} \times \pi r^2
$$
$$
\text{Area of Segment} = \frac{\theta}{360}\pi r^2 - \frac{1}{2}r^2\sin\theta
$$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 240 220" width="240" height="220" role="img" aria-label="Circle sector">
      <circle cx="120" cy="110" r="70" fill="#fdfbf7" stroke="#e8e2d8"/>
      <path d="M120 110 L120 40 A70 70 0 0 1 185 85 Z" fill="#f5edd8" stroke="#5b8def" stroke-width="2"/>
      <text x="130" y="75" font-size="11" fill="#5b8def">θ</text>
      <text x="145" y="130" font-size="11" fill="#a8a29e">r</text>
      <line x1="120" y1="110" x2="120" y2="40" stroke="#a8a29e" stroke-dasharray="3 2"/>
    </svg><p class="enlight-physics-diagram__caption">Sector — fraction of circle area = $\theta/360$; arc length = $(\theta/360) \times 2\pi r$.</p></div>

<div class="enlight-physics-diagram"><svg viewBox="0 0 220 220" width="220" height="220" role="img" aria-label="Circle radius and diameter">
      <circle cx="110" cy="110" r="70" fill="#fdfbf7" stroke="#5b8def" stroke-width="2"/>
      <line x1="110" y1="110" x2="180" y2="110" stroke="#b59a73" stroke-width="2"/>
      <text x="145" y="100" font-size="11" fill="#b59a73">r</text>
      <line x1="40" y1="110" x2="180" y2="110" stroke="#a8a29e" stroke-dasharray="4 3"/>
      <text x="110" y="195" text-anchor="middle" font-size="10" fill="#a8a29e">diameter = 2r</text>
    </svg><p class="enlight-physics-diagram__caption">Circle — radius $r$ from centre to edge; diameter = $2r$; circumference = $2\pi r$; area = $\pi r^2$.</p></div>

## Steps / method

Extracting the Area of a Minor Segment Calculate the full area of the sector containing the segment using the central angle $\theta$ and $r$.

Form a triangle by connecting the center of the circle to the two ends of the chord.

Use the non-right-angled triangle formula $\frac{1}{2}ab\sin C$ (here, $\frac{1}{2}r^2\sin\theta$) to find its area.

Subtract the triangle's area from the sector's area to isolate the isolated segment space.

Finding the Central Angle from a Given Arc Length Set up the arc length formula with the known values isolated: $\text{Arc Length} = \frac{\theta}{360} \times 2\pi r$.

Rearrange the equation to isolate $\theta$ when $2$.

Evaluate the expression using precise intermediate numbers to avoid premature rounding errors before your final answer.

## Examiner tip

When calculating the area of a triangle inside a segment using $\frac{1}{2}r^2\sin\theta$, ensure your calculator is firmly set to Degree mode (D). If your calculator has accidentally shifted into Radian mode (R), your triangle area calculation will be completely incorrect, ruining the subsequent subtraction step.

## Quick check

If the central angle of a sector is exactly $60^\circ$, then the triangle formed by the two radii and the chord is equilateral.

## Worked examples

May 2022 Paper 42 Q6a: A sector of a circle has a radius of $8\text{ cm}$ and a central angle of $135^\circ$. Calculate the arc length.

Step 1: Identify $r = 8$ and $\theta = 135^\circ$.

Step 2: Substitute values into the arc length formula: $\text{Arc Length} = \frac{135}{360} \times 2 \times \pi \times 8$.

Step 3: Simplify and calculate: $\text{Arc Length} = \frac{3}{8} \times 16\pi = 6\pi \approx 18.85\text{ cm}$. Rounds to $18.8\text{ cm}$.

November 2020 Paper 23 Q21: A circle has a radius of $6\text{ cm}$. A sector within this circle has an area of $12\pi\text{ cm}^2$. Find the size of the central angle of this sector.

Step 1: Set up the area formula: $12\pi = \frac{\theta}{360} \times \pi \times 6^2$.

Step 2: Cancel $\pi$: $12 = \frac{\theta}{360} \times 36$.

Step 3: Simplify the fraction: $12 = \frac{\theta}{10} \implies \theta = 120^\circ$.
