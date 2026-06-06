## Core idea

Integration is the mathematical reverse process of differentiation, often referred to as finding the anti-derivative. An indefinite integral finds a general family of functions that share the same derivative, which requires adding an arbitrary constant of integration ($C$) to represent the original constant value that was lost during differentiation.

## Key formulas

$$\int x^n \, dx = \frac{x^{n+1}}{n+1} + C \quad (\text{valid for } n \neq -1)$$

$$\int (ax + b)^n \, dx = \frac{(ax + b)^{n+1}}{a(n+1)} + C \quad (\text{valid for } n \neq -1)$$

$$\int e^{ax+b} \, dx = \frac{1}{a}e^{ax+b} + C, \quad \int \frac{1}{x} \, dx = \ln|x| + C, \quad \int \frac{1}{ax+b} \, dx = \frac{1}{a}\ln|ax+b| + C$$

$$\int \sin(ax+b) \, dx = -\frac{1}{a}\cos(ax+b) + C, \quad \int \cos(ax+b) \, dx = \frac{1}{a}\sin(ax+b) + C$$

## Steps / method

Identify the form of the expression inside the integral sign.

For basic polynomial powers, increase the exponent by 1, then divide the term by this new power.

For linear composite brackets of the form $(ax+b)^n$, increase the power by 1, then divide by both the new power and the coefficient $a$.

For exponential and trigonometric terms, apply the reverse derivative rules, dividing by the inner linear coefficient $a$ rather than multiplying.

Always append the constant of integration ($+C$) to the end of your final expression for all indefinite integrals.

## Examiner tip

Remember that the power rule does not work when the exponent is $-1$, such as for the function $\frac{1}{x}$. Attempting to apply the power rule here leads to division by zero; instead, recognize that this terms integrates to a natural logarithm function ($\ln|x|$).

## Quick check

If you integrate the function $y = e^{2x}$, the indefinite integral is equal to $\frac{1}{2}e^{2x} + C$.

## Visual / interactive intent
