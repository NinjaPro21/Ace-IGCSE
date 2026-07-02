## Core idea

This section combines product, quotient, and chain rules with exponential, logarithmic, and trigonometric functions to solve problems involving tangents, normals, and stationary points.

## Which method do I use?

**Product structure** — two functions multiplied, such as $xe^x$: use the product rule.

**Quotient structure** — one function over another, such as $\frac{x}{x+1}$: use the quotient rule.

**Function of a function** — something inside a power or bracket, such as $(2x+1)^5$ or $\sin(3x)$: use the chain rule.

**Transcendental mix** — combine the above with $e^x$, $\ln x$, or trig derivatives from Chapter 14.

## Steps / method

1. **Rewrite if needed** — use a trig or log identity first if the expression is not in standard form.
2. **Select the rule** — product, quotient, or chain (often more than one in the same question).
3. **Differentiate** — find $u'$, $v'$, or the inner derivative as required.
4. **Solve the target** — substitute $x$ or set $\frac{dy}{dx} = 0$ for stationary points.

## Worked example — Product with exponential

Question: Find the stationary point of $y = xe^x$.

Let $u = x$, $u' = 1$, $v = e^x$, $v' = e^x$.

$$
\frac{dy}{dx} = xe^x + e^x = e^x(x+1)
$$

Set to zero: $e^x(x+1) = 0$. Since $e^x \neq 0$, we need $x = -1$

When $x = -1$, $y = -\frac{1}{e}$

The stationary point is at $x = -1$, $y = -\frac{1}{e}$

## Worked example — Normal to log curve

Question: Find the equation of the normal to $y = \ln x$ when x = e

The point is $(e, 1)$

The derivative is $\frac{1}{x}$, so the tangent gradient at x = e is $\frac{1}{e}$

Normal gradient is $-e$

The normal is $y = -ex + e^2 + 1$

## Examiner tip

In harder questions, rewrite the expression first — use identities such as $\sin^2 x = 1 - \cos^2 x$ or log laws before differentiating.

## Quick check

If $y = \ln x$, is the curve always increasing for $x > 0$?

Yes — $\frac{dy}{dx} = \frac{1}{x} > 0$ when $x > 0$
