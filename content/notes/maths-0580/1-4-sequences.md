## Core idea

Sequences track orderly arrangements of numbers that follow a defined mathematical progression. These patterns are modeled by finding an expression for the $n^{\text{th}}$ term, where $n$ represents the position number of any term in the sequence. Use these formulas to project long-term values, deduce geometric growth limits, and model complex non-linear progressions.

## Key formulas

$$
\text{Linear (Arithmetic) Sequence:} \quad u_n = a + (n - 1)d
$$
$$
\text{Quadratic Sequence Structure:} \quad u_n = an^2 + bn + c
$$
$$
\text{Geometric (Exponential) Sequence:} \quad u_n = a \times r^{n-1}
$$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 360 100" width="360" height="100" role="img" aria-label="Arithmetic sequence">
      <circle cx="60" cy="50" r="18" fill="#f5edd8" stroke="#5b8def"/><text x="60" y="54" text-anchor="middle" font-size="11">3</text>
      <circle cx="130" cy="50" r="18" fill="#f5edd8" stroke="#5b8def"/><text x="130" y="54" text-anchor="middle" font-size="11">7</text>
      <circle cx="200" cy="50" r="18" fill="#f5edd8" stroke="#5b8def"/><text x="200" y="54" text-anchor="middle" font-size="11">11</text>
      <circle cx="270" cy="50" r="18" fill="#f5edd8" stroke="#5b8def"/><text x="270" y="54" text-anchor="middle" font-size="11">15</text>
      <text x="95" y="30" text-anchor="middle" font-size="9" fill="#a8a29e">+4</text>
      <text x="165" y="30" text-anchor="middle" font-size="9" fill="#a8a29e">+4</text>
      <text x="235" y="30" text-anchor="middle" font-size="9" fill="#a8a29e">+4</text>
    </svg><p class="enlight-physics-diagram__caption">Linear sequence — constant difference between terms; nth term $a + (n-1)d$.</p></div>

## Steps / method

Calculate the first differences between consecutive terms in the sequence.

If these differences are constant, the sequence is linear; use the formula $u_n = a + (n - 1)d$ and a. d is the common difference.

If the first differences vary, compute the second differences.

If the second differences are constant, the sequence is quadratic ($an^2 + bn + c$).

For quadratic sequences, divide the constant second difference by 2 to find the value of the coefficient $a$.

Subtract $an^2$ from the original terms to leave a linear residue, then find its rule to determine $b$ and $c$.

If consecutive terms change by a constant multiplier rather than an added value, the sequence is geometric; identify the common ratio $r$ to construct an exponential formula.

## Examiner tip

When writing down solutions for sequences on Paper 4, never leave your final answer as a nested unsimplified expression like $5 + (n - 1) \times 3$. Expand and simplify your terms fully to present it in its clean standard format, which in this case is $3n + 2$. This prevents parsing issues and secures full presentation marks.

## Quick check

If the second differences of a sequence are constant, the $n^{\text{th}}$ term rule contains an $n^2$ component.

## Worked example — Example 1 (June 2023 P41 Q7a)

Find the $n^{\text{th}}$ term formula for the sequence: $5, 11, 17, 23, 29, \dots$

Calculate the first differences between terms: $11 - 5 = 6$; $17 - 11 = 6$; $23 - 17 = 6$.

Note that the first difference is constant ($d = 6$), confirming this is a linear arithmetic sequence. Record the initial term value ($a = 5$).

Substitute these components into the standard linear formula: $u_n = 5 + (n - 1) \times 6$.

Expand and collect terms to find the final expression: $u_n = 5 + 6n - 6 = 6n - 1$.

## Worked example — Example 2 (Nov 2022 P42 Q5b)

Determine the $n^{\text{th}}$ term for the sequence: $4, 9, 18, 31, 48, \dots$

Calculate the first differences: $9 - 4 = 5$; $18 - 9 = 9$; $31 - 18 = 13$; $48 - 31 = 17$. They are not constant.

Calculate the second differences: $9 - 5 = 4$; $13 - 9 = 4$; $17 - 13 = 4$. The second difference is constant ($4$), indicating a quadratic sequence.

Compute the coefficient $a$ when $2$. This confirms a $2n^2$ base component.

Tabulate the values of $2n^2$ for $n = 1, 2, 3, 4$: these are $2, 8, 18, 32$.

Subtract these $2n^2$ values from the original sequence terms to isolate the linear residue:$(4 - 2) = 2$, $(9 - 8) = 1$, $(18 - 18) = 0$, $(31 - 32) = -1$.

Find the $n^{\text{th}}$ term of this linear residue ($2, 1, 0, -1, \dots$. $1$ each time, so its rule is $-1n + 3$.

Combine both components to write the complete quadratic formula: $u_n = 2n^2 - n + 3$.
