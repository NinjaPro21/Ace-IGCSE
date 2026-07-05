## Core idea

A cumulative frequency curve tracks running totals. From it you read quartiles and build a box plot showing min, Q1, median, Q3, and max.

## Key formulas

$$
Q_1 \text{ at position } 0.25N, \quad \text{Median at } 0.5N, \quad Q_3 \text{ at } 0.75N
$$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 420 160" width="420" height="160" role="img" aria-label="Box plot with five-number summary labels">
      <!-- whisker line -->
      <line x1="40" y1="60" x2="380" y2="60" stroke="#a8a29e" stroke-width="2"/>
      <!-- min / max whisker caps -->
      <line x1="40" y1="45" x2="40" y2="75" stroke="#a8a29e" stroke-width="2"/>
      <line x1="380" y1="45" x2="380" y2="75" stroke="#a8a29e" stroke-width="2"/>
      <!-- box Q1 to Q3 -->
      <rect x="120" y="35" width="160" height="50" fill="#f5edd8" stroke="#5b8def" stroke-width="2"/>
      <!-- median -->
      <line x1="200" y1="35" x2="200" y2="85" stroke="#b59a73" stroke-width="2.5"/>
      <!-- labels below -->
      <text x="40" y="100" text-anchor="middle" font-size="11" fill="#1a1a1a" font-weight="600">min</text>
      <text x="120" y="100" text-anchor="middle" font-size="11" fill="#1a1a1a" font-weight="600">Q1</text>
      <text x="200" y="100" text-anchor="middle" font-size="11" fill="#1a1a1a" font-weight="600">median</text>
      <text x="280" y="100" text-anchor="middle" font-size="11" fill="#1a1a1a" font-weight="600">Q3</text>
      <text x="380" y="100" text-anchor="middle" font-size="11" fill="#1a1a1a" font-weight="600">max</text>
      <!-- also LQ / UQ aliases -->
      <text x="120" y="116" text-anchor="middle" font-size="9" fill="#6b6b6b">(LQ)</text>
      <text x="280" y="116" text-anchor="middle" font-size="9" fill="#6b6b6b">(UQ)</text>
      <!-- IQR bracket -->
      <line x1="120" y1="130" x2="280" y2="130" stroke="#5b8def" stroke-width="1.5"/>
      <line x1="120" y1="124" x2="120" y2="136" stroke="#5b8def"/>
      <line x1="280" y1="124" x2="280" y2="136" stroke="#5b8def"/>
      <text x="200" y="148" text-anchor="middle" font-size="10" fill="#5b8def" font-weight="600">IQR = Q3 − Q1</text>
      <!-- example values -->
      <text x="40" y="28" text-anchor="middle" font-size="9" fill="#6b6b6b">8</text>
      <text x="120" y="28" text-anchor="middle" font-size="9" fill="#6b6b6b">14</text>
      <text x="200" y="28" text-anchor="middle" font-size="9" fill="#6b6b6b">22</text>
      <text x="280" y="28" text-anchor="middle" font-size="9" fill="#6b6b6b">32</text>
      <text x="380" y="28" text-anchor="middle" font-size="9" fill="#6b6b6b">48</text>
    </svg><p class="enlight-physics-diagram__caption">Box plot — five-number summary: min, Q1 (LQ), median, Q3 (UQ), max. Box spans the IQR; whiskers reach min and max.</p></div>

## Steps / method

**Draw the curve**

Build a cumulative frequency column (running total).

Plot each total at the **upper boundary** of its class.

Start at $(\text{lowest bound}, 0)$ and join with a smooth curve.

**Read quartiles**

Find $N$ (highest cumulative frequency).

Draw horizontal lines from $0.25N$, $0.5N$, and $0.75N$ to the curve, then down to the $x$-axis.

**Box plot**

Mark min, Q1, median, Q3, max on a number line; draw the box from Q1 to Q3 with median inside.

## Examiner tip

Plot at **upper boundaries**, not midpoints — a very common error.

## Quick check

Count above a value $v$ using $N - F(v)$, where $F(v)$ is the cumulative frequency at $v$.

## Worked example — Example 1 (May 2021 P41 Q6)

$N = 80$. Lines from $y = 20$ and $y = 40$ hit the curve at $x = 14$ kg and $x = 22$ kg.

$0.25 \times 80 = 20$ → **LQ = 14 kg**. $0.5 \times 80 = 40$ → **Median = 22 kg**.

## Worked example — Example 2 (Nov 2020 P42 Q6)

$N = 120$. At $x = 45$ min, cumulative frequency $= 94$. Count taking longer than 45 min: $120 - 94 = 26$ people.
