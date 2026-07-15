## Core idea

Three-dimensional trigonometry extends 2D Pythagoras' theorem and right-angled trigonometric ratios to calculate lengths and angles across 3D shapes. This involves identifying right-angled triangles that span across different planes of a solid shape, such as diagonals inside cuboids, sloped faces on pyramids, or lines inside cones. Use these techniques to analyze structural framing, calculate roof pitches, and solve spatial design problems.

## Key formulas

$$
\text{Space diagonal of cuboid:} \quad D = \sqrt{x^2 + y^2 + z^2}
$$

$$
\text{Angle of elevation of a line:} \quad \tan\alpha = \frac{\text{vertical height}}{\text{horizontal base length}}
$$

## Graphs & diagrams

<div class="ace-physics-diagram"><svg viewBox="0 0 340 250" width="340" height="250" role="img" aria-label="Cuboid with base diagonal and space diagonal">
      <polygon points="110,50 240,50 240,140 110,140" fill="#fdfbf7" stroke="#a8a29e" stroke-width="1.5"/>
      <polygon points="40,100 110,50 110,140 40,190" fill="#f5edd8" stroke="#5b8def" stroke-width="1.5"/>
      <polygon points="40,190 110,140 240,140 170,190" fill="#eef2ff" stroke="#5b8def" stroke-width="1.5"/>
      <line x1="40" y1="100" x2="170" y2="100" stroke="#5b8def" stroke-width="1.5"/>
      <line x1="170" y1="100" x2="240" y2="50" stroke="#5b8def" stroke-width="1.5"/>
      <line x1="170" y1="100" x2="170" y2="190" stroke="#5b8def" stroke-width="1.5"/>
      <!-- base diagonal d -->
      <line x1="40" y1="190" x2="240" y2="140" stroke="#789671" stroke-width="2" stroke-dasharray="5 3"/>
      <text x="100" y="178" font-size="13" fill="#789671" font-weight="700">d</text>
      <!-- space diagonal D -->
      <line x1="40" y1="190" x2="240" y2="50" stroke="#b59a73" stroke-width="2.5"/>
      <text x="155" y="100" font-size="14" fill="#b59a73" font-weight="700">D</text>
      <!-- height h -->
      <line x1="240" y1="50" x2="240" y2="140" stroke="#5b8def" stroke-width="2"/>
      <text x="252" y="100" font-size="13" fill="#5b8def" font-weight="700">h</text>
      <!-- right angle at back-right-bottom between d and h -->
      <path d="M240 128 L228 131 L228 143" fill="none" stroke="#b59a73" stroke-width="2"/>
      <text x="95" y="208" font-size="12" fill="#5b8def" font-weight="600">x</text>
      <text x="185" y="172" font-size="12" fill="#5b8def" font-weight="600">y</text>
    </svg><p class="ace-physics-diagram__caption">Cuboid space diagonal — find the base diagonal $d$ first, then the space diagonal $D$ in the vertical right triangle: $d = \sqrt{x^2+y^2}$, $D = \sqrt{d^2+h^2}$.</p></div>

