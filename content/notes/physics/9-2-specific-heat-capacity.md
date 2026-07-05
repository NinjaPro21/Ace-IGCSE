## Core idea

Why does beach sand become scorching hot while the sea stays cool? Why does a small pot of water boil faster than a large one? The answer is **specific heat capacity** — how much energy is needed to raise the temperature of 1 kg of a substance by 1°C.

## Key definitions

- **Internal energy**: The total energy of all particles in a substance (kinetic + potential).
- **Temperature**: A measure of the **average** kinetic energy of the particles.
- **Specific heat capacity ($c$)**: Energy required to raise 1 kg of a substance by 1°C (or 1 K). Unit: $\text{J/(kg K)}$.
- **Thermal equilibrium**: Two objects at the same temperature with no net energy transfer between them.

## Key formulas

**Specific heat capacity**

$c = \frac{\Delta E}{m\Delta\theta}$

Where $\Delta E$ is energy (J), $m$ is mass (kg), and $\Delta\theta$ is temperature change (°C or K).

**Thermal energy required**

$\Delta E = mc\Delta\theta$

**Electrical energy input (experiments)**

$\Delta E = IVt$

Where $I$ is current (A), $V$ is voltage (V), and $t$ is time (s).

## Why substances heat up differently

- Substances with **high** $c$ (e.g. water, $c \approx 4200\ \text{J/(kg K)}$) need lots of energy for a small temperature rise — they heat up slowly.
- Substances with **low** $c$ (e.g. lead, $c \approx 130\ \text{J/(kg K)}$) need little energy for the same rise — they heat up quickly.
- Water's high $c$ explains why the sea stays cooler than sand on a hot day.

## Experiments to determine $c$

**Solid (metal block)**

1. Use a cylindrical metal block with bores for an electrical heater and temperature sensor.
2. Wrap the block in insulating felt to reduce heat loss.
3. Record initial temperature $\theta_1$, run the heater for time $t$, then record maximum temperature $\theta_2$.
4. Calculate: $c = \dfrac{IVt}{m(\theta_2 - \theta_1)}$.

**Liquid**

1. Use a polystyrene cup with a lid to reduce heat loss.
2. Place heater and sensor in a known mass of liquid.
3. Apply the same method: $c = \dfrac{IVt}{m\Delta\theta}$.

**Assumption**: No thermal energy is lost to the surroundings.

## Graphs & diagrams

**Specific heat capacity experiment setup**

<div class="enlight-physics-diagram"><svg viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Specific heat capacity experiment">
      <rect x="120" y="60" width="160" height="100" rx="8" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
      <text x="200" y="52" text-anchor="middle" font-size="10" fill="#334155" font-weight="600">insulated metal block (mass m)</text>
      <rect x="145" y="80" width="22" height="60" rx="4" fill="#ef4444" stroke="#b91c1c"/>
      <text x="156" y="115" text-anchor="middle" font-size="9" fill="#fff" font-weight="700">heater</text>
      <line x1="200" y1="80" x2="200" y2="55" stroke="#2563eb" stroke-width="2"/>
      <circle cx="200" cy="50" r="7" fill="#2563eb" stroke="#1e40af"/>
      <text x="230" y="48" font-size="9" fill="#2563eb">thermometer</text>
      <rect x="60" y="175" width="80" height="40" rx="4" fill="#f1f5f9" stroke="#64748b"/>
      <text x="100" y="198" text-anchor="middle" font-size="9" fill="#334155">power supply</text>
      <text x="320" y="110" font-size="10" fill="#334155">ΔE = IVt = mcΔθ</text>
    </svg><p class="enlight-physics-diagram__caption">SHC experiment — electrical energy $IVt$ heats the block; measure mass $m$ and temperature rise $\Delta\theta$ to find $c = IVt / (m\Delta\theta)$.</p></div>

**Comparing specific heat capacities**

<div class="enlight-physics-diagram"><svg viewBox="0 0 360 200" width="360" height="200" role="img" aria-label="Comparing heat capacities of water and sand">
      <text x="180" y="22" text-anchor="middle" font-size="11" fill="#64748b" font-weight="600">Same energy supplied — different temperature rise</text>
      <rect x="50" y="130" width="100" height="40" rx="4" fill="#0ea5e9" opacity="0.8"/>
      <text x="100" y="155" text-anchor="middle" font-size="11" fill="#fff" font-weight="600">Water</text>
      <text x="100" y="100" font-size="10" fill="#0ea5e9">Small Δθ (high c)</text>
      <rect x="210" y="60" width="100" height="110" rx="4" fill="#f59e0b" opacity="0.8"/>
      <text x="260" y="120" text-anchor="middle" font-size="11" fill="#fff" font-weight="600">Sand</text>
      <text x="260" y="48" font-size="10" fill="#f59e0b">Large Δθ (low c)</text>
    </svg><p class="enlight-physics-diagram__caption">High specific heat capacity (water) means a smaller temperature rise for the same energy — sand heats up faster.</p></div>

## Steps / method

**Calculating specific heat capacity:**

1. **Identify** $\Delta E$ (from $IVt$ or given energy), $m$, and $\Delta\theta$.
2. **Convert** mass to kg if needed.
3. **Rearrange** $c = \Delta E / (m\Delta\theta)$.
4. **Substitute** and calculate; state units as $\text{J/(kg K)}$.

**Calculating energy or temperature change:**

1. Use $\Delta E = mc\Delta\theta$.
2. Rearrange for the unknown ($\Delta E$, $m$, $c$, or $\Delta\theta$).

## Common mistakes

**Ignoring insulation**: Heat loss to surroundings makes calculated $c$ too **low** (not enough energy appears to have been absorbed).

**Mass units**: Always convert grams to kilograms before substituting.

**Internal energy vs temperature**: Internal energy is total particle energy; temperature is average kinetic energy only.

## Examiner tip

State the assumption that **no thermal energy is lost to the surroundings** in experiment questions. A change of $1\ \text{K}$ equals a change of $1^\circ\text{C}$ for $\Delta\theta$ — you do not add 273.

## Quick check

Define internal energy.

Which requires more energy to heat: $1\ \text{kg}$ of water or $1\ \text{kg}$ of lead?

What is the SI unit for specific heat capacity?

## Worked example — Basic Calculation

Question: Calculate the temperature change ($\Delta\theta$) of $1\ \text{kg}$ of copper ($c = 400\ \text{J/(kg K)}$) when it is supplied with $4200\ \text{J}$ of thermal energy.

1. Use $\Delta E = mc\Delta\theta$: $4200 = 1 \times 400 \times \Delta\theta$.

2. Solve: $\Delta\theta = \frac{4200}{400} = 10.5\ \text{K}$ (or $10.5^\circ\text{C}$).

**Final answer:** $10.5\ \text{K}$.

## Worked example — Power and Time

Question: An electric heating coil supplies $50\ \text{W}$ of power to a $0.60\ \text{kg}$ metal block. In $90\ \text{s}$, the temperature rises from $20^\circ\text{C}$ to $45^\circ\text{C}$. Calculate the specific heat capacity $c$.

1. Calculate energy: $\Delta E = Pt = 50 \times 90 = 4500\ \text{J}$.

2. Temperature change: $\Delta\theta = 45 - 20 = 25^\circ\text{C}$.

3. Apply formula: $c = \frac{4500}{0.60 \times 25} = 300\ \text{J/(kg K)}$.

**Final answer:** $300\ \text{J/(kg K)}$.
