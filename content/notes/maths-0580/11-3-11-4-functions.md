## Core idea

Functions process an input value $x$ through a defined algebraic rule to generate an output. Composite functions string these processing steps together in a specific sequence, while inverse functions calculate backward to uncover the original input value from a given output.

## Key formulas

$$
fg(x) = f(g(x)) \quad \text{(process } g(x) \text{ first, then feed into } f\text{)}
$$

$$
f^{-1}(x) \quad \text{(the algebraic inverse operation)}
$$

## Graphs & diagrams

<div class="ace-physics-diagram"><svg viewBox="0 0 360 120" width="360" height="120" role="img" aria-label="Function machine">
      <rect x="120" y="35" width="120" height="50" rx="8" fill="#f5edd8" stroke="#5b8def" stroke-width="2"/>
      <text x="180" y="65" text-anchor="middle" font-size="12" fill="#1a1a1a">f</text>
      <text x="60" y="65" font-size="11" fill="#a8a29e">x</text>
      <text x="300" y="65" font-size="11" fill="#a8a29e">f(x)</text>
      <line x1="75" y1="60" x2="115" y2="60" stroke="#a8a29e" marker-end="url(#fn)"/>
      <line x1="245" y1="60" x2="285" y2="60" stroke="#a8a29e" marker-end="url(#fn)"/>
      <defs><marker id="fn" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#a8a29e"/></marker></defs>
    </svg><p class="ace-physics-diagram__caption">Function machine — input $x$ maps to exactly one output $f(x)$.</p></div>

## Steps / method

Evaluating a Composite Function Rule ($fg(x)$) Write down the target expression using nested brackets: $f(g(x))$.

This clarifies that the inner function $g(x)$ acts as the input.

Substitute the entire equation of $g(x)$ into every $x$ in $f(x)$.

Expand any brackets and collect like terms to simplify the final algebraic expression.

Finding the Inverse Function $f^{-1}(x)$ Set the function equation equal to a temporary working variable $y$.

Rearrange this equation step-by-step using inverse operations to isolate $x$ by itself on one side.

Replace the isolated $x$ with $f^{-1}(x)$ and swap the temporary $y$ back to $x$ for the final expression.

## Examiner tip

When working with a composite function like $fg(2)$, compute the inner part $g(2)$ first to get a plain number. Then, plug that number straight into $f(x)$. A common mistake is trying to expand the full algebraic expression $fg(x)$ first, which takes much longer and increases the chance of a calculation error.

## Quick check

The composite function $ff^{-1}(x)$ always simplifies back to the original input $x$.

## Worked example — May 2022 Paper 21 Q19

Given $f(x) = 3x - 5$ and $g(x) = x^2 + 2$, find the value of $fg(3)$.

1. Calculate the inner value $g(3)$ first: $g(3) = 3^2 + 2 = 9 + 2 = 11$.
2. Use this result as the input for function $f$: $f(11) = 3(11) - 5$.
3. Simplify: $33 - 5 = 28$.

## Worked example — November 2021 Paper 22 Q23

Find the inverse function $f^{-1}(x)$ for $f(x) = \frac{2x + 1}{3}$.

1. Set the equation equal to $y$: $y = \frac{2x + 1}{3}$.
2. Multiply both sides by 3 to clear the fraction: $3y = 2x + 1$.
3. Subtract 1 and divide by 2 to isolate $x$: $3y - 1 = 2x \implies x = \frac{3y - 1}{2}$. Swap variables for the final answer: $f^{-1}(x) = \frac{3x - 1}{2}$.
