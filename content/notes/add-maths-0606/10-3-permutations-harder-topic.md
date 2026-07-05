## Core idea

A **permutation** selects $r$ items from $n$ where **order matters** — for example assigning distinct roles or forming ordered codes.

## Key formulas

**Permutation formula**

$$
{}_nP_r = \frac{n!}{(n-r)!}
$$

## Steps / method

1. **Identify** $n$ (total items) and $r$ (items to select).

2. **Check** whether swapping two selected items gives a different outcome — if yes, use permutations.

3. **Substitute** into the permutation formula, or use the box method for restricted questions.

### Key rule

When restrictions apply (e.g. even last digit), handle the constraint first, then permute the remaining positions.

## Worked example — Distinct roles

Question: A club of 10 members needs a Chairperson and a Treasurer. In how many ways can this be done?

Order matters because the roles are different — $n = 10$ and $r = 2$

${}_{10}P_2 = \frac{10!}{8!} = 10 \times 9 = 90$

## Worked example — Restrictions

Question: Using the digits 1, 2, 3, 4, 5, how many 3-digit even numbers can be formed without repetition?

Last digit must be 2 or 4: 2 choices.

Remaining two positions filled from 4 digits: ${}_4P_2 = 12$.

Total $= 12 \times 2 = 24$.

## Examiner tip

The box method (one box per position, multiply choices) is often safer than the formula when questions have specific restrictions such as even or odd digits.

## Quick check

When $r = n$, ${}_nP_n = n!$ — arranging all $n$ items in order.
