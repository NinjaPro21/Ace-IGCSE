## Core idea

Differentiation is a mathematical tool used to find the rate at which a variable changes, which corresponds to the gradient of a curve at any given point. The derivative transforms an equation into a gradient function that outputs the slope of the tangent line for any input value of $x$.

## Key formulas

$\frac{dy}{dx} = \frac{dy}{du} \times \frac{du}{dx}$

## Steps / method

For basic powers, multiply the coefficient by the current exponent, then subtract 1 from the power.

If differentiating a composite function, apply the Chain Rule: differentiate the outer structure while keeping the inner function unchanged, then multiply by the derivative of that inner function.

For two functions multiplied together, apply the Product Rule: keep the first function same times derivative of second plus second function same times derivative of first.

For fractional functions, apply the Quotient Rule, making sure to track the minus sign in the numerator.

### Key rule

Rewrite roots and fractions as powers before differentiating. Constants differentiate to zero; apply the chain rule whenever an expression is nested inside another function.

## Worked example — Power rule

Differentiate $y = 3x^4 - 5x + 7$.

$$
\frac{dy}{dx} = 12x^3 - 5
$$

## Worked example — Chain rule

Differentiate $y = (2x + 1)^5$.

$$
\frac{dy}{dx} = 5(2x + 1)^4 \times 2 = 10(2x + 1)^4
$$

## Examiner tip

Before differentiating expressions with fractions or roots (like $\frac{3}{x^2}$ or $\sqrt{x^3}$), rewrite them using negative and fractional indices ($3x^{-2}$ and $x^{3/2}$). This permits direct, error-free application of the standard power rule.

## Quick check

If a function is a constant value (such as $y = 7$), its derivative is exactly 0 because a horizontal line has no slope.
