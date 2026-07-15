## Core idea

Total internal reflection (TIR) explains phenomena from the perfect reflection seen when looking up from underwater to the high-speed data transmission through optical fibres. When light tries to leave a dense material like glass or water at a steep angle, it can reflect completely back inside instead of refracting out.

## Key definitions

- **Critical angle ($c$)**: The angle of incidence in a denser medium for which the angle of refraction in the less dense medium is $90^\circ$.
- **Total internal reflection (TIR)**: Complete reflection of a light ray inside a denser medium at the boundary with a less dense medium.
- **Refractive index ($n$)**: Ratio of the speed of light in a vacuum to the speed in the medium (no units).
- **Optical fibre**: A thin flexible strand of glass or plastic that transmits data using TIR.

## Key formulas

**Critical angle**

$\sin c = \frac{1}{n}$

Applies when light travels from a denser to a less dense medium (e.g. glass to air).

**Refractive index**

$n = \frac{c}{v}$

where $c = 3.0 \times 10^{8}\ \text{m/s}$ and $v$ is the speed in the medium.

## Conditions for TIR

1. Light must travel from an **optically denser** to a **less dense** medium.
2. Angle of incidence $i$ must be **greater than** the critical angle $c$.

## Applications

- **Semi-circular block**: Ray enters curved face without bending; at flat face — refracts ($i < c$), grazes ($i = c$), or TIR ($i > c$).
- **Optical fibre**: High-index core surrounded by lower-index cladding; light reflects repeatedly inside the core.
- **Right-angled prism**: Ray enters at $90^\circ$; at hypotenuse $i \approx 45^\circ > c$ (~$42^\circ$ for glass) → TIR.

## Graphs & diagrams

**Semi-circular block**

- Ray enters the curved face without bending; at the flat face it refracts, grazes, or reflects (TIR).

<div class="ace-physics-diagram"><svg viewBox="0 0 420 200" width="420" height="200" role="img" aria-label="Total internal reflection in semi-circular block">
      <path d="M120 160 A80 80 0 0 1 280 160 L280 160 L120 160 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <line x1="200" y1="160" x2="200" y2="40" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <line x1="200" y1="160" x2="320" y2="90" stroke="#f59e0b" stroke-width="2.5"/>
      <line x1="200" y1="160" x2="340" y2="160" stroke="#16a34a" stroke-width="2"/>
      <line x1="200" y1="160" x2="130" y2="100" stroke="#dc2626" stroke-width="2.5"/>
      <text x="325" y="85" font-size="10" fill="#f59e0b">refract</text>
      <text x="345" y="155" font-size="10" fill="#16a34a">graze</text>
      <text x="95" y="95" font-size="10" fill="#dc2626">TIR</text>
      <text x="205" y="35" font-size="10" fill="#64748b">normal</text>
    </svg><p class="ace-physics-diagram__caption">Semi-circular block — ray enters the curved face without bending; at the flat face it refracts, grazes, or reflects (TIR).</p></div>

**Optical fibre**

- Light reflects repeatedly inside the high-index core at the core–cladding boundary.

<div class="ace-physics-diagram"><svg viewBox="0 0 480 150" width="480" height="150" role="img" aria-label="Optical fibre total internal reflection">
      <rect x="20" y="40" width="440" height="70" rx="35" fill="#93c5fd" stroke="#2563eb" stroke-width="2"/>
      <rect x="40" y="52" width="400" height="46" rx="23" fill="#dbeafe" stroke="#0284c7" stroke-width="2"/>
      <text x="240" y="28" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="600">cladding (lower n)</text>
      <text x="240" y="132" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="600">core (higher n)</text>
      <polyline fill="none" stroke="#f59e0b" stroke-width="3" points="55,75 120,52 185,75 250,52 315,75 380,52 445,75"/>
      <text x="120" y="48" font-size="9" fill="#dc2626" font-weight="600">TIR</text>
      <text x="250" y="48" font-size="9" fill="#dc2626" font-weight="600">TIR</text>
      <text x="380" y="48" font-size="9" fill="#dc2626" font-weight="600">TIR</text>
      <text x="55" y="88" font-size="10" fill="#f59e0b" font-weight="600">light in</text>
      <text x="430" y="88" font-size="10" fill="#f59e0b" font-weight="600">out</text>
    </svg><p class="ace-physics-diagram__caption">Optical fibre — light reflects repeatedly inside the high-index core at the core–cladding boundary.</p></div>

**Right-angled prism**

- Ray enters at $90^\circ$; at the hypotenuse $i \approx 45^\circ > c$ (~$42^\circ$ for glass), so TIR occurs.

<div class="ace-physics-diagram"><svg viewBox="0 0 220 200" width="220" height="200" role="img" aria-label="Right-angled prism TIR">
      <polygon points="40,160 160,160 40,40" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <line x1="40" y1="160" x2="40" y2="40" stroke="#64748b" stroke-width="1"/>
      <line x1="40" y1="160" x2="160" y2="160" stroke="#64748b" stroke-width="1"/>
      <line x1="40" y1="40" x2="160" y2="160" stroke="#64748b" stroke-width="1"/>
      <line x1="40" y1="120" x2="40" y2="160" stroke="#f59e0b" stroke-width="2.5"/>
      <line x1="40" y1="120" x2="95" y2="75" stroke="#f59e0b" stroke-width="2.5"/>
      <line x1="95" y1="75" x2="40" y2="75" stroke="#dc2626" stroke-width="2.5"/>
      <text x="48" y="115" font-size="9" fill="#f59e0b">in</text>
      <text x="55" y="72" font-size="9" fill="#dc2626">TIR</text>
    </svg><p class="ace-physics-diagram__caption">Right-angled prism — ray enters at 90° to a face; at the hypotenuse i ≈ 45° &gt; c (~42° for glass), so TIR occurs.</p></div>

## Steps / method

1. **Identify media**: TIR only occurs from denser → less dense.
2. **Calculate critical angle**: $c = \arcsin(1/n)$.
3. **Measure $i$**: Angle between incident ray and normal.
4. **Compare**: $i < c$ → refract; $i = c$ → graze; $i > c$ → TIR.

## Worked example 1 — Calculating critical angle

Question: Glass has $n = 1.5$. Calculate the critical angle.

$$
\sin c = \frac{1}{1.5} \Rightarrow c = \arcsin(0.667) \approx 42^\circ
$$

**Final answer:** $42^\circ$.

## Worked example 2 — Ray path in a prism

Question: A ray enters a right-angled glass prism ($n = 1.5$, $c \approx 42^\circ$) at $90^\circ$ to a face. Will TIR occur at the hypotenuse?

The ray hits the hypotenuse at $i \approx 45^\circ > 42^\circ$ → **yes, TIR occurs**.

## Common mistakes

- Trying to apply TIR when light enters a denser medium.
- Measuring $i$ from the surface instead of the normal.

## Examiner tip

- Optical fibres use TIR, not mirrors.
- Endoscopes and high-speed internet both rely on optical fibres.

## Quick check

State the two conditions for total internal reflection.

What happens when $i = c$?

Name one application of optical fibres.
