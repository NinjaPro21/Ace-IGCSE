# Quiz fix campaign — agent prompt (AceIGCSE)

Copy everything inside the **START / END** block into a new Cursor chat when continuing the site-wide quiz cleanup.

---

## START — paste below this line into a new chat

You are helping fix **quiz content and LaTeX rendering** for **AceIGCSE**, a Cambridge IGCSE study app (Add Math 0606, Maths 0580, Physics 0625).

**Live site:** https://aceigcse.my

### Goal

Roll out **chapter-by-chapter quiz fixes** so every question, option, and explanation renders correctly in the quiz UI (KaTeX), with mathematically correct answers. Work is **not** just JSON edits — many bugs are **pipeline-side** (`fixQuizLatexText`) where correct JSON breaks at render time.

### How we work (mandatory)

1. **One chapter at a time** — get user green-light before moving on.
2. **Fix both layers:** quiz JSON **and** `src/lib/mathMarkdown.ts` when render pipeline corrupts valid LaTeX.
3. **Verify in UI** — questions use `<MathText block />`, options use inline; asymmetry causes question-only bugs.
4. **Run audits before claiming done:**
   ```bash
   npm run audit:quizzes -- --topic <topic-id>   # per topic
   npm run content:qa                            # pre-deploy gate
   ```
5. **Deploy only after user confirms** Ch review: `npm run deploy:hosting` (runs `content:qa` first).
6. **Do not commit** unless the user explicitly asks.

### Scope

| Subject | Quiz root | Chapter index |
|---------|-----------|---------------|
| Add Math 0606 | `content/quizzes/add-maths-0606/` | `content/chapters/add-maths-0606/chNN-*.json` → `topicIds` |
| Maths 0580 | `content/quizzes/maths-0580/` | `content/chapters/maths-0580/` |
| Physics 0625 | `content/quizzes/physics/` | `content/chapters/physics/` |

Each canonical topic has **4 quiz files**: `-easy.json`, `-medium.json`, `-hard.json`, `-pyp.json` (5 questions each, 20 per topic).  
**Ignore legacy duplicate files** not listed in the chapter’s `topicIds` (e.g. old `1-mappings-and-definition-of-a-function-*.json`).

### Key files

| Purpose | Path |
|---------|------|
| Quiz JSON | `content/quizzes/<subject>/<topic-id>-{easy,medium,hard,pyp}.json` |
| Math pipeline (quiz) | `src/lib/mathMarkdown.ts` → `fixQuizLatexText()`, `findQuizMathRenderIssues()`, `prepareMathContent(..., 'quiz')` |
| Quiz renderer | `src/components/MathText.tsx` (block vs inline) |
| Quiz UI | `src/features/quiz/QuizArena.tsx` |
| Semantic audit | `scripts/audit-quiz-content.mjs` |
| Pre-deploy QA | `scripts/content-qa.mjs` |
| LaTeX authoring rules | `content/LATEX_AUTHORING.md` |

### Bug taxonomy (what to hunt)

**Class A — Raw JSON / docx import corruption**
- `$1$ where the domain` instead of `x \mapsto …`
- `\frac{…x-}{1x+…}`, `\frac{tions}`, `$2$` placeholders
- `\nle` / `\nge` (newline ate backslash)
- Incomplete explanations (`Range is .`)

**Class B — Bare math outside `$...$`** (often auto-wrapped by pipeline; fail only if **render** still broken)
- `gf(0)`, `x^{3}`, `y=|f(x)|`, bare fractions

**Class C — Post-pipeline render failures** (`findQuizMathRenderIssues` after `fixQuizLatexText`)
- Unbalanced `$` delimiters
- Bare `\le`, `\ge`, `\neq` visible in UI
- Period trapped **inside** math: `$0 \le x \le 4.$` instead of `$0 \le x \le 4$.`
- Escaped dollar visible: `$\$h(a)$`
- Inline math split across lines before `\le`

