## Core idea

Number facts analyze the intrinsic properties of whole integers by classifying them into categories including factors, multiples, prime numbers, squares, and cubes. These properties enable the calculation of the Highest Common Factor (HCF) and Lowest Common Multiple (LCM) for groups of numbers. Use this structural categorization to simplify large fraction groups, find common denominators, and resolve periodic scheduling synchronization problems.

## Key formulas

$$
\text{Prime Factor Product Layout:} \quad N = p_1^{a} \times p_2^{b} \times p_3^{c} \dots

\text{HCF-LCM Relationship:} \quad \text{HCF}(a, b) \times \text{LCM}(a, b) = a \times b
$$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 360 80" width="360" height="80" role="img" aria-label="BIDMAS order">
      <rect x="20" y="25" width="55" height="35" rx="6" fill="#fecaca" stroke="#dc2626"/><text x="47" y="48" text-anchor="middle" font-size="10" font-weight="600">( )</text>
      <rect x="85" y="25" width="55" height="35" rx="6" fill="#fef3c7" stroke="#d97706"/><text x="112" y="48" text-anchor="middle" font-size="10" font-weight="600">x²</text>
      <rect x="150" y="25" width="55" height="35" rx="6" fill="#dbeafe" stroke="#2563eb"/><text x="177" y="48" text-anchor="middle" font-size="10" font-weight="600">÷ ×</text>
      <rect x="215" y="25" width="55" height="35" rx="6" fill="#bbf7d0" stroke="#16a34a"/><text x="242" y="48" text-anchor="middle" font-size="10" font-weight="600">+ −</text>
      <text x="290" y="48" font-size="10" fill="#64748b">→</text>
    </svg></div>

Order of operations — Brackets, Indices, Division/Multiplication (left to right), Addition/Subtraction (left to right).

## Steps / method

Generate prime factor trees for each provided value by dividing repeatedly by prime integers ($2, 3, 5, 7, 11, \dots$) until only prime values remain.

State each number clearly as a product of prime factors expressed in index notation form.

To compute the HCF, identify the shared prime bases across all lists and multiply them together using their lowest appearing powers.

To compute the LCM, collect every unique prime base present across all lists and multiply them together using their highest appearing powers.

## Examiner tip

When an exam problem describes real-world events occurring simultaneously at different intervals (e.g., "two alarms bell ring together at noon, one rings every 12 minutes, the other every 18 minutes..."), it is prompting you for an LCM calculation. Avoid listing out long tables of multiples manually under exam time pressure; use the prime factor method to guarantee accuracy.

## Quick check

If two integers share no common prime factors, their HCF is equal to $1$, and their LCM is simply the product of the two integers.

## Worked example — Example 1 (June 2022 P2 Q14)

Find the Highest Common Factor (HCF) and Lowest Common Multiple (LCM) of $120$ and $168$.

Construct prime factor trees to find prime breakdowns: $120 = 2 \times 2 \times 2 \times 3 \times 5 = 2^3 \times 3^1 \times 5^1$

$168 = 2 \times 2 \times 2 \times 3 \times 7 = 2^3 \times 3^1 \times 7^1$

Identify common bases for HCF calculation (2 and $3$). Take the lowest exponent for each: $2^3$ and $3^1$.

Calculate the HCF value: $\text{HCF} = 2^3 \times 3^1 = 8 \times 3 = 24$.

Collect all distinct bases for LCM calculation ($2, 3, 5,$ and $7$). Take the highest exponent for each: $2^3, 3^1, 5^1, 7^1$.

Calculate the LCM value: $\text{LCM} = 2^3 \times 3^1 \times 5^1 \times 7^1 = 8 \times 3 \times 5 \times 7 = 840$.

## Worked example — Example 2 (Nov 2021 P2 Q5)

Explain why $97$ is classified as a prime number.

Recall the absolute definition of a prime number: an integer strictly greater than $1$ that possesses exactly two distinct factors: $1$ and itself.

Test for divisibility using prime numbers whose squares are less than $97$ (testing $2, 3, 5,$ and $7$).

Show that $97$ is not divisible by 2(not even), $3$ (digits sum to $16$), $5$ (does not end in $0$ or $5$), or $7$ ($97 \div 7 = 13$ remainder $6$).

Conclude that since it has no integer divisors other than $1$ and $97$, it matches the definition of a prime number.
