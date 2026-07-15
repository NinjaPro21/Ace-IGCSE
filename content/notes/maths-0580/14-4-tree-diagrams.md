## Core idea

Tree diagrams show multi-stage probability. Branches from one node must sum to $1$. Multiply along a path; add separate paths for alternative outcomes.

## Key formulas

$$
P(\text{path}) = P_1 \times P_2 \times \cdots
$$

$$
\text{Branches from one node sum to } 1
$$

## Graphs & diagrams

<div class="ace-physics-diagram"><svg viewBox="0 0 320 180" width="320" height="180" role="img" aria-label="Probability tree">
      <circle cx="40" cy="90" r="6" fill="#a8a29e"/>
      <line x1="46" y1="70" x2="120" y2="50" stroke="#a8a29e"/>
      <line x1="46" y1="110" x2="120" y2="130" stroke="#a8a29e"/>
      <circle cx="120" cy="50" r="5" fill="#5b8def"/><text x="130" y="45" font-size="9">R</text>
      <circle cx="120" cy="130" r="5" fill="#b59a73"/><text x="130" y="135" font-size="9">B</text>
      <line x1="126" y1="50" x2="200" y2="35" stroke="#a8a29e"/>
      <line x1="126" y1="50" x2="200" y2="65" stroke="#a8a29e"/>
      <text x="210" y="40" font-size="8" fill="#a8a29e">multiply</text>
    </svg><p class="ace-physics-diagram__caption">Tree diagram — multiply along a branch; add probabilities of separate paths.</p></div>

## Steps / method

**Without replacement**

First branches: e.g. $\frac{7}{10}$ red, $\frac{3}{10}$ blue.

Second branches: reduce numerator and denominator by $1$ from each first outcome.

Multiply along each path; add paths that match the question.

## Examiner tip

“One of each colour” means **two paths** (R then B, and B then R) — add both.

## Quick check

Multiply along one path (specific order); add paths (either order).

## Worked example — Both red

May 2022 P41 Q7b: Bag with 7 red, 3 blue. Two drawn without replacement. Find $P(\text{both red})$.

$P(RR) = \frac{7}{10} \times \frac{6}{9} = \frac{7}{15}$

## Worked example — One of each colour

Nov 2021 P42 Q9c: 5 white, 4 black. Find $P(\text{exactly one of each})$.

$$
P(WB) = \frac{5}{9} \times \frac{4}{8} = \frac{20}{72}, \quad P(BW) = \frac{4}{9} \times \frac{5}{8} = \frac{20}{72}
$$

$$
P(\text{one each}) = \frac{40}{72} = \frac{5}{9}
$$
