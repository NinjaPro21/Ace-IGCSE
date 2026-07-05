## Core idea

Transformations shift, rotate, reflect, or scale geometric shapes across a coordinate grid. Reflections flip a shape over a mirror line, rotations turn a shape around a center point, translations slide a shape using a column vector, and enlargements change a shape's size from a center of enlargement using a scale factor. Use these operations to map a starting shape (object) onto its new position (image) and to analyze geometric patterns.

## Key formulas

$$
\text{Translation Operation Mapping:} \quad \text{Image Coordinate} = \text{Object Coordinate} + \begin{pmatrix} x \ \\ y \end{pmatrix}
$$
$$
\text{Enlargement Dimension Rule:} \quad \text{New Edge Length} = \text{Original Edge Length} \times |\text{Scale Factor } k|
$$
$$
\text{Negative Scale Factor Effect:} \quad \text{The image is inverted and projected onto the opposite side of the center}
$$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 280 220" width="280" height="220" role="img" aria-label="Translation by a vector"><line x1="20" y1="180" x2="260" y2="180" stroke="#e8e2d8"/><line x1="40" y1="20" x2="40" y2="200" stroke="#e8e2d8"/><polygon points="60,140 100,140 100,100" fill="#f5edd8" stroke="#5b8def" stroke-width="2"/><polygon points="150,90 190,90 190,50" fill="#fdfbf7" stroke="#b59a73" stroke-width="2" stroke-dasharray="5 3"/><line x1="80" y1="120" x2="170" y2="70" stroke="#b59a73" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#tr-arr)"/><text x="55" y="160" font-size="10" fill="#5b8def">object</text><text x="195" y="55" font-size="10" fill="#b59a73">image</text><text x="118" y="72" text-anchor="middle" font-size="11" fill="#b59a73" font-weight="600">(+3, +2)</text><defs><marker id="tr-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#b59a73"/></marker></defs></svg><p class="enlight-physics-diagram__caption">Translation — every point slides by the same column vector $\begin{pmatrix} x \\ y \end{pmatrix}$.</p></div>

<div class="enlight-physics-diagram"><svg viewBox="0 0 240 240" width="240" height="240" role="img" aria-label="Reflection in a line">
      <line x1="120" y1="20" x2="120" y2="220" stroke="#a8a29e" stroke-dasharray="6 4"/>
      <polygon points="160,60 200,60 200,100" fill="#f5edd8" stroke="#5b8def"/>
      <polygon points="80,60 40,60 40,100" fill="#fdfbf7" stroke="#b59a73" stroke-dasharray="4 3"/>
      <text x="120" y="15" text-anchor="middle" font-size="10" fill="#a8a29e">mirror line</text>
    </svg><p class="enlight-physics-diagram__caption">Reflection — each point and its image are equidistant from the mirror line.</p></div>

<div class="enlight-physics-diagram"><svg viewBox="0 0 280 260" width="280" height="260" role="img" aria-label="Rotation about a centre">
      <line x1="20" y1="140" x2="260" y2="140" stroke="#e8e2d8"/>
      <line x1="140" y1="20" x2="140" y2="240" stroke="#e8e2d8"/>
      <polygon points="170,90 210,90 210,130" fill="#f5edd8" stroke="#5b8def" stroke-width="2"/>
      <polygon points="90,110 90,70 130,70" fill="#fdfbf7" stroke="#b59a73" stroke-width="2" stroke-dasharray="5 3"/>
      <circle cx="140" cy="140" r="5" fill="#b59a73"/>
      <text x="148" y="135" font-size="12" fill="#b59a73" font-weight="600">O</text>
      <path d="M185 110 A40 40 0 0 0 110 95" fill="none" stroke="#b59a73" stroke-width="1.5" marker-end="url(#rot-arr)"/>
      <text x="100" y="125" font-size="11" fill="#b59a73" font-weight="600">90°</text>
      <text x="215" y="85" font-size="10" fill="#5b8def">object</text>
      <text x="55" y="60" font-size="10" fill="#b59a73">image</text>
      <defs><marker id="rot-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#b59a73"/></marker></defs>
    </svg><p class="enlight-physics-diagram__caption">Rotation — turn every point about the centre by the given angle and direction (here $90°$ anticlockwise about $O$).</p></div>

<div class="enlight-physics-diagram"><svg viewBox="0 0 280 240" width="280" height="240" role="img" aria-label="Enlargement from a centre">
      <circle cx="60" cy="180" r="5" fill="#b59a73"/>
      <text x="48" y="175" font-size="12" fill="#b59a73" font-weight="600">O</text>
      <polygon points="110,150 150,150 150,110" fill="#f5edd8" stroke="#5b8def" stroke-width="2"/>
      <polygon points="160,120 240,120 240,40" fill="#fdfbf7" stroke="#b59a73" stroke-width="2" stroke-dasharray="5 3"/>
      <line x1="60" y1="180" x2="240" y2="40" stroke="#e8e2d8" stroke-dasharray="4 3"/>
      <line x1="60" y1="180" x2="240" y2="120" stroke="#e8e2d8" stroke-dasharray="4 3"/>
      <line x1="60" y1="180" x2="160" y2="120" stroke="#e8e2d8" stroke-dasharray="4 3"/>
      <text x="115" y="165" font-size="10" fill="#5b8def">object</text>
      <text x="245" y="35" font-size="10" fill="#b59a73">image (k = 2)</text>
    </svg><p class="enlight-physics-diagram__caption">Enlargement — rays from the centre through each vertex; distances multiply by scale factor $k$.</p></div>

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

Multiply both the x and y values of the object coordinate by the scale factor to apply the enlargement relative to the origin: $x_{\text{Image}} = 2 \times (-2) = -4$

$$
y_{\text{Image}} = 1 \times (-2) = -2
$$

State the final coordinate point of the transformed image vertex: $(-4, -2)$.
