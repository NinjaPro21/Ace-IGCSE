## Core idea

This framework calculates the boundaries and surface space of standard two-dimensional shapes, with special emphasis on circular geometry. It is used to evaluate total perimeter and surface area for compound layouts built from linear segments and circular arcs. This forms the absolute baseline for more complex three-dimensional spatial analysis.

## Key formulas

$$
C = 2\pi r = \pi d
$$

$$
A = \pi r^2
$$

$$
A_{\text{trapezium}} = \frac{1}{2}(a+b)h
$$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 220 220" width="220" height="220" role="img" aria-label="Circle radius and diameter">
      <circle cx="110" cy="110" r="70" fill="#fdfbf7" stroke="#5b8def" stroke-width="2"/>
      <line x1="110" y1="110" x2="180" y2="110" stroke="#b59a73" stroke-width="2"/>
      <text x="145" y="100" font-size="11" fill="#b59a73">r</text>
      <line x1="40" y1="110" x2="180" y2="110" stroke="#a8a29e" stroke-dasharray="4 3"/>
      <text x="110" y="195" text-anchor="middle" font-size="10" fill="#a8a29e">diameter = 2r</text>
    </svg><p class="enlight-physics-diagram__caption">Circle — radius $r$ from centre to edge; diameter = $2r$; circumference = $2\pi r$; area = $\pi r^2$.</p></div>

## Steps / method

Finding Perimeter of Compound Circular Shapes Dissect the compound boundary into distinct straight-line paths and curved boundaries.

Compute the circular component by finding the circumference of the full circle and multiplying it by the fraction of the revolution it represents.

Sum all individual external paths together.

Ensure internal dividing lines are strictly excluded from the perimeter calculation.

Finding Areas of Shaded Regions Identify the overarching external geometric boundary (e.g., a rectangle or large circle).

Calculate the area of the unshaded internal regions using standard area formulas.

Subtract the internal unshaded area from the outer surrounding area to yield the remaining shaded coverage.

## Examiner tip

When calculating the perimeter of a semi-circle, students routinely calculate only $\pi r$ and forget to add the diameter ($2r$) to close the shape. Read carefully to see if the question asks for the "length of the curved arc" or the "total perimeter of the shape".

## Quick check

If the radius of a circle is doubled, its perimeter doubles but its area quadruples.

## Worked examples

May 2020 Paper 21 Q18: The diagram shows a semicircle with a diameter of $14\text{ cm}$. Calculate the total perimeter of this semicircle.

Step 1: Calculate the curved boundary length: $\text{Arc} = \frac{1}{2} \times \pi \times d = \frac{1}{2} \times \pi \times 14 = 7\pi \approx 21.99\text{ cm}$.

Step 2: Identify the linear base component, which is the diameter: $14\text{ cm}$.

Step 3: Sum the components: $\text{Total Perimeter} = 21.99 + 14 = 35.99\text{ cm}$ (or $36.0\text{ cm}$ to 3 significant figures).

November 2021 Paper 42 Q5b: A square of side length $10\text{ cm}$ contains four identical quarter-circle corners, each of radius $3\text{ cm}$. Calculate the unshaded area remaining in the center of the square.

Step 1: Calculate the total area of the square: $A_{\text{square}} = 10 \times 10 = 100\text{ cm}^2$.

Step 2: Combine the four quarter-circles into one complete circle of radius $3\text{ cm}$: $A_{\text{circle}} = \pi \times 3^2 = 9\pi \approx 28.27\text{ cm}^2$.

Step 3: Subtract the circle area from the square area: $A_{\text{unshaded}} = 100 - 28.27 = 71.73\text{ cm}^2$, which rounds to $71.7\text{ cm}^2$.
