## Core idea

The natural logarithm $\ln x$ uses base $e \approx 2.71828$ and is the inverse of $y = e^x$. Use $\ln$ when solving exponential growth/decay models or calculus problems involving $e$.

## Key formulas

**Definition**

$$
\ln x = \log_e x
$$

**Inverse properties**

$$
\ln(e^x) = x \quad \text{and} \quad e^{\ln x} = x \quad (x > 0)
$$

**Special values**

$$
\ln e = 1, \qquad \ln 1 = 0
$$

## Steps / method

1. **Identify** expressions involving $e^x$ or $\ln x$.
2. **Isolate** the exponential term on one side of the equation.
3. **Apply** $\ln$ to both sides (or $e$ to both sides) to remove the outer function.
4. **Use log laws** to simplify before solving for the variable.

### Key rule

$\ln$ is **not** $\log_{10}$. Also, $\ln(a + b) \neq \ln a + \ln b$ — you cannot split a log across addition.

## Worked example — Solving an equation

Question: Solve $3e^{2x - 1} + 4 = 19$.

Isolate the exponential term:

$$
3e^{2x - 1} = 15 \Rightarrow e^{2x - 1} = 5
$$

Take natural logs of both sides:

$$
2x - 1 = \ln 5
$$

$$
x = \frac{\ln 5 + 1}{2} \approx 1.30 \text{ (3 s.f.)}
$$

## Examiner tip

Students often confuse $\ln x$ with $\log_{10} x$. Remember that $\ln = \log_e$. Never write $\ln(e^x + 2) = x + \ln 2$ — that is incorrect.

## Quick check

If $e^x = 7$, then $x = \ln 7$.
