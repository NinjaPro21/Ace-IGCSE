## Core idea

From the gentle push needed to open a door to the massive gravitational pull that keeps a kite flying in the sky, forces are the invisible interactions that govern how everything in our world moves and changes shape. Understanding these principles is the first step toward engineering safer cars, designing resilient bridges, and even calculating how much a watermelon weighs using nothing but a spring and a bag of sugar.

## Key definitions

- **Force**: A vector quantity that can change the size, shape, or motion of an object (SI unit: newton, N).
- **Physical Quantity**: A quantity that can be measured, consisting of a numerical magnitude and a unit.
- **Elastic Solid**: An object that changes in size and shape when a force is applied and returns to its original state when the force is removed.
- **Extension ($x$)**: The difference between the extended length ($l$) and the original length ($l_0$) of a spring (SI unit: metre, m).
- **Spring Constant ($k$)**: The force per unit extension (SI unit: newton per metre, N/m).
- **Limit of Proportionality**: The point beyond which the extension of an object is no longer directly proportional to the applied load.
- **Weight**: The gravitational force acting on an object that has mass (SI unit: N).

## Key formulas

**Spring constant**

$k = \frac{F}{x}$

Applies within the limit of proportionality.

**Extension**

$x = l - l_0$

Used to calculate the change in length of a spring or elastic solid.

**Weight**

$W = mg$

Applies to masses within a gravitational field, where $g \approx 9.8\ \text{m/s}^2$.

## Graphs & diagrams

**Load-Extension Graph**

- **Within the limit**: A straight line passing through the origin, indicating the load is directly proportional to the extension.
- **Beyond the limit**: The graph curves, showing that proportionality has been lost.

<div class="ace-physics-diagram"><svg viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Load extension graph">
      <line x1="55" y1="195" x2="400" y2="195" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="195" x2="55" y2="25" stroke="#64748b" stroke-width="1.5"/>
      <text x="230" y="218" text-anchor="middle" font-size="12" fill="#475569">Extension</text>
      <text x="20" y="110" transform="rotate(-90 20 110)" text-anchor="middle" font-size="12" fill="#475569">Load / Force</text>
      <line x1="65" y1="195" x2="200" y2="70" stroke="#2563eb" stroke-width="2.5"/>
      <path d="M200 70 Q260 55 340 45" fill="none" stroke="#dc2626" stroke-width="2.5"/>
      <line x1="200" y1="70" x2="200" y2="195" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <text x="130" y="120" font-size="10" fill="#2563eb">Hooke's law region</text>
      <text x="280" y="50" font-size="10" fill="#dc2626">limit of proportionality</text>
    </svg><p class="ace-physics-diagram__caption">Load–extension graph — straight line through origin (Hooke's law) until the limit of proportionality; then the graph curves.</p></div>

## Steps / method

Exam method for investigating spring extension:

Original Length: Measure the length $l_0$ of the spring without any load, ensuring the eye is level to avoid parallax error.

Add Loads: Attach standard 1 N loads one at a time, measuring the new length $l$ for each increment.

Calculate Extension: Use $x = l - l_0$ for every row of data collected.

Plot Graph: Plot the force ($F$) on the y-axis against extension ($x$) on the x-axis.

Analyze: Determine the spring constant ($k$) from the gradient and identify the limit of proportionality where the line starts to curve.

## Common mistakes

Extension vs. Length: Using the total length of the spring in $F = kx$ instead of the extension.

Mass vs. Weight: Forgetting to convert mass (kg) into weight (N) before using the spring constant formula.

Ignoring the Limit: Assuming $F$ is always proportional to $x$ even when the load is very large.

## Examiner tip

Significant Figures: Provide numerical answers to 2 or 3 significant figures unless otherwise specified.

Units: Always include the correct SI units (e.g., N/m for $k$) to avoid losing marks.

Show Working: Mark schemes award marks for the formula and substitution even if the final calculation is incorrect.

## Quick check

Is force a scalar or a vector quantity?.

What is the name of the point where a spring stops obeying Hooke's Law?.

What does the area under a speed-time graph represent?.

## Worked example — Finding the Spring Constant

Question: A spring has an original length of 16.0 cm. When a 5.0 N load is attached, the length becomes 26.0 cm. Calculate the spring constant.

1. Find the extension: $x = 26.0\ \text{cm} - 16.0\ \text{cm} = 10.0\ \text{cm} = 0.10\ \text{m}$.

2. Use $k = F/x$: $k = \frac{5.0\ \text{N}}{0.10\ \text{m}} = 50\ \text{N/m}$.

**Final answer:** $50\ \text{N/m}$.

## Worked example — Multi-step Weight and Force

Question: A 2.0 kg bag of flour is suspended from a spring ($k = 0.4\ \text{N/mm}$). Use $g = 10\ \text{N/kg}$. Calculate the weight of the flour and the resulting extension of the spring.

1. **Weight:** $W = mg = 2.0\ \text{kg} \times 10\ \text{N/kg} = 20\ \text{N}$.

2. **Extension:** $x = F/k = \frac{20\ \text{N}}{0.4\ \text{N/mm}} = 50\ \text{mm}$.

**Final answer:** weight $= 20\ \text{N}$; extension $= 50\ \text{mm}$.

### Common Trap

Students often confuse the "new length" of the spring with the "extension." Always subtract the original length if the question provides total length.
