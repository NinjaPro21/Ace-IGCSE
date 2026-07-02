/**
 * Point chapter navigation at granular v2 section topics (N-M-slug IDs)
 * so lessons and quizzes align with the original per-section import.
 *
 * Run: node scripts/revert-to-granular-topics.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const contentRoot = path.join(root, 'content')
const subjectId = 'add-maths-0606'
const topicsDir = path.join(contentRoot, 'topics', subjectId)
const chaptersDir = path.join(contentRoot, 'chapters', subjectId)

/** Merged navigation topic → granular quiz/note source IDs (from sync-legacy-topic-quizzes.mjs). */
const LEGACY_V2_SOURCES = {
  '1-mappings-and-definition-of-a-function': ['1-1-mappings', '1-2-definition-of-a-function'],
  '1-modulus-functions-amp-graphs-of-linear': [
    '1-4-modulus-functions-harder-topic',
    '1-5-graphs-of-y-f-x-where-f-x-is-linear-harder-topic',
  ],
  '1-inverse-functions-and-their-graphs': [
    '1-6-inverse-functions-harder-topic',
    '1-7-the-graph-of-a-function-and-its-inverse-harder-topic',
  ],
  '2-simultaneous-equations-linear-and-non-linear': ['2-1-simultaneous-equations-one-linear-and-one-non-linear'],
  '2-graphs-of-quadratic': ['2-3-graphs-of-y-f-x-where-f-x-is-quadratic-harder-topic'],
  '2-roots-of-quadratic-equations-amp-intersection-': [
    '2-5-roots-of-quadratic-equations',
    '2-6-intersection-of-a-line-and-a-curve-harder-topic',
  ],
  '4-solving-equations-of-the-form-f-x-g-x': ['4-1-solving-equations-of-the-type-f-x-g-x'],
  '4-graphs-of-y-f-x-where-f-x-is-quadratic': ['2-3-graphs-of-y-f-x-where-f-x-is-quadratic-harder-topic'],
  '5-exponential-equations': ['5-4-exponential-equations-harder-topic'],
  '5-logarithmic-equations': ['5-4-exponential-equations-harder-topic'],
  '6-linear-law-converting-non-linear-to-linear-for': ['6-4-converting-from-a-non-linear-equation-to-linear-form'],
  '7-intersection-of-lines-and-circles': ['7-2-problems-involving-intersection-of-lines-and-circles'],
  '8-arc-length-and-area-of-a-sector-radians': [
    '8-1-circular-measure',
    '8-2-length-of-an-arc-harder-topic',
    '8-3-area-of-a-sector-harder-topic',
  ],
  '9-trigonometric-ratios-of-general-angles-amp-gra': [
    '9-1-basic-trigonometry-0',
    '9-2-9-3-general-angles-and-the-cast-diagram-harder-topic',
  ],
  '9-graphs-of-modulus-trigonometric-functions': ['9-4-9-5-graphs-of-trig-and-modulus-functions-harder-topi'],
  '9-trigonometric-equations-and-identities': ['9-6-9-9-reciprocals-identities-and-equations-harder-topi'],
  '10-factorial-notation-and-arrangements': ['10-1-factorial-notation', '10-2-arrangements'],
  '10-permutations-and-combinations': ['10-3-permutations-harder-topic', '10-4-combinations-harder-topic'],
  '11-pascal-s-triangle-and-the-binomial-theorem': ['11-1-pascal-s-triangle', '11-2-the-binomial-theorem-harder-topic'],
  '11-arithmetic-progressions': ['11-3-arithmetic-progressions-ap-harder-topic'],
  '11-geometric-progressions-amp-infinite-geometric': [
    '11-4-11-5-geometric-progressions-gp-and-infinite-series-h',
    '11-6-further-arithmetic-and-geometric-series',
  ],
  '12-the-gradient-function-amp-basic-differentiati': [
    '12-1-the-gradient-function',
    '12-2-the-chain-rule-harder-topic',
    '12-3-the-product-rule-harder-topic',
    '12-4-the-quotient-rule-harder-topic',
  ],
  '12-small-increments-approximations-and-rates-of-': [
    '12-6-small-increments-and-approximations',
    '12-7-rates-of-change-harder-topic',
  ],
  '12-stationary-points-and-practical-optimization': [
    '12-9-stationary-points-harder-topic',
    '12-10-practical-maximum-and-minimum-problems',
  ],
  '13-vector-notation-position-vectors-and-geometry': [
    '13-1-further-vector-notation',
    '13-2-position-vectors',
    '13-3-vector-geometry-harder-topic',
  ],
  '14-derivatives-of-exponential-logarithmic-and-tr': [
    '14-1-derivatives-of-exponential-functions',
    '14-2-derivatives-of-logarithmic-functions-harder-topic',
    '14-3-derivatives-of-trigonometric-functions-harder-topic',
  ],
  '15-indefinite-integrals-amp-basic-integration-ru': [
    '15-1-15-2-indefinite-integrals-differentiation-reversed',
    '15-3-integration-of-functions-of-the-form-ax-b',
    '15-4-15-5-integration-of-exponential-and-trig-functions',
    '15-6-integration-of',
  ],
  '15-definite-integration-amp-area-under-a-curve': [
    '15-8-15-9-definite-integration',
    '15-10-15-11-area-under-a-curve-between-regions',
  ],
  '16-applications-of-calculus-in-kinematics': [
    '16-1-applications-of-differentiation-in-kinematics',
    '16-2-applications-of-integration-in-kinematics-harder-top',
  ],
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

function sectionSortKey(topicId) {
  const m = topicId.match(/^(\d+)-(\d+)/)
  if (!m) return [999, topicId]
  return [parseInt(m[2], 10), topicId]
}

function isGranularTopicId(id) {
  return /^\d+-\d+/.test(id)
}

function guessMergedId(v2Id, mergedByChapter) {
  const m = v2Id.match(/^(\d+)-\d+-(.+)$/)
  if (!m) return null
  const [, ch, rest] = m
  const candidates = mergedByChapter.get(ch) ?? []
  const restNorm = rest.replace(/-harder-topic$/, '').replace(/-harder-topi$/, '')
  for (const merged of candidates) {
    const mergedRest = merged.replace(/^\d+-/, '')
    if (mergedRest === rest || mergedRest.startsWith(restNorm) || restNorm.startsWith(mergedRest.slice(0, 20))) {
      return merged
    }
  }
  const direct = `${ch}-${rest.replace(/-harder-topic$/, '').replace(/-harder-topi$/, '')}`
  if (candidates.includes(direct)) return direct
  return null
}

const v2ToLegacy = new Map()
for (const [legacy, sources] of Object.entries(LEGACY_V2_SOURCES)) {
  for (const v2 of sources) v2ToLegacy.set(v2, legacy)
}

const allTopics = fs
  .readdirSync(topicsDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => readJson(path.join(topicsDir, f)))

const topicById = new Map(allTopics.map((t) => [t.id, t]))
const mergedByChapter = new Map()
for (const t of allTopics) {
  if (isGranularTopicId(t.id)) continue
  const ch = t.id.match(/^(\d+)/)?.[1]
  if (!ch) continue
  if (!mergedByChapter.has(ch)) mergedByChapter.set(ch, [])
  mergedByChapter.get(ch).push(t.id)
}

const chapters = fs
  .readdirSync(chaptersDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => readJson(path.join(chaptersDir, f)))
  .filter((c) => c.subjectId === subjectId && c.number > 0)

const META_KEYS = ['explorerId', 'explorerPanels', 'lessonMeta']

for (const ch of chapters.sort((a, b) => a.number - b.number)) {
  const chNum = String(ch.number)
  const granular = allTopics
    .filter((t) => t.chapterId === ch.id && isGranularTopicId(t.id) && t.id.startsWith(`${chNum}-`))
    .sort((a, b) => {
      const [sa, ia] = sectionSortKey(a.id)
      const [sb, ib] = sectionSortKey(b.id)
      return sa - sb || ia.localeCompare(ib)
    })

  if (!granular.length) {
    console.warn(`  skip ${ch.id}: no granular topics found`)
    continue
  }

  const oldIds = ch.topicIds ?? []
  const newIds = granular.map((t) => t.id)

  ch.topicIds = newIds
  ch.summary = granular
    .map((t) => t.title)
    .join(' · ')
    .slice(0, 120)
  writeJson(path.join(chaptersDir, `${ch.id}.json`), ch)

  granular.forEach((topic, i) => {
    const mergedId =
      v2ToLegacy.get(topic.id) ??
      guessMergedId(topic.id, mergedByChapter) ??
      oldIds.find((id) => {
        const sources = LEGACY_V2_SOURCES[id]
        return sources?.includes(topic.id)
      })

    const merged = mergedId ? topicById.get(mergedId) : null
    const payload = { ...topic }
    delete payload.isChapterQuizAnchor

    if (i === granular.length - 1 && ch.hasChapterQuiz !== false) {
      payload.isChapterQuizAnchor = true
    }

    if (merged) {
      for (const key of META_KEYS) {
        if (merged[key] !== undefined) payload[key] = merged[key]
      }
    }

    if (!payload.quizIds) {
      payload.quizIds = {
        easy: `${topic.id}-easy`,
        medium: `${topic.id}-medium`,
        hard: `${topic.id}-hard`,
        pyp: `${topic.id}-pyp`,
      }
    }

    writeJson(path.join(topicsDir, `${topic.id}.json`), payload)
  })

  console.log(`Ch.${ch.number}: ${oldIds.length} merged → ${newIds.length} granular`)
  console.log(`  ${newIds.join(', ')}`)
}

console.log('\nDone. Chapter navigation now uses granular section topics.')
