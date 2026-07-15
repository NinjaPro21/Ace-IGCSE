## Core idea

A transformer changes the magnitude of an alternating voltage — step-up (increase) or step-down (decrease).

## Construction

- **Primary coil** ($N_p$ turns): Connected to alternating input voltage $V_p$
- **Secondary coil** ($N_s$ turns): Where induced output voltage $V_s$ appears
- **Laminated soft iron core**: Easily magnetised/demagnetised; lamination reduces heat loss

## Principle of operation

1. Alternating current in the primary creates a varying magnetic field in the core.
2. The varying field passes through the secondary, changing magnetic flux.
3. This induces an alternating e.m.f. in the secondary.

## Voltage and turn ratios

$$
\frac{V_p}{V_s} = \frac{N_p}{N_s}
$$

- **Step-up**: $N_s > N_p$ → $V_s > V_p$
- **Step-down**: $N_s < N_p$ → $V_s < V_p$

## Power and efficiency

Ideal transformer: $I_p V_p = I_s V_s$

$$
\text{Efficiency} = \frac{\text{Output power}}{\text{Input power}} \times 100\%
$$

## High-voltage transmission

Power lost in cables: $P = I^2 R$. Step-up transformers increase voltage and reduce current, cutting transmission losses. Step-down transformers reduce voltage to safe household levels (e.g. 240 V).

## Graphs & diagrams

**Transformer structure**

- Laminated soft iron core; primary coil ($N_p$, $V_p$) and secondary coil ($N_s$, $V_s$).
- Step-up when $N_s > N_p$; step-down when $N_s < N_p$.

<div class="ace-em-3d ace-physics-diagram" data-scene="transformer"></div>

**High-voltage grid transmission**

- Power station → step-up transformer → HV pylons → step-down transformer → homes.
- High voltage reduces current and $I^2 R$ cable losses.

<div class="ace-em-3d ace-physics-diagram" data-scene="transmission-grid"></div>

**Primary vs secondary voltage waves**

- Two a.c. sine waves of the same frequency but different amplitudes after transformation.

<div class="ace-em-3d ace-physics-diagram" data-scene="transformer-voltage"></div>

## Quick check

What material is typically used for a transformer core, and why?

In a step-down transformer, which coil has more turns?

Why is electricity transmitted at very high voltages over long distances?

True or false: A transformer can change the voltage of a steady d.c. supply. (Answer: false — it needs a varying magnetic field from a.c.)
