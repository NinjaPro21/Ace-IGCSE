## Core idea

In any complete electrical circuit there must be an energy provider (such as a battery) and an energy user (such as a lamp or resistor). Electromotive force (e.m.f.) and potential difference (p.d.) describe how energy is supplied to and used by the circuit.

## Electromotive force (e.m.f.)

The energy provider supplies the energy needed to drive charge around the circuit.

- **Definition**: The electrical work done by a source in moving a unit charge around a complete circuit.
- **Formula**:

$$
E = \frac{W}{Q}
$$

Where $E$ is e.m.f. (V), $W$ is work done or energy provided (J), and $Q$ is charge (C).

## Potential difference (p.d.)

When charge passes through a component, work is done as electrical energy is converted to other forms (heat, light, etc.).

- **Definition**: The work done by a unit charge passing through a specific component.
- **Formula**:

$$
V = \frac{W}{Q}
$$

Where $V$ is p.d. (V), $W$ is work done on the component (J), and $Q$ is charge (C).

## Key differences

Both e.m.f. and p.d. are measured in volts, but they describe different parts of the energy cycle:

- **e.m.f.**: Energy provided to the circuit by a source.
- **p.d.**: Energy converted from electrical form by a component.

## Measuring e.m.f. and p.d.

A voltmeter measures both e.m.f. and p.d.:

1. **Parallel connection**: Connect the voltmeter in parallel with the component or source being measured.
2. **Polarity**: Connect the positive (+) terminal of the voltmeter to the positive terminal of the cell.
3. **Types**: Voltmeters can be analogue (needle) or digital (numerical display).

## Graphs & diagrams

**e.m.f. vs p.d. in a circuit**

- **e.m.f.**: energy supplied per unit charge by the source (measure across the cell).
- **p.d.**: energy converted per unit charge by a component (measure across the load).

<div class="enlight-physics-diagram"><svg viewBox="0 0 420 210" width="420" height="210" role="img" aria-label="Measuring e.m.f. and p.d. with voltmeters">
      <g stroke="#334155" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 40 50 L 380 50 L 380 150 L 40 150 Z"/>
      </g>
      <rect x="72" y="46" width="18" height="8" fill="#fff"/>
      <line x1="76" y1="40" x2="76" y2="60" stroke="#334155" stroke-width="2"/>
      <line x1="86" y1="45" x2="86" y2="55" stroke="#334155" stroke-width="4"/>
      <text x="81" y="72" text-anchor="middle" font-size="8" fill="#64748b">cell</text>
      <circle cx="210" cy="50" r="14" stroke="#334155" stroke-width="2" fill="#fff"/>
      <line x1="202" y1="42" x2="218" y2="58" stroke="#334155" stroke-width="2"/>
      <line x1="218" y1="42" x2="202" y2="58" stroke="#334155" stroke-width="2"/>
      <text x="210" y="72" text-anchor="middle" font-size="8" fill="#64748b">lamp</text>
      <rect x="95" y="88" width="44" height="52" rx="4" fill="#ecfdf5" stroke="#16a34a" stroke-width="1.5"/>
      <text x="117" y="108" text-anchor="middle" font-size="14" font-weight="700" fill="#166534">V</text>
      <text x="117" y="128" text-anchor="middle" font-size="8" fill="#166534">e.m.f.</text>
      <line x1="81" y1="50" x2="117" y2="88" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="4 3"/>
      <line x1="81" y1="50" x2="117" y2="140" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="4 3"/>
      <rect x="250" y="88" width="44" height="52" rx="4" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
      <text x="272" y="108" text-anchor="middle" font-size="14" font-weight="700" fill="#1e40af">V</text>
      <text x="272" y="128" text-anchor="middle" font-size="8" fill="#1e40af">p.d.</text>
      <line x1="210" y1="50" x2="250" y2="88" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="4 3"/>
      <line x1="210" y1="64" x2="250" y2="140" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="4 3"/>
      <text x="210" y="178" text-anchor="middle" font-size="10" fill="#475569">Voltmeter always in parallel — across source (e.m.f.) or component (p.d.)</text>
      <text x="210" y="196" text-anchor="middle" font-size="9" fill="#64748b">Both measured in volts (V)</text>
    </svg><p class="enlight-physics-diagram__caption">Measuring e.m.f. and p.d. — voltmeter in parallel with the cell (energy supplied) or the lamp (energy converted).</p></div>

**Energy cycle**

- Source: $E = W/Q$ (e.m.f. — energy provided to the circuit).
- Component: $V = W/Q$ (p.d. — energy taken from the circuit).

<div class="enlight-physics-diagram"><svg viewBox="0 0 400 120" width="400" height="120" role="img" aria-label="Energy cycle e.m.f. and p.d.">
      <rect x="20" y="40" width="90" height="50" rx="8" fill="#ecfdf5" stroke="#16a34a" stroke-width="1.5"/>
      <text x="65" y="62" text-anchor="middle" font-size="10" fill="#166534" font-weight="600">Source</text>
      <text x="65" y="76" text-anchor="middle" font-size="8" fill="#166534">e.m.f. E</text>
      <line x1="110" y1="65" x2="155" y2="65" stroke="#334155" stroke-width="2" marker-end="url(#emf-arr)"/>
      <text x="132" y="55" text-anchor="middle" font-size="8" fill="#64748b">charge flow</text>
      <rect x="155" y="40" width="90" height="50" rx="8" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
      <text x="200" y="62" text-anchor="middle" font-size="10" fill="#1e40af" font-weight="600">Component</text>
      <text x="200" y="76" text-anchor="middle" font-size="8" fill="#1e40af">p.d. V</text>
      <line x1="245" y1="65" x2="290" y2="65" stroke="#334155" stroke-width="2" marker-end="url(#emf-arr)"/>
      <rect x="290" y="40" width="90" height="50" rx="8" fill="#fef2f2" stroke="#dc2626" stroke-width="1.5"/>
      <text x="335" y="62" text-anchor="middle" font-size="10" fill="#991b1b" font-weight="600">Surroundings</text>
      <text x="335" y="76" text-anchor="middle" font-size="8" fill="#991b1b">heat / light</text>
      <defs><marker id="emf-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#334155"/></marker></defs>
    </svg><p class="enlight-physics-diagram__caption">Energy cycle — the source supplies e.m.f.; the component has a p.d. as electrical energy is converted.</p></div>

## Worked example — Calculating energy

Question: The e.m.f. of a dry cell is $1.5\,\text{V}$. What is the energy provided to drive $0.4\,\text{C}$ of charge around a circuit?

Use $W = E \times Q$

$W = 1.5 \times 0.4 = 0.6\,\text{J}$

## Quick check

What is the SI unit for both e.m.f. and p.d.?

Should a voltmeter be connected in series or parallel?

True or false: Potential difference refers to the energy provided by a battery. (Answer: false — that is e.m.f.)
