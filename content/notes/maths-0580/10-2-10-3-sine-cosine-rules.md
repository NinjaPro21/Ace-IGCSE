## Core idea

The Sine and Cosine Rules extend trigonometric analysis to non-right-angled triangles by linking all three interior angles to their opposite side lengths. The Sine Rule manages configurations involving matching opposite pairs of angles and sides, while the Cosine Rule handles triangles where three sides are known or where two sides enclose a known angle. Use these rules to calculate unknown dimensions in any general triangle layout.

## Key formulas

$$
\text{The Sine Rule (Lengths / Angles):} \quad \frac{a}{\sin(A)} = \frac{b}{\sin(B)} = \frac{c}{\sin(C)} \quad \text{or} \quad \frac{\sin(A)}{a} = \frac{\sin(B)}{b} = \frac{\sin(C)}{c}
$$
$$
\text{The Cosine Rule for Side Lengths:} \quad a^2 = b^2 + c^2 - 2bc \cos(A)
$$
$$
\text{The Cosine Rule for Interior Angles:} \quad \cos(A) = \frac{b^2 + c^2 - a^2}{2bc}
$$

## Graphs & diagrams

<div class="ace-physics-diagram"><svg viewBox="0 0 300 200" width="300" height="200" role="img" aria-label="Trigonometry triangle labels">
      <polygon points="50,170 250,170 50,50" fill="#fdfbf7" stroke="#b59a73" stroke-width="2"/>
      <rect x="50" y="155" width="15" height="15" fill="none" stroke="#a8a29e"/>
      <path d="M230 170 A20 20 0 0 1 238 155" fill="none" stroke="#b59a73" stroke-width="1.5"/>
      <text x="212" y="158" font-size="12" fill="#b59a73" font-weight="700">θ</text>
      <text x="150" y="188" text-anchor="middle" font-size="11" fill="#5b8def">adjacent</text>
      <text x="28" y="120" font-size="11" fill="#789671">opposite</text>
      <text x="170" y="100" font-size="11" fill="#5b8def" font-weight="600">hypotenuse</text>
    </svg><p class="ace-physics-diagram__caption">SOH CAH TOA — label opposite, adjacent, and hypotenuse relative to angle $\theta$ (the acute angle, not the right angle).</p></div>

## Steps / method

Label the vertices of the non-right-angled triangle with capital letters A, B, and $C$. a, b, and $c$.

Check the known dimensions: if you know an opposite side-angle pair (e.g., side $a$ and $A$), select the Sine Rule.

If you know two sides and the enclosed angle between them ($\text{SAS}$), or if you know all three side lengths ($\text{SSS}$), select the Cosine Rule.

Substitute your known values into the chosen formula template.

Rearrange the equation to isolate your target variable, using brackets around terms when entering the calculation into your calculator.

## Examiner tip

When using the Cosine Rule to calculate an angle, remember that the term subtracted in the numerator ($a^2$) must always be the side length directly opposite the target angle $A$ you are trying to find. Mixing up the order of sides in this fraction is a very common source of error on Paper 4.

## Quick check

Use the Cosine Rule when you know all three sides ($\text{SSS}$) or two sides and the angle between them ($\text{SAS}$); use the Sine Rule if you know any matching opposite side-angle pair.

## Worked example — Example 1 (June 2022 P41 Q7)

In triangle $ABC$ when $2$, side $c = 11\text{ cm}$, and the enclosed angle $\angle A = 65^\circ$. Determine $a$.

Analyze the given dimensions: we know two sides and the enclosed angle between them ($\text{SAS}$), so choose the Cosine Rule for side lengths.

Write down the Cosine Rule formula: $a^2 = b^2 + c^2 - 2bc \cos(A)$.

Substitute the given values into the formula: $a^2 = 8^2 + 11^2 - 2(8)(11)\cos(65^\circ)$.

Evaluate the arithmetic components: $a^2 = 64 + 121 - 176 \times \cos(65^\circ) \implies a^2 = 185 - 176 \times 0.422618$.

Simplify the expression: $a^2 = 185 - 74.3808 = 110.619$.

Take the square root to find the side length, rounding to $3$ significant figures: $a = \sqrt{110.619} \approx 10.5\text{ cm}$.

## Worked example — Example 2 (Nov 2023 P42 Q6b)

In triangle $XYZ$ when $2$, side $yz = 9\text{ cm}$, and angle $\angle XZW = 40^\circ$. $\angle YXZ$.

Relabel or map the points to the standard Sine Rule layout: side $x = 9\text{ cm}$ sits opposite angle $X$ when $2$ sits opposite angle $Z = 40^\circ$.

Since we know an opposite side-angle pair, choose the Sine Rule configured for finding angles: $\frac{\sin(X)}{x} = \frac{\sin(Z)}{z}$.

Substitute the values into the formula: $\frac{\sin(X)}{9} = \frac{\sin(40^\circ)}{7}$.

Rearrange the equation to isolate $\sin(X)$: $\sin(X) = 9 \times \frac{\sin(40^\circ)}{7}$.

Calculate the decimal value: $\sin(X) = 9 \times \frac{0.642787}{7} = 0.82644$.

Use the inverse sine function to find angle $X$ when $2$.

Calculate the value and round to exactly $1$ decimal place: $X \approx 55.7^\circ$.
