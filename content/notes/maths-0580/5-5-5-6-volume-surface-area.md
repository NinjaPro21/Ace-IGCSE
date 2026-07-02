## Core idea

This framework extends geometry into three dimensions, managing the internal capacity (volume) and outer boundary space (total surface area) of curved shapes, prisms, and pyramid-type solids. It is applied when calculating container limits, manufacturing material demands, or broken-down composite industrial structures.

## Key formulas

$V_{\text{cylinder}} = \pi r^2 h \quad \text{|} \quad \text{TSA}_{\text{cylinder}} = 2\pi r^2 + 2\pi r h$

$V_{\text{cone}} = \frac{1}{3}\pi r^2 h \quad \text{|} \quad \text{CSA}_{\text{cone}} = \pi r l \quad \text{where } l = \sqrt{r^2 + h^2}$

$V_{\text{sphere}} = \frac{1}{4/3}\pi r^3 \quad \text{|} \quad \text{Surface Area}_{\text{sphere}} = 4\pi r^2$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 280 200" width="280" height="200" role="img" aria-label="Cuboid dimensions">
      <polygon points="60,120 160,120 200,80 100,80" fill="#dbeafe" stroke="#2563eb"/>
      <polygon points="60,120 60,60 100,20 100,80" fill="#bfdbfe" stroke="#2563eb"/>
      <polygon points="100,80 100,20 200,20 200,80" fill="#93c5fd" stroke="#2563eb"/>
      <text x="130" y="135" font-size="10" fill="#2563eb">length</text>
      <text x="45" y="95" font-size="10" fill="#2563eb">h</text>
      <text x="150" y="55" font-size="10" fill="#2563eb">width</text>
    </svg></div>

Cuboid — volume = length × width × height; surface area = sum of areas of all six faces.

## Steps / method

Finding Total Surface Area of a Closed Cone Check if the question provides the true vertical height $h$ and $l$.

If given vertical height $h$. So $l = \sqrt{r^2 + h^2}$) to determine the slant height.

Calculate the curved surface area using $\text{CSA} = \pi r l$.

Compute the area of the circular base ($\pi r^2$) and add it to the curved surface area.

For open cones, skip this step.

Handling Composite Volumetric Solids (e.g., Cylinder + Hemisphere) Split the compound solid into its clean fundamental three-dimensional components.

Calculate each component volume independently using their respective formulas (e.g., $V_{\text{cylinder}} = \pi r^2 h$. So $V_{\text{hemisphere}} = \frac{2}{3}\pi r^3$).

Sum the values together.

When dealing with surface area, make sure you subtract any interior faces that are touching, as they are no longer exposed on the outside.

## Examiner tip

Be careful not to mix up the vertical height ($h$ and $l. h$ and $l$). If you use the wrong height value, the calculation breaks.

## Quick check

A hemisphere has exactly half the volume of a full sphere, but its total surface area includes its flat circular base, making it $3\pi r^2$.

## Worked examples

May 2021 Paper 41 Q8b: A solid metal cylinder has a radius of $3.5\text{ cm}$ and a height of $12\text{ cm}$. Calculate its total surface area. Step 1: Identify parameters: $r = 3.5$, $h = 12$.

Step 2: Write out the full equation for a closed cylinder: $\text{TSA} = 2\pi(3.5)^2 + 2\pi(3.5)(12)$.

Step 3: Calculate each part: $\text{TSA} = 24.5\pi + 84\pi = 108.5\pi \approx 340.86\text{ cm}^2$. Rounds to $341\text{ cm}^2$.

November 2022 Paper 42 Q7c: A solid cone has a radius of $6\text{ cm}$ and a perpendicular height of $8\text{ cm}$. Calculate its curved surface area.

Step 1: Find the missing slant height $l$. So $l = \sqrt{6^2 + 8^2} = \sqrt{100} = 10\text{ cm}$.

Step 2: Use the curved surface area formula: $\text{CSA} = \pi \times r \times l = \pi \times 6 \times 10$.

Step 3: Compute the final answer: $\text{CSA} = 60\pi \approx 188.49\text{ cm}^2$. Rounds to $188\text{ cm}^2$.
