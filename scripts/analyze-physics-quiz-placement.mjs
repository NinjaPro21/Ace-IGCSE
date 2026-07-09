#!/usr/bin/env node
/**
 * Detect physics quiz questions that may belong in a different subtopic.
 *
 * Checks:
 *  1. Question id prefix vs hosting topicId
 *  2. High-confidence keyword rules (graph bullets in forces, TIR in waves, etc.)
 *  3. Cross-topic duplicate stems within a chapter
 *  4. Strong signals for another subtopic in the same chapter
 *
 * Usage:
 *   node scripts/analyze-physics-quiz-placement.mjs
 *   node scripts/analyze-physics-quiz-placement.mjs --json
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizDir = path.join(__dirname, '..', 'content', 'quizzes', 'physics')
const topicsDir = path.join(__dirname, '..', 'content', 'topics', 'physics')
const chapterDir = path.join(__dirname, '..', 'content', 'chapters', 'physics')

const jsonOut = process.argv.includes('--json')

const activeTopics = new Set()
const topicsByChapter = new Map()

for (const f of fs.readdirSync(chapterDir)) {
  if (!f.endsWith('.json')) continue
  const ch = JSON.parse(fs.readFileSync(path.join(chapterDir, f), 'utf8'))
  const chNum = String(ch.number ?? f.match(/ch(\d+)/)?.[1] ?? '')
  for (const t of ch.topicIds ?? []) {
    activeTopics.add(t)
    if (!topicsByChapter.has(chNum)) topicsByChapter.set(chNum, [])
    topicsByChapter.get(chNum).push(t)
  }
}

const topicTitles = new Map()
for (const t of activeTopics) {
  const meta = JSON.parse(fs.readFileSync(path.join(topicsDir, `${t}.json`), 'utf8'))
  topicTitles.set(t, meta.title ?? t)
}

/** Patterns copied/adapted from polish-physics-notes STRIP_GRAPH_HEADERS. */
const MISPLACEMENT_RULES = [
  {
    hostPattern: /^4-1-forces$/,
    wrongIfMatches: [
      /distance[- ]time graph/i,
      /velocity[- ]time graph/i,
      /gradient of the graph.*acceleration/i,
      /area under the velocity[- ]time/i,
      /interpret the graph/i,
    ],
    suggest: '2-2-graphs-of-motion',
    reason: 'Motion-graph content in Forces subtopic',
  },
  {
    hostPattern: /^5-[123]-/,
    wrongIfMatches: [/distance[- ]time graph/i, /velocity[- ]time graph/i, /gradient.*graph/i],
    suggest: '2-2-graphs-of-motion',
    reason: 'Motion-graph content in Momentum subtopic',
  },
  {
    hostPattern: /^11-[12]-/,
    wrongIfMatches: [
      /critical angle/i,
      /total internal reflection/i,
      /optical fibre/i,
      /refractive index.*sin/i,
    ],
    suggest: '12-3-total-internal-reflection',
    reason: 'Light/TIR content in general waves subtopic',
  },
  {
    hostPattern: /^12-[1-6]-/,
    wrongIfMatches: [/ripple tank/i, /water waves are reflected/i, /diffraction.*gap/i],
    suggest: '11-3-common-features-of-wave-behaviour',
    reason: 'Ripple-tank/wave behaviour content in Light subtopic',
  },
  {
    hostPattern: /^(?!18-6-the-transformer)/,
    hostChapterExclude: /^18-/,
    wrongIfMatches: [
      /step-up transformer/i,
      /step-down transformer/i,
      /turns ratio.*transformer/i,
      /primary coil.*secondary coil/i,
    ],
    suggest: '18-6-the-transformer',
    reason: 'Transformer-specific content outside transformer subtopic',
  },
  {
    hostPattern: /^(?!20-|21-|22-|19-)/,
    wrongIfMatches: [/half[- ]life/i, /radioactive decay/i],
    suggest: '20-3-radioactive-decay',
    reason: 'Radioactivity decay content in unrelated chapter',
  },
]

