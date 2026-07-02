## Core idea

A transformer is a device used to change the magnitude of an alternating voltage. It can increase a low voltage to a higher one (step-up) or decrease a high voltage to a lower one (step-down).

Construction of a Simple Transformer

A basic transformer consists of three main parts: Primary Coil ($N_p$ turns): The input coil connected to an alternating voltage source ($V_p$).

Secondary Coil ($N_s$ turns): The output coil where an e.m.f. ($V_s$) is induced.

Laminated Soft Iron Core: Both coils are wound around this core. Soft iron is used because it is easily magnetised and demagnetised, ensuring better magnetic linkage. The core is laminated (made of thin insulated sheets) to reduce energy loss through heat.

Principle of Operation

Transformers function based on the principle of electromagnetic induction: An alternating current in the primary coil creates a varying magnetic field in the soft iron core.

This varying magnetic field passes through the secondary coil, creating a change in magnetic flux.

This change induces an alternating e.m.f. (voltage) in the secondary coil.

Voltage and Turn Ratios

The relationship between the voltages and the number of turns in the coils is given by the formula: $\frac{V_p}{V_s} = \frac{N_p}{N_s}$

Step-up Transformer: Has more turns in the secondary coil ($N_s > N_p$), resulting in a higher output voltage ($V_s > V_p$).

Step-down Transformer: Has fewer turns in the secondary coil ($N_s < N_p$), resulting in a lower output voltage ($V_s < V_p$).

Power and Efficiency

In an ideal transformer (100% efficiency), the power supplied to the primary coil equals the power delivered by the secondary coil: $I_p V_p = I_s V_s$ In reality, some power is lost (usually as heat), and efficiency is calculated as:

$\text{Efficiency} = \frac{\text{Output Power}}{\text{Input Power}} \times 100%$

High-Voltage Transmission

Transformers are critical for the efficient transmission of electricity over long distances:

Reducing Power Loss: Power lost in cables is given by P = I^2R. By using a step-up transformer to increase voltage, the current (I) is decreased, which significantly reduces energy loss as heat in the transmission lines.

Safety: Step-down transformers are used at the end of the line to reduce voltage to safe levels (e.g., 240 V) for household use.

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 320 180" width="320" height="180" role="img" aria-label="Transformer">
      <rect x="120" y="40" width="80" height="100" fill="#e2e8f0" stroke="#64748b" rx="4"/>
      <path d="M130 60 Q150 80 130 100 Q150 120 130 140" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M190 60 Q170 80 190 100 Q170 120 190 140" fill="none" stroke="#dc2626" stroke-width="2"/>
      <text x="80" y="95" text-anchor="middle" font-size="10" fill="#2563eb">primary</text>
      <text x="240" y="95" text-anchor="middle" font-size="10" fill="#dc2626">secondary</text>
      <text x="160" y="165" text-anchor="middle" font-size="10" fill="#475569">iron core</text>
    </svg><p class="enlight-physics-diagram__caption">Transformer — alternating p.d. in the primary induces p.d. in the secondary; $V_p/V_s = N_p/N_s$.</p></div>

## Quick check

What material is typically used for a transformer core, and why?

In a step-down transformer, which coil has more turns?

Why is electricity transmitted at very high voltages over long distances?

True or False: A transformer can change the voltage of a steady direct current (d.c.) supply. (Answer: False; it requires a varying magnetic field produced by alternating current.)
