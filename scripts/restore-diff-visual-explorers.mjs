/**
 * Restore differentiation visual explorers (interactive panels only — no formula cheat sheets).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..', 'content', 'topics')

/** Visual-only panels — excludes power, product, quotient, chain, trig, approx, cheatsheet, etc. */
const VISUAL_PANELS = {
  'add-maths-0606/12-1-the-gradient-function.json': ['gradient'],
  'add-maths-0606/12-5-tangents-and-normals.json': ['tangent'],
  'add-maths-0606/12-6-small-increments-and-approximations.json': ['approximation'],
  'add-maths-0606/12-7-rates-of-change-harder-topic.json': ['rates'],
  'add-maths-0606/12-9-stationary-points-harder-topic.json': ['optimization'],
  'add-maths-0606/12-10-practical-maximum-and-minimum-problems.json': ['optimization'],
  'maths-0580/9-7-differentiation.json': ['gradient', 'tangent'],
}

let updated = 0
for (const [rel, panels] of Object.entries(VISUAL_PANELS)) {
  const filePath = path.join(root, rel)
  const topic = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  topic.explorerId = 'differentiation-guide'
  topic.explorerPanels = panels
  fs.writeFileSync(filePath, JSON.stringify(topic, null, 2) + '\n', 'utf8')
  updated++
  console.log('restored visual explorer:', rel, '→', panels.join(', '))
}

console.log(`Done — ${updated} differentiation topics restored.`)
