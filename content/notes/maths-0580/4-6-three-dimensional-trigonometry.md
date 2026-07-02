## Core idea

Three-dimensional trigonometry extends 2D Pythagoras' theorem and right-angled trigonometric ratios to calculate lengths and angles across 3D shapes. This involves identifying right-angled triangles that span across different planes of a solid shape, such as diagonals inside cuboids, sloped faces on pyramids, or lines inside cones. Use these techniques to analyze structural framing, calculate roof pitches, and solve spatial design problems.

## Key formulas

$$
\text{Space Diagonal of Cuboid:} \quad D = \sqrt{x^2 + y^2 + z^2}

\text{Plane Incline Tangent Pitch Formula:} \quad \tan(\alpha) = \frac{\text{Vertical Height}}{\text{Base Horizontal Diagonal Length}}
$$

## Graphs & diagrams

Right-angled triangle — $c$ is the hypotenuse (longest side, opposite the $90°$ angle). Use $a^2 + b^2 = c^2$.

SOH CAH TOA — label opposite, adjacent, and hypotenuse relative to angle $\theta$.

<div class="enlight-physics-diagram"><svg viewBox="0 0 280 200" width="280" height="200" role="img" aria-label="Right triangle for Pythagoras">
      <polygon points="40,160 220,160 40,40" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <rect x="40" y="145" width="15" height="15" fill="none" stroke="#64748b"/>
      <text x="130" y="178" text-anchor="middle" font-size="12" fill="#2563eb">a</text>
      <text x="25" y="105" text-anchor="middle" font-size="12" fill="#2563eb">b</text>
      <text x="145" y="95" font-size="12" fill="#dc2626" font-weight="600">c (hyp)</text>
    </svg></div>

Right-angled triangle — $c$ is the hypotenuse (longest side, opposite the $90°$ angle). Use $a^2 + b^2 = c^2$.

<div class="enlight-physics-diagram"><svg viewBox="0 0 300 200" width="300" height="200" role="img" aria-label="Trigonometry triangle labels">
      <polygon points="50,170 250,170 50,50" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <rect x="50" y="155" width="15" height="15" fill="none" stroke="#64748b"/>
      <path d="M70 170 A20 20 0 0 0 85 155" fill="none" stroke="#dc2626"/>
      <text x="78" y="162" font-size="11" fill="#dc2626">θ</text>
      <text x="150" y="188" font-size="11" fill="#2563eb">adjacent</text>
      <text x="28" y="120" font-size="11" fill="#16a34a">opposite</text>
      <text x="170" y="100" font-size="11" fill="#7c3aed" font-weight="600">hypotenuse</text>
    </svg></div>

SOH CAH TOA — label opposite, adjacent, and hypotenuse relative to angle $\theta$.

## Steps / method

Visualize the 3D solid layout and identify the target length or angle you need to find.

Draw a flat, 2D sketch of the right-angled triangle that contains your target dimension, tracing it carefully from the 3D shape.

If the triangle contains too many unknowns, look for a second triangle—often on the flat base of the shape—to calculate a shared connecting length first.

Apply Pythagoras' theorem or SOH CAH TOA to this base triangle to find the missing connecting length.

Substitute this calculated length into your vertical target triangle, and apply trigonometry to find the final 3D angle or length.

## Examiner tip

When calculating angles between a sloping line and a flat base plane on Paper 4, the angle must be measured relative to the line's projection on that base. For a pyramid, this means you must use the diagonal line running along the base to the center point directly beneath the apex, not one of the outer base edges.

## Quick check

To find an angle or length that cuts through the inside of a 3D solid, you must construct an internal right-angled triangle that connects the horizontal base plane to the vertical height axis.

## Worked example — Example 1 (June 2021 P42 Q8)

A pyramid has a square horizontal base $ABCD$. $10\text{ cm}$.

The apex $V$ and $M. VM$. $12\text{ cm}$. Calculate the length of the sloping edge $VA$.

To find the sloping edge $VA$. $VMA. VM = 12\text{ cm}$, but the base length $MA$ is unknown.

Find $MA$. $ABCD. M$. $AC$.

Calculate the full base diagonal $AC$. So $AC = \sqrt{10^{2} + 10^{2}} = \sqrt{200} \approx 14.142\text{ cm}$.

Find the length of $MA$. So $MA = \frac{14.142}{2} = 7.071\text{ cm}$.

Now, apply Pythagoras' theorem to the vertical internal triangle $VMA$. $VA. VA = \sqrt{VM^2 + MA^2} = \sqrt{12^2 + (7.071)^2} = \sqrt{144 + 50} = \sqrt{194}$.

Calculate the final length and round to $3$ significant figures: $VA \approx 13.9\text{ cm}$.

## Worked example — Example 2 (Nov 2023 P41 Q7)

Using the same pyramid from Example 1, calculate the angle of inclination that the sloping face edge $VA$. $ABCD$.

Identify the target angle: it is the angle $\angle VAM$. $VMA$.

Label the known sides of triangle $VMA$. $\angle VAM. VM = 12\text{ cm}$, and the Adjacent side along the base is $MA = 7.071\text{ cm}$.

Select the correct trigonometric ratio: Tangent ($\text{TOA}$) links the Opposite and Adjacent sides.

Set up the trigonometric equation: $\tan(\angle VAM) = \frac{12}{7.071}$.

Use the inverse tangent function to calculate the angle: $\angle VAM = \tan^{-1}\left(\frac{12}{7.071}\right)$.

Calculate the value and round to exactly $1$ decimal place: $\angle VAM \approx \tan^{-1}(1.697) = 59.5^\circ$.
