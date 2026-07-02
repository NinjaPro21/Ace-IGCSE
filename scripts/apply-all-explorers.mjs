/**
 * Apply explorer wiring across all subject topic JSON files.
 * Run: node scripts/apply-all-explorers.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { resolveMaths0580Explorer } from './maths-0580-explorers.mjs'
import { resolveAddMaths0606Explorer } from './add-maths-0606-explorers.mjs'
import { resolvePhysicsExplorer } from './physics-explorers.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const topicsRoot = path.join(__dirname, '..', 'content', 'topics')

const RESOLVERS = {
  'maths-0580': (topic) => resolveMaths0580Explorer(topic.id, null, topic.title),
  'add-maths-0606': (topic) => {
    const curated = resolveAddMaths0606Explorer(topic.id)
    if (curated) return curated
    return topic.explorerId ? { explorerId: topic.explorerId, explorerPanels: topic.explorerPanels } : null
  },
  physics: (topic) => resolvePhysicsExplorer(topic.id),
}

function applyExplorer(topic, resolver) {
  const before = JSON.stringify({ explorerId: topic.explorerId, explorerPanels: topic.explorerPanels })
  const explorer = resolver(topic)

  if (explorer?.explorerId) {
    topic.explorerId = explorer.explorerId
    if (explorer.explorerPanels?.length) topic.explorerPanels = explorer.explorerPanels
    else delete topic.explorerPanels
  } else {
    delete topic.explorerId
    delete topic.explorerPanels
  }

  const after = JSON.stringify({ explorerId: topic.explorerId, explorerPanels: topic.explorerPanels })
  return before !== after
}

let totalUpdated = 0
for (const subjectId of fs.readdirSync(topicsRoot)) {
  const dir = path.join(topicsRoot, subjectId)
  if (!fs.statSync(dir).isDirectory()) continue
  const resolver = RESOLVERS[subjectId]
  if (!resolver) continue

  let updated = 0
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const p = path.join(dir, file)
    const topic = JSON.parse(fs.readFileSync(p, 'utf8'))
    if (applyExplorer(topic, resolver)) {
      fs.writeFileSync(p, JSON.stringify(topic, null, 2) + '\n', 'utf8')
      updated++
      console.log(`${subjectId}/${topic.id} → ${topic.explorerId ?? '(none)'}`)
    }
  }
  console.log(`${subjectId}: updated ${updated} topics`)
  totalUpdated += updated
}

console.log(`\nTotal updated: ${totalUpdated}`)
