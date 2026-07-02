## Core idea

Imagine looking up while swimming and seeing the bottom of the pool reflected perfectly on the water's surface, or browsing the internet at lightning speeds through cables made of glass. These are not magic; they are the result of **total internal reflection (TIR)**. By understanding how light behaves when it tries to leave a dense material like glass or water, you can master the physics behind modern telecommunications and advanced medical imaging tools like endoscopes.

## Key definitions

- **Critical angle ($c$)**: The angle of incidence in an optically denser medium for which the angle of refraction in the optically less dense medium is $90^\circ. (Angle is a scalar quantity; unit: degrees, $^\circ.)
- **Total internal reflection**: The complete reflection of a light ray inside an optically denser medium at its boundary with an optically less dense medium.
- **Refractive index ($n$)**: The ratio of the speed of light in a vacuum to the speed of light in a specific medium (no units).
- **Optical fibre**: A long, thin, flexible strand of glass or plastic that transmits data using total internal reflection.

## Key formulas

**Finding the critical angle:**

$\sin c = \frac{1}{n}$

Applies only when light travels from an optically denser medium to an optically less dense medium (e.g. glass to air).

**Refractive index (speed ratio):**

$n = \frac{c}{v}$

Where $c$13.0 \times 10^8\ \text{m/s}$) and$ v$is the speed in the medium$.

## Graphs & diagrams

- **Semi-circular block experiment**: A light ray enters the curved side of a block without bending. At the flat boundary, if the angle of incidence ($i$) is less than the critical angle ($c$), the ray refracts away from the normal. If $i = c$, the ray travels along the boundary at $90^\circ$. If $i > c$, the ray reflects back into the glass$.
- **Optical fibre**: A core with a high refractive index is surrounded by a coating of lower refractive index. Light stays trapped inside the core by reflecting repeatedly off the walls.
- **Right-angled prisms**: Light enters at $90^\circ$ to one face, hits the hypotenuse at $45^\circ$ (greater than the critical angle for glass, ~$42^\circ$), and reflects at $90^\circ$ to its original path.

<div class="enlight-physics-diagram"><svg viewBox="0 0 420 200" width="420" height="200" role="img" aria-label="Total internal reflection in semi-circular block">
      <path d="M120 160 A80 80 0 0 1 280 160 L280 160 L120 160 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <line x1="200" y1="160" x2="200" y2="40" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <line x1="200" y1="160" x2="320" y2="90" stroke="#f59e0b" stroke-width="2.5"/>
      <line x1="200" y1="160" x2="340" y2="160" stroke="#16a34a" stroke-width="2"/>
      <line x1="200" y1="160" x2="130" y2="100" stroke="#dc2626" stroke-width="2.5"/>
      <text x="325" y="85" font-size="10" fill="#f59e0b">refract (i &lt; c)</text>
      <text x="345" y="155" font-size="10" fill="#16a34a">graze (i = c)</text>
      <text x="95" y="95" font-size="10" fill="#dc2626">TIR (i &gt; c)</text>
      <text x="205" y="35" font-size="10" fill="#64748b">normal</text>
    </svg><p class="enlight-physics-diagram__caption">Semi-circular block — ray enters the curved face without bending; at the flat face it refracts, grazes, or reflects (TIR).</p></div>

<div class="enlight-physics-diagram"><svg viewBox="0 0 420 120" width="420" height="120" role="img" aria-label="Optical fibre">
      <rect x="30" y="35" width="360" height="50" rx="25" fill="#bfdbfe" stroke="#2563eb"/>
      <rect x="45" y="45" width="330" height="30" rx="15" fill="#dbeafe" stroke="#0284c7"/>
      <polyline fill="none" stroke="#f59e0b" stroke-width="2.5" points="55,60 110,45 165,60 220,45 275,60 330,45 385,60"/>
      <text x="210" y="25" text-anchor="middle" font-size="11" fill="#334155">cladding (lower n)</text>
      <text x="210" y="100" text-anchor="middle" font-size="11" fill="#334155">core (higher n)</text>
    </svg><p class="enlight-physics-diagram__caption">Optical fibre — light reflects repeatedly inside the high-index core at the core–cladding boundary.</p></div>

