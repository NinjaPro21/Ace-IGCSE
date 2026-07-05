## Core idea

Approximations establish limits of precision for numerical values through rounding scales, significant figures, and boundary intervals. Error bounds calculate the minimum and maximum possible exact continuous limits that a value could take before rounding. Use this framework to manage compound engineering limits or to determine worst-case scenario ranges in continuous measurements.

## Key formulas

$$
\text{Upper Bound (UB)} = \text{Rounded Value} + \frac{\text{Degree of Accuracy}}{2}
$$
$$
\text{Lower Bound (LB)} = \text{Rounded Value} - \frac{\text{Degree of Accuracy}}{2}
$$
$$
\text{Max Quotient Bound} = \frac{\text{UB}_{\text{Numerator}}}{\text{LB}_{\text{Denominator}}} \quad \text{Min Quotient Bound} = \frac{\text{LB}_{\text{Numerator}}}{\text{UB}_{\text{Denominator}}}
$$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 360 80" width="360" height="80" role="img" aria-label="Rounding on number line">
      <line x1="30" y1="40" x2="330" y2="40" stroke="#a8a29e" stroke-width="2"/>
      <line x1="80" y1="30" x2="80" y2="50" stroke="#a8a29e"/><text x="80" y="65" text-anchor="middle" font-size="10">3.4</text>
      <line x1="280" y1="30" x2="280" y2="50" stroke="#a8a29e"/><text x="280" y="65" text-anchor="middle" font-size="10">3.5</text>
      <circle cx="230" cy="40" r="6" fill="#5b8def"/>
      <text x="230" y="25" text-anchor="middle" font-size="9" fill="#5b8def">3.47</text>
    </svg><p class="enlight-physics-diagram__caption">Rounding — identify the two labelled values; decide which is nearer (e.g. 3.47 → 3.5 to 1 d.p.).</p></div>

## Steps / method

Identify the given degree of precision (e.g., nearest $10$, nearest $0.1$, or to 2 significant figures) and divide this value by. .

Compute the absolute limits by adding this half-unit to find the upper bound, and subtracting it to find the lower bound.

For compound multi-variable calculations, select combinations strategically: to maximize an expression addition use $\text{UB} + \text{UB}$, to maximize a subtraction use $\text{UB} - \text{LB}$, and to maximize a product use $\text{UB} \times \text{UB}$.

State final answers using appropriate inequality notation: $\text{LB} \le x < \text{UB}$.

## Examiner tip

Pay close attention to the formatting of bounds questions. While an upper bound value might technically truncate at something like $4.24999\dots$ ($2$) as the upper bound. Use the strict inequality symbol ($<$ ) to show that the actual value can approach but not equal this upper bound limit.

## Quick check

If a continuous measurement is rounded to the nearest whole unit, its total boundary span between the lower and upper bounds will equal exactly one whole unit.

## Worked example — Example 1 (May 2022 P21 Q12)

A rectangular field measures $65\text{ m}$ by $42\text{ m}$, with both values rounded to the nearest whole meter. Calculate the upper bound for the total perimeter of this field.

Identify the degree of accuracy: rounded to the nearest $1\text{ m}$. Divide this value by 2 to establish the bound variance:$1 \div 2 = 0.5\text{ m}$.

Determine the upper bounds for both independent dimensions by adding the variance: $\text{UB}_{\text{Length}} = 65 + 0.5 = 65.5\text{ m}$

$$
\text{UB}_{\text{Width}} = 42 + 0.5 = 42.5\text{ m}
$$

State the perimeter formula for a rectangle: $\text{Perimeter} = 2 \times (\text{Length} + \text{Width})$.

Substitute the upper bounds into the formula to maximize the perimeter: $\text{Max Perimeter} = 2 \times (65.5 + 42.5) = 2 \times (108) = 216\text{ m}$.

## Worked example — Example 2 (Nov 2023 P41 Q4c)

Calculate the lower bound for the acceleration value $a = \frac{v}{t}$ given that $v = 24.6\text{ m/s}$ rounded to $1$ decimal place and $t = 5.42\text{ s}$rounded to 2 decimal places.

Calculate the boundary variance for the velocity parameter $v. 0.1$): $0.1 \div 2 = 0.05$. $\text{LB}_v = 24.6 - 0.05 = 24.55\text{ m/s}$

Calculate the boundary variance for the time parameter $t$ ($2$): $0.01 \div 2 = 0.005$. $\text{UB}_t = 5.42 + 0.005 = 5.425\text{ s}$

To calculate the minimum possible value for a quotient, divide the minimum numerator value ($\text{LB}_v$ ($2$).

Complete the calculation: $\text{Min } a = \frac{24.55}{5.425} \approx 4.5253456\text{ m/s}^2$.

Round the final value to $3$ significant figures as standard for non-exact values: $4.53\text{ m/s}^2$.
