## Core idea

This topic governs structural applications of real-world proportional arithmetic, focusing on financial growth, currency conversions, and rate systems. It is utilized to calculate compound changes, reconstruct original quantities before a percentage shift, and evaluate multi-currency or compound kinematic rates. Mastery of these operations ensures accurate tracking of dimensions that scale dynamically over discrete or continuous intervals.

## Key formulas

$P \left(1 + \frac{r}{100}\right)^n

$$
\text{Original Value} = \frac{\text{New Value}}{1 \pm \frac{\% \text{ Change}}{100}}

\text{Average Speed} = \frac{\text{Total Distance}}{\text{Total Time}}
$$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 200 200" width="200" height="200" role="img" aria-label="Percentage pie chart">
      <circle cx="100" cy="100" r="70" fill="#f8fafc" stroke="#cbd5e1"/>
      <path d="M100 100 L100 30 A70 70 0 0 1 170 100 Z" fill="#2563eb" opacity="0.8"/>
      <text x="130" y="70" font-size="11" fill="#1e3a8a">25%</text>
    </svg></div>

Percentages — slice size shows proportion of the whole; 25% = quarter of the circle.

## Steps / method

Reconstructing an Original Quantity (Reverse Percentages) Identify whether the given final value represents an increase or decrease from the baseline.

Express the final value as a percentage of the original quantity (e.g., a $12\%$ profit means the final value is $112\%$ or a multiplier of $1.12$).

Divide the final given value by the percentage multiplier to isolate the original value.

Do not calculate the percentage of the final value and subtract it.

Multi-Step Currency Conversion Write down the explicit conversion rate as a ratio equation: $\text{Currency A} : \text{Currency B}$.

Multiply by the exchange rate when converting from the base currency ($1 \rightarrow \text{Rate}$), or divide by the exchange rate when converting backward.

For multi-step conversions involving commissions, subtract the percentage fee from the starting amount before processing the exchange.

## Examiner tip

Examiners frequently use the phrase "Calculate the price before the reduction" or "The price includes a $15\%$ tax". A common fatal error is calculating $15\%$ of the final price and subtracting or adding it. You must always set up an algebraic statement where $\text{Original} \times \text{Multiplier} = \text{New Amount}$ and solve for the unknown original value.

## Quick check

If an asset depreciates by $8\%$ annually for $3$ years, its final value multiplier is $(0.92)^3$.

## Worked examples

May 2021 Paper 22 Q14: A shop sells a laptop for $575$, which includes a profit of 2. Find the cost price of the laptop.

Step 1: The selling price represents $100\% + 15\% = 115\%$ of the original cost price.

Step 2: Convert the percentage to a decimal multiplier: $1.15$.

Step 3: Set up the division: $\text{Cost Price} = \frac{575}{1.15} =$5002

November 2022 Paper 41 Q3a: An investor deposits
$$2400$ at a rate of 2 per year compound interest. Calculate the total interest earned at the end of.  years, giving your answer correct to the nearest cent. $

Step 1: Substitute values into the compound interest formula: $A = 2400 \left(1 + \frac{2.5}{100}\right)^5$.

Step 2: Compute the total accumulated value: $A = 2400 \times (1.025)^5 = 2400 \times 1.131408 = 2715.38$.

Step 3: Isolate the interest earned by subtracting the original principal: $\text{Interest} = 2715.38 - 2400 =$315.382
