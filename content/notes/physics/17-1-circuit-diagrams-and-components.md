## Core idea

Circuit diagrams represent electric circuits using standard symbols. They help you solve problems and understand how components behave together.

## Main components of a circuit

A basic electric circuit has four essential parts:

- **Load**: Converts electrical energy to other forms (e.g. a lamp).
- **Power source**: Drives charge around the circuit (e.g. cell or battery).
- **Conductors**: Connect components (usually copper wires).
- **Switch**: Opens or closes the circuit.

## Common circuit symbols

- **Energy sources**: Cell, battery, d.c. supply, a.c. supply, generator
- **Measurement**: Ammeter, voltmeter, galvanometer
- **Resistors**: Fixed resistor, variable resistor (rheostat), LDR, NTC thermistor, potential divider
- **Safety and output**: Fuse, lamp, motor, heater, relay, transformer
- **Semiconductors**: Diode, LED

## Interpreting circuit arrangements

- **Open circuit**: A break in the path (open switch or broken wire) — no current flows.
- **Short circuit**: A low-resistance bypass path — current skips the intended component (e.g. lamp).

## Diodes and LEDs (supplement)

- **Diode**: Allows current in one direction only.
- **LED**: Light-emitting diode used as a current-direction indicator.
- **Half-wave rectification**: A diode blocks one half of an a.c. cycle to produce d.c.

## Graphs & diagrams

**Series circuit**

- Standard symbols: cell (long and short plate), lamp (circle with cross), resistor (rectangle).

<div class="ace-physics-diagram"><svg viewBox="0 0 380 170" width="380" height="170" role="img" aria-label="Series circuit">
      <g stroke="#334155" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 35 45 L 345 45 L 345 125 L 35 125 Z"/>
      </g>
      <rect x="68" y="41" width="18" height="8" fill="#fff"/>
      <line x1="72" y1="35" x2="72" y2="55" stroke="#334155" stroke-width="2"/>
      <line x1="82" y1="40" x2="82" y2="50" stroke="#334155" stroke-width="4"/>
      <text x="77" y="68" text-anchor="middle" font-size="8" fill="#64748b">cell</text>
      <circle cx="151" cy="45" r="13" stroke="#334155" stroke-width="2" fill="#fff"/>
      <line x1="143" y1="37" x2="159" y2="53" stroke="#334155" stroke-width="2"/>
      <line x1="159" y1="37" x2="143" y2="53" stroke="#334155" stroke-width="2"/>
      <text x="151" y="68" text-anchor="middle" font-size="8" fill="#64748b">lamp</text>
      <rect x="210" y="39" width="40" height="12" fill="#fff"/>
      <rect x="214" y="39" width="32" height="12" stroke="#334155" stroke-width="2" fill="none"/>
      <text x="230" y="68" text-anchor="middle" font-size="8" fill="#64748b">resistor</text>
      <text x="190" y="152" text-anchor="middle" font-size="10" fill="#475569">one path — current is the same at every point</text>
    </svg><p class="ace-physics-diagram__caption">Series circuit — components in one loop; same current through each component.</p></div>

**Parallel circuit**

- Components on separate branches between common supply rails.

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

Describe what is meant by an open circuit.

What is the basic function of a diode?

Which component is used to protect a circuit from excessive current?
