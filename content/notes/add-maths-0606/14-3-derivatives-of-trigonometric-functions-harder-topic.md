## Core idea

The derivatives of $\sin x$, $\cos x$, and $\tan x$ are standard results you must know. In exam questions the angle is rarely just $x$ — you combine these rules with the **chain rule**. All trigonometric calculus assumes angles are in **radians**.

## Which method do I use?

**Layer 1 — Basic (angle is $x$)**

Use the standard results directly. No chain rule needed.

**Layer 2 — Constant multiple ($k\sin x$)**

Differentiate the trig function first, then keep the constant factor.

**Layer 3 — Linear angle only ($\sin(ax)$, $\cos(ax)$, $\tan(ax)$)**

Let $u = ax$, so $\frac{du}{dx} = a$. Multiply the basic derivative by $a$.

**Layer 4 — Linear angle with shift ($\sin(ax+b)$)**

Same as Layer 3: identify $a$ from the coefficient of $x$ inside the bracket.

**Layer 5 — Constant × shifted angle ($k\sin(ax+b)$)**

Combine Layers 2 and 4: multiply by both $k$ and $a$.

**Layer 6 — Powers ($\sin^n x$, $\cos^n x$, $\tan^n x$)**

Rewrite as $(\sin x)^n$, then use the chain rule: bring the power down, reduce the power by 1, multiply by the derivative of the base.

## Key formulas

**1 — Sine**

$$
\frac{d}{dx}(\sin x) = \cos x
$$

<!-- k-variant -->

$$
\frac{d}{dx}[k\sin x] = k\cos x
$$

**2 — Cosine**

$$
\frac{d}{dx}(\cos x) = -\sin x
$$

<!-- k-variant -->

$$
\frac{d}{dx}[k\cos x] = -k\sin x
$$

**3 — Tangent**

$$
\frac{d}{dx}(\tan x) = \sec^2 x
$$

<!-- k-variant -->

$$
\frac{d}{dx}[k\tan x] = k\sec^2 x
$$

**4 — Sine with linear angle $\sin(ax+b)$**

$$
\frac{d}{dx}[\sin(ax+b)] = a\cos(ax+b)
$$

<!-- k-variant -->

$$
\frac{d}{dx}[k\sin(ax+b)] = ka\cos(ax+b)
$$

**5 — Cosine with linear angle $\cos(ax+b)$**

$$
\frac{d}{dx}[\cos(ax+b)] = -a\sin(ax+b)
$$

<!-- k-variant -->

$$
\frac{d}{dx}[k\cos(ax+b)] = -ka\sin(ax+b)
$$

**6 — Tangent with linear angle $\tan(ax+b)$**

$$
\frac{d}{dx}[\tan(ax+b)] = a\sec^2(ax+b)
$$

<!-- k-variant -->

$$
\frac{d}{dx}[k\tan(ax+b)] = ka\sec^2(ax+b)
$$

**7 — Powers (chain rule)**

$$
\frac{d}{dx}(\sin^n x) = n\sin^{n-1}x\cos x
$$

<!-- k-variant -->

$$
\frac{d}{dx}[k\sin^n x] = kn\sin^{n-1}x\cos x
$$

**8 — Powers of cosine and tangent**

$$
\frac{d}{dx}(\cos^n x) = -n\cos^{n-1}x\sin x

\frac{d}{dx}(\tan^n x) = n\tan^{n-1}x\sec^2 x
$$


## Steps / method

1. **Check the angle** — is it $x$, $ax$, or $ax+b$? Is there a constant $k$ outside?











 2. **Identify $a$** — the coefficient of $x$ inside the bracket (if there is no bracket, $a = 1$).











 3. **Differentiate the trig function** — $\sin \to \cos$, $\cos \to -\sin$, $\tan \to \sec^2$.











 4. **Apply the chain rule** — multiply by $a$ (and by $k$ if present).











 5. **For powers** — rewrite as $(\text{trig}\,x)^n$, use the power rule on the outside, then multiply by the inner derivative.

## Worked example — Layer 1 (Basic)

Question: Find $\frac{dy}{dx}$ when $y = \tan x - 3\cos x$. Differentiate term by term: $$
$\frac{dy}{dx} = \sec^2 x - 3(-\sin x) = \sec^2 x + 3\sin x$

## Worked example — Layer 2 (Constant multiple)

Question: Differentiate $y = 5\sin x$.

The constant stays: $$
$\frac{dy}{dx} = 5\cos x$

## Worked example — Layer 3 ($\cos(ax)$)

Question: Differentiate $y = \cos(5x)$. Here $a = 5$.

$$
\frac{dy}{dx} = -5\sin(5x)
$$

## Worked example — Layer 4 ($\sin(ax+b)$)

Question: Find $\frac{dy}{dx}$ for $y = \sin(2x + 1)$.

Inner angle: $u = 2x + 1$, so $a = 2$.

$$
\frac{dy}{dx} = 2\cos(2x + 1)
$$

## Worked example — Layer 5 ($ k\sin(ax+b)$)

Question: Differentiate $y = -4\sin(3x - \pi)$. Here $k = -4$ and $a = 3$.

$$
\frac{dy}{dx} = -4 \times 3\cos(3x - \pi) = -12\cos(3x - \pi)
$$

## Worked example — Layer 6 ($\sin^2 x $)

Question: Find $\frac{dy}{dx}$ for $y = \sin^2 x$.

Rewrite as $y = (\sin x)^2$. Use the chain rule: bring down the power, then multiply by the derivative of $\sin x$.

$$
\frac{dy}{dx} = 2(\sin x)^1 \times \cos x = 2\sin x\cos x
$$

## Worked example — Layer 6 ($\cos^2(2x)$)

Question: Differentiate $y = \cos^2(2x)$.

Rewrite: $y = [\cos(2x)]^2$. Outer power gives $2[\cos(2x)]^1$; inner derivative is $-2\sin(2x)$.

$$
\frac{dy}{dx} = 2\cos(2x) \times (-2\sin(2x)) = -4\cos(2x)\sin(2x)
$$

## Worked example — Tangent with shift

Question: Find $\frac{dy}{dx}$ when $y = 2\tan\left(x + \frac{\pi}{4}\right)$. Here $a = 1$ and $k = 2$: $$
$\frac{dy}{dx} = 2\sec^2\left(x + \frac{\pi}{4}\right)$

## Common mistakes

**Forgotten $a$**: $\frac{d}{dx}[\sin(3x)] = 3\cos(3x)$, not $\cos(3x)$.

**Missing minus on cos**: $\frac{d}{dx}[\cos(2x+1)] = -2\sin(2x+1)$, not $+2\sin(2x+1)$.

**Power rule on trig**: Do not treat $\sin x$ like $x^n$. For $\sin^n x$, rewrite as $(\sin x)^n$ and use the chain rule.

**Degrees vs radians**: Calculus always uses radians. Check your calculator is in RAD mode.

## Examiner tip

**The "C" rule**: Functions starting with **C** ($\cos$, $\csc$, $\cot$) often introduce a **minus sign** in their derivatives.

**Identities when needed**: In harder questions the expression may need rewriting first — e.g. use $\sin^2 x = 1 - \cos^2 x$ or expand $(\sin x)^n$ before differentiating. Always simplify **inside** the operation before applying the rule.

**Check by integrating**: Your derivative should reverse to the original when integrated (ignoring $+c$).

## Quick check

Find $\frac{d}{dx}[\sin(4x - 2)]$.

Find $\frac{d}{dx}(\sin^2 x)$.

What is the second derivative of $\sin x$?
