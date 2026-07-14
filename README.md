# AceIGCSE

Premium, gamified IGCSE study platform for CIE Additional Mathematics, Mathematics, and Physics.

**Live site:** [https://aceigcse.my](https://aceigcse.my)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Features

- **Landing & live demo** — marketing home and trig graph explorer (no login)
- **Subject hubs** — chapter grids with availability / progress / mastered states
- **Topic lessons** — Markdown + KaTeX notes, interactive explorers, mastery checklist
- **Quiz arena** — Easy → Medium → Hard → PYP with 70% pass gates and XP in `localStorage`

## Content

Author notes and quizzes under [`content/`](content/). See [`content/CONTENT_AUTHORING.md`](content/CONTENT_AUTHORING.md).

## Scripts

| Command        | Description          |
|----------------|----------------------|
| `npm run dev`  | Development server   |
| `npm run build`| Production build     |
| `npm run preview` | Preview production build |

## Stack

- Vite + React + TypeScript
- React Router
- KaTeX + react-markdown
- Progress: `localStorage` (`enlight-progress-v1`)

## Product docs

- [`project-bulletin.md`](project-bulletin.md) — mastery loop & vision
- [`css-design-rules.md`](css-design-rules.md) — UI specification
- [`ai-instructions.md`](ai-instructions.md) — development rules
