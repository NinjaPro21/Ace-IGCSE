## Core idea

Advanced probability combines set notation with conditional logic. Conditional probability narrows the sample space to a given condition, which changes the denominator used in calculations. Multi-stage questions may continue branching after the second draw.

## Key formulas

$$
P(A \mid B) = \frac{P(A \cap B)}{P(B)} \quad [\text{conditional probability}]
$$

$$
P(A \cap B) = 0 \quad [\text{mutually exclusive events}]
$$

## Steps / method

**Conditional probability from a Venn diagram**

Identify the condition set (e.g. “given that the student plays football” → football is the condition).

Sum all values inside that condition group — this is the new denominator.

Do **not** use the total universal population as the denominator.

Find the overlap $P(A \cap B)$ and divide: $\frac{P(A \cap B)}{P(B)}$.

**Three-stage trees**

Draw first-stage branches, then second-stage branches from each outcome.

If a third draw (or event) is needed, branch again from each second-stage node — denominators keep decreasing without replacement.

Multiply all probabilities along the full path.

**Checking independence**

Calculate $P(A) \times P(B)$.

Find the actual intersection $P(A \cap B)$.

If they are equal, the events are independent; otherwise they are dependent.

## Examiner tip

When calculating $P(A \mid B)$ from a diagram, update your denominator to the size of the condition group — not the whole universal set.

## Quick check

Conditional calculations narrow your focus to a specific sub-region, changing your baseline denominator.

## Worked example — Venn diagram

May 2021 Paper 42 Q9c: A Venn diagram shows $n(M) = 25$, $n(S) = 18$, and $n(M \cap S) = 10$. Find $P(S \mid M)$.

The condition group is $M$, with $25$ students. The overlap is $n(M \cap S) = 10$.

$$
P(S \mid M) = \frac{10}{25} = \frac{2}{5} = 0.4
$$

## Worked example — Independence test

November 2022 Paper 41 Q11: $P(X) = 0.4$, $P(Y) = 0.5$, and $P(X \cup Y) = 0.7$. Are $X$ and $Y$ independent?

$$
P(X \cap Y) = P(X) + P(Y) - P(X \cup Y) = 0.4 + 0.5 - 0.7 = 0.2
$$

$$
P(X) \times P(Y) = 0.4 \times 0.5 = 0.2
$$

Since $P(X \cap Y) = P(X) \times P(Y)$, the events are independent.