**Class D — Math correctness**
- Wrong intersection points, wrong inverse values, explanation contradicts question
- Use `extractMappingFractions` / manual review for PYP-style questions

**Class E — Delimiter / notation**
- Orphan `$` before `?`
- Unicode `∣` → `|` (pipeline now normalizes), `x≥0` → `$x \ge 0$`
- `where the domain is$…` glued delimiters

**Class F — Mapping / domain prose trapped in one `$...$` block**
- `$x \mapsto … for the domain …$` should split: `$x \mapsto …$ for the domain …`

**Class G — Modulus / graphs**
- `y=|f(x)|` outside math delimiters

**Class H — Bare math in options** (quiz UI renders options inline; without `$...$` you get plain `y/x^2`, `lg y`, `Y = lg y, X = lg x`)
- Every option containing variables, fractions, logs, or equations must use `$...$`
- Use `\lg`, `\ln` inside math — not bare `lg y`
- Use `$24\ \text{units}^2$` not `24 units^2`
- Use `$(1, 5)$` not `(1, 5)` for coordinate pairs
- Detected by `isBareQuizOptionMath()` in audit; auto-wrapped at render by `wrapBareQuizOption()` as a safety net — **fix JSON source anyway**
- Run bulk fix: `node scripts/wrap-bare-quiz-options.mjs --topic <topicId>`

**Class I — Pipeline traps on degree→radian chains** (Ch.8+)
- Long inline math like `$150 \times \frac{\pi}{180} = \frac{15}{18}\pi$` can be eaten by `fixDollarTwoPlaceholder` (false `$2$` match inside digit strings)
- **Prefer compact form:** `$\frac{150\pi}{180} = \frac{5\pi}{6}$` — survives `fixQuizLatexText`
- Broken variant options: `"$$\n\\frac{1}{2}\\pi\n"` → `"$\\frac{1}{2}\\pi$"`
- Docx caret glue: `of^12 cm` → `of $12$ cm` or `of 12 cm`
- Misattached variant blocks on unrelated parent questions — delete or regenerate

### Audit severity

- **Errors (blocking):** questions & options — raw corruption + render failures
- **Warnings:** explanations only (unicode `≥` in prose, messy explanations) — use `--strict` to fail on those

### Known pipeline pitfalls (already partially fixed — watch for regressions)

These rules in `mathMarkdown.ts` have caused **correct JSON → broken UI**:

1. `fixProseTrappedInInlineMath`: stripping `$` before `.` or `?` when preceded by `4`, `}`, `]` (valid math close)
2. `closeInlineMathBeforePunctuation`: treating a **closing** `$` as a new opener (e.g. `$3x-5$, find…` → swallows prose)
3. `fixInlineMathLines`: appending `$` at line end → `$…4.$` instead of `$…4$.`
4. `fixBrokenMappingNotation`: `/\$ where/` removing valid `$` before “where the domain is”
5. Regex character class `[\d})\\]` — **`]` must be escaped** as `[\d})\]\\]` or `]` closes the class early

When audit passes on raw JSON but UI shows raw `\le`, **debug the pipeline** step-by-step, not the JSON.

### Per-chapter workflow

```
1. Read content/chapters/<subject>/chNN-*.json → list topicIds
2. For each topicId:
   a. npm run audit:quizzes -- --topic <topicId>
   b. Fix JSON (questions, options, explanations)
   c. Harden mathMarkdown.ts if render audit fails on otherwise-correct strings
   d. Re-run audit until topic clean (questions/options zero errors)
3. Spot-check 2–3 questions per tier in localhost quiz UI
4. npm run content:qa
5. User review → commit (if asked) → npm run deploy:hosting
```

### Add Math Ch.1 status (reference)

**Chapter:** `ch01-functions.json` — 7 topics, 140 questions, 28 files.

