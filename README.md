# AceIGCSE

Interactive Cambridge IGCSE study platform for Malaysian (and other CIE) students.

**Live:** [aceigcse.my](https://aceigcse.my)  
**Repo:** [github.com/NinjaPro21/Ace-IGCSE](https://github.com/NinjaPro21/Ace-IGCSE)

Notes, visual explorers, and a mastery quiz path — with progress sync when you sign in with Google.

## Subjects

| Subject | Syllabus | Content id |
|---|---|---|
| Additional Mathematics | 0606 | `add-maths-0606` |
| Mathematics | 0580 | `maths-0580` |
| Physics | 0625 | `physics` |

## What you get

- **Mastery loop** — Notes → Easy → Medium → Hard → Past-year style (PYP), with XP and streaks
- **Topic lessons** — Markdown + KaTeX notes, interactive explorers, mastery checklist
- **Subject hubs** — Chapter grids with availability / in-progress / mastered states
- **Google sign-in** — Progress saved to the cloud (Firestore); local cache still works offline-first
- **Social** — Schools, friends, leaderboard, study rooms, duels / buddy streaks
- **Dashboard** — Progress, achievements, quiz history, account

## Quick start

```bash
npm install
cp .env.example .env.local   # fill Firebase web config
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

See [`.env.example`](.env.example) for Auth, Firestore, Analytics, and admin setup notes.

## App map

| Path | Purpose |
|---|---|
| `/` | Marketing home (public) |
| `/dashboard` | Progress hub (signed in) |
| `/subjects` | Subject list → chapters → topic lessons |
| `/quiz/topic/:topicId/:difficulty` | Quiz arena |
| `/social` | Friends, schools, activity |
| `/analytics` | Admin metrics |

## Content

Curriculum lives under [`content/`](content/) and is loaded at build time:

```
content/
  subjects/     # one JSON per subject
  chapters/     # {subjectId}/ch*.json
  topics/       # {subjectId}/{topicId}.json
  notes/        # {subjectId}/*.md
  quizzes/      # {subjectId}/*-{easy|medium|hard|pyp}.json
```

Authoring guide: [`content/CONTENT_AUTHORING.md`](content/CONTENT_AUTHORING.md).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Vite development server |
| `npm run build` | Content QA → TypeScript → production build |
| `npm run preview` | Preview the production build |
| `npm run content:qa` | Content quality gate (also runs on build / predeploy) |
| `npm run quiz:validate` | Validate quiz JSON |
| `npm run audit:content` / `audit:quizzes` | Content audits |
| `npm run deploy:hosting` | Build + deploy Firebase Hosting |
| `npm run deploy:firestore` | Deploy Firestore rules / indexes |
| `npm run deploy:firebase` | Full Firebase deploy |

Import and repair helpers (`import:0606`, `import:0580`, `quiz:repair`, …) are for content pipelines — see `package.json`.

## Stack

- Vite 8 + React 19 + TypeScript
- React Router 7
- Firebase (Auth, Firestore, Hosting; optional Analytics)
- KaTeX + react-markdown (remark-math / rehype-katex)

## Product docs

- [`project-bulletin.md`](project-bulletin.md) — product vision / mastery loop
- [`css-design-rules.md`](css-design-rules.md) — UI specification
- [`ai-instructions.md`](ai-instructions.md) — contributor / agent rules

> Note: some older docs still mention legacy internals (plain JS controllers / `enlight-*` class names). The live app is this Vite + React codebase; Firebase project id `project-enlight-notes` is infra-only and not user-facing branding.
