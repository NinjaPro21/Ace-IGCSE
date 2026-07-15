## Core idea

In a parallel circuit, components are connected in two or more branches. Charge has more than one path to flow — this is fundamentally different from a series circuit.

## Current in a parallel circuit

- The main current $I$ splits at a junction into branch currents $I_1$, $I_2$, … and recombines before returning to the source.
- Conservation of charge: $I = I_1 + I_2 + \cdots + I_n$
- The source current is always larger than the current in any single branch.

## Potential difference (p.d.)

The p.d. across each parallel branch is the same:

$$
V_E = V_1 = V_2
$$

Each component connected in parallel across a source receives the full e.m.f. (assuming no other series components).

## Combined resistance

For resistors in parallel, the combined resistance is less than any individual resistance:

$$
\frac{1}{R} = \frac{1}{R_1} + \frac{1}{R_2} + \cdots + \frac{1}{R_n}
$$

Adding another branch gives an extra current path, increasing total current and lowering overall resistance.

## Advantages and disadvantages

| Feature | Effect |
|---------|--------|
| Independence | If one lamp blows, others keep working — each branch is its own circuit |
| Brightness | Lamps in parallel are brighter than in series — each gets full source voltage |
| Power consumption | Source is depleted faster — total current is higher |

## Practical applications

- **Household lighting**: Lamps in parallel each receive full mains voltage (e.g. 240 V); one failure does not darken the whole house.
- **Wall sockets**: Supplied in parallel on a ring main so appliances operate independently.

## Graphs & diagrams

**Parallel circuit**

- Two branches connected across the same supply — same p.d. across each branch.

<div class="ace-physics-diagram"><svg viewBox="0 0 400 190" width="400" height="190" role="img" aria-label="Parallel circuit">
      <g stroke="#334155" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 45 50 L 355 50"/>
        <path d="M 45 50 L 45 78"/>
        <path d="M 45 88 L 45 140 L 355 140"/>
        <path d="M 355 50 L 355 140"/>
        <path d="M 170 50 L 170 88"/>
        <path d="M 170 112 L 170 140"/>
        <path d="M 260 50 L 260 88"/>
        <path d="M 260 112 L 260 140"/>
      </g>
      <line x1="38" y1="78" x2="52" y2="78" stroke="#334155" stroke-width="2"/>
      <line x1="38" y1="88" x2="52" y2="88" stroke="#334155" stroke-width="4"/>
      <text x="28" y="92" text-anchor="middle" font-size="8" fill="#64748b">cell</text>
      <circle cx="170" cy="100" r="12" stroke="#334155" stroke-width="2" fill="#fff"/>
      <line x1="163" y1="93" x2="177" y2="107" stroke="#334155" stroke-width="2"/>
      <line x1="177" y1="93" x2="163" y2="107" stroke="#334155" stroke-width="2"/>
      <text x="128" y="100" text-anchor="end" font-size="8" fill="#64748b">lamp 1</text>
      <circle cx="260" cy="100" r="12" stroke="#334155" stroke-width="2" fill="#fff"/>
      <line x1="253" y1="93" x2="267" y2="107" stroke="#334155" stroke-width="2"/>
      <line x1="267" y1="93" x2="253" y2="107" stroke="#334155" stroke-width="2"/>
      <text x="288" y="100" font-size="8" fill="#64748b">lamp 2</text>
      <text x="200" y="175" text-anchor="middle" font-size="10" fill="#475569">two branches — same p.d. across each lamp</text>
    </svg><p class="ace-physics-diagram__caption">Parallel circuit — current splits between branches; same p.d. across each branch.</p></div>

## Quick check

In a parallel circuit with branch currents 1 A and 2 A, what is the total current from the source?

True or false: The combined resistance of two $10\,\Omega$ resistors in parallel is $20\,\Omega$.

Why are household appliances connected in parallel rather than in series?
