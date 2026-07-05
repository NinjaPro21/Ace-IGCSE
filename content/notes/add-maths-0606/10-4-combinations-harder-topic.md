## Core idea

A **combination** selects $r$ items from $n$ where **order does not matter** — for example choosing a team, committee, or hand of cards.

## Key formulas

**Combination formula**

$$
{}_nC_r = \binom{n}{r} = \frac{n!}{r!\,(n-r)!}
$$

## Steps / method

1. **Identify** $n$ and $r$.

2. **Check** whether picking A then B is the same as B then A — if yes, use combinations.

3. **Multi-group selection** — find combinations for each group separately, then multiply.

### Key rule

"At least one" often means adding cases, or using **total minus none** when that shortcut is faster.

## Worked example — Basic selection

Question: A team of 5 players is chosen from a squad of 12. How many possible teams?

Order does not matter — $n = 12$ and $r = 5$

${}_{12}C_5 = \frac{12!}{5!\,7!} = 792$

## Worked example — Multi-group selection

Question: A committee of 4 is chosen from 6 teachers and 5 students, with exactly 2 teachers and 2 students.

Teachers: ${}_6C_2 = 15$

Students: ${}_5C_2 = 10$

Total $= 15 \times 10 = 150$.

## Examiner tip

For "at least 1 teacher" (or similar), either add the cases for 1, 2, 3, … teachers, or use **total minus no teachers** when that is quicker.

## Quick check

${}_nC_r$ is smaller than ${}_nP_r$ (except when $r = 0$ or $1$) because combinations divide by $r!$ to remove duplicate orderings.
