# Physics quiz prompt (NotebookLM)

One prompt generates **all four difficulty tiers** for a single subtopic — **5 MCQs each** (20 questions total).

## What to upload

1. Cambridge IGCSE Physics **0625** syllabus (relevant section)
2. The matching note from `content/notes/physics/[topic-id].md`
3. Optional: 2–3 past-paper MCQs on the same subtopic

## Topic list

Each row is one NotebookLM run. Use the **topic-id** for JSON filenames.

| topic-id | Subtopic |
|----------|----------|
| `1-1-physical-quantities` | 1.1 Physical Quantities |
| `1-2-scalars-and-vectors` | 1.2 Scalars and Vectors |
| `2-1-speed-velocity-and-acceleration` | 2.1 Speed, Velocity and Acceleration |
| `2-2-graphs-of-motion` | 2.2 Graphs of Motion |
| `2-3-acceleration-of-free-fall` | 2.3 Acceleration of Free Fall |
| `3-1-mass-and-weight` | 3.1 Mass and Weight |
| `3-2-density` | 3.2 Density |
| `4-1-forces` | 4.1 Forces |
| `4-2-forces-and-motion` | 4.2 Forces and Motion |
| `4-3-turning-effect-of-forces` | 4.3 Turning Effect of Forces |
| `4-4-centre-of-gravity` | 4.4 Centre of Gravity |
| `5-2-momentum-impulse-and-force` | 5.2 Momentum, Impulse and Force |
| `5-3-the-principle-of-conservation-of-momentum` | 5.3 Conservation of Momentum |
| `6-1-energy` | 6.1 Energy |
| `6-2-work` | 6.2 Work |
| `6-4-power` | 6.4 Power |
| `7-1-pressure` | 7.1 Pressure |
| `7-2-pressure-in-liquids` | 7.2 Pressure in Liquids |
| `8-2-the-particle-model` | 8.2 The Particle Model |
| `8-3-gases-and-the-absolute-scale-of-temperature` | 8.3 Gases and Absolute Temperature |
| `9-1-thermal-expansion` | 9.1 Thermal Expansion |
| `9-2-specific-heat-capacity` | 9.2 Specific Heat Capacity |
| `9-3-changes-of-state` | 9.3 Changes of State |
| `10-1-transfer-of-thermal-energy` | 10.1 Transfer of Thermal Energy |
| `10-2-conduction` | 10.2 Conduction |
| `10-3-convection` | 10.3 Convection |
| `10-4-radiation` | 10.4 Radiation |
| `10-5-applications-and-consequences-of-thermal-energy` | 10.5 Thermal Applications |
| `11-1-introducing-waves` | 11.1 Introducing Waves |
| `11-2-properties-of-wave-motion` | 11.2 Wave Properties |
| `11-3-common-features-of-wave-behaviour` | 11.3 Reflection, Refraction, Diffraction |
| `12-1-reflection-of-light` | 12.1 Reflection of Light |
| `12-2-refraction-of-light` | 12.2 Refraction of Light |
| `12-4-refraction-by-thin-lenses` | 12.4 Thin Lenses |
| `12-5-ray-diagrams-for-thin-converging-lenses` | 12.5 Lens Ray Diagrams |
| `12-6-dispersion-of-light` | 12.6 Dispersion |
| `13-1-electromagnetic-spectrum` | 13.1 EM Spectrum |
| `13-2-electromagnetic-radiation` | 13.2 EM Radiation Uses/Hazards |
| `14-2-transmission-of-sound` | 14.2 Transmission of Sound |
| `14-3-echoes-and-ultrasound` | 14.3 Echoes and Ultrasound |
| `15-1-magnets-and-their-properties` | 15.1 Magnets |
| `15-2-temporary-and-permanent-magnets` | 15.2 Temporary/Permanent Magnets |
| `15-3-magnetic-field` | 15.3 Magnetic Field |
| `16-1-electric-charge` | 16.1 Electric Charge |
| `16-2-electric-field` | 16.2 Electric Field |
| `16-3-electric-current` | 16.3 Electric Current |
| `16-4-electromotive-force-and-potential-difference` | 16.4 e.m.f. and p.d. |
| `16-5-resistance` | 16.5 Resistance |
| `16-6-electrical-energy-and-electrical-power` | 16.6 Electrical Energy & Power |
| `17-1-circuit-diagrams-and-components` | 17.1 Circuit Diagrams |
| `17-2-series-circuits` | 17.2 Series Circuits |
| `17-3-parallel-circuits` | 17.3 Parallel Circuits |
| `17-4-action-and-use-of-circuit-components` | 17.4 LDRs, Thermistors, Dividers |
| `17-5-electrical-safety` | 17.5 Electrical Safety |
| `18-1-electromagnetic-induction` | 18.1 Electromagnetic Induction |
| `18-2-the-a-c-generator` | 18.2 A.c. Generator |
| `18-3-magnetic-effect-of-a-current` | 18.3 Magnetic Effect of Current |
| `18-4-force-on-a-current-carrying-conductor` | 18.4 Motor Effect |
| `18-5-the-d-c-motor` | 18.5 D.c. Motor |
| `18-6-the-transformer` | 18.6 Transformer |
| `19-1-the-atom` | 19.1 The Atom |
| `19-2-the-nucleus` | 19.2 The Nucleus |
| `19-3-nuclear-fission-and-nuclear-fusion` | 19.3 Fission & Fusion |
| `20-1-detection-of-radioactivity` | 20.1 Detection |
| `20-2-nuclear-emission` | 20.2 Alpha, Beta, Gamma |
| `20-3-radioactive-decay` | 20.3 Radioactive Decay |
| `20-4-half-life` | 20.4 Half-life |
| `20-5-safety-precautions` | 20.5 Safety |
| `21-1-the-earth` | 21.1 The Earth |
| `21-2-the-solar-system` | 21.2 Solar System |
| `22-1-the-sun-as-a-star` | 22.1 The Sun |
| `22-2-stars` | 22.2 Stars |
| `22-3-the-universe` | 22.3 The Universe |

