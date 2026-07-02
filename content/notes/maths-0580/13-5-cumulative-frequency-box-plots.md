## Core idea

A cumulative frequency curve tracks running totals. From it you read quartiles and build a box plot showing min, Q1, median, Q3, and max.

## Key formulas

$Q_1 \text{ at position } 0.25N, \quad \text{Median at } 0.5N, \quad Q_3 \text{ at } 0.75N$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 360 100" width="360" height="100" role="img" aria-label="Box plot">
      <line x1="40" y1="50" x2="320" y2="50" stroke="#64748b"/>
      <line x1="80" y1="35" x2="80" y2="65" stroke="#64748b"/>
      <line x1="280" y1="35" x2="280" y2="65" stroke="#64748b"/>
      <rect x="120" y="30" width="140" height="40" fill="#dbeafe" stroke="#2563eb"/>
      <line x1="190" y1="30" x2="190" y2="70" stroke="#dc2626" stroke-width="2"/>
      <text x="190" y="85" text-anchor="middle" font-size="9" fill="#64748b">median</text>
    </svg></div>

Box plot — box from LQ to UQ; line inside = median; whiskers extend to min and max (or trimmed values).

## Steps / method

**Draw the curve**

Build a cumulative frequency column (running total).

Plot each total at the **upper boundary** of its class.

Start at $(\text{lowest bound}, 0)$ and join with a smooth curve.

**Read quartiles**

Find $N$ (highest cumulative frequency).

Draw across from $0.25N$. $0.5N. 0.75N$ and $x$-axis.

**Box plot**

Mark min, Q1, median, Q3, max on a number line; draw the box from Q1 to Q3 with median inside.

## Examiner tip

Plot at **upper boundaries**, not midpoints — a very common error.

## Quick check

Count above a value $v$ and $v. N$.

## Worked example — Example 1 (May 2021 P41 Q6)

$N = 80$. Lines from $y = 20$ and $y = 40$ hit the curve at $x = 14$ kg and $x = 22$ kg.

$0.25 \times 80 = 20$ → **LQ = 14 kg**. $0.5 \times 80 = 40$ → **Median = 22 kg**.

## Worked example — Example 2 (Nov 2020 P42 Q6)

$N = 120$. At $x = 45$ min, cumulative frequency $= 94$. Count taking longer than 45 min: $120 - 94 = 26$ people.
