## Core idea

Resistance measures how difficult it is for current to pass through a conductor. When resistance is high, charge flows less easily and the current is reduced.

## Key formulas

$$
R = \frac{V}{I}
$$

Where $R$ is resistance ($\Omega$), $V$ is potential difference (V), and $I$ is current (A).

One ohm ($\Omega$) is the resistance when 1 V drives 1 A through a component.

## Measuring resistance

Use the voltmeter–ammeter method:

1. **Setup**: Connect an ammeter in series and a voltmeter in parallel with the component.
2. **Procedure**: Use a variable resistor to vary the current and record pairs of $V$ and $I$.
3. **Calculation**: Find $R = V/I$ for each pair, or plot $V$ against $I$ — for an ohmic conductor, the gradient equals $R$.

## Ohm's law

Ohm's law states that current through a metallic conductor is directly proportional to the potential difference across it, provided temperature and other physical conditions stay constant.

- **Ohmic conductors**: Obey Ohm's law (e.g. metals at constant temperature). The $I$–$V$ graph is a straight line through the origin.
- **Non-ohmic conductors**: Resistance changes as $V$ or $I$ changes.

## Common non-ohmic conductors

### Filament lamp

The $I$–$V$ graph forms an **S-shape** passing through the origin. It is non-linear because a filament lamp does not obey Ohm's law.

- **Shape**: The curve starts steep at the origin but gradually flattens (gradient decreases) as voltage increases in both positive and negative directions.
- **Physics**: As voltage increases, more current flows and the filament heats up. Lattice ions vibrate more, increasing resistance.
- **Graph behaviour**: Because $R = V/I$ increases, current rises more slowly at high voltages and the curve levels off.

### Semiconductor diode

The $I$–$V$ graph is highly asymmetrical — a diode allows current in one direction only.

- **Forward bias (positive $V$)**: Current stays near zero from $0\,\text{V}$ up to a threshold (~$0.6\,\text{V}$–$0.7\,\text{V}$ for silicon). Above this, the graph bends sharply upward — resistance drops to near zero.
- **Reverse bias (negative $V$)**: The graph stays flat on the horizontal axis — current is effectively zero (near-infinite resistance).

## Factors affecting resistance

The resistance of a metallic wire depends on:

- **Length ($l$)**: Resistance is directly proportional to length — a longer wire has more obstacles for electrons.
- **Cross-sectional area ($A$)**: Resistance is inversely proportional to area — a thicker wire has lower resistance.
- **Temperature**: For most metals, resistance increases as temperature rises. (NTC thermistors are an exception — resistance decreases when temperature rises.)

## Graphs & diagrams

**Ohmic conductor**

- Straight line through the origin at constant temperature.
- Gradient $= 1/R$.

<div class="ace-physics-diagram"><svg viewBox="0 0 340 240" width="340" height="240" role="img" aria-label="I-V graph for ohmic conductor">
      <line x1="170" y1="30" x2="170" y2="210" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="50" y1="120" x2="310" y2="120" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="50" y1="210" x2="310" y2="210" stroke="#64748b" stroke-width="1.5"/>
      <line x1="50" y1="210" x2="50" y2="30" stroke="#64748b" stroke-width="1.5"/>
      <text x="180" y="232" text-anchor="middle" font-size="11" fill="#475569">Voltage V</text>
      <text x="22" y="120" transform="rotate(-90 22 120)" text-anchor="middle" font-size="11" fill="#475569">Current I</text>
      <line x1="50" y1="210" x2="280" y2="50" stroke="#2563eb" stroke-width="2.5"/>
      <text x="230" y="95" font-size="10" fill="#2563eb">gradient = 1/R</text>
      <text x="170" y="18" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Ohmic conductor</text>
    </svg><p class="ace-physics-diagram__caption">Ohmic conductor — $I$–$V$ graph is a straight line through the origin; gradient $= 1/R$.</p></div>

**Filament lamp**

- S-shaped curve; gradient decreases as $V$ increases (resistance rises with temperature).

<div class="ace-physics-diagram"><svg viewBox="0 0 340 240" width="340" height="240" role="img" aria-label="I-V graph for filament lamp">
      <line x1="170" y1="30" x2="170" y2="210" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="50" y1="120" x2="310" y2="120" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="50" y1="210" x2="310" y2="210" stroke="#64748b" stroke-width="1.5"/>
      <line x1="50" y1="210" x2="50" y2="30" stroke="#64748b" stroke-width="1.5"/>
      <text x="180" y="232" text-anchor="middle" font-size="11" fill="#475569">Voltage V</text>
      <text x="22" y="120" transform="rotate(-90 22 120)" text-anchor="middle" font-size="11" fill="#475569">Current I</text>
      <path d="M 50 210 C 90 195, 130 165, 170 130 S 250 75 280 58" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
      <path d="M 290 210 C 250 195, 210 165, 170 130 S 90 75 60 58" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
      <text x="255" y="70" font-size="9" fill="#f59e0b">levels off</text>
      <text x="170" y="18" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Filament lamp</text>
    </svg><p class="ace-physics-diagram__caption">Filament lamp — S-shaped curve through the origin; gradient decreases as $V$ increases (resistance rises with temperature).</p></div>

**Semiconductor diode**

- Forward bias: near-zero current until ~$0.6\,\text{V}$, then steep rise.
- Reverse bias: current stays at zero for negative $V$.

<div class="ace-physics-diagram"><svg viewBox="0 0 340 240" width="340" height="240" role="img" aria-label="I-V graph for semiconductor diode">
      <line x1="170" y1="30" x2="170" y2="210" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="50" y1="120" x2="310" y2="120" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="50" y1="210" x2="310" y2="210" stroke="#64748b" stroke-width="1.5"/>
      <line x1="50" y1="210" x2="50" y2="30" stroke="#64748b" stroke-width="1.5"/>
      <text x="180" y="232" text-anchor="middle" font-size="11" fill="#475569">Voltage V</text>
      <text x="22" y="120" transform="rotate(-90 22 120)" text-anchor="middle" font-size="11" fill="#475569">Current I</text>
      <line x1="50" y1="210" x2="198" y2="210" stroke="#7c3aed" stroke-width="2.5"/>
      <line x1="50" y1="210" x2="170" y2="210" stroke="#7c3aed" stroke-width="2.5"/>
      <path d="M 198 210 C 210 208, 218 195, 225 170 S 240 90 265 45" fill="none" stroke="#7c3aed" stroke-width="2.5"/>
      <line x1="198" y1="203" x2="198" y2="217" stroke="#64748b" stroke-width="1.5"/>
      <text x="198" y="225" text-anchor="middle" font-size="8" fill="#64748b">~0.6 V</text>
      <text x="95" y="200" font-size="9" fill="#7c3aed">reverse: I ≈ 0</text>
      <text x="245" y="55" font-size="9" fill="#7c3aed">forward: steep rise</text>
      <text x="170" y="18" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Semiconductor diode</text>
    </svg><p class="ace-physics-diagram__caption">Semiconductor diode — almost zero current below ~0.6 V (forward); flat at $I = 0$ for reverse bias (negative $V$).</p></div>

## Quick check

What is the SI unit of resistance?

If the potential difference across a resistor is doubled while its resistance stays constant, what happens to the current?

How does the resistance of a wire change if its length is doubled?

True or false: A filament lamp is an ohmic conductor.