(Full index also in `content/topics/physics/` after import.)

---

## Single prompt — copy, fill placeholders, run once

Replace `[TOPIC-ID]`, `[CHAPTER-ID]`, `[SUBTOPIC TITLE]`, `[SYLLABUS REF e.g. 2.1]`.

```
You are writing IGCSE Cambridge Physics 0625 quiz JSON for AceIGCSE.

SUBTOPIC: [SUBTOPIC TITLE] (syllabus [SYLLABUS REF])
topic-id: [TOPIC-ID]
chapter-id: [CHAPTER-ID]

Use ONLY the uploaded AceIGCSE note and 0625 sources. Match the note's depth and wording.

Output valid JSON ONLY — a single object with key "quizzes" containing exactly 4 quiz objects:

{
  "quizzes": [
    { "id": "[TOPIC-ID]-easy", "topicId": "[TOPIC-ID]", "chapterId": "[CHAPTER-ID]", "difficulty": "easy", "title": "[SUBTOPIC TITLE] — Easy", "passPercent": 70, "questionsPerAttempt": 5, "pending": false, "questions": [ /* 5 MCQs */ ] },
    { "id": "[TOPIC-ID]-medium", ... "difficulty": "medium", ... 5 MCQs },
    { "id": "[TOPIC-ID]-hard", ... "difficulty": "hard", ... 5 MCQs },
    { "id": "[TOPIC-ID]-pyp", ... "difficulty": "pyp", "title": "[SUBTOPIC TITLE] — Past paper style", ... 5 MCQs }
  ]
}

Each question:
{
  "id": "[TOPIC-ID]-easy-q1",
  "type": "mcq",
  "question": "string; use LaTeX $...$ for maths",
  "options": ["A", "B", "C", "D"],
  "correctIndex": 0,
  "explanation": "Why correct. **Common mistake:** why one wrong option fails."
}

TIER RULES (5 questions each):

EASY — definitions, units, one-step formula, "what does this graph line mean?"
MEDIUM — two-step calculations, graph read-off, unit conversion, compare two cases
HARD — multi-step problems, combined ideas from the note, trickier distractors
PYP — Cambridge Paper 1 MCQ style from uploaded past papers; include at least one graph/data question

GLOBAL RULES:
- SI units unless question states otherwise; g = 10 m/s² unless paper says 9.8
- 4 plausible options every time; correctIndex is 0-based
- No duplicate question ideas across tiers
- No markdown fences or commentary outside the JSON
```

## After NotebookLM

Split the output into four files:

- `content/quizzes/physics/[topic-id]-easy.json`
- `content/quizzes/physics/[topic-id]-medium.json`
- `content/quizzes/physics/[topic-id]-hard.json`
- `content/quizzes/physics/[topic-id]-pyp.json`

Each file is one object from the `quizzes` array (not wrapped in `quizzes`).

Validate: `node scripts/validateQuizzes.mjs`

## Example — 2.2 Graphs of Motion

```
SUBTOPIC: Graphs of Motion (syllabus 2.2)
topic-id: 2-2-graphs-of-motion
chapter-id: ch02-motion
```

Upload `content/notes/physics/2-2-graphs-of-motion.md`.
