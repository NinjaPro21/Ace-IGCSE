## Core idea

Arrangements count how many ways items can be placed in order when there are constraints — items that must stay together, stay apart, or are identical.

## Key formulas

**Identical items**

$$
\frac{n!}{p!\,q!\,r!}
$$

where $p$, $q$, $r$ are the frequencies of each repeated item.

**Items together**

Treat the group as one block: (external arrangements) $\times$ (internal arrangements of the block).

## Steps / method

1. **Together** — treat the group as a single block, count external arrangements, then multiply by arrangements within the block.

2. **Apart** — use complementary counting (total minus together), or the slot method for vowels/consonants.

3. **Identical items** — divide $n!$ by the factorial of each repeated count.

### Key rule

For "no two together" problems, the slot method (place fixed items first, then fill gaps) is more reliable than simple subtraction.

## Worked example — Items together

Question: How many ways can 5 people (A, B, C, D, E) stand in a row if A and B must stand next to each other?

Treat (AB) as one item → 4 items to arrange: $4! = 24$.

A and B can be AB or BA: $2! = 2$ internal arrangements.

Total $= 24 \times 2 = 48$.

## Worked example — Identical items

Question: Find the number of arrangements of the letters in "APPLE".

Total letters $n = 5. Letter P appears twice$. $2\frac{5!}{2!} = \frac{120}{2} = 60$

## Examiner tip

If a question says "no two vowels are together," do not just subtract the "all together" case. Use the slot method: place consonants first, then put vowels in the gaps between them.

## Quick check

The word "BANANA" has $\frac{6!}{3!\,2!} = 60$ distinct arrangements.
