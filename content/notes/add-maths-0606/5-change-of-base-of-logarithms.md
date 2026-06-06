## Core idea

The Change of Base rule allows you to convert a logarithm from an arbitrary base into a fraction containing a new base of your choice. Use this when you need to evaluate numerical logarithms with unusual bases using standard scientific calculators, which typically only feature base 10 (log) or base e (ln). This rule is also helpful for unifying mixed bases within an equation so you can apply standard logarithm laws.

## Key formulas

$\log_a(b) = \frac{\log_c(a)}{\log_c(b)}$

Special case: $\log_a(b) = \frac{1}{\log_b(a)}$

## Steps / method

Identify the original base ($a$) and the current internal argument ($b$) that you need to convert.

Select your new target base ($c$), which is typically base 10 for calculator evaluations.

Construct a fraction where the numerator is the log of the original argument under the new base ($\log_c(b)$).

Set the denominator as the log of the original base evaluated under that same new base ($\log_c(a)$), then compute the numerical value.

## Worked example

Evaluate $\log_8(32)$ without using a calculator.

Identify the terms: original base $a = 8$, argument $b = 32$. Choose a new base $c = 2$, since both numbers are powers of 2.

Apply the change of base formula: $\log_8(32) = \frac{\log_2(32)}{\log_2(8)}$.

Evaluate the numerator: since $2^5 = 32$, $\log_2(32) = 5$.

Evaluate the denominator: since $2^3 = 8$, $\log_2(8) = 3$. The final answer is $\frac{5}{3}$.

## Examiner tip

When applying the change of base formula, be careful not to swap the terms by mistake. The original base a always goes into the denominator at the bottom of the fraction, while the original argument b moves into the numerator at the top.

## Quick check

If you change the base of $\log_3(x)$ to base $x$, then the expression simplifies to the reciprocal form $\frac{1}{\log_x(3)}$.

## Visual / interactive intent