<div class="ace-physics-diagram"><svg viewBox="0 0 380 300" width="380" height="300" role="img" aria-label="Square pyramid with right triangle VMA highlighted">
      <polygon points="60,175 160,220 300,175 200,130" fill="#f8fafc" stroke="#e8e2d8" stroke-width="1.5"/>
      <line x1="180" y1="36" x2="60" y2="175" stroke="#e8e2d8" stroke-width="1.5"/>
      <line x1="180" y1="36" x2="300" y2="175" stroke="#e8e2d8" stroke-width="1.5"/>
      <line x1="180" y1="36" x2="200" y2="130" stroke="#e8e2d8" stroke-width="1.5" stroke-dasharray="4 3"/>
      <polygon points="180,36 180,175 270,215" fill="#f5edd8" fill-opacity="0.55" stroke="none"/>
      <line x1="180" y1="36" x2="180" y2="175" stroke="#5b8def" stroke-width="2.5"/>
      <line x1="180" y1="175" x2="270" y2="215" stroke="#789671" stroke-width="2.5"/>
      <line x1="180" y1="36" x2="270" y2="215" stroke="#b59a73" stroke-width="2.5"/>
      <path d="M180 163 L191 168 L191 180" fill="none" stroke="#5b8def" stroke-width="2"/>
      <circle cx="180" cy="36" r="4" fill="#a8a29e"/>
      <circle cx="180" cy="175" r="4" fill="#a8a29e"/>
      <circle cx="270" cy="215" r="4" fill="#a8a29e"/>
      <text x="192" y="30" font-size="15" fill="#6b6b6b" font-weight="700">V</text>
      <text x="152" y="180" font-size="15" fill="#6b6b6b" font-weight="700">M</text>
      <text x="280" y="232" font-size="15" fill="#6b6b6b" font-weight="700">A</text>
      <text x="148" y="110" font-size="15" fill="#5b8def" font-weight="700">h</text>
      <text x="218" y="206" font-size="14" fill="#789671" font-weight="700">MA</text>
      <text x="238" y="100" font-size="15" fill="#b59a73" font-weight="700">VA</text>
      <path d="M248 205 A24 24 0 0 0 259 194" fill="none" stroke="#b59a73" stroke-width="2"/>
      <text x="270" y="186" font-size="15" fill="#b59a73" font-weight="700">α</text>
      <text x="190" y="280" text-anchor="middle" font-size="12" fill="#6b6b6b">Shaded = right triangle VMA used for lengths and angles</text>
    </svg><p class="ace-physics-diagram__caption">Square pyramid — work in right triangle $VMA$: height $h = VM$, base half-diagonal $MA$, sloping edge $VA = \sqrt{h^2+MA^2}$, elevation $\tan\alpha = h/MA$.</p></div>

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

A pyramid has a square horizontal base $ABCD$ of side $10\text{ cm}$.

The apex $V$ is vertically above the centre $M$ of the base, with $VM = 12\text{ cm}$. Calculate the length of the sloping edge $VA$.

To find the sloping edge $VA$, use triangle $VMA$ with $VM = 12\text{ cm}$, but the base length $MA$ is unknown.

Find $MA$: $M$ is the centre of square $ABCD$, so $MA$ is half of the base diagonal $AC$.

Calculate the full base diagonal $AC = \sqrt{10^2 + 10^2} = 10\sqrt{2}$, so $MA = 5\sqrt{2} \approx 7.071\text{ cm}$.

Now apply Pythagoras' theorem to the vertical internal triangle $VMA$: $VA = \sqrt{VM^2 + MA^2} = \sqrt{12^2 + (7.071)^2} = \sqrt{144 + 50} = \sqrt{194}$.

Calculate the final length and round to $3$ significant figures: $VA \approx 13.9\text{ cm}$.

## Worked example — Example 2 (Nov 2023 P41 Q7)

Using the same pyramid from Example 1, calculate the angle of inclination of the sloping edge $VA$ to the base $ABCD$.

Identify the target angle: it is the angle $\angle VAM$ in triangle $VMA$.

Label the known sides of triangle $VMA$: opposite to $\angle VAM$ is $VM = 12\text{ cm}$, and the adjacent side along the base is $MA = 7.071\text{ cm}$.

Select the correct trigonometric ratio: Tangent (TOA) links the opposite and adjacent sides.

Set up the trigonometric equation: $\tan(\angle VAM) = \frac{12}{7.071}$.

Use the inverse tangent function to calculate the angle: $\angle VAM = \tan^{-1}\left(\frac{12}{7.071}\right)$.

Calculate the value and round to exactly $1$ decimal place: $\angle VAM \approx \tan^{-1}(1.697) = 59.5^\circ$.
