/**
 * Audit quiz counts for maths-0580 and add-maths-0606 (target 5 per tier).
 * Run: node scripts/audit-all-quiz-counts.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIFFS = ['easy', 'medium', 'hard', 'pyp']
const TARGET = 5

function auditSubject(subjectId) {
  const chaptersDir = path.join(root, 'content/chapters', subjectId)
  const topicsDir = path.join(root, 'content/topics', subjectId)
  const quizzesDir = path.join(root, 'content/quizzes', subjectId)

  if (!fs.existsSync(chaptersDir)) return null

  const chapters = fs
    .readdirSync(chaptersDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(chaptersDir, f), 'utf8')))
    .sort((a, b) => a.number - b.number)

  const rows = []
  for (const chapter of chapters) {
    for (const topicId of chapter.topicIds ?? []) {
      const topicPath = path.join(topicsDir, `${topicId}.json`)
      if (!fs.existsSync(topicPath)) {
        rows.push({ subjectId, chapter: chapter.number, topicId, title: '(missing topic json)', needsWork: true, missing: ['topic-json'], total: 0 })
        continue
      }
      const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'))
      const counts = {}
      const missing = []
      for (const diff of DIFFS) {
        const quizId = topic.quizIds?.[diff] ?? `${topicId}-${diff}`
        const quizPath = path.join(quizzesDir, `${quizId}.json`)
        let n = 0
        if (fs.existsSync(quizPath)) {
          const data = JSON.parse(fs.readFileSync(quizPath, 'utf8'))
          const real = (data.questions ?? []).filter(
            (q) => !q.pending && !/placeholder question/i.test(q.question ?? ''),
          )
          n = real.length
          if (data.pending && n === 0) missing.push(`${diff}:pending`)
          else if (data.pending && n > 0) missing.push(`${diff}:file-pending`)
        }
        counts[diff] = n
        if (n < TARGET) missing.push(`${diff}:${n}`)
      }
      const total = DIFFS.reduce((s, d) => s + counts[d], 0)
      rows.push({
        subjectId,
        chapter: chapter.number,
        topicId,
        title: topic.title,
        ...counts,
        total,
        needsWork: DIFFS.some((d) => counts[d] < TARGET) || missing.some((m) => m.includes('pending')),
        missing,
        stubOnly: total > 0 && DIFFS.every((d) => counts[d] < TARGET),
      })
    }
  }
  return rows
}

for (const subjectId of ['maths-0580', 'add-maths-0606']) {
  const rows = auditSubject(subjectId)
  if (!rows) continue
  const complete = rows.filter((r) => !r.needsWork)
  const incomplete = rows.filter((r) => r.needsWork)
  const noQuiz = rows.filter((r) => r.total === 0)

  console.log(`\n# ${subjectId}`)
  console.log(`Sections: ${rows.length} | Complete (≥${TARGET}/tier): ${complete.length} | Incomplete: ${incomplete.length} | No quiz: ${noQuiz.length}`)

  if (incomplete.length) {
    console.log('\nIncomplete:')
    for (const r of incomplete) {
      console.log(
        `  Ch${r.chapter} ${r.topicId} — easy=${r.easy ?? 0} med=${r.medium ?? 0} hard=${r.hard ?? 0} pyp=${r.pyp ?? 0} [${r.missing.join(', ')}]`,
      )
    }
  }
}
