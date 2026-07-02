## Core idea

Transformations shift, rotate, reflect, or scale geometric shapes across a coordinate grid. Reflections flip a shape over a mirror line, rotations turn a shape around a center point, translations slide a shape using a column vector, and enlargements change a shape's size from a center of enlargement using a scale factor. Use these operations to map a starting shape (object) onto its new position (image) and to analyze geometric patterns.

## Key formulas

$$
\text{Translation Operation Mapping:} \quad \text{Image Coordinate} = \text{Object Coordinate} + \begin{pmatrix} x \ y \end{pmatrix}

\text{Enlargement Dimension Rule:} \quad \text{New Edge Length} = \text{Original Edge Length} \times |\text{Scale Factor } k|

\text{Negative Scale Factor Effect:} \quad \text{The image is inverted and projected onto the opposite side of the center}
$$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 240 240" width="240" height="240" role="img" aria-label="Reflection in a line">
      <line x1="120" y1="20" x2="120" y2="220" stroke="#64748b" stroke-dasharray="6 4"/>
      <polygon points="160,60 200,60 200,100" fill="#dbeafe" stroke="#2563eb"/>
      <polygon points="80,60 40,60 40,100" fill="#fef3c7" stroke="#d97706" stroke-dasharray="4 3"/>
      <text x="120" y="15" text-anchor="middle" font-size="10" fill="#64748b">mirror line</text>
    </svg></div>

Reflection — each point and its image are equidistant from the mirror line.

## Steps / method

For a translation, slide every vertex corner of the object shape by the exact horizontal and vertical steps specified by the column vector.

For a reflection, measure the perpendicular distance from each vertex of the object to the given mirror line, and plot the corresponding image vertices at that same distance on the opposite side of the line.

For a rotation, use tracing paper to trace the object shape, place your pencil point on the specified center of rotation, turn the paper by the required angle and direction (clockwise or anticlockwise), and plot the new position.

For an enlargement, draw straight lines from the center of enlargement through each vertex of the object.

Measure these distances, multiply them by the scale factor $k$, and plot the new vertices along those lines from the center.

## Examiner tip

When describing a transformation fully on Paper 4, you must state only one type of transformation. If you describe a shift as a "reflection and then a translation," you will automatically score zero marks for the entire question. State the single transformation name clearly followed by its required descriptors (e.g., center and angle for a rotation, or mirror line for a reflection).

## Quick check

An enlargement with a fractional scale factor like $k = \frac{1}{2}$ reduces the size of the shape, making the image smaller than the original object.

[Image showing a single triangle undergo translation, reflection, rotation, and enlargement simultaneously]

## Worked example — Example 1 (June 2022 P42 Q2a)

Triangle $A$. $(1,1)$, $(3,1)$, and $(1,4)$. Describe fully the single transformation that maps Triangle $A$ and $B. (-1,1)$, $(-3,1)$, and $(-1,4)$.

Analyze the movement: the shape has flipped horizontally across the vertical y-axis, but its size and orientation remain otherwise unchanged.

Identify the transformation type: this flip represents a reflection.

Locate the mirror line: the line lying exactly halfway between the object and image vertices is the vertical y-axis. State the equation of this mirror line: $x = 0$.

Combine these details into a single, complete sentence: "Reflection in the line $x = 0$."

## Worked example — Example 2 (Nov 2023 P41 Q3b)

Object Triangle $T$ and $U. -2$ centered at the origin $(0,0)$. Given an object vertex sits at $(2, 1)$, calculate the coordinate position of its corresponding image vertex.

Identify the center of enlargement: the origin $(0,0)$. This means distances can be calculated directly from coordinate values.

Identify the scale factor: $k = -2$.

Multiply both the x and y values of the object coordinate by the scale factor to apply the enlargement relative to the origin:$x_{\text{Image}} = 2 \times (-2) = -4

$$
y_{\text{Image}} = 1 \times (-2) = -2
$$

State the final coordinate point of the transformed image vertex: $(-4, -2)$.
