## Core idea

A net is a flat, 2D layout of polygons that can be folded along its edges to form a 3D solid shape. Analyzing nets involves matching the faces, edges, and corners of a 2D layout to their corresponding positions on the completed 3D structure. Use nets to visualize 3D shapes, verify packaging designs, and calculate the total surface area of complex geometric solids.

## Key formulas

$$
\text{Total Surface Area of Solid} = \sum (\text{Individual Areas of all Polygon Faces in the Net})
$$

$$
\text{Euler's Polyhedral Characteristic Link:} \quad \text{Faces} + \text{Vertices} = \text{Edges} + 2
$$

## Graphs & diagrams

<div class="ace-physics-diagram"><svg viewBox="0 0 240 200" width="240" height="200" role="img" aria-label="Cube net">
      <rect x="80" y="20" width="50" height="50" fill="#f5edd8" stroke="#5b8def"/>
      <rect x="80" y="70" width="50" height="50" fill="#f5edd8" stroke="#5b8def"/>
      <rect x="30" y="70" width="50" height="50" fill="#f5edd8" stroke="#5b8def"/>
      <rect x="130" y="70" width="50" height="50" fill="#f5edd8" stroke="#5b8def"/>
      <rect x="80" y="120" width="50" height="50" fill="#f5edd8" stroke="#5b8def"/>
      <rect x="80" y="170" width="50" height="50" fill="#f5edd8" stroke="#5b8def"/>
    </svg><p class="ace-physics-diagram__caption">Net of a cube — six squares fold into a cube; opposite faces never share an edge in the net.</p></div>

## Steps / method

Count the total number of faces on the 3D solid, and verify that the 2D net layout contains the exact same number of matching polygon shapes.

Identify which edges will meet when the net is folded to ensure the dimensions of touching sides match perfectly.

To calculate the total surface area, split the net into its separate polygon shapes (such as triangles, rectangles, or circles).

Calculate the area of each individual shape using standard 2D area formulas, and add them together to find the total surface area of the solid.

## Examiner tip

When drawing a net on Paper 2, use a sharp pencil and a ruler to ensure your dimensions match the requested scale exactly. A common mistake is drawing faces that fold against each other with unequal edge lengths. For example, if a triangular prism face has a side length of $5\text{ cm}$, the corresponding rectangular face edge that attaches to it must al so measure exactly $5\text{ cm}$.

## Quick check

If a 2D net layout is folded into a closed 3D solid cube, it must contain exactly six square faces arranged so that no faces overlap.

[Image showing a 3D triangular prism opening up into its flat 2D net layout]

## Worked example — Example 1 (June 2021 P21 Q5)

State the name of the 3D solid shape that is formed by folding a net consisting of one central square face attached to four identical isosceles triangles around its edges.

Count and classify the faces in the net: there is $1$ square face and $4$ triangular faces.

Visualize folding the four triangles upward from the square base so their top vertices meet at a single point.

Identify the resulting 3D structure: a solid pyramid with a square base. State the formal geometric name: a square-based pyramid.

## Worked example — Example 2 (Nov 2022 P42 Q6b)

A closed cuboid measures $5\text{ cm}$ by $4\text{ cm}$ by $3\text{ cm}$. Draw its net layout and use it to calculate the total surface area of the cuboid.

Identify the faces needed for a cuboid net: it requires three pairs of matching rectangles, making six faces in total.

Calculate the surface areas of the three distinct pairs of rectangular faces:

$$
\text{Area}_{\text{Pair 1}} = 2 \times (5\text{ cm} \times 4\text{ cm}) = 40\text{ cm}^2
$$

$$
\text{Area}_{\text{Pair 2}} = 2 \times (5\text{ cm} \times 3\text{ cm}) = 30\text{ cm}^2
$$

$$
\text{Area}_{\text{Pair 3}} = 2 \times (4\text{ cm} \times 3\text{ cm}) = 24\text{ cm}^2
$$

Sum these face areas together to calculate the total surface area: $\text{Total Surface Area} = 40 + 30 + 24 = 94\text{ cm}^2$.
