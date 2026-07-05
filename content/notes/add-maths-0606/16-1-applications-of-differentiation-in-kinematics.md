## Core idea

Kinematics models motion along a straight line. Differentiation links displacement $s$, velocity $v$, and acceleration $a$: velocity is the rate of change of displacement, and acceleration is the rate of change of velocity.

## Key formulas

$$
v = \frac{ds}{dt}, \quad a = \frac{dv}{dt} = \frac{d^2s}{dt^2}
$$

## Steps / method

1. **Identify** whether you are given $s(t)$, $v(t)$, or $a(t)$.


2. **Differentiate** with respect to $t$ to move from displacement to velocity, or from velocity to acceleration.


3. **Substitute** the required time value to find an instantaneous quantity.


4. **Set** $v = 0$ to find when the particle is instantaneously at rest or may change direction.

### Key rule

Differentiate to go from displacement → velocity → acceleration. At maximum speed, acceleration is not necessarily zero; at maximum velocity (turning point), $v = 0$.

## Graphs & diagrams

**Calculus chain — differentiate down, integrate up**

<div class="enlight-physics-diagram"><svg viewBox="0 0 420 100" width="420" height="100" role="img" aria-label="Calculus chain from displacement to acceleration">
      <rect x="8" y="28" width="100" height="44" rx="8" fill="#ecfeff" stroke="#0891b2" stroke-width="1.5"/>
      <text x="58" y="48" text-anchor="middle" font-size="11" fill="#0e7490" font-weight="600">s(t)</text>
      <text x="58" y="62" text-anchor="middle" font-size="10" fill="#64748b">displacement</text>
      <text x="130" y="54" text-anchor="middle" font-size="11" fill="#64748b">d/dt →</text>
      <rect x="148" y="28" width="100" height="44" rx="8" fill="#fff7ed" stroke="#d97706" stroke-width="1.5"/>
      <text x="198" y="48" text-anchor="middle" font-size="11" fill="#c2410c" font-weight="600">v(t)</text>
      <text x="198" y="62" text-anchor="middle" font-size="10" fill="#64748b">velocity</text>
      <text x="270" y="54" text-anchor="middle" font-size="11" fill="#64748b">d/dt →</text>
      <rect x="288" y="28" width="100" height="44" rx="8" fill="#fff1f2" stroke="#be123c" stroke-width="1.5"/>
      <text x="338" y="48" text-anchor="middle" font-size="11" fill="#be123c" font-weight="600">a(t)</text>
      <text x="338" y="62" text-anchor="middle" font-size="10" fill="#64748b">acceleration</text>
      <text x="210" y="90" text-anchor="middle" font-size="10" fill="#64748b">Reverse with integration (∫ dt) and use initial conditions for +C</text>
    </svg></div>

Differentiate s → v → a. Integrate in reverse to recover motion quantities.

**Distance vs displacement on a straight line**

<div class="enlight-physics-diagram"><svg viewBox="0 0 420 120" width="420" height="120" role="img" aria-label="Distance versus displacement">
      <line x1="40" y1="70" x2="380" y2="70" stroke="#a8a29e" stroke-width="3" stroke-linecap="round"/>
      <circle cx="60" cy="70" r="6" fill="#64748b"/>
      <text x="60" y="95" text-anchor="middle" font-size="10" fill="#64748b">start</text>
      <polyline points="60,70 140,70 220,70 300,70 340,70" fill="none" stroke="#d97706" stroke-width="2.5" stroke-dasharray="6 4"/>
      <text x="200" y="58" text-anchor="middle" font-size="10" fill="#d97706">distance = full path (orange dashed)</text>
      <line x1="60" y1="42" x2="340" y2="42" stroke="#0891b2" stroke-width="3" marker-end="url(#kin-note-arrow)"/>
      <defs><marker id="kin-note-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#0891b2"/></marker></defs>
      <text x="200" y="32" text-anchor="middle" font-size="10" fill="#0891b2" font-weight="600">displacement = straight arrow (blue)</text>
      <circle cx="340" cy="70" r="7" fill="#0891b2" stroke="#fff" stroke-width="2"/>
      <text x="340" y="95" text-anchor="middle" font-size="10" fill="#0891b2">finish</text>
    </svg></div>

If a particle turns back, distance is longer than |displacement|. Use ∫v dt for displacement and ∫|v| dt for distance.

## Worked example — Velocity and acceleration

Question: A particle has displacement $s = t^2 + 3t$ m at time $t$ s. Find its velocity and acceleration at $t = 4$.

$v = \frac{ds}{dt} = 2t + 3$

At $t = 4$: $v = 11\,\text{m/s}$

$a = \frac{dv}{dt} = 2\,\text{m/s}^2$ (constant)

## Worked example — Instantaneous rest

Question: A particle has $s = t^3 - 6t^2 + 9t$. Find when $v = 0$.

$v = \frac{ds}{dt} = 3t^2 - 12t + 9 = 3(t^2 - 4t + 3)$

$v = 0 \implies (t - 1)(t - 3) = 0 \implies t = 1$ or $t = 3$

## Examiner tip

State units in your final answer (m, m/s, m/s²). Differentiation reduces the power of $t$ by one each time you move down the chain $s \to v \to a$.

## Quick check

If $s = 4t^2 - t$, then $v = 8t - 1$ and $a = 8\,\text{m/s}^2$.
