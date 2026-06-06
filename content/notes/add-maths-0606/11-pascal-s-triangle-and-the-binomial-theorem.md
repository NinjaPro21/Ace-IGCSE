## Core idea

The binomial theorem provides a systematic algebraic formula to expand expression brackets raised to high powers, such as $(a+b)^n$. Instead of manually multiplying the brackets repeatedly, the expansion uses coefficients derived from Pascal's triangle or calculated using combination formulas ($^nC_r$).

## Key formulas

$$(a + b)^n = a^n + \binom{n}{1}a^{n-1}b + \binom{n}{2}a^{n-2}b^2 + \dots + \binom{n}{r}a^{n-r}b^r + \dots + b^n$$

$$\text{Binomial Coefficient: } \binom{n}{r} = ^nC_r = \frac{n!}{r!(n-r)!}$$

$$\text{General Term } (r+1)\text{-th}: T_{r+1} = \binom{n}{r} a^{n-r} b^r$$

## Steps / method

Identify the structural terms representing $a$ and $b$, along with the integer power $n$ from the given bracket. Include any negative signs as part of the $b$ term.

Set up the expansion series, ensuring the powers of $a$ decrease from $n$ down to $0$, while the powers of $b$ increase from $0$ up to $n$.

Compute the binomial coefficients for each term using the combination formula or by reading across the row of Pascal's triangle.

Simplify each term by evaluating the coefficients and powers of variables independently.

To find a specific single term (like the coefficient of $x^4$), use the general term formula by picking the value of $r$ that matches the target power.

## Examiner tip

When the $b$ term contains a negative sign or a fraction, such as $\left(2x - \frac{1}{x}\right)^5$, always enclose the entire term in brackets before raising it to a power. This prevents sign errors and ensures that coefficients are calculated correctly.

## Quick check

If you fully expand a binomial bracket raised to the power $n$, the resulting expression will contain exactly $n + 1$ terms.

## Visual / interactive intent

New explorer: Binomial expansion builder. Sliders change the index power $n$ of $(a+b)^n$. An animated graphic highlights rows on Pascal's triangle, then drops those numbers down as coefficients into a step-by-step algebraic expansion.
