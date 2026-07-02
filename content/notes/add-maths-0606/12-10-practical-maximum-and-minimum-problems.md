## Core idea

**Optimisation** finds the largest or smallest value of a quantity in a real-world setting. Write one formula for what you want to maximise or minimise, use a constraint to eliminate extra variables, then differentiate and solve.

## Key formulas

**Optimisation condition**

$$
\frac{df}{dx} = 0
$$

**Confirm maximum or minimum**

Use $\dfrac{d^2f}{dx^2}$ — negative for a maximum, positive for a minimum.

## Steps / method

1. **Define** the quantity to optimise (e.g. volume $V$ or area $A$).
2. **Use the constraint** to express everything in one variable.
3. **Differentiate** and set the derivative equal to zero.
4. **Solve** for the variable and confirm max/min with the second derivative.

### Key rule

Always check the second derivative (or context) to confirm whether you have found a maximum or minimum.

## Worked example — Rectangular area

Question: A rectangle has perimeter 40 cm. If one side is x cm, find the maximum area.

Other side $= 20 - x$, so $A = x(20 - x) = 20x - x^2$.

Differentiate: $\dfrac{dA}{dx} = 20 - 2x = 0$, giving $x = 10$.

Maximum area $= 10 \times 10 = 100$.

Check: $\dfrac{d^2A}{dx^2} = -2 < 0$, confirming a maximum.

## Worked example — Open box

Question: An open box is made from a 12 cm square sheet by cutting squares of side x cm from each corner. The volume is $V = x(12 - 2x)^2$. Find x for maximum volume.

Expand: $V = 4x^3 - 48x^2 + 144x$.

Differentiate: $\dfrac{dV}{dx} = 12x^2 - 96x + 144 = 12(x - 2)(x - 6) = 0$.

Valid solution: $x = 2$ (since $0 < x < 6$).

Check: $\dfrac{d^2V}{dx^2} = 24x - 96 < 0$ at $x = 2$, so this is a maximum.

## Examiner tip

Many questions have a "Show that…" part (a) and a "Find the stationary value…" part (b). Even if part (a) is difficult, you can still earn most marks by differentiating the given formula and solving $\dfrac{df}{dx} = 0$ in part (b).

## Quick check

At an optimum (maximum or minimum), the rate of change of the quantity is zero.
