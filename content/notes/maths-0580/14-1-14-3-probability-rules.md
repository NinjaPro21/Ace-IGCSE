## Core idea

Probability rules calculate the likelihood of an event using a scale from $0$ (impossible) to $1$ (certain). This topic covers mutually exclusive events (cannot happen together) and independent events using addition and multiplication rules.

## Key formulas

$$
P(A') = 1 - P(A)
$$
$P(A \cup B) = P(A) + P(B) \quad [\text{mutually exclusive events}]$

$P(A \cap B) = P(A) \times P(B) \quad [\text{independent events}]$

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

**Independent events ("and")**

1. Find the probability of each event on its own.
2. Confirm the events are independent — the first outcome does not change the second.
3. Multiply: $P(A \cap B) = P(A) \times P(B)$.

**Mutually exclusive events ("or")**

1. Confirm the events cannot happen together.
2. Find $P(A)$ and $P(B)$ separately.
3. Add: $P(A \cup B) = P(A) + P(B)$.

## Examiner tip

Always check whether a question involves picking items **with replacement** or **without replacement**. If items are not replaced, the total number of choices decreases for the second pick, so the events are not independent.

## Quick check

If the probability of an event happening is $p$, what is the probability it does **not** happen?

$1 - p$

## Worked example — Complement rule

May 2021 Paper 23 Q3: The probability that a train is late is $0.15$. Find the probability that the train is on time.

1. Use the complement rule: $P(\text{On time}) = 1 - P(\text{Late})$.
2. Substitute: $1 - 0.15 = 0.85$.

## Worked example — Independent events

November 2021 Paper 21 Q12: A fair six-sided die is rolled twice. Find the probability of rolling a $6$ on both rolls.

1. Probability of a $6$ on one roll: $\frac{1}{6}$.
2. Rolls are independent, so multiply: $P(6 \text{ and } 6) = \frac{1}{6} \times \frac{1}{6} = \frac{1}{36}$.
