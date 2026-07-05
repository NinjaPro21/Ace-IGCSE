import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { SNIPPETS, TOPIC_DIAGRAMS } from './physics-diagram-snippets.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const notesDir = path.join(__dirname, '..', 'content', 'notes', 'physics')

const slugs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      '11-1-introducing-waves',
      '11-2-properties-of-wave-motion',
      '11-3-common-features-of-wave-behaviour',
      '7-2-pressure-in-liquids',
      '6-1-energy',
      '6-3-energy-resources',
      '8-3-gases-and-the-absolute-scale-of-temperature',
      '14-4-pitch-and-loudness',
    ]

function injectDiagrams(sectionBody, slug) {
  const withoutDiagrams = sectionBody
    .replace(/<div class="enlight-physics-diagram">[\s\S]*?<\/div>/g, '')
    .trim()
  const diagrams = (TOPIC_DIAGRAMS[slug] ?? []).map((k) => SNIPPETS[k]).filter(Boolean)
  const blocks = withoutDiagrams.split(/\n\n(?=\*\*[^*\n]+\*\*)/).filter(Boolean)
  if (blocks.length <= 1) {
    return [withoutDiagrams, ...diagrams].filter(Boolean).join('\n\n')
  }
  const parts = []
  for (let i = 0; i < blocks.length; i++) {
    parts.push(blocks[i])
    if (diagrams[i]) parts.push(diagrams[i])
  }
  for (let i = blocks.length; i < diagrams.length; i++) {
    parts.push(diagrams[i])
  }
  return parts.join('\n\n').trim()
}

for (const slug of slugs) {
  const file = path.join(notesDir, `${slug}.md`)
  const raw = fs.readFileSync(file, 'utf8')
  const parts = raw.split(/^## /m)
  const head = parts[0]
  const sections = parts.slice(1).map((sec) => {
    const nl = sec.indexOf('\n')
    const heading = sec.slice(0, nl).trim()
    const body = sec.slice(nl + 1)
    if (heading.toLowerCase() === 'graphs & diagrams') {
      return `## ${heading}\n\n${injectDiagrams(body, slug)}`
    }
    return `## ${sec.trimEnd()}`
  })
  fs.writeFileSync(file, [head.trimEnd(), ...sections].filter(Boolean).join('\n\n') + '\n')
  console.log('updated', slug)
}
