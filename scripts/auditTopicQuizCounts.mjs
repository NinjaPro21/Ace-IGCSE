/**
 * List every note section missing 5 questions in any difficulty tier.
 * Run: node scripts/auditTopicQuizCounts.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const subjectId = 'add-maths-0606'
const DIFFS = ['easy', 'medium', 'hard', 'pyp']
const TARGET = 5

const chaptersDir = path.join(root, 'content/chapters', subjectId)
const topicsDir = path.join(root, 'content/topics', subjectId)
const quizzesDir = path.join(root, 'content/quizzes', subjectId)

const chapters = fs
  .readdirSync(chaptersDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(chaptersDir, f), 'utf8')))
  .sort((a, b) => a.number - b.number)

function countQuestions(quizPath) {
  if (!fs.existsSync(quizPath)) return 0
  const data = JSON.parse(fs.readFileSync(quizPath, 'utf8'))
  return (data.questions ?? []).length
}

const rows = []

for (const chapter of chapters) {
  for (const topicId of chapter.topicIds) {
    const topicPath = path.join(topicsDir, `${topicId}.json`)
    if (!fs.existsSync(topicPath)) continue
    const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'))

    const counts = {}
    const missing = []
    for (const diff of DIFFS) {
      const quizId = topic.quizIds?.[diff] ?? `${topicId}-${diff}`
      const n = countQuestions(path.join(quizzesDir, `${quizId}.json`))
      counts[diff] = n
      if (n < TARGET) missing.push(`${diff}:${n}`)
    }

    const total = DIFFS.reduce((s, d) => s + counts[d], 0)
    const needsWork = DIFFS.some((d) => counts[d] < TARGET)

    rows.push({
      chapter: chapter.number,
      chapterTitle: chapter.title,
      section: topic.subtitle,
      topicId,
      title: topic.title,
      easy: counts.easy,
      medium: counts.medium,
      hard: counts.hard,
      pyp: counts.pyp,
      total,
      needsWork,
      missing,
      noQuizAtAll: total === 0,
    })
  }
}

const incomplete = rows.filter((r) => r.needsWork)
const complete = rows.filter((r) => !r.needsWork)
const noQuiz = rows.filter((r) => r.noQuizAtAll)

console.log(`# Add Maths 0606 — sections needing more questions (target ${TARGET} per tier)\n`)
console.log(`Total sections: ${rows.length}`)
console.log(`Complete (≥${TARGET} in all tiers): ${complete.length}`)
console.log(`Incomplete: ${incomplete.length}`)
console.log(`No quiz files at all: ${noQuiz.length}\n`)

console.log('## Sections missing questions (need regeneration)\n')
console.log('| Ch | Section | Title | Easy | Med | Hard | PYP | Missing |')
console.log('|----|---------|-------|------|-----|------|-----|---------|')

for (const r of incomplete) {
  const miss = r.missing.join(', ')
  console.log(
    `| ${r.chapter} | ${r.section} | ${r.title.replace(/\|/g, '/')} | ${r.easy} | ${r.medium} | ${r.hard} | ${r.pyp} | ${miss} |`,
  )
}

console.log('\n## Copy-paste list (topic labels for your doc)\n')
for (const r of incomplete) {
  console.log(`Ch ${r.chapter} ${r.section} — ${r.title} [${r.missing.join(', ')}]`)
}

if (complete.length) {
  console.log('\n## Already complete (≥5 per tier)\n')
  for (const r of complete) {
    console.log(`Ch ${r.chapter} ${r.section} — ${r.title}`)
  }
}

// Write markdown report for user
const reportPath = path.join(root, 'content', 'QUIZ_GAP_REPORT.md')
const md = [
  `# Quiz gap report — Add Maths 0606`,
  '',
  `Target: **${TARGET} questions** per section per tier (easy, medium, hard, pyp).`,
  '',
  `Generated: ${new Date().toISOString().slice(0, 10)}`,
  '',
  `- Total sections: ${rows.length}`,
  `- Complete: ${complete.length}`,
  `- Need more questions: ${incomplete.length}`,
  `- No quiz at all: ${noQuiz.length}`,
  '',
  '## Sections to regenerate',
  '',
  '| Ch | Section | Title | Easy | Med | Hard | PYP | Gap |',
  '|----|---------|-------|------|-----|------|-----|-----|',
  ...incomplete.map(
    (r) =>
      `| ${r.chapter} | ${r.section} | ${r.title.replace(/\|/g, '/')} | ${r.easy} | ${r.medium} | ${r.hard} | ${r.pyp} | ${r.missing.join(', ')} |`,
  ),
  '',
  '## Topic labels (use in doc `"topic"` field)',
  '',
  ...incomplete.map((r) => `- **Ch ${r.chapter} ${r.section}** — ${r.title}`),
  '',
]

if (complete.length) {
  md.push('## Complete sections', '')
  for (const r of complete) {
    md.push(`- Ch ${r.chapter} ${r.section} — ${r.title}`)
  }
}

fs.writeFileSync(reportPath, md.join('\n') + '\n', 'utf8')
console.log(`\nWritten: content/QUIZ_GAP_REPORT.md`)
