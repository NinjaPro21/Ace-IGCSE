## Core idea

Factorial notation calculates the number of ways to arrange a distinct set of items in a straight line. When order matters, the total number of arrangements of $n$ unique items is given by $n!$. If constraints or restrictions are introduced (such as grouping items together), those elements must be treated as a single compound unit before accounting for internal arrangements.

## Key formulas

$$n! = n \times (n-1) \times (n-2) \times \dots \times 3 \times 2 \times 1$$

$$0! = 1$$

$$\text{Arrangements of } n \text{ items with } p, q \text{ repeats} = \frac{n!}{p!q!}$$

## Steps / method

Count the total number of items available for arrangement ($n$).

If there are no restrictions, calculate $n!$ directly to find the total configurations.

If specific items must sit next to one another, tie them together into a single &quot;bundle&quot;.

Count this bundle as one item to find the external arrangements, then multiply by the internal permutations ($k!$) of the items inside the bundle.

If items must be separated, calculate the total unrestricted arrangements and subtract the number of invalid arrangements where those items sit together.

## Examiner tip

Be careful not to multiply factorials directly by numbers (for example, $2 \times 3!$ is not equal to $6!$). Always expand the factorial term fully according to its definition before performing multiplication or division.

## Quick check

If 5 unique books are to be arranged on a shelf, there are exactly $5! = 120$ possible linear configurations.

## Visual / interactive intent
