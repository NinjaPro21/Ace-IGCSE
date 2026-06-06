# Content authoring guide

Place your curriculum files under `content/` using the schema below. The app loads them at build time via `src/lib/contentLoader.ts`.

## Folder layout

```
content/
  subjects/           # One JSON per subject
  chapters/           # {subjectId}/ch*.json
  topics/             # {subjectId}/{topicId}.json
  notes/              # {subjectId}/{name}.md
  quizzes/            # {subjectId}/{topicId}-{difficulty}.json
```

## Subject file (`subjects/add-maths-0606.json`)

```json
{
  "id": "add-maths-0606",
  "name": "Additional Mathematics",
  "code": "0606",
  "syllabus": "IGCSE ADDITIONAL MATHEMATICS 0606",
  "description": "Short hub description.",
  "chapterIds": ["ch02-quadratics"]
}
```

## Chapter file

```json
{
  "id": "ch02-quadratics",
  "subjectId": "add-maths-0606",
  "number": 2,
  "title": "Quadratics",
  "badge": "CH.2 QUADRATICS",
  "summary": "Topic A · Topic B",
  "topicIds": ["discriminant"],
  "accentColor": "gold"
}
```

## Topic file

```json
{
  "id": "discriminant",
  "subjectId": "add-maths-0606",
  "chapterId": "ch02-quadratics",
  "title": "The Discriminant",
  "subtitle": "Roots and intersections",
  "notesFile": "add-maths-0606/discriminant.md",
  "explorerId": "discriminant",
  "quizIds": {
    "easy": "discriminant-easy",
    "medium": "discriminant-medium",
    "hard": "discriminant-hard",
    "pyp": "discriminant-pyp"
  }
}
```

`explorerId`: `discriminant` | `trig` | omit for notes-only.

## Notes (Markdown + LaTeX)

Use `$...$` for inline math and `$$...$$` for display math in `.md` files under `notes/`.

## Quiz file

```json
{
  "id": "discriminant-easy",
  "topicId": "discriminant",
  "difficulty": "easy",
  "title": "Discriminant — Easy",
  "passPercent": 70,
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": "The discriminant is:",
      "options": ["b² - 4ac", "b² + 4ac"],
      "correctIndex": 0,
      "explanation": "Optional feedback."
    }
  ]
}
```

## Importing legacy JSON

If your quizzes use `q`, `choices`, `answer` instead of `question`, `options`, `correctIndex`, use `src/lib/contentAdapter.ts`:

- `adaptLegacyQuiz(bundle, topicId, difficulty)`
- `adaptExternalSubject(raw)` for nested chapter/topic trees

After adapting, register new files in `contentLoader.ts` (or switch to `import.meta.glob` for auto-discovery).

## Registering new files

1. Add JSON/MD under `content/`.
2. Import in `src/lib/contentLoader.ts` and append to `subjects`, `chapters`, `topics`, `quizzes`, or `notesMap`.
3. Run `npm run dev` to verify routes.

## Mastery levels

| Level | Meaning        | Unlock              |
|-------|----------------|---------------------|
| 0     | Not started    | Open lesson         |
| 1     | Notes read     | Easy quiz           |
| 2     | Easy passed    | Medium quiz         |
| 3     | Medium passed  | Hard quiz           |
| 4     | Hard/PYP done  | Topic mastered      |

Pass threshold: default **70%** per quiz (`passPercent` in JSON).