| Topic | topicId | Status |
|-------|---------|--------|
| 1.1 Mappings | `1-1-mappings` | Questions/options audit-clean; pipeline fixes applied |
| 1.2 Definition of a Function | `1-2-definition-of-a-function` | Mostly clean; some PYP render edge cases |
| 1.3 Composite Functions | `1-3-composite-functions-harder-topic` | Pipeline wraps `gf(0)`; verify UI |
| 1.4 Modulus | `1-4-modulus-functions-harder-topic` | `∣` → `\|` in pipeline |
| 1.5 Graphs of \|f(x)\| | `1-5-graphs-of-y-f-x-where-f-x-is-linear-harder-topic` | Verify UI |
| 1.6 Inverse Functions | `1-6-inverse-functions-harder-topic` | **Needs work** — unbalanced `$`, `x≥0`, bare `f(x)=…` |
| 1.7 Graph of Inverse | `1-7-the-graph-of-a-function-and-its-inverse-harder-topic` | **Needs work** — similar to 1.6 |

Notable **math fixes** already done in Ch.1 JSON:
- 1.5 PYP Q3: intersection `(6,7)` not `(4,5)`
- 1.6 PYP Q2: `g^{-1}(6)=5`
- 1.7 Hard Q1 / PYP Q1: intersection and domain fixes

**Next chapter after Ch.1 green-light:** `ch02-simultaneous-equations-and-quadratics.json`

### Commands cheat sheet

```bash
# Audit one topic
npm run audit:quizzes -- --topic 1-6-inverse-functions-harder-topic

# Audit all Add Math
npm run audit:quizzes -- add-maths-0606

# Full pre-deploy gate (Ch.1 semantic audit + site-wide KaTeX strict + quiz validate)
npm run content:qa

# Auto-fix pass then re-validate
npm run content:qa -- --fix

# Bulk-wrap bare-math options (Class H)
node scripts/wrap-bare-quiz-options.mjs --topic <topicId>

# Ch.8 circular measure repair
node scripts/repair-ch08-quizzes.mjs

# Build + deploy hosting
npm run deploy:hosting

# Dev server
npm run dev
```

### JSON authoring rules (quizzes)

- Inline math: `$x \mapsto 3x-5$` — closing `$` **before** sentence punctuation: `$0 \le x \le 4$.` not `$0 \le x \le 4.$`
- Domain sets: `$\{-2, 2\}$` not bare `\{-2,2\}`
- Use `\le`, `\ge`, `\neq` inside `$...$`; avoid unicode `≥`, `∣` in questions/options
- Explanations may be looser but prefer proper LaTeX
- **Verify math**, not just syntax — wrong answers are worse than ugly LaTeX

### Session starter templates

**Continue Ch.1:**
> Continue Add Math Ch.1 quiz fixes. Finish topics 1.6 and 1.7 (unbalanced `$`, unicode inequalities, bare `f(x)=…`). Run audit per topic, fix JSON + pipeline as needed, then content:qa. Do not commit until I confirm UI.

**Start next chapter:**
> Start Add Math Ch.2 (`ch02-simultaneous-equations-and-quadratics.json`). Use the same workflow as Ch.1: audit each topicId, fix JSON and mathMarkdown pipeline, questions/options must pass `npm run audit:quizzes`. Show me a summary table when done.

**UI screenshot bug:**
> I see a render bug in [topic/tier/question]. Screenshot attached. Determine if it's JSON or pipeline (`fixQuizLatexText`). Fix root cause, add a regression check to `findQuizMathRenderIssues` if new variant, re-run audit.

**Deploy:**
> Ch.[N] looks good in UI. Commit with message summarizing chapter fixes, push, and deploy hosting.

### Principles

- **Minimal diffs** — don't refactor unrelated code
- **Pipeline vs content** — if `findQuizMathRenderIssues(raw)` fails but JSON looks right, fix pipeline
- **Don't silence audits** — tune severity (explanation warnings) rather than deleting checks
- **Real environment** — run commands yourself; don't ask user to run diagnostics you can run

## END

---

*Last updated from Ch.8 campaign — Class I (degree-chain pipeline trap), `repair-ch08-quizzes.mjs`, variant option fixes.*