const STRONG_TOPIC_PHRASES = {
  '12-3-total-internal-reflection': ['critical angle', 'total internal reflection'],
  '12-5-ray-diagrams-for-thin-converging-lenses': ['ray diagram', 'converging lens', 'focal length'],
  '18-6-the-transformer': ['transformer', 'step-up', 'step-down', 'turns ratio'],
  '11-3-common-features-of-wave-behaviour': ['diffraction', 'ripple tank', 'law of reflection for water'],
  '2-2-graphs-of-motion': ['distance-time graph', 'velocity-time graph', 'gradient of the graph'],
  '20-4-half-life': ['half-life', 'half life', 'decay curve'],
}

function questionText(q) {
  return [q.question, q.explanation, ...(q.options ?? [])].filter(Boolean).join(' ')
}

function normalizeStem(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\$[^$]*\$/g, '')
    .trim()
    .slice(0, 140)
}

const flags = []

function flag(entry) {
  flags.push(entry)
}

for (const name of fs.readdirSync(quizDir)) {
  if (!name.endsWith('.json') || name.startsWith('ch')) continue
  const data = JSON.parse(fs.readFileSync(path.join(quizDir, name), 'utf8'))
  const topicId = data.topicId
  if (!activeTopics.has(topicId)) continue

  const chNum = topicId.match(/^(\d+)-/)?.[1] ?? ''
  const chapterTopics = topicsByChapter.get(chNum) ?? []

  for (const q of data.questions ?? []) {
    const text = questionText(q)

    if (!q.id?.startsWith(topicId + '-')) {
      const other = q.id?.match(/^(\d+-\d+-[a-z0-9-]+)/)?.[1]
      if (other && other !== topicId) {
        flag({
          type: 'id-mismatch',
          severity: 'high',
          file: name,
          qid: q.id,
          topicId,
          suggest: other,
          reason: `Question id prefix ${other} does not match topic ${topicId}`,
          preview: q.question?.slice(0, 100),
        })
      }
    }

    for (const rule of MISPLACEMENT_RULES) {
      if (rule.hostPattern && !rule.hostPattern.test(topicId)) continue
      if (rule.hostChapterExclude && rule.hostChapterExclude.test(topicId)) continue
      if (!rule.wrongIfMatches.some((re) => re.test(text))) continue
      if (topicId === rule.suggest || topicId.startsWith(rule.suggest)) continue
      flag({
        type: 'keyword-rule',
        severity: 'medium',
        file: name,
        qid: q.id,
        topicId,
        suggest: rule.suggest,
        reason: rule.reason,
        preview: q.question?.slice(0, 100),
      })
    }

    let bestTopic = topicId
    let bestScore = 0
    let curScore = 0
    for (const [tid, phrases] of Object.entries(STRONG_TOPIC_PHRASES)) {
      const hits = phrases.filter((p) => text.toLowerCase().includes(p)).length
      if (tid === topicId) curScore = hits
      if (hits > bestScore) {
        bestScore = hits
        bestTopic = tid
      }
    }
    if (bestTopic !== topicId && bestScore >= 2 && bestScore > curScore + 1) {
      const sameChapter = chapterTopics.includes(bestTopic)
      // optical fibres in EM comms legitimately mention TIR
      if (topicId === '13-3-electromagnetic-radiation-in-communication' && bestTopic === '12-3-total-internal-reflection') continue
      flag({
        type: 'strong-phrase',
        severity: sameChapter ? 'medium' : 'high',
        file: name,
        qid: q.id,
        topicId,
        suggest: bestTopic,
        reason: `Strong phrases match ${topicTitles.get(bestTopic) ?? bestTopic} better than current subtopic`,
        preview: q.question?.slice(0, 100),
      })
    }
  }
}

