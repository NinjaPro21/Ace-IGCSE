## Core idea

Use mean, median, mode, range, and interquartile range (IQR) to summarise data and compare groups — both the typical value (centre) and how spread out the data is (consistency).

## Key formulas

$$
\text{Estimated mean} = \frac{\sum (f \times x)}{\sum f} \quad \text{where } x \text{ is the class midpoint}
$$

$$
\text{IQR} = Q_3 - Q_1
$$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 360 220" width="360" height="220" role="img" aria-label="Grouped frequency bars with midpoints">
      <line x1="50" y1="170" x2="330" y2="170" stroke="#a8a29e"/>
      <line x1="50" y1="170" x2="50" y2="30" stroke="#a8a29e"/>
      <text x="20" y="105" transform="rotate(-90 20 105)" text-anchor="middle" font-size="10" fill="#6b6b6b">frequency f</text>
      <!-- bars: f=4, f=12, f=6 — heights 4*10=40, 12*10=120, 6*10=60 -->
      <rect x="70" y="130" width="60" height="40" fill="#5b8def" opacity="0.75" stroke="#5b8def"/>
      <rect x="150" y="50" width="60" height="120" fill="#5b8def" opacity="0.75" stroke="#5b8def"/>
      <rect x="230" y="110" width="60" height="60" fill="#5b8def" opacity="0.75" stroke="#5b8def"/>
      <text x="100" y="124" text-anchor="middle" font-size="10" fill="#1a1a1a" font-weight="600">f = 4</text>
      <text x="180" y="44" text-anchor="middle" font-size="10" fill="#1a1a1a" font-weight="600">f = 12</text>
      <text x="260" y="104" text-anchor="middle" font-size="10" fill="#1a1a1a" font-weight="600">f = 6</text>
      <!-- midpoint markers (centre of each class) -->
      <line x1="100" y1="130" x2="100" y2="170" stroke="#b59a73" stroke-width="2" stroke-dasharray="3 2"/>
      <line x1="180" y1="50" x2="180" y2="170" stroke="#b59a73" stroke-width="2" stroke-dasharray="3 2"/>
      <line x1="260" y1="110" x2="260" y2="170" stroke="#b59a73" stroke-width="2" stroke-dasharray="3 2"/>
      <circle cx="100" cy="170" r="4" fill="#b59a73"/>
      <circle cx="180" cy="170" r="4" fill="#b59a73"/>
      <circle cx="260" cy="170" r="4" fill="#b59a73"/>
      <text x="100" y="186" text-anchor="middle" font-size="9" fill="#6b6b6b">0–10</text>
      <text x="180" y="186" text-anchor="middle" font-size="9" fill="#6b6b6b">10–30</text>
      <text x="260" y="186" text-anchor="middle" font-size="9" fill="#6b6b6b">30–50</text>
      <text x="100" y="202" text-anchor="middle" font-size="9" fill="#b59a73" font-weight="600">mid x = 5</text>
      <text x="180" y="202" text-anchor="middle" font-size="9" fill="#b59a73" font-weight="600">mid x = 20</text>
      <text x="260" y="202" text-anchor="middle" font-size="9" fill="#b59a73" font-weight="600">mid x = 40</text>
    </svg><p class="enlight-physics-diagram__caption">Grouped data — use each class midpoint $x$ (not the width). Mean $= \sum(f \times x) \div \sum f$.</p></div>

## Steps / method

**Estimated mean (grouped data)**

Find the midpoint of each class: $x = \frac{\text{lower} + \text{upper}}{2}$.

Multiply each midpoint by its frequency: $f \times x$.

Add all the $f \times x$ values. Divide by $\sum f$ (total frequency).

**Comparing two groups**

Compare centres — which mean or median is higher?

Compare spread — which range or IQR is smaller (more consistent)?

## Examiner tip

Do not multiply by class width, and do not divide by the number of rows — divide by $\sum f$.

## Quick check

The median marks the middle of the data; the IQR measures spread of the middle 50%.

## Worked example — Example 1 (May 2022 P41 Q3b)

Calculate an estimate of the mean for this frequency table:

| Interval | Frequency |
|----------|-----------|
| $0 < x \le 10$ | 4 |
| $10 < x \le 30$ | 12 |

Midpoints: $x_1 = 5$, $x_2 = 20$.

$(4 \times 5) + (12 \times 20) = 260$. Total frequency $= 16$.

$\text{Mean} = \frac{260}{16} = 16.25$

## Worked example — Example 2 (Nov 2021 P42 Q8d)

Class A: median $65\%$, IQR $8\%$. Class B: median $62\%$, IQR $15\%$. Compare the classes.

Class A has a **higher average** (median $65\% > 62\%$).

Class A is **more consistent** — smaller IQR ($8\% < 15\%$), so marks are less spread out.
