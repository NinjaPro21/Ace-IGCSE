/**
 * Apply curated 0580 explorer wiring to all maths-0580 topic JSON files.
 * Run: node scripts/apply-maths-0580-explorers.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { resolveMaths0580Explorer } from './maths-0580-explorers.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const topicsDir = path.join(__dirname, '..', 'content', 'topics', 'maths-0580')

let updated = 0
for (const file of fs.readdirSync(topicsDir).filter((f) => f.endsWith('.json'))) {
  const p = path.join(topicsDir, file)
  const topic = JSON.parse(fs.readFileSync(p, 'utf8'))
  const explorer = resolveMaths0580Explorer(topic.id, null, topic.title)
  const before = JSON.stringify({ explorerId: topic.explorerId, explorerPanels: topic.explorerPanels })

  if (explorer?.explorerId) {
    topic.explorerId = explorer.explorerId
    if (explorer.explorerPanels?.length) topic.explorerPanels = explorer.explorerPanels
    else delete topic.explorerPanels
  } else {
    delete topic.explorerId
    delete topic.explorerPanels
  }

  const after = JSON.stringify({ explorerId: topic.explorerId, explorerPanels: topic.explorerPanels })
  if (before !== after) {
    fs.writeFileSync(p, JSON.stringify(topic, null, 2) + '\n', 'utf8')
    updated++
    console.log(topic.id, '→', topic.explorerId ?? '(none)')
  }
}

console.log(`Updated ${updated} topics.`)
