# LaTeX authoring standard

All math content (notes, quizzes, topic titles) must render correctly via KaTeX. Follow these rules when writing or importing content.

## Key formulas sections

Always use numbered cards with a bold title and display math:

```markdown
**1 — Power rule**

$$\frac{d}{dx}(ax^n) = anx^{n-1}$$

Short description on its own line after the formula.
```

For $k$ variants, use the toggle marker:

```markdown
**2 — Sine**

$$\int \sin x\,dx = -\cos x + c$$
<!-- k-variant -->
$$\int k\sin x\,dx = -k\cos x + c$$
```

Never put a lone `$...$` line as the only content of a formula card — use `$$...$$`.

## Worked examples

- Put multi-step algebra in `$$...$$` blocks on their own lines.
- Use inline `$...$` only for short references (`$x = 2$`, `$a = 3$`).
- Do not split a formula across lines outside math delimiters.

## Core idea, steps, callouts

- Wrap all math: `$\frac{dy}{dx}$`, not bare `dy/dx`.
- Powers: `$(x+1)^2$`, never `(x+1)2`.
- Greek letters: `$\delta x$`, `$\pi$`.

## Quiz JSON

- `question`, each `options[]` entry, and `explanation` may contain `$...$` and `$$...$$`.
- **Every option with math must be fully wrapped** — the quiz UI renders options inline; bare `y/x`, `lg y`, or `y = 2x + 1` shows as plain text (Class H).
- Use `\lg`, `\ln` inside `$...$` — not bare `lg y`.
- Coordinates in options: `$(1, 5)$`. Areas: `$24\ \text{units}^2$`.
- Do not embed raw `\frac` without `$` delimiters.
- Run `npm run fix:math` after bulk imports.
- Run `node scripts/wrap-bare-quiz-options.mjs --topic <topicId>` to bulk-fix bare options.

## Tooling

| Command | Purpose |
|---------|---------|
| `npm run fix:math` | Auto-fix notes, quizzes, and titles (all subjects) |
| `npm run validate:math` | Report KaTeX errors and suspicious patterns |
| `npm run validate:math -- --strict` | Fail (exit 1) if any KaTeX errors |

The runtime app also runs `prepareMathContent()` at render time as a safety net, but **content should be correct at source**.
