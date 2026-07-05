## Core idea

Whether you are analyzing a sprinter's performance or a car's emergency stop, motion graphs provide a visual story of how an object moves over time. Mastering these graphs is essential for IGCSE Physics because they allow you to "see" speed and acceleration and provide a reliable way to calculate the total distance travelled during complex journeys.

## Key definitions

- **Gradient**: The steepness of a slope on a graph, calculated as the "rise" divided by the "run".
- **Distance-Time Graph**: A plot showing how the distance of an object from a starting point changes over time.
- **Speed-Time Graph**: A plot showing how the speed of an object changes over time.
- **Uniform Acceleration**: When the velocity of an object increases by the same amount every second, resulting in a straight line on a speed-time graph.
- **Deceleration**: The rate at which an object slows down (negative acceleration).
- **Area Under the Graph**: The geometric space between the plotted line and the time axis on a speed-time graph, representing distance.

## Key formulas

**Speed (from distance-time graph)**

$\text{Speed} = \text{gradient} = \frac{\Delta \text{distance}}{\Delta \text{time}}$

Applies to any straight-line section of a distance-time graph.

**Acceleration (from speed-time graph)**

$\text{Acceleration} = \text{gradient} = \frac{\Delta \text{speed}}{\Delta \text{time}} = \frac{v - u}{t}$

Applies to any straight-line section of a speed-time graph.

**Distance travelled (from speed-time graph)**

$\text{Distance} = \text{area under the graph}$

Use $\text{Area of rectangle} = l \times w$ and $\text{Area of triangle} = \frac{1}{2} \times b \times h$.

**Area of a trapezium**

$\text{Area} = \frac{1}{2} \times (\text{sum of parallel sides}) \times \text{height}$

Useful for calculating distance in a single step for multi-stage journeys.

## Graphs & diagrams

**Distance-Time Graphs**

- **At rest**: Flat line (gradient = 0) — speed is zero.
- **Constant speed**: Straight diagonal line — same speed throughout.
- **Increasing Speed (Acceleration)**: A curve like a **smile ☺** — getting steeper (speeding up).
- **Decelerating**: A curve like a **frown ☹** — getting flatter (slowing down).

<div class="enlight-physics-diagram"><svg viewBox="0 0 440 260" width="440" height="260" role="img" aria-label="Distance time graph with acceleration">
      <line x1="55" y1="215" x2="400" y2="215" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="215" x2="55" y2="25" stroke="#64748b" stroke-width="1.5"/>
      <text x="230" y="238" text-anchor="middle" font-size="12" fill="#475569">Time</text>
      <text x="20" y="120" transform="rotate(-90 20 120)" text-anchor="middle" font-size="12" fill="#475569">Distance</text>
      <polyline fill="none" stroke="#2563eb" stroke-width="2.5" points="65,195 120,160"/>
      <path d="M120 160 Q170 150 210 130 T290 70" fill="none" stroke="#2563eb" stroke-width="2.5"/>
      <polyline fill="none" stroke="#2563eb" stroke-width="2.5" points="290,70 370,70"/>
      <text x="90" y="178" font-size="10" fill="#2563eb">constant speed</text>
      <text x="200" y="115" font-size="10" fill="#dc2626">accelerating (curve)</text>
      <text x="330" y="62" font-size="10" fill="#64748b">at rest</text>
    </svg><p class="enlight-physics-diagram__caption">Distance–time graph — flat = at rest; straight slope = constant speed; curve getting steeper = accelerating.</p></div>

**Speed-Time Graphs**

- **Constant Speed**: A horizontal line (gradient = 0, acceleration = 0).
- **Uniform Acceleration**: A straight line sloping upwards.
- **Uniform Deceleration**: A straight line sloping downwards.
- **Non-Uniform Acceleration/Deceleration**: A curved line where the gradient changes.

<div class="enlight-physics-diagram"><svg viewBox="0 0 440 260" width="440" height="260" role="img" aria-label="Speed time graph">
      <line x1="55" y1="215" x2="400" y2="215" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="215" x2="55" y2="25" stroke="#64748b" stroke-width="1.5"/>
      <text x="230" y="238" text-anchor="middle" font-size="12" fill="#475569">Time</text>
      <text x="20" y="120" transform="rotate(-90 20 120)" text-anchor="middle" font-size="12" fill="#475569">Speed</text>
      <polygon fill="rgba(37,99,235,0.18)" stroke="none" points="65,215 65,195 140,90 220,90 300,90 370,170 370,215"/>
      <polyline fill="none" stroke="#16a34a" stroke-width="2.5" points="65,195 140,90 220,90 300,90 370,170"/>
      <text x="95" y="175" font-size="10" fill="#16a34a">acceleration</text>
      <text x="255" y="82" font-size="10" fill="#16a34a">constant speed</text>
      <text x="330" y="155" font-size="10" fill="#dc2626">deceleration</text>
      <text x="200" y="200" font-size="10" fill="#2563eb">area = distance</text>
    </svg><p class="enlight-physics-diagram__caption">Speed–time graph — upward slope = acceleration; flat = constant speed; downward slope = deceleration; shaded area = distance travelled.</p></div>

