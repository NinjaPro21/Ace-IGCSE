## Core idea

Section 17.4 explores how specific components can be used to control or respond to electrical signals within a circuit. A central concept is the potential divider, which leverages the relationship between resistance and potential difference (p.d.) to provide specific voltages to different parts of a system.

Potential Dividers

A potential divider consists of resistors connected in series. It is designed to provide a fraction of the total available voltage from a power source to another part of the circuit.

Fixed Potential Divider: Uses two or more fixed resistors. The input voltage ($V_E$) is divided between them based on their resistance values.

Key Formula: The output voltage ($V_{out}$) across resistor $R_2$ is calculated as:

$V_{out} = \left( \frac{R_2}{R_1 + R_2} \right) \times V_E$

Proportionality: For a constant current, the p.d. across a component increases as its resistance increases.

Variable Potential Dividers

These are used when the output voltage needs to be adjusted, such as in volume controls for stereo systems or dimmer switches for lights.

Rheostat Method: A rheostat (variable resistor) is connected at two terminals. Increasing its resistance decreases the output voltage to the rest of the circuit.

Potentiometer Method: A potentiometer uses a three-terminal setup with a sliding contact. The position of the contact determines the ratio of resistance on either side, allowing $V_{out}$ to range from $1 \text{ V}$ to the full input voltage$.

Input Transducers

Transducers are electronic devices that respond to changes in physical conditions like light or temperature. When used in a potential divider, they allow a circuit to automatically react to its environment.

NTC Thermistor

Behaviour: A Negative Temperature Coefficient (NTC) thermistor has a resistance that decreases as the temperature increases.

Use: In a potential divider, as the temperature rises, the thermistor's resistance drops, which can be used to trigger temperature-controlled alarms or cooling fans.

Light-Dependent Resistor (LDR)

Behaviour: An LDR's resistance decreases as the intensity of light shining on it increases.

Use: They are commonly used in automatic streetlights, which switch on when it becomes dark (high resistance) and off when it is bright (low resistance).

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 360 140" width="360" height="140" role="img" aria-label="Series circuit">
      <rect x="40" y="50" width="280" height="60" fill="none" stroke="#334155" stroke-width="2"/>
      <rect x="70" y="65" width="40" height="30" fill="#fef08a" stroke="#ca8a04"/>
      <text x="90" y="84" text-anchor="middle" font-size="9" fill="#854d0e">cell</text>
      <circle cx="180" cy="80" r="18" fill="#fef3c7" stroke="#f59e0b"/>
      <text x="180" y="84" text-anchor="middle" font-size="9" fill="#92400e">lamp</text>
      <rect x="250" y="65" width="40" height="30" fill="#e2e8f0" stroke="#64748b"/>
      <text x="270" y="84" text-anchor="middle" font-size="9" fill="#334155">R</text>
      <text x="180" y="130" text-anchor="middle" font-size="10" fill="#475569">single loop — same I everywhere</text>
    </svg><p class="enlight-physics-diagram__caption">Series circuit — one path for current; same current through each component.</p></div>

## Quick check

What is the main purpose of a potential divider circuit?

How does the resistance of an NTC thermistor change as it gets hotter?

True or False: An LDR would have a higher resistance in a dark room than in a sunlit room.

State one practical application for a variable potential divider.
