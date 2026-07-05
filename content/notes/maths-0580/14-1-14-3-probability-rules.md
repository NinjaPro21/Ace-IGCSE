## Core idea

Probability rules calculate the likelihood of an event using a scale from $0$ (impossible) to $1$ (certain). This topic covers mutually exclusive events (cannot happen together) and independent events using addition and multiplication rules.

## Key formulas

$$
P(A') = 1 - P(A)
$$

$$
P(A \cup B) = P(A) + P(B) \quad [\text{mutually exclusive events}]
$$

$$
P(A \cap B) = P(A) \times P(B) \quad [\text{independent events}]
$$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 320 180" width="320" height="180" role="img" aria-label="Two-set Venn diagram">
      <rect x="20" y="20" width="280" height="140" rx="8" fill="#fdfbf7" stroke="#e8e2d8"/>
      <circle cx="130" cy="90" r="55" fill="#f5edd8" stroke="#5b8def" opacity="0.7"/>
      <circle cx="190" cy="90" r="55" fill="#fdfbf7" stroke="#b59a73" opacity="0.7"/>
      <text x="95" y="95" font-size="13" fill="#1a1a1a" font-weight="600">A</text>
      <text x="215" y="95" font-size="13" fill="#1a1a1a" font-weight="600">B</text>
      <text x="160" y="95" text-anchor="middle" font-size="11" fill="#a8a29e">A∩B</text>
    </svg><p class="enlight-physics-diagram__caption">Venn diagram — list elements in each region; $n(A \cup B) = n(A) + n(B) - n(A \cap B)$.</p></div>

## Steps / method

**Independent events ("and")**

Find the probability of each event on its own.

Confirm the events are independent — the first outcome does not change the second.

Multiply: $P(A \cap B) = P(A) \times P(B)$.

**Mutually exclusive events ("or")**

Confirm the events cannot happen together.

Find $P(A)$ and $P(B)$ separately.

Add: $P(A \cup B) = P(A) + P(B)$.

## Examiner tip

Always check whether a question involves picking items **with replacement** or **without replacement**. If items are not replaced, the total number of choices decreases for the second pick, so the events are not independent.

## Quick check

If the probability of an event happening is $p$, what is the probability it does **not** happen?

$1 - p$

## Worked example — Complement rule

May 2021 Paper 23 Q3: The probability that a train is late is $0.15$. Find the probability that the train is on time.

Use the complement rule: $P(\text{On time}) = 1 - P(\text{Late})$.

Substitute: $1 - 0.15 = 0.85$.

## Worked example — Independent events

November 2021 Paper 21 Q12: A fair six-sided die is rolled twice. Find the probability of rolling a $6$ on both rolls. Probability of a $6$ on one roll: $\frac{1}{6}$.

Rolls are independent, so multiply: $P(6 \text{ and } 6) = \frac{1}{6} \times \frac{1}{6} = \frac{1}{36}$.