<div class="enlight-physics-diagram"><svg viewBox="0 0 440 260" width="440" height="260" role="img" aria-label="Velocity time graph">
      <line x1="55" y1="215" x2="400" y2="215" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="215" x2="55" y2="25" stroke="#64748b" stroke-width="1.5"/>
      <text x="230" y="238" text-anchor="middle" font-size="12" fill="#475569">Time</text>
      <text x="20" y="120" transform="rotate(-90 20 120)" text-anchor="middle" font-size="12" fill="#475569">Velocity</text>
      <polygon fill="rgba(124,58,237,0.18)" stroke="none" points="65,215 65,195 140,80 220,80 300,80 370,165 370,215"/>
      <polyline fill="none" stroke="#7c3aed" stroke-width="2.5" points="65,195 140,80 220,80 300,80 370,165"/>
      <text x="95" y="175" font-size="10" fill="#7c3aed">+ acceleration</text>
      <text x="255" y="72" font-size="10" fill="#7c3aed">constant velocity</text>
      <text x="330" y="150" font-size="10" fill="#dc2626">− deceleration</text>
      <text x="200" y="200" font-size="10" fill="#7c3aed">area = displacement</text>
    </svg><p class="enlight-physics-diagram__caption">Velocity–time graph — gradient = acceleration; shaded area under the full line = displacement.</p></div>

## Steps / method

Method for calculating total distance from a speed-time graph:

Divide the area: Split the area under the graph into simple geometric shapes like rectangles and triangles.

Calculate individual areas: Find the area of each shape using the time and speed values on the axes.

Sum the areas: Add all the individual areas together to find the total distance travelled.

Check units: Ensure time is in seconds (s) and speed is in m/s to get distance in metres (m).

## Common mistakes

Confusing Graphs: Thinking a horizontal line means "rest" on a speed-time graph (it actually means constant speed).

Calculation Errors: Forgetting the $1/2$ when calculating the area of a triangle for distance.

Gradient Misuse: Calculating the gradient of a distance-time graph to find acceleration (it actually gives speed).

Axis Confusion: Reading the final value on the y-axis as the "distance" on a speed-time graph instead of calculating the area.

## Examiner tip

Units: Always include $m/s^2$ for acceleration and $m$ for distance.

Show Geometric Shapes: When calculating area, clearly draw or state the shapes (e.g., "Area of Triangle + Area of Rectangle") to gain working marks.

Tangent for Curves: For non-uniform motion (curves), draw a tangent at the specific time requested to find the instantaneous speed or acceleration.

## Quick check

What physical quantity is represented by the area under a speed-time graph?

If a distance-time graph is a horizontal line, what is the speed of the object?

How can you tell from a speed-time graph that an object is moving with non-uniform acceleration?

## Worked example — Speed from a Distance-Time Graph

Question: A car's distance-time graph is a straight line. At $t = 0\ \text{s}$, distance is $2\ \text{m}$. At $t = 5\ \text{s}$, distance is $50\ \text{m}$. Calculate the speed.

1. Find the change in distance: $\Delta d = 50 - 2 = 48\ \text{m}$.

2. Find the change in time: $\Delta t = 5 - 0 = 5\ \text{s}$.

3. Calculate the gradient: $\text{Speed} = \frac{48\ \text{m}}{5\ \text{s}} = 9.6\ \text{m/s}$.

**Final answer:** $9.6\ \text{m/s}$.

## Worked example — Distance and Acceleration

Question: A train accelerates from rest to $15\ \text{m/s}$ in $10\ \text{s}$, then travels at constant speed for $60\ \text{s}$. Calculate the acceleration and total distance.

1. **Acceleration:** $\frac{15\ \text{m/s} - 0}{10\ \text{s}} = 1.5\ \text{m/s}^2$.

2. **Area 1 (triangle, acceleration phase):** $\frac{1}{2} \times 10\ \text{s} \times 15\ \text{m/s} = 75\ \text{m}$.

3. **Area 2 (rectangle, constant speed):** $60\ \text{s} \times 15\ \text{m/s} = 900\ \text{m}$.

4. **Total distance:** $75 + 900 = 975\ \text{m}$.

**Final answer:** acceleration $= 1.5\ \text{m/s}^2$; total distance $= 975\ \text{m}$.

### Common Trap

Students often use the total time ($10 \text{ s}$) for both calculations, forgetting that motion changed after $10 \text{ s}$.
