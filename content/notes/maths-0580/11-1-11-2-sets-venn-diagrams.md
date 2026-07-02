## Core idea

Sets group distinct numbers or items inside designated universal boundaries. This topic provides standard notation symbols to analyze overlaps, combinations, or exclusions across multiple groups. It is highly effective for sorting survey data and solving logical sorting problems where some items belong to multiple categories.

## Key formulas

n(A \cup B) = n(A) + n(B) - n(A \cap B)

$A \cap B \quad [\text{Intersection: Overlap region}]$

$A \cup B \quad [\text{Union: Total combined regions}]$

$A' \quad [\text{Complement: Completely outside } A]$

## Graphs & diagrams

Venn diagram — list elements in each region; $n(A \cup B) = n(A) + n(B) - n(A \cap B)$.

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

Completing an Algebraic Venn Diagram from Survey Data Draw the external universal bounding box ($\mathcal{E}$) containing circles for your sets.

Always prioritize filling in the central intersection ($A \cap B$) first.

If this central overlap is unknown, label it algebraically as $x$.

Fill in the remaining inner portions of each circle by subtracting the central intersection from the group totals (e.g., write $n(A) - x$).

Set up an equation by summing every single independent region inside the diagram and making it equal to the total universal set size, then solve for $x$.

Shading Specified Symbolic Regions (e.g., $A' \cap B$ and $A. B$.

The intersection symbol ($\cap$) means finding where those two criteria overlap.

Shade only the regions that meet both rules at the same time.

For unions ($\cup$), shade any region that matches either rule, combining them together.

## Examiner tip

Watch out for the difference between the statements "the number of elements in set $A$. $n(A)$, and the set elements themselves. Al so, be careful with the phrase "members who only play tennis" versus "tennis players". "Tennis only" excludes the central intersection, whereas "tennis players" includes it.

## Quick check

The expression $(A \cup B)'$ represents all elements that lie completely outside both circles.

## Worked examples

May 2021 Paper 22 Q9: $\mathcal{E} = \{ \text{Integers from 1 to 10} \}$, $A = \{ \text{Prime numbers} \}$, $B = \{ \text{Factors of 12} \}$. List the elements of $(A \cup B)'$.

Step 1: Define the sets: $\mathcal{E} = \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}$, $A = \{2, 3, 5, 7\}$, and $B = \{1, 2, 3, 4, 6\}$.

Step 2: Find the union $A \cup B$. So $A \cup B = \{1, 2, 3, 4, 5, 6, 7\}$.

Step 3: Find the complement $(A \cup B)'$ by listing everything in $\mathcal{E}$ that is not in the union: $\{8, 9, 10\}$.

November 2021 Paper 41 Q2b: In a class of 30 students, 18 study Art, 15 study Music, and 5 study neither subject.

Find the number of students who study both Art and Music. Step 1: Let the number of students studying both be $x$.

Step 2: Express students studying only Art as $18 - x$. $15 - x$.

Step 3: Sum all regions to equal the total class size: $(18 - x) + x + (15 - x) + 5 = 30 \implies 38 - x = 30 \implies x = 8$.
