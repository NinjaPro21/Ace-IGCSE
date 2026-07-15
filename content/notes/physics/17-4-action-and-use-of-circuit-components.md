## Core idea

Specific components control or respond to electrical signals in a circuit. A central idea is the **potential divider** — using the relationship between resistance and p.d. to provide a chosen voltage to part of a system.

## Potential dividers

A potential divider uses resistors in series to provide a fraction of the total supply voltage.

**Fixed potential divider**

$$
V_{\text{out}} = \left(\frac{R_2}{R_1 + R_2}\right) \times V_E
$$

For constant current, p.d. across a component increases as its resistance increases.

## Variable potential dividers

Used when output voltage must be adjusted (e.g. volume controls, dimmer switches).

- **Rheostat method**: A two-terminal variable resistor — increasing resistance decreases $V_{\text{out}}$ to the rest of the circuit.
- **Potentiometer method**: Three terminals with a sliding contact — $V_{\text{out}}$ ranges from $0\,\text{V}$ to the full input voltage.

## Input transducers

Transducers respond to physical conditions (light, temperature). In a potential divider they let a circuit react automatically.

**NTC thermistor**

- Resistance **decreases** as temperature **increases**.
- Used in temperature alarms and cooling-fan triggers.

**Light-dependent resistor (LDR)**

- Resistance **decreases** as light intensity **increases**.
- Used in automatic streetlights (high resistance in the dark, low in bright light).

## Graphs & diagrams

</div><p class="ace-physics-diagram__caption">Series circuit with exam-standard symbols for a thermistor and LDR.</p></div>

<div class="ace-physics-diagram"><div class="ace-circuit-symbols">
      <svg viewBox="0 0 380 170" width="380" height="170" role="img" aria-label="Series circuit">
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
        <text x="190" y="152" text-anchor="middle" font-size="10" fill="#475569">one path — same current everywhere</text>
      </svg>
      <div class="ace-circuit-symbols__row">
        <svg viewBox="0 0 100 70" width="100" height="70" aria-label="Thermistor symbol">
          <line x1="10" y1="35" x2="25" y2="35" stroke="#334155" stroke-width="2"/>
          <rect x="25" y="28" width="50" height="14" stroke="#334155" stroke-width="2" fill="#fff"/>
          <line x1="30" y1="42" x2="70" y2="28" stroke="#334155" stroke-width="2"/>
          <line x1="75" y1="35" x2="90" y2="35" stroke="#334155" stroke-width="2"/>
          <text x="50" y="58" text-anchor="middle" font-size="9" fill="#64748b">thermistor</text>
        </svg>
        <svg viewBox="0 0 110 70" width="110" height="70" aria-label="LDR symbol">
          <line x1="8" y1="35" x2="22" y2="35" stroke="#334155" stroke-width="2"/>
          <circle cx="55" cy="35" r="18" stroke="#334155" stroke-width="2" fill="#fff"/>
          <rect x="45" y="30" width="20" height="10" stroke="#334155" stroke-width="2" fill="#fff"/>
          <line x1="65" y1="35" x2="102" y2="35" stroke="#334155" stroke-width="2"/>
          <line x1="32" y1="18" x2="48" y2="30" stroke="#334155" stroke-width="1.8"/>
          <line x1="38" y1="12" x2="54" y2="24" stroke="#334155" stroke-width="1.8"/>
          <line x1="44" y1="6" x2="60" y2="18" stroke="#334155" stroke-width="1.8"/>
          <polygon points="48,30 56,30 52,24" fill="#334155"/>
          <polygon points="54,24 62,24 58,18" fill="#334155"/>
          <polygon points="60,18 68,18 64,12" fill="#334155"/>
          <text x="55" y="62" text-anchor="middle" font-size="9" fill="#64748b">LDR</text>
        </svg>
        <svg viewBox="0 0 100 70" width="100" height="70" aria-label="Fixed resistor symbol">
          <line x1="10" y1="35" x2="28" y2="35" stroke="#334155" stroke-width="2"/>
          <rect x="28" y="28" width="44" height="14" stroke="#334155" stroke-width="2" fill="#fff"/>
          <line x1="72" y1="35" x2="90" y2="35" stroke="#334155" stroke-width="2"/>
          <text x="50" y="58" text-anchor="middle" font-size="9" fill="#64748b">resistor</text>
        </svg>
      </div>
    </div><p class="ace-physics-diagram__caption">Series circuit with exam-standard symbols for a thermistor and LDR.</p></div>

## Quick check

What is the main purpose of a potential divider circuit?

How does the resistance of an NTC thermistor change as it gets hotter?

True or false: An LDR has higher resistance in a dark room than in bright sunlight.

State one practical application for a variable potential divider.
