## Core idea

Simultaneous linear equations are pairs of equations containing two unknown variables that are satisfied by the same unique pair of values. There is no single formula — you solve them using one of three methods: **elimination**, **substitution**, or **graphically** (finding where the two lines cross). Use this framework to locate intersection points on a coordinate grid or to solve problems involving two independent constraints.

## Key methods

**1. Elimination** — align the equations, multiply so one variable has matching coefficients, then add or subtract to remove that variable. Same signs → subtract; opposite signs → add (S.S.O.).

**2. Substitution** — rearrange one equation to make $y = \ldots$ (or $x = \ldots$), then replace that variable in the other equation.

**3. Graphical** — plot both lines on the same axes; the coordinates of the intersection point are the solution $(x, y)$.

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 280 140" width="280" height="140" role="img" aria-label="Elimination method">
      <rect x="30" y="20" width="220" height="32" rx="4" fill="#f5edd8" stroke="#b59a73"/>
      <text x="140" y="41" text-anchor="middle" font-size="12" fill="#1a1a1a">3x + 2y = 12</text>
      <rect x="30" y="58" width="220" height="32" rx="4" fill="#fdfbf7" stroke="#b59a73"/>
      <text x="140" y="79" text-anchor="middle" font-size="12" fill="#1a1a1a">5x − 2y = 4</text>
      <text x="140" y="108" text-anchor="middle" font-size="18" fill="#6b6b6b">+</text>
      <line x1="30" y1="118" x2="250" y2="118" stroke="#a8a29e" stroke-width="2"/>
      <text x="140" y="135" text-anchor="middle" font-size="12" fill="#789671" font-weight="600">8x = 16 → x = 2</text>
    </svg><p class="enlight-physics-diagram__caption">Elimination — align like terms, then add or subtract the equations to remove one variable.</p></div>

<div class="enlight-physics-diagram"><svg viewBox="0 0 320 120" width="320" height="120" role="img" aria-label="Substitution method">
      <rect x="20" y="35" width="110" height="50" rx="6" fill="#f5edd8" stroke="#b59a73" stroke-width="1.5"/>
      <text x="75" y="65" text-anchor="middle" font-size="11" fill="#1a1a1a">y = 2x + 1</text>
      <line x1="135" y1="60" x2="175" y2="60" stroke="#6b6b6b" marker-end="url(#sub-arr)"/>
      <text x="155" y="50" text-anchor="middle" font-size="9" fill="#6b6b6b">sub</text>
      <rect x="180" y="25" width="120" height="70" rx="6" fill="#fdfbf7" stroke="#b59a73" stroke-width="1.5"/>
      <text x="240" y="50" text-anchor="middle" font-size="11" fill="#1a1a1a">3x + y = 14</text>
      <text x="240" y="72" text-anchor="middle" font-size="11" fill="#789671">3x + (2x+1) = 14</text>
      <defs><marker id="sub-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#6b6b6b"/></marker></defs>
    </svg><p class="enlight-physics-diagram__caption">Substitution — rearrange one equation for $y$, then replace $y$ in the other equation.</p></div>

<div class="enlight-physics-diagram"><svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Intersecting lines">
      <line x1="40" y1="190" x2="290" y2="190" stroke="#a8a29e"/>
      <line x1="40" y1="190" x2="40" y2="30" stroke="#a8a29e"/>
      <line x1="60" y1="170" x2="260" y2="50" stroke="#5b8def" stroke-width="2"/>
      <line x1="60" y1="50" x2="260" y2="170" stroke="#789671" stroke-width="2"/>
      <circle cx="160" cy="110" r="5" fill="#b59a73"/>
      <text x="168" y="105" font-size="10" fill="#b59a73">solution</text>
    </svg><p class="enlight-physics-diagram__caption">Simultaneous equations — solution is the point where the two lines cross.</p></div>

## Steps / method

Arrange both equations so that like variables are aligned vertically in columns: $ax + by = c.$

Choose which method to use — elimination is fastest when coefficients already match; substitution when one equation is already rearranged (e.g22y = 2x + 1$).$

Solve for the first unknown, then substitute back into either original equation to find the second.

Check your answer by substituting both values into the equation you did not rearrange first.

## Examiner tip

After finding solutions for $x$ and $y$, always check your answers by substituting them into the equation you didn't use in step 4. If both sides balance, your solutions are correct. This quick check takes seconds and guarantees you won't lose marks on Paper 4.

## Quick check

If you add two equations together, the terms on the left side and the terms on the right side must be added together respectively.

## Worked example — Example 1 (May 2022 P22 Q15) — Elimination

Solve the simultaneous equations:

$$
\begin{cases}3x + 2y = 12 \ 5x - 2y = 4\end{cases}
$$

Notice that the coefficients of the $y$terms have the same absolute value (2 $) but opposite signs ($+2 and -2$).$

Add the two equations together to eliminate the $y$ terms completely: $(3x + 5x) + (2y - 2y) = 12 + 4$.

Simplify and solve the resulting equation: $8x = 16$, so $x = 2$.

Substitute $x = 2$ back into the first equation to solve for $y$: $3(2) + 2y = 12$, so $6 + 2y = 12$.

Isolate the $y$ term: $2y = 6$, so $y = 3$. The solution pair is $x = 2$, $y = 3$.

## Worked example — Example 2 (Nov 2023 P42 Q2b) — Substitution

Solve the simultaneous equations:

$$
\begin{cases}y = 2x + 1 \ 3x + y = 14\end{cases}
$$

The first equation is already rearranged: $y = 2x + 1$.

Substitute $(2x + 1)$ for $y$ in the second equation: $3x + (2x + 1) = 14$.

Combine like terms: $5x + 1 = 14$, so $5x = 13$ and $x = \frac{13}{5}$ (or $2.6$).

Substitute $x = \frac{13}{5}$ back into $y = 2x + 1$: $y = 2\left(\frac{13}{5}\right) + 1 = \frac{26}{5} + \frac{5}{5} = \frac{31}{5}$ (or $6.2$).

The solution pair is $x = \frac{13}{5}$, $y = \frac{31}{5}$.
