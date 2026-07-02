## Core idea

Permutations and combinations are methods used to count how many ways groups can be selected from a larger pool. Use permutations ($^nP_r$) when the order of selection matters, such as choosing individuals for distinct titles like President and Secretary. Use combinations ($^nC_r$) when the internal order does not matter, such as picking a general committee or a team.

## Key formulas

$$
\text{Permutations (Order Matters): } ^nP_r = \frac{n!}{(n-r)!}

\text{Combinations (Order Doesn't Matter): } ^nC_r = \frac{n!}{r!(n-r)!}
$$


## Steps / method

Read the problem scenario carefully to determine if the internal order of the selected items matters.

Identify the total size of the available pool ($n$) and how many items need to be selected ($r$).

If order matters (e.g., specific positions or digit codes), select and compute using the $^nP_r$ formula.

If order does not matter (e.g., picking 3 balls from a bag), select and compute using the $^nC_r$ formula.

For compound scenarios with multiple sub-groups (e.g., choosing men AND women), calculate the combinations for each group separately and multiply the results together.

### Key rule

Use **permutations** when order matters; use **combinations** when it does not. Always identify $n$ and $r$ before choosing a formula.

## Worked example — Committee selection

From 8 people, how many committees of 3 can be formed? Order does not matter, so use combinations: $$
^8C_3 = \frac{8!}{3! \times 5!} = \frac{8 \times 7 \times 6}{3 \times 2 \times 1} = 56
$$ There are **56** possible committees.

## Worked example — Ordered positions

From 8 people, how many ways can President, Vice-President, and Secretary be chosen? Order matters, so use permutations: $$
^8P_3 = \frac{8!}{5!} = 8 \times 7 \times 6 = 336
$$ There are **336** ordered selections.

## Examiner tip

Watch for keywords in questions: "Select" or "Choose" usually points to combinations ($^nC_r$), while "Arrange", "Sequence", or "Signals" indicates that order matters, requiring permutations ($^nP_r$).

## Quick check

If you select 3 items out of a pool of 5, the number of combinations ($^5C_3 = 10$) is smaller than the number of permutations ($^5P_3 = 60$) because order does not matter for combinations.
