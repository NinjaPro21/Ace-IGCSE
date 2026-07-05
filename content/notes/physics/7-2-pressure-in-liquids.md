## Core idea

Imagine diving into a swimming pool and feeling a squeeze on your ears the deeper you go. This isn't just a sensation; it's physics in action. Understanding pressure in liquids is vital for everything from designing submarines that don't crush under the ocean's weight to engineering massive dams that power entire cities, ensuring that human-made structures can withstand the immense forces found beneath the surface.

## Key definitions

- **Pressure**: Defined as the force per unit area.
- **Pascal (Pa)**: The SI unit of pressure, equivalent to one newton per square metre ($1\ \text{Pa} = 1\ \text{N/m}^2$).
- **Density ($\rho$)**: The mass of a substance per unit volume (SI unit: $\text{kg/m}^3$).
- **Gravitational field strength ($g$)**: The gravitational force per unit mass (SI unit: $\text{N/kg}$).
- **Depth ($h$)**: The vertical distance measured from the surface of the liquid downwards.
- **Atmospheric pressure**: The pressure exerted by the weight of the air above us, approximately $1.0 \times 10^5\ \text{Pa}$ at sea level.

## Key formulas

**Change in liquid pressure**

$\Delta p = \rho g \Delta h$

Applies to calculate the pressure produced by the liquid column at a certain depth below the surface.

**Total Pressure**

$P_{\text{total}} = P_{\text{atmospheric}} + \rho g h$

Used when calculating the actual pressure an object experiences — you must add atmospheric pressure to the liquid pressure.

## Graphs & diagrams

**How pressure changes with depth**

- At the **surface**: pressure equals atmospheric pressure $P_{\text{atm}} \approx 1.0 \times 10^5\ \text{Pa}$.
- **Deeper down**: the liquid column adds extra pressure $\rho g h$, so total pressure increases.
- **Same depth** → same pressure (even in connected containers).
- **Total pressure**: $P_{\text{total}} = P_{\text{atm}} + \rho g h$.

<div class="enlight-physics-diagram"><svg viewBox="0 0 540 350" width="540" height="350" role="img" aria-label="Liquid pressure increasing with depth">
      <defs>
        <marker id="pj-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker>
        <marker id="pa-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker>
      </defs>
      <rect x="170" y="70" width="120" height="220" fill="#bfdbfe" stroke="#2563eb" stroke-width="2"/>
      <line x1="170" y1="70" x2="290" y2="70" stroke="#334155" stroke-width="2"/>
      <text x="230" y="58" text-anchor="middle" font-size="12" fill="#334155" font-weight="600">surface</text>
      <text x="318" y="58" font-size="12" fill="#7c3aed" font-weight="600">P<tspan baseline-shift="sub" font-size="9">atm</tspan></text>
      <line x1="135" y1="70" x2="135" y2="290" stroke="#dc2626" stroke-width="2"/>
      <line x1="129" y1="70" x2="141" y2="70" stroke="#dc2626" stroke-width="2"/>
      <line x1="129" y1="290" x2="141" y2="290" stroke="#dc2626" stroke-width="2"/>
      <text x="108" y="185" font-size="12" fill="#dc2626" font-weight="600" transform="rotate(-90 108 185)">depth h</text>
      <line x1="170" y1="130" x2="290" y2="130" stroke="#94a3b8" stroke-dasharray="5 4"/>
      <line x1="170" y1="195" x2="290" y2="195" stroke="#94a3b8" stroke-dasharray="5 4"/>
      <line x1="170" y1="260" x2="290" y2="260" stroke="#94a3b8" stroke-dasharray="5 4"/>
      <circle cx="170" cy="130" r="5" fill="#1e40af"/>
      <circle cx="170" cy="195" r="5" fill="#1e40af"/>
      <circle cx="170" cy="260" r="5" fill="#1e40af"/>
      <path d="M165 130 Q95 125 50 118" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#pj-arr)"/>
      <text x="48" y="108" font-size="11" fill="#2563eb">weak jet</text>
      <path d="M165 195 Q75 190 25 185" fill="none" stroke="#2563eb" stroke-width="3" marker-end="url(#pj-arr)"/>
      <text x="22" y="172" font-size="11" fill="#2563eb">medium jet</text>
      <path d="M165 260 Q55 255 8 250" fill="none" stroke="#2563eb" stroke-width="4" marker-end="url(#pj-arr)"/>
      <text x="8" y="238" font-size="11" fill="#2563eb" font-weight="600">strongest jet</text>
      <line x1="292" y1="130" x2="322" y2="130" stroke="#64748b" stroke-width="2.5" marker-end="url(#pa-arr)"/>
      <text x="400" y="134" text-anchor="middle" font-size="12" fill="#334155" font-weight="600">p₁ shallow</text>
      <line x1="292" y1="195" x2="332" y2="195" stroke="#64748b" stroke-width="3.5" marker-end="url(#pa-arr)"/>
      <text x="400" y="199" text-anchor="middle" font-size="12" fill="#334155" font-weight="600">p₂ deeper</text>
      <line x1="292" y1="260" x2="352" y2="260" stroke="#64748b" stroke-width="5.5" marker-end="url(#pa-arr)"/>
      <text x="400" y="264" text-anchor="middle" font-size="12" fill="#334155" font-weight="700">p₃ highest</text>
      <text x="270" y="325" text-anchor="middle" font-size="11" fill="#475569">Pressure and jet strength increase with depth</text>
    </svg><p class="enlight-physics-diagram__caption">Liquid pressure increases with depth — water jets shoot further from lower holes; pressure at the bottom is greatest.</p></div>