/** Stem/options/explanation pairing — import sometimes shuffles fields. */
for (const name of fs.readdirSync(quizDir)) {
  if (!name.endsWith('.json') || name.startsWith('ch')) continue
  const data = JSON.parse(fs.readFileSync(path.join(quizDir, name), 'utf8'))
  if (!activeTopics.has(data.topicId)) continue

  for (const q of data.questions ?? []) {
    const qn = (q.question ?? '').toLowerCase()
    const opts = (q.options ?? []).join(' ').toLowerCase()
    const expl = (q.explanation ?? '').toLowerCase()
    const graphOpts = /straight line|horizontal straight|hyperbola|curve that|negative gradient/.test(opts)
    const graphExpl = /graph|hyperbola|straight line through the origin|proportional/.test(expl)

    if (qn.includes('wavelength') && expl.includes('angle of incidence')) {
      flag({
        type: 'stem-mismatch',
        severity: 'high',
        file: name,
        qid: q.id,
        topicId: data.topicId,
        reason: 'Question asks about wavelength but explanation discusses reflection angle',
        preview: q.question?.slice(0, 100),
      })
    }
    if ((qn.includes('expression') || /which formula|calculate/.test(qn)) && graphOpts && graphExpl) {
      flag({
        type: 'stem-mismatch',
        severity: 'high',
        file: name,
        qid: q.id,
        topicId: data.topicId,
        reason: 'Calculation/formula question paired with graph-description options',
        preview: q.question?.slice(0, 100),
      })
    }
    if (qn.includes('constant volume') && graphOpts && expl.includes('p \\times v')) {
      flag({
        type: 'stem-mismatch',
        severity: 'high',
        file: name,
        qid: q.id,
        topicId: data.topicId,
        reason: 'Constant-volume question paired with Boyle\'s law (p–V) graph options',
        preview: q.question?.slice(0, 100),
      })
    }
  }
}

const stemIndex = new Map()
for (const name of fs.readdirSync(quizDir)) {
  if (!name.endsWith('.json') || name.startsWith('ch')) continue
  const data = JSON.parse(fs.readFileSync(path.join(quizDir, name), 'utf8'))
  if (!activeTopics.has(data.topicId)) continue
  for (const q of data.questions ?? []) {
    const stem = normalizeStem(q.question ?? '')
    if (stem.length < 35) continue
    const key = stem
    if (!stemIndex.has(key)) stemIndex.set(key, [])
    stemIndex.get(key).push({ file: name, qid: q.id, topicId: data.topicId })
  }
}

for (const [stem, entries] of stemIndex) {
  const topics = [...new Set(entries.map((e) => e.topicId))]
  if (topics.length < 2) continue
  for (const e of entries) {
    flag({
      type: 'duplicate-stem',
      severity: 'low',
      file: e.file,
      qid: e.qid,
      topicId: e.topicId,
      suggest: topics.find((t) => t !== e.topicId),
      reason: `Duplicate question stem also appears in: ${topics.filter((t) => t !== e.topicId).join(', ')}`,
      preview: stem.slice(0, 100),
    })
  }
}

const unique = []
const seen = new Set()
for (const f of flags) {
  const key = `${f.type}::${f.qid}::${f.suggest}`
  if (seen.has(key)) continue
  seen.add(key)
  unique.push(f)
}

unique.sort((a, b) => {
  const sev = { high: 0, medium: 1, low: 2 }
  return (sev[a.severity] ?? 9) - (sev[b.severity] ?? 9)
})

if (jsonOut) {
  console.log(JSON.stringify({ flagCount: unique.length, flags: unique }, null, 2))
  process.exit(unique.some((f) => f.severity === 'high') ? 1 : 0)
}

console.log(`Physics quiz placement analysis (${activeTopics.size} active topics)`)
console.log(`Flags: ${unique.length} (${unique.filter((f) => f.severity === 'high').length} high, ${unique.filter((f) => f.severity === 'medium').length} medium, ${unique.filter((f) => f.severity === 'low').length} low)\n`)

if (!unique.length) {
  console.log('No misplacement signals found.')
  process.exit(0)
}

for (const f of unique) {
  console.log(`[${f.severity}] ${f.type} — ${f.file} :: ${f.qid}`)
  console.log(`  topic: ${f.topicId}`)
  if (f.suggest) console.log(`  suggest: ${f.suggest} (${topicTitles.get(f.suggest) ?? f.suggest})`)
  console.log(`  reason: ${f.reason}`)
  console.log(`  preview: ${f.preview}`)
  console.log()
}

process.exit(unique.some((f) => f.severity === 'high') ? 1 : 0)