<div class="enlight-physics-diagram"><svg viewBox="0 0 220 200" width="220" height="200" role="img" aria-label="Right-angled prism TIR">
      <polygon points="40,160 160,160 40,40" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <line x1="40" y1="160" x2="40" y2="40" stroke="#64748b" stroke-width="1"/>
      <line x1="40" y1="160" x2="160" y2="160" stroke="#64748b" stroke-width="1"/>
      <line x1="40" y1="40" x2="160" y2="160" stroke="#64748b" stroke-width="1"/>
      <line x1="40" y1="120" x2="40" y2="160" stroke="#f59e0b" stroke-width="2.5"/>
      <line x1="40" y1="120" x2="95" y2="75" stroke="#f59e0b" stroke-width="2.5"/>
      <line x1="95" y1="75" x2="40" y2="75" stroke="#dc2626" stroke-width="2.5"/>
      <text x="48" y="115" font-size="9" fill="#f59e0b">in</text>
      <text x="55" y="72" font-size="9" fill="#dc2626">TIR</text>
    </svg><p class="enlight-physics-diagram__caption">Right-angled prism — ray enters at 90° to a face; at the hypotenuse i ≈ 45° &gt; c (~42° for glass), so TIR occurs.</p></div>

## Steps / method

**Exam method for predicting the path of a light ray:** 1. **Identify the media:** Check if the ray is moving from a denser medium (higher $n$) to a less dense medium (lower $n$). TIR cannot happen if light is entering a denser medium. 2. **Calculate the critical angle:** Use $c = \arcsin(1/n)$ if the refractive index is provided. 3. **Measure the angle of incidence ($i$):** Ensure $i$ is measured between the incident ray and the normal. 4. **Compare $i$ and $c$:**

- If $i < c$: the ray refracts out of the material.

- If $i = c$: the ray travels along the boundary.

- If $i > c$: draw a reflected ray inside the material where the angle of reflection equals $i$.

## Common mistakes

- **Wrong direction:** Trying to calculate TIR for light entering water from air. TIR only happens when light is trapped inside the denser medium.

- **Formula inversion:** Using $\sin c = n$ instead of $1/n. Since $\sin ccannot exceed 1, a value liken = 1.5will give a calculator error.

- **Assuming TIR always happens:** If $i < c$, the light simply refracts out of the material.

## Examiner tip

- **Two conditions:** State both: (1) light travels from denser to less dense medium, and (2) angle of incidence is greater than the critical angle.

- **Optical fibre benefits:** Mention higher carrying capacity and less signal loss compared with copper wires.

- **Reversibility:** Light travels the same path even if its direction is reversed — useful for complex refraction problems.

## Quick check

What is the angle of refraction when the angle of incidence is exactly equal to the critical angle?

Does light travel faster or slower in a material with a high refractive index?

Name one medical instrument that uses optical fibres to see inside the body.

## Worked example 1 — Calculating Critical Angle

Question: A diamond has a refractive index of 2.4. Calculate its critical angle.

Apply the formula: $\sin c = 1/2.4. Calculate the ratio:$1/2.4 \approx 0.417.

Find the angle: $c = \arcsin(0.417) \approx 24.6^\circ$124.6^\circ2

## Worked example 2 — Ray Path in a Prism

Question: A light ray enters a right-angled glass prism ($n = 1.5$) at $90^\circ$145^\circto the normal. Determine if the ray emerges or reflects.

Calculate $c$. So $\sin c = 1/1.5 = 0.667$

So c = 41.8^\circ 2

Compare $i$ and $c. i$145^\circ$145^\circ > 41.8^\circ$. $i > c$), the ray undergoes total internal reflection. ### Trap

** Students often measure the angle between the ray and the surface instead of the normal. Always measure from the normal first.
