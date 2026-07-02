## Core idea

Exponential equations have the unknown in the exponent (e.g. $2^x = 10$); logarithmic equations have the unknown inside a log term. For exponentials, take logs of both sides to bring down the exponent. For logarithmic equations, use log laws to condense to a single log, then convert back to exponential form. Always verify solutions — rejected roots are common when log arguments would be negative.

## Key formulas

$\log_a(xy) = \log_a x + \log_a y$

$\log_a\left(\frac{x}{y}\right) = \log_a x - \log_a y$

$\log_a(x^n) = n\log_a x$

## Steps / method

**Exponential equations:** Isolate the exponential term → take $\log$. $\ln. x$.

**Logarithmic equations:** Condense using log laws → remove logs (equate arguments or convert to exponential form) → solve the resulting algebra → verify each root in the original equation.

## Worked example — Exponential (simple)

Question: Solve $3^{2x - 1} = 5$. Take $\ln$. So $\ln(3^{2x - 1}) = \ln 5$. Power Law: $(2x - 1)\ln 3 = \ln 5$.

Isolate $x$. $2x - 1 = \frac{\ln 5}{\ln 3} \Rightarrow x \approx 1.23$ (3 s.f.).

## Worked example — Exponential (hidden quadratic)

Question: Solve $e^{2x} - 5e^x + 6 = 0$.

Let $u = e^x$. So $u^2 - 5u + 6 = 0 \Rightarrow (u - 2)(u - 3) = 0$.

So $e^x = 2 \Rightarrow x = \ln 2$, or $e^x = 3 \Rightarrow x = \ln 3$.

## Worked example — Logarithmic (equating arguments)

Question: Solve $\log_2(x + 3) + \log_2 x = 2$.

Product Law: $\log_2(x(x + 3)) = 2 \Rightarrow x(x + 3) = 4$. So $x^2 + 3x - 4 = 0 \Rightarrow (x + 4)(x - 1) = 0$. Reject $x = -4$ (log undefined). Answer: $x = 1$.

## Worked example — Logarithmic (natural logs)

Question: Solve $2\ln x - \ln(x - 1) = \ln 4$.

Laws: $\ln\left(\frac{x^2}{x - 1}\right) = \ln 4 \Rightarrow \frac{x^2}{x - 1} = 4$.

So $x^2 - 4x + 4 = 0 \Rightarrow (x - 2)^2 = 0 \Rightarrow x = 2$.

## Examiner tip

For exponential quadratics, reject negative values of $u = e^x$. For logarithmic equations, always check for rejected solutions — one algebraic root often makes a log argument negative and must be discarded.

## Quick check

If $2^x = 8$, then $x = 3$. Al so, $\log x + \log y = 0$ means $xy = 1$.
