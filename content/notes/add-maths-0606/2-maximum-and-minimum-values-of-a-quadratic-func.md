## Core idea

Every quadratic function possesses a single turning point called a vertex, which represents either its absolute minimum value (if the parabola opens upwards/looks like a smiley face) or maximum value (if it opens downwards/looks like a sad face). Completing the square transforms the quadratic expression into a vertex form that allows immediate identification of these maximum or minimum coordinates without calculus.

## Key formulas

$$f(x) = ax^2 + bx + c$$

$$\text{Vertex Form: } f(x) = a(x - h)^2 + k$$

$$\text{Vertex Coordinates: } (h, k) = \left(-\frac{b}{2a}, f\left(-\frac{b}{2a}\right)\right)$$

## Steps / method

Factor out the coefficient $a$ from the first two terms containing $x^2$ and $x$.

Take half of the new coefficient of $x$, square it, then add and subtract this value inside the bracket.

Group the perfect square trinomial into the form $(x - h)^2$ and expand the outer constant multiplier.

Simplify the remaining constants outside the bracket to achieve the form $a(x - h)^2 + k$.

Identify the vertex $(h, k)$. If $a &gt; 0$, $k$ is the minimum value at $x = h$. If $a &lt; 0$, $k$ is the maximum value at $x = h$.

### Key rule

The vertex $(h, k)$ gives the turning point; if $a > 0$, $k$ is the minimum value at $x = h$; if $a < 0$, $k$ is the maximum value.

## Worked example — Minimum value

Express $f(x) = 2x^2 - 8x + 11$ in the form $a(x - h)^2 + k$ and state the minimum value.

Factor out 2: $f(x) = 2(x^2 - 4x) + 11 = 2(x^2 - 4x + 4 - 4) + 11 = 2(x - 2)^2 + 3$.

The vertex is $(2, 3)$. Since $a = 2 > 0$, the minimum value is $3$ at $x = 2$.

## Worked example — Maximum value

Find the maximum value of $g(x) = -x^2 + 6x - 5$.

Complete the square: $g(x) = -(x^2 - 6x) - 5 = -(x^2 - 6x + 9 - 9) - 5 = -(x - 3)^2 + 4$.

Since $a = -1 < 0$, the maximum value is $4$ at $x = 3$.

## Examiner tip

When an exam question asks for the &quot;maximum or minimum value of the function,&quot; give the $y$-coordinate ($k$). If it asks for &quot;the value of $x$ where it occurs,&quot; state the $x$-coordinate ($h$). Confusing these two will result in structural mark losses.

## Quick check

If $a &lt; 0$ in the completed square form $a(x-h)^2 + k$, then the turning point represents a maximum value.

## Visual / interactive intent

Reuse explorer: Vertex form shifting tool. Sliders for $a$, $h$, and $k$ adjust a parabola. As sliders change, the vertex point coordinates update on the graph along with the matching completed-square equation block.
