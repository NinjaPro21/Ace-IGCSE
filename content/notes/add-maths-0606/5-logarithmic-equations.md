## Core idea

Logarithmic equations are mathematical expressions where the unknown variable is located inside the argument of a logarithm. Use this mathematical setup when analyzing physical systems scaled to logarithmic magnitudes, such as acidity indicators or signal attenuation models. Solving these requires using logarithm laws to combine multiple terms into a single log statement, which can then be converted into standard exponential form.

## Key formulas

$\log_a(f(x)) = k \implies f(x) = a^k$

$\log_a(f(x)) = \log_a(g(x)) \implies f(x) = g(x)$

## Steps / method

Use the laws of logarithms (product and quotient rules) to combine all separate log terms on each side into a single log expression.

If the equation is set equal to a constant ($\log_a(f(x)) = k$), convert it into its exponential form $f(x) = a^k$ to remove the logarithm.

If the equation features identical logs on both sides, equate their inner arguments directly ($f(x) = g(x)$).

Solve the resulting equation for $x$, and always substitute your answers back into the original arguments to confirm that no argument becomes zero or negative.

## Worked example

Solve the equation $\log_2(x) + \log_2(x - 2) = 3$.

Apply the Product Law to combine the logs: $\log_2(x(x - 2)) = 3 \implies \log_2(x^2 - 2x) = 3$.

Convert the log equation into exponential form: $x^2 - 2x = 2^3 \implies x^2 - 2x = 8$.

Rearrange into standard quadratic form: $x^2 - 2x - 8 = 0$.

Factorize and solve: $(x - 4)(x + 2) = 0 \implies x = 4$ or $x = -2$.

Check for validity: $x = 4$ gives valid positive arguments ($\log_2(4)$ and $\log_2(2)$). However, $x = -2$ creates an invalid negative argument ($\log_2(-2)$). Thus, reject $x = -2$. The only solution is $x = 4$.

## Examiner tip

Always check your final answers in the original equation's arguments. Even if your algebra is perfect, a solution can be invalid if it results in taking the logarithm of a negative number or zero.

## Quick check

If a solved logarithmic equation outputs a root value that creates a negative argument inside any original logarithm term, then that root must be rejected.

## Visual / interactive intent