**Pressure–depth diagram**

- Water jets shoot furthest from the lowest hole — greatest depth means greatest pressure.

**Pressure–depth relationship**

- Water spurts out **furthest** from the lowest hole — greatest depth means greatest pressure.
- Denser liquids (e.g. mercury) exert more pressure than water at the same depth.

## Steps / method

Method for calculating pressure in a liquid:

1. **Identify liquid density**: Find $\rho$ in $\text{kg/m}^3$.
2. **Identify depth**: Determine vertical depth $h$ from the surface in metres (m).
3. **Determine gravity**: Use $g \approx 9.8\ \text{N/kg}$ or $10\ \text{N/kg}$ as specified.
4. **Calculate liquid pressure**: $\Delta p = \rho g h$.
5. **Account for atmosphere**: If the question asks for "actual" or "total" pressure, add atmospheric pressure: $P_{\text{total}} = P_{\text{atm}} + \rho g h$.

## Worked example — Submarine Depth Change

Question: A small submarine is submerged at a depth of $3.0 \times 10^{3}\ \text{m}$. If the density of seawater is $1030\ \text{kg/m}^3$ and $g = 10\ \text{N/kg}$, calculate the change in pressure experienced by the submarine from the surface.

1. Identify values: $\rho = 1030\ \text{kg/m}^3$, $g = 10\ \text{N/kg}$, $\Delta h = 3000\ \text{m}$.

2. Apply the formula:

$$
\Delta p = \rho g \Delta h = 1030 \times 10 \times 3000 = 30\,900\,000\ \text{Pa} = 30.9\ \text{MPa}
$$

**Final answer:** $30.9\ \text{MPa}$ (this is the pressure due to the seawater column only).

## Worked example — Total Pressure at Depth

Question: Calculate the total pressure at a depth of $10\ \text{m}$ in fresh water ($\rho = 1000\ \text{kg/m}^3$, $g = 10\ \text{N/kg}$). Take atmospheric pressure as $1.0 \times 10^{5}\ \text{Pa}$.

1. Calculate liquid pressure: $\rho g h = 1000 \times 10 \times 10 = 100\,000\ \text{Pa}$.

2. Add atmospheric pressure:

$$
P_{\text{total}} = 1.0 \times 10^{5} + 100\,000 = 200\,000\ \text{Pa} = 2.0 \times 10^{5}\ \text{Pa}
$$

**Final answer:** $2.0 \times 10^{5}\ \text{Pa}$.

### Common Trap

Students often forget that atmospheric pressure must be accounted for when finding total pressure in liquids.

- $\rho g h$ gives only the **extra** pressure from the liquid column.
- At the surface, pressure is **not** zero — it equals atmospheric pressure ($\approx 1.0 \times 10^{5}\ \text{Pa}$).
- For total pressure: always add $P_{\text{atm}}$ unless the question asks only for the change in pressure due to the liquid.

## Common mistakes

**Measuring from the bottom**: Incorrectly using the height from the floor instead of the depth from the surface.

**Unit mismatch**: Using density in $\text{g/cm}^3$ with depth in metres. For the result to be in Pascals, density must be in $\text{kg/m}^3$.

**Ignoring atmospheric pressure**: Forgetting to add $P_{\text{atm}}$ when calculating total pressure at depth. The liquid column adds to the air pressure already acting on the surface.

**Ignoring density**: Assuming pressure only depends on depth. Denser liquids, like mercury, exert significantly more pressure than water at the same depth.

## Examiner tip

**Symbol confusion**: Be careful not to confuse the Greek symbol for density ($\rho$) with the letter '$p$' used for pressure.

**Gravity values**: Always check if the exam paper instructs you to use $g = 9.8\ \text{m/s}^2$ or $10\ \text{m/s}^2$.

**Significant figures**: Ensure your final pressure values are rounded to 2 or 3 significant figures as per standard IGCSE marking criteria.

## Quick check

Name two factors that affect the amount of pressure a liquid exerts on an immersed object.

Which liquid would exert more pressure at the bottom of an identical bottle: oil or water? (Oil is less dense than water).

What is the standard SI unit for pressure?
