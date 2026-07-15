## Core idea

Half-life is a fundamental "internal clock" for radioactive materials. It is the reason why some nuclear waste remains dangerous for thousands of years while medical tracers used in hospitals disappear safely within hours. Mastering half-life allows scientists to date ancient fossils and engineers to design reliable safety systems like smoke detectors.

## Key definitions

- **Half-life ($T_{1/2}$)**: The time taken for half the nuclei of a specific radioactive isotope in a sample to decay.
- **Count Rate**: The number of radioactive emissions detected by a counter (like a Geiger-Müller tube) per unit of time, such as counts per second (counts/s) or counts per minute (counts/min).
- **Radioactive Isotope**: An unstable variety of an element that undergoes spontaneous decay.
- **Corrected Count Rate**: The count rate of a sample after the environmental background radiation has been subtracted.

## Syllabus wording

Define half-life of a particular isotope.
Recall and use the definition of half-life in simple calculations, which may involve data or decay curves.
S Calculate half-life from data or decay curves from which background radiation has not been subtracted.
S Explain how the type of radiation emitted and the half-life of an isotope determine its suitability for specific applications (e.g., medical tracers vs. smoke alarms).

## Key formulas

**Remaining Nuclei/Activity**

Applies to any sample where $n$ is the number of elapsed half-lives.

$$
\text{Remaining} = \text{Initial} \times \left(\frac{1}{2}\right)^n
$$

**Corrected Count Rate**

Required before calculating half-life from raw data.

$$
\text{Corrected rate} = \text{Measured rate} - \text{Background rate}
$$

**Number of Half-lives**

$$
n = \frac{\text{Total time}}{\text{Half-life}}
$$

## Graphs & diagrams

- **Decay Curve**: A graph showing how the number of undecayed nuclei or the count rate decreases over time. It is always a downward curve that never quite reaches zero.
- **Interpretation**: To find half-life from a graph, pick a starting value on the y-axis (e.g., 800 counts/s), find its half (400 counts/s), and measure the time interval on the x-axis between these two points.
- **Background Plateau**: If background radiation is not subtracted, the curve will level off at a constant value (the background rate) rather than approaching the x-axis.

<div class="ace-physics-diagram"><svg viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Half life decay curve">
      <line x1="55" y1="195" x2="400" y2="195" stroke="#64748b" stroke-width="1.5"/>
      <line x1="55" y1="195" x2="55" y2="25" stroke="#64748b" stroke-width="1.5"/>
      <text x="230" y="218" text-anchor="middle" font-size="12" fill="#475569">Time</text>
      <text x="20" y="110" transform="rotate(-90 20 110)" text-anchor="middle" font-size="12" fill="#475569">Count rate</text>
      <path d="M65 55 Q180 120 370 175" fill="none" stroke="#7c3aed" stroke-width="2.5"/>
      <line x1="140" y1="195" x2="140" y2="110" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <line x1="55" y1="110" x2="140" y2="110" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <text x="140" y="210" text-anchor="middle" font-size="10" fill="#64748b">1 half-life</text>
      <text x="70" y="105" font-size="10" fill="#64748b">½</text>
    </svg><p class="ace-physics-diagram__caption">Radioactive decay — activity (or count rate) halves every half-life; curve never reaches zero.</p></div>

## Steps / method

Exam Method for Finding Half-life from a Graph (with Background):

Identify Background: Look at the "tail" of the graph where the line becomes horizontal. This value is the background radiation.

Determine Initial Corrected Rate: Subtract the background from the starting y-intercept.

Find the Target Value: Divide the initial corrected rate by 2 and add the background back in to find the corresponding point on the raw y-axis.

Read the Time: Draw a line from that y-value to the curve, then down to the x-axis. The time value is the half-life.

## Common mistakes

Linear Decay: Thinking the substance will be completely gone in two half-lives (e.g., if half-life is 10 min, thinking it's all gone in 20 min). Decay is exponential, not linear.

External Factors: Stating that half-life can be sped up by heating the sample. Decay is spontaneous and random; it is unaffected by physical conditions.

Total Sample Mass: Confusing the mass of the isotope with the mass of the sample. The sample's total mass barely changes; it's just that the radioactive nuclei are turning into different, stable nuclei.

## Examiner tip

Choosing Isotopes: When asked to choose an isotope, remember: medical tracers need short half-lives (hours) so they don't stay in the patient, but smoke alarms need long half-lives (years) so they don't need frequent replacement.

Show Lines: On graph questions, always draw dotted lines to show how you arrived at your answer from the x and y axes to earn full "working" marks.

## Quick check

If a sample has 120 million nuclei, how many remain after 3 half-lives?

Why is the decay curve for an isotope considered "random"?

An isotope emits alpha particles and has a half-life of 430 years. Is it more likely used in a smoke detector or as a medical tracer?

## Worked example — Basic Calculation

Question: A radioactive source has a half-life of 10 minutes. If the initial count rate is 1200 counts/min, what will the approximate count rate be after 20 minutes?

Calculate the number of half-lives ($n$):

$$
\frac{20\ \text{min}}{10\ \text{min}} = 2\ \text{half-lives}
$$

First half-life: $1200 / 2 = 600$ counts/min.

Second half-life: $600 / 2 = 300$ counts/min.

**Final answer:** Approximately 300 counts/min.

## Worked example — Background Subtraction (Harder)

Question: In an experiment, the measured count rate of an isotope is 423 counts/min. The background rate is 20 counts/min. After 40 minutes, the measured rate is 124 counts/min. Estimate the half-life.

Initial corrected rate: $423 - 20 = 403$ counts/min.

Final corrected rate: $124 - 20 = 104$ counts/min.

Determine $n$: $403 \rightarrow 201$ (1 half-life) $\rightarrow 100$ (2 half-lives). Since 104 is close to 100, roughly 2 half-lives have passed.

Calculate half-life:

$$
\frac{40\ \text{minutes}}{2} = 20\ \text{minutes}
$$

**Final answer:** Approximately 20 minutes.

### Trap

Students often divide the raw values ($423 / 124$) directly. You must subtract the background first to see how the isotope itself is decaying.
