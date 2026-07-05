## Core idea

Many practical relationships are non-linear (e.g. $y = Ab^x$ or $y = ax^n$). By taking logarithms, we convert them to linear form $Y = mX + c$, so a straight-line graph reveals the unknown constants.

## Key formulas

**Case 1 — Exponential form** ($y = Ab^x$)

$$
\ln y = (\ln b)\, x + \ln A
$$

Plot $\ln y$ against $x$. Gradient $m = \ln b$, intercept $c = \ln A$.

**Case 2 — Power law form** ($y = ax^n$)

$$
\ln y = n \ln x + \ln a
$$

Plot $\ln y$ against $\ln x$. Gradient $m = n$, intercept $c = \ln a$.

## Steps / method

1. **Identify the form** — is the variable in the exponent ($Ab^x$) or as a power ($ax^n$)?

2. **Take logarithms** of both sides ($\ln$ or $\lg$).

3. **Expand** using log laws: $\ln(pq) = \ln p + \ln q$ and $\ln(p^r) = r \ln p$.

4. **Match** to $Y = mX + c and identify the axes, gradient, and intercept.$

5. **Solve** for the original constants (e.g22A = e^c$when using$\ln$).$

### Key rule

The intercept is the **logarithm** of the constant, not the constant itself. If $c = \ln A$, then $A = e^c$.

## Worked example — Exponential growth

Question: A bacterial population follows $N = N_0 e^{kt}$. A graph of $\ln N$ against $t$ passes through $(2, 4.2)$ and $(6, 6.6)$. Find $N_0$ and $k$.

Linearise: $\ln N = kt + \ln N_0$, so $Y = \ln N$, $X = t$, $m = k$, $c = \ln N_0$.

$$
k = \frac{6.6 - 4.2}{6 - 2} = 0.6
$$

Using $(2, 4.2)$: $4.2 = 0.6(2) + \ln N_0$, so $\ln N_0 = 3.0$ and $N_0 = e^{3.0} \approx 20.1$.

## Examiner tip

Do not write the intercept directly as your constant (e.g. $N_0 = 3$). The intercept equals $\ln N_0$, so $N_0 = e^c$.

## Quick check

If a graph of $\ln y$ against $\ln x$ has gradient $-2$, the original relationship is a power law with $n = -2, i.e$. $2y = ax^{-2}$.
