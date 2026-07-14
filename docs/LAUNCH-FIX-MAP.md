# AceIGCSE — Launch fix map

When something breaks during launch or in production, use this map: **symptom → likely cause → fix command / file**.

---

## Content & notes

| Symptom | Likely cause | Fix |
|--------|--------------|-----|
| Raw `$...$` in diagram captions | Caption left inside HTML `<p class="enlight-physics-diagram__caption">` | Run `npm run fix:math -- maths-0580` (or subject). Renderer fix: `src/lib/mathMarkdown.ts` → `promoteDiagramCaptions()` |
| Jumbled sections (Quick check before diagrams, tables as plain text) | Bad docx import structure | Physics: `node scripts/fix-physics-import-structure.mjs` then `npm run fix:math -- physics` |
| Missing inline diagrams on maths topics | Snippet not wired in `TOPIC_DIAGRAMS` | Edit `scripts/maths-diagram-snippets.mjs`, then `npm run notes:polish-maths` |
| LaTeX errors in notes/quizzes | Escaping, `\text`, broken fractions | `npm run fix:math` (all) or `npm run fix:math -- physics` |
| Worked examples nested wrong / double boxes | Import put examples inside Core idea | `node scripts/split-worked-examples.mjs <subject>` |
| Subject stats show low “visual help” | Topics lack `## Graphs & diagrams` or explorer | Add diagrams via polish scripts; stats in `src/lib/platformStats.ts` |

---

## Build & validation

| Symptom | Likely cause | Fix |
|--------|--------------|-----|
| `validate:math` fails | Strict KaTeX check on content | Run `npm run fix:math`; inspect reported file:line |
| `tsc -b` fails after contentLoader change | Sync quiz API removed | Use `loadQuiz()` / async `getQuizByTopicAndDifficulty()` |
| `npm run build` OOM or slow | Large eager quiz bundle | Confirm `contentLoader.ts` uses lazy `import.meta.glob` for quizzes (no `eager: true`) |
| Firebase deploy fails | Build or rules | `npm run build` locally first; `firebase deploy --only hosting` |

---

## App runtime

| Symptom | Likely cause | Fix |
|--------|--------------|-----|
| Quiz page stuck on “Loading quiz…” | Missing quiz JSON or bad quiz id in topic meta | Check `content/topics/**/*.json` → `quizIds`; run `npm run quiz:validate` |
| “Quiz not found” immediately | Topic/chapter id mismatch in URL | Verify route params vs `content/chapters` + `content/topics` |
| Demo walkthrough quiz empty | Lazy quiz not preloaded | `DemoQuizStep.tsx` must call `loadQuiz()` on mount |
| Lesson renders but math is plain text | Remark/rehype pipeline | `MarkdownLesson.tsx`, `MathText.tsx`, `mathMarkdown.ts` |
| Explorer panel when you wanted diagrams only | Explorer still wired | Remove from `scripts/*-explorers.mjs` for that subject |

---

## QA scripts (run before deploy)

```bash
npm run audit:content          # structural note issues
npm run quiz:validate          # quiz JSON integrity
npm run validate:math          # KaTeX content pass
npm run build                  # full production build
```

Subject-specific polish:

```bash
npm run notes:polish-maths
npm run notes:polish-physics
node scripts/fix-physics-import-structure.mjs
```

---

## Launch phases checklist

1. **Content freeze** — spot-check Ch.14 physics/sound, maths probability, new diagram topics in browser.
2. **QA audit** — `npm run audit:content`; fix flagged files.
3. **Performance** — lazy quiz loading (`contentLoader.ts`); confirm bundle size in `dist/assets/`.
4. **Product polish** — empty states, auth on walkthrough, mobile sidebar.
5. **Deploy** — `npm run deploy:firebase` after green build + audit.

---

## Escalation order

1. Run the fix command from the table above.
2. Re-run `npm run audit:content` or `npm run validate:math`.
3. If UI-only: reproduce in dev (`npm run dev`), fix component/CSS.
4. If content-only: fix markdown/JSON, re-run polish + `fix:math`.
5. If still stuck: note file path + screenshot → use cloud agent (see README or team doc on agent choice).
