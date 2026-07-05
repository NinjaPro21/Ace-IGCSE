## Core idea

Sets group distinct numbers or items inside designated universal boundaries. This topic provides standard notation symbols to analyze overlaps, combinations, or exclusions across multiple groups. It is highly effective for sorting survey data and solving logical sorting problems where some items belong to multiple categories.

## Key formulas

$$
n(A \cup B) = n(A) + n(B) - n(A \cap B)
$$

$$
A \cap B \quad \text{(intersection: overlap region)}
$$

$$
A \cup B \quad \text{(union: total combined regions)}
$$

$$
A' \quad \text{(complement: completely outside } A\text{)}
$$

## Graphs & diagrams

Use the **interactive Venn explorer** below the notes. Tap each symbol — $A$, $B$, $A \cap B$, $A \cup B$, $A'$, and combinations such as $A' \cap B$ — to see exactly which region lights up. Combining symbols changes the highlight so you can see what each expression really means on the diagram.

## Steps / method

Completing an Algebraic Venn Diagram from Survey Data Draw the external universal bounding box ($\mathcal{E}$) containing circles for your sets.

Always prioritize filling in the central intersection ($A \cap B$) first.

If this central overlap is unknown, label it algebraically as $x$.

Fill in the remaining inner portions of each circle by subtracting the central intersection from the group totals (e.g., write $n(A) - x$).

Set up an equation by summing every single independent region inside the diagram and making it equal to the total universal set size, then solve for $x$.

Shading Specified Symbolic Regions (e.g., $A' \cap B$).

The intersection symbol ($\cap$) means finding where those two criteria overlap.

Shade only the regions that meet both rules at the same time.

For unions ($\cup$), shade any region that matches either rule, combining them together.

## Examiner tip

Watch out for the difference between the statements "the number of elements in set $A$", written $n(A)$, and the set elements themselves. Also, be careful with the phrase "members who only play tennis" versus "tennis players". "Tennis only" excludes the central intersection, whereas "tennis players" includes it.

## Quick check

The expression $(A \cup B)'$ represents all elements that lie completely outside both circles.

## Worked example — May 2021 Paper 22 Q9

$\mathcal{E} = \{ \text{integers from 1 to 10} \}$, $A = \{ \text{prime numbers} \}$, $B = \{ \text{factors of 12} \}$. List the elements of $(A \cup B)'$.

1. Define the sets: $\mathcal{E} = \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}$, $A = \{2, 3, 5, 7\}$, and $B = \{1, 2, 3, 4, 6\}$.
2. Find the union: $A \cup B = \{1, 2, 3, 4, 5, 6, 7\}$.
3. Find the complement $(A \cup B)'$ by listing everything in $\mathcal{E}$ that is not in the union: $\{8, 9, 10\}$.

## Worked example — November 2021 Paper 41 Q2b

In a class of 30 students, 18 study Art, 15 study Music, and 5 study neither subject. Find the number of students who study both Art and Music.

1. Let the number of students studying both be $x$.
2. Express students studying only Art as $18 - x$ and only Music as $15 - x$.
3. Sum all regions to equal the total class size: $(18 - x) + x + (15 - x) + 5 = 30 \implies 38 - x = 30 \implies x = 8$.
