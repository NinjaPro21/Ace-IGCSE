## Core idea

Advanced probability combines set notation with conditional logic. Conditional probability narrows the sample space to a given condition, which changes the denominator used in calculations.

## Key formulas

$$
P(A \mid B) = \frac{P(A \cap B)}{P(B)} \quad [\text{conditional probability}]
$$
$P(A \cap B) = 0 \quad [\text{mutually exclusive events}]$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 320 180" width="320" height="180" role="img" aria-label="Two-set Venn diagram">
      <rect x="20" y="20" width="280" height="140" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
      <circle cx="130" cy="90" r="55" fill="#dbeafe" stroke="#2563eb" opacity="0.7"/>
      <circle cx="190" cy="90" r="55" fill="#fef3c7" stroke="#d97706" opacity="0.7"/>
      <text x="95" y="95" font-size="13" fill="#1e3a8a" font-weight="600">A</text>
      <text x="215" y="95" font-size="13" fill="#92400e" font-weight="600">B</text>
      <text x="160" y="95" text-anchor="middle" font-size="11" fill="#64748b">A∩B</text>
    </svg></div>

Venn diagram — list elements in each region; $n(A \cup B) = n(A) + n(B) - n(A \cap B)$.

## Steps / method

**Conditional probability from a Venn diagram**

1. Identify the condition set (e.g. “given that the student plays football” → football is the condition).
2. Sum all values inside that condition group — this is the new denominator.
3. Do **not** use the total universal population as the denominator.
4. Find the overlap $P(A \cap B)$ and divide: $\frac{P(A \cap B)}{P(B)}$.

**Checking independence**

1. Calculate $P(A) \times P(B)$.
2. Find the actual intersection $P(A \cap B)$.
3. If they are equal, the events are independent; otherwise they are dependent.

## Examiner tip

When calculating $P(A \mid B)$ from a diagram, update your denominator to the size of the condition group — not the whole universal set.

## Quick check

Conditional calculations narrow your focus to a specific sub-region, changing your baseline denominator.

## Worked example — Venn diagram

May 2021 Paper 42 Q9c: A Venn diagram shows $n(M) = 25$, $n(S) = 18$, and $n(M \cap S) = 10$. Find $P(S \mid M)$.

1. Condition group is $M$, with $25$ students.
2. Overlap $n(M \cap S) = 10.$
$322P(S \mid M) = \frac{10}{25} = \frac{2}{5} = 0.42$

## Worked example — Independence test

November 2022 Paper 41 Q11: $P(X) = 0.4$, $P(Y) = 0.5$, and $P(X \cup Y) = 0.7$. Are $X$ and $Y independent?$

122P(X \cap Y) = 0.4 + 0.5 - 0.7 = 0.2.
$222P(X) \times P(Y) = 0.4 \times 0.5 = 0.22$
3. Since $P(X \cap Y) = P(X) \times P(Y)$, the events are independent.
