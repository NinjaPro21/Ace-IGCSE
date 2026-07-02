## Core idea

A composite function represents the application of one function to the result of another, written as $fg(x) = f(g(x))$. You evaluate $g(x)$ first, then substitute that output into $f(x)$. The composite $fg$ only exists if the range of $g$ is a subset of the domain of $f$.

## Key formulas

$$
fg(x) = f(g(x))

\text{Existence condition: } \text{Range of } g \subseteq \text{Domain of } f
$$


## Steps / method

Write down the expression for the inner function $g(x)$.

Substitute the entire expression of $g(x)$ into every instance of $x$ within the outer function $f(x)$.

Simplify the resulting algebraic expression completely.

To find the domain of $fg(x)$, start from the domain of $g(x)$ and exclude any values that make $f(g(x))$ undefined.

### Key rule

$fg(x)$ means $f$ operates on $g(x)$ — evaluate the **inner** function first. In general, $fg(x) \neq gf(x)$.

## Worked example — Finding $ fg(x)$

Let $f(x) = \frac{1}{x}$ and $g(x) = x - 3$. Find $fg(x)$ and state values excluded from the domain.

$$
fg(x) = f(g(x)) = \frac{1}{x - 3}
$$
$The domain excludes$ x = 3$since this causes division by zero, even though$ g(x)$itself is defined for all$ x²













## Worked example — Order matters

Using the same $f(x) = \frac{1}{x}$ and $g(x) = x - 3$: $$
gf(x) = g(f(x)) = \frac{1}{x} - 3
$$

$Compare:$ fg(x) = \frac{1}{x-3}$but$ gf(x) = \frac{1}{x} - 3$. These are **not equal** - composition order matters.

$$

## Examiner tip

A common trap is evaluating the composition in the wrong order. Remember that $fg(x)$ means $f$ operates on $g(x)$, not the other way around. Examiners regularly test whether $fg(x) = gf(x)$.

## Quick check

If the range of $g$ is not contained within the domain of $f$, then the composite function $fg(x)$ cannot exist.
