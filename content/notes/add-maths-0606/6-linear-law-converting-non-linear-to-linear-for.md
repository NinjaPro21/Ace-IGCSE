## Core idea

Linear law is a method used to convert non-linear relationships into straight-line forms so that experimental constants can be estimated. By applying algebraic operations or logarithms, non-linear variables are mapped onto new capital coordinate axes ($X$ and $Y$) where the graph becomes a straight line.

## Key formulas

$$y = ax^n \implies \ln y = n \ln x + \ln a \quad (\text{Plot } \ln y \text{ vs } \ln x \implies Y = mX + C)$$

$$y = Ab^x \implies \ln y = (\ln b)x + \ln A \quad (\text{Plot } \ln y \text{ vs } x \implies Y = mX + C)$$

## Steps / method

Take the given non-linear physical formula relating $x$ and $y$.

Apply algebraic operations (such as taking natural logarithms $\ln$ or dividing through by $x$) to isolate the constants.

Group the expression to match the standard linear form: $Y = mX + C$.

Clearly define what the new vertical axis component $Y$ and horizontal axis component $X$ represent.

Equate the gradient of the straight line to the corresponding algebraic group ($m$), and do the same for the vertical intercept ($C$).

### Key rule

For $y = ax^n$, plot $\ln y$ against $\ln x$ — gradient $= n$, intercept $= \ln a$. For $y = Ab^x$, plot $\ln y$ against $x$ — gradient $= \ln b$, intercept $= \ln A$.

## Worked example — Power law $y = ax^n$

Given $y = 3x^2$, express in linear form.

$$\ln y = \ln 3 + 2\ln x \implies Y = 2X + \ln 3 \quad \text{where } Y = \ln y,\; X = \ln x$$

Gradient $= 2 = n$, intercept $= \ln 3$, so $a = e^{\ln 3} = 3$.

## Worked example — Exponential law $y = Ab^x$

Given $y = 5 \times 2^x$, express in linear form.

$$\ln y = x\ln 2 + \ln 5 \implies Y = (\ln 2)X + \ln 5 \quad \text{where } Y = \ln y,\; X = x$$

Gradient $= \ln 2$, so $b = 2$; intercept $= \ln 5$, so $A = 5$.

## Examiner tip

When reading values from a linear law graph, remember that the vertical intercept is equal to $\ln a$, not just $a$. You must apply the inverse exponential function ($a = e^C$) to find the original constant value.

## Quick check

If you plot $\ln y$ against $\ln x$ for the expression $y = ax^n$, then the gradient of the resulting line is exactly equal to $n$.

## Visual / interactive intent

New explorer: Linear law transformer. Two side-by-side graphs. The left shows an exponential curve $y = Ab^x$. Sliders adjust $A$ and $b$. The right graph shows the transformed linear plot $\ln y$ vs $x$, illustrating how the curve flattens into a line.
