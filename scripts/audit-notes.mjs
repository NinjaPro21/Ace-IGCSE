#!/usr/bin/env node
/**
 * Content QA audit — flags structural issues in markdown notes.
 * Usage: node scripts/audit-notes.mjs [subject-folder]
 * Example: node scripts/audit-notes.mjs physics
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const notesRoot = path.join(__dirname, '..', 'content', 'notes')
const subjectArg = process.argv[2]

const EXPECTED_SECTIONS = [
  'core idea',
  'graphs & diagrams',
  'steps / method',
  'worked example',
  'common mistakes',
  'examiner tip',
  'quick check',
]

function listNoteFiles(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...listNoteFiles(full))
    else if (entry.name.endsWith('.md')) out.push(full)
  }
  return out
}

function extractHeadings(text) {
  return [...text.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim().toLowerCase())
}

function auditFile(filePath) {
  const rel = path.relative(notesRoot, filePath).replace(/\\/g, '/')
  const text = fs.readFileSync(filePath, 'utf8')
  const issues = []

  const headings = extractHeadings(text)
  if (headings.length === 0) {
    issues.push('no ## sections')
    return { rel, issues }
  }

  if (!headings.includes('core idea')) {
    issues.push('missing ## Core idea')
  }

  const qcIdx = headings.indexOf('quick check')
  const gdIdx = headings.indexOf('graphs & diagrams')
  if (qcIdx >= 0 && gdIdx >= 0 && gdIdx > qcIdx) {
    issues.push('## Graphs & diagrams appears after ## Quick check')
  }

  if (/^Quick check/m.test(text) && !headings.includes('quick check')) {
    issues.push('inline "Quick check" without ## heading')
  }
  if (/^Worked example/m.test(text) && !headings.some((h) => h.startsWith('worked example'))) {
    issues.push('inline "Worked example" without ## heading')
  }

  const rawCaption = text.match(
    /<p class="enlight-physics-diagram__caption">\$[^<]+\$<\/p>/,
  )
  if (rawCaption) {
    issues.push('diagram caption may not render LaTeX (raw $ in HTML caption)')
  }

  if (/\$\$[^$]+\$\$/.test(text) && !text.includes('```')) {
    // display math in notes is fine; flag unbalanced inline
  }
  const inlineDollarPairs = (text.match(/\$/g) ?? []).length
  if (inlineDollarPairs % 2 !== 0) {
    issues.push('unbalanced $ delimiters')
  }

  if (text.includes('enlight-physics-diagram') && gdIdx < 0) {
    issues.push('inline diagram HTML but no ## Graphs & diagrams section')
  }

  const duplicateHeadings = headings.filter((h, i) => headings.indexOf(h) !== i)
  if (duplicateHeadings.length) {
    issues.push(`duplicate sections: ${[...new Set(duplicateHeadings)].join(', ')}`)
  }

  return { rel, issues }
}

const subjects = subjectArg
  ? [path.join(notesRoot, subjectArg)]
  : fs.readdirSync(notesRoot, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => path.join(notesRoot, d.name))

let totalIssues = 0
let filesWithIssues = 0

for (const subjectDir of subjects) {
  if (!fs.existsSync(subjectDir)) {
    console.error('Subject not found:', subjectDir)
    process.exit(1)
  }
  const files = listNoteFiles(subjectDir)
  for (const file of files) {
    const { rel, issues } = auditFile(file)
    if (issues.length) {
      filesWithIssues++
      totalIssues += issues.length
      console.log(`\n${rel}`)
      for (const issue of issues) console.log(`  - ${issue}`)
    }
  }
}

console.log(`\nAudit complete — ${filesWithIssues} files with ${totalIssues} issue(s).`)
process.exit(filesWithIssues > 0 ? 1 : 0)
