## Core idea

Factorial notation calculates the number of ways to arrange a distinct set of items in a straight line. When order matters, the total number of arrangements of $n$ unique items is given by $n!$. If constraints or restrictions are introduced (such as grouping items together), those elements must be treated as a single compound unit before accounting for internal arrangements.

## Key formulas

$n! = n \times (n-1) \times \cdots \times 1$, $0! = 1$

## Steps / method

Count the total number of items available for arrangement ($n$).

If there are no restrictions, calculate $n!$ directly to find the total configurations.

If specific items must sit next to one another, tie them together into a single "bundle".

Count this bundle as one item to find the external arrangements, then multiply by the internal permutations ($k!$) of the items inside the bundle.

If items must be separated, calculate the total unrestricted arrangements and subtract the number of invalid arrangements where those items sit together.

### Key rule

Treat repeated items by dividing by the factorial of each repeat count. When items must stay together, bundle them first, then multiply by internal arrangements.

## Worked example — Simple arrangement

How many ways can 4 distinct students stand in a line? $$
4! = 4 \times 3 \times 2 \times 1 = 24
$$ There are **24** arrangements.

## Worked example — Repeated letters

How many distinct arrangements of the letters in **LEVEL**?

There are 5 letters with **E** repeated twice and **L** repeated twice: $$
\frac{5!}{2! \times 2!} = \frac{120}{4} = 30
$$ There are **30** distinct arrangements.

## Examiner tip

Be careful not to multiply factorials directly by numbers (for example, $2 \times 3!$ is not equal to $6!$). Always expand the factorial term fully according to its definition before performing multiplication or division.

## Quick check

If 5 unique books are to be arranged on a shelf, there are exactly $5! = 120$ possible linear configurations.
