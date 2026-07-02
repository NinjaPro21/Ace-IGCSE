## Core idea

Logarithmic equations are mathematical expressions where the unknown variable is located inside the argument of a logarithm. Use this mathematical setup when analyzing physical systems scaled to logarithmic magnitudes, such as acidity indicators or signal attenuation models. Solving these requires using logarithm laws to combine multiple terms into a single log statement, which can then be converted into standard exponential form.

## Key formulas

$\log_a(xy) = \log_a x + \log_a y$

$\log_a\left(\frac{x}{y}\right) = \log_a x - \log_a y$

$\log_a(x^n) = n\log_a x$

## Steps / method

Use the laws of logarithms (product and quotient rules) to combine all separate log terms on each side into a single log expression.

If the equation is set equal to a constant ($\log_a(f(x)) = k$), convert it into its exponential form $f(x) = a^k$ to remove the logarithm.

If the equation features identical logs on both sides, equate their inner arguments directly ($f(x) = g(x)$).

Solve the resulting equation for $x$, and always substitute your answers back into the original arguments to confirm that no argument becomes zero or negative.

### Key rule

Combine logs using the laws, convert to exponential form, then reject any solution that makes an argument zero or negative.

## Worked example — Product law

Solve $\log_2(x) + \log_2(x - 2) = 3$.

Combine: $\log_2(x(x - 2)) = 3 \implies x^2 - 2x = 8 \implies (x - 4)(x + 2) = 0$.

$x = 4$ is valid; $x = -2 gives negative arguments - **reject**$. $2x = 4$.

## Worked example — Equating arguments

Solve $\log_5(2x + 1) = \log_5(x + 7)$. Equate arguments: $2x + 1 = x + 7 \implies x = 6$. Check: $\log_5(13) = \log_5(13)$ ✓.

## Examiner tip

Always check your final answers in the original equation's arguments. Even if your algebra is perfect, a solution can be invalid if it results in taking the logarithm of a negative number or zero.

## Quick check

If a solved logarithmic equation outputs a root value that creates a negative argument inside any original logarithm term, then that root must be rejected.
