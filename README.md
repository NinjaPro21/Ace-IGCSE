# AceIGCSE

Premium, gamified IGCSE study platform for CIE Additional Mathematics (0606), Mathematics (0580), and Physics (0625).

**Live site:** [https://aceigcse.my](https://aceigcse.my)  
**Repository:** [github.com/NinjaPro21/Ace-IGCSE](https://github.com/NinjaPro21/Ace-IGCSE)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Features

- **Landing & live demo** — marketing home and interactive explorers (no login)
- **Subject hubs** — chapter grids with availability / progress / mastered states
- **Topic lessons** — Markdown + KaTeX notes, interactive explorers, mastery checklist
- **Quiz arena** — Easy → Medium → Hard → PYP with pass gates and XP progress

## Content

Author notes and quizzes under [`content/`](content/). See [`content/CONTENT_AUTHORING.md`](content/CONTENT_AUTHORING.md).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (runs content QA first) |
| `npm run preview` | Preview production build |
| `npm run deploy:hosting` | Build and deploy Firebase Hosting |

## Stack

- Vite + React + TypeScript
- React Router
- Firebase (Auth / Firestore / Hosting)
- KaTeX + react-markdown

## Product docs

- [`project-bulletin.md`](project-bulletin.md) — mastery loop & vision
- [`css-design-rules.md`](css-design-rules.md) — UI specification
- [`ai-instructions.md`](ai-instructions.md) — development rules
