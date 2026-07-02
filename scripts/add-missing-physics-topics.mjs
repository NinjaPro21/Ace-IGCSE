/**
 * Add physics subtopics not present as standalone docx headers (merged / syllabus-only).
 * Run after: node scripts/import-physics-notes.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contentRoot = path.join(__dirname, '..', 'content')
const subjectId = 'physics'

function writeJson(rel, data) {
  const p = path.join(contentRoot, rel)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

function writeMd(rel, data) {
  const p = path.join(contentRoot, rel)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, data, 'utf8')
}

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(contentRoot, rel), 'utf8'))
}

function insertTopicInChapter(chapterId, topicId, afterTopicId) {
  const ch = readJson(`chapters/${subjectId}/${chapterId}.json`)
  if (ch.topicIds.includes(topicId)) return
  const idx = afterTopicId ? ch.topicIds.indexOf(afterTopicId) : ch.topicIds.length - 1
  ch.topicIds.splice(idx + 1, 0, topicId)
  writeJson(`chapters/${subjectId}/${chapterId}.json`, ch)
}

// ── 8.1: split states-of-matter section from 8-2 ──
const particlePath = path.join(contentRoot, 'notes', subjectId, '8-2-the-particle-model.md')
if (fs.existsSync(particlePath)) {
  const raw = fs.readFileSync(particlePath, 'utf8')
  const splitAt = raw.indexOf('## Common mistakes')
  const statesBlock = raw.slice(0, splitAt).trim()
  const restBlock = raw.slice(splitAt).trim()

  const statesNote = `${statesBlock.split('## Key definitions')[0].trim()}

## Key definitions

Solid, liquid and gas differ in how particles are arranged, how they move, and the forces between them.

## States of matter

| State | Arrangement | Movement | Forces |
|-------|-------------|----------|--------|
| **Solid** | Closely packed, regular pattern | Vibrate about fixed positions | Strong — particles very close |
| **Liquid** | Random, slightly further apart | Slide past each other | Moderate — still close |
| **Gas** | Far apart, random | Move quickly in all directions | Weak — particles far apart |

## Changes of state

Melting, freezing, boiling, and condensing are changes of state. The particles do not change — only their arrangement and energy.

## Examiner tip

Particles themselves do **not** get bigger when heated — the spacing between them increases (especially in solids and liquids).

## Quick check

1. Why can liquids flow but solids cannot?
2. In which state are particles farthest apart?
3. What happens to particle motion when temperature increases?
`

  writeMd(`notes/${subjectId}/8-1-the-states-of-matter.md`, statesNote)
  writeJson(`topics/${subjectId}/8-1-the-states-of-matter.json`, {
    id: '8-1-the-states-of-matter',
    subjectId,
    chapterId: 'ch08-kinetic-particle-model-of-matter',
    title: 'The States of Matter',
    subtitle: '8.1',
    notesFile: `${subjectId}/8-1-the-states-of-matter.md`,
    quizIds: {
      easy: '8-1-the-states-of-matter-easy',
      medium: '8-1-the-states-of-matter-medium',
      hard: '8-1-the-states-of-matter-hard',
      pyp: '8-1-the-states-of-matter-pyp',
    },
  })
  insertTopicInChapter('ch08-kinetic-particle-model-of-matter', '8-1-the-states-of-matter', null)
  // prepend 8-1 before 8-2 in chapter
  const ch8 = readJson(`chapters/${subjectId}/ch08-kinetic-particle-model-of-matter.json`)
  ch8.topicIds = ['8-1-the-states-of-matter', ...ch8.topicIds.filter((id) => id !== '8-1-the-states-of-matter')]
  writeJson(`chapters/${subjectId}/ch08-kinetic-particle-model-of-matter.json`, ch8)
}

// ── 12.3: syllabus-only (not in docx body) ──
writeMd(`notes/${subjectId}/12-3-total-internal-reflection.md`, `## Core idea

When light travels from a **denser** medium to a **less dense** medium (e.g. glass to air), it bends **away** from the normal. If the angle of incidence is large enough, the refracted ray would have to bend by more than $90°$ — instead, **all** the light reflects back inside the denser medium. That is **total internal reflection (TIR)**.

## Key definitions

Critical angle ($c$): The angle of incidence in the denser medium when the angle of refraction is $90°$.

Total internal reflection: Complete reflection of light at a boundary when the angle of incidence exceeds the critical angle.

## Key formulas

$$n = \\frac{1}{\\sin c}$$

where $n$ is the refractive index of the denser medium (light going from denser → air).

## Conditions for TIR

1. Light must travel from **optically denser** to **optically less dense** medium.
2. Angle of incidence must be **greater than** the critical angle.

## Applications

- **Optical fibres**: Light undergoes repeated TIR inside a thin glass core — used for high-speed internet and medical endoscopes.
- **Prisms** in binoculars and periscopes.

## Common mistakes

- Thinking TIR can happen from air into glass (wrong direction).
- Confusing critical angle with angle of refraction.

## Examiner tip

Draw the normal at the boundary. Mark $i$ and $r$. For TIR questions, state both conditions before calculating.

## Quick check

1. What two conditions are needed for total internal reflection?
2. Why are optical fibres useful for long-distance data transmission?
3. If the critical angle is $42°$, does TIR occur at $50°$ incidence?
`)

writeJson(`topics/${subjectId}/12-3-total-internal-reflection.json`, {
  id: '12-3-total-internal-reflection',
  subjectId,
  chapterId: 'ch12-light',
  title: 'Total Internal Reflection',
  subtitle: '12.3',
  notesFile: `${subjectId}/12-3-total-internal-reflection.md`,
  quizIds: {
    easy: '12-3-total-internal-reflection-easy',
    medium: '12-3-total-internal-reflection-medium',
    hard: '12-3-total-internal-reflection-hard',
    pyp: '12-3-total-internal-reflection-pyp',
  },
})

insertTopicInChapter('ch12-light', '12-3-total-internal-reflection', '12-2-refraction-of-light')

// ── 14.4: pitch and loudness (merged into 14.1 in docx) ──
writeMd(`notes/${subjectId}/14-4-pitch-and-loudness.md`, `## Core idea

Every sound has **pitch** (how high or low it sounds) and **loudness** (how loud it sounds). These map directly to wave properties you can measure.

## Key definitions

**Pitch**: How high or low a note sounds — determined by the **frequency** of the sound wave.

**Loudness**: How loud a sound is — related to the **amplitude** of the wave (and the energy it carries).

**Frequency ($f$)**: Number of vibrations per second (Hz). Higher frequency → higher pitch.

**Amplitude ($A$)**: Maximum displacement of particles from their rest position. Larger amplitude → louder sound.

## How they link

| What you hear | Wave property | Effect |
|---------------|---------------|--------|
| High pitch (e.g. whistle) | High frequency | More vibrations per second |
| Low pitch (e.g. drum) | Low frequency | Fewer vibrations per second |
| Loud sound | Large amplitude | More energy transferred |
| Quiet sound | Small amplitude | Less energy transferred |

## Examples

- A guitar string vibrating faster → higher frequency → higher pitch.
- Turning up a speaker increases amplitude → louder sound (same pitch if frequency unchanged).
- Ultrasound ($> 20\\,000\\,\\text{Hz}$) is too high-pitched for humans to hear.

## Common mistakes

- Confusing pitch with loudness — they are independent (you can have a quiet high note).
- Thinking amplitude changes frequency (it does not).

## Examiner tip

On graphs of displacement–distance or displacement–time, **wavelength** relates to pitch and **height of the wave** relates to loudness.

## Quick check

1. Which wave property affects pitch?
2. Which wave property affects loudness?
3. Why can dogs hear a dog whistle but humans cannot?
`)

writeJson(`topics/${subjectId}/14-4-pitch-and-loudness.json`, {
  id: '14-4-pitch-and-loudness',
  subjectId,
  chapterId: 'ch14-sound',
  title: 'Pitch and Loudness',
  subtitle: '14.4',
  notesFile: `${subjectId}/14-4-pitch-and-loudness.md`,
  quizIds: {
    easy: '14-4-pitch-and-loudness-easy',
    medium: '14-4-pitch-and-loudness-medium',
    hard: '14-4-pitch-and-loudness-hard',
    pyp: '14-4-pitch-and-loudness-pyp',
  },
})

insertTopicInChapter('ch14-sound', '14-4-pitch-and-loudness', '14-3-echoes-and-ultrasound')

// Trim communication section from 13-2 if 13-3 imported separately
const emRadPath = path.join(contentRoot, 'notes', subjectId, '13-2-electromagnetic-radiation.md')
const emRad13Path = path.join(contentRoot, 'notes', subjectId, '13-3-electromagnetic-radiation-in-communication.md')
if (fs.existsSync(emRadPath) && fs.existsSync(emRad13Path)) {
  const trimmed = fs.readFileSync(emRadPath, 'utf8').split(/^Radiation in Communication$/m)[0].trim() + '\n'
  fs.writeFileSync(emRadPath, trimmed, 'utf8')
}

console.log('Added / updated: 8.1, 12.3, 14.4 and chapter topic order.')
