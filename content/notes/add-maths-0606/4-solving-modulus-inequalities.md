## Core idea

Modulus inequalities define specific numeric intervals where a function's absolute magnitude is either strictly bounded within or safely outside defined limits. Use this when designing system tolerance limits or identifying valid operating intervals where errors cannot exceed a maximum threshold. Depending on the inequality sign, the solution will form either a single enclosed interval or a split pair of open intervals extending toward infinity.

## Key formulas

If ∣f(x)∣≤k (where k&gt;0), then −k≤f(x)≤k

If ∣f(x)∣≥k (where k&gt;0), then f(x)≤−korf(x)≥k

Alternative method: ∣f(x)∣&lt;∣g(x)∣⟹[f(x)]2&lt;[g(x)]2

## Steps / method

Check if the inequality matches a &quot;less than&quot; (∣f(x)∣&lt;k) or &quot;greater than&quot; (∣f(x)∣&gt;k) pattern to choose your solution strategy.

For a &quot;less than&quot; inequality, remove the modulus bar and place the inner algebraic term inside a single three-part compound inequality between −k and +k.

For a &quot;greater than&quot; inequality, split the expression into two separate inequalities: f(x)&gt;k along with f(x)&lt;−k, solving each one independently.

Alternatively, if both sides contain variables, square both sides completely to remove the modulus effect, rearrange the terms into a standard quadratic inequality, and solve for your intervals.

### Key rule

For $|f(x)| < k$, write $-k < f(x) < k$; for $|f(x)| > k$, split into two separate inequalities $f(x) > k$ or $f(x) < -k$.

## Worked example — Less than inequality

Solve $|x - 3| < 5$.

Remove the modulus: $-5 < x - 3 < 5$. Add 3 throughout: $-2 < x < 8$.

## Worked example — Greater than inequality

Solve $|2x + 1| \ge 7$.

Split: $2x + 1 \ge 7$ or $2x + 1 \le -7$. So $x \ge 3$ or $x \le -4$.

## Examiner tip

When multiplying or dividing any inequality expression by a negative number during your rearrangement steps, remember to reverse the direction of the inequality sign. Forgetting to flip the sign is a common error that completely inverts your final intervals.

## Quick check

If you are solving ∣x−1∣&gt;4, then your final answer must be stated as two separate split intervals: x&gt;5 or x&lt;−3.

## Visual / interactive intent

New explorer — Inequality interval mapping system. Features a linear axis track where users slide markers to define the target value of k. The system highlights the valid solution area dynamically in green, illustrating the difference between single contained intervals and split external intervals.
