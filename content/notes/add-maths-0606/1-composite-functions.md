## Core idea

A composite function represents the application of one function to the result of another function, written as $fg(x)$, which means you evaluate $g(x)$ first and then substitute that output directly into $f(x)$. Crucially, the composite function $fg$ only exists if the range of the inner function $g(x)$ is a subset of the domain of the outer function $f(x)$.

## Key formulas

$$fg(x) = f(g(x))$$

$$\text{Existence condition: } \text{Range of } g \subseteq \text{Domain of } f$$

## Steps / method

Write down the expression for the inner function, $g(x)$.

Substitute the entire algebraic expression of $g(x)$ into every instance of the variable $x$ within the outer function $f(x)$.

Simplify the resulting algebraic expression completely.

To find the domain of the composite function $fg(x)$, use the domain of the inner function $g(x)$, ensuring it complies with the structural limits of $f(g(x))$.

## Worked example

Let $f(x) = \frac{1}{x}$ and $g(x) = x - 3$. Find $fg(x)$ and state any values that must be excluded from the domain.

$$fg(x) = f(g(x)) = \frac{1}{x - 3}$$

The domain excludes $x = 3$ since this causes division by zero, even though $g(x)$ itself is defined for all $x$.

## Examiner tip

A common trap is evaluating the composition in the wrong order. Remember that $fg(x)$ means $f$ operates on $g(x)$, not the other way around. Note that in general $fg(x) \neq gf(x)$, and examiners regularly test this distinction directly.

## Quick check

If the range of $g$ is not contained within the domain of $f$, then the composite function $fg(x)$ cannot exist.

## Visual / interactive intent

New explorer: Composite function machine. Includes two function blocks ($f$ and $g$) where users can input custom linear or quadratic equations. A slider moves an input value $x$ through a animated pipeline showing it transform into $g(x)$ and then final output $f(g(x))$, visually flagging an error light if the intermediate value falls outside the domain of $f$.
