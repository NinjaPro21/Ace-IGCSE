## Core idea

Echoes and ultrasound build on reflection and frequency. Echoes are reflected sound we can hear; ultrasound is high-frequency sound above human hearing, used in medicine, industry, and navigation.

## Key definitions

- **Echo**: A repetition of sound produced by reflection from a hard, flat surface.
- **Ultrasound**: Sound with frequency above 20 kHz — above the upper limit of human hearing.
- **Echolocation**: Locating objects using reflected ultrasound (bats, dolphins, sonar).
- **Sonar**: Sound Navigation and Ranging — ships use ultrasound pulses to measure depth or detect objects.

## Echoes

- Sound reflects from obstructions (walls, cliffs) following the law of reflection: angle of incidence = angle of reflection.
- The echo is loudest when these angles are equal.

## Ultrasound applications

- **Quality control**: ultrasound passes through metal or concrete; internal cracks change the received pulse.
- **Medical scanning**: low-energy ultrasound reflects from tissue boundaries to form images; safer than X-rays for prenatal scans.
- **Sonar**: ships send pulses; depth found from return time. Dolphins (~100 kHz clicks) and bats use similar echolocation.

## Key formulas

$$
v = \frac{2d}{t} \quad \text{or} \quad d = \frac{v \times t}{2}
$$

where:

- $v$ - speed of sound in the medium (e.g. 1500 m/s in water)
- $d$ - distance to the reflecting surface (one way)
- $t$ - total time for the pulse to go and return

## Graphs & diagrams

**Echo diagram**

- Sound reflects from a surface; distance to obstacle = (speed × time) ÷ 2.

<div class="ace-physics-diagram"><svg viewBox="0 0 360 160" width="360" height="160" role="img" aria-label="Echo diagram">
      <circle cx="80" cy="100" r="20" fill="#dbeafe" stroke="#2563eb"/>
      <text x="80" y="105" text-anchor="middle" font-size="9" fill="#1e3a8a">source</text>
      <rect x="280" y="40" width="20" height="100" fill="#94a3b8"/>
      <text x="290" y="155" text-anchor="middle" font-size="9" fill="#64748b">wall</text>
      <path d="M100 95 H260" stroke="#2563eb" stroke-width="2" marker-end="url(#echo)"/>
      <path d="M260 105 H100" stroke="#64748b" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#echo2)"/>
      <text x="180" y="85" text-anchor="middle" font-size="10" fill="#2563eb">outgoing</text>
      <text x="180" y="125" text-anchor="middle" font-size="10" fill="#64748b">echo returns</text>
      <defs>
        <marker id="echo" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker>
        <marker id="echo2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker>
      </defs>
    </svg><p class="ace-physics-diagram__caption">Echo — sound reflects from a surface; distance to obstacle = (speed × time) ÷ 2.</p></div>

## Worked example — Measuring sea depth

Question: A ship receives an echo $0.3\,\text{s}$ after sending a sonar pulse. Speed of sound in water = $1500\,\text{m/s}$. Find the depth.

1. Time for round trip $t = 0.3\,\text{s}$, so one-way time $= 0.15\,\text{s}$.
2. Depth $d = v \times t_{\text{one-way}} = 1500 \times 0.15 = 225\,\text{m}$.

**Final answer:** $225\,\text{m}$.

## Quick check

What is the minimum frequency for ultrasound?

Why is ultrasound preferred over X-rays for prenatal scanning?

An echo returns after $1.0\,\text{s}$ with $v = 1500\,\text{m/s}$ in water. What is the depth?
