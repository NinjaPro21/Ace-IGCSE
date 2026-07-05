## Core idea

Similarity applies when shapes share identical interior angles but are scaled up or down in size. It lets us calculate missing parameters by linking length linear scales ($k$), area scales ($k^2$), and total volumetric capacities ($k^3$). This is crucial for interpreting architectural scales, dynamic map models, or industrial scaling problems.

## Key formulas

$$
\frac{A_1}{A_2} = \left(\frac{l_1}{l_2}\right)^2 = k^2
$$

$$
\frac{V_1}{V_2} = \left(\frac{l_1}{l_2}\right)^3 = k^3
$$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 320 180" width="320" height="180" role="img" aria-label="Similar triangles">
      <polygon points="40,150 120,150 40,70" fill="#f5edd8" stroke="#5b8def" stroke-width="2"/>
      <polygon points="180,150 300,150 180,30" fill="#fdfbf7" stroke="#b59a73" stroke-width="2"/>
      <text x="70" y="165" font-size="10" fill="#5b8def">small</text>
      <text x="230" y="165" font-size="10" fill="#b59a73">large (×k)</text>
    </svg><p class="enlight-physics-diagram__caption">Similar triangles — corresponding angles equal; lengths in ratio $k : 1$; areas in ratio $k^2 : 1$.</p></div>

## Steps / method

Finding a Missing Volumetric Capacity via Small Dimensions Locate a pair of corresponding matching lengths across both objects ($l_1$ and $l_2$).

Divide the larger length by the smaller length to find the linear scale factor: $k = \frac{l_{\text{large}}}{l_{\text{small}}}$.

Cube this linear scale factor to get the volume scale factor ($k^3$).

Multiply the smaller volume by $k^3$ to find the larger volume.

Working Backward from Area to Length.

Write down the known area ratio: $\frac{A_1}{A_2}$.

Take the square root of the area ratio to find the base linear scaling factor: $k = \sqrt{\frac{A_1}{A_2}}$.

Apply this linear factor to find your missing length or extend it into a volume calculation by cubing it.

## Examiner tip

Examiners like to present questions where the areas or volumes of two similar containers are given, and you need to find a missing height. A classic mistake is using the raw area or volume ratio directly on the length. Remember: you must square root an area ratio or cube root a volume ratio before using it to find a length.

## Quick check

If the surface area of a similar solid expands by a factor of $9$, then its volume expands by a factor of $27$.

## Worked examples

May 2021 Paper 21 Q11: Two mathematically similar water bottles have heights of $15\text{ cm}$ and $25\text{ cm}$. The smaller bottle holds $324\text{ ml}$ of water. Calculate the capacity of the larger bottle.

Step 1: Find the linear scale factor: $k = \frac{25}{15} = \frac{5}{3}$.

Step 2: Determine the volume scale factor: $k^3 = \left(\frac{5}{3}\right)^3 = \frac{125}{27}$.

Step 3: Multiply by the smaller volume: $\text{Volume}_{\text{large}} = 324 \times \frac{125}{27} = 12 \times 125 = 1500\text{ ml}$.

November 2020 Paper 42 Q4c: Two similar cones have surface areas of $40\text{ cm}^2$ and $90\text{ cm}^2$. If the height of the smaller cone is $12\text{ cm}$, find the height of the larger cone.

Step 1: Set up the area ratio: $\frac{A_{\text{large}}}{A_{\text{small}}} = \frac{90}{40} = 2.25$.

Step 2: Convert to a linear scale factor by taking the square root: $k = \sqrt{2.25} = 1.5$.

Step 3: Multiply the smaller height by the linear factor: $\text{Height}_{\text{large}} = 12 \times 1.5 = 18\text{ cm}$.
